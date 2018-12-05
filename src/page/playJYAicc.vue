/**
* JYAicc播放页
*/
<template>
  <div class="play_Jyaicc container_top">
    <!--头部-->
    <header-fix :title="courseDetails.CourseName" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <div class="player">
      <video id="myVideo" preload="meta" :src="activeNode.Mp4" controls
             style="object-fit:fill"
             x5-video-player-type="h5"
             webkit-playsinline="true"
             playsinline="true"
             x-webkit-airplay="true"
             x5-video-player-fullscreen="true"
             x5-video-orientation="portraint">
      </video>
      <!--<video v-else id="myVideo" preload="meta" :src="activeNode.Mp4" controls autoplay></video>-->
    </div>
    <div class="course_detail">
      <mt-navbar v-model="selected">
        <mt-tab-item id="introduce">介绍</mt-tab-item>
        <mt-tab-item id="catalogue">目录</mt-tab-item>
        <mt-tab-item id="relatedCourse">相关课程</mt-tab-item>
        <mt-tab-item id="notes">学习笔记</mt-tab-item>
        <mt-tab-item id="evaluate">评价</mt-tab-item>
      </mt-navbar>
      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="introduce">
          <course-introduce :course-details="courseDetails"></course-introduce>
        </mt-tab-container-item>
        <mt-tab-container-item id="catalogue">
          <ul class="course_menu">
            <li v-for="(item,index) in nodeList"
                :key="item.NodeId"
                :class="{'highlight':item.NodeId==activeNodeId}"
                @click.stop="otherNode(index)">
              <span class="title">{{item.NodeName}}</span>
              <p class="status">
                <span class="green" v-if="item.Status=='C'">已完成</span>
                <span v-else>未完成</span>
              </p>
            </li>
          </ul>
        </mt-tab-container-item>
        <mt-tab-container-item id="relatedCourse">
          <section v-infinite-scroll="getRelatedCourse"
                   infinite-scroll-immediate-check="immediate"
                   infinite-scroll-disabled="loading"
                   infinite-scroll-distance="10">
            <course-list :course-data="courseData" :no-data-bg="noDataBg" :no-data="noData"></course-list>
          </section>
        </mt-tab-container-item>
        <mt-tab-container-item id="notes">
          <course-notes></course-notes>
          <div class="add_notes_btn">
            <mt-button size="large" type="primary" @click.native="toggleNotes">
              <i class="webapp webapp-edit"></i>
              添加笔记
            </mt-button>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="evaluate">
          <course-comment :course-id="courseId" :comment-credit="courseDetails.CommentCredit"></course-comment>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
    <!--添加笔记-->
    <transition name="slide-left">
      <add-notes
          class="notes_container container_top"
          v-if="showAddNotes"
          :notes-data.sync="addNotesData"
      >
        <!--头部-->
        <header-fix slot="header" title="添加笔记" fixed>
          <span slot="left" @click="toggleNotes">取消</span>
          <span slot="right" @click="saveNotes">保存</span>
        </header-fix>
      </add-notes>
    </transition>
    <div v-if="isOpen" class="open_app">
      <span>打开APP，可享课程下载服务</span><a id="btnOpenApp" class="openApp" href="javascript:void(0);">打开</a>
      <a class="close_tip" @click="isOpen = !isOpen">
        <i class="webapp webapp-close"></i>
      </a>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { mapMutations } from 'vuex'
  import wx from 'weixin-js-sdk'
  import { Indicator, Toast, MessageBox, Navbar, TabItem, TabContainer, TabContainerItem } from 'mint-ui'
  import { headerFix, courseIntroduce, courseComment, courseNotes, courseList, addNotes } from '../components'
  import { goBack } from '../service/mixins'
  import { GetCourseDetail, SyncUserStudyData, RelatedCourse, GetWechatWxAuthModel } from '../service/getData'
  import { getStore } from '../plugins/utils'

  Vue.component(Navbar.name, Navbar)
  Vue.component(TabItem.name, TabItem)
  Vue.component(TabContainer.name, TabContainer)
  Vue.component(TabContainerItem.name, TabContainerItem)
  export default {
    mixins: [goBack],
    data () {
      return {
        isWeChat: false, //是否是微信
        isOpen: true, //是否打开app
        autoPlay: false, //是否自动播放
        selected: 'introduce', //被选择便签页id
        courseId: '', //课程id
        courseDetails: {//课程详情信息
          CourseName: '视频播放'
        },
        readyState: 0, //视频是否准备就绪
        nodeList: [], //节点数据
        nodeLength: 0, //节点数据
        duration: 0, //视频时长
        activeNodeIndex: '', //正在播放的索引
        activeNodeId: '', //正在播放的id
        activeNode: { //正在播放的节点数据
          NodeId: '',
          Mp4: '',
          Status: '',
          Time: 0,
        },
        myVideo: null, //video对象
        prevLocation: 0,//上一次播放位置
        locationTime: 0, //当前播放位置
        /*相关课程*/
        courseData: [],
        loading: false,
        immediate: false,
        page: 1,
        noData: false,
        noDataBg: false,
        url: window.location.href,

        showAddNotes: false, //是否显示添加笔记
        addNotesData: {
          title: '',
          content: ''
        }
      }
    },
    created () {
      if (getStore('userAgent').weixin) {
        this.isWeChat = true
      } else {
        this.isWeChat = false
      }
      this.courseId = this.$route.query.id
      this.netWorkType()
    },
    mounted () {
      /*初始化 打开APP*/
      // eslint-disable-next-line
      new Mlink({
        mlink: 'https://afaki8.mlinks.cc/A0BP?Title=&Content=&Id=' + this.courseId + '&Type=Course&Token=' + localStorage.getItem('ASPXAUTH'),
        button: document.querySelector('a#btnOpenApp')
      })
      /*获取video对象*/
      this.myVideo = document.getElementById('myVideo')
      this.getWechatWxAuthModel()
      /*获取课程详情*/
      this.getCourseDetail()
      this.getRelatedCourse()
    },
    components: {
      headerFix,
      courseIntroduce,
      courseComment,
      courseList,
      courseNotes,
      addNotes,
    },
    computed: {},
    methods: {
      ...mapMutations(['GET_NETWORKTYPE']),
      /*微信签名*/
      async getWechatWxAuthModel () {
        let data = await GetWechatWxAuthModel({Url: this.url})
        if (data.Type == 1) {
          wx.config({
            debug: false,
            appId: 'wxf24d72db02fede73',// 必填，公众号的唯一标识
            timestamp: data.Data.Timestamp,// 必填，生成签名的时间戳
            nonceStr: data.Data.Nonce,// 必填，生成签名的随机串
            signature: data.Data.Signature,// 必填，签名
            jsApiList: ['checkJsApi', 'getNetworkType']// 必填，需要使用的JS接口列表
          })
        } else if (data.Type != 401) {
          MessageBox('警告', data.Message)
        }
      },
      /*获取网络环境*/
      netWorkType () {
        let t = this
        wx.ready(function () {
          wx.getNetworkType({
            success: function (res) {
              var networkType = res.networkType // 返回网络类型2g，3g，4g，wifi
              t.GET_NETWORKTYPE(networkType)
              if (networkType !== 'wifi') {
                Toast({message: '您正在使用2G/3G/4G网络，建议在WIFI环境观看', position: 'middle'})
              }
            }
          })
        })
      },
      //相关课程
      async getRelatedCourse () {
        this.noData = false
        this.noDataBg = false
        this.loading = true
        Indicator.open()
        let data = await RelatedCourse({CourseId: this.courseId, Page: this.page})
        Indicator.close()
        if (data.Type == 1) {
          let list = data.Data.List
          if (list.length == 0 && this.page > 1) {
            this.noData = true
            return
          }
          if (list.length == 0 && this.page == 1) {
            this.noDataBg = true
            return
          }
          this.courseData = this.courseData.concat(list)
          this.loading = false
          this.page += 1
        }
      },
      //课程详情
      async getCourseDetail () {
        let data = await GetCourseDetail({Id: this.courseId})
        if (data.Type == 1) {
          this.courseDetails = data.Data
          this.nodeList = data.Data.NodeList
          this.nodeLength = data.Data.NodeList.length
          this.activeNodeId = data.Data.LastNodeId
        }
      },
      //提交进度
      async updateProgress (NodeId, Time, Status) {
        let data = await SyncUserStudyData({
          CourseId: this.courseId,
          Data: [{NodeId, Time, Status}]
        })
        if (data.Type == 1) {
          this.nodeList = data.Data.NodeList
        } else if (data.Type != 401) {
          Toast({message: data.Message, position: 'bottom'})
        }
      },
      /*播放方法*/
      playFunc () {
        this.myVideo.load()
        let timer = setInterval(() => {
          let readyState = this.myVideo.readyState
          this.readyState = readyState
          if (readyState == 4) {
            /*准备好可以播放时清除定时器*/
            clearInterval(timer)
            this.duration = this.myVideo.duration //当前时间
            this.myVideo.currentTime = this.prevLocation
            /*是否自动播放*/
            if (this.autoPlay) {
              this.myVideo.play()
            } else {
              this.myVideo.pause()
            }
            /*监听视频播放位置*/
            this.myVideo.addEventListener('timeupdate', () => {
              let currentTime = this.myVideo.currentTime
              if (currentTime > 0) {
                /*视频播放完成，记录当前位置*/
                if (this.activeNode.Status == 'C') {
                  this.locationTime = currentTime
                } else {
                  /*视频未播放完毕 禁止拖拽*/
                  if (currentTime > this.locationTime + 4 || currentTime < this.locationTime - 4) {
                    this.myVideo.currentTime = this.locationTime
                    this.myVideo.play()
                    Toast({message: '未播放课程禁止拖拽', position: 'bottom'})
                  } else {
                    this.locationTime = currentTime
                  }
                }
              }
            })
            /*监听视频播放结束*/
            this.myVideo.addEventListener('ended', () => {
              /*判断是否是拖拽到结束*/
              if (this.locationTime > this.duration - 2) {
                this.activeNode.Status = 'C'
                this.updateProgress(this.activeNode.NodeId, this.myVideo.currentTime, this.activeNode.Status)
                this.nextNode()
              } else {
                this.myVideo.play()
              }
            })
          }
        }, 200)
      },
      /*播放其他章节*/
      playNode (index) {
        this.updateProgress(this.activeNode.NodeId, this.locationTime, this.activeNode.Status)
        this.activeNodeIndex = index
      },
      /*是否播放下一章节*/
      nextNode () {
        /*不是最后一个节点播放下一章节*/
        if (this.nodeLength != this.activeNodeIndex + 1) {
          MessageBox.confirm('本章节播放完毕，是否播放下一章节').then(action => {
            this.autoPlay = true
            let nextNodeIndex = this.activeNodeIndex + 1
            this.playNode(nextNodeIndex)
          }).catch(() => {
            this.myVideo.pause()
            this.autoPlay = false
          })
        }
      },
      /*点击节点播放其他章节*/
      otherNode (index) {
        this.autoPlay = true
        this.playNode(index)
      },
      /*显示、隐藏添加笔记*/
      toggleNotes () {
        this.showAddNotes = !this.showAddNotes
      },
      /*保存笔记*/
      saveNotes () {
        this.toggleNotes()
        console.log('保存笔记', this.addNotesData)
      }
    },
    beforeDestroy () {
      this.updateProgress(this.activeNode.NodeId, this.locationTime, this.activeNode.Status)
    },
    watch: {
      activeNodeIndex: function (val) {
        let dataList = this.nodeList
        if (dataList) {
          let node = dataList[val]
          this.activeNodeId = node.NodeId
        }
      },
      activeNodeId: function (val) {
        if (!val) return
        let dataList = this.nodeList
        dataList && dataList.forEach((item, index) => {
          if (val == item.NodeId) {
            this.activeNode = item
            this.activeNodeIndex = index
            this.prevLocation = item.Time
            this.locationTime = item.Time
            this.playFunc()
          }
        })
      },
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .play_Jyaicc {
    .header {
      .header_title {
        flex: 6;
      }
    }
    .course_menu {
      background-color: $fill-base;
      padding: 0 rem75(30px);
      font-size: 15px;
      li {
        padding: rem75(20px) 0;
        @extend %clearfix;
      }
      .title {
        @extend %pull-left;
        width: 7rem;
      }
      .status {
        @extend %pull-right;
        color: $color-text-thirdly;
        font-size: 12px;
      }
      .green {
        color: $brand-success;
      }
    }
    .open_app {
      position: fixed;
      left: 0;
      bottom: 0;
      text-indent: 1rem;
      font-size: 14px;
      @include ht-lineHt75(105px);
      background: rgba(0, 0, 0, 0.8);
      width: 100%;
      color: $color-text-reverse;
      .openApp {
        color: #fff;
        padding: rem75(15px) rem75(30px);
        background: $brand-primary;
        margin-left: 1rem;
        border-radius: rem75(12px);
      }
      .close_tip {
        color: $color-text-reverse;
        position: absolute;
        right: rem75(10px);
        bottom: 0;
        top: rem75(10px);
        height: rem75(40px);
        line-height: rem75(40px);
      }
    }
    .player {
      padding-top: 0.2rem;
      width: 10rem;
      height: 5.8rem;
      margin: 0 auto;
      position: relative;
      background: #000;
      video {
        height: 100%;
        width: 100%;
        margin: 0 auto;
      }
    }
    .mint-navbar .mint-tab-item {
      margin: 0 rem75(10px);
    }
    .add_notes_btn {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      .mint-button--large {
        border-radius: 0;
      }
    }
    .notes_container {
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #fff;
    }
  }

</style>
