let MiniCssExtractPlugin = require('mini-css-extract-plugin')

let mode = process.env.NODE_ENV || 'development'

module.exports = {
  mode,
  entry: {
    home: './src/home.js',
    widgets: './src/widgets.js',
    'create-widget': './src/create-widget.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/public'
  },
  watch: mode === 'development',
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
