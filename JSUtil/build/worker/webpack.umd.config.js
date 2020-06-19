const path = require('path');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const UglifyJsPlugin = require('terser-webpack-plugin');

const webpackConfig = merge(baseWebpackConfig, {
    context: __dirname,
    entry: {
        // CreateLink: '../../ChatNet/CreateLink.js'
        chatclient: '../../ChatClient/chatclient.js'
        // HistogramContourWorker: '../../sup/HistogramContourWorker.js'
    },
    mode: process.env.NODE_ENV === 'production' ? "production" : 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: process.env.NODE_ENV === 'production' ? 'chatclient.min.js' : 'chatclient.js',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    // development server options
    devServer: {
        contentBase: [path.join(__dirname, 'dist'), path.join(__dirname, 'Example')],
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,OPTIONS,DELETE",
            "Access-Control-Allow-Headers": "x-requested-with,content-type"
        }
    }
});

if (process.env.NODE_ENV === 'production') {
    webpackConfig.plugins.push(
        new UglifyJsPlugin({
            parallel: true,
            sourceMap: false
        })
    )
} else {
    webpackConfig.devtool = 'cheap-module-eval-source-map';
}

module.exports = webpackConfig
