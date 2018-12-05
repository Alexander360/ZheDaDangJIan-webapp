/**
* 培训班列表
*/
<template>
  <div class="class_list" :class="classType=='online'?'online_list':'offline_list'">
    <ul>
      <li v-for="(item) in data" :key="item.Id" class="clearfix" @click.stop="goDetail(item, $event)">
        <div class="class_right">
          <p class="class_title">
            <a>{{item.Name}}</a>
          </p>
          <p class="class_organizer" v-if="classType=='online'">主办单位：{{item.Organizers||'无'}}</p>
          <p class="class_time">开始时间：{{item.StartDate | dateFilter('yyyy-MM-dd hh:mm')}}</p>
          <p class="class_time" v-if="classType=='offline'">结束时间：{{item.EndDate | dateFilter('yyyy-MM-dd hh:mm')}}</p>
        </div>
        <div class="class_actions" v-if="classType=='online'">
          <template v-if="item.CanSinup==1">
            <mb-tag v-if="item.Status == 'UnJoin'" type="error">立即报名</mb-tag>
            <mb-tag v-if="item.Status == 'Join'" type="success">已报名</mb-tag>
            <mb-tag v-if="item.Status == 'UnAudit'" type="info">审核中</mb-tag>
          </template>
          <template v-else>
            <mb-tag type="disable">未开放报名</mb-tag>
          </template>
        </div>
        <div class="class_actions" v-else>
          <i class="webapp webapp-right"></i>
        </div>
      </li>
    </ul>
    <div class="no-data" v-if="noData">无数据</div>
    <div class="noDataBg" v-if="noDataBg"></div>
  </div>
</template>
<script>
  import {MessageBox} from 'mint-ui';
  import {UpdateTrainingStudentup} from '../service/getData';
  import mbTag from './mbTag.vue';

  export default {
    props: {
      data: Array,
      noDataBg: Boolean,
      noData: Boolean,
      classType: {
        type: String,
        default: 'online'
      }
    },
    components: {
      mbTag
    },
    methods: {
      goDetail(item, e) {
        let text = e.target.innerText;
        if (text == '立即报名') {
          this.signInClass(item);
        } else {
          this.$router.push({path: 'classDetail', query: {Id: item.Id, classType: this.classType}});
        }
      },
      async signInClass(item) {
        let res = await UpdateTrainingStudentup({Id: item.Id});
        if (res.IsSuccess) {
          MessageBox.alert('报名成功').then(() => {
            item.Status = 'UnAudit';
          });
        } else {
          MessageBox.alert('不在报名时间内');
        }
      }
    }
  };
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .class_list {
    li {
      background: $fill-base;
      padding: rem75(20px) rem64(30px);
      @include flex(flex-start);
      align-items: center;
    }

    .class_right {
      position: relative;

      .class_title {
        font-size: rem64(30px);
        @extend %ellipsis;
        line-height: rem64(50px);
      }

      .class_organizer {
        font-size: rem64(24px);
        color: #666;
        line-height: rem64(44px);
      }

      .class_time {
        font-size: rem64(22px);
        color: #999;
      }
    }

    &.online_list .class_right {
      width: rem64(425px);

      .class_time {
        line-height: rem64(55px);
      }
    }

    &.offline_list .class_right {
      width: rem64(500px);

      .class_title {
        margin-bottom: rem64(15px);
      }

      .class_time {
        line-height: rem64(40px);
      }
    }

    .class_actions {
      .mb_tag {
        width: rem64(140px);
        height: rem64(60px);
        line-height: rem64(60px);
        font-size: rem64(24px);

        &.success {
          background-color: #2d8e27;
        }

        &.error {
          background-color: $brand-primary;
        }
      }
    }

    &.offline_list {
      .class_actions {
        .webapp {
          color: $color-text-thirdly;
          font-size: rem64(36px);
        }
      }
    }
  }
</style>
