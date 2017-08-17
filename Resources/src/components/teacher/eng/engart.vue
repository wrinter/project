<template>
  <div>
    <div style="clear: both"></div>
    <div class="Eng_Content">
      <div class="Eng_Menu"   v-if="ShareOpen">
        <div class="Eng_Switch">
          <div class="Eng_Trans" :class="{'Eng_Toleft':ShowTrans == false, 'Eng_ToRight':ShowTrans == true}">
            <span class="Eng_Sw0" @click="SwitchEvt">关闭翻译</span>
            <i class="Eng_Swbtn"></i>
            <span class="Eng_Sw1" @click="SwitchEvt">查看翻译</span>
          </div>
        </div>
        <p :class="{'Eng_Command':IsHasClass,'Eng_CommandNo':!IsHasClass}"  @click="OpenClass" v-if="CanCommand">推荐</p>
        <div class="Eng_ShareBox">
          <img :src="SharePath"  @mouseenter="ShareMouse(1)" @mouseleave="ShareMouse(0)" @click="StartShareEve(0)" alt="">
        </div>
      </div>
      <div class="Eng_Art">
        <p class="Eng_Logo"><img src="/static/teacher/images/engbook/logo.png" alt=""></p>
        <p class="Eng_Txt" v-html="Title" v-if="isEmptyObject(Title)">A Forever Friend</p>
        <p class="Eng_Author" v-html="Author" v-if="isEmptyObject(Author)"></p>
        <div class="Eng_Main" v-html="Content"></div>
        <div class="Eng_MainTrans" v-html="ContentTrans" v-show="ShowTrans"></div>
        <div class="Eng_MenuSelect">
          <div v-if="IsDown"  class="Eng_Select"  @click="ChangeArt(1)">
            <span>下一篇:</span>
            <p>{{DownArtName}}</p>
          </div>
          <p v-if="IsDown && IsUp">|</p>
          <div v-if="IsUp" class="Eng_Select" @click="ChangeArt(-1)">
            <span >上一篇:</span>
            <p>{{UpArtName}}</p>
          </div>
        </div>
      </div>
    </div>
    <transition name="el-fade-in" >
      <div v-if="StartClass" class="Eng_Shade">
        <div class="Eng_ComaBox">
          <i class="el-icon-close ShareClose" @click="CancelClass"></i>
          <p class="Eng_ComaTit">推荐班级</p>
          <ul class="Eng_ComaClass">
            <li
              v-for="(data, index) in ClassData"
              @click="ChoiceClass(index)"
              :class="{'Eng_ChoiceNot':data.flag=='yes'||data.stuNum==0,'Eng_Choice':data.isSelected==true}"
              :title="TitleMsg(data)">
              {{data.classFullName}}
            </li>
          </ul>
          <textarea class="Eng_ComSub" v-model="requireMent" placeholder="备注要求：( 限200字符 )" maxlength="200"></textarea>
          <p class="Eng_ComaRemark">注：请去作业报告中查看推荐报告！</p>
          <p class="Eng_ComaBtnFb" @click="CommandAjax" :class="{'Eng_ComaBtnRe':Command>0}">确 定</p>
          <p class="Eng_ComaBtnCe" @click="CancelClass">取 消</p>
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
    <div class="Eng_Player"><v-player :Tosrc="ThisSrc"></v-player></div>
  </div>
</template>

<script>
  import Player from '../../common/Player'
  import {UrlSearch} from '../../../common/js/request'
  export default {
    data () {
      return {
        IsUp: false,
        IsDown: false,
        ArtIndex: '',
        UpArtName: '',
        DownArtName: '',
        ArtRoute: '',
        DefultRoute: '/content/teacher/eng/engart?nofresh=true',
        ThisSrc: '/static/slice.mp3',
        SharePath: '../../../../static/teacher/images/chinese/share0.png',
        BaiduPath: '',
        StartShare: false,
        ShareOpen: true,
        Command: 0,
        ClassData: '',
        Choice: -1,
        Toggle: true,
        CommandData: [],
        requireMent: '',
        StartClass: false,
        IsHasClass: false,
        CanCommand: true,
        ThisEngArt: '',
        Title: '',
        Author: '',
        ContentTrans: '',
        ShowTrans: false,
        Content: ''
      }
    },
    mounted () {
      this.Init()
    },
    components: {
      'v-player': Player
    },
    methods: {
      Init () {
        this.JudeShare()
        this.BaiDuConfig()
        this.AppendShare()
        this.GetClass(UrlSearch('id'))
        this.GetEngArt(UrlSearch('id'))
        this.ReceiveData = JSON.parse(localStorage.getItem('whdxArt'))
        this.ArtIndex = parseInt(UrlSearch('index'))
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
        this.BaiduPath = '/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5)
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
      SwitchEvt () {
        this.ShowTrans = !this.ShowTrans
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
      },
      GetEngArt (resId) {
        let Subdata = {}
        Subdata.id = resId
        this.$http.post('/web/shareresource/toartical?' + Math.random(), Subdata, {'emulateJSON': true}).then((response) => {
          this.ThisEngArt = response.body.retData
          this.CreatContent(this.ThisEngArt)
        })
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
        this.GetEngArt(UrlSearch('id'))
        this.GetClass(UrlSearch('id'))
        this.BaiDuConfig()
      },
      CreatContent (data) {
        this.Content = this.ResetContent(data.content)
        this.Author = this.ResetContent(data.subtitle)
        this.Title = this.ResetContent(data.title)
        this.ContentTrans = this.ResetContent(data.contentTrans)
      },
      ResetContent (content) {
        content = content.replace(/&lt;/g, '<');
        content = content.replace(/&amp;#39;/g, '´');
        content = content.replace(/&gt;/g, '>');
        content = content.replace(/&quot;/g, '"');
        content = content.replace(/&amp;quot;/g, '"');
        content = content.replace(/&amp;nbsp;/g, ' ');
        return content
      }
    }
  }
</script>

<style>
  .Eng_Player{width: 100%;position: fixed;bottom: 0;left: 0;right: 0;margin: auto;z-index: 2;}
  .Eng_Content{box-sizing: border-box;overflow: hidden;margin: 40px auto 0 auto;background: white;padding:50px 50px 100px 50px ;border-radius: 10px;}
  .Eng_Switch{float: left;width: 175px;height: 35px;overflow: hidden; position: relative; border-radius: 10px;border: 1px solid #ccc;}
  .Eng_Swbtn{float: left;width: 65px;height: 35px;background: url("/static/teacher/images/engbook/swbtn.png")center center no-repeat;}
  .Eng_Trans>span{float: left;width: 110px;box-sizing: border-box; height: 35px;line-height: 35px;font-size: 16px;color: #666;}
  .Eng_Sw0{padding-left: 30px;text-align: left;}
  .Eng_Sw1{padding-right: 30px;text-align: right;}
  .Eng_Trans{position: absolute;left:-110px;top:0;float: left;width: 285px;height: 35px;cursor: pointer;-webkit-transition: all 0.2s linear; -moz-transition: all 1s linear;-ms-transition: all 1s linear;-o-transition: all 1s linear;}
  .Eng_ToRight{left: 0;}
  .Eng_Toleft{left: -110px;}
  .Eng_ShareBox{float: right;height: 35px;line-height: 45px;text-align: center;width: 23px;box-sizing: border-box;}
  .Eng_ShareBox img{cursor: pointer;}
  .Share{border: 1px solid #ccc; position: fixed; z-index: 10; top: 0;left: 0;right: 0;bottom: 0;margin:  auto;width: 600px;height: 220px;padding: 20px;background: white;;border-radius: 10px;}
  .ShareTitle{width: 300px;font-size: 24px; height: 80px;line-height: 35px;text-align: left;float: left;}
  .ShareClose{position: absolute;right: 25px;top: 25px;cursor: pointer;color: #333;font-size: 20px;}
  /*推荐*/
  .Eng_Command{float: right;border-radius: 10px; margin-left: 25px;width: 150px;height: 40px;background: #f9a24a;font-size: 18px;color: white;text-align: center;line-height: 40px;cursor: pointer;}
  .Eng_CommandNo{float: right;border-radius: 10px; margin-left: 25px;width: 150px;height: 40px;;font-size: 18px; color: white;background: #ccc;text-align: center;line-height: 40px;cursor: not-allowed;}
  .Eng_Shade{width: 100%;background: rgba(0,0,0,0.5);position: fixed;top: 0;left: 0; height: 100%;z-index: 10;}
  .Eng_ComaBox{width: 615px;background: white;box-sizing: border-box;padding: 0 35px; height: 465px;z-index: 10;border-radius: 10px;position: absolute; top: 0;left: 0;right: 0;bottom: 0;margin:  auto;}
  .Eng_ComaTit{float: left;width: 100%;line-height: 60px;font-size: 24px;color:#65b113;text-align: center;height: 75px;}
  .Eng_ComaClass{float: left;width: 100%;height: 100px;overflow-y:auto;overflow-x: hidden;margin-bottom: 30px;}
  .Eng_ComaClass>li{float: left;width: 150px;height: 40px;cursor: pointer; line-height: 40px;text-align: center ;color: #666;box-sizing:border-box;font-size: 16px;border: 1px solid #ccc;border-radius: 10px;margin-top: 20px;margin-right: 30px;}
  .Eng_ComaClass>li:nth-child(-n+3){margin-top: 0;}
  .Eng_ComaClass>li:hover{background:#f9a24a;color: white;border: 0; }
  .Eng_ComaClass>.Eng_Choice{background:#f9a24a;color: white;border: 0; }
  .Eng_ComaClass>.Eng_ChoiceNot{background:#ccc!important;color: white;cursor: not-allowed;border: 0;  }
  .Eng_ComSub{float: left;font-size: 16px;color: #666;font-family: "Microsoft YaHei"; width: 100%;resize: none;box-sizing: border-box;border: 1px solid #ccc;height: 135px;padding: 15px;outline: none;border-radius: 10px;}
  .Eng_ComaRemark{float: left;width: 100%;height: 45px;line-height: 45px;text-align: left;font-size: 16px;color: #ca0d0d;}
  .Eng_ComaBtnFb{float:left;width: 220px;height: 45px;margin: 0 26px;cursor: not-allowed; text-align: center;line-height: 45px;font-size: 18px;border-radius: 10px; color: white;background: #ccc;}
  .Eng_ComaBtnRe{float:left;width: 220px;height: 45px;margin: 0 26px;cursor: pointer; text-align: center;line-height: 45px;font-size: 18px;border-radius: 10px; color: white;background: #65b113;}
  .Eng_ComaBtnCe{float:left;width: 220px;height: 45px;margin: 0 26px;cursor: pointer; text-align: center;line-height: 45px;font-size: 18px;border-radius: 10px; color: white;background: #ccc;}
  /*内容*/
  .Eng_Logo{display: none;}
  .Eng_Art{float: left;width: 100%;box-sizing: border-box;}
  .Eng_Txt{float: left;width: 100%;font-size: 18px;font-weight: bold;height: 40px;line-height: 40px;text-align: center;}
  .Eng_Author{float: left;width: 100%;font-size: 18px;height: 30px;line-height: 30px;text-align: center;}
  .Eng_Main{margin-bottom: 40px;}
  .Eng_Main,.Eng_MainTrans{float: left;width: 100%;box-sizing: border-box;color: #666!important;font-size: 16px;line-height: 30px;}
  .Eng_Main p,.Eng_Main span,.Eng_MainTrans p,.Eng_MainTrans span{font-family: "Microsoft YaHei"!important;}
  /*上一篇下一篇*/
  .Eng_MenuSelect{float: right;box-sizing: border-box;height: 100%;padding-right: 40px;width: 540px;}
  .Eng_MenuSelect>p{float: right;line-height: 58px;color:#333;margin: 0 15px;}
  .Eng_Select{float: right;width: 225px;box-sizing: border-box;color: #333;cursor: pointer;}
  .Eng_Select>p{float: left; width: 160px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;height: 58px; line-height: 58px;}
  .Eng_Select>span{float: left; width: 60px;height: 58px; line-height: 58px;}
  .Eng_Select:hover {color: #65b113;}
  @media screen and (max-width:1365px){
    .Eng_Content{width: 900px;}
  }
  @media screen and (min-width:1366px){
    .Eng_Content{width: 1000px;}
  }
  @media screen and (min-width:1600px){
    .Eng_Content{width: 1200px;}
  }
  @media screen and (max-width:780px){
    .Eng_Menu{ display: none;}
    .Eng_Content{margin: 0;width: 100%;height: 100%;border-radius: 0;padding: 0.3rem 0.3rem 1.5rem 0.3rem ;}
    .Eng_Txt{font-size: 0.5rem;line-height: 2rem;height: 2rem;}
    .Eng_Author{font-size: 0.5rem;line-height: 1rem;height: 1rem;}
    .Eng_Main,.Eng_MainTrans{font-size: 0.35rem;line-height: 0.8rem;}
    .Eng_Logo{height: 1.5rem;display: block;box-sizing: border-box;float: left;width: 100%;border-bottom: 1px solid #ccc;}
    .Eng_Logo>img{float: left;height: 1.5rem;}
    .Eng_Main p,.Eng_Main span,.Eng_MainTrans p,.Eng_MainTrans span{font-family: "Microsoft YaHei"!important;}
    .Eng_MenuSelect{display: none;}
  }
</style>
