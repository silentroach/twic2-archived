( function() {

	var
		msg, resultElement,
		pinWrapperElement = document.querySelector('#oauth_pin'),
		pinElement = document.querySelector('#oauth_pin code');

	function changeResultText() {
		resultElement.innerText = twic.i18n.translate.apply(twic.i18n.translate, arguments);
	}

	if (pinWrapperElement) {
		pinElement = pinWrapperElement.querySelector('code');

		if (pinElement) {
			msg = new twic.Message();
			msg.type = 'authCheck';
			msg.send( function(result) {
				if (!result) {
					return;
				}

				document.body.classList.add('twic');

				resultElement = document.createElement('p');
				resultElement.classList.add('twic');
				changeResultText('auth_in_progress');
				pinWrapperElement.appendChild(resultElement);

				msg = new twic.Message();

				msg.type = 'auth';
				msg.data = {
					'pin': pinElement.innerText
				};

				msg.send( function(result) {
					if (undefined !== result['error']
						|| !result.name
					) {
						if (result['error'] === twic.global.ALREADY_AUTHENTICATED) {
							changeResultText('auth_already');
						} else {
							changeResultText('auth_failed');
						}
					} else {
						changeResultText('auth_success', result['name']);
					}
				} );
			} );
		}
	}

}() );
