<template>
  <div class="container_both online_party_school">
    <header-fix :title="headerTitle" fixed>
      <i class="webapp webapp-category1" slot="left" @click="toggleNav"></i>
      <router-link slot="right" :to="{path:'/classSearch',query:{TrainingBaseTypeId: 1}}"><i
        class="webapp webapp-search"></i></router-link>
    </header-fix>
    <nav-slide :show="showSlide" @showChange="showChange">
      <div slot="left" class="category">
        <tree :show-line="true" :data="trainingTypeList" :on-select="getClass" :selected-id="typeId"></tree>
      </div>
      <div slot="right">
        <section v-infinite-scroll="getTrainingClass"
                 infinite-scroll-immediate-check="immediate"
                 infinite-scroll-disabled="loading"
                 infinite-scroll-distance="10">
          <class-list :data="trainingClassList" :no-data="noData" :no-data-bg="noDataBg"
                      :class-type="classType"></class-list>
        </section>
      </div>
    </nav-slide>
    <footer-fix selected="onlinePartySchool"></footer-fix>
  </div>
</template>

<script>
  import {Indicator, InfiniteScroll, Toast} from 'mint-ui';
  import Vue from 'vue';
  import {classList, footerFix, headerFix, navSlide, tree} from '../components';
  import {GetOnlineTrainingTypeList, GetTrainingClass} from '../service/getData';

  Vue.use(InfiniteScroll);
  export default {
    data() {
      return {
        headerTitle: '网上党校',
        showSlide: false,
        typeId: '',
        classType: 'online',
        page: 1,
        trainingTypeList: [],
        trainingClassList: [],
        noData: false,
        noDataBg: false
      };
    },
    computed: {},
    components: {
      classList, footerFix, headerFix, navSlide, tree
    },
    created() {
      this.getTrainingTypeList();
      this.getTrainingClass();
    },
    methods: {
      toggleNav() {
        this.showSlide = !this.showSlide;
      },
      showChange(val) {
        this.showSlide = val;
      },
      async getTrainingTypeList() {
        let data = await GetOnlineTrainingTypeList({IsOnline: 1});
        let arr = data.Data.TrainClassList;
        arr.forEach((item) => {
          item.Id = item.TypeId;
          item.Name = item.TypeName;
          item.Nodes = null;
        });
        this.trainingTypeList = arr;
      },
      async getTrainingClass() {
        if (this.page > 1 && this.noData) return;
        Indicator.open();
        let data = await GetTrainingClass({Page: this.page, Rows: 10, TypeId: this.typeId, TrainingBaseTypeId: 1});
        Indicator.close();
        if (data.IsSuccess) {
          if (data.Data.List.length == 0 && this.page == 1) {
            this.noDataBg = true;
            return;
          }
          if (data.Data.List.length == 0 && this.page > 1) {
            this.noData = true;
            return;
          }

          this.trainingClassList = this.trainingClassList.concat(data.Data.List);
          this.page++;
        }
      },
      async getClass(item) {
        this.page = 1;
        this.noData = false;
        this.noDataBg = false;
        this.typeId = item.TypeId;
        Indicator.open();
        let res = await GetTrainingClass({TypeId: this.typeId, Rows: 10, TrainingBaseTypeId: 1});
        Indicator.close();
        if (res.IsSuccess) {
          this.showSlide = false;
          this.headerTitle = item.TypeName;
          this.trainingClassList = res.Data.List;
          if (res.Data.List.length == 0) {
            this.noDataBg = true;
          }
        } else {
          Toast({message: '请求失败', position: 'bottom'});
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .online_party_school {
    width: 100vw;
    height: 100vh;

    .tree_title {
      @include ht-lineHt64(87px);
      border-bottom: 1px solid #ddd;

      .tree_name {
        line-height: rem64(87px);
      }
    }
  }
</style>
