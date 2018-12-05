import Vue from 'vue';
import Vuex from 'vuex';
import {getStore, getWXUrl} from '../plugins/utils';
import actions from './action';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

const state = {
  userInfo: getStore('userInfo') || {}, /*用户信息*/
  userAgent: {}, /*浏览器设备信息*/
  wxIndexUrl: getWXUrl('#/home'),
  wxLoginUrl: getWXUrl('#/login'),
  netWorkType: '', /*网络类型*/
  splash: getStore('splash') == null ? true : getStore('splash')
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
