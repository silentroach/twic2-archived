twic.Page = function(element) {
	this.initialized = false;

	this.container = element;
};

twic.Page.prototype.activate = function() {
	if (!this.initialized) {
		this.initialize();
	}
};

twic.Page.prototype.initialize = function() {
	this.initialized = true;
};
