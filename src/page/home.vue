<template>
  <div class="home_index container_both">
    <header-fix title="浙大党建管理系统" fixed>
      <div class="search_container" slot="title">
        <input type="text" class="webapp home_search" v-model="search" :placeholder="placeholder">
      </div>
    </header-fix>
    <div class="container">
      <mt-swipe :auto="4000">
        <mt-swipe-item v-for="item in swipeData" :key="item.Id">
          <a :href="item.Url">
            <error-img :src="item.Icon"></error-img>
          </a>
        </mt-swipe-item>
      </mt-swipe>
      <section class="guide_list">
        <div class="guide_container">
          <div class="guide_item">
            <router-link to="/courseCenter">
              <img src="../assets/work_dynamic.png" alt="工作动态">
              <p>工作动态</p>
            </router-link>
          </div>
          <div class="guide_item">
            <router-link to="/newsCenter">
              <img src="../assets/file_policy.png" alt="文件制度">
              <p>文件制度</p>
            </router-link>
          </div>
          <div class="guide_item">
            <router-link to="/rankList">
              <img src="../assets/study_resource.png" alt="学习资源">
              <p>学习资源</p>
            </router-link>
          </div>
        </div>
      </section>
      <div class="boundary"></div>
      <section class="notice_container">
        <div class="container_title">
          <p>
            <span>通知公告</span>
            <router-link class="more" to="/message">更多</router-link>
          </p>
        </div>
        <ul class="notice_list" v-if="noticeData.length>0">
          <li class="notice_item" v-for="item in noticeData" :key="item.NoticeId">
            <p class="notice_name">
              <router-link :to="{path:'/messageDetail',query:{id: item.NoticeId, title: item.NoticeTitle}}">
                {{item.NoticeTitle}}
              </router-link>
            </p>
            <div class="notice_info">
              <span class="hot_key"></span>
              <span class="publish_time">发布时间 {{item.NoticeCreatedate | dateFilter('yyyy.MM.dd')}}</span>
            </div>
          </li>
        </ul>
        <div class="no_data" v-else>无数据</div>
      </section>
      <div class="boundary"></div>
      <section class="recommend_course">
        <div class="container_title">
          <p>
            <span>网上党校</span>
            <router-link class="more" to="/onlinePartySchool">更多</router-link>
          </p>
        </div>
        <ul class="recommend_course_list" v-if="classData.length>0">
          <li class="recommend_course_item"
              v-for="item in classData" :key="item.Id">
            <a>
              <error-img :src="item.Img" :error-src="noCourse"></error-img>
              <p class="course_title ellipsis">{{item.Name | wordLimit(17)}}</p>
            </a>
            <p class="clearfix">
              <span>{{item.StartDate | dateFilter('yyyy-MM-dd')}} 至 {{item.EndDate | dateFilter('yyyy-MM-dd')}}</span>
            </p>
          </li>
        </ul>
        <div class="no_data" v-else>无数据</div>
      </section>
    </div>
    <footer-fix selected="home"></footer-fix>
  </div>

</template>
<script>
  import {Swipe, SwipeItem} from 'mint-ui';
  import Vue from 'vue';
  import {mapActions, mapState} from 'vuex';
  import noCourse from '../assets/noCourse.png';
  import {errorImg, footerFix, headerFix, mbModel} from '../components';
  import {getQueryString} from '../plugins/utils';
  import {GetLink, GetNoticeInfoList, GetTrainingClass} from '../service/getData';
  import {toPlay} from '../service/mixins';

  Vue.component(Swipe.name, Swipe);
  Vue.component(SwipeItem.name, SwipeItem);
  export default {
    name: 'home',
    mixins: [toPlay],
    data() {
      return {
        search: '',
        placeholder: '\ue6ac   请输入关键词、标签',
        userInfo: {},
        showModel: false,
        swipeData: [],
        classData: [],
        noCourse,
        code: '',
        noticeData: []
      };
    },
    components: {
      footerFix,
      errorImg,
      headerFix,
      mbModel
    },
    created() {
      this.getUserAgent();
    },
    mounted() {
      this.code = getQueryString().code;
      this.getClass();
      this.getSwipeData();
      this.getNoticeInfoList();
    },
    computed: {
      ...mapState(['userAgent'])
    },
    methods: {
      ...mapActions(['getUserAgent']),
      /* 通知公告 */
      async getNoticeInfoList() {
        let res = await GetNoticeInfoList({Rows: 2});
        if (res.Data.TotalCount > 0) {
          this.noticeData = res.Data.List;
        }
      },
      /*网上党校*/
      async getClass() {
        let res = await GetTrainingClass({Page: 1, Rows: 2, TrainingBaseTypeId: 1});
        if (res.IsSuccess) {
          this.classData = res.Data.List;
        }
      },
      /*轮播*/
      async getSwipeData() {
        let res = await GetLink();
        if (res.IsSuccess) {
          this.swipeData = res.Data;
        }
      },
      toggleModel() {
        this.showModel = !this.showModel;
      }
    }
  };
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .home_index {
    /* 头部搜索 */
    .search_container {
      position: relative;
      @include flex();
      align-items: center;

      .home_search {
        width: rem64(600px);
        height: rem64(60px);
        border-radius: rem64(10px);
        padding-left: rem64(20px);
        color: $color-text-secondary;
      }
    }

    /*图片轮播*/
    .mint-swipe {
      height: rem64(307px);

      img {
        width: 100%;
        height: 100%;
      }
    }

    /*导航*/
    .guide_list {
      width: 100%;
      overflow-x: hidden;
      overflow-y: hidden;

      &::-webkit-scrollbar {
        width: 0px;
      }

      background-color: $fill-base;
      height: rem64(173px);

      .guide_container {
        @include flex(space-around);
        @extend %clearfix;
        width: 100%;
        height: 100%;
        text-align: center;
      }

      .guide_item {
        @extend %pull-left;
        width: rem64(105px);
        padding: rem64(30px) 0 0 0;

        p {
          line-height: rem64(60px);
          font-size: rem64(24px);
        }

        img {
          width: rem64(80px);
        }
      }
    }

    .boundary {
      display: block;
      width: 100%;
      height: rem64(20px);
      background-color: #ebf1f1;
    }

    /* 容器头部 */
    .container_title {
      position: relative;
      width: 100%;
      height: rem64(75px);
      padding: rem64(10px) rem64(30px) 0;
      line-height: rem64(64px);
      background-color: #fff;
      font-size: rem64(28px);

      &:before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 1px;
        width: rem64(30px);
        height: 100%;
        background-color: #fff;
      }

      &:after {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: rem64(27px);
        width: rem64(12px);
        height: rem64(26px);
        border-radius: rem64(10px);
        transform: translateX(-50%);
        background-color: $brand-primary;
      }

      & > p {
        border-bottom: 1px solid #e1e1e1;
      }

      .more {
        float: right;
        color: $color-text-thirdly;
        font-size: rem64(24px);
      }
    }

    .no_data {
      line-height: rem64(100px);
      font-size: 18px;
      text-align: center;
    }

    /* 通知公告 */
    .notice_container {
      background-color: #fff;

      .notice_list {
        padding: rem64(25px) rem64(30px);

        .notice_item {
          border-bottom: none;

          .notice_name {
            @include ht-lineHt64(60px);
            @extend %ellipsis;
            font-size: rem64(30px);
          }

          .notice_info {
            @include flex(flex-start);
          }

          .hot_key {
            display: inline-block;
            width: rem64(28px);
            height: rem64(47px);
            background: url("../assets/hot_key.png") no-repeat center center;
            background-size: 100% auto;
          }

          .publish_time {
            display: inline-block;
            margin-left: rem64(15px);
            @include ht-lineHt64(50px);
            font-size: rem64(24px);
          }
        }
      }
    }

    .recommend_course {
      background-color: #fff;

      .recommend_title {
        font-size: 14px;
        line-height: rem75(62px);

        .primary_line {
          position: relative;
          top: 2px;
        }
      }

      .recommend_course_list {
        @include flex();
        padding: rem64(20px) rem64(30px);

        .recommend_course_item {
          width: rem64(280px);

          img {
            width: rem64(280px);
            height: rem64(186px);
            border-radius: rem64(10px);
          }

          .clearfix {
            line-height: rem64(40px);
          }

          .course_title {
            margin-top: rem64(10px);
            width: 100%;
            height: rem64(48px);
            text-align: left;
            line-height: rem64(48px);
            font-size: rem64(30px);
          }

          .teacher {
            color: $color-text-thirdly;
            font-size: rem64(24px);

            .webapp {
              margin-right: rem64(10px);
              color: $brand-primary;
              font-weight: bold;
              font-size: rem64(24px);
            }
          }
        }
      }
    }
  }
</style>
