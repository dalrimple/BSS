define(['Backbone'], function(Backbone) {
	var SandboxView = Backbone.View.extend({
		events: {
			'click [data-fn=fetch]': 'fetchData',
			'click [data-fn=save]': 'saveData',
			'click [data-fn=update]': 'updateData',
			'click [data-fn=push]': 'pushData',
			'click [data-fn=delete]': 'removeData'
		},

		initialize: function() {
			//console.log('SandboxView.initialize()');
		},

		fetchData: function() {
			this.model.fetchData();
		},
		saveData: function() {
			this.model.saveData();
		},
		updateData: function() {
			this.model.updateData();
		},
		pushData: function() {
			this.model.pushData();
		},
		removeData: function() {
			this.model.removeData();
		}

	});

	return SandboxView;
});