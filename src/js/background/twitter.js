twic.twitter = { };

/**
 * Windows ids with authentication flow started
 * @private
 */
twic.twitter.authWindowsIds = { };

twic.twitter.AUTH_SESSION_TIMEOUT = 300;

twic.twitter.startAuthentication = function(login) {
	twic.twitter.api.resetToken();

	twic.twitter.api.getRequestToken( function(token) {
		var
			url = twic.twitter.api.AUTH_URL + 'authorize?oauth_token=' + token.token;

		if (login) {
			url += '&screen_name=' + login;
		}

		chrome.windows.create( {
			url: url,
			width: 600,
			height: 650,
			focused: true,
			type: 'popup'
		}, function(cw) {
			twic.twitter.authWindowsIds[cw.id] = twic.Timestamp.now();
		} );
	} );
};

/**
 * Will check if window is opened by us
 * @param {Number} windowId Window id
 */
twic.twitter.checkAuthenticationWindowId = function(windowId) {
	var
		timestamp = twic.twitter.authWindowsIds[windowId];

	if (undefined === timestamp) {
		return false;
	}

	if (twic.Timestamp.now() - timestamp > twic.twitter.AUTH_SESSION_TIMEOUT) {
		delete twic.twitter.authWindowsIds[windowId];
		return false;
	}

	return true;
};

twic.twitter.authorize = function(windowId, pin, callback) {
	if (!twic.twitter.checkAuthenticationWindowId(windowId)) {
		return;
	}

	delete twic.twitter.authWindowsIds[windowId];

	twic.twitter.api.getAccessToken(pin, function(error, token, userId) {
		if (error) {
			callback(error);
			return;
		}

		twic.twitter.getUser(userId, function(error, user) {
			if (error) {
				callback(error);
				return;
			}

			callback(null, token, user);
		} );
	} );
};

/**
 * Get the user info
 */
twic.twitter.getUser = function(userId, callback) {
	twic.Model.getById(twic.User, userId, function(error, user) {
		if (!error
			&& user
			&& user.isFresh()
		) {
			callback(null, user);
			return;
		}

		twic.twitter.api.getUserInfo(userId, function(error, userObj) {
			var
				models = [ ],
				user, tweet;

			if (error) {
				callback(error);
				return;
			}

			user = new twic.User();
			user.fillFromJSON(userObj);
			models.push(user);

			if (userObj['status']) {
				tweet = new twic.Tweet();
				tweet.fillFromJSON(userObj['status']);
				tweet.userId = user.id;
				models.push(tweet);
			}

			async.forEachSeries(models, function(model, finished) {
				model.save(finished);
			}, function() {
				callback(null, user);
			} );
		} );
	} );
};

/**
 * Cleanup authentication windows ids
 *
 * @todo refactor all windows management to somewhere
 */
setInterval( function() {
	var
		windowId;

	for (windowId in twic.twitter.authWindowsIds) {
		if (twic.Timestamp.now() - twic.twitter.authWindowsIds[windowId] > twic.twitter.AUTH_SESSION_TIMEOUT) {
			delete twic.twitter.authWindowsIds[windowId];
		}
	}
}, twic.twitter.AUTH_SESSION_TIMEOUT * 1000 );
