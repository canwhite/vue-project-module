<template>
	<div class="mylist" v-cloak>
		<!--最新-->
  		<mt-loadmore 
  			ref="loadmore" 
  			:auto-fill="autoFill" 
  			:top-method="loadTop" 
  			:bottom-method="loadBottom" 
  			:bottom-all-loaded="true" 
  			:infinite-scroll-immediate-check="true" 
  			v-infinite-scroll="loadBottom"
			infinite-scroll-disabled="allLoaded"
			infinite-scroll-distance="0">
		    <ul class="list-panel">
		    	
		    	<mt-cell-swipe v-for="(item, index) in datas" :key="item.id"
		    		:right="[
					    {
					      content: '删除',
					      style: { background: 'red', color: '#fff' },
					      handler: ()=>{deleteFn(item, index)}
					    }
				  	]">
				  	
				  	<div class="cell" @click="link2dtl(item,index)">
				    	<div class="desc">
				    		<p class="theme">{{item.title}}</p>
				    		<div class="data">
				    			<span><i class="iconfont uct-icon-shoucang"></i>{{item.fromSource}}</span>
				    			<span><i class="iconfont uct-icon-shijian"></i>{{item.updateTime | formatDate()}}</span>
				    		</div>
				    	</div>
				    	<div class="img" v-if="item.thumbnailUrl!=null">
				    		<img :src="item.thumbnailUrl"/>
				    	</div>
			    	</div>
		    	</mt-cell-swipe>
		    	
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
	import { CellSwipe } from 'mint-ui';
	import { Indicator, Toast, MessageBox } from 'mint-ui';

	export default {
	  components: {
	    'end-line': endLine
	  },
	  props:{
	  	type:{
	  		default : ''
	  	}
	  },
	  /*计算属性*/
	  computed: {
	  },
	  data() {
	  	return {
	  		autoFill:false,
	  		allLoaded:false,
	  		topStatus:'',
	  		datas:[],
	  		pageIndex:1,
	  		loading:true
	  	}
	  },
	  created(){

	  },
	  mounted(){
	  	let that = this;
	  	that.pageIndex = 1;
	  	this.datas = [];
  		that.getData();
	  },
	  methods:{
	  	handleTopChange(status) {
	        this.topStatus = status;
      	},
		loadTop(){
			this.datas = [];
			this.pageIndex = 1;
			this.$refs.loadmore.onTopLoaded();
			this.getData();
		},
		link2dtl(item,index){
			let that = this;
			if(item.deleteFlag==1){
				let dataArray = that.datas.slice();
				MessageBox({
					message:'该内容已被删除，是否删除该条收藏?',
					cancelButtonText:'取消',
					showCancelButton:true,
					confirmButtonText:'删除',
					showConfirmButton:true
				}).then(action => {
					if(action=='cancel') return;
					
					let url = that.api.deleteURL;
					let params = {
						'empCode': that.$store.state.userInfo.empCode,
						'id': item.id,
						'appCode':item.appCode,
						'primaryKey': item.primaryKey
					}
					that.post(url, params).then(res=>{
						if(res.data.success){
							dataArray.splice(index,1)
							that.datas = dataArray;
						}
					}).catch(err=>{
						
					})
				},() => {
					
				});
				
				return;
			}
			
			if(item.appId!=null){
				if(item.fromSource == '文件管理'||item.fromSource == '公司文件'){
					window.location.href = "js://uct?method=attachment&arg1=" + item.title+"&arg2="+item.detailUrl+"&title=文件详情";
				}else{
					if( item.detailUrl.indexOf('?') == -1 ){
						window.location.href = item.detailUrl+'?appId='+ item.appId;
					}else{
						window.location.href = item.detailUrl+'&appId='+ item.appId;
					}
				}
			}else{
				window.location.href = "js://uct?method=navigation&type="+item.appType+"&id="+item.primaryKey+"&title="+item.title+"&remark="+item.remark;
			}
			
		},
		loadBottom(){
  			this.$refs.loadmore.onBottomLoaded();
			this.getData();
		},
		getData(){
			let that = this;
			that.loading = true;
			let url = that.api.findStarList;
			
			let params = {
				empCode: this.$store.state.userInfo.empCode,
				currentPage: that.pageIndex,
				pageSize: 10
			}
			that.post(url,params).then(res=>{
				if(res.data.success){
					let data = res.data.data?res.data.data:[];
					that.datas = that.datas.concat(data);
					that.$nextTick(function () {
				        // DOM is now updated
				        if(data.length < params.pageSize ){
							that.allLoaded = true;
						}else{
							that.allLoaded = false;
						}
						that.pageIndex++;
						
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
		},
		deleteFn(item,index){
			let that = this;
			let dataArray = that.datas.slice();
			MessageBox.confirm('确定删除该条收藏?').then(action => {
				let url = that.api.deleteURL;
				let params = {
					'empCode': that.$store.state.userInfo.empCode,
					'id': item.id,
					'appCode':item.appCode,
					'primaryKey': item.primaryKey
				}
				that.post(url, params).then(res=>{
					if(res.data.success){
						dataArray.splice(index,1)
						that.datas = dataArray;
					}
				}).catch(err=>{
					
				})
			},() => {
				
			});
		}
	  },
	  watch: {

	  }
	}
</script>

<style>
	.mylist{
		height: 100%;
	}
	.mylist .cell{
		position: relative;
		width: 100%;
		min-height: 70px;
		max-height: 94px;
		padding: 10px 10px!important;
		display: flex;
		flex-direction: row;
		background-color: #fff;
	}
	.mylist .cell-active{background-color: #f7f6fb;}
	.mylist .desc{flex: 1;overflow: hidden;}
	.mylist .desc .theme{height:40px;margin-bottom: 0;font-size: 14px;color: #333;overflow:hidden;word-break: break-all;}
	.mylist .desc .data{height: 22px;margin-top: 15px;overflow: hidden;}
	.mylist .desc .data span{font-size: 12px;color: #999;}
	.mylist .desc .data span i{padding: 0 5px 0 0px;}
	
	.mylist .img{width: 80px;margin-left: 10px;}
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
	
	
	.mylist .mint-cell-title{flex: 0!important;}
	.mylist .mint-cell-value{width: 100%;}
	.mylist .mint-cell-right{width: 70px;background-color: #ff0000;}
	.mylist .mint-cell-swipe-button{position: absolute;right: 0;top: 50%;width: 100%;text-align:center;transform: translateY(-50%);line-height: 94px;}
	.mylist .mint-cell-wrapper{padding: 0;}
	.mylist .mint-cell-swipe{margin-bottom: 5px;}
</style>