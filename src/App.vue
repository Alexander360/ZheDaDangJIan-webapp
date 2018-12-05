<template>
  <div class="app">
    <transition name="fade">
      <splash v-if="splash"></splash>
    </transition>
    <transition name="router-fade" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath"></router-view>
      </keep-alive>
    </transition>

    <transition name="router-fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath"></router-view>
    </transition>
  </div>
  <!--添加unique的key是为了保证当重复使用组件时，会刷新页面。（虽然损失了一丢丢性能，但避免了无限的bug）
  如/posts/a和/posts/b使用的是同一组件
  因为vue-router会"智能地"发现是同一个组件，然后它就决定要复用这个组件，所以你在created函数里写的方法压根就没执行。-->
</template>

<script>
  import {mapState} from 'vuex';
  /*import { Toast } from 'mint-ui'
  import { CheckLoginStatus } from './service/getData'
  import { setStore, getStore } from './plugins/utils'*/

  export default {
    data() {
      return {};
    },
    created() {
    },
    mounted() {
      /*setStore('wxLoginUrl', this.wxLoginUrl);
      setStore('wxIndexUrl', this.wxIndexUrl);*/
    },
    computed: {
      ...mapState(['userInfo', 'wxLoginUrl', 'wxIndexUrl', 'splash'])
    },
    updated() {
    },
    methods: {
      /*async checkStatus() {
        let url = this.$route.path;
        if (url === '/login' || url === '/register') {
          return;
        }
        let data = await CheckLoginStatus({Mac: this.userInfo.UserAccount});
        if (data.Type == 1) {
          if (!data.Data.OnlineFlag) {
            Toast({message: '用户掉线,请重新登录', position: 'bottom'});
            var currentUrl = getStore('currentUrl');
            window.localStorage.removeItem('ASPXAUTH');
            if (getStore('userAgent').weixin) {
              window.location.href = getStore('wxLoginUrl');
            } else {
              var loginUrl = '/#/login?currentUrl=' + encodeURIComponent(currentUrl);
              window.location.href = loginUrl;
            }
          }
        }
      }*/
    }
  };
</script>

<style lang="scss">
  .router-fade-enter-active,
  .router-fade-leave-active {
    transition: opacity 0.3s;
  }

  .router-fade-enter,
  .router-fade-leave-active {
    opacity: 0;
  }
</style>
