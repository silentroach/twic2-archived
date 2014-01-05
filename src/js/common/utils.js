twic.utils = { };

twic.utils.inherits = function(childCtor, parentCtor) {
	function TempCtor() { }
	TempCtor.prototype = parentCtor.prototype;

	childCtor.prototype = new TempCtor();
	childCtor.prototype.constructor = childCtor;
};
