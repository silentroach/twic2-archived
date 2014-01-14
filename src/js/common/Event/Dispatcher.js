twic.EventDispatcher = function() {
	this.listeners = { };
};

/**
 * Message processing
 * @param {Function} callback Must return true if sendResponse used async
 */
twic.EventDispatcher.prototype.on = function(type, callback) {
	this.listeners[type] = callback;
};

twic.EventDispatcher.prototype.off = function(type) {
	delete this.listeners[type];
};

twic.EventDispatcher.prototype.emit = function(request, sender, sendResponse) {
	var
		requestType = request['type'],
		event;

	if (undefined === this.listeners[requestType]) {
		return;
	}

	event = new twic.Event();
	event.type = requestType;
	event.data = request['data'];

	return this.listeners[requestType](event, sendResponse, sender);
};
