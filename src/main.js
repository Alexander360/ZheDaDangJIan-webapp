// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import './assets/iconfont/iconfont.css';
import './components/global';
import {setStore, userAgent} from './plugins/utils';
import routes from './router';
import './service/filter';
import {CheckLoginStatus} from './service/getData';
import store from './store/';
import './style/base.scss';

Vue.config.productionTip = false;
Vue.use(VueRouter);

//修改title
const changeTitle = (title) => {
  if (title) {
    document.title = title;
    if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
      let i = document.createElement('iframe');
      i.src = '//m.baidu.com/favicon.ico';
      i.style.display = 'none';
      i.onload = () => {
        setTimeout(() => {
          i.remove();
        }, 9);
      };
      document.body.appendChild(i);
    }
  }
};
// 检查登录状态
const getLoginStatus = (next) => {
  let userInfo = store.state.userInfo;
  CheckLoginStatus({Mac: userInfo.Account}).then(res => {
    if (!res.IsSuccess || !res.Data.OnlineFlag) {
      store.dispatch('saveUserInfo', {});
      next({path: '/login'});
    } else {
      next();
    }
  });
};
const router = new VueRouter({
  routes
});
router.beforeEach((to, from, next) => {
  let fromUrl = from.fullPath;
  let href = window.location.href;
  if (!/\/favicon\.ico/.test(href)) {
    setStore('fromUrl', fromUrl);
  }
  let title = to.meta.title;
  changeTitle(title);
  if (to.name !== 'login') {
    if (JSON.stringify(store.state.userInfo) === '{}') {
      next({path: '/login'});
    } else {
      getLoginStatus(next);
    }
  } else {
    next();
  }
});
router.afterEach((to, from) => {
  window.scrollTo(0, 0);
  /*存入当前url*/
  let currentUrl = to.fullPath;
  let href = window.location.href;
  if (!/\/favicon\.ico/.test(href)) {
    setStore('currentUrl', currentUrl);
  }
  /*判断mobile weixin*/
  let agent = userAgent();
  setStore('userAgent', agent);
});

new Vue({
  router,
  store
}).$mount('#app');
export default router;
