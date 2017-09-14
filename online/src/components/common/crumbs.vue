<template>
  <div v-if="showcrumbs" class="Crumbs">
    <ul class="CrumbList">
      <li  v-for="(route, index) in crumbsData" >
        <template v-if="isEmptyObject(route.path)">
          <router-link v-bind:to="route.path"> {{route.name}}</router-link>
          <i class="el-icon-arrow-right"></i>
        </template>
        <template v-if="!isEmptyObject(route.path)">
          {{route.name}}
        </template>
      </li>
    </ul>
  </div>
</template>
<script>
  export default{
    data () {
      return {
        showcrumbs: '',
        crumbsData: '',
        menuid: ''
      }
    },
    created () {
      this.init()
    },
    watch: {
      '$route': 'init'
    },
    methods: {
      init () {
        console.log()
        let Data = this.$route.meta
        this.crumbsData = Data.crumbs
        this.showcrumbs = Data.showcrumbs
        this.menuid = this.$route.query.id
      },
      isEmptyObject (obj) {
        if (obj) {
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
  .Crumbs{float: left;width: 100%;overflow: hidden;box-sizing: border-box; background: white;height: 50px;border-bottom: 1px solid #ccc;}
  .CrumbList{overflow: hidden;margin: 0 auto;height: 100%;}
  .CrumbList>li{float: left;}
  .CrumbList>li>a,.CrumbList>li>i,.CrumbList>li{float: left;line-height: 50px;color: #333;}
  .CrumbList>li>i{font-size: 12px;color: #333;margin: 0 5px;}
  .CrumbList>li:last-child{color: #65b113;}
  @media screen and (max-width:1365px){
    .CrumbList{width: 900px;}
    .CrumbList>li>a,.CrumbList>li{font-size: 14px;}
  }
  @media screen and (min-width:1366px){
    .CrumbList{width: 1000px;}
    .CrumbList>li>a,.CrumbList>li{font-size: 16px;}
  }
  @media screen and (min-width:1600px){
    .CrumbList{width: 1200px;}
    .CrumbList>li>a,.CrumbList>li{font-size: 18px;}
  }
</style>
