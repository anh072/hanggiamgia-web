const path = require("path");

const config = {
  target: "node",

  node: {
    __dirname: false,
    __filename: false,
  },

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: 'url-loader'
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
  }
};

const lambdaConfig = Object.assign({}, config, {
  entry: "./server/handler/lambda.js",

  output: {
    path: path.resolve("lambda-build/app"),
    filename: "index.js",
    library: "index",
    libraryTarget: "umd",
  },
});

const localConfig = Object.assign({}, config, {
  entry: "./server/handler/local.js",

  output: {
    path: path.resolve("local-build"),
    filename: "index.js",
    library: "index",
    libraryTarget: "umd",
  },
});

module.exports = [ localConfig, lambdaConfig ];