/**
* 笔记详情
*/
<template>
  <div class="notes_detail container_top">
    <!--头部-->
    <header-fix title="笔记内容" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
      <span slot="right" @click="toggleNotes">修改</span>
    </header-fix>
    <div class="notice_title">{{notesDetail.ExperienceTitle}}</div>
    <div class="notice_desc">
      <span class="send_person">课程名称：{{notesDetail.CourseName}}</span>
      <span class="send_date">发布日期：{{notesDetail.CreateDate}}</span>
    </div>
    <div class="articleDet">{{notesDetail.ExperienceContent}}</div>
    <!--修改笔记-->
    <transition name="slide-left">
      <add-notes
          class="notes_container container_top"
          v-if="showAddNotes"
          :notes-data.sync="addNotesData"
      >
        <!--头部-->
        <header-fix slot="header" title="修改笔记" fixed>
          <span slot="left" @click="toggleNotes">取消</span>
          <span slot="right" @click="saveNotes">保存</span>
        </header-fix>
      </add-notes>
    </transition>
  </div>
</template>
<script>
  import { Indicator, Toast } from 'mint-ui'
  import { headerFix, addNotes } from '../components'
  import { goBack } from '../service/mixins'
  import { GetExperienceById, AddExperience } from '../service/getData'

  export default {
    mixins: [goBack],
    data () {
      return {
        notesDetail: {},
        messageId: '',
        showAddNotes: '',
        addNotesData: {
          title: '',
          content: ''
        }
      }
    },
    computed: {
      sendNotesData: function () {
        let params = {
          CourseId: this.notesDetail.CourseId,
          ExperienceContent: this.addNotesData.content,
          ExperienceTitle: this.addNotesData.title,
          ExperienceId: this.messageId,
        }
        return params
      }
    },
    created () {
      this.messageId = this.$route.query.id || ''
    },
    mounted () {
      this.getNotesDetail(this.messageId)
    },
    components: {
      headerFix,
      addNotes,
    },
    methods: {
      /*获取笔记详情*/
      async getNotesDetail (ExperienceId) {
        Indicator.open()
        let data = await GetExperienceById({ExperienceId})
        Indicator.close()
        this.notesDetail = data.Data
        let notesData = {
          title: this.notesDetail.ExperienceTitle,
          content: this.notesDetail.ExperienceContent,
        }
        this.addNotesData = notesData
      },
      /*显示、隐藏添加笔记*/
      toggleNotes () {
        this.showAddNotes = !this.showAddNotes
      },
      /*添加笔记提交*/
      async updateNotes (params) {
        let data = await AddExperience(params)
        if (data.Type === 1) {
          this.getNotesDetail(this.messageId)
          Toast({message: data.Message, position: 'middle'})
        } else if (data.Type !== 401) {
          Toast({message: data.Message, position: 'middle'})
        }
      },
      /*保存笔记*/
      saveNotes () {
        this.toggleNotes()
        this.updateNotes(this.sendNotesData)
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .notes_detail {
    background-color: $fill-base;
    .articleDet {
      font-size: 16px;
      padding: rem75(40px) rem75(20px) rem75(20px) rem75(20px);
    }
    .notice_title {
      padding: rem75(20px) rem75(20px);
      font-size: 20px;
      font-weight: 600;
    }
    .notice_desc {
      @extend %clearfix;
      color: $color-text-thirdly;
      padding: 0 rem75(20px);
      .send_person {
        @extend %pull-left;
      }
      .send_date {
        @extend %pull-right;
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
