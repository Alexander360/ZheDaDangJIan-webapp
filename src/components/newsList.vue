/**
* 新闻列表
*/
<template>
  <div class="news_list">
    <div class="news_item" v-for="item in newsData" :key="item.ArticleId" @click="goArticleDetail(item.ArticleId)">
      <div class="news_img">
        <error-img :src="item.ArticleImg" :error-src="noNews"></error-img>
      </div>
      <div class="news_desc">
        <div class="news_name">{{item.ArticleTitle}}</div>
        <div class="news_time">{{item.ArticleCreateDate | dateFilter('yyyy.MM.dd')}}</div>
      </div>
    </div>
    <div class="noDataBg" v-if="noDataBg"></div>
    <div class="no-data" v-if="noData">没有更多内容了...</div>
  </div>
</template>
<script>
  import noNews from '../assets/latestNews.png'
  import errorImg from '../components/errorImg.vue'
  import { toPlay } from '../service/mixins'

  export default {
    mixins: [toPlay],
    data () {
      return {
        noNews
      }
    },
    props: {
      newsData: Array,
      noDataBg: {
        type: Boolean,
        default: false
      },
      noData: {
        type: Boolean,
        default: false
      },
    },
    components: {
      errorImg
    },
    methods: {
      goArticleDetail (id) {
        this.$router.push({path: 'newsDetails', query: {id}})
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .news_list {
    .news_item {
      padding: rem75(30px);
      @extend %clearfix;
      background-color: $fill-base;
      border-bottom: 1px solid $border-color-base;
    }
    .news_img {
      @extend %pull-left;
      position: relative;
      width: rem75(204px);
      img {
        width: 100%;
        height: rem75(150px);
      }
      .tip {
        position: absolute;
        right: rem75(5px);
        top: rem75(5px);
        @include wh75(50px, 27px);
      }
    }
    .news_desc {
      @extend %pull-left;
      width: rem75(480px);
      padding-left: rem75(15px);
    }
    .news_name {
      @include ellipsis_two(2);
      font-size: 15px;
      font-weight: 500;
      height: rem75(90px);
      padding-top: rem75(10px);
    }
    .news_time {
      color: $color-text-thirdly;
      margin-top: rem75(20px);
    }
  }
</style>
