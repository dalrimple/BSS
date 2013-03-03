define(['Backbone', 'LoginModel'], function(Backbone, LoginModel) {
	var LoginView = Backbone.View.extend({
		el: '#login',
		events: {
			'click [data-out] input': 'logout'
		},
		initialize: function() {
			//console.log('LoginView.initialize()', this);
			this.$outUI = this.$el.find('[data-out]').hide();
			this.$inUI = this.$el.find('[data-in]');

			this.listenTo(this.model, 'invalid', this.invalidListener);
			this.listenTo(this.model, 'loggedIn', this.loggedInListener);
			this.listenTo(this.model, 'loggedOut', this.loggedOutListener);
		},
		/*
		login: function() {

		},
		*/
		render: function() {
			//console.log('LoginView.render()', this.model);
		},

		invalidListener: function(model, error) {
			console.log('LoginView.invalidListener()', error);
			this.$el.find('.errors').html(error);
		},

		loggedInListener: function(model, authPayload) {
			this.$outUI.show();
			this.$inUI.hide();
		},
		loggedOutListener: function(model, authPayload) {
			this.$outUI.hide();
			this.$inUI.show();
		},

		logout: function() {
			console.log('LoginView.logout()');
			this.model.logout();
		}

	});
	return LoginView;
});