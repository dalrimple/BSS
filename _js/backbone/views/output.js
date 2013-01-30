define(['Backbone', 'jQuery'],
function(Backbone, $) {
	var Output = Backbone.View.extend({
		el: '#output',
		initialize: function() {
			//console.log('Output.initialize()');
		},
		render: function(html) {
			this.$el.append(html);
		},
		log: function() {
			var html = '';
			var first = true; 
			for (var arg in arguments) {
				if (first) first = false;
				else html += ', ';
				html += String(arguments[arg]);
			}
			html += '<br />';
			this.render(html);
		}
	});
	return Output;
});