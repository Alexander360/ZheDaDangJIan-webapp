/**
* 新闻搜索
*/
<template>
  <div class="newsSearch container_top">
    <!--头部-->
    <header-fix title="搜索" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <search v-model="keyword" :search="clickSearch">
      <section slot v-infinite-scroll="getArticleList"
               infinite-scroll-immediate-check="immediate"
               infinite-scroll-disabled="loading"
               infinite-scroll-distance="10">
        <news-list :news-data="articleData" :no-data-bg="noDataBg" :no-data="noData"></news-list>
      </section>
    </search>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Indicator, InfiniteScroll } from 'mint-ui'
  import { headerFix, search, newsList } from '../components'
  import { GetArticleInfoList } from '../service/getData'
  import { goBack } from '../service/mixins'

  Vue.use(InfiniteScroll)
  export default {
    mixins: [goBack],
    data () {
      return {
        keyword: '',
        oldKeyword: '',
        categoryId: 0,
        articleData: [],
        loading: false,
        immediate: false,
        page: 1,
        noData: false,
        noDataBg: false,
      }
    },
    mounted () {

    },
    components: {
      search,
      headerFix,
      newsList,
    },
    methods: {
      async getArticleList () {
        this.noData = false
        this.noDataBg = false
        this.loading = true
        this.oldKeyword = this.keyword //记录搜索keyword
        Indicator.open()
        let data = await GetArticleInfoList({Keyword: this.keyword, CategoryId: this.categoryId, Page: this.page})
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
          this.articleData = this.articleData.concat(list)
          this.loading = false
          this.page += 1
        }
      },
      clickSearch () {
        if (this.keyword != this.oldKeyword && !!this.keyword) {
          this.articleData = []
          this.page = 1
          this.getArticleList()
        }
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .newsSearch {
    height: 100vh;
    overflow: hidden;
    background-color: $fill-body;
  }
</style>
