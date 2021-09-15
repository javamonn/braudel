import { resolve } from "path"
import { readFileSync, writeFileSync } from "fs";
import { injectedScripts, BUILD_DIR } from "../webpack.config.mjs";

const wrapExecutor = (contents) => contents + "\n Braudel.default();";

injectedScripts.forEach((scriptName) => {
  const filePath = resolve(BUILD_DIR, `${scriptName}.js`)
  writeFileSync(filePath, wrapExecutor(readFileSync(filePath)));
});
