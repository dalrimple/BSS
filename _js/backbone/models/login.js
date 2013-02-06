define(['Backbone', 'config', 'utils'], function(Backbone, config, utils) {
	var LoginModel = Backbone.Model.extend({
		defaults: {
			firebase: '',
			access_token: '',
			account: ''
		},

		initialize: function(attributes, options) {
			console.log('LoginModel.initialize()', this.attributes, options);

			this.router = options.router; //TODO: Rather than passing the router, attach listeners in main.js
			this.listenTo(this.router, 'auth', this.routeListener);

			// Event listeners
		},

		validate: function(attributes, options) {
			console.log('LoginModel.validate()', attributes, options);
			for (var i in this.defaults) {
				if (attributes[i] === this.defaults[i]) {
					return utils.printf(config.errorMsgs.invalidAuthPayload, i);
				}
			}
		},

		routeListener: function(params) {
			console.log('LoginModel.routeListener()', params);
			this.set(params, {validate: true});
		},


	});
	return LoginModel;
});