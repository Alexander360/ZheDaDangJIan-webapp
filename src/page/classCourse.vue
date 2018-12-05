<template>
  <div class="class_course container_top">
    <header-fix title="课程" fixed>
      <i slot="left" class="webapp webapp-left" @click="goBack"></i>
    </header-fix>
    <section class="container">
      <section v-infinite-scroll="getCourse"
               infinite-scroll-immediate-check="immediate"
               infinite-scroll-disabled="loading"
               infinite-scroll-distance="10">
        <ul>
          <li v-for="item in courseList" :key="item.CourseId" @click="toPlay(item.CourseType,item.CourseId)">
            <img class="course_img" v-lazy="item.CourseImg"/>
            <div class="course_info">
              <p class="course_name">{{item.CourseName}}</p>
              <p class="course_desc">
                <span class="course_teacher">讲师：{{item.TeacherName || '无'}}</span>
                <span class="course_type" v-if="item.CourseType=='JYAicc'">分类：精品课程</span>
                <span class="course_type" v-else-if="item.CourseType=='Mp4'">分类：单视频</span>
                <span class="course_type" v-else-if="item.CourseType=='h5'">分类：h5课程</span>
                <span class="course_type" v-else>分类：无</span>
              </p>
              <p>
                <span class="course_credit">{{item.Credit}}分</span>
              </p>
            </div>
            <div class="course_require">
              {{item.RequiredFlag==0?'必修':'选修'}}
            </div>
          </li>
        </ul>
        <div class="no-data" v-if="noData">没有更多内容啦</div>
        <div class="noDataBg" v-if="noDataBg"></div>
      </section>

    </section>
  </div>
</template>

<script>
  import {InfiniteScroll, Lazyload} from 'mint-ui';
  import Vue from 'vue';
  import noCourse from '../assets/noCourse.png';
  import {GetClassCourseInfoList} from '../service/getData';
  import {goBack, toPlay} from '../service/mixins';

  Vue.use(Lazyload, {
    error: noCourse
  });
  Vue.use(InfiniteScroll);
  export default {
    mixins: [goBack, toPlay],
    data() {
      return {
        Id: '',
        noData: false,
        noDataBg: false,
        page: 1,
        courseList: [],
        noCourse
      };
    },
    computed: {},
    created() {
      this.Id = this.$route.query.Id;
      this.getCourse();
    },
    methods: {
      async getCourse() {
        if (this.page > 1 && this.noData) return;
        let res = await GetClassCourseInfoList({TrainingId: this.Id, Page: this.page});
        console.log(res);
        let list = res.Data.List;
        if (this.page == 1 && list.length == 0) {
          this.noDataBg = true;
          return;
        }
        if (this.page > 1 && list.length == 0) {
          this.noData = true;
          return;
        }
        this.courseList = this.courseList.concat(list);
        this.page++;
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .class_course {
    background-color: #fff;

    .header {
      background-color: #fff;
      border-bottom: 1px solid #ddd;

      .webapp, .header_title {
        color: #000;
      }
    }

    .container {

      padding: 0 rem64(30px);

      ul {
        padding-top: rem64(15px);

        li {
          position: relative;
          margin-bottom: rem64(40px);
          @include flex(flex-start);
          overflow: hidden;

          .course_img {
            width: rem64(192px);
            height: rem64(124px);
            border-radius: rem64(8px);
          }

          .course_info {
            position: relative;
            margin-left: rem64(18px);

            .course_name {
              width: rem64(370px);
              font-size: rem64(30px);
              @extend %ellipsis;
            }

            .course_desc {
              font-size: rem64(24px);
              line-height: 2;
              color: $color-text-secondary;

              .course_teacher {
                float: left;
              }

              .course_type {
                float: right;
                margin-right: rem64(20px);
              }
            }

            .course_credit {
              position: absolute;
              bottom: 0;
              left: 0;
              font-size: rem64(22px);
              color: $brand-primary;
            }
          }

          .course_require {
            position: absolute;
            right: rem64(-25px);
            bottom: rem64(-80px);
            @include square64(80px);
            line-height: 1;
            font-size: 12px;
            text-align: center;
            background-color: $brand-primary;
            color: white;
            transform-origin: 0 0;
            transform: rotate(-45deg);
          }
        }
      }

    }
  }
</style>
