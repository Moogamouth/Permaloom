const fs = require('fs');
const exec = require('util').promisify(require('child_process').exec);

const config = JSON.parse(fs.readFileSync('config.json'));
const key = JSON.parse(fs.readFileSync('key.json'));

const arweave = require('arweave').init({
	host: config.host,
	port: config.port,
	protocol: 'https'
});

async function action(action, username, password, addr) {
	await exec(`curl -v -d 'action=${action}' -k -u ${username}:${password} --anyauth --location ${addr}engine/job/Permaloom`);
}

(async () => {
	const warcDir = `${__dirname.substring(0, __dirname.lastIndexOf("/"))}/jobs/Permaloom/latest/warcs`;
	
	for (let warc of fs.readdirSync(warcDir)) {
		fs.unlink(warc);
	}

	await exec(`$HERITRIX_HOME/bin/heritrix -a ${config.username}:${config.password}`);
	
	try {
		exec(`curl -v -d "createpath=Permaloom&action=create" -k -u ${config.username}:${config.password} --anyauth --location \ ${config.addr}engine`);
	}
	catch {}

	await exec(`curl -v -T crawler-beans.cxml -k -u ${config.username}:${config.password} --anyauth --location ${config.addr}engine/job/Permaloom/jobdir/crawler-beans.cxml`);
	
	const actions = ['teardown', 'build', 'launch', 'unpause'];
	for (i of actions) {
		await action(i, config.username, config.password, config.addr);
	}

	console.log('Job started');

	while (true) {
		await new Promise(r => setTimeout(r, 1000));
		if ((await exec(`curl -v -k -u ${config.username}:${config.password} --anyauth --location -H \"Accept: application/xml\" ${config.addr}engine/job/Permaloom`)).stdout.split("<crawlControllerState>")[1].split("</crawlControllerState>")[0] === 'FINISHED') {
			let txs = [];
			let fee = 0;
			for (let warc of fs.readdirSync(`${__dirname.substring(0, __dirname.lastIndexOf("/"))}/jobs/Permaloom/latest/warcs`)) {
				const tx = await arweave.createTransaction({data: fs.readFileSync(warcDir + warc)}, key);
				txs += tx;
				fee += tx.reward;
			}
			if (tx.reward < config.maxFee) {
				for (let tx of txs) {
					const uploader = await arweave.transactions.getUploader(await arweave.transactions.sign(tx, key));
					while (!uploader.isComplete) await uploader.uploadChunk();
				}
			}
			else throw new Error('Fee exceeded limit');
			break;
		}
	}
	console.log('WARC archived');
})();