/**
* 相关课程
*/
<template>
  <div class="related_course">

  </div>
</template>
<script>
  import Vue from 'vue'
  import { InfiniteScroll } from 'mint-ui'
  import { RelatedCourse } from '../service/getData'

  Vue.use(InfiniteScroll)
  export default {
    mixins: [],
    data () {
      return {}
    },
    created () {

    },
    mounted () {
      this.getCourseNotes()
    },
    props: ['courseId'],
    components: {},
    computed: {},
    updated () {

    },
    methods: {
      //课程评论列表
      async getCourseNotes () {
        this.noData = false
        this.loading = true
        let data = await RelatedCourse({CourseId: this.courseId, Page: this.page})
        if (data.Type == 1) {
          let list = data.Data.List
          this.commentCount = data.Data.TotalCount
          if (list.length == 0) {
            this.noData = true
            return
          }
          this.commentList = this.commentList.concat(list)
          this.loading = false
          this.page += 1
        }
      },
    },
    watch: {}
    
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

</style>
