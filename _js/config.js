define(['Backbone'], function(Backbone) {
	var config = {
		firebaseRoot: 'https://zabinskas-bss.firebaseio.com',
		errorMsgs: {
			invalidAuthPayload: 'The authentication payload did not contain \'%s\'.',
			invalidLogin: 'Firebase authentication error: \'%s\''
		}
	};
	return config;
})