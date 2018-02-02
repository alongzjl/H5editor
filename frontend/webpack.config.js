/**
 * Created by sunlong on 16/1/27.
 */
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

function plugins() {
    const arr = [];
    if (process.env.NODE_ENV === 'production') {
        arr.push(new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }));
        arr.push(new UglifyJsPlugin({
            sourceMap: true,
        }));
    }
    arr.push(new ExtractTextPlugin({ filename: 'css/[id].css' }))
    arr.push(new HtmlWebpackPlugin({
        chunks: ['front'],
        filename: 'index.html',
        template: path.join(__dirname, '/index-tmpl.html'),
    }));
    arr.push(new HtmlWebpackPlugin({
        chunks: ['viewer'],
        filename: 'viewer.html',
        template: path.join(__dirname, '/viewer-tmpl.html'),
    }));
    return arr;
}
module.exports = { 
    entry: {
        front: ['./src/index.js'],
        viewer: ['./viewer/viewer.js'],
    },
    output: { path: `${__dirname}/dist`, filename: 'js/[name].[hash].js', publicPath: '/' },
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            use: [{ loader: 'babel-loader' }],
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'less-loader'] }),
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }),
        }, {
            test: /\.(jpg|png|gif)$/,
            use: ['file-loader?name=images/[name].[ext]'],
        }, {
            test: /\.(eot|woff|woff2|ttf|svg)$/,
            use: ['file-loader?name=fonts/[name].[ext]'],
        }],
    },
    plugins: plugins(),
    externals: { // 全局引用
    
    },  
    devtool: '#hidden-source-map',
    node: {
        net: 'empty',
    },
};
