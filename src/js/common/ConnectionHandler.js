twic.ConnectionHandler = function() {
	EventEmitter.call(this);

	this.isOnline = null;

	window.addEventListener('online', this.onStateChanged.bind(this));
	window.addEventListener('offline', this.onStateChanged.bind(this));
};

twic.utils.inherits(twic.ConnectionHandler, EventEmitter);

/**
 * @private
 */
twic.ConnectionHandler.prototype.onStateChanged = function() {
	this.isOnline = navigator.onLine;

	this.emit('change', this.isOnline);
};