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
	var user;

	twic.twitter.api.getAccessToken(pin, function(error, data) {
		if (error) {
			callback(error);
			return;
		}

		twic.twitter.api.getUserInfo(data['user_id'], function(error, userObj) {
			if (error) {
				callback(error);
				return;
			}

			user = new twic.User();
			user.fillFromJSON(userObj);
			user.save( function() {
				callback(null, user);
			} );
		} );
	} );
};
