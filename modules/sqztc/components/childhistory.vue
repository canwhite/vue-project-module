<template>
	<div v-cloak>
		
  		<mt-loadmore :auto-fill="false" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
			<!--处理中-->
			<ul class="list-panel" v-if="this.type == '1'">
			  	<li v-for="(item, index) in datas" style="display: block;">
		    		<div class="cell" @click="link2dtl(item.id)">
				    	<div class="desc">
				    		<p class="theme" v-text="item.questionTitle"></p>
				    		<div class="data">
				    			<span><i class="iconfont uct-icon-shijian"></i>{{item.createTime | formatTime}}</span>
				    		</div>
				    	</div>
				    	<div class="img" v-if="item.filePaths!=null&&item.filePaths.length>0">
				    		<img :src="item.filePaths[0]"/>
				    		<span class="img-icon"><i class="iconfont uct-icon-zhaopian"></i>{{item.filePaths.length}}</span>
				    	</div>
			    	</div>
			    	<div class="task">
			    		<mt-button size="small" type="default" @click="urged(item.id, index)" :disabled="item.urgeFlag != 0">{{item.urgeFlag==0?'催办':'已催办'}}</mt-button>
			    	</div>
		    	</li>
			</ul>
		
			<!--待确认-->
			<ul class="list-panel" v-if="this.type == '2'">
		    	<li v-for="(item, index) in datas" style="display: block;">
		    		<div class="cell" @click="link2dtl(item.id)">
				    	<div class="desc">
				    		<p class="theme">{{item.questionTitle}}</p>
				    		<div class="data">
				    			<span><i class="iconfont uct-icon-shijian"></i>{{item.createTime | formatTime}}</span>
				    		</div>
				    	</div>
				    	<div class="img" v-if="item.filePaths!=null&&item.filePaths.length>0">
				    		<img :src="item.filePaths[0]"/>
				    		<span class="img-icon"><i class="iconfont uct-icon-zhaopian"></i>{{item.filePaths.length}}</span>
				    	</div>
			    	</div>
			    	<div class="remark" @click="link2dtl(item.id)">
			    		<div class="remark-user">
			    			<span><i class="iconfont uct-icon-bumen"></i>{{item.handleOrgName}}：{{item.handleEmpName}}</span>
			    			<span style="float: right;"><i class="iconfont uct-icon-shijian"></i> {{item.handleTime | formatTime}}</span>
			    		</div>
			    		<div class="remark-content">{{item.handleResult?item.handleResult.substring(0,49):''}}</div>
			    	</div>
			    	<div class="task task-confirm">
			    		<mt-button size="small" type="default" @click="evaluation(item.id, index)" class="task-pingjia">确认及评价</mt-button>
			    		<mt-button size="small" type="default" @click="complaint(item.id, index)" v-if="item.complain==null">不满意申诉</mt-button>
			    	</div>
		    	</li>
			</ul>
			
			<!--已完成-->
			<ul class="list-panel" v-if="this.type == '3'">
			  	<li  v-for="item in datas" @click="link2dtl(item.id)" style="display: block;">
		    		<div class="cell">
				    	<div class="desc">
				    		<p class="theme">{{item.questionTitle}}</p>
				    		<div class="data">
				    			<span><i class="iconfont uct-icon-shijian"></i>{{item.createTime | formatTime}}</span>
				    			<span style="float: right;margin-right: 10px;color: #ff6d6d;">{{item.status==4?'已退回':''}}</span>
				    		</div>
				    	</div>
				    	<div class="img" v-if="item.filePaths!=null&&item.filePaths.length>0">
				    		<img :src="item.filePaths[0]"/>
				    		<span class="img-icon"><i class="iconfont uct-icon-zhaopian"></i>{{item.filePaths.length}}</span>
				    	</div>
			    	</div>
			    	<div class="remark">
			    		<div class="remark-user">
			    			<span><i class="iconfont uct-icon-bumen"></i>{{item.handleOrgName}}：{{item.handleEmpName}}</span>
			    			<span style="float: right;"><i class="iconfont uct-icon-shijian"></i> {{item.handleTime | formatTime}}</span>
			    		</div>
			    		<div class="remark-content">{{item.handleResult?item.handleResult.substring(0,49):''}}</div>
			    		<div style="margin-bottom: 5px;"></div>
			    	</div>
		    	</li>
			</ul>
			
			<div class="data-null" v-if="!showloading && datas.length ==0">
	    		<img src="../static/images/none.jpg" width="130px"/>
	    		<span style="padding-top: 10px;font-size: 14px;">暂无数据</span>
	    	</div>
		  	<div style="text-align: center;">
		  		<mt-spinner v-show="showloading" type="triple-bounce" color="rgb(160, 100, 232)"></mt-spinner>
		  	</div>
			<end-line v-if="allLoaded && datas.length>0"></end-line>
			
		</mt-loadmore>
		
		<!--申诉-->
		<com-plaint :complaintpopup="complaintpopup" title="申诉事由" @getPopupValue="getPopupValue" v-if="complaintpopup.visible"></com-plaint>
		<!--评价-->
		<eval-uation :evaluationpopup="evaluationpopup" title="评价" @getPopupValue="getPopupValue2" v-if="evaluationpopup.visible"></eval-uation>
	
	</div>	
</template>

<script>
	import endLine from '../components/endLine.vue';
	import comPlaint from '../components/complaint.vue';
	import evalUation from '../components/evaluation.vue';
	
	import { Indicator, Toast } from 'mint-ui';

	export default {
	  components: {
	    'end-line': endLine,
	    'com-plaint': comPlaint,
	    'eval-uation': evalUation
	  },
  	  props:{
	  	type:{
	  		default :'1'
	  	}
	  },
	  /*计算属性*/
	  computed: {

	  },
	  data() {
	  	return {
	  		datas:[],
	  		pageIndex:1,
	  		loading:false,
	  		showloading:false,
	  		allLoaded:false,
	  		//申诉
	  		complaintpopup:{
	  			visible:false,
	  			id:null,
	  			index:0
	  		},
	  		//评价
	  		evaluationpopup:{
	  			visible:false,
	  			id:null,
	  			index:0
	  		}
	  	}
	  },
	  created(){
	  },
	  mounted(){
	  	this.pageIndex = 1;
	  	this.datas = [];
	  	this.getData();
	  },
	  activated(){
	  	if(this.$store.state.dataUpdate){
	  		this.pageIndex = 1;
		  	this.datas = [];
		  	this.getData();
		  	this.$store.state.dataUpdate = false;
	  	}
	  },
	  methods:{
		link2dtl(id){
			this.$router.push('/detail/'+id)
		},
		loadTop(){
			this.datas = [];
			this.pageIndex = 1;
			this.$refs.loadmore.onTopLoaded();
			this.getData();
		},
		loadBottom(){
  			this.$refs.loadmore.onBottomLoaded();
			this.getData();
		},
		getData(){
			let that = this;
			that.showloading = true;
			let url = that.api.findQuestionsURL;
			let params = {
				currentUserCode: that.$store.state.userInfo.empCode,
				status: that.type,
				currentPage: that.pageIndex,
				pageSize: 10
			}

			that.post(url,params).then(res=>{
				if(res.data.success){
					let data = res.data.data;
					that.datas = that.datas.concat(data);
					//DOM-ready
					that.$nextTick(function () {
						if(data.length < params.pageSize){
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
				that.showloading = false;
			}).catch(err=>{
				that.showloading = false;
				that.allLoaded = true;
			})
		},
		urged(id,index){
			if(this.datas[index].urgeFlag != 0){
				return;
			}
			this.post(this.api.urgeURL,{id:id}).then(res=>{
				let data = res.data;
				if(data.success){
					Toast({message: "催办成功",position: 'bottom',duration: 2000});
					this.datas[index].urgeFlag = 1;
				}else{
					Toast({message: data.message,position: 'bottom',duration: 2000});
				}
			})
		},
		//申诉
		complaint(id,index){
			if(this.datas[index].complain!=null){
				Toast({message: "已申诉过",position: 'bottom',duration: 2000});
				return;
			}
			this.complaintpopup.visible = true;
			this.complaintpopup.id = id;
			this.complaintpopup.index = index;
		},
		getPopupValue(params){
			
			if(params.complain.length<15){
				Toast({message: "申诉原因不得少于15字",position: 'bottom',duration: 2000});
				return;
			}
			this.complaintpopup.visible = false;
			this.post(this.api.appealURL,{id:params.id,complain:params.complain}).then(res=>{
				let data = res.data;
				if(data.success){
					this.datas[params.index].complain = params.complain;
					Toast({message: "申诉成功",position: 'bottom',duration: 2000});
					this.datas.splice(params.index,1);//从列表中移除
				}else{
					Toast({message: data.message,position: 'bottom',duration: 2000});
				}
			}).catch(err=>{
				
			})
		},
		//评价
		evaluation(id,index){
			if(this.datas[index].score!=null){
				Toast({message: "已评价过",position: 'bottom',duration: 2000});
				return;
			}
			this.evaluationpopup.visible = true;
			this.evaluationpopup.id = id;
			this.evaluationpopup.index = index;
		},
		getPopupValue2(params){
			this.evaluationpopup.visible = false;
			
			this.post(this.api.commentURL,{id:params.id,score:params.score,comment:params.remark}).then(res=>{
				let data = res.data;
				if(data.success){
					this.datas[params.index].score = params.score;
					Toast({message: "评价成功",position: 'bottom',duration: 2000});
					this.datas.splice(params.index,1);//从列表中移除
				}else{
					Toast({message: data.message,position: 'bottom',duration: 2000});
				}
			}).catch(err=>{
				
			})
		}
	  },
	  watch: {
	  	'type':function(newValue, oldValue){
	  		this.allLoaded = false;
	  		this.pageIndex = 1;
	  		this.datas = [];
	  		if(newValue=='1'&&this.$store.state.dataUpdate)return;
	  		if(newValue!='undefind'){
	  			this.getData();
	  		}
	  	}
	  }
	}
</script>

<style>
	.cell{
		position: relative;
		min-height: 70px;
		max-height: 94px;
		padding: 10px 10px!important;
		display: flex;
		flex-direction: row;
		background-color: #fff;
		margin: 0 0 1px 0;
	}
	.cell-active{background-color: #f7f6fb;}
	.desc{flex: 1;overflow: hidden;}
	.desc .theme{height:40px;padding-right: 10px;margin-bottom: 0;font-size: 14px;color: #333;overflow:hidden;word-break: break-all;text-overflow: ellipsis;}
	.desc .data{height: 22px;margin-top: 15px;overflow: hidden;}
	.desc .data span{font-size: 12px;color: #999;}
	.desc .data span i{padding: 0 5px 0 0px;}
	
	.img{width: 80px;}
	.img img{width: 100%;height: 74px;}
	.img span{
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
	.img span i{font-size: 10px;padding-right: 5px;}
	.task{position:relative;height:43px;padding: 5px 0;background-color: #fff;}
	.task button{position: absolute;right: 10px;width: 75px;border-radius: 10px;}
	.task .mint-button--default{color: #333;background-color: #f6f8fa;}
	.task-confirm button{position: relative;float:right;width: 100px;margin-left: 5px;}
	.task-confirm .task-pingjia {border: 1px solid #f47821;color: #f47821;}
	
	.remark{height: auto;min-height: 60px;background-color: #fff;margin-bottom: 1px;}
	.remark-user{height: 30px;line-height:30px;font-size: 13px;color: #999;}
	.remark-content{font-size: 14px;color: #333;padding: 5px 0 10px 0;word-break: break-all;}
	
	.list-panel{background-color: #f7f6fb;}
	.list-panel li{margin-bottom: 5px;}
	.data-null{height: 100%;background: #fff;padding: 50% 0 70% 0;text-align: center;}
	.data-null *{display: block;margin: 0 auto;color: #999;}
</style>