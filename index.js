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
	return await exec(`curl -v -d 'action=${action}' -k -u ${username}:${password} --anyauth --location ${addr}engine/job/Permaloom`);
}

(async () => {
	const warcPath = `${
		__dirname
		.substring(0, __dirname.lastIndexOf("/"))
	}/jobs/Permaloom/latest/warcs`;

	if (fs.existsSync(warcPath)) fs.rmSync(warcPath);

	await exec(`$HERITRIX_HOME/bin/heritrix -a ${config.username}:${config.password}`);
	
	await exec(`curl -v -d "createpath=Permaloom&action=create" -k -u ${config.username}:${config.password} --anyauth --location \ ${config.addr}engine`);

	await exec(`curl -v -T crawler-beans.cxml -k -u ${config.username}:${config.password} --anyauth --location ${config.addr}engine/job/Permaloom/jobdir/crawler-beans.cxml`);
	
	const actions = ['teardown', 'build', 'launch', 'unpause'];
	for (i of actions) {
		if (i == 'build') {
			output = 
			(await action('build', config.username, config.password, config.addr))
			.stdout
			.split("<jobLogTail>")[1]
			.split("</jobLogTail>")[0]
			if (output.includes('SEVERE')) throw new Error(`Heritrix Error: \n${output.replace('<value>', '').replace('</value>', '')}`)
			//replace isn't working here for some reason
		}
		else await action(i, config.username, config.password, config.addr);
	}

	console.log('Job started');

	while (true) {
		crawlStatus = 
		(await exec(`curl -v -k -u ${config.username}:${config.password} --anyauth --location -H \"Accept: application/xml\" ${config.addr}engine/job/Permaloom`))
		.stdout
		?.split("<crawlControllerState>")[1]
		?.split("</crawlControllerState>")[0]
		if (crawlStatus === 'FINISHED') {
			let txs = [];
			let fee = 0;
			for (let warc of fs.readdirSync(warcPath)) {
				if (fee < config.maxFee) {
					const tx = await arweave.createTransaction({data: fs.readFileSync(warcPath + warc)}, key);
					txs.push(tx);
					fee += tx.reward;
				}
				fs.unlink(warc);
			}
			if (fee > config.maxFee) throw new Error('Fee exceeded limit');
			for (let tx of txs) {
				const uploader = await arweave.transactions.getUploader(await arweave.transactions.sign(tx, key));
				while (!uploader.isComplete) await uploader.uploadChunk();
			}
			break;
		}
	}
	console.log('WARC archived');
})();