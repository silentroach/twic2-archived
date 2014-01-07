module.exports = function(grunt) {

	grunt.initConfig( {

		jshint: {
			all: {
				src: [
					'src/js/**/*.js',
					'!src/js/3rdparty/*.js',
					'!src/js/_generated/*.js'
				]
			},
			options: {
				sub: true,       // suppress warnings about dot notation
				esnext: true,    // suppress warnings about ecmascript 6 specific syntax
				laxbreak: true,  // suppress warnings about unsafe line breakings
				curly: true,     // require curly braces on every block
				eqeqeq: true,    // require strict comparison
				immed: true,     // ( function(){}() );
				latedef: true,   // prohibit variable use before definition.
				trailing: true,  // prohibit trailing whitespaces
				boss: true       // suppress assignments instead of comparisons
			}
		},

		checkLocales: {
			all: {
				src: [
					'src/_locales/**/messages.json'
				]
			}
		}

		// crx: {
		// 	dist: {
		// 		manifest: 'src/manifest.json',
		// 		options: {
		// 			'test': 2
		// 		}
		// 	}
		// }
	} );

	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerMultiTask(
		'checkLocales',
		function() {
			var
				messagesObj, keysRef, keys, key,
				isError = false,
				i;

			for (i = 0; i < this.filesSrc.length; ++i) {
				filename = this.filesSrc[i];

				grunt.log.subhead(filename);

				messagesObj = grunt.file.readJSON(filename);

				keys = Object.keys(messagesObj).sort();

				if (undefined === keysRef) {
					//
				} else {
					keys.forEach( function(key) {
						if (keysRef.indexOf(key) < 0) {
							grunt.log.error('+ ' + key);
							isError = true;
						}
					} );

					keysRef.forEach( function(key) {
						if (keys.indexOf(key) < 0) {
							grunt.log.error('- ' + key);
							isError = true;
						}
					} );
				}

				for (key in messagesObj) {
					if (undefined === messagesObj[key].description) {
						grunt.log.error('Description is missing for [' + key + ']');
					}
				}

				keysRef = keys;
			}

			if (isError) {
				return false;
			}
		}
	);

	grunt.registerTask(
		'generate',
		function() {
			var
				twitterText = require('twitter-text'),
				// ---
				NAMESPACE = 'twic.text.regexen',
				// ---
				exportRegexps = {
					'url': 'extractUrl',
					'hash': 'validHashtag',
					'mention': 'validMentionOrList'
				},
				lines = [
					'/**',
					' * @preserve Thank god Twitter made Twitter Text project',
					' *   https://github.com/twitter/twitter-text-js',
					' */',
					NAMESPACE + ' = { };'
				],
				key;

			for (key in exportRegexps) {
				var
					regexp = twitterText.regexen[exportRegexps[key]];

				if ('undefined' === typeof regexp) {
					grunt.fatal('Broken Twitter Text regexp path - ' + exportRegexps[key]);
				}

				lines.push(
					[
						[NAMESPACE, key].join('.'),
						regexp
					].join(' = ') + ';'
				);
			}

			grunt.file.write('src/js/_generated/text.js', lines.join("\n"), {
				encoding: 'utf-8'
			} );
		}
	);

	grunt.registerTask('test', [ 'checkLocales', 'jshint' ]);
	// grunt.registerTask('build', [ 'crx' ]);
	grunt.registerTask('default', ['generate'/*, 'crx'*/ ]);

};
