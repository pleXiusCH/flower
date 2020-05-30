const path = require('path');
const colors = require('./packages/flower-react-editor/colors');

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader"
      },

      {
        test: /\.less$/,
        use: [ {
          loader: 'style-loader',
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        },{
          loader: 'less-loader', // compiles Less to CSS
          options: {
            lessOptions: {
              modifyVars: colors,
              javascriptEnabled: true,
            },
          },
        }
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules\/antd/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      "@plexius/flower-core": path.resolve(__dirname, 'packages/flower-core/src/index.ts'),
      "@plexius/flower-interfaces": path.resolve(__dirname, 'packages/flower-interfaces/src/index.ts'),
      "@plexius/flower-nodes": path.resolve(__dirname, 'packages/flower-nodes/src/index.ts'),
      "@plexius/flower-react-editor": path.resolve(__dirname, 'packages/flower-react-editor/src/index.tsx'),
    }
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  }
};