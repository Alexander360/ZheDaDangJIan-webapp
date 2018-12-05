/**
* 成果展示搜索
*/
<template>
  <div class="result_show_search container_top">
    <!--头部-->
    <header-fix title="搜索" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <search v-model="keyword" :search="clickSearch">
      <section v-infinite-scroll="getProductionList"
               infinite-scroll-immediate-check="immediate"
               infinite-scroll-disabled="loading"
               infinite-scroll-distance="10">
        <result-show-list :data="productionData" :no-data-bg="noDataBg" :no-data="noData"></result-show-list>
      </section>
    </search>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Indicator, InfiniteScroll } from 'mint-ui'
  import { headerFix, search, resultShowList } from '../components'
  import { GetProductionInfoList } from '../service/getData'
  import { goBack } from '../service/mixins'

  Vue.use(InfiniteScroll)
  export default {
    mixins: [goBack],
    data () {
      return {
        keyword: '',
        oldKeyword: '',
        productionData: [],
        loading: false,
        immediate: false,
        page: 1,
        noData: false,
        noDataBg: false,
      }
    },
    components: {
      search,
      resultShowList,
      headerFix,
    },
    methods: {
      //考试列表
      async getProductionList () {
        this.noData = false
        this.noDataBg = false
        this.loading = true
        this.oldKeyword = this.keyword //记录搜索keyword
        Indicator.open()
        let data = await GetProductionInfoList({
          Keyword: this.keyword,
          Page: this.page
        })
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
          this.productionData = this.productionData.concat(list)
          this.loading = false
          this.page += 1
        }
      },
      clickSearch () {
        if (this.keyword != this.oldKeyword && !!this.keyword) {
          this.productionData = []
          this.page = 1
          this.getProductionList()
        }
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .result_show_search {
    height: 100vh;
    overflow: hidden;
    background-color: $fill-body;
  }
</style>
