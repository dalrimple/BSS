define(['config', 'Backbone'], function(config, Backbone) {
	
	var SandboxModel = Backbone.Model.extend({
		urlRoot: config.firebaseRoot + '/sandbox/',
		//id: '-InX4zQ6FWshbN38YxN8',

		initialize: function(attributes, options) {
			this.id = options.id; // Required as there is not an id value in the passed attributes 
<<<<<<< HEAD
			//console.log('SandboxModel.initialize()', this.attributes, this.id);
=======
			console.log('SandboxModel.initialize()', this.attributes, this.id);
>>>>>>> de2e47036a272b3318b77b58e7818642b5d2b6c8

			//this.on('all', this.showAttr);
			this.on('error', this.errorListener);
			//this.on('change', this.changeListener);

			//this.on('value child_added child_changed child_removed child_moved', this.firebaseListener);

			/*
			this.firebase = new Backbone.Firebase(this, {
				initialize: function() {
					console.log('SandboxModel.firebase.initialize()');
				}
			});
			*/

			//TODO: Add a way to pass in a Firebase reference rather than looking for the url
			this.firebase = new Backbone.Firebase(this, {
				initialize: function() {
<<<<<<< HEAD
					//console.log('SandboxModel.firebase.initialize()');
=======
					console.log('SandboxModel.firebase.initialize()');
>>>>>>> de2e47036a272b3318b77b58e7818642b5d2b6c8
				}
			});
			/*
			*/

			/*
			*/
			var valueListener = function(snapShot) {
<<<<<<< HEAD
				console.log('SandboxModel.on(value)', snapShot.val());
			};
			this.firebase.on('value', valueListener, this);
=======
				//console.log('SandboxModel.on(value)', snapShot.val());
			};
			this.firebase.once('value', valueListener, this);
>>>>>>> de2e47036a272b3318b77b58e7818642b5d2b6c8
			//this.firebase.on('value', listener, window);

			//this.fetch();
			this.on('sync', this.syncListener);
		},

		setData: function(data) {
			//var data = {bbb: {b2: 'b', c2: 'c', d2: {e2: 'e', f2:'f'}}, bbb2:'bbb2'};
			this.routerData = data;
			//console.log('SandboxModel.saveData()', this.attributes);
		},

		firebaseListener: function() {
			console.log('SandboxModel.firebaseListener()');
		},

		saveData: function() {
			this.set(this.routerData);
			var options = {};
			if (this.isNew()) options.url = config.firebaseRoot + '/sandbox/';
			this.save(this.attributes, options);
		},
		fetchData: function() {
			console.log('SandboxModel.fetchData()', this.attributes);
			this.fireBaseRef = this.fetch({url: config.firebaseRoot + '/sandbox/'});
		},
		updateData: function() {
			this.set(this.routerData);
			var options = {deep: true};
			this.save(this.attributes, options);
		},
		pushData: function() {
			this.set(this.routerData);
			var options = {push:true};
			if (this.isNew()) options.url = config.firebaseRoot + '/sandbox/';
			this.save(this.attributes, options);
		},
		removeData: function() {
			this.destroy(this.attributes);
		},

		changeListener: function(model, syncOptions) {
			console.log('SandboxModel.changeListener()', this.id, this.firebase, model.attributes);
		},

		errorListener: function(fireBaseRef) {
			console.log('SandboxModel.errorListener()', fireBaseRef);
		},

		syncListener: function() {
			console.log('SandboxModel.syncListener()', this.attributes);
			//console.log('SandboxModel.showAttr()', eventName);
		},

		showAttr: function(eventName) {
			console.log('SandboxModel.showAttr()', eventName, this.attributes);
			//console.log('SandboxModel.showAttr()', eventName);
		}
	
	});

	return SandboxModel;
});