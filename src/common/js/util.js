// 洗牌函数
function getRandomInt(min, max) { // 得到一个两数之间的随机数，包括两个数在内
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export function shuffle(arr) {
  let _arr = arr.slice(); // 对数组进行浅拷贝，防止破坏原有数组的数据格式
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i);
    let t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }
  return _arr;
}
