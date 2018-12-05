/**
* 课程目录
*/
<template>
  <ul class="course_menu">
    <li v-for="(item,index) in dataList" :key="index" :class="{'highlight':item.NodeId==active}">
      <span class="title">{{item.NodeName}}</span>
      <p class="status">
        <span class="green" v-if="item.Status=='C'">已完成</span>
        <span v-else>未完成</span>
      </p>
    </li>
  </ul>
</template>
<script>
  export default {
    props: {
      value: [Object],
      dataList: Array,
      active: [String, Number]
    },
    computed: {
      activeNode: function () {
        let dataList = this.dataList
        let node
        dataList && dataList.forEach((item, index) => {
          if (this.active == item.NodeId) {
            node = item
          }
        })
        return node
      }
    },
    watch: {
      activeNode: function (val) {
        this.$emit('input', val)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .course_menu {
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
      @extend %pull-left;
      color: $color-text-thirdly;
      font-size: 14px;
    }
    .green {
      color: $brand-success;
    }
  }

</style>
