// import gulp from 'gulp';
import gulp, {
    parallel,
    series
} from 'gulp';
import babel from 'gulp-babel';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import clean from "gulp-clean";
import babelify from "babelify";
import browserify from "browserify";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
const browserSync = require("browser-sync").create();



var sass = require('gulp-sass')(require('sass'));
const paths = {
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'assets/styles/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'assets/scripts/'
    }
};


export const css = (cb) => {
    // body omitted
    gulp
        .src("assets/sass/style.scss")
        .pipe(sass.sync({
            outputStyle: "compressed"
        }).on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest("dist"));
    cb();
}

export const javascript = () => {
    return (
        browserify({
            entries: ["assets/js/app.js"],
            transform: [babelify.configure({
                presets: ["@babel/preset-env"]
            })]
        })
        .bundle()
        .pipe(source("site.min.js"))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest("dist"))
    );
}

const watchFiles = () => {
    gulp.watch("assets/sass/**/*.scss", parallel(css));
    gulp.watch("assets/js/**.js", parallel(javascript));
    browserSync.init(["**/*"], {
        proxy: "http://localhost/gulp-starter-files",
    });
}
const dev = parallel(css, javascript);


exports.default = series(dev, watchFiles);