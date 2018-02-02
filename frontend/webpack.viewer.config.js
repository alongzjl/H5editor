
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

function plugins() {
    const arr = [];  
    arr.push(new CleanWebpackPlugin([`${__dirname}/view`], { verbose: false }));
   arr.push(new webpack.optimize.CommonsChunkPlugin({
           names: ["react",'second',"manifest"]
	 })); 
	  
    arr.push(new ExtractTextPlugin({ filename: 'css/[hash].css' }));
  
    arr.push(new HtmlWebpackPlugin({
        chunks: ['viewer',"react",'second',"manifest"],
        chunksSortMode: 'dependency' ,
        filename: 'viewer.html',   
        template: path.join(__dirname, '/viewer-tmpl.html'),
   }));
     arr.push(new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }));
        arr.push( new UglifyJsPlugin({
        		uglifyOptions: {
        			compress: {
        				warnings:false,
        				drop_console: true,
        				collapse_vars: true,
					      // 提取出出现多次但是没有定义成变量去引用的静态值
					      reduce_vars: true,
					      dead_code:true,
					      unused:true
        			},
        			mangle: {
        				safari10:true
        			}
        		}, 
        		sourceMap:false
        }));
     return arr;
}
module.exports = {
    entry: {
    	viewer: './viewer/viewer.js',
       react:['react','react-dom','react-router','redux','socket.io-client'], 
        second:['youziku','swiper','pinyin']
     },
    output: { path: `${__dirname}/view`, filename: 'js/[name].[hash].js', publicPath: './' },
    module: {
        rules: [{ 
            test: /\.js?$/,
            exclude: /node_modules/,
            include: path.resolve(__dirname, 'viewer'),
            use: [{ loader: 'babel-loader' }],
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'less-loader'] }),
        }, {
            test: /\.css$/,
             use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use:[
                        {
                            loader: 'css-loader'
                          }
                    ]
                }),
        }, {
            test: /\.(jpg|png|gif)$/,
            use: ['file-loader?name=images/[name].[ext]'],
        }, {
            test: /\.(eot|woff|woff2|ttf|svg)$/,
            use: ['file-loader?name=fonts/[name].[ext]'],
        }],
    },
     resolve: {
        modules: [path.resolve(__dirname, 'node_modules')]
    },
    plugins: plugins(),
    node: {
        net: 'empty',
    },
};
