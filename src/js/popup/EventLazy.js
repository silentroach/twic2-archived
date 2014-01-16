twic.EventLazy = function() {
	twic.Event.call(this);
};

twic.EventLazy.LAZY_TIMEOUT = 200;

twic.utils.inherits(twic.EventLazy, twic.Event);

twic.EventLazy.prototype.send = function(callback, lazyCallback) {
	var
		timeout = setTimeout(lazyCallback, twic.EventLazy.LAZY_TIMEOUT);

	twic.Event.prototype.send.call(this, function(reply) {
		clearTimeout(timeout);

		if (callback) {
			callback(reply);
		}
	} );
};
