/**
* 收藏item
*/
<template>
  <div class="collect_item">
    <div class="move" :style="txtStyle">
      <label class="mint-checklist-label">
        <span class="mint-checkbox">
          <input
              class="mint-checkbox-input"
              type="checkbox"
              v-model="currentValue"
              :value="value"/>
          <span class="mint-checkbox-core"></span>
        </span>
      </label>
      <div class="moveAction"
           @touchstart="_touchStart"
           @touchmove="_touchMove"
           @touchend="_touchEnd">
        <slot name="content"></slot>
      </div>
      <div class="deleteIcon" @click.stop="deleteItem(option)">删除</div>
    </div>
  </div>
</template>
<script>
  export default {
    mixins: [],
    data () {
      return {
        currentValue: this.value,
        startX: 0,       //触摸位置
        moveX: 0,       //滑动时的位置
        disX: 0,       //移动距离
        defaultX: -1.067,
        txtStyle: 'transform:translateX(-1.067rem)',
        delWidth: 126,
        showDelete: false,
      }
    },
    created () {
      
    },
    mounted () {
      
    },
    props: {
      value: null,
      showCheck: {
        type: Boolean,
        default: false
      },
      deleteItem: {
        type: Function
      },
      option: {
        type: Object
      }
    },
    components: {},
    computed: {},
    updated () {
      
    },
    methods: {
      _touchStart (ev) {
        ev = ev || event
        if (ev.touches.length == 1) {
          this.closeEdit()
          // 手指按下的时候记录按下的位置
          this.startX = ev.touches[0].clientX
//          console.log(this.startX)
        }
      },
      _touchMove (ev) {
        ev = ev || event
        if (ev.touches.length == 1) {
          // 滑动过程中的实时位置
          this.moveX = ev.touches[0].clientX
          // 滑动过程中实时计算滑动距离
          this.disX = this.startX - this.moveX
//          console.log('disX==>', this.disX)
          // 如果是向右滑动或者只是点击，不改变滑动位置
          if (this.disX <= 0) {
            this.txtStyle = `transform:translateX(${this.defaultX}rem)`
            this.showDelete = false
          } else if (this.disX > 0) {
            //如果是向左滑动，则实时给这个根元素一个向左的偏移-left，当偏移量到达固定值delWidth时，固定元素的偏移量为 delWidth
            let moveDisX = this.defaultX - (this.disX / 75)
            this.txtStyle = `transform:translateX(${moveDisX}rem)`
            if (this.disX >= this.delWidth / 2) {
              let delMoveX = this.defaultX - (this.delWidth / 75)
              this.showDelete = true
              this.txtStyle = `transform:translateX(${delMoveX}rem)`
            }
          }
        }
      },
      _touchEnd (ev) {
        if (event.changedTouches.length == 1) {
          // 手指移动结束后的水平位置
          let endX = event.changedTouches[0].clientX
          // 触摸开始与结束,手指移动的距离
          this.disX = this.startX - endX
//          console.log(this.disX)
          //如果距离小于删除按钮的1/2，不显示删除按钮
          if (this.disX < this.delWidth / 2) {
            this.txtStyle = `transform:translateX(${this.defaultX}rem)`
            this.showDelete = false
          }
          this.startX = 0
        }
      },
      closeEdit () {
        this.$emit('update:showCheck', false)
      },
    },
    watch: {
      value (val) {
        this.currentValue = val
      },
      currentValue (val) {
        this.$emit('input', val)
      },
      showCheck (val) {
        val ? this.txtStyle = 'transform:translateX(0rem)' : this.txtStyle = 'transform:translateX(-1.067rem)'
      }
    }
    
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .collect_item {
    position: relative;
    width: rem75(957px);
    overflow: hidden;
    border-bottom: 1px solid $border-color-light;
    .move {
      transition: transform 0.5s;
      position: relative;
      @include flex(space-between);
    }
    .mint-checklist-label {
      width: rem75(80px);
      padding-top: rem75(30px);
    }
    .deleteIcon {
      transition: all 0.5s;
      width: rem75(127px);
      height: 100%;
      line-height: rem75(172px);
      background-color: $brand-wait;
      text-align: center;
      color: $color-text-reverse;
    }
  }
</style>
