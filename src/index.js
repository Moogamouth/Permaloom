import Yukikaki from "yukikaki";
import Arweave from "arweave";
export default class Permaloom {

	constructor(host, port, protocol, options) {
		return Promise.resolve()
		.then(async () => {
			options.userAgent = "Permaloom/0.2.3";
			this.yukikaki = await new Yukikaki(options);
			this.arweave = await Arweave.init({
				host: host,
				port: port,
				protocol: protocol
			});
			return this;
		})
	}

	async draftTx(options, res, page) {
		let transactions = null;
		while (!transactions) transactions = (await this.arweave.api.post("/graphql", {query: `query{transactions(sort:HEIGHT_DESC,tags:{name:"page:url",values:["${options.url}"]}){edges{node{tags{value}}}}}`})).data.data;
		if (transactions.transactions?.edges[0]?.node?.tags[4]?.value && transactions.transactions?.edges[0]?.node?.tags[4]?.value < options.after) {
			let contentType = res.headers()["content-type"];
			if (contentType.includes(";")) contentType = contentType.split(";")[0];

			const cookies = this.arweave.createTransaction({
				data: JSON.stringify(await page.cookies()),
				tags: [{"name":"Content-Type","value":"application/json"}, {"name":"Cookies","value":"true"}, {"name":"User-Agent","value":"Permaloom/0.2.3"}]
			}, options.key);
			arr = [
				cookies,
				this.arweave.createTransaction({
					data: await res.buffer(),
					tags: [{"name":"Content-Type", "value":contentType}, {"name":"User-Agent","value":"Permaloom/0.2.3"}, {"name":"page:url","value":options.url}, {"name":"page:title","value":await page.title()}, {"name":"page:timestamp","value":`${Date.now()}`}, {"name":"page:cookiesId","value":cookies.id}]
				}, options.key)
			];
			fee += arr[0].reward + arr[1].reward;
			if (fee < options.maxFee) {
				let uploader = await this.arweave.transactions.getUploader(await this.arweave.transactions.sign(arr[0], options.key));
				while (!uploader.isComplete) await uploader.uploadChunk();
				uploader = await this.arweave.transactions.getUploader(await this.arweave.transactions.sign(arr[1], options.key));
				while (!uploader.isComplete) await uploader.uploadChunk();
			}
		}
	}

	async archive(options) {
		let options2 = options;

		options2.after = options2.after ?? 0;

		options2.func = async function(options, res, page) {
			let vals = await options.func2(options.i, options.maxFee, res, page);
			
			if (vals.archive) await permaloom.draftTx(options, res, page);

			console.log(vals.hrefs);
			options2.srcs = vals.srcs;
			options2.hrefs = vals.hrefs;
		}

		let fee = 0;
		console.log(options2);
		await this.yukikaki.scrape(options2);
	}

};