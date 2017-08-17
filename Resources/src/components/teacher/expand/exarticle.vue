<template>
  <div>
    <div class="Content">
      <div class="Logo"><img src="../../../../static/teacher/images/chinese/logo.png" alt=""></div>
      <div class="ArtMain">
        <p class="ArtTitle">{{ArtTitle}}</p>
        <div class="Author" v-if="isEmptyObject(this.Author)" v-html="Author"></div>
        <div class="ArtTxt" v-if="isEmptyObject(this.ArtData)" v-html="ArtData"></div>
        <div class="EX_Defade"></div>
      </div>
      <div class="Menu"  v-if="ShareOpen">
        <div class="ShareBox">
          <img :src="SharePath"  @mouseenter="ShareMouse(1)" @mouseleave="ShareMouse(0)" @click="StartShareEve(0)" alt="">
        </div>
        <div class="e_ArExDownBox">
          <p class="e_ArExDownBtn" @click="ExDownload()">下载</p>
          <span>3金币</span>
        </div>
        <transition name="el-fade-in">
          <div v-show="StartShare" class="Share">
            <i class="el-icon-close ShareClose"  @click="StartShareEve(1)" ></i>
            <h1 class="ShareTitle">分享给好友</h1>
            <div class="bdsharebuttonbox" data-tag="share_1">
              <a class="bds_sqq" data-cmd="sqq"></a>
              <a class="bds_qzone" data-cmd="qzone" ></a>
              <a class="bds_tsina" data-cmd="tsina"></a>
              <a class="bds_weixin" data-cmd="weixin"></a>
            </div>
          </div>
        </transition>
        <div class="MenuSelect">
          <div v-if="IsDown"  class="Select"  @click="ChangeArt(1)">
            <span>下一篇:</span>
            <p>{{DownArtName}}</p>
          </div>
          <p v-if="IsDown && IsUp">|</p>
          <div v-if="IsUp" class="Select" @click="ChangeArt(-1)">
            <span >上一篇:</span>
            <p>{{UpArtName}}</p>
          </div>
        </div>
      </div>
    </div>
    <div id="SubmitBox" v-show="false"></div>
    <!--金币不足-->
    <transition name="el-fade-in">
      <div class="e_ArExFade" v-if="ExLess">
        <div class="e_ArExLess">
          <a class="router-link-exact-active router-link-active e_ArExGoPay" target="_blank" >充值</a>
          <p class="e_ArExGoPayClose" @click="FadeBoxRule (0, false)"></p>
        </div>
      </div>
    </transition>
    <!--需要认证-->
    <transition name="el-fade-in">
      <div class="e_ArExFade" v-if="ExIdentify">
        <div class="e_ArExNoIdentify">
          <a class="router-link-exact-active router-link-active e_ArExGoPay" target="_blank" >去认证</a>
          <p class="e_ArExGoPayClose" @click="FadeBoxRule (1, false)"></p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {UrlSearch} from '../../../common/js/request'
  export default {
    data () {
      return {
        ReceiveData: '',
        ArtData: '',
        ArtTitle: '',
        Author: '',
        IsUp: false,
        IsDown: false,
        StartShare: false,
        ShareOpen: true,
        ArtIndex: '',
        UpArtName: '',
        DownArtName: '',
        ArtRoute: '',
        DefultRoute: '/content/teacher/expand/exarticle?nofresh=true',
        SharePath: '../../../../static/teacher/images/chinese/share0.png',
        BaiduPath: '',
        DownShow: false,
        SIndex: -1,
        BIndex: -1,
        ExLess: false,
        ExIdentify: false
      }
    },
    created () {
      this.Init()
    },
    watch: {
      '$route': 'GetEssayData'
    },
    methods: {
      Init () {
        this.JudeShare()
        this.ReceiveData = JSON.parse(localStorage.getItem('whdxArt'))
        this.ArtIndex = parseInt(UrlSearch('index'))
        this.GetArt(UrlSearch('id'))
        this.BaiDuConfig()
        this.AppendShare()
        this.JudePage(this.ArtIndex)
      },
      JudeShare () {
        let HashNum = window.location.href.split('#').length
        if (HashNum > 2) {
          this.ShareOpen = false
        } else {
          this.ShareOpen = true
        }
      },
      JudePage (index) {
        let Leg = this.ReceiveData.length
        if (Leg > 1) {
          if (index === 0) {
            this.IsUp = false
            this.IsDown = true
            this.DownArtName = this.ReceiveData[index + 1].title
          } else if (index === (this.ReceiveData.length - 1)) {
            this.IsUp = true
            this.IsDown = false
            this.UpArtName = this.ReceiveData[index - 1].title
          } else {
            this.IsUp = true
            this.IsDown = true
            this.DownArtName = this.ReceiveData[index + 1].title
            this.UpArtName = this.ReceiveData[index - 1].title
          }
        } else {
          this.IsUp = false
          this.IsDown = false
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
      },
      ChangeArt (rule) {
        this.ArtIndex = this.ArtIndex + rule
        this.JudePage(this.ArtIndex)
        this.ArtRoute = this.DefultRoute + '&index=' + this.ArtIndex + '&id=' + this.ReceiveData[this.ArtIndex].id + '&share=true'
        this.$router.push(this.ArtRoute)
        this.GetArt(UrlSearch('id'))
        this.GetClass(UrlSearch('id'))
        this.BaiDuConfig()
      },
      GetArt (id) {
        let Subdata = {}
        Subdata.id = id
        this.$http.post('/web/shareresource/toartical?' + Math.random(), Subdata, {'emulateJSON': true}).then((response) => {
          let ReceiveData = response.body.retData
          this.Analysis(ReceiveData)
        })
      },
      Analysis (data) {
        this.ArtData = data.content
        this.ArtTitle = data.title
        this.Author = data.subtitle
        if (data.subtitle !== '') {
          this.Author = '作者：' + this.Author.replace(/&middot;/g, '·')
        }
        this.ArtData = this.ArtData.replace(/&lt;/g, '<')
        this.ArtData = this.ArtData.replace(/&gt;/g, '>')
        this.ArtData = this.ArtData.replace(/&quot;/g, '"')
        this.ArtData = this.ArtData.replace(/&amp;quot;/g, '"')
        this.ArtData = this.ArtData.replace(/&amp;nbsp;/g, '')
        this.ArtData = this.ArtData.replace(/&amp;nbsp;/g, '')
      },
      ShareMouse (index) {
        if (index === 0) {
          this.SharePath = '../../../../static/teacher/images/chinese/share0.png'
        } else {
          this.SharePath = '../../../../static/teacher/images/chinese/share1.png'
        }
      },
      BaiDuConfig () {
        window._bd_share_config = {
          common: {
            bdDesc: '欢迎使用五好导学'
          },
          share: [{
            'bdSize': 80
          }],
          image: [{
            viewSize: '16',
            viewList: ['sqq', 'qzone', 'tsina', 'tqq', 'weixin']
          }]
        }
      },
      AppendShare () {
        this.BaiduPath = '../../static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5)
        let BaiDuScr = document.createElement('script')
        BaiDuScr.src = this.BaiduPath
        let head = document.getElementsByTagName('head')[0]
        head.appendChild(BaiDuScr)
      },
      StartShareEve (rule) {
        if (rule === 0) {
          this.StartShare = true
        } else {
          this.StartShare = false
        }
      },
      ControOver (Fade) {
        if (Fade) {
          document.getElementsByTagName('html')[0].style.overflow = 'hidden'
        } else {
          document.getElementsByTagName('html')[0].style.overflow = 'auto'
        }
      },
      ExDownload () {
        let SubData = {}
        SubData.resourceId = UrlSearch('id')
        SubData.type = 'ArticleDownload'
        SubData.resType = '4'
        this.$http.post('/web/teacher/download/obtain', SubData, {'emulateJSON': true}).then((response) => {
          let status = parseInt(response.body.retData)
          this.CheckDownLoad(status, UrlSearch('id'))
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
  body{background: #ECEDF0;}
  .Content{margin: 0 auto;overflow: hidden;background: white;border-radius: 10px 10px 0 0 ;position: relative;}
  .ArtMain{float: left;width: 100%;box-sizing: border-box;padding: 30px;background: white;min-height: 900px;position: relative;}
  .Logo{float: left;  width: 100%;  height: 60px; border-bottom: 1px solid #ccc;background: url("../../../../static/teacher/images/chinese/bg.png")0 0 repeat;}
  .ArtTitle{float: left;width: 100%;font-size: 24px;  text-align: center;  margin-bottom: 16px; color: #333;}
  .Author{float: left;width: 100%;line-height: 30px;font-size: 18px;text-align: center;color: #333;}
  .ArtTxt{float: left;width: 100%;line-height: 30px!important;font-size: 16px;color: #666;padding-bottom: 60px;}
  .ArtTxt p,.ArtTxt span{line-height: 30px!important;font-size: 16px;color: #666!important;font-family: "Microsoft YaHei"!important;;}
  .Menu{position: fixed;bottom: 0;z-index: 4; left: 0;right: 0;margin: auto;background: white;box-sizing: border-box;height: 60px;border: 1px solid #ccc;}
  .MenuSelect{float: right;box-sizing: border-box;height: 100%;padding-right: 40px;width: 540px;}
  .MenuSelect>p{float: right;line-height: 58px;color:#333;margin: 0 15px;}
  .Select{float: right;width: 225px;box-sizing: border-box;color: #333;cursor: pointer;}
  .Select>p{float: left; width: 160px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;height: 58px; line-height: 58px;}
  .Select>span{float: left; width: 60px;height: 58px; line-height: 58px;}
  .Select:hover {color: #65b113;}
  .Select:hover {color: #65b113;}
  .ShareBox{float: left;height: 30px;line-height: 40px;text-align: center;width: 80px;margin-top: 15px;border-right: 1px solid #ccc; box-sizing: border-box;}
  .ShareBox img{cursor: pointer;}
  /*百度分享*/
  .Share{border: 1px solid #ccc; position: fixed; z-index: 10; top: 0;left: 0;right: 0;bottom: 0;margin:  auto;width: 600px;height: 220px;padding: 20px;background: white;;border-radius: 10px;}
  .ShareTitle{width: 300px;font-size: 24px; height: 80px;line-height: 35px;text-align: left;float: left;}
  .ShareClose{position: absolute;right: 25px;top: 25px;cursor: pointer;color: #333;font-size: 20px;}
  @media screen and (max-width:1365px){
    .Content,.Menu{width: 900px;}
    .e_ArExDownBtn{width: 100px;}
  }
  @media screen and (min-width:1366px){
    .Content,.Menu{width: 1000px;}
    .e_ArExDownBtn{width: 120px;}
  }
  @media screen and (min-width:1600px){
    .Content,.Menu{width: 1200px;}
    .e_ArExDownBtn{width: 150px;}
  }
  @media screen and (max-width:780px){
    .Content,.Menu{width: 100%;}
    .Menu{display: none;}
    .ArtMain{min-height: 0;}
    .Share{display: none;}
  }
  /*下载*/
  .e_ArExDownBtn{float: left;margin:0 10px;line-height: 40px;height: 40px; margin-top: 10px; background: #65b113;color: white;font-size: 16px;text-align: center;cursor: pointer;border-radius: 10px;}
  .e_ArExDownBox{float: left;}
  .e_ArExDownBox>span{color: #666;line-height: 60px;}
  .e_ArExFade{position: fixed;z-index: 19;background: rgba(0,0,0,0.5);top: 0;left: 0;width: 100%;height: 100%;}
  /*支付*/
  .e_ArExLess{width: 670px;height: 352px;position: absolute;bottom: 0;top: 0;left: 0;right: 0;margin: auto;background: url("/static/teacher/images/expand/gold.png") 0 0 no-repeat;border-radius: 10px;overflow: hidden;}
  .e_ArExNoIdentify{width: 670px;height: 352px;position: absolute;bottom: 0;top: 0;left: 0;right: 0;margin: auto;background: url("/static/teacher/images/expand/chance.png") 0 0 no-repeat;border-radius: 10px;overflow: hidden;}
  .e_ArExGoPay{position: absolute;bottom: 15px;right: 0;left: 0;margin: auto; width: 190px;height: 45px;text-align: center;line-height: 45px;font-size: 18px;float: left; color: white;background: #8ed6ee;border-radius: 10px;}
  .e_ArExGoPayClose{opacity: 0;filter: alpha(opacity=0);  width: 35px;height: 40px;position: absolute;top: 0;right: 21px;cursor: pointer;}
  .EX_Defade{position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 3}
</style>
