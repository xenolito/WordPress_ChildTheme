const { prompt } = require("enquirer");
const { src, dest, watch, series, parallel } = require("gulp");
const replace = require("gulp-replace");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const bsync = require("browser-sync").create(); // create a browser-sync instance...
const jeditor = require("gulp-json-editor");
const file = require("gulp-file"); // create an writes a file...

const setupOBJ = {
  wp_folder: "",
  childThemeFolder: "",
  childThemeName: "",
  localhost: "",
  baseDestPath: "",
  destWP: "",
  destChildTheme: "",
};

let configData; // imported from configSetup.json which is written and configured via "gulp setup"

// File paths
const baseSourcePath = "./";
const sourcePaths = {
  css: baseSourcePath + "css/**/*.scss",
  js: baseSourcePath + "js/**/*.js",
  html: baseSourcePath + "**/*.html",
  php: baseSourcePath + "*.php",
};

const cssSourceOrder = [
  baseSourcePath + "css/child_theme_styles/child_theme_config.scss",
  baseSourcePath + "css/child_theme_styles/pictau-icons.scss",
  baseSourcePath + "css/child_theme_styles/globals.scss",
  baseSourcePath + "css/child_theme_styles/layouts.scss",
  baseSourcePath + "css/child_theme_styles/colors.scss",
  baseSourcePath + "css/child_theme_styles/style.scss",
  baseSourcePath + "css/child_theme_styles/**/*.scss",
];

const jsSourceOrder = [baseSourcePath + "js/custom_theme_scripts.js"];

function loadConfigData(done) {
  configData = require("./configSetup.json");
  console.log(
    "configData cargado correctamente, localhost===> " + configData.localhost
  );
  done();
}

function customPlumber() {
  return plumber({
    errorHandler: notify.onError("ERROR: <%= error.message  %>"),
  });
}

const notify = require("gulp-notify");

async function wpConfigSetup(done) {
  const response = await prompt([
    {
      type: "input",
      name: "wp_folder",
      message: "Enter the WordPress folder name",
    },
    {
      type: "input",
      name: "childThemeFolder",
      message: "Enter the Child Theme folder name",
    },
    {
      type: "input",
      name: "childThemeName",
      message: "Enter the Child Theme Name",
    },
  ]);

  setUserValues(response);
  done();
}

function setUserValues(values) {
  setupOBJ.wp_folder = values["wp_folder"];
  setupOBJ.childThemeFolder = values["childThemeFolder"];
  setupOBJ.childThemeName = values["childThemeName"];
  setupOBJ.localhost = "http://localhost/" + setupOBJ.wp_folder + "/";
  setupOBJ.baseDestPath = "/Volumes/IO/Google Drive/HTDOCS/";
  setupOBJ.destWP = setupOBJ.baseDestPath + setupOBJ.wp_folder + "/";
  setupOBJ.destChildTheme =
    setupOBJ.destWP + "wp-content/themes/" + setupOBJ.childThemeFolder + "/";

  /*  Guardamos las variables en un archivo json llamado configSetup.json */
  return file("configSetup.json", JSON.stringify(setupOBJ), { src: true }).pipe(
    dest("./")
  );
}

// Crates default folder/scaffolding structure
function directories(done) {
  src("css/*.css").pipe(dest(setupOBJ.destChildTheme + "css/")); // 1: just copy special css files to theme css dir.
  src("**/child_theme_config.scss")
    .pipe(replace(/\@@(.*?)\@@/, setupOBJ.childThemeName))
    .pipe(concat("style.css"))
    .pipe(sass().on("error", sass.logError)) // compile SCSS to CSS
    .pipe(dest(setupOBJ.destChildTheme)); // put final CSS in dist folder

  src("mu-plugins/*.php", { base: "." }).pipe(
    dest(setupOBJ.destChildTheme + "../../")
  ); // 2: copy mu-plugins/ needed for PICTAU's WPO.
  src("screenshot.png", { base: "." }).pipe(dest(setupOBJ.destChildTheme)); // 3: copy screenshot png for child theme.
  src("*.php", { base: "." }).pipe(dest(setupOBJ.destChildTheme)); // 4: copy all php files to child theme folder.
  done();
}

function scssTask() {
  console.log("---> setupOBJ.localhost: " + configData.localhost);

  return src(cssSourceOrder)
    .pipe(sourcemaps.init({ loadMaps: true, largFile: true })) // initialize sourcemaps first
    .pipe(customPlumber())
    .pipe(concat("style.css"))
    .pipe(sass().on("error", sass.logError)) // compile SCSS to CSS
    .pipe(
      postcss([
        autoprefixer("last 2 versions"),
        cssnano({ preset: ["default", { discardComments: true }] }),
      ])
    ) // PostCSS plugins
    .pipe(sourcemaps.write(".")) // write sourcemaps file in current directory
    .pipe(dest(configData.destChildTheme)); // put final CSS in dist folder
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask() {
  return src(jsSourceOrder)
    .pipe(customPlumber())
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(concat("custom_theme_scripts.min.js"))
    .pipe(uglify())
    .pipe(dest(configData.destChildTheme + "js/"));
}

function phpTask() {
  return src(sourcePaths.php).pipe(dest(configData.destChildTheme));
}

function browSync(done) {
  console.log(
    "LOCALHOST FOR BROWSERSYNC on configData.localhost= " + configData.localhost
  );
  console.log(
    "LOCALHOST FOR BROWSERSYNC on setupOBJ.localhost= " + setupOBJ.localhost
  );
  bsync.init({
    /*open: "external",
    proxy:
      "http://localhost/exseluwa/landing-intermediarios-de-credito-sunset/",
    port: 80*/

    injectChanges: true,
    watch: true,
    proxy: {
      target: configData.localhost,
      //ws: true
    },
    //files: [destPath.css, destPath.js]
  });

  done();
}

exports.configsetup = wpConfigSetup;
exports.directories = directories;
exports.sourcePaths = sourcePaths;
exports.setupOBJ = setupOBJ;
exports.scssTask = scssTask;
exports.jsTask = jsTask;
exports.phpTask = phpTask;
exports.browSync = browSync;
exports.bsync = bsync;
exports.loadConfigData = loadConfigData;
