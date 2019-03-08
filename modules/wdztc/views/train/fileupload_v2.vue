<template>
	<div class="route report">
		<bar-top
	    	:show-return-icon="true"
	    	:show-right-icon="false"
	    	topBarTitle="问题上报">
		</bar-top>

		<div style="height: calc(100% - 44px);overflow: scroll;">
			<!--radio-->
			<div class="radio">
				<div class="zt">反馈类型</div>
				<mt-radio
				  title=""
				  :value.sync="params.questionType"
				  v-model="params.questionType"
				  :options="options">
				</mt-radio>
			</div>
			<!--textarea-->
			<div class="title-area">
				<div class="zt">反馈主题</div>
				<input label="" v-model="params.questionTitle" maxlength="20" placeholder="简洁明了的主题可以方便处理人更快受理"></input>
				<span class="length-tips">{{params.questionTitle.length}}/20</span>
			</div>
			<!--contentarea-->
			<div class="content-area">
				<div class="zt">反馈内容</div>
				<mt-field label="" v-model="params.questionContent" type="textarea" rows="4" :attr="{ maxlength: 500 }" 
					:placeholder="placeholder[params.questionType-1]"></mt-field>
				<span class="length-tips">{{params.questionContent.length}}/500</span>
			</div>
			<!--files-->
			<div class="img-files">
				<div class="zt"><i class="iconfont uct-icon-zhaopian"></i>上传附件（支持图片）</div>
				<div class="content"></div>
				<div class="zt" style="color: #999;">最多可以上传4个5M内的附件</div>
			</div>
			<!--codenumber-->
			<div class="codenumber-area">
				<div class="zt">运单编号</div>
				<mt-field label="" v-model="params.waybillNumber" :attr="{ maxlength: 30 }" placeholder="填写涉及的运单号，方便处理人更快定位问题"></mt-field>
			</div>
			
			<div class="submit-btn">
				<mt-button class="submitBtn" type="default" size="large" @click="submit()">提    交</mt-button>
			</div>
		</div>
		
	</div>
</template>

<script>
	import Viewer  from 'viewerjs';
	import barTop from '../../components/barTop.vue';
	import { Indicator, Toast, MessageBox } from 'mint-ui';
	import common from '@com_base/common/util.js';
	import ystsdk from '@com_base/common/yst-sdk.js';
	
	$.fn.imgUpload = function (maxLen) {
		var viewer;
		function viewerInit(){
			try{
	        	viewer.destroy();
	        }catch(e){
	        	//TODO handle the exception
	        }
        	var pictures = document.querySelector('#imagepanel');
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
	    var o = $(this);  
	    var upload = {};
	    upload.maxFileLength = maxLen?maxLen:10;
	    upload.fileLength=0;
	    upload.files=[];
	    upload.srcArr=[],
	    upload.formData = new FormData();
	    upload.frame = $('<div id="imagepanel" style="width:100%;height:100%;"></div>').appendTo(o); 
	    upload.add = $('<div id="add-icon" style="float:left;position:relative;margin:10px 10px;width:70px;height:70px;border:1px solid #d9d9d9;line-height: 53px;font-size: 40px;color: #ccc;text-align: center;">+</div>')
    		.appendTo(o);
        $("#add-icon").on("click",function(e){
        	Indicator.open({text: '图片处理中...'});
        	//获取相册
        	ystsdk.getPhotos(upload.maxFileLength,function(data){
        		//重置数据及计数器
				$("#imagepanel").children().remove();
				upload.files = [];
				upload.fileLength=0;
				
				let DATA = data;
				let len = DATA.length;
				for(var i=0;i<len;i++){
					let src = DATA[i];
					$('<div class="preview" style="position:relative;float:left;margin:10px 5px;width:20%;height:70px;">'
		            +'<img data-original='+src+' src='+src+' style="width: 100%;height: 100%;">'
		            +'<span class="removeImg" style="position: absolute;right: -5px;top: -10px;display: block;width: 20px;height: 20px;line-height: 18px;text-align: center;background-color: #ff0000;border-radius: 50%;color: #fff;">-</span>'
		            +'</div>').appendTo(upload.frame);
		            /*var type = src.split(',')[0].match(/:(.*?);/)[1];
					var database=src.split(',')[1];
					var data2binary =window.atob(database);//转为2进制
					var ia = new Uint8Array(data2binary.length);
					for (var k = 0; k < data2binary.length; k++) {
					    ia[k] = data2binary.charCodeAt(k);
					};
					var newfile = new File([ia], 'filename'+(new Date).getTime()+'.'+type.split('/')[1], {type:type});*/
					upload.files.push(src);
		            upload.srcArr.push(src);
		            upload.fileLength++;
				}
				//达到最大个数，隐藏添加按钮
		        if(upload.fileLength>=upload.maxFileLength){
		        	$("#add-icon")[0].style.display = 'none';
		        }else{
		        	$("#add-icon")[0].style.display = 'block';
		        }
		        //预览
		        viewerInit();
		        
		        Indicator.close();
        	},function(){
        		Indicator.close();
        	})
        })
	    upload.submit = function (url, params, callback,errback) {
	    	for (var j = 0, len = upload.files.length; j < len; j++) {
	            var file = JSON.stringify(upload.files[j].replace(',','@|@'));
	            this.formData.append("fileBase64", file);
	        }
	    	for(var k in params){
	    		this.formData.append(k, params[k]); 
	    	}
	        $.ajax({
	            url: url,  
	            method: 'POST',  
	            data: this.formData,  
	            contentType: false,  
	            processData: false,  
	            cache: false,
	            success: function (re) {  
	                callback && callback(re); 
	            },  
	            error: function (ex) {
	                errback && errback(ex);
	            }  
	        });
	    };
	    
	    $("#imagepanel").on("click",".removeImg",function(event){
	    	event.stopPropagation();
	    	upload.fileLength --;
		    var index = $(".preview").index($(this).parent());
		    upload.files.splice(index,1);
		    $(this).parent().remove();
		    $("#add-icon")[0].style.display = 'block';
		    //预览
	        viewerInit();
	        //通知原生删除照片
		    ystsdk.delPhoto(index);
		})
	    return upload;  
	};
	
	
	export default {
	  components: {
	    'bar-top': barTop,
	  },
	  computed: {
	  	
	  },
	  mounted(){
	  	let that = this;
	  	this.upd = $('.content').imgUpload(4);
	  },
	  beforeDestroy(){
	  	try{
        	viewer.destroy();
        }catch(e){
        	//TODO handle the exception
        }
        //通知原生清除已选择的照片
    	ystsdk.cleanPhotos();
	  },
	  data() {
	  	return {
	  		upd:{},
	  		options:[
			  {
			    label: "咨询",
			    value: '1',
			    disabled: false
			  },
			  {
			    label: '建议',
			    value: '2'
			  },
			  {
			    label: '举报',
			    value: '3'
			  }
			],
			placeholder:[
				"针对网点日常经营、公司制度文件或他人经验积累等方面进行咨询，问您想问",
				"就企业发展、网点经营、产品营销、技术创新、降低成本、提高效益等方面都可以提出合理化建议",
				"受理违反公司廉洁纪律、工作纪律等行为的检举。并对您的行为进行保密，信息不公开"
			],
			params:{
				currentUserCode:this.$store.state.userInfo.empCode,
				questionType:'1',
		  		questionTitle:'',
		  		questionContent:'',
		  		waybillNumber:''
			}
	  	}
	  },
	  methods:{
	  	submit(){
	  		let that = this;
	  		if(!navigator.onLine){
				Toast({message:'网络不给力，请检查网络',position: 'bottom',duration: 2000});
				return;
			}
	  		if(common.emojiReg.test(that.params.questionTitle)||common.emojiReg.test(that.params.questionContent)){
	  			Toast({message: '暂不支持表情符号',position: 'bottom',duration: 2000});
	  			that.params.questionTitle = that.params.questionTitle.replace(common.emojiReg,"").trim();
	  			that.params.questionContent = that.params.questionContent.replace(common.emojiReg,"").trim();
	  			return;
	  		};
	  		if(that.params.questionTitle.trim()==''){
	  			Toast({message: '请输入反馈主题',position: 'bottom',duration: 2000});
				return;
	  		}
	  		if(that.params.questionContent.trim()==''){
	  			Toast({message: '请输入反馈内容',position: 'bottom',duration: 2000});
				return;
	  		}
	  		if(that.params.questionType==3){
	  			if(that.upd.fileLength==0){
	  				Toast({message: '请上传证据以佐证举报',position: 'bottom',duration: 2000});
	  				return;
	  			}
	  			if(that.upd.fileLength>4){
	  				Toast({message: '最多上传4张图片',position: 'bottom',duration: 2000});
	  				return;
	  			}
	  		}
  			let zz = /^[A-Za-z0-9]{1,30}$/;
			if(that.params.waybillNumber.trim()!='' && !zz.test(that.params.waybillNumber)){
				Toast({message: '运单编号格式不正确',position: 'bottom',duration: 2000});
  				return;
	  		}
	  		
	  		Indicator.open({text: '提交中...',spinnerType: 'fading-circle'});
	  		
	  		let params = that.params;
	        that.upd.submit(that.api.reportQuestionURL+that.$store.state.urlParams, params,function (res) {
				Indicator.close();
				if(res.success){
					Toast({message: '提交成功',position: 'bottom',duration: 2000});
	            	that.$router.push('/history');
	            	that.$destroy();
	            }else{
	            	if(res.code=='101' || res.code=='102'){
	            		MessageBox.alert(res.message).then(action => {
							//返回主页
				    		window.location.href = "js://uct?method=closeWebview";
						})
	            	}else{
	            		Toast({message: res.message,position: 'bottom',duration: 2000});
	            	}
	            }
	            that.upd.formData = new FormData();
	        },function(){
	        	Indicator.close();
	        	Toast({message: '提交失败',position: 'bottom',duration: 2000});
	        });
	  	}
	  },
	  watch: {
	  }
	}
</script>

<style>
	.report{position:absolute;width:100%;height:100%;background-color: #fff;}
	.report .mint-field-core{font-size: 14px;}
	.mint-radiolist{display: flex;}
	.mint-radiolist .mint-cell{flex: 1;}
	.mint-cell-wrapper{background-image: none;}
	.mint-cell:last-child{background-image: none;}
	.mint-radio-label{font-size: 14px;}
	.mint-radiolist-title{position: absolute;top: 46px;left: 8px;font-size: 14px;color: #333;}
	.mint-radio-input:checked + .mint-radio-core{
		background-color: #fff;
    	border-color: #ac73e9;
	}
	.mint-radio-input:checked + .mint-radio-core::after{background-color: #ac73e9;}
	.mint-checkbox-input:checked+.mint-checkbox-core {
	    background-color: #a248ff;
	    border-color: #a248ff;
	}
	
	.radio{height: 90px;background-color: #fff;border-bottom: 1px solid #ccc;}
	.title-area{position:relative;height: 112px;background-color: #fff;border-bottom: 1px solid #ccc;}
	.title-area input{width: 100%;border: none;padding-left: 18px;font-size:14px;}
	
	.content-area{position:relative;height: 170px;background-color: #fff;border-bottom: 1px solid #ccc;}
	.content-area textarea{border: none;padding-left: 7px;}
	
	.codenumber-area{height: 90px;background-color: #fff;border-bottom: 1px solid #ccc;}
	.codenumber-area input{border: none;padding-left: 7px;}
	
	.submit-btn{height: 65px;padding: 18px 18px 5px 18px;background-color: #fff;}
	.mint-button--default{background-color: #a248ff;color: #fff;}
	
	.img-files{height: auto;background-color: #fff;border-bottom: 1px solid #ccc;}
	.content{margin: 0 0 0 15px;position: relative;-webkit-user-select: none;}
	.report .zt{padding: 10px 0 5px 18px;color: #333;font-size: 14px;}
	.report .zt i{margin-right: 5px;}
	.length-tips{position: absolute;right: 15px;bottom: 0;color: #999;font-size: 14px;}
</style>