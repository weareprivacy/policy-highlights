if (!('weareprivacy' in window)) {
	window.weareprivacy = {};
}

if (!('POLICY_HIGHLIGHTS_CONFIG' in window)) {
    window.POLICY_HIGHLIGHTS_CONFIG = {
    	defaultConfig: true,
	};
}

if (!('policyHighlights' in window.weareprivacy)) {
	function loadBundle(config = {}) {
        import('./index').then((i) => {
            window.weareprivacy.policyHighlights = new i.default(config);
        });
	}
	
	if (window.POLICY_HIGHLIGHTS_CONFIG.defaultConfig) {
        import('./config.json').then((i) => {
            loadBundle(i.default);
        });
	} else {
		loadBundle();
	}
}