twic.Timestamp = function(timestamp) {
	/**
	 * @var {Number}
	 */
	this.timestamp = timestamp ? timestamp : twic.Timestamp.now();
};

/**
 * @return {Number}
 */
twic.Timestamp.now = function() {
	return Math.round(+new Date() / 1000);
};
