<template>
  <div>
    <div class="Content">
      <div class="Logo"><img src="../../../../static/teacher/images/chinese/logo.png" alt=""></div>
      <div class="ArtMain">
        <p class="ArtTitle">{{ArtTitle}}</p>
        <div class="Author" v-if="isEmptyObject(this.Author)" v-html="Author"></div>
        <div class="ArtTxt" v-if="isEmptyObject(this.ArtData)" v-html="ArtData"></div>
      </div>
      <div class="Menu"  v-if="ShareOpen">
        <div class="ShareBox">
          <img :src="SharePath"  @mouseenter="ShareMouse(1)" @mouseleave="ShareMouse(0)" @click="StartShareEve(0)" alt="">
        </div>
        <p :class="{'C_Command':IsHasClass,'C_CommandNo':!IsHasClass}"  @click="OpenClass" v-if="CanCommand">推荐</p>
        <transition name="el-fade-in" >
          <div v-if="StartClass" class="C_Shade">
            <div class="C_ComaBox">
              <i class="el-icon-close ShareClose" @click="CancelClass"></i>
              <p class="C_ComaTit">推荐班级</p>
              <ul class="C_ComaClass">
                <li
                  v-for="(data, index) in ClassData"
                  @click="ChoiceClass(index)"
                  :class="{'C_ChoiceNot':data.flag=='yes'||data.stuNum==0,'C_Choice':data.isSelected==true}"
                  :title="TitleMsg(data)">
                  {{data.classFullName}}
                </li>
              </ul>
              <textarea class="C_ComSub" v-model="requireMent" placeholder="备注要求：( 限200字符 )" maxlength="200"></textarea>
              <p class="C_ComaRemark">注：请去作业报告中查看推荐报告！</p>
              <p class="C_ComaBtnFb" @click="CommandAjax" :class="{'C_ComaBtnRe':Command>0}">确 定</p>
              <p class="C_ComaBtnCe" @click="CancelClass">取 消</p>
            </div>
          </div>
        </transition>
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
        DefultRoute: '/content/teacher/chinese/article?nofresh=true',
        SharePath: '../../../../static/teacher/images/chinese/share0.png',
        BaiduPath: '',
        Command: 0,
        ClassData: '',
        Choice: -1,
        Toggle: true,
        CommandData: [],
        requireMent: '',
        StartClass: false,
        IsHasClass: false,
        CanCommand: false
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
        let isnotab = window.location.href.indexOf('whnotab') > 0
        this.JudeShare()
        this.ReceiveData = JSON.parse(localStorage.getItem('whdxArt'))
        this.ArtIndex = parseInt(UrlSearch('index'))
        this.GetArt(UrlSearch('id'))
        this.BaiDuConfig()
        this.AppendShare()
        // 如果是名师指点不需要切换
        if (!isnotab) {
          this.JudePage(this.ArtIndex)
          this.GetClass(UrlSearch('id'))
          this.CanCommand = true
        }
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
      OpenClass () {
        if (this.IsHasClass) {
          this.StartClass = true
        } else {
          this.CommandMsg('失败', '您还没有班级', 'error')
        }
      },
      CancelClass () {
        this.StartClass = false
        this.Command = 0
        this.CommandData = []
        this.DefultSlecet(this.ClassData)
      },
      GetClass (resId) {
        let Subdata = {}
        Subdata.resId = resId
        this.$http.post('/web/common/res/recommend/class?' + Math.random(), Subdata, {'emulateJSON': true}).then((response) => {
          let ReceiveData = response.body.retData
          this.DefultSlecet(ReceiveData)
        })
      },
      DefultSlecet (data) {
        if (data.length === 0) {
          this.IsHasClass = false
        } else {
          this.IsHasClass = true
          for (let i = 0; i < data.length; i++) {
            data[i].isSelected = false
          }
          this.ClassData = data
        }
      },
      ChoiceClass (index) {
        if (this.ClassData[index].flag === 'no' && this.ClassData[index].stuNum > 0) {
          this.ClassData[index].isSelected = !this.ClassData[index].isSelected
          this.ResetCommandData(this.ClassData)
        }
      },
      ResetCommandData (data) {
        this.CommandData = []
        for (let i = 0; i < data.length; i++) {
          let obj = {}
          obj = data[i].classId
          if (data[i].isSelected) {
            this.CommandData.push(obj)
          }
        }
        this.Command = this.CommandData.length
      },
      CommandMsg (tit, msg, type) {
        this.$notify({
          title: tit,
          message: msg,
          type: type
        })
      },
      CommandAjax () {
        if (this.Command > 0) {
          let SubData = {}
          SubData.classIdList = this.CommandData
          SubData.resId = UrlSearch('id')
          SubData.requireMent = this.requireMent
          SubData.resType = '401'
          this.$http.post('/web/common/res/recommend', SubData).then((response) => {
            let Code = response.body.retCode
            if (Code === '0000') {
              this.CommandMsg('成功', '文章推荐成功', 'success')
              this.GetClass(UrlSearch('id'))
              this.Command = 0
            } else {
              this.CommandMsg('失败', response.body.retMsg, 'error')
            }
          })
        }
      },
      TitleMsg (data) {
        if (data.stuNum === 0) {
          return '该班级暂无学生'
        } else if (data.flag === 'yes') {
          return '该班级已推荐'
        }
      }
    }
  }
</script>

<style>
  body{background: #ECEDF0;}
  .Content{margin: 0 auto;overflow: hidden;background: white;border-radius: 10px 10px 0 0 ;position: relative;}
  .ArtMain{float: left;width: 100%;box-sizing: border-box;padding: 30px;background: white;min-height: 900px}
  .Logo{float: left;  width: 100%;  height: 60px; border-bottom: 1px solid #ccc;background: url("../../../../static/teacher/images/chinese/bg.png")0 0 repeat;}
  .ArtTitle{float: left;width: 100%;font-size: 24px;  text-align: center;  margin-bottom: 16px; color: #333;}
  .Author{float: left;width: 100%;line-height: 30px;font-size: 18px;text-align: center;color: #333;}
  .ArtTxt{float: left;width: 100%;line-height: 30px!important;font-size: 16px;color: #666;}
  .ArtTxt p,.ArtTxt span{line-height: 30px!important;font-size: 16px;color: #666!important;font-family: "Microsoft YaHei"!important;;}
  .Menu{position: fixed;bottom: 0;left: 0;right: 0;margin: auto;background: white;box-sizing: border-box;height: 60px;border: 1px solid #ccc;}
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
  .C_Command{float: left;margin-top: 10px;border-radius: 10px; margin-left: 20px;width: 150px;height: 40px;background: #f9a24a;font-size: 18px;color: white;text-align: center;line-height: 40px;cursor: pointer;}
  .C_CommandNo{float: left;margin-top: 10px;border-radius: 10px; margin-left: 20px;width: 150px;height: 40px;;font-size: 18px; color: white;background: #ccc;text-align: center;line-height: 40px;cursor: not-allowed;}
  .C_Shade{width: 100%;background: rgba(0,0,0,0.5);position: fixed;top: 0;left: 0; height: 100%;z-index: 10;}
  .C_ComaBox{width: 615px;background: white;box-sizing: border-box;padding: 0 35px; height: 465px;z-index: 10;border-radius: 10px;position: absolute; top: 0;left: 0;right: 0;bottom: 0;margin:  auto;}
  .C_ComaTit{float: left;width: 100%;line-height: 60px;font-size: 24px;color:#65b113;text-align: center;height: 75px;}
  .C_ComaClass{float: left;width: 100%;height: 100px;overflow-y:auto;overflow-x: hidden;margin-bottom: 30px;}
  .C_ComaClass>li{float: left;width: 150px;height: 40px;cursor: pointer; line-height: 40px;text-align: center ;color: #666;box-sizing:border-box;font-size: 16px;border: 1px solid #ccc;border-radius: 10px;margin-top: 20px;margin-right: 30px;}
  .C_ComaClass>li:nth-child(-n+3){margin-top: 0;}
  .C_ComaClass>li:hover{background:#f9a24a;color: white;border: 0; }
  .C_ComaClass>.C_Choice{background:#f9a24a;color: white;border: 0; }
  .C_ComaClass>.C_ChoiceNot{background:#ccc!important;color: white;cursor: not-allowed;border: 0;  }
  .C_ComSub{float: left;font-size: 16px;color: #666;font-family: "Microsoft YaHei"; width: 100%;resize: none;box-sizing: border-box;border: 1px solid #ccc;height: 135px;padding: 15px;outline: none;border-radius: 10px;}
  .C_ComaRemark{float: left;width: 100%;height: 45px;line-height: 45px;text-align: left;font-size: 16px;color: #ca0d0d;}
  .C_ComaBtnFb{float:left;width: 220px;height: 45px;margin: 0 26px;cursor: not-allowed; text-align: center;line-height: 45px;font-size: 18px;border-radius: 10px; color: white;background: #ccc;}
  .C_ComaBtnRe{float:left;width: 220px;height: 45px;margin: 0 26px;cursor: pointer; text-align: center;line-height: 45px;font-size: 18px;border-radius: 10px; color: white;background: #65b113;}
  .C_ComaBtnCe{float:left;width: 220px;height: 45px;margin: 0 26px;cursor: pointer; text-align: center;line-height: 45px;font-size: 18px;border-radius: 10px; color: white;background: #ccc;}
  @media screen and (max-width:1365px){
    .Content,.Menu{width: 900px;}
  }
  @media screen and (min-width:1366px){
    .Content,.Menu{width: 1000px;}
  }
  @media screen and (min-width:1600px){
    .Content,.Menu{width: 1200px;}
  }
  @media screen and (max-width:780px){
    .Content,.Menu{width: 100%;}
    .Menu{display: none;}
    .ArtMain{min-height: 0;}
    .Share{display: none;}
  }
</style>
