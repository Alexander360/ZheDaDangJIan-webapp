/**
* 班级详情
*/
<template>
  <div class="class_detail container_top" :class="classType=='online'?'online_class_detail':'offline_class_detail'">
    <header-fix :title="detailTitle" fixed>
      <i slot="left" class="webapp webapp-left" @click.stop="goBack"></i>
    </header-fix>
    <div class="class_detail_cont">
      <p class="class_title">{{classDetail.Name}}</p>
      <div class="class_detail_item">
        <span class="training_label">培训时间：</span>
        <span class="training_date">{{classDetail.StartDate | dateFilter}}—{{classDetail.EndDate | dateFilter}}</span>
      </div>
      <div class="class_detail_item">
        <span class="training_label">报名时间：</span>
        <span
          class="training_date">{{classDetail.SignStartDate | dateFilter}}—{{classDetail.SignEndDate | dateFilter}}</span>
      </div>
      <div class="class_detail_item">
        <span class="training_label">举办单位：</span>
        <span
          class="training_date">{{classDetail.Organizers||'无'}}</span>
      </div>
    </div>
    <div class="boundary"></div>
    <div class="class_desc">
      <div class="sign_title">
        <span>结业方式：</span>
      </div>
      <div class="class_course_detail">
        <p>{{classDetail.GraduateWay || '无'}}</p>
      </div>
    </div>
    <div class="class_desc">
      <div class="sign_title">
        <span>班级简介：</span>
      </div>
      <div class="class_course_detail">
        <p>{{classDetail.Description || '无'}}</p>
      </div>
    </div>
    <div class="cancel" v-if="classType == 'online'">
      <template v-if="classDetail.CanSinup == 1">
        <mt-button v-if="classDetail.Status == 'UnAudit'" @click.native="signOutClass" type="primary" size="large">
          取消报名
        </mt-button>
        <mt-button v-if="classDetail.Status == 'UnJoin'" @click.native="signInClass" type="primary" size="large">报名
        </mt-button>
        <template v-if="classDetail.Status == 'Join'">
          <router-link :to="{path: '/classCourse', query: {Id: classId}}">课程</router-link>
          <router-link :to="{path: '/classExam', query: {Id: classId}}">考试</router-link>
        </template>
      </template>
      <template v-else>
        <template v-if="classDetail.Status == 'Join'">
          <router-link :to="{path: '/classCourse', query: {Id: classId}}">课程</router-link>
          <router-link :to="{path: '/classExam', query: {Id: classId}}">考试</router-link>
        </template>
      </template>
    </div>
    <div class="check_schedule" v-if="classType == 'offline'">
      <template v-if="classDetail.CanSinup == 1">
        <mt-button v-if="classDetail.Status == 'UnAudit'" @click.native="signOutClass" type="primary" size="large">
          取消报名
        </mt-button>
        <mt-button v-if="classDetail.Status == 'UnJoin'" @click.native="signInClass" type="primary" size="large">报名
        </mt-button>
        <template v-if="classDetail.Status == 'Join'">
          <mt-button type="primary" @click="checkSchedule">查看日程</mt-button>
        </template>
      </template>
      <template v-else>
        <template v-if="classDetail.Status == 'Join'">
          <mt-button type="primary" @click="checkSchedule">查看日程</mt-button>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
  import {Button, MessageBox, Toast} from 'mint-ui';
  import Vue from 'vue';
  import {signList} from '../components';
  import {GetTrainingDetail, UpdateTrainingStudentdown, UpdateTrainingStudentup} from '../service/getData';

  Vue.component(Button.name, Button);
  export default {
    data() {
      return {
        detailTitle: '培训班详细',
        classId: '',
        todayFlag: true,
        classDetail: '',
        signData: [],
        isJoinClass: false,
        url: window.location.href,
        longitude: '', //经度
        latitude: '' //纬度
      };
    },
    created() {
      this.classId = this.$route.query.Id || '';
      this.classType = this.$route.query.classType || 'online';
    },
    mounted() {
      /*班级详情*/
      this.getClassDetail();
    },
    components: {
      signList
    },
    methods: {
      goBack() {
        if (this.classType == 'online') {
          this.$router.push({path: '/onlinePartySchool'});
        } else {
          this.$router.push({path: '/classGarden'});
        }
      },
      //班级详情
      async getClassDetail() {
        let res = await GetTrainingDetail({Id: this.classId});
        if (res.IsSuccess) {
          this.classDetail = res.Data;
        }
      },
      //报名
      async signInClass() {
        let data = await UpdateTrainingStudentup({Id: this.classId});
        if (data.Type == 1) {
          this.isJoinClass = true;
          Toast({message: data.Message, position: 'bottom'});
          this.getClassDetail();
        } else if (data.Type != 401) {
          MessageBox('警告', data.Message);
        }
      },
      //取消报名
      async signOutClass() {
        let data = await UpdateTrainingStudentdown({Id: this.classId});
        if (data.Type == 1) {
          this.isJoinClass = false;
          Toast({message: data.Message, position: 'bottom'});
          this.getClassDetail();
        } else if (data.Type != 401) {
          MessageBox('警告', data.Message);
        }
      },
      checkSchedule() {
        this.$router.push({path: '/classSchedule', query: {Id: this.classId}});
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .class_detail {
    background-color: white;

    &.online_class_detail {
      padding-bottom: rem64(80px);
    }

    &.offline_class_detail {
      padding-bottom: rem64(120px);
    }

    .header {
      background-color: #fff;

      .header_title, .webapp {
        color: #000;
      }

      border-bottom: 1px solid #ddd;
    }

    .class_detail_cont {
      background-color: $fill-base;
      padding: rem64(30px) rem64(30px) rem64(15px);

      .class_title {
        line-height: rem64(52px);
        font-size: rem64(32px);
        margin-bottom: rem64(50px);
      }
    }

    .class_detail_item {
      line-height: rem64(60px);
      font-size: rem64(30px);

      .training_date {
        color: #666;
      }
    }

    .boundary {
      height: rem64(20px);
      background-color: $fill-body;
    }

    .class_desc {
      background-color: $fill-base;
      padding: rem64(30px);
      font-size: rem64(30px);
      line-height: rem64(50px);

      .sign_title {
        line-height: rem64(60px);
      }

      .class_course_detail {
        text-indent: 2em;
        color: $color-text-thirdly;
      }
    }

    .cancel {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #fff;
      @include flex();

      .mint-button--large {
        border-radius: 0;
      }

      a {
        flex: 1;
        display: block;
        height: rem64(80px);
        line-height: rem64(80px);
        background-color: $brand-primary;
        font-size: rem64(30px);
        text-align: center;
        color: #fff;

        &:nth-child(1) {
          margin-right: 1px;
        }

        &:nth-child(2) {
          margin-left: 1px;
        }
      }
    }

    .check_schedule {
      position: fixed;
      bottom: 0;
      height: rem64(120px);
      width: 100%;
      padding: 0 rem64(30px);

      .mint-button {
        width: 100%;
        height: rem64(80px);

      }
    }
  }
</style>
