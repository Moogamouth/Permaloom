# Permaloom
Node.js package that archives webpages to Arweave.

## Installation
Using [npm](https://www.npmjs.com/):

```bash
npm install permaloom
```

## Usage

For a better understanding, read the Yukikaki [documentation](https://github.com/Moogamouth/Yukikaki#readme).

You can import Permaloom using `require`:
```js
(async () => {
    const permaloom = new require("permaloom")("arweave.net", 443, "https");
})();
```

Or with `import`:
```js
(async () => {
    import Permaloom from "permaloom";
    await const permaloom = new Permaloom("arweave.net", 443, "https");
})();
```

You need to provide values for host, port and protocol.

### Other class parameters

#### options.headless
`Bool`

Optional. Default is true. If false, starts crawling in headful mode.

#### options.robotsNeutral
`Bool`

Optional. Default is true. Determines whether to crawl pages that are neutral according to robots.txt.

### .archive(options)
Scrapes data from webpages according to `options`, and archives it to arweave.

#### options.url
`String`

The URL to start crawling from.

#### options.maxFee
`Int`

The maximum fee to pay for the archive, in winston. The archive will cancel if the amount is exceeded.

#### options.i
`Int`

Optional. Default is 1. Determines when to stop archiving trees of links and sources. If `options.i` > 1, options.hrefs will automatically be set to true.

#### options.hrefs
`Bool`

Optional. If true, scrape links, links of links, so on, stemming from the starting page. It will stop when options.i is depleted. Will automatically be set to true if `options.i` > 1.

#### options.srcs
`Bool`

Optional. If true, scrape sources of the starting page.

#### options.after
`Int`

Optional. Default is 0. Represents a Unix timestamp in milliseconds. If `options.onUpload` is not set to false, skip upload of transactions if the transaction's webpage has already been archived after `options.after`, otherwise skip generation of transactions.

#### options.onUpload
`Bool`

If `options.onUpload` is not set to false, skip upload of transactions if the transaction's webpage has already been archived after `options.after`, otherwise skip generation of transactions.

#### options.robots
`Bool`

Optional. If true, only scrape pages in accordance with robots.txt.

### draftTx(options, res, page)
Generates a draft transaction.

#### options.url
`String`

The URL to start crawling from.

#### options.key
`Object`

Arweave key object to use for generating transactions.

#### res
[`<HTTPResponse>`](https://pptr.dev/api/puppeteer.httpresponse)

#### page
[`<Page>`](https://pptr.dev/api/puppeteer.page)

#### options.after
`Int`

Optional. Represents a Unix timestamp in milliseconds. If `options.onUpload` is set to false, skip generation of webpage archive transaction if webpage has already been archived after the specified timestamp.

## License

Copyright (c) Moogamouth 2022

[AGPL-3.0](https://choosealicense.com/licenses/agpl-3.0/)
