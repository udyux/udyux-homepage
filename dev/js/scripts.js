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
			input: function() {
				var i = store.input;
				var input = (i === store.model.inputs.length) ? false : store.model.forms[i] + store.model.inputs[i];
				store.input++;
				console.log('length: ' + store.model.inputs.length);
				console.log('passed: ' + store.input);
				return input;
			},
			end: function() {
				return store.model.end;
			}
		};

		return {
			request: request
		};
	})();

	var Shell = (function() {
		var echo = function(str, form) {
			$('#shell').append(str);
			var act = (!form) ? Control.data.parse() : $('.form').last().focus();
			$('main').scrollTop($('main').prop('scrollHeight'));
		};

		var print = function(str) {
			var keyTime = Random.number(40,90);
			setTimeout(function() {
				$('.output').last().append(str);
				Control.data.parse();
				$('main').scrollTop($('main').prop('scrollHeight'));
			},keyTime);
		};

		var mirror = function(e) {
			var val = $(this).val();
			var rel = $('[for="' + $(this).prop('id') + '"] pre');
			if (e.which === 9) {
				return false;
			} else if (e.which === 13 && e.shiftKey && $(this).is('textarea')) {
				$(this).siblings('button').click();
			} else {
				rel.text(val);
				$('main').scrollTop($('main').prop('scrollHeight'));
			}
		};

		return {
			echo: echo,
			print: print,
			mirror: mirror
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
								Input.init();
							} else {
								Shell.echo(newLine);
							}
						},300);
						break;
					case '#':
						setTimeout(function() {
							var link = State.request.nextLink();
							Shell.print(link);
						},125);
						break;
					default:
						Shell.print(nextChar);
				}
			},
			send: function() {
				$.ajax({
					url: 'lib/php/mailer.php',
					type: 'POST',
					data: {
						sender: $('#name').val(),
						reply: $('#email').val(),
						message: $('#msg').val()
					}
				})
				.done(function() {
					var end = State.request.end();
					Shell.echo(end, true);
					$('.form').last().blur();
					$('#shell').removeClass('ready');
				});
			}
		};

		setTimeout(launch,1000);

		return {
			data: data
		};
	})();

	var Input = (function() {
		var next = function() {
			var input = State.request.input();
			if (input) {
				Shell.echo(input, true);
			} else {
				Control.data.send();
			}
		};

		var focused = function() {
			if ($('#shell').hasClass('ready')) {
				$('.form').last().focus();
				$('#shell').removeClass('ready');
			}
		};

		var blurred = function() {
			$('#shell').addClass('ready');
		};

		var init = function() {
			var input = State.request.input();
			Shell.echo(input, true);
			$(document).on('keyup','input, textarea',Shell.mirror);
			$(document).on('keydown',focused);
			$(document).on('blur','input,textarea',blurred);
			$(document).on('click','button',next);
		};

		return {
			init: init
		};
	})();
})();
