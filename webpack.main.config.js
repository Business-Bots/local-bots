const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',

  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/dialogs/prompt.html', // Replace with the path to your HTML file
      filename: 'prompt.html', // Output filename for the generated HTML file
      inject: 'body' // Inject scripts into the body of the HTML file
    })
  ]
};
