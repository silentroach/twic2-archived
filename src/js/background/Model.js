twic.Model = function() {
	this.id = null;
	this.updateTime = null;
};

twic.Model.getById = function(modelConstructor, id, callback) {
	twic.db.get(modelConstructor.collectionName, id, function(error, data) {
		var
			object;

		if (error) {
			callback(error);
			return;
		}

		if (undefined === data) {
			callback(null, data);
			return;
		}

		object = new modelConstructor();
		object.deserialize(data);

		callback(null, object);
	} );
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

	twic.db.put(this.constructor.collectionName, model.serialize(), function(error) {
		if (error) {
			callback.call(model, error);
			return;
		}

		callback.call(model);
	} );
};

twic.Model.prototype.isFresh = function() {
	var
		freshTime = this.constructor.freshTime || 60 * 60;

	return this.updateTime + freshTime > Math.round(+new Date() / 1000);
};
