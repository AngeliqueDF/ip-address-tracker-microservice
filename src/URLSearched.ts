const dns = require("dns");

export class URLSearched {
	private search: string;
	private parsedSearch: URL;

	constructor(search: string) {
		this.search = this.addProtocol(search) ? search : `https://${search}`;
		this.parsedSearch = new URL(this.search);
	}

	addProtocol(search: string): boolean {
		return /^(https?:\/\/)/.test(search);
	}

	/**
	 * Pre-condition: search term must be a valid url indicating the protocol.
	 * @returns The IP address matching the domain name.
	 */
	getIpAddress(): Promise<string> {
		return new Promise<string>((resolve) => {
			// const parsedSearch = new URL(this.search);

			dns.resolve(
				this.parsedSearch.hostname,
				async (err: NodeJS.ErrnoException | null, addresses: string[]) => {
					if (err) {
						console.trace(err);
						throw new Error(err.message);
					}
					if (addresses) {
						resolve(addresses[0]);
					}
				}
			);
		});
	}
}
