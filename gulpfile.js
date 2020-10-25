'use strict';

global.$ = {
	gulp: require('gulp'),
	gp: require('gulp-load-plugins')(),
	browserSync: require('browser-sync').create(),

};

//pug
$.gulp.task('pug', function(){
	return $.gulp.src('assets/templates/pug/*.pug')
	.pipe($.gp.pug({
		pretty: true
	}))
	.pipe($.gulp.dest('assets/templates'))
	.on('end', $.browserSync.reload);
});

//styles
$.gulp.task('css:dev', function(){
	return $.gulp.src('assets/templates/scss/**/*.scss')
	.pipe($.gp.sourcemaps.init())
	.pipe($.gp.sass().on('error', $.gp.sass.logError))//преобразование scss к css
	.pipe($.gp.autoprefixer({//добавление префиксов
		overrideBrowserslist: ['last 2 versions']
	}))
	.pipe($.gp.sourcemaps.write())//добавление карты кода
	.pipe($.gulp.dest('assets/templates/scss'))
	.pipe($.browserSync.reload({
		stream: true
	}));
});

$.gulp.task('css:build', function(){
	return $.gulp.src('assets/templates/scss/**/*.scss')
	.pipe($.gp.sass().on('error', $.gp.sass.logError))//преобразование scss к css
	.pipe($.gp.autoprefixer({//добавление префиксов
		browsers: ['last 2 versions']
	}))
	.pipe($.gp.csso())//минимизация
	.pipe($.gp.rename({ suffix: '.min' }))
	.pipe($.gulp.dest('assets/templates/scss'));
});


//scripts
$.gulp.task('scripts:dev', function(){
	return $.gulp.src('assets/templates/js/app.js')//подключение своего файла скриптов
	.pipe($.browserSync.reload({
		stream: true
	}));
});

$.gulp.task('scripts:build', function(){
	return $.gulp.src('assets/templates/js/app.js')
	.pipe($.gp.babel({
            presets: ['@babel/env']
        }))
	.pipe($.gp.jsmin())//минификация
    .pipe($.gp.rename({ suffix: '.min' }))
    .pipe($.gulp.dest('assets/templates/js/'));
});


//plugins css
$.gulp.task('css:plugins', function(){
	return $.gulp.src([
		'node_modules/reset-css/reset.css',
		//'node_modules/wowjs/css/libs/animate.css',
		'node_modules/owl.carousel/dist/assets/owl.carousel.min.css'
		])//подключение мин стилей
	.pipe($.gp.concatCss('plugins.css'))//объединение в один файл
	.pipe($.gp.csso())//минимизация
	.pipe($.gp.rename({ suffix: '.min' }))
	.pipe($.gulp.dest('assets/templates/scss'))
	.pipe($.browserSync.reload({
		stream: true
	}));
});

//plugins js
$.gulp.task('scripts:plugins', function(){
	return $.gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		//'node_modules/wowjs/dist/wow.min.js',
		'node_modules/owl.carousel/dist/owl.carousel.min.js',
		])//подключение мин скриптов плагинов
	.pipe($.gp.concat('plugins.min.js'))//объединение 
	.pipe($.gulp.dest('assets/templates/js'))
	.pipe($.browserSync.reload({
		stream: true
	}));
});

//images
$.gulp.task('images:dev', function () {
	return $.gulp.src('assets/templates/imgs/**/*.{png,jpg,gif,svg}')
		.pipe($.browserSync.reload({
				stream: true
			}));
});

//serve
$.gulp.task('serve', function() {
	$.browserSync.init({
		server: {
			baseDir: "./assets/templates/"
		}
	});

});

//watch
$.gulp.task('watch', function(){
	$.gulp.watch('assets/templates/pug/**/*.pug', $.gulp.series('pug'));
	$.gulp.watch('assets/templates/scss/**/**.scss', $.gulp.series('css:dev'));
	$.gulp.watch('assets/templates/js/**/**.js', $.gulp.series('scripts:dev'));
	$.gulp.watch('assets/templates/imgs/*', $.gulp.series('images:dev'));
});


$.gulp.task('dev', 
	$.gulp.series(
		$.gulp.parallel('pug','css:dev', 'scripts:dev', 'css:plugins','scripts:plugins','images:dev'),//сборка
		$.gulp.parallel('watch','serve')//отслеживание изменений
		));


$.gulp.task('build', 
	$.gulp.series(
		$.gulp.parallel('pug','css:build', 'scripts:build','css:plugins','scripts:plugins','images:dev')
		));