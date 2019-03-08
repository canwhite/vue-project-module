var webpack = require('webpack');

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
	
	var webpackConfig ={};
	
	// input
	webpackConfig.entry = {
	  app: './modules/' +entryDir+ '/app.js',// main
	};
	
	// output
	webpackConfig.output = {
	  path: path.resolve(__dirname, '../dist/'+entryDir),
	  publicPath: '',
	  filename: '[name].[hash:8].js',
	  chunkFilename:'js/[name].[chunkhash:8].chunk.js'
	};
	
	// loader
	webpackConfig.module = {
	  rules: [
	    {
	      test: /\.css$/,
	      use: ExtractTextPlugin.extract({
	        fallback: "style-loader",
	        use: "css-loader",
	      }),
	    },
	    {
	    	test: /\.(scss|less)$/,
	    	loader: ExtractTextPlugin.extract({
	        fallback: "style-loader",
	        use: "sass-loader!less-loader!postcss-loader",
	      })
	    },
	    {
	      test: /\.vue$/,
	      loader: 'vue-loader',
	   		options: {
	        // vue-loader options go here
	        postcss: [
		        autoprefixer({
		        	rowsers: ['last 10 Chrome versions', 'last 10 Firefox versions', 'Safari >= 6', 'ie > 8'] 
		        })
	        ],
	        loaders: {
		        css: ExtractTextPlugin.extract({
		          use: 'css-loader',
		          fallback: 'vue-style-loader'
		        }),
		       	sass: ExtractTextPlugin.extract({
		          use: 'sass-loader!css-loader',
		          fallback: 'vue-style-loader'
		        })
		      }
	    	}
	    },
	    {
	      test: /\.js$/,
	      loader: 'babel-loader',
	      exclude: /node_modules/,
	    },
	    {
	      test: /\.(eot(|\?v=.*)|woff(|\?v=.*)|woff2(|\?v=.*)|ttf(|\?v=.*)|svg(|\?v=.*))$/,
	      loader: 'file-loader',
	      options: { name: 'static/iconfont/[name].[hash:8].[ext]' },
	    },
	    {
	    	//html中引用过的图片将会打包至images目录下，未使用过的将不会存在
	      test: /\.(png|jpg|jpeg|gif)$/,
	      loader: 'url-loader',
	      options:{
	      	limit:8192,
	      	//name:'images/[name].[hash:8].[ext]',
	      	name:'static/images/[name].[ext]'
	      }
	    }
	  ]
	};
	
		
	//外部拓展，需要使用使用script标签引入
	/*webpackConfig.externals = {
		'vue': 'Vue',
		'vue-router' : 'VueRouter',
		'jquery': 'jQuery',
	}*/
	
	//解析拓展名和常用路径的别名设置,减少webpack搜索磁盘的时间
	webpackConfig.resolve = {
		extensions: ['.js', '.vue', '.json','.css'],
		alias: {
			'@com_base' : path.resolve(__dirname, '../com_base'),
			'@entry' : path.resolve(__dirname, '../modules/'+ entryDir),
		}
	};
	
	webpackConfig.plugins = [
			//根据模块所在路径来映射其 module id ，这样就算引入了新的模块，也不会影响 module id 的值，只要模块的路径不改变的话。
	  	new webpack.HashedModuleIdsPlugin(),
	  	
	  	//拷贝
	  	/*new CopyWebpackPlugin([
	  		{ from: 'modules/'+entryDir+'/static', to: 'static' }
	  	]),*/
	  
	  	/*
	  	 * 环境变量配置
	  	 */
			new webpack.DefinePlugin({
	    	'process.env': {
	      	"NODE_ENV": JSON.stringify(env.NODE_ENV),
	      	"entryDir": JSON.stringify(env.name)
	    	}
			}),
			
			//自动加载模块，而不必到处 import 或 require 。
	  	new webpack.ProvidePlugin({
	  		$:'jquery',
	  		axios:'axios',
	  		$vue:'vue'
	  	}),
	  	
	  	// separate css file
	  	new ExtractTextPlugin({
	    	filename: 'app.[chunkhash:8].css',
	    	allChunks: true,
	    	// disable: false,
	  	}),
	  	
	  	// make index.html
	  	new HtmlWebpackPlugin({
	    	template: './modules/'+ entryDir +'/index.html',
	    	favicon: resolvePath('./modules/'+ entryDir +'/favicon.ico')
	  	}),
	  	
	  	
	  	//默认会把所有入口节点的公共代码提取出来,生成一个common.js
	  	//有选择的提取公共代码(只提取app.js和vendor.js)
			//new webpack.optimize.CommonsChunkPlugin({
			//	name:'common',
			//	chunks:['vendor','app']
			//}),
	];


	return webpackConfig;
}; 