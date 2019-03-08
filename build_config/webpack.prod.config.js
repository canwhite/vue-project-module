var webpack = require('webpack');
var path = require('path');
const merge = require('webpack-merge');
const commonFun = require('./webpack.base.config.js');
var autoprefixer = require('autoprefixer')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); // separate css
var CopyWebpackPlugin = require('copy-webpack-plugin');
var projectRoot = path.resolve(__dirname, '');//当前文件所在目录
console.log(projectRoot)
function resolvePath(relativePath) {
  return path.resolve(relativePath);
}

module.exports = (env) => {
	
	let entryDir = env.name;//入口目录
	let common = commonFun(env);
	
	var webpackConfig = merge(common,{
		plugins : [
	  	//代码压缩，编译会变慢
	  	new webpack.optimize.UglifyJsPlugin({
		  	compress: {
	   	 		warnings: false
		  	},
	  	 	mangle: {
				  safari10: true
			 	},
		  	sourceMap: true
	  	}),
		]
	});

	return webpackConfig;
}
