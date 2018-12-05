<template>
  <div class="userLogin">
    <!--头部-->
    <div class="login_banner">
      <p>登录</p>
    </div>
    <div class="user_login">
      <form>
        <div class="form-group">
          <i class="webapp webapp-account"></i>
          <input v-model="Account" class="form-control" type="text" placeholder="输入用户名/手机号">
          <span class="acError" v-if="acError">用户名不能包含汉字</span>
        </div>
        <div class="form-group">
          <i class="webapp webapp-lock"></i>
          <input v-model="Password" class="form-control" type="password" placeholder="输入密码">
          <span class="pwError" v-if="pwError">密码长度6~16位</span>
        </div>
      </form>
      <div class="checkbox">
        <label>
          <span class="mint-checkbox">
            <input v-model="Remember" type="checkbox" class="mint-checkbox-input">
            <span class="mint-checkbox-core"></span>
          </span>
          <span class="mint-checkbox-label">记住密码</span>&nbsp;
        </label>
        <a class="forget" @click="showForgetMessage">忘记密码？</a>
      </div>
      <mt-button class="login_btn" size="large" type="primary" @click.native="clickLogin">登录</mt-button>
    </div>
  </div>
</template>
<script>
  import CryptoJS from 'crypto-js';
  import {Button, Indicator, MessageBox, Toast} from 'mint-ui';
  import Vue from 'vue';
  import {mapActions, mapState} from 'vuex';
  import {headerFix} from '../components';
  import {getStore, setStore} from '../plugins/utils';
  import {Login, ValidateUser} from '../service/getData';

  Vue.component(Button.name, Button);

  export default {
    name: 'login',
    data() {
      return {
        Account: '',
        Password: '',
        Remember: true,
        Code: '',
        backUrl: '',
        key: 'jy365jy365jy365y',
        iv: '0392039203920300',
        pwError: false,
        acError: false
      };
    },
    components: {
      headerFix
    },
    created() {
      this.Code = this.$route.query.code;
      this.getUserAgent();
    },
    mounted() {
      let backUrl = this.$route.query.currentUrl;
      if (backUrl) {
        this.backUrl = backUrl;
      } else {
        this.backUrl = {name: 'home'};
      }
      this.Account = this.decrypt(localStorage.getItem('a_app'));
      this.Password = this.decrypt(localStorage.getItem('p_app'));
      this.Remember = getStore('remember');
    },
    computed: {
      ...mapState(['userAgent', 'wxLoginUrl', 'wxIndexUrl'])
    },
    methods: {
      ...mapActions(['getUserAgent', 'saveUserInfo']),
      /*登陆*/
      async clickLogin() {
        if (!this.Account || !this.Password) {
          Toast({message: '用户名或密码不能为空', position: 'bottom'});
          return;
        }
        let loginParams = {
          Account: this.Account,
          Password: this.Password,
          Code: this.Code,
          Mac: this.Account
        };
        Indicator.open();
        let res = null;
        /*判断是否在微信环境*/
        if (this.userAgent.weixin) {
          res = await Login(loginParams);
        } else {
          res = await ValidateUser(loginParams);
        }
        Indicator.close();
        if (res.Type == 1) {
          if (this.Remember) {
            this.encrypt('a_app', this.Account);
            this.encrypt('p_app', this.Password);
            setStore('remember', true);
          } else {
            this.encrypt('a_app', '');
            this.encrypt('p_app', '');
            setStore('remember', false);
          }
          this.saveUserInfo(res.Data);
          /*判断 weixin,mobile*/
          if (this.userAgent.weixin) {
            window.location.href = this.wxIndexUrl;
          } else {
            this.$router.replace(this.backUrl);
          }
        } else if (res.Type == 0) {
          MessageBox('警告', res.Message);
        } else {
          MessageBox('警告', res.Message + res.Type);
        }
      },
      /*加密*/
      encrypt(name, value) {
        let encryptText = CryptoJS.AES.encrypt(value, CryptoJS.enc.Utf8.parse(this.key), {
          iv: CryptoJS.enc.Utf8.parse(this.iv),
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        });
        localStorage.setItem(name, encryptText);
      },
      /*解密*/
      decrypt(value) {
        let decryptText = CryptoJS.AES.decrypt(value || ' ', CryptoJS.enc.Utf8.parse(this.key), {
          iv: CryptoJS.enc.Utf8.parse(this.iv),
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8);
        return decryptText;
      },
      toRegister() {
        this.$router.push('/register');
      },
      showForgetMessage() {
        MessageBox.alert('如果忘记密码，请联系本单位联络员或客服0571-28990788', '温馨提示');
      }
    },
    watch: {
      Password(val) {
        if (!val) return;
        let flag = false;
        let length = val.length;
        if (length < 6 || length > 16) {
          flag = true;
        }
        this.pwError = flag;
      },
      Account(val) {
        if (!val) return;
        let flag = 0;
        let reg = /^[\u4e00-\u9fa5]+$/;
        let arr = val.split('');
        for (var i in arr) {
          if (reg.test(arr[i])) {
            flag = true;
            break;
          }
        }
        this.acError = flag;
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import '../style/mixin';

  .userLogin {
    width: 100%;
    height: 100vh;
    background-color: #fff;
    background-image: url("../assets/login_bg.png");
    background-repeat: no-repeat;
    background-position: rem75(176px) rem75(117px);
    background-size: rem75(479px) rem75(390px);

    .login_banner {
      width: 100%;
      text-align: center;
      font-size: rem75(42px);
      line-height: rem75(117px);
    }

    .user_login {
      padding: rem75(327px) rem75(35px) 0 rem75(35px);

      .form-control {
        border: none;
        padding-left: rem75(80px);
        background-color: transparent;
        height: rem75(84px);
      }

      .form-group {
        margin-top: rem75(30px);
        border-bottom: 1px solid $border-color-base;
        position: relative;
        width: 100%;

        .webapp {
          color: $color-text-thirdly;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(50%, -50%);
        }
      }

      .pwError, .acError {
        position: absolute;
        right: rem75(10px);
        top: 0;
        color: $brand-error;
        @include ht-lineHt75(80px);
      }

      .checkbox {
        margin-bottom: rem75(103px);
        color: #000;
        font-size: 14px;

        input[type=checkbox], .mint-checkbox-core {
          width: rem75(28px);
          height: rem75(28px);
          margin: 0;
          border-radius: rem75(4px);
        }

        .mint-checkbox-core::after {
          top: 1px;
          left: 3px;
          width: 5px;
          height: 8px;
        }

        .mint-checkbox-input:checked + .mint-checkbox-core {
          background-color: $brand-wait;
          border-color: $brand-wait;
        }
      }

      .forget {
        @extend %pull-right;
        display: inline-block;
        @include ht-lineHt75(100px);
        color: #000;
      }

      .login_btn {
        font-size: rem75(42px);
        background: linear-gradient(to right, #e51a1e, #b01f24);
      }
    }
  }

</style>
