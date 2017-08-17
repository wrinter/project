<template>
  <div>
    <div :class="{'TeacherNav':ThisItem == 0,'StudentNav':ThisItem == 1}">
      <ul class="FirstNav">
        <li></li>
        <li v-for="(route, index) in RouterData" @mouseenter="ShowMenu(index)" @mouseleave="ShowMenu(-1)" >
          <transition name="el-fade-in">
            <i class="el-icon-caret-top" v-show="index==IsShow"></i>
          </transition>
          <template v-if="isEmptyObject(route.path)">
            <router-link v-bind:to="route.path+'?id='+route.menuId"> {{route.name}}</router-link>
          </template>
          <template v-if="!isEmptyObject(route.path)">
            {{route.name}}
            <i class="el-icon-arrow-down" :class="{'arrow-down-trans':index==IsShow}"></i>
            <div class="Com_InNavBox">
              <transition name="el-zoom-in-top">
                <ul class="SecondNav transition-box" v-show="index==IsShow">
                  <li v-for="(second, index) in route.child">
                    <router-link v-bind:to="second.path+'?id='+second.menuId">
                      {{second.name}}
                    </router-link>
                  </li>
                </ul>
              </transition>
            </div>
          </template>
        </li>
        <li  @mouseenter="ShowLast" @mouseleave="ShowLast">
          <div class="Com_UserP">
            <img :src="ThisUserPhoto" alt="">
          </div>
          <transition name="el-fade-in">
            <i class="el-icon-caret-top" v-show="IsLastShow==true"></i>
          </transition>
          <div class="Com_InNavBox">
            <transition name="el-zoom-in-top">
              <ul class="SecondNav"  v-show="IsLastShow==true" >
                <li>
                  <router-link v-bind:to="'/content/teacher/msg/msg'">消息</router-link>
                </li>
                <li>
                  <router-link v-bind:to="'/content/common/test'">测试</router-link>
                </li>
                <li>
                  <router-link v-bind:to="'/content/teacher/userphoto/userphoto'">头像</router-link>
                </li>
                <li @click="Quit">退出</li>
              </ul>
            </transition>
          </div>
        </li>
      </ul>
    </div>
    <v-crumbs :ToItem="ThisItem"></v-crumbs>
  </div>
</template>
<script>
  import crumbs from './crumbs.vue'
  export default{
    data () {
      return {
        RouterData: {},
        IsShow: -1,
        IsLastShow: false,
        FirstWidth: 0,
        ThisUserPhoto: '',
        ThisItem: 0
      }
    },
    mounted () {
      this.GetNavData()
    },
    components: {
      'v-crumbs': crumbs
    },
    methods: {
      GetNavData  () {
        this.$http.get('static/data.json').then((response) => {
          if (response.body.retCode === '0000') {
            let ReceiveData = response.body.retData.menu
            this.ThisItem = parseInt(response.body.retData.role)
            this.RouterData = ReceiveData
            this.ThisUserPhoto = response.body.retData.userphoto
            localStorage.setItem('Item', this.ThisItem)
          }
        })
      },
      ShowMenu  (index) {
        this.IsShow = index
      },
      ShowLast () {
        this.IsLastShow = !this.IsLastShow
      },
      Quit  () {
        let Url = '/web/user/logout?' + Math.random()
        this.$http.get(Url).then((response) => {
          let CodeMsg = response.body.retCode
          if (CodeMsg === '0000') {
            this.$router.push('/')
          }
        })
      },
      isEmptyObject  (obj) {
        if (obj[0]) {
          return true
        } else if (obj === '') {
          return false
        } else {
          return false
        }
      }
    }
  }
</script>
<style>
  body{background: #ECEDF0;}
  .TeacherNav,.StudentNav{width: 100%;height: 80px;background: white; }
  .TeacherNav{border-bottom: 2px solid #65B113;}
  .StudentNav{border-bottom: 2px solid #49b9df;}
/*一级导航*/
  .FirstNav{margin:0 auto;clear: both;height: 100%;}
  .FirstNav>li:first-child{ float: left;width: 200px;height: 100%;line-height: 80px;}
  .TeacherNav .FirstNav>li:first-child{background: url("../../../static/common/images/weblogo.png") center center no-repeat;}
  .StudentNav .FirstNav>li:first-child{background: url("../../../static/common/images/stulogo.png") center center no-repeat;}
  .FirstNav>li,.FirstNav>li>a{position: relative; float: left;cursor: pointer; height: 100%;box-sizing: border-box; line-height: 80px;color: #333;font-size: 16px;text-align: center;}
  .FirstNav>li{min-width: 50px; padding: 0 15px;}
  .FirstNav>li>a{width: 100%;}
  .FirstNav>li:last-child{float: right;}
  .Com_InNavBox{position: absolute; left: 50%;transform: translateX(-50%); z-index: 9;top: 81px;}
  /*二级导航*/
  .TeacherNav .SecondNav,.StudentNav .SecondNav{  background: white;box-sizing: border-box;overflow: hidden;border-radius: 0 0 10px 10px;}
  .TeacherNav .SecondNav{border: 1px solid #65b113;}
  .StudentNav .SecondNav{border: 1px solid #49b9df;}
  .SecondNav>li,.SecondNav>li>a{float: left;width: 100%;color: #333; height: 50px;box-sizing: border-box; line-height: 50px; text-align: center;}
  .TeacherNav .SecondNav>li>a:hover,.TeacherNav .SecondNav>li:hover{background: #f5f5f5;color: #65b113;}
  .StudentNav .SecondNav>li>a:hover,.StudentNav .SecondNav>li:hover{background: #f5f5f5;color: #49b9df;}
  .Com_UserP{cursor: pointer;  width: 50px;  height: 50px;position: absolute;left: 0;right: 0;top: 0;bottom: 0;  margin:auto;  border: 2px solid #666;  box-sizing: border-box;  border-radius: 100%;  overflow: hidden}
  .Com_UserP>img{width: 100%;float: left;}
  .el-icon-caret-top{position: absolute;right: 0;left: 0;bottom: 0;margin: auto;height: 12px;font-size: 20px;}
  .TeacherNav .el-icon-caret-top{color: #65b113;}
  .StudentNav .el-icon-caret-top{color: #49b9df;}
  /*适配*/
  @media screen and (max-width:1365px){
    .FirstNav{width: 900px;}
    .FirstNav>li{padding: 0 15px}
    .Com_InNavBox,.SecondNav{width: 130px;}
  }
  @media screen and (min-width:1366px){
    .FirstNav{width: 1000px;}
    .FirstNav>li{padding: 0 20px}
    .Com_InNavBox,.SecondNav{width: 140px;}
  }
  @media screen and (min-width:1600px){
    .FirstNav{width: 1200px;}
    .FirstNav>li{padding: 0 25px}
    .Com_InNavBox,.SecondNav{width: 150px;}
  }
  /*箭头过渡*/
  @-moz-keyframes rotation{ 0%{-moz-transform: rotate(0deg);} 50%{-moz-transform: rotate(90deg);} 100%{-moz-transform: rotate(180deg);} }
  @-webkit-keyframes rotation{ 0%{-webkit-transform: rotate(0deg)} 50%{-webkit-transform: rotate(90deg) } 100%{-webkit-transform: rotate(180deg) } }
  @-o-keyframes rotation{ 0%{-o-transform: rotate(0deg)} 50%{-o-transform: rotate(90deg) } 100%{-o-transform: rotate(180deg) } }
  /*Icon*/
  .el-icon-arrow-down{font-size: 12px;color: #666;}
  .arrow-down-trans{animation:rotation 0.3s linear 1 forwards}
</style>
