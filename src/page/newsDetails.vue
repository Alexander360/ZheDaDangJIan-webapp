/**
* 文章内容
*/
<template>
  <div class="article_container container_top">
    <!--头部-->
    <header-fix title="文章详情" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
      <div class="header_right_slot" slot="right">
        <span class="read_count">{{articleDetails.Click}}阅读</span>
        <i class="webapp webapp-share" @click="toggleShowShare"></i>
      </div>
    </header-fix>
    <section class="article_details_title">
      <h2>{{articleDetails.Name}}</h2>
      <div class="article_details_desc clearfix">
        <span class="article_details_resource">{{articleDetails.Source}}</span>
        <span>{{articleDetails.CreatedDate | dateFilter}}</span>
        <span class="pull-right article_details_author">作者：{{articleDetails.Author}}</span>
      </div>
    </section>
    <article class="article_details_content" v-html="articleDetails.Content"></article>
    <transition name="fade">
      <div class="filter_layer" v-if="showShare" @click="toggleShowShare"></div>
    </transition>
    <transition name="slide-top">
      <div class="share_list" v-if="showShare">
        <div class="share_item" @click.prevent="shareWeiBo">
          <a><img src="../assets/weibo.png" alt=""/></a>
          <p>新浪微博</p>
        </div>
        <!--<div class="share_item" @click.prevent="shareAppMessage">
          <a><img src="../assets/weixin.png" alt=""/></a>
          <p>微信好友</p>
        </div>
        <div class="share_item" @click.prevent="shareQQ">
          <a><img src="../assets/qq.png" alt=""/></a>
          <p>QQ</p>
        </div>-->
        <div class="cancel_share" @click="toggleShowShare">取消</div>
      </div>
    </transition>
  </div>
</template>
<script>
  import {MessageBox, Toast} from 'mint-ui';
  import wx from 'weixin-js-sdk';
  import {headerFix} from '../components';
  import {userAgent} from '../plugins/utils';
  import {AddCollectionList, ArticleDetail, DeleteCollectionList, GetWechatWxAuthModel} from '../service/getData';
  import {goBack} from '../service/mixins';

  export default {
    mixins: [goBack],
    data() {
      return {
        articleId: '',
        articleDetails: {
          ArticleName: '',
          AuthorName: '',
          Click: 0,
          Content: '',
          CreateDate: '',
          Source: '',
          IsCollection: 0
        },
        showShare: false,
        link: window.location.href
      };
    },
    created() {
      this.articleId = this.$route.query.id || '';
    },
    mounted() {
      this.getArticleDetail();
      this.getWechatWxAuthModel();
      console.log(userAgent());
    },
    components: {
      headerFix
    },
    methods: {
      //文章内容
      async getArticleDetail() {
        let data = await ArticleDetail({Id: this.articleId});
        this.articleDetails = data.Data;
        this.content = data.Data.Content;
        this.checkWxjsaApi();
      },
      //收藏
      async collectNews() {
        let data = await AddCollectionList({ObjId: this.articleId, ObjType: 0});
        if (data.Type == 1) {
          Toast({message: '收藏成功', position: 'bottom'});
          this.articleDetails.IsCollection = true;
        }
      },
      //取消收藏
      async cancelCollect() {
        let IdItem = [];
        IdItem.push(this.articleId);
        let data = await DeleteCollectionList({IdItem});
        if (data.Type == 1) {
          Toast({message: '取消收藏成功', position: 'bottom'});
          this.articleDetails.IsCollection = false;
        }
      },
      /*微信签名*/
      async getWechatWxAuthModel() {
        let data = await GetWechatWxAuthModel({Url: this.link});
        if (data.Type == 1) {
          wx.config({
            debug: false,
            appId: data.Data.appId, // 必填，公众号的唯一标识
            timestamp: data.Data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.Data.noncestr, // 必填，生成签名的随机串
            signature: data.Data.signature, // 必填，签名
            jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']// 必填，需要使用的JS接口列表
          });
        } else if (data.Type != 401) {
          MessageBox('警告', data.Message);
        }
      },
      checkWxjsaApi() {
        let t = this;
        // let articlePath = this.$router.resolve({path: '/newsDetails', query: {id: t.articleId}})
        let shareData = {
          title: t.articleDetails.ArticleTitle, // 分享标题
          desc: t.articleDetails.ArticleTitle, // 分享描述
          link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          success: function() {
            // 用户确认分享后执行的回调函数
            console.log('success');
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
            console.log('cancel');
          }
        };
        wx.ready(function() {
          wx.checkJsApi({
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function(res) {
              // 以键值对的形式返回，可用的api值true，不可用为false
              // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            }
          });
          /*朋友圈*/
          wx.onMenuShareTimeline({
            title: t.articleDetails.ArticleTitle, // 分享标题
            link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            success: function() {
              // 用户确认分享后执行的回调函数
              console.log('success');
            },
            cancel: function() {
              // 用户取消分享后执行的回调函数
              console.log('cancel');
            }
          });
          /*朋友*/
          wx.onMenuShareAppMessage(shareData);
          /*QQ*/
          wx.onMenuShareQQ(shareData);
          /*腾讯微博*/
          wx.onMenuShareWeibo(shareData);
          /*QQ空间*/
          wx.onMenuShareQZone(shareData);
        });
      },
      /*分享新浪微博*/
      shareWeiBo() {
        let _shareUrl = 'http://v.t.sina.com.cn/share/share.php?&appkey=895033136'; //真实的appkey，必选参数
        _shareUrl += '&url=' + encodeURIComponent(document.location); //参数url设置分享的内容链接|默认当前页location，可选参数
        _shareUrl += '&title=' + encodeURIComponent(this.articleDetails.ArticleName || document.title);    //参数title设置分享的标题|默认当前页标题，可选参数
        _shareUrl += '&source=' + encodeURIComponent('');
        _shareUrl += '&sourceUrl=' + encodeURIComponent('');
        _shareUrl += '&content=' + 'utf-8'; //参数content设置页面编码gb2312|utf-8，可选参数
        _shareUrl += '&pic=' + encodeURIComponent('');  //参数pic设置图片链接|默认为空，可选参数
        window.open(_shareUrl, '_blank', 'width=' + +',height=' + +',top=' + +',left=' +
          +',toolbar=no,menubar=no,scrollbars=no, resizable=1,location=no,status=0');
      },
      toggleShowShare() {
        this.showShare = !this.showShare;
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .article_container {
    background-color: $fill-base;

    .header_right_slot {
      display: flex;
      align-items: center;

      .read_count {
        display: inline-block;
        margin-right: rem64(10px);
        min-width: rem75(130px);
        height: rem75(50px);
        line-height: rem75(50px);
        text-align: center;
        border-radius: rem75(25px);
        background-color: #fff;
        color: $brand-primary;
        font-size: 12px;
      }
    }
  }

  .article_details_desc {
    padding: rem75(20px) 0;
    color: $color-text-thirdly;
  }

  .article_details_title {
    color: $color-text-secondary;
    border-bottom: 1px dashed $border-color-base;
    padding: rem64(20px) rem64(30px) 0;

    h2 {
      font-weight: 600;
      font-size: 18px;
      color: $color-text-base;
    }

    span {
      margin-right: rem75(25px);
    }
  }

  .article_details_content {
    padding: rem64(20px) rem64(30px);

    img {
      width: 100%;
    }
  }

  .share_list {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: $fill-body;
    z-index: 60;
    @extend %clearfix;

    .share_item {
      @extend %pull-left;
      padding: rem75(24px) 0 rem75(10px) rem75(24px);
      width: rem75(156px);
      text-align: center;

      p {
        line-height: rem75(50px);
      }
    }

    img {
      width: rem75(108px);
    }

    .cancel_share {
      background-color: $fill-base;
      text-align: center;
      line-height: rem75(94px);
      color: $brand-primary;
      @extend %pull-left;
      width: 100%;
    }
  }
</style>
