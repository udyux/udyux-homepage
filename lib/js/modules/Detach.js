/*------------∞
|  detach.js  |
∞------------*/
// detach parallax effect
// use [data-setach] with ratio as value
// avoid ratios above .5
// use data-detach-reference to indicate parent element
	var Detach = (function() {
		var init = function() {
			var elems = $('[data-detach]');
			var total = elems.length;
			var ratios = [];
			var positions = [];
			var buffer = false;
			
			elems.each(function() {
				var reference = (!$(this).parents('[data-detach-reference]')) ? $(this) : $(this).parents('[data-detach-reference]');
				var ratio = parseFloat($(this).data('detach'));
				var position = reference.offset().top*-ratio;
				var place = 'translate3d(0,' + (window.scrollY*ratio+position) + 'px,0)';
				
				$(this).css({'transform': place});
				ratios.push(ratio);
				positions.push(position);
			});

			window.addEventListener('scroll', requestBuffer, false);
		};
		
		var requestBuffer = function() {
			if (!buffer) requestAnimationFrame(updateFrame);
			buffer = true;
		};
		
		var updateFrame = function() {
			buffer = false;
			var lastscroll = Scrolling.pos;
		
			for (i = 0; i < total; i++) {
				var render = 'translate3d(0,' + (lastscroll*ratios[i]+positions[i]) + 'px,0)';
				elems[i].style.transform = render;
			}
		};

		return init();
	})();
	
