const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require("del");
const autoprefixer = require('gulp-autoprefixer');
const svgSprite = require('gulp-svg-sprite');
const imagemin = require('gulp-imagemin');
const pngquant = require("imagemin-pngquant");
const mozjpeg = require('imagemin-mozjpeg');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
var aigis = require('gulp-aigis');

gulp.task('clean', function() {
  del(['dist'])
    .then(function(paths){
      console.log('deleted. ' + paths);
    });
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "dist",
      index: "index.html"
    }
  });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('sass', function() {
  gulp.src(['assets/sass/*.sass'])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(autoprefixer({
        browsers: ['last 2 version', 'iOS >= 8.1', 'Android >= 4.4'],
        cascade: false
    }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('aigis', function() {
  gulp.src('./aigis_config.yml')
    .pipe(aigis());
});

gulp.task('js', function() {
  gulp.src(['assets/js/*.js', 'assets/js/*.css'])
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('ejs', function() {
  gulp.src(['assets/ejs/**/*.ejs', '!'+ 'assets/ejs/**/_*.ejs'])
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(ejs())
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('img', function() {
  gulp.src([
    'assets/img/**/*.**',
    ])
    .pipe(gulp.dest('dist/img'));
});

// svgスプライト
gulp.task('svg-sprite', function () {
  gulp.src('assets/img/**/*.svg')
    .pipe(svgSprite({
      // 何で出力するか
      mode: {
        symbol: {
          'dest': '.', // どこに
          'sprite' : 'sprite.svg' // ファイル名
        }
      },
      shape: {
        transform: [
          {
            svgo: { // svgのスタイルのオプション
              plugins: [
                { 'removeTitle': true }, // titleを削除
                { 'removeStyleElement': true }, // <style>を削除
                { 'removeAttrs': { 'attrs': 'fill' } } // fill属性を削除
              ]
          }}
        ]
      },
      // 吐き出す際のオプション
      svg : {
        xmlDeclaration: true, // xml宣言をつける
        doctypeDeclaration: true // doctype宣言をつける
      }
    }))
    .pipe(gulp.dest('dist/img/svg'));
});

gulp.task('imagemin', function(){
  return gulp.src('assets/img/*')
    .pipe(imagemin(
      [
        pngquant()
      ],
      {
        interlaced: true,
        progressive: true,
        optimizationLevel: 5
      }
    ))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('ts-build', () => {
  return tsProject.src()
      .pipe(tsProject())
      .js.pipe(gulp.dest('dist/js'));
});

// src 配下の *.html, *.css ファイルが変更されたリロード。
gulp.task('default', ['browser-sync', 'sass', 'aigis',  'ejs', 'img', 'js', 'imagemin', 'svg-sprite', 'ts-build'], function () {
  gulp.watch('assets/**/*.sass', ['sass','bs-reload']);
  gulp.watch('assets/**/*.ejs', ['ejs','bs-reload']);
  gulp.watch('assets/**/*.js', ['js','bs-reload']);
  gulp.watch('assets/**/*.ts', ['ts-build','bs-reload']);
  gulp.watch('assets/**/*.**', ['img']);
  gulp.watch('assets/**/*.**', ['aigis']);
  gulp.watch('assets/**/*.**', ['imagemin']);
  gulp.watch('assets/**/*.**', ['svg-sprite']);
  // gulp.watch(["監視したいファイル"], ["行いたいタスク"])
});
