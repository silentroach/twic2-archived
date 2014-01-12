twic.Account = function() {
	this.userId = null;
	this.oauthToken = null;
	this.lastVisibleTweet = 0;

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
		'oauthTokenSecret': this.oauthToken.tokenSecret
	};
};

/**
 * Deserialize data from storage
 * @param {Object} data
 */
twic.Account.prototype.deserialize = function(data) {
	this.userId = data['userId'];
	this.lastVisibleTweet = data['lastVisibleTweet'];

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
	this.getUser( function(error, user) {
		if (error) {
			callback(error);
			return;
		}

		callback(null, {
			id: user.id,
			nick: user.nick,
			name: user.name,
			imageUrl: user.imageUrl
		} );
	} );
};
