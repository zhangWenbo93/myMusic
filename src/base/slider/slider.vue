<!--  -->
<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <div class="dot" :class="{active:currentPageIndex === index}" v-for="(item,index) in dots" :key="index"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { addClass } from 'common/js/dom';
import BScroll from 'better-scroll';
export default {
  name: 'slider',
  props: {
    loop: { // 是否循环轮播
      type: Boolean,
      default: true
    },
    autoPlay: { // 是否自动轮播
      type: Boolean,
      default: true
    },
    interval: { // 自动轮播间隔
      type: Number,
      default: 4000
    }
  },
  data () {
    return {
      dots: [], // 轮播图小点
      currentPageIndex: 0
    };
  },
  created() {
    this.$nextTick(() => {
      this._setSilderWidth();
    });
  },
  mounted() {
    setTimeout(() => {
      this._initDots();
      this._initSlider();

      if (this.autoPlay) {
        this._play();
      }
    }, 20);

    window.addEventListener('resize', () => {
      if (!this.slider || !this.slider.enable) {
        return;
      }
      clearTimeout(this.resizeTime());
      this.resizeTime = setTimeout(() => {
        if (this.slider.isInTransition) { // isInTransition判断当前 scroll 是否处于滚动动画过程中
          this._onScrollEnd();
        } else {
          if (this.autoPlay) {
            this._play();
          }
        }
        this.refresh();
      }, 60);
    });
  },
  activated() { // keep-alive组件激活时调用。
    this.slider.enable();
    let PageIndex = this.slider.getCurrentPage().pageX;
    this.slider.goToPage(PageIndex, 0, 0);
    this.currentPageIndex = PageIndex;
    if (this.autoPlay) {
      this._play();
    }
  },
  deactivated() { // keep-alive组件停用时调用。
    this.slider.disable();
    clearTimeout(this.timer);
  },
  beforeDestroy() { // 实例销毁之间调用。在这一步，实例仍然完全可用。该钩子在服务端渲染期间不被调用。
    this.slider.disable();
    clearTimeout(this.timer);
  },
  methods: { // mounted 是可以获取到 DOM，但是 DOM 并未真正渲染到页面上，所以如果你是依赖 DOM 的一些宽度高度啥的，就必须要延迟一个 tick
    refresh() {
      if (this.slider) {
        this._setSliderWidth(true);
        this.slider.refresh();
      }
    },
    _setSilderWidth(isResize) { // 计算图片轮播盒子的宽度
      this.children = this.$refs.sliderGroup.children;
      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, 'slider-item');

        child.style.width = `${sliderWidth}px`;
        width += sliderWidth;
      }
      // 窗口resize时，不能多次进行width计算
      if (this.loop && !isResize) { // 如果循环则内部盒子上次翻倍相当于clone
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + 'px';
    },
    _initDots() { // 轮播小点
      this.dots = new Array(this.children.length);
    },
    _initSlider() { // 轮播图参数
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      });
      this.slider.on('scrollEnd', this._onScrollEnd); // 此处回调直接调用函数名，不用写成this._onScrollEnd()执行函数
      this.slider.on('touchend', () => {
        if (this.autoPlay) {
          this._play();
        }
      });
      this.slider.on('beforeScrollStart', () => { // 在滚动开始之前
        if (this.autoPlay) {
          clearTimeout(this.timer);
        }
      });
    },
    _onScrollEnd() {
      let PageIndex = this.slider.getCurrentPage().pageX;
      this.currentPageIndex = PageIndex;
      if (this.autoPlay) {
        this._play();
      }
    },
    _play() {
      clearTimeout(this.timer); // 防止手指拖动造成滚动偏差
      this.timer = setTimeout(() => {
        this.slider.next();
      }, this.interval);
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    position relative
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
