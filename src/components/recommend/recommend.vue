<!--  -->
<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" :data="discList" ref="scroll">
      <div>
        <div v-if="recommends.length" class="silder-wrapper">
          <div class="slider-content">
            <slider ref="slider">
              <div v-for="(item,index) in recommends" :key="index">
                <a :href="item.linkUrl">
                  <img :src="item.picUrl"  @load="loadImage" class="needsclass"/>
                </a>
              </div>
            </slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item, index) in discList" :key="index" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Slider from 'base/slider/slider';
import scroll from 'base/scroll/scroll';
import loading from 'base/loading/loading';
import { getRecommend, getDiscList } from 'api/recommend';
import { ERR_OK } from 'api/config';
import {playListMixin} from 'common/js/mixin';

export default {
  mixins: [playListMixin],
  data () {
    return {
      recommends: [],
      discList: []
    };
  },
  created () {
    this._getRecommend();
    setTimeout(() => {
      this._getDiscList();
    }, 1000);
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    _getRecommend () {
      getRecommend().then((res) => { // 轮播图数据
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      });
    },
    _getDiscList () {
      getDiscList().then((res) => { // 列表页数据
        if (res.code === ERR_OK) {
          console.log('res', res);
          this.discList = res.data.list;
        }
      });
    },
    loadImage() {
      if (!this.checkLoaded) {
        this.checkLoaded = true;
        setTimeout(() => {
          this.$refs.scroll.refresh();
        }, 20);
      }
    }
  },
  components: {
    Slider,
    scroll,
    loading
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import "~common/stylus/variable"

  .recommend
    position fixed
    width 100%
    top 88px
    bottom 0
    .recommend-content
      height 100%
      overflow hidden
      .slider-wrapper
        position relative
        width 100%
        height 0
        padding-top 40%
        overflow hidden
        .slider-content
          position absolute
          top 0
          left 0
          width 100%
          height 100%
      .recommend-list
        .list-title
          height 65px
          line-height 65px
          text-align center
          font-size $font-size-medium
          color $color-theme
        .item
          display flex
          box-sizing border-box
          align-items center
          padding 0 20px 20px
          .icon
            flex 0 0 60px
            padding-right 20px
            width 60px
          .text
            display flex
            flex-direction column
            justify-content center
            flex 1
            line-height 20px
            overflow hidden
            font-size $font-size-medium
            .name
              margin-bottom 10px
              color $color-text
            .desc
              color $color-text-d
      .loading-container
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)

</style>
