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

import http from "http";
import child_process from "child_process";

class codePositionServer {
  constructor(options) {
    this.options = options;
    this.server = null;
  }

  apply(compiler) {
    // 挂在一个钩子
    compiler.hooks.done.tap("codePositionServer", (compilation) => {
      const { port } = this.options;
      if (this.server) return;

      this.server = http.createServer((req, res) => {
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

module.exports = codePositionServer;
