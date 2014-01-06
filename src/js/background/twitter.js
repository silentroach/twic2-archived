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
	var
		models = [ ],
		user, tweet;

	twic.twitter.api.getAccessToken(pin, function(error, token, userId) {
		if (error) {
			callback(error);
			return;
		}

		twic.twitter.api.getUserInfo(userId, function(error, userObj) {
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
				callback(null, token, user);
			} );
		} );
	} );
};
