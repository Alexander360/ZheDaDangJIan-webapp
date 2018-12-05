/**
* 排行傍
*/
<template>
  <div class="rankList container_top">
    <!--头部-->
    <header-fix title="排行榜" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <mt-navbar v-model="selected">
      <mt-tab-item id="1">学员排名</mt-tab-item>
      <mt-tab-item id="2">支部排名</mt-tab-item>
      <mt-tab-item id="3">课程排名</mt-tab-item>
    </mt-navbar>

    <!-- tab-container -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <table class="table">
          <thead class="fixed_rank_title">
            <tr>
              <th class="rank">排名</th>
              <th class="student">姓名</th>
              <th class="credit">学分</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in studentData" :key="item.index">
              <td v-if="index<3" class="rank"
                  :class="{'rank_bg_one':index==0,'rank_bg_two':index==1,'rank_bg_three':index==2,}"></td>
              <td v-if="index>=3" class="rank">{{item.index}}</td>
              <td class="student">{{item.name}}</td>
              <td class="credit">{{item.value}}</td>
            </tr>
          </tbody>
        </table>
        <div class="noDataBg" v-if="noDataBg1"></div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <table class="table">
          <thead class="fixed_rank_title">
            <tr>
              <th class="rank">排名</th>
              <th class="student">支部</th>
              <th class="credit">平均学分</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in groupData" :key="item.index">
              <td v-if="index<3" class="rank"
                  :class="{'rank_bg_one':index==0,'rank_bg_two':index==1,'rank_bg_three':index==2,}"></td>
              <td v-if="index>=3" class="rank">{{item.index}}</td>
              <td class="student">{{item.name}}</td>
              <td class="credit">{{item.value}}</td>
            </tr>
          </tbody>
        </table>
        <div class="noDataBg" v-if="noDataBg2"></div>
      </mt-tab-container-item>
      <mt-tab-container-item id="3">
        <table class="table">
          <thead class="fixed_rank_title">
            <tr>
              <th class="rank">排名</th>
              <th class="student">课程名称</th>
              <th class="credit">次数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in courseData" :key="item.index">
              <td v-if="index<3" class="rank"
                  :class="{'rank_bg_one':index==0,'rank_bg_two':index==1,'rank_bg_three':index==2}"></td>
              <td v-if="index>=3" class="rank">{{item.index}}</td>
              <td class="student">{{item.name|wordLimit(20)}}</td>
              <td class="credit">{{item.value}}</td>
            </tr>
          </tbody>
        </table>
        <div class="noDataBg" v-if="noDataBg3"></div>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>
<script>
  import {Navbar, TabContainer, TabContainerItem, TabItem} from 'mint-ui';
  import Vue from 'vue';
  import {headerFix} from '../components';
  import {GetRankInfoList} from '../service/getData';
  import {goBack} from '../service/mixins';

  Vue.component(Navbar.name, Navbar);
  Vue.component(TabItem.name, TabItem);
  Vue.component(TabContainer.name, TabContainer);
  Vue.component(TabContainerItem.name, TabContainerItem);
  export default {
    mixins: [goBack],
    data() {
      return {
        selected: '1',
        studentData: [],
        courseData: [],
        groupData: [],
        noDataBg1: false,
        noDataBg2: false,
        noDataBg3: false
      };
    },
    mounted() {
      this.getRankList('1');
      this.getRankList('2');
      this.getRankList('3');
    },
    components: {
      headerFix
    },
    methods: {
      //排行榜
      async getRankList(RankType) {
        let data = await GetRankInfoList({RankType, TotalCount: 10});
        if (data.Type == 1) {
          if (RankType == '1') {
            this.studentData = data.Data.List;
            if (data.Data.List.length == 0) {
              this.noDataBg1 = true;
            }
          } else if (RankType == '2') {
            this.courseData = data.Data.List;
            if (data.Data.List.length == 0) {
              this.noDataBg3 = true;
            }
          } else if (RankType == '3') {
            this.groupData = data.Data.List;
            if (data.Data.List.length == 0) {
              this.noDataBg2 = true;
            }
          }
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .rankList {
    padding-top: rem64(262px);

    .mint-navbar {
      position: fixed;
      top: rem64(88px);
      left: 0;
      width: 100%;
      height: rem64(88px);
      z-index: 10;

      .mint-tab-item {
        &.is-selected {
          margin-bottom: 0;
        }
      }
    }

    .fixed_rank_title {
      position: fixed;
      top: rem64(196px);
      left: 0;
      width: 100%;
      height: rem64(66px);
      background-color: #e1e1e1;
      z-index: 10;
    }

    .table {
      width: 100%;
      text-align: center;
      background-color: $fill-base;

      th, td {
        text-align: center;
      }

      th {
        line-height: rem64(66px);
        text-align: center;
        font-size: rem64(24px);
        color: #000;
      }

      td {
        line-height: rem64(72px);
        font-size: rem64(24px);
      }

      .rank {
        width: rem75(225px);
      }

      .student {
        width: rem75(302px);
        line-height: rem75(55px);
        padding: rem75(10px) 0;
        @include ellipsis_two(2);
      }

      .sm_height {
        line-height: rem75(40px);
      }

      .credit {
        width: rem75(225px);
      }
    }
  }
</style>
