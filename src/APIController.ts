const axios = require("axios");
import { GeoLocationData } from "./types";

export class APIController {
	async getLocationData(search: string): Promise<GeoLocationData> {
		let apiResponse;
		let data: GeoLocationData;
		try {
			apiResponse = await axios.get(
				`${process.env.IP_GEOLOCATION_API_URL}${search}`
			);
		} catch (error) {
			console.log("Error with the external API\n" + error);
		}

		const { ip, isp, city, district, zipcode, time_zone } = apiResponse.data;
		data = { ip, isp, city, district, zipcode, time_zone };

		console.log(data);

		return data;
	}
}
