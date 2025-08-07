import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import { deleteAsync } from 'del';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import webp from 'gulp-webp';

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

export const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

export const copy = () => {
  return gulp.src(['source/*.ico'], { base: 'source' })
    .pipe(gulp.dest('build'))
}

export const clean = () => {
  return deleteAsync('build');
}

// Scripts

export const scripts = () => {
  return gulp.src('source/js/menu-toggle.js')
    .pipe(terser())
    .pipe(rename('menu-toggle.min.js'))
    .pipe(gulp.dest('build/js'));
}

// Images

export const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png,svg}')
    .pipe(gulp.dest('build/img'))
}

export const createWebp = () => {
  return gulp.src('source/img/**/*{jpg,png}')
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest('build/img'));
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/js/menu-toggle.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(reload, html));
}

export const build = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    createWebp
  ),
);

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    html,
    styles,
    scripts,
    createWebp
  ),
  server,
  watcher
);
