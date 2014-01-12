twic.browser = { };

twic.browser.platforms = {
	WINDOWS: 'windows',
	OSX: 'osx',
	LINUX: 'linux'
};

twic.browser.platform = null;

twic.browser.getPlatform = function(callback) {
	var
		platform;

	if (twic.browser.platform) {
		callback(twic.browser.platform);
		return;
	}

	chrome.runtime.getPlatformInfo( function(info) {
		switch (info['os']) {
			case 'mac':
				platform = twic.browser.platforms.OSX;
				break;
			case 'win':
				platform = twic.browser.platforms.WINDOWS;
				break;
			default:
				platform = twic.browser.platforms.LINUX;
				break;
		}

		twic.browser.platform = platform;
		callback(platform);
	} );
};

twic.browser.isRetina = window.devicePixelRatio > 1;
