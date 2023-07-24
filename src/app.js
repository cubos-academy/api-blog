const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const http = require("http");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

const server = http.createServer(app);

module.exports = server;
