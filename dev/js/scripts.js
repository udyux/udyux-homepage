/*-------------∞
|  scripts.js  |
∞-------------*/

require Prevent.js

var Bash = (function() {
	var shell = $('#shell');
	var returnLine = '<output><em>Udy-UX</em><b>:~</b>&nbsp;<u>bash$</u>&nbsp;<span></span><div>&nbsp;</div></output>';
	var newLine = '<output class="_line"><span></span><div>&nbsp;</div></output>';
	var line = 0;
	var type = 0;
	
	var output;
	var text;
	var lang;

	var initializing = setInterval(function() {
		shell.echo('.');
	},250);

	var init = function() {
		var Load = [
			'<output><u>Connection established</u> <a href="mailto:nicolas@udy.io">nicolas@udy.io</a></output>',
			'<output>Last connection: <b>' + new Date() + '</b> on <b>' + navigator.userAgent.split('/')[3].split(' ')[1] + '</b></output>',
			'<output>Checking UA Language preferences</output>'
		];
		setTimeout(function() {
			clearInterval(initializing);
			for (i = 0; i < Load.length; i++) shell.append(Load[i]);
			setTimeout(checkLang,600);
		},1750);
	};

	var checkLang = function() {
		$.ajax({
			url: '/xphp/ua_lang.php',
			type: 'POST'
		})
		.done(function(ua) {
			lang = (!ua || ua !== 'fr') ? 'en' : ua;
			shell.append('<output><b>load</b> [ <em>lang</em> => <u>' + lang + '</u> ]</output>');
			$.get('./content/output_' + lang + '.html', function(data) {
				output = data.trim().split('\n');
				setTimeout(requestNewLine,600);
			});
		});
	};

	var requestNewLine = function() {
		setTimeout(function() {
			if (line < output.length) {
				type = 0;
				text = output[line];
				if (text[0] !== '<') {
					shell.append(returnLine);
					setTimeout(typeLine,375);
				} else {
					setTimeout(printLine,375);
				}
				$('html,body').scrollTop($('html,body').prop('scrollHeight'));
				line++;
			} else {
				shell.addState('done');
			}
		},450);
	};

	var printLine = function() {
		shell.append(newLine);
		shell.echo(text);
		requestNewLine();
	};

	var typeLine = function() {
		if (type < text.length) {
			typeLetter(text[type]);
		} else {
			requestNewLine();
		}
	};

	var typeLetter = function(letter) {
		var typeV = Random.number(40,100);
		setTimeout(function() {
			shell.echo(letter);
			type++;
			typeLine();
		},typeV);
	};

	return init();
})();


var Contact = (function() {
	var shell = $('#shell');
	var i = 0;

	var init = function() {
		if (shell.hasState('done')) {
			shell.removeState('done');
			$('.contact').eq(i).focus();
		}
	};

	var detect = function() {
		if (!$('.contact').eq(i).hasState('focused')) {
			var form = ['Your email','&nbsp;Your name','&nbsp;&nbsp;&nbsp;Subject'];
			$('.contact').eq(i).addState('focused');
			shell.append('<output><b>' + form[i] + '</b> <=[ <span class="bash-input"></span><div>&nbsp;</div></output>');
			$('html,body').scrollTop($('html,body').prop('scrollHeight'));
		}
	};
	
	var mirror = function() {
		$('.bash-input').eq(i).html($(this).val());
	};
	
	var done = function() {
		i++;
		if (i < $('.contact').length) {
			$('.contact').eq(i).focus();
		} else {
			$('textarea').focus();
		}
	};

	var startMsg = function() {
		if (!$('#msgMirror').length) {
			shell.append('<div id="msgMirror"><b>&nbsp;&nbsp;&nbsp;Message</b> <=[ <span><pre class="bash-input"><div>&nbsp;</div></pre></span></div>');
		}
	};

	var msgMirror = function() {
		$('pre').html($('textarea').val() + '<div>&nbsp;</div>');
		$('html,body').scrollTop($('body').prop('scrollHeight'));
	};

	attachHandlers([
		['body','keydown',init],
		['.contact','focus',detect],
		['textarea','focus',startMsg],
		['.contact','keyup',mirror],
		['textarea','keyup',msgMirror],
		['button','click',done]
	]);
})();
