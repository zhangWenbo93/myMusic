// 所有的状态管理
import { playMode } from 'common/js/config';
import { loadSearch, loadPlay, loadFavorite } from 'common/js/cache';

const state = {
  singer: {}, // 歌手页
  playing: false, // 是否播放
  fullScreen: false, // 是否展开
  playlist: [], // 播放列表
  sequenceList: [], // 原始列表
  mode: playMode.sequence, // 顺序播放状态值
  currentIndex: -1, // 当前播放歌曲索引
  disc: {},
  topList: {},
  searchHistory: loadSearch(),
  playHistory: loadPlay(), // 默认从缓存获取
  favoriteList: loadFavorite()
};

export default state;
