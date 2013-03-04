define({
	/*
	 * Make it safe to use console.log always. I think Paul Irish had something to do with it.
	 */
	safeConsole: function() {
		(function(a){
			function b(){};
			var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(",");
			for(var d;!!(d=c.pop());) {
				a[d]=a[d]||b;
			}
		})(function(){
			try {
				console.log();
				return window.console;
			} catch(a) {
				return (window.console={});
			}
		}());
	}, 

	/*
	 * Simplified version of printf. Converts all values to strings
	 */
	printf: function(str) {
		for (var i = 1, l = arguments.length; i < l; i++) {
			str = str.replace(/%s/, String(arguments[i]));
		}
		return str;
	},

	/* 
	 * Turn a string of variable value pairs into an object.
	 * ie: #a=1&b=2&b=3&c=4=5 -> {a:'1', b:['2', '3'], c:5}
	 * It also removes a preceding '#' or '?' if one exists
	 * Complex strings like #a[b]=c are not supported.
	 */
	deparam: function(str) {
		var returnObject = {};
		if (('#?').indexOf(str[0]) > -1) {
			str = str.slice(1);
		}
		if (str) {
			str = str.split('&');
			for (var i in str) {
				var keyvar = str[i].split('=');
				var key = keyvar[0];
				if (returnObject[key] !== void 0) {
					if (typeof(returnObject[key]) === 'string') {
						var array = [];
						array.push(returnObject[key]);
						returnObject[key] = array;
					}
					returnObject[key].push(keyvar[keyvar.length - 1]);
				} else {
					returnObject[key] = keyvar[keyvar.length - 1];
				}
			}
		}
		return returnObject;
	},

	/* 
	 * Turn an object into a string of variable value pairs.
	 * ie: {a:'1', b:['2', '3'], c:5} -> a=1&b=2&b=3&c=4=5
	 * It also takes an optional string argument and appends to it.
	 * Complexe objects like {a: {b:'c'}} are not supported
	 */
	enparam: function(obj, str) {
		str || (str = '');
		function nextDelimiter() {
			var lastChar = str.substr(-1);
			if ('#?&'.indexOf(lastChar) > -1) return '';
			else return '&';
		}
		for (var i in obj) {
			if (str.length > 0) str += nextDelimiter();
			var key = i,
					val = obj[i];
			if (typeof(val) === 'string') {
				str += encodeURIComponent(key) + '=' + encodeURIComponent(val);
			} else if (val === void 0) {
				str += encodeURIComponent(key);
			} else if (val.length !== void 0) {
				for (var j = 0, k = val.length; j < k; j++) {
					if (str.length > 0) str += nextDelimiter();
					str += encodeURIComponent(key) + '=' + encodeURIComponent(val[j]);
				}
			}
		}
		return str;
	}
});