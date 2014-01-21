twic.Page = function(element) {
	EventEmitter.call(this);

	this.initialized = false;

	this.container = element;
};

twic.utils.inherits(twic.Page, EventEmitter);

twic.Page.prototype.activate = function() {
	if (!this.initialized) {
		this.initialize();
	}
};

twic.Page.prototype.initialize = function() {
	this.initialized = true;
};

twic.Page.prototype.handleParams = function(params) {

};
