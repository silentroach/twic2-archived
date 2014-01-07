twic.browser = { };

twic.browser.platforms = {
	WINDOWS: 'windows',
	OSX: 'osx',
	LINUX: 'linux'
};

twic.browser.platform = null;

if (navigator.appVersion.indexOf('Mac') >= 0) {
	twic.browser.platform = twic.browser.platforms.OSX;
} else
if (navigator.appVersion.indexOf('Windows') >= 0) {
	twic.browser.platform = twic.browser.platforms.WINDOWS;
} else {
	twic.browser.platform = twic.browser.platforms.LINUX;
}

twic.browser.isRetina = window.devicePixelRatio > 1;