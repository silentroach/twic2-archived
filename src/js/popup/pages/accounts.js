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
		msg = new twic.MessageLazy();

	twic.Page.prototype.initialize.call(this);

	msg.type = 'getAccounts';
	msg.send(
		this.onAccounts.bind(this),
		function() {
			page.accountListElement.classList.add(twic.Page.Accounts.LOADING_CLASS);
		}
	);
};

twic.Page.Accounts.prototype.onAccounts = function(data) {
	var
		accounts = this,
		accountBlock;

	this.accountListElement.classList.remove(twic.Page.Accounts.LOADING_CLASS);

	if (0 === data.length) {
		this.emit('accountAdd');
	}

	data.forEach( function(data) {
		accountBlock = new twic.Block.Account(accounts.accountTemplate);
		accountBlock.setData(data);
		accounts.accountListElement.appendChild(accountBlock.render());

		accounts.accountBlocks.push(accountBlock);
	} );
};
