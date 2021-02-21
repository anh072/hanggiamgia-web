const path = require("path");

module.exports = {
  entry: "./server/handler/local.js",

  target: "node",

  node: {
    __dirname: false,
    __filename: false,
  },

  output: {
    path: path.resolve("server-build"),
    filename: "index.js",
    library: "index",
    libraryTarget: "umd",
  },

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: 'file-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
      },
      {
        test: /\.css$/,
        use: "css-loader",
      },
    ],
  },
};