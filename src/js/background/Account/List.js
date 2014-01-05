twic.AccountList = function() {
	this.accounts = { };
};

twic.AccountList.prototype.add = function(account) {
	var
		accountId = account.getId();

	this.accounts[accountId] = account;
};
