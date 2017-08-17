<template>
  <div class="minw ffyh">
  <div class="i_Main" >
    <!--banner区-->
    <div class="i_Banner i_Main_son" id="i_Banner">
      <!-- Swiper -->
      <div class="swiper-container">
        <div class="swiper-wrapper" id="in_swiper">
          <div class="swiper-slide" v-for="temp in adList" :style="{ backgroundImage: 'url(' + temp.imgUrl + ')' }">
          <a :href="temp.adUrl" target="_blank"></a>
          </div>
        </div>
        <div class="swiper-pagination"></div>
        <div class="swiper-button-next swiper-button-white"></div>
        <div class="swiper-button-prev swiper-button-white"></div>
      </div>
    </div>
    <!-- 课件区 -->
    <div class="i_Courseware i_Main_son mt40">
      <div class="imain">
        <div class="i_Main_son_title i_Main_son_title_1">
          <h3>课件</h3>
          <p class="fs18 lh40">您讲课比赛的坚实后援</p>
          <a id="sort9" class="ml20 fr" href="../prepare/prepare_courseware.html">更多精彩...</a>
        </div>
        <div class="i_Main_son_content mt30">
          <div class="i_Courseware_ul">
            <div class="i_Courseware_li" v-for="temp in wareList">
              <router-link v-bind:to="'/'">
                <img :src="temp.thumbnail" :alt="temp.title">
                <h4>{{temp.title}}</h4>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="clear"></div>
    </div>
    <!-- 作业区 -->
    <div class="i_Homework i_Main_son mt40">
      <div class="imain">
        <div class="i_Main_son_title i_Main_son_title_2">
          <h3>作业</h3>
          <p class="fs18 lh40">1500万师生检验的好作业</p>
        </div>
        <div class="i_Main_son_content mt30">
          <div class="i_Homework_ul">
            <div class="i_Homework_li">
              <a id="sort21"  href="javascript:;">
                <div class="i_Homework_img"><img src="/static/teacher/images/index/i_Homework_01.jpg" alt="布置作业"></div>
                <h4>布置作业</h4>
                <p>好作业，一键布置！</p>
              </a>
            </div>
            <div class="i_Homework_li">
              <router-link id="sort23" v-bind:to="'/content/teacher/homework/correctworklist'">
                <div class="i_Homework_img"><img src="/static/teacher/images/index/i_Homework_02.jpg" alt="批改作业"></div>
                <h4>批改作业</h4>
                <p>智能批改，省时省力！</p>
              </router-link>
            </div>
            <div class="i_Homework_li">
              <a id="sort25" href="javascript:;">
                <div class="i_Homework_img"><img src="/static/teacher/images/index/i_Homework_03.jpg" alt="作业报告"></div>
                <h4>作业报告</h4>
                <p>多维度数据分析，全方位掌握学情！</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="clear"></div>
    </div>
    <!-- 视频区 -->
    <div class="i_Video i_Main_son mt40">
      <div class="imain">
        <div class="i_Main_son_title i_Main_son_title_3">
          <h3>视频</h3>
          <p class="fs18 lh40">国家级研究课题，助力翻转课堂</p>
          <router-link id="sort5" v-bind:to="'/content/teacher/prepare/video'" class="ml20 fr">更多精彩...</router-link>
        </div>
        <div class="i_Main_son_content mt30">
          <div class="i_Video_max" v-if="reVideo">
            <router-link v-bind:to="'/'">
              <div class="i_Video_max_wrap">
                <img src="/static/teacher/images/index/i_Video_01.png">
              </div>
              <img src="reVideo.thumbnail">
              <h4>{{reVideo.title}}</h4>
            </router-link>
          </div>
          <div class="i_Video_min">
            <ul>
              <li v-for="temp in videoList">
                <router-link v-bind:to="'/'">
                  <div class="i_Video_min_wrap">
                    <img :src="temp.src">
                  </div>
                  <img :src="temp.thumbnail">
                  <h4>{{temp.title}}</h4>
               </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="clear"></div>
    </div>
    <!-- 动态栏目 -->
    <div id="footerClumon" class="i_Index i_Main_son mt40">
      <div class="imain">
        <div class="i_Main_son_title i_Main_son_title_4">
          <h3>{{title}}</h3>
          <p class="fs18 lh40">{{cue}}</p>
          <router-link v-bind:to="hlink" id="sort5" class="ml20 fr">更多精彩...</router-link>
        </div>
        <div class="i_Main_son_content mt30">
          <ul class="i_Index_ul">
            <li v-for="temp in list">
              <div :style="'background:'+temp.url">
                <img src="/static/teacher/images/index/wordimg.png" alt="" v-if="temp.paper">
                <router-link v-bind:to="temp.linkName+temp.id" :title="temp.title">
                  {{temp.title}}
                </router-link>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="clear"></div>
    </div>
  </div>
  <!-- 页尾 -->
  <v-bottom></v-bottom>
  </div>
</template>

<script>
  import {getAd, getSiteIndex} from '../../../service/teacher/index/index.js';
  import '../../../../static/swiper/swiper.min.css'
  import Swiper from 'swiper';
  import bottom from '../../common/bottom'
  import $ from 'jquery';
  export default{
    data() {
      return {
        adList:[],
        videoList:[],
        videoreList:[],
        reVideo:'',
        wareList:[],
        title:'',
        cue:'',
        list:[],
        hlink:''
      };
    },
    mounted() {
      this.showAd()
      this.init()
      this.lunbo()
    },
    methods: {
      showAd() {
        let that = this
        getAd(this).then(function (response) {
          let res = response.body
          if (res.retCode == '0000') {
            that.adList = res.retData
          }
        })
      },
      init() {
        let banner = document.getElementById('i_Banner')
        let width = banner.clientWidth* 37 / 192
        banner.style.height = width + 'px'
        let that = this
        getSiteIndex(this).then(function (response) {
          let res = response.body
          if (res.retCode === '0000') {
            let retData = res.retData
            for(let i=0;i<retData.length;i++) {
              let temp = {}
              temp.id = retData[i].id
              temp.title = retData[i].title
              temp.url = 'url("/static/teacher/images/index/i_Index_li.png") no-repeat center left'
              if(retData[i].content==='1') {//视频
                that.videoreList.push(retData[i])
              }else if(retData[i].content==='2') {//课件
                that.wareList.push(retData[i])
              }else if(retData[i].content==='3') {//五年真题
                that.title = '试题'
                that.cue = '全国各地中考题和模拟题任您选择'
                temp.paper = true
                temp.url = ''
                temp.linkName = ''
                  that.hlink = ''
                that.list.push(temp)
              }else if(retData[i].content==='4') {//国学与美文
                that.title = '国学美文'
                that.cue = '美文常伴左右，读写能力自然提升'
                temp.linkName = '/content/teacher/chinese/article?nofresh=true&index=2&id='
                temp.paper = false
                that.list.push(temp)
                that.hlink = '/content/teacher/chinese/essay'
              }else if(retData[i].content==='5') {//走遍英美
                that.title = '走遍英美'
                that.cue = '和英语相知，让阅读更容易'
                temp.linkName = '/content/teacher/eng/engart?index=0&share=true&id='
                temp.paper = false
                that.list.push(temp)
                that.hlink = '/content/teacher/eng/engbook'
              }else if(retData[i].content==='6') {//拓展学习
                that.title = '拓展学习'
                that.cue = '巧妙的方法和总结，轻松获取'
                temp.linkName = '/content/teacher/expand/exarticle?nofresh=true&index=0&share=true&id='
                temp.paper = false
                that.list.push(temp)
                that.hlink = '/content/teacher/expand/expand_index'
              }
            }
            if(that.videoreList.length>0) {
              that.reVideo = that.videoreList[0]
              if(that.videoreList.length>1) {
                for(let k=1;k<that.videoreList.length;k++) {
                  let video = {}
                  video.thumbnail = that.videoreList[k].thumbnail
                  video.title = that.videoreList[k].title
                  video.src = '/static/teacher/images/index/i_Video_0'+(k+1)+'.png'
                }
              }
            }
          }
        })
      },
      lunbo() {
        window.setTimeout(function() {
          let mySwiper = new Swiper('.swiper-container', {
            autoplay: 4000,//可选选项，自动滑动
            autoplayDisableOnInteraction : false,//用户操作swiper之后自动切换不会停止
            pagination : '.swiper-pagination',//分页器
            paginationClickable :true,//分页器切换事件
            prevButton:'.swiper-button-prev',//前进
            nextButton:'.swiper-button-next',//后退
            loop : true//循环
          });
        },3000)
      }
    },
    components: {
      'v-bottom': bottom
    }
  }
</script>

<style>
  /*基础样式*/
  .iHeader{position: relative;box-shadow: 0 5px 10px 0 rgba(51,51,51,.14);z-index: 11;}
  .i_Main,.i_Main_son{position: relative;width: 100%;overflow:hidden;}
  .i_Main_son{}
  .i_Main_son .imain{width: 62.5%;margin: 0 auto;}
  .i_Main_son_title{width: 100%;height: 33px;background: url("/static/teacher/images/index/i_Main_son_title_bg.png") repeat-x top left;}
  .i_Main_son_title h3{display: inline-block;height:100%;padding-right: 75px;font-size: 24px;line-height: 32px !important;background: url("/static/teacher/images/index/i_Main_son_title_bgb.png") no-repeat top right;color: #65b113;}
  .i_Main_son_title p{display: inline-block;height:100%;margin-left: 9px;line-height: 32px !important;color: #999;}
  .i_Main_son_title a{display: inline-block;height:100%;width: 98px;margin-top: 2px;line-height: 34px;font-size: 14px;text-align: center;border-radius: 8px;background: #65b113;color: white;}
  .i_Main_son_title a:hover{background: #5da313;}
  .i_Main_son_content{width: 100%}
  .i_Banner .swiper-slide a{display: block;width: 100%;height: 100%;}
  .i_Video{}
  .i_Video_max{float: left;width: 38%;}
  .i_Video_min{float: right;width: 62%;}
  .i_Video_max a img,.i_Video_min ul li a img{width: 100%;transition: all 0.6s;}
  .i_Video_max a{position: relative;display: block;width: 100%;height: 100%;border-radius: 10px;overflow: hidden;border: 1px solid #dfdfdf;transform:rotate(0deg);}
  .i_Video_max a:hover div.i_Video_max_wrap{background-image: url("/static/teacher/images/index/i_Video_01bg.png");background-size: 100%;}
  .i_Video_max_wrap,.i_Video_min_wrap{position: absolute;top: 0;left: 0;width: 100%;height: 100%;bottom: 0;right: 0;z-index: 2;margin: auto; }
  .i_Video_max_wrap img,.i_Video_min_wrap img{width: 100%;}
  .i_Video_min_wrap{visibility: hidden;}
  .i_Video_min ul{width: 100%;}
  .i_Video_min li{float: left;width: 50%;}
  .i_Video_min li a{position: relative;float: right;display: block;width: 90%;height: 100%;margin-bottom: 5%;border-radius: 10px;overflow: hidden;border: 1px solid #dfdfdf;transform:rotate(0deg);}
  .i_Video_min li a:hover div.i_Video_min_wrap{visibility: visible;}
  .i_Video_min li a h4,.i_Video_max a h4{position: absolute;bottom: 0;left: 0;z-index: 2;display: block;width: 100%;overflow: hidden;text-align: center;white-space: nowrap;text-overflow: ellipsis;background: rgba(0,0,0,0.3);background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,.5) 100%);color: white;}
  .i_Video_min li a:hover > img,.i_Video_max a:hover > img{transform: scale(1.2);}
  .i_Video_min li a:hover h4,.i_Video_max a:hover h4{color: #65b113;}
  .i_Courseware{}
  .i_Courseware_ul{width: 104%;overflow: hidden;}
  .i_Courseware_li{float: left; width: 21%;padding-right: 4%; height:100%;}
  .i_Courseware_li a{position: relative;display: block;overflow: hidden;border-radius: 8px; border: 1px solid #dfdfdf;transform:rotate(0deg);}
  .i_Courseware_li a img{width: 100%;transition: all 0.6s;}
  .i_Courseware_li a h4{position: absolute;left: 0;bottom: 0;width: 100%;overflow: hidden;text-align: center;white-space: nowrap;text-overflow: ellipsis;background: rgba(0,0,0,0.3);background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.7) 100%);color: #fff;}
  .i_Courseware_li a:hover img{transform: scale(1.2);}
  .i_Courseware_li a:hover h4{color: #68c207;}
  .i_Homework{}
  .i_Homework_ul{width: 103.3%;}
  .i_Homework_li{float: left;width: 29%;padding-right: 4.3%}
  .i_Homework_li a{display: block;overflow: hidden;border-radius: 8px;border: 1px solid #dfdfdf;transform:rotate(0deg);}
  .i_Homework_li a .i_Homework_img{width: 100%;overflow: hidden;}
  .i_Homework_li a .i_Homework_img img{width: 100%;transition: all 0.6s;}
  .i_Homework_li a h4{margin-top: 10px;text-align: center;line-height: 1.5;color: #333;}
  .i_Homework_li a p{padding-bottom: 15px;text-align: center;line-height: 1.5;overflow: hidden;white-space:nowrap;text-overflow: ellipsis;color: #666;}
  .i_Homework_li a:hover h4{color: #64b109}
  .i_Homework_li a:hover .i_Homework_img img{transform: scale(1.2);}
  .i_Index{margin-top: 20px;}
  .i_Index_ul{width: 100%;}
  .i_Index_ul li{float: left;width: 33.3%;}
  .i_Index_ul li div{padding-left: 22px;margin-left: 5px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
  .i_Index_ul li div.i_OtherDiv{padding-left: 0;background: none;}
  .i_Index_ul li div.i_OtherDiv img{margin-right: 6px;}
  .i_Index_ul li div a:hover{color: #65b113;cursor: pointer;}
  .Footer{width: 100%;}
  .Footer_main{height: 100px;background-color: #65b113;}
  .Footer_main p{line-height: 100px;text-align: center;color: #fff;}
  /*右侧快捷工具*/
  .short_Key{position: absolute;top: 50%;right: 10px;z-index: 10000;width: 60px;}
  .to_Top,.app_Code{position: relative;display: block;width: 100%;height: 60px;font-size:18px;line-height: 1.2;text-align: center;border: 1px solid #ccc;background: #fff url("/static/teacher/images/index/i_Index_qr_btn.png") no-repeat center center;color: #65b113;}
  .to_Top{transition: percentage 0s linear;background: #fff url("/static/teacher/images/index/i_Index_sprites.png") no-repeat 31px 20px;}
  .to_Top:hover{background: #65b113 url("/static/teacher/images/index/i_Index_sprites.png") no-repeat 31px -80px;}
  .to_Top span{display: block;margin-top: 55px;}
  .app_Code_QR{display: none;position: absolute;right: 75px;bottom: -1px;width: 166px;height: 166px;padding: 14px 14px 2px 14px;border-radius: 8px;border: 1px solid #ccc;background: #fff;}
  .app_Code_QR p{margin-top: 8px;font-size:14px;line-height: 1;text-align: center;color: #333;}
  .app_Code_QR img{width: 80%;}
  .app_Code_QR i{position: absolute;bottom: 20px;right: -28px;z-index: 2;display: block;width: 0;height: 0;border-bottom: 9px solid transparent;border-top: 9px solid transparent;border-right: 14px solid transparent;border-left: 14px solid #ccc;}
  .app_Code_QR i:after{content:"";position: absolute;top: -9px;right: -12px;z-index: 3;width: 0;height: 0;border-bottom: 9px solid transparent;border-top: 9px solid transparent;border-right: 14px solid transparent;border-left: 14px solid #fff;}

  /*屏幕小于1366*/
  @media screen and (max-width:1366px){
    .i_Main_son .imain{width: 900px;}
    .i_Video_min li a{margin-bottom: 5.2%;}
    .i_Video_max a h4{font-size: 16px;line-height: 34px;padding-top: 8px;}
    .i_Video_min li a h4{font-size: 12px;line-height: 20px;padding-top: 8px;}
    .i_Courseware_li a h4{line-height: 24px;font-size: 12px;padding-top: 8px;}
    .i_Homework_li a h4{margin-top: 6px;font-size: 18px;}
    .i_Homework_li a p{padding: 6px 0 11px 0;font-size: 12px;}
    .i_Index_ul li > div a{font-size: 12px;line-height: 26px;}
    .i_Main_son_content.mt30{margin-top: 20px!important;}/*为上一行,和common.css212/336行提供兼容*/
    .Footer_main h1{margin-top: 16px;font-size: 20px;}
    .Footer_main p{margin-top: 7px;font-size: 12px;}
  }
  /*屏幕大于1366小于1599*/
  @media screen and (min-width:1366px){
    .i_Main_son .imain{width: 1000px;}
    .i_Video_min li a{margin-bottom: 6%;}
    .i_Video_max a h4{font-size: 20px;line-height: 46px;padding-top: 10px;}
    .i_Video_min li a h4{font-size: 12px;line-height: 26px;padding-top: 10px;}
    .i_Courseware_li a h4{line-height: 32px;font-size: 14px;padding-top: 10px;}
    .i_Homework_li a h4{margin-top: 8px;font-size: 20px;}
    .i_Homework_li a p{padding: 8px 0 13px 0;font-size: 14px;}
    .i_Index_ul li > div a{font-size: 14px;line-height: 36px;}
    .Footer_main h1{margin-top: 20px;font-size: 24px;}
    .Footer_main p{margin-top: 12px;font-size: 14px;}
  }
  /*屏幕大于1600*/
  @media screen and (min-width:1600px){
    .i_Main_son .imain{width: 1200px;}
    .i_Video_min li a{margin-bottom: 6%;}
    .i_Video_max a h4{font-size: 24px;line-height: 54px;padding-top: 12px;}
    .i_Video_min li a h4{font-size: 14px;line-height: 34px;padding-top: 12px;}
    .i_Courseware_li a h4{line-height: 40px;font-size: 16px;padding-top: 12px;}
    .i_Homework_li a h4{margin-top: 10px;font-size: 22px;}
    .i_Homework_li a p{padding: 10px 0 15px 0;font-size: 16px;}
    .i_Index_ul li > div a{font-size: 16px;line-height: 46px;}
    .Footer_main h1{margin-top: 26px;font-size: 30px;}
    .Footer_main p{margin-top: 16px;font-size: 14px;}
  }
  /*swiper*/
  .swiper-container {width: 100%;height: 100%;}
  .swiper-slide {background-position: center;background-size: cover;}
  .swiper-pagination-bullet {width: 12px;height: 12px;}
  .swiper-pagination-bullet-active{background: #8cc252;}
  .swiper-container-horizontal>.swiper-pagination .swiper-pagination-bullet{margin: 0 8px;}
  .swiper-button-white{width: 40px;height: 70px;margin-top: -35px;border-radius: 5px;background-color: rgba(0,0,0,0.3);transition: all 0.5s ease;}
  .swiper-button-white:hover{background-color: rgba(0,0,0,0.5);}
  .swiper-button-next.swiper-button-white{background-image: url("/static/teacher/images/index/i_swiper_button02.png");}
  .swiper-button-prev.swiper-button-white{background-image: url("/static/teacher/images/index/i_swiper_button01.png");}
  /*底部*/
  .Com_Footer{float: left;width: 100%;height: 120px;background: #1c1c1c;font-family: 'microsoft yahei';}
  .FooterCon:before,.FooterCon:after{clear: both;}
  .FooterCon{width: 1000px;height: 120px;margin: auto;text-align: center;}
  .FooterLeft{float: left;width: 600px;height: 120px;box-sizing: border-box; }
  .FooterNav{float: left;width: 100%;margin-left: -20px;margin-top: 38px;}
  .FooterNav>li{float: left;border-right:1px solid #404040;text-align: center; width: 95px;box-sizing: border-box; height: 15px;line-height: 15px;font-size: 14px;color: #959595;}
  .FooterNav>li:last-child{border-right: 0;}
  .FooterNav>li a{width: 95px;box-sizing: border-box; height: 15px;line-height: 15px;font-size: 14px;color: #959595;cursor: pointer}
  .FooterNav>li a:hover{color:#00ce9e; }
  .Copyright{float: left;margin-top: 5px; text-align: left;width: 100%;font-size: 14px;color: #636363;line-height: 22px;font-family: 'microsoft yahei';}
  .FooterRight{float: right;height: 120px;width: 330px;box-sizing: border-box; }
  .FooterIcoBox{float: left;width: 170px;box-sizing: border-box; height: 32px;margin-top: 44px;}
  .FooterIcoBox>li{float: left;margin-right: 10px;text-align: left;line-height: 32px;position: relative;}
  .FooterInfo{float: right;width: 160px;font-size: 14px;margin-top: 38px;}
  .FooterInfo>li{float: left;width: 100%;font-size: 14px;color: white;font-family: 'microsoft yahei';line-height: 22px;text-align: left;}
  .Footer_Weicode{position: absolute;width: 114px;max-width: none;top: -124px;left: -42px;display: none;}
  .Weibofocus{opacity: 0;filter: alpha(opacity=0); width: 32px!important;height: 32px!important;position: absolute;}
  .Weibofocus>iframe{width: 32px!important;}

</style>
