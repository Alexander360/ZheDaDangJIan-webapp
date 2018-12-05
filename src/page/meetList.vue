<template>
  <div class="meet_list_page container_top">
    <header-fix title="三会一课" fixed>
      <i slot="left" class="webapp webapp-left" @click="goBack"></i>
      <i slot="right" class="webapp webapp-add" @click="addMeet"></i>
    </header-fix>
    <section v-infinite-scroll="getMeetList"
             infinite-scroll-immediate-check="immediate"
             infinite-scroll-disabled="loading"
             infinite-scroll-distance="10">
      <ul class="meet_list">
        <li class="meet_item clearfix" v-for="item in meetList" :key="item.Id">
          <router-link :to="{path: '/meetDetail', query: {Id: item.Id}}">
            <div class="meet_info">
              <p class="meet_name">{{item.Name}}</p>
              <p class="meet_address">
                <i class="webapp webapp-map"></i>
                <span>{{item.MeetAddress}}</span>
              </p>
              <p class="meet_time">
                <i class="webapp webapp-time"></i>
                <span>{{item.StartDate}}</span>
              </p>
            </div>
            <i class="webapp webapp-right"></i>
          </router-link>
        </li>
      </ul>
      <div class="no-data" v-if="noData">没有更多内容啦</div>
      <div class="noDataBg" v-if="noDataBg"></div>
    </section>
  </div>
</template>

<script>
  import {MeetRecordPageList} from '../service/getData';
  import {goBack} from '../service/mixins';

  export default {
    mixins: [goBack],
    data() {
      return {
        page: 1,
        noData: false,
        noDataBg: false,
        meetList: []
      };
    },
    computed: {},
    created() {
      this.getMeetList();
    },
    methods: {
      addMeet() {
        this.$router.push({path: '/addMeet'});
      },
      async getMeetList() {
        let res = await MeetRecordPageList({Page: this.page});
        if (res.IsSuccess) {
          let list = res.Data.data;
          if (this.page == 1 && list.length == 0) {
            this.noDataBg = true;
            return;
          }
          if (this.page > 1 && list.length == 0) {
            this.noData = true;
            return;
          }
          this.meetList = this.meetList.concat(list);
          this.page++;
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .meet_list_page {
    background-color: #fff;

    .meet_list {
      .meet_item {
        padding: 0 rem64(30px);
        border-bottom: 1px solid #ddd;
        height: rem64(160px);

        .meet_info {
          float: left;
          width: rem64(500px);

          .meet_name {
            width: 100%;
            line-height: rem64(65px);
            font-size: rem64(30px);
            @extend %ellipsis;
          }

          .meet_address {
            line-height: rem64(45px);
            font-size: rem64(24px);
            color: $color-text-secondary;

            .webapp {
              font-size: rem64(24px);
              color: $color-text-secondary;
            }
          }

          .meet_time {
            line-height: rem64(32px);
            font-size: rem64(22px);
            color: $color-text-thirdly;

            .webapp {
              font-size: rem64(22px);
              color: $color-text-thirdly;
            }
          }
        }

        .webapp-right {
          float: left;
          font-size: rem64(50px);
          color: $color-text-thirdly;
          line-height: rem64(160px);
        }
      }
    }
  }
</style>
