const {series, parallel, src, dest, watch} = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const gulpClean = require('gulp-clean');
const browserSync = require('browser-sync').create();

function serve() {
    browserSync.init({
        server: 'build',
        watch: true,
        notify: false
    });
}

function copyJs(){
    return src('src/index.js')
        .pipe(dest('build'));
}

function copyImg(){
    return src('src/img/**')
        .pipe(dest('build/img/'));
}


function clean() {
    return src('build', {read: false, allowEmpty: true})
        .pipe(gulpClean());
}

function copyHTML() {
    return src('src/index.html')
        .pipe(dest('build'));
}

function transformSCSS() {
    return src('src/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(concat('index.css'))
        .pipe(dest('build'));
}

function watchTasks() {
    watch('src/index.html', copyHTML);
    watch('src/styles/**/*.scss', transformSCSS);
    watch('src/index.js', copyJs)
}

exports.clean = clean;
exports.watch = watchTasks;
exports.style = transformSCSS;
exports.default = series(
    clean, copyImg,
    parallel(copyJs, copyHTML, transformSCSS),
    parallel(watchTasks, serve)
);