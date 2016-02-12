/*-------------∞
|  prevent.js  |
∞-------------*/
// prevent default behavior for anchors and submits
	var Prevent = (function() {
		var init = function() {
			$(document).on('click', 'a[href^="#"], form button, input[type="submit"]', false);
		};
		return init();
	})();
	