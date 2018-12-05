/**
* 打开App
*/
<template>
  <div class="openAppPage">
    <a id="btnOpenApp" href="javascript:void(0);">打开App</a>
  </div>
</template>
<script>
  import { userAgent } from '../plugins/utils'

  export default {
    mixins: [],
    data () {
      return {
        title: '',
        content: '',
        id: '',
        type: '',
        browser: null
      }
    },
    created () {
      let {Title, Content, Id, Type} = this.$route.query
      this.title = Title
      this.content = Content
      this.id = Id
      this.type = Type
      this.browser = userAgent()
    },
    mounted () {
      let link = 'https://afaki8.mlinks.cc/A0BP'
      if (this.title && this.content && this.id && this.type) {
        link += `?Title=${this.title} &Content=${this.content}&Id=${this.id}&Type=${this.type}`
      }
      /*初始化 打开APP*/
      // eslint-disable-next-line
      new Mlink({
        mlink: link,
        button: document.querySelector('a#btnOpenApp'),
//        autoLaunchApp:true,
      })

      if (this.browser.iPhone || this.browser.iPad || this.browser.ios) {
        //window.location.href = "https://dev.sencloud.com.cn/xst";
        //               if(!browser.versions.wechat)
        //               {
        // document.getElementById("btnOpenApp").click();
        //               }
      }
      if (this.browser.android) {
        document.getElementById('btnOpenApp').click()
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .openAppPage {
    background: #3E4652;
    width: 100vw;
    height: 100vh;
    text-align: center;
    @include flex(center);
    align-items: center;
    a {
      padding: rem75(15px) rem75(180px);
      border-radius: 10px;
      border: 2px solid #54BC95;
      color: #54BC95;
      text-align: center;
      font-size: 14px;
    }
  }
</style>
