/**
* Created by admin on 2017/12/4.
*/
<template>
  <a class="mb_tab_item"
     @click="$parent.$emit('input', id)"
     :class="{ 'active': $parent.value === id }">
    <slot></slot>
  </a>
</template>
<script>
  export default {
    name: 'mb-tab-item',
    props: ['id'],
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .mb_tab_item {
    display: inline-block;
    @include ht-lineHt75(56px);
    text-align: center;
    border-top: 1px solid #fff;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #fff;
    padding: 0 rem75(25px);
    background-color: $brand-primary;
    color: $color-text-reverse;
    font-size: 14px;
    &.active {
      background-color: $color-text-reverse;
      color: $brand-primary;
    }
  }

</style>
