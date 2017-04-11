/**
* @Author: Zz
* @Date:   2016-09-10T10:35:08+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-09-11T22:46:25+08:00
*/
const webpack = require('webpack');
const publicPath = '/zp/public';
const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
const HtmlWebpackPlugin = require('html-webpack-plugin');

const entry = [
  //'babel-polyfill',
  `${__dirname}/src/index.js`
];

const loaders = [
  { test: /\.jsx$/, loader: 'babel-loader?cacheDirectory', include: `${__dirname}/src` },
  { test: /\.(less|css)$/, loader: 'style-loader!css-loader!less-loader'},
  { test: /\.js|jsx$/, exclude: /node_modules/, loader: 'babel-loader', query: {
    cacheDirectory: true,
    plugins: [
      //'transform-runtime',
      //'add-module-exports',
      'transform-decorators-legacy',
    ],
    presets: ['es2015', 'react', 'stage-0'],
  }},
  { test: /\.json$/, loader: "json-loader"},
];

const plugins = [
  new HtmlWebpackPlugin( { template: 'src/index.html' } ),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.LoaderOptionsPlugin({
    options: {
      babel: {
        "plugins": [["antd"]]
      },
    }
  }),
];
if (process.env.NODE_ENV === 'development') {
  entry.unshift(hotMiddlewareScript);
  
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.NoEmitOnErrorsPlugin());
  loaders.push({ test: /\.(png|jpg|gif|jpe?g)$/, loader: 'file-loader'});
  loaders.push({ test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/, loader: "file-loader" });
} else if(process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.DefinePlugin({
    'process.env':{
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  }));
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    output: {
      comments: false,  // remove all comments
    },
    compress: {
      warnings: false
    }
  }));
  loaders.push({ test: /\.(png|jpg|gif|jpe?g)$/, loader: 'file-loader?limit=8192&name=/images/[hash].[ext]'});
  loaders.push({ test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/, loader: "file-loader?name=/fonts/[hash].[ext]" });
}

module.exports = {
    entry,
    resolve : {
        extensions:[".js", ".jsx", ".less", ".json", ".css"],
        alias: {
          //components: `${__dirname}/src/components`,
          //stores: `${__dirname}/src/stores`,
          //services: `${__dirname}/src/services`,
        }
    },
    //文件导出的配置
    output:{
        path : `${__dirname}/dist/`,
        filename: '[hash].bundle.js',
        chunkFilename: '[hash].bundle.js',
        publicPath
    },
    module: {
      loaders,
    },
    externals: {
      //react: 'React',
      //mobx: 'mobx',
      //antd: 'antd',
      //'react-dom': 'ReactDOM',
      //'react-router': 'ReactRouter',
    },
    
    plugins,
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        dns: 'empty',
        'iconv-lite': 'empty'
      }
}
