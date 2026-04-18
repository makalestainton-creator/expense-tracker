import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

export default {
  entry: "./src/homepage.js",
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
        { from: './src/favicon/favicon.ico', to: '.' },
        { from: './src/favicon/favicon-16x16.png', to: '.' },
        { from: './src/favicon/favicon-32x32.png', to: '.' },
        { from: './src/favicon/apple-touch-icon.png', to: '.' },
        { from: './src/favicon/android-chrome-192x192.png', to: '.' },
        { from: './src/favicon/android-chrome-512x512.png', to: '.' },
        { from: './src/favicon/site.webmanifest', to: '.' },
      ]
    })
  ],

  module: {
    rules: [
      {
        test: /\.html$/i,
        use: ["html-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|gif|jpeg|jpg|svg)$/i,
        type: "asset/resource",
      },
    ],
  },
};
