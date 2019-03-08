//import Vue from 'vue'; // get vue
const Vue = $vue.default;

import Vuex from 'vuex'; // get vuex
Vue.use(Vuex);


const state = {
	urlParams:'',
	userInfo:{},
	dataUpdate:false,//公共列表前进后退是否需要刷新数据
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
