define(['config', 'Firebase', 'Backbone'], function(config, Firebase, Backbone) {
	var UserModel = Backbone.Model.extend({
		urlRoot: config.firebaseRoot + 'users/',
		defaults: {
			name: '',
			exists: 0
		},

		initialize: function(options) {
			//console.log('UserModel.initialize();', this.url());
			
			//this.on('all', this.changeListener);
			//this.on('sync', this.syncListener);
		},

		//Functions
		loadUserData: function() {
			this.fetch({
				success: function(model, response, options) {
					//console.log('UserModel.loadUserData.success()', model.get('exists'));
					if (!model.get('exists')) model.trigger('noUserSaved', config.msgs.noUserForLogin);
				},
				error: function(model, ref, options) {
					//console.log('UserModel.loadUserData.error()', arguments);
				}
			});
		},

		saveUserData: function() {
			this.set('exists', 1, {silent: true}); //Only after a save event will exists be true;
			this.save();
		},

		//Listeners
		loggedInListener: function(model, authInfo) {
			this.id = authInfo.auth.account;
			//console.log('UserModel.loggedInListener()', this.url());

			//Set this.firebase here as the url() function will return the correct value now that 'id' is set 
			this.firebase = new Backbone.Firebase(this);
			this.loadUserData();
		},

		syncListener: function(model, options) {
			//console.log('UserModel.syncListener()', this.attributes);
		},

		changeListener: function(event, model, options) {
			console.log('UserModel.changeListener()', event, this.attributes);
		}

	});
	return UserModel;
});