<template>
  <div class="exam container_both">
    <!--头部-->
    <header-fix :title="examTitle" fixed>
      <i class="webapp webapp-left" @click.stop="leaveExam" slot="left"></i>
    </header-fix>
    <div class="exam_header">
      <i class="webapp webapp-time" style="color: #00aeff"></i>
      <span v-if="timeLimit">倒计时：{{timeLimit | formatTime}}</span>
      <span v-else>倒计时：不限时</span>
    </div>
    <div class="exam_content" v-for="(list,index) in exam" :key="index">
      <transition :name="transitionName">
        <div v-if="itemNum == index + 1">
          <p class="exam_name">
            <span class="red" v-if="list.ThemeType==0">【判断题】</span>
            <span class="red" v-else-if="list.ThemeType==1">【单选题】</span>
            <span class="red" v-else-if="list.ThemeType==2">【多选题】</span>
            <span class="red" v-else-if="list.ThemeType==3">【简答题】</span>
            <span class="red" v-else-if="list.ThemeType==4">【填空题】</span>
            <span class="red" v-else>【其它】</span>
            <span class="topic_name">{{index + 1 + '.' + list.ThemeTitle}}</span>
            <span class="red">({{Number(list.ThemeScore).toFixed(1)}}分)</span>
          </p>
          <div class="exam_list">
            <div v-if="list.ThemeType == 0">
              <mb-radio :options="judgeItem" v-model="choosedItem[index]['Answer']"></mb-radio>
            </div>
            <div v-else-if="list.ThemeType == 1">
              <mb-radio :options="list.ItemInfo" v-model="choosedItem[index]['Answer']"></mb-radio>
            </div>
            <div v-else-if="list.ThemeType == 2">
              <mb-checklist :options="list.ItemInfo" v-model="choosedItem[index]['Answer']"></mb-checklist>
            </div>
            <div v-else-if="list.ThemeType == 3">
              <textarea class="answerInput"
                        v-model="choosedItem[index]['Content']"
                        rows="15"
                        placeholder="在此处出入答案内容">
              </textarea>
            </div>
            <div v-else-if="list.ThemeType == 4">
              <textarea class="answerInput"
                        v-model="choosedItem[index]['Content']"
                        rows="15"
                        placeholder="在此处出入答案内容">
              </textarea>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="exam_footer">
      <mt-button class="prev" type="primary" plain @click.native='preItem'>上一题</mt-button>
      <span class="itemNum"><span>试题</span> （{{itemNum}}/{{allItem}}）</span>
      <mt-button v-if="itemNum<allItem" type="primary" class="next" @click.native="nextItem">下一题</mt-button>
      <mt-button v-else type="primary" class="next" @click.native="submitExam">提交</mt-button>
    </div>
  </div>
</template>
<script>
  import {Button, MessageBox} from 'mint-ui';
  import Vue from 'vue';
  import {headerFix, mbChecklist, mbRadio} from '../components';
  import {GetExam, UpdateUserExam} from '../service/getData';
  import {goBack} from '../service/mixins';

  Vue.component(Button.name, Button);
  let routeFrom = {};
  export default {
    mixins: [goBack],
    data() {
      return {
        exam: [],
        examTitle: '',//标题
        examId: '',
        timeLimit: 0, //时间限制
        limitTimer: null,
        itemData: null, //当前显示题目data
        transitionName: 'slide-left',
        judgeItem: [
          {
            ThemeItemFlag: 'A',
            ThemeItemTitle: '正确'
          },
          {
            ThemeItemFlag: 'B',
            ThemeItemTitle: '错误'
          }
        ], //单选item
        itemNum: 1,//第几题
        allItem: 0,
        userInfo: null,
        choosedItem: [],
        startDate: ''//考试开始时间
      };
    },
    created() {
      this.examId = this.$route.query.id;
      this.startDate = new Date();
    },
    mounted() {
      this.getExam();
    },
    props: [],
    components: {
      headerFix,
      mbChecklist,
      mbRadio
    },
    computed: {},
    methods: {
      async getExam() {
        let data = await GetExam({Id: this.examId});
        if (data.Type == 1) {
          let exam = data.Data;
          this.exam = exam.ThemeInfoList;
          this.examTitle = exam.ExamTitle;
          this.timeLimit = exam.TimeLimit * 60;
          this.allItem = exam.ThemeCount;
          this.itemData = exam.ThemeInfoList[0];
          //初始化choosedItem
          this.initChoosedItem(this.exam);
          this.countDown();
        }
      },
      //初始化choosedItem
      initChoosedItem(arr) {
        if (arr instanceof Array && arr.length > 0) {
          arr.forEach((item, index) => {
            let themeID = item.ThemeId;
            let examType = item.ThemeType;
            if (examType == 2) {
              //多选model类型为数组
              this.choosedItem.push({
                'Answer': [],
                examType,
                'ExamId': this.examId,
                'QuestionId': themeID,
                'Content': ''
              });
            } else {
              //单选、判断 问答题
              this.choosedItem.push({
                'Answer': '',
                examType,
                'ExamId': this.examId,
                'QuestionId': themeID,
                'Content': ''
              });
            }
          });
        }
      },
      //点击下一题
      nextItem() {
        this.transitionName = 'slide-left';
        if (this.itemData.ThemeType == 0 || this.itemData.ThemeType == 1) {
          let Answer = this.choosedItem[this.itemNum - 1].Answer;
          if (typeof Answer === 'string' && Answer) {
            this.$nextTick(() => {
              this.itemNum++;
            });
            return;
          }
          MessageBox('提示', '请选择选项');
        } else if (this.itemData.ThemeType == 2) {
          let Answer = this.choosedItem[this.itemNum - 1].Answer;
          if (Answer instanceof Array && Answer.length > 0) {
            this.$nextTick(() => {
              this.itemNum++;
            });
            return;
          }
          MessageBox('提示', '请选择选项');
        } else if (this.itemData.ThemeType == 3 || this.itemData.ThemeType == 4) {
          let Content = this.choosedItem[this.itemNum - 1].Content;
          if (typeof Content === 'string' && Content) {
            this.$nextTick(() => {
              this.itemNum++;
            });
            return;
          }
          MessageBox('提示', '请填写答案');
        }
      },
      //点击上一题
      preItem() {
        if (this.itemNum > 1) {
          this.transitionName = 'slide-right';
          this.$nextTick(() => {
            this.itemNum--;
          });
        } else {
          this.itemNum = 1;
        }
      },
      async upDateExam() {
        let params = this.changeSendData(this.choosedItem);
        UpdateUserExam({StartTime: this.startDate, ExamId: this.examId, Data: params})
          .then((data) => {
            if (data.Type == 1) {
              let endDate = new Date();
              let usedTime = endDate - this.startDate;
              let queryData = {...data.Data, ...{usedTime}, ...{examId: this.examId}, routeFrom};
              this.$router.push({path: 'examResult', query: {data: JSON.stringify(queryData)}});
            } else if (data.Type != 401) {
              MessageBox('警告', data.Message);
            }
          });
      },
      //提交考试
      submitExam() {
        MessageBox.confirm('确定提交试卷?').then(() => {
          this.upDateExam();
        });
      },
      /*提交数据*/
      changeSendData(data) {
        if (data instanceof Array && data.length > 0) {
          let orgData = data;
          orgData.forEach((item, index) => {
            if (item.examType == 2) {
              delete item['examType'];
              item.Answer = item.Answer.sort().join('');
            } else {
              delete item['examType'];
            }
          });
          return orgData;
        }
      },
      countDown() {
        let time = parseInt(this.timeLimit);
        this.limitTimer = setInterval(() => {
          time -= 1;
          this.timeLimit = time;
          if (time <= 0) {
            clearInterval(this.limitTimer);
            MessageBox.alert('考试时间已到').then(action => {
              this.upDateExam();
            });
          }
        }, 1000);
      },
      leaveExam() {
        MessageBox.confirm('确定要离开考试页面吗？').then(() => {
          clearInterval(this.limitTimer);
          this.goBack();
        });
      }
    },
    watch: {
      itemNum: function(val) {
        this.itemData = this.exam[val - 1];
      }
    },
    beforeRouteEnter(to, from, next) {
      routeFrom = {name: from.name, query: from.query};
      next();
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import '../style/mixin';

  .exam {
    background-color: $fill-base;
    font-size: 15px;

    .exam_header {
      padding: 0 rem75(30px);
      border-bottom: 1px solid $border-color-base;
      text-align: center;
      line-height: rem75(62px);

      img {
        width: rem75(29px);
      }
    }

    .exam_content {
      position: absolute;
      left: 0;
      right: 0;
      padding: 0 rem75(40px);

      .exam_name {
        padding: rem75(30px) 0 rem75(100px) 0;

        .red {
          color: $brand-primary;
        }
      }

      .topic_name {
        line-height: rem75(50px);
      }

      .exam_list {
        .answerInput {
          width: 100%;
          padding: rem75(10px);
          resize: none;
          border: 1px solid $border-color-base;
          @include borderRadius75(10px);
          font-size: 14px;
        }
      }
    }

    .exam_footer {
      position: fixed;
      width: 100%;
      bottom: rem75(20px);
      text-align: center;
      left: 0;
      /*line-height: 73px;*/
      .mint-button {
        @include wh75(150px, 73px);
        padding: 0;
      }

      .prev {
        margin-left: rem75(30px);
      }

      .itemNum {
        display: inline-block;
        width: rem75(350px);
        line-height: rem75(73px);

        span {
          color: $color-text-secondary;
          font-size: 14px;
        }
      }

      .next {
        margin-right: rem75(30px);
      }
    }
  }
</style>
