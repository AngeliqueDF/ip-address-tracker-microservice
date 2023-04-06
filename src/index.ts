const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
require("dotenv").config();

const helmet = require("helmet");
const cors = require("cors");

app.use(helmet());
app.use(cors({ origin: "*" }));

server.listen(process.env.PORT || 5000, () => {
	console.log(`Server running on port ${5000}`);
});
