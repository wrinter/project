<template>
  <div>
    <div class="e_Content">
      <ul class="e_ModelMain">
        <li v-for="(data, Dataindex) in Datas">
          <div class="e_MainLeft">
            <i class="e_IcoFont e_IcoTop"></i>
            <ul class="e_ArtList">
              <li v-for="(artlist, artlistindex) in data.article.resList">
                <span :class="{
                  'fc65':artlist.title==1+3*Dataindex,
                  'fcE3':artlist.title==2+3*Dataindex,
                  'fc10':artlist.title==3+3*Dataindex
                }">{{artlist.title}}</span>
                <ul class="e_Letter">
                  <li v-for="(art, artindex) in artlist.childrens">
                    <i :class="{
                      'e_IcoFont e_ficico0':artlist.title==1+3*Dataindex,
                      'e_IcoFont e_ficico1':artlist.title==2+3*Dataindex,
                      'e_IcoFont e_ficico2':artlist.title==3+3*Dataindex,
                  }"></i>
                    <a :href="ArtPath+'&index='+artindex+'&id='+art.id+'&share=true'" @click="SaveArticle(artindex,artlist.childrens)"  class="router-link-exact-active router-link-active" target="_blank">
                      {{art.title}}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="e_MainRight">
            <i class="e_IcoFont e_IcoBot"></i>
            <p class="e_Title">名师指点</p>
            <div class="e_ImgBox1" v-if="isEmptyObject(data.video.restid)" @mouseenter="ShowMenu(Dataindex)" @mouseleave="ShowMenu(-1)" >
              <img :src="data.video.videourl" v-if="isEmptyObject(data.video.videourl)" alt="">
              <transition name="el-fade-in">
                <p v-show="Dataindex==DefultIndex">
                  <a :href="VideoPath+'&id='+data.video.restid+'&techer=true'"  class="router-link-exact-active router-link-active" target="_blank">
                    <img src="../../../../static/teacher/images/chinese/1.png" alt="">
                  </a>
                </p>
              </transition>
              <transition name="el-zoom-in-bottom">
                <p v-show="Dataindex==DefultIndex" class="e_VideoTit">{{data.video.videotitle}}</p>
              </transition>
            </div>
            <ul class="VideoList">
              <li v-for="(video, index) in data.video.resList">
                <a :href="ArtPath+'&index='+index+'&id='+video.id+'&share=true&whnotab=true'"  class="router-link-exact-active router-link-active" target="_blank">
                  {{video.title}}
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {UrlSearch} from '../../../common/js/request'
  export default{
    data () {
      return {
        menuId: UrlSearch('id'),
        ArtPath: '#/content/teacher/chinese/article?nofresh=true',
        VideoPath: '#/content/teacher/chinese/tartvideo?nofresh=true',
        Datas: '',
        DefultIndex: -1,
        Goart: ''
      }
    },
    created () {
      this.GetData()
    },
    methods: {
      ShowMenu (index) {
        this.DefultIndex = index
      },
      SaveArticle (index, ArtRes) {
        let SaveData = ArtRes
        let SaveArr = []
        console.log(ArtRes)
        for (let i = 0; i < SaveData.length; i++) {
          let obj = {}
          obj.id = SaveData[i].id
          obj.title = SaveData[i].title
          obj.index = i
          SaveArr.push(obj)
        }
        localStorage.setItem('whdxArt', JSON.stringify(SaveArr))
      },
      GetData () {
        this.$http.get('static/essay.json').then((response) => {
          let ReceiveData = response.body
          this.Datas = ReceiveData.retData
        })
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
  .e_Content{margin: 0 auto;overflow: hidden;box-sizing: border-box;padding: 40px 0;}
  .e_ModelMain,.e_ModelMain>li{float: left;width: 100%;}
  .e_ModelMain>li{margin-bottom: 40px;}
  .e_IcoFont{background:url("../../../../static/teacher/images/chinese/guosprite.png")0 0  no-repeat;}
  .e_IcoBot{height:158px;width:181px;background-position:-196px 0;position: absolute;right: 0;bottom: 0;float: left;}
  .e_IcoTop{height:170px;width:189px;background-position:0 0;position: absolute;left: 0;top: 0;float: left; }
  .e_ficico2{height:35px;width:18px;background-position:-56px -367px;float: left;}
  .e_ficico1{height:35px;width:18px;background-position:-29px -368px;float: left;}
  .e_ficico0{height:35px;width:18px;background-position:-3px -368px;float: left;}
  .e_MainLeft,.e_MainRight{display: table-cell;vertical-align: top; height: 100%;min-height: 300px; position: relative;overflow: hidden; box-sizing: border-box;padding-bottom: 45px;background: white;border: 1px solid #ccc;border-radius: 10px;}
  .e_MainLeft{border-right: 0;}
  .e_Title{float: left;width: 100%;height: 105px;line-height: 105px;text-align: center;font-size: 24px;}
  .e_ImgBox0,.e_ImgBox1{position: relative; overflow: hidden;clear: both;margin:0 auto; border-radius: 10px;z-index: 3;}
  .e_ImgBox0>img,.e_ImgBox1>img{width: 100%;}
  .e_ImgBox1{border-radius: 0;}
  .VideoBox{float: left;width: 100%;box-sizing: border-box;position: relative;margin-top: 15px;}
  .e_ImgBox1>img{float: left;width: 100%;}
  .e_ImgBox1>p{position: absolute;width: 100%;height: 100%;text-align: center;}
  .e_ImgBox1>p>a{float: left;width: 100%;height: 100%;position: relative;}
  .e_ImgBox1>.e_VideoTit{position: absolute;bottom: 0;height: 30px;line-height: 30px;font-size: 16px; background: rgba(0,0,0,0.7);left: 0;width: 100%;color: white;text-align: center;}
  .e_ImgBox1>p>a>img{position: absolute;margin: auto;left: 0;bottom: 0;right: 0;top: 0;cursor: pointer;}
  .e_ArtList,.e_ArtList>li{float: left;width: 100%;box-sizing: border-box;}
  .e_ArtList{padding-top: 35px;}
  .e_ArtList>li{padding-left: 50px;position: relative;z-index: 3;margin-top: 60px;}
  .e_ArtList>li>span{float: left; width: 45px;line-height: 35px;font-size: 30px;text-align: left;}
  .e_ArtList>li>ul{float: left;border-bottom: 1px dashed  #ccc;min-height: 30px;}
  .e_Letter>li{float: left;box-sizing: border-box;padding:0 10px;line-height: 35px; text-align: center;font-size: 16px;color: #333;}
  .e_ArtList a{float: left;height: 100%;line-height: 35px;}
  .e_ArtList a:hover{color: #65b113;}
  .fc65{color: #65B113!important;}
  .fcE3{color: #E36A28!important;}
  .fc10{color: #1079E5!important;}
  .VideoList{position: relative;overflow: hidden;float: left;  width: 100%;}
  .VideoList>li{float: left;width: 100%;box-sizing: border-box;padding: 10px;text-align: center; overflow: hidden;white-space:nowrap;text-overflow:ellipsis;line-height: 30px;}
  .VideoList>li>a{color: #333;}
  .VideoList>li>a:hover{color: #65b113;}
  @media screen and (max-width:1365px){
    .e_Content{width: 900px;}
    .e_MainLeft{width: 575px;}
    .e_MainRight{width: 325px;}
    .e_ImgBox0,.e_ImgBox1{width: 290px;height: 165px;}
    .e_ArtList>li>ul{width: 475px;}
  }
  @media screen and (min-width:1366px){
    .e_Content{width: 1000px;}
    .e_MainLeft{width: 635px;}
    .e_MainRight{width: 365px;}
    .e_ImgBox0,.e_ImgBox1{width: 315px;height: 175px;}
    .e_ArtList>li>ul{width: 535px;}
  }
  @media screen and (min-width:1600px){
    .e_Content{width: 1200px;}
    .e_MainLeft{width: 765px;}
    .e_MainRight{width: 435px;}
    .e_ImgBox0,.e_ImgBox1{width: 365px;height: 205px;}
    .e_ArtList>li>ul{width: 665px;}
  }
</style>
