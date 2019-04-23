if (!('weareprivacy' in window)) {
	window.weareprivacy = {};
}

if (!('policyHighlights' in window.weareprivacy)) {
	import('./index').then((i) => {
		window.weareprivacy.policyHighlights = new i.default({});
	});
}