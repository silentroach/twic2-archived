twic.MessageLazy = function() {
	twic.Message.call(this);
};

twic.MessageLazy.LAZY_TIMEOUT = 200;

twic.utils.inherits(twic.MessageLazy, twic.Message);

twic.MessageLazy.prototype.send = function(callback, lazyCallback) {
	var
		timeout = setTimeout(lazyCallback, twic.MessageLazy.LAZY_TIMEOUT);

	twic.Message.prototype.send.call(this, function(reply) {
		clearTimeout(timeout);

		if (callback) {
			callback(reply);
		}
	} );
};
