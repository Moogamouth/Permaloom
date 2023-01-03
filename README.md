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

You can start Permaloom in headful mode using the `headless` parameter like so:
```js
(async () => {
    const permaloom = new require("permaloom")("arweave.net", 443, "https", false);
})();
```

Or using `import`:
```js
(async () => {
    import permaloom from "permaloom";
    const permaloom = new permaloom("arweave.net", 443, "https", false);
})();
```

### .archive(options)
Scrapes data from webpages according to `options`, and archives it to arweave.

#### options.url
`String`

The URL to start crawling from.

#### options.func(options, res, page)
`Function`

`.archive()` will run `options.func` on every webpage it crawls. `.archive()` will input the following values into `options.func`:

`options`

You can change this value's properties inside of `options.func`, except for `options.func` and `options.url`.

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

#### options.hrefs
`Bool`

Optional. If true, scrape links, links of links, so on, stemming from the starting page. It will stop when options.i is depleted. Will automatically be set to true if `options.i` > 1.

#### options.srcs
`Bool`

Optional. If true, scrape sources of the starting page.

#### options.after
`Int`

Optional. Represents a Unix timestamp in milliseconds. If `options.onUpload` is not set to false, skip upload of transactions if their webpage has already been archived after the specified timestamp.

#### options.onUpload
`Bool`

Optional. If set to false, `.archive()` will not skip uploads according to `options.after`.

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
