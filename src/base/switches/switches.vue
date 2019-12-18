<!--  -->
<template>
  <ul class="switches">
    <li
      class="switch-item"
      v-for="(item, index) in switches"
      :class="{ active: currentIndex === index }"
      :key="item.id"
      @click="switchItem(index)"
    >
      <span>{{ item.name }}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    switches: {
      type: Array,
      default: () => []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchItem(index) {
      // this.currentIndex = index; // 不要在此处直接操作currentIndex进行赋值操作，因为本身是基础组件，最好做派发事件，由父级改变
      this.$emit('switch', index);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.switches {
  display: flex;
  align-items: center;
  width: 240px;
  margin: 0 auto;
  border: 1px solid $color-highlight-background;
  border-radius: 5px;

  .switch-item {
    flex: 1;
    padding: 8px;
    text-align: center;
    font-size: $font-size-medium;
    color: $color-text-d;

    &.active {
      background: $color-highlight-background;
      color: $color-text;
    }
  }
}
</style>
