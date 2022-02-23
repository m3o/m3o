let MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    home: './src/home.js',
    widgets: './src/widgets.js',
    'create-widget': './src/create-widget.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/public'
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin()]
}
