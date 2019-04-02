<template>
	<div class="site-detail">
		<bar-top
    	:show-return-icon="true"
    	:show-right-icon="false"
    	:styles="styles"
    	topBarTitle="网点信息">
		</bar-top>
		
		
		<div class="back-panel"></div>
		<div class="star-real" v-show="animateFlag" :class=" 'animate-star'+ animateIndex"></div>
		<div class="back-img">
			<img id="back-img" :src="bg_img"/>
		</div>
		<div class="site-star">
			<div class="star-info" v-if="showStar">
				<p class="star-title">网点星级</p>
				<p class="star-number"><!--{{webSiteInfo.qulityScore}}--></p>
				<p class="star-show">
					<i class="iconfont uct-icon-xing" v-for="item in webSiteInfo.qulityStar"></i>
				</p>
			</div>
			<div class="star-info no-star" v-if="showNullStar">
				<p><i class="iconfont uct-icon-wangdianxinxiICON"></i></p>
				<p class="star-show">该网点无星级</p>
			</div>
		</div>


		<div class="main-lay">
			<div class="site-base">
				<p class="size-17 color-3" style="font-weight: bolder;">
					<span>{{webSiteInfo.orgName}}</span>
					<span class="size-14 color-3 pull-right" :class="{'color-warning':webSiteInfo.status=='9902','color-r':webSiteInfo.status=='9903',}">{{webSiteInfo.statusName}}</span>
				</p>
				<p class="size-14 color-6"><i class="iconfont uct-icon-renwu"></i>{{webSiteInfo.principal}}</p>
				<p class="size-14 color-6"><i class="iconfont uct-icon-dianhua"></i><span>{{webSiteInfo.principalMobile}}</span>
					<a v-if="webSiteInfo.principalMobile">
						<span class="color-call" @click="phonesVisible=true">联系网点</span>
					</a>
					<a v-if="!webSiteInfo.principalMobile">
						<span class="color-call color-no">联系网点</span>
					</a>
				</p>
				<p class="size-14 color-6"><i class="iconfont uct-icon-chawangdian"></i>{{webSiteInfo.address}}</p>
				<!--电话选择弹框-->
				<mt-actionsheet :actions="phones" v-model="phonesVisible"></mt-actionsheet>
			</div>
			
			<div class="servers">
				<p class="banner-title size-13 color-9">业务范围</p>
				<ul class="yewu size-14">
					<li :class="{'color-9':businessReal.indexOf('可做到付')==-1}">可做到付</li>
					<li :class="{'color-9':businessReal.indexOf('可签回单')==-1}">签单返还</li>
					<li :class="{'color-9':businessReal.indexOf('淘宝揽件')==-1}">淘宝揽件</li>
					<li :class="{'color-9':businessReal.indexOf('淘宝派件')==-1}">淘宝派件</li>
					<li :class="{'color-9':businessReal.indexOf('代收款')==-1}">代收货款</li>
					<li :class="{'color-9':businessReal.indexOf('开通VIP业务')==-1}">开通VIP业务</li>
					<div style="clear: both;"></div>
				</ul>
				<div class="money">
					<p>
						<span>普通限额</span><span class="pull-right">￥{{webSiteInfo.maxGp?webSiteInfo.maxGp:0}}</span>
					</p>
					<p>
						<span>VIP限额</span><span class="pull-right">￥{{webSiteInfo.maxVipGp?webSiteInfo.maxVipGp:0}}</span>
					</p>
				</div>
				
				<ul class="fuwu-area">
					<p class="banner-title size-13 color-9">
						<span>服务区域</span>
						<span @click="showMap = !showMap" style="float: right;color: #a248ff;">
							<i class="iconfont uct-icon-qiehuan"></i>
							{{showMap?'文字':'地图'}}
						</span>
					</p>
					<!--<li>宋辉路</li><li>宋辉路</li><li>宋辉路</li><li>宋辉路</li>
					<div style="clear: both;"></div>-->
					<div v-html="webSiteInfo.serviceRange" v-show="!showMap"></div>
					<div id="map-panel" style="width: 100%;height: 250px;" v-show="showMap"></div>
				</ul>
				
				<ul class="fuwu-area" v-show="webSiteInfo.specialChargingArea">
					<p class="banner-title size-13 color-9">特殊收费区域</p>
					<!--<li>上海市</li><li>上海市</li><li>上海市</li><li>上海市</li>
					<div style="clear: both;"></div>-->
					<div v-html="webSiteInfo.specialChargingArea"></div>
				</ul>
				<ul class="fuwu-area" v-show="webSiteInfo.specialAgingArea">
					<p class="banner-title size-13 color-9">特殊时效区域</p>
					<!--<li>北京市</li><li>北京市</li><li>北京市</li><li>北京市</li>
					<div style="clear: both;"></div>-->
					<div v-html="webSiteInfo.specialAgingArea"></div>
				</ul>
				
			</div>
		</div>
		
	</div>
</template>

<script>
	import barTop from '@com_base/components/barTop.vue';
	import endLine from '@com_base/components/endLine.vue';
	
	import uceAMap from '@com_base/common/uceAMap.js';
	
	import ystsdk from '@com_base/common/yst-sdk.js';
	import common from '@com_base/common/util.js';
	
	import { Indicator, Toast } from 'mint-ui';
	
	

	export default {
	  components: {
	    'bar-top': barTop,
	    'end-line': endLine
	  },
	  computed: {
	  	
	  },
	  created(){
	  	
	  },
	  mounted(){
	  	ystsdk.setStatusBarColor('934be8',1);
	  	
	  	this.getWebSiteInfo();
	  	
	  },
	  activated(){
	  	
	  },
	  beforeRouteEnter(to,from,next){
  		next((vm)=>{
  			
  		})
  	  },
  	  beforeRouteLeave(to,from,next){
  	  	next();
  	  },
	  beforeDestroy(){
	  	
	  },
	  data() {
	  	return {
	  		styles:{
	  			'background-color':'#transparent',
	  			'background-image': "url("+ require('@entry/static/images/bg_img1.png') +")",
				'background-repeat': 'no-repeat',
				'background-size': '100%',
	  			'color':'#fff'
  			},
	  		baseOrgCode: this.$route.params.baseOrgCode,
	  		cmsOrgId: this.$route.params.cmsOrgId,
	  		bg_img :"",
	  		showStar:false,
	  		showNullStar:false,
	  		webSiteInfo:{
	  			qulityStar:null
	  		},
	  		animateFlag:false,
	  		animateIndex:0,
	  		businessReal:[],
	  		phones:[],
	  		phonesVisible:false,
	  		showMap:false
	  	}
	  },
	  methods:{
	  	getWebSiteInfo(){
			let that = this;
			let url = that.api.getCmsWordDetailURL;
  			let params = {'baseOrgCode':that.baseOrgCode,'cmsOrgId':that.cmsOrgId,'currentOrgId':that.$store.state.userInfo.orgId};
  			
  			that.post(url,params).then(res=>{
  				if(res.data.success){
  					that.webSiteInfo = res.data.data;
  					if(that.webSiteInfo.qulityStar){
  						that.showStar = true;
  						that.showNullStar = false;
  						that.bg_img = require("@entry/static/images/bg_img1.png");
  						that.animateFlag = true;
		       			setTimeout(function(){
		       				that.animateIndex = Math.floor(that.webSiteInfo.qulityScore/1000*13);
		       			},500)
  					}else{
  						that.showStar = false;
  						that.showNullStar = true;
  						that.bg_img = require("@entry/static/images/bg_img2.jpg");
  					}
  					
  					//拨打电话
  					let phones = common.formatPhone(that.webSiteInfo.principalMobile).split('、');
  					phones.forEach(function(item,index){
  						that.phones.push({"name":item,"method":that.callPhone})
  					})
  					
  					//业务范围
  					that.webSiteInfo.businessScopes.forEach(item=>{
  						that.businessReal.push(item.productName);
  					})
		       		
  				}else{
  					that.webSiteInfo = {};
  				}
			}).catch(err=>{
				that.webSiteInfo = {};
			})
		},
		callPhone(data,index){
			window.location.href="tel:"+data.name
		},
		gisMap(baseOrgCode){
			let url = this.api.orgRangeForGisURL;
			this.post(url,{'baseOrgCode':baseOrgCode}).then(res=>{
				let mapParams = {
					'containerId':"map-panel",
					'showToolbar': false
				};
				if(res.data.success){
					mapParams.data = res.data.data;
					uceAMap.showOrgMap(mapParams);
				}else{
					Toast({message: res.data.message,position: 'center',duration: 2000});
				}
			}).catch(err=>{
				
			})
		}
	  },
	  watch: {
	  	'showMap':function(newVal,oldVal){
	  		if(newVal){
	  			this.gisMap(this.baseOrgCode);
	  		}
	  	}
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
	.site-detail{
		position: absolute;
		width: 100%;
		min-height: 100%;
		background-color: #f5f5f5;
		-moz-user-select:none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
	
	.back-panel{
		width: 100%;
	    height: calc(100vw * 388/750);
		background-color:#a96df9;
		border-radius: 0 0 45% 45%;
	}
	.star-real{
		position: absolute;
	    top: 36vw;
		z-index: 1;
		width: 50%;
	    height: 25vw;
	    left: 25%;
	    background: #fff;
	    border-radius: 0 0 50% 50%;
		transform-origin: center top;  
		transform: rotate(0deg);
		transition: all 0.5s linear;
	}
	.back-img{position: absolute;top: 0;width: 100%;z-index: 15;display: block;}
	.back-img img{width: 100%;}
	
	.site-star{
		position: absolute;
		z-index: 30;
		top: 0;
		width: 100%;
		height: calc(100vw * 388/750);
	}
	.star-info{
		position: absolute;
    	top: 37vw;
    	left: 50%;
		width: 142px;
		color:#fff;
		text-align: center;
		transform: translate(-50%, -100%);
	}
	.star-title{padding: 5px 0 5px 0;font-size: 10px;line-height: 10px;}
	.star-number{font-size: 22px;padding-bottom: 3px;line-height: 20px;}
	.star-show{font-size: 10px;line-height: 10px;}
	
	.no-star{background-image: none;margin-top:0;}
	.no-star i{font-size: 60px;line-height: 20px;}
	
	.main-lay{
	 	position: absolute;
	 	z-index: 99;
	    top: 41.2vw;
	    background-color: #f5f5f5;
     	border-radius: 50% 50% 0 0;
	}
	.site-base{
	    width: calc(100vw - 60px);
	    margin: 0 15px;
		padding: 11px 15px 0 15px ;
		background-color: #fff;
		box-shadow: 1px 1px 5px 0px rgba(165, 0, 206, 0.3);
		border-radius: 5px;
	}
	.site-base i{margin-right: 5px;}
	.site-base p{padding-bottom:11px;word-break: break-all;line-height: 14px;}
	.site-base p:nth-child(1){padding-bottom:20px;line-height: 17px;}
	.size-17{font-size: 17px;}
	.size-15{font-size: 15px;}
	.size-14{font-size: 14px;}
	.size-13{font-size: 13px;}
	.size-12{font-size: 12px;}
	.color-3{color: #333;}
	.color-6{color: #666;}
	.color-9{color: #999;}
	.color-r{color: #FF0000;}
	.color-warning{color: #f6b904;}
	.color-call{font-size:12px;color: #fff;background-color: #a248ff;border-radius: 7px;padding:0 5px;line-height: 14px;float: right;}
	.color-no{color: #fff;background-color: #ccc;}
	.site-base a{text-decoration: none; color: #666;}
	
	.servers{
		min-height: calc(100vh - 336px);
		margin: 25px 15px 0 15px;
		padding: 15px 16px;
		background-color: #ffffff;
		box-shadow: 1px 1px 5px 0px rgba(165, 0, 206, 0.3);
		border-radius: 5px;
	}
	.servers .banner-title{padding-bottom: 10px;}
	.yewu li{float: left;width: 33.333%;padding:3px 0;font-size: 14px;}
	.yewu li:nth-child(3n-1){text-align: center;}
	.yewu li:nth-child(3n){text-align: right;}
	
	.money{padding: 15px 0 30px 0}
	.money p{padding: 2px 0;}
	
	.fuwu-area{margin-bottom: 20px;font-size: 14px;}
	.fuwu-area li{float: left;padding: 3px 5px;font-size: 14px;}
	.fuwu-area *{word-break: break-all;white-space: normal!important;}
	
	.site-detail .navbar .tab{margin: 0 5px;padding: 5px 0;}
	.site-detail .navbar .tab:first-child{margin: 0;width: 120px!important;flex: 0.7!important;}
	.mint-tab-item>.mint-tab-item-label{font-size: 14px!important;}
	.site-detail .mint-navbar .mint-tab-item.is-selected{color: #32c8ff;border-bottom-color: #32c8ff;margin-bottom:1px;}
	
	.animate-star0 {transform: rotate(0deg);}
	.animate-star1 {transform: rotate(13.846deg);}
	.animate-star2 {transform: rotate(27.69deg);}
	.animate-star3 {transform: rotate(41.55deg);}
	.animate-star4 {transform: rotate(55.4deg);}
	.animate-star5 {transform: rotate(69.23deg);}
	.animate-star6 {transform: rotate(83.1deg);}
	.animate-star7 {transform: rotate(96.6deg);}
	.animate-star8 {transform: rotate(110.45deg);}
	.animate-star9 {transform: rotate(124.3deg);}
	.animate-star10 {transform: rotate(138.15deg);}
	.animate-star11 {transform: rotate(152deg);}
	.animate-star12 {transform: rotate(165.85deg);}
	.animate-star13 {transform: rotate(180deg);}
	
	.fuwu-area .amap-marker .amap-marker-label{
		white-space: nowrap!important;
	}
	
</style>