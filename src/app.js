const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const socket = require('./services/socket');

const http = require('http');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

const server = http.createServer(app);

app.request.io = socket(server);

module.exports = server;
