/**
* 设置
*/
<template>
  <div class="setting container_top">
    <!--头部-->
    <header-fix title="设置" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <div class="cell_list_one">
      <mt-cell title="个人信息修改" is-link to="/userInfoEdit"></mt-cell>
      <!--<mt-cell title="修改手机号码" is-link to="/changeMobile"></mt-cell>-->
      <mt-cell title="修改密码" is-link to="/changePwd"></mt-cell>
    </div>
    <div class="cell_list_two">
      <p class="contact_use">
        <a class="callUs" slot="title" href="tel:0571-28990788">联系我们</a>
        <i class="mint-cell-allow-right"></i>
      </p>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Cell } from 'mint-ui'
  import { headerFix } from '../components'
  import { goBack } from '../service/mixins'

  Vue.component(Cell.name, Cell)
  export default {
    mixins: [goBack],
    components: {
      headerFix
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .setting {
    background-color: $fill-body;
    .cell_list_two {
      margin-top: rem75(20px);
      .contact_use {
        @include ht-lineHt75(96px);
        background-color: $fill-base;
        @include flex();
      }
      .callUs {
        @extend %pull-left;
        width: 90%;
        font-size: 14px;
        padding-left: rem75(50px);
      }
      .mint-cell-allow-right {
        position: relative;
        right: 0;
        &::after {
          width: 0.2rem;
          height: 0.2rem;
        }
      }
    }
  }
</style>
