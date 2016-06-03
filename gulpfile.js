'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var minifyejs = require('gulp-ejsmin');
var minifyhtml = require('gulp-htmlmin');


//min-js
gulp.task('min-js', function (){
    gulp.src('public/js/index.js')
        .pipe(rename({suffix:'.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./bundle/js'));
});

//min-css
gulp.task('min-css', function(){
  gulp.src('public/css/**/*.css')
  .pipe(rename({suffix:'.min'}))
  .pipe(minifycss({keepSpecialComments: 1}))
  .pipe(gulp.dest('./bundle/css'));
});

//
gulp.task('min-ejs-html', function () {
    gulp.src('public/views/*.ejs')
        .pipe(rename({suffix:'.min'}))
        .pipe(minifyejs({removeComment: true}))
        .pipe(gulp.dest('./bundle'));
    gulp.src('views/users/*.ejs')
        .pipe(rename({suffix:'.min'}))
        .pipe(minifyejs({removeComment: true}))
        .pipe(gulp.dest('./bundle/views/users'));
    gulp.src('views/*.ejs')
        .pipe(rename({suffix:'.min'}))
        .pipe(minifyejs({removeComment: true}))
        .pipe(gulp.dest('./bundle/views/'));
});

//default task
gulp.task('default',['min-ejs-html']);
