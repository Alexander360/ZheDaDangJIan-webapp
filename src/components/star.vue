/**
* 星级评分
*/
<template>
  <div class="star_grade">
    <span v-for="(itemClass,index) in itemClasses"
          @click="checkStarItem(index)"
          :class="[itemClass,size=='small'?'small':'']" class="star-item"
          :key="index">
    </span>
    <span v-if="showText || showScore"
          :class="['rate_text',size=='small'?'rate_text_small':'rate_text_primary']">{{ text }}</span>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        currentValue: parseFloat(this.value),
        itemClasses: [],
      }
    },
    created () {
      this.computeClass()
    },
    props: {
      value: {
        type: [Number, String],
        default: 4
      },
      size: {
        type: String,
        default: 'primary'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      showText: {
        type: Boolean,
        default: false
      },
      showScore: {
        type: Boolean,
        default: false
      },
      texts: {
        type: Array,
        default () {
          return ['极差', '失望', '一般', '满意', '惊喜']
        }
      },
    },
    computed: {
      text () {
        let result = ''
        if (this.showScore) {
          result = this.disabled ? this.value : this.currentValue
          result = parseInt(result).toFixed(1)
        } else if (this.showText) {
          result = this.texts[Math.ceil(this.currentValue) - 1]
        }
        return result
      },
    },
    methods: {
      checkStarItem (num) {
        if (this.disabled) {
          return
        }
        this.currentValue = parseInt(num) + 1
      },
      computeClass () {
        let result = []
        let score = Math.floor(this.value * 2) / 2
        let hasDecimal = score % 1 !== 0
        let integer = Math.floor(score)
        for (let i = 0; i < integer; i++) {
          result.push('on')
        }
        if (hasDecimal) {
          result.push('half')
        }
        while (result.length < 5) {
          result.push('off')
        }
        this.itemClasses = result
      }
    },
    watch: {
      value (val) {
        this.currentValue = val
        this.computeClass()
      },
      currentValue (val) {
        this.$emit('input', val)
      }
    }
    
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .star_grade {
    display: block;
  }

  .star-item {
    font-size: 0;
    display: inline-block;
    background-repeat: no-repeat;
    width: rem75(30px);
    height: rem75(30px);
    line-height: rem75(30px);
    margin: 0 rem75(14px);
    background-size: rem75(30px);
    &.small {
      width: rem75(24px);
      height: rem75(24px);
      line-height: rem75(24px);
      background-size: rem75(24px);
      margin: 0 rem75(6px);
    }
  }

  .star-item.on {
    background-image: url(../assets/star_on.png);
  }

  .star-item.half {
    background-image: url(../assets/star_half.png);
  }

  .star-item.off {
    background-image: url(../assets/star_off.png);
  }

  .rate_text {
    color: $color-text-thirdly;
  }

  .rate_text_primary {
    font-size: 14px;
  }

  .rate_text_small {
    font-size: 12px;
  }
</style>
