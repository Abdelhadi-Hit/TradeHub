const express = require("express");
require("express-async-errors");
const amqp = require("amqplib");
const nodemailer = require("nodemailer");



//setup!

const transporter = nodemailer.createTransport({
  host: 'domaine.com',
  port: 2525,
  auth: {
    user: '-----',
    pass: '*****'
  },
});

const emailContent = `
  <h1>Thank you for your order!</h1>
  <p>Your order has been received and is being processed.</p>
  <img src="" />
`;



const sendEmail = async (email) => {
  const mailOptions = {
    from: 'Macomerce_mail', // Sender's email address
    to: email, // Recipient's email address
    subject: 'Order Confirmation',
    html: emailContent,
    
  };

  //
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

let channel;
async function connect() {
  const amqpServer = process.env.RABBITMQ_URL;
  const connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("ORDER");
}
connect().then(() => {
  channel.consume("ORDER", (data) => {
    const { email } = JSON.parse(data.content);
    console.log("Consuming ORDER service   " + email);
    

    channel.ack(data);
    //sendEmail(email);
  });
});

const app = express();

app.use(express.json());

const port = process.env.PORT ?? 8084;

app.listen(port, () => {
  console.log(`Email Service at ${port}`);
});
