const url = new URL(document.currentScript.src);
__webpack_public_path__ = url.href.substring(0, url.href.lastIndexOf('/') + 1);

require('./loader');
