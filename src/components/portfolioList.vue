/**
* 学习档案列表
*/
<template>
  <div class="portfolio_container">
    <div class="clearfix collect_content" v-for="(item,index) in learningData" :key="index">
      <div class="left_content">{{sortNum(index + 1)}}.</div>
      <div class="right_content">
        <p class="collect_title">
          <!--<span class="error" v-if="item.Type == 0">课程 | </span>
          <span class="error" v-else-if="item.Type == 1">看书 | </span>
          <span class="error" v-else-if="item.Type == 2">文章 | </span>-->
          <span>{{item.Title}}</span>
        </p>
        <p class="collect_date">
          <span>日期：{{item.CreatTime | dateFilter('yyyy.MM.dd')}}</span>
          <span class="score">{{Number(item.Record).toFixed(1)}}学分</span>
        </p>
      </div>
    </div>
    <div class="noDataBg" v-if="noDataBg"></div>
    <div class="no-data" v-if="noData">没有更多内容了...</div>
  </div>
</template>
<script>
  export default {
    data () {
      return {}
    },
    created () {
      
    },
    mounted () {
      
    },
    props: {
      learningData: {
        type: Array
      },
      noDataBg: {
        type: Boolean,
        default: false
      },
      noData: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      sortNum (num) {
        let index = parseInt(num)
        if (index < 10) {
          return `0${index}`
        }
        return index
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .portfolio_container {
    padding: 0 rem75(25px);
    background-color: $fill-base;
  }

  .collect_content {
    width: 100%;
    padding: rem75(30px) 0;
    border-bottom: 1px solid $border-color-light;
  }

  .left_content {
    @extend %pull-left;
    width: 10%;
    line-height: rem75(41px);
    font-size: 14px;
  }

  .right_content {
    @extend %pull-left;
    width: 90%;
    font-size: 14px;
    .collect_title {
      height: rem75(82px);
      line-height: rem75(41px);
      @include ellipsis_two();
    }
    .collect_date {
      font-size: 13px;
      color: $color-text-secondary;
      .score {
        color: $brand-primary;
        @extend %pull-right;
      }
    }
  }

  .error {
    color: $brand-error;
  }
</style>
