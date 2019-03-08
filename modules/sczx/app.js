import Vue from 'vue'; // get vue

import 'ratchet-npm/dist/css/ratchet.css'; // get ratchet
import './static/fonts/iconfont.css';
//import 'font-awesome/css/font-awesome.css'; // get font-awesome
//import 'animate.css/animate.css'; // get animate.css
import 'viewerjs/dist/viewer.min.css'; //get viewer.css

import 'mint-ui/lib/style.min.css'; //get mint-ui-css
import MintUI from 'mint-ui';
Vue.use(MintUI);

/*fastclick*/
//import FastClick from 'fastclick';
//FastClick.attach(document.body); // init fastclick

/*进度条*/
import VueProgressBar from 'vue-progressbar'; // get vue-progressbar
const options = {
  color: '#a248ff',
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
/*无限加载组件*/
/*import InfiniteScroll from 'vue-infinite-scroll'; // get vue-infinite-scroll
Vue.use(InfiniteScroll);*/


import ystsdk from '@com_base/common/yst-sdk.js';
import '@com_base/common/filter.js';
import '@com_base/axios/axios_config.js';

import api from './API/index.js';
Vue.prototype.api = api;


import App from './app.vue'; // get root module
import router from './router';
import store from './store'; // get vuex -> store

//init
function INIT_VUE(){
	const app = new Vue({
	  router,
	  store,
	  render: h => h(App),
	}).$mount('#app');
}

store.state.userInfo.token = '3D2FD3A6AFE183F512E882DD2C36D4B6';
store.state.userInfo.appId = '1130';
store.state.userInfo.empCode = '021991';
store.state.urlParams = '?accessToken='+store.state.userInfo.token+'&accessCode='+store.state.userInfo.empCode+'&accessAppId='+store.state.userInfo.appId;
ystsdk.setStatusBarColor('a248ff',1);
// init
INIT_VUE();


//从iso/Android获取登录信息
/*ystsdk.userInfo(function(Data){
	store.state.userInfo = Data;
	store.state.urlParams = '?accessToken='+Data.token+'&accessCode='+Data.empCode+'&accessAppId='+Data.appId;
	//修改系统状态栏
	ystsdk.setStatusBarColor('a248ff',1);
	// init
	INIT_VUE();
})*/
