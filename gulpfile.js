'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');


//scripts task
gulp.task('scripts',function(){
  console.log("it worked--->");
});
gulp.task('hello',function(){
  console.log("it worked again");
});

//min-js
gulp.task('min', function (){
    gulp.src('public/js/index.js')
        .pipe(rename({suffix:'.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('public/scripts'));
});


//default task
gulp.task('default',['scripts','hello','min']);
