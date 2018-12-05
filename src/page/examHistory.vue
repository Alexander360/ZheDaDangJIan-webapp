/**
* 考试记录
*/
<template>
  <div class="exam_history container_top">
    <!--头部-->
    <header-fix title="考试记录" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <exam-history-list :history-data="examData"
                       :no-data-bg="noDataBg"
                       :no-data="noData">
    </exam-history-list>
  </div>
</template>
<script>
  import {Indicator} from 'mint-ui';
  import {examHistoryList, headerFix} from '../components';
  import {GetExamList} from '../service/getData';
  import {goBack} from '../service/mixins';

  export default {
    mixins: [goBack],
    data() {
      return {
        typeId: 0, //考试typeId
        examData: [], //考试列表数据
        loading: false,
        immediate: false,
        page: 1,
        noData: false,
        noDataBg: false
      };
    },
    created() {

    },
    mounted() {
      this.getPaperList();
    },
    props: [],
    components: {
      headerFix,
      examHistoryList
    },
    computed: {},
    updated() {

    },
    methods: {
      async getPaperList() {
        this.noData = false;
        this.noDataBg = false;
        Indicator.open();
        let data = await GetExamList({
          ExamType: 'Finish'
        });
        Indicator.close();
        if (data.IsSuccess) {
          let list = data.Data.List;
          this.examData = list;
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

</style>
