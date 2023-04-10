const http = require("http");
import express from "express";
const app = express();
const server = http.createServer(app);
require("dotenv").config();

import { IPAddressValidator } from "./IPAddressValidator";
import { APIController } from "./APIController";
import { URLSearched } from "./URLSearched";

const helmet = require("helmet");
const cors = require("cors");

app.use(helmet());
app.use(cors());


/**
 * Middleware for IP addresses.
 */
app.get("/api/", async (req, res, next) => {
	const search = req.query.search;
	const ipValidator = new IPAddressValidator("" + search);

	if (ipValidator.getIsIpAddress()) {
		console.log(`This is an IPv${ipValidator.getIsIpAddress()} address.`);
		const apiCaller = new APIController();

		try {
			const data = await apiCaller.getLocationData("" + search);
			return res.status(200).json(data);
		} catch (error) {
			console.trace(error);
			next(error);
		}
	}
	next();
	return;
});

/**
 *  Middleware for domain names.
 */
app.get("/api/", async (req, res, next) => {
	const search = req.query.search;

	const apiCaller = new APIController();
	let data;

	try {
		const urlSearched = new URLSearched("" + search);
		const ipAddress = await urlSearched.getIpAddress();
		data = await apiCaller.getLocationData(ipAddress);
	} catch (error) {
		console.trace(error);
		next(error);
	}
	return res.status(200).json(data);
});

app.get("/api/", async (req: any, res: any, err: any) => {
	console.log(req.body, req.param, req.query);
	console.log(err);

	return res.status(500).json({ message: err.message });
});

server.listen(process.env.PORT || 5000, () => {
	console.log(`Server running on port ${5000}`);
});
