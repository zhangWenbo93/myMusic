<!--  -->
<template>
  <div class="loading">
    <img src="./loading.gif" width="24" height="24">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: '正在加载中...'
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
  @import "~common/stylus/variable";

  .loading
    width 100%
    display flex
    flex-direction inherit
    align-items center
    justify-content center
    .desc
      font-size $font-size-small
      color $color-text-l
</style>
