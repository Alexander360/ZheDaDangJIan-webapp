import {
  GET_NETWORKTYPE,
  GET_USERAGENT,
  GET_USERINFO,
  SAVE_SPLASH_STATUS,
  SAVE_USER_INFO
} from './mutation-types';

export default {
  // 获取用户信息
  [GET_USERINFO](state, userInfo) {
    state.userInfo = userInfo;
  },
  // 获取userAgent
  [GET_USERAGENT](state, userAgent) {
    state.userAgent = userAgent;
  },
  // 获取网络类型
  [GET_NETWORKTYPE](state, netWorkType) {
    state.netWorkType = netWorkType;
  },
  [SAVE_SPLASH_STATUS](state, status) {
    state.splash = status;
  },
  [SAVE_USER_INFO](state, userInfo) {
    state.userInfo = userInfo;
  }
};
