<!--  -->
<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode" />
            <span class="text">{{ modeText }}</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear" />
            </span>
          </h1>
        </div>
        <scroll
          ref="listContent"
          class="list-content"
          :data="sequenceList"
          :refreshDelay="refreshDelay"
        >
          <transition-group name="list" tag="ul">
            <li
              class="item"
              v-for="(item, index) in sequenceList"
              :key="item.id"
              @click="selectItem(item, index)"
              ref="listItem"
            >
              <i class="current" :class="getCurrentIcon(item)" />
              <span class="text">{{ item.name }}</span>
              <span class="like" @click.stop="toggoleFavorite(item)">
                <i :class="getFavoriteIcon(item)" />
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete" />
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add" />
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm
        ref="confirm"
        text="是否清空播放列表"
        confirm-text="清空"
        @confirm="confirmClear"
      />
      <add-song ref="addSong" />
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapActions } from 'vuex';
import { playMode } from 'common/js/config';
import { playerMixin } from 'common/js/mixin';
import Scroll from 'base/scroll/scroll';
import Confirm from 'base/confirm/confirm';
import AddSong from 'components/add-song/add-song';

export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false,
      nowIdx: '',
      refreshDelay: 100
    };
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环';
    }
  },
  methods: {
    show() {
      this.showFlag = true;
      setTimeout(() => { // 切换的时候数据不是立马渲染的，而是经过计算渲染，所以需要延迟初始化下
        this.$refs.listContent.refresh();
        this.scrollToCurrent(this.currentSong);
      }, 100);
    },
    hide() {
      this.showFlag = false;
    },
    getCurrentIcon(item) {
      return this.currentSong.id === item.id ? 'icon-play' : '';
    },
    selectItem(item, index) {
      this.nowIdx = item.id;
      if (this.mode === playMode.random) { // 根据播放模式处理index,此处是随机，其余不处理
        index = this.playlist.findIndex((song) => {
          return song.id === item.id;
        });
      }
      this.setCurrentIndex(index);
      this.setPlayingState(true);
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id;
      });
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300);
    },
    deleteOne(item) {
      this.deleteSong(item);
      if (this.playlist.length > 1 && this.nowIdx === item.id) { // 如果删除歌曲是当前播放的且不为一首时，将播放状态改为true，否则执行deleteSong()中的false
        this.setPlayingState(true);
      }
      if (!this.playlist.length) {
        this.hide();
      }
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    confirmClear() {
      this.deleteSongList();
      this.hide();
    },
    addSong() {
      this.$refs.addSong.show();
    },
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  watch: {
    currentSong(newSong, oldSong) {
      this.nowIdx = newSong.id;
      if (!this.showFlag || newSong.id === oldSong.id) {
        return;
      }
      setTimeout(() => {
        this.setPlayingState(true); // watch当前currentSong的发生变化了就SET_PLAYING_STATE为true，否则不做改变。这样在deleteSong时，删除其他歌曲，当前的歌曲不会被改变播放状态
        this.scrollToCurrent(newSong);
      }, this.refreshDelay); // 延迟时间不能太短 否则置顶失效,因为srcoll组件的数据更新有一个缓动过程，时间太短会导致refresh失败
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter, &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  &.list-fade-enter, .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
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

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        &.list-enter-active, &.list-leave-active {
          transition: all 0.1s;
        }

        &.list-enter, &.list-leave-to {
          height: 0;
        }

        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }

        .like {
          extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;

          .icon-favorite {
            color: $color-sub-theme;
          }
        }

        .delete {
          extend-click();
          font-size: $font-size-small;
          color: $color-theme;
        }
      }
    }

    .list-operate {
      width: 140px;
      margin: 20px auto 30px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }

        .text {
          font-size: $font-size-small;
        }
      }
    }

    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
