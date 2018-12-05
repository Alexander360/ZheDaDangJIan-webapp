<template>
  <div class="meet_detail_page container_top">
    <header-fix :class="isTransparent?'is-transparent':''" title="会议详细" fixed>
      <i slot="left" class="webapp webapp-left" @click="goBack"></i>
    </header-fix>
    <section class="container">
      <div class="meet_name">{{meetDetail.Name}}</div>
      <div class="meet_info">
        <div class="meet_start flex_container">
          <span class="title flex_1">开始时间</span>
          <span class="meet_time gray_text flex_3">{{meetDetail.StartDate| dateFilter('yyyy-MM-dd hh:mm')}}</span>
        </div>
        <div class="meet_end flex_container">
          <span class="title flex_1">结束时间</span>
          <span class="meet_time gray_text flex_3">{{meetDetail.EndDate| dateFilter('yyyy-MM-dd hh:mm')}}</span>
        </div>
        <div class="meet_address flex_container">
          <span class="title flex_1">地址</span>
          <span class="gray_text flex_3">{{meetDetail.MeetAddress}}</span>
        </div>
        <div class="meet_group flex_container">
          <span class="title flex_1">地址</span>
          <span class="gray_text flex_3">{{meetDetail.MeetGroup}}</span>
        </div>
        <div class="meet_count flex_container">
          <span class="flex_1">计划人数</span>
          <span class="flex_1 gray_text">{{meetDetail.PlanPeopleCount}}</span>
          <span class="flex_1">实到人数</span>
          <span class="flex_1 gray_text">{{meetDetail.PeopleCount}}</span>
        </div>
      </div>
      <div class="boundary"></div>
    </section>
    <section>
      <mt-navbar v-model="selected">
        <mt-tab-item id="1">会议简介</mt-tab-item>
        <mt-tab-item id="2">会议图片</mt-tab-item>
        <mt-tab-item id="3">会议计划</mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="1">
          <p class="gray_text">{{meetDetail.MeetIntroduce}}</p>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <div class="img_list" v-if="meetDetail.MeetPhotoModel&&meetDetail.MeetPhotoModel.length>0">
            <img v-for="item in meetDetail.MeetPhotoModel" :key="item.Id" :src="item.ImgUrl" alt="">
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="3">
          <p class="gray_text">{{meetDetail.MeetPlan}}</p>
        </mt-tab-container-item>
      </mt-tab-container>
    </section>
  </div>
</template>

<script>
  import {Navbar, TabContainer, TabContainerItem, TabItem} from 'mint-ui';
  import Vue from 'vue';
  import {MeetPhotoDetail, MeetRecordDetail} from '../service/getData';
  import {goBack} from '../service/mixins';

  Vue.component(Navbar.name, Navbar);
  Vue.component(TabItem.name, TabItem);
  Vue.component(TabContainer.name, TabContainer);
  Vue.component(TabContainerItem.name, TabContainerItem);
  export default {
    mixins: [goBack],
    data() {
      return {
        meetDetail: {},
        selected: '1',
        meetPhotos: [],
        isTransparent: true
      };
    },
    computed: {},
    created() {
      let Id = this.$route.query.Id;
      this.getMeetDetail(Id);
    },
    mounted() {
      let container = document.querySelector('.container');
      let header = document.querySelector('.header');
      window.addEventListener('scroll', (e) => {
        let rect = container.getBoundingClientRect();
        let top = rect.top;
        let height = header.getBoundingClientRect().height;
        if (top != height) {
          this.isTransparent = false;
        } else {
          this.isTransparent = true;
        }
      });
    },
    methods: {
      async getMeetDetail(id) {
        let res = await MeetRecordDetail(id);
        if (res.IsSuccess) {
          this.meetDetail = res.Data;
        }
      },
      async getMeetPhoto(id) {
        let res = await MeetPhotoDetail(id);
        if (res.IsSuccess) {
          this.meetPhotos = res.Data;
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .meet_detail_page {
    background-color: white;
    background-image: url("../assets/meet_detail_bg.png");
    background-position: top center;
    background-repeat: no-repeat;
    background-size: 100% rem64(330px);

    .header {
      &.is-transparent {
        background-color: transparent;

        .webapp, .header_title {
          color: #000;
        }
      }
    }

    .boundary {
      background-color: $fill-body;
      width: 100%;
      height: rem64(20px);
    }

    .gray_text {
      color: $color-text-thirdly;
    }

    .container {
      padding: rem64(242px) rem64(30px) 0;

      .meet_name {
        position: relative;
        @include ht-lineHt64(90px);
        font-size: rem64(32px);
        font-weight: bold;
        border-bottom: 1px solid #ddd;

        &:after {
          content: '';
          display: block;
          position: absolute;
          bottom: -1px;
          width: rem64(40px);
          height: 3px;
          background-color: $brand-primary;
        }
      }

      .meet_info {
        padding: rem64(20px) 0;
        font-size: rem64(28px);
        line-height: rem64(55px);

        .flex_container {
          @include flex(flex-start);
          align-items: center;

          .flex_1 {
            flex: 1;
          }

          .flex_3 {
            flex: 3;
          }
        }
      }
    }

    .mint-navbar .mint-tab-item.is-selected {
      margin-bottom: 0;
    }

    .mint-tab-container {
      border-top: 1px solid #ddd;
    }

    .mint-tab-container-item {
      padding: rem64(30px);
      font-size: rem64(28px);
      line-height: rem64(44px);
    }

    .img_list {
      img {
        width: 100%;
        margin-bottom: rem64(15px);
      }
    }
  }
</style>
