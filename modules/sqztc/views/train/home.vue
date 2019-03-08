<template>
	<div class="route list">
		<div class="slogan-banner">
			<bar-top
	    	:show-return-icon="true"
	    	:show-right-icon="$store.state.reportFlag==1">
			</bar-top>
			<!--banner-->
			<div class="report-banner" v-if="$store.state.reportFlag==1">
				<div class="banner-img"><img src="../../static/images/question.png"/></div>
				<div class="banner-desc">
					<div>问题上报</div>
					<div>工作的烦恼来这里谈谈！<br/>系统类问题请至IT服务台上报</div>
				</div>
				<div class="banner-btn"><router-link to="/report">去上报</router-link></div>
			</div>
	
			<!--navbar-->
			<div class="navbar-content">
				<mt-navbar :fixed="false" v-model="active" class="navbar">
				  <mt-tab-item id=""  class="tab">最新</mt-tab-item>
				  <mt-tab-item id="1" class="tab">咨询</mt-tab-item>
				  <mt-tab-item id="2" class="tab">建议</mt-tab-item>
				  <div class="tab-search" @click="$router.push('/search')"><i class="iconfont uct-icon-sousuo"></i></div>
				</mt-navbar>
			</div>
		</div>
		
		<div v-bind:style="{'padding-top':$store.state.reportFlag==1?'267px':'96px'}">
			
			<list-dom :type="active" 
				:basedata="active==''?dataTab0.basedata:(active=='1'?dataTab1.basedata:dataTab2.basedata)" 
				:baseloaded="active==''?dataTab0.baseloaded:(active=='1'?dataTab1.baseloaded:dataTab2.baseloaded)" 
				:basepage="active==''?dataTab0.basepage:(active=='1'?dataTab1.basepage:dataTab2.basepage)" 
				:scrollTop="active==''?dataTab0.scrollTop:(active=='1'?dataTab1.scrollTop:dataTab2.scrollTop)" 
				@cacheData="cacheData">
			</list-dom>
			
		</div>
		
	</div>
</template>

<script>
	import barTop from '../../components/barTop.vue';
	import listDom from '../../components/childlistcache.vue';
	
	export default {
	  	components: {
	    	'bar-top': barTop,
	    	'list-dom': listDom,
	  	},
	  	computed: {
	  	},
	  	data() {
	  		return {
	  			active: '',
	  			dataTab0:{
	  				basedata:[],
	  				baseloaded:false,
	  				basepage:1,
	  				scrollTop:0
	  			},
	  			dataTab1:{
	  				basedata:[],
	  				baseloaded:false,
	  				basepage:1,
	  				scrollTop:0
	  			},
	  			dataTab2:{
	  				basedata:[],
	  				baseloaded:false,
	  				basepage:1,
	  				scrollTop:0
	  			}
  			}
	  	},
	  	created(){
	  	},
	  	mounted(){
 	 	},
	  	methods:{
	  		cacheData(type,data){
	  			if(type==''){
	  				this.dataTab0 = data;
	  			}
	  			if(type=='1'){
	  				this.dataTab1 = data;
	  			}
	  			if(type=='2'){
	  				this.dataTab2 = data;
	  			}
	  		}
	  	},
	 	watch: {
	 		active:function(newval, oldval){
	 			if(oldval==''){
	 				this.dataTab0.scrollTop = document.body.scrollTop;
	 			}
	 			if(oldval=='1'){
	 				this.dataTab1.scrollTop = document.body.scrollTop;
	 			}
	 			if(oldval=='2'){
	 				this.dataTab2.scrollTop = document.body.scrollTop;
	 			}
	 		}
	  	}
	}
</script>

<style>
	.slogan-banner{
	    position: fixed;
	    top: 0;
	    width: 100%;
	    z-index: 99;
	    background-color: rgb(247, 246, 251);
	}
	.report-banner{
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 166px;
		background-color: #ffffff;
		padding: 15px;
		margin-bottom: 5px;
	}
	.banner-img{width:88px;height: 100px;}
	.banner-img img{width: 100%;height: 100%;}
	.banner-desc{flex: 1;height: 80px;padding: 0 10px;position: relative;}
	.banner-desc div:first-child{font-size: 15px;color: #333;}
	.banner-desc div:last-child{font-size: 12px;color: #999;position: absolute;bottom: 0;white-space: nowrap;}
	.banner-btn{
		position: absolute;
		right: 15px;
		width: 60px;
		height: 30px;
		background-image: linear-gradient(-90deg, #803ee6 0%, #b178e9 100%), 
		linear-gradient(#f47821, #f47821);
		background-blend-mode: normal, normal;
		border-radius: 22px;
	    font-size: 12px;
	    text-align: center;
	    color: #fff;
	    line-height: 30px;
	}
	.banner-btn a{color: #fff;}
	
	.navbar-content{margin: 0 0 3px 0;}
	.tab-search{position:relative;width: 50px;border-left: 1px solid #ccc;height: 35px;}
	.tab-search i{position: absolute;top: 7px;left: 12px;font-size: 20px;color: #999;}
	.navbar{align-items: center;}
	.navbar .tab{color: #999; margin: 0 20px;}
	.mint-tab-item>.mint-tab-item-label{font-size: 15px!important;}
	.list .mint-navbar .mint-tab-item.is-selected{color: #a248ff;border-bottom-color: #a248ff;}
	
</style>