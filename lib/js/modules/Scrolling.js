/*---------------∞
|  scrolling.js  |
∞---------------*/
// track scroll position and activity
// call Scrolling.pos Scrolling.idle
// idle returns false while scrolling
	var ScrollingTracker = (function() {
		Scrolling = {
			pos: 0,
			idle: true
		};
		
		var init = function() {
			window.addEventListener('scroll', updateScroll, false);
		};
		
		var updateScroll = function() {
			Scrolling.pos = window.scrollY;
			if (Scrolling.idle) Scrolling.idle = false;
			setTimeout(function() {
				if (window.scrollY === Scrolling.pos && !Scrolling.idle) Scrolling.idle = true;
			},350);
		};
		
		return init();
	})();
