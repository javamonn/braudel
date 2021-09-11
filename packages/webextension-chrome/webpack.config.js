const path = require("path");
const webpack = require('webpack')
const CopyPlugin = require("copy-webpack-plugin");

const SRC_DIR = path.resolve(__dirname, "./src");
const BUILD_DIR = path.resolve(__dirname, "./build");

module.exports = {
  entry: path.resolve(SRC_DIR, "./service-worker.js"),
  output: {
    path: BUILD_DIR,
    filename: "service-worker.js",
  },
  resolve: {
    extensions: [".dev.js", ".js", ".json", ".wasm"],
    fallback: {
      crypto: false,
      path: false,
      fs: false,
    },
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: path.resolve(BUILD_DIR, "manifest.json") },
        {
          from: "node_modules/@jlongster/sql.js/dist/sql-wasm.wasm",
          to: "sql-wasm.wasm",
        },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env.PERF_BUILD": false,
    }),
  ],
};
