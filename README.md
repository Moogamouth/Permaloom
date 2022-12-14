# Permaloom
Node.js API that scrapes and crawls webpages.

## Installation
Using [npm](https://www.npmjs.com/):

```bash
npm install permaloom
```

## Note
This API is heavily based on the Yukikaki API.

## Examples

```js
(async () => {
    const permaloom = await new (await require("permaloom"))(false);
    await yukikaki.scrape({url: "https://www.youtube.com/watch?v=jNQXAC9IVRw", key: <key>, i: 1, hrefs: true, after: 1588230344423});
})();
```

## API

### class Yukikaki(headless)

#### headless
Optional. Specifies whether to run the scraper in headless mode.

#### .scrape([options])
Crawls webpage according to options.url.

##### options.url
`String`
The URL to archive.

##### options.func(res, options)
`Function`
The function to run on scraper data. These parameters will be passed into options.func:

###### res
[`<HTTPResponse>`](https://github.com/user/repo/blob/branch/other_file.md)
The data that has been scraped from the current page.

###### options
The options object passed into .scrape().

#### options.key
`Object`
Arweave key object of an Arweave wallet.

##### options.i
`Int`
Optional. Default is 1. Determines when to stop archiving links and sources. If i > 1, options.hrefs will automatically be set to true.

##### options.hrefs
`Bool`
Optional. If true, archive links, links of links, and links of links of links, so on. It will stop when options.i is depleted. Will automatically be set to true if i > 1.

##### options.after
`Int`
Optional. A Unix date. Only archive pages that have not been archived after this date.
