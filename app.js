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

app.get("/api/", async (req, res, next) => {
	const search = req.query.search;

	// Checks whether the user specified a protocol in their search
	const hasProtocol = /^(https?:\/\/)/.test(search);
	// Then add the protocol if it was omitted (which is needed to validate the domain name using the URL() constructor).
	let urlWithProtocol = hasProtocol ? search : `https://${search}`;

	try {
		// Use the URL() constructor to find the hostname.
		const parsedSearch = new URL(urlWithProtocol);

		// Use the dns Node module to find the IP address from the hostname
		dns.resolve4(parsedSearch.hostname, (err, addresses) => {
			// If dns threw an error, move on to the error handler (follows the documentation).
			if (err) next(err);
			try {
				// Accessing the addresses array can throw an error TypeError: Cannot read properties of undefined (reading '0'). To avoid crashing the app, we enclose the code in the try/catch statement.
				return res.json({
					message: "Found an IP address",
					result: addresses[0],
				});
			} catch (error) {
				// If there was a problem accessing addresses, throw an error.
				console.log(error);
				next(error);
			}
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
});

module.exports = app;
