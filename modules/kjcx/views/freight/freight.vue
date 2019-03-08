<template>
	<div class="layout freight">
		<bar-top
    	:show-return-icon="true"
    	:show-right-icon="false"
    	topBarTitle="公布价查询"
    	:styles="styles">
		</bar-top>
		
		<div class="lay-main">
			<div class="address">
				<div class="address-btn" @click="provenance()">
					<div><i class="iconfont uct-icon-chaxunqishi" style="color: #b076e9;"></i></div>
					<mt-field label="始发地" placeholder="请选择发货城市" v-model="startArea" :readonly="true" :disableClear="true">
						<div class="nav-icon" style="transform: rotate(180deg);"><i class="iconfont uct-icon-fanhui" style="font-size: 14px;color: #ccc;"></i></div>
					</mt-field>
				</div>
				<div class="address-btn" @click="destination()">
					<div><i class="iconfont uct-icon-chaxunzhongdian" style="color: #b076e9;"></i></div>
					<mt-field label="目的地" placeholder="请选择收货城市" v-model="endArea" :readonly="true" :disableClear="true">
						<div class="nav-icon" style="transform: rotate(180deg);"><i class="iconfont uct-icon-fanhui" style="font-size: 14px;color: #ccc;"></i></div>
					</mt-field>
				</div>
			</div>
			
			<div class="bill-info">
				<div class="bill-title">快件信息</div>
				<div class="bill-content">
					<div>
						<p><span>快件重量</span><span>(0.1-9999公斤)</span></p>
						<div><input type="number" v-model="weight" @blur="validNumber('weight',6,'0.1-9999',$event)" class="weight" /></div>
					</div>
					<div>
						<p><span>快件体积</span><span>(1-999厘米)</span></p>
						<div class="volumes">
							<input type="number" v-model="length" @blur="validNumber('length',5,'1-999',$event)" class="volume" /><i class="split-xin">*</i>
							<input type="number" v-model="width" @blur="validNumber('width',5,'1-999',$event)" class="volume" /><i class="split-xin">*</i>
							<input type="number" v-model="height" @blur="validNumber('height',5,'1-999',$event)" class="volume" />
						</div>
					</div>
				</div>
			</div>
			
			<div v-if="resultVisible">
				<div class="freight-result">
					<div class="result-title">查询结果</div>
					<div class="result-cell">
						<span>计费重量</span><span>{{result.chargedWeight}} 公斤</span>
					</div>
					<div class="result-cell">
						<span>预计运费金额</span><span>{{result.carriage}} 元</span>
					</div>
					<div class="result-cell">
						<span>预计运输时效</span><span>{{result.day}} 天</span>
					</div>
				</div>
				<div class="freight-tips">
					<p>备注：</p>
					<p v-for="item in result.remarkList">{{item}}</p>
				</div>
			</div>
		</div>
		
		<div class="submit-btn">
			<mt-button class="submitBtn" type="default" size="large" :disabled="disabled" @click="searchData()">查  询</mt-button>
		</div>
		
		<!--地址选择器-->
		<check-address v-if="addressData.length>0" level='2' :popupVisible="popupVisible1" :hotCity="hotCity" :addressData="addressData" @changePopup=startAddress></check-address>
		
		<check-address v-if="addressData.length>0" level='2' :popupVisible="popupVisible2" :hotCity="hotCity" :addressData="addressData" @changePopup=endAddress></check-address>
		
	</div>
</template>

<script>
	import barTop from '@com_base/components/barTop.vue';
	import addressPopup from '@com_base/components/address.vue';
	import { Indicator, Toast } from 'mint-ui';
	
	import ystsdk from '@com_base/common/yst-sdk.js';
	import common from '@com_base/common/util.js';
	const pako = new common.pako();


	export default {
	  	components: {
	    	'bar-top': barTop,
	    	'check-address': addressPopup
	  	},
	  	computed: {
	  	},
	  	created(){
			this.address();
	  	},
	  	mounted(){
	  		ystsdk.setStatusBarColor('a248ff',1);
	  		
 	 	},
 	 	activated(){
 	 		ystsdk.setStatusBarColor('a248ff',1);
 	 	},
 	 	data() {
	  		return {
	  			styles:{'position': 'relative','background-color': '#a248ff','color': '#fff'},
	  			startArea:'',
	  			startAreaCode:'',
	  			endArea:'',
	  			endAreaCode:'',
	  			weight:'',
	  			length:'',
	  			width:'',
	  			height:'',
	  			disabled:false,
	  			name:"",
	  			popupVisible1:false,
	  			popupVisible2:false,
	  			hotCity:[],
	  			addressData:[],
	  			result:{},
	  			resultVisible:false
	  		}
	  	},
	  	methods:{
	  		provenance(){
	  			this.popupVisible1 = true;
	  		},
	  		destination(){
	  			this.popupVisible2 = true;
	  		},
	  		startAddress(data){
  				this.startArea = data.areaNames;
  				this.startAreaCode = data.areaCodes;
	  		},
	  		endAddress(data){
	  			this.endArea = data.areaNames;
  				this.endAreaCode = data.areaCodes;
	  		},
	  		validNumber(obj,len,minMax,event){
	  			let min = parseFloat(minMax.split('-')[0]);
	  			let max = parseFloat(minMax.split('-')[1]);
	  			let VALUE = event.target.value;
	  			VALUE = VALUE.trim().replace(/[^0-9\.]/ig,"");
	  			//VALUE = VALUE.replace(/\b(0+)/gi,"")
	  			if(isNaN(VALUE)){VALUE=VALUE.replace(/[^0-9]/ig,"")};

	  			if(!VALUE){
	  				Toast({message: '请输入数字',position: 'middle',duration: 2000});
	  				event.target.value = VALUE;
	  				this[obj] = VALUE;
	  				return false;
	  			};
	  			
	  			if(VALUE.toString().split('.')[1]&&VALUE.toString().split('.')[1].length>1){
	  				VALUE = VALUE.split('.')[0]+'.'+VALUE.split('.')[1].slice(0,1)
	  			}
	  			VALUE= parseFloat(VALUE);
	  			if(VALUE>=0&&VALUE<min)VALUE=min;
	  			if(VALUE>=0&&VALUE>max)VALUE=max;
	  			if(VALUE.toString().length>len)VALUE=VALUE.slice(0,len);
	  			
	  			event.target.value = VALUE;
	  			this[obj] = VALUE;
	  			return true;
	  		},
	  		searchData(){
				let that = this;
				
				if(!this.startArea){
					Toast({message: '请选择始发地城市',position: 'middle',duration: 2000});
					return;
				}
				if(!this.endArea){
					Toast({message: '请选择目的地城市',position: 'middle',duration: 2000});
					return;
				}
				if(!this.weight && (!this.length&&!this.width&&!this.height) ){
					Toast({message: '请填写快件信息',position: 'middle',duration: 2000});
					return;
				}
				if(!this.weight && (!this.length||!this.width||!this.height) ){
					Toast({message: '长、宽、高必须填写完整',position: 'middle',duration: 2000});
					return;
				}
				
				
	  			this.disabled =true;
	  			let url = this.api.findCarriageURL;
	  			let params = {
	  				sendCityCode: this.startAreaCode,
	  				sendCityName: this.startArea,
	  				recCityCode: this.endAreaCode,
	  				recCityName: this.endArea,
	  				weight: this.weight,
	  				length: this.length,
	  				width: this.width,
	  				height: this.height
	  			}
	  			this.post(url,params).then(res=>{
	  				if(res.data.success){
	  					this.result = res.data.data;
	  					this.resultVisible = true;
	  				}else{
	  					this.result ={};
	  					this.resultVisible = false;
	  					Toast({message: res.data.message,position: 'middle',duration: 2000});
	  				}
					this.disabled =false;
				}).catch(err=>{
					this.disabled =false;
					this.resultVisible = false;
				})
				
				return false;
			},
			address(){
				let that = this;
				let url = that.api.findProvincesInfoURL;
				that.post(url,{}).then(res=>{
					var data = pako.unzip(res.data.data);
					
  					if(res.data.success){
  						that.addressData = JSON.parse(data);
  						that.hotCity = res.data.hotCity;
	  				}
				}).catch(err=>{
					
				})
			}
	  	},
	 	watch: {
	 		popupVisible1:function(newval,oldval){
	 			var that = this;
	 			if(newval){
 					//拦截安卓回退按钮
					history.pushState(null, null, location.href);//添加一条历史记录
					window.addEventListener('popstate', function(event) {
					    //history.pushState(null, null, location.href );//永远无法回退
					    //此处加入回退时你要执行的代码
					    that.popupVisible1 = false;//关闭弹窗
					});
	 			}
	 		},
	 		popupVisible2:function(newval,oldval){
	 			var that = this;
	 			if(newval){
 					//拦截安卓回退按钮
					history.pushState(null, null, location.href);//添加一条历史记录
					window.addEventListener('popstate', function(event) {
					    //history.pushState(null, null, location.href );//永远无法回退
					    //此处加入回退时你要执行的代码
					    that.popupVisible2 = false;//关闭弹窗
					});
	 			}
	 		}
	  	}
	}
</script>

<style>
	.layout{
		position: absolute;
		height: 100%;
		width: 100%;
		background-color: #f5f5f5;
		-moz-user-select:none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
	.lay-main{width:100%;height: calc(100% - 101px);overflow-y: scroll;}
	
	.address{margin-top: 5px;margin-bottom: 15px;background-color: #fff;}
	.address-btn{
		display: flex;
		flex-direction: row;
		background-color: #fff;
		margin-left: 15px;
	}
	.address .address-btn:first-child{border-bottom:  1px solid #f5f5f5;}
	.address-btn>div:first-child{line-height: 48px;}
	.address-btn>a{flex: 1;}
	
	.bill-info{
		margin-bottom: 15px;
		padding: 0 10px 0 15px;
		background-color: #fff;
	}
	.bill-title{height: 34px;line-height: 34px;font-size: 12px;color: #333;border-bottom: 1px solid #f5f5f5;}
	.bill-content{display: flex;flex-direction: row;padding: 10px 0;}
	.bill-content>div{flex: 1;}
	.bill-content>div:first-child{flex: 2;padding-right: 10px;border-right: 1px solid #ccc;}
	.bill-content>div:last-child{flex: 3;padding-left: 10px;}
	.bill-content p{font-size: 12px;white-space: nowrap;}
	.bill-content p span:first-child{color: #a248ff;}
	.bill-content p span:last-child{color: #999;}
	.weight, .volume{
		border-width: 0 0 1px 0;
		border-radius: 0;
		border-color: #666;
		font-size: 14px;
		padding-top: 16px;
		text-align: center;
	}
	.weight{width: 100%;}
	.volume{width: 40px;}
	.volumes{display: flex;}
	.volumes .volume{flex: 1;}
	.volumes .split-xin{line-height: 5px;margin-top: 20px;}
	
	.freight-result{margin-bottom: 15px;padding: 10px 15px;background-color: #fff;}
	.freight-result .result-title{padding-bottom: 12px;font-size: 12px;color: #333;}
	.result-cell{padding: 6px 0;font-size: 14px;}	
	.result-cell span:first-child{color: #999;}
	.result-cell span:last-child{color: #a248ff;float: right;}
	.freight-tips{margin-bottom:10px;padding:0 15px;font-size: 12px;color: #999;word-break: break-all;}
	
	.submit-btn{padding-bottom: 15px;width: 100%;background-color: #f5f5f5;}
	
	
	.mint-button--default {width: 90%;margin: 0 auto;background-color: #a248ff;color: #fff;}
	.freight .mint-cell:last-child{background-image: none;}
	.freight .mint-cell-wrapper{background-image: none;font-size: 14px;}
	.freight .mint-field-core{text-align: right;padding-right: 10px;}
</style>