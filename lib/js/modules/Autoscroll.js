/*----------------∞
|  autoscroll.js  |
∞----------------*/
// smooth scroll to anchor points
	var Autoscroll = (function() {
		var init = function() {
			$(document).on('click', '[data-autoscroll]', scrollToAnchor);
		};

		var scrollToAnchor = function() {
			var anchor = $(this).attr('data-anchor');
			var dest = $(anchor).offset().top;
			$('html,body').animate({scrollTop: dest}, 800);
		};

		return init();
	})();
	