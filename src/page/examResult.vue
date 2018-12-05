/**
* 考试结果
*/
<template>
  <div class="exam_result container_top">
    <!--头部-->
    <header-fix title="考试结果" fixed></header-fix>
    <div class="result_top">
      <div class="result_icon" v-if="result.PassFlag"><i class="webapp webapp-smile"></i><span>恭喜您！</span></div>
      <div class="result_icon" v-if="!result.PassFlag"><i class="webapp webapp-cry"></i><span>很遗憾！</span></div>
      <p class="get_score">您的得分：{{result.Score}}分</p>
    </div>
    <div class="result_body">
      <p><span>用时：</span><span class="pull-right">{{parseInt(result.usedTime / 1000) | formatTime}}</span></p>
      <p><span>总题数：</span><span class="pull-right">{{result.TotalCount}}题</span></p>
      <p><span>正确：</span><span class="pull-right">{{result.RightCount}}题</span></p>
      <p><span>错误：</span><span class="pull-right">{{result.TotalCount - result.RightCount}}题</span></p>
    </div>
    <div class="result_footer">
      <mt-button class="back" type="primary" @click.native="back">返回</mt-button>
      <mt-button class="oneMore" type="primary" @click.native="oneMore">再考一次</mt-button>
    </div>
  </div>

</template>
<script>
  import {Button} from 'mint-ui';
  import Vue from 'vue';
  import {headerFix} from '../components';

  Vue.component(Button.name, Button);
  export default {
    data() {
      return {
        result: null
      };
    },
    components: {
      headerFix
    },
    created() {
      this.result = JSON.parse(this.$route.query.data);
    },
    mounted() {
    },
    methods: {
      back() {
        switch (this.result.routeFrom.name) {
          case 'classExam':
            this.$router.push({path: '/classExam', query: this.result.routeFrom.query});
            break;
          default:
            this.$router.push('/examCenter');
            break;
        }
      },
      oneMore() {
        this.$router.push({path: 'exam', query: {id: this.result.examId}});
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .exam_result {
    background: $fill-body;

    .result_top {
      background-color: $fill-base;
      height: rem75(364px);
      text-align: center;

      .result_icon {
        padding: rem75(120px) 0 rem75(50px) 0;
        font-size: 16px;

        span {
          margin-left: rem75(20px);
        }
      }

      .get_score {
        @include ht-lineHt75(60px);
        font-size: 20px;
      }
    }

    .result_body {
      background-color: $fill-base;
      font-size: 15px;
      margin-top: rem75(20px);
      padding: 0 rem75(30px);

      p {
        @include ht-lineHt75(82px);
        border-top: 1px solid $border-color-light;
      }

      .pull-right {
        color: $color-text-secondary;
      }
    }

    .result_footer {
      margin-top: rem75(82px);
      @extend %clearfix;

      .back {
        @extend %pull-left;
        @include wh75(300px, 80px);
        @include borderRadius75(20px);
        margin-left: rem75(40px);
      }

      .oneMore {
        @extend %pull-right;
        @include wh75(300px, 80px);
        @include borderRadius75(20px);
        margin-right: rem75(40px);
      }
    }

    .webapp-smile {
      color: $brand-success;
    }

    .webapp-cry {
      color: $brand-error;
    }
  }
</style>
