# Policy Highlights Development

## Node Usage

Policy highlights is also available through our npm package. To install, simply run:

```
$ npm install weareprivacy-policy-highlights

# install dependencies
$ npm install

# serve with hot reload at localhost:8080/dist/
$ npm run start

# build for production with minification
$ npm run build

# build for development without minification
$ npm run dev
```

## Configuration

Configuration is optional and can be included to override the default configuration settings.

### General

| key | default value | type | example | description |
| --- | --- | :---: | --- | --- |
| container | document | DOM Element | document.getElementById('text') | Container where to search for keywords |
| highlights | [] | Array | [{ highlight object }] | Array of Highlight objects |
| backgroundColor | "#ffff00" | String | "red" | Default keyword background color |
| textColor | "#000000" | String | "yellow" | Default keyword text color |

### Highlight

| key | default value | type | example | description |
| --- | --- | :---: | --- | --- |
| name | "" | String | "Contact info" | Name of highlight group |
| description | "" | String | "How to contact the website" | Description of highlight group |
| keywords | "" | String | "e-mail,@" | String of comma-delimited keywords to highlight |
| backgroundColor | "#ffff00" | String | "blue" | Keyword background color |
| textColor | "#000000" | String | "white" | Keyword text color |

### How to include your configuration

```
window.POLICY_HIGHLIGHTS_CONFIG = {
    highlights: [
        {
            name: 'Contact us',
            description: 'How to contact us',
            keywords: 'e-mail,email,@,contact,address,letter',
            backgroundColor: 'yellow',
            textColor: 'black'
        }
    ],
    backgroundColor: 'red',
    textColor: 'yellow'
}
```

## Global namespace

You can access `policyHighlights` using the global `window.weareprivacy` namespace.

`window.weareprivacy.policyHighlights`