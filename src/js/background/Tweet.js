twic.Tweet = function() {
	this.userId = null;
	this.rawText = null;

	this.createdStamp = null;

	this.source = null;
};

twic.Tweet.collectionName = 'tweets';

twic.utils.inherits(twic.Tweet, twic.Model);

twic.Tweet.prototype.fillFromJSON = function(json) {
	this.id = json['id_str'];

	this.rawText = json['text'];

	this.createdStamp = Math.round(+new Date(json['created_at']) / 1000);

	this.source = json['source'];

	if (json['user']) {
		this.userId = json['user']['id_str'];
	}
};

twic.Tweet.prototype.serialize = function() {
	var obj = twic.Model.prototype.serialize.call(this);

	obj['userId'] = this.userId;
	obj['rawText'] = this.rawText;
	obj['createdStamp'] = this.createdStamp;
	obj['source'] = this.source;

	return obj;
};

twic.Tweet.prototype.deserialize = function(data) {
	twic.Model.prototype.deserialize.call(this, data);

	this.userId = data['userId'];
	this.rawText = data['rawText'];
	this.createdStamp = data['createdStamp'];
	this.source = data['source'];
}