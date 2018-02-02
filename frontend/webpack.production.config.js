
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

function plugins() {
    const arr = [];  
    arr.push(new CleanWebpackPlugin([`${__dirname}/build`], { verbose: false }));
   arr.push(new webpack.optimize.CommonsChunkPlugin({
           names: ['build','page',"react",'second','third',"manifest"]
	 })); 
	  
    arr.push(new ExtractTextPlugin({ filename: 'css/[id].css' }));
   
    arr.push(new HtmlWebpackPlugin({
        chunks: ['front','build','react','second','page','third','manifest'],
        chunksSortMode: 'dependency' ,
        filename: 'index.html',
        template: path.join(__dirname, '/index-tmpl.html'),
       
    }));
    arr.push(new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }));
        arr.push(new UglifyJsPlugin({
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
    	page:'./src/components/h5/pageContainer/PageContainer.js',
    	build:'./src/components/h5/Builder.js',
    	front: './src/index.js',
        react:['react','react-dom','react-router','redux','redux-undo','react-simpletabs','react-color','react-resizable-box'], 
        second:['react-redux','react-select','react-skylight','noty','react-contextmenu','react-draggable'],
        third:['pinyin','youziku','swiper'] 
    },
    output: { path: `${__dirname}/build`, filename: 'js/[name].[hash].js', publicPath: './' },
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            include: path.resolve(__dirname, 'src'),
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
