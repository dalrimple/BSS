define(['config', 'Backbone', 'SandboxModel'], function(config, Backbone, SandboxModel) {
	var SandboxCollection = Backbone.Collection.extend({
		model: SandboxModel,
		url: config.firebaseRoot + '/sandbox/',

		initialize: function() {
			//console.log('SandboxCollection.initialize()');
			this.fetch({returnAs: 'snapshot', success: this.fetchSuccess, error: this.fetchError});
		},

		fetchSuccess: function(collection, response, options) {
			//console.log('SandboxCollection.fetchSuccess()', collection, response, options);
			console.log('SandboxCollection.fetchSuccess()');
		},

		fetchError: function(collection, ref, options) {
			console.log('SandboxCollection.fetchError()', collection, ref, options);
		}

	});

	return SandboxCollection;
});