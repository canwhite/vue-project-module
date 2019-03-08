<!--申诉popup-->
<template>
	<mt-popup v-model="complaintpopup.visible" position="bottom" popup-transition="popup-fade" style="width: 100%;">
		<div class="complaint">
			<div class="popup-banner">
				<i class="icon icon-close" @click="cancel()"></i>
				<span>{{title}}</span>
			</div>
			<div class="popup-remark">
				<div>
					<textarea v-model="params.complain" rows="5" placeholder="填写申诉事由"></textarea>
					<span class="length-tips">{{params.complain.length}}/100</span>
				</div>
			</div>
			<div class="popup-submit">
				<mt-button class="submitBtn" type="default" size="large" @click="submit">提    交</mt-button>
			</div>
		</div>
	</mt-popup>
</template>

<script>
	import {mapState} from 'vuex';
	import common from '@com_base/common/util.js';
	
	export default {
	  props: {
	    complaintpopup: {
	      type: Object,
	      default: function(){
	      	return {
	      		visible:false,
	      		id: null,
	      		index:0
	      	}
	      }
	    },
	    title:{
	    	default: '申诉理由'
	    }
	  },
	  data(){
	  	return {
	  		params:{
	  			complain:""
	  		}
	  	}
	  },
	  /*计算属性*/
	  computed: mapState({
	  	backup:function () {
	  		return this.complaintpopup
	  	}
	  }),
	  mounted(){
	  	
	  },
	  methods:{
	  	cancel(){
	  		this.complaintpopup.visible = false;
	  	},
	  	submit(){
	  		this.params.complain = this.params.complain.replace(common.emojiReg,"").trim();
	  		let newobj = $.extend(this.backup,this.params);
	  		this.$emit('getPopupValue',newobj);
	  	}
	  },
	  watch:{
		'params.complain':function(newval,oldval){
	  		this.params.complain = newval.substring(0,100);
	  	}
	  }
	}
</script>

<style>
	.complaint{width: 100%;height: 250px;padding: 10px 15px;}
	.complaint .mint-button--default {
	    background-color: #a248ff;
	    color: #fff;
	}
	.complaint .popup-banner{height: 40px;line-height: 40px;text-align: center;}
	.complaint .popup-banner i{position: absolute;width: 40px;height: 40px;line-height: 40px;color: #ccc;}
	.complaint .popup-banner span{display: inline-block;text-align: center;width: 100%;font-size: 16px;color: #333;}
	.complaint .popup-remark{position:relative;height: 150px!important;}
	.complaint .popup-remark>div{height: 120px;border-radius: 15px;}
	.complaint .popup-remark .length-tips{position: absolute;right: 5px;bottom: 25px;color: #999;font-size: 14px;}
	.complaint .popup-remark textarea{background-color: #f7f7f7!important;padding: 10px!important;font-size: 12px;border:none;border-radius: 6px;}
	.complaint .popup-remark .mint-cell-wrapper{background-image: none;}
	.complaint .popup-remark .mint-field-core{font-size: 12px;}
</style>