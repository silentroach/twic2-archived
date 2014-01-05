twic.twitter.api = { };

twic.twitter.api.BASE_URL = 'https://api.twitter.com/1.1/';
twic.twitter.api.AUTH_URL = 'https://api.twitter.com/oauth/';

twic.twitter.api.token = null;

twic.twitter.api.rateLimitRemains = null;
twic.twitter.api.rateLimitReset = null;

twic.twitter.api.getRequestToken = function(callback) {
	var
		request;

	if (twic.twitter.api.token) {
		callback(twic.twitter.api.token);
		return;
	}

	request = new twic.Request.OAuth('POST', twic.twitter.api.AUTH_URL + 'request_token');

	request.send( function(error, request) {
		if (!error) {
			var
				token = new twic.twitter.api.Token(),
				obj = twic.Request.queryStringToObject(request.responseText);

			token.token = obj['oauth_token'];
			token.tokenSecret = obj['oauth_token_secret'];

			twic.twitter.api.token = token;

			callback(token);
		} else {
			callback();
		}
	} );
};

twic.twitter.api.resetToken = function() {
	twic.twitter.api.token = null;
};

twic.twitter.api.parseGlobalLimit = function(request) {
	var
		remains = request.getResponseHeader('x-rate-limit-remaining'),
		reset = request.getResponseHeader('x-rate-limit-reset');

	if (remains && reset) {
		twic.twitter.api.rateLimitRemains = parseInt(remains, 10);
		twic.twitter.api.rateLimitReset = parseInt(reset, 10);
	}
};

twic.twitter.api.getAccessToken = function(pin, callback) {
	twic.twitter.api.getRequestToken( function(token) {
		var
			request = new twic.Request.OAuth('POST', twic.twitter.api.AUTH_URL + 'access_token');

		request.setRequestData('oauth_verifier', pin);

		request.send( function(error, request) {
			if (!error) {
				callback(
					null, twic.Request.queryStringToObject(request.responseText)
				);
			} else {
				if (twic.Request.Error.UNAUTHORIZED === error.code) {
					twic.twitter.api.resetToken();
				}

				callback(error);
			}
		}, token.token, token.tokenSecret);
	} );
};

twic.twitter.api.getUserInfo = function(userId, callback) {
	var
		request = new twic.Request.OAuth('GET', twic.twitter.api.BASE_URL + 'users/show/' + userId + '.json'),
		userObj;

	request.setRequestData('include_entities', 1);

	request.send( function(error, request) {
		if (!error) {
			twic.twitter.api.parseGlobalLimit(request);

			userObj = JSON.parse(request.responseText);

			if (userObj) {
				callback(null, userObj);
				return;
			}
		}

		callback(error);
	} );
};
