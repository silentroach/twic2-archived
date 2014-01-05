twic.i18n = { };

twic.i18n.translate = function() {
	return chrome.i18n.getMessage.apply(chrome, arguments);
};

twic.i18n.plural = function(number, endings) {
	var
		mod10 = number % 10,
		mod100 = number % 100,
		idx;

	if (mod10 === 1
		&& mod100 !== 11
	) {
		idx = 0;
	} else
	if (mod10 >= 2
		&& mod10 <= 4
		&& (mod100 < 10
			|| mod100 >= 20
		)
	) {
		idx = 1;
	} else {
		idx = 2;
	}

	return number + ' ' + twic.i18n.translate(endings[idx]);
};