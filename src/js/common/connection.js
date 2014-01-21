twic.Connection = function() {
	EventEmitter.call(this);

	this.isOnline = null;

	window.addEventListener('online', this.onStateChanged.bind(this));
	window.addEventListener('offline', this.onStateChanged.bind(this));
};

twic.utils.inherits(twic.Connection, EventEmitter);

/**
 * @private
 */
twic.Connection.prototype.onStateChanged = function() {
	this.isOnline = navigator.onLine;

	this.emit('change', this.isOnline);
};
