/**
* Mp4播放页
*/
<template>
  <div class="play_Mp4 container_top">
    <!--头部-->
    <header-fix :title="courseDetails.CourseName" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <div class="player">
      <video id="myVideo" preload="auto" :src="courseDetails.OnlineUrl" controls
             style="object-fit:fill;"
             x5-video-player-type="h5"
             webkit-playsinline="true"
             playsinline="true"
             x-webkit-airplay="true"
             x5-video-player-fullscreen="true"
             x5-video-orientation="portraint">
      </video>
      <!--<video v-else id="myVideo" preload="meta" :src="courseDetails.OnlineUrl" controls></video>-->
    </div>
    <div class="course_detail">
      <mt-navbar v-model="selected">
        <mt-tab-item id="introduce">介绍</mt-tab-item>
        <mt-tab-item id="relatedCourse">相关课程</mt-tab-item>
        <mt-tab-item id="notes">学习笔记</mt-tab-item>
        <mt-tab-item id="evaluate">评价</mt-tab-item>
      </mt-navbar>
      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="introduce">
          <course-introduce :course-details="courseDetails"></course-introduce>
        </mt-tab-container-item>
        <mt-tab-container-item id="relatedCourse">
          <section v-if="selected === 'relatedCourse'" v-infinite-scroll="getRelatedCourse"
                   infinite-scroll-immediate-check="immediate"
                   infinite-scroll-disabled="loading"
                   infinite-scroll-distance="10">
            <course-list :course-data="courseData" :no-data-bg="noDataBg" :no-data="noData"></course-list>
          </section>
        </mt-tab-container-item>
        <mt-tab-container-item id="notes">
          <course-notes :notes-data="notesData"></course-notes>
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
  import {Indicator, Navbar, TabContainer, TabContainerItem, TabItem, Toast} from 'mint-ui';
  import Vue from 'vue';
  import {mapMutations} from 'vuex';
  import wx from 'weixin-js-sdk';
  import {addNotes, courseComment, courseIntroduce, courseList, courseNotes, headerFix} from '../components';
  import {getStore, timeFormat} from '../plugins/utils';
  import {
    AddExperience,
    GetCourseDetail,
    GetExperience,
    GetWechatWxAuthModel,
    RelatedCourse,
    UploadTimeNode
  } from '../service/getData';
  import {goBack} from '../service/mixins';

  Vue.component(Navbar.name, Navbar);
  Vue.component(TabItem.name, TabItem);
  Vue.component(TabContainer.name, TabContainer);
  Vue.component(TabContainerItem.name, TabContainerItem);
  export default {
    mixins: [goBack],
    data() {
      return {
        isWeChat: false, //是否是微信
        isOpen: true,
        selected: 'introduce',
        courseId: '', //课程id
        courseDetails: {//课程详情信息
          CourseName: '视频播放',
          OnlineUrl: '',
          CommentCredit: ''
          //          IsCollection: 0
        },
        readyState: 0, //视频是否准备就绪
        duration: 0, //视频时长
        browseScore: 0, //百分比进度
        myVideo: null, //video对象
        lastLocation: 0, //记录上次播放的位置
        progressTime: 0, //记录视频完成进度位置
        updateTimer: 0, //提交进度定时器
        /*相关课程*/
        courseData: [],
        loading: false,
        immediate: false,
        page: 1,
        noData: false,
        noDataBg: false,
        url: window.location.href,
        /*笔记*/
        notesData: [],
        showAddNotes: false, //是否显示添加笔记
        addNotesData: {
          title: '',
          content: ''
        }
      };
    },
    created() {
      if (getStore('userAgent').weixin) {
        this.isWeChat = true;
      } else if (getStore('userAgent').mobile) {
        this.isWeChat = false;
      }
      this.courseId = this.$route.query.id;
      this.netWorkType();
    },
    mounted() {
      /*初始化 打开APP*/
      // eslint-disable-next-line
      new Mlink({
        mlink: 'https://afaki8.mlinks.cc/A0BP?Title=&Content=&Id=' + this.courseId + '&Type=Course&Token=' +
          localStorage.getItem('ASPXAUTH'),
        button: document.querySelector('a#btnOpenApp')
      });
      /*获取video对象*/
      this.myVideo = document.getElementById('myVideo');
      this.getWechatWxAuthModel();
      /*获取课程详情*/
      this.getCourseDetail(this.playFunc);
      /*相关课程*/
      this.getRelatedCourse();
      /*课程笔记列表*/
      this.getExperience();
    },
    components: {
      headerFix,
      courseIntroduce,
      courseComment,
      courseNotes,
      courseList,
      addNotes
    },
    computed: {},
    methods: {
      ...mapMutations(['GET_NETWORKTYPE']),
      /*微信签名*/
      async getWechatWxAuthModel() {
        let data = await GetWechatWxAuthModel({Url: this.url});
        if (data.Type == 1) {
          wx.config({
            debug: false,
            appId: data.Data.appId,// 必填，公众号的唯一标识
            timestamp: data.Data.timestamp,// 必填，生成签名的时间戳
            nonceStr: data.Data.noncestr,// 必填，生成签名的随机串
            signature: data.Data.signature,// 必填，签名
            jsApiList: ['checkJsApi', 'getNetworkType']// 必填，需要使用的JS接口列表
          });
        }
      },
      /*获取网络环境*/
      netWorkType() {
        let t = this;
        wx.ready(function() {
          wx.getNetworkType({
            success: function(res) {
              var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
              t.GET_NETWORKTYPE(networkType);
              console.log(networkType);
              if (networkType !== 'wifi') {
                Toast({message: '您正在使用2G/3G/4G网络，建议在WIFI环境观看', position: 'middle'});
              }
            }
          });
        });
      },
      //相关课程
      async getRelatedCourse() {
        this.noData = false;
        this.noDataBg = false;
        this.loading = true;
        Indicator.open();
        let data = await RelatedCourse({CourseId: this.courseId, Page: this.page});
        Indicator.close();
        if (data.Type == 1) {
          let list = data.Data.List;
          if (list.length == 0 && this.page > 1) {
            this.noData = true;
            return;
          }
          if (list.length == 0 && this.page == 1) {
            this.noDataBg = true;
            return;
          }
          this.courseData = this.courseData.concat(list);
          this.loading = false;
          this.page += 1;
        }
      },
      //课程详情
      async getCourseDetail(cb) {
        let data = await GetCourseDetail({Id: this.courseId});
        if (data.Type == 1) {
          this.courseDetails = data.Data;
          this.lastLocation = data.Data.LastLocation;
          this.browseScore = data.Data.BrowseScore;
          if (typeof cb === 'function') {
            cb();
          }
        }
      },
      //提交进度
      async updateProgress() {
        let TimeNode = timeFormat(this.myVideo.currentTime);
        let data = await UploadTimeNode({CourseId: this.courseId, TimeNode});
        if (data.Type == 1) {
          //提交成功
          this.getCourseDetail();
        } else if (data.Type != 401) {
          Toast({message: data.Message, position: 'bottom'});
        }
      },
      /*播放方法*/
      playFunc() {
        this.myVideo.load();
        let timer = setInterval(() => {
          let readyState = this.myVideo.readyState;
          this.readyState = readyState;
          if (readyState == 4) {
            /*准备好可以播放时清除定时器*/
            clearInterval(timer);
            this.duration = (this.myVideo.duration).toFixed(2); //当前时间
            this.progressTime = this.myVideo.duration * (parseFloat(this.browseScore) / 100);
            this.myVideo.currentTime = this.lastLocation;
            /*监听视频播放位置*/
            this.myVideo.addEventListener('timeupdate', () => {
              let currentTime = this.myVideo.currentTime;
              if (currentTime > 0) {
                /*该视频未播放完成*/
                if (parseFloat(this.browseScore) < 100) {
                  if (currentTime > this.progressTime - 2 && currentTime < this.progressTime + 1) {
                    //视频播放位置接近时候，视频完成进度位置前进
                    this.progressTime = currentTime;
                  } else if (currentTime > this.progressTime + 2) {
                    //视频未播放区域 禁止拖拽
                    this.myVideo.currentTime = this.progressTime;
                    Toast({message: '未播放区域禁止拖拽', position: 'bottom'});
                  }
                } else {
                  /*该视频播放完成*/
                }
              }
            });
            /*监听视频播放结束*/
            this.myVideo.addEventListener('ended', () => {
              /*判断是否是拖拽到结束*/
              if (this.progressTime > this.duration - 2) {
                this.updateProgress();
                clearInterval(this.updateTimer);
              } else {
                this.myVideo.play();
              }
            });
            this.updateTimer = setInterval(() => {
              this.updateProgress();
            }, 60000);
          }
        }, 100);
      },
      /*添加笔记提交*/
      async updateNotes(params) {
        let data = await AddExperience(params);
        if (data.Type === 1) {
          this.getExperience();
          this.addNotesData.content = '';
          this.addNotesData.title = '';
          Toast({message: data.Message, position: 'middle'});
        } else if (data.Type !== 401) {
          Toast({message: data.Message, position: 'middle'});
        }
      },
      /*显示、隐藏添加笔记*/
      toggleNotes() {
        this.showAddNotes = !this.showAddNotes;
      },
      //获取课程笔记
      async getExperience() {
        let data = await GetExperience({CourseId: this.courseId});
        if (data.Type == 1) {
          this.notesData = data.Data;
        }
      },
      /*保存笔记*/
      saveNotes() {
        let params = {
          CourseId: this.courseId,
          ExperienceContent: this.addNotesData.content.trim(),
          ExperienceTitle: this.addNotesData.title.trim()
        };
        if (!params.ExperienceTitle) {
          Toast({message: '请输入标题', position: 'middle'});
          return;
        }
        if (!params.ExperienceContent) {
          Toast({message: '请输入内容', position: 'middle'});
          return;
        }
        this.toggleNotes();
        this.updateNotes(params);
      }
    },
    beforeDestroy() {
      this.updateProgress();
      clearInterval(this.updateTimer);
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .play_Mp4 {
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
        font-size: 20px;
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

    .course_notes {
      padding-bottom: rem75(100px);
    }
  }
</style>
