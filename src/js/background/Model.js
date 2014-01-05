twic.Model = function() {
	this.id = null;
	this.updateTime = null;
};

twic.Model.prototype.fillFromJSON = function(json) {
	//
};

twic.Model.prototype.serialize = function() {
	return {
		'id': this.id,
		'updateTime': this.updateTime
	};
};

twic.Model.prototype.deserialize = function(data) {
	this.id = data['id'];
	this.updateTime = data['updateTime'];
};

twic.Model.prototype.save = function(callback) {
	var
		model = this;

	model.updateTime = Math.round(+new Date() / 1000);

	twic.db.put(this.constructor.collectionName, model.serialize(), function() {
		callback.call(model);
	} );
};

twic.Model.prototype.isFresh = function() {
	var
		freshTime = this.constructor.freshTime || 60 * 60,
		now = Math.round(+new Date() / 1000);

	return this.updateTime + freshTime
};
