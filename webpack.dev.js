import { merge } from "webpack-merge";
import common from "./webpack.common.js";

export default merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/index.html"],
    allowedHosts: "all",
    client: {
      overlay: {
        runtimeErrors: (error) => {
          if (error.message.includes('ResizeObserver loop')) return false;
          return true;
        }
      }
    }
  },
});