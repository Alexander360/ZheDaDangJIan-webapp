/**
* 学习档案
*/
<template>
  <div class="learning_portfolio container_top">
    <header-fix title="学习档案" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
      <div slot="right" class="clearfix">
        <span class="filter" @click="toggleFilter">
          <span>排序</span>
          <i v-if="showFilter" class="webapp webapp-up"></i>
          <i v-if="!showFilter" class="webapp webapp-down"></i>
        </span>
      </div>
    </header-fix>
    <section v-infinite-scroll="getLearningData"
             infinite-scroll-immediate-check="immediate"
             infinite-scroll-disabled="loading"
             infinite-scroll-distance="10">
      <portfolio-list :learning-data="learningData" :no-data-bg="noDataBg" :no-data="noData"></portfolio-list>
    </section>
    <div class="filter_layer" v-if="showFilter" @click="toggleFilter"></div>
    <div class="filter_list" :class="{'show':showFilter}">
      <p class="filter_item filter_title"><span>筛选条件</span></p>
      <p class="filter_item" :class="type=='1'&&sort=='desc'&&'active'"
         @click="filterExam({type:'1',order:'desc'})">
        <span>时间降序</span>
        <i v-if="type=='1'&&sort=='desc'" class="webapp webapp-selected"></i>
      </p>
      <p class="filter_item" :class="type=='1'&&sort=='asc'&&'active'"
         @click="filterExam({type:'1',order:'asc'})">
        <span>时间升序</span>
        <i v-if="type=='1'&&sort=='asc'" class="webapp webapp-selected"></i>
      </p>
      <p class="filter_item" :class="type=='0'&&sort=='desc'&&'active'"
         @click="filterExam({type:'0',order:'desc'})">
        <span>学分降序</span>
        <i v-if="type=='0'&&sort=='desc'" class="webapp webapp-selected"></i>
      </p>
      <p class="filter_item" :class="type=='0'&&sort=='asc'&&'active'"
         @click="filterExam({type:'0',order:'asc'})">
        <span>学分升序</span>
        <i v-if="type=='0'&&sort=='asc'" class="webapp webapp-selected"></i>
      </p>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Indicator, InfiniteScroll } from 'mint-ui'
  import { headerFix, portfolioList } from '../components'
  import { GetUserRecordList } from '../service/getData'
  import { goBack } from '../service/mixins'

  Vue.use(InfiniteScroll)
  export default {
    mixins: [goBack],
    data () {
      return {
        showFilter: false,
        sort: 'desc',
        type: '1',
        learningData: [],
        loading: false,
        immediate: false,
        page: 1,
        noData: false,
        noDataBg: false,
      }
    },
    created () {
      
    },
    mounted () {
      this.getLearningData()
    },
    props: [],
    components: {
      headerFix,
      portfolioList,
    },
    computed: {},
    updated () {
      
    },
    methods: {
      async getLearningData () {
        this.noData = false
        this.noDataBg = false
        this.loading = true
        Indicator.open()
        let data = await GetUserRecordList({Page: this.page, OrderType: this.type, OrderDesc: this.sort})
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
          this.learningData = this.learningData.concat(list)
          this.loading = false
          this.page += 1
        }
      },
      toggleFilter () {
        this.showFilter = !this.showFilter
      },
      //点击筛选搜索
      filterExam (obj) {
        this.sort = obj.order
        this.type = obj.type
        this.page = 1
        this.showFilter = false
        this.learningData = []
        this.getLearningData()
      },
    },
    watch: {}
    
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .learning_portfolio {

  }

</style>
