/**
* 我的课程
*/
<template>
  <div class="my_course container_top">
    <header-fix title="学习记录" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
      <!--<mb-tab slot="title" v-model="tabType">
        <mb-tab-item id="0">未完成</mb-tab-item>
        <mb-tab-item id="1">已完成</mb-tab-item>
      </mb-tab>-->
      <!--<router-link slot="right" to="/courseSearch"><i class="webapp webapp-search"></i></router-link>-->
    </header-fix>
    <div class="my_course_container">
      <mt-tab-container v-model="tabType">
        <mt-tab-container-item id="2">
          <section v-if="tabType === '2'" v-infinite-scroll="getMyUnFinishCourse"
                   infinite-scroll-disabled="loading"
                   infinite-scroll-immediate-check="immediate"
                   infinite-scroll-distance="10">
            <course-list :course-data="courseUnFinishData"
                         :no-data-bg="noUfDataBg"
                         :no-data="noUfData"
                         my-course>
            </course-list>
          </section>
        </mt-tab-container-item>
        <!--<mt-tab-container-item id="1">
          <section v-if="tabType === '1'" v-infinite-scroll="getMyFinishCourse"
                   infinite-scroll-disabled="loading"
                   infinite-scroll-immediate-check="immediate"
                   infinite-scroll-distance="10">
            <course-list :course-data="courseFinishData"
                         :no-data-bg="noFDataBg"
                         :no-data="noFData"
                         my-course>
            </course-list>
          </section>
        </mt-tab-container-item>-->
      </mt-tab-container>
    </div>
  </div>
</template>
<script>
  import {Indicator, InfiniteScroll, TabContainer, TabContainerItem} from 'mint-ui';
  import Vue from 'vue';
  import {courseList, headerFix, mbTab, mbTabItem} from '../components';
  import {GetUserCourseInfoList} from '../service/getData';
  import {goBack} from '../service/mixins';

  Vue.component(TabContainer.name, TabContainer);
  Vue.component(TabContainerItem.name, TabContainerItem);
  Vue.use(InfiniteScroll);
  export default {
    mixins: [goBack],
    data() {
      return {
        tabType: '2',
        courseFinishData: [],
        courseUnFinishData: [],
        noFDataBg: false,
        noFData: false,
        noUfDataBg: false,
        noUfData: false,
        loading: false,
        immediate: false,
        unFinishPage: 1,
        finishPage: 1,
        startX: 0,
        endX: 0
      };
    },
    mounted() {
      // this.getMyFinishCourse();
      this.getMyUnFinishCourse();
      var element = this.$el;
      element.addEventListener('touchstart', (event) => {
        if (this.prevent) event.preventDefault();
        if (this.stopPropagation) event.stopPropagation();
      });

      element.addEventListener('touchmove', (event) => {
        if (this.prevent) event.preventDefault();
        if (this.stopPropagation) event.stopPropagation();
      });

      element.addEventListener('touchend', (event) => {
        if (this.prevent) event.preventDefault();
        if (this.stopPropagation) event.stopPropagation();
      });
    },
    components: {
      headerFix,
      mbTab,
      mbTabItem,
      courseList
    },
    methods: {
      //已完成课程
      async getMyFinishCourse() {
        this.noFData = false;
        this.noFDataBg = false;
        this.loading = true;
        Indicator.open();
        let data = await GetUserCourseInfoList({Finish: '1', Page: this.finishPage});
        Indicator.close();
        if (data.Type == 1) {
          let list = data.Data.List;
          if (list.length == 0 && this.finishPage > 1) {
            this.noFData = true;
            return;
          }
          if (list.length == 0 && this.finishPage == 1) {
            this.noFDataBg = true;
            return;
          }
          this.courseFinishData = this.courseFinishData.concat(list);
          this.loading = false;
          this.finishPage += 1;
        }
      },
      //未完成课程 Finish 0是未完成， Finish 2是全部
      async getMyUnFinishCourse() {
        this.noUfData = false;
        this.noUfDataBg = false;
        this.loading = true;
        Indicator.open();
        let data = await GetUserCourseInfoList({Finish: '2', Page: this.unFinishPage});
        Indicator.close();
        if (data.Type == 1) {
          let list = data.Data.List;
          if (list.length == 0 && this.unFinishPage > 1) {
            this.noUfData = true;
            return;
          }
          if (list.length == 0 && this.unFinishPage == 1) {
            this.noUfDataBg = true;
            return;
          }
          this.courseUnFinishData = this.courseUnFinishData.concat(list);
          this.loading = false;
          this.unFinishPage += 1;
        }
      },
      doOnTouchStart(event) {
        let pageX = event.targetTouches[0].pageX;
        this.startX = pageX;
      },
      doOnTouchMove(event) {

      },
      doOnTouchEnd(event) {
        let pageX = event.changedTouches[0].pageX;
        this.endX = pageX;
        //左滑
        if (this.endX < this.startX - 20) {
          this.tabType = '1';
        }
        //右滑
        if (this.endX > this.startX + 20) {
          this.tabType = '0';
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">

</style>
