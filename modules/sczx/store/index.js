import Vue from 'vue'; // get vue
import Vuex from 'vuex'; // get vuex
Vue.use(Vuex);


const state = {
	permission:false,//访问权限
	reportFlag:0,//上报权限：0无，1：有
	urlParams:'',
	userInfo:{},
	dataUpdate:false//公共列表前进后退是否需要刷新数据
};

const getters = {};

const mutations = {
  	updateDemo(state, data) {
  	
  	},
};

const actions = {
  	getData(context, object) {
  		
	}
};


const store = new Vuex.Store({
 state,
 getters,
 mutations,
 actions,
});

export default store;
