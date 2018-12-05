/**
* 树节点
*/
<template>
  <li class="tree_node">
    <div class="tree_title" :class="dataList.Id == selectedId && 'tree_selected'">
      <span v-if="hasNodes || showLine" class="primary_line pull-left"></span>
      <span v-else class="tran_line pull-left"></span>
      <a class="tree_name" @click="nodeClick(dataList)">{{dataList.Name}}</a>
      <div class="tree_toggle_icon" v-if="hasNodes">
        <i v-if="open" @click="toggle" class="webapp webapp-up"></i>
        <i v-else @click="toggle" class="webapp webapp-down"></i>
      </div>
      <i class="selected_icon webapp webapp-selected"></i>
    </div>
    <ul class="tree_container" v-show="open" v-if="hasNodes">
      <node v-for="(item,index) in dataList.Nodes"
            :data-list="item"
            @itemClick="selectedNode"
            :on-select="onSelect"
            :selected-id="selectedId"
            :show-line="showLine"
            :key="index">
      </node>
    </ul>
  </li>
</template>
<script>
  export default {
    name: 'node',
    data() {
      return {
        open: false
      };
    },
    props: ['dataList', 'onSelect', 'selectedId', 'showLine'],
    computed: {
      hasNodes: function() {
        return this.dataList.Nodes && this.dataList.Nodes.length;
      }
    },
    methods: {
      toggle() {
        this.open = !this.open;
      },
      nodeClick(data) {
        this.$emit('itemClick', data);
      },
      selectedNode(data) {
        this.onSelect(data);
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .tree_container {
    width: 100%;
    padding: 0 0 0 rem75(20px);
  }

  .tree_node {
    font-size: 15px;
  }

  .tree_title {
    @include ht-lineHt75(88px);
    @extend %clearfix;
    position: relative;
    padding-left: rem75(26px);

    .tree_name {
      @extend %pull-left;
      width: 80%;
      @extend %ellipsis;
      line-height: rem75(88px);
    }

    .tree_toggle_icon {
      @extend %pull-right;
      padding-right: rem75(20px);

      .webapp {
        color: $color-text-thirdly;
      }
    }

    .tran_line {
      position: absolute;
      display: inline-block;
      width: rem75(6px);
      height: rem75(28px);
      margin-right: rem75(20px);
      background-color: transparent;
    }

    .primary_line, .tran_line {
      /*margin-top: rem75(30px);*/
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }

    .selected_icon {
      display: none;
      position: absolute;
      right: rem75(80px);
      font-size: 24px;
    }

    &.tree_selected {
      /*background-color: lighten($brand-primary, 36%);*/
      .selected_icon {
        display: block;
        color: $brand-primary;
      }
    }
  }
</style>
