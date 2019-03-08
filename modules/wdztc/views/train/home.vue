<template>
	<div class="route list">
		<div class="slogan-banner">
			<bar-top
	    	:show-return-icon="true"
	    	:show-right-icon="$store.state.reportFlag==1">
			</bar-top>
			<!--banner-->
			<div class="report-banner" v-if="$store.state.reportFlag==1">
				<div class="banner-img"><img src="../../static/images/question.png"/></div>
				<div class="banner-desc">
					<div>问题上报</div>
					<div>工作的烦恼来这里谈谈！<br/>系统类问题请至IT服务台上报</div>
				</div>
				<div class="banner-btn"><router-link to="/report">去上报</router-link></div>
			</div>
	
			<!--navbar-->
			<div class="navbar-content">
			  	<div class="tab-search" @click="$router.push('/search')"><i class="iconfont uct-icon-sousuo"></i></div>
		  		<mt-navbar :fixed="false" v-model="active" class="navbar">
				  <mt-tab-item class="tab"
				  	v-for="(item, index) in navbarOptions" 
				  	:id="item.id" 
				  	:key="item.id">
				  	{{item.typeName}}
				  </mt-tab-item>
				  <!--<mt-tab-item id="1" class="tab">咨询</mt-tab-item>-->
				</mt-navbar>
				<div class="tab-classify" @click="popupVisible=true"><i class="iconfont uct-icon-fenlei"></i></div>
			</div>
			<!--类别popup-->
			<mt-popup class="classify-popup mint-popup-right" v-model="popupVisible" position="right">
				<div>
					<i class="iconfont uct-icon-guanbi" @click="popupVisible=false"></i>
					<span class="classify-title">问题分类</span>
				</div>
				<div class="classify-list">
					<li v-for="(item, index) in navbarOptions"
						:class="{'classify-selected':item.id==active}"
						@click="active=item.id;popupVisible=false;navbarScroll(index);">
						{{item.typeName}}
					</li>
				</div>
			</mt-popup>
		</div>
		
		<div v-bind:style="{'padding-top':$store.state.reportFlag==1?'267px':'96px'}">
			
			<list-dom :type="active"></list-dom>
			<!--<list-dom 
				:type="active" 
				:basedata="active==''?dataTab0.basedata:(active=='1'?dataTab1.basedata:dataTab2.basedata)" 
				:baseloaded="active==''?dataTab0.baseloaded:(active=='1'?dataTab1.baseloaded:dataTab2.baseloaded)" 
				:basepage="active==''?dataTab0.basepage:(active=='1'?dataTab1.basepage:dataTab2.basepage)" 
				:scrollTop="active==''?dataTab0.scrollTop:(active=='1'?dataTab1.scrollTop:dataTab2.scrollTop)" 
				@cacheData="cacheData">
			</list-dom>-->
			
		</div>
		
	</div>
</template>

<script>
	import barTop from '../../components/barTop.vue';
	import listDom from '../../components/childlist.vue';
	/*import listDom from '../../components/childlistcache.vue';*/
	
	export default {
	  	components: {
	    	'bar-top': barTop,
	    	'list-dom': listDom,
	  	},
	  	computed: {
	  	},
	  	data() {
	  		return {
	  			popupVisible:false,
	  			navbarOptions:[],
	  			active: '',
	  			dataTab0:{
	  				basedata:[],
	  				baseloaded:false,
	  				basepage:1,
	  				scrollTop:0
	  			},
	  			dataTab1:{
	  				basedata:[],
	  				baseloaded:false,
	  				basepage:1,
	  				scrollTop:0
	  			},
	  			dataTab2:{
	  				basedata:[],
	  				baseloaded:false,
	  				basepage:1,
	  				scrollTop:0
	  			}
  			}
	  	},
	  	created(){
	  	},
	  	mounted(){
	  		let url = this.api.findListURL;
	  		this.post(url,{}).then(res=>{
	  			let DATA = res.data.data;
	  			this.navbarOptions = DATA;
	  			this.active = DATA[0].id;
	  		}).catch(err=>{
	  			this.navbarOptions = [];
	  			this.active = '';
			})
 	 	},
	  	methods:{
	  		navbarScroll(index){
	  			//定位元素位置
	  			var offsetLeft = $('.navbar a')[index].offsetLeft -60-110;
	  			document.querySelector('.navbar').scrollLeft = offsetLeft;
	  		},
	  		cacheData(type,data){
	  			if(type==''){
	  				this.dataTab0 = data;
	  			}
	  			if(type=='1'){
	  				this.dataTab1 = data;
	  			}
	  			if(type=='2'){
	  				this.dataTab2 = data;
	  			}
	  		}
	  	},
	 	watch: {
	 		active:function(newval, oldval){
	 			if(oldval==''){
	 				this.dataTab0.scrollTop = document.body.scrollTop;
	 			}
	 			if(oldval=='1'){
	 				this.dataTab1.scrollTop = document.body.scrollTop;
	 			}
	 			if(oldval=='2'){
	 				this.dataTab2.scrollTop = document.body.scrollTop;
	 			}
	 			
	 			if(oldval=='')return;
	 			this.navbarOptions.forEach((item,index)=>{
	 				if(item.id==newval){
	 					this.navbarScroll(index);
	 				}
	 			})
	 		}
	  	}
	}
</script>

<style>
	.slogan-banner{
	    position: fixed;
	    top: 0;
	    width: 100%;
	    z-index: 99;
	    background-color: rgb(247, 246, 251);
	}
	.report-banner{
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 166px;
		background-color: #ffffff;
		padding: 15px;
		margin-bottom: 5px;
	}
	.banner-img{width:88px;height: 100px;}
	.banner-img img{width: 100%;height: 100%;}
	.banner-desc{flex: 1;height: 80px;padding: 0 10px;position: relative;}
	.banner-desc div:first-child{font-size: 15px;color: #333;}
	.banner-desc div:last-child{font-size: 12px;color: #999;position: absolute;bottom: 0;white-space: nowrap;}
	.banner-btn{
		position: absolute;
		right: 15px;
		width: 60px;
		height: 30px;
		background-image: linear-gradient(-90deg, #803ee6 0%, #b178e9 100%), 
		linear-gradient(#f47821, #f47821);
		background-blend-mode: normal, normal;
		border-radius: 22px;
	    font-size: 12px;
	    text-align: center;
	    color: #fff;
	    line-height: 30px;
	}
	.banner-btn a{color: #fff;}
	
	.navbar-content{margin: 0 0 3px 0;display: flex;align-items: center;background-color: #fff;}
	.tab-search{position:relative;width: 40px;height: 35px;}
	.tab-search i{position: absolute;top: 7px;left: 12px;font-size: 20px;color: #999;}
	.tab-classify{position:relative;margin-left:10px;width: 40px;border-left: 1px solid #ccc;height: 35px;}
	.tab-classify i{position: absolute;top: 7px;left: 10px;font-size: 20px;color: #999;}
	.navbar{align-items: center;flex: 1;overflow-x: auto;padding-right: 10px;}
	.navbar .tab{color: #999; margin: 0 10px;white-space: nowrap;}
	.navbar::-webkit-scrollbar {display: none;}
	.mint-tab-item>.mint-tab-item-label{font-size: 15px!important;}
	.list .mint-navbar .mint-tab-item.is-selected{color: #a248ff;border-bottom-color: #a248ff;margin-bottom: 0; }
	/*.list .mint-navbar .mint-tab-item:last-child{margin: 0;padding: 17px 10px;}*/
	
	.classify-popup{width: 100%;height: 100%;padding: 20px 15px;}
	.classify-title{position: absolute;left: 50%;transform: translateX(-50%);font-size: 14px;}
	.classify-list{margin-top: 15px;}
	.classify-list li{
		float: left;
	    padding: 5px 20px;
	    outline-style: none;
	    list-style: none;
	    font-size: 12px;
	    background: #f2f2f2;
	    margin: 10px;
	    border-radius: 5px;
	    color: #999;
	}
	.classify-list .classify-selected{background-color: #ccc;color: #fff;}
</style>