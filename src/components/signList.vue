/**
* 签到列表
*/
<template>
  <div class="sign_list">
    <ul>
      <li v-for="(item,index) in signData" :key="index">
        <p class="sign_date">{{item.SignInDate | dateFilter}}</p>
        <div class="sign_am">
          <span>上午</span>
          <span class="class_on_off">(上课)</span>
          <mb-tag v-if="item.AmSignIn.SignFlag == true" type="success">已签</mb-tag>
          <mb-tag v-if="item.AmSignIn.SignFlag == false">未签</mb-tag>
          <span class="finish">上午</span>
          <span class="class_on_off">(下课)</span>
          <mb-tag v-if="item.AmSignOut.SignFlag == true" type="success">已签</mb-tag>
          <mb-tag v-if="item.AmSignOut.SignFlag == false">未签</mb-tag>
        </div>
        <div class="sign_pm">
          <span>下午</span>
          <span class="class_on_off">(上课)</span>
          <mb-tag v-if="item.PmSignIn.SignFlag == true" type="success">已签</mb-tag>
          <mb-tag v-if="item.PmSignIn.SignFlag == false">未签</mb-tag>
          <span class="finish">下午</span>
          <span class="class_on_off">(下课)</span>
          <mb-tag v-if="item.PmSignOut.SignFlag == true" type="success">已签</mb-tag>
          <mb-tag v-if="item.PmSignOut.SignFlag == false">未签</mb-tag>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  import mbTag from './mbTag.vue'

  export default {
    data () {
      return {}
    },
    created () {
    },
    mounted () {
      
    },
    props: {
      signData: {
        type: Array,
        required: true
      }
    },
    components: {
      mbTag
    },
    computed: {},
    updated () {
      
    },
    methods: {},
    watch: {}
    
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .sign_list {
    ul {
      padding: rem75(20px) 0;
      line-height: rem75(40px);
      li {
        padding: rem75(10px) rem75(20px);
        margin-bottom: rem75(20px);
        background-color: $fill-base;
      }
    }
    .sign_or_not {
      color: $brand-error;
      margin-left: rem75(20px);
    }
    .sign_in {
      color: $brand-success;
    }
    .finish {
      margin-left: rem75(95px);
    }
    .sign_date {
      font-size: 14px;
    }
    .class_on_off {
      color: $color-text-thirdly;
    }
    .sign_am, .sign_pm {
      padding: rem75(20px) rem75(50px);
    }
    .mb_tag {
      width: rem75(75px);
      height: rem75(38px);
      line-height: rem75(38px);
      margin-left: rem75(20px);
    }
  }
</style>
