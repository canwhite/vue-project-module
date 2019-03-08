<template>
	<div class="search">
		<bar-top
    	:show-return-icon="true"
    	:show-right-icon="false"
    	topBarTitle="运单跟踪">
		</bar-top>
		<div style="height: 45px;"></div>
		<div class="search-form">
			<form autocomplete="off" @submit.prevent="searchData()">
				<input id="key" type="search" v-model="key" maxlength="20" autofocus="autofocus" autocomplete="off" placeholder="只能输入字母和数字" class="search-input">
				<span class="title-btn">运  单  号</span>
				<span class="cancel-btn iconfont uct-icon-guanbi" v-show="key!=''"></span>
				<div @click="QRScan()" class="search-button"><i class="iconfont uct-icon-saomiao"></i></div>
			</form>
		</div>
		
		<div class="main-panel">
			<div class="search-history">
				<div class="prompt">
					<span>历史记录</span>
					<span @click="restLocalHistory">清空</span>
				</div>
				<li v-for="(item, index) in localHistory.slice(0,30)" @click="setKey(item,index)">{{item}}</li>
			</div>
		</div>
		
		<div class="submit-btn">
			<mt-button class="submitBtn" type="default" size="large" :disabled="disabled" @click="searchData()">查  询</mt-button>
		</div>
		
	</div>
</template>

<script>
	import barTop from '@com_base/components/barTop.vue';
	import endLine from '@com_base/components/endLine.vue';
	import ystsdk from '@com_base/common/yst-sdk.js';
	
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
	  	let that = this;
	  	
	  	var inputElem = document.querySelector('#key');
	  	var cancelBtn = document.querySelector('.cancel-btn');
	  	cancelBtn.onclick = function(){
	  		that.key=""; 
	  		inputElem.focus();
	  	}
	  	
	  	if(localStorage.localHistory3){
	  		this.localHistory = JSON.parse(localStorage.localHistory3).slice(0,30);
	  	}
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
	  		key: '',
	  		localHistory:[],
	  		useLocalIndex:30,
	  		disabled:false
	  	}
	  },
	  methods:{
	  	setKey(item,index){
	  		//添加搜索key
	  		this.key = item;
	  		this.searchData();
	  	},
	  	restLocalHistory(){
	  		this.localHistory = [];
	  		localStorage.setItem('localHistory3',JSON.stringify(this.localHistory))
	  	},
		link2dtl(id){
			this.$router.push('/detail_wayBill/'+id)
		},
		searchData(){
			document.activeElement.blur();
			
			let that = this;
			that.key = that.key.trim();
	  		if(that.key ==''){
	  			Toast({message: '运单号不能为空',position: 'center',duration: 2000});
	  			return;
	  		}
	  		let zz = /^[A-Za-z0-9]{8,20}$/;
			if(!zz.test(that.key)){
				Toast({message: '请输入正确的运单号',position: 'bottom',duration: 2000});
  				return;
	  		}
	  		//处理搜索历史记录
	  		if(that.localHistory.indexOf(that.key)!=-1){
	  			that.localHistory.splice(that.localHistory.indexOf(that.key),1);
	  		}
  			that.localHistory.unshift(that.key);
  			localStorage.setItem('localHistory3',JSON.stringify(this.localHistory));
  			
  			that.disabled =true;
  			let url = that.api.findWaybllInfoByCodeURL;
  			let params = {billCode:that.key}
  			that.get(url,params).then(res=>{
				if(res.data.success && res.data.data!=null){
					that.link2dtl(that.key);
				}else if(res.data.success&& res.data.data==null){
					Toast({message: '无信息，请确认单号是否正确',position: 'bottom',duration: 2000});
					that.disabled =false;
				}else{
					Toast({message: res.data.message,position: 'bottom',duration: 2000});
					that.disabled =false;
				}
			}).catch(err=>{
				that.disabled =false;
			})
			
			return false;
		},
		QRScan(){
			let that = this;
			ystsdk.QRScan(function(data){
				that.key = data;
				that.searchData();
			})
		}
	  },
	  watch: {

	  }
	}
</script>

<style scoped>
	.top-banner{
		position: fixed;
	    top: 0;
	    width: 100%;
	    z-index: 99;
	}
	.search{
		position: absolute;
		height: 100%;
		width: 100%;
		-moz-user-select:none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
	
	.search-form{
		position: relative;
		width: 100%;
		background-color: #F7F6FB;
	}
	.search-input{
		padding-left: 80px!important;
		padding-right: 50px!important;
		width: 100%;
		margin: 15px 0;
		height: 44px!important;
		font-size: 14px;
		border-radius: 0!important;
		border: none!important;
	}
	.search-button{
		position: absolute;
		right: 0;
		top: 15px;
	 	outline:none;
	 	width: 50px!important;
		height: 44px;
		border-radius: 0;
		border: none;
		box-shadow: none;
		/*background-color: #a248ff;*/
		color: #000;
		/*border-radius: 0 20px 20px 0;*/
		text-align: center;
    	line-height: 44px;
    	font-size: 18px;
    	font-weight: bold!important;
	}
	.search-button i{font-size: 24px;}
	.title-btn{
		display: block;
	    position: absolute;
	    top: 27px;
	    left: 15px;
	    color: #333;
	    font-size: 14px;
	    font-weight: bold;
	}
	.cancel-btn{
		position: absolute;
		display: block;
	    right: 60px;
	    top: 28px;
	    color: #fff;
	    font-weight: 200;
	    background-color: #999;
	    width: 14px;
	    height: 14px;
	    text-align: center;
	    line-height: 14px;
	    border-radius: 50%;
	    font-size: 14px;
	}
	
	.main-panel{width:100%;height:calc(100% - 180px);overflow: auto;}
	.search-history{padding: 0 15px;overflow: auto;}
	.search-history li{
		float: left;
		list-style: none;
		/*margin: 5px;*/
		width: 100%;
		height: 49px;
		line-height: 49px;
		padding:0;
		/*border-radius: 15px;*/
		font-size: 14px;
		color: #333;
		/*background-color: #f7f6fb;*/
		border-bottom: 1px solid #ccc;
	}
	.search-history .prompt{margin:10px 0;font-size: 14px;color: #999;}
	.search-history .prompt span:last-child{float: right;margin-right: 2px;}
	
	.submit-btn{position:fixed;bottom:0;padding-bottom: 15px;background-color: #fff;width: 100%;}
	.mint-button--default{width:90%;margin:0 auto;background-color: #a248ff;color: #fff;}
	
</style>