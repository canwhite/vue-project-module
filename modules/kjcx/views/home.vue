<template>
	<div class="route list">
		<bar-top
    	:show-return-icon="true"
    	:show-right-icon="false">
		</bar-top>
		<!--banner-->
		<div class="banner-img"><img src="../static/images/zhcx.png"/></div>
		
		<ul class="ui-li">
			<li class="panel-cell" v-for="item in apps">
				<a :href="item.href">
					<div class="cell-pick">
						<i class="iconfont" :class="item.icon" :style="{'font-size':item.fontsize}"></i>
						<p>{{item.name}}</p>
					</div>
				</a>
			</li>
			<div style="clear: both;"></div>
		</ul>
	</div>
</template>

<script>
	import barTop from '@com_base/components/barTop.vue';
	import ystsdk from '@com_base/common/yst-sdk.js';
	
	export default {
	  	components: {
	    	'bar-top': barTop
	  	},
	  	computed: {
	  	},
	  	created(){

	  	},
	  	mounted(){
	  		ystsdk.setStatusBarColor('a248ff',1);
 	 	},
 	 	activated(){
 	 		ystsdk.setStatusBarColor('a248ff',1);
 	 	},
 	 	data() {
	  		return {
	  			apps:[
	  				{
	  					name:"运单跟踪",
	  					href:"#/search_wayBill",
	  					icon:"uct-icon-yundanchaxun"
	  				},
	  				{
	  					name:"大头笔/目的站",
	  					href:"#/search_bighead",
	  					icon:"uct-icon-datoubi"
	  				},
	  				{
	  					name:"网点查询",
	  					href:"#/search_site",
	  					icon:"uct-icon-chawangdian"
	  				},
	  				{
	  					name:"公布价查询",
	  					href:"#/search_freight",
	  					icon:"uct-icon-yunfeichaxun",
	  					fontsize:"26px"
	  				}
	  			]
  			}
	  	},
	  	methods:{
	  		
	  	},
	 	watch: {
	 		
	  	}
	}
</script>

<style>
	.slogan-banner{
	    top: 0;
	    width: 100%;
	    z-index: 99;
	    /*background-color: rgb(247, 246, 251);*/
	}
	.banner-img{width:100%;padding-top: 45px;}
	.banner-img img{width: 100%;height: 100%;}
	
	.ui-li {overflow: hidden;}
	/*.ui-li .panel-cell .cell-pick{border-right: 0.5px solid #ccc;}
	.ui-li .panel-cell:nth-child(4n) .cell-pick{border-right: none;}*/
	
	.panel-cell{
		position: relative;
		float: left;
	    width: 25%;
	    height: 0;
	    padding-bottom: 25%;
	    list-style: none;
	    background-color: #fff;
	}
	
	.cell-pick{
		position: absolute;
		top: 50%;
		width: 100%;
		height: 44px;
		text-align: center;
	    transform: translateY(-50%);
	}
	.cell-pick *{margin: 0;}
	.cell-pick i{font-size: 24px;color: #a248ff;}
	.cell-pick p{position: absolute;bottom:0;width:100%;font-size: 12px;color: #333;}
</style>