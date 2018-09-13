// 入口文件
import Vue from 'vue';
import VueX from 'vuex';
import * as actions from './actions'; // 会将 "./actions" 中所有 export 导出的内容组合成一个对象返回
import * as getters from './getters';
import state from './state';
import mutations from './mutations';
import createLogger from 'vuex/dist/logger'; // 每次修改state 打印日志

Vue.use(VueX);
const debug = process.env.NODE_ENV !== 'production'; // NODE_ENV在调用webpack编译时，如果是npm run dev的话，这个NODE_ENV就是dev环境，如果是npm run build的话，这个就是production环境

export default new VueX.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug, // 线上关闭  本地开发开启严格模式 有性能损耗
  plugins: debug ? [createLogger()] : []
});
