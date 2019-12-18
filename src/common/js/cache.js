import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LENGTH = 15;
const PLAY_KEY = '__play__';
const PLAY_MAX_LENGTH = 200;
/**
 *
 *
 * @param {*} arr
 * @param {*} val
 * @param {*} compare 比较函数
 * @param {*} maxLen 最大长度
 */
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare);
  if (index === 0) { // index === 0 时，此时插入的数据已存在且在数组的第一位
    return;
  }
  if (index > 0) { // 此时插入的数据已存在且位置不在第一
    arr.splice(index, 1);
  }
  arr.unshift(val);
  if (maxLen && arr.length > maxLen) {
    arr.pop(); // 剔除数组最后一位
  }
  // 返回剔除数组最后一位的剩余元素的新数组
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

// 操作处理localStorage的逻辑
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, []);
  insertArray(searches, query, (item) => {
    return item === query; // 如果searches中的item===query，说明 query存在于searches中
  }, SEARCH_MAX_LENGTH);
  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, []);
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, []);
  deleteFromArray(searches, (item) => {
    return item === query;
  });
  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function clearSearch() {
  storage.remove(SEARCH_KEY);
  return [];
}

export function savePlay(song) { // 添加歌曲到列表模块的歌曲同样也需要本地缓存逻辑
  let songs = storage.get(PLAY_KEY, []); // 获取歌曲列表，不存在赋值空数组
  insertArray(songs, song, (item) => {
    return item.id === song.id;
  }, PLAY_MAX_LENGTH);
  storage.set(PLAY_KEY, songs);
  return songs;
}

export function loadPlay() { // 读取添加歌曲到列表
  return storage.get(PLAY_KEY, []);
}
