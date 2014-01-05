( function() {

	var
		event, resultElement,
		pinWrapperElement = document.querySelector('#oauth_pin'),
		pinElement = document.querySelector('#oauth_pin code');

	function changeResultText() {
		resultElement.innerText = twic.i18n.translate.apply(twic.i18n.translate, arguments);
	}

	if (pinWrapperElement) {
		pinElement = pinWrapperElement.querySelector('code');

		if (pinElement) {
			resultElement = document.createElement('p');
			resultElement.classList.add('twic');
			changeResultText('auth_in_progress');
			pinWrapperElement.appendChild(resultElement);

			event = new twic.Event();

			event.type = 'auth';
			event.data = {
				'pin': pinElement.innerText
			};

			event.send( function(result) {
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
		}
	}

}() );
