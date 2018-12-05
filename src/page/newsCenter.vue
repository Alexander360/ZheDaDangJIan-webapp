/**
* 新闻中心
*/
<template>
  <div class="newsCenter container_top">
    <header-fix :title="articleTitle" fixed>
      <div class="clearfix" slot="left">
        <a class="pull-left" @click="goBack"><i class="webapp webapp-left"></i></a>
        <a @click="toggleNav" class="category_icon pull-left"><i class="webapp webapp-category"></i></a>
      </div>
      <router-link slot="right" to="/newsSearch"><i class="webapp webapp-search"></i></router-link>
    </header-fix>
    <nav-slide :show="showSlide" @showChange="showChange">
      <div slot="left" class="category">
        <tree :data="articleCategory" :on-select="searchArticle" :selected-id="categoryId"></tree>
      </div>
      <div slot="right">
        <section v-infinite-scroll="getArticleList"
                 infinite-scroll-immediate-check="immediate"
                 infinite-scroll-disabled="loading"
                 infinite-scroll-distance="10">
          <news-list :news-data="articleData" :no-data-bg="noDataBg" :no-data="noData"></news-list>
        </section>
      </div>
    </nav-slide>
  </div>
</template>
<script>
  import {Indicator, InfiniteScroll} from 'mint-ui';
  import Vue from 'vue';
  import {headerFix, navSlide, newsList, tree} from '../components';
  import {GetArticleChannelInfoList, GetArticleInfoList} from '../service/getData';
  import {goBack} from '../service/mixins';

  Vue.use(InfiniteScroll);

  export default {
    mixins: [goBack],
    data() {
      return {
        articleTitle: '新闻资讯',
        showSlide: false,
        articleCategory: [],
        categoryId: 0,
        articleData: [],
        loading: false,
        immediate: false,
        page: 1,
        noData: false,
        noDataBg: false
      };
    },
    created() {
      this.categoryId = this.$route.query.id;
    },
    mounted() {
      this.getArticleCategory();
      this.getArticleList();
    },
    components: {
      headerFix,
      navSlide,
      tree,
      newsList
    },
    methods: {
      toggleNav() {
        this.showSlide = !this.showSlide;
      },
      showChange(val) {
        this.showSlide = val;
      },
      //文章分类
      async getArticleCategory() {
        let res = await GetArticleChannelInfoList();
        if (res.IsSuccess) {
          this.articleCategory = res.Data.ArticleCategoryResult;
        }
      },
      //文章列表
      async getArticleList() {
        this.noData = false;
        this.noDataBg = false;
        this.loading = true;
        Indicator.open();
        let data = await GetArticleInfoList({CategoryId: this.categoryId, Page: this.page});
        Indicator.close();
        if (data.Type == 1) {
          let list = data.Data.List;
          if (list.length == 0 && this.page > 1) {
            this.noData = true;
            return;
          }
          if (list.length == 0 && this.page == 1) {
            this.noDataBg = true;
            return;
          }
          this.articleData = this.articleData.concat(list);
          this.loading = false;
          this.page += 1;
        }
      },
      searchArticle(data) {
        this.page = 1;
        this.categoryId = data.Id;
        this.articleTitle = data.Name;
        this.showSlide = false;
        this.articleData = [];
        this.getArticleList();
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .newsCenter {
    width: 100vw;
    height: 100vh;

    .category_icon {
      margin-left: rem75(10px);
    }
  }
</style>
