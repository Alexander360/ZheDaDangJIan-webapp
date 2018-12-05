<template>
  <div class="footerFix">
    <mt-tabbar :value="selected" fixed>
      <mt-tab-item id="home" href="#/home">
        <img class="footer_icon_1" v-if="selected == 'home'" slot="icon" src="../assets/footer_ico_1_active.png">
        <img class="footer_icon_1" v-else slot="icon" src="../assets/footer_ico_1.png">
        主页
      </mt-tab-item>
      <mt-tab-item id="classGarden" href="#/classGarden">
        <img class="footer_icon_2" v-if="selected == 'classGarden'" slot="icon" src="../assets/footer_ico_2_active.png">
        <img class="footer_icon_2" v-else slot="icon" src="../assets/footer_ico_2.png">
        培训报名
      </mt-tab-item>
      <mt-tab-item id="onlinePartySchool" href="#/onlinePartySchool">
        <img class="footer_icon_3" v-if="selected == 'onlinePartySchool'" slot="icon" src="../assets/footer_ico_3_active.png">
        <img class="footer_icon_3" v-else slot="icon" src="../assets/footer_ico_3.png">
        网上党校
      </mt-tab-item>
      <mt-tab-item id="personalCenter" href="#/personalCenter">
        <img class="footer_icon_4" v-if="selected == 'personalCenter'" slot="icon" src="../assets/footer_ico_4_active.png">
        <img class="footer_icon_4" v-else slot="icon" src="../assets/footer_ico_4.png">
        我的
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>
<script>
  import {Tabbar, TabItem} from 'mint-ui';
  import Vue from 'vue';

  Vue.component(Tabbar.name, Tabbar);
  Vue.component(TabItem.name, TabItem);
  export default {
    name: 'footerFix',
    props: ['selected']
  };
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .footerFix {
    .mint-tab-item-icon {
      .webapp {
        font-size: 24px;
      }
    }

    .mint-tabbar > .mint-tab-item.is-selected {
      background-color: #fff;
      color: $brand-primary;
      border-top: 1px solid #e1e1e1;
    }

    .mint-tab-item {
      padding: rem64(14px) 0;
      height: rem64(110px);
    }

    .mint-tab-item-icon {
      width: rem64(44px);
      height: rem64(44px);
      margin: 0 auto 0;

      & > {
        img {
          @include square64(44px);
          margin: 0 auto;
        }
      }
    }

    .mint-tab-item-label {
      font-size: rem64(22px);
      line-height: 2;
    }
  }
</style>
