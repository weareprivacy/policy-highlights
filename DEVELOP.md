# Policy Highlights Development

## Node Usage

Policy highlights is also available through our npm package. To install, simply run:

```
$ npm install @weareprivacy/policy-highlights

# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ npm run start

# build for production with minification
$ npm run build

# build for development without minification
$ npm run dev
```

## Configuration

Configuration is optional and can be included to override the default configuration settings.

See [Config.json](https://github.com/weareprivacy/policy-highlights/blob/master/src/config.json) for the default configuration.

### General

| key | default value | type | example | description |
| --- | --- | :---: | --- | --- |
| container | document | DOM Element | document.getElementById('text') | Container where to search for keywords |
| highlights | [] | Array | [{ highlight object }] | Array of Highlight objects |
| backgroundColor | {} | Object | { backgroundColor object } | Background color object |
| textColor | {} | Object | { textColor object } | Text color object |
| autoHighlight | true | Boolean | false | Automatically highlight keywords and actions on script initialization |

### Highlight

| key | default value | type | example | description |
| --- | --- | :---: | --- | --- |
| name | "" | String | "Contact info" | Name of highlight group |
| description | "" | String | "How to contact the website" | Description of highlight group |
| keywords | "" | String | "e-mail,@" | String of comma-delimited primary keywords to highlight |
| actions | "" | String | "send,reach out,mail,e-mail us,email us" | String of comma-delimited secondary actions to highlight |

### BackgroundColor

| key | default value | type | example | description |
| --- | --- | :---: | --- | --- |
| keyword | "#ffff00" | String | "yellow" | Keyword background color |
| action | "#fcf1cd" | String | "blue" | Action background color |

### TextColor

| key | default value | type | example | description |
| --- | --- | :---: | --- | --- |
| keyword | "#000000" | String | "red" | Keyword text color |
| action | "#000000" | String | "white" | Action text color |

### How to include your configuration

```
window.POLICY_HIGHLIGHTS_CONFIG = {
    highlights: [
        {
            name: 'Contact us',
            description: 'How to contact us',
            keywords: 'e-mail,email,@,contact,address,letter',
            actions: 'send,reach out,mail,e-mail us,email us'
        }
    ],
    backgroundColor: {
        keyword: 'yellow',
        action: 'blue'
    },
    textColor: {
        keyword: 'red',
        action: 'white'
    }
}
```

## Global namespace

You can access `policyHighlights` using the global `window.weareprivacy` namespace.

`window.weareprivacy.policyHighlights`