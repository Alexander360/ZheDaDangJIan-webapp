/**
 * filter
 */
import Vue from 'vue';
import {formatDate} from '../plugins/utils';

Vue.filter('wordLimit', function(value, num) {
  if (!value) {
    return '';
  }
  let des = '';
  if (value.length > num) {
    des = value.substring(0, num) + '...';
    return des;
  } else {
    return value;
  }
});
Vue.filter('dateFilter', function(value, formate) {
  if (!value) {
    return;
  }
  if (!formate) {
    formate = 'yyyy.MM.dd';
  }
  let timeNum = value.replace(' ', 'T');
  let date = new Date(timeNum);
  return formatDate(date, formate);
});
Vue.filter('dateFilter2', function(value, formate) {
  if (!value) {
    return '';
  }
  let timeNum = value.replace(/[^0-9-]/ig, '');
  let date = new Date(Number(timeNum));
  // console.log(date,formate);
  return formatDate(date, formate);
});
Vue.filter('formatTime', function(a) {
  var mm = parseInt(a / 60);
  if (mm < 10) mm = '0' + mm;
  var ss = parseInt((a - mm * 60) % 60);
  if (ss < 10) ss = '0' + ss;
  var length = mm + ':' + ss;
  if (a > 0) {
    return length;
  } else {
    return 'NaN';
  }
});
Vue.filter('formatTime2', function(a) {
  let ss = parseInt(a % 60);
  if (ss < 10) ss = '0' + ss;
  let mm = parseInt(a / 60 % 60);
  if (mm < 10) mm = '0' + mm;
  let hh = parseInt(a / 60 / 60);
  if (hh < 10) hh = '0' + hh;
  let value = hh + ':' + mm + ':' + ss;
  if (a > 0) {
    return value;
  } else {
    return a;
  }
});
Vue.filter('date', function(val, format) {
  if (val instanceof Date) {
    let year = val.getFullYear();
    let month = val.getMonth() + 1;
    let date = val.getDate();
    let hour = val.getHours();
    let minutes = val.getMinutes();
    let seconds = val.getSeconds();
    format = format.replace(/yyyy/, year);
    format = format.replace(/MM/, month >= 10 ? month : '0' + month);
    format = format.replace(/dd/, date >= 10 ? date : '0' + date);
    format = format.replace(/hh/, hour >= 10 ? hour : '0' + hour);
    format = format.replace(/mm/, minutes >= 10 ? minutes : '0' + minutes);
    format = format.replace(/ss/, seconds >= 10 ? seconds : '0' + seconds);
    return format;
  }
  return val;
});
