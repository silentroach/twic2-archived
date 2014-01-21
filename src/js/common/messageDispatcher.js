twic.MessageDispatcher = function() {
	this.listeners = { };
};

/**
 * Message processing
 * @param {Function} callback Must return true if sendResponse used async
 */
twic.MessageDispatcher.prototype.on = function(type, callback) {
	this.listeners[type] = callback;
};

twic.MessageDispatcher.prototype.off = function(type) {
	delete this.listeners[type];
};

twic.MessageDispatcher.prototype.emit = function(request, sender, sendResponse) {
	var
		requestType = request['type'],
		msg;

	if (undefined === this.listeners[requestType]) {
		return;
	}

	msg = new twic.Message();
	msg.type = requestType;
	msg.data = request['data'];

	return this.listeners[requestType](msg, sendResponse, sender);
};
