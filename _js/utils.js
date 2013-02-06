define([], function() {
	var utils = {
		// make it safe to use console.log always
		safeConsole: function() {
			(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
			(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());
		}, 

		printf: function(str) {
			for (var i = 1, l = arguments.length; i < l; i++) {
				str = str.replace(/%s/, String(arguments[i]));
			}
			return str;
		}

	};
	return utils;
});