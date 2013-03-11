define(['Backbone'], function(Backbone) {
	var config = {
		firebaseRoot: 'https://zabinskas-bss.firebaseio.com/',
		msgs: {
			invalidAuthPayload: 'The authentication payload did not contain \'%s\'.',
			invalidLogin: 'Firebase authentication error: \'%s\'',
			noUserForLogin: 'No user profile has been saved for this login. Please enter a username.'
		}
	};
	return config;
})