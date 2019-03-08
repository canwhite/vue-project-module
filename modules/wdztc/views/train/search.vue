<template>
	<div class="route search">
		<div class="top-banner">
			<bar-top
	    	:show-return-icon="true"
	    	:show-right-icon="false">
			</bar-top>
			
			<div class="search-form">
				<form autocomplete="off" @submit.prevent="pageIndex=1;datas=[];searchData('')">
					<input id="key" type="search" v-model="key" @focus="showHistory=true" autofocus="autofocus" placeholder="输入关键字搜索你感兴趣的内容" class="search-input">
					<div @click="pageIndex=1;datas=[];searchData('')" class="search-button"><i class="iconfont uct-icon-sousuo"></i></div>
					<span class="cancel-btn icon icon-close" v-show="key!=''"></span>
				</form>
			</div>
		</div>
		
		<div class="main-panel">
		 	<div v-show="!showHistory">
				<!--最新-->
		  		<mt-loadmore :auto-fill="autoFill" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" @top-status-change="handleTopChange" ref="loadmore">
				    <ul class="list-panel">
				    	<div class="cell" v-for="item in datas" @click="link2dtl(item.id)">
					    	<div class="desc">
					    		<p class="theme">{{item.questionTitle}}</p>
					    		<div class="data">
					    			<span><i class="iconfont uct-icon-bumen"></i>{{item.reportOrgName}}</span>
					    			<span><i class="iconfont uct-icon-yulan"></i>{{item.browsingTimes}}</span>
					    			<span><i class="iconfont uct-icon-dianzan"></i>{{item.praiseCount}}</span>
					    			<span><i class="iconfont uct-icon-shijian"></i>{{item.confirmTime | formatDate('yyyy-mm-dd')}}</span>
					    		</div>
					    	</div>
					    	<div class="img" v-if="item.filePaths!=null&&item.filePaths.length>0">
					    		<img :src="item.filePaths[0]"/>
					    		<span class="img-icon"><i class="iconfont uct-icon-zhaopian"></i>{{item.filePaths.length}}</span>
					    	</div>
				    	</div>
				    </ul>
				    
				    <div class="data-null" v-if="!loading && datas.length ==0">
			    		<img src="../../static/images/none.jpg" width="130px"/>
	    				<span style="padding-top: 10px;font-size: 14px;">暂无数据</span>
			    	</div>
			    	<div style="text-align: center;">
			    		<mt-spinner v-show="loading" type="triple-bounce" color="rgb(160, 100, 232)"></mt-spinner>
			    	</div>
			    	<end-line v-if="allLoaded && datas.length>0"></end-line>
			    	
				</mt-loadmore>
			</div>
			
			<div class="search-history" v-show="showHistory">
				<div class="prompt">
					<span>搜索历史</span>
					<span @click="restLocalHistory">清除</span>
				</div>
				<li v-for="(item, index) in localHistory.slice(0,10)" @click="setKey(item,index)">{{item}}</li>
			</div>
		</div>
		
	</div>
</template>

<script>
	import barTop from '../../components/barTop.vue';
	import endLine from '../../components/endLine.vue';
	
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
	  	if(localStorage.localHistory){
	  		this.localHistory = JSON.parse(localStorage.localHistory);
	  	}
	  },
	  activated(){
	  	let that = this;
	  	var inputElem = document.getElementById('key');
	  	$(".cancel-btn").on('click',function(){
	  		that.key=""; 
	  		inputElem.focus();
	  	})
	  },
	  beforeRouteEnter(to,from,next){
  		next((vm)=>{
  			if(from.path.indexOf('home')!=-1){
		  		vm.key = '';
		  		vm.datas = [];
		  		vm.showHistory = true;
		  	}else{
		  		vm.showHistory = false;
		  	}
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
	  		showHistory:true,
	  		localHistory:[],
	  		autoFill:false,
	  		allLoaded:false,
	  		topStatus:'',
	  		datas:[],
	  		pageIndex:1,
	  		loading:false
	  	}
	  },
	  methods:{
	  	setKey(item,index){
	  		//添加搜索key
	  		this.key = item;
	  		this.datas = [];
	  		this.pageIndex=1;
	  		this.searchData('');
	  	},
	  	restLocalHistory(){
	  		this.localHistory = [];
	  		localStorage.setItem('localHistory',JSON.stringify(this.localHistory))
	  	},
	  	handleTopChange(status) {
	        this.topStatus = status;
      	},
		loadTop(){
			this.datas = [];
			this.$refs.loadmore.onTopLoaded();
			this.pageIndex = 1;
			this.searchData('');
		},
		link2dtl(id){
			this.$router.push('/detail/search/'+id)
		},
		loadBottom(){
  			this.$refs.loadmore.onBottomLoaded();
			this.searchData('');
		},
		searchData(type){
			document.activeElement.blur();
			
			let that = this;
	  		if(that.key ==''){
	  			Toast({message: '关键字不能为空',position: 'center',duration: 2000});
	  			return;
	  		}
	  		//处理搜索历史记录
	  		that.showHistory=false;
	  		if(that.localHistory.indexOf(that.key)!=-1){
	  			that.localHistory.splice(that.localHistory.indexOf(that.key),1);
	  		}
  			that.localHistory.unshift(that.key);
  			localStorage.setItem('localHistory',JSON.stringify(this.localHistory));
	  		
			that.loading = true;
			let url = that.api.findQuestionsURL;
			let params = {
				questionType: type,
				search: that.key,
				currentPage: that.pageIndex,
				pageSize: 10
			}
			that.post(url,params).then(res=>{
				if(res.data.success){
					let data = res.data.data;
					that.datas = that.datas.concat(data);
					that.$nextTick(function () {
				        // DOM is now updated
				        if(data.length < params.pageSize ){
							that.allLoaded = true;
						}else{
							that.allLoaded = false;
						}
						that.pageIndex++;
			      	})
				}
				that.loading = false;
			}).catch(err=>{
				that.loading = false;
				that.allLoaded = true;
			})
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
	.search{
		-moz-user-select:none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
	
	.search-form{
		position: relative;
		padding: 0 15px;
		background-color: #F7F6FB;
	}
	.search-input{
		padding-right: 100px!important;
		margin-top: 15px;
		height: 44px!important;
		font-size: 14px;
		border-radius: 20px!important;
	}
	.search-button{
		width: 80px!important;
		position: absolute;
		right: 15px;
		top: 15px;
	 	outline:none;
		height: 44px;
		border-radius: 0;
		border: 1px solid #ccc;
		box-shadow: none;
		background-color: #a248ff;
		color: #fff;
		border-radius: 0 20px 20px 0;
		text-align: center;
    	line-height: 40px;
    	font-size: 18px;
	}
	.cancel-btn{
		display: block;
	    position: absolute;
	    right: 100px;
	    top: 29px;
	    z-index: 999;
	    color: #fff;
	    font-weight: 200;
	    background-color: #999;
	    border-radius: 50%;
	    font-size: 16px;
	}
	
	.main-panel{padding-top: 118px;width:100%;}
	.list-panel{background-color: #f7f6fb;}
	.data-null{height: 100%;background: #fff;padding: 50% 0;text-align: center;}
	.data-null *{display: block;margin: 0 auto;color: #999;}
	
	.search .cell{
		position: relative;
		min-height: 70px;
		max-height: 94px;
		padding: 10px 10px!important;
		display: flex;
		flex-direction: row;
		background-color: #fff;
		margin: 0 0 5px 0;
	}
	.search .cell:active{background-color: #f7f6fb;}
	.search .desc{flex: 1;overflow: hidden;}
	.search .desc .theme{height:40px;padding-right: 10px;margin-bottom: 0;font-size: 14px;color: #333;overflow:hidden;word-break: break-all;text-overflow: ellipsis;}
	.search .desc .data{height: 22px;margin-top: 15px;overflow: hidden;}
	.search .desc .data span{font-size: 12px;color: #999;}
	.search .desc .data span i{padding: 0 5px 0 0px;}
	
	.search .img{width: 80px;}
	.search .img img{width: 100%;height: 74px;}
	.search .img span{
		display: inline-block;
		position: absolute;
		top: 10px;
		right: 10px;
		padding: 0 3px;
		background-color: rgba(0, 0, 0, 0.7);
		color: #fff;
		font-size: 10px;
		line-height: 18px;
	}
	.search .img span i{font-size: 10px;padding-right: 5px;}
	
	
	.search-history{height: 100%;padding: 0 15px;overflow: auto;}
	.search-history li{
		float: left;
		list-style: none;
		margin: 5px;
		padding:0 5px;
		line-height: 30px;
		border-radius: 15px;
		font-size: 14px;
		color: #333;
		background-color: #f7f6fb;
	}
	.search-history .prompt{margin:15px 0;font-size: 14px;color: #999;}
	.search-history .prompt span:last-child{float: right;margin-right: 2px;}
</style>