<p align="center">
  <img width="300px" src="./static/readme.png">
</p>

<h1 align="center">Policy Highlights</h1>

<p align="center">Automatically highlight keywords on your privacy policy, cookie policy, disclosure policy, disclaimer policy, and terms of service so the user can quickly find and understand important sections.</p>

<p align="center">
  <a aria-label="npm package" href="https://www.npmjs.com/package/@primer/css">
    <img alt="" src="https://img.shields.io/npm/v/@primer/css.svg">
  </a>
  <a aria-label="contributors graph" href="https://github.com/primer/css/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/primer/css.svg">
  </a>
  <a aria-label="last commit" href="https://github.com/primer/css/commits/master">
    <img alt="" src="https://img.shields.io/github/last-commit/primer/css.svg">
  </a>
  <a aria-label="join us in spectrum" href="https://spectrum.chat/primer">
    <img alt="" src="https://withspectrum.github.io/badge/badge.svg">
  </a>
  <a aria-label="license" href="https://github.com/primer/css/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/primer/css.svg" alt="">
  </a>
</p>

## Usage

### General Usage

Include the script in your website privacy policy right before the `</body>` tag.

```
<script type="text/javascript" src="https://weareprivacy.com/TODO"></script>
```

### CDN Usage

Policy highlights can be served from a CDN such as [JSDelivr](https://www.jsdelivr.com/package/npm/simple-icons) or [Unpkg](https://unpkg.com). Simply use the `simple-icons` npm package and specify a version in the URL like the following:

```html
<script src="https://cdn.jsdelivr.net/gh/weareprivacy/weareprivacy-policy-highlights@master/dist/bundle.js" type="text/javascript"></script>
<img height="32" width="32" src="https://unpkg.com/simple-icons@latest/icons/[ICON NAME].svg" />
```

## Example

See `dist/index.html`

## Development
See [DEVELOP.md](./DEVELOP.md) for development docs.

## License

[MIT](./LICENSE.txt) &copy; [GitHub](https://github.com/)