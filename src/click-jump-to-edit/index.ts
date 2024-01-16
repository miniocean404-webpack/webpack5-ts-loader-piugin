import { codePositionServer } from "./plugin";
import { initDom } from "./web";
import { loaderPath } from "./loader";

export default {
  initDom,
  codePositionServer,
  loader: loaderPath,
};
