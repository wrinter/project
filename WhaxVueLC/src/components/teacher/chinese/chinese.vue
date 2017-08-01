<template>
  <div>
    <div class="C_Content">
      <ul class="C_ModelMain">
        <li v-for="(data, index) in Datas">
          <div class="C_MainLeft">
            <i class="C_IcoFont C_IcoTop"></i>
            <p class="C_Title">{{data.article.title}}</p>
            <p class="C_ImgBox0">
              <img :src="data.article.picurl" v-if="isEmptyObject(data.article.picurl)" alt="">
              <img src="../../../../static/teacher/images/chinese/2.png" v-if="!isEmptyObject(data.article.picurl)"  alt="">
            </p>
            <ul class="C_ArtList">
              <li v-for="(artlist, index) in data.article.resList">
                <a :href="ArtPath+'&index='+index+'&id='+art.id+'&share=true'" @click="SaveArticle(index,artlist.childrens)" v-for="(art, index) in artlist.childrens" class="router-link-exact-active router-link-active" target="_blank">
                  {{art.title}}
                </a>
              </li>
            </ul>
          </div>
          <div class="C_MainRight">
            <i class="C_IcoFont C_IcoBot"></i>
            <p class="C_Title">名师指点</p>
            <div class="C_ImgBox1"  @mouseenter="ShowMenu(index)" @mouseleave="ShowMenu(-1)" >
              <img :src="data.video.videourl" v-if="isEmptyObject(data.video.videourl)" alt="">
              <img src="../../../../static/teacher/images/chinese/2.png" v-if="!isEmptyObject(data.video.videourl)"  alt="">
              <transition name="el-fade-in">
                <p v-show="index==DefultIndex">
                  <a :href="VideoPath+'&id='+data.video.restid+'&techer=true'"  class="router-link-exact-active router-link-active" target="_blank">
                    <img src="../../../../static/teacher/images/chinese/1.png" alt="">
                  </a>
                </p>
              </transition>
              <transition name="el-zoom-in-bottom">
                <p v-show="index==DefultIndex" class="C_VideoTit">{{data.video.videotitle}}</p>
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
//        var SubData = {}
//        SubData.menuid = this.menuId
//        , SubData, {'emulateJSON': true}
        this.$http.get('static/chinese.json').then((response) => {
          let ReceiveData = response.body
          console.log(ReceiveData)
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
  .C_Content{margin: 0 auto;overflow: hidden;box-sizing: border-box;padding: 40px 0;}
  .C_ModelMain,.C_ModelMain>li{float: left;width: 100%;}
  .C_ModelMain>li{margin-bottom: 40px;}
  .C_IcoFont{background:url("../../../../static/teacher/images/chinese/guosprite.png")0 0  no-repeat;}
  .C_IcoBot{height:158px;width:181px;background-position:-196px 0;position: absolute;right: 0;bottom: 0;float: left;}
  .C_IcoTop{height:170px;width:189px;background-position:0 0;position: absolute;left: 0;top: 0;float: left; }
  .C_MainLeft,.C_MainRight{display: table-cell;vertical-align: top; height: 100%;min-height: 300px; position: relative;overflow: hidden; box-sizing: border-box;padding-bottom: 45px;background: white;border: 1px solid #ccc;border-radius: 10px;}
  .C_MainLeft{border-right: 0;}
  .C_Title{float: left;width: 100%;height: 105px;line-height: 105px;text-align: center;font-size: 24px;}
  .C_ImgBox0,.C_ImgBox1{position: relative; overflow: hidden;clear: both;margin:0 auto; border-radius: 10px;z-index: 3;}
  .C_ImgBox0>img,.C_ImgBox1>img{width: 100%;}
  .C_ImgBox1{border-radius: 0;}
  .VideoBox{float: left;width: 100%;box-sizing: border-box;position: relative;margin-top: 15px;}
  .C_ImgBox1>img{float: left;width: 100%;}
  .C_ImgBox1>p{position: absolute;width: 100%;height: 100%;text-align: center;}
  .C_ImgBox1>p>a{float: left;width: 100%;height: 100%;position: relative;}
  .C_ImgBox1>.C_VideoTit{position: absolute;bottom: 0;height: 30px;line-height: 30px;font-size: 16px; background: rgba(0,0,0,0.7);left: 0;width: 100%;color: white;text-align: center;}
  .C_ImgBox1>p>a>img{position: absolute;margin: auto;left: 0;bottom: 0;right: 0;top: 0;cursor: pointer;}
  .C_ArtList,.C_ArtList>li{float: left;width: 100%;text-align: center;}
  .C_ArtList li:nth-child(2n){min-height: 40px;line-height: 40px;background: #F6F6F6;}
  .C_ArtList li:nth-child(2n+1){min-height: 55px;line-height: 55px;background: white;}
  .C_ArtList a{margin: 0 10px;}
  .C_ArtList a:hover{color: #65b113;}
  .VideoList{position: relative;overflow: hidden;}
  .VideoList>li{float: left;width: 100%;box-sizing: border-box;padding: 10px;text-align: center; overflow: hidden;white-space:nowrap;text-overflow:ellipsis;line-height: 30px;}
  .VideoList>li>a{color: #333;}
  .VideoList>li>a:hover{color: #65b113;}
  @media screen and (max-width:1365px){
    .C_Content{width: 900px;}
    .C_MainLeft{width: 575px;}
    .C_MainRight{width: 325px;}
    .C_ImgBox0,.C_ImgBox1{width: 290px;height: 165px;}
  }
  @media screen and (min-width:1366px){
    .C_Content{width: 1000px;}
    .C_MainLeft{width: 635px;}
    .C_MainRight{width: 365px;}
    .C_ImgBox0,.C_ImgBox1{width: 315px;height: 175px;}
  }
  @media screen and (min-width:1600px){
    .C_Content{width: 1200px;}
    .C_MainLeft{width: 765px;}
    .C_MainRight{width: 435px;}
    .C_ImgBox0,.C_ImgBox1{width: 365px;height: 205px;}
  }
</style>
