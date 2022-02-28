let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'src', 'hello-world.tsx'),
  output: path.resolve(__dirname, '../..', 'site/public'),
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
    }),
  ],
}