twic.Model = function() {
	this.id = null;
};

twic.Model.prototype.fillFromJSON = function(json) {
	//
};

twic.Model.prototype.serialize = function() {
	return {
		'id': this.id,
		'updateTime': Math.round(+new Date() / 1000)
	};
};

twic.Model.prototype.deserialize = function(data) {
	this.id = data['id'];
};

twic.Model.prototype.save = function(callback) {
	var
		model = this;

	twic.db.put(this.constructor.collectionName, model.serialize(), function() {
		callback.call(model);
	} );
};
