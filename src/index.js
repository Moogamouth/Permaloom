class Permaloom {

	constructor(headless) {
		return Promise.resolve()
		.then(async () => {
			this.yukikaki = await new (await require("./copy.js"))(headless);
			this.arweave = await require("arweave").init({
				host: "arweave.net",
				port: 443,
				protocol: "https"
			});
			return this;
		})
	}

	async draftTx(options2, res) {
		const transactions = (await this.arweave.api.post("/graphql", {query: `query{transactions(sort:HEIGHT_DESC,tags:{name:"page:url",values:["${options2.url}"]}){edges{node{tags{value}}}}}`})).data.data.transactions.edges[0];
		if (!options2.after || !transactions || transactions.node.tags[4].value < options2.after) {
			return await this.arweave.createTransaction({
				data: await res.buffer(),
				tags: [{"name":"Content-Type", "value":contentType}, {"name":"User-Agent","value":"Permaloom/1.0"}, {"name":"page:url","value":options2.url}, {"name":"page:title","value":await this.page.title()}, {"name":"page:timestamp","value":`${Date.now()}`}]
			}, options2.key);
		}
	}

	async scrape(options) {
		await yukikaki.scrape(options);
		return 0;
	}

};

module.exports = Permaloom;
