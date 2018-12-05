/**
* 通知列表
*/
<template>
  <div class="notice_list">
    <div class="notice_item" v-for="(item) in noticeData" :key="item.NoticeId"
         @click.stop="linkTo(item.MessageId)">
      <div class="title clearfix">
        <span class="pull-left">
          <span class="dot" v-if="!item.IsRead"></span>&nbsp;&nbsp;
          {{item.MessageTitle}}
        </span>
        <span class="pull-right"><i class="webapp webapp-right"></i></span>
      </div>
      <div class="desc clearfix">
        <!--<span class="author pull-left">作者：{{item.NoticeAuthor}}</span>-->
        <span class="date">发表日期：{{item.SendTime | dateFilter('yyyy/MM/dd hh:mm:ss')}}</span>
      </div>
    </div>
    <div class="noDataBg" v-if="noDataBg"></div>
    <div class="no-data" v-if="noData">没有更多内容了...</div>
  </div>
</template>
<script>
  export default {
    mixins: [],
    data () {
      return {}
    },
    created () {
      
    },
    mounted () {
      
    },
    props: {
      noticeData: {
        type: Array
      },
      noDataBg: {
        type: Boolean
      },
      noData: {
        type: Boolean
      }
    },
    components: {},
    computed: {},
    updated () {
      
    },
    methods: {
      linkTo (id) {
        id && this.$router.push({path: '/noticeDetail', query: {id}})
      },
    },
    watch: {}
    
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .notice_list {
    .notice_item {
      background-color: $fill-base;
      border-bottom: 1px solid $border-color-light;
      padding: rem75(15px) rem75(30px);
      .title {
        .pull-left {
          width: 90%;
          @include ellipsis_two(1);
          font-size: 14px;
        }
        .pull-right {
          width: 10%;
          text-align: right;
          color: $color-text-thirdly;
        }
      }
      .desc {
        margin-top: rem75(10px);
        padding-left: rem75(30px);
        color: $color-text-thirdly;
        .pull-right {
          text-align: right;
        }
      }
      .webapp-more {
        color: $color-text-thirdly;
        font-size: 20px;
      }
      .dot {
        @include dot75(15px, $brand-error)
      }
    }
  }

</style>
