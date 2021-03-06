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

twic.AccountList.prototype.remove = function(userId) {
	if (undefined !== this.accounts[userId]) {
		delete this.accounts[userId];
		--this.length;
	}
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
		list = this;

	return new Promise( function(resolve, reject) {
		var
			reply = [ ],
			userId;

		async.forEach(Object.keys(list.accounts), function(userId, callback) {
			list.accounts[userId].getPopupData()
				.then( function(data) {
					reply.push(data);
					callback();
				} );
		}, function() {
			resolve(
				reply.sort( function(first, second) {
					if (first.sorting < second.sorting) {
						return -1;
					} else
					if (first.sorting > second.sorting) {
						return 1;
					} else {
						return 0;
					}
				} )
			);
		} );
	} );
};
