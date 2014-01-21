twic.Block.Account = function(templateElement) {
	twic.Block.call(this, templateElement);

	this.id = null;
	this.imageUrl = null;
	this.nick = null;
	this.userId = null;
};

twic.utils.inherits(twic.Block.Account, twic.Block);

twic.Block.Account.prototype.setData = function(data) {
	this.id = data['id'];
	this.imageUrl = data['imageUrl'];
	this.nick = data['nick'];
	this.userId = data['id'];
};

twic.Block.Account.prototype.render = function() {
	var
		blockElement = twic.Block.prototype.render.call(this);

	blockElement.querySelector('.user-nick').innerText = this.nick;
	blockElement.querySelector('.user-avatar').src = this.imageUrl.replace(
		'{size}',
		twic.browser.isRetina ? '_reasonably_small' : '_bigger'
	);
	blockElement.querySelector('.user-link').href = '#timeline/' + this.userId;

	return blockElement;
};
