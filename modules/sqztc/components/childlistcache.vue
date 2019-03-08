<template>
	<div class="mylist" v-cloak>
		<!--最新-->
  		<mt-loadmore :auto-fill="autoFill" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" @top-status-change="handleTopChange" ref="loadmore">
		    <ul class="list-panel">
		    	<div class="cell" v-for="item in datas" @click="link2dtl(item.id)" v-cloak>
			    	<div class="desc">
			    		<p class="theme" v-text="item.questionTitle"></p>
			    		<div class="data">
			    			<span><i class="iconfont uct-icon-bumen"></i>{{item.reportOrgName}}</span>
			    			<span><i class="iconfont uct-icon-yulan"></i>{{item.browsingTimes}}</span>
			    			<span><i class="iconfont uct-icon-shijian"></i>{{item.confirmTime | formatTime}}</span>
			    		</div>
			    	</div>
			    	<div class="img" v-if="item.filePaths!=null&&item.filePaths.length>0">
			    		<img :src="item.filePaths[0]"/>
			    		<span class="img-icon"><i class="iconfont uct-icon-zhaopian"></i>{{item.filePaths.length}}</span>
			    	</div>
		    	</div>
		    </ul>
		    <div class="data-null" v-if="!loading && datas.length ==0">
	    		<img src="../static/images/none.jpg" width="130px"/>
	    		<span style="padding-top: 10px;font-size: 14px;">暂无数据</span>
	    	</div>
	    	<div style="text-align: center;">
	    		<mt-spinner v-show="loading" type="triple-bounce" color="rgb(160, 100, 232)"></mt-spinner>
	    	</div>
	    	<end-line v-if="allLoaded && datas.length>0"></end-line>
		</mt-loadmore>
	</div>
</template>

<script>
	import endLine from '../components/endLine.vue';
	import { Indicator, Toast } from 'mint-ui';

	export default {
	  components: {
	    'end-line': endLine
	  },
	  props:{
	  	type:{
	  		default :''
	  	},
	  	baseloaded:{
	  		default : false
	  	},
	  	basedata:{
	  		default: []
	  	},
	  	basepage:{
	  		default : 1
	  	},
	  	scrollTop:{
	  		default: 0
	  	}
	  },
	  /*计算属性*/
	  computed: {
	  },
	  data() {
	  	return {
	  		autoFill:false,
	  		topStatus:'',
	  		loading:true,
	  		datas:this.basedata,
	  		pageIndex:this.basepage,
	  		allLoaded:this.baseloaded
	  	}
	  },
	  created(){
	  },
	  mounted(){
	  	let that = this;
	  	that.pageIndex = 1;
	  	this.datas = [];
  		that.getData(that.type);
	  },
	  methods:{
	  	handleTopChange(status) {
	        this.topStatus = status;
      	},
		loadTop(){
			this.datas = [];
			this.pageIndex = 1;
			this.$refs.loadmore.onTopLoaded();
			this.getData(this.type);
		},
		link2dtl(id){
			this.$router.push('/detail/'+id)
		},
		loadBottom(){
  			this.$refs.loadmore.onBottomLoaded();
			this.getData(this.type);
		},
		getData(type){
			let that = this;
			that.loading = true;
			let url = that.api.findQuestionsURL;
			let params = {
				questionType: type,
				search: '',
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
						/*回传数据*/
						that.$emit('cacheData',type,{
			  				basedata: that.datas,
			  				baseloaded: that.allLoaded,
			  				basepage: that.pageIndex
			  			})
						
						/*active样式*/
						$('.cell').on('touchstart', function (e) {
						    var _this = this;
						    $(_this).addClass('cell-active');
						});
						$('.cell').on('touchmove', function (e) {
						    var _this = this;
					        $(_this).removeClass('cell-active');
						});
						$('.cell').on('touchend', function (e) {
						    var _this = this;
					        $(_this).removeClass('cell-active');
						});
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
	  	'type':function(newValue, oldValue){
	  		if(this.basedata.length>0){
	  			this.allLoaded = this.baseloaded;
		  		this.pageIndex = this.basepage;
		  		this.datas = this.basedata;
		  		this.$nextTick(function () {
		  			document.body.scrollTop = this.scrollTop;
		  		})
	  			return;
	  		}
	  		this.allLoaded = false;
	  		this.pageIndex = 1;
	  		this.datas = [];
	  		this.getData(newValue);
	  	}
	  }
	}
</script>

<style>
	.mylist .cell{
		position: relative;
		min-height: 70px;
		max-height: 94px;
		padding: 10px 10px!important;
		display: flex;
		flex-direction: row;
		background-color: #fff;
		margin: 0 0 5px 0;
	}
	.mylist .cell-active{background-color: #f7f6fb;}
	.mylist .desc{flex: 1;overflow: hidden;}
	.mylist .desc .theme{height:40px;padding-right: 10px;margin-bottom: 0;font-size: 14px;color: #333;overflow:hidden;word-break: break-all;text-overflow: ellipsis;}
	.mylist .desc .data{height: 22px;margin-top: 15px;overflow: hidden;}
	.mylist .desc .data span{font-size: 12px;color: #999;}
	.mylist .desc .data span i{padding: 0 5px 0 0px;}
	
	.mylist .img{width: 80px;}
	.mylist .img img{width: 100%;height: 74px;}
	.mylist .img span{
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
	.mylist .img span i{font-size: 10px;padding-right: 5px;}
	
	.list-panel{background-color: #f7f6fb;}
	.data-null{height: 100%;padding: 100px 0 310px 0;text-align: center;background-color: #fff;}
	.data-null *{display: block;margin: 0 auto;color: #999;}
</style>