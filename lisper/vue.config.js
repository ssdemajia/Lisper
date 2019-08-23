const path = require('path');
module.exports = {
  pages: {
    home: {
      entry: 'src/home/index.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Lisper',
      chunks: ['home']
    },
    plugin: {
      entry: 'src/plugin/index.js',
      template: 'public/index.html',
      filename: 'plugin.html',
      title: 'Lisper Plugin',
      chunks: ['plugin']
    }
  },
  chainWebpack: config => {
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('md-loader')
      .loader('./md-loader')
      .options({
        stylePath: path.resolve(__dirname, 'md-loader.css')
      })
  },
  devServer: {
    port: 9999,
    host: '127.0.0.1',
    proxy: 'http://localhost:5000'
  }
}