const dns = require("dns");

export class URLSearched {
	private search: string;

	constructor(search: string) {
		this.search = this.addProtocol(search) ? search : `https://${search}`;
	}

	addProtocol(search: string): boolean {
		return /^(https?:\/\/)/.test(search);
	}

	getIpAddress(): Promise<string> {
		return new Promise<string>((resolve) => {
			const parsedSearch = new URL(this.search);

			dns.resolve(
				parsedSearch.hostname,
				async (err: NodeJS.ErrnoException | null, addresses: string[]) => {
					if (err) throw new Error(err.message);
					if (addresses) {
						resolve(addresses[0]);
					}
				}
			);
		});
	}
}
