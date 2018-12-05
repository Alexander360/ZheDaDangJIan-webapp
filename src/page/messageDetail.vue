/**
* 消息详情
*/
<template>
  <div class="message_detail container_top">
    <!--头部-->
    <header-fix :title="title" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <div class="articleDet" v-html="messageContent"></div>
  </div>
</template>
<script>
  import {Indicator} from 'mint-ui';
  import {headerFix} from '../components';
  import {GetNoticeInfoContent} from '../service/getData';
  import {goBack} from '../service/mixins';

  export default {
    mixins: [goBack],
    data() {
      return {
        title: '',
        messageContent: '',
        messageId: ''
      };
    },
    created() {
      this.messageId = this.$route.query.id || '';
      this.title = this.$route.query.title || '';
    },
    mounted() {
      this.getMessageContent(this.messageId);
    },
    components: {
      headerFix
    },
    methods: {
      async getMessageContent(Id) {
        Indicator.open();
        let data = await GetNoticeInfoContent({Id});
        Indicator.close();
        let message = data.toString().split('<body>')[1].split('</body>');
        this.messageContent = message[0];
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .message_detail {
    background-color: $fill-base;

    .articleDet {
      font-size: 16px;
      padding: rem75(40px) rem75(20px) rem75(20px) rem75(20px);

      img {
        width: 100%;
      }
    }
  }
</style>
