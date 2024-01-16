import webpack, { Configuration } from "webpack";
import { merge } from "webpack-merge";

import TerserPlugin from "terser-webpack-plugin";
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
    index: {
      import: "./click-jump-to-edit/index.ts",
      filename: "click-jump-to-edit/[name].js",
      library: {
        type: "umd2",
        // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
        umdNamedDefine: true,
        // 指定的就是你使用require时的模块名
        name: "clickJumpToEdit",
        // 默认导出为 default
        export: "default",
      },
    },
  },
  output: {
    publicPath: "./",
    path: webpackPaths.libPath,
    chunkFilename: "[id].[contenthash:5].js",
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    library: {},
  },
  plugins: [
    // 可视化查看 webpack 打包文件大小分析
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE === "true" ? "server" : "disabled",
    }),

    // 环境变量注入
    new webpack.EnvironmentPlugin({
      debug: true,
    }),
    new webpack.DefinePlugin({
      "process.type": '"loader"',
    }),
  ],
  // 忽略 node 内置的模块
  externalsPresets: { node: true },
  // 处理打包 not cacheable
  // not cacheable 代表是否使用了缓存
  cache: {
    type: "filesystem", //保存位置，开发环境下默认为 memory 类型，生产环境 cache 配置默认是关闭的。
    // 生产环境下默认的缓存存放目录在 node_modules/.cache/webpack/default-production 中，
    // 如果想要修改，可通过配置 name，来实现分类存放。如设置 name: 'production-cache' 时生成的缓存
    name: "click-jump-code",
    compression: "gzip",
    buildDependencies: {
      config: [__filename], // webpack 和 loader是否失效来决定之前构建是否失效
    },
    version: "1.0",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },

  // 禁止 webpack 处理 __dirname 和 __filename.
  node: {
    __dirname: false,
    __filename: false,
  },
};

export default merge(baseConfig, config);
