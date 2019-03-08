<template>
	<div class="route permission">
		
	</div>
</template>

<script>
	import ystsdk from '@com_base/common/yst-sdk.js';
	import { Indicator, Toast, MessageBox } from 'mint-ui';
	
	export default{
	  mounted() {
	  	let that = this;
	  	Indicator.open('Loading...');
	  	
	  	that.getpermission();
		
	  },
	  methods: {
	  	getpermission(){
	  		let url = this.api.findAuthorityDataURL;
		  	this.post(url,{}).then(res=>{
		  		this.$store.state.reportFlag = res.data.data.sqztc_report;//上报权限
		  		if(this.$store.state.permission==true){
		  			this.$router.replace('/home');
		  		}
		  	}).catch(err=>{
		  		MessageBox.alert('权限校验失败，请重试！').then(action => {
					//返回主页
					window.location.href = "js://uct?method=closeWebview";
				})
			})
	  	}
	  }
	}
</script>

<style>
</style>