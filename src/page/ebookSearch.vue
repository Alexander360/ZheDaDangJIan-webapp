/**
* 电子书搜索
*/
<template>
  <div class="ebookSearch">
    <!--头部-->
    <header-fix title="搜索" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <div class="pad_top">
      <search v-model="keyword" :search="clickSearch">
        <section v-infinite-scroll="getEbookList"
                 infinite-scroll-immediate-check="immediate"
                 infinite-scroll-disabled="loading"
                 infinite-scroll-distance="10">
          <!--<ebook-list :data="ebookData" :no-data-bg="noDataBg"></ebook-list>-->
          <div class="ebook_search_list">
            <div class="ebook_item" v-for="item in ebookData" :key="item.BookNameId"
                 @click="goChapterList(item.BookNameId,item.BookName)">
              <img src="../assets/txt.png" alt="">
              <span class="ebook_name">{{item.BookName}}</span>
            </div>
            <div class="noDataBg" v-if="noDataBg"></div>
            <!--<div class="no-data" v-if="noData">没有更多内容了...</div>-->
          </div>
        </section>
      </search>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Indicator, InfiniteScroll } from 'mint-ui'
  import { headerFix, search, ebookList } from '../components'
  import { GetBookInfoList } from '../service/getData'
  import { goBack } from '../service/mixins'
  import { setStore } from '../plugins/utils'

  Vue.use(InfiniteScroll)

  export default {
    mixins: [goBack],
    data () {
      return {
        keyword: '',
        oldKeyword: '',
        ebookData: [],
        loading: false,
        immediate: false,
        page: 1,
        noDataBg: false,
      }
    },
    components: {
      search,
      headerFix,
      ebookList,
    },
    methods: {
      async getEbookList () {
        this.noDataBg = false
        this.loading = true
        this.oldKeyword = this.keyword //记录搜索keyword
        Indicator.open()
        let data = await GetBookInfoList({Keyword: this.keyword, Page: this.page})
        Indicator.close()
        if (data.Type == 1) {
          let list = data.Data.List
          if (list.length == 0 && this.page == 1) {
            this.noDataBg = true
            return
          }
          this.ebookData = this.ebookData.concat(list)
          this.loading = false
          this.page += 1
        }
      },
      clickSearch () {
        if (this.keyword != this.oldKeyword && !!this.keyword) {
          this.ebookData = []
          this.page = 1
          this.getEbookList()
        }
      },
      goChapterList (id, bookName) {
        setStore('bookName', bookName)
        this.$router.push({path: '/ebookChapterList', query: {id}})
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .ebookSearch {
    height: 100vh;
    overflow: hidden;
    background-color: $fill-body;
    .pad_top {
      padding-top: rem75(92px);
    }
    .ebook_search_list {

    }
    .ebook_item {
      @include ht-lineHt75(70px);
      padding: 0 rem75(40px);
      background-color: $fill-base;
      img {
        width: rem75(27px);
        margin-right: rem75(30px);
        vertical-align: middle;
      }
    }
  }
</style>
