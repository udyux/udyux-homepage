/*--------------∞
|  gulpfile.js  |
∞--------------*/

var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var mqpacker = require('css-mqpacker');
var cssnano = require('cssnano');
var glob = require("glob");
var gulp = require('gulp');
var concat = require('gulp-concat');
var copy = require('gulp-copy');
var include = require('gulp-include');
var inject = require('gulp-inject-string');
var jshint = require('gulp-jshint');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var shell = require('gulp-shell');
var svgsprite = require('gulp-svg-sprite');
var uglify = require('gulp-uglify');
var alias = require('postcss-alias');
var atrules = require('postcss-alias-atrules');
var hexalpha = require('postcss-color-alpha');
var conditionals = require('postcss-conditionals');
var mediadefs = require('postcss-custom-media');
var propdefs = require('postcss-define-property');
var fakeid = require('postcss-fakeid');
var atimport = require('postcss-import');
var nested = require('postcss-nested');
var position = require('postcss-position-alt');
var pseudoinsert = require('postcss-pseudo-content-insert');
var pxtorem = require('postcss-pxtorem');
var selectors = require('postcss-custom-selectors');
var triangle = require('postcss-triangle');
var tinify = require('tinify');

var plumberErrorHandler = {
	errorHandler: function(err) {
  	console.log(err.toString());
  	this.emit('end');
	}
};


// ----- assets
	gulp.task('assets:font', function() {
		glob('./dev/assets/fonts/**/+(*.eot|*.otf|*.svg|*.ttf|*.woff)', function(er, files) {
			if (!er) {
				for (var font of files) {
					gulp.src(font).pipe(copy('./build/css/', {prefix: 4}));
				}
			}
		});
	});

	gulp.task('assets:graphic', function() {
		glob('./dev/assets/**/+(*.jpg|*.png)', function(er, files) {
			if (!er) {
				for (var img of files) {
					gulp.src(img).pipe(copy('./build/assets/', {prefix: 3}));
				}
			}
		});

		glob('./dev/assets/*.svg', function(er, files) {
			if (!er) {
				for (var svg of files) {
					gulp.src(svg).pipe(copy('./build/assets/', {prefix: 3}));
				}
			}
		});
	});

	gulp.task('assets:icon', function() {
		var config = {
			mode: {
				symbol: true
			}
		};
		return gulp.src('./dev/assets/svg-icons/*.svg')
			.pipe(svgsprite(config))
			.pipe(rename('icons.svg'))
			.pipe(gulp.dest('./build/assets/'));
	});

	gulp.task('assets:favicon', function() {
		return gulp.src('./dev/assets/favicon.ico').pipe(copy('./build/', {prefix: 2}));
	});

	gulp.task('assets', ['assets:font', 'assets:graphic', 'assets:icon', 'assets:favicon']);


// ----- index
	gulp.task('index', ['assets'], function() {
		return gulp.src('./dev/+(index.html|index.php)')
			.pipe(inject.afterEach('<i>', '<svg class="icon"><use xlink:href="assets/icons.svg#'))
			.pipe(inject.beforeEach('</i>', '"></use></svg>'))
			.pipe(gulp.dest('./build/'));
	});

	gulp.task('index:watch', ['index'], function() {
		browserSync.reload();
	});


// ----- src
	gulp.task('src:markup', function() {
		return gulp.src('./dev/src/**/+(*.html|*.php)')
			.pipe(inject.afterEach('<i>', '<svg class="icon"><use xlink:href="assets/icons.svg#'))
			.pipe(inject.beforeEach('</i>', '"></use></svg>'))
			.pipe(gulp.dest('./build/src/'));
	});

	gulp.task('src:data', function() {
		glob('./dev/src/**/*.json', function(er, files) {
			if (!er) {
				for (var file of files) {
					gulp.src(file).pipe(copy('./build/src/', {prefix: 4}));
				}
			}
		});
	});

	gulp.task('src', ['src:markup', 'src:data']);

	gulp.task('src:watch', ['src'], function() {
		browserSync.reload();
	});


// ----- css
	gulp.task('css:fonts', function() {
		return gulp.src('./dev/assets/fonts/**/styles.css')
			.pipe(concat('fonts.css'))
			.pipe(gulp.dest('./dev/css/parts/'));
	});

	gulp.task('css:build', ['css:fonts'], function() {
		var processors = [
			atimport,
			atrules({
				rules: {
					colors: 'alias',
					transitions: 'alias',
					fonts: 'alias'
				}
			}),
			position,
			alias,
			propdefs({
  			syntax: {
    			parameter: '?',
			   	variable: '?'
  			}
			}),
			mediadefs,
			selectors,
			conditionals,
			nested,
			triangle,
			pxtorem,
			hexalpha,
			pseudoinsert,
			mqpacker,
			autoprefixer,
			fakeid,
			cssnano
		];
		return gulp.src('./dev/css/postcss/source.css')
			.pipe(plumber(plumberErrorHandler))
			.pipe(postcss(processors))
			.pipe(rename('all.css'))
			.pipe(gulp.dest('./build/css/'));
	});

	gulp.task('css', ['css:build']);
	gulp.task('css:watch', ['css'], function() {
		browserSync.reload();
	});

// ----- js
	gulp.task('js:read', function() {
		return gulp.src('./dev/js/scripts.js')
			.pipe(inject.afterEach('require ', '../../lib/js/modules/'))
			.pipe(inject.beforeEach('require ', '//='))
			.pipe(jshint())
			.pipe(jshint.reporter('jshint-stylish'))
			.pipe(include())
			.pipe(gulp.dest('./tmp/'));
	});
	
	gulp.task('js:build', ['js:read'], function() {
		return gulp.src(['./lib/js/jQuery.js', './lib/js/Tools.js', './tmp/scripts.js'])
			.pipe(concat('package.js'))
			.pipe(uglify())
			.pipe(gulp.dest('./build/lib/js/'));
	});

	gulp.task('js', ['js:build'], shell.task(['rm -rf tmp']));
	gulp.task('js:watch', ['js'], function() {
		browserSync.reload();
	});


// ----- php
	gulp.task('php', function() {
		return gulp.src('./dev/php/**/*.php').pipe(copy('./build/lib/php/', {prefix: 4}));
	});

// ----- build
	gulp.task('build', ['index', 'src', 'css', 'js']);

// ----- live
	gulp.task('live', ['build'], function () {
		var project_path = __dirname.split('/');
		var project_name = 'localhost/' + project_path[project_path.length-1] + '/build';
    browserSync.init({
      proxy: project_name
    });

    gulp.watch('./dev/index.*', ['index:watch']);
    gulp.watch('./dev/src/+(*.html|*.php|*.json)', ['src:watch']);
    gulp.watch('./dev/css/*.css', ['css:watch']);
    gulp.watch('./dev/js/scripts.js', ['js:watch']);
	});

// ----- watch
	gulp.task('watch', ['build'], function() {
		gulp.watch('./dev/index.*', ['index']);
    gulp.watch('./dev/src/+(*.html|*.php|*.json)', ['src']);
    gulp.watch('./dev/css/*.css', ['css']);
    gulp.watch('./dev/js/scripts.js', ['js']);
	});
