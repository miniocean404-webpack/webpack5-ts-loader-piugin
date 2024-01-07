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

// @ts-ignore
export default function (this: LoaderContext<any>, source: string, inputSourceMap?: Record<string, any>) {
  // this.resourcePath为当前编译文件的源路径
  const res = codeLineTrack(source, this.resourcePath);
  return res;
}

const codeLineTrack = (code: string, path: string) => {
  const lineList = code.split("\n");
  const newList: string[] = [];
  lineList.forEach((item, index) => {
    newList.push(addLineAttr(item, index + 1, path)); // 添加位置属性，index+1为具体的代码行号
  });
  return newList.join("\n");
};

const addLineAttr = (lineStr: string, line: number, path: string): string => {
  if (!/^\s+</.test(lineStr)) {
    return lineStr;
  }

  const reg = /((((^(\s)+\<))|(^\<))[\w-]+)|(<\/template)/g;
  let leftTagList: RegExpMatchArray | string[] | null = lineStr.match(reg);

  if (leftTagList) {
    leftTagList = Array.from(new Set(leftTagList));

    leftTagList.forEach((item) => {
      const skip = ["KeepAlive", "template", "keep-alive", "transition", "router-view"];
      if (item && !skip.some((i) => item.indexOf(i) > -1)) {
        const reg = new RegExp(`${item}`);
        const location = `${item} code-location="${path}:${line}"`;
        lineStr = lineStr.replace(reg, location);
      }
    });
  }
  return lineStr;
};
