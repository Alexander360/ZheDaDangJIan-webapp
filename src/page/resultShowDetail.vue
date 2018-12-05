/**
* 成果展示详情
*/
<template>
  <div class="result_show_detail container_top">
    <header-fix title="成果展示详情" fixed>
      <a slot="left" @click="goBack"><i class="webapp webapp-left"></i></a>
    </header-fix>
    <div class="detail_desc">
      <h1>{{details.ProductionTitle}}</h1>
      <div class="detail_img">
        <img :src="details.ProductionImage" alt="">
      </div>
      <div class="desc">
        <span v-html="details.ProductionContent"></span>
        <!--<span class="prev_desc">{{prevDesc}}</span>
        <span v-if="!showAllDesc&&prevDesc">...</span>
        <span class="next_desc" v-if="showAllDesc">
          {{nextDesc}}
        </span>
        <a v-if="showFold" class="toggle_detail" @click="toggleDesc">{{showAllDesc ? '收起全文' : '展开全文'}}</a>-->
      </div>
      <div class="detail_btn">
        <mt-button size="normal" type="primary" plain @click.native="addLike">
          <i v-if="details.IsAssist" class="webapp webapp-good-fill assist"></i>
          <i v-else class="webapp webapp-good-fill"></i>
          {{details.AssistCount}}
        </mt-button>
        <mt-button size="normal" type="primary" plain @click.native="toggleComment">
          评论 {{details.CommontCount}}
        </mt-button>
      </div>
    </div>
    <div class="comment_list">
      <div class="comment_item" v-for="(item,index) in commentList" :key="index">
        <div class="left_avatar">
          <error-img :src="item.HeadImg" :error-src="male"></error-img>
        </div>
        <div class="right_content">
          <p class="name">
            <span>{{item.UserName}}</span>
          </p>
          <p class="date">{{item.Createtime}}</p>
          <p class="content">{{item.CommentComtent}}</p>
        </div>
      </div>
    </div>
    <!--编写评论-->
    <div class="filter_layer" v-if="isShowWrite" @click="toggleComment"></div>
    <transition name="slide-top">
      <div class="write_comment" v-if="isShowWrite">
        <textarea v-model="commentContent" type="text" rows="5" placeholder="写评论"></textarea>
        <mt-button @click.native="addComment" type="primary" size="small">发送</mt-button>
      </div>
    </transition>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { MessageBox, Toast, Button } from 'mint-ui'
  import { headerFix, errorImg } from '../components'
  import { GetProductionInfo, GetCommentList, AddUserAiss, AddComment } from '../service/getData'
  import { goBack } from '../service/mixins'
  import male from '../assets/male.png'

  Vue.component(Button.name, Button)
  export default {
    mixins: [goBack],
    data () {
      return {
        id: '',
        details: {},
        prevDesc: '',
        nextDesc: '',
        showAllDesc: false,
        showFold: false,
        commentList: [],
        male,
        isShowWrite: false,
        commentContent: ''
      }
    },
    created () {
      this.id = this.$route.query.id || ''
    },
    mounted () {
      this.getProductionDetail()
      this.getCommentList()
    },
    props: [],
    components: {
      headerFix,
      errorImg,
    },
    computed: {},
    updated () {
      
    },
    methods: {
      /*成果展示详情*/
      async getProductionDetail () {
        let data = await GetProductionInfo({Id: this.id})
        if (data.Type == 1) {
          this.details = data.Data
          if (this.details.ProductionContent) {
            if (this.details.ProductionContent.length > 69) {
              this.showFold = true
            }
            this.prevDesc = this.details.ProductionContent.substring(0, 70)
            this.nextDesc = this.details.ProductionContent.substring(70)
          }
        }
      },
      /*成果展示评论*/
      async getCommentList () {
        let data = await GetCommentList({objType: '4', objId: this.id})
        if (data.Type == 1) {
          this.commentList = data.Data
        }
      },
      /*点赞*/
      async addLike () {
        let data = await AddUserAiss({ObjType: '4', ObjId: this.id})
        let isAssist = this.details.IsAssist
        let assistCount = parseInt(this.details.AssistCount)
        if (data.Type === 1) {
          this.details.IsAssist = !isAssist
          this.details.AssistCount = isAssist ? assistCount - 1 : assistCount + 1
          Toast({message: data.Message, position: 'bottom'})
        } else if (data.Type !== 1) {
          Toast({message: data.Message, position: 'bottom'})
        }
      },
      //添加评论
      async addComment () {
        let Content = this.commentContent.trim()
        let sendComment = {
          ObjType: '4',
          ObjId: this.id,
          Content,
        }
        if (Content) {
          if (Content.length <= 100) {
            let data = await AddComment(sendComment)
            if (data.Type == 1) {
              Toast({message: data.Message, position: 'bottom'})
              this.getCommentList()
            } else if (data.Type != 401) {
              MessageBox('警告', data.Message)
            }
            this.isShowWrite = false
          } else {
            Toast({message: '评论内容不能超过100字！', position: 'bottom'})
          }
        } else {
          Toast({message: '请填写评论内容', position: 'bottom'})
        }
      },
      toggleComment () {
        this.isShowWrite = !this.isShowWrite
      },
      toggleDesc () {
        this.showAllDesc = !this.showAllDesc
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .result_show_detail {
    padding-left: rem75(20px);
    padding-right: rem75(20px);
    background-color: $fill-base;
    .detail_desc {
      border-bottom: 1px solid $border-color-light;
      h1 {
        padding: rem75(30px) 0;
        text-align: center;
        font-size: 17px;
        font-weight: bold;
      }
      .prev_desc, .next_desc {
        color: $color-text-thirdly;
      }
      .toggle_detail {
        color: $brand-primary;
      }
    }
    .detail_img {
      padding: rem75(50px) 0;
      text-align: center;
      img {
        width: 90%;
      }
    }
    .desc{
      padding-bottom: rem75(30px);
    }
    .detail_btn {
      padding-bottom: rem75(70px);
      text-align: center;
      .mint-button--primary.is-plain {
        border: 1px solid #bdc0c3;
        background-color: transparent;
        color: #bdc0c3;
        height: rem75(60px);
        padding: 0 rem75(65px);
        margin: 0 rem75(50px);
      }
      .webapp {
        color: #bdc0c3;
        &.assist {
          color: $brand-primary;
        }
      }
    }
    .comment_item {
      @extend %clearfix;
      padding: rem75(20px) 0 rem75(30px);
      border-bottom: 1px solid $border-color-light;
      .left_avatar {
        @extend %pull-left;
        width: rem75(80px);
        img {
          width: rem75(65px);
        }
      }
      .right_content {
        @extend %pull-left;
        width: rem75(600px);
        .name {
          font-size: 14px;
          font-weight: 600;
        }
        .date {
          color: $color-text-thirdly;
          padding: rem75(10px) 0;
        }
        .content {
          color: $color-text-secondary;
        }
      }
    }
    .write_comment {
      width: 10rem;
      position: fixed;
      bottom: 0;
      left: 0;
      background: $fill-body;
      z-index: 200;
      padding: rem75(30px) rem75(30px) 0 rem75(30px);
      textarea {
        display: block;
        resize: none;
        width: 9.2rem;
        border: 1px solid #e9e9e9;
        border-radius: rem75(10px);
        padding: rem75(20px);
        font-size: 14px;
      }
      .mint-button--primary {
        background-color: $brand-info;
        @extend %pull-right;
        margin: rem75(10px) 0 rem75(10px) rem75(10px);
      }
    }
  }
</style>
