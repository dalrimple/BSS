define(['config', 'utils', 'Backbone', 'Firebase'], function(config, utils, Backbone, Firebase) {
	
	var LoginModel = Backbone.Model.extend({
		defaults: {
			firebase: '',
			access_token: '',
			account: ''
		},

		initialize: function(attributes, options) {
			//console.log('LoginModel.initialize()', this.attributes, options);
			this.firebaseRef = new Firebase(config.firebaseRoot);
			this.on('change:firebase', this.tokenChangeListener);
		},

		//Listens for the authData event from the router.
		authDataListener: function(params) {
			//console.log('LoginModel.authDataListener()', params);
			this.set(params, {validate: true});
		},
		validate: function(attributes, options) {
			//console.log('LoginModel.validate()', attributes, options);
			for (var i in this.defaults) {
				if (attributes[i] === this.defaults[i]) {
					return utils.printf(config.errorMsgs.invalidAuthPayload, i);
				}
			}
		},

		//Once the login attributes are updated from 'this.set' authenticate the Firebase reference 
		tokenChangeListener: function() {
			//console.log('LoginModel.tokenChangeListener()', this, !!this.get('firebase'));
			if (!this.get('firebase')) {
				this.firebaseRef.unauth();
				this.trigger('loggedOut', this);
			} else {
				this.firebaseRef.auth(this.get('firebase'), this.authenticateComplete(), this.authenticateCancel);
			}
		},
		
		//After Firebase has authenticated, trigger an 'invalid' error or 'loggedIn' step.
		authenticateComplete: function() {
			var that = this;
			return function(error, authPayload) {
				//console.log('LoginModel.authenticateComplete()', error, authPayload);
				if (error) {
					that.trigger('invalid', that, utils.printf(config.errorMsgs.invalidLogin, error.code));
				} else {
					that.trigger('loggedIn', that, authPayload);
				}
			}
		},
		authenticateCancel: function(error) {
			console.log('LoginModel.authenticateCancel()', error);
		},

		logout: function() {
			console.log('LoginModel.logout()');
			this.set(this.defaults);
			this.trigger('loggedOut', this, authPayload);
		}

	});
	
	return LoginModel;

});