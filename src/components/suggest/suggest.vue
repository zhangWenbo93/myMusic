<!-- 歌曲搜索列表 -->
<template>
  <scroll
    class="suggest"
    ref="suggest"
    :data="result"
    :pullUpLoad="Load"
    :pullDownRefresh="Refresh"
    :isPullUpLoad="isPullUpLoad"
    @pullingUp="pullingUp"
    @pullingDown="pullingDown"
    >
    <ul class="suggest-list" ref="suggestList">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/new-scroll';
import Loading from 'base/loading/loading';
import {search} from 'api/search';
import {ERR_OK} from 'api/config';
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song';
import Singer from 'common/js/singer';
import {mapMutations} from 'vuex';

const TYPE_SINGER = 'singer';
const perpage = 20;
const RefreshThreshold = 90;
const RefreshStop = 40;
const UpLoadThreshold = 0;
const MoreTxt = '加载更多数据';
const NoMoreTxt = '没有更多数据了';
export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      pullDownRefresh: true,
      pullUpLoad: true,
      isPullUpLoad: true
    };
  },
  computed: {
    Refresh: function () {
      return this.pullDownRefresh ? {
        threshold: parseInt(RefreshThreshold),
        stop: parseInt(RefreshStop)
      } : false;
    },
    Load: function () {
      return this.pullUpLoad ? {
        threshold: parseInt(UpLoadThreshold),
        txt: { more: MoreTxt, noMore: NoMoreTxt }
      } : false;
    }
  },
  methods: {
    search() {
      this.page = 1;
      this.isPullUpLoad = true;
      this.$refs.suggest.scrollTo(0, 0);
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((res) => {
            this.result = res;
          });
          this._checkMore(res.data);
        }
      });
    },
    pullingDown() {
      this.search();
    },
    pullingUp() {
      this.page++;
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((res) => {
            this.result = this.result.concat(res);
          });
        }
        this._checkMore(res.data);
      });
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return `icon-mine`;
      } else {
        return `icon-music`;
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name} - ${item.singer}`;
      }
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) { // 跳转歌手
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        });
        this.$router.push({
          path: `/search/${singer.id}`
        });
        this.setSinger(singer);
      }
    },
    _checkMore(data) {
      const song = data.song;
      if (!song.list.length || song.curpage * perpage >= song.totalnum) {
        this.$refs.suggest.forceUpdate();
      }
    },
    _genResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}});
      }
      return processSongsUrl(this._normalizSongs(data.song.list)).then((songs) => {
        ret = ret.concat(songs);
        return ret;
      });
    },
    _normalizSongs(list) {
      let ret = [];
      list.forEach(musicData => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  watch: {
    query(newQuery, oldQuery) {
      this.search();
    },
    isPullUpLoad(newQuery, oldQuery) {
      console.log('newQuery', newQuery);
      console.log('oldQuery', oldQuery);
    }
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    position relative
    height 100%
    overflow hidden
    .suggest-list
      padding 0 30px
      .suggest-item
        display flex
        align-items center
        padding-bottom 20px
      .icon
        flex 0 0 30px
        width 30px
        [class^='icon-']
          font-size 14px
          color $color-text-d
      .name
        flex 1
        font-size $font-size-medium
        color $color-text-d
        overflow hidden
        .text
          no-wrap()
    .no-result-wrapper
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
