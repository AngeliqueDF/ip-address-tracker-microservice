const express = require("express");
const app = express();
const helmet = require("helmet");
const dns = require("dns");
const net = require("net");
const cors = require("cors");

app.use(helmet());
app.use(cors());

app.get("/api/", async (req, res, next) => {
	const search = req.query.search;
	const isIpAddress = net.isIP(search);
	if (isIpAddress) {
		console.log(`This is an IPv${isIpAddress} address.`);
		return res.status(400).json({
			message: `You have searched an IPv${isIpAddress} address.`,
			result: null,
		});
	}
	next();
});

module.exports = app;
