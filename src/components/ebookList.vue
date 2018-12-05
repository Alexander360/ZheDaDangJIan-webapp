/**
* 电子书列表
*/
<template>
  <div class="ebook_list">
    <div class="ebook_item" v-for="item in data" :key="item.BookNameId"
         @click="goChapterList(item.BookNameId,item.BookName)">
      <error-img :src="item.BookImg" :error-src="errorBook"></error-img>
      <p class="ebook_name">{{item.BookName}}</p>
      <p class="ebook_author">作者：{{item.AutoName}}</p>
    </div>
    <div class="noDataBg" v-if="noDataBg"></div>
    <div class="no-data" v-if="noData">没有更多内容了...</div>
  </div>
</template>
<script>
  import errorImg from './errorImg.vue'
  import errorBook from '../assets/error_book.png'
  import { setStore } from '../plugins/utils'

  export default {
    data () {
      return {
        errorBook
      }
    },
    props: {
      data: Array,
      noDataBg: Boolean,
      noData: Boolean,
    },
    components: {
      errorImg
    },
    methods: {
      goChapterList (id, bookName) {
        setStore('bookName', bookName)
        this.$router.push({path: '/ebookChapterList', query: {id}})
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .ebook_list {
    @extend %clearfix;
    .ebook_item {
      @extend %pull-left;
      text-align: center;
      width: 33.3%;
      padding-top: rem75(25px);
      img {
        @include wh75(176px, 234px);
        @include border-right-radius75(10px);
        box-shadow: rem75(6px) rem75(6px) 4px #b5b9bc;
        -webkit-box-shadow: rem75(6px) rem75(6px) 8px #b5b9bc;
      }
      .ebook_name {
        padding: 0 rem75(30px);
        height: rem75(64px);
        line-height: rem75(32px);
        @include ellipsis_two();
        margin: rem75(10px) 0;
      }
      .ebook_author {
        line-height: rem75(40px);

      }
    }
  }
</style>
