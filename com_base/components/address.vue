<template>
	<div>
		<mt-popup v-model="popupVisible" position="bottom" style="width: 100%;height: 100%;">
			
			<header class="bar bar-nav bar-easy-vue" :style="styles">
			    <!--<a class="icon iconfont uct-icon-fanhui pull-left" @click="task()"></a>-->
			    <a class="icon pull-right" @click="task()" style="line-height: 24px;font-size: 13px;">取消</a>
			    <h1 class="title">地址选择</h1>
	 	 	</header>
	 	 	
	 	 	<div class="hot-city">
	 	 		<p class="hot-title">热门城市</p>
	 	 		<div v-for="item in hotCity" @click="hotChoice(item)" :class="{'oncheck-li':item.areaCode==city_checked.areaCode}">{{item.areaName}}</div>
	 	 	</div>
	 	 	
	 	 	
	 	 	<div class="checked-bar">
	 	 		<div :class="{'oncheck-bar':active==1}" @click="active=1">{{province_checked.areaName?province_checked.areaName:'请选择'}}</div>
	 	 		<div :class="{'oncheck-bar':active==2}" @click="active=2" v-show="province_checked.areaName&&LEVEL>1">{{city_checked.areaName?city_checked.areaName:'请选择'}}</div>
	 	 		<div :class="{'oncheck-bar':active==3}" @click="active=3" v-show="city_checked.areaName&&LEVEL>2">{{county_checked.areaName?county_checked.areaName:'请选择'}}</div>
	 	 	</div>
	 	 	<div class="address-list" v-if="active==1">
	 	 		<li :class="{'oncheck-li':item.areaCode==province_checked.areaCode}" v-for="item in provinces" @click="active==LEVEL?active=active:active=2;citys=item.cityList;choiceProvince(item)">{{item.areaName}}</li>
	 	 	</div>
	 	 	<div class="address-list" v-if="active==2&&LEVEL>1">
	 	 		<li :class="{'oncheck-li':item.areaCode==city_checked.areaCode}" v-for="item in citys" @click="active==LEVEL?active=active:active=3;countys=item.areaList;choiceCity(item)">{{item.areaName}}</li>
	 	 	</div>
	 	 	<div class="address-list" v-if="active==3&&LEVEL>2">
	 	 		<li :class="{'oncheck-li':item.areaCode==county_checked.areaCode}" v-for="item in countys" @click="choiceCounty(item)">{{item.areaName}}</li>
	 	 		<li :class="{'oncheck-li':county_checked.areaCode==''}"@click="choiceCounty({})">暂不选择</li>
	 	 	</div>
	 	 	
		</mt-popup>
	</div>
</template>
	
<script>
	
	export default {
	  props: {
	  	refs:{
    		default: 'address'
    	},
	    popupVisible: false,
	    level: {
	    	type: String,
	    	default:'3'
	    },
	    hotCity:{
	    	type: Array,
	    	default:()=>{
	    		return []
	    	}
	    },
	    addressData:{
	    	type: Array,
	    	default:()=>{
	    		return []
	    	}
	    }
	  },
	  computed: {
	  	
	  },
	  mounted(){
	  	
 	  },
	  data() {
		return {
			styles:{'position': 'relative','background-color': '#a248ff','color': '#fff'},
			LEVEL: parseInt(this.level),
			active:1,
			provinces: this.addressData,
			citys:[],
			countys:[],
			province_checked:{},
			city_checked:{},
			county_checked:{}
		}  		
	  },
	  methods:{
	  	choiceProvince(province){
	  		this.province_checked ={
	  			"areaCode":province.areaCode,
	  			"areaName":province.areaName
	  		},
	  		this.city_checked={};
	  		this.county_checked={}
	  		
	  		if(this.LEVEL == 1){
	  			this.task();
	  		}
	  	},
	  	choiceCity(city){
	  		this.city_checked ={
	  			"areaCode":city.areaCode,
	  			"areaName":city.areaName
	  		}
	  		this.county_checked={};
	  		
	  		if(this.LEVEL == 2){
	  			this.task();
	  		}
	  	},
	  	choiceCounty(county){
	  		this.county_checked ={
	  			"areaCode":county.areaCode?county.areaCode:'',
	  			"areaName":county.areaName?county.areaName:''
	  		}
	  		
	  		if(this.LEVEL == 3){
		  		this.task();
	  		}
	  	},
	  	hotChoice(data){
	  		let that = this;
	  		//this.$set(this.province_checked,'areaName',data.parentAreaName)
	  		
	  		that.province_checked = {
	  			"areaCode" : data.parentAreaCode,
	  			"areaName" : data.parentAreaName
	  		}
	  		that.city_checked = {
	  			"areaCode" : data.areaCode,
	  			"areaName" : data.areaName
	  		}
	  		that.county_checked = {};
	  		that.active = that.LEVEL?that.LEVEL:3;
	  		
	  		//市队列
	  		that.provinces.forEach((item,index)=>{
	  			if(item.areaCode==data.parentAreaCode){
	  				that.citys = item.cityList;
	  			}
	  		})
	  		//区县队列
	  		for(var i=0;i<that.citys.length;i++){
	  			if(that.citys[i].areaCode==data.areaCode){
	  				that.countys = that.citys[i].areaList;
	  			}
	  		}
	  		
	  		//2级地址直接选择
	  		if(that.LEVEL==1||that.LEVEL==2){
	  			that.task();
	  		}
	  	},
	    task: function() {
	    	var province={},city={},county={};
  				province.name = this.province_checked.areaName?this.province_checked.areaName:'';
  				province.code = this.province_checked.areaCode?this.province_checked.areaCode:'';
  				city.name = this.city_checked.areaName?'-'+this.city_checked.areaName:'';
  				city.code = this.city_checked.areaCode?'-'+this.city_checked.areaCode:'-';
  				county.name = this.county_checked.areaName?'-'+this.county_checked.areaName:'';
  				county.code = this.county_checked.areaCode?'-'+this.county_checked.areaCode:'-';
  				
  			let backParams = {
	  			"province_checked": this.province_checked,
	  			"city_checked": this.city_checked,
	  			"county_checked": this.county_checked,
	  			"refs": this.ref,
	  			"areaNames":province.name+city.name+county.name,
	  			"areaCodes":province.code+city.code+county.code,
	  		}
	  		this.$emit('changePopup',backParams);
	  		
	    	this.$router.go(-1);
	    }
	  },
	  watch: {
	  	
	  }
	}
</script>

<style>
	.hot-city{height: 150px;overflow-y: scroll;}
	.hot-title{line-height: 50px;padding: 0 15px;color: #a248ff;font-size: 14px;}
	.hot-city div{
		width: 25%;
	    height: 50px;
	    line-height: 50px;
	    float: left;
	    text-align: center;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    font-size: 14px;
	}
	
	.checked-bar{display: flex;padding: 0 15px;}
	.checked-bar div{width:33.33%;height:30px;line-height:30px;text-align: center;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;font-size: 14px;}
	.oncheck-bar{border-bottom: 1px solid #a248ff;font-size: 14px;color: #a248ff;}
	
	
	.address-list{
		height: calc(100vh - 245px);overflow: scroll;padding: 10px 15px;
	}
	.address-list li{
		height: 40px;
		line-height: 40px;
		font-size: 14px;
		border-bottom: 1px solid #f5f5f5;
	}
	.oncheck-li{
		color:#a248ff;
	}
	
</style>