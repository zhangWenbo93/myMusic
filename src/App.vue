<template>
<div id="app">
  <Mheader></Mheader>
</div>
</template>

<script type="text/ecmascript-6">
import Mheader from 'components/m-header/m-header';
export default {
  components: {
    Mheader
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable'
#app
  color $color-theme
</style>
