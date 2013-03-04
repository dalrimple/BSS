define(['utils', 'Backbone', 'LoginModel'], function(utils, Backbone, LoginModel) {
	var LoginView = Backbone.View.extend({
		el: '#login',
		events: {
			'click [data-out] input': 'logout'
		},

		singly: {
			uri: 'https://api.singly.com/oauth/authenticate?',
			params: {
				client_id: '65ab7caa42476b137e5703bf1ad2e876',
				response_type: 'token',
				service: '',
				redirect_uri: ''
			}
		},

		initialize: function() {
			//console.log('LoginView.initialize()', this);
			this.$outUI = this.$el.find('[data-out]');
			this.$inUI = this.$el.find('[data-in]');

			this.render();

			this.listenTo(this.model, 'invalid', this.invalidListener);
			this.listenTo(this.model, 'loggedIn', this.loggedInListener);
			this.listenTo(this.model, 'loggedOut', this.loggedOutListener);
		},

		render: function() {
			//console.log('LoginView.render()', this.model);
			
			var that = this;
			this.$inUI.find('[data-service]').each(function(e) {
				$(this).click(function(e) {
					e.preventDefault();
					console.log($(e.target));
					var service = $(e.target).parent('[data-service]').attr('data-service');
					that.login.apply(that, [service]);
				});
			});
		},

		//Functions
		login: function(service) {
			var params = _.clone(this.singly.params);
			params.service = service;
			//params.redirect_uri = window.location.protocol + '//' + window.location.hostname + window.location.pathname;
			params.redirect_uri = window.location.protocol + '//' + window.location.hostname + '/auth';
			var singlyEndpoint = utils.enparam(params, this.singly.uri);
			window.location = singlyEndpoint;
		},
		logout: function() {
			console.log('LoginView.logout()');
			this.model.logout();
		},

		//Event Listeners
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
		}

	});
	return LoginView;
});