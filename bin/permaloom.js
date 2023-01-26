import meow from "meow";
import Permaloom from "../src/index.js";
import promptSync from "prompt-sync";
(async () => {
    const cli = meow(`
    Usage
    $ archive <url>

    Options
    See README for more information on what these values do.

    url [string]
    key [string] Key object string
    maxFee [number]
    --i, -i
    --srcs, -s
    --hrefs, -h
    --uploadOnGen, -g
    --after, -a
    --userInput, -u Pauses crawler before crawling. Unpauses when enter is inputted into the command line. You can use this option to do things such as signing into a site.
    --robots, -r
    --robotsNeutral, -R

    Examples
    $ archive https://www.youtube.com/watch?v=jNQXAC9IVRw <key> 1000000 -i 1 -h -a 1588230344423 -u
    `, {
        importMeta: import.meta,
        flags: {
            i: {type: "number"},
            srcs: {type: "boolean", alias: "s"},
            hrefs: {type: "boolean", alias: "h"},
            uploadOnGen: {type: "boolean", alias: "g"},
            after: {type: "number", alias: "a"},
            userInput: {type: "boolean", alias: "u"},
            robots: {type: "boolean", alias: "r"},
            robotsNeutral: {type: "boolean", alias: "R"}
        }
    });
    
    if (cli.input[1]) var key = JSON.parse(JSON.stringify(cli.input[1]));

    const permaloom = await new Permaloom("arweave.net", 443, "https", {headless: !cli.flags.userInput, robotsNeutral: cli.flags.robotsNeutral});

    if (cli.flags.userInput) promptSync()();

    await permaloom.archive({url: cli.input[0], func2: async function(vals, i, maxFee, res, page, options) {return {archive: true, srcs: true, hrefs: true}}, key: key, maxFee: cli.input[2], i: cli.flags.i, hrefs: cli.flags.hrefs, srcs: cli.flags.srcs, uploadOnGen: cli.flags.uploadOnGen, after: cli.flags.after, robots: cli.flags.robots})
})();