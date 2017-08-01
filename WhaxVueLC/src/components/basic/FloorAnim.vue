<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide">slider1</div>
      <div class="swiper-slide">slider2</div>
      <div class="swiper-slide">slider3</div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
  import 'swiper/dist/css/swiper.min.css'
  import Swiper from 'swiper/dist/js/swiper.min'
  export default {
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
          pagination: '.swiper-pagination',
          paginationClickable: true,
          autoplay: 3000,
          speed: 1500,
          loop: true
        })
        console.log(swiper)
      }
    }
  }
</script>

<style>
  .swiper-container{float: left;width: 100%;height: 300px;}
  .swiper-wrapper{min-width: 300px;position: relative;height: 100%;}
  .swiper-slide{width: 100%;height:100% }
</style>
