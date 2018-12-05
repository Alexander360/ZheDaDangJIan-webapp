/**
* 添加笔记
*/
<template>
  <div class="add_notes">
    <slot name="header"></slot>
    <div class="add_notes_form">
      <input v-model="title" class="notes_title" type="text" placeholder="标题">
      <textarea v-model="content" class="notes_content" placeholder="开始书写"></textarea>
    </div>
  </div>
</template>
<script>
  export default {
    mixins: [],
    data () {
      return {
        title: this.notesData.title,
        content: this.notesData.content
      }
    },
    created () {
      
    },
    mounted () {
      
    },
    props: ['notesData'],
    components: {},
    computed: {
      sendData () {
        return {
          title: this.title,
          content: this.content
        }
      }
    },
    updated () {
      
    },
    methods: {},
    watch: {
      sendData (val) {
        this.$emit('update:notesData', val)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .add_notes {
    .add_notes_form {
      padding: rem75(20px) rem75(30px);
    }
    .notes_title {
      font-size: 15px;
      width: 100%;
      padding: rem75(20px) 0;
    }
    .notes_content {
      font-size: 12px;
      width: 100%;
      height: rem75(700px);
      padding: rem75(20px) 0;
    }
  }
</style>
