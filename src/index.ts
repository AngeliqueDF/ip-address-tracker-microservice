const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
require("dotenv").config();

import { IPAddressValidator } from "./IPAddressValidator";
import { APIController } from "./APIController";
import { URLSearched } from "./URLSearched";

const helmet = require("helmet");
const cors = require("cors");

app.use(helmet());
app.use(cors({ origin: "*" }));

/**
 * Middleware for IP addresses.
 */
app.get("/api/", async (req: any, res: any, next: any) => {
	const search = req.query.search;
	const ipValidator = new IPAddressValidator(search);

	if (ipValidator.getIsIpAddress()) {
		console.log(`This is an IPv${ipValidator.getIsIpAddress()} address.`);
		const apiCaller = new APIController();

		try {
			const data = await apiCaller.getLocationData(search);
			return res.status(200).json(data);
		} catch (error) {
			console.trace(error);
			next(error);
		}
	}
	next();
});

/**
 *  Middleware for domain names.
 */
app.get("/api/", async (req: any, res: any, next: any) => {
	const search = req.query.search;

	const apiCaller = new APIController();

	try {
		const urlSearched = new URLSearched(search);
		const ipAddress = await urlSearched.getIpAddress();
		const data = await apiCaller.getLocationData(ipAddress);
		return res.status(200).json(data);
	} catch (error) {
		console.trace(error);
		next(error);
	}
});

server.listen(process.env.PORT || 5000, () => {
	console.log(`Server running on port ${5000}`);
});
