<template>
  <div>
    <div class="c_VideoBox">
      <div class="c_PlayBox"><div id="PlayCode"></div><div id="PlayBackCode"></div></div>
      <div class="c_Vimenu">
        <p class="c_Views">浏览量 ( {{Views}} )</p>
        <div class="c_like">
          <img v-if="IsLike" :src="LikeSrc0" alt="" @click="LikeEvent">
          <img v-if="!IsLike" :src="LikeSrc1" alt="">
          <span :class="{'fcf9':!IsLike==true}">( {{LikeNum}} )</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {UrlSearch} from '../../../common/js/request'
  export default {
    data () {
      return {
        Videodata: '',
        Views: 0,
        LikeSrc0: '../../../../static/teacher/images/chinese/likeico0.png',
        LikeSrc1: '../../../../static/teacher/images/chinese/likeico1.png',
        LikeNum: '',
        IsLike: false,
        ViresId: UrlSearch('id')
      }
    },
    created () {
      this.Init()
    },
    methods: {
      Init () {
        let Subdata = {}
        Subdata.resId = this.ViresId
        this.$http.post('/web/teacher/prepare/video/play?' + Math.random(), Subdata, {'emulateJSON': true}).then((response) => {
          let ReceiveData = response.body.retData
          this.IsLike = false
          this.LoadVideo(ReceiveData)
          this.GetLikeNum(ReceiveData)
          this.GetViews(ReceiveData)
        })
      },
      LoadVideo (data) {
        let PalyCode = data.playCode
        PalyCode = PalyCode.replace(/600/g, '100%')
        PalyCode = PalyCode.replace(/490/g, '660')
        this.Videodata = PalyCode
        let BaiDuScr = document.createElement('script')
        BaiDuScr.src = PalyCode.split('"')[1]
        let head = document.getElementById('PlayCode')
        head.appendChild(BaiDuScr)
        this.PlayBack()
      },
      PlayBack () {
        let ScrHtml = ''
        let PlayBackCode = document.getElementById('PlayBackCode')
        PlayBackCode.innerHTML = ''
        ScrHtml += ' function on_spark_player_start() {'
        ScrHtml += 'if(window.XMLHttpRequest){'
        ScrHtml += 'var xhr=new XMLHttpRequest();'
        ScrHtml += '}else{'
        ScrHtml += ' var xhr=new ActiveXObject("Microsoft.XMLHTTP");'
        ScrHtml += '}'
        ScrHtml += 'xhr.open("post","/web/common/res/query",true);'
        ScrHtml += 'xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");'
        ScrHtml += 'xhr.send("resId=' + this.ViresId + '");'
        ScrHtml += '}'
        let BackCode = document.createElement('script')
        BackCode.innerHTML = ScrHtml
        PlayBackCode.appendChild(BackCode)
      },
      GetLikeNum (data) {
        this.LikeNum = data.likeNum
      },
      GetViews (data) {
        this.Views = data.queryNum
      },
      LikeEvent () {
        let Subdata = {}
        Subdata.resId = UrlSearch('id')
        this.$http.post('/web/teacher/prepare/like?' + Math.random(), Subdata, {'emulateJSON': true}).then((response) => {
          let Code = response.body.retCode
          if (Code === '0000') {
            this.LikeNum++
            this.IsLike = true
          }
        })
      }
    }
  }

</script>

<style>
  .c_VideoBox{overflow:hidden;margin: 0 auto;border-radius: 0 0 10px 10px;padding-top: 40px;}
  .c_PlayBox{float:left;width: 100%;background: black;min-height: 660px;}
  .c_Vimenu{float: left; height: 60px;background: white;width: 100%;line-height: 60px;}
  .c_Views{float: left;box-sizing: border-box;padding: 0 15px;border-right: 1px solid #ccc;height: 30px;line-height: 30px;margin-top: 15px;font-size: 16px;color: #333;}
  .c_like{float: left;padding: 0 15px;height: 60px;line-height: 60px;font-size: 16px;color: #333;}
  .c_like>img{float: left; cursor: pointer;margin-top: 15px;}
  .c_like>span{float: left;margin-left: 10px;}
  .fcf9{color: #f9a24a;}
  @media screen and (max-width:1365px){
    .c_VideoBox{width: 900px;}
  }
  @media screen and (min-width:1366px){
    .c_VideoBox{width: 1000px;}
  }
  @media screen and (min-width:1600px){
    .c_VideoBox{width: 1200px;}
  }
</style>
