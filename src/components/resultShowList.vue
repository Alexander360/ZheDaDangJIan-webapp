/**
* 成果展示列表
*/
<template>
  <div class="result_show_list">
    <ul>
      <li v-for="(item,index) in data" @click="goDetail(item.ProductionId)" :key="index">
        <error-img :src="item.ProductionImage" alt=""></error-img>
        <p class="result_title">{{item.ProductionTitle}}</p>
        <div class="restule_desc clearfix">
          <span class="result_good pull-left"><i class="webapp webapp-goodfill"></i>{{item.AssistCount}}</span>
          <span class="result_comment pull-right"><i class="webapp webapp-commentfill"></i>{{item.CommontCount}}</span>
        </div>
      </li>
    </ul>
    <div class="noDataBg" v-if="noDataBg"></div>
    <div class="no-data" v-if="noData">没有更多内容了...</div>
  </div>
</template>
<script>
  import { errorImg } from '../components'

  export default {
    mixins: [],
    data () {
      return {}
    },
    created () {
      
    },
    mounted () {
      
    },
    props: {
      data: {
        type: Array,
        required: true
      },
      noDataBg: {
        type: Boolean,
        default: false
      },
      noData: {
        type: Boolean,
        default: false
      }
    },
    components: {
      errorImg
    },
    computed: {},
    updated () {
      
    },
    methods: {
      goDetail (id) {
        this.$router.push({path: 'resultShowDetail', query: {id}})
      }
    },
    watch: {}
    
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .result_show_list {
    ul {
      @extend %clearfix;
      li {
        @extend %pull-left;
        width: 50%;
        background-color: $fill-base;
        margin-top: rem75(20px);
        text-align: center;
        img {
          width: rem75(341px);
          height: rem75(211px);
        }
        &:nth-child(odd) {
          padding: rem75(30px) rem75(20px) rem75(30px) rem75(20px);
        }
        &:nth-child(even) {
          padding: rem75(30px) rem75(20px) rem75(30px) 0;
        }
      }
      .restule_desc {
        color: $color-text-thirdly;
        .webapp {
          color: $color-text-thirdly;
          font-size: 14px;
          margin-right: rem75(5px);
        }
      }
      .result_title {
        @include ellipsis_two(1);
        text-align: left;
        margin: rem75(20px) 0;
      }
      .result_good {

      }
      .result_comment {

      }
    }
  }
</style>
