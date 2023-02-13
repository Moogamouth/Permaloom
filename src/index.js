import Yukikaki from "yukikaki";
import Arweave from "arweave";
//import {exec} from child_process;
export default class Permaloom {

	constructor(host, port, protocol, headless) {
		return Promise.resolve()
		.then(async () => {
			this.yukikaki = await new Yukikaki(headless);
			this.arweave = await Arweave.init({
				host: host,
				port: port,
				protocol: protocol
			});
			return this;
		})
	}

	async draftPage(uploadOnGen, url, after, this2, key, ytdl, fee, maxFee, data, res, page) {
		let transactions = null;
		let archive = false;
		while (!transactions) transactions = (await this2.arweave.api.post("/graphql", {query: `query{transactions(sort:HEIGHT_DESC,tags:{name:"page:url",values:["${url}"]}){edges{node{tags{value}}}}}`})).data.data;
		if (!transactions.transactions?.edges[0]?.node?.tags[4]?.value || transactions.transactions?.edges[0]?.node?.tags[4]?.value < after) {
			if (uploadOnGen) archive = true;
			else {
				let repeat = false;
				data = data ?? [];
				for (let i = 0; i < data.length; i+=2) if (data[i].tags[2].value === url) repeat = true;
				if (!repeat) archive = true;
			}
			if (archive) {
				let contentType = res.headers()["content-type"];
				if (contentType && contentType.includes(";")) contentType = contentType.split(";")[0];

				const cookies = this2.arweave.createTransaction({
					data: JSON.stringify(await page.cookies()),
					tags: [{"name":"Content-Type","value":"application/json"}, {"name":"Cookies","value":"true"}, {"name":"User-Agent","value":"Permaloom/0.2.4"}]
				}, key);
				let arr = [
					cookies,
					this2.arweave.createTransaction({
						data: await res.buffer(),
						tags: [{"name":"Content-Type", "value":contentType}, {"name":"User-Agent","value":"Permaloom/0.2.4"}, {"name":"page:url","value":url}, {"name":"page:title","value":await page.title()}, {"name":"page:timestamp","value":`${Date.now()}`}, {"name":"page:cookiesId","value":cookies.id}]
					}, key)
				];

				if (ytdl && contentType === "text/html") {
					const tags = (await page.evaluate(() =>  document.documentElement.outerHTML)).split("<video");
					let ytdlTx;
					if (tags.length > 1) for (let i = 1; i < tags.length; i++) if (tags[i].split("</video>")[0].split("src=\"")[1].split("\"")[0].search("blob:") === 0) ytdlTx = true;
					if (ytdlTx) console.log(await exec(`yt-dlp ${url}`));
					if (ytdlTx) arr.push(this2.arweave.createTransaction({
						data: await exec(`yt-dlp ${url}`),
						tags: [{"name":"Content-Type", "value":"text/html"}, {"name":"User-Agent","value":"Permaloom/0.2.4"}, {"name":"page:url","value":videoUrl}, {"name":"page:title","value":await page.title()}, {"name":"page:timestamp","value":`${Date.now()}`}, {"name":"page:cookiesId","value":cookies.id}]
					}, key));
				}

				if (!uploadOnGen) {
					fee += arr[0].reward + arr[1].reward;
					if (fee > maxFee) throw new Error("Fee limit exceeded");
					else return arr;
				}
				if (uploadOnGen && arr[0].reward + arr[0].reward < maxFee) this2.upload(arr, this2, options.key);
			}
		}
	}

	async upload(data, this2, key) {
		for (let i of data) {
			const uploader = await this2.arweave.transactions.getUploader(await this2.arweave.transactions.sign(i, key));
			while (!uploader.isComplete) await uploader.uploadChunk();
		}
	}

	async archive(options) {
		options.this = this;
		options.after = options.after ?? 0;
		options.userAgent = "Permaloom/0.2.4";

		options.func2 = options.func;
		options.func = async function(options, res, page) {
			const vals = await options.func2(options.i, options.maxFee, res, page);
			
			options.ytdl = vals.ytdl ?? options.ytdl;

			if (vals.archive != false) return await options.this.draftPage(options.uploadOnGen, options.url, options.after, options.this, options.key, options.ytdl, options.fee, options.maxFee, options.data, res, page);

			options.srcs = vals.srcs ?? options.hrefs;
			options.hrefs = vals.hrefs ?? options.hrefs;
		}

		await this.yukikaki.scrape(options);

		if (!options.uploadOnGen) this.upload(options.data, this, options.key);
	}

};