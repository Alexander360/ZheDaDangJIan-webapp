/**
* 考试搜索
*/
<template>
  <div class="examSearch container_top">
    <!--头部-->
    <header-fix title="搜索" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <search v-model="keyword" :search="clickSearch">
      <section v-infinite-scroll="getExamList"
               infinite-scroll-immediate-check="immediate"
               infinite-scroll-disabled="loading"
               infinite-scroll-distance="10">
        <exam-list :exam-data="examData"
                   :no-data-bg="noDataBg"
                   :no-data="noData">
        </exam-list>
      </section>
    </search>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Indicator, InfiniteScroll } from 'mint-ui'
  import { headerFix, search, examList } from '../components'
  import { GetExamList } from '../service/getData'
  import { goBack } from '../service/mixins'

  Vue.use(InfiniteScroll)
  export default {
    mixins: [goBack],
    data () {
      return {
        keyword: '',
        oldKeyword: '',
        typeId: 0,
        examType: 'All',
        examData: [],
        loading: false,
        immediate: false,
        page: 1,
        noData: false,
        noDataBg: false,
      }
    },
    components: {
      search,
      examList,
      headerFix,
    },
    methods: {
      //考试列表
      async getExamList () {
        this.noData = false
        this.noDataBg = false
        this.loading = true
        this.oldKeyword = this.keyword //记录搜索keyword
        Indicator.open()
        let data = await GetExamList({
          Keyword: this.keyword,
          ExamType: this.examType,
          TypeId: this.typeId,
          Page: this.page
        })
        Indicator.close()
        if (data.Type == 1) {
          let list = data.Data
          if (list.length == 0 && this.page > 1) {
            this.noData = true
            return
          }
          if (list.length == 0 && this.page == 1) {
            this.noDataBg = true
            return
          }
          this.examData = this.examData.concat(list)
          this.loading = false
          this.page += 1
        }
      },

      clickSearch () {
        if (this.keyword != this.oldKeyword && !!this.keyword) {
          this.examData = []
          this.page = 1
          this.getExamList()
        }
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .examSearch {
    height: 100vh;
    overflow: hidden;
    background-color: $fill-body;
  }
</style>
