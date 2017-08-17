<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="str in listData.listImg"
           :style="{ backgroundImage: 'url(' + str.url + ')' }"></div>
    </div>
    <div class="swiper-pagination" id="swiper-pagination"></div>
  </div>
</template>

<script>
  import '../../../static/swiper/swiper.min.css'
  import Swiper from 'swiper';
  export default {
    props: ['listData'],
    data () {
      return {}
    },
    created () {
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        let swiper = new Swiper('.swiper-container', {
          height: window.innerHeight,
          pagination: '#swiper-pagination',
          paginationClickable: true,
          autoplay: 3000,
          speed: 1500,
          loop: true
        })
      }
    }
  }
</script>

<style>
  .swiper-container{float: left;width: 100%;height: 600px;}
  .swiper-wrapper{min-width: 1100px;position: relative;height: 100%;}
  .swiper-slide{width: 100%;height:100% }
</style>
