<template>
	<div class="route history" v-cloak>
		<div class="top-banner">
			<bar-top
	    	:show-return-icon="true"
	    	:show-right-icon="false"
	    	topBarTitle="运单跟踪">
			</bar-top>
		</div>
		
		<!--billInfo-->
		<div class="billcode-type" v-cloak>
			<div>
				<h3>{{billCodeData.signType==1?'正常签收':(billCodeData.signType==2?'退件签收':'未签收')}}</h3>
			</div>
			<div>
				<span>运单号：{{billCodeData.billCode || billCode}}</span>
				<span style="float:right">类型：{{billCodeData.billType==2?'汽运':(billCodeData.billType==6?'空运':'其他')}}</span>
			</div>
			<div>
				<span>录单时间：{{billCodeData.createTime | formatTime}}</span>
			</div>
			<div v-show="billCodeData.deliveryEmpName?true:false">
				<span>派件员：{{billCodeData.deliveryEmpName}}</span>
			</div>
		</div>
		
		<!--navbar-->
		<div class="navbar-content">
			<mt-navbar :fixed="false" v-model="active" class="navbar">
			  	<mt-tab-item id="1" class="tab">运输轨迹</mt-tab-item>
			  	<mt-tab-item id="2" class="tab">运单详情</mt-tab-item>
			  	<mt-tab-item id="3" class="tab">问题件</mt-tab-item>
			</mt-navbar>
		</div>
		
		<!------------运输轨迹------------>
		<div class="way" v-show="active==1">
			<div class="cell" v-for="(item,index) in wayData">
		    	<div class="time-week">
		    		<div class="time-content">
		    			<p>{{item.createTime}}</p>
		    			<p>{{item.createDate}}</p>
		    		</div>
		    		<div class="guodu-line" v-show="wayData.length>1"></div>
		    		<svg class="svg-icon" aria-hidden="true">
                        <use xlink:href="#uct-icon-guodudian" v-if="index==0"></use>
                        <use xlink:href="#uct-icon-guodudian1" v-else></use>
                    </svg>
		    	</div>
		    	<div class="time-record">
		    		<p>扫描类型：<span v-html="item.scanType"></span></p>
		    		<p v-html="item.trackMessage"></p>
		    	</div>
	    	</div>
		</div>
		
		<!-----------运单详情------------->
		<div class="info" v-show="active==2">
			<div class="panel flex-pick">
				<div class="pick">
					<div class="prompt">寄件网点</div>
					<div class="prompt-dtl">{{billCodeData.sendOrgCode}}</div>
				</div>
				<div class="pick pick-line">
					<div class="prompt">寄件结算点</div>
					<div class="prompt-dtl">{{billCodeData.sendAccSiteCode}}</div>
				</div>
				<div class="pick">
					<div class="prompt">派件网点</div>
					<div class="prompt-dtl">{{billCodeData.deliveryOrgCode}}</div>
				</div>
			</div>
			<div class="panel flex-pick">
				<div class="pick">
					<div class="prompt">件数</div>
					<div class="prompt-dtl">{{billCodeData.qty}}</div>
				</div>
				<div class="pick pick-line">
					<div class="prompt">实重</div>
					<div class="prompt-dtl">{{billCodeData.realWeight?billCodeData.realWeight:0}}kg</div>
				</div>
				<div class="pick">
					<div class="prompt">体积重</div>
					<div class="prompt-dtl">{{billCodeData.bulkWeight}}</div>
				</div>
			</div>
			<div class="panel flex-pick">
				<div class="pick" style="flex: 2;">
					<div class="prompt">目的地</div>
					<div class="prompt-dtl">{{billCodeData.recArea}}</div>
				</div>
				<div class="pick" style="border-left: 1px solid #ccc;">
					<div class="prompt">取件员</div>
					<div class="prompt-dtl">{{billCodeData.operateEmpName}}</div>
				</div>
			</div>
			<div class="panel">
				<div>
					<span class="prompt">到付款</span>
					<span class="prompt-dtl" style="float: right;" v-if="billCodeData.payType==3">￥{{billCodeData.carriage?billCodeData.carriage:0}}</span>
					<span class="prompt-dtl" style="float: right;" v-else>￥0</span>
				</div>
				<div>
					<span class="prompt">代收款</span>
					<span class="prompt-dtl" style="float: right;">￥{{billCodeData.goodsPayment?billCodeData.goodsPayment:0}}</span>
				</div>
			</div>
			<div class="panel address-panel" v-show="billCodeData.statuNum==103">
				<div class="address-icon">
					<svg class="svg-icon" aria-hidden="true">
                        <use xlink:href="#uct-icon-guodudian"></use>
                    </svg>
                    <div class="address-line"></div>
                    <svg class="svg-icon" aria-hidden="true">
                        <use xlink:href="#uct-icon-guodudian"></use>
                    </svg>
				</div>
				<div class="address-dtl">
					<div>
						<p class="prompt-dtl">寄件人：{{billCodeData.sender}}</p>
						<p class="prompt-dtl">寄件地址：{{billCodeData.senderAddress}}</p>
					</div>
					<div>
						<p class="prompt-dtl">收件人：{{billCodeData.receiver}}</p>
						<p class="prompt-dtl">收件地址：{{billCodeData.receiverAddress}}</p>
					</div>
				</div>
			</div>
			<div class="panel flex-pick">
				<div class="pick" style="flex: 4;">
					<div class="prompt">签收人</div>
					<div class="prompt-dtl">{{billCodeData.signMan}}</div>
				</div>
				<div class="pick" style="flex: 5;">
					<div class="prompt">签收时间</div>
					<div class="prompt-dtl">{{billCodeData.signTime | formatTime}}</div>
				</div>
			</div>
			
			<div>
				<div class="pick">
					<div class="prompt">备注</div>
					<div class="prompt-dtl">{{billCodeData.remark}}</div>
				</div>
			</div>
		</div>
		
		
		<!------------问题件------------>
		<div class="problem" v-show="active==3">
			<div class="panel" v-for="item in problemData">
				<div class="pick">
					<div class="prompt-dtl">问题内容 <span class="prompt" style="float: right;">{{item.createTime | formatTime}}</span></div>
					<div class="prompt">
						【<font>{{item.billCode}}</font>】由【<font>{{item.createOrg}}</font>】【<font>{{item.createEmp}}</font>】登记问题件发给网点【<font>{{item.toAccOrg}}</font>】
						</br>原因：{{item.reason}}
						</br>内容：{{item.content}}
					</div>
				</div>
			</div>
		</div>

		<!-------------空数据提示-------------->
		<div class="data-null" v-show="(active==1&&wayData.length==0) ||(active==3&&problemData.length==0)">
    		<div class="null-content">
    			<img src="../../static/images/none.jpg" width="130px"/>
    			<span style="padding-top: 10px;font-size: 14px;">暂无数据</span>
    		</div>
    	</div>
	</div>
</template>

<script>
	import barTop from '@com_base/components/barTop.vue';
	
	export default {
	  components: {
	    'bar-top': barTop,
	  },
  	  /*计算属性*/
	  computed: {
	  },
	  created(){
	  	this.getBillCodeInfo();
	  	this.getBillCodeWay();
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
	  		active: '1',
	  		billCode: this.$route.params.id,
	  		wayData:[],
	  		billCodeData:{},
	  		problemData:[]
	  	}
	  },
	  methods:{
	  	getBillCodeInfo(){
	  		let that = this;
	  		let url = that.api.findWaybllInfoByCodeURL;
  			let params = {billCode:that.billCode}
  			that.get(url,params).then(res=>{
				if(res.data.success && res.data.data!=null){
					this.billCodeData = res.data.data;
				}else{
					this.billCodeData = {}
				}
			}).catch(err=>{
				
			})
	  	},
	  	getBillCodeWay(){
	  		let that = this;
	  		let url = that.api.findTraceInfoByCodeURL;
  			let params = {billCode:that.billCode}
  			that.get(url,params).then(res=>{
				if(res.data.success && res.data.data.length>0){
					this.wayData = res.data.data;
				}else{
					this.wayData = [];
				}
			}).catch(err=>{
				
			})
	  	},
	  	findProblemBill(){
	  		let that = this;
	  		let url = that.api.findProblemBillRL;
  			let params = {billCode:that.billCode}
  			that.get(url,params).then(res=>{
				if(res.data.success && res.data.data.length>0){
					this.problemData = res.data.data.reverse();
				}else{
					this.problemData = []
				}
			}).catch(err=>{
				
			})
	  	}
	  },
	  watch: {
	  	'active':function(newval,oldval){
	  		if(newval=='1'){
			  	this.getBillCodeWay();
	  		}
	  		if(newval=='2'){
	  			this.getBillCodeInfo();
	  		}
	  		if(newval=='3'){
			  	this.findProblemBill();
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
	
	.billcode-type{
		padding: 60px 15px 0 15px;
		background-color: #a248ff;
		color:#fff;
	}
	.billcode-type span{line-height: 30px;font-size: 15px;}
	
	
	
	.way{padding: 20px 0;}
	.way .cell:first-child>div{color: #8140e6!important;word-break: break-all;}
	.way .cell:first-child .time-content{position: absolute;top: 50%;transform: translateY(-50%);}
	.way .cell:first-child .guodu-line{top:50%}
	.way .cell:last-child .guodu-line{top:-50%}
	.cell{
		position: relative;
		padding: 0 15px!important;
		display: flex;
		flex-direction: row;
		background-color: #fff;
	}
	.cell p{margin: 0;}
	.cell .cell-active{background-color: #f7f6fb;}
	.cell .time-week{position:relative;width: 90px;padding: 5px 0;}
	.cell .time-week p{line-height: 18px;}
	.cell .time-week p:first-child{font-size: 16px;color: #999;}
	.cell .time-week p:last-child{font-size: 13px;color: #999;}
	.cell .guodu-line{position: absolute;right: 1px;top: 0;height: 100%;border-right: 1px solid #ccc;}
	.cell .svg-icon{position: absolute;right: -6px;top: calc(50% - 9px);}
	.cell .time-record{flex: 1;padding: 5px 0 5px 15px;}
	.cell .time-record p{line-height: 20px;font-size: 12px;color: #666;}
	
	.info{padding: 20px 0 20px 15px;}
	.info .panel{padding:10px 15px 10px 0;border-bottom: 1px solid #ccc;}
	.flex-pick{display: flex;}
	.pick{flex:1;min-height: 44px;overflow: hidden;}
	.flex-pick .pick:nth-child(n+2) .prompt,.flex-pick .pick:nth-child(n+2) .prompt-dtl{padding-left: 10px;}
	.pick-line{border-left: 1px solid #ccc;border-right: 1px solid #ccc;}
	.prompt{font-size: 12px;color: #999;word-break: break-all;}
	.prompt-dtl{font-size: 15px;color: #333;font-weight: normal;word-break: break-all}
	.address-panel{display: flex;}
	.address-line{width: 0.5px;height: 50%;border-left: 0.5px solid rgb(176, 119, 233);margin-left: 8px;}
	.address-dtl{margin-left: 20px;flex: 1;}
	.address-dtl div:first-child{border-bottom: 1px solid #ccc;padding-bottom: 10px;}
	.address-dtl div:last-child{padding-top: 10px;}
	
	.problem{padding: 20px 15px;}
	.problem .panel{padding: 10px 0;border-bottom: 1px solid #ccc;}
	
	
	.data-null{width:100%;padding-top:100%;text-align: center;background-color: #fff;}
	.null-content{position: absolute;top: 50%;width: 100%;}
	.null-content *{display: block;text-align: center;margin: 0 auto;color: #999;}
	
	font{color: #ff0000;font-weight: bold;}
</style>