/**
* 观看历史列表
*/
<template>
  <div class="history_course">
    <div class="history_title">
      <span class="primary_line"></span>
      <span>{{title}}</span>
    </div>
    <div class="history_content" v-for="(item,index) in historyData"
         :key="index"
         @click.stop="toPlay('Mp4',item.CourseId)">
      <div class="left_img">
        <error-img :src="item.ImageUrl" :error-src="noCourse"></error-img>
      </div>
      <div class="right_content">
        <h4>{{item.CourseName}}</h4>
        <p class="createDate">{{item.CreateDate}}</p>
        <span>已看{{item.BrowseScore}}，剩余{{item.TotalTimes - item.StudyTimes}}分钟</span>
      </div>
      <div class="studyCount">
        <i class="webapp webapp-play"></i>
        {{item.StudyCount}}次
      </div>
    </div>
  </div>
</template>
<script>
  import { errorImg } from '../components'
  import { toPlay } from '../service/mixins'
  import noCourse from '../assets/noCourse.png'

  export default {
    mixins: [toPlay],
    data () {
      return {
        noCourse
      }
    },
    props: {
      historyData: Array,
      title: String
    },
    components: {
      errorImg
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .history_course {
    padding: rem75(20px) rem75(30px) 0 rem75(30px);
    margin-bottom: rem75(20px);
    background-color: $fill-base;
  }

  .history_title {
    font-size: 15px;
  }

  .history_content {
    position: relative;
    @extend %clearfix;
    padding: rem75(20px) 0;
    border-bottom: 1px solid $border-color-base;
    .left_img {
      width: rem75(200px);
      @extend %pull-left;
      img {
        @include wh75(186px, 130px);
      }
    }
    .right_content {
      @extend %pull-right;
      width: rem75(470px);
      h4 {
        font-size: 14px;
        height: rem75(76px);
        line-height: rem75(38px);
        @include ellipsis_two;
      }
      span, .createDate {
        font-size: 12px;
        color: $color-text-secondary;
      }
    }
    .studyCount {
      position: absolute;
      right: 0;
      bottom: rem75(20px);
      color: $color-text-thirdly;
      .webapp-play {
        font-size: 12px;
        color: $color-text-thirdly;
      }
    }
  }
</style>
