const net = require("net");

export class IPAddressValidator {
	private isIpAddress: boolean = false;

	constructor(search: string) {
		this.isIpAddress = net.isIP(search);
	}

	getIsIpAddress(): boolean {
		return this.isIpAddress;
	}
}
