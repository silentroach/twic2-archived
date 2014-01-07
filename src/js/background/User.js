twic.User = function() {
	twic.Model.call(this);

	this.nick = null;
	this.name = null;
	this.description = null;
	this.locationName = null;
	this.imageUrl = null;

	this.registeredStamp = null;

	this.isVerified = false;
	this.isProtected = false;

	this.statusesCount = null;
	this.favoritesCount = null;
	this.followersCount = null;
	this.friendsCount = null;
};

twic.User.collectionName = 'users';

twic.utils.inherits(twic.User, twic.Model);

twic.User.prototype.fillFromJSON = function(json) {
	this.id = json['id_str'];

	this.nick = json['screen_name'];
	this.name = json['name'];
	this.description = json['description'];
	this.locationName = json['location'];
	this.imageUrl = json['profile_image_url_https'];

	this.registeredStamp = Math.round(+new Date(json['created_at']) / 1000);

	this.isVerified = json['verified'];
	this.isProtected = json['protected'];

	this.statusesCount = parseInt(json['statuses_count'], 10);
	this.favoritesCount = parseInt(json['favourites_count'], 10);
	this.followersCount = parseInt(json['followers_count'], 10);
	this.friendsCount = parseInt(json['friends_count'], 10);
};

twic.User.prototype.serialize = function() {
	var obj = twic.Model.prototype.serialize.call(this);

	obj['nick'] = this.nick;
	obj['name'] = this.name;
	obj['description'] = this.description;
	obj['locationName'] = this.locationName;
	obj['imageUrl'] = this.imageUrl;
	obj['registeredStamp'] = this.registeredStamp;
	obj['isVerified'] = this.isVerified;
	obj['isProtected'] = this.isProtected;
	obj['statusesCount'] = this.statusesCount;
	obj['favoritesCount'] = this.favoritesCount;
	obj['followersCount'] = this.followersCount;
	obj['friendsCount'] = this.friendsCount;

	return obj;
};

twic.User.prototype.deserialize = function(obj) {
	twic.Model.prototype.deserialize.call(this, obj);

	this.nick = obj['nick'];
	this.name = obj['name'];
	this.description = obj['description'];
	this.locationName = obj['locationName'];
	this.imageUrl = obj['imageUrl'];
	this.registeredStamp = obj['registeredStamp'];
	this.isVerified = obj['isVerified'];
	this.isProtected = obj['isProtected'];
	this.statusesCount = obj['statusesCount'];
	this.favoritesCount = obj['favoritesCount'];
	this.followersCount = obj['followersCount'];
	this.friendsCount = obj['friendsCount'];
};

twic.User.prototype.getNick = function() {
	return '@' + this.nick;
};
