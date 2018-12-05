/**
 * 工具集
 */

/**
 * @desc 存储localStorage
 * @date 2018-02-10 16:10:45
 * @param {string} localStorage属性名
 * @param {*} localStorage属性值
 */
export const setStore = (name, content) => {
  if (!name) return;
  content = JSON.stringify(content);
  window.localStorage.setItem(name, content);
};

/**
 * @desc 获取localStorage
 * @date 2018-02-10 16:12:17
 * @param {string} localStorage属性名
 * @return {*} localStorage属性值
 */
export const getStore = name => {
  if (!name) return;
  let value = window.localStorage.getItem(name);
  value = JSON.parse(value);
  return value;
};

/**
 * @desc 删除localStorage
 * @date 2018-02-10 16:13:39
 * @param {string} localStorage属性名
 */
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
};

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
  let target;
  // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
  if (attr === 'scrollTop') {
    target = element.scrollTop;
  } else if (element.currentStyle) {
    target = element.currentStyle[attr];
  } else {
    target = document.defaultView.getComputedStyle(element, null)[attr];
  }
  //在获取 opactiy 时需要获取小数 parseFloat
  return NumberMode == 'float' ? parseFloat(target) : parseInt(target);
};

/**
 * 页面到达底部，加载更多
 */
export const loadMore = (element, callback) => {
  let windowHeight = window.screen.height;
  let height;
  let setTop;
  let paddingBottom;
  let marginBottom;
  let requestFram;
  let oldScrollTop;
  
  document.body.addEventListener('scroll', () => {
    loadMore();
  }, false);
  //运动开始时获取元素 高度 和 offseTop, pading, margin
  element.addEventListener('touchstart', () => {
    height = element.offsetHeight;
    setTop = element.offsetTop;
    paddingBottom = getStyle(element, 'paddingBottom');
    marginBottom = getStyle(element, 'marginBottom');
  }, {passive: true});
  
  //运动过程中保持监听 scrollTop 的值判断是否到达底部
  element.addEventListener('touchmove', () => {
    loadMore();
  }, {passive: true});
  
  //运动结束时判断是否有惯性运动，惯性运动结束判断是非到达底部
  element.addEventListener('touchend', () => {
    oldScrollTop = document.body.scrollTop;
    moveEnd();
  }, {passive: true});
  
  const moveEnd = () => {
    requestFram = requestAnimationFrame(() => {
      if (document.body.scrollTop != oldScrollTop) {
        oldScrollTop = document.body.scrollTop;
        loadMore();
        moveEnd();
      } else {
        cancelAnimationFrame(requestFram);
        //为了防止鼠标抬起时已经渲染好数据从而导致重获取数据，应该重新获取dom高度
        height = element.offsetHeight;
        loadMore();
      }
    });
  };
  
  const loadMore = () => {
    if (document.body.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom) {
      callback();
    }
  };
};

/**
 * @desc 日期格式化
 * @date 2018-02-10 16:15:03
 * @param {*} 要格式化的日期
 * @param {string} formate 'yyyy/MM/dd hh:mm:ss'
 * @return {string} x string return.
 */
export function formatDate(date, fmt) {
  if (!date) return '';
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  let padLeftZero = function(str) {
    return ('00' + str).substr(str.length);
  };
  
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

/**
 * @desc 播放全屏
 * @date 2018-02-10 16:24:07
 */
export const requestFullScreen = () => {
  var de = document.documentElement;
  if (de.requestFullscreen) {
    de.requestFullscreen();
  } else if (de.mozRequestFullScreen) {
    de.mozRequestFullScreen();
  } else if (de.webkitRequestFullScreen) {
    de.webkitRequestFullScreen();
  }
};

/**
 * @desc 退出全屏
 * @date 2018-02-10 16:24:20
 */
export const exitFullscreen = () => {
  var de = document;
  if (de.exitFullscreen) {
    de.exitFullscreen();
  } else if (de.mozCancelFullScreen) {
    de.mozCancelFullScreen();
  } else if (de.webkitCancelFullScreen) {
    de.webkitCancelFullScreen();
  }
};

/**
 * 秒转化为时分秒
 */
/**
 * @desc 秒转化为时分秒
 * @date 2018-02-10 16:24:47
 * @param {number|string} x The number to raise.
 * @return {string} x string return.
 */
export const formatTime = (msd) => {
  var time = parseFloat(msd) / 1000;
  let changedTime = '';
  if (time) {
    if (time > 60 && time < 60 * 60) {
      changedTime = parseInt(time / 60.0) + '分钟' +
        parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60) + '秒';
    } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
      changedTime = parseInt(time / 3600.0) + '小时' + parseInt((parseFloat(time / 3600.0) -
        parseInt(time / 3600.0)) * 60) + '分钟' +
        parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
          parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + '秒';
    } else {
      changedTime = parseInt(time) + '秒';
    }
  }
  return changedTime;
};

/**
 * @desc 秒转换为hh:mm:ss
 * @date 2018-02-10 16:08:56
 * @param {number|string} 秒
 * @return {string} 返回hh:mm:ss时间
 */
export const timeFormat = (a) => {
  if (a && a > 0) {
    var hh = parseInt(a / 3600);
    if (hh < 10) hh = '0' + hh;
    var mm = parseInt((a - hh * 3600) / 60);
    if (mm < 10) mm = '0' + mm;
    var ss = parseInt((a - hh * 3600) % 60);
    if (ss < 10) ss = '0' + ss;
    var length = hh.toString() + mm.toString() + ss.toString();
  }
  return length;
};

/**
 * @desc 检查是否是移动端（Mobile）、ipad、iphone、微信、QQ等
 * @date 2018-02-10 16:01:21
 * @return {Object}  返回browser对象
 */
export const userAgent = () => {
  let u = navigator.userAgent;
  let browser = {
    trident: u.indexOf('Trident') > -1, //IE内核
    presto: u.indexOf('Presto') > -1, //opera内核
    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1, //是否iPad
    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
    weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
    qq: u.match(/\sQQ/i) === ' qq' //是否QQ
  };
  return browser;
};

/**
 * @desc 获取url参数
 * @date 2018-02-10 15:59:54
 * @return {Object} 参数对象
 */
export const getQueryString = () => {
  let search = window.location.href.split('?')[1];
  let reg = /([^&|=]+)=([^&|=]*)/g;
  let queryObj = {};
  search && search.replace(reg, function(p, p1, p2) {
    queryObj[p1] = p2;
    return p;
  });
  return queryObj;
};

/**
 * @desc 数组去重
 * @date 2018-02-10 15:55:00
 * @param {Array}
 * @return {*}
 */
export const unique = (arr) => {
  if (!(arr instanceof Array)) {
    return;
  }
  if (arr instanceof Array && arr.length === 0) {
    return;
  }
  let res = [];
  let json = {};
  for (let i = 0; i < arr.length; i++) {
    if (!json[arr[i]]) {
      res.push(arr[i]);
      json[arr[i]] = 1;
    }
  }
  return res;
};

/**
 * @desc 字数限制 ...
 * @date 2018-02-10 15:39:53
 * @param {string} a string text
 * @param {number} a number of limit count
 * @return {string} 处理后的字符
 */
export const wordLimit = (text, num) => {
  let des = text.toString();
  if (des.length > num) {
    des = des.substring(0, num) + '...';
    return des;
  }
  return des;
};

/**
 * @desc 微信授权页面
 * @date 2018-02-10 15:35:52
 * @param {string} example this.$router.resolve({path: '/home'}).href
 * @return {string} 微信授权页面地址
 */
export const getWXUrl = (url) => {
  let origin = window.location.origin + window.location.pathname;
  url = `${origin}${url}`;
  let appid = 'wxf24d72db02fede73';
  let redirect_uri = url && encodeURIComponent(url);
  let response_type = 'code';
  let scope = 'snsapi_base';
  let wechatUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}#wechat_redirect`;
  return wechatUrl;
};
