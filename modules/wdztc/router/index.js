import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import { Indicator, Toast } from 'mint-ui';

/*AMD-require*/
/*const Permission = resolve => require(['../views/train/permission.vue'], resolve);
const List = resolve => require(['../views/train/home.vue'], resolve);
const History = resolve => require(['../views/train/history.vue'], resolve);
const fileUpload = resolve => require(['../views/train/fileupload.vue'], resolve);
const Detail = resolve => require(['../views/train/detail.vue'], resolve);
const Search = resolve => require(['../views/train/search.vue'], resolve);*/

/**
 * require.ensure 是 Webpack 的特殊语法，用来设置 code-split point（代码分块）
 */
const Permission = r => require.ensure([], () => r(require('../views/train/permission.vue')),'Permission')
const Home = r => require.ensure([], () => r(require('../views/train/home.vue')),'Home')
const History = r => require.ensure([], () => r(require('../views/train/history.vue')),'History')
const fileUpload = r => require.ensure([], () => r(require('../views/train/fileupload_v3.vue')),'fileUpload')
const Detail = r => require.ensure([], () => r(require('../views/train/detail.vue')),'Detail')
const Search = r => require.ensure([], () => r(require('../views/train/search.vue')),'Search')


Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/control '},
  { path: '/control ', component: Permission, meta: {cache: false}},
  {
  	path: '/home',
  	component: Home,
  	meta: {cache: true}
  },
  { path: '/report', component: fileUpload, meta: {cache: false}},
  {
  	path: '/history',
  	component: History,
  	meta: {cache: true}
  },
  { path: '/search',
  	component: Search,
  	meta: {cache: true}
  },
  { path: '/detail/:fromPath/:id', component: Detail ,meta: {cache: false}},
  { path: '*', redirect:'/' }
];

/*const router = new VueRouter({routes});*/
const router = new VueRouter({
	mode: 'hash',
	scrollBehavior (to, from, savePosition) {
	 	if(savePosition) {
	      return savePosition;
	    }else{
	      return {x:0,y:0}
	    }
	},
	routes
})

router.beforeEach((to, from, next) => {
	if(!navigator.onLine){Toast({message:'网络不给力，请检查网络',position: 'bottom',duration: 2000});}
	next();
})

router.afterEach(function(to,from){
	
})

export default router;
