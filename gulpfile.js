var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require("run-sequence");
var bower = require('bower');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');
var del = require("del");
var sh = require('shelljs');

var paths = {
  css: "app/css/*.css",
  controller: "app/js_controllers/*.js",
  services: "app/js_services/*.js",
  routing: "app/js_routing/*.js"
};

var BUNDLE_DESTINATION = "www/bundle";

gulp.task("build", [
  "css_bundle",
  "js_controllers",
  "js_services",
  "js_routing",
]);

gulp.task("default", function() {
  runSequence("clean", "build");
});

gulp.task("css_bundle", function(done) {
  return gulp.src(paths.css)
    .pipe(concat("style.bundle.css"))
    .pipe(cleanCss())
    .pipe(gulp.dest(BUNDLE_DESTINATION))

});

gulp.task("js_controllers", function(done) {
  return gulp.src(paths.controller)
    .pipe(concat("controllers.bundle.js"))
    .pipe(gulp.dest(BUNDLE_DESTINATION))

});

gulp.task("js_services", function(done) {
  return gulp.src(paths.services)
    .pipe(concat("services.bundle.js"))
    .pipe(gulp.dest(BUNDLE_DESTINATION))

});

gulp.task("js_routing", function(done) {
  return gulp.src(paths.routing)
    .pipe(concat("routing.bundle.js"))
    .pipe(gulp.dest(BUNDLE_DESTINATION))

});

gulp.task("watch", function() {
  runSequence("clean", "build", function() {
    gulp.watch("app/**/*", ["build"]);
  });
  
});

gulp.task("clean", function() {
  return del(BUNDLE_DESTINATION);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
