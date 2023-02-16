const gulp = require('gulp')
const rename = require('gulp-rename')
// const del = require('del')

gulp.task('lib-v2', function () {
    gulp.src('vue2/lib/PmUiComps.umd.min.js')
        .pipe(rename('v2.min.js'))
        .pipe(gulp.dest('lib/'))
    gulp.src('lib/style.css')
        .pipe(rename('v3.css'))
        .pipe(gulp.dest('lib/'))
    return gulp.src('vue2/lib/PmUiComps.css')
        .pipe(rename('v2.css'))
        .pipe(gulp.dest('lib/'));
})


gulp.task('lib', gulp.series('lib-v2'))
