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

gulp.task('build', ['css', 'fonts']);

gulp.task('watch', function () {
    gulp.watch('styles/**/*.scss', ['sass']);
});

gulp.task('default', ['watch']);
