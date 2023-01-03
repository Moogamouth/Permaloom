import Yukikaki from "yukikaki";
import Arweave from "arweave";
export default class Permaloom {

	constructor(host, port, protocol, options) {
		return Promise.resolve()
		.then(async () => {
			options.userAgent = "Permaloom/0.2.0";
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
		if (onUpload == false) while (!transactions) transactions = (await this.arweave.api.post("/graphql", {query: `query{transactions(sort:HEIGHT_DESC,tags:{name:"page:url",values:["${options.url}"]}){edges{node{tags{value}}}}}`})).data.data;
		if (onUpload != false || transactions.transactions?.edges[0]?.node?.tags[4]?.value && transactions.transactions?.edges[0]?.node?.tags[4]?.value < options.after) {
			let contentType = res.headers()["content-type"];
			if (contentType.includes(";")) contentType = contentType.split(";")[0];

			const cookies = this.arweave.createTransaction({
				data: JSON.stringify(await page.cookies()),
				tags: [{"name":"Content-Type","value":"application/json"}, {"name":"Cookies","value":"true"}, {"name":"User-Agent","value":"Permaloom/1.0"}]
			}, options.key);
			return await [
				cookies,
				this.arweave.createTransaction({
					data: await res.buffer(),
					tags: [{"name":"Content-Type", "value":contentType}, {"name":"User-Agent","value":"Permaloom/0.2.0"}, {"name":"page:url","value":options.url}, {"name":"page:title","value":await page.title()}, {"name":"page:timestamp","value":`${Date.now()}`}, {"name":"page:cookiesId","value":cookies.id}]
				}, options.key)
			];
		}
	}

	async archive(options) {
		const data = await this.yukikaki.scrape(options);
		let fee = 0;
		if (!after || options.onUpload) var data2 = data;
		else {
			data2 = [];
			for (i of data) {
				while (!transactions) transactions = (await this.arweave.api.post("/graphql", {query: `query{transactions(sort:HEIGHT_DESC,tags:{name:"page:url",values:["${i.tags[2].value}"]}){edges{node{tags{value}}}}}`})).data.data;
				if (transactions.transactions?.edges[0]?.node?.tags[4]?.value && transactions.transactions?.edges[0]?.node?.tags[4]?.value < options.after) data2.push(i);
			}
		}
		for (let i of data2) fee += i.reward;
		if (fee < options.maxFee) {
			for (i of data2) {
				const uploader = await this.arweave.transactions.getUploader(await this.arweave.transactions.sign(i, options.key));
				while (!uploader.isComplete) await uploader.uploadChunk();
			}
		}
	}

};