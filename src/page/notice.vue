/**
* 站内信
*/
<template>
  <div class="notice_center container_top">
    <!--头部-->
    <header-fix title="站内信" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
      <span slot="right" @click.stop="toggleWrite">写信</span>
    </header-fix>
    <!--<section v-if="tabId=='0'"
             v-infinite-scroll="getNoticeInfoList"
             infinite-scroll-immediate-check="immediate"
             infinite-scroll-disabled="loading"
             infinite-scroll-distance="10">
    </section>-->
    <notice-list v-if="tabId === '0'" :notice-data="noticeData1.List"
                 :no-data-bg="noDataBg1"
                 :no-data="noData1">
    </notice-list>
    <notice-list v-if="tabId === '1'" :notice-data="noticeData2.List"
                 :no-data-bg="noDataBg2"
                 :no-data="noData2">
    </notice-list>

    <div class="notice_bottom">
      <span class="send" :class="tabId === '0' && 'active'"
            @click="changeTabId('0')">收件箱({{noticeData1.ToCount}})</span>
      <span class="accept" :class="tabId === '1' && 'active'"
            @click="changeTabId('1')">发件箱({{noticeData1.FromCount}})</span>
    </div>
    <!--写信-->
    <transition name="slide-left">
      <div class="write_edit container_top" v-if="showWrite">
        <!--头部-->
        <header-fix slot="header" title="写信" fixed>
          <span slot="left" @click="toggleWrite">取消</span>
          <span slot="right" @click="sendWrite">发送</span>
        </header-fix>
        <div class="write_body">
          <div class="write_item" @click="toggleSendPerson">
            <span class="write_label">收件人:</span>
            <span class="likeInput">{{sendInfo.UserName}}</span>
            <input style="display: none;" type="text" v-model="sendInfo.UserName">
          </div>
          <div class="write_item">
            <span>主&nbsp;&nbsp;&nbsp;&nbsp;题:</span>
            <input type="text" v-model="sendInfo.MessageTitle">
          </div>
          <div class="write_item">
            <textarea v-model="sendInfo.MessageContent" placeholder="在此输入消息内容，输入完毕点击发送！"></textarea>
          </div>
        </div>
      </div>
    </transition>
    <!--收件人-->
    <transition name="slide-left">
      <div class="recipients container_top" v-if="showRecipients">
        <!--头部-->
        <header-fix slot="header" title="收件人" fixed>
          <i class="webapp webapp-left" @click.stop="toggleSendPerson" slot="left"></i>
        </header-fix>
        <mt-search v-model="recipientsName">
          <div class="recipients_list">
            <p class="recipients_title">联系人</p>
            <div class="recipients_item"
                 v-for="(item,index) in recipientsList"
                 @click="selectRecipients(item)"
                 :key="index">
              <error-img :src="item.Img" :error-src="male"></error-img>
              <span class="name">{{item.UserName}}（用户名：{{item.Acount}}）</span>
            </div>
            <p class="noData" v-if="showNoRecipientsData">未找到搜索的收件人</p>
          </div>
        </mt-search>
      </div>
    </transition>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Indicator, InfiniteScroll, Toast, Search } from 'mint-ui'
  import { headerFix, noticeList, errorImg } from '../components'
  import { goBack } from '../service/mixins'
  import male from '../assets/male.png'
  import {
    GetUserMessage,
    GetUserByName,
    AddUserMessage
  } from '../service/getData'

  Vue.use(InfiniteScroll)
  Vue.component(Search.name, Search)
  export default {
    mixins: [goBack],
    data () {
      return {
        tabId: '0',
        loading: false,
        immediate: false,
        noticeData1: {},
        noDataBg1: false,
        noData1: false,
        noticeData2: {},
        noDataBg2: false,
        noData2: false,
        /*写信*/
        showWrite: false,
        sendInfo: {
          ToUser: '',
          MessageTitle: '',
          MessageContent: '',
          UserName: ''
        },
        /*收件人*/
        showRecipients: false,
        recipientsName: '',
        male,
        recipientsList: [],
        showNoRecipientsData: false
      }
    },
    mounted () {
      this.getNoticeInfoList('0')
      this.getNoticeInfoList('1')
    },
    components: {
      headerFix,
      noticeList,
      errorImg,
    },
    methods: {
      /*获取站内信*/
      async getNoticeInfoList (MessageType) {
        this.noDataBg1 = false
        this.noDataBg2 = false
        Indicator.open()
        let data = await GetUserMessage({MessageType})
        Indicator.close()
        if (data.Type == 1) {
          let list = data.Data
          if (MessageType === '0') {
            if (list.List.length == 0) {
              this.noDataBg1 = true
            }
            this.noticeData1 = list
          } else {
            if (list.List.length == 0) {
              this.noDataBg2 = true
            }
            this.noticeData2 = list
          }
        }
      },
      /*根据用户名查询用户*/
      async getUserByName (UserName) {
        this.showNoRecipientsData = false
        let data = await GetUserByName({UserName})
        if (data.Type === 1) {
          this.recipientsList = data.Data
          if (data.Data.length === 0) {
            this.showNoRecipientsData = true
          }
        }
      },
      async addUserMessage (params) {
        let data = await AddUserMessage(params)
        if (data.Type === 1) {
          this.getNoticeInfoList('0')
          this.getNoticeInfoList('1')
          Toast({message: data.Message, position: 'bottom'})
        } else if (data.Type !== 401) {
          Toast({message: data.Message, position: 'bottom'})
        }
      },
      /*发送站内信*/
      sendWrite () {
        if (!this.sendInfo.UserName) {
          Toast({message: '收件人不能为空', position: 'bottom'})
        } else if (!this.sendInfo.MessageTitle) {
          Toast({message: '主题不能为空', position: 'bottom'})
        } else if (!this.sendInfo.MessageContent) {
          Toast({message: '内容不能为空', position: 'bottom'})
        } else {
          this.toggleWrite()
          let sendParams = this.sendInfo
          delete sendParams.UserName
          this.addUserMessage(sendParams)
        }
      },
      toggleWrite () {
        this.showWrite = !this.showWrite
      },
      toggleSendPerson () {
        this.showRecipients = !this.showRecipients
      },
      /*tab切换*/
      changeTabId (tabId) {
        this.tabId = tabId
      },
      selectRecipients (item) {
        this.toggleSendPerson()
        this.sendInfo.ToUser = item.UserId
        this.sendInfo.UserName = item.UserName
      }
    },
    watch: {
      recipientsName (val) {
        val && this.getUserByName(val)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .notice_center {
    /*background-color: $fill-base;*/
    .notice_bottom {
      position: fixed;
      z-index: 10;
      bottom: 0;
      left: 0;
      width: 100%;
      @include flex(space-between);
      background-color: $fill-base;
      font-size: 14px;
      text-align: center;
      span {
        width: 50%;
        padding: rem75(26px) 0;
        color: $brand-primary;
        border-top: 1px solid $brand-primary;
        &.active {
          color: $color-text-reverse;
          background-color: $brand-primary;
        }
      }
    }
    .write_edit {
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: $fill-body;
      .write_body {

      }
      .write_item {
        font-size: 14px;
        padding: 0 rem75(25px);
        background-color: $fill-base;
        vertical-align: middle;
        input {
          display: inline-block;
          width: 83%;
          padding: rem75(25px) rem75(10px);
          line-height: 1.2em;
        }
        border-bottom: 1px solid $border-color-light;
        textarea {
          height: rem75(800px);
          font-size: 12px;
          margin-top: rem75(20px);
          padding: rem75(30px) 0;
        }
        .write_label{
          display: inline-block;
          padding: rem75(22px) 0;
        }
        .likeInput {
          display: inline-block;
          width: 83%;
          padding: rem75(22px) 0;
        }
      }
    }
    .recipients {
      position: fixed;
      z-index: 1200;
      top: 0;
      right: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: $fill-body;
      .mint-search-list {
        padding-top: rem75(180px);
      }
      .recipients_list {
        background-color: $fill-base;
        padding: rem75(20px);
      }
      .recipients_title {
        line-height: rem75(60px);
        border-bottom: 1px solid $border-color-base;
      }
      .recipients_item {
        img {
          width: rem75(90px);
          height: rem75(90px);
        }
        padding: rem75(20px) 0;
        .name {
          margin-left: rem75(20px);
          font-size: 14px;
        }
      }
      .noData {
        text-align: center;
        color: $color-text-thirdly;
        padding: rem75(20px);
      }
    }
  }
</style>
