//const path = require("path");
//const outputDir = path.resolve(__dirname, "build");
//const TerserPlugin = require("terser-webpack-plugin");
//const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

console.log("==> WEBPACK CONFIG: PRODUCTION");

module.exports = {
  mode: "production",
  //entry: path.resolve(__dirname, "js/"),
  output: {
    //   path: outputDir + "/js/",
    filename: "custom_theme_scripts.min.js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-optional-chaining"],
          },
        },
      },
    ],
  },
  optimization: {
    concatenateModules: true,
    minimize: true,
    /*minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],*/
  },
};
