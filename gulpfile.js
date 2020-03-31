// To create childtheme folder:   gulp setup --childfolder pinkpanther --childname PINKPANTHER

// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require("gulp");
// Importing all the Gulp-related packages we want to use
//const args = require("yargs").argv;
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const replace = require("gulp-replace");
const bsync = require("browser-sync").create(); // create a browser-sync instance...

const childThemeFolder = "sejimenez";
const childThemeName = "sejimenz";
const wp_folderName = "sejimenez2k20";

/*const childThemeFolder =
  args.childfolder == "undefined" ? "child_theme" : args.childfolder;
const childThemeName =
  args.childname == "undefined" ? "CHILD THEME" : args.childname;
*/
// File paths
const baseSourcePath = "./";
const sourcePaths = {
  css: baseSourcePath + "css/**/*.scss",
  js: baseSourcePath + "js/**/*.js",
  html: baseSourcePath + "**/*.html",
  php: baseSourcePath + "*.php"
};

const cssSourceOrder = [
  baseSourcePath + "css/child_theme_styles/child_theme_config.scss",
  baseSourcePath + "css/child_theme_styles/pictau-icons.scss",
  baseSourcePath + "css/child_theme_styles/globals.scss",
  baseSourcePath + "css/child_theme_styles/layouts.scss",
  baseSourcePath + "css/child_theme_styles/style.scss",
  baseSourcePath + "css/child_theme_styles/**/*.scss"
];

const jsSourceOrder = [baseSourcePath + "js/custom_theme_scripts.js"];

const localhost = "http://localhost/" + wp_folderName + "/";
const baseDestPath = "/Volumes/IO/Google Drive/HTDOCS/";
const destWP = baseDestPath + wp_folderName + "/";
const destChildTheme = destWP + "wp-content/themes/" + childThemeFolder + "/";

/*function addjQuery() {
  return src("node_modules/jquery/dist/jquery.slim.min.js").pipe(
    dest("public/dist/js/")
  );
}*/

// Sass task: compiles the style.scss file into style.css
function scssTask() {
  return src(cssSourceOrder)
    .pipe(sourcemaps.init({ loadMaps: true, largFile: true })) // initialize sourcemaps first
    .pipe(concat("style.css"))
    .pipe(sass().on("error", sass.logError)) // compile SCSS to CSS
    .pipe(
      postcss([
        autoprefixer("last 2 versions"),
        cssnano({ preset: ["default", { discardComments: true }] })
      ])
    ) // PostCSS plugins
    .pipe(sourcemaps.write(".")) // write sourcemaps file in current directory
    .pipe(dest(destChildTheme)); // put final CSS in dist folder
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask() {
  return src(jsSourceOrder)
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(concat("custom_theme_scripts.min.js"))
    .pipe(uglify())
    .pipe(dest(destChildTheme + "js/"));
}

function phpTask() {
  return src(sourcePaths.php).pipe(dest(destChildTheme));
}

// Cachebust
var cbString = new Date().getTime();

function cacheBustTask() {
  return src(sourcePaths.html)
    .pipe(replace(/cb=\d+/g, "cb=" + cbString))
    .pipe(dest("public/dist"))
    .pipe(bsync.reload({ stream: true }));
}

function browSync(done) {
  bsync.init({
    /*open: "external",
    proxy:
      "http://localhost/exseluwa/landing-intermediarios-de-credito-sunset/",
    port: 80*/

    injectChanges: true,
    watch: true,
    proxy: {
      target: localhost
      //ws: true
    }
    //files: [destPath.css, destPath.js]
  });

  done();
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask() {
  watch(
    [sourcePaths.css, sourcePaths.js, sourcePaths.php],
    parallel(scssTask, jsTask, phpTask)
  );
  watch([sourcePaths.css, sourcePaths.js, sourcePaths.php]).on(
    "change",
    bsync.reload
  );
}

// Crates default folder/scaffolding structure
function directories(done) {
  src("css/*.css").pipe(dest(destChildTheme + "css/")); // 1) just copy special css files to theme css dir.
  src("**/child_theme_config.scss")
    .pipe(replace(/\@@(.*?)\@@/, childThemeName))
    .pipe(concat("style.css"))
    .pipe(sass().on("error", sass.logError)) // compile SCSS to CSS
    .pipe(dest(destChildTheme)); // put final CSS in dist folder

  src("mu_plugins/*.php", { base: "." }).pipe(dest(destChildTheme + "../../")); // 2) copy mu_plugins/ needed for PICTAU's WPO.
  src("screenshot.png", { base: "." }).pipe(dest(destChildTheme)); // 3) copy screenshot png for child theme.
  src("*.php", { base: "." }).pipe(dest(destChildTheme)); // 4) copy all php files to child theme folder.
  done();
}

exports.default = series(
  browSync,
  parallel(scssTask, jsTask),
  //addjQuery,
  watchTask
);

exports.setup = series(directories);
