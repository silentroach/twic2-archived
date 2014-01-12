var page = require('webpage').create(),
	system = require('system'),
    fs = require('fs'),
    // ---
    srcPath = fs.absolute(system.args[0] + '/..');

srcPath = [
	srcPath.substring(0, srcPath.lastIndexOf(fs.separator)),
	'src',
].join(fs.separator) + fs.separator;

var
	settings = {
		'img/_generated/icons/128.png': {
			size: { width: 128, height: 128 },
			source: 'img/logo.svg'
		},
		'img/_generated/icons/64.png': {
			size: { width: 64, height: 64 },
			zoom: .5,
			source: 'img/logo.svg'
		},
		'img/_generated/icons/48.png': {
			size: { width: 48, height: 48 },
			zoom: .375,
			source: 'img/logo.svg'
		},
		'img/_generated/icons/32.png': {
			size: { width: 32, height: 32 },
			zoom: .25,
			source: 'img/logo.svg'
		},
		'img/_generated/icons/24.png': {
			size: { width: 24, height: 24 },
			zoom: .1875,
			source: 'img/logo.svg'
		},
		'img/_generated/icons/16.png': {
			size: { width: 16, height: 16 },
			zoom: .125,
			source: 'img/logo.svg'
		},
		// ------------------------------------
		'img/_generated/toolbar@x2.png': {
			size: { width: 38, height: 38 },
			source: 'img/toolbar.svg'
		},
		'img/_generated/toolbar.png': {
			size: { width: 19, height: 19 },
			zoom: .5,
			source: 'img/toolbar.svg'
		},
	};

function convert(config) {
	var
		filename = Object.keys(config).shift(),
		settings = config[filename];

	console.log(settings.source + ' -> ' + filename);

	page.viewportSize = settings.size;

	settings.size.left = 0;
	settings.size.top = 0;
	page.clipRect = settings.size;

	page.zoomFactor = settings.zoom ? settings.zoom : 1;

	page.open(srcPath + settings.source, function(status) {
		if (status !== 'success') {
			console.log('Unable to open file');
			phantom.exit();
		} else {
			window.setTimeout( function() {
				page.render(srcPath + filename);

				delete config[filename];

				if (Object.keys(config).length) {
					convert(config);
				} else {
					phantom.exit();
				}
			}, 100);
		}
	} );
}

console.log('');
convert(settings);
