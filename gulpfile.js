const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');

gulp.task('css', function() {
    console.log('minifying css.....');
    gulp.src('./assets/css');
})