const path = require("path");

const http = require("http");
const app = require("./app");
const server = http.createServer(app);
require("dotenv").config();

server.listen(process.env.PORT || 5000, () => {
	console.log(`Server running on port ${5000}`);
});
