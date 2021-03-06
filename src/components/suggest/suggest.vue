<!-- 歌曲搜索列表 -->
<template>
  <scroll
    class="suggest"
    ref="suggest"
    :data="result"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    @beforeScroll="listScroll"
  >
    <ul class="suggest-list" ref="suggestList">
      <li
        @click="selectItem(item)"
        class="suggest-item"
        v-for="(item, index) in result"
        :key="index"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import NoResult from 'base/no-result/no-result';
import { search } from 'api/search';
import { ERR_OK } from 'api/config';
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song';
import Singer from 'common/js/singer';
import { mapMutations, mapActions } from 'vuex';

const TYPE_SINGER = 'singer';
const perpage = 20;

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
  data() {
    return {
      page: 1,
      pullup: true,
      beforeScroll: true,
      hasMore: true,
      result: []
    };
  },
  methods: {
    search() {
      this.page = 1;
      this.hasMore = true;
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
    searchMore() {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((result) => {
            this.result = this.result.concat(result);
          });
          this._checkMore(res.data);
        }
      });
    },
    listScroll() {
      this.$emit('listScroll'); // 派发listScroll到父级组件search
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
      } else {
        this.insertSong(item);
      }
      this.$emit('select'); // 不许在suggest中写保存歌曲历史的逻辑，suggest处理的仅仅是歌手或者当前选中歌曲的信息
    },
    refresh() {
      this.$refs.suggest.refresh();
    },
    _checkMore(data) {
      const song = data.song;
      if (!song.list.length || song.curpage * perpage >= song.totalnum) {
        this.hasMore = false;
      }
    },
    _genResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
      }
      return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
        ret = ret.concat(songs);
        return ret;
      });
    },
    _normalizeSongs(list) {
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
    }),
    ...mapActions([
      'insertSong'
    ])
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
    Loading,
    NoResult
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
  position: relative;
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
