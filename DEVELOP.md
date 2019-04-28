# Policy Highlights Development

## Node Usage

Policy highlights is also available through our npm package. To install, simply run:

```
$ npm install @weareprivacy/policy-highlights

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

See [Config.json](https://github.com/weareprivacy/weareprivacy-policy-highlights/blob/master/src/config.json) for the default configuration.

### General

| key | default value | type | example | description |
| --- | --- | :---: | --- | --- |
| container | document | DOM Element | document.getElementById('text') | Container where to search for keywords |
| highlights | [] | Array | [{ highlight object }] | Array of Highlight objects |
| keywordBackgroundColor | "#ffff00" | String | "yellow" | Default keyword background color |
| keywordTextColor | "#000000" | String | "red" | Default keyword text color |
| actionBackgroundColor | "#eff7ff" | String | "blue" | Default action background color |
| actionTextColor | "#0366d6" | String | "white" | Default action text color |

### Highlight

| key | default value | type | example | description |
| --- | --- | :---: | --- | --- |
| name | "" | String | "Contact info" | Name of highlight group |
| description | "" | String | "How to contact the website" | Description of highlight group |
| keywords | "" | String | "e-mail,@" | String of comma-delimited primary keywords to highlight |
| actions | "" | String | "send,reach out,mail,e-mail us,email us" | String of comma-delimited secondary actions to highlight |

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
    keywordBackgroundColor: 'yellow',
    keywordTextColor: 'red',
    actionBackgroundColor: 'blue',
    actionTextColor: 'white'
}
```

## Global namespace

You can access `policyHighlights` using the global `window.weareprivacy` namespace.

`window.weareprivacy.policyHighlights`