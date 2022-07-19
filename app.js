const express = require("express");
const app = express();
const helmet = require("helmet");
const dns = require("dns");
const net = require("net");
const cors = require("cors");
const axios = require("axios");

app.use(helmet());
app.use(cors({ origin: "*" }));

const getLocationData = async (search = "") => {
	console.log("Searching location data for: ", search);
	const apiBasicUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IP_API_KEY}&ip=`;
	const response = await axios.get(`${apiBasicUrl}${search}`);
	console.log(response.data);

	if (response.status === 200) {
		return response.data;
	} else {
		throw new Error();
	}
};

app.get("/api/", async (req, res, next) => {
	const search = req.query.search;
	if (search === "") {
		const data = await getLocationData(req.ip);
		return res.json({ data });
	}
	next();
});

app.get("/api/", async (req, res, next) => {
	const search = req.query.search;
	const isIpAddress = net.isIP(search);
	if (isIpAddress) {
		console.log(`This is an IPv${isIpAddress} address.`);
		const data = await getLocationData(search);
		return res.json({ data });
	}
	next();
});

app.get("/api/", (req, res, next) => {
	const search = req.query.search;

	// Checks whether the user specified a protocol in their search
	const hasProtocol = /^(https?:\/\/)/.test(search);
	// Then add the protocol if it was omitted (which is needed to validate the domain name using the URL() constructor).
	let urlWithProtocol = hasProtocol ? search : `https://${search}`;

	try {
		// Use the URL() constructor to find the hostname.
		const parsedSearch = new URL(urlWithProtocol);

		// Use the dns Node module to find the IP address from the hostname
		dns.resolve4(parsedSearch.hostname, async (err, addresses) => {
			// If dns threw an error, move on to the error handler (follows the documentation).
			if (err) next(err);
			try {
				// Accessing the addresses array can throw an error TypeError: Cannot read properties of undefined (reading '0'). To avoid crashing the app, we enclose the code in the try/catch statement.
				const data = await getLocationData(addresses[0]);
				res.json({ data });
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

app.use((err, req, res, next) => {
	return res.status(404).json({
		message:
			"Could not find information from the search provided. Make sure to enter a valid domain name or IP address.",
		result: null,
	});
});

module.exports = app;
