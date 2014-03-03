# Twic Extension
[![Dependency Status](https://gemnasium.com/silentroach/twic.png)](https://gemnasium.com/silentroach/twic)
[![Code Climate](https://codeclimate.com/github/silentroach/twic.png)](https://codeclimate.com/github/silentroach/twic)
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/silentroach/twic/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

The opensource twitter client for Chromium based browsers.

Built with **pure** javascript with no frameworks used, so it is lightweight and very fast.

## Previous version

I'm trying to rewrite the previous version from scratch. It can be [found here](https://github.com/silentroach/twic-archived).

## How to help

You need to install [NodeJS](http://nodejs.org/), [grunt](http://gruntjs.com/getting-started), [PhantomJS](http://phantomjs.org/) and run this:

```shell
git clone https://github.com/silentroach/grunt-chrome-ext
cd grunt-chrome-ext
npm link
cd ..
git clone https://github.com/silentroach/twic.git
cd twic
npm install
grunt
phantomjs tools/rasterizeImages.js
```

`grunt-chrome-ext` package is used to build extension. Later when it will be stable, it will be a `package.json` dependence.

Then you need to add the `src` folder to your Chrome extensions list in developer mode.

Please respect the [EditorConfig](http://editorconfig.org/) project settings.

## Database

**Be carefull** to use git `master` branch version - automatic database migrations are described only between production versions.

To remove the extension database you need to open background page console (click on the "background page" link in Chrome extensions list page) and run this:

```js
indexedDB.deleteDatabase(twic.db.name);
```

## Thanks

* [Paul Johnston](http://pajhome.org.uk) for SHA1 javascript implementation
* Twitter for [Twitter Text](https://github.com/twitter/twitter-text-js) project (some regexps are used in project)
* Caolan McMahon for [Async](https://github.com/caolan/async) NodeJS module (`forEach` and `forEachSeries` methods are used in project)
* [GlyphIcons](http://glyphicons.com/) for amazing icons

## Copyright

[Kalashnikov Igor](mailto:igor.kalashnikov@me.com)

This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
