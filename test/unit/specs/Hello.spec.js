import Vue from 'vue'
import endLine from '../../../com_base/components/endLine.vue'

describe('endLine.vue', () => {
  it('should render correct contents', () => {
 		// 这里将app生成vue实例，并使用 $mount() 模拟挂载状态
        let vm = new Vue(endLine).$mount();
 
        // 执行setMessage方法
        vm.setText('你好世界');
        
    	// 断言组件的text是否变为了'我是有底线的'
    	expect(vm.text).to.equal('你好世界');
  })
})