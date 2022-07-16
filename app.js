const express = require("express");
const app = express();
const helmet = require("helmet");
const dns = require("dns");
const cors = require("cors");

app.use(helmet());
app.use(cors());

module.exports = app;
