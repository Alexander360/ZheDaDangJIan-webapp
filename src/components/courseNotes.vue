/**
* 课程笔记
*/
<template>
  <div class="course_notes">
    <div class="notes_item" v-for="(item,index) in notesData"
         :key="index"
         @click="goDetail(item.ExperienceId)">
      <p class="notes_title">{{item.ExperienceTitle}}</p>
      <p class="notes_date">发布时间：{{item.CreateDate | dateFilter}}</p>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['notesData'],
    methods: {
      goDetail (id) {
        this.$router.push({path: 'notesDetail', query: {id}})
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .course_notes {
    .notes_item {
      padding: rem75(20px) rem75(30px);
      background-color: $fill-base;
      margin-bottom: rem75(10px);
    }
    .notes_title {
      font-size: 14px;
      line-height: rem75(50px);

    }
    .notes_date {
      color: $color-text-thirdly;
      padding-top: rem75(30px);
    }
  }
</style>
