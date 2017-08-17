<template>
  <div class="Msg_Main">
    <ul class="Msg_Tab">
      <li :class="{'ThisTab':SysTab == true,'OtherTab':SysTab == false}" @click="TabEvent">系统消息</li>
      <li :class="{'ThisTab':ApplyTab == true,'OtherTab':ApplyTab == false}" @click="TabEvent">消息列表</li>
    </ul>
    <ul  class="Msg_Box" v-if="!NotMsg">
      <li v-for="(SysData,index) in MsgData" v-if="SysTab">
        <div class="Msg_Info">
          <p>{{SysData.content}}</p>
          <p>{{SysData.createDate}}</p>
        </div>
        <p class="Msg_Del" @click="DelSysInfo(SysData.userMessageId)">删除</p>
      </li>
      <li v-for="(ApplyData,index) in MsgData" v-if="!SysTab">
        <div class="Msg_Info">
          <p>{{ApplyData.content}}</p>
          <p>{{ApplyData.createDate}}</p>
        </div>
        <p class="Msg_Del" @click="DelUserInfo(ApplyData.receiveType, ApplyData.userMessageId, ApplyData.senderId)" >删除</p>
        <div :class="{
          'Msg_ResultYes':ApplyData.applystatus ==='1' ||ApplyData.applystatus ==='3',
          'Msg_ResultNo':ApplyData.applystatus ==='0'}"  v-if="ApplyData.applystatus === '0' || ApplyData.applystatus === '1' || ApplyData.applystatus === '3'">
        </div>
        <div class="Msg_Option" v-else>
          <p @click="AgreeApply(ApplyData.receiveType, ApplyData.userMessageId, ApplyData.senderId)" >允许</p>
          <p @click="RefuseApply(ApplyData.receiveType, ApplyData.userMessageId, ApplyData.senderId)" >拒绝</p>
        </div>
      </li>
    </ul>
    <v-page :ToPages="ThisPages" @ListenChild="RecieveChild"  v-if="!NotMsg"></v-page>
    <div class="Msg_Not" v-if="NotMsg">{{NotMsgTxt}}</div>
  </div>


</template>

<script>
  import pages from '../../common/pages'
  export default{
    data () {
      return {
        SysTab: true,
        ApplyTab: false,
        NotMsg: false,
        NotMsgTxt: '',
        NowSysPage:1,
        NowApplyPage:1,
        ThisPages: {},
        MsgData: {}
      }
    },
    components: {
      'v-page': pages
    },
    created () {
      this.UpDataThisPage(1, 1) // 初始化分页组件
    },
    methods: {
      // Tab切换
      TabEvent () {
        this.MsgData = ''
        this.SysTab = !this.SysTab
        this.ApplyTab = !this.ApplyTab
        let LocalPage = parseInt(this.SysTab ? localStorage.getItem('EchoSysPno') : localStorage.getItem('EchoApplyPno'))
        if (!LocalPage) {
          LocalPage = 1
        }
        this.JudgePage(LocalPage) // 初始化分页组件
      },
      // 接收子组件传来的当前页码
      RecieveChild (page) {
        this.JudgePage(page)
      },
      // 判断页码，通过不同的页码读取不同内容
      JudgePage (index) {
        if (this.SysTab) {
          localStorage.setItem('EchoSysPno', index)
          this.GetSysMsg(index)
        } else if (this.ApplyTab) {
          localStorage.setItem('EchoApplyPno', index)
          this.GetApplyMsg(index)
        }
      },
      // 读取系统消息
      GetSysMsg (index) {
        let Subdata = {}
        Subdata.pageSize = 5
        Subdata.pageIndex = index
        this.NowMsgPage = index
        this.$http.post('/web/user/pcSysMessage?' + Math.random(), Subdata, {'emulateJSON': true}).then((response) => {
          if (response.body.retCode === '0000') {
            this.CreatMsgData(response.body.retData)
          }
        })
      },
      // 读取申请消息
      GetApplyMsg (index) {
        let Subdata = {}
        Subdata.pageSize = 5
        Subdata.pageIndex = index
        this.NowSysPage = index
        this.$http.post('/web/user/pcUserMessage?' + Math.random(), Subdata, {'emulateJSON': true}).then((response) => {
          if (response.body.retCode === '0000') {
            this.CreatMsgData(response.body.retData)
          }
        })
      },
      // 创建数据
      CreatMsgData (data) {
        this.MsgData = data.list
        this.JudgeNotMsg(this.MsgData)
        let DiffPage = this.SysTab ? this.NowMsgPage : this.NowSysPage
        let DiffLocal = this.SysTab ? 'EchoSysPno' : 'EchoApplyPno'
        if (this.isEmptyObject(this.MsgData)) {
          this.UpDataThisPage(data.pages, DiffPage)
          this.ThisPages.Local = DiffLocal
        } else {
          this.UpDataThisPage(1, 1)
        }
      },
      // 更新页码数
      UpDataThisPage (Pages, Pno) {
        let Obj = {}
        Obj.Total = Pages // 总页码
        Obj.PnoPage = Pno // 当前页码
        Obj.Role = 0 // 根据角色确认主题颜色
        Obj.Local = '' // tab切换分页的时候记录上一个的上一次页数
        this.ThisPages = Obj
      },
      // 提示
      CommandMsg (tit, msg, type) {
        this.$notify({
          title: tit,
          message: msg,
          type: type
        })
      },
      // 删除系统消息
      DelSysInfo (Id) {
        let SubData = {}
        SubData.userMessageId = Id
        this.$http.post('/web/user/pcDelMessage?' + Math.random(), SubData, {'emulateJSON': true}).then((response) => {
          if (response.body.retCode === '0000') {
            this.GetSysMsg(localStorage.getItem('EchoSysPno'))
            this.CommandMsg('成功', '消息删除成功', 'success')
          } else {
            this.CommandMsg('失败', response.body.retMsg, 'error')
          }
        })
      },
      // 删除申请消息
      DelUserInfo (UserType, Id, SenderId) {
        let SubData = {}
        SubData.userType = UserType
        SubData.userMessageId = Id
        SubData.senderId = SenderId;
        this.$http.post('/web/user/pcDeApplylMessage?' + Math.random(), SubData, {'emulateJSON': true}).then((response) => {
          if (response.body.retCode === '0000') {
            this.GetApplyMsg(localStorage.getItem('EchoApplyPno'))
            this.CommandMsg('成功', '消息删除成功', 'success')
          } else {
            this.CommandMsg('失败', response.body.retMsg, 'error')
          }
        })
      },
      // 拒绝申请消息
      RefuseApply (UserType, Id, SenderId) {
        let SubData = {}
        SubData.userType = UserType
        SubData.userMessageId = Id
        SubData.senderId = SenderId;
        this.$http.post('/web/user/messageApply/refuse?' + Math.random(), SubData, {'emulateJSON': true}).then((response) => {
          if (response.body.retCode === '0000') {
            this.GetApplyMsg(localStorage.getItem('EchoApplyPno'))
            this.CommandMsg('成功', '消息删除成功', 'success')
          } else {
            this.CommandMsg('失败', response.body.retMsg, 'error')
          }
        })
      },
      // 允许申请通过
      AgreeApply (UserType, Id, SenderId) {
        let SubData = {}
        SubData.userType = UserType
        SubData.userMessageId = Id
        SubData.senderId = SenderId;
        this.$http.post('/web/user/messageApply/agree?' + Math.random(), SubData, {'emulateJSON': true}).then((response) => {
          if (response.body.retCode === '0000') {
            this.GetApplyMsg(localStorage.getItem('EchoApplyPno'))
            this.CommandMsg('成功', '消息删除成功', 'success')
          } else {
            this.CommandMsg('失败', response.body.retMsg, 'error')
          }
        })
      },
      // 没有消息的情况
      JudgeNotMsg (obj) {
        if (!this.isEmptyObject(obj)) {
          this.NotMsg = true
          if (this.SysTab) {
            this.NotMsgTxt = '暂无系统消息~'
          } else if (this.ApplyTab) {
            this.NotMsgTxt = '暂无申请消息~'
          }
        } else {
          this.NotMsg = false
          this.NotMsgTxt = ''
        }
      },
      // 判断是否为空
      isEmptyObject (obj) {
        if (obj[0]) {
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
  .Msg_Main{overflow: hidden;margin: 0 auto;box-sizing: border-box;padding-top: 40px;}
  .Msg_Tab{float: left;width: 100%;height: 45px;}
  .Msg_Tab>li{float: left;cursor: pointer; width: 160px;height: 45px;margin-right: 20px; border-radius: 10px;font-size: 18px;line-height: 43px;text-align: center;box-sizing: border-box;}
  .ThisTab{color: white;background: #65B113;border: 1px solid #65B113}
  .OtherTab{color: #333;background: url("/static/common/images/msg/Msg_Tab.jpg") 0 0 repeat;border: 1px solid #ccc;}
  .Msg_Box{margin: 20px 0; float: left;border-radius: 10px;overflow: hidden; width: 100%;height: 600px;background: white;box-sizing: border-box;border: 1px solid #ccc;}
  .Msg_Box>li{height: 20%;box-sizing: border-box;width: 100%;float: left;padding: 20px;}
  .Msg_Box>li:nth-child(2n+1) {background: url("/static/common/images/msg/MsgListico.png")0 0 repeat;}
  .Msg_Box>li:nth-child(2n) {background: white;}
  .Msg_Not{float: left;width: 100%;border-radius: 10px;box-sizing: border-box; height: 600px;line-height: 600px;overflow: hidden;background: white;border: 1px solid #ccc;margin: 20px 0; text-align: center;color: #333;  font-size: 30px;}
  .Msg_Info{float: left;box-sizing: border-box;}
  .Msg_Info>p{float: left;width: 100%;overflow: hidden;line-height: 40px; white-space:nowrap;text-overflow:ellipsis;font-size: 16px;color: #666;}
  .Msg_Del{float: right;font-size: 18px;color: #58C1E4;line-height: 80px; cursor: pointer;}
  .Msg_ResultYes{float: right;width: 100px;height: 100%;overflow: hidden;background: url("/static/common/images/msg/m_OptionicoYes.png")0 center no-repeat;margin-right: 20px;}
  .Msg_ResultNo{float: right;width: 100px;height: 100%;overflow: hidden;background: url("/static/common/images/msg/m_OptionicoNo.png")0 center no-repeat;margin-right: 20px;}
  .Msg_Option{float: right;height: 100%;}
  .Msg_Option>p{float: left;margin-right: 20px;margin-top: 23px; width: 100px;height: 35px;border-radius: 5px;font-size: 18px;color: white;line-height: 35px;text-align: center;cursor: pointer;}
  .Msg_Option>p:first-child{background: #F9A24A;}
  .Msg_Option>p:last-child{background: #58C1E4;}
  @media screen and (max-width:1365px){
    .Msg_Main{width: 900px;}
  }
  @media screen and (min-width:1366px){
    .Msg_Main{width: 1000px;}
  }
  @media screen and (min-width:1600px){
    .Msg_Main{width: 1200px;}
  }
</style>
