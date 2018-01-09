var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function(){
    return gulp.src('styles/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('build/css'));
});

gulp.task('fonts', function() {
    return gulp.src(['styles/fonts/*.*'])
        .pipe(gulp.dest('build/fonts/'));
});

gulp.task('html', function() {
    return gulp.src(['*.html'])
        .pipe(gulp.dest('build/'));
});

gulp.task('build', ['html', 'sass', 'fonts']);

gulp.task('watch', function () {
    gulp.watch('styles/**/*.scss', ['sass']);

    gulp.watch('*.html', ['html']);
});

gulp.task('default', ['watch']);
