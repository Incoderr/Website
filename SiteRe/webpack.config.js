const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index.jsx", // Ваш основной файл JS
  output: {
    filename: "bundle.js", // Название выходного файла
    path: path.resolve(__dirname, "./dist"), // Папка для выходных файлов
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Обработка файлов .js и .jsx
        exclude: /node_modules/, // Исключение node_modules
        use: {
          loader: "babel-loader", // Используем babel-loader для трансформации JSX
        },
      },
      {
        test: /\.css$/, // Обработка CSS
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.svg$/, //кароче svg чтоб работало
        use: ["@svgr/webpack"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, 
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]", 
              outputPath: "images",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      favicon:'public/favicon.ico',
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"], // Поддержка .js и .jsx файлов
  },
  mode: "development", // Режим разработки
  devtool: "source-map", // Правильное использование source maps
  devServer: {
    historyApiFallback: true,
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    open: true,
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.use((req, res, next) => {
        console.log(`Request URL: ${req.url}`);
        next();
      });
      return middlewares;
    },
  },
};
