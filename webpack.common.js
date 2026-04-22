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

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: './src/favicons/favicon.ico', to: '.' },
        { from: './src/favicons/favicon-16x16.png', to: '.' },
        { from: './src/favicons/favicon-32x32.png', to: '.' },
        { from: './src/favicons/apple-touch-icon.png', to: '.' },
        { from: './src/favicons/android-chrome-192x192.png', to: '.' },
        { from: './src/favicons/android-chrome-512x512.png', to: '.' },
        { from: './src/favicons/site.webmanifest', to: '.' },
      ]
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        use: ["html-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};

