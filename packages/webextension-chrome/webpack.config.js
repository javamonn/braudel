const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const SRC_DIR = path.resolve(__dirname, "./src");
const BUILD_DIR = path.resolve(__dirname, "./build");

module.exports = {
  entry: path.resolve(SRC_DIR, "./ServiceWorker.js"),
  output: {
    path: BUILD_DIR,
    filename: "ServiceWorker.js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: path.resolve(BUILD_DIR, "manifest.json") },
      ],
    }),
  ],
};
