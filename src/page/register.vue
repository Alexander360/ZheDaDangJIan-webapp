/**
* 注册
*/
<template>
  <div class="register container_top">
    <!--头部-->
    <header-fix title="注册" fixed>
      <i class="webapp webapp-left" @click.stop="goBack" slot="left"></i>
    </header-fix>
    <div class="setting_1">
      <div class="setting_item">
        <span class="label">用户名</span>
        <div class="right required"><input v-model="infoSend.Account" type="text" placeholder="请输入用户名"/></div>
      </div>
      <div class="setting_item">
        <span class="label">密码</span>
        <div class="right required"><input v-model="infoSend.Password" type="password" placeholder="密码长度为6~16个字符"/>
        </div>
      </div>
      <div class="setting_item">
        <span class="label">确认密码</span>
        <div class="right required"><input v-model="confirmPwd" type="password" placeholder="请再次确认密码"/></div>
      </div>
      <div class="setting_item">
        <span class="label">姓名</span>
        <div class="right required"><input v-model="infoSend.Name" type="text" placeholder="请输入姓名"/></div>
      </div>
      <div class="setting_item">
        <span class="label">选择地区</span>
        <div class="right required">
          <p class="department" @click="openGroupList">
            {{groupName}}
            <span class="arrowRight"><i class="webapp webapp-right"></i></span>
          </p>
        </div>
      </div>

    </div>
    <div class="setting_2">
      <div class="setting_item">
        <span class="label">身份证号码</span>
        <div class="right">
          <input v-model="infoSend.IdCard" type="text" maxlength="18" placeholder="请输入18位有效身份证"/>
        </div>
      </div>
      <!--<div class="setting_item">
        <span class="label">选择职级</span>
        <div class="right">
          <p class="department" @click="openGradeList">{{gradeName}}
            <span class="arrowRight"><i class="webapp webapp-right"></i></span>
          </p>
        </div>
      </div>-->
      <div class="setting_item">
        <span class="label">手机号码</span>
        <div class="right"><input v-model="infoSend.Mobile" type="text" placeholder="请输入手机号码"/></div>
      </div>
    </div>
    <div class="subimt_edit">
      <mt-button type="primary" size="large" @click.native="verification">注册</mt-button>
    </div>
    <!--职级选择器-->
    <mt-popup
        v-model="isShowGradeList"
        popup-transition="popup-fade"
        position="bottom">
      <div slot class="grade_list">
        <mt-picker :slots="gradeSlots" show-toolbar value-key="Name" @change="onGradeChange">
          <div class="clearfix">
            <span class="btn pull-left" @click="closeGradeList">取消</span>
            <span class="btn pull-right" @click="confirmGradeList">确定</span>
          </div>
        </mt-picker>
      </div>
    </mt-popup>
    <!--选择地区-->
    <transition name="slide-left">
      <div class="cell_container" v-if="showGroupIndex != 0">
        <transition name="slide-left">
          <div class="cell_list" v-if="showGroupIndex == 1" key="1">
            <header-fix :title="groupName">
              <a @click="backGroupList" slot="left"><i class="webapp webapp-left"></i></a>
            </header-fix>
            <div class="cell" v-for="(item) in groupList1" :key="item.UserGroupId">
              <a @click="getChildrenGroup(item.UserGroupId,item.UserGroupName)">{{item.UserGroupName}}</a>
              <i class="webapp webapp-right"></i>
            </div>
          </div>
          <div class="cell_list" v-else-if="showGroupIndex == 2" key="2">
            <header-fix :title="groupName">
              <a @click="backGroupList" slot="left"><i class="webapp webapp-left"></i></a>
            </header-fix>
            <div class="cell" v-for="(item) in groupList2" :key="item.UserGroupId">
              <a @click="getChildrenGroup(item.UserGroupId,item.UserGroupName)">{{item.UserGroupName}}</a>
              <i class="webapp webapp-right"></i>
            </div>
          </div>
          <div class="cell_list" v-else-if="showGroupIndex == 3" key="3">
            <header-fix :title="groupName">
              <a @click="backGroupList" slot="left"><i class="webapp webapp-left"></i></a>
            </header-fix>
            <div class="cell" v-for="(item) in groupList3" :key="item.UserGroupId">
              <a @click="getChildrenGroup(item.UserGroupId,item.UserGroupName)">{{item.UserGroupName}}</a>
              <i class="webapp webapp-right"></i>
            </div>
          </div>
          <div class="cell_list" v-else-if="showGroupIndex == 4" key="4">
            <header-fix :title="groupName">
              <a @click="backGroupList" slot="left"><i class="webapp webapp-left"></i></a>
            </header-fix>
            <div class="cell" v-for="(item) in groupList4" :key="item.UserGroupId">
              <a @click="getChildrenGroup(item.UserGroupId,item.UserGroupName)">{{item.UserGroupName}}</a>
              <i class="webapp webapp-right"></i>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Toast, MessageBox, Button, Popup, Picker } from 'mint-ui'
  import { headerFix } from '../components'
  import { goBack } from '../service/mixins'
  import { GetGradeList, GetGroupList, Register } from '../service/getData'

  Vue.component(Button.name, Button)
  Vue.component(Popup.name, Popup)
  Vue.component(Picker.name, Picker)

  export default {
    mixins: [goBack],
    data () {
      return {
        groupList1: [], //部门列表
        groupList2: [], //部门列表
        groupList3: [], //部门列表
        groupList4: [], //部门列表
        groupName: '选择地区',
        parentId: '1',
        infoSend: {
          Account: '',
          Password: '',
          Name: '',
          GroupId: '',
          IdCard: '',
          Grade: '',
          Mobile: '',
          SmgCode: ''
        },
        confirmPwd: '', //确认密码,
        isShowGradeList: false, //是否显示职级选择器
        showGroupIndex: 0, //是否显示单位选择器

        gradeList: [], //职级列表
        gradeName: '选择职级', //职级名称
        gradeSelected: {}, //被选中职级的数据
        gradeSlots: [
          //职级数据
          {
            flex: 1,
            values: [],
            defaultIndex: 1,
            className: 'gradeList',
            textAlign: 'center'
          }
        ],

        isPassConfirm: false, //两次输入密码确认
        isPassIdCard: true, //身份证验证
        isPassMobile: true, //手机号验证
        isPassPwd: true //密码验证
      }
    },
    mounted () {
      //      this.getGradeList();
    },
    components: {
      headerFix
    },
    methods: {
      //注册
      async userRegister () {
        let data = await Register(this.infoSend)
        if (data.Type == 1) {
          Toast({message: '注册成功', position: 'bottom'})
          this.$router.push('/login')
        } else if (data.Type != 401) {
          MessageBox('警告', data.Message)
        }
      },
      //部门列表
      async getGroupList () {
        let data = await GetGroupList({ParentId: this.parentId})
        let attr = `groupList${this.showGroupIndex}`
        if (data.Type == 1) {
          let list = data.Data.GroupInfoList
          if (list && list.length > 0) {
            this[attr] = list
            //            this.groupList.push({list});
          } else if (list && list.length == 0) {
            this.infoSend.GroupId = this.parentId
            this.showGroupIndex = 0
          }
        }
      },
      openGroupList () {
        this.getChildrenGroup('0', '选择地区')
      },
      backGroupList () {
        this.showGroupIndex -= 1
      },
      getChildrenGroup (ParentId, title) {
        this.groupName = title
        this.parentId = ParentId
        this.showGroupIndex += 1
        this.getGroupList()
      },
      //职级列表
      async getGradeList () {
        let data = await GetGradeList()
        if (data.Type == 1) {
          this.gradeList = data.Data.GroupInfoList
          this.gradeSlots[0].values = data.Data.GroupInfoList
        }
      },
      //职级选择器
      onGradeChange (picker, values) {
        let selected = values[0]
        if (selected) {
          this.gradeSelected = selected
        }
      },
      closeGradeList () {
        this.isShowGradeList = false
      },
      openGradeList () {
        this.isShowGradeList = true
      },
      confirmGradeList () {
        this.isShowGradeList = false
        this.infoSend.Grade = this.gradeSelected.Id
        this.gradeName = this.gradeSelected.Name
      },
      verification () {
        if (!this.infoSend.Account) {
          Toast({
            message: '用户名不能为空',
            position: 'bottom',
            duration: 2000
          })
        } else if (!this.infoSend.Password) {
          Toast({message: '密码不能为空', position: 'bottom', duration: 2000})
        } else if (!this.isPassPwd) {
          Toast({
            message: '密码长度为6~16位',
            position: 'bottom',
            duration: 2000
          })
        } else if (!this.confirmPwd) {
          Toast({
            message: '确认密码不能为空',
            position: 'bottom',
            duration: 2000
          })
        } else if (!this.isPassConfirm) {
          Toast({
            message: '两次输入密码不一致',
            position: 'bottom',
            duration: 2000
          })
        } else if (!this.infoSend.Name) {
          Toast({message: '姓名不能为空', position: 'bottom', duration: 2000})
        } else if (!this.infoSend.GroupId) {
          Toast({message: '请选择地区', position: 'bottom', duration: 2000})
        } else if (!this.isPassIdCard) {
          Toast({
            message: '请输入有效身份证号码',
            position: 'bottom',
            duration: 2000
          })
        } else if (!this.isPassMobile) {
          Toast({
            message: '手机号格式不正确',
            position: 'bottom',
            duration: 2000
          })
        } else {
          this.userRegister()
        }
      }
    },
    watch: {
      confirmPwd: function (val) {
        if (val == this.infoSend.Password) {
          this.isPassConfirm = true
        } else {
          this.isPassConfirm = false
        }
      },
      'infoSend.IdCard': {
        handler: function (val, oldVal) {
          if (val) {
            let regIdCard = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
            this.isPassIdCard = regIdCard.test(val)
          } else {
            this.isPassIdCard = true
          }
        }
      },
      'infoSend.Mobile': {
        handler: function (val, oldVal) {
          if (val) {
            let regMobile = /^1[3|4|5|7|8]\d{9}$/
            this.isPassMobile = regMobile.test(val)
          } else {
            this.isPassMobile = true
          }
        }
      },
      'infoSend.Password': {
        handler: function (val, oldVal) {
          if (val) {
            if (val.length < 6 || val.length > 16) {
              this.isPassPwd = false
            } else {
              this.isPassPwd = true
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .register {
    background-color: $fill-body;
    .setting_item {
      @extend %clearfix;
      margin: 0 rem75(30px);
      height: rem75(90px);
      line-height: rem75(90px);
      border-bottom: 1px solid $border-color-base;
      font-size: 14px;
      &:last-child {
        border-bottom: transparent;
      }
    }
    .required:after {
      content: "*";
      display: inline-block;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 12px;
      color: $brand-primary;
    }
    .label {
      @extend %pull-left;
      text-align: left;
      width: 30%;
      font-size: 15px;
    }
    .right {
      @extend %pull-right;
      width: 70%;
      input {
        width: 95%;
        padding: rem75(10px) 0;
        line-height: 1.2em;
      }
    }
    .department {
      display: inline-block;
      width: 95%;
      height: rem75(90px);
    }
    .arrowRight {
      @extend %pull-right;
      .webapp-more {
        color: #666;
        font-size: 20px;
      }
    }
    .group_list {
      width: 100%;
      height: 100%;
      background-color: #fff;
    }

    .picker-toolbar {
      background-color: $brand-primary;
      color: $color-text-reverse;
      font-size: 16px;
      .btn {
        display: inline-block;
        @include ht-lineHt75(80px);
        width: 50%;
        text-align: center;
      }
    }
    .mint-popup-bottom {
      width: 100%;
    }
    .setting_1 {
      background-color: $fill-base;
    }
    .setting_2 {
      background-color: $fill-base;
      margin: rem75(20px) 0;
    }
    .mint-datetime-action {
      color: $color-text-reverse;
    }
    .subimt_edit {
      margin-top: rem75(50px);
      padding: 0 rem75(30px);
    }
    .cell_container {
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #fff;
    }
    .cell_list {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow-y: scroll;
    }
    .cell {
      @include ht-lineHt75(90px);
      margin: 0 rem75(30px);
      border-bottom: 1px solid $border-color-base;
      color: $color-text-secondary;
      font-size: 14px;
      @extend %clearfix;
      position: relative;
      a {
        @extend %pull-left;
        color: $color-text-secondary;
        width: 100%;
      }
      .webapp-more {
        color: #666;
        font-size: 20px;
        position: absolute;
        right: 0;
      }
    }
  }
</style>
