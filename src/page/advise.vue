/**
* 信息反馈
*/
<template>
  <div class="advise container_top">
    <!--头部-->
    <header-fix title="反馈中心" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <div class="advise_type">
      <a v-for="(item) in typeData" class="advise_type_item"
         :key="item.ClassCode"
         :class="{'active':item.ClassCode == adviseType}"
         @click="changeType(item.ClassCode)">
        {{item.ClassName}}
      </a>
    </div>
    <div class="advise_title">
      <input type="text" v-model="adviseTitle" placeholder="输入标题"/>
    </div>
    <div class="advise_content">
      <textarea type="text" rows="10" placeholder="输入您想要反馈的内容" v-model="adviseContent"></textarea>
    </div>
    <div class="advise_submit">
      <mt-button type="primary" size="large" @click.native="addAdvise">提交</mt-button>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { MessageBox, Toast, Button } from 'mint-ui'
  import { headerFix } from '../components'
  import { CommentType, AddMessage } from '../service/getData'
  import { goBack } from '../service/mixins'

  Vue.component(Button.name, Button)
  export default {
    mixins: [goBack],
    data () {
      return {
        adviseType: '',
        adviseTitle: '',
        adviseContent: '',
        typeData: []
      }
    },
    mounted () {
      this.getAdviseType()
    },
    components: {
      headerFix
    },
    methods: {
      //留言类型
      async getAdviseType () {
        let data = await CommentType()
        if (data.Type == 1) {
          this.typeData = data.Data.List
        }
      },
      //添加留言
      async addAdvise () {
        if (!this.adviseTitle) {
          Toast({message: '标题不能为空', position: 'bottom'})
          return
        }
        if (!this.adviseContent) {
          Toast({message: '反馈内容不能为空', position: 'bottom'})
          return
        }
        if (!this.adviseType) {
          Toast({message: '请选择反馈类型', position: 'bottom'})
          return
        }
        let data = await AddMessage({
          Title: this.adviseTitle,
          Content: this.adviseContent,
          ClassCode: this.adviseType
        })
        if (data.Type == 1) {
          Toast({message: '提交成功', position: 'bottom'})
          this.$router.push('personalCenter')
        } else if (data.Type != 401) {
          MessageBox('警告', data.Message)
        }
      },
      /*反馈类型切换*/
      changeType (type) {
        this.adviseType = type
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .advise {
    background-color: $fill-body;
    .advise_type {
      background-color: $fill-base;
      @include flex(center);
      height: rem75(190px);
      align-items: center;
    }
    .advise_type_item {
      display: inline-block;
      width: rem75(160px);
      height: rem75(75px);
      line-height: rem75(75px);
      text-align: center;
      border: 1px solid $color-text-thirdly;
      border-radius: 5px;
      font-size: 12px;
      color: $color-text-thirdly;
      margin: 0 rem75(30px);
      &.active {
        border: 1px solid $brand-primary;
        color: $brand-primary;
      }
    }
    .advise_title {
      margin: rem75(20px) 0;
      background-color: $fill-base;
      input {
        display: block;
        width: 100%;
        font-size: 14px;
        padding: rem75(20px);
        line-height: 1.2em;
      }
    }
    .advise_content {
      background-color: $fill-base;
      textarea {
        display: block;
        padding: rem75(20px);
        width: 100%;
        font-size: 14px;
        resize: none;
      }
    }
    .advise_submit {
      text-align: center;
      padding: rem75(40px) rem75(30px);
    }
  }
</style>
