( function() {

	var
		router = new twic.Router();

	document.body.classList.add(twic.browser.platform);

	window.addEventListener('click', function(e) {
		if (e.target
			&& 'A' === e.target.nodeName
		) {
			e.preventDefault();
			e.stopPropagation();

			if ('chrome-extension:' === e.target.protocol) {
				router.handleUrl(e.target.href);
			} else {
				chrome.tabs.create( {
					url: e.target.href
				} );

				window.close();
			}
		}
	}, true);

	router.registerPage(
		new twic.Page.Accounts(
			document.getElementById('page-accounts'),
			document.getElementById('page-accounts-list'),
			document.getElementById('template-account')
		)
	);

	router.handleUrl('#accounts');

}() );
