twic.browser = { };

twic.browser.platforms = {
	WINDOWS: 'windows',
	OSX: 'osx',
	LINUX: 'linux'
};

twic.browser.platform = null;

twic.browser.getPlatform = function() {
	return new Promise( function(resolve) {
		var
			platform;

		if (twic.browser.platform) {
			resolve(twic.browser.platform);
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
			resolve(platform);
		} );
	} );
};

twic.browser.isRetina = window.devicePixelRatio > 1;
