/**
* 修改密码
*/
<template>
  <div class="change_pwd container_top">
    <!--头部-->
    <header-fix title="修改密码" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <div class="change_mobile_list">
      <div class="change_mobile_item">
        <input class="old_pwd" v-model="sendData.OldPassword" type="password" placeholder="输入旧密码"/>
      </div>
      <div class="change_mobile_item newPwd">
        <input class="new_pwd" v-model="sendData.Password" type="password" placeholder="输入新密码(6~16个字符)"/>
        <span class="error" :class="!isPassPassword&&'active'">密码格式有误</span>
      </div>
      <div class="change_mobile_item">
        <input class="confirm_pwd" v-model="confirmPwd" type="password" placeholder="确认新密码"/>
      </div>
    </div>
    <div class="submit_edit">
      <mt-button type="primary" size="large" @click.native="updatePwd">提交</mt-button>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { MessageBox, Toast, Button } from 'mint-ui'
  import { headerFix } from '../components'
  import { goBack } from '../service/mixins'
  import { SetUserPassword } from '../service/getData'

  Vue.component(Button.name, Button)
  export default {
    mixins: [goBack],
    data () {
      return {
        sendData: {
          OldPassword: '',
          Password: ''
        },
        confirmPwd: '',
        isPassConfirm: false,
        isPassPassword: true,
      }
    },
    components: {
      headerFix
    },
    methods: {
      async updatePwd () {
        if (!this.sendData.OldPassword) {
          Toast({message: '输入旧密码', position: 'bottom'})
        } else if (!this.sendData.Password) {
          Toast({message: '请输入新密码', position: 'bottom'})
        } else if (!this.isPassPassword) {
          Toast({message: '密码格式有误', position: 'bottom'})
        } else if (this.sendData.OldPassword == this.sendData.Password) {
          Toast({message: '新旧密码不能一致', position: 'bottom'})
        } else if (!this.isPassConfirm) {
          Toast({message: '两次输入新密码不一致', position: 'bottom'})
        } else {
          let data = await SetUserPassword(this.sendData)
          if (data.Type == 1) {
            Toast({message: '修改成功,请重新登陆', position: 'bottom'})
            this.$router.push('/login')
          } else if (data.Type != 401) {
            MessageBox('警告', data.Message)
          }
        }
      },
    },
    watch: {
      confirmPwd: function (val) {
        if (val == this.sendData.Password) {
          this.isPassConfirm = true
        } else {
          this.isPassConfirm = false
        }
      },
      'sendData.Password': {
        handler (newValue, oldValue) {
          let trimPwd = newValue.replace(/\s+/g, '')
          if (trimPwd && trimPwd.length >= 6 && trimPwd.length <= 16) {
            this.isPassPassword = true
          } else {
            this.isPassPassword = false
          }
        },
        deep: true
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .change_pwd {
    background-color: $fill-body;
    .change_mobile_item {
      background-color: $fill-base;
      margin-top: rem75(20px);
      input {
        display: inline-block;
        width: 100%;
        padding: rem75(30px);
        line-height: 1.2em;
      }
    }
    .submit_edit {
      margin-top: rem75(50px);
      padding: 0 rem75(30px);
    }
    .newPwd {
      position: relative;
      .error {
        position: absolute;
        right: rem75(-150px);
        top: rem75(28px);
        color: $brand-error;
        transition: all 0.5s;
        &.active {
          right: rem75(50px);
        }
      }
    }
  }
</style>
