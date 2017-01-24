const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const htmlreplace = require('gulp-html-replace');
const imagemin = require('gulp-imagemin');
const cleanCSS = require('gulp-clean-css');

gulp.task('bundle:js', function(){
	return gulp.src([
		'!server/public/scripts/vendor/*',
		'server/public/scripts/jtrivia.event.js',
		'server/public/scripts/jtrivia.timer.js',
		'server/public/scripts/jtrivia.event.js',
		'server/public/scripts/**/*.js', //timer, builder.
		'server/public/scripts/jtrivia.controller.js',
		'server/public/scripts/main.js'
	])
	.pipe(babel({presets: ['es2015']}))
	.pipe(concat('jtrivia.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('server/dist/'));
});

gulp.task('html', function(){
	return gulp.src('server/public/index.html')	
		.pipe(htmlreplace({
			'vendor': 'vendor.min.js',
			'app': 'jtrivia.min.js',
			'css': 'jtrivia.css'
		}))
		.pipe(gulp.dest('server/dist/'));
});

gulp.task('css', function(){
	return gulp.src('server/public/styles/jtrivia.css')
		.pipe(cleanCSS())
		.pipe(gulp.dest('server/dist/'));
});

gulp.task('images', function(){
	return gulp.src('server/public/assets/*')
		.pipe(imagemin())
		.pipe(gulp.dest('server/dist/assets/'));
});

gulp.task('vendor', function(){
	return gulp.src('server/public/vendor/*')
		.pipe(concat('vendor.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('server/dist/'));

});

gulp.task('build', ['bundle:js', 'html', 'css', 'images', 'vendor'], function(){});
