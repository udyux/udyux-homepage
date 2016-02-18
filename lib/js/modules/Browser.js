/*-------------∞
|  Browser.js  |
∞-------------*/
// dectect and return UA navigator
var Browser = (function() {
	var uaGet = navigator.userAgent;
	var uaSet = (uaGet.indexOf('Firefox') > -1) ? 'Firefox':
							(uaGet.indexOf('rv:11' || 'MSIE') > -1) ? 'Internet Explorer':
							(uaGet.indexOf('Edge') > -1) ? 'Edge':
							(uaGet.indexOf('OPR') > -1) ? 'Opera':
							(uaGet.indexOf('Chrome') > -1) ? 'Chrome':
							(uaGet.indexOf('Safari') > -1) ? 'Safari':
							'Unknown browser';
	return {
		ua: uaSet
	};
})();
