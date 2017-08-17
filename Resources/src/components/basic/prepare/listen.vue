<template>
  <div class="Listen_Main">
    <div class="Listen_BtnBox">
      <p @click="ShowTransEvt">
        <span>{{ThisTxt}}</span>
        <img :src="ThisArrowIco" alt="">
      </p>
    </div>
    <div class="Listen_Con"  v-if="ShowTrans" v-html="ThisContent"></div>
    <div class="Listen_No" v-if="!ShowTrans"><img :src="ListenIco" alt=""></div>
    <v-player :Tosrc="ThisSrc"></v-player>
  </div>
</template>

<script>
  import Player from '../../common/Player'
  export default{
    props: {
      ListenId: String
    },
    components: {
      'v-player': Player
    },
    watch: {
      ListenId : 'GetListen'
    },
    data () {
      return {
        ThisListenData: '',
        ThisImgCata: '/static/teacher/images/prepare/',
        ThisArrowIco: '',
        ListenIco: '',
        ShowTrans: false,
        ThisTxt: '查看文本',
        ThisSrc: '/static/slice.mp3',
        ThisContent: ''
      }
    },
    mounted () {
      this.GetListen()
    },
    methods: {
      GetListen () {
        let Subdata = {}
        Subdata.resId = this.ListenId
        this.$http.post('/web/teacher/prepare/voice/en/article?' + Math.random(), Subdata, {'emulateJSON': true}).then((response) => {
          if (response.body.retCode === '0000') {
            this.ThisListenData = response.body.retData
            this.ResetData()
            this.UpDataSrc()
            this.GetContent()
          }
        })
      },
      UpDataSrc () {
        if (this.isEmptyObject(this.ThisListenData.voicePath)) {
          this.ThisSrc = this.ThisListenData.voicePath
//          this.ThisSrc = '/static/let_it_go.mp3'
        } else {
          this.ThisSrc = '/static/slice.mp3'
        }
      },
      GetContent () {
        this.ThisContent = this.ThisListenData.content
      },
      ResetData () {
        this.ShowTrans = false
        this.InitImg()
      },
      InitImg () {
        this.ThisArrowIco = this.ThisImgCata + 'lico0.png'
        this.ListenIco = this.ThisImgCata + 'p_previoceico.png'
      },
      ShowTransEvt () {
        this.ShowTrans = !this.ShowTrans
        if (this.ShowTrans) {
          this.ThisTxt = '收起文本'
          this.ThisArrowIco = this.ThisImgCata + 'lico1.png'
        } else {
          this.ThisTxt = '查看文本'
          this.ThisArrowIco = this.ThisImgCata + 'lico0.png'
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
  .Listen_Main{float: left;width: 100%;box-sizing: border-box;min-height: 400px;}
  .Listen_BtnBox{float: left;width: 100%;height: 25px; line-height: 25px;  margin-top: 35px;  box-sizing: border-box;  padding-left: 20px;  font-size: 16px;}
  .Listen_BtnBox>p{float: left;  cursor: pointer;  height: 25px;}
  .Listen_BtnBox>p>span{margin-right: 10px; line-height: 25px;  color: #49b9df; font-size: 16px;}
  .Listen_BtnBox>p>img{line-height: 25px;}
  .Listen_Con,.Listen_No{float: left;width: 100%;  height: 450px;  color: #333;  overflow-x: hidden;  line-height: 30px;  overflow-y: auto;  position: relative;  box-sizing: border-box;  padding: 30px 40px 0 20px;}
  .Listen_No{text-align: center;line-height: 400px;}
</style>
