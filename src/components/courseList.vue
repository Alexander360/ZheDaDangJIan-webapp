/**
* 课程列表
*/
<template>
  <div class="course_list">
    <div class="course_item" v-for="(item,index) in courseData" :key="index"
         @click.stop="toPlay(item.CourseType,item.CourseId)">
      <div class="course_img">
        <a class="img">
          <img v-lazy="item.CourseImg">
        </a>
        <!--<img v-if="item.CourseType=='JYAicc'" class="tip" src="../assets/jingpin.png" alt=""/>
        <img v-if="item.CourseType=='Mp4'" class="tip" src="../assets/MP4.png" alt=""/>
        <img v-if="item.CourseType=='h5'" class="tip" src="../assets/H5.png" alt=""/>-->
      </div>
      <div class="course_desc">
        <div class="course_name">{{item.CourseName}}</div>
        <div class="course_center">
          <span class="course_teacher">讲师：{{item.TeacherName || '无'}}</span>
          <span class="course_type" v-if="item.CourseType=='JYAicc'">分类：精品课程</span>
          <span class="course_type" v-else-if="item.CourseType=='Mp4'">分类：单视频</span>
          <span class="course_type" v-else-if="item.CourseType=='h5'">分类：h5课程</span>
          <span class="course_type" v-else>分类：无</span>
        </div>
        <div class="course_bottom">
          <span v-if="myCourse" class="progress">进度：{{parseInt(item.BrowseScore)}}%</span>
          <span v-if="!myCourse" class="choose_status"
                :class="item.SelectFlag=='已选'&&'course_selected'">{{item.SelectFlag}}</span>
          <span class="highlight">{{item.Credit}}</span>
        </div>
      </div>
    </div>
    <div class="noDataBg" v-if="noDataBg"></div>
    <div class="no-data" v-if="noData">没有更多内容了...</div>
  </div>
</template>
<script>
  import {Lazyload} from 'mint-ui';
  import Vue from 'vue';
  import noCourse from '../assets/noCourse.png';
  import errorImg from '../components/errorImg.vue';
  import {toPlay} from '../service/mixins';

  Vue.use(Lazyload, {
    error: noCourse
  });

  export default {
    mixins: [toPlay],
    data() {
      return {
        noCourse
      };
    },
    props: {
      courseData: Array,
      noDataBg: {
        type: Boolean,
        default: false
      },
      noData: {
        type: Boolean,
        default: false
      },
      myCourse: Boolean
    },
    components: {
      errorImg
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .course_list {
    .course_item {
      position: relative;
      padding: rem64(20px) rem64(30px);
      @extend %clearfix;
      background-color: $fill-base;
      /*border-bottom: 1px solid $border-color-base;*/
    }

    .course_img {
      @extend %pull-left;
      position: relative;
      width: rem64(190px);

      .img {
        img {
          width: 100%;
          height: rem64(124px);
          border-radius: rem64(10px);
        }
      }

      /*.tip {
        position: absolute;
        right: rem75(5px);
        top: rem75(5px);
        @include wh75(57px, 27px);
        @include borderRadius75(5px);
      }*/
    }

    .course_desc {
      position: relative;
      @extend %pull-left;
      width: rem64(365px);
      height: rem64(124px);
      margin-left: rem64(20px);
    }

    .course_name {
      @extend %ellipsis;
      width: 100%;
      height: rem64(50px);
      font-size: rem64(30px);
      font-weight: 500;
      color: $color-text-base;
    }

    .course_center {
      color: $color-text-secondary;
      line-height: rem64(40px);
      font-size: rem64(22px);
      @extend %clearfix;

      .course_teacher {
        float: left;
      }

      .course_type {
        float: right;
      }
    }

    .course_bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
    }

    .choose_status {
      @extend %pull-left;
      @include wh75(64px, 36px);
      background-color: $color-icon-base;
      color: $color-text-thirdly;
      text-align: center;
      @include borderRadius75(5px);
    }

    .course_selected {
      background-color: $brand-success;
    }

    .progress {
      @extend %pull-left;
      color: $color-text-thirdly;
    }

    .highlight {
      @extend %pull-right;
      color: $brand-primary;
    }
  }
</style>
