twic.Block.Account = function(templateElement) {
	twic.Block.call(this, templateElement);

	this.id = null;
	this.imageUrl = null;
	this.nick = null;
};

twic.utils.inherits(twic.Block.Account, twic.Block);

twic.Block.Account.prototype.setData = function(data) {
	this.id = data['id'];
	this.imageUrl = data['imageUrl'];
	this.nick = data['nick'];
};

twic.Block.Account.prototype.render = function() {
	var
		blockElement = twic.Block.prototype.render.call(this);

	blockElement.querySelector('.user-nick').innerText = this.nick;
	blockElement.querySelector('.user-avatar').src = this.imageUrl.replace('{size}', '_bigger');

	return blockElement;
};
