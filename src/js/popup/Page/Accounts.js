twic.Page.Accounts = function(element, accountListElement, accountTemplate) {
	twic.Page.call(this, element);

	this.accountListElement = accountListElement;
	this.accountTemplate = accountTemplate;
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
};

twic.Page.Accounts.prototype.onAccounts = function(data) {
	console.log(data);
};
