import path from "path";
import CopyPlugin from "copy-webpack-plugin";
import webpack from "webpack";

const SRC_DIR = new URL("./src", import.meta.url).pathname;
export const BUILD_DIR = new URL("./build", import.meta.url).pathname;
export const injectedScripts = ["InjectedScripts_GetHistoryDetails"];

const config = {
  entry: {
    ServiceWorker: {
      import: path.resolve(SRC_DIR, "./ServiceWorker.js"),
    },
    ...injectedScripts.reduce(
      (memo, scriptName) => ({
        ...memo,
        [scriptName]: {
          import: path.resolve(SRC_DIR, `./InjectedScripts/${scriptName}.js`),
          library: {
            name: "Braudel",
            type: "var",
          },
        },
      }),
      {}
    ),
  },
  output: {
    path: BUILD_DIR,
    filename: "[name].js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: path.resolve(BUILD_DIR, "manifest.json") },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env.INJECTED_SCRIPT_GET_HISTORY_DETAILS_PATH": JSON.stringify(
        "./InjectedScripts_GetHistoryDetails.js"
      ),
    }),
  ],
};

export default config;
