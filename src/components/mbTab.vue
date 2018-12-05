/**
* 标签页 tab
*/
<template>
  <div class="mb_tab">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'mb-tab',
    props: {
      fixed: Boolean,
      value: {}
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .mb_tab {
    @include flex(center);
    align-items: center;
    :first-child {
      @include border-left-radius75(10px);
    }
    :last-child {
      @include border-right-radius75(10px);
      border-right: 1px solid #fff;
    }
  }

</style>
