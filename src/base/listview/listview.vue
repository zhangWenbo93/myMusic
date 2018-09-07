<!--  -->
<template>
  <scroll class="listview"
    :data="data" ref="listview"
    :listenScroll="listenScroll"
    @scroll="scroll"
    :probeType="probeType"
  >
    <ul>
      <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item,index) in group.items" :key="index" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li class="item"
          v-for="(item, index) in shortcutList"
          :key="index"
          :data-index="index"
          :class="{'current': currentIndex === index}"
        >{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
        <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll';
import {getData} from 'common/js/dom';
import loading from 'base/loading/loading';
const ANCHOR_HEIGHT = 18; // 每个字母的高度
const TITLE_HEIGHT = 30; // 每个字母的高度

export default {
  props: { // 表示里面的参数实时观测
    data: {
      type: Array,
      default: () => [] // 在写形如prop: {type: Array; default: []}的代码时,eslint常会出现这样的错误提示,修改方式1 default: function () { return [] }   修改方式2(es6)default: () => [] // es6的箭头函数
    }
  },
  data() { // 表示里面的参数实时观测
    return {
      scrollY: -1,
      currentIndex: 0, // 用于高亮右侧导航
      diff: -1 // 表示当前区块上限和当前滚动位置的滚动差
    };
  },
  created () {
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  computed: {
    shortcutList () {
      return this.data.map((group) => { // 通过计算属性得到字母排序
        return group.title.substr(0, 1);
      });
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return '';
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
    }
  },
  methods: {
    onShortcutTouchStart(e) { // start滚动
      let anchorIndex = getData(e.target, 'index');
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    onShortcutTouchMove(e) { // move滚动  move事件不结束  pageY会变大导致anchorIndex变大
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0; // |0 相当于math.flot()  通过start 和 move的位移差值  计算个数
      let anchorIndex = this.touch.anchorIndex / 1 + delta;
      this._scrollTo(anchorIndex);
    },
    scroll(pos) { // 赋值联动左侧
      this.scrollY = pos.y;
    },
    _scrollTo(index) { // 滚动事件
      console.log('index', index);
      // 这个是处理点击在非字母空区域时
      if (!index && index !== 0) {
        return;
      }
      console.log('listHeight', this.listHeight.length);
      // 这个是处理TouchMove时 下标异常问题
      if (index < 0) { // 拖动到最上面
        index = 0;
      } else if (index > this.listHeight.length - 2) { // 拖动到最下面
        index = this.listHeight.length - 2;
      }
      this.scrollY = this.listHeight[index]; // 赋值当前点击元素的上限
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _calculateHeight() { // 获取每个左侧字母区块的高度
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) { // 得到每个listGroup的高度区间（有上限值和下限值）， 第一个元素的上限是第二个元素的下限 例如：[2, 333, 444]  第一个元素上限333  是第二个元素的下限  333
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => { // 延迟函数表示dom加载
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      const listHeight = this.listHeight;
      if (newY > 0) { // 滚动到顶部
        this.currentIndex = 0;
        return;
      }
      for (let i = 0; i < listHeight.length - 1; i++) { // 中间部分 （这里操作的等于是再拿区间值做比较）
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
      }
      // 当滚动到底部且-newY大于最后一个元素的上限 （因为这种情况需要滚动到最后一个元素，最后一个元素的索引就是 listHeight.length-2）
      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) { // 为了减少dom结构的的操作
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
    }
  },
  components: {
    Scroll,
    loading
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import "~common/stylus/variable"

  .listview
    position relative
    width 100%
    height 100%
    overflow hidden
    background $color-background
    .list-group
      padding-bottom 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display flex
        align-items center
        padding 20px 0 0 30px
        .avatar
          width 50px
          height 50px
          border-radius 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position absolute
      right 0
      top 50%
      transform translateY(-50%)
      z-index 30
      width 20px
      padding 20px 0
      border-radius 10px
      text-align center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position absolute
      left 0
      top 0
      width 100%
      font-size 0
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
</style>
