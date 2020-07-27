const fs = require("fs");
const { prompt } = require("enquirer");
const { src, dest, watch, series, parallel } = require("gulp");
const replace = require("gulp-replace"); // replaces strings in files
const breplace = require("gulp-html-replace"); // replaces <!-- bulid: <name<--> <!-- endbuild --> format for html, php, etc. files.
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

async function initSetWPpaths(done) {
  const response = await prompt({
    type: "input",
    name: "httpdocs_path",
    message: "Enter the path to the HTTPDOCS folder where WP is located",
    initial: "/Volumes/IO/Google Drive/HTDOCS",
    validate: checkifDirExists,
  });

  setupOBJ.httpdocs_path = response["httpdocs_path"] + "/"; // guardamos el valor para la validacion del directorio de WordPress (siguiente pregunta)
  console.log("WP base path set to: " + setupOBJ.httpdocs_path);
  done();
}

async function wpConfigSetup(done) {
  const response = await prompt([
    {
      type: "input",
      name: "wp_folder",
      message: "Enter the WordPress folder name",
      validate: checkifWPfolderExists,
    },
    {
      type: "input",
      name: "wp_parent_theme_name",
      message: "Enter the WP PARENT THEME name",
    },
    {
      type: "input",
      name: "childThemeFolder",
      message: "Enter the Child Theme folder name",
      validate: checkChildFolder,
    },
    {
      type: "input",
      name: "childThemeName",
      message: "Enter the Child Theme Name",
    },
    {
      type: "input",
      name: "wp_mailfrom_name",
      message: 'Enter your CUSTOMER\'s NAME for "wp mail from"',
    },
    {
      type: "input",
      name: "wp_mailfrom_email",
      message: 'Ener your CUSTOMER\'s EMAIL for "wp mail from"',
    },
  ]);

  setUserValues(response);
  done();
}

function checkifWPfolderExists(str) {
  let valid;
  const httpdocsPath = setupOBJ.httpdocs_path;
  try {
    valid = fs.existsSync(httpdocsPath + str)
      ? true
      : "El directorio no existe";
    setupOBJ.wp_folder = str; // guardamos el valor para validar el directorio del tema hijo.
  } catch (err) {
    console.log("ERROR");
  }
  return valid;
}

function checkifDirExists(str) {
  let valid;
  try {
    valid = fs.existsSync(str) ? true : "El directorio no existe";
  } catch (err) {
    console.log("ERROR");
  }
  return valid;
}

function checkChildFolder(str) {
  let valid;
  const httpdocsPath = setupOBJ.httpdocs_path;
  const pathToCheck =
    setupOBJ.httpdocs_path + setupOBJ.wp_folder + "/wp-content/themes/" + str;

  try {
    valid = fs.existsSync(pathToCheck)
      ? true
      : "El directorio del tema hijo NO EXISTE";
  } catch (err) {
    console.log("ERROR");
  }
  return valid;
}

function setUserValues(values) {
  setupOBJ.wp_folder = values["wp_folder"];
  setupOBJ.wp_parent_theme_name = values["wp_parent_theme_name"];
  setupOBJ.childThemeFolder = values["childThemeFolder"];
  setupOBJ.childThemeName = values["childThemeName"];
  setupOBJ.localhost = "http://localhost/" + setupOBJ.wp_folder + "/";
  setupOBJ.baseDestPath = setupOBJ.httpdocs_path;
  setupOBJ.destWP = setupOBJ.baseDestPath + setupOBJ.wp_folder + "/";
  setupOBJ.destChildTheme =
    setupOBJ.destWP + "wp-content/themes/" + setupOBJ.childThemeFolder + "/";
  setupOBJ.wp_mailfrom_name = values["wp_mailfrom_name"];
  setupOBJ.wp_mailfrom_email = values["wp_mailfrom_email"];

  /*  Guardamos las variables en un archivo json llamado configSetup.json */
  return file("configSetup.json", JSON.stringify(setupOBJ), { src: true }).pipe(
    dest("./")
  );
}

// Crates default folder/scaffolding structure
function directories(done) {
  src("css/*.css").pipe(dest(setupOBJ.destChildTheme + "css/")); // 1: just copy special css files (admin-styles.css + custom-login-styles.css) to theme css dir.

  src("./templates/child_theme_config.scss") // get child theme scss config in "templates" folder and do all prompts substitutions...
    .pipe(replace(/\@@(.*?)\@@/g, setupOBJ.childThemeName))
    .pipe(replace(/\###(.*?)\###/g, setupOBJ.wp_parent_theme_name))
    .pipe(dest("./css/child_theme_styles")); // copy child theme .scss file to "css/child_theme_styles" folder for later transform and concanetation...
  //.pipe(dest(setupOBJ.destChildTheme)); // put final CSS in dist folder

  src("mu-plugins/*.php", { base: "." }).pipe(
    dest(setupOBJ.destChildTheme + "../../")
  ); // 2: copy mu-plugins/ needed for PICTAU's WPO.
  src("screenshot.png", { base: "." }).pipe(dest(setupOBJ.destChildTheme)); // 3: copy screenshot png for child theme.
  src("*.php", { base: "." }).pipe(dest(setupOBJ.destChildTheme)); // 4: copy all php files to child theme folder.

  console.log(
    "Path to wp-config.php ==> " + setupOBJ.httpdocs_path + setupOBJ.wp_folder
  );

  const wpconfdest = setupOBJ.httpdocs_path + setupOBJ.wp_folder + "/";

  src(wpconfdest + "wp-config.php")
    .pipe(replace("/**#@-*/", wpconfigSetup)) //Search in wp-config.php the string '/**#@-*/' to include our server vars config. It looks like this string is a constant for all wordpress.org files language distributions.
    .pipe(dest(wpconfdest));

  src("./templates/functions.php")
    .pipe(
      breplace({
        wpmailfrom_name: {
          src: setupOBJ.wp_mailfrom_name,
          tpl:
            "function custom_wp_mail_from_name( $original_email_from ) {return '%s';}",
        },
        wpmailfrom_email: {
          src: setupOBJ.wp_mailfrom_email,
          tpl:
            "function custom_wp_email_address( $original_email_address ) { return '%s'; }",
        },
      })
    )
    .pipe(dest("./"))
    .pipe(dest(setupOBJ.destChildTheme));

  done();
}

// Add some custom config values to wp-config.php
function wpconfigSetup(match) {
  let str = "/* AUTOMATIC ADDED BY GULP TASK @xenolito */";

  str += "\n\n/* MEMORY LIMITS*/\n\n";
  str += "define('WP_MEMORY_LIMIT', '3000M');\n\n";
  str += "define( 'WP_MAX_MEMORY_LIMIT', '256M' );\n\n";
  str += "set_time_limit(300);\n\n";
  str += "/* Cambiamos directorio Uploads  */\n\n";
  str += "define( 'UPLOADS', ''.'xen_media' );\n\n";
  str += "ini_set('display_errors', 'Off');\n\n";
  str += "ini_set('error_reporting', E_ALL );\n\n";
  str += "define('WP_DEBUG', false);\n\n";
  str += "define('WP_DEBUG_DISPLAY', false);\n\n";
  str += "define('WP_DEBUG_LOG', false);\n\n";
  str += "/* END AUTOMATIC ADDED BY GULP TASK @xenolito */\n\n";
  //str += match + "\n\n";

  return str;
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
    injectChanges: true,
    watch: true,
    proxy: {
      target: configData.localhost,
    },
  });

  done();
}

exports.configsetup = wpConfigSetup;
exports.initSetWPpaths = initSetWPpaths;
exports.directories = directories;
exports.sourcePaths = sourcePaths;
exports.setupOBJ = setupOBJ;
exports.scssTask = scssTask;
exports.jsTask = jsTask;
exports.phpTask = phpTask;
exports.browSync = browSync;
exports.bsync = bsync;
exports.loadConfigData = loadConfigData;
