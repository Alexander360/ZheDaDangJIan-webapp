/**
* header组件
*/
<template>
  <header class="header" :class="{ 'is-fixed': fixed }">
    <div class="header_left">
      <slot name="left"></slot>
    </div>
    <slot name="title">
      <h1 class="header_title" v-text="title"></h1>
    </slot>
    <div class="header_right">
      <slot name="right"></slot>
    </div>
  </header>
</template>
<script>
  export default {
    name: 'header-fix',
    props: {
      title: String,
      fixed: Boolean
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .header {
    @include flex();
    align-items: center;
    @include ht-lineHt64(88px);
    background-color: $brand-primary;
    text-align: center;
    font-size: 16px;
    color: #fff;
    padding: 0 rem64(20px);
    &.is-fixed {
      position: fixed;
      z-index: 1;
      top: 0;
      left: 0;
      right: 0;
    }
    .header_left {
      flex: 1;
      text-align: left;
    }
    .header_title {
      flex: 2;
      @extend %ellipsis;
      color: #fff;
      font-size: 16px;
    }
    .header_right {
      flex: 1;
      text-align: right;
      font-size: 14px;
    }
    .webapp-back {
      font-size: 22px;
    }
    .webapp-search {
      font-size: 19px;
    }
    .webapp-category {
      font-size: 20px;
    }
  }
</style>
