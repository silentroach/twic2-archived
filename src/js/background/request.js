twic.Request = function(method, url) {
	this.method = method;
	this.url = url;
	this.requestHeaders = { };
	this.data = { };
};

twic.Request.queryStringToObject = function(data) {
	var
		result = { },
		r = /([^&=]+)=?([^&]*)/g,
		tmp;

	while (true) {
		tmp = r.exec(data);

		if (!tmp) {
			break;
		}

		result[tmp[1]] = tmp[2];
	}

	return result;
};

twic.Request.encodeString = function(str) {
	return encodeURIComponent(str)
		.replace(/\!/g, '%21')
		.replace(/\*/g, '%2A')
		.replace(/'/g, '%27')
		.replace(/\(/g, '%28')
		.replace(/\)/g, '%29');
};

twic.Request.prototype.getData = function() {
	var
		self = this,
		key = '',
		data = [];

	for (key in self.data) {
		data.push(
			[
				twic.Request.encodeString(key),
				twic.Request.encodeString(self.data[key])
			].join('=')
		);
	}

	return data;
};

twic.Request.prototype.setHeader = function(key, value) {
	this.requestHeaders[key] = value;
};

twic.Request.prototype.setRequestData = function(key, value) {
	this.data[key] = value.toString();
};

twic.Request.prototype.send = function(callback) {
	var
		self = this,
		data = self.getData(),
		key = '',
		req = new XMLHttpRequest();

	req.onreadystatechange = function() {
		var
			req = this,
			error = null;

		if (XMLHttpRequest.DONE === req.readyState) {
			if (0 === req.status) {
				error = new twic.Request.Error(twic.Request.Error.NO_CONNECTION, req);
			} else
			if (404 === req.status) {
				error = new twic.Request.Error(twic.Request.Error.NOT_FOUND, req);
			} else
			if (401 === req.status) {
				error = new twic.Request.Error(twic.Request.Error.UNAUTHORIZED, req);
			} else
			if ('' === req.responseText) {
				error = new twic.Request.Error(twic.Request.Error.TIMEOUT, req);
			} else
			if (200 !== req.status) {
				error = new twic.Request.Error(twic.Request.Error.UNKNOWN, req);
			}

			callback(error, req);
		}
	};

	req.open(
		self.method,
		self.url + ('GET' === self.method && data.length > 0 ? '?' + data.join('&') : '')
	);

	for (key in self.requestHeaders) {
		req.setRequestHeader(key, self.requestHeaders[key]);
	}

	if ('GET' === self.method) {
		req.send();
	} else {
		req.send(data.join('&'));
	}
};

