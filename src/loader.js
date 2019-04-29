if (!('weareprivacy' in window)) {
	window.weareprivacy = {};
}

if (!('policyHighlights' in window.weareprivacy)) {
    import('./config.json').then((c) => {
        import('./index').then((i) => {
            window.weareprivacy.policyHighlights = new i.default({
                ...c.default,
                ...window['POLICY_HIGHLIGHTS_CONFIG']
            });
        });
    });
}