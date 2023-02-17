# Permaloom
Heritrix wrapper that archives webpages to Arweave

## Installation
Install [Heritrix](https://github.com/internetarchive/heritrix3).

Install [cURL](https://curl.se/).

Download the latest [release](https://github.com/Moogamouth/Permaloom/releases) of Permaloom, and insert it into the Heritrix directory.

Insert an Arweave key file entitled "`key.json`" into the Permaloom directory.

## Usage

To run Permaloom, simply run the Permaloom executable file. You will have to provide `metadata.operatorContactUrl` and seed values in the `crawler-beans.cxml` file.

You can edit the `crawler-beans.cxml` and `config.json` files to change the crawl settings.

The `crawler-beans.cxml` file will overwrite the one being used by Heritrix when Permaloom is executed. For more information on the `crawler-beans.cxml` file, go to [https://heritrix.readthedocs.io/en/latest/configuring-jobs.html](https://heritrix.readthedocs.io/en/latest/configuring-jobs.html).

`config.json`

Here is the default `config.json` file: 
```json
{
    "host": "arweave.net",
    "port": 443,
    "addr": "https://localhost:8443/",
    "username": "admin",
    "password": "admin",
    "maxFee": 100000000000000000
}
```

It contains all the values required in the `config.json` file.

`host`

`String`

The hostname of the Arweave gateway to use.

`port`

`Int`

The port of the Arweave gateway to use.

`maxFee`

`Int`

The maximum fee for the crawl, in Winston.

## License

Copyright (c) Moogamouth 2022

[AGPL-3.0](https://choosealicense.com/licenses/agpl-3.0/)