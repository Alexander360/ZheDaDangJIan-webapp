/**
* 消息中心
*/
<template>
  <div class="message container_top">
    <!--头部-->
    <header-fix title="消息中心" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <section v-infinite-scroll="getMessageList"
             infinite-scroll-immediate-check="immediate"
             infinite-scroll-disabled="loading"
             infinite-scroll-distance="10">
      <div class="message_list">
        <div class="message_item" v-for="item in messageData"
             :key="item.Id"
             @click.stop="linkTo(item.Type,item.Id)">
          <div class="message_title" :class="{'read':item.ReadFlag}">{{item.Title}}</div>
          <div class="message_info clearfix">
            <span class="pull-left">{{item.Createdate | dateFilter('yyyy.MM.dd')}}</span>
            <span class="pull-right" v-if="item.Type=='Course'"><i class="webapp webapp-video"
                                                                   style="color: #ee3f3f"></i></span>
          </div>
        </div>
        <div class="noDataBg" v-if="noDataBg"></div>
        <div class="no-data" v-if="noData">没有更多内容了...</div>
      </div>
    </section>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Indicator, InfiniteScroll, MessageBox } from 'mint-ui'
  import { headerFix } from '../components'
  import { goBack, toPlay } from '../service/mixins'
  import { GetMessageCenter, GetCourseDetail } from '../service/getData'

  Vue.use(InfiniteScroll)
  export default {
    mixins: [goBack, toPlay],
    data () {
      return {
        keyword: '',
        messageData: [],
        loading: false,
        immediate: false,
        page: 1,
        noData: false,
        noDataBg: false,
      }
    },
    mounted () {
      this.getMessageList()
    },
    components: {
      headerFix
    },
    methods: {
      //获取消息列表
      async getMessageList () {
        this.noData = false
        this.noDataBg = false
        this.loading = true
        Indicator.open()
        let data = await GetMessageCenter({Keyword: this.keyword, Page: this.page})
        Indicator.close()
        if (data.Type == 1) {
          let list = data.Data.List
          if (list.length == 0 && this.page > 1) {
            this.noData = true
            return
          }
          if (list.length == 0 && this.page == 1) {
            this.noDataBg = true
            return
          }
          this.messageData = this.messageData.concat(list)
          this.loading = false
          this.page += 1
        }
      },
      async getCourseDetail (Id) {
        let data = await GetCourseDetail({Id})
        if (data.Type == 1) {
          this.toPlay(data.Data.CourseType, Id)
        } else if (data.Type != 401) {
          MessageBox('警告', data.Message)
        }
      },
      linkTo: function (type, id) {
        if (type == 'Notice') {
          this.$router.push({path: '/messageDetail', query: {id, title: '消息详情'}})
        } else {
          this.getCourseDetail(id)
        }
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .message {
    background-color: $fill-body;
    .message_list {

    }
    .message_item {
      background-color: $fill-base;
      padding: rem75(25px) rem75(30px);
      border-bottom: 1px solid $border-color-base;
    }
    .message_title {
      margin-bottom: rem75(20px);
      color: $color-text-base;
      &.read {
        color: $color-text-secondary;
      }
    }
    .message_info {
      color: $color-text-secondary;
      img {
        width: rem75(33px);
      }
    }
  }
</style>
