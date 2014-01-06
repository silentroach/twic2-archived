twic.AccountList = function(storage, secureStorage) {
	this.accounts = { };
	this.length = 0;

	this.storage = storage;
	this.secureStorage = secureStorage;
};

twic.AccountList.KEY = 'accounts';

twic.AccountList.prototype.add = function(account) {
	this.accounts[account.userId] = account;
	++this.length;
};

twic.AccountList.prototype.save = function(callback) {
	var
		list = this,
		data = { },
		secureData = { },
		i;

	for (i in list.accounts) {
		data[i] = list.accounts[i].serialize();
		secureData[i] = list.accounts[i].serializeSecure();
	}

	async.forEach( [
		function(callback) {
			var
				obj = { };

			obj[twic.AccountList.KEY] = data;

			list.storage.set(obj, callback);
		},
		function(callback) {
			var
				obj = { };

			obj[twic.AccountList.KEY] = secureData;

			list.secureStorage.set(obj, callback);
		}
	], function(func, callback) {
		func(callback);
	}, function() {
		callback();
	} );
};

twic.AccountList.prototype.load = function(callback) {
	var
		list = this,
		data = { },
		item, account;

	async.forEach( [
		this.storage,
		this.secureStorage
	], function(storage, callback) {
		storage.get(twic.AccountList.KEY, function(items) {
			var i, key;

			if (undefined === items[twic.AccountList.KEY]) {
				callback();
				return;
			}

			item = items[twic.AccountList.KEY];

			for (i in item) {
				if (undefined === data[i]) {
					data[i] = { };
				}

				for (key in item[i]) {
					data[i][key] = item[i][key];
				}
			}

			callback();
		} );
	}, function() {
		var i;

		for (i in data) {
			account = new twic.Account();
			account.deserialize(data[i]);

			list.add(account);
		}

		callback();
	} );
};
