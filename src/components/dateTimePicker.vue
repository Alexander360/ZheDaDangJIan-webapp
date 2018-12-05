/**
* 日期选择器
*/
<template>
  <div class="date_time_picker container_top">
    <slot name="header"></slot>
    <div class="picker_selected">
      <span :class="pickerActive=='startDate'&&'picker_active'"
            @click="openStartPicker()">{{startDate | dateFilter('yyyy-MM-dd')}}</span>
      至
      <span :class="pickerActive=='endDate'&&'picker_active'"
            @click="openEndPicker()">{{endDate | dateFilter('yyyy-MM-dd')}}</span></div>
    <mt-datetime-picker
        v-model="startDate"
        ref="startPicker"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日">
    </mt-datetime-picker>
    <mt-datetime-picker
        v-model="endDate"
        ref="endPicker"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日">
    </mt-datetime-picker>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { DatetimePicker } from 'mint-ui'
  import headerFix from './headerFix.vue'
  import { formatDate } from '../plugins/utils'

  Vue.component(DatetimePicker.name, DatetimePicker)
  export default {
    mixins: [],
    data () {
      return {
        startDate: new Date(this.selectedTime.startTime),
        endDate: new Date(this.selectedTime.endTime),
        pickerActive: 'startDate',
      }
    },
    created () {
      
    },
    mounted () {
      this.openStartPicker()
    },
    props: ['selectedTime'],
    components: {
      headerFix,
    },
    computed: {
      dateObj () {
        return {
          startTime: formatDate(this.startDate, 'yyyy-MM-dd'),
          endTime: formatDate(this.endDate, 'yyyy-MM-dd')
        }
      }
    },
    updated () {
      
    },
    methods: {
      openStartPicker () {
        this.$refs.startPicker.open()
        this.pickerActive = 'startDate'
      },
      closeStartPicker () {
        this.$refs.startPicker.close()
      },
      openEndPicker () {
        this.$refs.endPicker.open()
        this.pickerActive = 'endDate'
      },
      closeEndPicker () {
        this.$refs.endPicker.close()
      },
    },
    watch: {
      dateObj (val) {
        this.$emit('update:selectedTime', val)
      }
    }
    
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .date_time_picker {
    .picker_selected {
      padding: rem75(60px) rem75(20px);
      text-align: center;
      color: $color-text-thirdly;
      font-size: 14px;
      span {
        display: inline-block;
        width: rem75(300px);
        @include ht-lineHt75(70px);
        border-bottom: 1px solid $border-color-light;
        &.picker_active {
          color: $brand-primary;
          border-bottom: 1px solid $brand-primary;
        }
      }
    }
  }
</style>
