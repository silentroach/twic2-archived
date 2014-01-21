/**
 * @constructor
 * @param {Number} userId User id
 * @extends twic.Timeline
 */
twic.Mentions = function() {
	twic.Timeline.call(this);
};

/**
 * @constant
 */
twic.Mentions.collectionName = 'mentions';

twic.utils.inherits(twic.Mentions, twic.Timeline);
