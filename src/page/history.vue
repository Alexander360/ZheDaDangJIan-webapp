/**
* 历史记录
*/
<template>
  <div class="history container_top">
    <!--头部-->
    <header-fix title="播放记录" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
      <div class="history_container">
        <history-course-list :history-data="todayHistory" title="今天"></history-course-list>
        <history-course-list :history-data="earlyHistory" title="更早"></history-course-list>
      </div>
    </mt-loadmore>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Loadmore } from 'mint-ui'
  import { headerFix, historyCourseList } from '../components'
  import { goBack, toPlay } from '../service/mixins'
  import noCourse from '../assets/noCourse.png'
  import { GetHistoryCourse } from '../service/getData'

  Vue.component(Loadmore.name, Loadmore)
  export default {
    mixins: [goBack, toPlay],
    data () {
      return {
        topStatus: '',
        noCourse,
        todayHistory: [],
        earlyHistory: []
      }
    },
    created () {
      
    },
    mounted () {
      this.getHistory('Today')
      this.getHistory('Earlier')
    },
    components: {
      headerFix,
      historyCourseList,
    },
    methods: {
      loadTop () {
        this.getHistory('Today')
        this.getHistory('Earlier')
        this.$refs.loadmore.onTopLoaded()
      },
      handleTopChange (status) {
        this.topStatus = status
      },
      //历史记录
      async getHistory (Type) {
        let data = await GetHistoryCourse({Type})
        if (data.Type == 1) {
          let list = data.Data.List
          if (Type === 'Today') {
            this.todayHistory = list
          } else if (Type === 'Earlier') {
            this.earlyHistory = list
          }
        }
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .history {
    .history_container {
    }
  }
</style>
