const gulp = require('gulp');
const gutil = require('gulp-util');
const gulpif = require('gulp-if');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const less = require('gulp-less');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const babelify = require('babelify');
const browserify = require('browserify');
const watchify = require('watchify');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

const production = process.env.NODE_ENV === 'production';
const dependencies = [
    'alt',
    'react',
    'react-dom',
    'react-router'
];

/*
 |--------------------------------------------------------------------------
 | Combine all JS libraries into a single file for fewer HTTP requests.
 |--------------------------------------------------------------------------
 */
gulp.task('vendor', function() {
    return gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/moment/min/moment.min.js',
        'bower_components/magnific-popup/dist/jquery.magnific-popup.js',
        'bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
        'bower_components/toastr/toastr.js'
    ]).pipe(concat('vendor.js'))
        .pipe(gulpif(production, uglify({ mangle: false })))
        .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile third-party dependencies separately for faster performance.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-vendor', function() {
    return browserify()
        .require(dependencies)
        .bundle()
        .pipe(source('vendor.bundle.js'))
        .pipe(buffer())
        .pipe(gulpif(production, uglify({ mangle: false })))
        .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile only project files, excluding all third-party dependencies.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify', ['browserify-vendor'], function() {
    return browserify({ entries: 'app/main.js', debug: true })
        .external(dependencies)
        .transform(babelify, { presets: ['es2015', 'react'] })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(gulpif(production, uglify({ mangle: false })))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Same as browserify task, but will also watch for changes and re-compile.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-watch', ['browserify-vendor'], function() {
    const bundler = watchify(browserify({ entries: 'app/main.js', debug: true }, watchify.args));

    bundler.external(dependencies);
    bundler.transform(babelify, { presets: ['es2015', 'react'] });
    bundler.on('update', rebundle);

    return rebundle();

    function rebundle() {
        const start = Date.now();

        return bundler.bundle()
            .on('error', function(err) {
                gutil.log(gutil.colors.red(err.toString()));
            })
            .on('end', function() {
                gutil.log(gutil.colors.green('Finished rebundling in', (Date.now() - start) + 'ms.'));
            })
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('public/js/'));
    }
});

/*
 |--------------------------------------------------------------------------
 | Compile LESS stylesheets and vendor CSS.
 |--------------------------------------------------------------------------
 */
gulp.task('vendor-styles', function() {
    return gulp.src([
        'bower_components/bootstrap/dist/css/bootstrap.min.css',
        'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
    ]).pipe(concat('vendor.css'))
        .pipe(plumber())
        .pipe(gulp.dest('public/css'));
});

gulp.task('styles', function() {
    return gulp.src('app/stylesheets/main.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulpif(production, cssmin()))
        .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function() {
    gulp.watch('app/stylesheets/**/*.less', ['styles']);
});

gulp.task('default', ['styles', 'vendor-styles', 'vendor', 'browserify-watch', 'watch']);
gulp.task('build', ['styles', 'vendor-styles', 'vendor', 'browserify']);