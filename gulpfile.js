var gulp = require('gulp'),
    path = require('path'),
    data = require('gulp-data');
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    wrap = require('gulp-wrap'),
    handlebars = require('gulp-compile-handlebars'),
    declare = require('gulp-declare'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create();

var DEST = 'dist/';

gulp.task('scripts', function() {
    return gulp.src([
        'src/js/helpers/*.js',
        'src/js/*.js',
      ])
      .pipe(concat('custom.js'))
      .pipe(gulp.dest(DEST+'/js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(DEST+'/js'))
      .pipe(browserSync.stream());
});

// TODO: Maybe we can simplify how sass compile the minify and unminify version
var compileSASS = function (filename, options) {
  return sass('src/scss/*.scss', options)
        .pipe(autoprefixer('last 2 versions', '> 5%'))
        .pipe(concat(filename))
        .pipe(gulp.dest(DEST+'/css'))
        .pipe(browserSync.stream());
};

gulp.task('sass', function() {
    return compileSASS('custom.css', {});
});

gulp.task('sass-minify', function() {
    return compileSASS('custom.min.css', {style: 'compressed'});
});

gulp.task('html', function () {
  var defaultData = {
    url: 'http://aereal.org/',
  };
  var handlebarOptions = {};
  return gulp.src(['src/templates/**/*.hbs'])
    // .pipe(data(function (file) {
    //   return require(metadataFile(file.path));
    // }))
    .pipe(handlebars(defaultData, handlebarOptions))
    .pipe(rename(htmlify))
    .pipe(gulp.dest('dist'));
})

function htmlify (path) {
  path.extname = '.html';
}

function metadataFile (templateFile) {
  var base = path.basename(templateFile, '.hbs');
  return path.resolve(__dirname, 'data', base + '.json');
}

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: './production/plain_page.html'
    });
});

gulp.task('watch', function() {
  // Watch .html files
  gulp.watch('production/*.html', browserSync.reload);
  // Watch .js files
  gulp.watch('src/js/*.js', ['scripts']);
  // Watch .scss files
  gulp.watch('src/scss/*.scss', ['sass', 'sass-minify']);
});

// Default Task
// gulp.task('default', ['browser-sync', 'watch']);
gulp.task('default', ['html']);
