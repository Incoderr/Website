const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js', // Ваш основной файл JS
  output: {
    filename: 'bundle.js', // Название выходного файла
    path: path.resolve(__dirname, './dist'), // Папка для выходных файлов
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,  // Обработка файлов .js и .jsx
        exclude: /node_modules/, // Правильное исключение node_modules
        use: {
          loader: 'babel-loader', // Используем babel-loader для трансформации JSX
        },
      },
      {
        test: /\.css$/,  // Обработка CSS
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
  ],
  
  resolve: {
    extensions: ['.js', '.jsx'], // Поддержка .js и .jsx файлов
  },
  mode: 'development', // Режим разработки
  devServer: {
    historyApiFallback: true,
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    open: true,
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.use((req, res, next) => {
        console.log(`Request URL: ${req.url}`);
        next();
      });
      return middlewares;
    }
  },
};
