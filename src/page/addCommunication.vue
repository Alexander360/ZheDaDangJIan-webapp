/**
* 添加讨论
*/
<template>
  <div class="add_communication container_top">
    <!--头部-->
    <header-fix title="交流评论" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <textarea v-model="content" rows="10" placeholder="输入您想要和大家交流的内容(对所有人显示)"></textarea>
    <div class="com_commit">
      <mt-button @click.native="addDiscuss" type="primary" size="large">提交</mt-button>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Toast, MessageBox, Button } from 'mint-ui'
  import { headerFix } from '../components'
  import { goBack } from '../service/mixins'
  import { AddDiscuss } from '../service/getData'

  Vue.component(Button.name, Button)

  export default {
    mixins: [goBack],
    data () {
      return {
        content: '',
      }
    },
    components: {
      headerFix
    },
    methods: {
      async addDiscuss () {
        if (!this.content) {
          MessageBox('警告', '请填写评论内容')
        } else {
          let data = await AddDiscuss({Content: this.content})
          if (data.Type == 1) {
            Toast({message: data.Message, position: 'bottom'})
            this.content = ''
            this.$router.push('/communication')
          } else if (data.Type != 401) {
            MessageBox('警告', data.Message)
          }
        }
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .add_communication {
    width: 100vw;
    background-color: $fill-body;
    textarea {
      display: block;
      resize: none;
      width: 100vw;
      padding: rem75(20px) rem75(30px);
      font-size: 14px;
    }
    .com_commit {
      padding: rem75(40px);
    }
  }
</style>
