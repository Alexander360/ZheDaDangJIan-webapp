<!--班级园地（线下培训班）-->
<template>
  <div class="class_garden container_both">
    <header-fix title="培训列表" fixed>
      <router-link slot="right" :to="{path:'/classSearch',query:{TrainingBaseTypeId:2}}">
        <i class="webapp webapp-search"></i>
      </router-link>
    </header-fix>
    <section v-infinite-scroll="getClassList"
             infinite-scroll-immediate-check="immediate"
             infinite-scroll-disabled="loading"
             infinite-scroll-distance="10">
      <class-list :data="classGardenData" :no-data="noData" :no-data-bg="noDataBg" :class-type="classType"></class-list>
    </section>
    <footer-fix selected="classGarden" fixed></footer-fix>
  </div>
</template>
<script>
  import {Indicator, Navbar, TabItem} from 'mint-ui';
  import Vue from 'vue';
  import {GetTrainingClass} from '../service/getData';
  import {goBack} from '../service/mixins';

  Vue.component(Navbar.name, Navbar);
  Vue.component(TabItem.name, TabItem);
  export default {
    mixins: [goBack],
    data() {
      return {
        typeId: '', //培训班类型
        showFilter: false, //是否显示筛选
        joinStatus: 'Join',//筛选type
        classGardenData: [],
        noDataBg: false,
        noData: false,
        classType: 'offline',
        page: 1
      };
    },
    created() {

    },
    mounted() {
      this.getClassList();
    },
    methods: {
      //班级列表
      async getClassList() {
        this.noDataBg = false;
        Indicator.open();
        let res = await GetTrainingClass({
          TypeId: this.typeId,
          JoinStatus: this.joinStatus,
          Page: this.page,
          TrainingBaseTypeId: 2
        });
        Indicator.close();
        if (res.IsSuccess) {
          let list = res.Data.List;
          if (list.length == 0 && this.page == 1) {
            this.noDataBg = true;
            return;
          }
          if (list.length == 0 && this.page > 1) {
            this.noData = true;
            return;
          }
          this.classGardenData = this.classGardenData.concat(list);
          this.page++;
        }
      }
    },
    watch: {}
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .class_garden {

    .mint-navbar {
      position: fixed;
      top: rem75(92px);
      width: 100%;
      z-index: 100;
    }

    .filter {
      @extend %pull-left;
      color: $color-text-reverse;
      font-size: 14px;
      margin-right: rem75(10px);
      width: rem75(110px);
      height: rem75(92px);
      line-height: rem75(92px);
      @include flex();
      align-items: center;

      .webapp {
        font-size: 20px;
      }
    }

    .search {
      width: rem75(39px);
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
      }

      &.filter_title {
        background-color: $fill-grey;
        padding: 0;

        span {
          margin-left: rem75(30px);
        }
      }
    }
  }
</style>
