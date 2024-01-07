import webpack, { Configuration } from "webpack";
import { merge } from "webpack-merge";

import TerserPlugin from "terser-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

import webpackPaths from "./webpack.paths";
import baseConfig from "./webpack.base";

const config: Configuration = {
  // 对于 entry 及 loader 的绝对路径 使用 context 作为基础路径
  context: webpackPaths.srcPath,

  target: "node",

  watch: false,
  mode: "production",
  devtool: "inline-source-map",

  entry: {
    loader: { import: "loader.ts", filename: "lib/[name].js" },
    plugin: { import: "plugin.ts", filename: "lib/[name].js" },
  },
  output: {
    publicPath: "./",
    path: webpackPaths.buildPath,
    chunkFilename: "[id].[contenthash:5].js",
    library: {
      type: "umd",
      // 指定的就是你使用require时的模块名
      name: "MyLibrary",
      // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
      umdNamedDefine: true,
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
  plugins: [
    // 可视化查看 webpack 打包文件大小分析
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE === "true" ? "server" : "disabled",
    }),

    // 编译后清理构建产物
    new CleanWebpackPlugin(),
    // 环境变量注入
    new webpack.EnvironmentPlugin({
      debug: true,
    }),
    new webpack.DefinePlugin({
      "process.type": '"loader"',
    }),
  ],

  // 禁止 webpack 处理 __dirname 和 __filename.
  node: {
    __dirname: false,
    __filename: false,
  },
};

export default merge(baseConfig, config);
