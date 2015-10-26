var gulp = require('gulp');
var babel = require('gulp-babel');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var srcDir = 'src';
var buildDir = 'dist';

gulp.task('default', ['build', 'watch']);

gulp.task('build', ['copy', 'bower', 'scripts']);

var copySources = [
   srcDir + '/index.html',
   srcDir + '/css/**',
   srcDir + '/resources/**'
];
gulp.task('copy', function() {
   return gulp.src(copySources, {base: srcDir + '/'})
      .pipe(gulp.dest(buildDir))
   ;
});

gulp.task('bower', function() {
   return gulp.src('bower_components/**', {base: './'})
      .pipe(gulp.dest(buildDir))
   ;
});

gulp.task('scripts', function() {
   return gulp.src(srcDir + '/js/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(buildDir + '/js'))
   ;
});

gulp.task('clean', function(cb) {
   del([buildDir], cb);
});

gulp.task('watch', function() {
   gulp.watch(copySources, ['copy']);
   gulp.watch('bower_components/**', ['bower']);
   gulp.watch(srcDir + '/js/**/*.js', ['scripts']);
});
