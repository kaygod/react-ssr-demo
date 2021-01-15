const path = require('path');
const nodeExternals = require('webpack-node-externals'); //避免将一些node包打包到bundle中

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './src/index.js',
  devtool: 'eval-source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      //所有的js文件会在webpack中过一遍,通过babel-loader转入到babel中进行编译,翻译成正常的js后打包到bundle.js
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  chrome: '67',
                },
                useBuiltIns: 'usage',
              },
            ],
            '@babel/preset-react',
          ],
          plugins: ['@babel/plugin-proposal-class-properties'],
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'isomorphic-style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              esModule: false,
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
};
