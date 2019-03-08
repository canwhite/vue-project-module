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
				<div class="zt">反馈主题  <span style="color: #ff0000;">*</span></div>
				<mt-field label="" v-model="params.questionTitle" type="textarea" rows="2" :attr="{ maxlength: 20 }" placeholder="简洁明了的主题可以方便处理人更快受理"></mt-field>
				<span class="length-tips">{{params.questionTitle.length}}/20</span>
			</div>
			<!--contentarea-->
			<div class="content-area">
				<div class="zt">反馈内容  <span style="color: #ff0000;">*</span></div>
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
	import barTop from '../../components/barTop.vue';
	import { Indicator, Toast, MessageBox } from 'mint-ui';
	import common from '@com_base/common/util.js';
	import Viewer from 'viewerjs';
	
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
	    upload.canvas = $('<canvas id="canvas" style="display:none;border:1px solid #c3c3c3;" ></canvas>').appendTo(o);
	    var canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d");
	    upload.frame = $('<div id="imagepanel" style="width:100%;height:100%;"></div>').appendTo(o);  
	    upload.add = $('<div id="add-icon" style="float:left;position:relative;margin:5px 10px;width:60px;height:60px;border:1px solid #d9d9d9;">'
	        + '<div style="position:absolute;width:100%;height:100%;font-size:40px;left:0;top:0;color:#ccc;text-align: center;line-height: 52px;">+</div>'  
	        + '<input id="uploadInput" type="file" accept="image/jpg,image/jpeg,image/png,image/gif" multiple style="width:100%;height:100%;opacity:0;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);">'  
	        + '</div>').appendTo(upload.frame);
	        $('<div style="width: 100%;clear: both;"></div>').appendTo(upload.frame);
	        
        $("#uploadInput").on("click",function(e){
        	$("#uploadInput").val('');
        })
	    $("#uploadInput").on("change", function (e) {
	        var URL = window.URL || window.webkitURL || window.mozURL,files = e.target.files;
     		if(files.length==0)return;
     		
     		//去重,(ios从相册中选的图片名称不固定、使用相机连续拍照的照片文件名会重复)
     		function heavy(checkFiles){
     			var heavyFiles=[];
     			if(common.system()!='android'){
     				heavyFiles = checkFiles;
     			}else{
     				var havesame = false;//是否有重复
	     			for(var i=0;i<checkFiles.length;i++){
	     				let filename = checkFiles[i].name;
	     				
	     				var noIN = true;//是否不存在？
	     				for(var j=0;j<upload.files.length;j++){
	     					if(upload.files[j].name == filename){
	     						noIN = false;
	     						havesame = true;
	     					}
	     				}
	     				if(noIN){
	     					heavyFiles.push(checkFiles[i]);
	     				}
	     			}
	     			if(havesame){
	     				Toast({message:'请勿重复选择图片',position: 'bottom',duration: 3000});
	     			}
     			}
     			return heavyFiles;
     		}
     		
     		//图片转码压缩
     		function imgtask(file){
     			var reader=new FileReader();
        	 	reader.onload=function(){
		            var url=reader.result;
		            let image =new Image();
            		image.onload = function() {
		            	image.height /=4;
        				image.width /=4;
			            canvas.setAttribute("width", image.width + "px");
		            	canvas.setAttribute("height", image.height + "px");
						context.drawImage(image,0,0,image.width,image.height);
						
			            var data=canvas.toDataURL();
			            // canvas.toDataURL 返回的默认格式就是 image/png
			            var type = data.split(',')[0].match(/:(.*?);/)[1];
						var database=data.split(',')[1];
						var data2binary =window.atob(database);//转为2进制
						var ia = new Uint8Array(data2binary.length);
						for (var i = 0; i < data2binary.length; i++) {
						    ia[i] = data2binary.charCodeAt(i);
						};
						/*var blob = new Blob([ia], {type:type});*/
						var newfile = new File([ia], 'filename'+(new Date).getTime()+'.png', {type:'image/png'});
						var src =  window.URL.createObjectURL(newfile);
						
						$('<div class="preview" style="position:relative;float:left;margin:5px;width:20%;height:60px;">'
			            +'<img data-original='+src+' src='+src+' style="width: 100%;height: 100%;">'
			            +'<span class="removeImg" style="position: absolute;right: -5px;top: -5px;display: block;width: 20px;height: 20px;line-height: 18px;text-align: center;background-color: #ff0000;border-radius: 50%;color: #fff;">-</span>'
			            +'</div>').insertBefore(upload.add);
			            upload.srcArr.push(src);
			            
					}
	             	image.src=url;
		        };
		        reader.readAsDataURL(file);
     		}
     		
     		var canUpFiles = heavy(files);
     		
	        for (var i = 0, len = canUpFiles.length; i < len; ++i) {
	            if(upload.fileLength < upload.maxFileLength){
	            	var file =canUpFiles[i];
	            	if(file.size > 5*1024*1024){
	            		
	            		Toast({message:'请选择5M以内的图片',position: 'bottom',duration: 3000});
	            		
	            	}else if( 5*1024*1024 > file.size && file.size > 4*1024*1024){
	            		
	            		imgtask(file);
	            		
	            		upload.files.push(file);
			            upload.fileLength++;
				        
	            	}else{
	            		var src =  window.URL.createObjectURL(file);
	            		//window.URL.revokeObjectURL(src);
	            		$('<div class="preview" style="position:relative;float:left;margin:5px;width:20%;height:60px;">'
			            +'<img data-original='+src+' src='+src+' style="width: 100%;height: 100%;">'
			            +'<span class="removeImg" style="position: absolute;right: -5px;top: -5px;display: block;width: 20px;height: 20px;line-height: 18px;text-align: center;background-color: #ff0000;border-radius: 50%;color: #fff;">-</span>'
			            +'</div>').insertBefore(upload.add);
			            upload.files.push(file);
			            upload.srcArr.push(src);
			            upload.fileLength++;
	            	}
	            }
	        }
	        //达到最大个数，隐藏添加按钮
	        if(upload.fileLength>=upload.maxFileLength){
	        	$("#add-icon")[0].style.display = 'none';
	        }else{
	        	$("#add-icon")[0].style.display = 'block';
	        }
	        
	        //预览
	        viewerInit();
	    });  
	    upload.submit = function (url, params, callback,errback) {
	    	for (var i = 0, len = upload.files.length; i < len; ++i) {
	            var file = upload.files[i];
	            this.formData.append("file", file);
	        }
	    	for(var i in params){
	    		this.formData.append(i, params[i]); 
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
		    var index = $(".preview").index($(this).parent());
		    upload.files.splice(index,1);
		    $(this).parent().remove();
		    upload.fileLength --;
		    $("#add-icon")[0].style.display = 'block';
		    
		    //预览
	        viewerInit();
		    
		})
//	   	$("#imagepanel").on("click",".preview",function(){
//		    var index = $(".preview").index($(this));
//		})
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
	        	that.upd.formData = new FormData();
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
	.report .mint-radiolist{display: flex;}
	.report .mint-radiolist .mint-cell{flex: 1;}
	.report .mint-cell-wrapper{background-image: none;}
	.report .mint-cell:last-child{background-image: none;}
	.report .mint-radio-label{font-size: 14px;}
	.report .mint-radiolist-title{position: absolute;top: 46px;left: 8px;font-size: 14px;color: #333;}
	.report .mint-radio-input:checked + .mint-radio-core{
		background-color: #fff;
    	border-color: #ac73e9;
	}
	.report .mint-radio-input:checked + .mint-radio-core::after{background-color: #ac73e9;}
	
	.radio{height: 90px;background-color: #fff;border-bottom: 1px solid #ccc;}
	.title-area{position:relative;height: 112px;background-color: #fff;border-bottom: 1px solid #ccc;}
	.title-area textarea{border: none;padding-left: 7px;}
	
	.content-area{position:relative;height: 170px;background-color: #fff;border-bottom: 1px solid #ccc;}
	.content-area textarea{border: none;padding-left: 7px;}
	
	.codenumber-area{height: 90px;background-color: #fff;border-bottom: 1px solid #ccc;}
	.codenumber-area input{border: none;padding-left: 7px;}
	
	.submit-btn{height: 65px;padding: 18px 18px 5px 18px;background-color: #fff;}
	.report .mint-button--default{background-color: #a248ff;color: #fff;}
	
	.img-files{height: auto;background-color: #fff;border-bottom: 1px solid #ccc;}
	.content{margin: 0 0 0 15px;position: relative;-webkit-user-select: none;}
	.report .zt{padding: 10px 0 5px 18px;color: #333;font-size: 14px;}
	.report .zt i{margin-right: 5px;}
	.length-tips{position: absolute;right: 15px;bottom: 0;color: #999;font-size: 14px;}
</style>