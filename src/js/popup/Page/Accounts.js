twic.Page.Accounts = function(element, accountListElement, accountTemplate) {
	twic.Page.call(this, element);

	this.accountListElement = accountListElement;
	this.accountTemplate = accountTemplate;

	this.accountBlocks = [ ];
};

twic.Page.Accounts.path = 'accounts';

twic.Page.Accounts.LOADING_CLASS = 'loading';

twic.utils.inherits(twic.Page.Accounts, twic.Page);

twic.Page.Accounts.prototype.initialize = function() {
	var
		page = this,
		// @todo initialize button somewhere else
		addButton = document.querySelector('#main-button-add-account'),
		settingsButton = document.querySelector('#main-button-settings'),
		aboutButton = document.querySelector('#main-button-about'),
		event = new twic.EventLazy();

	twic.Page.prototype.initialize.call(this);

	event.type = 'getAccounts';
	event.send(
		this.onAccounts.bind(this),
		function() {
			page.accountListElement.classList.add(twic.Page.Accounts.LOADING_CLASS);
		}
	);

	aboutButton.title = twic.i18n.translate('button_title_about');
	addButton.title = twic.i18n.translate('button_title_add_account');
	settingsButton.title = twic.i18n.translate('button_title_settings');

	addButton.addEventListener('click', function(e) {
		e.preventDefault();
		e.stopPropagation();

		addButton.classList.add(twic.Page.Accounts.LOADING_CLASS);

		page.onAccountAdd.call(page);
	} );
};

twic.Page.Accounts.prototype.onAccounts = function(data) {
	var
		accounts = this,
		accountBlock;

	this.accountListElement.classList.remove(twic.Page.Accounts.LOADING_CLASS);

	if (0 === data.length) {
		this.onAccountAdd.call(this);
	}

	data.forEach( function(data) {
		accountBlock = new twic.Block.Account(accounts.accountTemplate);
		accountBlock.setData(data);
		accounts.accountListElement.appendChild(accountBlock.render());

		accounts.accountBlocks.push(accountBlock);
	} );
};

twic.Page.Accounts.prototype.onAccountAdd = function() {
	var
		event = new twic.Event();

	event.type = 'authStart';
	event.send( function() {
		window.close();
	} );
};
