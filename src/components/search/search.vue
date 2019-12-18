<!--  -->
<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll
        class="shortcut"
        :data="shortcutData"
        ref="shortcut"
        :refreshDelay="refreshDelay"
      >
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li
                v-for="(item, index) in hotkey"
                :key="index"
                class="item"
                @click="addQuery(item.k)"
              >
                {{ item.k }}
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list
              :searches="searchHistory"
              @select="addQuery"
              @delete="deleteSearchHistory"
            />
            <!-- addQuery参数是在执行这个函数的时候传入的，在模板中不写的话就是事件默认派发的参数，自定义事件的话默认派发的就是 $emit 传入的参数。 -->
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest
        :query="query"
        @listScroll="blurInput"
        @select="saveSearch"
        ref="suggest"
      ></suggest>
    </div>
    <confirm
      ref="confirm"
      text="是否清空所有搜索历史"
      confirmBtbText="清空"
      @confirm="clearSearchHistory"
    />
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getHotkey } from 'api/search';
import { ERR_OK } from 'api/config';
import SearchBox from 'base/search-box/search-box';
import Suggest from 'components/suggest/suggest';
import SearchList from 'base/search-list/search-list';
import Confirm from 'base/confirm/confirm';
import Scroll from 'base/scroll/scroll';
import { mapActions } from 'vuex';
import { playListMixin, searchMixin } from 'common/js/mixin';

export default {
  mixins: [playListMixin, searchMixin],
  data() {
    return {
      hotkey: []
    };
  },
  computed: {
    shortcutData() {
      return this.hotkey.concat(this.searchHistory);
    }
  },
  created() {
    this._getHotKey();
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.shortcutWrapper.style.bottom = bottom;
      this.$refs.shortcut.refresh();
      this.$refs.searchResult.style.bottom = bottom;
      this.$refs.suggest.refresh();
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    _getHotKey() {
      getHotkey().then((res) => {
        this.hotkey = res.data.hotkey.slice(0, 10);
      });
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  watch: {
    query(val) {
      if (!val) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search {
  width: 100%;
  position: fixed;
  top: 88px;
  bottom: 0;

  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;

    .shortcut {
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 0 20px 20px 20px;

        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          color: $color-text-d;
        }
      }

      .search-history {
        position: relative;
        margin: 0 20px;

        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;

          .text {
            flex: 1;
          }

          .clear {
            extend-click();

            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>
