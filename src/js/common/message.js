twic.Message = function() {
	this.type = null;
	this.data = null;
};

twic.Message.prototype.send = function(callback) {
	chrome.runtime.sendMessage( {
		'type': this.type,
		'data': this.data
	}, function(reply) {
		if (callback) {
			callback(reply);
		}
	} );
};
