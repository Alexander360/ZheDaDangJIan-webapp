/**
* 图书内容详情
*/
<template>
  <div class="ebook_detail">
    <!--头部-->
    <transition name="fade">
      <header-fix :title="bookName" fixed v-if="showConfig">
        <div slot="left" class="backEbook" @click.stop="toChapter({path:'ebook'})">
          <i class="webapp webapp-left"></i>
          <span>返回书架</span>
        </div>
      </header-fix>
    </transition>
    <div class="bg_container" :style="{background: bgColor }" @click.stop="toggleShowConfig">
      <div class="content" :style="{fontSize: fontSize + 'rem' }" v-html="detailData.Content"></div>
      <div class="ebook_footer">
        <mt-button v-if="index>1" class="prev" size="small" @click.native.stop="prevChapter()">上一章节
        </mt-button>
        <mt-button class="next" size="small" @click.native.stop="nextChapter()">下一章节</mt-button>
      </div>
    </div>
    <transition name="fade">
      <div v-if="showStyleSetting" class="style_setting">
        <div class="font_setting">
          <em>字号</em>
          <span class="font_large" @click.stop="changeFontSize(0.1)">大</span>
          <span class="font_small" @click.stop="changeFontSize(-0.1)">小</span>
          <span class="default" @click.stop="defaultFontSize">默认</span>
        </div>
        <div class="bg_setting clearfix">
          <span>背景</span>
          <span class="bg_1" @click.stop="changeBgColor('#f6eee3')"></span>
          <span class="bg_2" @click.stop="changeBgColor('#e5dfc5')"></span>
          <span class="bg_3" @click.stop="changeBgColor('#a4a4a4')"></span>
          <span class="bg_4" @click.stop="changeBgColor('#ccf1d0')"></span>
          <span class="bg_5" @click.stop="changeBgColor('#0e150e')"></span>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="showConfig" class="ebook_config">
        <mt-tabbar fixed>
          <mt-tab-item id="ebookChapterList"
                       @click.native="toChapter({path:'ebookChapterList',query:{id:detailData.BookContentId}})">
            <i slot="icon" class="webapp webapp-category"></i>
            目录
          </mt-tab-item>
          <mt-tab-item id="setting" @click.native.stop="toggleStyleSetting">
            <i slot="icon" class="webapp webapp-set"></i>
            设置
          </mt-tab-item>
          <mt-tab-item id="night" @click.native.stop="toggleNight">
            <i v-if="isNight" slot="icon" class="webapp webapp-sun"></i>
            <i v-if="!isNight" slot="icon" class="webapp webapp-moon"></i>
            {{isNight ? "白天" : "夜间"}}
          </mt-tab-item>
        </mt-tabbar>
      </div>
    </transition>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Toast, Button, Tabbar, TabItem } from 'mint-ui'
  import { headerFix } from '../components'
  import { GetBookChapterContent } from '../service/getData'
  import { setStore, getStore } from '../plugins/utils'
  import { goBack } from '../service/mixins'

  Vue.component(Button.name, Button)
  Vue.component(Tabbar.name, Tabbar)
  Vue.component(TabItem.name, TabItem)
  export default {
    mixins: [goBack],
    data () {
      return {
        detailId: '',
        bookName: '',
        index: 1,
        detailData: {},
        showConfig: false,
        showStyleSetting: false,
        isNight: false,//白天夜间
        fontSize: 0.5,//字体大小
        bgColor: '#fff',//切换背景
        nextId: '',
        nextIndex: '',
      }
    },
    components: {
      headerFix
    },
    created () {
      //初始化设置
      let ebookConfig = getStore('ebookConfig')
      if (ebookConfig) {
        this.isNight = ebookConfig.isNight
        this.fontSize = ebookConfig.fontSize
        this.bgColor = ebookConfig.bgColor
      }
      this.bookName = getStore('bookName') || ''
      this.detailId = this.$route.query.id || ''
      this.index = this.$route.query.index || 1
    },
    mounted () {
      window.scrollTo(0, 0)
      this.getChapterContent()
    },
    methods: {
      //图书章节
      async getChapterContent () {
        let data = await GetBookChapterContent({Id: this.detailId})
        if (data.Type == 1) {
          this.detailData = data.Data
        }
      },
      /*返回*/
      toChapter (path) {
        this.$router.replace(path)
      },
      /*显示/隐藏 头尾*/
      toggleShowConfig () {
        this.showConfig = !this.showConfig
        this.showStyleSetting = false
      },
      /*白天/夜间切换*/
      toggleNight () {
        if (this.isNight) {
          this.bgColor = '#f6eee3'
        } else {
          this.bgColor = 'rgba(0, 0, 0, 0.9)'
        }
        this.isNight = !this.isNight
      },
      /*显示/隐藏 设置*/
      toggleStyleSetting () {
        this.showStyleSetting = !this.showStyleSetting
      },
      /*字体大小控制*/
      changeFontSize (step) {
        let newFontSize = this.fontSize + step
        if (newFontSize < 0.3) {
          Toast({message: '字体已最小', position: 'bottom'})
        } else if (newFontSize > 0.7) {
          Toast({message: '字体已最大', position: 'bottom'})
        } else {
          this.fontSize = newFontSize
        }
      },
      /*默认字体大小*/
      defaultFontSize () {
        this.fontSize = 0.5
      },
      /*切换背景*/
      changeBgColor (color) {
        this.bgColor = color
      },
      /*存储个人配置*/
      storeConfig () {
        let config = {
          fontSize: this.fontSize,
          isNight: this.isNight,
          bgColor: this.bgColor,
        }
        setStore('ebookConfig', config)
      },
      /*下一章*/
      nextChapter () {
        this.nextId = parseInt(this.detailId) + 1
        this.nextIndex = parseInt(this.index) + 1
        this.$router.replace({path: '/ebookDetail', query: {id: this.nextId, index: this.nextIndex}})
        window.location.reload()
      },
      /*上一章*/
      prevChapter () {
        this.nextId = parseInt(this.detailId) - 1
        this.nextIndex = parseInt(this.index) - 1
        this.$router.replace({path: '/ebookDetail', query: {id: this.nextId, index: this.nextIndex}})
        window.location.reload()
      }
    },
    watch: {
      fontSize: function (val) {
        this.storeConfig()
      },
      bgColor: function (val) {
        this.storeConfig()
      },
    }
    
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .ebook_detail {
    height: 100vh;
    .header {
      background-color: rgba(0, 0, 0, 0.82);
      .webapp-back {
        font-size: 16px;
      }
    }
    .backEbook {
      color: $color-text-reverse;
      font-size: 16px;
    }
    .bg_container {
      padding: rem75(30px);
      min-height: 100vh;
    }
    .ebook_footer {
      padding-top: rem75(20px);
      padding-bottom: rem75(80px);
      text-align: center;
      @extend %clearfix;
      .mint-button--default {
        color: $color-text-thirdly;
        background-color: rgba(0, 0, 0, 0.82);
      }
      .prev {
        //        @extend %pull-left;
        width: rem75(260px);
      }
      .next {
        //        @extend %pull-right;
        width: rem75(260px);
      }
    }
    .ebook_config {
      .webapp {
        color: $color-text-reverse;
      }
      .mint-tabbar {
        background-color: rgba(0, 0, 0, 0.82);
      }
      .mint-tabbar > .mint-tab-item.is-selected {
        background-color: #eaeaea;
        color: $brand-primary;
      }
      .mint-tab-item {
        padding: rem75(14px) 0;
      }
      .mint-tab-item-icon {
        width: rem75(42px);
        height: rem75(46px);
        margin: 0 auto rem75(5px);
      }
      .mint-tab-item-label {
        font-size: 12px;
        color: $color-text-reverse;
      }
    }
    .content {
      font-size: 0.5rem;
    }
    .style_setting {
      position: fixed;
      bottom: rem75(104px);
      width: 100vw;
      left: 0;
      background: rgba(0, 0, 0, 0.82);
      color: $color-text-reverse;
      .font_setting {
        padding: rem75(15px) 0 rem75(15px) rem75(15px);
        border-bottom: 1px solid #444;
        font-size: 14px;
        span {
          display: inline-block;
          width: rem75(180px);
          @include ht-lineHt75(60px);
          text-align: center;
          border: 1px solid #fff;
          border-radius: rem75(60px);
          margin: 0 rem75(15px);
        }
      }
      .bg_setting {
        padding: rem75(15px) 0 rem75(15px) rem75(15px);
        border-bottom: 1px solid #444;
        font-size: 14px;
        line-height: rem75(75px);
        :first-child {
          margin: 0;
        }
        span {
          float: left;
          @include square75(75px);
          line-height: rem75(75px);
          margin: 0 rem75(20px);
          border-radius: 50%;
        }
        .bg_1 {
          background: #f6eee3;
        }
        .bg_2 {
          background: #e5dfc5;
        }
        .bg_3 {
          background: #a4a4a4;
        }
        .bg_4 {
          background: #ccf1d0;
        }
        .bg_5 {
          background: #0e150e;
        }
      }
    }
  }
</style>
