(async () => {
    const cli = require("meow")(`
    Usage
    $ archive <url>

    Options
    See README for more information on what these values do.

    url [string]
    key [string] Key object string
    --i, -i
    --hrefs, -h
    --after, -a
    --userInput, -u Pauses crawler before crawling. Unpauses when enter is inputted into the command line. You can use this option to do things such as signing into a site.

    Examples
    $ archive https://www.youtube.com/watch?v=jNQXAC9IVRw <key> -i 1 -h -a 1588230344423
    `, {
        flags: {
            i: {type: "number", alias: "i"},
            hrefs: {type: "boolean", alias: "h"},
            after: {type: "number", alias: "a"},
            userInput: {type: "boolean", alias: "u"}
        }
    });
    
    if (cli.input[1]) key = JSON.parse(JSON.stringify(cli.input[1]));

    const permaloom = await new (await require("../src"))(!cli.flags.userInput);

    if (cli.flags.userInput) require("prompt-sync")()();

    const func = async function(options2, res) {
        permaloom.draftTx(options2, res); //Wait, will this input this from the permaloom here? or look for one in yukikaki?
    }
    data = await permaloom.scrape({url: cli.input[0], func: func, key: key, i: cli.flags.i, hrefs: cli.flags.hrefs, after: cli.flags.after});
    fee = 0;
    for (i of data) fee += i.reward;
    if (fee < maxFee) {
        for (i of data) {
            const uploader = await permaloom.arweave.transactions.getUploader(await permaloom.arweave.transactions.sign(i, options2.key));
            while (!uploader.isComplete) await uploader.uploadChunk();
        }
    }
})();