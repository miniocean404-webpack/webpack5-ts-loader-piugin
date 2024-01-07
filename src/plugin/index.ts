// 使用
// vue.config.js
// const codePositionServer = require("./plugins/position");
// module.exports = {
//   configureWebpack: {
//     // 其他配置
//     plugins: [new codePositionServer({ port: 8999 })],
//   },
//   // 其他配置
// };

// position-plugin.js

// enhanced-resolve:https://zhuanlan.zhihu.com/p/609600425
// https://juejin.cn/post/7306716962138538036?searchId=20240107191848D96443ADF0397CC7DB72

import http, { Server } from "http";
import child_process from "child_process";
import { Compiler } from "webpack";

export interface PluginOptionProp {
  port: number;
}

class codePositionServer {
  server: Server | undefined;
  options: PluginOptionProp;

  constructor(options: PluginOptionProp) {
    this.options = options;
    this.server = undefined;
  }

  // compiler 包含了 当前 webpack 环境的各种配置信息，以及关于模块和编译的所有信息。
  apply(compiler: Compiler) {
    // 通过 compiler.hooks.compilation 拿到对应钩子
    // 通过 tap 方法来注册回调
    compiler.hooks.done.tap("codePositionServer", (compilation) => {
      // 在回调函数中拿到参数 compilation
      // 执行一些逻辑

      const { port } = this.options;
      if (this.server) return;

      this.server = http.createServer((req, _) => {
        if (!req.url) return;

        const code = req.url.split("?")[1];

        if (code.length) {
          const path = code.split("=")[1];
          if (path) {
            child_process.exec("code -r -g " + path);
          }
        }
      });

      this.server.listen(port, () => {
        console.log(`codePositionServer started on port ${port}`);
      });
    });
  }
}

export default codePositionServer;
