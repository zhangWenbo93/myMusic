// 异步操作或者是对mutation的封装
import * as types from './mutation-types'; // 按 es6 的规范 import * as obj from "xxx" 会将 "xxx" 中所有 export 导出的内容组合成一个对象返回
import { playMode } from 'common/js/config';
import { shuffle } from 'common/js/util';
import { saveSearch, deleteSearch, clearSearch } from 'common/js/cache';

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id;
  });
}

export const selectPlay = function ({ commit, state }, { list, index }) { // 音乐播放器
  commit(types.SET_SEQUENCE_LIST, list);
  if (state.mode === playMode.random) {
    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList);
    index = findIndex(randomList, list[index]);
  } else {
    commit(types.SET_PLAYLIST, list);
  }
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};
// {commit, state}可解构为commit方法，state属性
// {list, index}可解构为当前点击列表好索引

export const randomPlay = function ({ commit }, { list }) { // 歌曲列表页随机按钮
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  let randomList = shuffle(list);
  commit(types.SET_PLAYLIST, randomList);
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const insertSong = function ({ commit, state }, song) { // 搜索列表音乐跳转
  let playlist = state.playlist.length > 0 ? state.playlist.slice() : [];
  let sequenceList = state.sequenceList.length > 0 ? state.sequenceList.slice() : [];
  let currentIndex = state.currentIndex;
  // 记录当前歌曲
  let currentSong = playlist[currentIndex];
  // 查找挡圈列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song);
  // 因为是插入歌曲，所以索引要加1
  currentIndex++;
  // 插入这首歌到当前索引
  playlist.splice(currentIndex, 0, song); // 此处不能直接修改state中的playlist，因为vuex不允许在mutations之外修改已存在的对象，因此想修改，需要将原对象进行拷贝，修改拷贝后的对象
  // 如果已经包含了这首歌，
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) { // 当前插入的序号大于列表中序号，直接删除找到的索引
      playlist.splice(fpIndex, 1);
      currentIndex--; // 由于原数组长度由于被删除以为，所以新插入的元素自身的索引就要--
    } else {
      playlist.splice(fpIndex + 1, 1);
    }
  }
  let currentSIndex = findIndex(sequenceList, currentSong) + 1; // sequenceList要插入的位置
  let fsIndex = findIndex(sequenceList, song);
  sequenceList.splice(currentSIndex, 0, song);
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }
  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const saveSearchHistory = function ({ commit }, query) { // 保存搜索历史
  commit(types.SET_SEARCH_HISTORY, saveSearch(query));
};

export const deleteSearchHistory = function ({ commit }, query) { // 单个删除历史
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
};

export const clearSearchHistory = function ({ commit }) { // 整个删除历史
  commit(types.SET_SEARCH_HISTORY, clearSearch());
};

export const deleteSong = function ({ commit, state }, song) {
  let playlist = state.playlist.length > 0 ? state.playlist.slice() : [];
  let sequenceList = state.sequenceList.length > 0 ? state.sequenceList.slice() : [];
  let currentIndex = state.currentIndex;
  let pIndex = findIndex(playlist, song);
  playlist.splice(pIndex, 1);
  let sIndex = findIndex(sequenceList, song);
  sequenceList.splice(sIndex, 1);
  if (currentIndex > pIndex || currentIndex === playlist.length) { // 当前播放歌曲在删除歌曲之后或者当前播放的是最后一首
    currentIndex--;
  }
  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  if (!playlist.length) { // 如果歌曲删除完，把播放状态置为fasle
    commit(types.SET_PLAYING_STATE, false);
  }
};

export const deleteSongList = function ({ commit }) { // 整个删除历史
  commit(types.SET_PLAYLIST, []);
  commit(types.SET_SEQUENCE_LIST, []);
  commit(types.SET_CURRENT_INDEX, -1);
  commit(types.SET_PLAYING_STATE, false);
};
