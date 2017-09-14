<template>
    <div class="swiper-container">
        <div class="swiper-wrapper">
            <!--<div class="swiper-slide" v-for="str in listImg" :style="{ backgroundImage: url(' + str.url + ')' }"></div>-->
            <div class="swiper-slide">
                <img  src="static/teacher/images/Exemplar/m_ad1ic1.png"/>
            </div>
            <div class="swiper-slide">
                <img  src="static/teacher/images/Exemplar/m_ad1ic2.png"/>
            </div>
            <div class="swiper-slide">
                <img  src="static/teacher/images/Exemplar/m_ad1ic3.png"/>
            </div>
            <div class="swiper-slide">
                <img  src="static/teacher/images/Exemplar/m_ad1ic4.png"/>
            </div>
            <div class="swiper-slide">
                <img  src="static/teacher/images/Exemplar/m_ad1ic5.png"/>
            </div>
        </div>
        <div class="swiper-pagination" id="swiper-pagination"></div>
    </div>
</template>
<script type="text/ecmascript-6">
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
export default {
    props: ['listImg'],
    mounted () {
        console.log('mounted', this)
        let swiper = new Swiper('.swiper-container', {
            pagination: '#swiper-pagination', // 分页
            paginationClickable: true,
            loop: true,
            speed: 600,
            autoplay: 1000
        })
        console.log(swiper)
    }
}
</script>
<style>
    .swiper-container{float: left;width: 100%;height: 434px;}
    .swiper-wrapper{min-width: 434px;position: relative;height: 100%;}
    .swiper-slide{width: 100%;height:100% }
    .swiper-slide img{
        width: 100%;height:90%;margin-top: 15px;
    }
</style>
