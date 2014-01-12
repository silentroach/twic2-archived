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
		data = { },
		i;

	for (i in this.accounts) {
		data[i] = this.accounts[i].serialize();
	}

	obj[twic.AccountList.KEY] = data;

	this.storage.set(obj, callback);
};

twic.AccountList.prototype.load = function(callback) {
	var
		list = this;

	list.storage.get(twic.AccountList.KEY, function(items) {
		var
			account, item, i;

		if (undefined === items[twic.AccountList.KEY]) {
			callback();
			return;
		}

		item = items[twic.AccountList.KEY];

		for (i in item) {
			account = new twic.Account();
			account.deserialize(item[i]);

			list.add(account);
		}

		callback();
	} );
};

twic.AccountList.prototype.getPopupData = function(callback) {
	var
		list = this,
		obj = { },
		userId;

	async.forEach(Object.keys(this.accounts), function(userId, callback) {
		list.accounts[userId].getPopupData( function(error, data) {
			if (error) {
				callback();
				return;
			}

			obj[userId] = data;
			callback();
		} );
	}, function() {
		callback(obj);
	} );
};
