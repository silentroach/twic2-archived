twic.Request.OAuth = function(method, url) {
	twic.Request.call(this, method, url);

	this.OAuthData = { };
};

twic.utils.inherits(twic.Request.OAuth, twic.Request);

// ---

twic.Request.OAuth.NONCE_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';

twic.Request.OAuth.timestampOffset = 0;

// ---

twic.Request.OAuth.getNonce = function() {
	var
		result = '',
		i;

	for (i = 0; i < 32; ++i) {
		result += twic.Request.OAuth.NONCE_CHARS[
			Math.floor(Math.random() * twic.Request.OAuth.NONCE_CHARS.length)
		];
	}

	return result;
};

twic.Request.OAuth.prototype.setOAuthData = function(key, value) {
	this.OAuthData[key] = value.toString();
};

twic.Request.OAuth.prototype.getData = function() {
	var
		request = this,
		data = twic.Request.prototype.getData.call(request),
		key = '';

	for (key in request.OAuthData) {
		data.push(
			[
				twic.Request.encodeString(key),
				twic.Request.encodeString(request.OAuthData[key])
			].join('=')
		);
	}

	return data;
};

twic.Request.OAuth.prototype.sign = function(token, tokenSecret) {
	var
		request = this,
		baseString = request.method + '&' + twic.Request.encodeString(request.url) + '&';

	if ('GET' !== request.method) {
		request.setHeader('Content-Type', 'application/x-www-form-urlencoded');
	}

	request.setOAuthData('oauth_consumer_key', twic.keys.CONSUMER_KEY);
	request.setOAuthData('oauth_signature_method', 'HMAC-SHA1');
	request.setOAuthData('oauth_version', '1.0');
	request.setOAuthData('oauth_timestamp', Math.round(((new Date()).getTime() + twic.Request.OAuth.timestampOffset) / 1000));
	request.setOAuthData('oauth_nonce', twic.Request.OAuth.getNonce());

	if (token) {
		request.setOAuthData('oauth_token', token);
	}

	// tis important to sort params
	baseString += twic.Request.encodeString(request.getData().sort().join('&'));

	request.setOAuthData(
		'oauth_signature',
		SHA1.encode(
			twic.Request.encodeString(twic.keys.CONSUMER_SECRET) + '&' + (tokenSecret ? twic.Request.encodeString(tokenSecret) : ''),
			baseString
		)
	);
};

twic.Request.OAuth.prototype.checkTimestamp = function(req) {
	var
		checkFields = ['Last-Modified', 'Date'],
		checkHeader,
		newOffset,
		remoteDate,
		i;

	for (i = 0; i < checkFields.length; ++i) {
		checkHeader = req.getResponseHeader(checkFields[i]);

		if (checkHeader
			&& 'string' === typeof checkHeader
		) {
			remoteDate = Date.parse(checkHeader);

			if (remoteDate) {
				newOffset = remoteDate - (new Date()).getTime();

				if (twic.Request.OAuth.timestampOffset !== newOffset) {
					twic.Request.OAuth.timestampOffset = newOffset;

					return true;
				}
			}
		}
	}

	return false;
};

twic.Request.OAuth.prototype.send = function(callback, token, tokenSecret) {
	var
		isRetry = false,
		request = this;

	function sendRequest() {
		if (token
			&& tokenSecret
		) {
			request.sign(token, tokenSecret);
		} else {
			request.sign();
		}

		// parent sender with own callback checker
		twic.Request.prototype.send.call(request, function(error, req) {
			if (error
				&& twic.Request.Error.UNAUTHORIZED === error.code
				&& !isRetry
				&& request.checkTimestamp(error.request)
			) {
				isRetry = true;

				// !!! WARNING !!!
				delete request.OAuthData['oauth_signature'];
				sendRequest();
			} else {
				callback(error, req);
			}
		} );
	}

	sendRequest();
};
