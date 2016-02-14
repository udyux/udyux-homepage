/*-------------∞
|  scripts.js  |
∞-------------*/

require Prevent.js

var Bash = (function() {
	

	var Shell = (function() {
		
		var run = function() {
			var lastDate = Output.run.last.replace(/#date/, new Date());
			var lastMsg = lastDate.replace(/#ua/, navigator.userAgent.split('/')[3].split(' ')[1]);
			$('#shell').append(Output.run.connected);
			$('#shell').append(lastMsg);
			checkLang();
		};

		var echo = function() {
			var str = text[line];
			if (str.length) {
				var ltr = str[0];
				if (ltr === '`') {
					str = str.replace(/./, '');
					link = true;
					var tag = str.split('`')[0].split('^');
					$('#shell output:last-of-type span').append(tag[0] + tag[2]);
					str = str.replace(/`.*?`/, tag[1] + '*');
					keyOut(str[0]);
					text[line] = str.replace(/./, '');
				} else if (ltr === '*') {
					str = str.replace(/./, '');
					link = false;
					keyOut(str[0]);
					text[line] = str.replace(/./, '');
				} else {
					keyOut(ltr);
					text[line] = str.replace(/./, '');
				}
			} else {
				feedLine();
			}
		};

		return {
			power: power,
			echo: echo,
			run: run
		};
	})();

	var checkLang = function() {
		$('#shell').append(Output.run.check_lang);
		
		$.ajax({
			url: 'lib/php/ua_lang.php',
			type: 'POST'
		})
		.done(function(lang) {
			var echoLang = Output.run.echo_lang.replace(/#lang/, lang);
			$('#shell').append(echoLang);
			text = (lang === 'fr') ? Output.txt.fr : Output.txt.en;
			feedLine(true);
			console.log(text);
		});
	};

	var feedLine = function(first) {
		link = false;
		line = (first) ? 0 : line+1;
		$('#shell').append(Output.line.n);
		Shell.echo();
	};

	var keyOut = function(ltr) {
		var keyTime = Random.number(40,100);
		var sh = (link) ? $('#shell output:last-of-type span') : $('#shell output:last-of-type span a:last-of-type');
		setTimeout(function() {
			sh.append(ltr);
			Shell.echo();
		},keyTime);
	};

	setTimeout(Shell.power,1000);

})();
