<template>
	<div class="search">
		<bar-top
    	:show-return-icon="true"
    	:show-right-icon="false"
    	:styles="styles"
    	topBarTitle="网点查询">
		</bar-top>
		<div style="height: 45px;"></div>
		<div class="search-form">
			<div>
				<input id="key" type="text" v-model="key" @input="getMainKey" maxlength="20" autofocus="autofocus" autocomplete="off" placeholder="输入网点名称查找" class="search-input">
				<span class="iconfont uct-icon-sousuo search-icon"></span>
				<div class="rest-btn" v-show="key!=''"><i class="iconfont uct-icon-guanbi"></i></div>
			</div>
			<!--matchResult-->
			<div class="match-result" @click="" v-show="showMatch">
				<ul class="match-list">
					<li v-for="(item, index) in matchResult" @click="showMatch=false;matchKey=item;key=item.orgName;">{{item.orgName}}</li>
					<div class="match-null" v-show="showLoading">loading...</div>
					<div class="match-null" v-show="showNull">暂无匹配数据，请重新输入</div>
				</ul>
			</div>
		</div>
		
		<!--localStorage-->
		<div class="main-panel">
			<div class="search-history">
				<div class="prompt">
					<span>历史查询</span>
					<span @click="restLocalHistory">清空</span>
				</div>
				<li v-for="(item, index) in localHistory.slice(0,10)" @click="showMatch=false;matchKey=item;key=item.orgName;onSubmit();">{{item.orgName}}</li>
			</div>
		</div>
		
		<div class="submit-btn">
			<mt-button class="submitBtn" type="default" size="large" :disabled="disabled" @click="onSubmit()">查  询</mt-button>
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
	  	ystsdk.setStatusBarColor('a248ff',1);
	  	
	  	let that = this;
	  	var inputElem = document.querySelector('#key');
  		var cancelBtn = document.querySelector('.rest-btn');
	  	cancelBtn.onclick = function(){
	  		that.key=""; 
	  		that.matchKey = {};
	  		inputElem.focus();
	  	}
	  	
	  	if(localStorage.localHistory4){
	  		this.localHistory = JSON.parse(localStorage.localHistory4).slice(0,30);
	  	}
	  },
	  activated(){
	  	
	  },
	  beforeRouteEnter(to,from,next){
  		next((vm)=>{})
  	  },
  	  beforeRouteLeave(to,from,next){
  	  	next();
  	  },
	  beforeDestroy(){
	  	
	  },
	  data() {
	  	return {
	  		styles:{'background-color':'#a248ff','color':'#fff'},
	  		key:'',
	  		matchKey:{},
	  		localHistory:[],
	  		disabled:false,
	  		showMatch:false,
	  		matchResult:[],
	  		showLoading:false,
	  		showNull:false
	  	}
	  },
	  methods:{
	  	restLocalHistory(){
	  		this.localHistory = [];
	  		localStorage.setItem('localHistory4',JSON.stringify(this.localHistory));
	  	},
	  	getMainKey(){
	  		let that = this;
	  		that.matchResult= [];
	  		
			that.key = that.key.trim();
			if(that.key==''){
				return;
			};
			
			setTimeout(function(){
				that.showMatch = true;
				that.showLoading=true;
				that.showNull=false;
				
				let url = that.api.findWebsiteNameURL;
	  			let params = {orgName: that.key, pageSize:10, pageNum:1};
	  			that.post(url,params,false).then(res=>{
	  				that.showLoading=false;
	  				if(res.data.total>0){
	  					that.matchResult = res.data.rows.slice(0,10);
	  				}else{
	  					that.matchResult= [];
	  					that.showNull=true;
	  				}
				}).catch(err=>{
					that.matchResult= [];
					that.showLoading=false;
					that.showNull=true;
				})
				
			},500)
	  	},
		onSubmit(){
			let that = this;
			let key = that.key.trim();
	  		if(key ==''){
	  			Toast({message: '请输入网点名称查找',position: 'center',duration: 2000});
	  			that.matchKey = {};
	  			return;
	  		}
	  		if(key!='' && (that.showMatch || !that.matchKey.baseOrgCode|| !that.matchKey.cmsOrgId) ){
	  			Toast({message: '请选择网点',position: 'center',duration: 2000});
	  			return;
	  		}
	  		
	  		//处理搜索历史记录
	  		function isINhistory(){
	  			let baseIndex = -1;
	  			that.localHistory.forEach((item,index)=>{
	  				if(item.orgName==that.matchKey.orgName){
	  					baseIndex = index;
	  					return baseIndex;
	  				}
	  			})
	  			return baseIndex;
	  		}
	  		let INDEX = isINhistory();
	  		if(INDEX != -1){
	  			that.localHistory.splice(INDEX,1);
	  		}
	  		that.localHistory.unshift(that.matchKey);
	  		localStorage.setItem('localHistory4',JSON.stringify(that.localHistory));
	  		
	  		this.$router.push('/detail_site/'+that.matchKey.baseOrgCode+'/'+that.matchKey.cmsOrgId);
		}
	  },
	  watch: {
	  	key:function(newValue,oldValue){
	  		if(newValue==''){
	  			this.showMatch = false;
	  		}
	  	}
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
		background-color: #F5F5F5;
		-moz-user-select:none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
	
	.search-form{
		position: relative;
		padding: 0 15px;
		background-color: #F5F5F5;
	}
	.search-input{
		margin: 15px 0;
		padding: 0 30px;
		width: calc(100% - 60px);
		height: 36px!important;
		font-size: 12px;
		border-radius: 18px;
		border: none!important;
	}
	input::-webkit-search-decoration,
    input::-webkit-search-cancel-button {
    	display: none;
    }
	.search-icon{
		display: block;
	    position: absolute;
	    top: 23px;
	    left: 24px;
	    color: #999;
	    font-size: 15px;
	    font-weight: bold;
	}
	.rest-btn{
		position: absolute;
		display: block;
	    right: 20px;
	    top: 15px;
	    z-index: 99;
	    width: 36px;
	    height: 36px;
	    line-height: 36px;
	    text-align: center;
	    border-radius: 50%;
	    font-size: 12px;
	}
	.rest-btn i{
		width: 12px;
    	height: 12px;
		font-size: 12px;
		line-height: 12px;
	 	font-weight: 200;
 	 	color: #fff;
	    background-color: #ccc;
	    border-radius: 50%;
	}
	
	.match-result{
		position: absolute;
		top: 52px;
		left: 0;
		z-index: 99;
		width: 100%;
		background-color: #f5f5f5;
	}
	.match-list{
		min-height: 100px;
		margin: 0 15px;
		padding: 15px;
		border-radius: 18px;
		background-color: #fff;
	}
	.match-list li{line-height: 30px;font-size: 14px;}
	.match-null{text-align: center;line-height: 100px;font-size: 12px;color: #999;}
	
	.main-panel{width:100%;height:calc(100% - 186px);overflow: auto;}
	.search-history{padding: 0 15px;overflow: auto;}
	.search-history li{
		float: left;
		list-style: none;
		margin: 5px 10px 5px 0;
		line-height: 20px;
		padding:3px 10px;
		border-radius: 10px;
		font-size: 14px;
		color: #333;
		background-color: #fff;
		word-break: break-all;
	}
	.search-history .prompt{margin:10px 0;font-size: 14px;color: #999;}
	.search-history .prompt span:last-child{float: right;margin-right: 2px;}
	
	.submit-btn{position:fixed;bottom:0;padding-bottom: 15px;width: 100%;}
	.mint-button--default{width:90%;margin:0 auto;background-color: #a248ff;color: #fff;}
	
</style>