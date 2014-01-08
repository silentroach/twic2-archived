twic.twitter.api = { };

twic.twitter.api.BASE_URL = 'https://api.twitter.com/1.1/';
twic.twitter.api.AUTH_URL = 'https://api.twitter.com/oauth/';

twic.twitter.api.TIMELINE_TWEETS_COUNT = 30;

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
				token = new twic.Request.OAuth.Token(),
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

// @todo rethink
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
			var
				obj, token;

			if (!error) {
				obj = twic.Request.queryStringToObject(request.responseText);

				if (undefined === obj['oauth_token']
					|| undefined === obj['oauth_token_secret']
				) {
					error = new twic.Error();
				}
			}

			if (!error) {
				token = new twic.Request.OAuth.Token();
				token.token = obj['oauth_token'];
				token.tokenSecret = obj['oauth_token_secret'];

				callback(null, token, obj['user_id']);
			} else {
				if (twic.Request.Error.UNAUTHORIZED === error.code) {
					twic.twitter.api.resetToken();
				}

				callback(error);
			}
		}, token);
	} );
};

twic.twitter.api.getUserInfo = function(userId, callback) {
	var
		request = new twic.Request.OAuth('GET', twic.twitter.api.BASE_URL + 'users/show/' + userId + '.json');

	request.setRequestData('include_entities', 1);

	request.send( function(error, request) {
		var obj;

		if (!error) {
			// twic.twitter.api.parseGlobalLimit(request);

			obj = JSON.parse(request.responseText);

			// @todo failed to parse callback?

			if (obj) {
				callback(null, obj);
				return;
			}
		}

		callback(error);
	} );
};

twic.twitter.api.getTimeline = function(userId, sinceId, token, callback) {
	var
		request = new twic.Request.OAuth('GET', twic.twitter.api.BASE_URL + 'statuses/home_timeline/' + userId + '.json');

	request.setRequestData('count', twic.twitter.api.TIMELINE_TWEETS_COUNT);
	request.setRequestData('include_entities', 1);

	if (sinceId) {
		request.setRequestData('since_id', sinceId);
	}

	request.send( function(error, request) {
		var
			obj;

		if (error) {
			callback(error);
			return;
		}

		obj = JSON.parse(request.responseText);

		// @todo failed to parse callback?

		if (obj) {
			callback(null, obj);
		}
	}, token);
};
