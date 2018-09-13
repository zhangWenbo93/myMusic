import * as types from './mutation-types';

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  }
};

export default mutations;
// export、import可以有多个，export default仅有一个且没有花括号。
