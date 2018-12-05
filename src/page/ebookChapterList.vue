/**
* 图书章节
*/
<template>
  <div class="ebook_chapter container_top">
    <!--头部-->
    <header-fix :title="bookName" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <section v-infinite-scroll="getChapter"
             infinite-scroll-immediate-check="immediate"
             infinite-scroll-disabled="loading"
             infinite-scroll-distance="10">
      <ul class="ebook_chapter_list">
        <li class="ebook_chapter_item"
            v-for="(item,index) in bookChapterData"
            :key="item.BookTitelId"
            @click="goDetail(item.BookTitelId,index+1)"
        >
          {{item.Title}}
        </li>
      </ul>
    </section>
    <div class="noDataBg" v-if="noDataBg"></div>
    <div class="no-data" v-if="noData">没有更多内容了...</div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Indicator, InfiniteScroll } from 'mint-ui'
  import { GetBookChapterInfoList } from '../service/getData'
  import { headerFix } from '../components'
  import { goBack } from '../service/mixins'
  import { getStore } from '../plugins/utils'

  Vue.use(InfiniteScroll)
  export default {
    mixins: [goBack],
    data () {
      return {
        bookId: '',
        bookName: '',
        bookChapterData: [],
        page: 1,
        immediate: false,
        loading: false,
        noDataBg: false,
        noData: false,
      }
    },
    created () {
      this.bookId = this.$route.query.id
      this.bookName = getStore('bookName')
    },
    mounted () {
      this.getChapter()
    },
    components: {
      headerFix
    },
    methods: {
      //图书章节
      async getChapter () {
        this.noData = false
        this.noDataBg = false
        this.loading = true
        Indicator.open()
        let data = await GetBookChapterInfoList({Page: this.page, BookId: this.bookId})
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
          this.bookChapterData = this.bookChapterData.concat(list)
          this.loading = false
          this.page += 1
        }
      },
      goDetail (id, index) {
        this.$router.push({path: '/ebookDetail', query: {id, index}})
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .ebook_chapter {
    .ebook_chapter_list {
      padding: 0 rem75(30px);
      background-color: $fill-base;
    }
    .ebook_chapter_item {
      padding: rem75(20px) 0;
      line-height: rem75(40px);
      border-bottom: 1px solid $border-color-light;
      font-size: 12px;
    }
  }
</style>
