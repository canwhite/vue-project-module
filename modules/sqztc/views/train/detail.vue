<template>
	<div class="route detail">
		<div class="top-banner">
			<bar-top
		    	:show-return-icon="true"
		    	:show-right-icon="false"
		    	topBarTitle="问题详情">
			</bar-top>
		</div>
		
		<div style="padding-top: 44px;padding-bottom: 50px;">
			<div>
				<div class="detail-panel">
					<div class="title-panel">
						<p class="zt">{{Qdetail.questionTitle}}</p>
						<span><i class="iconfont uct-icon-shijian"></i>  {{Qdetail.createTime | formatTime}}</span>
						<span style="margin-left: 20px;">{{Qdetail.questionType==1?'咨询':(Qdetail.questionType==2?'建议':(Qdetail.questionType==3?'举报':''))}}</span>
						<span style="margin-left: 20px;color: #ff6d6d;">{{Qdetail.status==4?'已退回':''}}</span>
					</div>
					
					<div class="desc-panel" v-html="Qdetail.questionContent"></div>
					
					<div class="img-panel" id="layer-photos" v-if="Qdetail.filePaths!=null&&Qdetail.filePaths.length>0">
						<img v-for="item in Qdetail.filePaths" :src="item" :data-original="item" alt="loading"/>
					</div>
					<div class="way-number" v-if="Qdetail.waybillNumber">
						<div>单&nbsp;&nbsp;&nbsp;号：{{Qdetail.waybillNumber}}</div>
					</div>
				</div>
				<div class="user-panel">
					<div><span>上报人: {{Qdetail.reportEmpName}}</span> <span style="float: right;">{{Qdetail.reportEmpMobile}}</span></div>
					<div>部&nbsp;&nbsp;&nbsp;&nbsp;门：{{Qdetail.reportOrgName}}</div>
				</div>
			</div>
			
			<div class="result-panel" v-if="Qdetail.complain != null">
				<p class="zt">申诉内容 </p>
				<span style="position: absolute;right: 15px;top: 15px;font-size: 12px;color: #999;">{{Qdetail.complainTime | formatTime}}</span>
				<div class="result-content" v-html="Qdetail.complain"></div>
			</div>
			
			<div class="result-panel" v-if="Qdetail.status != 1">
				<p class="zt">处理结果</p>
				<div class="result-user">
					<span>处理人：{{Qdetail.handleEmpName}}</span>
					<span style="float: right;">{{Qdetail.handleTime | formatTime}} </span>
					<div>部&nbsp;&nbsp;&nbsp;&nbsp;门：{{Qdetail.handleOrgName}}</div>
				</div>
				<div class="result-content" v-html="Qdetail.handleResult"></div>
			</div>
			
			<div class="result-panel" v-if="Qdetail.score!=null || Qdetail.comment!=null">
				<p class="zt" style="color: #999;">用户评价</p>
				<span style="position: absolute;right: 15px;top: 15px;font-size: 12px;color: #999;">{{Qdetail.confirmTime | formatTime}}</span>
				<div class="star" v-if="Qdetail.score!=null">
					<i class="iconfont" :class="{'uct-icon-xing-o':Qdetail.score<1,'uct-icon-xing':Qdetail.score>=1}"></i>
					<i class="iconfont" :class="{'uct-icon-xing-o':Qdetail.score<2,'uct-icon-xing':Qdetail.score>=2}"></i>
					<i class="iconfont" :class="{'uct-icon-xing-o':Qdetail.score<3,'uct-icon-xing':Qdetail.score>=3}"></i>
					<i class="iconfont" :class="{'uct-icon-xing-o':Qdetail.score<4,'uct-icon-xing':Qdetail.score>=4}"></i>
					<i class="iconfont" :class="{'uct-icon-xing-o':Qdetail.score<5,'uct-icon-xing':Qdetail.score>=5}"></i>
				</div>
				<div v-if="Qdetail.comment!=null" class="comment">
					<span v-html="Qdetail.comment"></span>
				</div>
			</div>
			
		</div>
		
		
		<div class="task-panel" v-if="Qdetail.status==1">
			<div class="shensu-panel" @click="urged(Qdetail.id)">{{Qdetail.urgeFlag!=0?'已催办':'催办'}}</div>
		</div>
		<div class="task-panel" v-if="Qdetail.status==2">
			<div class="shensu-panel" @click="complaint(Qdetail.id)" v-if="Qdetail.complain==null">不满意申诉</div>
			<div class="pingjia-panel" @click="evaluation(Qdetail.id)">确认及评价</div>
		</div>
		<!--申诉-->
		<com-plaint :complaintpopup="complaintpopup" title="申诉事由" @getPopupValue="getPopupValue" v-if="complaintpopup.visible"></com-plaint>
		<!--评价-->
		<eval-uation :evaluationpopup="evaluationpopup" title="评价" @getPopupValue="getPopupValue2" v-if="evaluationpopup.visible"></eval-uation>

		
	</div>
</template>	

<script>
	import barTop from '../../components/barTop.vue';
	import comPlaint from '../../components/complaint.vue';
	import evalUation from '../../components/evaluation.vue';
	import { Indicator, Toast } from 'mint-ui';
	import Viewer from 'viewerjs';
	
	const objDtl = {
  			browsingTimes: 0,
			comment: null,
			complain: null,
			complainTime: null,
			createTime: null,
			currentUserCode: null,
			filePaths: [],
			handleEmpCode: "",
			handleEmpName: "",
			handleOrgName: "",
			handleResult: "",
			handleTime: null,
			id: 0,
			identityType: null,
			overTime: null,
			questionContent: "",
			questionTitle: "",
			questionType: 0,
			reportEmpCode: "",
			reportEmpMobile: "",
			reportEmpName: "",
			reportOrgName: "",
			score: null,
			search: null,
			status: null,
			updateTime: null,
			urgeFlag: 0,
			waybillNumber: ""
	  	};
	var viewer;
	function viewerInit(){
		try{
        	viewer.destroy();
        }catch(e){
        	//TODO handle the exception
        }
    	var pictures = document.querySelector('#layer-photos');
      	var options = {
	     	inline: false,
	     	toolbar: {
			  zoomIn: 1,
			  zoomOut: 1,
			  oneToOne: 1,
			  reset: 1,
			  prev: 1,
			  play: {
			    show: false,
			    size: 'large',
			  },
			  next: 1,
			  rotateLeft: 1,
			  rotateRight: 1,
			  flipHorizontal: 1,
			  flipVertical: 1
			},
		    url: 'data-original'
	  	};
	  	viewer = new Viewer(pictures, options);
	}
	export default {
	  components: {
	    'bar-top': barTop,
	    'com-plaint': comPlaint,
	    'eval-uation': evalUation
	  },
	  created(){
	  	let that = this;
	  	let id = that.$route.params.id;
	  	let url = that.api.findQuestionDetailURL;
	  	that.post(url,{id:id}).then(res=>{
	  		let data = res.data;
	  		if(data.success){
	  			that.Qdetail = data.data;
	  			that.$nextTick(function () {
	  				if(that.Qdetail.filePaths!=null&&that.Qdetail.filePaths.length>0){
	  					//预览
	  					viewerInit()
	  				}
	  			})
	  		}else{
	  			Toast({message: data.message,position: 'bottom',duration: 2000});
	  		}
	  	}).catch(err=>{
	  	})
	  },
	  mounted(){
	  	this.Qdetail = objDtl;
	  },
	  data() {
	  	return {
			//申诉
	  		complaintpopup:{
	  			visible:false
	  		},
	  		//评价
	  		evaluationpopup:{
	  			visible:false
	  		},
	  		Qid:this.$route.params.id,
	  		Qdetail:objDtl
		}
	},
	methods:{
		//催办
		urged(id){
			if(this.Qdetail.urgeFlag != 0){
				return;
			}
			this.post(this.api.urgeURL,{id:id}).then(res=>{
				let data = res.data;
				if(data.success){
					Toast({message: "催办成功",position: 'bottom',duration: 2000});
					this.Qdetail.urgeFlag = 1;
					this.$store.state.dataUpdate = true;
				}else{
					Toast({message: data.message,position: 'bottom',duration: 2000});
				}
			})
		},
		//申诉
		complaint(id){
			if(this.Qdetail.complain!=null){
				Toast({message: "已申诉过",position: 'bottom',duration: 2000});
				return;
			}
			this.complaintpopup.visible = true;
			this.complaintpopup.id = id;
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
					this.Qdetail.complain = params.complain;
					this.$store.state.dataUpdate = true;
					Toast({message: "申诉成功",position: 'bottom',duration: 2000});
					this.$router.back();
				}else{
					Toast({message: data.message,position: 'bottom',duration: 2000});
				}
			}).catch(err=>{
				
			})
		},
		//评价
		evaluation(id){
			if(this.Qdetail.score!=null){
				Toast({message: "已评价过",position: 'bottom',duration: 2000});
				return;
			}
			this.evaluationpopup.visible = true;
			this.evaluationpopup.id = id;
		},
		getPopupValue2(params){
			this.evaluationpopup.visible = false;
			
			this.post(this.api.commentURL,{id:params.id,score:params.score,comment:params.remark}).then(res=>{
				let data = res.data;
				if(data.success){
					this.Qdetail.score = params.score;
					this.$store.state.dataUpdate = true;
					Toast({message: "评价成功",position: 'bottom',duration: 2000});
					this.$router.back();
				}else{
					Toast({message: data.message,position: 'bottom',duration: 2000});
				}
			}).catch(err=>{
				
			})
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
	.detail .detail-panel{
		padding: 15px 0 15px 15px;
		background-color: #fff;
	}
	.title-panel{
		border-bottom: 1px solid #f7f6fb;
		padding-bottom: 15px;
		padding-right: 15px;
		color: #999;
		font-size: 12px;
	}
	.title-panel .zt{font-size: 16px;color: #333;}
	.desc-panel{padding: 15px 15px 15px 0;font-size: 14px;color: #333;word-break: break-all;}
	.img-panel{display:flex;height: 75px;padding-right: 15px;}
	.img-panel img{display:block;padding:0 2px;width: 25%;height: 100%;}
	.way-number{margin-top: 15px;padding-top:15px;font-size: 14px;color: #333;border-top: 1px solid #f7f6fb;}
	.user-panel{padding: 15px;background-color: #fff;border-bottom: 1px solid #f7f6fb;border-top: 1px solid #f7f6fb;font-size: 13px;color: #999;line-height: 30px;}
	
	.result-panel{position:relative;background-color: #fff;padding-left: 15px;padding-top: 15px;}
	.result-panel .zt{font-size: 12px;color: #333;}
	.result-user{padding:0 15px 15px 0;font-size: 13px;color: #999;}
	.result-content{padding: 0 15px 15px 0;font-size: 14px;color: #333;word-break: break-all;}
	
	.task-panel{
		position: fixed;
		bottom: 0;
		display: flex;
		width: 100%;
		height: 50px;
		line-height: 50px;
		background-color: #fff;
		border-top: 1px solid #f7f6fb;
		box-shadow: 0px -4px 4px 0px rgba(217, 217, 217, 0.5);
	}
	.task-panel .shensu-panel, .task-panel .pingjia-panel{flex: 1;text-align: center;font-size: 16px;}
	.task-panel .shensu-panel{color: #999;}
	.task-panel .pingjia-panel{color: #f47821;}
	.star i{color: #ec7f0d;}
	.star span{font-size: 14px;color: #333;}
	.comment{font-size: 14px;padding-right: 15px;word-break: break-all;color: #333;}
</style>