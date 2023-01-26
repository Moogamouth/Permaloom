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

Optional. Default is true. If `options.robots` is true, crawl pages that are neutral according to robots.txt.

### .archive(options)
Scrapes data from webpages according to `options`, and archives it to arweave.

#### options.url
`String`

The URL to start crawling from.

#### options.func(options, res, page)
`Function`

`.archive()` will run `options.func` on every webpage it crawls. `.archive()` will input the following values into `options.func`:

`options.maxFee`

`options.i`

Note: `options.i` will be decremented based on how many links or sources away the page is from the starting page.

`res`
[`<HTTPResponse>`](https://pptr.dev/api/puppeteer.httpresponse)

Puppeteer response from the current page.

`page`
[`<Page>`](https://pptr.dev/api/puppeteer.page)

Puppeteer page of the current page.

#### options.maxFee
`Int`

The maximum fee to pay for the archive, in winston. The archive will cancel if the amount is exceeded.

#### options.i
`Int`

Optional. Default is 1. Determines when to stop archiving trees of links and sources. If `options.i` > 1, options.hrefs will automatically be set to true.

#### options.srcs
`Bool`

Optional. If true, scrape sources of the starting page.

#### options.hrefs
`Bool`

Optional. If true, scrape links, links of links, so on, stemming from the starting page. It will stop when options.i is depleted. Will automatically be set to true if `options.i` > 1.

#### options.after
`Int`

Optional. Default is 0. Represents a Unix timestamp in milliseconds. If `options.uploadOnGen` is not set to false, upload of transactions will be skipped if the transaction's webpage has already been archived after `options.after`, otherwise skip generation of transactions if the transaction's webpage has already been archived after `options.after`.

#### options.robots
`Bool`

Optional. Default is false. If true, only scrape pages in accordance with robots.txt.

### draftTx(options, res, page)
Generates a draft transaction.

#### options.url

#### options.key

#### res
[`<HTTPResponse>`](https://pptr.dev/api/puppeteer.httpresponse)

Contains webpage data to archive.

#### page
[`<Page>`](https://pptr.dev/api/puppeteer.page)

Contains webpage data to archive.

#### options.after

## License

Copyright (c) Moogamouth 2022

[AGPL-3.0](https://choosealicense.com/licenses/agpl-3.0/)