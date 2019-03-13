//import Vue from 'vue'; // get vue
const Vue = $vue.default;
//Vue.config.productionTip = false;

import './static/fonts/iconfont.css';//iconfont-css
import './static/fonts/iconfont.js';//iconfont-svg
//import 'font-awesome/css/font-awesome.css'; // get font-awesome
//import 'animate.css/animate.css'; // get animate.css
//import 'viewerjs/dist/viewer.min.css'; //get viewer.css

import 'mint-ui/lib/style.min.css'; //get mint-ui-css
import MintUI from 'mint-ui';
Vue.use(MintUI);


/*fastclick*/
//import FastClick from 'fastclick';
//FastClick.attach(document.body); // init fastclick

//eruda
/*import eruda from 'eruda/eruda.min.js';
 *var NODE_ENV = process.env.NODE_ENV.trim();
if(NODE_ENV.indexOf('prod')==-1){
	eruda.init();
}*/

/*无限加载组件*/
/*import InfiniteScroll from 'vue-infinite-scroll'; // get vue-infinite-scroll
Vue.use(InfiniteScroll);*/

/*进度条*/
import VueProgressBar from 'vue-progressbar'; // get vue-progressbar
const options = {
color: '#fff',
failedColor: '#874b4b',
thickness: '3px',
transition: {
    speed: '0.2s',
    opacity: '0.6s'
},
autoRevert: true,
location: 'top',
inverse: false
};
Vue.use(VueProgressBar, options);


//过滤器和axios
import '@com_base/common/filter.js';
import '@com_base/axios/axios_config.js';
import ystsdk from '@com_base/common/yst-sdk.js';

//后台接口
import api from './API/index.js';
Vue.prototype.api = api;

//init-Vue-#app
import App from './app.vue'; // get root module
import router from './router';
import store from './store'; // get vuex -> store
const INIT_VUE = function(){
	const app = new Vue({
	  router,
	  store,
	  render: h => h(App),
	}).$mount('#app');
}

$("body").on("touchmove",function(){
	document.activeElement.blur();
})

/*
 * h5和App交互
 */
//本地调试数据
store.state.userInfo.token = '3FD3BF8EAA4F7BDB8D3CDEDA0213666B';
store.state.userInfo.appId = '1130';
store.state.userInfo.empCode = '021991';
store.state.userInfo.orgId = '23987';
store.state.userInfo.empName = 'test';
//从收藏中心访问appId从地址中获取
if(window.location.hash.indexOf('appId')!=-1){
	var appId = window.location.hash.split('=')[1];
}else{
	var appId = store.state.userInfo.appId;
}
store.state.urlParams = '?accessToken='+store.state.userInfo.token+'&accessCode='+store.state.userInfo.empCode+'&accessAppId='+appId;
ystsdk.setStatusBarColor('a248ff',1);
INIT_VUE();


//从iso/Android获取登录信息
/*ystsdk.userInfo(function(Data){
	store.state.userInfo = Data;
	//从收藏中心访问appId从地址中获取
	if(window.location.hash.indexOf('appId')!=-1){
		var appId = window.location.hash.split('=')[1];
	}else{
		var appId = Data.appId;
	}
	//接口统一参数
	store.state.urlParams = '?accessToken='+Data.token+'&accessCode='+Data.empCode+'&accessAppId='+appId;
	//修改系统状态栏
	ystsdk.setStatusBarColor('a248ff',1);
	// init
	INIT_VUE();
})*/