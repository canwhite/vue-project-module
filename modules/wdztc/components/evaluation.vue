<!--评价popup-->
<template>
	<mt-popup v-model="evaluationpopup.visible"  position="bottom" popup-transition="popup-fade" style="width: 100%;">
		<div class="evaluation">
			<div class="popup-banner">
				<i class="icon icon-close" @click="cancel()"></i>
				<span>{{title}}</span>
			</div>
			<div class="popup-star">
				<div class="star">
					<i class="iconfont" @click="params.score=1" :class="{'uct-icon-xing-o':params.score<1,'uct-icon-xing':params.score>=1}"></i>
					<i class="iconfont" @click="params.score=2" :class="{'uct-icon-xing-o':params.score<2,'uct-icon-xing':params.score>=2}"></i>
					<i class="iconfont" @click="params.score=3" :class="{'uct-icon-xing-o':params.score<3,'uct-icon-xing':params.score>=3}"></i>
					<i class="iconfont" @click="params.score=4" :class="{'uct-icon-xing-o':params.score<4,'uct-icon-xing':params.score>=4}"></i>
					<i class="iconfont" @click="params.score=5" :class="{'uct-icon-xing-o':params.score<5,'uct-icon-xing':params.score>=5}"></i>
				</div>
				<div class="star-desc">
					<span v-if="params.score==1">朕一星都不想给</span>
					<span v-if="params.score==2">一星关爱、一星同情</span>
					<span v-if="params.score==3">同志仍需努力</span>
					<span v-if="params.score==4">深得朕心</span>
					<span v-if="params.score==5">别的不多说，打赏</span>
				</div>
			</div>
			
			<div class="popup-remark">
				<span>给我们提提建议吧</span>
				<textarea label="" v-model="params.remark" rows="4" placeholder="为了更便捷的使用系统，说说您对系统的其他建议"></textarea>
				<span class="length-tips">{{params.remark.length}}/50</span>
			</div>
			<div class="popup-submit">
				<mt-button class="submitBtn" type="default" size="large" @click="submit">提    交</mt-button>
			</div>
		</div>
	</mt-popup>
</template>

<script>
	import common from '@com_base/common/util.js';
	
	export default {
	  props: {
	    evaluationpopup: {
	      type: Object,
	      default: function(){
	      	return {
	      		visible:false,
	      		id:null,
	      		index:0
	      	}
	      }
	    },
	    title:{
	    	default: "评价"
	    }
	  },
	  data(){
	  	return {
	  		params:{
	  			score:5,
	  			remark: ""
	  		}
	  	}
	  },
	  /*计算属性*/
	  computed: {
			backup:function () {
		  		return this.evaluationpopup
		  	}
	  },
	  mounted(){
	  },
	  methods:{
	  	cancel(){
	  		this.evaluationpopup.visible = false;
	  	},
	  	submit(){
	  		this.params.remark = this.params.remark.replace(common.emojiReg,"").trim();
	  		let newobj = $.extend(this.backup,this.params);
	  		this.$emit('getPopupValue',newobj)
	  	}
	  },
	  watch:{
	  	'params.remark':function(newval,oldval){
	  		this.params.remark = newval.substring(0,50);
	  	}
	  }
	}
</script>

<style>
	.evaluation{width: 100%;height: 300px;padding: 5px 0 10px 0;}
	.evaluation>div{padding: 0 15px;}
	.evaluation .mint-button--default {
	    background-color: #a248ff;
	    color: #fff;
	}
	.evaluation .popup-banner{height: 40px;line-height: 40px;text-align: center;border-bottom: 1px solid #ccc;margin-bottom: 10px;}
	.evaluation .popup-banner i{position: absolute;width: 40px;height: 38px;line-height: 38px;color: #ccc;}
	.evaluation .popup-banner span{display: inline-block;text-align: center;width: 100%;font-size: 16px;color: #333;}
	.evaluation .popup-star{text-align: center;font-size: 24px;}
	.evaluation .popup-star i{color: #ec7f0d;}
	.evaluation .popup-star .star-desc span{font-size: 14px;color: #ec7f0d;}
	.evaluation .popup-remark{height: 130px!important;margin: 10px 0;position:relative;}
	.evaluation .popup-remark span{font-size: 12px;color: #999;display: block;text-align: center;}
	.evaluation .popup-remark .length-tips{position: absolute;right: 20px;bottom: 10px;color: #999;font-size: 14px;}
	.evaluation .popup-remark textarea {background-color: #f7f7f7!important;padding: 10px!important;font-size: 12px;border:none;border-radius: 6px;}
	.evaluation .popup-remark .mint-cell-wrapper{background-image: none;}
	.evaluation .popup-remark .mint-field-core{font-size: 12px;}
</style>