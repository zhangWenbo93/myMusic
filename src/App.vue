<template>
<div id="app">
  <Mheader></Mheader>
  <tab></tab>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</div>
</template>

<script type="text/ecmascript-6">
import Mheader from 'components/m-header/m-header';
import Tab from 'components/tab/tab';
export default {
  components: {
    Mheader,
    Tab
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable'
</style>
