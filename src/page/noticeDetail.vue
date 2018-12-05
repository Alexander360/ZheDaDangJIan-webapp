/**
* 消息详情
*/
<template>
  <div class="notice_detail container_top">
    <!--头部-->
    <header-fix :title="title" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <div class="notice_title">{{messageData.MessageTitle}}</div>
    <div class="notice_desc">
      <span class="send_person">发送人：{{messageData.FromUserName}}</span>
      <span class="send_date">发布日期：{{messageData.SendTime | dateFilter}}</span>
    </div>
    <div class="articleDet" v-html="messageData.MessageContent"></div>
  </div>
</template>
<script>
  import { Indicator } from 'mint-ui'
  import { headerFix } from '../components'
  import { goBack } from '../service/mixins'
  import { GetMessage } from '../service/getData'

  export default {
    mixins: [goBack],
    data () {
      return {
        title: '消息详情',
        messageData: {},
        messageId: ''
      }
    },
    created () {
      this.messageId = this.$route.query.id || ''
    },
    mounted () {
      this.getMessageContent(this.messageId)
    },
    components: {
      headerFix
    },
    methods: {
      async getMessageContent (MessageId) {
        Indicator.open()
        let data = await GetMessage({MessageId})
        Indicator.close()
        if (data.Type === 1) {
          this.messageData = data.Data
        }
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .notice_detail {
    background-color: $fill-base;
    .articleDet {
      width: 100%;
      overflow: hidden;
      font-size: 16px;
      padding: rem75(40px) rem75(20px) rem75(20px) rem75(20px);
    }
    .notice_title {
      padding: rem75(20px) rem75(20px);
      font-size: 20px;
      font-weight: 600;
    }
    .notice_desc {
      @extend %clearfix;
      color: $color-text-thirdly;
      padding: 0 rem75(20px);
      .send_person {
        @extend %pull-left;
      }
      .send_date {
        @extend %pull-right;
      }
    }
  }
</style>
