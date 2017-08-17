<template>
  <div class="container">
    <div class="m_paper">
      <div class="paperName">{{paperName}}</div>
      <ul class="print_list" id="printDiv">
        <li class="lineBox slot-item" v-for="temp in questions">
          <div class="saveLine questionContext" v-html="temp.content"></div>
          <div class="print_btn">
            <span><a class="lookExplore fr" href="javascript:;" @click="lookAnalyse">查看解析</a></span>
          </div>
          <div class="analysisBox dino">
            <div v-for="label in temp.labels" :id="label.questionId" v-html="label.content" v-if="label.questionType!='07'"></div>
          </div>
        </li>
      </ul>
    </div>
    <div class="m_btnBox">
      <span class="m_btn m_btnPublish" @click="openBox">布置</span>
      <span id="w_PrintBtn" class="m_btn m_btnLayout" @click="openPrint">打印</span>
    </div>
    <div class="m_publish" v-if="pFlag">
      <i class="spriteImg c_closeico fr c_closeimg0" id="c_closeG1" @click="closePrint"></i>
      <p class="noAnalyze" @click="toPrint">无解析打印</p>
      <p class="hasAnalyze" @click="toPrintA">有解析打印</p>
    </div>
    <v-publishbox :paperInfo="paperInfo"></v-publishbox>
  </div>
</template>
<script type="text/ecmascript-6">
  import {UrlSearch} from '../../../common/js/request.js';
  import publishbox from '../../basic/homework/publishbox.vue'
    export default {
      data() {
        return {
          paperName:'',
          questions:[],
          paperInfo:{show:false},
          pFlag:false
        };
      },
      mounted() {
        this.getPaper()
      },
      methods: {
        getPaper() {
          let para = {}
          para.paperType = UrlSearch('paperType')
          para.paperId = UrlSearch('paperId')
          this.paperInfo.paperType = UrlSearch('paperType')
          this.paperInfo.assignId = UrlSearch('assignId')
          this.$http.post('/web/teacher/paper/assign/paperinfowithidtype', para, {'emulateJSON': true}).then(function(response) {
            let retCode = response.body.retCode
            if(retCode === '0000') {
              let retData = response.body.retData
              this.paperName = retData.paperName
              this.paperInfo.score = retData.score
              this.paperInfo.paperName = retData.paperName
              this.paperInfo.paperId = retData.paperId
              this.paperInfo.testTime = retData.testTime
              let questionLines = retData.questionLines
              let n = 0
              for(let i=0;i<questionLines.length;i++) {
                let questionGroup = questionLines[i].questionGroup
                for(let j=0;j<questionGroup.length;j++) {
                  let questions = questionGroup[j].questions
                  for(let k=0;k<questions.length;k++) {
                    let question = {}
                    if(questions[k].groupCode) {
//
                    }else {
                      n++
                      question.groupCode = null
                      question.isSplite = null
                      question.questionTypeId = questions[k].questionTypeId
                      question.questionId = questions[k].questionId
                      let numStr = '<span class="m_order">' + n + '.</span>'
                      question.content = questions[k].questionTitle.replace("题干", numStr).replace("【", "").replace("】", "")
                      if(question.questionTypeId === '01') {
                        if(questions[k].optionA) {
                          question.content += questions[k].optionA
                        }
                        if(questions[k].optionB) {
                          question.content += questions[k].optionB
                        }
                        if(questions[k].optionC) {
                          question.content += questions[k].optionC
                        }
                        if(questions[k].optionD) {
                          question.content += questions[k].optionD
                        }
                      }
                      question.labels = questions[k].labels
                      this.questions.push(question)
                    }
                  }
                }
              }
            }
          })
        },
        initOrder() {
          let nums = document.getElementsByClassName('m_order')
          for(let i=0;i<nums.length;i++) {
            nums[0].innerText = i+1+'.'
          }
        },
        lookAnalyse(e) {
          let text = e.target.innerText
          if(text === '查看解析') {
            e.target.innerText = '收起解析'
            e.target.parentNode.parentNode.nextElementSibling.classList.remove('dino')
          }else {
            e.target.innerText = '查看解析'
            e.target.parentNode.parentNode.nextElementSibling.classList.add('dino')
          }
        },
        openBox() {
//          this.$http.post('/web/teacher/paper/assign/assignclass').then(function(response) {
//            let retCode = response.body.retCode
//            if(retCode === '0000') {
//              let retData = response.body.retData
//              if(retData.length>0) {
//                this.paperInfo.show = true
//              }
//            }
//          })
        },
        openPrint() {
          this.pFlag = true
          console.log(this.pFlag)
        },
        closePrint() {
          this.pFlag = false
        },
        toPrint() {
          let print_btns = document.getElementsByClassName('print_btn')
          for(let i=0;i<print_btns.length;i++) {
            print_btns[i].style.display = 'none'
          }
          let analysisBox = document.getElementsByClassName('analysisBox')
          for(let i=0;i<analysisBox.length;i++) {
            analysisBox[i].style.display = 'none'
          }
          let newWindow = window.open("_blank")//打开新窗口
          let codestr = document.getElementById("printDiv").innerHTML//获取需要生成pdf页面的div代码
          newWindow.document.write(codestr)//向文档写入HTML表达式或者JavaScript代码
          newWindow.document.close()//关闭document的输出流, 显示选定的数据
          newWindow.print()//打印当前窗口
          for(let i=0;i<print_btns.length;i++) {
            print_btns[i].style.display = 'block'
          }
          for(let i=0;i<analysisBox.length;i++) {
            analysisBox[i].style.display = ''
          }
        },
        toPrintA() {
          let print_btns = document.getElementsByClassName('print_btn')
          for(let i=0;i<print_btns.length;i++) {
            print_btns[i].style.display = 'none'
          }
          let newWindow = window.open("_blank")//打开新窗口
          let codestr = document.getElementById("printDiv").innerHTML//获取需要生成pdf页面的div代码
          newWindow.document.write(codestr)//向文档写入HTML表达式或者JavaScript代码
          newWindow.document.close()//关闭document的输出流, 显示选定的数据
          newWindow.print()//打印当前窗口
          for(let i=0;i<print_btns.length;i++) {
            print_btns[i].style.display = 'block'
          }
        }
      },
      components: {
        'v-publishbox':publishbox
      }
    };
</script>
<style>
  .m_btn:hover{cursor:pointer;}
  .print_btn{margin:10px 0;overflow: hidden;}
  .reflesh:hover{cursor: pointer;}
  .print_btn span a {
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 76px;
    height: 31px;
    display: block;
    line-height: 31px;
    float: right;
    font-size: 15px;
    text-align: center;
    color: #333;
  }
  .print_btn span a:hover{background: #65b113;color:#fff;}
  .m_con4:hover{cursor:pointer;}
  .m_select li{cursor:pointer;}
  .e_active{background:#f9a24a;color:#fff!important;border:1px solid #f9a24a;}
  .slot-item:hover{border-radius: 8px;border: 1px solid #ccc;}
  .slot-item{border-radius: 8px;border: 1px solid #ffffff;}
  .error_source_txt{
    position: relative;
  }
  .l_active{color:#65b113;}
  .every_level:hover{cursor:pointer;}
  .slot-item{padding:0 20px;}
  .m_paper{
    margin-bottom:40px;
  }
  .m_btnBox{
    position: fixed;
    bottom:30px;
    right:19%;
  }
  .m_btn {
    background: #65b113;
    color: #fff;
    border-radius: 10px;
    width: 190px;
    font-size: 18px;
    height: 45px;
    display: block;
    text-align: center;
    line-height: 45px;
    margin-right: 10px;
    float: left;
  }
  .mask{
    display: none;
    width:100%;
    min-height:768px;
    height:100%;
    position: absolute;
    left:0;
    top:0;
    background: #000;
    opacity: 0.5;
    filter: alpha(opacity=50);
    -moz-opacity:0.5;
    z-index: 1111;
  }
  #c_closeG{
    margin-right:20px;
  }
  /*打印*/
  .m_publish{
    position: absolute;
    top:30%;
    left:30%;
    z-index: 1112;
    background: #fff;
    width:600px;
    height:300px;
    border:1px solid #ccc;
    border-radius: 5px;
    /*  background: url("../../image/me/workPubSuccess.png") no-repeat center;*/
  }
  .m_publish p{
    color:#fff;
    width:140px;
    height:50px;
    line-height: 50px;
    text-align: center;
    border-radius: 5px;

  }
  .m_publish .noAnalyze{
    background: #59c1e4;
    border:1px solid #59c1e4;
    position: absolute;
    left:150px;
    top:100px;
  }
  .m_publish .hasAnalyze{
    background: #faa249;
    border:1px solid #faa249;
    position: absolute;
    right:150px;
    top:100px;
    cursor: pointer;
  }
  .paperName{margin: 0 auto;text-align: center;}
  .testTime{margin: 0 auto;text-align: center;}
  .print_list{padding:20px;}
  @media screen and (min-width: 1600px){
    .container{
      width:1200px;
      height:auto;
      min-height: 768px;
      margin:0 auto;
      margin-top:30px;
      background: #fff;
      border-radius: 10px;

      padding:10px;
      font-size:18px;
      position: relative;
    }
  }
  @media screen and (max-width: 1599px) and (min-width: 1366px){
    .container{
      width:1000px;
      height:auto;
      min-height: 768px;
      margin:0 auto;
      margin-top:30px;
      background: #fff;
      border-radius: 10px;

      padding:10px;
      font-size:16px;
      position: relative;
    }
    .edit{width: 1300px;}
  }
  @media screen and (max-width: 1365px){
    .container{
      width:900px;
      height:auto;
      min-height: 768px;
      margin:0 auto;
      margin-top:30px;
      background: #fff;
      border-radius: 10px;

      padding:10px;
      font-size:14px;
      position: relative;
    }
    .edit{width: 1000px;}
  }
  .questionContext {
    color: #333 !important;
  }
  .option {
    margin-top: 7px;
    margin-left: 9px;
    color: #666 !important;
    font-family: "宋体";
    font-size: 17px;
  }
  .option *{
    color: #666 !important;
    font-family: "宋体";
    font-size: 17px;

  }
  .analysisBox p span {
    font-family: "楷体" !important;
    font-size: 17px !important;
    color: #666 !important;
  }
  /*如果没有数据*/.data_Popup{position: fixed;top: 0;left: 0;bottom: 0;z-index:10000;display: none;width: 100%;background: rgba(0,0,0,0.3);}
  .data_Popup .in{position: absolute;top: 50%;left: 50%;z-index: 1010;overflow: hidden;border-radius: 8px;background: #fff;}
  .data_Popup .in > img{width: 100%;}
  .data_Popup .in .close{position: absolute;top: 0;right: 30px;display: block;width: 34px;height: 38px;overflow: hidden;text-indent: -10em;border-radius: 0 0 17px 17px;background: #f96672 url("/static/teacher/images/homework/data_Popup_btn.png") no-repeat 0 0;cursor: pointer;}
  .data_Popup .in .close:hover{background-color: #f05865;}
  .data_Popup .in .close:active{background-color: #e44855;}
  .data_Popup .in .btn{width: 100%;padding: 18px 0;}
  .data_Popup .in .btn a{float: left;display: block;width: 27%;font-size: 18px;line-height: 46px;text-align: center;border-radius: 8px;background: #8ed6ee;color: #fff;}
  .data_Popup .in .btn a{margin-left: 5%;}
  .data_Popup .in .btn a:first-child{margin-left: 20%;}
  .data_Popup .in .btn a:hover{background: #6abad4;}
</style>
