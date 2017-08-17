<template>
  <div id="content">
    <v-header v-if="NotApp"></v-header>
    <router-view></router-view>
  </div>
</template>
<script>
  import {UrlSearch} from '../common/js/request'
  import {SupportPhone, SupportAgent} from '../common/js/ComPhone.js'
  import header from './common/header'
  export default{
    data () {
      return {
        NotApp: true
      }
    },
    mounted () {
      this.SupportRes()
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
      },
      SupportRes () {
        SupportPhone()
        if (SupportAgent()) {
          this.NotApp = false
        } else {
          this.NotApp = true
        }
        this.WinSize()
      },
      WinSize () {
        let that = this
        window.onresize = function () {
          that.SupportRes()
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
