//import Vue from 'vue'; // get vue
const Vue = $vue.default;

import VueRouter from 'vue-router';
Vue.use(VueRouter);

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
const Home = r => require.ensure([], () => r(require('../views/home.vue')),'Home')
const search_wayBill = r => require.ensure([], () => r(require('../views/waybill/search.vue')),'search_wayBill')
const detail_wayBill = r => require.ensure([], () => r(require('../views/waybill/detail.vue')),'detail_wayBill')
const search_site = r => require.ensure([], () => r(require('../views/sitequery/search.vue')),'search_site')
const detail_site = r => require.ensure([], () => r(require('../views/sitequery/detail.vue')),'detail_site')
const search_bighead = r => require.ensure([], () => r(require('../views/bighead/search_new.vue')),'search_bighead')
const detail_bighead = r => require.ensure([], () => r(require('../views/bighead/detail.vue')),'detail_bighead')
const search_freight = r => require.ensure([], () => r(require('../views/freight/freight.vue')),'search_freight')


const routes = [
  { path: '/', redirect: '/home '},
  {
  	path: '/home',
  	component: Home,
  	meta: {cache: true}
  },
  //运单跟踪
  { path: '/search_wayBill',
  	component: search_wayBill,
  	meta: {cache: false}
  },
  { path: '/detail_wayBill/:id',
  	component: detail_wayBill,
  	meta: {cache: false}
  },
  //网点查询
  { path: '/search_site',
  	component: search_site,
  	meta: {cache: false}
  },
  { path: '/detail_site/:baseOrgCode/:cmsOrgId',
  	component: detail_site,
  	meta: {cache: false}
  },
  //大头笔
  { path: '/search_bighead',
  	component: search_bighead,
  	meta: {cache: false}
  },
  { path: '/detail_bighead/:baseOrgCode/:cmsOrgId',
  	component: detail_bighead,
  	meta: {cache: false}
  },
  { path: '/search_freight',
  	component: search_freight,
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
	
	/*如果从表单页去详情页面缓存表单页、否则不缓存表单页*/
	/*if(from.path.indexOf('search')!=-1 && to.path.indexOf('detail')!=-1){
		from.meta.cache = true;
	}else{
		from.meta.cache = false;
	}*/
	
	next();
})

router.afterEach(function(to,from){
	
})

export default router;
