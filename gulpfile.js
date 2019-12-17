"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var gulpResolveUrl = require("gulp-resolve-url");
var del = require("del");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var minify = require('gulp-minify');
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var htmlmin = require('gulp-htmlmin');

gulp.task("clean", function () {
  return del("build");
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulpResolveUrl())
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest("source/css"))
});

gulp.task("min-css", function () {
  return gulp.src("source/css/style.css")
    .pipe(plumber())
    .pipe(sourcemap.init({ loadMaps: true }))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("images", function () {
  return gulp.src("source/img/*.{png,jpg,svg}")
    .pipe(plumber())
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: false }
        ]
      })
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/*-{big,small,can}-*.{png,jpg}")
    .pipe(plumber())
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function () {
  return gulp.src("source/img/icon-*.svg")
    .pipe(plumber())
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename("sprite.svg"))
    .pipe(imagemin([imagemin.svgo({
      plugins: [
        { removeViewBox: false }
      ]
    })]))
    .pipe(gulp.dest("build/img"))
});

gulp.task("min-js", function () {
  return gulp.src("source/js/**/*.js")
    .pipe(plumber())
    .pipe(minify({
      ext: {
        min: ".min.js"
      },
      noSource: true,
      ignoreFiles: ["*.min.js"]
    }))
    .pipe(gulp.dest("build/js"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(plumber())
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("css", "min-css"));
  gulp.watch("source/img/icon-*.svg", gulp.series("sprite", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("min-js", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "min-css",
  "images",
  "webp",
  "sprite",
  "min-js",
  "html"
));

gulp.task("start", gulp.series("build", "server"));
