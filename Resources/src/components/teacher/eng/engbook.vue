<template>
  <div>
    <ul class="Eb_MainList">
      <li v-for="(data,dataindex) in Datas">
        <p class="Eb_ExTitle">{{data.title}}</p>
        <div class="Eb_ExBox">
          <p class="Eb_ExImgBox">
            <img :src="data.picurl" alt="" v-if="isEmptyObject(data.picurl)">
          </p>
          <ul class="Eb_ExList">
            <li v-for="(art,index) in data.childrens">
              <a :href="ArtPath+'index='+index+'&id='+art.id+'&share=true'" @click="SaveArticle(index,data.childrens)" class="router-link-exact-active router-link-active">
                {{art.title}}
              </a>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {UrlSearch} from '../../../common/js/request'
  export default{
    data () {
      return {
        menuId: UrlSearch('id'),
        ArtPath: '#/content/teacher/eng/engart?',
        Datas: ''
      }
    },
    created () {
      this.GetData()
    },
    methods: {
      SaveArticle (index, ArtRes) {
        let SaveData = ArtRes
        let SaveArr = []
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
        this.$http.get('static/engbook.json').then((response) => {
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
  .Eb_MainList{margin: 0 auto;overflow: hidden;}
  .Eb_MainList>li{float: left;width: 100%;min-height: 300px;background: white;border-radius: 10px;margin-top: 40px;overflow: hidden;}
  .Eb_ExTitle{font-size: 24px;color: #666;line-height: 60px;padding-left: 60px; float: left;height: 60px;border-bottom: 1px solid #ccc; width: 100%;box-sizing: border-box;background: url("/static/teacher/images/expand/lbg.png") 0 0 repeat}
  .Eb_ExBox,.Eb_ExList,.Eb_ExList>li{float: left;box-sizing: border-box;}
  .Eb_ExBox{padding-left: 70px;}
  .Eb_ExImgBox{float: left;overflow: hidden;border-radius: 10px;margin: 30px 0;}
  .Eb_ExImgBox>img{float: left;width: 100%;}
  .Eb_ExList{padding: 35px 0;}
  .Eb_ExList>li{width: 100%;height: 35px;line-height: 35px;}
  .Eb_ExList>li>a{float: left;height: 35px;line-height: 35px;width: 100%;box-sizing: border-box;padding-right: 30px; font-size: 16px;color: #666; overflow: hidden;  white-space: nowrap;  text-overflow: ellipsis;}
  .Eb_ExList>li>a:hover{color: #65b113;}
  .Eb_ExList>li:nth-child(2n+1){background: #f6f6f6;}
  .Eb_ExList>li:nth-child(2n){background: white;}
  @media screen and (max-width:1365px){
    .Eb_MainList{width: 900px;}
    .Eb_ExImgBox{width: 330px;height: 190px;}
    .Eb_ExList{width: 500px;}
    .Eb_ExList>li{padding-left: 70px;}
  }
  @media screen and (min-width:1366px){
    .Eb_MainList{width: 1000px;}
    .Eb_ExImgBox{width: 330px;height: 190px;}
    .Eb_ExList{width: 600px;}
    .Eb_ExList>li{padding-left: 145px;}
  }
  @media screen and (min-width:1600px){
    .Eb_MainList{width: 1200px;}
    .Eb_ExImgBox{width: 430px;height: 250px;}
    .Eb_ExList{width: 700px;}
    .Eb_ExList>li{padding-left: 180px;}
  }
</style>
