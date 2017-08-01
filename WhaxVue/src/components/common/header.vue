<template>
  <div>
    <div class="thisheader" id="headerbar">
      <ul class="FirstNav">
        <li><img src="../../../static/common/images/weblogo.png" alt=""></li>
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
            <transition name="el-zoom-in-top">
              <ul class="SecondNav transition-box" v-show="index==IsShow" >
                <li v-for="(second, index) in route.child">
                  <router-link v-bind:to="second.path+'?id='+second.menuId">
                    {{second.name}}
                  </router-link>
                </li>
              </ul>
            </transition>
          </template>
        </li>
        <li @click="Quit">退出</li>
      </ul>
    </div>
    <v-crumbs></v-crumbs>
  </div>
</template>
<script>
  import crumbs from './crumbs.vue'
  export default{
    data () {
      return {
        RouterData: {},
        IsShow: -1
      }
    },
    created () {
      this.GetNavData()
    },
    components: {
      'v-crumbs': crumbs
    },
    methods: {
      GetNavData  () {
        this.$http.get('static/data.json').then((response) => {
          let ReceiveData = response.body.retData.menu
          this.RouterData = ReceiveData
        })
      },
      ShowMenu  (index) {
        this.IsShow = index
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
  .thisheader{width: 100%;height: 60px;border-bottom: 2px solid #65B113;background: white; }
  .FirstNav{margin:0 auto;clear: both;height: 100%;}
  .FirstNav>li:first-child{float: left;width: 200px;height: 100%;line-height: 60px;}
  .FirstNav>li,.FirstNav>li>a{position: relative; float: left;cursor: pointer; width: 150px;line-height: 60px;color: #333;font-size: 16px;text-align: center;}
  .SecondNav{width: 150px;position: absolute;z-index: 9; background: white;box-sizing: border-box;top: 61px;border: 1px solid #65b113;overflow: hidden;border-radius: 0 0 10px 10px;}
  .SecondNav>li,.SecondNav>li>a{float: left;width: 100%;color: #333; height: 50px;box-sizing: border-box; line-height: 50px; text-align: center;}
  .SecondNav>li>a:hover{background: #f5f5f5;color: #65b113;}
  .el-icon-caret-top{color: #65b113;position: absolute;right: 0;left: 0;bottom: 0;margin: auto;height: 12px;font-size: 20px;}
  .el-icon-arrow-down{font-size: 12px;color: #666;}
  .arrow-down-trans{animation:rotation 0.3s linear 1 forwards}
  @-moz-keyframes rotation{ 0%{-moz-transform: rotate(0deg);} 50%{-moz-transform: rotate(90deg);} 100%{-moz-transform: rotate(180deg);} }
  @-webkit-keyframes rotation{ 0%{-webkit-transform: rotate(0deg)} 50%{-webkit-transform: rotate(90deg) } 100%{-webkit-transform: rotate(180deg) } }
  @-o-keyframes rotation{ 0%{-o-transform: rotate(0deg)} 50%{-o-transform: rotate(90deg) } 100%{-o-transform: rotate(180deg) } }
  @media screen and (max-width:1365px){
    .FirstNav{width: 900px;}
  }
  @media screen and (min-width:1366px){
    .FirstNav{width: 1000px;}
  }
  @media screen and (min-width:1600px){
    .FirstNav{width: 1200px;}
  }
</style>
