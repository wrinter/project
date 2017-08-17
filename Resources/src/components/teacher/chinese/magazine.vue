<template>
  <div class="Ma_Content">
    <div class="Ma_Box">
      <div class="Ma_ShowMag" @mouseenter="ShowMenu()" @mouseleave="ShowMenu()">
        <img :src="ShowDatas.picurl" v-if="isNotEmpty(ShowDatas.picurl)" alt="">
        <transition name="Slide"  enter-active-class="slideInLeft">
          <div class="Ma_HideBox" v-if="Show">
            <div class="Ma_TimeBox">
              <p>{{ShowDatas.time}}</p>
              <p>{{ShowDatas.title}}</p>
              <p>目录</p>
            </div>
            <p class="Ma_TopBor"></p>
            <ul class="Ma_ArtList">
              <li v-for="(ShowData, ShowIndex) in ShowDatas.childrens"><i class="Ma_Ico"></i>
                <a :href="ArtPath+'&index='+ShowIndex+'&id='+ShowData.id+'&share=true'" @click="SaveArticle(ShowIndex,ShowDatas.childrens)"  class="router-link-exact-active router-link-active" target="_blank">
                  {{ShowData.title}}
                </a>
              </li>
            </ul>
          </div>
        </transition>
      </div>
      <div class="Ma_Book">
        <div class="swiper-container Ma_BookCon" id="Ma_Slide">
          <div class="swiper-wrapper">
            <div v-for="(data,index) in MagData" class="swiper-slide swiper-no-swiping">
              <ul class="Ma_BookList">
                <li v-for="(book, bindex) in data.Group" @click="ChangeShow(book,bindex)" :class="{'Ma_Shadow':bindex == DefultIndex}">
                  <img :src="book.picurl" v-if="isNotEmpty(book.picurl)" alt="">
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="Ma_SlideBtn" v-if="CanSlide">
          <p><img src="/static/teacher/images/chinese/ma1.png" alt="" @click="BookUpEvt" v-if="IsCanUp"></p>
          <p><img src="/static/teacher/images/chinese/ma0.png" alt="" @click="BookNext" v-if="IsCanNext"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Swiper from 'swiper'
  export default {
    data () {
      return {
        ThisSwiper: '',
        MagData: '',
        MagSize: '',
        ArtPath: '#/content/teacher/chinese/article?nofresh=true',
        CanSlide: false,
        IsCanUp: false,
        Show: false,
        IsCanNext: true,
        ShowDatas: '',
        DefultIndex: 0
      }
    },
    mounted () {
      this.GetBookList()
    },
    methods: {
      ShowMenu () {
        this.Show = !this.Show
      },
      InitSwiper () {
        this.ThisSwiper = new Swiper('#Ma_Slide', {direction: 'vertical'})
      },
      JudeInit () {
        if (this.MagSize > 1) {
          this.CanSlide = true
        } else {
          this.CanSlide = false
        }
      },
      JudgUpNext (index) {
        if (index === 0) {
          this.IsCanUp = false
          this.IsCanNext = true
        } else if (index === (this.MagSize - 1)) {
          this.IsCanUp = true
          this.IsCanNext = false
        } else {
          this.IsCanUp = true
          this.IsCanNext = true
        }
      },
      GetBookList () {
        this.$http.get('static/magzine.json').then((response) => {
          this.MagData = response.body.retData
          this.ShowDatas = this.MagData[0].Group[0]
          this.MagSize = this.MagData.length
        }).then(function () {
          this.InitSwiper()
          this.JudeInit()
        })
      },
      BookUpEvt () {
        this.ThisSwiper.slidePrev()
        this.JudgUpNext(this.ThisSwiper.activeIndex)
      },
      BookNext () {
        this.ThisSwiper.slideNext()
        this.JudgUpNext(this.ThisSwiper.activeIndex)
      },
      isNotEmpty (obj) {
        if (obj) {
          return true
        } else if (obj === '') {
          return false
        } else {
          return false
        }
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
      ChangeShow (data, index) {
        this.ShowDatas = data
        this.DefultIndex = index
      }
    }
  }
</script>

<style>
.Ma_Content{overflow: hidden;box-sizing: border-box;margin:0 auto; padding: 40px 0 ;}
.Ma_Box{float: left;width: 100%;background: white;border-radius: 10px;min-height: 400px;box-sizing: border-box;padding: 40px 25px; }
.Ma_ShowMag{float: left;box-sizing: border-box;border: 1px solid #ccc;overflow: hidden;position: relative;cursor: pointer;}
.Ma_ShowMag>img{float: left;width: 100%;}
.Ma_Book{float: right;box-sizing: border-box;overflow: hidden;}
.Ma_BookCon{overflow: hidden;}
.Ma_BookList{float: left;overflow: hidden;padding: 10px;box-sizing: border-box;}
.Ma_BookList>li{float: left;box-sizing: border-box;border: 1px solid #ccc;overflow: hidden;cursor: pointer;}
.Ma_BookList>li>img{float: left;width: 100%;}
.Ma_Shadow{box-shadow: 0 0 20px #58c1e4;}
.Ma_SlideBtn{float: left;width: 100%;}
.Ma_SlideBtn>p{float: left;width: 100%;box-sizing: border-box;height: 50%;text-align: center;padding: 5px 0;}
.Ma_SlideBtn>p>img{height: 99%;cursor: pointer;}
.Ma_SlideBtn>p:nth-child(1){border-bottom: 1px solid #65b113;}
.Ma_HideBox{position: absolute;height: 100%;background: rgba(255,255,255,0.9); overflow-y: auto; overflow-x: hidden;}
.Ma_TimeBox{float: left;box-sizing: border-box;width: 100%;}
.Ma_TimeBox>p{float: left;box-sizing: border-box;width: 100%;color: #333;line-height: 25px;}
.Ma_TimeBox>p:nth-child(3){font-size: 26px;color: #65b113;line-height: 30px;margin-top: 25px;}
.Ma_ArtList{margin-left: 30px;border-left: 1px solid #ccc;}
.Ma_ArtList,.Ma_ArtList>li{float: left;width: 100%;box-sizing: border-box;}
.Ma_ArtList>li{width: 85%;  height: 30px;line-height: 30px;margin-left: -6px;}
.Ma_ArtList>li:last-child{margin-bottom: 20px;}
.Ma_ArtList>li>a{float: left;width: 85%;margin-left: 10px;font-size: 16px; overflow: hidden;white-space:nowrap;text-overflow:ellipsis; height: 30px;line-height: 30px;}
.Ma_ArtList>li>a:hover{color: #65b113;}
.Ma_Ico{margin-top: 9px; float: left;width: 12px;height: 12px;box-sizing: border-box;border: 2px solid #f4840a;border-radius: 100%;background: white;}
.Ma_TopBor{float: left;width: 150px;height: 1px;border-top:1px solid #ccc;box-sizing: border-box;margin-left: 20px;}
@media screen and (max-width:1365px){
  .Ma_Content{width: 900px;}
  .Ma_ShowMag,.Ma_Book,.Ma_BookList{width: 400px;height: 550px;}
  .Ma_BookCon,.Ma_BookList{height: 515px!important;}
  .Ma_HideBox{width: 250px;}
  .Ma_Book{height: 570px;}
  .Ma_BookList>li{width: 170px;  height: 230px;  margin: 0 20px 20px 0;}
  .Ma_SlideBtn{height: 55px;}
  .Ma_TimeBox{padding: 20px 30px;}
  .Ma_TimeBox>p{font-size: 16px;}
  .Ma_ArtList>li{margin-top: 10px;}
}
@media screen and (min-width:1366px){
  .Ma_Content{width: 1000px;}
  .Ma_ShowMag,.Ma_Book,.Ma_BookList{width: 455px;height: 630px;}
  .Ma_BookCon,.Ma_BookList{height: 575px!important;}
  .Ma_Book{height: 640px;}
  .Ma_HideBox{width: 300px;}
  .Ma_BookList>li{width: 185px;height: 250px; margin: 0 30px 30px 0;}
  .Ma_SlideBtn{height: 65px;}
  .Ma_TimeBox{padding: 30px 40px;}
  .Ma_TimeBox>p{font-size: 16px;}
  .Ma_ArtList>li{margin-top: 15px;}
}
@media screen and (min-width:1600px){
  .Ma_Content{width: 1200px;}
  .Ma_ShowMag,.Ma_Book,.Ma_BookList{width: 550px;height: 760px;}
  .Ma_BookCon,.Ma_BookList{height: 685px!important;}
  .Ma_HideBox{width: 350px;}
  .Ma_BookList>li{width: 235px;height: 320px; margin: 0 30px 30px 0;}
  .Ma_SlideBtn{height: 75px;}
  .Ma_TimeBox{padding: 40px 50px;}
  .Ma_TimeBox>p{font-size: 18px;}
  .Ma_ArtList>li{margin-top: 20px;}
}
</style>
