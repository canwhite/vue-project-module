var webpack = require('webpack');
const merge = require('webpack-merge');

const commonFun = require('./webpack.base.config.js');


var path = require('path');
var projectRoot = path.resolve(__dirname, '');
//console.log(path.resolve(__dirname, ''))
//console.log(path.join(__dirname, ''))
function resolvePath(relativePath) {
  return path.resolve(relativePath);
}

var autoprefixer = require('autoprefixer')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); // separate css
var CopyWebpackPlugin = require('copy-webpack-plugin');

// init object
//To use the env variable, you must convert module.exports to a function
module.exports = (env) => {
	
	let entryDir = env.name;//入口目录
	let common = commonFun(env);
	
	/*port*/
	/*let random = parseInt(Math.random()*(9999-1000)+1000);*/
	let abc = "abcdefghijklmnopqrstuvwxyz";
	let initnum = 999;
	'kjcx'.split('').forEach((item,index)=>{
		let num = abc.indexOf(item)+1;
		initnum = (initnum+index)*num;
	})
	let port = initnum.toString().substr(-4);
	
	var webpackConfig = merge(common,{
		devServer : {
			contentBase: './',
			compress: false,
			historyApiFallback: true,
		 	open:true,
		 	//inline: true,
			host: '10.202.2.241',
			port: port?port:'8080',
		 	proxy: {
			}
		}
	});
	
	return webpackConfig;
}; 