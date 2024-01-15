const express = require("express");
const bodyParser = require("body-parser");
const db = require("./Config/db");
const routes = require("./Controllers/ProductController");
var cors = require("cors");

const port = process.env.PORT | 8080;
const app = express();

app.listen(port, function () {
  console.log("Server is listening at port:" + port);
});


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());


app.use(bodyParser.json());

app.use(cors());
app.use("/", routes);
