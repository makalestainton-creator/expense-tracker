import { merge } from "webpack-merge";
import common from "./webpack.common.js";
import path from "node:path";

export default merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/index.html"],
    hot: true,
    open: true,
    allowedHosts: "all",
    static: [
      { directory: path.resolve("src/icons"), publicPath: "/icons" },
      { directory: path.resolve("src/favicons"), publicPath: "/" },
      { directory: path.resolve("src/fonts"), publicPath: "/fonts" },
    ],
  },
});
