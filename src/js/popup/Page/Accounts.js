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
		event = new twic.EventLazy();

	twic.Page.prototype.initialize.call(this);

	event.type = 'getAccounts';
	event.send(this.onAccounts.bind(this), function() {
		page.accountListElement.classList.add(twic.Page.Accounts.LOADING_CLASS);
	} );

	this.container.querySelector('#account-add').addEventListener('click', this.onAccountAdd.bind(this));
};

twic.Page.Accounts.prototype.onAccounts = function(data) {
	var
		accounts = this,
		accountBlock;

	this.accountListElement.classList.remove(twic.Page.Accounts.LOADING_CLASS);

	data.forEach( function(data) {
		accountBlock = new twic.Block.Account(accounts.accountTemplate);
		accountBlock.setData(data);
		accounts.accountListElement.appendChild(accountBlock.render());

		accounts.accountBlocks.push(accountBlock);
	} );
};

twic.Page.Accounts.prototype.onAccountAdd = function(e) {
	var
		event = new twic.Event();

	e.preventDefault();
	e.stopPropagation();

	event.type = 'authStart';
	event.send();
};
