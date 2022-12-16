import yukikaki from "yukikaki";
import arweave from "arweave";
export class Permaloom {

	constructor(headless, host, port, protocol) {
		return Promise.resolve()
		.then(async () => {
			this.yukikaki = await new (yukikaki)(headless);
			this.arweave = await arweave.init({
				host: host,
				port: port,
				protocol: protocol
			});
			return this;
		})
	}

	async draftTx(options, res, page) {
		//Stop transactions from being undefined
		const transactions = (await this.arweave.api.post("/graphql", {query: `query{transactions(sort:HEIGHT_DESC,tags:{name:"page:url",values:["${options.url}"]}){edges{node{tags{value}}}}}`})).data.data.transactions.edges[0];
		console.log(transactions);
		if (!options.after || !transactions || transactions.node.tags[4].value < options.after) {
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
					tags: [{"name":"Content-Type", "value":contentType}, {"name":"User-Agent","value":"Permaloom/1.0"}, {"name":"page:url","value":options.url}, {"name":"page:title","value":await page.title()}, {"name":"page:timestamp","value":`${Date.now()}`}, {"name":"page:cookiesId","value":cookies.id}]
				}, options.key)
			];
		}
	}

	async scrape(options) {return await this.yukikaki.scrape(options);}

};
