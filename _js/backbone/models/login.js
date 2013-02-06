define(['Backbone'], function(Backbone) {
	var LoginModel = Backbone.Model.extend({
		initialize: function(attributes, options) {
			console.log('LoginModel.initialize()', this.attributes, options);
			this.router = options.router;

			this.listenTo(this.router, 'auth', this.routeListener);
		},
		routeListener: function(params) {
			console.log('LoginModel.routeListener()', params);
			//TODO: Trigger a valication step and handle success and failure
		}
	});
	return LoginModel;
});