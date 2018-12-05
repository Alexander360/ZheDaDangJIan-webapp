/**
* 考试记录列表
*/
<template>
  <div class="exam_history_list">
    <div class="exam_item" v-for="(item,index) in historyData" :key="index">
      <div class="exam_desc">
        <div class="exam_name">{{item.ExamTitle}}</div>
        <div class="exam_num">
          <span class="exam_high_score">最高分数：<span class="highlight">{{item.HighScore}}分</span></span>
          <span class="exam_times">考试次数：<span class="highlight">{{item.TriesLimit}}</span></span>
          <span class="exam_tip_num">获得学分：<span
            class="highlight">{{parseFloat(item.ExamCredit).toFixed(1)}}</span></span>
        </div>
      </div>
    </div>
    <div class="noDataBg" v-if="noDataBg"></div>
    <div class="no-data" v-if="noData">没有更多内容了...</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {};
    },
    props: {
      historyData: Array,
      noDataBg: {
        type: Boolean,
        default: false
      },
      noData: {
        type: Boolean,
        default: false
      }
    },
    methods: {}
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .exam_history_list {
    .exam_item {
      background-color: $fill-base;
      padding: rem64(10px) rem64(30px);
      border-bottom: 1px solid $border-color-base;
      @extend %clearfix;
    }

    .exam_desc {
      width: 100%;
    }

    .exam_name {
      @include ellipsis_two(2);
      font-size: rem64(28px);
      font-weight: 500;
      line-height: rem64(44px);
    }

    .exam_num {
      margin-top: rem64(10px);
      @include flex();
      color: $color-text-secondary;
      line-height: rem64(44px);
      font-size: rem64(22px);

      .highlight {
        color: $brand-primary;
      }
    }
  }
</style>
