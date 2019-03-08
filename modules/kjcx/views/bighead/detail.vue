<template>
	<div class="big-detail">
		<bar-top
    	:show-return-icon="true"
    	:show-right-icon="false"
    	:styles="styles"
    	topBarTitle="目的站点详情">
		</bar-top>
		
		<div style="padding-top: 60px;margin-bottom: 15px;">
			<div class="site">
				<div class="site-info">
					<p class="size-15 color-3">{{webSiteInfo.orgName}}</p>
					<p class="size-13 color-9"><i class="iconfont uct-icon-chawangdian"></i>{{webSiteInfo.address}}</p>
					<p class="size-13 color-9">联系人：{{webSiteInfo.principal}}</p>
				</div>
				<div class="phone" v-if="webSiteInfo.principalMobile">
					<a @click="phonesVisible=true">
						<i class="iconfont uct-icon-dianhua"></i>
					</a>
				</div>
			</div>
			<!--电话选择弹框-->
			<mt-actionsheet :actions="phones" v-model="phonesVisible"></mt-actionsheet>
		</div>
		
		<div class="servers-panel">
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
			
			<!--navbar-->
			<div class="navbar-content">
				<mt-navbar :fixed="false" v-model="active" class="navbar">
				  	<mt-tab-item id="1" class="tab">服务区域</mt-tab-item>
				  	<mt-tab-item id="2" class="tab">特殊收费区域</mt-tab-item>
				  	<mt-tab-item id="3" class="tab">特殊时效区域</mt-tab-item>
				</mt-navbar>
			</div>
			<ul class="fuwu-area" v-show="active==1" v-html="webSiteInfo.serviceRange">
				<!--<li>宋辉路</li><li>宋辉路</li><li>宋辉路</li><li>宋辉路</li>
				<div style="clear: both;"></div>-->
			</ul>
			<ul class="fuwu-area"  v-show="active==2" v-html="webSiteInfo.specialChargingArea">
				<!--<li>上海市</li><li>上海市</li><li>上海市</li><li>上海市</li>
				<div style="clear: both;"></div>-->
			</ul>
			<ul class="fuwu-area"  v-show="active==3" v-html="webSiteInfo.specialAgingArea">
				<!--<li>北京市</li><li>北京市</li><li>北京市</li><li>北京市</li>
				<div style="clear: both;"></div>-->
			</ul>
			
		</div>
	</div>
</template>

<script>
	import barTop from '@com_base/components/barTop.vue';
	import endLine from '@com_base/components/endLine.vue';
	
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
	  	this.getWebSiteInfo();
	  },
	  mounted(){
	  	ystsdk.setStatusBarColor('a248ff',1);
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
	  		styles:{'background-color':'#a248ff','color':'#fff'},
	  		active:'1',
	  		baseOrgCode: this.$route.params.baseOrgCode,
	  		cmsOrgId: this.$route.params.cmsOrgId,
	  		webSiteInfo:{},
	  		businessReal:[],
	  		phones:[],
	  		phonesVisible:false
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
  					//业务范围
  					that.webSiteInfo.businessScopes.forEach(item=>{
  						that.businessReal.push(item.productName);
  					})
  					
  					//拨打电话
  					let phones = common.formatPhone(that.webSiteInfo.principalMobile).split('、');
  					phones.forEach(function(item,index){
  						that.phones.push({"name":item,"method":that.callPhone})
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
		}
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
	.big-detail{
		position: absolute;
		width: 100%;
		min-height: 100%;
		background-color: #f5f5f5;
		-moz-user-select:none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
	
	.site{display: flex;padding:15px 0 15px 15px ;background-color: #fff;}
	.site-info{flex:1;background-color: #fff;}
	.site-info p{word-break: break-all;}
	.site-info p i{padding-right: 5px;}
	.site-info p:nth-child(2){padding: 15px 0 10px 0;}
	.size-15{font-size: 15px;}
	.size-14{font-size: 14px;}
	.size-13{font-size: 13px;}
	.size-12{font-size: 12px;}
	.color-3{color: #333;}
	.color-9{color: #999;}
	.color-r{color: #FF0000;}
	.phone{position:relative;width: 70px;border-left: 1px solid #ccc;text-align: center;}
	.phone i{position:absolute;left:50%;top:50%;display:block;font-size: 24px;color: #32C8FF;transform: translate(-50%, -50%);}
	.phone a{text-decoration: none;}
	
	.servers-panel{
		min-height: calc(100vh - 221px);
		margin: 0 15px;
		padding: 15px 16px;
		background-color: #ffffff;
		box-shadow: 1px 1px 5px 0px rgba(165, 0, 206, 0.3);
		border-radius: 5px;
	}
	.servers-panel .banner-title{padding-bottom: 10px;}
	.yewu li{float: left;width: 33.333%;padding:3px 0;font-size: 14px;}
	.yewu li:nth-child(3n-1){text-align: center;}
	.yewu li:nth-child(3n){text-align: right;}
	
	.money{padding: 15px 0 30px 0}
	.money p{padding: 2px 0;}
	
	.navbar-content{margin-bottom: 20px;}
	.fuwu-area{font-size: 14px;}
	.fuwu-area li{float: left;padding: 3px 5px;font-size: 14px;}
	.fuwu-area *{word-break: break-all;white-space: normal!important;}
	
	.big-detail .navbar .tab{margin: 0 5px;padding: 5px 0;}
	.big-detail .navbar .tab:first-child{margin: 0;width: 120px!important;flex: 0.7!important;}
	.mint-tab-item>.mint-tab-item-label{font-size: 14px!important;}
	.big-detail .mint-navbar .mint-tab-item.is-selected{color: #934be8;border-bottom-color: #934be8;margin-bottom:1px;}
</style>