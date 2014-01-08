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

		router.changePage(location.pathname);
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

	this.changePage(location.pathname);
};

/**
 * @param {string} path Url path
 */
twic.Router.prototype.changePage = function(path) {
	var
		pathParts = path.split('/');

	if (this.currentPage !== pathParts[0]) {
		if (this.currentPage) {
			this.pages[this.currentPage].suspend();
		}

		this.currentPage = pathParts[0];
		this.pages[this.currentPage].activate();
	}

	if (this.currentPath !== path) {
		this.currentPath = path;

		this.pages[this.currentPage].handleParams(pathParts);
	}
};
