<!--  -->
<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
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
    }
  },
  data() {
    return {

    };
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    });
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      let options = {
        probeType: this.probeType,
        click: this.click,
        pullDownRefresh: this.pulldown
      };

      this.scroll = new BScroll(this.$refs.wrapper, options);

      if (this.listenScroll) {
        let me = this; // 从新定义this
        this.scroll.on('scroll', (pos) => { // pos 获取位置
          me.$emit('scroll', pos); // 在这里的this指向的是scroll 非vue实例  所以在外层保存vue实例的this指向
        });
      }
      if (this.pulldown) {
        this.scroll.on('pullingDown', () => {
          this.$emit('pullingDown');
        });
      }
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => { // scrollEnd表示scroll停止
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd'); // scrollToEnd滚动到底部
          }
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

<style rel="stylesheet/stylus" lang="stylus">

</style>
