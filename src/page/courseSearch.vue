/**
* 课程搜索
*/
<template>
  <div class="courseSearch container_top">
    <!--头部-->
    <header-fix title="搜索" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <search v-model="keyword" :search="clickSearch">
      <div slot="history" class="search_history">
        <p class="history_title clearfix">
          <span class="pull-left">历史搜索</span>
          <i class="webapp webapp-delete pull-right" @click="deleteHistory()"></i>
        </p>
        <div class="search_history_list">
          <p v-for="(item,index) in searchHistory"
             class="search_history_item"
             :key="index"
             @click="selectKeyword(item)">
            {{item}}
          </p>
        </div>
      </div>
      <section slot v-infinite-scroll="getCourseList"
               infinite-scroll-immediate-check="immediate"
               infinite-scroll-disabled="loading"
               infinite-scroll-distance="10">
        <course-list :course-data="courseData"
                     :no-data-bg="noDataBg"
                     :no-data="noData">
        </course-list>
      </section>
    </search>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Indicator, InfiniteScroll } from 'mint-ui'
  import { headerFix, search, courseList } from '../components'
  import { GetCourseInfoList } from '../service/getData'
  import { goBack } from '../service/mixins'
  import { getStore, setStore, removeStore, unique } from '../plugins/utils'

  Vue.use(InfiniteScroll)
  export default {
    mixins: [goBack],
    data () {
      return {
        keyword: '',
        oldKeyword: '',
        channelId: 0,
        courseData: [],
        loading: false,
        immediate: false,
        page: 1,
        noData: false,
        noDataBg: false,
        searchHistory: []
      }
    },
    created () {
      let searchHistory = getStore('searchHistory')
      if (searchHistory) {
        this.searchHistory = unique(searchHistory)
      }
    },
    mounted () {

    },
    components: {
      search,
      courseList,
      headerFix,
    },
    methods: {
      async getCourseList () {
        this.noData = false
        this.noDataBg = false
        this.loading = true
        this.oldKeyword = this.keyword //记录搜索keyword
        Indicator.open()
        let data = await GetCourseInfoList({Keyword: this.keyword, ChannelId: this.channelId, Page: this.page})
        if (data.Type == 1) {
          let list = data.Data.List
          Indicator.close()
          if (list.length == 0 && this.page > 1) {
            this.noData = true
            return
          }
          if (list.length == 0 && this.page == 1) {
            this.noDataBg = true
            return
          }
          this.courseData = this.courseData.concat(list)
          this.loading = false
          this.page += 1
        }
      },
      clickSearch () {
        if (this.keyword != this.oldKeyword && !!this.keyword) {
          this.searchHistory.unshift(this.keyword)
          let uniqueHistory = unique(this.searchHistory)
          if (uniqueHistory.length > 7) {
            let newHistory = uniqueHistory.slice(0, 6)
            this.searchHistory = newHistory
            setStore('searchHistory', newHistory)
          } else {
            this.searchHistory = uniqueHistory
            setStore('searchHistory', uniqueHistory)
          }
          this.courseData = []
          this.page = 1
          this.getCourseList()
        }
      },
      /*点击关键词搜索*/
      selectKeyword (key) {
        this.keyword = key
        this.clickSearch()
      },
      /*清除关键词*/
      deleteHistory () {
        removeStore('searchHistory')
        this.searchHistory = []
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .courseSearch {
    background-color: $fill-body;
    overflow: hidden;
    .search_history {
      background-color: $fill-base;
      padding: 0 rem75(20px) rem75(20px);
      .history_title {
        font-size: 13px;
      }
      .webapp-delete {
        color: $color-text-base;
        font-size: 12px;
      }
      .search_history_list {
        @include flex(flex-start);
        flex-wrap: wrap;
        margin-top: rem75(20px);
      }
      .search_history_item {
        padding: rem75(15px) rem75(20px);
        background-color: $fill-body;
        margin-right: rem75(40px);
        font-size: 13px;
        @include borderRadius75(4px);
        color: $color-text-secondary;
        margin-bottom: rem75(10px);
      }
    }
  }
</style>
