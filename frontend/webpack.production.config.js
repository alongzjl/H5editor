
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

function plugins() {
    const arr = []; 
    arr.push(new CleanWebpackPlugin([`${__dirname}/build`], { verbose: false }));
   arr.push(new webpack.optimize.CommonsChunkPlugin({
           names: ["common","react",'second',"manifest"]
	 }));
	  
    arr.push(new ExtractTextPlugin({ filename: 'css/[id].css' }))
    arr.push(new HtmlWebpackPlugin({
        chunks: ['front','react','second','common','manifest'],
        chunksSortMode: 'dependency' ,
        filename: 'index.html',
        template: path.join(__dirname, '/index-tmpl.html'),
    }));
    arr.push(new HtmlWebpackPlugin({
        chunks: ['viewer','react','second','common','manifest'],
        chunksSortMode: 'dependency' ,
        filename: 'viewer.html',   
        template: path.join(__dirname, '/viewer-tmpl.html'),
    }));
     arr.push(new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }));
        arr.push(new UglifyJsPlugin({
            sourceMap: true,
        }));
    
    return arr;
}
module.exports = {
    entry: {
        front: './src/index.js',
        viewer: './src/viewer.js',
        react:['react','react-dom','react-router'], 
        second:['swiper','react-redux','youziku']
    },
    output: { path: `${__dirname}/build`, filename: 'js/[name].[hash].js', publicPath: './' },
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
   // devtool: '#hidden-source-map',
    node: {
        net: 'empty',
    },
};
