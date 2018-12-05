/**
*我的收藏
*/
<template>
  <div class="my_collect container_top">
    <!--头部-->
    <header-fix title="我的收藏" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
      <span slot="right" @click.stop="toggleEdit">{{showEdit ? '取消' : '编辑'}}</span>
    </header-fix>
    <div class="date_select clearfix">
      <p class="pull-left">{{selectedTime.startTime}} ~ {{selectedTime.endTime}}</p>
      <p class="pull-right" @click="togglePicker">选择日期：<i class="webapp webapp-calendar"></i></p>
    </div>
    <div class="collect_list">
      <collect-item v-for="(item,index) in collectData"
                    :key="item.CollectionId"
                    v-model="deleteData[item.CollectionId]"
                    :show-check.sync="showEdit"
                    :delete-item="deleteItem"
                    :option="item"
      >
        <div slot="content" class="clearfix collect_content">
          <div class="left_content">{{sortNum(index + 1)}}.</div>
          <div class="right_content" @click.stop="toDetail(item.ObjType,item.ObjId)">
            <p class="collect_title">
              <span class="error" v-if="item.ObjType==0">文章 | </span>
              <span class="error" v-if="item.ObjType==1">课程 | </span>
              <span class="error" v-if="item.ObjType==2">看书 | </span>
              <span class="error" v-if="item.ObjType==3">学习 | </span>
              <span>{{item.CollectionName}}</span>
            </p>
            <p class="collect_date">日期：{{item.CreateTime | dateFilter}}</p>
          </div>
        </div>
      </collect-item>
      <div class="noDataBg" v-if="noDataBg"></div>
    </div>
    <transition name="slide-top-collect">
      <div class="edit_footer" v-if="showEdit">
        <span class="check_all" @click="toggleCheckedAll">{{checkedAll ? '取消' : '全选'}}</span>
        <span class="del_select" @click="deleteCheckedAll">删除</span>
      </div>
    </transition>
    <!--时间选择器-->
    <transition name="slide-left">
      <date-time-picker
          class="picker_container"
          v-if="showTimerPicker"
          :selected-time.sync="selectedTime"
      >
        <!--头部-->
        <header-fix slot="header" title="日期选择" fixed>
          <span slot="left" @click="togglePicker">取消</span>
          <span slot="right" @click="pickerComplete">完成</span>
        </header-fix>
      </date-time-picker>
    </transition>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Toast, InfiniteScroll } from 'mint-ui'
  import { headerFix, collectItem, dateTimePicker } from '../components'
  import { goBack } from '../service/mixins'
  import { GetCollectionList, DeleteCollectionList } from '../service/getData'
  import { formatDate } from '../plugins/utils'

  Vue.use(InfiniteScroll)
  export default {
    mixins: [goBack],
    data () {
      return {
        showEdit: false, //是否显示编辑
        showTimerPicker: false, //是否显示日期选择
        checkedAll: false, //是否全选
        collectData: [],
        selectedTime: {
          startTime: formatDate(new Date('2018-1-1'), 'yyyy-MM-dd'),
          endTime: formatDate(new Date(), 'yyyy-MM-dd'),
        },
        idItem: [],
        deleteData: {},
        noDataBg: false
      }
    },
    created () {
      
    },
    mounted () {
      this.getCollectList()
    },
    props: [],
    components: {
      headerFix,
      collectItem,
      dateTimePicker,
    },
    computed: {},
    updated () {
    },
    methods: {
      /*获取收藏列表*/
      async getCollectList () {
        let data = await GetCollectionList(this.selectedTime)
        this.collectData = data.Data
      },
      //取消收藏
      async cancelCollect (IdItem) {
        let data = await DeleteCollectionList({IdItem})
        if (data.Type == 1) {
          Toast({message: data.Message, position: 'bottom'})
          this.isCollect = false
          this.filterCollectData(IdItem)
        }
      },
      /*获取收藏列表*/
      filterCollectData (idItem) {
        idItem.forEach((id) => {
          let newCollectData = this.collectData.filter((item) => {
            return item.CollectionId != id
          })
          this.collectData = newCollectData
        })
      },
      /*切换编辑*/
      toggleEdit () {
        this.showEdit = !this.showEdit
        this.checkedAll = false
        this.toggleDeleteDate(false)
      },
      /*切换日期选择*/
      togglePicker () {
        this.showTimerPicker = !this.showTimerPicker
      },
      /*左滑删除*/
      deleteItem (item) {
        let IdItem = []
        IdItem.push(item.CollectionId)
        this.cancelCollect(IdItem)
      },
      sortNum (num) {
        let index = parseInt(num)
        if (index < 10) {
          return `0${index}`
        }
        return index
      },
      /*日期选择完成*/
      pickerComplete () {
        this.togglePicker()
        this.getCollectList()
      },
      /*全选、取消全选*/
      toggleCheckedAll () {
        this.checkedAll = !this.checkedAll
      },
      /*删除选中的所有*/
      deleteCheckedAll () {
        if (this.idItem.length > 0) {
          this.cancelCollect(this.idItem)
          this.showEdit = false
        } else {
          Toast({message: '请选择要删除的选项', position: 'bottom'})
        }
      },
      /*跳转到详情页*/
      toDetail (type, id) {
        if (!this.showEdit) {
          if (type == 0) {
            this.$router.push({path: '/newsDetails', query: {id}})
          } else if (type == 1) {
            this.$router.push({path: '/playMp4', query: {id}})
          } else if (type == 2) {
            this.$router.push({path: '/ebookChapterList', query: {id}})
          }
        }
      },
      /*toggle deleteData*/
      toggleDeleteDate (val) {
        for (var i in this.deleteData) {
          this.deleteData[i] = val
        }
      }
    },
    watch: {
      collectData: function (val) {
        let deleteData = {}
        val.forEach((item, index) => {
          deleteData[item.CollectionId] = this.checkedAll
        })
        this.deleteData = deleteData
        this.noDataBg = !val.length > 0
      },
      checkedAll: function (val) {
        this.toggleDeleteDate(val)
      },
      deleteData: {
        handler (newValue, oldValue) {
          let newArr = []
          for (var i in newValue) {
            newValue[i] && newArr.push(i)
          }
          this.idItem = newArr
        },
        deep: true
      }
    }
    
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .my_collect {
    .date_select {
      color: $color-text-thirdly;
      @include ht-lineHt75(60px);
      padding: 0 rem75(25px);
      .webapp {
        color: $color-text-thirdly;
        margin-left: rem75(15px);
      }
    }
    .collect_list {
      background-color: $fill-base;
      width: 100%;
      overflow: hidden;
      .mint-checkbox-input:checked + .mint-checkbox-core {
        background-color: $brand-wait;
        border-color: $brand-wait;
      }
      .collect_content {
        width: rem75(750px);
        padding: rem75(30px) rem75(25px);
      }
      .left_content {
        @extend %pull-left;
        width: rem75(80px);
        line-height: rem75(41px);
      }
      .right_content {
        @extend %pull-left;
        width: rem75(570px);
        .collect_title {
          height: rem75(82px);
          line-height: rem75(41px);
          @include ellipsis_two();
        }
        .collect_date {
          color: $color-text-secondary;
        }
      }
      .error {
        color: $brand-error;
      }
    }
    .picker_container {
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #fff;
    }
    .edit_footer {
      position: fixed;
      z-index: 10;
      bottom: 0;
      left: 0;
      width: 100%;
      @include flex(space-between);
      background-color: $fill-base;
      font-size: 16px;
      span {
        padding: rem75(34px) rem75(116px);
      }
      .check_all {
        color: $color-text-secondary;
      }
      .del_select {
        color: $brand-error;
      }
    }
  }

  :global {
    //向上滑动
    .slide-top-collect-enter-active, .slide-top-collect-leave-active {
      transition: all 0.5s;
    }

    .slide-top-collect-enter, .slide-top-collect-leave-to {
      transform: translateY(1.5rem);
      opacity: 0;
    }
  }
</style>
