define(['Backbone'], function(Backbone) {
	var UserView = Backbone.View.extend({
		el: '#userdetails',
		events: {
			'click input[name=edit]': 'displayEdit',
			'click input[name=cancel]': 'hideEditUI',
			'click input[name=save]': 'save'
		},
		initialize: function(options) {
			//console.log('UserView.initialize()', this.$el);
			this.$nameDisplay = this.$el.find('[data-display=username]');
			this.$editButton = this.$el.find('input[name=edit]');
			this.$editDisplay = this.$el.find('[data-display=edit]');
			this.$editCancelButton = this.$el.find('input[name=cancel]');
			this.$nameInput = this.$el.find('input[name=username]');

			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'noUserSaved', this.displayEdit);
		},

		render: function() {
			//console.log('UserView.render', this);
			this.$nameDisplay.html(this.model.get('name'));
			this.$nameInput.val(this.model.get('name'));
		},

		displayEdit: function() {
			this.$nameDisplay.hide();
			this.$editDisplay.show();
			this.$editButton.hide();
		},
		hideEditUI: function() {
			this.$nameDisplay.show();
			this.$editDisplay.hide();
			this.$editButton.show();
		},

		save: function() {
			this.model.set({
				'name': this.$nameInput.val(),
			});
			this.model.saveUserData();

			this.hideEditUI();
		}
	});
	
	return UserView;
});