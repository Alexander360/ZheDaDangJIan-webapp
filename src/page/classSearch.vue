/**
* 班级搜索
*/
<template>
  <div class="classSearch container_top">
    <!--头部-->
    <header-fix title="搜索" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <search v-model="keyword" :search="clickSearch">
      <div slot="history" class="search_result" v-if="totalCount>0">
        <span class="pull-left">共搜索到{{totalCount}}个培训班</span>
        <i class="pull-right webapp webapp-delete" @click="clearResult"></i>
      </div>
      <section v-infinite-scroll="getClassList"
               infinite-scroll-immediate-check="immediate"
               infinite-scroll-disabled="loading"
               infinite-scroll-distance="10">
        <class-list :data="classData" :class-type="classType"
                    :no-data-bg="noDataBg"></class-list>
      </section>
    </search>
  </div>
</template>
<script>
  import {Indicator, InfiniteScroll} from 'mint-ui';
  import Vue from 'vue';
  import {classList, headerFix, search} from '../components';
  import {GetTrainingClass} from '../service/getData';
  import {goBack} from '../service/mixins';

  Vue.use(InfiniteScroll);

  export default {
    mixins: [goBack],
    data() {
      return {
        keyword: '',
        oldKeyword: '',
        classData: [],
        loading: false,
        immediate: false,
        page: 1,
        noDataBg: false,
        TrainingBaseTypeId: 1,
        totalCount: 0,
        classType: 'online'
      };
    },
    components: {
      search,
      headerFix,
      classList
    },
    created() {
      this.TrainingBaseTypeId = this.$route.query.TrainingBaseTypeId;
      this.classType = this.TrainingBaseTypeId == 1 ? 'online' : 'offline';
    },
    methods: {
      /*获取班级列表*/
      async getClassList() {
        this.noDataBg = false;
        this.loading = true;
        this.oldKeyword = this.keyword; //记录搜索keyword
        Indicator.open();
        let data = await GetTrainingClass({
          TrainName: this.keyword,
          Page: this.page,
          TrainingBaseTypeId: this.TrainingBaseTypeId
        });
        Indicator.close();
        if (data.IsSuccess) {
          let list = data.Data.List;
          this.totalCount = data.Data.TotalCount;
          if (list.length == 0 && this.page == 1) {
            this.noDataBg = true;
            return;
          }
          this.classData = this.classData.concat(list);
          this.loading = false;
          this.page += 1;
        }
      },
      clickSearch() {
        if (this.keyword != this.oldKeyword && !!this.keyword) {
          this.classData = [];
          this.page = 1;
          this.getClassList();
        }
      },
      clearResult() {
        this.totalCount = 0;
        this.classData = [];
        this.noDataBg = false;
        this.page = 1;
        this.keyword = '';
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .classSearch {
    background-color: #fff;
    overflow: hidden;

    .header {
      background-color: #fff;
      border-bottom: 1px solid #ddd;

      .webapp, .header_title {
        color: #000;
      }
    }

    .search_result {
      padding: 0 rem64(30px);
      color: $color-text-thirdly;
      @extend %clearfix;

      .webapp {
        color: $color-text-thirdly;
      }
    }
  }
</style>
