define(['config', 'Firebase', 'Backbone'], function(config, Firebase, Backbone) {
	var User = Backbone.Model.extend({
		urlRoot: config.firebaseRoot + 'users/',
		defaults: {
			name: '',
			role: ''
		},

		initialize: function(options) {
			console.log('User.initialize();', this.url());
			
			this.firebase = new Backbone.Firebase(this, {
				initialize: function() {
					console.log('User.firebase.initialize()');
				}
			});

			this.on('change', this.changeListener);
		},

		//Functions
		loadUserData: function() {
			this.fetch();
		},

		//Listeners
		loggedInListener: function(model, authInfo) {
			console.log('User.loggedInListener()', authInfo.auth.account);
			this.id = authInfo.auth.account;
			this.loadUserData();
		},

		changeListener: function(model, options) {
			console.log('User.changeListener()', this.attributes);
		}

	});
	return User;
});