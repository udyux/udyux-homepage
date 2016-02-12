/*----------------∞
|  extensions.js  |
∞----------------*/

// attach event handlers
// use arrays within argument array
// eg. ['button','click',sendForm] || ['#email','focus',updateEmail,true]
	function attachHandlers(actions) {
		for (i = 0; i < actions.length; i++) {
			var act = actions[i];
			var dom = (act[act.length-1] === true) ? true : false;
			var target = act[0];
			var event = act[1];
			var action = act[2];
			(dom) ? $(document).on(event,target,action) : $(target).on(event,action);
		}
	}

// random utility
	var Random = {
	// return random hash for pattern where a=letter n=number
		hash: function(pattern) {
			var alpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
			var patternArray = pattern.split('');
			var hash = '';
			
			for (var i = 0; i < patternArray.length; i++) {
				hash += (patternArray[i] === 'a') ? alpha[Math.floor(Math.random()*25)] : Math.floor(Math.random()*10)+'';
				if (i+1 === patternArray.length) return hash;
			}
		},
	// return random number within a range
	// last arg true for inclusive max
		number: function(min,max,inclusive) {
			if (inclusive) {
				return Math.floor(Math.random()*(max-min+1))+min;
			} else {
				return Math.floor(Math.random()*(max-min))+min;
			}
		},
	// return a random item from array
		fromArray: function(array) {
			var pick = Random.number(0,array.length);
			return array[pick];
		}
	};

// parse milliseconds to readable format
	var msParse = {
	// returns hours, seconds, milliseconds and label object
	// label object contains singular and plural labels
		toAll: function(diff) {
			var hr = Math.floor(diff/3600000);
			var min = Math.floor(diff/60000-hr*60);
			var sec = Math.floor(diff/1000-hr*3600-min*60);
			var mil = diff-hr*3600000-min*60000-sec*1000;
			var h = (h === 1) ? 'hour' : 'hours';
			var m = (min === 1) ? 'minute' : 'minutes';
			var s = (sec === 1) ? 'second' : 'seconds';
			var ms = (mil === 1) ? 'millisecond' : 'milliseconds';
			var labels = {
				h: (hr === 1) ? 'hour' : 'hours',
				m: (min === 1) ? 'minute' : 'minutes',
				s: (sec === 1) ? 'second' : 'seconds',
				ms: (mil === 1) ? 'millisecond' : 'milliseconds'
			};
			
			return {
				hours: hr,
				minutes: min,
				seconds: sec,
				milliseconds: mil,
				label: labels
			};
		}
	};

// jQuery extensions
	$.fn.extend({
		hasState: function(state) {
			if (!state && $(this).attr('data-state')) {
				return false;
			} else if ($(this).attr('data-state')) {
				var list = $(this).attr('data-state').split(' ');
				var has = (list.indexOf(state) > -1) ? true : false;
				return has;
			} else {
				return false;
			}
		}, 
		addState: function(state) {
			if (state) {
				if (!$(this).attr('data-state')) {
					$(this).attr('data-state', state);
				} else {
					var list = $(this).attr('data-state').split(' ');
					var i = list.length;
					list.splice(i, 0, state);
					$(this).attr('data-state', list.join(' '));
				}
			}
		},
		removeState: function(state) {
			if (state && $(this).attr('data-state')) {
				var list = $(this).attr('data-state').split(' ');
				var i = list.indexOf(state);
				if (i > -1) {
					list.splice(i, 1);
					$(this).attr('data-state', list.join(' '));
				}
			}
		},
		toggleState: function(tog) {
			if ($(this).hasState(tog)) {
				$(this).removeState(tog);
			} else {
				$(this).addState(tog);
			}
		},
		clearState: function() {
			$(this).attr('data-state','');
		},
		allowTouch: function() {
			$(this).css({'pointer-events': ''});
		},
		preventTouch: function() {
			$(this).css({'pointer-events': 'none'});
		},
		toggleTouch: function() {
			if ($(this).css('pointer-events') === 'none') {
				$(this).css({'pointer-events': 'auto'});
			} else {
				$(this).css({'pointer-events': 'none'});
			}
		}
	});
