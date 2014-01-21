var EventEmitter = function() {
	this.listeners = { };
};

EventEmitter.prototype.emit = function(type) {
	var
		args, listener,
		i, l;

	if (undefined === this.listeners[type]) {
		return;
	}

	args = [ ];

	for (i = 1, l = arguments.length; i < l; ++i) {
		args.push(arguments[i]);
	}

	for (i = 0; listener = this.listeners[type][i]; ++i) {
		listener.apply(this, args);
	}
};

EventEmitter.prototype.on = function(type, callback) {
	if (undefined === this.listeners[type]) {
		this.listeners[type] = [ ];
	}

	this.listeners[type].push(callback);
};

EventEmitter.prototype.off = function(type, callback) {
	var i;

	if (undefined === this.listeners[type]) {
		return;
	}

	if (!callback) {
		delete this.listeners[type];
		return;
	}

	for (i = 0, l = this.listeners[type].length; i < l; ++i) {
		if (this.listeners[type][i] === callback) {
			this.listeners[type].slice(i, 1);
			break;
		}
	}

	if (!this.listeners[type].length) {
		delete this.listeners[type];
	}
};