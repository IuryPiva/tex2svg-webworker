const path = require("path");

module.exports = {
  mode: "development",
  entry: "./tex2svg.js",
  output: { path: path.resolve(__dirname, "dist"), filename: "tex2svg.js" },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env"] },
        },
      },
    ],
  },
  plugins: [],
};
