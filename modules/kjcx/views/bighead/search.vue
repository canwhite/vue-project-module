<template>
	<div class="bighead">
		<bar-top
    	:show-return-icon="true"
    	:show-right-icon="false"
    	:styles="styles"
    	topBarTitle="大头笔/目的站点查询">
		</bar-top>
		
		<div style="padding-top: 60px;margin-bottom: 27px;">
			<form autocomplete="off" @submit.prevent="searchData()">
				<mt-field type="search" label="运  单  号" placeholder="只能输入字母和数字" v-model="billCode" :attr="{ maxlength: 20 }">
					<div @click="QRScan()" class="nav-icon"><i class="iconfont uct-icon-saomiao"></i></div>
				</mt-field>
			</form>
			<div @click="showChoiceAddress">
				<mt-field label="目的区域" placeholder="省市区选择" v-model="myArea" :readonly="true" :disableClear="true">
					<div class="nav-icon" style="transform: rotate(180deg);"><i class="iconfont uct-icon-fanhui" style="font-size: 14px;"></i></div>
				</mt-field>
			</div>
			<mt-field label="目的地址" placeholder="请输入全部地址" v-model="address"></mt-field>
		</div>
		
		<div>
			<div class="big-result">查询结果</div>
			<div class="result-item" @click="link2dtl(item.baseOrgCode, item.cmsOrgId);" v-for="(item, index) in dtbmdzInfo">
				<div class="item-banner"><span>大头笔</span><span>{{item.desinationCity}}</span></div>
				<div class="item-info">
					<p><span class="size-13 color-9">目的站点信息</span>
						<span class="size-15 color-off" v-show="item.status==1021">审核</span>
						<span class="size-15 color-on" v-show="item.status==9901">正常</span>
						<span class="size-15 color-off" v-show="item.status==9902">暂停</span>
						<span class="size-15 color-off" v-show="item.status==9903">停用</span>
					</p>
					<p><span class="size-15">{{item.orgName}}</span><span class="size-13 color-9">{{item.areaType}}</span></p>
					<p><span>网点编号：{{item.orgCode}}</span><span class="size-15 color-9">...</span></p>
				</div>
			</div>
		</div>
		
		<div class="submit-btn">
			<mt-button class="submitBtn" type="default" size="large" :disabled="disabled" @click="searchData()">查  询</mt-button>
		</div>
		
		<!--地址选择器-->
		<mt-popup v-model="popupVisible" position="bottom" style="width: 100%;height: 220px;">
			<div class="set-btn">
				<span @click="popupVisible=false">取消</span>
				<span class="color-yes pull-right" @click="popupVisible=false;setAddress()">确定</span>
			</div>

			<div style="display: flex;height: 180px;">
				<div style="flex: 1;height: 180px;overflow: hidden;">
					<mt-picker :slots="provinceSlots" ref="provincepicker" value-key="areaName" @change="provinceChange"></mt-picker>
				</div>
				<div style="flex: 1;height: 180px;overflow: hidden;">
					<mt-picker :slots="citySlots" ref="citypicker" value-key="areaName" @change="cityChange"></mt-picker>
				</div>
				<div style="flex: 1;height: 180px;overflow: hidden;">
					<mt-picker :slots="countySlots" ref="countypicker" value-key="areaName" @change="countyChange"></mt-picker>
				</div>
			</div>
		</mt-popup>
		
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
	  	data() {
		  	return {
		  		styles:{'background-color':'#a248ff','color':'#fff'},
		  		billCode: '',
		  		key2: '',
		  		key3: '',
		  		localHistory:[],
		  		useLocalIndex:30,
		  		disabled:false,
		  		popupVisible:false,
		  		provinceOptions:[],
		        provinceSlots:[{
		            flex: 1,
		            defaultIndex: 0,    
		            values: [],  //省份数组
		            className: 'slot1',
		            textAlign: 'center'
	          	}],
	          	cityOptions:[],
	          	citySlots:[{
		            flex: 1,
		            defaultIndex: 0,    
		            values: [],  //市数组
		            className: 'slot1',
		            textAlign: 'center'
	          	}],
	          	countyOptions:[],
	          	countySlots:[{
		            flex: 1,
		            defaultIndex: 0,    
		            values: [],  //区/县数组
		            className: 'slot1',
		            textAlign: 'center'
	          	}],
		        myProvince:'',//省
	        	myCity:'',//市
	        	myCounty:'',//区/县
	        	myArea:'',//省-市-区
	        	address:'',//地址,
	        	dtbmdzInfo:[]
		  	}
 	 	},
	  	created(){
	  		
	  	},
	  	mounted(){
		  	ystsdk.setStatusBarColor('a248ff',1);
	  	},
	  	activated(){
	  		
	  	},
	  	beforeRouteEnter(to,from,next){
	  		let sessionData =sessionStorage.sessionData?JSON.parse(sessionStorage.sessionData):{};
	  		next((vm)=>{
	  			if(from.path.indexOf('detail_bighead')!=-1){
	  				vm.setLocalData(sessionData)
	  			}
	  		})
  	  	},
  	  	beforeRouteLeave(to,from,next){
  	  		
  	  		var sessions = {
  				billCode: this.billCode?this.billCode:'',
  				myArea: this.myArea?this.myArea:'',
  				address: this.address?this.address:''
  			}
  			sessionStorage.setItem('sessionData',JSON.stringify(sessions));
  	  		next();
 	 	},
	  	beforeDestroy(){
	  		
	  	},
	  	methods:{
	  		QRScan(){
				let that = this;
				ystsdk.QRScan(function(data){
					that.billCode = data;
				})
			},
			link2dtl(baseOrgId,cmsOrgId){
				this.$router.push('/detail_bighead/'+baseOrgId+'/'+cmsOrgId)
			},
			getSSQ(type,code){
				let that = this;
				let url = that.api.findProvincesURL;
	  			let params = {'areaType':type,'areaCode':code};
	  			
	  			that.post(url,params,false).then(res=>{
	  				let data= [];
	  				if(res.data.success){
	  					data = res.data.data;
	  				}else{
	  					data = []
	  				}
	  				
	  				if(type==2){//设置省
	  					that.provinceOptions = data;
	  					that.$refs.provincepicker.setSlotValues(0, data);//设定给定 slot 的备选值数组
	  				};
	  				if(type==3){//设置市
	  					that.cityOptions = data;
	  					that.$refs.citypicker.setSlotValues(0, data);//设定给定 slot 的备选值数组
	  				};
	  				if(type==4){//设置区县
	  					that.countyOptions = data;
	  					that.$refs.countypicker.setSlotValues(0, data);//设定给定 slot 的备选值数组
	  				};
				}).catch(err=>{
					
				})
			},
			provinceChange(picker, values){
				let that = this;
				if(values[0]){
					that.getSSQ(3,values[0].areaCode);
				}
			},
			cityChange(picker, values){
				let that = this;
				if(values[0]){
					that.getSSQ(4,values[0].areaCode);
				}
			},
			countyChange(picker, values){
				
			},
			showChoiceAddress(){
				let that = this;
				document.activeElement.blur();
				
				that.getSSQ(2);//初始化省市区
				setTimeout(function(){that.popupVisible=true},500);
			},
			setAddress(){
				this.myProvince = this.$refs.provincepicker.values[0]?this.$refs.provincepicker.values[0].areaName:'';
				this.myCity = this.$refs.citypicker.values[0]?this.$refs.citypicker.values[0].areaName:'';
				this.myCounty = this.$refs.countypicker.values[0]?this.$refs.countypicker.values[0].areaName:'';
				
				this.myArea = this.myProvince+"-"+this.myCity+"-"+this.myCounty;
			},
			searchData(){
				document.activeElement.blur();
				
				let that = this;
				
				that.billCode = that.billCode.trim();
		  		if(that.billCode ==''&&that.myArea==''&&that.address==''){
		  			Toast({message: '运单号和地址不能同时为空',position: 'center',duration: 2000});
		  			return;
		  		}
		  		let zz = /^[A-Za-z0-9]{8,20}$/;
				if(that.billCode!=''&&!zz.test(that.billCode)){
					Toast({message: '请输入正确的运单号',position: 'center',duration: 2000});
	  				return;
		  		}
				
	  			that.disabled =true;
	  			let url = that.api.findMarkerForGisURL;
	  			let params = {
	  				billCode:that.billCode,
	  				province:that.myProvince,
	  				city:that.myCity,
	  				county:that.myCounty,
	  				address:that.address,
	  				street:''
	  			}
	  			that.post(url,params).then(res=>{
	  				if(res.data.success){
	  					that.dtbmdzInfo = res.data.data;
	  				}else{
	  					that.dtbmdzInfo =[];
	  					Toast({message: res.data.message?res.data.message:'未找到目的网点',position: 'center',duration: 2000});
	  				}
					that.disabled =false;
				}).catch(err=>{
					that.dtbmdzInfo =[];
					that.disabled =false;
				})
				
				return false;
			},
			setLocalData(data){
				this.billCode = data.billCode;
	  			this.myArea = data.myArea;
	  			this.address = data.address;
	  			
	  			this.myProvince = data.myArea?data.myArea.split('-')[0]:'';
	  			this.myCity = data.myArea?data.myArea.split('-')[1]:'';
	  			this.myCounty = data.myArea?data.myArea.split('-')[2]:'';
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
	.bighead{
		position: absolute;
		height: 100%;
		width: 100%;
		/*padding-bottom: 60px;*/
		background-color: #f5f5f5;
		-moz-user-select:none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
	
	.nav-icon{
	 	outline:none;
	 	margin-left: 5px;
		height: 44px;
		border-radius: 0;
		border: none;
		box-shadow: none;
		color: #000;
		text-align: center;
    	line-height: 44px;
    	font-size: 18px;
    	font-weight: bold!important;
	}
	.nav-icon i{font-size: 20px;}
	
	.big-result{font-size: 13px;padding-left:16px;padding-bottom: 9px;color: #999;}
	.result-item{padding-bottom:15px;background-color: #fff;font-size: 13px;color: #333;}
	.item-banner{height: 44px;padding: 0 15px;line-height: 44px;}
	.item-banner span:last-child{float:right;font-size: 15px;color: #a248ff;}
	.item-info{margin:0 15px;padding:15px 10px 10px 10px;border: solid 1px #ccc;}
	.item-info p{display: flex;color: #333;font-size: 13px;word-break: break-all;}
	.item-info p:nth-child(2){padding: 15px 0 10px 0;}
	.item-info p span:first-child{flex: 1;}
	.item-info p span:last-child{width: 60px;text-align: right;}
	.size-15{font-size: 15px;}
	.size-13{font-size: 13px;}
	.color-3{color: #333;}
	.color-9{color: #999;}
	.color-on{color: #a248ff;}
	.color-off{color: #FF0000;}
	.color-yes{color: #32C8FF;}
	
	
	.submit-btn{position:fixed;bottom:0;padding-bottom: 15px;width: 100%;}
	
	.set-btn{
	    height: 40px;
	    background-color: rgb(255, 255, 255);
	    line-height: 40px;
	    padding: 0 15px;
	    border-bottom: 1px solid #f5f5f5;
	}
	
	.bighead .mint-button--default{width:90%;margin:0 auto;background-color: #a248ff;color: #fff;}
	.bighead .mint-field .mint-cell-wrapper{background-position: 0 100%!important;font-size: 14px;}
	.bighead .mint-field .mint-cell-title{width: 80px;}
	
</style>