/**
* 修改手机号码
*/
<template>
  <div class="change_mobile container_top">
    <!--头部-->
    <header-fix title="修改手机号码" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <div class="change_mobile_list">
      <div class="change_mobile_item">
        <input class="old_mobile" v-model="sendData.OldMobile" type="text" disabled placeholder="旧手机号"/>
      </div>
      <div class="change_mobile_item">
        <input class="new_mobile" v-model="sendData.NewMobile" type="text" placeholder="输入新的手机号码"/>
        <!--<mt-button type="primary" :disabled="disabledSend" size="small" @click.native="sendMsg">{{messageTitle}}
        </mt-button>-->
      </div>
      <!--<div class="change_mobile_item">
        <input class="code" v-model="sendData.SmgCode" type="text" placeholder="输入验证码"/>
      </div>-->
    </div>
    <div class="submit_edit">
      <mt-button type="primary" size="large" @click.native="updateMobile">提交</mt-button>
    </div>
  </div>
</template>
<script>
  import { MessageBox, Toast } from 'mint-ui'
  import { headerFix } from '../components'
  import { goBack } from '../service/mixins'
  import { UpdateMobile, GetUserInfo, SendMsg } from '../service/getData'

  export default {
    mixins: [goBack],
    data () {
      return {
        userInfo: {},
        sendData: {
          OldMobile: '',
          NewMobile: '',
          SmgCode: '',
        },
        isPassMobile: false,
        messageTitle: '获取验证码',
        disabledSend: false,
        timePromise: null
      }
    },
    mounted () {
      this.getUserInformation()
    },
    components: {
      headerFix
    },
    methods: {
      async getUserInformation () {
        let data = await GetUserInfo()
        if (data.Type == 1) {
          this.userInfo = data.Data
          this.sendData.OldMobile = data.Data.Mobile
        } else if (data.Type != 401) {
          MessageBox('警告', data.Message)
        }
      },
      async sendMsg () {
        if (!this.sendData.NewMobile) {
          Toast({message: '请填写新手机号码', position: 'bottom'})
        } else if (!this.isPassMobile) {
          Toast({message: '新手机号码格式有误', position: 'bottom'})
        } else {
          let data = await SendMsg({MobileNo: this.sendData.NewMobile})
          if (data.Type == 1) {
            Toast({message: '发送成功', position: 'bottom'})
            this.countDown()
          } else if (data.Type != 401) {
            MessageBox('警告', data.Message)
          }
        }
      },
      async updateMobile () {
        if (!this.sendData.NewMobile) {
          Toast({message: '请填写新手机号码', position: 'bottom'})
        } else if (!this.isPassMobile) {
          Toast({message: '新手机号码格式有误', position: 'bottom'})
        } else {
          let data = await UpdateMobile(this.sendData)
          if (data.Type == 1) {
            Toast({message: '修改成功', position: 'bottom', duration: 2000})
          } else if (data.Type != 401) {
            MessageBox('警告', data.Message)
          }
        }
        /* else if (!this.sendData.SmgCode) {
          Toast({message: '请填写验证码', position: 'bottom'})
        } */
      },
      //倒计时
      countDown () {
        let second = 60
        let t = this
        t.timePromise = setInterval(function () {
          if (second <= 0) {
            t.disabledSend = false
            clearInterval(t.timePromise)
            t.timePromise = null
            t.messageTitle = '获取验证码'
          } else {
            t.disabledSend = true
            t.messageTitle = second + '秒'
            second--
          }
        }, 1000, 100)
      }
    },
    watch: {
      'sendData.NewMobile': {
        handler: function (val, oldVal) {
          if (val) {
            let regMobile = /^1[3|4|5|7|8]\d{9}$/
            this.isPassMobile = regMobile.test(val)
          }
        }
      },
    }
    
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .change_mobile {
    background-color: $fill-body;
    .change_mobile_list {
    }
    .change_mobile_item {
      background-color: $fill-base;
      margin-top: rem75(20px);
      .mint-button {
        width: rem75(190px);
      }
      input {
        display: inline-block;
        width: 70%;
        line-height: 1.2em;
        padding: rem75(30px);
      }
    }
    .old_mobile {
      color: $color-text-thirdly;
    }
    .new_mobile {

    }
    .submit_edit {
      margin-top: rem75(50px);
      padding: 0 rem75(30px);
    }
  }
</style>
