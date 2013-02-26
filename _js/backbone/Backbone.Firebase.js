define(['Backbone', 'Firebase'], function(Backbone, Firebase) {
	/*
	 * Backbone extension to integrate Firebase as the persistance layer
	 * The idea is to create instances of Backbone.Firebase within a model
	 * or collection that allows that model to save data to Firebase and
	 * listen to events on Firebase endpoints to be updated with new data.
	 */

	var MSGS = {
		noModel: 'A Model or Collection must be passed as the first parameter.',
		noUrl: 'The Model or Collection has no url property'
	};
	var FB_EVENTS = ['value', 'child_added', 'child_changed', 'child_removed', 'child_moved'];

	//Reference helper functions
	var createByPush = function(ref, model, options) {
		//firebaseRef.push() is the only action to return a reference.
		var pushRef = ref.push(model.attributes, function(error) {
			if (error) {
				options.error(error);
			} else {
				ref = pushRef; //If successful, update the firebase reference to the new firebase reference.
				options.success();
			}
		});
	}
	var createBySet = function(ref, model, options) {
		ref.setWithPriority(model.attributes, options.priority, function(error) {
			if (error) options.error(error);
			else options.success();
		});
	}
	var createByPrioritySet = function(ref, model, options) {
		ref.set(model.attributes, function(error) {
			if (error) options.error(error);
			else options.success();
		});			
	}
	var deepUpdate = function(ref, model, options) {
		//console.log('sync.deepUpdate()', model, options);
		//Any key not in model.attributes will not be overwritten, regardless of depth in Firebase
		var totalUpdates = 0,
				updatesSuccessfull = true,
				latestError = false;
		var recursiveUpdater = function(ref, attr) {
			var updateObj = {},
					hasProperties = false;
			for (var i in attr) {
				if (typeof(attr[i]) === 'object') {
					recursiveUpdater(ref.child(i), attr[i]);
				} else {
					updateObj[i] = attr[i];
					hasProperties = true;
				}
			}
			if (hasProperties) {
				totalUpdates++;
				//console.log('sync.recursiveUpdater()', ref, updateObj);
				ref.update(updateObj, recursionCompleter);
			}
		};
		//Call success() or error() only when all recursive updates are complete
		var recursionCompleter = function(error) {
			//console.log('sync.recursionCompleter()', totalUpdates, error);
			latestError = error ? error : false; //Ensure an error object is available to pass if one exists
			updatesSuccessfull = updatesSuccessfull && !error;
			if (--totalUpdates === 0) {
				!updatesSuccessfull ? options.error(latestError) : options.success();
			}
		}
		recursiveUpdater(ref, model.attributes);
	}
	var update = function() {
		//console.log('sync.update()');
		ref.update(model.attributes, function(error) {
			error ? options.error(error) : options.success();
		});
	}
	var destroy = function(ref, model, options) {
		//console.log('sync.destory()');
		ref.remove(function(error) {
			error ? options.error(error) : options.success();
		});
	}
	var read = function(ref, model, options) {
		//console.log('sync.read()', ref, model, options);
		ref.once('value', function(snapshot) {
			options.success(snapshot);
		});
	}

	Backbone.Firebase = function(model, options) {
		//Make sure there is a Backbone Model or Collection to work with
		if (!model || !(model instanceof Backbone.Model || model instanceof Backbone.Collection)) throw (MSGS.noModel);
		this.model = model;

		//Validate that options are passed in correctly
		this.options = _.isObject(options) ? options : {};

		//Store the Firebase reference
		var ref = this._ref = new Firebase(this.url());

		//Add a parsing function to the model designed for handling Firebase responses
		_.extend(this.model, {parse: function(resp, options) {
				//console.log('sync.model.parse()', this);
				if (_.isFunction(options.parse)) return options.parse.apply(this, [resp, options]);
				if (this instanceof Backbone.Model) {
					//console.log('sync.model.parse():model', this);
					return resp.val();
				} else if (this instanceof Backbone.Collection) {
					var array = [];
					var that = this;
					resp.forEach(function(childSnapShot) {
						//console.log('sync.model.parse():collection', that);
						var newModel = new that.model(childSnapShot.val(), {id: childSnapShot.name()});
						newModel.firebase = new Backbone.Firebase(newModel);
						array.push(newModel);
					});
					return array;
				}
				return resp;
			}
		});

		//Overwrite the sync method of the model
		this.model.sync = function(method, model, options) {
			options || (options = {});
		
			var successFn = options.success;
			options.success = function(resp) {
				if (successFn) successFn(model, resp, options);
				model.trigger('sync', model, resp, options);
				//console.log('sync success', resp, model);
			};

			var errorFn = options.error;
			options.error = function(ref) {
				//options.firebaseRef = ref;
				if (errorFn) errorFn(model, ref, options);
				model.trigger('error', model, ref, options);
				console.log('sync error', ref, model);
			};

			
			switch (method) {
				//If a model doesn't have an 'id' value, this will be used.
				case 'create':
					//Check to see if model is part of a collection or has explicit push instructions 
					//var push = _.has(options, 'push') ? options.push : !!model.collection;
					var push = model instanceof Backbone.Collection;
					if (push) {
						createByPush(ref, model, options);
					} else {
						//If not being pushed, just set the values.
						//if (_.has(options, 'priority')) {
						//	createByPrioritySet();
						//} else {
							createBySet(ref, model, options);
						//}
					}
					break;

				//If a model does have an 'id', update is used.
				case 'update':
					if (options.deep) {
						// Any key not in model.attributes will not be overwritten, regardless of depth in Firebase
						deepUpdate(ref, model, options);
					} else {
						// Normal firebase update behavior
						update(ref, model, options);
					}
					break;

				//Remove the Firebase location
				case 'delete':
					destroy(ref, model, options);
					break;

				//Read the Firebase location
				case 'read':
					//returnAs options are 'snapshot', 'export', 'val' (default)
					read(ref, model, options);
					break;	
			}
		}

		//Create a map of callbacks that can be passed to this.on and callbacks that are passed to the Firebase ref. 
		this._firebaseCallbacks = [];
		
	};

	_.extend(Backbone.Firebase.prototype, Backbone.Events, {
		limit: function() {
			//TODO: Implement a way to create a query and attach events to it.
		},

		on: function(name, callback, context) {
			//Validate params for Firebase
			if (_.indexOf(FB_EVENTS, name) === -1) return this;
			if (!_.isFunction(callback)) return this;
			
			//Trigger the default Backbone.Events.on behavior
			//A unique id is required to prefent Firebase triggering every <name> callback for every <name> event 
			var eventId = _.uniqueId();
			Backbone.Events.on.apply(this, [name + ':' + eventId].concat(_.rest(arguments)));

			//Route the Firebase.on events to the callbacks set on an instance of this
			var firebaseCallback = this._ref.on(name, function() {
				Backbone.Events.trigger.apply(this, [name + ':' + eventId].concat(_.toArray(arguments)));
			}, this);
			
			//Track the callbacks associated to the Firebase ref.
			this._firebaseCallbacks.push({
				name: name,
				id: eventId,
				firebase: firebaseCallback,
				callback: callback,
				context: context,
			});

			return this;
		},

		once: function(name, callback, context) {
			//Basically using on and putting off in the callback but using the convenience of Firebase.once.
			var eventId = _.uniqueId();
			Backbone.Events.on.apply(this, [name + ':' + eventId].concat(_.rest(arguments)));
			var onceArguments = arguments;
			this._ref.once(name, function(snapshot) {
				Backbone.Events.trigger.apply(this, [name + ':' + eventId].concat(_.toArray(arguments)));
				Backbone.Events.off.apply(this, [name + ':' + eventId].concat(_.rest(onceArguments)));
			}, this);
		},

		off: function(name, callback, context) {
			//Create an object to pass to _.where
			var searchProps = {};
			!name || (searchProps.name = name);
			!callback || (searchProps.callback = callback);
			!context || (searchProps.context = context);
			var removals = _.where(this._firebaseCallbacks, searchProps);

			//Loop over the results of the search and remove event handlers from Firebase and this._events.
			for(var i = 0, l = removals.length; i < l; i++) {
				var ev = removals[i];
				this._ref.off(ev.name, ev.callback, this);
				Backbone.Events.off.apply(this, [ev.name + ':' + ev.id, ev.callback, ev.context]);
			}

			return this;
		},

		listenTo: function(other, event, callback) {
			//TODO: Implement this so that a Firebase function (probably save) can be triggered by an event
			Backbone.Events.listenTo.apply(this, arguments);
		},
		stopListening: function(other, event, callback) {
			//TODO: Implement this with the listenTo() function
			Backbone.Events.stopListening.apply(this, arguments);
		},

		//Get the url from the model or collection
		url: function() {
			try {
				return _.result(this.model, 'url');
			} catch (error) {
				throw (MSGS.noUrl);
			}
		}
	});

});