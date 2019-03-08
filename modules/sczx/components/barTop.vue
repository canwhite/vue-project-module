<template>
  <header class="bar bar-nav bar-easy-vue">
    <a class="icon icon-left-nav pull-left" v-if="showReturnIcon" @click="goBack"></a>
    <a class="icon pull-right" v-if="showRightIcon" @click="task()" style="line-height: 24px;font-size: 13px;">{{rightTitle}}</a>
    <h1 class="title">{{topBarTitle}}</h1>
  </header>
</template>

<script>
export default {
  props: {
    showRefeshIcon: {
      default: false
    },
    showReturnIcon: {
      default: true
    },
    showRightIcon: {
      default: false
    },
    topBarTitle:{
    	default: '标题'
    },
    rightTitle:{
    	default: '按钮'
    }
  },
  methods:{
    task: function() {
    	this.$router.push('/history')
    },
    refresh: function() {
      this.$store.dispatch('getData', {
        progress: this,
        refresh: true
      });
    },
    goBack: function() {
    	if(this.$route.path.indexOf("/home") != -1){
    		//返回主页
    		window.location.href = "js://uct?method=closeWebview";
    	}else{
  			this.$router.go(-1);
  			//this.$router.back();
    		//window.history.back();
    	}
    }
  }
}
</script>

<style>
  .bar-easy-vue {
  	position: relative!important;
  	background-color: #a248ff;
    /*background-image: linear-gradient(-90deg, #803ee6 0%, #b178e9 100%), 
		linear-gradient(#f47821, #f47821);
		background-blend-mode: normal, normal;*/
  }
  .bar-easy-vue a, h1 {
    color: #fff !important;
  }
</style>
