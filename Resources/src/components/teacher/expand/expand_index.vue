<template>
 <div>
   <ul class="e_MainList">
      <li v-for="(data,dataindex) in Datas">
        <p class="e_ExTitle">{{data.title}}</p>
        <div class="e_ExBox">
          <p class="e_ExImgBox">
            <img :src="data.picurl" alt="" v-if="isEmptyObject(data.picurl)">
            <img src="/static/teacher/images/expand/exd.jpg" alt="" v-else>
          </p>
          <ul class="e_ExList">
            <li v-for="(art,index) in data.childrens" @mouseenter="ShowDownEvt(dataindex,index)" @mouseleave="ShowDownEvt(-1,-1)">
              <a :href="ArtPath+'&index='+index+'&id='+art.id+'&share=true'" @click="SaveArticle(index,data.childrens)" class="router-link-exact-active router-link-active" target="_blank">
                {{art.title}}
              </a>
              <transition name="el-fade-in">
                <div class="e_ExDownBox" v-if="index==SIndex&&dataindex==BIndex">
                  <p class="e_ExDownBtn" @click="ExDownload(art.id)">下载</p>
                  <span>3金币</span>
                </div>
              </transition>
            </li>
          </ul>
        </div>
      </li>
   </ul>
   <div id="SubmitBox" v-show="false"></div>
   <!--金币不足-->
   <transition name="el-fade-in">
     <div class="e_ExFade" v-if="ExLess">
       <div class="e_ExLess">
         <a class="router-link-exact-active router-link-active e_ExGoPay" target="_blank" >充值</a>
         <p class="e_ExGoPayClose" @click="FadeBoxRule (0, false)"></p>
       </div>
     </div>
   </transition>
   <!--需要认证-->
   <transition name="el-fade-in">
     <div class="e_ExFade" v-if="ExIdentify">
       <div class="e_ExNoIdentify">
         <a class="router-link-exact-active router-link-active e_ExGoPay" target="_blank" >去认证</a>
         <p class="e_ExGoPayClose" @click="FadeBoxRule (1, false)"></p>
       </div>
     </div>
   </transition>
 </div>
</template>

<script>
  import {UrlSearch} from '../../../common/js/request'
  export default{
    data () {
      return {
        menuId: UrlSearch('id'),
        ArtPath: '#/content/teacher/expand/exarticle?nofresh=true',
        Datas: '',
        DownShow: false,
        SIndex: -1,
        BIndex: -1,
        ExLess: false,
        ExIdentify: false
      }
    },
    created () {
      this.GetData()
      this.ControOver(false)
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
        this.$http.get('static/expand.json').then((response) => {
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
      },
      ShowDownEvt (dataindex, index) {
        this.BIndex = dataindex
        this.SIndex = index
      },
      ControOver (Fade) {
        if (Fade) {
          document.getElementsByTagName('html')[0].style.overflow = 'hidden'
        } else {
          document.getElementsByTagName('html')[0].style.overflow = 'auto'
        }
      },
      ExDownload (id) {
        let SubData = {}
        SubData.resourceId = id
        SubData.type = 'ArticleDownload'
        SubData.resType = '4'
        this.$http.post('/web/teacher/download/obtain', SubData, {'emulateJSON': true}).then((response) => {
          let status = parseInt(response.body.retData)
          this.CheckDownLoad(status, id)
        })
      },
      CheckDownLoad (status, id) {
        if (status === 1) {
          this.CreatDownload(id) // 创建下载
        } else if (status === 2) {
          this.FadeBoxRule(0, true) // 金币不足
        } else {
          this.FadeBoxRule(2, true) // 需要认证
        }
      },
      CreatDownload (id) {
        // 在这里不建议直接操作vue，但是目前只能通过模拟submit提交下载
        let SubHtml = '<form action="/web/common/downLoadArtacle?id=' + id + '"  id="sub"  method="post"></form>'
        document.getElementById('SubmitBox').innerHTML = SubHtml
        document.getElementById('sub').submit()
      },
      FadeBoxRule (role, rule) {
        this.ControOver(rule)
        if (role === 0) { // role 0,金币 1，认证. rule: true 说明弹出，false 说明关闭
          this.ExLess = rule
        } else {
          this.ExIdentify = rule
        }
      }
    }
  }
</script>

<style>
  .e_MainList{margin: 0 auto;overflow: hidden;}
  .e_MainList>li{float: left;width: 100%;min-height: 300px;background: white;border-radius: 10px;margin-top: 40px;overflow: hidden;}
  .e_ExTitle{font-size: 24px;color: #666;line-height: 60px;padding-left: 60px; float: left;height: 60px;border-bottom: 1px solid #ccc; width: 100%;box-sizing: border-box;background: url("/static/teacher/images/expand/lbg.png") 0 0 repeat}
  .e_ExBox,.e_ExList,.e_ExList>li{float: left;box-sizing: border-box;}
  .e_ExBox{padding-left: 70px;}
  .e_ExImgBox{float: left;overflow: hidden;border-radius: 10px;margin: 30px 0;}
  .e_ExImgBox>img{float: left;width: 100%;}
  .e_ExList{padding: 35px 0;}
  .e_ExList>li{width: 100%;height: 35px;line-height: 35px;}
  .e_ExList>li>a{float: left;height: 35px;line-height: 35px;width: 245px;font-size: 16px;color: #666; overflow: hidden;  white-space: nowrap;  text-overflow: ellipsis;}
  .e_ExList>li>a:hover{color: #65b113;}
  .e_ExList>li:nth-child(2n+1){background: #f6f6f6;}
  .e_ExList>li:nth-child(2n){background: white;}
  /*下载*/
  .e_ExDownBtn{float: left;margin:0 10px;height: 30px;line-height: 30px;margin-top: 2px; width: 100px;background: #65b113;color: white;font-size: 16px;text-align: center;cursor: pointer;border-radius: 10px;}
  .e_ExDownBox{float: left;}
  .e_ExDownBox>span{color: #666;}
  .e_ExFade{position: fixed;z-index: 19;background: rgba(0,0,0,0.5);top: 0;left: 0;width: 100%;height: 100%;}
  /*支付*/
  .e_ExLess{width: 670px;height: 352px;position: absolute;bottom: 0;top: 0;left: 0;right: 0;margin: auto;background: url("/static/teacher/images/expand/gold.png") 0 0 no-repeat;border-radius: 10px;overflow: hidden;}
  .e_ExNoIdentify{width: 670px;height: 352px;position: absolute;bottom: 0;top: 0;left: 0;right: 0;margin: auto;background: url("/static/teacher/images/expand/chance.png") 0 0 no-repeat;border-radius: 10px;overflow: hidden;}
  .e_ExGoPay{position: absolute;bottom: 15px;right: 0;left: 0;margin: auto; width: 190px;height: 45px;text-align: center;line-height: 45px;font-size: 18px;float: left; color: white;background: #8ed6ee;border-radius: 10px;}
  .e_ExGoPayClose{opacity: 0;filter: alpha(opacity=0);  width: 35px;height: 40px;position: absolute;top: 0;right: 21px;cursor: pointer;}

  @media screen and (max-width:1365px){
    .e_MainList{width: 900px;}
    .e_ExImgBox{width: 330px;height: 190px;}
    .e_ExList{width: 500px;}
    .e_ExList>li{padding-left: 70px;}
  }
  @media screen and (min-width:1366px){
    .e_MainList{width: 1000px;}
    .e_ExImgBox{width: 330px;height: 190px;}
    .e_ExList{width: 600px;}
    .e_ExList>li{padding-left: 145px;}
  }
  @media screen and (min-width:1600px){
    .e_MainList{width: 1200px;}
    .e_ExImgBox{width: 430px;height: 250px;}
    .e_ExList{width: 700px;}
    .e_ExList>li{padding-left: 180px;}
  }
</style>
