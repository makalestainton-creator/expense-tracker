// webpack.common.js
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "node:path";

export default {
  entry: "./src/scripts/homePage.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(import.meta.dirname, "dist"),
    clean: true,
  },

  // webpack.common.js
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      favicon: "./src/favicons/favicon.ico", // ADD THIS LINE
    }),

    new MiniCssExtractPlugin({ filename: "styles.css" }),

    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/favicons", to: "." }, // Keep this to move apple/android icons
        { from: "./src/icons", to: "icons" },
      ],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: true, // CHANGED TO TRUE: Let webpack parse url() imports
            },
          },
        ],
      },

      // ADDED font matching rule using asset/resource
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext][query]", // Places them inside dist/fonts/
        },
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
