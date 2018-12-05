<template>
  <div id="splash">
    <img src="../assets/splash.png">
    <div class="splash_time" :class="{show_text: showText}" @click="skip">{{splashTime}}</div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';

  export default {
    data() {
      return {
        splashTime: 5,
        showText: false
      };
    },
    mounted() {
      let timer = setInterval(() => {
        if (this.splashTime === 1) {
          clearInterval(timer);
          this.splashTime = '跳过';
          this.showText = true;
          return;
        }
        this.splashTime--;
      }, 1000);
    },
    methods: {
      ...mapActions(['saveSplashStatus']),
      skip() {
        if (this.showText) {
          this.saveSplashStatus(false);
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  #splash {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 6;
    width: 100%;
    height: 100%;
    opacity: 1;
    transition: opacity .3s ease;

    &.fade-enter, &.fade-leave-to {
      opacity: 0;
    }

    img {
      width: 100%;
      height: 100%;
    }

    .splash_time {
      position: absolute;
      right: rem75(10px);
      top: rem75(10px);
      @include square75(60px);
      border-radius: 50%;
      background-color: rgba(255, 255, 255, .3);
      color: #FFF;
      text-align: center;
      line-height: rem75(60px);
      font-size: 18px;

      &.show_text {
        font-size: 12px;
      }
    }
  }
</style>
