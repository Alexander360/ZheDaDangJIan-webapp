/**
* 签到详情
*/
<template>
  <div class="sign_detail container_top">
    <!--头部-->
    <header-fix title="签到详情" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <sign-list :signData="signData"></sign-list>
  </div>
</template>
<script>
  import { goBack } from '../service/mixins'
  import { signList, headerFix } from '../components'
  import { GetClassUserSignList } from '../service/getData'

  export default {
    mixins: [goBack],
    data () {
      return {
        trainingId: '',
        signData: []
      }
    },
    created () {
      this.trainingId = this.$route.query.Id
    },
    mounted () {
      this.getSignList()
    },
    props: [],
    components: {
      signList,
      headerFix,
    },
    computed: {},
    updated () {
      
    },
    methods: {
      //签到列表
      async getSignList () {
        let data = await GetClassUserSignList({TrainingId: this.trainingId})
        if (data.Type == 1) {
          this.signData = data.Data
        }
      },
    },
    watch: {}
    
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .sign_detail {
    background-color: $fill-body;
  }
</style>
