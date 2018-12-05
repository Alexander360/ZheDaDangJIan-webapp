/**
* 课程评论
*/
<template>
  <div class="evaluate">
    <div class="course_judge_tag" @click="openEvaluateModel">
      <p class="title">评价该课程</p>
      <p class="judge">
        <star v-model="commentCredit" disabled></star>
      </p>
    </div>
    <div class="split"></div>
    <div class="course_comment">
      <h1>评价详情 <span class="course_comment_count">（{{commentCount}}个评价）</span></h1>
      <!--<section v-infinite-scroll="getCommentList"
               infinite-scroll-immediate-check="immediate"
               infinite-scroll-disabled="loading"
               infinite-scroll-distance="10">
        <div class="course_comment_item" v-for="(item,index) in commentList" :key="item.CommentId">
          <div class="left_avatar"><img src="../assets/male.png" alt=""/></div>
          <div class="right_content">
            <p class="name">
              <span>{{item.UserName}}</span>
              <star v-model="item.Star" size="small" disabled></star>
            </p>
            <p class="date">{{item.Createtime}}</p>
            <p class="content">{{item.CommentComtent}}</p>
          </div>
        </div>
      </section>-->
      <div class="course_comment_item" v-for="(item) in commentList" :key="item.CommentId">
        <div class="left_avatar">
          <error-img :src="item.HeadImg" :error-src="male"></error-img>
        </div>
        <div class="right_content">
          <p class="name">
            <span>{{item.UserName}}</span>
            <star v-model="item.Star" size="small" disabled></star>
          </p>
          <p class="date">{{item.Createtime}}</p>
          <p class="content">{{item.CommentComtent}}</p>
        </div>
      </div>
    </div>
    <!--添加评论-->
    <mb-model :is-show.sync="isShowModel">
      <div slot class="addEvaluate">
        <star v-model="addCourseData.Star" show-text></star>
        <textarea v-model="addCourseData.Content" type="text" placeholder="评论，100以内"></textarea>
        <a @click.prevent="addComment" class="submit">提交</a>
      </div>
    </mb-model>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Toast, MessageBox, InfiniteScroll } from 'mint-ui'
  import mbModel from './mbModel.vue'
  import star from './star.vue'
  import errorImg from './errorImg.vue'
  import { GetCommentList, AddComment } from '../service/getData'
  import male from '../assets/male.png'

  Vue.use(InfiniteScroll)
  export default {
    data () {
      return {
        male,
        isShowModel: false,
        noData: false,
        immediate: false,
        loading: false,
        page: 1,
        commentList: [],
        commentCount: [],
        addCourseData: {
          ObjType: '1',
          ObjId: this.courseId,
          Content: '',
          Star: 5,
        }
      }
    },
    props: ['courseId', 'commentCredit'],
    components: {
      mbModel,
      star,
      errorImg,
    },
    mounted () {
      this.getCommentList()
    },
    methods: {
      //课程评论列表
      async getCommentList () {
        this.noData = false
        this.loading = true
        let data = await GetCommentList({objType: 1, objId: this.courseId})
        if (data.Type == 1) {
          let list = data.Data
          this.commentCount = data.Data.length
          if (list.length == 0) {
            this.noData = true
            return
          }
          this.commentList = list
          this.loading = false
          this.page += 1
        }
      },
      //添加课程评论
      async addComment () {
        if (this.addCourseData.Content.length > 0 && this.addCourseData.Content.length <= 100) {
          let data = await AddComment(this.addCourseData)
          if (data.Type == 1) {
            this.getCommentList()
            Toast({message: data.Message, position: 'bottom'})
          } else if (data.Type != 401) {
            MessageBox('警告', data.Message)
          }
          this.isShowModel = false
        } else {
          Toast({message: '评论内容不能超过100字！', position: 'bottom'})
        }
      },
      openEvaluateModel () {
        this.isShowModel = true
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .evaluate {
    background-color: $fill-base;
    .course_judge_tag {
      .title {
        @include ht-lineHt75(112px);
        text-align: center;
        font-size: 15px;
      }
      .judge {
        width: 4.146667rem;
        height: 0.4rem;
        /*background: url(../assets/bigStar.png) no-repeat 0 0;*/
        /*background-size: 4.146667rem 4.4rem;*/
        margin: 0 auto rem75(30px);
      }
    }
    .addEvaluate {
      padding: rem75(20px) rem75(20px) 0 rem75(20px);
      text-align: center;
      .rate_text {
        display: block;
        color: $color-text-base;
        margin-top: rem75(10px);
      }
      textarea {
        display: block;
        resize: none;
        width: 100%;
        height: rem75(225px);
        font-size: 13px;
        background: #f7f9fc;
        padding: rem75(10px);
      }
      .submit {
        display: block;
        width: 100%;
        height: 1.4rem;
        line-height: 1.4rem;
        text-align: center;
        background: #fff;
        color: $brand-primary;
        font-size: 13px;
      }
    }
    .course_comment {
      padding: 0 rem75(30px);
      h1 {
        font-size: 14px;
        line-height: rem75(60px);
      }
      .course_comment_count {
        color: $color-text-thirdly;
      }
    }
    .course_comment_item {
      @extend %clearfix;
      padding: rem75(20px) 0 rem75(30px);
      border-bottom: 1px solid $border-color-light;
      .left_avatar {
        @extend %pull-left;
        width: rem75(80px);
        img {
          width: rem75(65px);
        }
      }
      .right_content {
        @extend %pull-left;
        width: rem75(600px);
        .name {
          font-size: 14px;
          font-weight: 600;
        }
        .star_grade {
          @extend %pull-right;
        }
        .date {
          color: $color-text-thirdly;
          padding: rem75(10px) 0;
        }
        .content {
          color: $color-text-secondary;
        }
      }
    }
    .split {
      display: block;
      height: rem75(20px);
      background-color: $fill-body;
    }
  }
</style>
