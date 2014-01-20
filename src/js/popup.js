( function() {

	var
		mainToolbar = document.getElementById('main-toolbar'),
		addButton = mainToolbar.querySelector('#main-button-add-account'),
		settingsButton = mainToolbar.querySelector('#main-button-settings'),
		aboutButton = mainToolbar.querySelector('#main-button-about'),
		// ---
		router = new twic.Router(),
		page;

	twic.browser.getPlatform()
		.then( function(platform) {
			document.body.classList.add(platform);
		} );

	aboutButton.title = twic.i18n.translate('button_title_about');
	addButton.title = twic.i18n.translate('button_title_add_account');
	settingsButton.title = twic.i18n.translate('button_title_settings');

	function addAccount() {
		var
			event = new twic.Event();

		addButton.classList.add('loading');

		event.type = 'authStart';
		event.send( function() {
			window.close();
		} );
	}

	addButton.addEventListener('click', function(e) {
		e.preventDefault();
		e.stopPropagation();

		addAccount();
	} );

	settingsButton.addEventListener('click', function(e) {
		e.preventDefault();
		e.stopPropagation();

		chrome.tabs.create( {
			url: 'options.html'
		} );
	} );

	/**
	 * Pages
	 */

	// accounts
	page = new twic.Page.Accounts(
		document.getElementById('page-accounts'),
		document.getElementById('page-accounts-list'),
		document.getElementById('template-account')
	);

	page.on('accountAdd', function() {
		addAccount();
	} );

	router.registerPage(page);

	/**
	 * Init
	 */

	router.handleUrl('#accounts');

}() );
