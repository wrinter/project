<template>
  <div class="note_main">
  <div class="note_container">
    <div class="note_level" id="m_cell">
      <span>{{plevelName}}</span>
      <span class="every_level" v-for="(temp,index) in cells" :id="temp.knowledgeId" :class="{'n_active':index==0}" @click="selectCell(temp,$event)">{{temp.name}}</span>
    </div>
    <div class="note_level" id="m_chapter">
      <span>{{clevelName}}</span>
      <span class="every_level" v-for="(temp,index) in chapter" :id="temp.knowledgeId" :class="{'n_active':index==0}" @click="selectChapter(temp,$event)">{{temp.name}}</span>
    </div>
    <div class="note_question">
      <div v-if="questions.length>0">
      <ul class="source_txt slot-list" v-for="temp in questions" @mouseenter="enter($event)" @mouseleave="leave($event)">
        <li v-if="temp.flag=='0'">
          <div class="questionContext" v-html="temp.content"></div>
          <div class="questionContext" v-for="sub in temp.subs" v-html="sub.questionTitle"></div>
          <div class="source_txt_btn">
            <a class="lookExplore" href="javascript:;" @click="lookExplore($event)">查看解析</a>
            <span class="dino">
              <a class="paoError" href="javascript:;" @click="showError(temp.questionId)">报错</a>
              <a class="del_out" :questionid="temp.questionId" href="javascript:;" @click="deleteQuestion(temp,$event)">删除</a>
            </span>
          </div>
          <div class="analysisBox dino">
            <div v-for="label in temp.labels" :id="label.questionId" v-html="label.content"></div>
          </div>
        </li>
        <li class="lineBox slot-item saveLine" v-else>
          <div class="questionContext" v-html="temp.content" v-if="temp.flag=='1'"></div>
          <div :id="temp.questionId" class="questionContext" v-html="temp.questionTitle"></div>
          <div class="source_txt_btn">
            <a class="lookExplore" href="javascript:;" @click="lookExplore($event)">查看解析</a>
            <span class="dino">
              <a class="paoError" href="javascript:;" @click="showError(temp.questionId)">报错</a>
              <a class="del_out" :questionid="temp.questionId" href="javascript:;" @click="deleteQuestion(temp,$event)">删除</a>
            </span>
          </div>
          <div class="analysisBox dino">
            <div v-for="label in temp.labels" :id="label.questionId" v-html="label.content"></div>
          </div>
        </li>
      </ul>
      </div>
      <div v-else class="p_nodata">
        <img class="noData" src="../../../../static/common/images/no.png">
      </div>
      <div class="m_rightNav">
        <p class="m_line"></p>
        <p class="m_row1"></p>
        <p class="m_row2"></p>
        <router-link v-bind:to="'/content/teacher/homework/publishbook'">
          <p class="m_con4 m_active">布置错题</p>
        </router-link>
        <router-link v-bind:to="'/content/teacher/homework/publishrecord'">
          <p class="m_con4">布置记录</p>
        </router-link>
        <p class="m_con4 m_export" @click="exportBook">导出错题</p>
        <p class="m_con4 m_set"  @click="setErrorRate">设置</p>
      </div>
    </div>
  </div>
  <v-pages :ToPages="ThisPages" @ListenChild="RecieveChild" v-if="questions.length>0"></v-pages>
  <!-- 导出错题章节    遮罩层-->
  <div class="exportError" v-if="exportFlag">
    <i class="spriteImg c_closeico fr c_closeimg0" id="c_closeG0" @click="closeExport"></i>
    <div class="m_seclectSection">选择单元:</div>
    <ul class="m_sectionChoice">
      <li v-for="temp in exportCell" :id="temp.knowledgeId">
        <i class="spriteImg i_slcico0 fl s_Choimg m_all" @click="selectExported($event,temp.knowledgeId)"></i>
        <span class="m_sectionNum">{{temp.name}}</span>
        <i class="dischoice dino"></i>
      </li>
    </ul>
    <input class="m_btnSure" value="确定" type="button" @click="exportEnsure">
  </div>
  <!--设置错误率为多少时  收录-->
  <div class="errorPer" v-if="setFlag">
    <i class="spriteImg c_closeico fr c_closeimg0" id="c_closeG1" @click="closeRate"></i>
    <div class="errorPerCon">
      <span>当学生错误率达到</span>
      <div class="m_select" @click="showRate">
        <span class="m_selectSpan">{{selectedRate}}</span>
        <i class="fr spriteImg s_selico mt10"></i>
        <el-collapse-transition>
          <ul class="wrong_span" v-show="errorRateShow">
            <li @click="selectRate($event)">20%</li>
            <li @click="selectRate($event)">30%</li>
            <li @click="selectRate($event)">40%</li>
            <li @click="selectRate($event)">50%</li>
            <li @click="selectRate($event)">60%</li>
          </ul>
        </el-collapse-transition>
      </div>
      <span>时收录</span>
    </div>
    <input type="button" class="m_btnPer" value="确定" @click="rateEnsure">
  </div>
  <v-upErrors></v-upErrors>
  <v-mark :MarkCon="markInfo"></v-mark>
  </div>
</template>
<script type="text/ecmascript-6">
  import pages from '../../common/pages'
  import upErrors from '../../common/upErrors'
  import {contains} from '../../../common/js/common.js'
  import mark from '../../common/Mark.vue'
  export default {
    data () {
      return{
        cells:[],
        chapters:{},
        chapter:[],
        subjectId:'',
        plevelName:'',
        clevelName:'',
        activeKownledge:[],
        questions:[],
        ThisPages:{
          Total:0,
          Role:0,
          PnoPage:0,
          Local:''
        },
        exportCell:[],
        exportFlag:false,
        setFlag:false,
        errorRateShow:false,
        exportedId:[],
        selectedRate:'30%',
        markInfo:{'Con':'','Random':''}
      };
    },
    mounted() {
      this.getKnowledge()
//      this.initKnowledge()
    },
    methods:{
      getKnowledge () {
        this.$http.get('/web/teacher/center/wrongbook/knowledge').then(function (response) {
          let retCode = response.body.retCode
          if (retCode === '0000') {
            let retData = response.body.retData
            if (retData.length > 0) {
              this.subjectId = retData[0].subjectId
              this.plevelName = retData[0].levelName + ':'
              if (this.subjectId !== '07') {
                this.cells.push({'knowledgeId':'', 'name':'全部', 'alias':''})
              }
              this.exportCell.push({'knowledgeId':'', 'name':'全部', 'alias':''})
              for (let i = 0; i < retData.length; i++) {
                let cell = {}
                cell.knowledgeId = retData[i].knowledgeId
                cell.name = retData[i].name
                cell.alias = retData[i].alias
                this.cells.push(cell)
                this.exportCell.push(cell)
                this.chapters[cell.knowledgeId] = retData[i].childrens
              }
              this.activeKownledge.push(this.cells[0].knowledgeId)
              this.chapter = this.chapters[this.cells[0].knowledgeId]
              if (this.chapter && this.chapter.length > 0) {
                this.clevelName = this.chapter[0].levelName + ':'
                this.activeKownledge.push(this.chapter[0].knowledgeId)
              }
              let len = this.activeKownledge.length
              this.getWrongBook(this.activeKownledge[len-1], '1')
            }
          }
        })
      },
      initKnowledge () {
        for(let j = 0; j < this.activeKownledge.length; j++) {
          document.getElementById(this.activeKownledge[j]).classList.add('n_active')
        }
      },
      getWrongBook (id, pageNum) {
        this.$http.get('/web/teacher/center/wrongbook', {'params': {'knowLedgeList':id, 'pageNum':pageNum, 'pageSize':3}}).then(function (response) {
          let retCode = response.body.retCode
          if (retCode === '0000') {
            this.questions = []
            this.ThisPages.Total = response.body.retData.pages
            this.ThisPages.PnoPage = response.body.retData.pageNum
            let retData = response.body.retData.list
            for (let i = 0; i < retData.length; i++) {
              let question = {}
              let list = retData[i].questions
              if (retData[i].groupCode) {
                if (retData[i].isSplite === '0') {
                  question.groupCode = retData[i].groupCode
                  question.isSplite = retData[i].isSplite
                  question.flag = '0'
                  question.num = i + 1 + '.'
                  question.subs = []
                  question.questionId = retData[i].questionId;
                  question.content = retData[i].content.replace('【材料】', '')
                  question.labels = list[i].questions[0].labels
                  for (var j = 0; j < list.length; j++) {
                    var sub = {}
                    sub.questionId = list[j].questionId;
                    sub.questionTitle = list[j].questionTitle.replace('【题干】', '')
                    if (list[j].optionA) {
                      sub.questionTitle += list[j].optionA
                    }
                    if (list[j].optionB) {
                      sub.questionTitle += list[j].optionB
                    }
                    if (list[j].optionC) {
                      sub.questionTitle += list[j].optionC
                    }
                    if (list[j].optionD) {
                      sub.questionTitle += list[j].optionD
                    }
                    question.subs.push(sub);
                  }
                  this.questions.push(question)
                } else {
                  question.flag = '1'
                  question.groupCode = retData[i].groupCode
                  question.isSplite = retData[i].isSplite
                  question.num = i + 1 + '.'
                  question.questionId = retData[i].questionId;
                  question.content = retData[i].content.replace('【材料】', '')
                  let numstr = '<span class="m_order">' + question.num + '</span>'
                  question.questionTitle = list[0].questionTitle.replace('题干', numstr).replace('【', '').replace('】', '')
                  if (list[0].questionTypeId === '01') {
                    question.questionTitle += list[0].optionA + list[0].optionB + list[0].optionC + list[0].optionD
                  }
                  question.labels = list[0].labels
                  this.questions.push(question)
                }
              } else {
                question.flag = '2'
                question.num = i + 1 + '.'
                question.groupCode = null
                question.isSplite = null
                question.questionTypeId = list[0].questionTypeId
                question.questionId = list[0].questionId
                let numstr = '<span class="m_order">' + question.num + '</span>'
                question.questionTitle = list[0].questionTitle.replace('题干', numstr).replace('【', '').replace('】', '')
                if (list[0].questionTypeId === '01') {
                  question.questionTitle += list[0].optionA + list[0].optionB + list[0].optionC + list[0].optionD
                }
                question.labels = list[0].labels
                this.questions.push(question)
              }
            }
          }
        })
      },
      RecieveChild (page) {
        let len = this.activeKownledge.length
        let id = this.activeKownledge[len-1]
        this.getWrongBook(id, page)
      },
      lookExplore (e) {
        let text = e.target.text
        let next = e.target.parentNode.nextElementSibling
        if (text === '查看解析') {
          e.target.text = '收起解析'
          next.classList.remove('dino')
        } else {
          e.target.text = '查看解析'
          next.classList.add('dino')
        }
      },
      enter (e) {
        let li = e.target.children[0]
        let btnDiv = li.children[1]
        let span = btnDiv.children[1]
        span.classList.remove('dino')
      },
      leave (e) {
        let li = e.target.children[0]
        let btnDiv = li.children[1]
        let span = btnDiv.children[1]
        span.classList.add('dino')
      },
      deleteQuestion (obj, e) {
        let tar = e.target.parentNode.parentNode.parentNode.parentNode
        let param = {}
        if (obj.groupCode) {
          if (obj.isSplite === '0') {
            param.questionIdList = ''
            param.groupCodeList = obj.groupCode
          } else {
            param.questionIdList = obj.questionId
            param.groupCodeList = ''
          }
        }else {
          param.questionIdList = obj.questionId
        }
        this.$http.post('/web/teacher/center/wrongbook/delete', param, {'emulateJSON': true}).then(function (response) {
          let retCode = response.body.retCode
          if(retCode === '0000') {
            tar.remove()
          }
        })
      },
      selectCell (obj, e) {
        let id = obj.knowledgeId
        this.chapter = this.chapters[id]
        let active = document.getElementsByClassName('n_active')[0]
        active.classList.remove('n_active')
        e.target.classList.add('n_active')
        if (this.chapter.length > 0) {
          id = this.chapter[0].knowledgeId
        }
        this.getWrongBook(id, 1)
      },
      selectChapter (obj, e) {
        let active = document.getElementsByClassName('n_active')[1]
        active.classList.remove('n_active')
        e.target.classList.add('n_active')
        this.getWrongBook(obj.knowledgeId, 1)
      },
      exportBook () {
        this.exportFlag = true
      },
      closeExport () {
        this.exportFlag = false
      },
      selectExported(e, id) {
        let classList = e.target.classList
        if (contains(classList, 'i_slcico0')) {
          if (id === '') {
            let selected = document.getElementsByClassName('i_slcico0')
            for (let i = 0; i <= selected.length; i++) {
              i=0
              selected[0].classList.add('i_slcico1')
              selected[0].classList.remove('i_slcico0')
              if (selected[0].parentNode.id !== '') {
                this.exportedId.push(selected[0].parentNode.id)
              }
            }
          } else {
            classList.remove('i_slcico0')
            classList.add('i_slcico1')
            this.exportedId.push(id)
          }
        } else {
          let selected = document.getElementsByClassName('i_slcico1')
          if (id === '') {
            if (selected.length === this.exportCell.length) {
              for (let i = 0; i <= selected.length; i++) {
                console.log(selected.length)
                i = 0
                selected[0].classList.add('i_slcico0')
                selected[0].classList.remove('i_slcico1')
                let index = this.exportedId.indexOf(selected[0].parentNode.id);
                if (index > -1) {
                  this.exportedId.splice(index, 1)
                }
              }
            }
          } else {
            if (selected.length === this.exportCell.length - 1) {
              selected[0].classList.add('i_slcico0')
              selected[0].classList.remove('i_slcico1')
            } else {
              classList.remove('i_slcico1')
              classList.add('i_slcico0')
              let index = this.exportedId.indexOf(id);
              if (index > -1) {
                this.exportedId.splice(index, 1)
              }
            }
          }
        }
        },
      exportEnsure () {
        if (this.exportedId.length === 0) {
          this.markInfo.Random = Math.random()
          this.markInfo.Con = '请先选择章节'
          return
        }
        let para = {}
        if (this.exportedId.length > 1) {
          para.knowledgeList = this.exportedId.join(',')
        }
        para.knowledgeList = this.exportedId[0]
        this.$http.get('/web/teacher/center/wrongbook/export', {'params': para}).then(function (response) {
          let retCode = response.body.retCode
          if(retCode === '0000') {
//            window.open('/web/teacher/center/wrongbook/export?knowledgeList=' + para.knowledgeList) // 下载
            this.exportFlag = false
          }
        })
      },
      setErrorRate () {
        this.setFlag = true
      },
      showRate () {
        this.errorRateShow = true
      },
      closeRate () {
        this.setFlag = false
      },
      selectRate (e) {
        this.selectedRate = e.target.innerText
        this.errorRateShow = false
      },
      rateEnsure () {
        let arr = this.selectedRate.split('%')
        let errorPercent = arr[0] / 100
        let para = {}
        para.wrongRate = errorPercent;
        this.$http.post('/web/teacher/center/wrongrate', para, {'emulateJSON': true}).then(function (response) {
          let retCode = response.body.retCode
          if (retCode === '0000') {
            this.markInfo.Con = '错题率更新成功'
            this.setFlag = false
          }
        })
      },
      showError (questionId) {
        sessionStorage.setItem('questionId', questionId)
        let upErrors = document.getElementsByClassName('upErrors')[0]
        upErrors.style.display = 'block'
      }
    },
    components:{
      'v-pages': pages,
      'v-mark': mark,
      'v-upErrors': upErrors
    }
  };
</script>
<style>
  @import '../../../../static/common/css/common.css';
  .note_main{
    width:100%;
    float: left;
    background: #ecedf0;
    box-sizing: border-box;
    min-height: 780px;
    padding-bottom: 40px;
  }
  /***********************右侧导航（固定定位）*************************/
  .source_txt_btn{margin:10px 0;height: 40px;}
  .source_txt_btn > a{border: 1px solid #ccc;
    border-radius: 5px;
    width: 76px;
    height: 31px;
    display: block;
    line-height: 31px;
    float: left;
    font-size: 15px;
    text-align: center;
    color: #333;
  }
  .source_txt_btn > a:hover{background: #65b113 !important;color:#fff !important;border:1px solid #65b113;}
  .source_txt_btn span{position: relative;float: right;border-bottom: none;}

  .source_txt_btn span a{
    border: 1px solid #ccc;
    margin-left: 10px;
    border-radius: 5px;
    width: 76px;
    height: 31px;
    display: block;
    float: left;
    text-align: center;
    line-height: 31px;
    color: #333;
    font-size: 15px;
  }
  .source_txt_btn span a.on{color: #666;}
  .analysisBox p span,.analysisBox p{
    font-family: 'Times new roman','楷体' !important;
    font-size: 16px !important;
    color: #666 !important;
  }
  .optionA,.optionB,.optionC,.optionD {
    color: #666 !important;
  }
  .questionContext p{
    font-family: 'Times new roman','SimSun' !important;
    font-size: 16px;
  }
  .m_con4:hover{cursor:pointer;}
  .m_select li{cursor:pointer;}
  .e_active{background:#f9a24a;color:#fff!important;border:1px solid #f9a24a;}
  .slot-list:hover{border-radius: 8px;border: 1px solid #ccc; width: 98%; margin: 0 auto;}
  .slot-list {border-radius: 8px;border: 1px solid #fff; width: 98%; margin: 0 auto;}
  .note_question{position: relative; padding-bottom: 10px;}
  .n_active{color:#65b113;}
  .every_level:hover{cursor:pointer;}
  .note_level{padding: 20px 30px 0 30px;position: relative;}
  .note_level span:first-child{position: absolute;top: 20px;left: 30px;line-height: 31px;}
  .every_level{display: inline-block;vertical-align:sub;width: 90px;height: 31px;overflow: hidden;padding: 0 10px;line-height: 31px;white-space: nowrap;text-overflow: ellipsis;}
  @media screen and (min-width:1600px){
    .note_level{padding-left: 90px;}
    .note_container{
      width:1180px;
      height:auto;
      margin:40px auto 0;
      font-size:16px;
      background: #fff;
      border-radius: 10px;
      min-height: 500px;
    }
    .slot-item{
      margin: 20px 20px;
    }
    .note_container .source_txt  .knowledgeName{
      /*border-bottom: 1px solid #ccc;*/
      padding:10px;
    }
    .source_txt .questionContext{
      padding: 10px 0px;
      padding-bottom: 0px;
      color: #666 !important;
      font-family: 'Times new roman','SimSun' !important;
      line-height: 30px;
    }
    .note_container{
      padding: 20px 20px;
      padding-bottom: 0px;
      color: #333 !important;
    }
    .m_rightNav {
      position: absolute;
      top: -40px;
      right: -130px;
      z-index: 2;
    }

    .m_rightNav .m_line {
      height: 4px;
      width: 120px;
      margin-left:10px;
      background: #ccc;
    }

    .m_rightNav .m_row1 {
      width: 3px;
      height: 120px;
      background: #F9A24A;
      position: absolute;
      left: 20px;
      top: 0;
      z-index: -1;
    }
    .m_rightNav .m_row2 {
      width: 3px;
      height: 120px;
      background: #f6b471;
      position: absolute;
      left: 120px;
      top: 0;
      z-index: -1;
    }

    .m_rightNav .m_con4 {
      font-size: 14px;
      font-family: "微软雅黑", Arial, sans-serif;
      text-align: center;
      box-sizing: border-box;
      width: 120px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin: 5px 10px 0;
      background: #fff;
      padding: 4px 0;
      color: #666;
    }

    /*导出错题章节    遮罩层*/
    .exportError {
      width: 680px;
      height: 350px;
      border: 1px solid #ccc;
      border-radius: 10px;
      position: absolute;
      top: 30%;
      left: 30%;
      z-index: 512;
      background: #fff;
    }

    .exportError .m_seclectSection {
      color: #65b113;
      padding: 20px;
      font-size: 25px;
    }

    .exportError .m_sectionChoice {
      width: 500px;
      height: 140px;
      margin: 0 auto;

    }

    .exportError .m_sectionChoice > li {
      width:150px;
      height: 30px;
      float: left;
      padding: 10px 5px;
      font-size: 18px;
      font-family: "微软雅黑", Arial, sans-serif;
    }
    .exportError .m_sectionChoice > li span {
      margin-left: 6px;
      margin-right: 6px;
    }

    .exportError .m_btnSure {
      border: none;
      outline: none;
      border: 1px solid #65b113;
      background: #65b113;
      color: #fff;
      padding: 10px 70px;
      border-radius: 10px;
      margin: 30px auto;
      margin-left: 250px;
      font-size: 18px;
    }

    .mask {
      display: none;
      width: 100%;
      min-height: 768px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: #000;
      background: rgba(0,0,0,0.5);
      z-index:1111;
    }

    /*设置错误率为多少时  收录*/
    .errorPer {
      width: 680px;
      height: 350px;
      border: 1px solid #ccc;
      border-radius: 10px;
      position: absolute;
      top: 30%;
      left: 30%;
      z-index: 1112;
      background: #fff;
    }
    .errorPer .errorPerCon {
      margin-top: 105px;
      text-align: center;
      min-height: 30px;
      height: auto;
      padding: 0 195px;
    }
    .errorPer .errorPerCon > span {
      font-size: 18px;
      color: #666;
      display: block;
      float: left;
    }
    .errorPer .errorPerCon .m_select {
      width: 80px;
      height: auto;
      min-height: 30px;
      line-height: 30px;
      font-size: 18px;
      float: left;
      box-sizing: border-box;
      border: 1px solid #ccc;
      position: relative;
      margin: -3px 4px 0 4px;
      border-radius: 5px;
    }
    .errorPer .errorPerCon ul {
      margin: 0;
      margin-left: -1px;
      padding: 0;
      position: absolute;
      left: 0;
      top: 30px;
      z-index: 1111;
      width: 80px;
      height: auto;
      line-height: 30px;
      font-size: 18px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 5px;
      background: #fff;
    }
    .errorPer .errorPerCon li {
      height: 30px;
      box-sizing: border-box;
    }
    .errorPer .errorPerCon li:hover {
      background: #f9dfbb;
    }
    .errorPer .m_btnPer {
      border: none;
      outline: none;
      border: 1px solid #65b113;
      background: #65b113;
      color: #fff;
      font-size: 18px;
      font-family: "微软雅黑", Arial, sans-serif;
      padding: 10px 20px;
      margin: 47px 242px;
      border-radius: 10px;
      width: 196px;
    }
    /*试题 题目 报错*/
    .m_submitErrors {
      display: none;
      width: 600px;
      height: 400px;
      border: 1px solid #ccc;
      border-radius: 10px;
      position: absolute;
      top: 30%;
      left: 33%;
      z-index: 1112;
      background: #fff;
    }
    .m_submitErrors > p {
      width: 100%;
      height: 60px;
      line-height: 60px;
      color: #64b211;
      font-size: 24px;
      text-align: center;
    }
    .m_submitErrors .m_errorPoints {
      border: 1px solid #ccc;
      width: 140px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      margin-bottom: 20px;
      margin-left: 30px;
      border-radius: 10px;
      color: #666;
      font-size: 18px;
    }
    .m_submitErrors .m_errorPoints:hover {
      border: 1px solid #f9a24a;
      background: #f9a24a;
      color: #fff;
    }
    #errorReason {
      border: none;
      outline: none;
      border: 1px solid #ccc;
      width: 540px;
      height: auto;
      min-height: 120px;
      line-height: 32px;
      margin-left: 30px;
      border-radius: 10px;
      color: #999;
      font-size: 18px;
    }
    .m_submitErrors > input {
      border: none;
      outline: none;
      border: 1px solid #999;
      background: #999;
      border-radius: 10px;
      width: 200px;
      height: 40px;
      color: #fff;
      margin: 20px 0 0 60px;
    }
    .m_submitErrors > input:hover {
      background: #65b113;
      border: 1px solid #65b113;
    }
    .noImg {
      margin: 100px 38%;
      height: 250px;
    }
  }
  @media screen and (min-width:1366px) and (max-width:1599px){
    .note_level{padding-left: 85px;}
    .note_container{
      width: 980px;
      height: auto;
      margin: 40px auto 0;
      font-size: 16px;
      background: #fff;
      border-radius: 10px;
      min-height: 500px;
    }
    .slot-item{
      margin: 20px 20px;
    }
    .note_container .source_txt .knowledgeName{
      border-bottom: 1px solid #ccc;
      padding: 10px;
    }
    .source_txt .questionContext{
      padding: 10px 0px;
      padding-bottom: 0px;
      font-family: 'Times new roman','SimSun' !important;
      color: #666;
    }
    .note_container{
      padding: 10px 20px;
      padding-bottom: 0px;
    }
    .m_rightNav{
      position: absolute;
      top: -40px;
      right: -130px;
      z-index: 2;
    }
    .m_rightNav .m_line{
      height: 4px;
      width: 120px;
      margin-left: 10px;
      background: #ccc;
    }
    .m_rightNav .m_row1{
      width: 3px;
      height: 140px;
      background: #F9A24A;
      position: absolute;
      left: 20px;
      top: 0;
      z-index: -1;
    }
    .m_rightNav .m_row2{
      width: 3px;
      height: 120px;
      background: #f6b471;
      position: absolute;
      left: 120px;
      top: 0;
      z-index: -1;
    }
    .m_rightNav .m_con4{
      font-size: 16px;
      font-family: "微软雅黑", Arial, sans-serif;
      text-align: center;
      box-sizing: border-box;
      width: 120px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin: 5px 10px 0;
      background: #fff;
      padding: 4px 0;
      color: #666;
    }
    .m_rightNav .m_active{
      background: #faa249;
      border: 1px solid #f9a24a;
      color: #fff;
    }
    /*导出错题章节    遮罩层*/
    .exportError{
      width: 680px;
      height: 350px;
      border: 1px solid #ccc;
      border-radius: 10px;
      position: absolute;
      top: 30%;
      left: 30%;
      z-index: 512;
      background: #fff;
    }
    .exportError .m_seclectSection{
      color: #65b113;
      padding: 20px;
      font-size: 25px;
    }
    .exportError .m_sectionChoice{
      width: 500px;
      height: 140px;
      margin: 0 auto;
    }
    .exportError .m_sectionChoice > li{
      width: 125px;
      height: 30px;
      float: left;
      padding: 10px 5px;
      font-size: 16px;
      font-family: "微软雅黑", Arial, sans-serif;
    }
    .exportError .m_sectionChoice > li span{
      margin-left: 6px;
      margin-right: 6px;
    }
    .exportError .m_btnSure{
      border: none;
      outline: none;
      border: 1px solid #65b113;
      background: #65b113;
      color: #fff;
      padding: 10px 70px;
      border-radius: 10px;
      margin: 30px auto;
      /*margin-left: 250px;*/
      font-size: 16px;
    }
    .mask{
      display: none;
      width: 100%;
      min-height: 768px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: #000;
      background: rgba(0,0,0,0.5);
      z-index: 1111;
    }
    /*设置错误率为多少时  收录*/
    .errorPer{
      width: 500px;
      height: 200px;
      border: 1px solid #ccc;
      border-radius: 10px;
      position: absolute;
      top: 33%;
      left: 35%;
      z-index: 1112;
      background: #fff;
    }
    .errorPer .errorPerCon{
      margin-left: 30px;
      margin-top: 60px;
      text-align: center;
      min-height: 30px;
      height: auto;
    }
    .errorPer .errorPerCon > span{
      font-size: 30px;
      color: #666;
      display: block;
      float: left;
    }
    .errorPer .errorPerCon .m_select{
      width: 80px;
      height: auto;
      min-height: 30px;
      line-height: 30px;
      font-size: 16px;
      float: left;
      box-sizing: border-box;
      border: 1px solid #ccc;
      margin: 8px 2px 0;
      position: relative;
    }
    .errorPer .errorPerCon ul{
      margin: 0;
      padding: 0;
      position: absolute;
      left: 0;
      top: 30px;
      z-index: 1111;
      width: 80px;
      height: auto;
      line-height: 30px;
      font-size: 16px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      background: #fff;
    }
    .errorPer .errorPerCon li{
      height: 30px;
      box-sizing: border-box;
    }
    .errorPer .errorPerCon li:hover{
      background: #f9dfbb;
    }
    .errorPer .m_btnPer{
      border: none;
      outline: none;
      border: 1px solid #65b113;
      background: #65b113;
      color: #fff;
      font-size: 16px;
      font-family: "微软雅黑", Arial, sans-serif;
      padding: 10px 20px;
      margin-top: 30px;
      margin-left: 350px;
      border-radius: 10px;
    }
    /*试题 题目 报错*/
    .m_submitErrors{
      display: none;
      width: 600px;
      height: 400px;
      border: 1px solid #ccc;
      border-radius: 10px;
      position: absolute;
      top: 30%;
      left: 33%;
      z-index: 1112;
      background: #fff;
    }
    .m_submitErrors > p{
      width: 100%;
      height: 60px;
      line-height: 60px;
      color: #64b211;
      font-size: 24px;
      text-align: center;
    }
    .m_submitErrors .m_errorPoints{
      border: 1px solid #ccc;
      width: 140px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      margin-bottom: 20px;
      margin-left: 30px;
      border-radius: 10px;
      color: #666;
      font-size: 16px;
    }
    .m_submitErrors .m_errorPoints:hover{
      border: 1px solid #f9a24a;
      background: #f9a24a;
      color: #fff;
    }
    #errorReason{
      border: none;
      outline: none;
      border: 1px solid #ccc;
      width: 540px;
      height: auto;
      min-height: 120px;
      line-height: 32px;
      margin-left: 30px;
      border-radius: 10px;
      color: #999;
      font-size: 16px;
    }
    .m_submitErrors > input{
      border: none;
      outline: none;
      border: 1px solid #999;
      background: #999;
      border-radius: 10px;
      width: 200px;
      height: 40px;
      color: #fff;
      margin: 20px 0 0 60px;
    }
    .m_submitErrors > input:hover{
      background: #65b113;
      border: 1px solid #65b113;
    }
    .noImg{
      margin: 100px 38%;
      height: 250px;
    }
  }
  @media screen and (max-width:1365px) {
    .note_level{padding-left: 80px;}
    .note_container{
      width:800px;
      height:auto;
      min-height: 500px;
      margin:40px auto 0;
      background: #fff;
      border-radius: 10px;
      padding:10px;
      font-size:14px;
    }
    .slot-item{
      margin:20px 20px;
    }
    .source_txt .questionContext{
      padding: 10px 0px;
      padding-bottom: 0px;
      font-family: 'Times new roman','SimSun' !important;
      color: #666;
    }
    .note_container{
      padding: 10px 0px;
      padding-bottom: 0px;
    }
    .m_rightNav {
      position: absolute;
      top: -50px;
      right: -130px;
      z-index: 3;
    }
    .m_rightNav .m_line {
      height: 4px;
      width: 110px;
      margin-left:10px;
      background: #ccc;
    }
    .m_rightNav .m_row1 {
      width: 3px;
      height: 110px;
      background: #F9A24A;
      position: absolute;
      left: 20px;
      top: 0;
      z-index: -1;
    }
    .m_rightNav .m_row2 {
      width: 3px;
      height: 120px;
      background: #f6b471;
      position: absolute;
      left: 100px;
      top: 0;
      z-index: -1;
    }
    .m_rightNav .m_con4 {
      font-size: 14px;
      font-family: "微软雅黑", Arial, sans-serif;
      text-align: center;
      box-sizing: border-box;
      width: 110px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin: 5px 10px 0;
      background: #fff;
      padding: 4px 0;
      color: #666;
    }
    .m_rightNav .m_active {
      background: #faa249;
      border: 1px solid #f9a24a;
      color: #fff;
    }
    /*导出错题章节    遮罩层*/
    .exportError {
      width: 580px;
      height: 320px;
      border: 1px solid #ccc;
      border-radius: 10px;
      position: absolute;
      top: 30%;
      left: 25%;
      z-index: 512;
      background: #fff;
    }
    .exportError .m_seclectSection {
      color: #65b113;
      padding: 20px;
      font-size: 22px;
    }
    .exportError .m_sectionChoice {
      width: 500px;
      height: 140px;
      margin: 0 auto;
    }
    .exportError .m_sectionChoice > li {
      width:125px;
      height: 30px;
      float: left;
      padding: 10px 5px;
      font-size: 16px;
      font-family: "微软雅黑";
    }
    .exportError .m_sectionChoice > li span {
      margin-left: 6px;margin-right: 6px;
    }
    .exportError .m_btnSure {
      border: none;
      outline: none;
      border: 1px solid #65b113;
      background: #65b113;
      color: #fff;
      padding: 10px 70px;
      border-radius: 10px;
      margin: 30px auto;
      /*margin-left: 200px;*/
      font-size: 16px;
    }
    .mask {
      display: none;
      width: 100%;
      min-height: 768px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: #000;
      background: rgba(0,0,0,0.5);
      z-index: 1111;
    }
    /*设置错误率为多少时  收录*/
    .errorPer {
      width: 500px;
      height: 200px;
      border: 1px solid #ccc;
      border-radius: 10px;
      position: absolute;
      top: 33%;
      left: 25%;
      z-index: 1112;
      background: #fff;
    }
    .errorPer .errorPerCon {
      margin-left: 30px;
      margin-top: 60px;
      text-align: center;
      min-height: 30px;
      height: auto;

    }
    .errorPer .errorPerCon > span {
      font-size: 30px;
      color: #666;
      display: block;
      float: left;
    }
    .errorPer .errorPerCon .m_select {
      width: 80px;
      height: auto;
      min-height: 30px;
      line-height: 30px;
      font-size: 16px;
      float: left;
      box-sizing: border-box;
      border: 1px solid #ccc;
      margin: 6px 2px 0;
      position: relative;
    }
    .errorPer .errorPerCon ul {
      margin: 0;
      padding: 0;
      position: absolute;
      left: 0;
      top: 30px;
      z-index: 1111;
      width: 80px;
      height: auto;
      line-height: 30px;
      font-size: 16px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      background: #fff;
    }
    .errorPer .errorPerCon li {
      height: 30px;
      box-sizing: border-box;
    }
    .errorPer .errorPerCon li:hover {
      background: #f9dfbb;
    }
    .errorPer .m_btnPer {
      border: none;
      outline: none;
      border: 1px solid #65b113;
      background: #65b113;
      color: #fff;
      font-size: 18px;
      font-family: "微软雅黑";
      padding: 10px 20px;
      margin-top: 30px;
      margin-left: 350px;
      border-radius: 10px;
    }

    /*试题 题目 报错*/
    .m_submitErrors {
      display: none;
      width: 600px;
      height: 400px;
      border: 1px solid #ccc;
      border-radius: 10px;
      position: absolute;
      top: 25%;
      left: 25%;
      z-index: 1112;
      background: #fff;
    }

    .m_submitErrors > p {
      width: 100%;
      height: 60px;
      line-height: 60px;
      color: #64b211;
      font-size: 22px;
      text-align: center;
    }

    .m_submitErrors .m_errorPoints {
      border: 1px solid #ccc;
      width: 140px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      margin-bottom: 20px;
      margin-left: 30px;
      border-radius: 10px;
      color: #666;
      font-size: 16px;
    }

    .m_submitErrors .m_errorPoints:hover {
      border: 1px solid #f9a24a;
      background: #f9a24a;
      color: #fff;
    }

    #errorReason {
      border: none;
      outline: none;
      border: 1px solid #ccc;
      width: 540px;
      height: auto;
      min-height: 120px;
      line-height: 32px;
      margin-left: 30px;
      border-radius: 10px;
      color: #999;
      font-size: 16px;
    }

    .m_submitErrors > input {
      border: none;
      outline: none;
      border: 1px solid #999;
      background: #999;
      border-radius: 10px;
      width: 200px;
      height: 40px;
      color: #fff;
      margin: 20px 0 0 60px;
    }

    .m_submitErrors > input:hover {
      background: #65b113;
      border: 1px solid #65b113;
    }
    .noImg{
      margin: 100px 38%;
      height: 250px;
    }
  }
  .question_result {
    float: right;
  }
  .option {
    margin-top: 7px;
    margin-left: 25px;
    color: #666 !important;
    font-family: 'Times new roman','SimSun' !important;
    font-size: 17px;
  }
  .option *{
    color: #666 !important;
    font-family: 'Times new roman','SimSun' !important;
    font-size: 16px;

  }
  .change_span {
    color: #65b113;
  }
  .m_rightNav .m_active{
    background: #faa249;
    border: 1px solid #f9a24a;
    color: #fff;
    line-height: 30px;
  }
  .source_txt p{
    word-wrap:break-word;
    word-break:break-all;
  }
  .noData{
    height: 250px;
    max-width: 100%;
  }
  .p_nodata{
    width:100%;
    text-align: center;
  }
</style>
