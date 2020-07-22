// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require("gulp");
const { argv } = require("yargs");

// Importing all the Gulp-related packages we want to use
//const args = require("yargs").argv;

const {
  initSetWPpaths,
  configsetup,
  directories,
  setupOBJ,
  sourcePaths,
  scssTask,
  jsTask,
  phpTask,
  bsync,
  browSync,
  loadConfigData,
} = require("./gulptasks.js");

/*const childThemeFolder =
  args.childfolder == "undefined" ? "child_theme" : args.childfolder;
const childThemeName =
  args.childname == "undefined" ? "CHILD THEME" : args.childname;
*/

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

exports.default = series(
  loadConfigData,
  browSync,
  parallel(scssTask, jsTask),
  //addjQuery,
  watchTask
);

//exports.setup = series(wpConfigSetup, directories);
exports.setup = series(initSetWPpaths, configsetup, directories);
