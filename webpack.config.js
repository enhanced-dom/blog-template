const path = require('path')
const babelConfigFactory = require('@enhanced-dom/babel').configFactory
const webpackConfigFactory = require('@enhanced-dom/webpack')

fs = require('fs')

module.exports = (env = {}, argv = {}) => {
  const isProduction = argv.mode === 'production'
  const publicPath = '/'
  const babelConfig = babelConfigFactory()
  const embed = isProduction && !env.analyzeBundle

  return {
    mode: isProduction ? 'production' : 'development',
    entry: { bundle: ['./src/index.tsx'] },
    output: {
      filename: 'bundle-[contenthash].js',
      publicPath,
      path: path.resolve(__dirname, './dist'),
      clean: isProduction,
    },
    devtool: isProduction ? false : 'inline-source-map',
    resolve: {
      modules: ['./node_modules', path.resolve('./node_modules')],
      extensions: ['.tsx', '.ts', '.json', '.js', '.jsx', '.mdx'],
    },
    optimization: {
      concatenateModules: isProduction && !env.analyzeBundle,
      minimize: isProduction,
      emitOnErrors: !isProduction,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: webpackConfigFactory.loaders.babelConfigFactory({ babel: babelConfig }),
        },
        {
          test: /\.pcss$/,
          use: webpackConfigFactory.loaders.styleConfigFactory({
            extract: !embed,
            sourceMap: !isProduction,
            parser: 'postcss',
            typedStyles: true,
            modules: true,
          }),
        },
        {
          test: /\.css$/,
          use: webpackConfigFactory.loaders.styleConfigFactory({
            extract: !embed,
            sourceMap: !isProduction,
            parser: 'postcss',
            typedStyles: false,
          }),
        },
        {
          test: /\.mdx?$/,
          use: webpackConfigFactory.loaders.markdownConfigFactory({ babel: babelConfig, useProvider: true }),
        },
        {
          test: webpackConfigFactory.loaders.assetExtensions(),
          type: embed ? 'asset/inline' : 'asset/resource',
        },
        {
          test: /\.jsx?$/,
          include: /@enhanced-dom|gatsby-theme-waves|gatsby-theme-blog/,
          use: webpackConfigFactory.loaders.babelConfigFactory({ babel: babelConfig }),
        },
      ].concat(isProduction ? [] : [{ test: /\.jsx?$/, loader: 'source-map-loader', enforce: 'pre', include: /@enhanced-dom/ }]),
    },
    plugins: [
      ...webpackConfigFactory.plugins.htmlConfigFactory({
        embed,
        html: {
          minify: isProduction,
          title: 'Blog',
          favicon: './src/template.favicon.png',
        },
      }),
    ]
      .concat(isProduction ? webpackConfigFactory.plugins.terserConfigFactory({ embed: true, enableSourcemaps: false }) : [])
      .concat(env.analyzeBundle ? webpackConfigFactory.plugins.bundleAnalyzerConfigFactory() : [])
      .concat(embed ? [] : webpackConfigFactory.plugins.cssConfigFactory()),
    devServer: { historyApiFallback: true, port: 3000 },
  }
}
