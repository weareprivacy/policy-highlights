# Policy Highlights

## Build

```
# install dependencies
npm install

# serve with hot reload at localhost:8080/dist/
npm run start

# build for production with minification
npm run build

# build for development without minification
npm run dev
```

## Example

See `dist/index.html`

## Global namespace

You can access `policyHighlights` using the global `window.weareprivacy` namespace.

`window.weareprivacy.policyHighlights`

## Optional configuration

```
window.POLICY_HIGHLIGHTS_CONFIG = {
    highlights: [
        {
            name: 'Contact us',
            description: 'How to contact us',
            keywords: ['e-mail', 'email', '@', 'contact', 'address', 'letter'],
            backgroundColor: 'yellow',
            textColor: 'black'
        }
    ]
}
```