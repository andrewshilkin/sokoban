var gulp = require('gulp'),
	lr = require('tiny-lr'),
	livereload = require('gulp-livereload'),
	concat = require('gulp-concat'), // Склейка файлов
	connect = require('gulp-connect'), // Webserver
    server = lr();

gulp.task('html', function(){
	return gulp.src('assets/templates/*.html')
		.pipe(gulp.dest('public'))
});

gulp.task('libs', function(){
	return gulp.src('assets/js/libs/**/*')
		.pipe(gulp.dest('public/js'))
});

gulp.task('js', function() {
    gulp.src(['assets/js/**/*.js', '!./assets/js/libs/**/*.js'])
        .pipe(concat('app.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/libs/**
        .pipe(gulp.dest('public/js'))
        .pipe(livereload(server)); // даем команду на перезагрузку страницы
});

gulp.task('http-server', function() {
  connect.server({
	port: 9000,
    livereload: true,
    root: ['public']
  });
  console.log('Server listening on http://localhost:9000');
});

gulp.task('images', function() {
    gulp.src('assets/img/**/*')
        .pipe(gulp.dest('public/img'))

});

gulp.task('data', function() {
    gulp.src('assets/data/**/*')
        .pipe(gulp.dest('public/data'))

});

gulp.task('watch', function() {
	gulp.run('html');
	gulp.run('data');
	gulp.run('images');
    gulp.run('js');
	
	// Подключаем Livereload
    server.listen(35729, function(err) {
        if (err) return console.log(err);

		gulp.watch('assets/*.html', function() {
            gulp.run('html');
        });
		gulp.watch('assets/data/**/*', function() {
            gulp.run('data');
        });
        gulp.watch('assets/img/**/*', function() {
            gulp.run('images');
        });
        gulp.watch('assets/js/**/*', function() {
            gulp.run('js');
        });
    });
    gulp.run('http-server');
});

gulp.task('build', function() {
	// html
   gulp.run('html')
   gulp.run('data')
	// image
   gulp.run('images')
   gulp.run('libs')
    // js
	gulp.run('js')

});

