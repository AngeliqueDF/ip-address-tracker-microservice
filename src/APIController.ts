const axios = require("axios");
import { GeoLocationData } from "./types";
import { formatOffset } from "./utils";

export class APIController {
	async getLocationData(search: string): Promise<GeoLocationData> {
		let apiResponse;
		let data: GeoLocationData;

		apiResponse = await axios.get(
			`${process.env.IP_GEOLOCATION_API_URL}${search}`
		);

		const { ip, isp, city, district, zipcode, time_zone, latitude, longitude } =
			apiResponse.data;

		data = {
			ip,
			isp,
			city,
			district,
			zipcode,
			time_zone: { offset: formatOffset(time_zone.offset) },
			latitude,
			longitude,
		};

		return data;
	}
}
