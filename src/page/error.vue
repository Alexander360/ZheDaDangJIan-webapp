/**
* error
*/
<template>
  <div class="error">
    <h1>
      <span><i class="webapp webapp-cry"></i> &nbsp;没有此页面！</span>
    </h1>
  </div>
</template>
<script>
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  @import "../style/mixin";

  .error {
    width: 100vw;
    height: 100vh;
    margin: 0 auto;
    h1 {
      padding: rem75(150px) rem75(20px);
      font-size: 25px;
      text-align: center;
      line-height: 100px;
    }
    .webapp-cry {
      font-size: 22px;
      color: #333;
    }
  }
</style>
