twic.Request.Error = function(code, req) {
	this.request = req;

	twic.Error.call(this, code);
};

twic.utils.inherits(twic.Request.Error, twic.Error);

twic.Request.Error.UNKNOWN       = 0;
twic.Request.Error.UNAUTHORIZED  = 1;
twic.Request.Error.TIMEOUT       = 2;
twic.Request.Error.NOT_FOUND     = 3;
twic.Request.Error.NO_CONNECTION = 4;