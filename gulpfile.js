var gulp = require('gulp'),
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
  del = require('del');

gulp.task('build-css', function () {
  return gulp.src('app/styles/**/*.css')
    .pipe(concat('main.css'))
    .pipe(uglifycss())
    .pipe(gulp.dest('dist'));
});

// gulp.task('build-js', function () {
//   return gulp.src('app/js/**/*.js')
//     .pipe(jshint())
//     .pipe(ngAnnotate())
//     .pipe(concat('main.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest('dist'));
// });

gulp.task('build-js', function () {
  return gulp.src('app/js/**/*.js')
    .pipe(jshint())
    .pipe(gulp.dest('dist'));
});

gulp.task('build-vendor', function () {
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

gulp.task('build-html', function () {
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('inject', function () {
  var target = gulp.src('dist/index.html');
  var vsources = gulp.src(['dist/vendor/**/*.js', 'dist/vendor/**/*.css'], { read: false });
  var msources = gulp.src(['dist/**/*.js', 'dist/**/*.css', '!dist/vendor/**'], { read: false });
  return target.pipe(inject(msources, {relative: true}))
    .pipe(inject(vsources, {relative: true, name: 'bower'}))
    .pipe(gulp.dest('dist'));
});

// configure which files to watch and what tasks to use on file changes
// gulp.task('watch', ['build'], function () {
//   gulp.watch('app/js/**/*.js', ['jshint', 'build-js']);
//   gulp.watch('app/styles/**/*.css', ['build-css']);
// });

gulp.task('default', ['build']);
gulp.task('build', gulpSequence(['build-css', 'build-js', 'build-vendor', 'build-html'], 'inject'));