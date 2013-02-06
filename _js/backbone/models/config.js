define(['Backbone'], function(Backbone) {
	var config = new Backbone.Model({
		firebaseRoot: 'https://zabinskas-bss.firebaseio.com'
	});
	return config;
})