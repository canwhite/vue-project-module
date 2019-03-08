import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import { Indicator, Toast } from 'mint-ui';


/**
 * require.ensure 是 Webpack 的特殊语法，用来设置 code-split point（代码分块）
 */
const Home = r => require.ensure([], () => r(require('../views/layout/home.vue')),'Home')


Vue.use(VueRouter);


const routes = [
  {
  	path: '/home',
  	component: Home,
  	meta: {cache: false}
  },
  { path: '*', redirect:'/home' }
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
