twic.EventLazy = function() {
	twic.Event.call(this);
};

twic.EventLazy.LAZY_TIMEOUT = 250;

twic.utils.inherits(twic.EventLazy, twic.Event);

twic.EventLazy.prototype.send = function(callback, lazyCallback) {
	var timeout;

	twic.Event.prototype.send.call(this, function(reply) {
		clearTimeout(timeout);
		timeout = 0;

		if (callback) {
			callback(reply);
		}
	} );

	timeout = setTimeout(lazyCallback, twic.EventLazy.LAZY_TIMEOUT);
};
