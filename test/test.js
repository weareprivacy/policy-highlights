var assert = require('assert');
var jsdom = require('jsdom');
var { JSDOM } = jsdom;

var dom = new JSDOM(`
    <h1>Policy highlights demo</h1>
    <p>Ideal for a <b>privacy policy</b>, <b>cookie policy</b>, <b>disclosure policy</b>, <b>disclaimer policy</b>, and <b>terms of service</b>.</p>
    <p>Automatically highlight only the keywords you specify to attract more attention to an important section and allow the reader to quickly understand your policies.</p>
    <p>Thanks for caring about your privacy.</p>
    <p>See our other privacy tools on <a href="https://weareprivacy.com" target="_blank">https://weareprivacy.com</a></p>
    
    <script type="text/javascript">
    // Optional configuration if you want to define your own, otherwise the default config.json will be used
    
    window.POLICY_HIGHLIGHTS_CONFIG = {
        highlights: [
            {
                name: "Privacy section",
                description: "This section has privacy information you should read.",
                keywords: "privacy,important,privacy",
                actions: "automatically"
            },
            {
                name: "Important section",
                description: "This section has important information about a serious topic.",
                keywords: "privacy,cookie,disclosure,disclaimer,terms,important",
                actions: "caring,quickly"
            }
        ]
    }
    </script>
`);

global.window = dom.window;
global.document = dom.window.document;

var policyHighlights = require('../dist/index.js');

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});
