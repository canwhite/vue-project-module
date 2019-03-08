<template>
  <header class="bar bar-nav bar-easy-vue" :style="styles">
    <a class="icon iconfont uct-icon-fanhui pull-left" v-if="showReturnIcon" @click="goBack"></a>
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
    	default: '快捷查询'
    },
    rightTitle:{
    	default: '更多'
    },
    styles:{
    	type:Object,
    	default:function(){
    		return {
    			background:'#a248ff',
    			color:'#fff'
    		}
    	}
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
  .bar {
    position: fixed;
    top:0;
    right: 0;
    left: 0;
    z-index: 999;
    height: 44px;
    padding-right: 10px;
    padding-left: 10px;
    /*background-color: #a248ff;*/
    /*background-image: linear-gradient(-90deg, #803ee6 0%, #b178e9 100%), 
		linear-gradient(#f47821, #f47821);
		background-blend-mode: normal, normal;*/
    /*border-bottom: 1px solid #ddd;*/
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
	}
	.bar .icon {
    position: relative;
    z-index: 20;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 22px;
	}
	.pull-left {
    float: left;
	}
	.pull-right {
    float: right;
	}
  .title {
    position: absolute;
    display: block;
    width: 100%;
    padding: 0;
    margin: 0 -10px;
    font-size: 17px;
    font-weight: 500;
    line-height: 44px;
    text-align: center;
    white-space: nowrap;
	}
</style>
