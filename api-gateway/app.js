const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = 3007;

const {
  COMMANDS_API_URL,
  PRODUCTS_API_URL,
  PAYMENTS_API_URL,
  AUTHENTICATION_API_URL,
} = require("./URLs");

const optionsProducts = {
  target: PRODUCTS_API_URL,
  changeOrigin: true,
  logger: console,
};

const optionsCommands = {
  target: COMMANDS_API_URL,
  changeOrigin: true,
  logger: console,
};
const optionsPayments = {
  target: PAYMENTS_API_URL,
  changeOrigin: true,
  logger: console,
};

const optionsAuthentication = {
  target: AUTHENTICATION_API_URL,
  changeOrigin: true,
  logger: console,
};

const productsProxy = createProxyMiddleware(optionsProducts);
const commandsProxy = createProxyMiddleware(optionsCommands);
const paymentsProxy = createProxyMiddleware(optionsPayments);
const AuthenticationProxy = createProxyMiddleware(optionsAuthentication);

app.get("/", (req, res) => res.send("Api Gateway is Here :)"));
app.all("/Commands", commandsProxy);
app.all("/Products", productsProxy);
app.all("/Payments", paymentsProxy);
app.get("/Products/:id", productsProxy);
app.post("/login",AuthenticationProxy);
app.post("/signup",AuthenticationProxy)
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
