/**
 * @constructor
 */
twic.Router = function() {
	var router = this;

	this.pages = { };

	this.currentPage = null;
	this.currentPath = null;

	window.addEventListener('popstate', function(event) {
		event.preventDefault();

		router.changePage(location.hash);
	} );
};

/**
 * @param {twic.Page} page Page
 */
twic.Router.prototype.registerPage = function(page) {
	this.pages[page.constructor.path] = page;
};

/**
 * Handling url change
 * @param {string} url Url
 */
twic.Router.prototype.handleUrl = function(url) {
	var
		state = {
			url: url
		};

	window.history.pushState(state, null, url);

	this.changePage(location.hash);
};

/**
 * @param {string} path Url path
 */
twic.Router.prototype.changePage = function(hash) {
	var
		path = hash.slice(1),
		pathParts = path.split('/');

	if (this.currentPage !== pathParts[0]) {
		if (this.currentPage) {
			this.pages[this.currentPage].suspend();
		}

		this.currentPage = pathParts[0];
		this.currentPath = null;
		this.pages[this.currentPage].activate();
	}

	if (this.currentPath !== path) {
		if (pathParts.length > 1
			|| this.currentPath
		) {
			this.pages[this.currentPage].handleParams(pathParts);
		}

		this.currentPath = path;
	}
};
