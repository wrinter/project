<template>
  <div id="content">
    <v-header></v-header>
    <router-view></router-view>
  </div>
</template>
<script>
  import {UrlSearch} from '../common/js/request'
  import header from './common/header'
  export default{
    data () {
      return {
      }
    },
    created () {
      this.WinOnload()
    },
    methods: {
      WinOnload: function () {
        let nofresh = UrlSearch('nofresh')
        if (!nofresh === 'true') {
          let ThisPage = localStorage.getItem('ThisWebPage')
          this.$router.push(ThisPage)
        }
      }
    },
    components: {
      'v-header': header
    }
  }
</script>

<style>

</style>
