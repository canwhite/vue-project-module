<template>
	<div class="route list">
		<div class="slogan-banner">
			<bar-top
			topBarTitle="收藏"
	    	:show-return-icon="true"
	    	:show-right-icon="$store.state.reportFlag==1">
			</bar-top>
		</div>
		
		<div v-bind:style="{'padding-top':'44px'}">
			
			<list-dom></list-dom>
			
		</div>
		
	</div>
</template>

<script>
	import barTop from '../../components/barTop.vue';
	import listDom from '../../components/childlist.vue';
	
	export default {
	  	components: {
	    	'bar-top': barTop,
	    	'list-dom': listDom,
	  	},
	  	computed: {
	  	},
	  	data() {
	  		return {
	  			
  			}
	  	},
	  	created(){
	  	},
	  	mounted(){

 	 	},
	  	methods:{

	  	},
	 	watch: {
	 		
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
	
	.navbar-content{margin: 0 0 3px 0;display: flex;align-items: center;background-color: #fff;}
	.tab-search{position:relative;width: 40px;height: 35px;}
	.tab-search i{position: absolute;top: 7px;left: 12px;font-size: 20px;color: #999;}
	.tab-classify{position:relative;margin-left:10px;width: 40px;border-left: 1px solid #ccc;height: 35px;}
	.tab-classify i{position: absolute;top: 7px;left: 10px;font-size: 20px;color: #999;}
	.navbar{align-items: center;flex: 1;overflow-x: auto;padding-right: 10px;}
	.navbar .tab{color: #999; margin: 0 10px;white-space: nowrap;}
	.navbar::-webkit-scrollbar {display: none;}
	.mint-tab-item>.mint-tab-item-label{font-size: 15px!important;}
	.list .mint-navbar .mint-tab-item.is-selected{color: #a248ff;border-bottom-color: #a248ff;margin-bottom: 0; }
	/*.list .mint-navbar .mint-tab-item:last-child{margin: 0;padding: 17px 10px;}*/
	
	.classify-popup{width: 100%;height: 100%;padding: 20px 15px;}
	.classify-title{position: absolute;left: 50%;transform: translateX(-50%);font-size: 14px;}
	.classify-list{margin-top: 15px;}
	.classify-list li{
		float: left;
	    padding: 5px 20px;
	    outline-style: none;
	    list-style: none;
	    font-size: 12px;
	    background: #f2f2f2;
	    margin: 10px;
	    border-radius: 5px;
	    color: #999;
	}
	.classify-list .classify-selected{background-color: #ccc;color: #fff;}
</style>