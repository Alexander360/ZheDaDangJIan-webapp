<template>
  <div class="class_schedule container_top">
    <header-fix title="日程" fixed>
      <i slot="left" class="webapp webapp-left" @click="goBack"></i>
    </header-fix>
    <section class="container">
      <ul>
        <li class="schedule_item" v-for="item in scheduleData" :key="item.Id">
          <div class="clearfix">
            <span class="gray_text">日期</span>
            <span>{{item.ScheduleDate|dateFilter('MM月dd日')}}</span>
          </div>
          <div class="clearfix">
            <span class="gray_text">时间</span>
            <span v-if="item.IsMorning == 1">上午</span>
            <span v-else-if="item.IsMorning == 2">下午</span>
            <span v-else>全天</span>
          </div>
          <div class="clearfix">
            <span class="gray_text">说明</span>
            <span>{{item.ScheduleContent}}</span>
          </div>
          <mt-button class="get_off" v-if="item.TrainingLeaveState==0" type="primary" @click="showModal(item)">请假
          </mt-button>
          <mt-button class="get_off success" v-else-if="item.TrainingLeaveState==1" type="primary">请假成功</mt-button>
          <mt-button class="get_off info" v-else-if="item.TrainingLeaveState==2" type="default">审核中</mt-button>
          <mt-button class="get_off danger" v-else-if="item.TrainingLeaveState==3" type="danger">审核失败</mt-button>
        </li>
      </ul>
    </section>
    <mb-model :is-show.sync="isShow">
      <div class="modal_header">请假条</div>
      <div class="modal_content">
        <div class="off_time input_group">
          <span>请假时间</span>
          <input type="text" v-model="offData.time" readonly>
        </div>
        <div class="off_reason input_group">
          <span>请假理由</span>
          <textarea placeholder="不少于30个字并且不大于50个字" v-model="offData.reason"></textarea>
        </div>
        <div class="off_attachment">
          <img v-if="uploadImg" :src="uploadImg">
        </div>
        <i class="webapp webapp-add-block" @click="getAttachment"></i>
        <input type="file" ref="attach" @change="pushAttach($event)" accept="image/*">
      </div>
      <div class="modal_footer" @click="getOff">提交</div>
    </mb-model>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui';
  import {GetTrainingScheduleList, TrainingLeaveCreate, UploadAttachment} from '../service/getData';
  import {goBack} from '../service/mixins';

  export default {
    mixins: [goBack],
    data() {
      return {
        Id: '',
        scheduleData: [],
        isShow: false,
        offData: {},
        attachment: null,
        uploadImg: null
      };
    },
    computed: {},
    created() {
      this.Id = this.$route.query.Id;
    },
    mounted() {
      this.getSchedule();
    },
    methods: {
      async getSchedule() {
        let res = await GetTrainingScheduleList(this.Id);
        if (res.IsSuccess) {
          this.scheduleData = res.Data;
        }
      },
      showModal(item) {
        this.offData = item;
        let date = new Date(item.ScheduleDate);
        this.offData.time = `${date.getMonth()}月${date.getDay()}日 ${item.IsMorning == 1 ? '上午' : (item.IsMorning ==
        2 ? '下午' : '全天')}`;
        this.isShow = true;
      },
      async pushAttach(e) {
        let file = e.target.files[0];
        let arr = file.name.split('.');
        let fileType = arr[arr.length - 1];
        let formData = new FormData();
        let fileName = `${+new Date()}-${this.offData.TrainingId}-${this.offData.Id}`;
        formData.append('FileType', 'TrainingAttachment');
        formData.append('FileCode', fileName);
        formData.append('FileExtension', fileType);
        formData.append('file', file, fileName);
        let res = await UploadAttachment(formData);
        if (res.IsSuccess) {
          Toast({message: '上传成功', position: 'bottom'});
          this.uploadImg = res.Data;
          this.offData.Attachment = fileName + '.' + fileType;
        } else {
          Toast({message: '上传失败', position: 'bottom'});
        }
      },
      getAttachment() {
        console.log('触发click');
        // eslint-disable-next-line
        var notNeed = FastClick.notNeeded(document.body);
        this.$refs.attach.click();
        if (!notNeed) {
          this.$refs.attach.click();
        }
      },
      async getOff() {
        if (!this.offData.reason) {
          Toast({message: '请填写请假理由', position: 'bottom'});
          return;
        }
        let res = await TrainingLeaveCreate({
          TrainingScheduleId: this.offData.Id,
          LeaveDate: this.offData.ScheduleDate,
          Reason: this.offData.reason,
          Attachment: this.offData.Attachment
        });
        if (res.IsSuccess) {
          this.isShow = false;
          Toast({message: '已成功提交请假申请', position: 'bottom'});
          this.getSchedule();
        } else {
          Toast({message: res.Message, position: 'bottom'});
        }
      }
    },
    watch: {}
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .class_schedule {
    .schedule_item {
      position: relative;
      border-bottom: 1px solid #ddd;
      padding: rem64(20px) rem64(30px) 0;
      font-size: rem64(30px);

      & > div {
        position: relative;
        padding-left: rem64(95px);
        margin-bottom: rem64(20px);
        line-height: rem64(46px);
      }

      .gray_text {
        position: absolute;
        left: 0;
        width: rem64(95px);
        color: $color-text-thirdly;
      }

      .get_off {
        position: absolute;
        right: rem64(30px);
        top: rem64(45px);
        width: rem64(140px);
        height: rem64(65px);

        &.success {
          background-color: $brand-success;
          color: #fff;
        }

        &.info {
          background-color: $brand-info;
          color: #fff;
        }

        &.danger {
          background-color: $brand-error;
          color: white;
        }
      }
    }

    .mb-model_container {
      .mb-model_content {
        width: rem64(580px);

        .cancel {
          display: none;
        }

        .slot_content {
          margin-top: 0;

          .modal_header {
            border-bottom: 1px solid #ddd;
            text-align: center;
            height: rem64(95px);
            line-height: rem64(95px);
            font-size: rem64(34px);
            font-weight: bold;
          }

          .modal_content {
            position: relative;
            padding: rem64(50px) rem64(30px) rem64(20px);
            height: rem64(510px);
            overflow-y: scroll;

            .input_group {
              position: relative;
              margin-bottom: rem64(30px);
              padding-left: rem64(130px);

              span {
                position: absolute;
                left: 0;
                line-height: rem64(42px);
                width: rem64(130px);
                font-size: rem64(30px);
              }

              input {
                border: 1px solid #ddd;
                border-radius: rem64(10px);
                width: 100%;
                height: rem64(42px);
                line-height: rem64(42px);
                padding: 0 rem64(10px);
                background-color: #f1f1f1;
              }

              textarea {
                border: 1px solid #ddd;
                border-radius: rem64(10px);
                padding: rem64(10px);
                width: 100%;
                height: rem64(150px);
                resize: none;
              }
            }

            .off_attachment {
              padding-left: rem64(130px);

              img {
                width: rem64(390px);
                height: auto;
              }
            }

            .webapp-add-block {
              position: absolute;
              left: rem64(30px);
              bottom: rem64(20px);
              color: #ddd;
              font-size: rem64(120px);
            }

            input[type=file] {
              display: none;
            }
          }

          .modal_footer {
            border-top: 1px solid #ddd;
            height: rem64(80px);
            line-height: rem64(80px);
            font-size: rem64(30px);
            color: #0774fb;
            text-align: center;
          }
        }
      }

    }
  }
</style>
