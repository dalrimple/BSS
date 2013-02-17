define(['config', 'Backbone'], function(config, Backbone) {
	
	var SandboxModel = Backbone.Model.extend({
		
		initialize: function() {
			console.log('SandboxModel.initialize()', this.attributes);
			this.on('all', this.showAttr);
			this.on('error', this.errorListener);
			//this.fireBaseRef = this.fetch();
			//this.on('change', this.changeListener);
			this.on('change', this.changeListener);

			//this.on('value child_added child_changed child_removed child_moved', this.firebaseListener);
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

		showAttr: function(eventName) {
			console.log('SandboxModel.showAttr()', eventName, this.attributes);
		}
	
	});

	return SandboxModel;
});