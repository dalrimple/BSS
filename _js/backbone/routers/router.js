define(['Backbone', 'LoginModel'], function(Backbone, LoginModel) {
	var Router = Backbone.Router.extend({

		routes: {
			'auth': 'auth',
			'(:par1)(/)(:par2)(/)(:par3)(/)*rest': 'main'
		},

		initialize: function(options) {
			console.log('Router.initialize()');

			//Testing
			var that = this;
			$('#profile').click(function(e) {
				e.preventDefault();
				that.getProfile();
			});

		},
		auth: function() {
			console.log('Router.auth():', Backbone.history.location.hash);
			var authInfo = {};
			var hash = Backbone.history.location.hash.replace('#', '')
			if (hash) {
				hash = hash.split('&');
				for (var i in hash) {
					var keyvar = hash[i].split('=');
					authInfo[keyvar[0]] = _.last(keyvar);
				}
			}

			this.trigger('auth', authInfo);

			//console.log('Router.auth()', authInfo);
			//var dataRef = new Firebase('https://zabinskas-bss.firebaseio.com/');
			//window.authData = dataRef;

			return; //TESTING

			window.authResponse = authInfo;
			window.me = new Firebase('https://zabinskas-bss.firebaseio.com/users/' + authInfo.account);
			window.me.once('value', function(o) {console.log(o.val())});
		},
		getProfile: function() {
			//Log me in
			window.me.auth(window.authResponse.firebase, function(success) {
				if(success) {
					console.log("Login Successful!");
					window.me.once('value', function(o) {
						var profile = o.val();
						console.log('getProfile()', profile);
						if (profile) {
							console.log('getProfile() has profile');
						} else {
							console.log('getProfile() has no profile');
							$('#profileSave').click(function(e) {
								e.preventDefault();
								console.log('getProfile() saving');
								window.me.update({name:$('#profileName').val(), role:$('#profileRole').val()});
							})
						}
					});
				} else {
					console.log("Login Failed!");

				}
			});
			/*
			*/

		},
		main: function(par1, par2, par3, rest) {
			console.log('Router.main():', par1, par2, par3, rest);
		}
	});
	return Router;
});