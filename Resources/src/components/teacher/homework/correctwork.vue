<template>
  <div class="h_Main" >
    <div class="containter">
      <div class="main">
        <span class='Left' @click="goLeft"><i class='correct fl _left' :class="{'h_leftico_gray':leftgray,'h_rightico_green':leftgreen}"></i></span>
        <div class="stu" id="stuCon" :style="{left:leftRange+'px'}">
          <ul>
            <li class="stuSpan" :class="{'s_active':temp.show,'font_gray':temp.corrected}" v-for="(temp,index) in stuList" :id="temp.userId" :stu_status="temp.status" :ordernum="index+1" @click="showStuPaper($event,temp.userId,index)">
              {{temp.userName}}
              <span class="triangle" :class="{'dino':!temp.show,'dibk':temp.show}"></span>
              <i class="correct_i" :class="{'dino':temp.status!='6'}">√</i>
            </li>
          </ul>
        </div>
        <span class='Right' @click="goRight"><i class='correct fr _right' :class="{'h_rightico_gray':rightgray,'h_rightico_green':rightgreen}"></i></span>
      </div>
      <div>
        <div class="fl_img fl">
          <div id="Canvascon" class="canvas_div" :class="{'noimgDiv':picList.length==0}">
            <v-canvas v-for="(temp,index) in picList" :item="temp" :class="{'dino':index!=0}" ref="child"></v-canvas>
            <img src="/static/teacher/images/test/background.png" alt="" class="Canvaswh">
            <ul class="img_ul">
              <li v-for="temp in picList">
                <img class="change" :id="temp.fileId" :src="temp.imgSrc" @click="showImg(temp.fileId)">
              </li>
            </ul>
            <span class="openPic_span"></span>
            <div class='title_div dino' id="anTitle"><span class='num_span'>{{answerNum}}</span><span class='close_span' @click="closeAnswer">×</span></div>
            <div class="analytical_div dino" id="anContent" v-html="answerHtml"></div>
            <div class="noImg" v-if="picList.length==0">该生未上传图片</div>
          </div>
          <textarea id="comment_area" placeholder="添加批注">{{markText}}</textarea>
        </div>
        <div class="rightContent">
          <ul class="paperList">
            <ul v-for="temp in qList">
              <li class="questionln_li">{{temp.title}}</li>
              <li v-for="item in temp.list" :id="item.questionId" @click="clickquestion(item,$event)" :class="{'change_li':item.selected}">
                <span class="que_num">{{item.qNum}}</span>
                <span class="judge right" :class="{'fn_noclick':item.rflag, 'Red':item.rrSelected, 'green': item.rgSelected, 'yellow': item.rySelected}">√</span>
                <span class="judge wrong" :class="{'fn_noclick':item.wflag, 'Red':item.wrSelected, 'green': item.wgSelected, 'yellow': item.wySelected}">×</span>
                <span class="judge half" :class="{'fn_noclick':item.hflag, 'Red':item.hrSelected, 'green': item.hgSelected, 'yellow': item.hySelected}">√╲</span>
              </li>
            </ul>
          </ul>
          <ul class="nextOne">
            <li class="up_li">
                                <span class="pencil_div fl" :style="pencilColor" @click="changeColor($event)">
                                    <div class="pencil fr" :class="{'disapencil':pen,'change_pencel':pen}"></div>
                                </span>
              <hr>
                                <span class="eraser_div fl" :style="eraserColor" @click="changeColor($event)">
                                    <div class="eraser fl hid" :class="{'disaeraser':eraser,'change_eareser':eraser}"></div>
                                </span>
            </li>
            <hr class="heng">
            <li class="down_li">
              <span class="analytical_span" @click="showAnswer">答案</span>
              <span id="nextStu" class="next_span" @click="afterCorrect" :class="{'h_disable':gray}">{{nextStu}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--<div class="p_LessMoney" id="NoIdentify">-->
    <!--<div class="p_NoIdentifyBg">-->
    <!--<a href="../../model/homework/homework_correct_index.html?pno=1" class="confirm">确定</a>-->
    <!--<a href="" class="cancel">取消</a>-->
    <!--<a href="" class="GoPayClose" id="GoIdentifyClose"></a>-->
    <!--</div>-->
    <!--</div>-->
  </div>
</template>
<script type="text/ecmascript-6">
  import {selectDetails, selectPaper, selectAnswerPicture, selectQueLabelByMongo, nextStudent} from '../../../service/teacher/homework/correctwork.js';
  import {UrlSearch} from '../../../common/js/request.js';//addExperience
  import {contains} from '../../../common/js/common.js'
  import canvas from './canvas.vue'
  export default {
    data() {
      return {
        assignId:'',
        stuList:[],
        ptitle:'',
        qList:[],
        currentPage:1,
        leftRange:'',
        picList:[],
        marksList:[],
        answerNum:'',
        answerHtml:'',
        nextStu:'下一人',
        pencilColor:{'background-color':'rgb(255, 255, 255)'},
        eraserColor:{'background-color':'rgb(255, 255, 255)'},
        pen:false,
        eraser:false,
        imgArray:[],
        offsetLeft:0,
        offsetTop:0,
        results:[],
        markText:'',
        fileId:'',
        userId:'',
        gray: false,
        leftgray:true,
        leftgreen:false,
        rightgray:true,
        rightgreen:false,
        i:0,
        j:0
      };
    },
    mounted() {
      this.showStu()
      this.getOffset()
    },
    methods: {
      getOffset() {
        let Canvascon = document.getElementById('Canvascon')
        this.offsetLeft = Canvascon.offsetLeft
        this.offsetTop = Canvascon.offsetTop
      },
      showStu() {
        this.assignId = UrlSearch('id')
        let para = {'assignId':this.assignId}
        let that = this
        selectDetails(this,para).then(function(response) {
          let res = response.body
          if (res.retCode == '0000') {
            let retData = res.retData
            let flag = true
            let ad = 0
            let correctedNum = 0
            for (let i=0;i<retData.length;i++) {
              let stu = {}
              stu.userId = retData[i].userId
              stu.userName = retData[i].userName
              stu.status = retData[i].status
              if(retData[i].status !== '6') {
                if(flag) {
                  ad = i
                  stu.show = true
                  flag = false
                }
                stu.corrected = false
              } else {
                stu.corrected = true
                if(!flag) {
                  stu.show = false
                }else {
                  correctedNum++
                }
              }
              that.stuList.push(stu)
            }
            if(that.stuList.length===1||ad===that.stuList.length-1) {
              that.nextStu = '完成'
            }
            if(correctedNum === that.stuList.length) {
              that.stuList[0].show = true
            }
            if(that.stuList.length>6) {
              that.rightgray = false
              that.rightgreen = true
            }
            this.userId = res.retData[ad].userId
            that.showPaper(res.retData[ad].userId)
            that.showPicture(res.retData[ad].userId)
          }
        })
      },
      showbtn() {
        let active = document.getElementsByClassName('s_active')[0]
        let status = active.attributes[1].value
        console.log(status)
        if(status=='6') {
          this.gray = true
        } else {
          this.gray = false
        }
      },
      showCorrect() {
        for(var i in this.picList) {
          let markPic = null;
          for (var k in this.marksList) {
            if (this.picList[i].fileId === this.marksList[k].imgPosition) {
              markPic = this.marksList[k].markPic;
              var pro = {};
              pro.answerPicId = this.picList[i].fileId;
              pro.fileStr = markPic;
              pro.flag = "2";
              this.imgArray.push(pro);
            }
          }
        }
      },
      showPaper(userId) {
        let para = {'assignId':this.assignId,'userId':userId}
        let that = this
        this.qList = []
        selectPaper(this,para).then(function(response) {
          let res = response.body
          if (res.retCode == '0000') {
            let retData = res.retData
            this.results = res.retData
            let qNum1 = 1
            let flag = true
            for(let j=0;j<retData.length;j++) {
              let group = {}
              group.title = retData[j].title
              group.list = []
              let list = retData[j].list
              let qNum2 = 1
              if(list) {
                for(let i=0;i<list.length;i++) {
                  let question = {}
                  question.questionId = list[i].questionId
                  if(list[i].groupCode) {
                    if(list[i].isSplite=='0') {
                      if(list[i-1]&&list[i-1].groupCode&&list[i-1].groupCode===list[i].groupCode) {
                        question.qNum = qNum1 + '.' + qNum2
                        qNum2++
                      }else {
                        qNum1++
                        qNum2 = 1
                        question.qNum = qNum1 + '.' + qNum2
                      }
                    }else {
                      question.qNum = qNum1
                      qNum1++
                    }
                  }else {
                    question.qNum = qNum1
                    qNum1++
                  }
                  if(list[i].result=='1') {
                    question.wflag = true
                    question.rflag = false
                    question.hflag = false
                    question.wrSelected = true
                    question.wgSelected = false
                    question.whSelected = false
                    question.rrSelected = false
                    question.rgSelected = false
                    question.rhSelected = false
                    question.hrSelected = false
                    question.hgSelected = false
                    question.hhSelected = false
                  }else if(list[i].result=='0') {
                    question.rflag = true
                    question.wflag = false
                    question.hflag = false
                    question.wrSelected = false
                    question.wgSelected = false
                    question.whSelected = false
                    question.rrSelected = false
                    question.rgSelected = true
                    question.rhSelected = false
                    question.hrSelected = false
                    question.hgSelected = false
                    question.hhSelected = false
                  }else if(list[i].result=='2') {
                    question.rflag = false
                    question.wflag = false
                    question.hflag = true
                    question.wrSelected = false
                    question.wgSelected = false
                    question.whSelected = false
                    question.rrSelected = false
                    question.rgSelected = true
                    question.rhSelected = false
                    question.hrSelected = false
                    question.hgSelected = false
                    question.hhSelected = true
                  }else {
                    question.rflag = false
                    question.wflag = false
                    question.hflag = false
                    question.wrSelected = false
                    question.wgSelected = false
                    question.whSelected = false
                    question.rrSelected = false
                    question.rgSelected = false
                    question.rhSelected = false
                    question.hrSelected = false
                    question.hgSelected = false
                    question.hhSelected = false
                    if(flag) {
                      question.selected = true
                      this.initAnswer(question.qNum,question.questionId)
                      flag = false
                    }else {
                      question.selected = false
                    }
                  }
                  question.result = list[i].result
                  this.results[list[i].questionId] = list[i].result
                  group.list.push(question)
                }
              }
              that.qList.push(group)
            }
          }
        })
      },
      showPicture(userId) {
        let para = {'assignId':this.assignId,'userId':userId}
        let that = this
        this.picList = []
        selectAnswerPicture(this,para).then(function(response) {
          let res = response.body
          if (res.retCode == '0000') {
            that.picList = res.retData.picList
            that.marksList = res.retData.marksList
            that.fileId = res.retData.picList[0].fileId
            that.showCorrect()
          }
        })
      },
      showStuPaper(event,userId,index) {
        let tar = event.target
        let stuSpan = document.getElementsByClassName('s_active')[0]
        stuSpan.classList.remove('s_active')
        stuSpan.children[0].classList.add('dino')
        tar.classList.add('s_active')
        document.getElementsByClassName('dibk')[0].classList.remove('dibk')
        tar.children[0].classList.remove('dino')
        tar.children[0].classList.add('dibk')
        this.userId = userId
        this.showbtn()
        this.showPaper(userId)
        this.showPicture(userId)
        if(this.stuList.length===(index+1)) {
          this.nextStu = '完成'
        } else {
          this.nextStu = '下一人'
        }
      },
      clickquestion(item,event) {
        let tar = event.target
        if(tar.childNodes.length<2) {
          if(!item.result) {
            let classList = tar.classList
            if(contains(classList,'right')) {
              classList.add('green')
              tar.nextElementSibling.classList.remove('Red')
              tar.nextElementSibling.nextElementSibling.classList.remove('yellow')
              this.saveResult(item.questionId,'1')
            }else if(contains(classList,'wrong')) {
              classList.add('Red')
              tar.nextElementSibling.classList.remove('yellow')
              tar.previousElementSibling.classList.remove('green')
              this.saveResult(item.questionId,'1')
            }else {
              classList.add('yellow')
              tar.previousElementSibling.classList.remove('Red')
              tar.previousElementSibling.previousElementSibling.classList.remove('green')
              this.saveResult(item.questionId,'0')
            }
          }
          tar = tar.parentNode
        }
        let selected = document.getElementsByClassName('change_li')
        if(selected.length>0) {
          selected[0].classList.remove('change_li')
        }
        tar.classList.add('change_li')
        let that = this
        this.answerNum = '第' + item.qNum + '题'
        this.createAnswer(item.questionId)
      },
      initAnswer(qNum,questionId) {
        this.answerNum = '第' + qNum + '题'
        this.createAnswer(questionId)
      },
      createAnswer(questionId) {
        let that = this
        let para = {'assignId':this.assignId,'questionId':questionId}
        selectQueLabelByMongo(this,para).then(function(response) {
          let res = response.body
          if (res.retCode == '0000') {
            that.answerHtml = ''
            let htm = '<div class="h_answer"'
            let list = res.retData.list
            for(let i=0;i<list.length;i++) {
              htm += list[i].content
              if(list[i].questionType === "01") {
                if(list[i].optionA!=undefined) {
                  htm += list[i].optionA
                }
                if(list[i].optionB!=undefined) {
                  htm += list[i].optionB
                }
                if(list[i].optionC!=undefined) {
                  htm += list[i].optionC
                }
                if(list[i].optionD!=undefined) {
                  htm += list[i].optionD
                }
              }
            }
            htm += '</div>'
            that.answerHtml = htm
          }
        })
      },
      saveResult(questionId,result) {
        for(let i=0; i<this.results.length; i++) {
            for(let k in this.results[i].list) {
              if(this.results[i].list[k].questionId == questionId) {
                this.results[i].list[k].result = result;
              }
            }
        }
      },
      showAnswer() {
        let len = document.getElementsByClassName('change_li').length
        if(len===0) {
          return
        }
        document.getElementById('anTitle').classList.remove('dino')
        document.getElementById('anContent').classList.remove('dino')
      },
      closeAnswer() {
        document.getElementById('anTitle').classList.add('dino')
        document.getElementById('anContent').classList.add('dino')
      },
      showImg(fileId) {
        let canvases = document.getElementsByClassName('Canvas')
        for(let i=0;i<canvases.length;i++) {
          if(!contains(canvases[i].classList,'dino')) {
            canvases[i].classList.add('dino')
          }
        }
        let id = fileId + 'canvas'
        document.getElementById(id).classList.remove('dino')
     },
      changeColor(event) {
        let tar = event.target
        if(contains(tar.classList,'pencil')||contains(tar.classList,'pencil_div')) {
          this.pencilColor = {'background-color':'rgb(250, 162, 73)'}
          this.eraserColor = {'background-color':'rgb(255, 255, 255)'}
          this.pen = true
          this.eraser = false
          tar.parentNode.nextElementSibling.classList.add('addBorder')
        }else {
          this.eraserColor = {'background-color':'rgb(250, 162, 73)'}
          this.pencilColor = {'background-color':'rgb(255, 255, 255)'}
          this.pen = false
          this.eraser = true
          let children = this.$refs.child
          for(let i=0;i<children.length;i++) {
            let child = children[0]
            if(this.fileId === child.item.fileId) {
              child.goBack()
            }
          }
        }
      },
      goRight() {
        let stu = document.getElementById('stuCon')
        let pageSize = 7
        let scrollWidth
        if(stu.offsetWidth === 900) {
          scrollWidth=882;
          pageSize = 6;
        }else if(stu.offsetWidth === 882) {
          scrollWidth=882;
          pageSize = 6;
        }else if(stu.offsetWidth === 1045) {
          scrollWidth=1029;
        }
        let totalPage = Math.ceil(this.stuList.length / pageSize)//计算总页数
        if (this.currentPage === totalPage) {
          return false
        } else if(this.currentPage === totalPage-1) {
          this.leftRange = this.currentPage * -scrollWidth
          this.currentPage++
          this.rightgray = true
          this.rightgreen = false
        } else {
          this.leftRange = this.currentPage * -scrollWidth
          this.currentPage++
          this.rightgray = false
          this.rightgreen = true
        }
      },
      goLeft() {
        let stu = document.getElementById('stuCon')
        let pageSize = 7
        let scrollWidth
        if(stu.offsetWidth === 900) {
          scrollWidth=882;
          pageSize = 6;
        }else if(stu.offsetWidth === 882) {
          scrollWidth=882;
          pageSize = 6;
        }else if(stu.offsetWidth === 1045) {
          scrollWidth=1029;
        }
        if (this.currentPage === 1) {
          this.leftgray = true
          this.leftgreen = false
          return false
        } else if(this.currentPage === 2) {
          this.currentPage--
          this.leftRange = (this.currentPage-1)*(-scrollWidth)
          this.leftgray = false
          this.leftgreen = true
        } else {
          this.currentPage--
          this.leftRange = (this.currentPage-1)*(-scrollWidth)
          this.leftgray = false
          this.leftgreen = true
        }
      },
      afterCorrect() {
        let that = this
        let active = document.getElementsByClassName('s_active')[0]
        let status = active.attributes[1]
        let id = active.id
        if(status === 6) {
          return
        } else {
        for(let i=0; i<this.results.length; i++) {
          for(let k in this.results[i].list) {
            if(this.results[i].list[k].result == null) {
              console.log('您还有试题没有批改!')
              return
            }
          }
        }
        }
        let param = {}
        param.userId = id
        param.assignId = this.assignId
        if(this.imgArray.length>0) {
          param.filesStr = JSON.stringify(this.imgArray)
        }
        param.resultsStr = JSON.stringify(this.results)
        param.totalRemarks = this.markText
        nextStudent(this,param).then(function(response) {
          let res = response.body
          if (res.retCode == '0000') {
            for(let i=0;i<that.stuList.length;i++) {
              if(that.stuList[i].userId === res.retData) {
                if(i === that.stuList.length-1) {
                  that.nextStu = '完成'
                  that.$router.push('/content/teacher/homework/correctworklist')
                } else {
                  let userId = that.stuList[i+1].userId
                  this.userId = userId
                  that.showPaper(userId)
                  that.showPicture(userId)
                }
              }
            }
          }
        })
      }
    },
    components:{
      'v-canvas':canvas
    }
  };
</script>
<style>
  @import '../../../../static/common/css/common.css';
  @media screen and (max-width:1366px){
    .containter{
      width:1000px;
      height:auto;
      margin: 0 auto;
    }
    .main{
      width:1000px;
      height:48px;
      margin:0 auto;
      position: relative;
      margin-top:20px;
      margin-bottom: 40px;
    }
    .stu{
      width: 900px;
      height:65px;
      margin:0 auto;
      overflow: hidden;
      position: relative;
    }
    .stu ul{
      width:auto;
      height:56px;
      position: absolute;
      top:0;
      z-index: 1;
      margin-top:8px;
    }
    .stuSpan{
      float: left;
      border: 1px solid #CCCCCC;
      background-color: #ffffff;
      width: 117px;
      height: 43px;
      line-height: 43px;
      text-align: center;
      margin: 0 14px;
      margin-bottom: 20px;
      position: relative;
      border-radius: 5px;
      cursor: pointer;
      color: #858585;
    }
    .triple{
      position: absolute;
      left:56px;
      top:44px;
    }
    ._left{
      position: absolute;
      left:0;
      top:7px;
      z-index: 0;
      cursor: pointer;
    }
    ._right{
      position: absolute;
      right:0;
      top:7px;
      z-index: 0;
      cursor: pointer;
    }
    .rightContent{
      width:280px;
      height:669px;
      float:right;
      border-radius: 4px;
    }
    .paperList{
      width:258px;
      height:260px;
      background: #fff;
      border-radius: 10px;
      padding:15px 10px;
      overflow-y :auto;
    }
    .paperList li{
      height:30px;
      color:#333;
      margin-bottom: 15px;
    }
    .nextOne{
      width:280px;
      height:230px;
      background: #fff;
      border-radius: 10px;
      margin-top:20px;
    }
    .fl_img {
      width: 700px;
    }

    .fl_img .canvas_div {
      width: 700px;
      height: 478px;
      position: relative;
    }
    .Canvas {
      width: 700px;
      height: 478px;
      background-repeat:no-repeat;
      background-position: center;
      background-size: auto 100%;
      background-size: cover;
    }
    .Canvaswh {
      width: 700px;
      height: 474px;
      display: none;
    }
    .fl_img textarea {
      width: 700px;
      height: 64px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      resize: none;
      text-indent: 20px;
      line-height: 21px;
      font-size: 16px;
      color: #999;
      background: #fff;
    }
    .img_ul li img {
      width: 110px !important;
      height: 82px !important;
      float: left;
      margin:0 2px 0 0;
      cursor: pointer;
    }
    .img_ul li .change {
      width: 130px !important;
      height: 97px !important;
      top: -15px;
      position: relative;
    }
    .img_ul {
      position: absolute;
      top: 396px;
      display: -webkit-box;
    }
    .analytical_div {
      width: 400px;
      height: 302px;
      right: 0;
      bottom: -62px;
      background-color: #ffffff;
      border: 1px solid #A9A9A9;
      border-radius: 5px;
      overflow: hidden;
      overflow-y: auto;
      position: absolute;
      overflow-x: auto;
      padding: 0 15px;
    }
    .close_span {
      right: 0;
      width: 25px;
      height: 25px;
      text-align: center;
      line-height: 25px;
      cursor: pointer;
      float: right;
      font-size: 25px;
      margin-top: 4px;
    }
    .paperList li .que_num {
      display: block;
      float: left;
      width: 48px;
      text-align: center;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
    }
    .paperList li .judge {
      display: block;
      float: left;
      width: 30px;
      text-align: center;
      height: 24px;
      margin-right: 11px;
      cursor: pointer;
      padding:2px 10px;
      border:1px solid #ccc;
      background-color: #ffffff;
    }
    .Red{
      background: #f00 !important;
      color: #ffffff !important;
    }
    .green {
      background: #65B113 !important;
      color: #ffffff !important;
    }
    .yellow {
      background: #FAA24A !important;
      color: #ffffff !important;
    }
    .half {
      letter-spacing: -7px;
      text-indent : -7px;
    }
    .up_li {
      height: 80px;
    }
    .up_li div {
      background-image: url(/static/common/images/sprite/correct_sprite.png);
      background-repeat: no-repeat;
      margin: 0 46px;
      cursor: pointer;
    }
    .up_li hr {
      float: left;
      height: 50px;
      margin-top: 19px;
    }
    .down_li {
      height: 95px;
      padding: 7px 0px;
    }
    .down_li span {
      display: block;
      width: 150px;
      height: 45px;
      text-align: center;
      line-height: 40px;
      border-radius: 10px;
      margin: 10px 20px 20px 65px;
      color: #ffffff;
      cursor: pointer;
      font-size:18px;
    }
    .down_li .analytical_span {
      background-color: #65b113;
    }
    .down_li .next_span {
      background-color: #65b113;
    }
    .questionln_li {
      height: auto !important;
    }
    .title_div {
      width: 395px;
    }
  }
  @media screen and (min-width: 1366px){
    .containter{
      width:1080px;
      height:auto;
      margin: 0 auto;
    }
    .main{
      width:1080px;
      height:48px;
      margin:0 auto;
      position: relative;
      margin-top:20px;
      margin-bottom: 40px;
    }
    .stu{
      width: 882px;
      height:65px;
      margin:0 auto;
      overflow: hidden;
      position: relative;
    }
    .stu ul{
      width:auto;
      height:56px;
      position: absolute;
      top:0;
      z-index: 1;
      margin-top:8px;
    }
    .stuSpan{
      float: left;
      border: 1px solid #CCCCCC;
      background-color: #ffffff;
      width: 117px;
      height: 43px;
      line-height: 43px;
      text-align: center;
      margin: 0 14px;
      margin-bottom: 20px;
      position: relative;
      border-radius: 5px;
      cursor: pointer;
      color: #858585;
    }
    .triple{
      position: absolute;
      left:56px;
      top:44px;
    }
    ._left{
      position: absolute;
      left:0;
      top:7px;
      z-index: 0;
      cursor: pointer;
    }
    ._right{
      position: absolute;
      right:0;
      top:7px;
      z-index: 0;
      cursor: pointer;
    }
    .rightContent{
      width:280px;
      height:608px;
      float:right;
      border-radius: 4px;
    }
    .paperList{
      width:258px;
      height:321px;
      background: #fff;
      border-radius: 10px;
      padding:15px 10px;
      overflow-y :auto;
    }
    .paperList li{
      height:30px;
      color:#333;
      margin-bottom: 15px;
    }
    .nextOne{
      width:280px;
      height:237px;
      background: #fff;
      border-radius: 10px;
      margin-top:20px;
    }
    .fl_img {
      width: 780px;
    }

    .fl_img .canvas_div {
      width: 780px;
      height: 546px;
      position: relative;
    }
    .Canvas {
      width: 780px;
      height: 546px;
      background-repeat:no-repeat;
      background-position: center;
      background-size: cover;
    }
    .Canvaswh {
      width: 780px;
      height: 542px;
      display: none;
    }
    .fl_img textarea {
      width: 780px;
      height: 64px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      resize: none;
      text-indent: 20px;
      line-height: 21px;
      font-size: 16px;
      color: #999;
      background: #fff;
    }
    .img_ul li img {
      width: 110px !important;
      height: 82px !important;
      float: left;
      margin:0 2px 0 0;
      cursor: pointer;
    }
    .img_ul li .change {
      width: 130px !important;
      height: 97px !important;
      top: -15px;
      position: relative;
    }
    .img_ul {
      position: absolute;
      top: 464px;
      display: -webkit-box;
    }
    .analytical_div {
      width: 360px;
      height: 270px;
      right: 0;
      bottom: -54px;
      background-color: #ffffff;
      border: 1px solid #A9A9A9;
      border-radius: 5px;
      overflow: hidden;
      overflow-y: auto;
      position: absolute;
      overflow-x: auto;
      padding: 0 15px;
    }
    .close_span {
      right: 0;
      width: 25px;
      height: 25px;
      text-align: center;
      line-height: 25px;
      cursor: pointer;
      float: right;
      font-size: 25px;
      margin-top: 4px;
    }
    .paperList li .que_num {
      display: block;
      float: left;
      width: 48px;
      text-align: center;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
    }
    .paperList li .judge {
      display: block;
      float: left;
      width: 30px;
      text-align: center;
      height: 24px;
      margin-right: 11px;
      cursor: pointer;
      padding:2px 10px;
      border:1px solid #ccc;
      background-color: #ffffff;
    }
    .Red{
      background: #f00 !important;
      color: #ffffff !important;
    }
    .green {
      background: #65B113 !important;
      color: #ffffff !important;
    }
    .yellow {
      background: #FAA24A !important;
      color: #ffffff !important;
    }
    .half {
      letter-spacing: -7px;
      text-indent : -7px;
    }
    .up_li {
      height: 80px;
    }
    .up_li div {
      background-image: url(/static/common/images/sprite/correct_sprite.png);
      background-repeat: no-repeat;
      margin: 0 46px;
      cursor: pointer;
    }
    .up_li hr {
      float: left;
      height: 50px;
      margin-top: 19px;
    }
    .down_li {
      height: 95px;
      padding: 7px 0px;
    }
    .down_li span {
      display: block;
      width: 150px;
      height: 45px;
      text-align: center;
      line-height: 40px;
      border-radius: 10px;
      margin: 10px 20px 20px 65px;
      color: #ffffff;
      cursor: pointer;
      font-size:18px;
    }
    .down_li .analytical_span {
      background-color: #65b113;
    }
    .down_li .next_span {
      background-color: #65b113;
    }
    .questionln_li {
      height: auto !important;
    }
    .title_div {
      width: 356px;
    }
  }
  @media screen and (min-width: 1600px){

    .containter{
      width:1200px;
      height:auto;
      margin: 0 auto;
    }
    .main{
      width:1200px;
      height:48px;
      margin:0 auto;
      position: relative;
      margin-top:20px;
      margin-bottom: 40px;
    }
    .stu{
      width: 1045px;
      height:65px;
      margin:0 auto;
      overflow: hidden;
      position: relative;
    }
    .stu ul{
      width:auto;
      height:56px;
      position: absolute;
      top:0;
      z-index: 1;
      margin-top:8px;
    }
    .stuSpan{
      float: left;
      border: 1px solid #CCCCCC;
      background-color: #ffffff;
      width: 117px;
      height: 43px;
      line-height: 43px;
      text-align: center;
      margin: 0 14px;
      margin-bottom: 20px;
      position: relative;
      border-radius: 5px;
      cursor: pointer;
      color: #858585;
    }
    .triple{
      position: absolute;
      left:56px;
      top:44px;
    }
    ._left{
      position: absolute;
      left:0;
      top:7px;
      z-index: 0;
      cursor: pointer;
    }
    ._right{
      position: absolute;
      right:0;
      top:7px;
      z-index: 0;
      cursor: pointer;
    }
    .rightContent{
      width:280px;
      height:669px;
      float:right;
      border-radius: 4px;
    }
    .paperList{
      width:258px;
      height:390px;
      background: #fff;
      border-radius: 10px;
      padding:15px 10px;
      overflow-y :auto;
    }
    .paperList li{
      height:30px;
      color:#333;
      margin-bottom: 15px;
    }
    .nextOne{
      width:280px;
      height:230px;
      background: #fff;
      border-radius: 10px;
      margin-top:20px;
    }
    .fl_img {
      width: 900px;
    }

    .fl_img .canvas_div {
      width: 900px;
      height: 607px;
      position: relative;
    }
    .Canvas {
      width: 900px;
      height: 607px;
      background-repeat:no-repeat;
      background-position: center;
      background-size: auto 100%;
    }
    .Canvaswh {
      width: 900px;
      height: 607px;
      display: none;
    }
    .fl_img textarea {
      width: 900px;
      height: 64px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      resize: none;
      text-indent: 20px;
      line-height: 21px;
      font-size: 16px;
      color: #999;
      background: #fff;
    }
    .img_ul li img {
      width: 110px !important;
      height: 82px !important;
      float: left;
      margin:0 2px 0 0;
      cursor: pointer;
    }
    .img_ul li .change {
      width: 130px !important;
      height: 97px !important;
      top: -15px;
      position: relative;
    }
    .img_ul {
      position: absolute;
      top: 525px;
      display: -webkit-box;
    }
    .analytical_div {
      width: 400px;
      height: 302px;
      right: 0;
      bottom: -62px;
      background-color: #ffffff;
      border: 1px solid #A9A9A9;
      border-radius: 5px;
      overflow: hidden;
      overflow-y: auto;
      position: absolute;
      overflow-x: auto;
      padding: 0 15px;
    }
    .close_span {
      right: 0;
      width: 25px;
      height: 25px;
      text-align: center;
      line-height: 25px;
      cursor: pointer;
      float: right;
      font-size: 25px;
      margin-top: 4px;
    }
    .paperList li .que_num {
      display: block;
      float: left;
      width: 48px;
      text-align: center;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
    }
    .paperList li .judge {
      display: block;
      float: left;
      width: 30px;
      text-align: center;
      height: 24px;
      margin-right: 11px;
      cursor: pointer;
      padding:2px 10px;
      border:1px solid #ccc;
      background-color: #ffffff;
    }
    .Red{
      background: #f00 !important;
      color: #ffffff !important;
    }
    .green {
      background: #65B113 !important;
      color: #ffffff !important;
    }
    .yellow {
      background: #FAA24A !important;
      color: #ffffff !important;
    }
    .half {
      letter-spacing: -7px;
      text-indent : -7px;
    }
    .up_li {
      height: 80px;
    }
    .up_li div {
      background-image: url(/static/common/images/sprite/correct_sprite.png);
      background-repeat: no-repeat;
      margin: 0 46px;
      cursor: pointer;
    }
    .up_li hr {
      float: left;
      height: 50px;
      margin-top: 19px;
    }
    .down_li {
      height: 95px;
      padding: 7px 0px;
    }
    .down_li span {
      display: block;
      width: 150px;
      height: 45px;
      text-align: center;
      line-height: 40px;
      border-radius: 10px;
      margin: 10px 20px 20px 65px;
      color: #ffffff;
      cursor: pointer;
      font-size:18px;
    }
    .down_li .analytical_span {
      background-color: #65b113;
    }
    .down_li .next_span {
      background-color: #65b113;
    }
    .questionln_li {
      height: auto !important;
    }
    .title_div {
      width: 396px;
    }
  }
  .font_green {
    color: #67b21a;
  }
  .dibk{display: block;}
  .h_Main{width: 100%;float: left;background: #ecedf0;box-sizing: border-box;min-height: 780px;;padding-bottom: 40px;}
  .h_disable{background-color: rgb(204, 204, 204)!important;}
  .eraser {
    background-position: 0px -350px;
    width: 48px;
    height: 34px;
    margin-top: 28px !important;
  }
  .disaeraser {
    background-position: 0px -316px;
    width: 48px;
    height: 34px;
    margin-top: 28px !important;
  }
  .pencil {
    background-position: 0px -91px;
    width: 41px;
    height: 41px;
    margin-top: 24px !important;
  }
  .disapencil {
    background-position: 0px -51px;
    width: 41px;
    height: 41px;
    margin-top: 24px !important;
  }
  .p_LessMoney{display: none; z-index: 99999; position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: black;background: rgba(0,0,0,0.5);}
  .p_LessMoneyBg{width: 670px;height: 352px;position: absolute;bottom: 0;top: 0;left: 0;right: 0;margin: auto;background: url("/static/common/images/sprite/bg.png") 0 0 no-repeat;border-radius: 10px;overflow: hidden;}
  .p_NoIdentifyBg{width: 670px;height: 352px;position: absolute;bottom: 0;top: 0;left: 0;right: 0;margin: auto;background: url("/static/teacher/images/homework/exit.png") 0 0 no-repeat;border-radius: 10px;overflow: hidden;}
  .confirm{position: absolute;bottom: 15px;right: 230px;left: 0;margin: auto; width: 190px;height: 45px;text-align: center;line-height: 45px;font-size: 18px;float: left; color: white;background: #8ed6ee;border-radius: 10px;}
  .cancel{position: absolute;bottom: 15px;right: 0;left: 230px;margin: auto; width: 190px;height: 45px;text-align: center;line-height: 45px;font-size: 18px;float: left; color: white;background: #CCCCCC;border-radius: 10px;}
  .GoPayClose{opacity: 0;filter: alpha(opacity=0);  width: 35px;height: 40px;position: absolute;top: 0;right: 21px;cursor: pointer;}
  .triangle {
    width: 0px;
    height: 0px;
    margin: 0 auto;
    margin-top: 3px;
    border-right: 10px solid #ecedf0;
    border-bottom: 10px solid #67b21a;
    border-left: 10px solid #ecedf0;
  }
  .font_gray {
    border: 1px solid #67b21a;
    color: #67b21a;
  }
  .openPic_span {
    width: 50px;
    height: 50px;
    position: absolute;
    background-image: url(../../../../static/teacher/images/homework/open.png);
    background-size: 100% 100%;
    cursor: pointer;
    float: left;
    display: none;
    bottom: 21px;
    left: 0px;
  }
  .closePic_span {
    display: block;
    width: 50px;
    height: 50px;
    position: relative;
    background-image: url(../../../../static/teacher/images/homework/close.png);
    background-size: 100% 100%;
    cursor: pointer;
    top: 16px;
    margin: 0;
    float: left;
  }
  .late_i {
    position: absolute;
    display: block;
    width: 30px;
    height: 30px;
    font-size: 12px;
    background-color: #ca0d0d;
    top: -9px;
    right: -14px;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    color: #fff;
  }
  .correct_i{
    position: absolute;
    display: block;
    width: 25px;
    height: 25px;
    font-size: 16px;
    background-color: #65b113;
    top: -9px;
    left: -12px;
    border-radius: 50%;
    text-align: center;
    line-height: 25px;
    color: #fff;
  }
  .nobackcolor {
    background-color: #ccc !important;
    color: #fff !important;
  }
  .change_que_num {
    color: #65B113;
  }
  .noImg {
    color: red;
    text-align: center;
    font-size: 25px;
    margin-top: 155px;
    width: 100%;
    float: left;
  }
  .noimgDiv {
    border: 1px solid #cccccc;
    border-radius: 10px 10px 0 0;
  }
  .nextOne .heng {
    margin: 0;
  }
  .pencil_div,.eraser_div {
    width: 139px;
    height: 88px;
  }
  .pencil_div {
    border-top-left-radius: 10px;
  }
  .eraser_div {
    border-top-right-radius: 10px;
  }
  .change_pencel {
    background-image: url("../../../../static/common/images/sprite/eareser3.png") !important;
    background-repeat: inherit !important;
    background-position: 0px -80px !important;
    height: 40px !important;
  }
  .change_eareser {
    background-image: url("../../../../static/common/images/sprite/pensor3.png") !important;
    background-repeat: inherit !important;
    background-position: 0 0 !important;
  }

  .change_li {
    height: 35px !important;
    padding-top: 5px;
    background: rgba(243, 161, 78, 0.65);
  }
  .s_active {
    border: 1px solid #67b21a;
    color: #67b21a;
  }
  .Canvas {

    border-color: #ccc;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-size:cover;
  }
  .fl_img textarea {
    border: 1px solid #ccc;
  }
  .paperList {

  }
  .nextOne {

  }
  .addBorder {
    border:1px solid #ffffff;
  }
  .title_div {
    float: right;
    height: 35px;
    border-bottom: 1px solid #DDDDDD;
    background: #fff;
    position: absolute;
    padding-bottom: 1px;
    right: 30px;
    bottom: 204px;
    z-index: 100;
  }
  .num_span {
    float: left;
    margin-top: 6px;
    margin-left: 9px;
    font-size: 18px;
  }
  .h_answer{
    margin-top:45px;
  }
</style>
