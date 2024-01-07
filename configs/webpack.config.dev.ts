import webpack, { Configuration } from "webpack";
import { merge } from "webpack-merge";

import webpackPaths from "./webpack.paths";
import baseConfig from "./webpack.base";

const config: Configuration = {
  // 对于 entry 的绝对路径 使用 context 作为基础路径
  context: webpackPaths.srcPath,

  target: "node",

  // 监听文件改变实时输出
  watch: true,
  //  设置 mode , 并自动注入 proces.env.NODE_ENV
  mode: "development",
  devtool: "source-map",
  entry: {
    loader: { import: "./loader/index.ts", filename: "[name].js" },
    plugin: { import: "./plugin/index.ts", filename: "[name].js" },
    web: { import: "web.ts", filename: "[name].js" },
  },
  output: {
    publicPath: "./",
    path: webpackPaths.libPath,
    filename: "[name].[contenthash:5].js",
    chunkFilename: "[id].js",
    library: {
      type: "umd",
      // 指定的就是你使用require时的模块名
      name: "MyLibrary",
      // 默认导出为 default
      export: "default",
      // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
      umdNamedDefine: true,
    },
  },
  plugins: [
    // 环境变量注入
    new webpack.EnvironmentPlugin({
      debug: true,
    }),
  ],

  // 禁止 webpack 处理 __dirname 和 __filename.
  node: {
    __dirname: false,
    __filename: false,
  },
};

export default merge(baseConfig, config);
