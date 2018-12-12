const gulp = require('gulp');
const browserSync = require("browser-sync");
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
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const aigis = require('gulp-aigis');
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");


gulp.task("webpack", function() {
    return webpackStream(webpackConfig, webpack).on('error', function(e) {
            this.emit('end');
        })
        .pipe(gulp.dest("dist"));
});

gulp.task('clean', function() {
    return del(['dist'])
        .then(function(paths) {
            console.log('deleted. ' + paths);
        });
});

gulp.task('aigis', function() {
    return gulp.src('./aigis_config.yml')
        .pipe(aigis());
});

gulp.task('sass', function() {
    return gulp.src(['assets/sass/*.sass'])
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

gulp.task('js', function() {
    return gulp.src(['assets/js/*.js', 'assets/js/*.css'])
        // .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('ejs', function() {
    return gulp.src(['assets/ejs/**/*.ejs', '!' + 'assets/ejs/**/_*.ejs'])
        .pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
        .pipe(ejs())
        .pipe(rename({ extname: '.html' }))
        .pipe(gulp.dest('dist'));
});

gulp.task('img', function() {
    return gulp.src([
            'assets/img/**/*.**',
        ])
        .pipe(gulp.dest('dist/img'));
});

// svgスプライト
gulp.task('svg-sprite', function() {
    return gulp.src('assets/img/**/*.svg')
        .pipe(svgSprite({
            // 何で出力するか
            mode: {
                symbol: {
                    'dest': '.', // どこに
                    'sprite': 'sprite.svg' // ファイル名
                }
            },
            shape: {
                transform: [{
                    svgo: { // svgのスタイルのオプション
                        plugins: [
                            { 'removeTitle': true }, // titleを削除
                            { 'removeStyleElement': true }, // <style>を削除
                            { 'removeAttrs': { 'attrs': 'fill' } } // fill属性を削除
                        ]
                    }
                }]
            },
            // 吐き出す際のオプション
            svg: {
                xmlDeclaration: true, // xml宣言をつける
                doctypeDeclaration: true // doctype宣言をつける
            }
        }))
        .pipe(gulp.dest('dist/img/svg'));
});

gulp.task('imagemin', function() {
    return gulp.src('assets/img/*')
        .pipe(imagemin(
            [
                pngquant()
            ], {
                interlaced: true,
                progressive: true,
                optimizationLevel: 5
            }
        ))
        .pipe(gulp.dest('dist/img'));
});

// gulp.task('ts-build', () => {
//   return tsProject.src()
//     .pipe(tsProject())
//     .js.pipe(gulp.dest('dist/js'));
// });

gulp.task('watch', function() {
    gulp.watch('assets/**/*.sass', gulp.task('sass'));
    gulp.watch('assets/**/*.ejs', gulp.task('ejs'));
    gulp.watch('assets/**/*.js', gulp.task('js'));
    // gulp.watch('assets/**/*.ts', gulp.task('ts-build'));
    gulp.watch("assets/**/*.ts", gulp.task("webpack"));
    gulp.watch(['assets/**/*.png', 'assets/**/*.gif', 'assets/**/*.jpg', 'assets/**/*.jpeg', 'assets/**/*.svg'], gulp.task('img'));
    // gulp.watch('assets/**/*.**', gulp.task('aigis'));
    // gulp.watch('assets/**/*.**', ['imagemin']);
    gulp.watch('assets/**/*.svg', gulp.task('svg-sprite'));

    // gulp.watch(["監視したいファイル"], ["行いたいタスク"])
});

gulp.task('serve', gulp.series(
    gulp.parallel(
        'watch',
        function() {
            browserSync({
                notify: false,
                port: 5000,
                server: {
                    baseDir: 'dist',
                    index: "index.html"
                }
            });
            gulp.watch("dist/**").on('change', browserSync.reload);
        }
    )
));

gulp.task("default", gulp.series(
    'clean',
    gulp.parallel(
        // 順次実行したいものを上から順に指定する
        // 'aigis',
        'sass',
        'ejs',
        'img',
        'js',
        'webpack',
        'svg-sprite'
        // 'ts-build'
    ),
    'serve'
));