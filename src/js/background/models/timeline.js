/**
 * @constructor
 * @param {Number} userId User id
 * @extends twic.ModelList
 */
twic.Timeline = function(userId) {
	twic.ModelList.call(this);

	this.userId = userId;
};

/**
 * @constant
 */
twic.Timeline.collectionName = 'timeline';

// twic.utils.inherits(twic.Timeline, twic.ModelList);
