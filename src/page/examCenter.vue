/**
* 考试中心
*/
<template>
  <div class="examCenter container_both">
    <header-fix :title="examTitle" fixed>
      <a slot="left" @click="toggleNav">
        <i class="webapp webapp-category"></i>
      </a>
      <div slot="right" class="clearfix">
        <router-link class="pull-right" to="/examSearch">
          <i class="webapp webapp-search"></i>
        </router-link>
        <a class="filter" @click="toggleFilter">
          <span>筛选</span>
          <i v-if="showFilter" class="webapp webapp-up"></i>
          <i v-if="!showFilter" class="webapp webapp-down"></i>
        </a>
      </div>
    </header-fix>
    <nav-slide :show="showSlide" @showChange="showChange">
      <div slot="left" class="category">
        <tree :data="examCategory"
              :on-select="searchExam"
              :selected-id="typeId"
        >
        </tree>
      </div>
      <div slot="right">
        <section v-infinite-scroll="getExamList"
                 infinite-scroll-immediate-check="immediate"
                 infinite-scroll-disabled="loading"
                 infinite-scroll-distance="10">
          <exam-list :exam-data="examData"
                     :no-data-bg="noDataBg"
                     :no-data="noData">
          </exam-list>
        </section>
      </div>
    </nav-slide>
    <div class="filter_layer" v-if="showFilter" @click="toggleFilter"></div>
    <div class="filter_list" :class="{'show':showFilter}">
      <p class="filter_item filter_title"><span>筛选条件</span></p>
      <p class="filter_item" :class="examType=='All'&&'active'" @click="filterExam('All')">
        <i class="webapp webapp-order" style="color: #00aeff;"></i>
        <span>默认</span>
        <i v-if="examType=='All'" class="webapp webapp-selected"></i>
      </p>
      <p class="filter_item" :class="examType=='Finish'&&'active'" @click="filterExam('Finish')">
        <i class="webapp webapp-smile" style="color: #5fbe81;"></i>
        <span>已过</span>
        <i v-if="examType=='Finish'" class="webapp webapp-selected"></i>
      </p>
      <p class="filter_item" :class="examType=='UnFinish'&&'active'" @click="filterExam('UnFinish')">
        <i class="webapp webapp-cry" style="color: #ee3f3f;"></i>
        <span>未过</span>
        <i v-if="examType=='UnFinish'" class="webapp webapp-selected"></i>
      </p>
      <p class="filter_item" :class="examType=='UnJoin'&&'active'" @click="filterExam('UnJoin')">
        <i class="webapp webapp-cry" style="color: #999999;"></i>
        <span>未考</span>
        <i v-if="examType=='UnJoin'" class="webapp webapp-selected"></i>
      </p>
    </div>
    <footer-fix selected="examCenter"></footer-fix>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Indicator, InfiniteScroll } from 'mint-ui'
  import { headerFix, footerFix, navSlide, tree, examList } from '../components'
  import { GetExamType, GetExamList } from '../service/getData'

  Vue.use(InfiniteScroll)
  export default {
    data () {
      return {
        examTitle: '考试中心',
        showFilter: false, //是否显示筛选
        showSlide: false, //是否显示滑动
        examType: 'All', //筛选type
        examCategory: [],
        typeId: 0, //考试typeId
        examData: [], //考试列表数据
        loading: false,
        immediate: false,
        page: 1,
        noData: false,
        noDataBg: false,
      }
    },
    mounted () {
      this.getExamCategory()
      this.getExamList()
    },
    components: {
      headerFix,
      footerFix,
      navSlide,
      tree,
      examList,
    },
    methods: {
      toggleNav () {
        this.showSlide = !this.showSlide
        this.showFilter = false
      },
      showChange (val) {
        this.showSlide = val
        this.showFilter = false
      },
      toggleFilter () {
        this.showFilter = !this.showFilter
        this.showSlide = false
      },
      //考试分类
      async getExamCategory () {
        let data = await GetExamType()
        if (data.Type == 1) {
          let list = data.Data.List
          let category = list.map((item, index) => {
            return {Name: item.Name, Id: item.Id, ParentId: item.ParentId, Nodes: null}
          })
          this.examCategory = category
        }
      },
      //考试列表
      async getExamList () {
        this.noData = false
        this.noDataBg = false
        this.loading = true
        Indicator.open()
        let data = await GetExamList({ExamType: this.examType, TypeId: this.typeId, Page: this.page})
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
      //点击分类搜索
      searchExam (data) {
        this.page = 1
        this.typeId = data.Id
        this.examTitle = data.Name
        this.showSlide = false
        this.showFilter = false
        this.examData = []
        this.getExamList()
      },
      //点击筛选搜索
      filterExam (type) {
        this.page = 1
        this.showFilter = false
        this.showSlide = false
        this.examType = type
        this.examData = []
        this.getExamList()
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .examCenter {
    width: 100vw;
    height: 100vh;
    .filter {
      @extend %pull-right;
      color: $color-text-reverse;
      font-size: 14px;
      margin-right: rem75(10px);
      width: rem75(110px);
      height: rem75(92px);
      @include flex();
      align-items: center;
      .webapp {
        font-size: 20px;
      }
    }
    .filter_layer {
      position: absolute;
      top: rem75(92px);
      left: 0;
      right: 0;
      height: 100vh;
      background-color: rgba(0, 0, 0, .4);
      z-index: 50;
    }
    .filter_list {
      position: absolute;
      max-height: 0;
      overflow: hidden;
      left: 0;
      right: 0;
      top: rem75(92px);
      z-index: 100;
      background-color: $fill-base;
      font-size: 15px;
      transition: max-height ease 0.5s;
      &.show {
        max-height: rem75(430px);
      }
    }
    .filter_item {
      @include ht-lineHt75(86px);
      padding: 0 rem75(30px);
      span {
        margin-left: rem75(30px);
      }
      img {
        width: rem75(28px);
      }
      .webapp-selected {
        @extend %pull-right;
        font-size: 25px;
        color: $brand-primary;
      }
      &.filter_title {
        background-color: $fill-grey;
        padding: 0;
        color: $color-text-thirdly;
        span {
          margin-left: rem75(30px);
        }
      }
    }
    .tree_title .tran_line {
      background-color: $brand-primary;
    }
  }
</style>
