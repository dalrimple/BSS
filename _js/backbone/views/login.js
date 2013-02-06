define(['Backbone', 'LoginModel'], function(Backbone, LoginModel) {
	var LoginView = Backbone.View.extend({
		el: '#login',
		events: {
			'click .twitter': 'login'
		},
		initialize: function() {
			//console.log('LoginView.initialize()', this);
			this.listenTo(this.model, 'change', this.render);
		},
		login: function() {

		},
		render: function() {
			console.log('LoginView.render()', this.model);
		}
	});
	return LoginView;
});