<!--  -->
<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';

const DIRECTION_H = 'horizontal';
const DIRECTION_V = 'vertical';

export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: { // 用于scroll是否监听滚动事件，默认false，
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    pullup: { // 是否上拉加载
      type: Boolean,
      default: false
    },
    pulldown: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    },
    direction: {
      type: String,
      default: DIRECTION_V
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        eventPassthrough: this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V
      });

      if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => {
          this.$emit('scroll', pos);
        });
      }

      if (this.pullup) {
        this.scroll.on('scrollEnd', () => { // scrollEnd表示scroll停止
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd'); // scrollToEnd滚动到底部
          }
        });
      }

      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => { // 解决移动端键盘弹起input问题
          this.$emit('beforeScroll');
        });
      }
    },
    enable() {
      this.scroll && this.scroll.enable(); // 作用：启用 better-scroll, 默认 开启。
    },
    disable() {
      this.scroll && this.scroll.disable(); // 作用：禁用 better-scroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应。
    },
    refresh() {
      this.scroll && this.scroll.refresh(); // 作用：重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  },
  watch: { // 监听数据变化动态刷新scroll
    data() {
      setTimeout(() => {
        this.refresh();
      }, this.refreshDelay);
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus"></style>
