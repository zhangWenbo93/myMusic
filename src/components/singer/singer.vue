<!-- 歌手 -->
<template>
  <div class="singer">
    <list-view :data="singers" @select="selectSinger"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer';
import { ERR_OK } from 'api/config';
import Singer from 'common/js/singer';
import ListView from 'base/listview/listview';
import { mapMutations } from 'vuex';

const HOT_TITLE = '热门';
const HOT_SINGER_LEN = 10;
export default {
  data () {
    return {
      singers: []
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      });
      this.setSinger(singer);
    },
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list);
          // console.log('this.singers', this.singers);
        }
      });
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_TITLE,
          items: []
        }
      };
      list.forEach((item, index) => { // 热门歌手
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }));
        }
        const key = item.Findex; // 根据Findex做聚类
        if (!map[key]) { // map[key]不存在创建map[key]
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }));
      });
      // 为了得到有序列表，要处理map
      let hot = [];
      let ret = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) { // 根据正则匹配将所有字母集合起来
          ret.push(val);
        } else if (val.title === HOT_TITLE) {
          hot.push(val);
        }
      }
      ret.sort((a, b) => { // 根据字符的 Unicode 编码 对数组进行排序
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret); // 数组合并
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    ListView
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
</style>
