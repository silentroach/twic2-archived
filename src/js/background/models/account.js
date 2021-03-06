twic.Account = function() {
	this.userId = null;
	this.oauthToken = null;
	this.lastVisibleTweet = 0;

	// field to determine account position in list
	this.sorting = twic.Timestamp.now();

	this.user = null;
};

twic.Account.prototype.isAuthorized = function() {
	return this.oauthToken;
};

twic.Account.prototype.serialize = function() {
	return {
		'userId': this.userId,
		'lastVisibleTweet': this.lastVisibleTweet,
		'oauthToken': this.oauthToken.token,
		'oauthTokenSecret': this.oauthToken.tokenSecret,
		'sorting': this.sorting
	};
};

/**
 * Deserialize data from storage
 * @param {Object} data
 */
twic.Account.prototype.deserialize = function(data) {
	this.userId = data['userId'];
	this.lastVisibleTweet = data['lastVisibleTweet'];
	this.sorting = data['sorting'];

	if (data['oauthToken'] && data['oauthTokenSecret']) {
		this.oauthToken = new twic.Request.OAuth.Token();
		this.oauthToken.token = data['oauthToken'];
		this.oauthToken.tokenSecret = data['oauthTokenSecret'];
	}
};

/**
 * @param {Function(twic.User)} callback
 */
twic.Account.prototype.getUser = function(callback) {
	var
		account = this;

	if (account.user) {
		callback(null, account.user);
		return;
	}

	twic.twitter.getUser(account.userId, function(error, user) {
		if (!error) {
			account.user = user;
		}

		callback(error, user);
	} );
};

twic.Account.prototype.getPopupData = function(callback) {
	var
		account = this;

	return new Promise( function(resolve, reject) {
		account.getUser( function(error, user) {
			if (error) {
				reject(error);
				return;
			}

			resolve( {
				id: user.id,
				nick: user.nick,
				name: user.name,
				imageUrl: user.imageUrl
			} );
		} );
	} );
};
