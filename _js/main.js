requirejs.config({
	//By default load any module IDs from the baseURL:
	//This isn't strictly necessary as this url in inferred by the data-main value of the require.js script tag
	baseUrl: '/_js', 

	paths: {
			//Major libraries
			'jQuery': '//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.0/jquery.min',
			'Underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.3/underscore-min',
			'Backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min',

			//Firebase hosted SaaS backend
			'Firebase': 'libs/firebase',

			//Backbone modules
			'sync': 'backbone/sync',
			'config': 'backbone/models/config',
			'LoginModel': 'backbone/models/login',
			'UserModel': 'backbone/models/user',
			'Router': 'backbone/routers/router',
			'LoginView': 'backbone/views/login',
			//Miscellaneous
			'utils': 'utils'
	},

	//These libraries don't follow AMD structures so the dependencies and exports value needs to be explicit
	shim: {
		'Backbone': {
			deps: ['jQuery', 'Underscore'],
			exports: 'Backbone'
		},
		'Firebase': {
			exports: 'Firebase'
		}
	}

});

require(['utils', 'Firebase', 'Backbone', 'LoginModel', 'UserModel', 'Router', 'LoginView'],
	function(utils, Firebase, Backbone, LoginModel, UserModel, Router, LoginView) {
		utils.safeConsole();
		
		//Router (First. The router can trigger events that are listened to by models and views)
		var router = new Router({});
		
		//Models (Second. They listen for events from the Router)
		var user = new UserModel({}, {router: router});
		var login = new LoginModel({}, {router: router});

		//Collections (Third. They're made up of models)
		
		//Views (Last. They listen to model & router events. They change models and trigger route navigation)
		var loginView = new LoginView({
			model: login,
			router: router
		});

		//Set up some listeners:
		login.listenTo(router, 'auth', login.routeListener);


		//Start the app
		Backbone.history.start({pushState: true});
});

