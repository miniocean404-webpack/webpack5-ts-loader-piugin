// 使用
// module.exports = {
//   configureWebpack: {
//     resolveLoader: {
//       //找loader的时候，先去loaders目录下找，找不到再去node_modules下面找
//       modules: ["loaders", "node_modules"],
//     },
//   },
//   // 我们在vue-loader之前先编译用我们的loader编译一遍
//   chainWebpack: (config) => {
//     config.module
//       .rule("vue")
//       .use("vue-loader")
//       .loader("vue-loader")
//       .end()
//       .use("position-loader")
//       .loader("position-loader")
//       .end();
//   },
// };

import { LoaderContext } from "webpack";

interface LoaderOption {
  frame: "react" | "vue";
}

// 插件无法应用与懒加载的页面
export default function (this: LoaderContext<LoaderOption>, source: string, inputSourceMap?: Record<string, any>) {
  if (typeof this.query !== "string") {
    this.query.frame;

    // this.resourcePath 为当前编译文件的源路径
    // this.query 是 loader 传入的 option
    const res = codeLineTrack(source, this.resourcePath);
    return res;
  }
}

const codeLineTrack = (code: string, path: string) => {
  let lineList = code.split("\n");

  // 添加位置属性，index+1为具体的代码行号
  lineList = lineList.map((item, index) => addLineAttr(item, index + 1, path));

  return lineList.join("\n");
};

const addLineAttr = (lineStr: string, line: number, path: string): string => {
  if (!/^\s+</.test(lineStr)) return lineStr;

  const reg = /\s*?(?<!<\/)<(?<tagName>[\w-]*[.]?[\w]*)/g;

  const exec = reg.exec(lineStr);

  if (exec.groups["tagName"]) {
    lineStr = lineStr.replace(exec.groups["tagName"], `${exec.groups["tagName"]} data-code-location="${path}:${line}"`);
  }

  return lineStr;
};
