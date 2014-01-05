( function() {

	var
		accounts = new twic.AccountList(),
		dispatcher = new twic.EventDispatcher();

	chrome.runtime.onMessage.addListener(
		dispatcher.emit.bind(dispatcher)
	);

	dispatcher.on('auth', function(event, callback) {
		twic.twitter.authorize(event.data['pin'], function(error, user) {
			if (error) {
				callback( {
					'error': twic.global.ERROR
				} );

				return;
			}

			callback( {
				'name': user.name
			} );
		} );

		return true;
	} );

}() );
