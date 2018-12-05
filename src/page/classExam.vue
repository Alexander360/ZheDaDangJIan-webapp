<template>
  <div class="class_exam container_top">
    <header-fix title="课程" fixed>
      <i slot="left" class="webapp webapp-left" @click="goBack"></i>
    </header-fix>
    <section class="container">
      <ul>
        <li v-for="item in examList" :key="item.examId"
            @click.stop="checkAttempt(item.ExamId,item.TriesLimit,item.LattemptNumber,item.EndTime)">
          <p class="exam_name">{{item.ExamTitle}}</p>
          <p class="exam_end">
            结束时间:{{item.EndTime | dateFilter('yyyy.MM.dd hh:mm')}}
          </p>
          <p>
            <span class="exam_credit">考试学分：<span>{{item.ExamCredit}}</span></span>
            <span class="exam_required">及格分：<span>{{item.PassingScore}}</span></span>
          </p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
  import {Lazyload, MessageBox, Toast} from 'mint-ui';
  import Vue from 'vue';
  import noCourse from '../assets/noCourse.png';
  import {GetClassExamList} from '../service/getData';

  Vue.use(Lazyload, {
    error: noCourse
  });

  export default {
    data() {
      return {
        Id: '',
        noData: false,
        noDataBg: false,
        examList: []
      };
    },
    computed: {},
    created() {
      this.Id = this.$route.query.Id;
      this.getExam();
    },
    methods: {
      goBack() {
        this.$router.push({path: '/classDetail', query: {Id: this.Id, classType: 'online'}});
      },
      async getExam() {
        let res = await GetClassExamList({Id: this.Id});
        let list = res.Data.List;
        if (list.length == 0) {
          this.noDataBg = true;
          return;
        }
        this.examList = this.examList.concat(list);
      },
      checkAttempt(id, total, current, endTime) {
        var dateEnd = new Date(endTime).getTime();
        var dateNow = new Date().getTime();
        if (total > 0) {
          if (dateNow < dateEnd) {
            if (current < total) {
              let count = total - current;
              MessageBox.confirm(`当前考试剩余${count}次考试机会，是否继续考试`).then(action => {
                this.$router.push({path: '/exam', query: {id}});
              });
            } else {
              this.message = '考试次数已用完';
              Toast({message: this.message, position: 'bottom'});
            }
          } else {
            this.message = '考试截止时间已过';
            Toast({message: this.message, position: 'bottom'});
          }
        } else {
          MessageBox.confirm(`是否进入考试`).then(action => {
            this.$router.push({path: '/exam', query: {id}});
          });
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .class_exam {
    background-color: #fff;

    .header {
      background-color: #fff;
      border-bottom: 1px solid #ddd;

      .webapp, .header_title {
        color: #000;
      }
    }

    .container {
      ul {
        li {
          position: relative;
          border-bottom: 1px solid #ddd;
          padding: rem64(15px) rem64(30px);

          .exam_name {
            font-size: rem64(30px);
            line-height: 1.5;
          }

          .exam_end, .exam_credit, .exam_required {
            font-size: rem64(24px);
            line-height: 2;

            span {
              color: $brand-primary;
            }

          }

          .exam_required {
            float: right;
          }

        }
      }

    }
  }
</style>
