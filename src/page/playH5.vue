/**
* H5播放页
*/
<template>
  <div class="play_h5">
    <iframe :src="courseDetails.OnlineUrl"
            frameborder="0"
            allowtransparency="false"
            class="play_iframe"
            id="play_iframe">
    </iframe>
  </div>
</template>
<script>
  import { GetCourseDetail, UploadTimeNode } from '../service/getData'
  import { timeFormat } from '../plugins/utils'

  export default {
    data () {
      return {
        courseId: '', //课程id
        courseDetails: {}, //课程详情信息
        updateTimer: null, //定时器发送进度
        watchTime: 0, //观看时长
        watchTimer: 0, //计时器
      }
    },
    created () {
      this.courseId = this.$route.query.id
    },
    mounted () {
      this.playFunc()
      /*获取课程详情*/
      this.getCourseDetail()
    },
    methods: {
      //课程详情
      async getCourseDetail () {
        let data = await GetCourseDetail({Id: this.courseId})
        if (data.Type == 1) {
          this.courseDetails = data.Data
        }
      },
      /*初始化*/
      playFunc () {
        /*获取video对象*/
        let iframeNode = document.getElementById('play_iframe')
        let t = this
        iframeNode.onload = function () {
          let back = iframeNode.contentWindow.document.getElementsByTagName('header')[0].getElementsByTagName('figure')[0].firstElementChild
          back.removeAttribute('href')
          back.setAttribute('onclick', 'window.history.go(-1)')
          let video = iframeNode.contentWindow.document.getElementsByTagName('video')
          for (let i = 0; i < video.length; i++) {
            video[i].setAttribute('x5-video-player-type', 'h5')
            video[i].setAttribute('x-webkit-airplay', 'allow')
            video[i].setAttribute('x5-video-player-fullscreen', 'true')
            video[i].setAttribute('x5-video-orientation', 'portraint')
          }
          /*启动计时器*/
          t.timeFunc()
          /*一分钟发送一次进度*/
          t.updateTimer = setInterval(() => {
            t.updateProgress()
          }, 60000)
        }
      },
      /*计时器*/
      timeFunc () {
        this.watchTimer = setInterval(() => {
          this.watchTime += 1
        }, 1000)
      },
      //提交进度
      async updateProgress () {
        let TimeNode = timeFormat(this.watchTime)
        let data = await UploadTimeNode({CourseId: this.courseId, TimeNode})
        if (data.Type == 1) {
        }
      },
    },
    beforeDestroy () {
      this.updateProgress()
      clearInterval(this.updateTimer)
      clearInterval(this.watchTimer)
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .play_h5 {
    .play_iframe {
      width: 100%;
      height: 100vh;
    }
  }
</style>
