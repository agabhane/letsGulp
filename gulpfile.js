var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    inject = require('gulp-inject'),
    gulpSequence = require('gulp-sequence'),
    es = require('event-stream'),
    bowerFiles = require('gulp-main-bower-files'),
    filter = require('gulp-filter'),
    series = require('stream-series');

gulp.task('jshint', function() {
  return gulp.src('app/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-css', function() {
  return gulp.src('app/styles/**/*.css')
    .pipe(concat('main.css'))
    .pipe(uglifycss())
    .pipe(gulp.dest('dist'));
});

gulp.task('build-js', function() {
  return gulp.src('app/js/**/*.js')
    .pipe(jshint())
    .pipe(ngAnnotate())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('build-vendor', function() {
  var filterJS = filter('**/*.js', { restore: true });
  var filterCSS = filter('**/*.css', { restore: true });
  return gulp.src('./bower.json')
      .pipe(bowerFiles())
      .pipe(filterJS)
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest('dist/vendor'))
      .pipe(filterJS.restore)
      .pipe(filterCSS)
      .pipe(concat('vendor.css'))
      .pipe(gulp.dest('dist/vendor'));
});

gulp.task('index.html', function() {
  return gulp.src('app/index.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('inject', function() {
    var target = gulp.src('dist/index.html');
    var vsources = gulp.src(['dist/vendor/*.js', 'dist/vendor/*.css'], {read: false});
    var msources = gulp.src(['dist/*.js', 'dist/*.css'], {read: false});
    /*return target.pipe(inject(sources, {relative: true}))
      .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
      .pipe(gulp.dest('dist'));*/
    return target.pipe(inject(series(vsources, msources), {relative: true}))
      .pipe(gulp.dest('dist'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', ['build'], function() {
  gulp.watch('app/js/**/*.js', ['jshint', 'build-js']);
  gulp.watch('app/styles/**/*.css', ['build-css']);
});

gulp.task('default', ['watch']);
gulp.task('build', gulpSequence(['build-css', 'build-js', 'index.html', 'build-vendor'], 'inject'));