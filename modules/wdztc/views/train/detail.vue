<template>
	<div class="route detail">
		<div class="top-banner">
			<bar-top :show-return-icon="true" :show-right-icon="false" topBarTitle="问题详情"></bar-top>
		</div>
		
		<div class="content-panel">
			<mt-loadmore 
				ref="loadmore"
				:auto-fill="autoFill" 
				:top-method="detailRefresh"
				:bottom-all-loaded="true" 
				v-infinite-scroll="findComment"
				infinite-scroll-disabled="allLoaded"
				infinite-scroll-distance="30">
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
					<div class="user-panel" v-if="Qdetail.anonymousFlag!=1 || $route.params.fromPath=='history'">
						<div><span>上报人: {{Qdetail.reportEmpName}}</span> <span style="float: right;">{{Qdetail.reportEmpMobile}}</span></div>
						<div>部&nbsp;&nbsp;&nbsp;&nbsp;门：{{Qdetail.reportOrgName}}</div>
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
				
				<!--评论-留言-->
				<div class="speaklist-panel" v-if="Qdetail.status==3&&Qdetail.questionType!=3">
					<ul>
						<!--点击查看评论回复列表-->
				    	<li class="cell-pl" v-for="(item, index) in speakDatas" 
				    		@click="mainCommentId=item.commentId;mainCommentIndex=index;
				    		popupVisible=true;
				    		popupPageIndex=1;
				    		popupSpeakDatas=[];
				    		findCommentDetail();">
							<div>
								<img class="user-img" src="../../static/images/auto.png"/>
								<span class="user-name">{{item.fromEmpName}}</span>
								<span class="speak-time">{{item.createTime | formatTime}}</span>
								<span class="speak-zan" @click="speakPraise(item.commentId,item.praiseFlag, index,1);$event.stopPropagation();">
									<i class="iconfont uct-icon-dianzan" :style="{'color':item.praiseFlag==1?'#0ec5ec':''}"></i>
									{{item.praiseCount}}
								</span>
							</div>
							<div class="speak-content" v-html="item.content"></div>
							<div class="speak-huifu"><span>{{item.replyCount}}条回复</span></div>
				    	</li>
				    </ul>
				    <div class="data-null" v-if="!loading && speakDatas.length ==0">
			    		<span style="padding-top: 10px;font-size: 14px;">暂无评论</span>
			    	</div>
			    	<div style="text-align: center;">
			    		<mt-spinner v-show="loading" type="triple-bounce" color="rgb(160, 100, 232)"></mt-spinner>
			    	</div>
			    	<end-line styles="background:#fff;margin:20px 0;" v-if="allLoaded && speakDatas.length>0"></end-line>
				</div>
			</mt-loadmore>
		</div>
		
		<!--催办-->
		<div class="task-panel" v-if="Qdetail.status==1">
			<div class="shensu-panel" @click="urged(Qdetail.id)">{{Qdetail.urgeFlag!=0?'已催办':'催办'}}</div>
		</div>
		<!--确认-评价-->
		<div class="task-panel" v-if="Qdetail.status==2">
			<div class="shensu-panel" @click="complaint(Qdetail.id)" v-if="Qdetail.complain==null">不满意申诉</div>
			<div class="pingjia-panel" @click="evaluation(Qdetail.id)">确认及评价</div>
		</div>
		<!--申诉-->
		<com-plaint :complaintpopup="complaintpopup" title="申诉事由" @getPopupValue="getPopupValue" v-if="complaintpopup.visible"></com-plaint>
		<!--评价-->
		<eval-uation :evaluationpopup="evaluationpopup" title="评价" @getPopupValue="getPopupValue2" v-if="evaluationpopup.visible"></eval-uation>
		
		<!--问题评论-留言-->
		<div class="task-panel position-pingjia-task" v-if="Qdetail.status==3&&Qdetail.questionType!=3">
			<div class="pingjia">
				<textarea id="mainInput" v-model="speakContent" maxlength="100" placeholder="发表评论"></textarea>
				<i @click="speak()">发送</i>
				<!--<form id="submit_form" action="javascript:return false">
					<input type="search" @search="speak()" value="" placeholder="placeholder"/>
				</form>-->
			</div>
			<div class="number def" @click="scroll()">
				<span>{{speakTotal>999?'999+':speakTotal}}</span>
				<i class="iconfont uct-icon-pinglun"></i>
			</div>
			<!--给问题发表评论-->
			<div class="zan def" @click="positionPraise(praiseFlag)">
				<i class="iconfont uct-icon-dianzan1" :style="{'color':praiseFlag?'#0ec5ec':''}"></i>
			</div>
			<div class="shoucang def" :class="{'taskover':collectFlag==1}" @click="collect(collectFlag)">
				<i class="iconfont uct-icon-shoucang"></i>
			</div>
		</div>
		
		<!--评论回复列表popup-->
		<mt-popup class="speak-popup mint-popup-bottom" v-model="popupVisible" position="bottom">
			<div class="close-btn">
				<i class="iconfont uct-icon-guanbi" @click="popupVisible=false;speakTospeakType=2;"></i>
				<span class="classify-title">{{mainSpeakData.replyCount!=null?mainSpeakData.replyCount:0}}条回复</span>
			</div>
			<div class="popup-list">
				<mt-loadmore
					ref="popupLoadmore"
					:auto-fill="popupAutoFill" 
					:top-method="popupRefresh"
					:bottom-all-loaded="true"
					v-infinite-scroll="findCommentDetail"
					infinite-scroll-disabled="popupAllLoaded"
					infinite-scroll-distance="0">
					<div id="popup-list" class="speaklist-panel">
						<ul>
							<!--主评论-->
							<li class="cell-pl main-pl" @click="speakTospeakType=2;">
								<div>
									<img class="user-img" src="../../static/images/auto.png"/>
									<span class="user-name" v-cloak>{{mainSpeakData.fromEmpName}}</span>
									<span class="speak-time" v-cloak>{{mainSpeakData.createTime | formatTime}}</span>
									<span class="speak-zan"  @click="speakPraise(mainSpeakData.commentId,mainSpeakData.praiseFlag,mainCommentIndex,1);" v-cloak>
										<i class="iconfont uct-icon-dianzan" :style="{'color':mainSpeakData.praiseFlag==1?'#0ec5ec':''}"></i>
										{{mainSpeakData.praiseCount}}
									</span>
								</div>
								<div class="speak-content" v-cloak v-html="mainSpeakData.content"></div>
					    	</li>
					    	<div style="height: 5px;background-color: #f7f6fb;"></div>
					    	
					    	<!--主评论回复列表-->
					    	<div style="color: #333;font-size: 14px;padding-left: 15px;padding-top: 10px;">全部回复</div>
					    	<li class="cell-pl" v-for="(item, index) in popupSpeakDatas">
								<div @click="changeSpeakType(item,1)">
									<img class="user-img" src="../../static/images/auto.png"/>
									<span class="user-name">{{item.fromEmpName}}</span>
									<span class="speak-time">{{item.createTime | formatTime}}</span>
									<span class="speak-zan" @click="speakPraise(item.commentId,item.praiseFlag,index,2);$event.stopPropagation();">
										<i class="iconfont uct-icon-dianzan" :style="{'color':item.praiseFlag==1?'#0ec5ec':''}"></i>
										{{item.praiseCount}}
									</span>
								</div>
								<div class="speak-content" @click="changeSpeakType(item,1)" v-html="item.content"></div>
								<ul>
									<li class="speakTospeak" v-for="(speakItem, index) in item.replyList"
										@click="changeSpeakType(speakItem,2)">
										<span class="formEmp">{{speakItem.fromEmpName}}</span>
										<span class="atob">回复</span>
										<span class="toEmp">{{speakItem.toEmpName}}：</span>
										<span class="contentword" v-html="speakItem.content"></span>
									</li>
								</ul>
					    	</li>
					    </ul>
					    <div class="data-null" v-if="!popupLoading && popupSpeakDatas.length ==0">
				    		<span style="padding-top: 10px;font-size: 14px;">暂无回复</span>
				    	</div>
				    	<div style="text-align: center;">
				    		<mt-spinner v-show="popupLoading" type="triple-bounce" color="rgb(160, 100, 232)"></mt-spinner>
				    	</div>
				    	<end-line styles="background:#fff;margin:20px 0;" v-if="popupAllLoaded && popupSpeakDatas.length>0"></end-line>
					</div>
				</mt-loadmore>
			</div>
			<!--评论评论-回复评论-->
			<div class="task-panel position-pingjia-task">
				<div class="pingjia">
					<textarea id="secendInput"
						v-model="popupSpeakContent" maxlength="100" 
						:placeholder="speakTospeakType==2?'发表评论':(fromEmpName+' 回复  '+toEmpName)">
					</textarea>
					<i @click="speakTospeak()">发送</i>
				</div>
				<!--主评论点赞-->
				<div class="zan def" @click="speakPraise(mainSpeakData.commentId,mainSpeakData.praiseFlag,mainCommentIndex,1);">
					<i class="iconfont uct-icon-dianzan1" :style="{'color':mainSpeakData.praiseFlag==1?'#0ec5ec':''}"></i>
				</div>
			</div>
		</mt-popup>
		
	</div>
</template>	

<script>
	import barTop from '../../components/barTop.vue';
	import comPlaint from '../../components/complaint.vue';
	import evalUation from '../../components/evaluation.vue';
	import endLine from '../../components/endLine.vue';
	import { Indicator, Toast } from 'mint-ui';
	import Viewer from 'viewerjs';
	
	const objDtl = {
			anonymousFlag:null,
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
			  zoomIn: 1,zoomOut: 1,oneToOne: 1,reset: 1,prev: 1,
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
	    'eval-uation': evalUation,
	    'end-line': endLine
	  },
	  created(){
	  	
	  },
	  mounted(){
	  	this.detailRefresh();
	  	
	  	$(".content-panel").on('click',function(){
	  		document.querySelector('#mainInput').blur();
	  	})
	  	$(".popup-list").on('click',function(){
	  		document.querySelector('#secendInput').blur();
	  	})
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
	  		Qid:this.$route.params.id,//问题id
	  		Qdetail: objDtl,//问题详情
	  		speakContent:'',//问题评论内容
	  		speakTotal:0,//问题评论数
	  		speakDatas:[],//问题评论列表
	  		praiseFlag:false,//点赞状态
	  		collectFlag:0,//收藏状态 0未收藏1已收藏
	  		scrollType:false,
	  		//评论列表
	  		autoFill:false,
	  		allLoaded:true,
	  		pageIndex:1,
	  		loading:false,
	  		//评论回复列表
	  		popupVisible:false,//弹框控制
	  		popupAutoFill:false,
	  		popupAllLoaded:true,
	  		popupLoading:false,
	  		popupPageIndex:1,
	  		mainCommentId:'',//主评论id,type=2时使用
	  		mainCommentIndex:0,//弹框所属评论index
	  		mainSpeakData:{},//主评论数据
	  		popupSpeakDatas:[],//主评论回复列表
	  		speakTospeakType:2,//2给评论发表评论，3回复评论的评论
	  		parentCommentId:'',//当type=3时回复的评论的评论id
	  		popupSpeakContent:'',//评论评论-回复评论-评论内容
	  		placeholder:'发表评论',
	  		fromEmpCode:this.$store.state.userInfo.empCode,//当前评论人
	  		fromEmpName:this.$store.state.userInfo.empName,//当前评论人
	  		fromEmpAvatar:'',//评论人头像
	  		toEmpCode:'',//回复目标code
	  		toEmpName:''//回复目标姓名
		}
	},
	methods:{
		closeKeyboard(){
			document.activeElement.blur();
		},
		//刷新详
		detailRefresh(){
	    	this.$refs.loadmore.onTopLoaded();//隐藏loading
	    	
		  	let url1 = this.api.findQuestionDetailURL;
		  	let params1 = {
		  		id: this.$route.params.id,
		  		reportEmpCode: this.fromEmpCode
		  	}
		  	
		  	this.pageIndex=1;
    		this.speakDatas=[];
		  	let url2 = this.api.findCommentsURL;
		  	let params2 = {
				questionId: this.$route.params.id,
				fromEmpCode: this.fromEmpCode,
				currentPage: this.pageIndex,
				pageSize: 20
			}
		  	
	    	axios.all([
			    this.post(url1,params1),
			    this.post(url2,params2)
			]).then(axios.spread((res1, res2) => {
				//详情
			    let data = res1.data;
		  		if(data.success){
		  			this.Qdetail = data.data;
		  			this.praiseFlag = this.Qdetail.praiseFlag==1?true:false;//是否点赞
		  			this.collectFlag = this.Qdetail.collectFlag;//收藏状态 0未收藏 1已收藏
		  			this.$nextTick(function () {
		  				if(this.Qdetail.filePaths!=null&&this.Qdetail.filePaths.length>0){
		  					//预览
		  					viewerInit()
		  				}
		  			})
		  		}else{
		  			Toast({message: data.message,position: 'bottom',duration: 2000});
		  		}
		  		
		  		
			    //评论
			    if(!res2.data.success){
					Toast({message: res2.data.message,position: 'bottom',duration: 2000});
					return
				}
			    let data2 = res2.data.data;
		    	this.speakTotal = data2.total;//评论条数
		    	let pageData = data2.rows?data2.rows:[];//当前页数据
		    	this.speakDatas = this.speakDatas.concat(pageData);
		        if(pageData.length < params2.pageSize ){
					this.allLoaded = true;
				}else{
					this.allLoaded = false;
				}
				this.pageIndex++;
			}));
		},
		//问题详情
		findQuestionDetail(){
			let that = this;
		  	let id = that.$route.params.id;
		  	let url = that.api.findQuestionDetailURL;
		  	that.post(url,{id:id,reportEmpCode:this.fromEmpCode}).then(res=>{
		  		let data = res.data;
		  		if(data.success){
		  			that.Qdetail = data.data;
		  			that.praiseFlag = that.Qdetail.praiseFlag==1?true:false;//是否点赞
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
		},
		scroll(){
			this.scrollType = !this.scrollType;
			if(this.scrollType){
				$('.content-panel')[0].scrollTop = $('.speaklist-panel')[0].offsetTop-150;
			}else{
				$('.content-panel')[0].scrollTop = 0;
			}
		},
		//问题评论列表
		findComment(){
			let that = this;
			this.$refs.loadmore.onBottomLoaded();//隐藏loading
			let params = {
				questionId: this.$route.params.id,
				fromEmpCode: this.fromEmpCode,
				currentPage:this.pageIndex,
				pageSize: 20
			}
			this.loading = true;
			this.post(this.api.findCommentsURL, params).then(res=>{
				this.loading = false;
				if(!res.data.success){
					Toast({message: res.data.message,position: 'bottom',duration: 2000});
					return
				}
		    	let data = res.data.data;
		    	this.speakTotal = data.total;//评论条数
		    	let pageData = data.rows?data.rows:[];//当前页数据
		    	this.speakDatas = this.speakDatas.concat(pageData);
		    	
		        if(pageData.length < params.pageSize ){
					this.allLoaded = true;
				}else{
					this.allLoaded = false;
				}
				this.pageIndex++;
				
			}).catch(err=>{
				this.loading = false;
				this.allLoaded = true;
			})
		},
		//问题点赞-取消点赞
		positionPraise(praiseFlag){
			let params={
				commentId: this.Qdetail.id,
				praiseEmpCode: this.fromEmpCode,
				questionFlag: 1,//0-评论，1-问题
				praiseFlag: praiseFlag?'1':'0'//0-点赞，1-取消点赞
			}
			this.post(this.api.praiseURL, params).then(res=>{
				let data = res.data;
				if(data.success){
					this.praiseFlag = !this.praiseFlag;//切换点赞状态
				}
			}).catch(err=>{
				
			})
		},
		//评论点赞-取消
		speakPraise(commentId,praiseFlag,index,type){
			let params={
				commentId: commentId,
				praiseEmpCode: this.fromEmpCode,
				questionFlag: 0,//0-评论，1-问题
				praiseFlag: praiseFlag//0-点赞，1-取消点赞
			}
			this.post(this.api.praiseURL, params).then(res=>{
				let data = res.data;
				if(data.success){
					
					if(type==1){
						//详情列表点赞评论
						this.speakDatas[index].praiseCount=data.data.count;
						if(praiseFlag){
							this.speakDatas[index].praiseFlag=0;
						}else{
							this.speakDatas[index].praiseFlag=1;
						}
						//弹框点赞评论
						this.mainSpeakData.praiseCount=data.data.count;
						if(praiseFlag){
							this.mainSpeakData.praiseFlag=0;
						}else{
							this.mainSpeakData.praiseFlag=1;
						}
					}
					//回复列表点赞
					if(type==2){
						this.popupSpeakDatas[index].praiseCount=data.data.count;
						if(praiseFlag){
							this.popupSpeakDatas[index].praiseFlag=0;
						}else{
							this.popupSpeakDatas[index].praiseFlag=1;
						}
					}
				}
				
			}).catch(err=>{
				
			})
		},
		//刷新评论回复列表
		popupRefresh(){
			this.popupSpeakDatas = [];
			this.popupPageIndex = 1;
			this.$refs.popupLoadmore.onTopLoaded();//隐藏loading
			this.findCommentDetail();
		},
		//评论回复列表
		findCommentDetail(){
			let that = this;
			this.$refs.popupLoadmore.onBottomLoaded();//隐藏loading
			this.mainSpeakData={};//重置主评论内容
			let params = {
				fromEmpCode:this.fromEmpCode,
				questionId: this.Qdetail.id,
				commentId: this.mainCommentId,
				currentPage:this.popupPageIndex,
				pageSize:20
			}
			this.popupLoading = true;
			this.post(this.api.findCommentDetailURL, params).then(res=>{
				this.popupLoading = false;
				if(!res.data.success){
					Toast({message: res.data.message,position: 'bottom',duration: 2000});
					return
				}
		    	let data = res.data.data;
		    	this.mainSpeakData = data;
		    	let pageData = data.replyList!=null?data.replyList:[];//当前页数据
		    	this.popupSpeakDatas = this.popupSpeakDatas.concat(pageData);
				this.$nextTick(function () {
			        // DOM is now updated
			        if(pageData.length < params.pageSize ){
						this.popupAllLoaded = true;
					}else{
						this.popupAllLoaded = false;
					}
					this.popupPageIndex++;
		      	})
			}).catch(err=>{
				this.popupLoading = false;
				this.popupAllLoaded = true;
			})
		},
		//给问题发表评论
		speak(){
		    let params={
		    	questionId: this.Qdetail.id,
		    	type: 1,
		    	content: this.speakContent.trim(),
		    	fromEmpCode: this.fromEmpCode,
		    	fromEmpName: this.fromEmpName,
		    	fromEmpAvatar: this.fromEmpAvatar
		    }
		    if(this.speakContent.trim()==''){
	  			Toast({message: '请输入评论内容',position: 'bottom',duration: 2000});
				return;
	  		}
		    this.post(this.api.addQuestionCommentURL, params).then(res=>{
		    	//刷新评论列表
		    	if(res.data.success){
		    		this.speakContent = '';
			    	$('.content-panel')[0].scrollTop = $('.speaklist-panel')[0].offsetTop - 150;
			    	Toast({message: '发表成功',position: 'bottom',duration: 2000});
			    	//刷新详情
			    	this.detailRefresh();
		    	}else{
		    		Toast({message: res.data.message,position: 'bottom',duration: 2000});
		    	}
			}).catch(err=>{
				
			})
			
			this.closeKeyboard();//关闭软键盘
		},
		//切换回复评论模式
		changeSpeakType(item,type){
			this.toEmpCode=item.fromEmpCode;//被回复人
			this.toEmpName=item.fromEmpName;
			if(this.toEmpCode==this.fromEmpCode){
				this.speakTospeakType=2;
			}else{
				this.speakTospeakType=3;
				if(type==1){//第一次回复评论
					this.parentCommentId=item.commentId;//回复的当前评论id
				}
				if(type==2){//回复别人的评论
					this.parentCommentId=item.parentCommentId;//回复的当前评论id
				}
			}
		},
		//给评论添加评论
		speakTospeak(){
			let params;
			//评论
			if(this.speakTospeakType==2){
				params={
			    	questionId: this.Qdetail.id,
			    	type: this.speakTospeakType,
			    	content: this.popupSpeakContent.trim(),
			    	parentCommentId: this.mainCommentId,
			    	fromEmpCode: this.fromEmpCode,
			    	fromEmpName: this.fromEmpName,
			    	fromEmpAvatar: this.fromEmpAvatar,
			    }
			}
			//回复
			if(this.speakTospeakType==3){
				params={
			    	questionId: this.Qdetail.id,
			    	type: this.speakTospeakType,
			    	content: this.popupSpeakContent.trim(),
			    	parentCommentId: this.parentCommentId,
			    	fromEmpCode: this.fromEmpCode,
			    	fromEmpName: this.fromEmpName,
			    	fromEmpAvatar: this.fromEmpAvatar,
			    	toEmpCode:this.toEmpCode,
			    	toEmpName:this.toEmpName
			    }
				
			}
			if(this.popupSpeakContent.trim()==''){
	  			Toast({message: '请输入评论内容',position: 'bottom',duration: 2000});
				return;
	  		}
			if(params.fromEmpCode==params.toEmpCode){
				Toast({message: '自己不能回复自己',position: 'bottom',duration: 2000});
				return;
			}
		    this.post(this.api.addQuestionCommentURL, params).then(res=>{
		    	if(res.data.success){
		    		this.popupSpeakContent='';
		    		this.speakTospeakType=2;
			    	Toast({message: '发表成功',position: 'bottom',duration: 2000});
			    	//刷新评论回复列表
			    	this.popupRefresh();
		    	}else{
		    		Toast({message: res.data.message,position: 'bottom',duration: 2000});
		    	}
			}).catch(err=>{
				
			})
			document.activeElement.blur();//关闭软键盘
		},
		collect(type){
			let params = {
				collectEmpCode: this.fromEmpCode,
				questionId: this.Qid,
				collectFlag: type//0未收藏、1已收藏
			}
			this.post(this.api.collectURL, params).then(res=>{
				if(res.data.success){
					this.collectFlag = res.data.data.collectFlag;
					if(this.collectFlag==1){
						Toast({message: '已收藏',position: 'bottom',duration: 2000});
					}else{
						Toast({message: '已取消收藏',position: 'bottom',duration: 2000});
					}
				}
			}).catch(err=>{

			})
		}
	}
}
</script>

<style>
	.detail{position: absolute;width:100%;height: calc(100% - 1px);}
	.top-banner{
		position: fixed;
	    top: 0;
	    z-index: 99;
	    width: 100%;
	}
	.content-panel{
		margin-top: 44px;
		width: 100%;
		height: calc(100% - 96px);
		overflow: auto;
	}
	.detail-panel{
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
		/*position: fixed;
		bottom: 0;*/
		display: flex;
		width: 100%;
		height: 50px;
		line-height: 50px;
		background-color: #fff;
		border-top: 1px solid #f7f6fb;
		/*box-shadow: 0px -4px 4px 0px rgba(217, 217, 217, 0.5);*/
	}
	.task-panel .shensu-panel, .task-panel .pingjia-panel{flex: 1;text-align: center;font-size: 16px;}
	.task-panel .shensu-panel{color: #999;}
	.task-panel .pingjia-panel{color: #f47821;}
	.star i{color: #ec7f0d;}
	.star span{font-size: 14px;color: #333;}
	.comment{font-size: 14px;padding-right: 15px;word-break: break-all;color: #333;}
	
	.speaklist-panel{margin-top:30px;padding: 20px 15px;border-top: 1px solid #e3e3e3;}
	.speaklist-panel ul{list-style: none;}
	.speaklist-panel .cell-pl{position: relative;padding: 20px 0;border-bottom: 1px solid #e3e3e3;}
	.speaklist-panel .cell-pl .user-img{margin-right: 5px;width: 35px;height: 35px;border-radius: 50%;}
	.speaklist-panel .cell-pl .user-name{position: absolute;font-size: 14px;}
	.speaklist-panel .cell-pl .speak-time{position: absolute;top:36px;font-size: 12px;color: #999;}
	.speaklist-panel .cell-pl .speak-zan{float: right;margin-top: 10px;font-size:12px;color: #999;}
	.speaklist-panel .cell-pl .speak-content{font-size: 14px;word-break: break-all;}
	.speaklist-panel .cell-pl .speak-huifu span{font-size: 12px;color: #999;background-color: #e6e6e6;padding: 2px 4px;border-radius: 15px;}
	
	.speaklist-panel .main-pl{border: none;}
	
	.position-pingjia-task{position:fixed;bottom:0;display: flex;align-items: center;padding: 0 15px;}
	.position-pingjia-task .def{position:relative;flex: 1;text-align: center;height: 50px;}
	.position-pingjia-task .def i{font-size: 24px;color: #999;}
	.position-pingjia-task .number span{
		position: absolute;
		top: 5px;
		left: 55%;
	    font-size: 10px;
	    background: #ff0000;
	    display: inline-block;
	    min-width: 16px;
	    height: 16px;
	    line-height: 16px;
	    border-radius: 16px;
	    color: #fff;
	}
	.position-pingjia-task .taskover i{color: #0ec5ec;}
	.position-pingjia-task .pingjia{
		position:relative;width: 200px!important;
		height: 35px;
		border-radius: 35px;
		background-color: #f1f1f1;
	}
	.position-pingjia-task .pingjia i{
	    position: absolute;
	    right: 4px;
	    top: 5px;
	    text-align: center;
	    width: 35px;
	    height: 25px;
	    line-height: 25px;
	    border-radius: 25px;
	    /*border: 1px solid #ddd;*/
	    font-size: 11px;
	    color: #125fdf;
	    background-color: #ffffff;
		box-shadow: 1px 1px 1px 0px rgba(121, 121, 121, 0.45);
	}
	.position-pingjia-task .pingjia textarea{
		display: block;
		margin-bottom: 0;
		padding: 7px 3px;
		width: calc(100% - 40px);
		height: 35px;
		line-height: 20px;
		border-radius: 35px;
		font-size: 12px;
		border: none;
		background-color: #f1f1f1;
		resize:none;
	}
	
	.speak-popup {top: 44px;width: 100%;height: calc(100% - 44px);}
	.speak-popup+.v-modal{top: 44px;height: calc(100% - 44px);}
	.speak-popup .close-btn{margin: 10px 0;}
	.speak-popup .close-btn .classify-title{position: absolute;left: 50%;transform: translateX(-50%);font-size: 14px;}
	.speak-popup .close-btn i{font-size: 18px;color: #666;font-weight: bold;}
	.speak-popup>div:nth-child(1){padding: 0 15px;}
	.popup-list{
		width: 100%;
		height: calc(100% - 92px);
		overflow: auto;
	}
	.popup-list .speaklist-panel {
	    margin: 0;
	    padding: 0;
	    border-top: none;
	}
	.popup-list .speaklist-panel .cell-pl{margin: 0 15px;}
	.speak-popup .position-pingjia-task .pingjia{width: 280px!important;}
	.speak-popup .formEmp, .speak-popup .toEmp{color:#125fdf}
	.speak-popup .speakTospeak{font-size: 12px;color: #333;}
	.speak-popup .atob{color: #999;}
	.speak-popup .contentword{word-break: break-all;}
	
	.data-null{height: 100%;padding: 100px 0 310px 0;text-align: center;background-color: #fff;}
	.data-null *{display: block;margin: 0 auto;color: #999;}
</style>