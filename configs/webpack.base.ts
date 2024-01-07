import webpack, { Configuration } from "webpack";

import webpackPaths from "./webpack.paths";

const config: Configuration = {
  // 让你更精确地控制 bundle 信息该怎么显示。 如果你不希望使用 quiet 或 noInfo 这样的不显示信息，而是又不想得到全部的信息，
  // 只是想要获取某部分 bundle 的信息，使用 stats 选项是比较好的折衷方式。
  // stats: "errors-only",

  resolve: {
    alias: {
      "@": webpackPaths.srcPath,
    },
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    modules: [webpackPaths.srcPath, "node_modules"],
  },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            // transpileOnly: true,
            compilerOptions: {
              module: "esnext",
            },
          },
        },
      },
    ],
  },

  output: {
    path: webpackPaths.buildPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: "commonjs2",
    },
  },
};

export default config;
