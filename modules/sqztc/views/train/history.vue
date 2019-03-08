<template>
	<div class="route history" v-cloak>
		<div class="top-banner">
			<bar-top
	    	:show-return-icon="true"
	    	:show-right-icon="false"
	    	topBarTitle="历史上报">
			</bar-top>
			<!--navbar-->
			<div class="navbar-content">
				<mt-navbar :fixed="false" v-model="active" class="navbar">
				  <mt-tab-item id="1" class="tab">处理中</mt-tab-item>
				  <mt-tab-item id="2" class="tab">待确认</mt-tab-item>
				  <mt-tab-item id="3" class="tab">已完成</mt-tab-item>
				</mt-navbar>
			</div>
		</div>
		
		<div style="padding-top: 97px;">
			<list-dom :type="active"></list-dom>
		</div>
	</div>
</template>

<script>
	import barTop from '../../components/barTop.vue';
	import listDom from '../../components/childhistory.vue';
	export default {
	  components: {
	    'bar-top': barTop,
	    'list-dom': listDom,
	  },
  	  /*计算属性*/
	  computed: {
	  },
	  created(){
	  },
	  activated(){

	  },
  	  beforeRouteLeave(to,from,next){
	  	if(to.path.indexOf('/detail')!=-1){
	  		this.$store.state.dataUpdate = false;
	  	}else{
	  		this.$store.state.dataUpdate = true;
	  		this.active = '1';
	  	}
  		next()
	  },
	  data() {
	  	return {
	  		active: '1'
	  	}
	  },
	  methods:{
	  	
	  },
	  watch: {

	  }
	}
</script>

<style>
	.top-banner{
	    position: fixed;
	    top: 0;
	    width: 100%;
	    z-index: 99;
	}
	.history li>div{padding-left: 10px!important;padding-right: 10px!important;}
	.history .bar{border-bottom: none;}
	.history .navbar-content{margin: 0;width: 100%;}
	.history .mint-navbar{
		background-color: #a248ff;
		/*background-image: linear-gradient(-90deg, #803ee6 0%, #b178e9 100%), 
		linear-gradient(#f47821, #f47821);
		background-blend-mode: normal, normal;*/
	}
	.history .navbar .tab{margin: 0 20px;color: rgba(255, 255, 255, 0.8);padding: 17px 0;}
	.mint-tab-item>.mint-tab-item-label{font-size: 15px!important;}
	.history .mint-navbar .mint-tab-item.is-selected{color: #fff;border-bottom-color: #fff;margin-bottom:1px;}
	
</style>