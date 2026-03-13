'use strict';
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify-es').default;
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');
const minify = require('gulp-minify');
const minifyejs = require('gulp-ejs-minify')
// Gulp task to minify JavaScript files
gulp.task('scripts', function() {
    gulp.src('./public/javascripts/**/*.js')
        // Minify the file
        .pipe(uglify())
        // Output
        .pipe(gulp.dest('./dist/public/javascripts/')).on('error', gutil.log);
});
// Gulp task to copy other files
gulp.task('all-files', function() {
    gulp.src('./app.js').pipe(flatten()).pipe(gulp.dest('./dist'));
    gulp.src('./.env').pipe(flatten()).pipe(gulp.dest('./dist'));
    gulp.src('./package.json').pipe(flatten()).pipe(gulp.dest('./dist'));
    gulp.src('./config.js').pipe(flatten()).pipe(gulp.dest('./dist'));
    gulp.src('./db.js').pipe(flatten()).pipe(gulp.dest('./dist'));
    gulp.src('./package-lock.json').pipe(flatten()).pipe(gulp.dest('./dist'));
    gulp.src('./README.md').pipe(flatten()).pipe(gulp.dest('./dist'));
    gulp.src(['./fonts/**/']).pipe(gulp.dest('./dist/fonts'));

    gulp.src(['./blog/**/*']).pipe(gulp.dest('dist/blog'));

    gulp.src(['./public/img/**/*']).pipe(gulp.dest('./dist/public/img'));
    gulp.src(['./public/screenshots/**/*']).pipe(gulp.dest('./dist/public/screenshots'));
    
    gulp.src('./public/favicon.ico').pipe(flatten()).pipe(gulp.dest('./dist/public'));
    gulp.src('./public/favicon.png').pipe(flatten()).pipe(gulp.dest('./dist/public'));
    gulp.src('./public/favicon-32x32.png').pipe(flatten()).pipe(gulp.dest('./dist/public'));
    gulp.src('./public/google18721c5f78e431f0.html').pipe(flatten()).pipe(gulp.dest('./dist/public'));
    gulp.src('./public/sitemap.xml').pipe(flatten()).pipe(gulp.dest('./dist/public'));
    gulp.src('./public/robots.txt').pipe(flatten()).pipe(gulp.dest('./dist/public/'));

    // gulp.src(['./views/*.ejs'])
    // .pipe(minifyejs())
    // .pipe(gulp.dest('./dist/views'));

   gulp.src(['./views/**/*.ejs']).pipe(gulp.dest('./dist/views'));
    gulp.src(['./modules/**/*.js']).pipe(gulp.dest('./dist/modules'));
    gulp.src(['./public/stylesheets/**/*.css']).pipe(gulp.dest('./dist/public/stylesheets'));
    gulp.src(['./modules/locales/**/*.json']).pipe(gulp.dest('./dist/modules/locales'));

    gulp.src('./public/javascripts/**/*.js')
    // Minify the file
    .pipe(uglify())
    // Output
    .pipe(gulp.dest('./dist/public/javascripts/')).on('error', gutil.log);

    gulp.src(['./public/stylesheets/style.css', 
    './public/stylesheets/viewer.css',
    './public/stylesheets/font-montserrat-css.css', ])
        // Minify the file
        .pipe(csso())
        // Output
        .pipe(gulp.dest('./dist/public/stylesheets'))
});
// Gulp task to copy other styles
gulp.task('other-stylesheets', function() {
    gulp.src(['./public/stylesheets/**/*.css']).pipe(gulp.dest('./dist/public/stylesheets'));
});
gulp.task('styles', function() {
    gulp.src(['./public/stylesheets/**/*.css']).pipe(gulp.dest('./dist/public/stylesheets'));
    gulp.src(['./public/stylesheets/style.css', './public/stylesheets/font-montserrat-css.css', ])
        // Minify the file
        .pipe(csso())
        // Output
        .pipe(gulp.dest('./dist/public/stylesheets/css'))
});
// Gulp task to copy other pages
gulp.task('pages', function() {
    gulp.src(['./views/**/*.ejs']).pipe(gulp.dest('./dist/views'));
});
// Gulp task to copy images
gulp.task('images', function() {
    gulp.src(['./public/img/**/*']).pipe(gulp.dest('./dist/public/img'));
});
// Gulp task to copy other pages
gulp.task('modules', function() {
    gulp.src(['./modules/**/*.js']).pipe(gulp.dest('./dist/modules'));
});
// Gulp task to copy locales
gulp.task('locales', function() {
    gulp.src(['./modules/locales/**/*.json']).pipe(gulp.dest('./dist/modules/locales'));
});

// // Clean output directory
// gulp.task('clean', () => del(['dist']));
// // Gulp task to minify all files
// gulp.task('default', ['clean'], function() {
//     runSequence('modules', 'locales', 'pages', 'all-files', 'other-stylesheets', 'styles', 'scripts', 'pages', 'images');
// });