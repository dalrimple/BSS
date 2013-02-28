define(['config', 'Backbone', 'SandboxModel'], function(config, Backbone, SandboxModel) {
	var SandboxCollection = Backbone.Collection.extend({
		model: SandboxModel,
		url: config.firebaseRoot + '/sandbox/',

		initialize: function() {
			//console.log('SandboxCollection.initialize()', this);

			this.firebase = new Backbone.Firebase(this, {
				initialize: function() {
					console.log('SandboxCollection.firebase.initialize()');
				}
			});

			//this.fetch({success: this.fetchSuccess, error: this.fetchError});
			this.firebase.endAt(null, '-InX53JG7Jwwc5qvMhKU').limit(1).on('child_added', this.child_addedListener, this);
			//this.firebase.limit(2).on('child_added', this.child_addedListener, this);
			//this.firebase.on('child_added', this.child_addedListener, this);
		},

		fetchSuccess: function(collection, response, options) {
			console.log('SandboxCollection.fetchSuccess()', collection, response, options);
			//console.log('SandboxCollection.fetchSuccess()');
		},

		fetchError: function(collection, ref, options) {
			console.log('SandboxCollection.fetchError()', collection, ref, options);
		},

		child_addedListener: function(childSnapshot, prevChildName) {
			console.log('SandboxCollection.child_addedListener()', childSnapshot.ref().name(), prevChildName);
			//this.add(childSnapshot.val(), {id: childSnapshot.name(), firebaseRef: childSnapshot.ref()});
			this.add(new this.model(childSnapshot.val(), {id: childSnapshot.ref().name()}));
		}

	});

	return SandboxCollection;
});