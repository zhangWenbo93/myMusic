<!-- 进度条 -->
<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStarst"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {prefixStyle} from 'common/js/dom';
const progressBtnWidth = 16;
const transform = prefixStyle('transform');
export default {
  props: {
    percent: { // 歌曲播放的比例
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}; // 不同的回调函数需要共享数据，把共享数据挂载在空touch对象上
  },
  methods: {
    progressTouchStarst(e) {
      this.touch.initiated = true; // 初始化,表示开始操作touch
      this.touch.startX = e.touches[0].pageX; // 点击位置
      this.touch.left = this.$refs.progress.clientWidth; // 当前按钮所在偏移位置
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const deltaX = e.touches[0].pageX - this.touch.startX; // pageX() 属性是鼠标指针的位置，相对于文档的左边缘
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX));
      this._offset(offsetWidth);
    },
    progressTouchEnd(e) {
      this.touch.initiated = false;
      this._triggerPercent();
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      this._offset(offsetWidth);
      // 当我们点击progressBtn时， 直接获取offsetX不对
      // this._offset(e.offsetX);
      this._triggerPercent();
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
    },
    _triggerPercent() { // 获取拖动按钮进度条的占比
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
      const precent = this.$refs.progress.clientWidth / barWidth;
      this.$emit('precentChange', precent);
    }
  },
  watch: {
    percent (newPercent) { // 通过监听percent改变进度条
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        const offsetWidth = newPercent * barWidth;
        this._offset(offsetWidth);
      }
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import '@~common/stylus/variable';
  .progress-bar
    height 30px
    .bar-inner
      position relative
      top 13px
      height 4px
      background rgba(0,0,0,0.3)
      .progress
        position absolute
        height 100%
        background $color-theme
      .progress-btn-wrapper
        position absolute
        left -8px
        top -13px
        width 30px
        height 30px
        .progress-btn
          position relative
          top 7px
          left 7px
          box-sizing border-box
          width 16px
          height 16px
          border 3px solid $color-text
          border-radius 50%
          background $color-theme
</style>
