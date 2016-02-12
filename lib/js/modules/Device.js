/*------------∞
|  device.js  |
∞------------*/
// get same results as css media query breakpoints
// call Device.mobile Device.tablet
// returns true/false
	var Device = (function() {
		var buffer = false;
		var device = {
			lg: 0,
			md: 0,
			sm: 0
		};

		$('head').append('<style>#device-lg,#device-md,#device-sm{width:0;display:none;} @media (max-width:1025px){#device-lg{width:1px}} @media (max-width:775px){#device-md{width:1px}} @media (max-width:425px){#device-sm{width:1px}}</style>');
		$('body').append('<param id="device-lg"/><param id="device-md"/><param id="device-sm"/>');

		device.lg = $('#device-lg').width();
		device.md = $('#device-md').width();
		device.sm = $('#device-sm').width();

		var updateDevice = function() {
			if (!buffer) {
				buffer = true;
				device.lg = $('#device-lg').width();
				device.md = $('#device-md').width();
				device.sm = $('#device-sm').width();
				setTimeout(function() {
					buffer = false;
				},100);
			}
		};

		attachHandlers([[window,'resize',updateDevice]]);

		return {
			lg: device.lg,
			md: device.md,
			sm: device.sm
		};
	})();
