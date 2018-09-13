import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import 'common/stylus/index.styl';
import fastclick from 'fastclick';
import VueLazyload from 'vue-lazyload';

import { processSongsUrl } from 'common/js/song';
Vue.config.productionTip = false;

fastclick.attach(document.body);
Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
});
// 在js里面， new 一个对象，需要赋值给某个值（变量），用Vue实例化的时候，不需要赋值给值（变量），所以要单独给配一条规则，给new Vue这行代码上面加这个注释，把这行代码规则的校验跳过，通过eslint-disable。
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
/* render: function (createElement) {
    return createElement(
      'h' + this.level,   // tag name 标签名称
      this.$slots.default // 子组件中的阵列
      // Vue.js 里面的 createElement 函数，这个函数的作用就是生成一个 VNode节点，render 函数得到这个 VNode 节点之后，返回给 Vue.js 的 mount 函数，渲染成真实 DOM 节点，并挂载到根节点上。
    )
  }
*/
