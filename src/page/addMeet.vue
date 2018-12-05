<template>
  <div class="add_meet_page container_top">
    <header-fix title="会议添加" fixed>
      <i slot="left" class="webapp webapp-left" @click="goBack"></i>
    </header-fix>
    <section class="container">
      <mt-field label="会议名称" v-model="submitData.Name" placeholder="请输入会议名称"></mt-field>
      <mt-cell title="会议分类" is-link :value="activeMeetType.text||'请选择'" @click.native="showTypes"></mt-cell>
      <mt-cell title="开始时间" is-link :value="submitData.StartDate |date('yyyy年MM月dd日 hh时mm分') ||'请选择'"
               @click.native="showStart"></mt-cell>
      <mt-field label="时长" placeholder="请填写时长(单位：分钟)" v-model="submitData.MeetLength"></mt-field>
      <div class="boundary"></div>
      <mt-field label="会议主题" v-model="submitData.MeetTheme" placeholder="请输入会议主题，最多64字"
                :attr="{maxlength: 64}"></mt-field>
      <mt-field label="会议简介" v-model="submitData.MeetIntroduce" type="textarea" placeholder="请输入内容..."></mt-field>
      <mt-field label="会议地点" v-model="submitData.MeetAddress" type="textarea" placeholder="请输入内容..."></mt-field>
      <mt-field label="主办支部" v-model="submitData.MeetGroup" type="textarea" placeholder="请输入内容..."></mt-field>
      <mt-field label="会议计划" v-model="submitData.MeetPlan" type="textarea" placeholder="请输入内容..."></mt-field>
      <mt-field label="应到人数" v-model="submitData.PlanPeopleCount" type="textarea" placeholder="请输入应到人数..."></mt-field>
      <mt-field label="实到人数" v-model="submitData.PeopleCount" type="textarea" placeholder="请输入实到人数..."></mt-field>
      <div class="upload_container">
        <div class="up_progress">
          <i class="webapp webapp-add-block" @click="getAttachment"></i>
          <input type="file" ref="attach" @change="pushAttach($event)" accept="image/*">
          <mt-progress v-if="progressData" :value="progressData">
            <div slot="end">100%</div>
          </mt-progress>
        </div>

        <div class="img_list" v-if="uploadImg.length>0">
          <img v-for="(src,index) in uploadImg" :key="index" :src="src">
        </div>
      </div>
    </section>
    <mt-button class="submit_meet" type="primary" @click="submitMeet">发布</mt-button>
    <mt-popup v-model="isShowTypes" position="bottom">
      <ul class="meet_type_list">
        <li class="meet_type_item" v-for="item in meetTypes" :key="item.href" @click="selectMeetType(item)">
          {{item.text}}
        </li>
      </ul>
    </mt-popup>
    <mt-datetime-picker
      ref="startPicker"
      v-model="startDate"
      type="datetime"
      :start-date="pickerStartDate"
      :start-hour="0"
      :end-hour="23"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      hourFormat="{value} 时"
      minuteFormat="{value} 分"
      @confirm="selectStartDate">
    </mt-datetime-picker>
  </div>
</template>

<script>
  import {Cell, Field, MessageBox, Popup, Progress, Toast} from 'mint-ui';
  import uuidv1 from 'uuid/v1';
  import Vue from 'vue';
  import fetch from '../service/fetch';
  import {MeetRecordCreate, UploadAttachment} from '../service/getData';
  import {goBack} from '../service/mixins';

  Vue.component(Field.name, Field);
  Vue.component(Cell.name, Cell);
  Vue.component(Popup.name, Popup);
  Vue.component(Progress.name, Progress);
  export default {
    mixins: [goBack],
    data() {
      return {
        meetId: null,
        meetTypes: [],
        isShowTypes: false,
        startDate: new Date(),
        submitData: {},
        activeMeetType: {},
        MeetPhotoModel: [],
        uploadImg: [],
        progressData: 0
      };
    },
    computed: {
      pickerStartDate() {
        let year = new Date().getFullYear();
        let month = new Date().getMonth();
        let date = new Date().getDate();
        return new Date(`${year}-${month}-${date} 00:00`);
      }
    },
    created() {
      this.getTypes();
    },
    methods: {
      async getTypes() {
        let res = await fetch.post('/api/admin/common/enumtype?type=MeetType');
        this.meetTypes = res;
      },
      showTypes() {
        this.isShowTypes = true;
      },
      showStart() {
        this.$refs.startPicker.open();
      },
      selectMeetType(item) {
        this.submitData.TypeId = item.href;
        this.activeMeetType = item;
        this.isShowTypes = false;
      },
      selectStartDate() {
        let StartDate = this.startDate;
        this.submitData = {...this.submitData, StartDate};
        this.$refs.startPicker.close();
      },
      async submitMeet() {
        this.submitData = {...this.submitData, MeetPhotoModel: this.MeetPhotoModel};
        let res = await MeetRecordCreate(this.submitData);
        if (res.IsSuccess) {
          MessageBox.alert(res.Message).then(() => {
            this.$router.push('/meetList');
          });
        } else {
          MessageBox.alert(res.Message);
        }
      },
      async pushAttach(e) {
        let file = e.target.files[0];
        let arr = file.name.split('.');
        let fileType = arr[arr.length - 1];
        let formData = new FormData();
        let fileName = `${uuidv1()}`;
        formData.append('FileType', 'MeetAttachment');
        formData.append('FileCode', fileName);
        formData.append('FileExtension', fileType);
        formData.append('file', file, fileName);
        let res = await UploadAttachment(formData, {
          onUploadProgress: progressEvent => {
            this.progressData = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
          }
        });
        if (res.IsSuccess) {
          this.progressData = 0;
          Toast({message: '上传成功', position: 'bottom'});
          this.uploadImg.push(res.Data);
          this.MeetPhotoModel.push({Name: fileName, ImgUrl: `${fileName}.${fileType}`});
        } else {
          this.progressData = 0;
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
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .add_meet_page {
    padding-bottom: rem64(80px);

    .boundary {
      background-color: $fill-body;
      width: 100%;
      height: rem64(20px);
    }

    .mint-popup {
      width: 100%;

      .meet_type_list {
        width: 100%;
        max-height: 45vh;
        padding-top: 25px;
        overflow-y: scroll;

        .meet_type_item {
          width: 100%;
          text-align: center;
          font-size: rem64(28px);
          line-height: 2.5;
          border-bottom: 1px solid #ddd;
        }
      }
    }

    .mint-datetime-picker {
      .picker-slot {
        font-size: 16px;
      }

      .picker-item {
        padding: 0;
      }
    }

    .mint-cell {
      .mint-cell-wrapper {
        padding: 0 rem64(30px);

        .mint-cell-text {
          margin-left: 0;

          &:after {
            content: "*";
            display: inline;
            padding-left: rem64(5px);
            color: red;
            font-size: 16px;
            line-height: 1;
          }
        }
      }

      &.is-textarea {
        height: auto;

        .mint-cell-wrapper {
          display: block;
        }

        .mint-cell-title {
          width: 100%;
          padding: 0;
        }

        .mint-cell-value {
          width: 100%;
        }

        textarea {
          height: 27px;
        }
      }
    }

    .submit_meet {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: rem64(80px);
      border-radius: 0;
    }

    .upload_container {
      background-color: #fff;
      padding: rem64(20px) rem64(30px);
      min-height: rem64(170px);

      .up_progress {
        position: relative;
        padding-left: rem64(130px);
        min-height: rem64(170px);
      }

      .webapp-add-block {
        position: absolute;
        left: 0;
        top: 0;
        color: #ddd;
        font-size: rem64(120px);
      }

      input[type=file] {
        display: none;
      }

      .img_list {
        img {
          margin-bottom: rem64(15px);
          width: 100%;
          height: auto;
        }
      }
    }

  }
</style>
