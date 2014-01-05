twic.Event = function() {
	this.type = null;
	this.data = null;
};

twic.Event.prototype.send = function(callback) {
	chrome.runtime.sendMessage( {
		'type': this.type,
		'data': this.data
	}, function(reply) {
		if (callback) {
			callback(reply);
		}
	} );
};
