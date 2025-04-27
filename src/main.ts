import { createReadStream } from "fs";
import { parse } from "path";

type Region = "us" | "ny" | "la" | "sg" | "se" | "br" | "jh" | "syd";
type ResponseType = "arraybuffer" | "blob" | "document" | "json" | "text" | "stream";

// Helper function to convert Headers to Record<string, string>
function headersToRecord(headers: Headers): Record<string, string> {
	const result: Record<string, string> = {};
	headers.forEach((value, key) => {
		result[key] = value;
	});
	return result;
}

interface FetchResponse<T = any> {
	data: T;
	status: number;
	statusText: string;
	headers: Record<string, string>;
	config: any;
}

type FetchPromise<T = any> = Promise<FetchResponse<T>>;

export default class BunnyCDNStorage {
	private readonly baseURL: string;
	private readonly headers: Record<string, string>;
	private readonly storageZoneName: string;

	constructor(apiKey: string, storageZoneName: string, region?: Region) {
		const baseHost: string = region
			? `https://${region}.storage.bunnycdn.com`
			: "https://storage.bunnycdn.com";
		this.baseURL = `${baseHost}/${storageZoneName}/`;
		this.headers = {
			AccessKey: apiKey,
			"Content-Type": "application/octet-stream",
		};
		this.storageZoneName = storageZoneName;
	}

	async list(path?: string): Promise<FetchResponse<any>> {
		const url = new URL(path || "", this.baseURL);

		try {
			const response = await fetch(url.toString(), {
				method: "GET",
				headers: this.headers,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();

			return {
				data,
				status: response.status,
				statusText: response.statusText,
				headers: headersToRecord(response.headers),
				config: { url: url.toString(), method: "GET" },
			};
		} catch (error) {
			throw error;
		}
	}

	async delete(path?: string): Promise<FetchResponse<any>> {
		const url = new URL(path || "", this.baseURL);

		try {
			const response = await fetch(url.toString(), {
				method: "DELETE",
				headers: this.headers,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.text();

			return {
				data,
				status: response.status,
				statusText: response.statusText,
				headers: headersToRecord(response.headers),
				config: { url: url.toString(), method: "DELETE" },
			};
		} catch (error) {
			throw error;
		}
	}

	async upload(fileOrPath: Buffer | string, remotePath?: string): Promise<FetchResponse<any>> {
		let file: Buffer;

		if (!Buffer.isBuffer(fileOrPath)) {
			if (typeof remotePath === "undefined") {
				remotePath = parse(fileOrPath).base;
			}

			const chunks: Buffer[] = [];
			const stream = createReadStream(fileOrPath);

			await new Promise<void>((resolve, reject) => {
				stream.on("data", chunk => {
					if (Buffer.isBuffer(chunk)) {
						chunks.push(chunk);
					} else {
						chunks.push(Buffer.from(chunk as unknown as Uint8Array));
					}
				});
				stream.on("error", err => reject(err));
				stream.on("end", () => resolve());
			});

			file = Buffer.concat(chunks);
		} else {
			file = fileOrPath;
		}

		const url = new URL(remotePath || "", this.baseURL);

		try {
			const response = await fetch(url.toString(), {
				method: "PUT",
				headers: this.headers,
				body: file,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.text();

			return {
				data,
				status: response.status,
				statusText: response.statusText,
				headers: headersToRecord(response.headers),
				config: { url: url.toString(), method: "PUT" },
			};
		} catch (error) {
			throw error;
		}
	}

	async download(filePath: string, responseType?: ResponseType): Promise<FetchResponse<any>> {
		const url = new URL(filePath, this.baseURL);

		try {
			const response = await fetch(url.toString(), {
				method: "GET",
				headers: this.headers,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			let data;

			switch (responseType) {
				case "arraybuffer":
					data = await response.arrayBuffer();
					break;
				case "blob":
					data = await response.blob();
					break;
				case "json":
					data = await response.json();
					break;
				case "text":
					data = await response.text();
					break;
				case "stream":
					data = response.body;
					break;
				default:
					data = await response.text();
			}

			return {
				data,
				status: response.status,
				statusText: response.statusText,
				headers: headersToRecord(response.headers),
				config: { url: url.toString(), method: "GET", responseType },
			};
		} catch (error) {
			throw error;
		}
	}
}
