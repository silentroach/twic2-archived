twic.twitter = { };

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
		} );
	} );
};

twic.twitter.authorize = function(pin, callback) {
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
