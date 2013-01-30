define(['Backbone'], function(Backbone) {
	var Router = Backbone.Router.extend({

		routes: {
			'auth': 'auth',
			'(:par1)(/)(:par2)(/)(:par3)(/)*rest': 'main'
		},

		initialize: function(options) {
			this.logger = options.outputView;
			//console.log('Router.initialize()');
		},
		auth: function() {
			this.logger.log(Backbone.history.location.hash);
			var hash = Backbone.history.location.hash;
			hash = hash.replace('#', '');
			hash = hash.split('&');
			var json = {}
			for (var i in hash) {
				var keyvar = hash[i].split('=');
				json[keyvar[0]] = keyvar[1];
			}
			console.log('Router.auth()', json.firebase);

			var dataRef = new Firebase("https://zabinskas-bss.firebaseio.com/");
			//return;
			//Log me in
			dataRef.auth(json.firebase, function(success) {
				if(success) {
					console.log("Login Successful!");
				} else {
					console.log("Login Failed!");
				}
			});


		},
		main: function(par1, par2, par3, rest) {
			//console.log('Router.main():', par1, par2, par3, rest);
			this.logger.log(par1, par2, par3, rest);
			this.logger.log('blah');
		}
	});
	return Router;
})