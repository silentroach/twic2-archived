twic.Block = function(templateElement) {
	this.templateElement = templateElement;
};

twic.Block.prototype.render = function() {
	return document.importNode(this.templateElement.content, true);
};
