const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
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