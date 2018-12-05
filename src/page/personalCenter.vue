/**
* 个人中心
*/
<template>
  <div class="personalCenter container_both">
    <header-fix title="个人中心" fixed></header-fix>
    <div class="personal_container">
      <div class="person_top">
        <img src="../assets/avatar.png" alt="">
        <div class="my_info">
          <h4>{{userInfo.Username}}</h4>
          <div>
            <div>
              <p class="red">{{userInfo.MobileCredit}}</p>
              <p>已获学分</p>
            </div>
            <div>
              <p class="red">{{userInfo.MobileCredit}}</p>
              <p>选课数量</p>
            </div>
            <div>
              <p class="red">{{userInfo.MobileCredit}}</p>
              <p>学分排行</p>
            </div>
          </div>
        </div>
      </div>
      <div class="boundary"></div>
      <div class="personal_center_nav">
        <router-link to="/meetList">
          <img src="../assets/personal_center_nav_1.png" alt="">
          <p>三会一课</p>
        </router-link>
        <router-link to="/rankList">
          <img src="../assets/personal_center_nav_2.png" alt="">
          <p>排行榜</p>
        </router-link>
        <router-link to="/courseCenter">
          <img src="../assets/personal_center_nav_3.png" alt="">
          <p>党费缴纳</p>
        </router-link>
        <router-link to="/myCourse">
          <img src="../assets/personal_center_nav_4.png" alt="">
          <p>学习记录</p>
        </router-link>
        <router-link to="/examHistory">
          <img src="../assets/personal_center_nav_5.png" alt="">
          <p>考试记录</p>
        </router-link>
        <router-link to="/changePwd">
          <img src="../assets/personal_center_nav_6.png" alt="">
          <p>修改密码</p>
        </router-link>
      </div>

      <div class="exit">
        <mt-button v-if="userAgent.weixin" @click.native="exit" type="primary" size="large">解除微信绑定</mt-button>
        <mt-button v-else @click.native="exit" type="primary" size="large">退出登录</mt-button>
      </div>
    </div>

    <footer-fix selected="personalCenter"></footer-fix>
  </div>
</template>
<script>
  import {Button, Cell, MessageBox} from 'mint-ui';
  import Vue from 'vue';
  import {mapActions, mapState} from 'vuex';
  import {footerFix} from '../components';
  import {LoginOut} from '../service/getData';
  import {goBack} from '../service/mixins';

  Vue.component(Cell.name, Cell);
  Vue.component(Button.name, Button);
  export default {
    mixins: [goBack],
    data() {
      return {};
    },
    mounted() {
      this.getUserInformation();
    },
    computed: {
      ...mapState(['userInfo', 'userAgent'])
    },
    components: {
      footerFix
    },
    methods: {
      ...mapActions(['getUserInformation']),
      async exit() {
        let data = await LoginOut();
        if (data.Type == 1) {
          this.$router.push('/login');
          window.localStorage.removeItem('ASPXAUTH');
        } else if (data.Type != 401) {
          MessageBox('警告', data.Message);
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .personalCenter {
    background-image: url("../assets/person_center_bg.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-color: #f0f0f0;

    .header {
      background-color: transparent;
    }

    .personal_container {
      background-color: #fff;
      margin-top: rem64(174px);

      .person_top {
        position: relative;
        margin: 0 auto;
        width: rem64(580px);
        height: rem64(250px);
        padding: rem64(62px) 0 0 0;
        transform: translateY(rem64(-108px));
        background-color: #fff;
        background-image: url("../assets/person_center_bg2.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        border-radius: rem64(20px);
        box-shadow: 0 rem64(10px) rem64(10px) 0 #ddd;

        img {
          position: absolute;
          top: rem75(-57px);
          left: 50%;
          transform: translateX(-50%);
          border: rem64(5px) solid rgba(255, 255, 255, .5);
          border-radius: 50%;
          @include wh64(124px, 114px);
        }

        .my_info {
          h4 {
            font-size: rem64(32px);
            line-height: rem64(70px);
            text-align: center;
          }

          & > div {
            @include flex();

            & > div {
              width: rem64(154px);

              p {
                text-align: center;
                font-size: rem64(22px);
                color: #999;
              }

              .red {
                color: $brand-primary;
                font-size: rem64(30px);
                line-height: rem64(50px);
              }
            }
          }

          .shuxian {
            margin: 0 rem75(15px);
          }
        }
      }

      .boundary {
        height: rem64(20px);
        background-color: #f0f0f0;
        margin-top: rem64(-68px);
      }

      .personal_center_nav {
        @include flex(space-around);
        flex-wrap: wrap;
        padding-bottom: rem64(15px);

        & > a {
          display: block;
          width: 33.33333%;
          padding-top: rem64(40px);
          text-align: center;

          img {
            @include square64(64px);
          }

          p {
            line-height: rem64(70px);
            font-size: rem64(26px);
          }
        }
      }

      .exit {
        padding: rem64(50px) rem64(30px) rem64(10px) rem64(30px);
        background-color: #f0f0f0;

        .mint-button {
          background: linear-gradient(to right, #e51a1e, #b01f24);
          font-size: rem64(30px);
        }
      }
    }

  }
</style>
