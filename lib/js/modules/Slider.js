/*------------∞
|  slider.js  |
∞------------*/
// slider
// use data-slider with timer in ms as value
	var Slider = (function() {
		var init = function() {
			var running = true;
			$('[data-slider]').each(function() {
				var frame = $(this);
				var dur = parseInt(frame.data('slider'));
				var slide = frame.children();
				var track = {
					count: 0,
					total: slide.length
				};

				setInterval(function() {
					slide.eq(track.count).addState('live');
				},dur);

				setTimeout(function() {
					setInterval(function() {
						var reset = (track.count === 0) ? track.total-1 : track.count-1;
						slide.eq(track.count).removeState('live');
						slide.eq(track.count).addState('done');
						slide.eq(reset).removeState('done');
						track.count = (track.count+1 === track.total) ? 0 : track.count+1;
					},dur);
				},dur);
			});
		};
		return init();
	})();
