twic.Account = function() {
	this.userId = null;
	this.oauthToken = null;
	this.lastVisibleTweet = 0;
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
