/*-------------∞
|  scripts.js  |
∞-------------*/

require Browser.js
require Prevent.js

var Bash = (function() {
	var State = (function() {
		var store = {};

		var request = {
			model: function(model) {
				store.model = model;
				store.n = -1;
				store.link = 0;
				store.input = 0;
				Control.data.config();
			},
			connection: function() {
				var now = new Date();
				var ua = Browser.ua;
				var last = store.model.connection.last.replace(/#date/, now);
				var lastConnection = last.replace(/#ua/, ua);
				return [store.model.connection.established, lastConnection];
			},
			uaLang: function(lang) {
				var prefLang = store.model.connection.lang.replace(/#lang/, lang);
				store.text = store.model.lines[lang];
				return prefLang;
			},
			newLine: function() {
				if (store.n+1 === store.text.length) {
					return false;
				} else {
					store.n++;
					return store.model.newline;
				}
			},
			returnLine: function() {
				store.n++;
				return store.model.returnline;
			},
			nextChar: function() {
				var i = store.n;
				var str = store.text[i];
				var ltr = str[0];
				store.text[i] = str.replace(/./, '');
				return ltr;
			},
			nextLink: function() {
				var i = store.link;
				store.link++;
				return store.model.links[i];
			},
			form: function() {
				return store.model.forms;
			}
		};

		return {
			request: request
		};
	})();

	var Shell = (function() {
		var echo = function(str, callback) {
			$('#shell').append(str);
			var dispatch = (!callback) ? Control.data.parse() : callback();
		};

		var print = function(str) {
			var keyTime = Random.number(40,90);
			setTimeout(function() {
				$('.output').last().append(str);
				Control.data.parse();
			},keyTime);
		};

		return {
			echo: echo,
			print: print
		};
	})();

	var Control = (function() {
		var launch = function() {
			var n = Math.floor($(window).height()/6);
			for (i = 0; i < n; i++) {
				$('#switch').append('<div></div><div></div>');
				if (i+1 === n) {
					$('#switch').addState('on');
					setTimeout(data.load,1250);
				}
			}
		};

		var data = {
			load: function() {
				$('#shell').append('<output>Initializing <b><em>http://udy.io</em></b><span></span></output>');
				var initializing = setInterval(function() {
					$('#shell output span').append('.');
				},250);

				$.getJSON('src/output.json', function(json) {
					setTimeout(function() {
						clearInterval(initializing);
						$('#switch').remove();
						State.request.model(json);
					},1750);
				});
			},
			config: function() {
				$.get('lib/php/ua_lang.php', function(lang) {
					var connection = State.request.connection();
					var uaLang = State.request.uaLang(lang);
					var newLine = State.request.newLine();
					$('#shell').append(connection[0]);
					setTimeout(function() {
						$('#shell').append(connection[1]);
						setTimeout(function() {
							$('#shell').append(uaLang + '<br/>');
							setTimeout(function() {
								Shell.echo(newLine);
							},750);
						},500);
					},750);
				});
			},
			parse: function() {
				var nextChar = State.request.nextChar();
				switch (nextChar) {
					case ';':
						setTimeout(function() {
							var newLine = State.request.newLine();
							if (!newLine) {
								var forms = State.request.form();
								for (i = 0; i < forms.length; i++) {
									var callback = (i+1 === forms.length) ? $.noop : Control.data.inputs;
									Shell.echo(forms[i], callback);
								}
							} else {
								Shell.echo(newLine);
							}
						},400);
						break;
					case '^':
						var returnLine = State.request.returnLine();
						Shell.echo(returnLine);
						break;
					case '#':
						setTimeout(function() {
							var link = State.request.nextLink();
							Shell.print(link);
						},400);
						break;
					default:
						Shell.print(nextChar);
				}
				$('html,body').scrollTop($('html,body').prop('scrollHeight'));
			}
		};

		setTimeout(launch,1000);

		return {
			data: data
		};
	})();
})();
