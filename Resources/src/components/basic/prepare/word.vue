<template>
  <div class="Word_Main">
    <div class="Word_Box">
      <div class="swiper-container">
        <div class="swiper-wrapper" id="ResetSwiper">
          <div class="swiper-slide swiper-no-swiping" v-for="(Single,SingleIndex) in ThisWordData">
            <div class="Word_Single">
              <p class="Word_Worder"><span>{{Single.word}}</span><span>/{{Single.phonogram}}/</span></p>
              <ul class="Word_Mean">
                <li v-for="(Mean,MeIndex) in Single.meaningList">{{Mean.part+Mean.meaning}}</li>
              </ul>
              <div class="Word_Sent"><img src="/static/teacher/images/prepare/seico.png" alt=""><span>sentences</span></div>
              <ul class="Word_Example">
                <li v-for="(ExData,ExIndex) in Single.exampleList" v-if="isEmptyObject(ExData.example)">
                  <span>{{ExIndex + 1}}</span>
                  <div class="Word_ExampleCon">
                    <p>{{ExData.example}}</p>
                    <p>{{ExData.trans}}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="Word_Player">
      <audio :src="ThisAudio" id="Word_Player"></audio>
      <div class="Word_ModelBox"   @mouseenter="ShowMenu()" @mouseleave="ShowMenu()" >
        <p class="Word_ModelTxt">
          <span>{{ThisModelTxt}}</span>
          <img :src="ThisArrowIco" alt="">
        </p>
        <transition name="el-fade-in">
          <div class="Word_ModelOption" v-if="ShowModel">
            <p  @click="ModelEvt(false)"><img :src="ThisModelIco0" alt=""><span>单独模式</span></p>
            <p  @click="ModelEvt(true)"><img :src="ThisModelIco1" alt=""><span>连读模式</span></p>
            <img src="/static/teacher/images/prepare/dico.png" alt="">
          </div>
        </transition>
      </div>
      <div class="Wrod_Contro">
        <img :src="ThisLeft" alt="" @click="PlayUpEvt">
        <img :src="ThisPlay" alt="" @click="PlayEvt">
        <img :src="ThisRight" alt="" @click="PlayNext">
      </div>
    </div>
  </div>
</template>

<script>
  import 'swiper/dist/css/swiper.min.css'
  import Swiper from 'swiper'
  export default{
    // 用于接收来自父组件的数据
    props: {
      WordId: String
    },
    data () {
      return {
        ThisWordData: '',
        ThisSwiper: '',
        ThisAudio: '/static/slice.mp3',
        ThisContinuous: false,
        ShowModel: false,
        ThisModelTxt: '单读模式',
        ThisImgCata:'/static/teacher/images/prepare/',
        ThisArrowIco: '',
        ThisModelIco0:'',
        ThisModelIco1:'',
        ThisLeft:'',
        ThisPlay:'',
        ThisRight:'',
        ThisPlaying: false,
        ThisTime: ''
      }
    },
    watch: {
      WordId : 'GetWordData'
    },
    mounted () {
      this.GetWordData()
    },
    methods: {
      ResetTotalData () {
        this.ThisContinuous = false
        this.ShowModel = false
        this.ThisModelTxt = '单读模式'
        this.ThisPlaying = false
        clearTimeout(this.ThisTime)
        this.InitImgSrc()
        let Audio = document.getElementById('Word_Player')
        Audio.pause()
      },
      InitImgSrc () {
        this.ThisArrowIco = this.ThisImgCata + 'mico1.png'
        this.ThisModelIco0 = this.ThisImgCata + 'ms1.png'
        this.ThisModelIco1 = this.ThisImgCata + 'ms0.png'
        this.ThisLeft = this.ThisImgCata + 'btn0n.png'
        this.ThisPlay = this.ThisImgCata + 'new_play0.png'
        this.ThisRight = this.ThisImgCata + 'btn1n.png'
      },
      ShowMenu () {
        this.ShowModel = !this.ShowModel
        if (this.ShowModel) {
          this.ThisArrowIco = this.ThisImgCata + 'mico0.png'
        } else {
          this.ThisArrowIco = this.ThisImgCata + 'mico1.png'
        }
      },
      GetWordData () {
        let Subdata = {}
        Subdata.resIdList = this.WordId
        this.$http.post('/web/teacher/prepare/voice/word/detail?' + Math.random(), Subdata, {'emulateJSON': true}).then((response) => {
          if (response.body.retCode === '0000') {
            this.ThisWordData = response.body.retData
            this.ResetTotalData()
          }
        }).then(function () {
          this.InitSwiper()
          this.JudgUpNext(0)
          this.UpDataSrc(0)
        })
      },
      ModelEvt (model) {
        this.ThisContinuous = model
        if (model) {
          this.ThisModelIco0 = this.ThisImgCata + 'ms0.png'
          this.ThisModelIco1 = this.ThisImgCata + 'ms1.png'
          this.ThisModelTxt = '连读模式'
        } else {
          this.ThisModelIco0 = this.ThisImgCata + 'ms1.png'
          this.ThisModelIco1 = this.ThisImgCata + 'ms0.png'
          this.ThisModelTxt = '单读模式'
        }
      },
      InitSwiper () {
        this.ThisSwiper = new Swiper('.swiper-container', {})
        // 切换章节需要重置
        document.getElementById('ResetSwiper').style = ''
      },
      PlayEvt () {
        this.UpDataSrc(0)
        let Audio = document.getElementById('Word_Player')
        this.ThisPlaying = !this.ThisPlaying
        if (this.ThisPlaying) {
          Audio.play()
          this.ThisPlay = this.ThisImgCata + 'new_play1.png'
        } else {
          Audio.pause()
          clearTimeout(this.ThisTime)
          this.ThisPlay = this.ThisImgCata + 'new_play0.png'
        }
        this.ResetJudg()
        this.PalyerEndEvt()
      },
      ResetJudg () {
        if (this.ThisPlaying) {
          this.ThisLeft = this.ThisImgCata + 'btn0n.png'
          this.ThisRight = this.ThisImgCata + 'btn1n.png'
        } else {
          this.JudgUpNext(this.ThisSwiper.activeIndex)
        }
      },
      PlayUpEvt () {
        if (!this.ThisPlaying) {
          this.ThisSwiper.slidePrev()
          this.JudgUpNext(this.ThisSwiper.activeIndex)
          this.UpDataSrc(0)
        }
      },
      PlayNext () {
        if (!this.ThisPlaying) {
          this.ThisSwiper.slideNext()
          this.JudgUpNext(this.ThisSwiper.activeIndex)
          this.UpDataSrc(0)
        }
      },
      PalyerEndEvt () {
        let Audio = document.getElementById('Word_Player')
        let that = this
        Audio.onended = function () {
          if (that.ThisContinuous) {
            that.ContiModel()
          } else {
            that.SingleModel()
          }
        }
      },
      // 单读模式
      SingleModel () {
        let Audio = document.getElementById('Word_Player')
        this.ThisPlaying = !this.ThisPlaying
        if (this.ThisPlaying) {
          Audio.play()
          this.ThisPlay = this.ThisImgCata + 'new_play1.png'
        } else {
          Audio.pause()
          this.ThisPlay = this.ThisImgCata + 'new_play0.png'
        }
        this.ResetJudg()
      },
      // 连续模式
      ContiModel () {
        let Audio = document.getElementById('Word_Player')
        let that = this
        if (this.ThisTime) { clearTimeout(this.ThisTime) }
        if (this.ThisSwiper.activeIndex < this.ThisWordData.length - 1) {
          this.UpDataSrc(1)
          this.ThisTime = setTimeout(function () {
            that.ThisSwiper.slideNext()
            Audio.play()
          }, 3000)
        } else {
          this.UpDataSrc(0)
          this.ThisPlaying = !this.ThisPlaying
          Audio.pause()
          this.ThisPlay = this.ThisImgCata + 'new_play0.png'
          this.ResetJudg()
        }
      },
      UpDataSrc (rule) {
        let ThisSrc = this.ThisWordData[this.ThisSwiper.activeIndex + rule].audio
        if (!this.isEmptyObject(ThisSrc)) {
          ThisSrc = '/static/slice.mp3'
        }
        this.ThisAudio = ThisSrc
      },
      JudgUpNext (index) {
        if (this.ThisWordData.length > 1) {
          if (index === 0) {
            this.ThisLeft = this.ThisImgCata + 'btn0n.png'
            this.ThisRight = this.ThisImgCata + 'btn1.png'
          } else if (index === (this.ThisWordData.length - 1)) {
            this.ThisLeft = this.ThisImgCata + 'btn0.png'
            this.ThisRight = this.ThisImgCata + 'btn1n.png'
          } else {
            this.ThisLeft = this.ThisImgCata + 'btn0.png'
            this.ThisRight = this.ThisImgCata + 'btn1.png'
          }
        }
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
  .Word_Main {float: left;width: 100%; box-sizing: border-box;  }
  .Word_Box {float: left;width: 100%; height: 420px; overflow-x: hidden; overflow-y: auto;  }
  .Word_Single{float: left;box-sizing: border-box; width: 750px;  margin-left: 50px;  padding-top: 35px;}
  .Word_Worder{float: left;width: 100%; line-height: 25px;  margin-bottom: 10px;}
  .Word_Worder span:first-child{float: left;line-height: 25px;font-size: 18px;font-weight: bold;margin-right: 10px;}
  .Word_Worder span:last-child{float: left;line-height: 25px;font-size: 16px;}
  .Word_Mean,.Word_Example,.Word_Example>li{float: left;width: 100%}
  .Word_Mean{margin-bottom: 10px;}
  .Word_Mean li{float: left;width: 100%;font-size: 14px;color: #666;line-height: 25px;}
  .Word_Sent{float: left;width: 100%;line-height: 25px;margin-bottom: 10px;color: #333;font-size: 14px;font-weight: bold;}
  .Word_Sent>img{margin-right: 5px;}
  .Word_Example li{margin-bottom: 6px;}
  .Word_Example li>span{float: left; width: 30px;line-height: 25px;height: 100%;font-size: 14px;color: #333;}
  .Word_ExampleCon{float: right;width: 720px;box-sizing: border-box;}
  .Word_ExampleCon p{float: left;width: 100%;font-size: 14px;line-height: 21px;word-wrap: break-word;-moz-hyphens: auto;  -ms-hyphens: auto;  -webkit-hyphens: auto;  hyphens: auto;  }
  .swiper-container {float: left;width: 100%;height: 100%;  }
  .swiper-wrapper {min-width: 1100px;position: relative;height: 100%;}
  .swiper-slide {width: 100%;height: 100%;overflow-x: hidden; overflow-y: auto;}
  /*单词播放器*/
  .Word_Player{font-family: 'microsoft yahei';  position: relative;  width: 800px;  padding-left: 55px;  box-sizing: border-box;  height: 60px;  clear: both;  margin: 0 auto;  background: black;  background: rgba(0,0,0,0.8);}
  .Word_ModelBox{float: left;  cursor: pointer;  z-index: 5;  position: relative;  width: 120px;  height: 100%;  text-align: center;  font-size: 14px;  text-align: center;  vertical-align: middle;  color: white;}
  .Word_ModelTxt{float: left;  width: 100%;  height: 100%;  line-height: 60px;}
  .Word_ModelTxt span{font-size: 14px;margin-right: 10px;}
  .Word_ModelTxt i{font-size: 10px;}
  .Word_ModelOption{position: absolute;  width: 120px;  height: 80px;  top: -80px;  left: 0;}
  .Word_ModelOption > p{width: 100%;  background: black;  background: rgba(0,0,0,0.8);line-height: 35px; height: 35px;  text-align: center;  box-sizing: border-box;  }
  .Word_ModelOption > p:nth-child(1) {border-bottom: 1px solid #5C5C5C;}
  .Word_ModelOption > p span{font-size: 14px; }
  .Word_ModelOption > p img{margin-right: 10px; vertical-align: baseline;}
  .Word_ModelOption >img{position: absolute;  bottom: 0;  right: 0;  left: 0; margin: auto;}
  .Wrod_Contro{position: relative;  float: left;  height: 100%;  width: 210px;  text-align: center;  margin-left: 120px;  vertical-align: baseline;  line-height: 60px;}
  .Wrod_Contro>img:nth-child(1){position: absolute;bottom: 0;top:0;left: 0;margin: auto; cursor: pointer;}
  .Wrod_Contro>img:nth-child(2){position: absolute;bottom: 0;top:0;left: 0;right: 0; margin: auto; cursor: pointer;}
  .Wrod_Contro>img:nth-child(3){position: absolute;bottom: 0;top:0;right: 0;margin: auto; cursor: pointer;}
</style>
