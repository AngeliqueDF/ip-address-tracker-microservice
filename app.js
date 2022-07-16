const express = require("express");
const app = express();
const helmet = require("helmet");
const dns = require("dns");

app.use(helmet());

module.exports = app;
