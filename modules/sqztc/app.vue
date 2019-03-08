<template>
  <div v-cloak>
    <!-- set progressbar -->
    <vue-progress-bar></vue-progress-bar>
    <transition name="slide-fade">
	    <keep-alive>
	    		<router-view v-if="$route.meta.cache==true"></router-view>
	    </keep-alive>
    </transition>
    <transition name="slide-fade">
   	 	<router-view v-if="$route.meta.cache!=true"></router-view>
    </transition>
  </div>
</template>

<style>
	/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter {
   opacity: 0;
   transform:translateX(50px);
}
.slide-fade-enter-active {
    transition: all 0.3s linear;
}

</style>