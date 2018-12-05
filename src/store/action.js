import {setStore, userAgent} from '../plugins/utils';
import {GetUserInfo} from '../service/getData';
import {GET_USERAGENT, GET_USERINFO, SAVE_SPLASH_STATUS, SAVE_USER_INFO} from './mutation-types';

export default {
  async getUserInformation({state, commit}, payload) {
    let data = await GetUserInfo(payload);
    if (data.Type == 1) {
      commit(GET_USERINFO, data.Data);
    }
  },
  saveUserInfo({state, commit}, payload) {
    setStore('userInfo', payload);
    commit(SAVE_USER_INFO, payload);
  },
  getUserAgent({state, commit}, payload) {
    let data = userAgent();
    commit(GET_USERAGENT, data);
  },
  saveSplashStatus({state, commit}, payload) {
    setStore('splash', payload);
    commit(SAVE_SPLASH_STATUS, payload);
  }
};
