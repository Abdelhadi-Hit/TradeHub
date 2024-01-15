const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var cors = require("cors");

const app = express();
const port = 8089;
const secretKey = "votre_clé_secrète";

mongoose.connect("mongodb://localhost:27017/authdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected successfully");})

const User = mongoose.model("User", {
  username: String,
  password: String,
});

app.use(bodyParser.json());
app.use(cors())


app.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ username: user.username }, secretKey);
      res.json({ token });
    } else {
      res.status(401).json({ error: "Mot de passe incorrect" });
    }
  } else {
    res.status(401).json({ error: "Utilisateur non trouvé" });
  }
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists in the database
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).json({ error: "Username already exists" });
  }

  // Hash the user's password before saving it to the database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = new User({
    username,
    password: hashedPassword,
  });

  try {
    const savedUser = await newUser.save();
    // You can also generate a token and send it back for immediate login
    const token = jwt.sign({ username: savedUser.username }, secretKey);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error creating the user" });
  }
});


app.listen(port, () => {
  console.log(`Serveur d'authentification écoutant sur le port ${port}`);
});
