/**
* 滑动导航
*/
<template>
  <div class="nav_slide">
    <div class="nav_left" :class="{'show':showLayer}">
      <slot name="left"></slot>
    </div>
    <div class="nav_right" :class="{'show':showLayer}">
      <slot name="right"></slot>
    </div>
    <transition name="fade">
      <div class="layer" @click="closeLayer" v-if="showLayer"></div>
    </transition>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        showLayer: this.show
      }
    },
    props: {
      show: Boolean
    },
    methods: {
      closeLayer () {
        this.showLayer = false
        this.$emit('showChange', false)
      }
    },
    watch: {
      show (val) {
        this.showLayer = val
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .nav_slide {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    .nav_left {
      background-color: #fff;
      position: absolute;
      left: 0;
      top: 0;
      width: rem75(545px);
      overflow-y: auto;
      height: 100%;
      transform: translateX(- rem75(545px));
      -webkit-transform: translateX(- rem75(545px));
      transition: transform 0.5s;
      &.show {
        transform: translateX(0);
      }
    }
    .nav_right {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      transform: translateX(0);
      -webkit-transform: translateX(0);
      transition: transform 0.5s;
      &.show {
        transform: translateX(rem75(545px));
        -webkit-transform: translateX(rem75(545px));
      }
    }
    .layer {
      position: absolute;
      left: rem75(545px);
      right: 0;
      top: 0;
      bottom: 0;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.6);
      z-index: 100;
      height: 100%;
      transition: all 0.5s;
    }
  }
</style>
