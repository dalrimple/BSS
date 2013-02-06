define(['Firebase'], function(Firebase) {
	//Overwrite of the Backbone.sync method to use Firebase
	var sync = function(method, model, options) {
		options || (options = {});
		switch (method) {
			case 'create':
			break;

			case 'update':
			break;

			case 'delete':
			break;

			case 'read':
			break;
		}
	}
	return sync;
});