import path from "path";

const rootPath = path.join(__dirname, "../");

const srcPath = path.join(rootPath, "src");

const loaderPath = path.join(srcPath, "loader");
const pluginPath = path.join(srcPath, "plugin");

const distPath = path.join(rootPath, "dist");
const buildPath = path.join(rootPath, "build");
const libPath = path.join(rootPath, "lib");

const packagePath = path.join(rootPath, "package.json");
const nodeModulesPath = path.join(rootPath, "node_modules");

export default {
  rootPath,
  srcPath,

  loaderPath,
  pluginPath,

  distPath,
  buildPath,
  libPath,

  packagePath,
  nodeModulesPath,
};
