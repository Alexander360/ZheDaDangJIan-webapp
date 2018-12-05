/**
* 搜索
*/
<template>
  <div class="search_com">
    <div class="search_bar">
      <input type="text" v-model="currentValue" @keyup.13="search" :placeholder="placeholder"/>
      <mt-button size="small" type="primary" @click.native="search">
        搜索
      </mt-button>
    </div>
    <slot name="history"></slot>
    <div class="search-list">
      <slot></slot>
    </div>
  </div>

</template>
<script>
  import {Button} from 'mint-ui';
  import Vue from 'vue';

  Vue.component(Button.name, Button);
  export default {
    data() {
      return {
        currentValue: this.value
      };
    },
    props: {
      value: String,
      placeholder: {
        default: '输入关键词搜索'
      },
      search: Function
    },
    watch: {
      currentValue(val) {
        this.$emit('input', val);
      },
      value(val) {
        this.currentValue = val;
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .search_com {
    .search_bar {
      padding: rem75(20px) rem64(30px);
      background: #fff;
      @extend %clearfix;
      position: relative;

      &:before {
        position: absolute;
        top: 50%;
        left: rem64(38px);
        width: 4px;
        height: rem64(40px);
        background-color: $brand-primary;
        visibility: visible;
        transform: translateY(-50%);
        border-radius: rem64(4px);
      }

      input {
        @extend %pull-left;
        width: 7.1rem;
        height: rem64(60px);
        padding: rem75(15px) rem75(30px) rem75(15px) rem75(30px);
        background: $fill-body;
        font-size: 14px;
        @include borderRadius75(10px);
      }

      .mint-button--primary {
        @extend %pull-left;
        margin-left: rem64(20px);
        width: rem75(120px);
        height: rem64(60px);
        background-color: $brand-primary;
      }
    }

    .search-list {
      margin-top: rem75(20px);
    }
  }
</style>
