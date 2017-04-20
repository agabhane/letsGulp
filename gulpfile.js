var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  //ngAnnotate = require('gulp-ng-annotate'),
  del = require('del'),
  $ = gulpLoadPlugins();

gulp.task('build-css', function () {
  return gulp.src('app/styles/**/*.css')
    .pipe($.concat('main.css'))
    .pipe($.uglifycss())
    .pipe($.rev())
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
    .pipe($.jshint())
    .pipe($.rev())
    .pipe(gulp.dest('dist'));
});

gulp.task('build-vendor', function () {
  var filterJS = $.filter('**/*.js', { restore: true });
  var filterCSS = $.filter('**/*.css', { restore: true });
  return gulp.src('./bower.json')
    .pipe($.mainBowerFiles())
    .pipe(filterJS)
    .pipe($.concat('vendor.js'))
    .pipe(gulp.dest('dist/vendor'))
    .pipe(filterJS.restore)
    .pipe(filterCSS)
    .pipe($.concat('vendor.css'))
    .pipe(gulp.dest('dist/vendor'));
});

gulp.task('build-html', function () {
  return gulp.src('app/**/*.html')
    .pipe($.if(/\.tpl.html$/,$.ngTemplates({
      module: 'ag.gulp.one',
      standalone: false
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task('build-images', function () {
  return gulp.src('app/assets/images/**/*')
    .pipe($.imagemin())
    .pipe(gulp.dest('dist/assets/images'));
});

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('clean:css', del.bind(null, ['dist/**/*.css']));

gulp.task('inject', function () {
  var target = gulp.src('dist/index.html');
  var vsources = gulp.src(['dist/vendor/**/*.js', 'dist/vendor/**/*.css'], { read: false });
  var msources = gulp.src(['dist/**/*.js', 'dist/**/*.css', '!dist/vendor/**'], { read: false });
  return target.pipe($.inject(msources, {relative: true}))
    .pipe($.inject(vsources, {relative: true, name: 'bower'}))
    .pipe(gulp.dest('dist'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', ['build'], function () {
  gulp.watch('app/js/**/*.js', ['jshint', 'build-js']);
  gulp.watch('app/styles/**/*.css', $.sequence('clean:css', 'build-css', 'inject'));
  gulp.watch('app/**/*.html', ['build-html']);
});

gulp.task('default', ['build']);
gulp.task('build', $.sequence('clean', ['build-css', 'build-js', 'build-vendor', 'build-images', 'build-html'], 'inject'));