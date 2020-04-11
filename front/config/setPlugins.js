const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const TextReplaceHtmlWebpackPlugin = require('text-replace-html-webpack-plugin');

const dot = new Dotenv({
  path: './.env',
});

const minify = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
};

const modules = [
  {
    filename: './index.html',
    template: './src/modules/institucional/index.html',
    chunks: ['main', 'main~portal', 'vendors'],
    minify,
  },
  {
    filename: './portal/index.html',
    template: './src/modules/portal/index.html',
    chunks: ['portal', 'main~portal', 'vendors'],
    minify,
  },
];

module.exports = () => {
  const htmls = modules.map((module) => new HtmlWebpackPlugin(module));

  const analytics = dot.definitions['process.env.ANALYTICS'].replace(/[\\"]/g, '');
  const scripts = new ScriptExtHtmlWebpackPlugin({
    sync: '[name]',
    defaultAttribute: 'async',
    preload: 'vendors',
  });

  const miniCss = new MiniCssExtractPlugin({
    filename: 'assets/css/[name].[hash:6].css',
  });

  const replaces = new TextReplaceHtmlWebpackPlugin({
    replacementArray: [
      {
        searchString: '@@ANALYTICS',
        replace: analytics,
      },
    ],
  });

  return [dot, miniCss, ...htmls, replaces, scripts];
};
