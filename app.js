const express = require("express");
const app = express();
const helmet = require("helmet");
const dns = require("dns");

app.use(helmet());

app.get(
	"/api/",
	async (req, res) => {
		const search = req.query.search;

		/**
		 * The URL constructor requires the protocol to work. We add it if it was omitted by the user.
		 */
		// Checks whether the user specified a protocol in their search
		const hasProtocol = /^(https?:\/\/)/.test(search);
		// Add the protocol if it was omitted
		let urlWithProtocol = hasProtocol ? search : `https://${search}`;

		try {
			// This will throw an error if the domain is invalid. In that case, the client will receive the error from the catch statement.
			const isValidDomain = new URL(urlWithProtocol);

			// Using the dns Node module, we can then get the IP address of the domain
			dns.resolve4(search, (err, addresses) => {
				if (err) throw err;
				// Send a response with the IP address found
				res.json({ ip: addresses[0] });
			});
		} catch (error) {
			console.log(error);
			return res.status(404).json({
				error: "Could not find an IP address. Make sure the domain is valid.",
			});
		}
	}
);

module.exports = app;
