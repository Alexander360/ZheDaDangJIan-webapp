/**
* 成果展示
*/
<template>
  <div class="result_show container_top">
    <header-fix :title="pageTitle" fixed>
      <div slot="left">
        <a @click="goBack"><i class="webapp webapp-left"></i></a>
        <a @click="toggleNav" class="category_icon"><i class="webapp webapp-category"></i></a>
      </div>
      <router-link slot="right" to="/resultShowSearch"><i class="webapp webapp-search"></i></router-link>
    </header-fix>
    <nav-slide :show="showSlide" @showChange="showChange">
      <div slot="left" class="category">
        <tree :data="productionCategory" :on-select="searchProduction" :selected-id="categoryId"></tree>
      </div>
      <div slot="right">
        <mt-navbar v-model="selected">
          <mt-tab-item id="0">最新作品</mt-tab-item>
          <mt-tab-item id="1">热门作品</mt-tab-item>
        </mt-navbar>
        <section v-infinite-scroll="getProductionList"
                 infinite-scroll-immediate-check="immediate"
                 infinite-scroll-disabled="loading"
                 infinite-scroll-distance="10">
          <result-show-list :data="productionData" :no-data-bg="noDataBg" :no-data="noData"></result-show-list>
        </section>
        <!-- tab-container -->
        <!--<mt-tab-container v-model="selected">
          <mt-tab-container-item id="new">
            <result-show-list :data="productionData"></result-show-list>
          </mt-tab-container-item>
          <mt-tab-container-item id="hot">
            <result-show-list :data="productionData"></result-show-list>
          </mt-tab-container-item>
        </mt-tab-container>-->
      </div>
    </nav-slide>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Indicator, InfiniteScroll, Navbar, TabItem, TabContainer, TabContainerItem } from 'mint-ui'
  import { headerFix, navSlide, tree, resultShowList } from '../components'
  import { GetProductionTypeInfoList, GetProductionInfoList } from '../service/getData'
  import { goBack } from '../service/mixins'

  Vue.use(InfiniteScroll)
  Vue.component(Navbar.name, Navbar)
  Vue.component(TabItem.name, TabItem)
  Vue.component(TabContainer.name, TabContainer)
  Vue.component(TabContainerItem.name, TabContainerItem)
  export default {
    mixins: [goBack],
    data () {
      return {
        pageTitle: '成果展示',
        showSlide: false,
        productionCategory: [],
        categoryId: '',
        selected: '0',
        productionData: [],
        loading: false,
        immediate: false,
        page: 1,
        noData: false,
        noDataBg: false,
      }
    },
    created () {

    },
    mounted () {
      this.getProductionCategory()
      this.getProductionList()
    },
    components: {
      headerFix,
      navSlide,
      tree,
      resultShowList,
    },
    methods: {
      toggleNav () {
        this.showSlide = !this.showSlide
      },
      showChange (val) {
        this.showSlide = val
      },
      //成果展示分类
      async getProductionCategory () {
        let data = await GetProductionTypeInfoList()
        if (data.Type == 1) {
          let list = data.Data.List
          let category = list.map((item, index) => {
            return {Name: item.ChannelName, Id: item.ChannelId, ParentId: item.ParentId, Nodes: null}
          })
          this.productionCategory = category
        }
      },
      //成果展示列表
      async getProductionList () {
        this.noData = false
        this.noDataBg = false
        this.loading = true
        Indicator.open()
        let data = await GetProductionInfoList({
          CategoryId: this.categoryId,
          Page: this.page,
          CategoryCode: this.selected
        })
        Indicator.close()
        if (data.Type == 1) {
          let list = data.Data.List
          if (list.length == 0 && this.page > 1) {
            this.noData = true
            return
          }
          if (list.length == 0 && this.page == 1) {
            this.noDataBg = true
            return
          }
          this.productionData = this.productionData.concat(list)
          this.loading = false
          this.page += 1
        }
      },
      searchProduction (data) {
        this.page = 1
        this.categoryId = data.Id
        this.pageTitle = data.Name
        this.showSlide = false
        this.productionData = []
        this.getProductionList()
      },
    },
    watch: {
      selected: function (val) {
        this.page = 1
        this.productionData = []
        this.getProductionList()
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .result_show {
    width: 100vw;
    height: 100vh;
    .category_icon {
      margin-left: rem75(10px);
    }
    .mint-navbar {
      .mint-tab-item {
        margin: 0 rem75(120px);
      }
    }
    .tree_title .tran_line {
      background-color: $brand-primary;
    }
  }
</style>
