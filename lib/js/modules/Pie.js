/*---------∞
|  pie.js  |
∞---------*/
// automatic svg pie-charts
// add .pie to div
// use [data-pie-size] [data-slices] [data-flavors]
// use space seperated lists
	var Pie = (function() {
		var init = function() {
			$('div.pie').each(function() {
				var cut = $(this).data('pie-size').split('');
				if (cut[cut.length-1] === '%') cut[cut.length-1] = 'vw';
				var size = cut.join([,]);
				var slices = $(this).data('slices').split(' ');
				var flavors = $(this).data('flavors').split(' ');
				var lastpie = 0;

				$(this).css({width: size, height: size});
				$('head').append('<style>div.pie{overflow:hidden;border-radius:50%;}svg.pie{position:absolute;top:0;left:0;transform:rotate(-90deg)scale(2);}</style>');

				for (i = 0; i < slices.length; i++) {
					var percent = parseFloat(slices[i])+lastpie;
					var leftover = 100-percent;
					var baked = percent + ' ' + leftover;
					var svg = '<svg class="pie" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%"><g>';
					var pie = '<circle cx="32" cy="32" r="16" fill="none" stroke="' + flavors[i] + '" stroke-width="32" stroke-dasharray="' + baked + '"/>';
					var end = '</g></svg>'

					$(this).prepend(svg+pie+end);
					lastpie = percent;
				}
			});
		};

		return init();
	})();
