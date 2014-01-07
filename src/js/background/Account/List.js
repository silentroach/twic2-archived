twic.AccountList = function(storage) {
	this.accounts = { };
	this.length = 0;

	this.storage = storage;
};

twic.AccountList.KEY = 'accounts';

twic.AccountList.prototype.add = function(account) {
	this.accounts[account.userId] = account;
	++this.length;
};

twic.AccountList.prototype.save = function(callback) {
	var
		obj = { },
		data = { };

	for (i in this.accounts) {
		data[i] = this.accounts[i].serialize();
	}

	obj[twic.AccountList.KEY] = data;

	this.storage.set(obj, callback);
};

twic.AccountList.prototype.load = function(callback) {
	var
		list = this,
		account, item, i;

	list.storage.get(twic.AccountList.KEY, function(items) {
		if (undefined === items[twic.AccountList.KEY]) {
			callback();
			return;
		}

		item = items[twic.AccountList.KEY];

		for (i in item) {
			account = new twic.Account();
			account.deserialize(item);

			list.add(account);
		}

		callback();
	} );
};
