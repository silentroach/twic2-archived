( function() {

	var
		accounts = new twic.AccountList(
			chrome.storage.sync,
			chrome.storage.local
		),
		dispatcher = new twic.EventDispatcher();

	chrome.runtime.onMessage.addListener(
		dispatcher.emit.bind(dispatcher)
	);

	dispatcher.on('authCheck', function(event, callback, sender) {
		callback(
			twic.twitter.checkAuthenticationWindowId(sender.tab.windowId)
		);
	} );

	dispatcher.on('auth', function(event, callback, sender) {
		var
			account;

		twic.twitter.authorize(sender.tab.windowId, event.data['pin'], function(error, token, user) {
			if (error) {
				callback( {
					'error': twic.global.ERROR
				} );

				return;
			}

			account = new twic.Account();
			account.oauthToken = token;
			account.userId = user.id;
			accounts.add(account);

			accounts.save( function() {
				callback( {
					'name': user.name
				} );
			} );
		} );

		return true;
	} );

	dispatcher.on('authStart', function(event, callback) {
		twic.twitter.startAuthentication()
			.then( function() {
				callback();
			} );

		return true;
	} );

	dispatcher.on('getAccounts', function(event, callback) {
		accounts.getPopupData(callback);
	} );

	accounts.load( function() {
		console.log('loaded');
	} );

}() );
