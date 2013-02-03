define(['Backbone'], function(Backbone) {
	var Router = Backbone.Router.extend({

		routes: {
			'auth': 'auth',
			'(:par1)(/)(:par2)(/)(:par3)(/)*rest': 'main'
		},

		initialize: function(options) {
			console.log('Router.initialize()');
			var that = this;
			$('#profile').click(function(e) {
				e.preventDefault();
				that.getProfile();
			});
		},
		auth: function() {
			//console.log('Router.auth():', Backbone.history.location.hash);
			var hash = Backbone.history.location.hash;
			hash = hash.replace('#', '');
			hash = hash.split('&');
			var json = {}
			for (var i in hash) {
				var keyvar = hash[i].split('=');
				json[keyvar[0]] = keyvar[1];
			}
			console.log('Router.auth()', json);
			window.authResponse = json;

			//var dataRef = new Firebase('https://zabinskas-bss.firebaseio.com/');
			//window.authData = dataRef;

			window.me = new Firebase('https://zabinskas-bss.firebaseio.com/users/' + json.account);
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