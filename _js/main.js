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
			'Firebase': 'firebase',

			//Backbone modules
			'Router': 'backbone/routers/router',
			'Output': 'backbone/views/output'
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

require(['Firebase', 'Backbone', 'Router', 'Output'],
	function(Firebase, Backbone, Router, Output) {
		var outputView = new Output();
		var router = new Router({
			outputView: outputView
		});
		Backbone.history.start({pushState: true});
});