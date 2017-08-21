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
        <ul class="source_txt slot-list" v-for="(temp,index) in questions" @mouseenter="enter($event,temp.questionId)" @mouseleave="leave($event)">
          <li class="lineBox slot-item saveLine" v-if="temp.flag=='0'">
            <span class="addAndRemove dino">
              <a class="_add" href="javascript:;" @click="addAndRemove($event,temp)">
                <img src="../../../../static/teacher/images/homework/m_add.png">
              </a>
            </span>
            <div class="questionContext" v-html="temp.content"></div>
            <div :id="temp.questionId" class="questionContext" v-for="sub in temp.subs" v-html="sub.questionTitle"></div>
            <div class="source_txt_btn">
              <a class="lookExplore" href="javascript:;" @click="lookExplore($event)">查看解析</a>
              <a class="paperChanged hasChange" href="javascript:;" @click="getSimilar($event,temp.questionId,index)">变式题</a>
            </div>
            <div class="analysisBox dino">
              <div v-for="label in temp.labels" :id="label.questionId" v-html="label.content"></div>
            </div>
            <div class="analysisChanged dino">
              <div class="reflesh"  @click="getSimilar($event,temp.questionId,index)">【变式】<img src="../../../../static/teacher/images/homework/m_reflesh.png" alt="刷新">换一个</div>
              <span class="addAndRemove dino">
                  <a class="_add" href="javascript:;" @click="addAndRemove($event,temp)">
                    <img src="../../../../static/teacher/images/homework/m_add.png">
                  </a>
              </span>
              <div class="changedTitle">
                <div class="questionContextChanged" v-html="temp.similar.content"></div>
                <div class="source_txt_btn">
                  <a class="change_lookExplore" href="javascript:;" @click="lookExplore($event)">查看解析</a>
                </div>
                <div class="analysisBox dino">
                  <div v-for="label in temp.similar.labels" :id="label.questionId" v-html="label.content"></div>
                </div>
              </div>
            </div>
          </li>
          <li class="lineBox slot-item saveLine" v-else>
            <span class="addAndRemove dino">
              <a class="_add" href="javascript:;" @click="addAndRemove($event,temp)">
                <img src="../../../../static/teacher/images/homework/m_add.png">
              </a>
            </span>
            <div class="questionContext" v-html="temp.content" v-if="temp.flag=='1'"></div>
            <div :id="temp.questionId" class="questionContext" v-html="temp.questionTitle"></div>
            <div class="source_txt_btn">
              <a class="lookExplore" href="javascript:;" @click="lookExplore($event)">查看解析</a>
              <a class="paperChanged hasChange" href="javascript:;" @click="getSimilar($event,temp.questionId,index)">变式题</a>
            </div>
            <div class="analysisBox dino">
              <div v-for="label in temp.labels" :id="label.questionId" v-html="label.content"></div>
            </div>
            <div class="analysisChanged dino">
              <div class="reflesh"  @click="getSimilar($event,temp.questionId,index)">【变式】<img src="../../../../static/teacher/images/homework/m_reflesh.png" alt="刷新">换一个</div>
              <span class="addAndRemove dino">
                  <a class="_add" href="javascript:;" @click="addAndRemove($event,temp)">
                    <img src="../../../../static/teacher/images/homework/m_add.png">
                  </a>
              </span>
              <div class="changedTitle">
                <div class="questionContextChanged" v-html="temp.similar.content"></div>
                <div class="source_txt_btn">
                  <a class="change_lookExplore" href="javascript:;" @click="lookExplore($event)">查看解析</a>
                </div>
                <div class="analysisBox dino">
                  <div v-for="label in temp.similar.labels" :id="label.questionId" v-html="label.content"></div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        </div>
        <div v-else class="p_nodata">
          <img class="noData" src="../../../../static/common/images/no.png">
        </div>
      </div>
      <!--试题篮-->
      <div class="m_paperBox">
        <p class="m_paperBox1">
          <span>试题篮</span>
        </p>
        <p class="m_paperBoxSec">
          <span>已选</span>
          <span class="m_seclectNum">{{selectedQuestions.length}}</span>
          <span>题</span>
        </p>
        <router-link v-bind:to="'/content/teacher/homework/previewbook'" class="m_paperBoxPreview">
          <p class="m_paperBoxPreview">预览</p>
        </router-link>
        <router-link v-bind:to="'/content/teacher/homework/notebook'">
          <p class="m_paperBoxCancel">取消</p>
        </router-link>
      </div>
    </div>
    <v-pages :ToPages="ThisPages" @ListenChild="RecieveChild" v-if="questions.length>0"></v-pages>
    <!-- 导出错题章节    遮罩层-->
    <div class="exportError">
    </div>
    <!--设置错误率为多少时  收录-->
    <div class="errorPer">
      <i class="spriteImg c_closeico fr c_closeimg0" id="c_closeG1"></i>
      <div class="errorPerCon">
        <span>当学生错误率达到</span>
        <div class="m_select">
          <span class="m_selectSpan">30%</span>
          <i class="fr spriteImg s_selico mt10"></i>
          <ul class="wrong_span">
            <li>20%</li>
            <li>30%</li>
            <li>40%</li>
            <li>50%</li>
            <li>60%</li>
          </ul>
        </div>
        <span>时收录</span>
      </div>
      <input type="button" class="m_btnPer" value="确&nbsp;定">
    </div>
    <div class="m_submitErrors">
      <i class="spriteImg c_closeico fr c_closeimg0" id="c_closeG2"></i>
      <p>报错</p>
      <ul class="m_errorPointsBox">
      </ul>
      <textarea name="" id="errorReason"  placeholder="请输入错误原因"></textarea>
      <input type="button" class="m_submitErrorsSure" value="确&nbsp;定">
      <input type="button" class="m_submitErrorsCancel" value="取&nbsp;消">
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import pages from '../../common/pages'
  import {contains} from '../../../common/js/common.js'
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
        similars:[],
        selectedQuestions:[]
      };
    },
    mounted() {
      this.getKnowledge()
//      this.initSelectedQuestions()
//      this.initKnowledge()
    },
    beforeDestroy() {
      this.saveQuestion()
    },
    methods:{
      getKnowledge() {
        this.$http.get('/web/teacher/center/wrongbook/knowledge').then(function(response) {
          let retCode = response.body.retCode
          if(retCode === '0000') {
            let retData = response.body.retData
            if(retData.length>0) {
              this.subjectId = retData[0].subjectId
              this.plevelName = retData[0].levelName + ':'
              if(this.subjectId !== '07') {
                this.cells.push({'knowledgeId':'','name':'全部','alias':''})
              }
              for(let i=0;i<retData.length;i++) {
                let cell = {}
                cell.knowledgeId = retData[i].knowledgeId
                cell.name = retData[i].name
                cell.alias = retData[i].alias
                this.cells.push(cell)
                this.chapters[cell.knowledgeId] = retData[i].childrens
              }
              this.activeKownledge.push(this.cells[0].knowledgeId)
              this.chapter = this.chapters[this.cells[0].knowledgeId]
              if(this.chapter&&this.chapter.length>0) {
                this.clevelName = this.chapter[0].levelName + ':'
                this.activeKownledge.push(this.chapter[0].knowledgeId)
              }
              let len = this.activeKownledge.length
              this.getWrongBook(this.activeKownledge[len-1],'1')
            }
          }
        })
      },
      initSelectedQuestions() {
        this.selectedQuestions = JSON.parse(window.localStorage.getItem('selectedQuestions'))
      },
      initKnowledge() {
        for(let j=0;j<this.activeKownledge.length;j++) {
          console.log(this.activeKownledge[j])
          document.getElementById(this.activeKownledge[j]).classList.add('n_active')
        }
      },
      getWrongBook(id,pageNum) {
        this.$http.get('/web/teacher/center/wrongbook', {'params':{'knowLedgeList':id, 'pageNum':pageNum, 'pageSize':3}}).then(function(response) {
          let retCode = response.body.retCode
          if(retCode === '0000') {
            this.questions = []
            this.ThisPages.Total = response.body.retData.pages
            this.ThisPages.PnoPage = response.body.retData.pageNum
            let retData = response.body.retData.list
            for(let i=0;i<retData.length;i++) {
              let question = {}
              let list = retData[i].questions
              if (retData[i].groupCode) {
                if (retData[i].isSplite === '0') {
                  question.flag = '0'
                  question.groupCode = retData[i].groupCode
                  question.isSplite = retData[i].isSplite
                  question.num = i + 1 + '.'
                  question.subs = []
                  question.similar = {}
                  question.questionId = retData[i].questionId
                  question.labels = list[i].questions[0].labels
                  question.content = retData[i].content.replace('【材料】', '')
                  for (var j = 0; j < list.length; j++) {
                    var sub = {}
                    sub.questionId = list[j].questionId
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
                    question.subs.push(sub)
                  }
                  this.questions.push(question)
                } else {
                  question.flag = '1'
                  question.num = i + 1 + '.'
                  question.similar = {}
                  question.groupOrder = list[0].groupOrder
                  question.groupCode = retData[i].groupCode
                  question.isSplite = retData[i].isSplite
                  question.similar = {}
                  question.questionTypeId = list[0].questionTypeId
                  question.questionId = list[0].questionId
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
                question.similar = {}
                question.groupOrder = list[0].groupOrder
                question.groupCode = null
                question.isSplite = null
                question.questionTypeId = list[0].questionTypeId
                question.questionId = list[0].questionId
                let numstr = '<span class="m_order">' + question.num + '</span>'
                question.questionTitle = list[0].questionTitle.replace("题干", numstr).replace("【","").replace("】","")
                if(list[0].questionTypeId === '01') {
                  question.questionTitle += list[0].optionA + list[0].optionB + list[0].optionC + list[0].optionD
                }
                question.labels = list[0].labels
                this.questions.push(question)
              }
            }
          }
        })
      },
      RecieveChild(page) {
        let len = this.activeKownledge.length
        let id = this.activeKownledge[len-1]
        console.log(id)
        this.getWrongBook(id,page)
      },
      lookExplore(e) {
        let text = e.target.text
        let next = e.target.parentNode.nextElementSibling
        if(text === '查看解析') {
          e.target.text = '收起解析'
          next.classList.remove('dino')
        }else {
          e.target.text = '查看解析'
          next.classList.add('dino')
        }
      },
      enter(e,id) {
        let li = e.target.children[0]
        let btnDiv = li.children[0]
        btnDiv.classList.remove('dino')
        if(this.selectedQuestions.length>0) {
          for(let i=0;i<this.selectedQuestions.length;i++) {
            for(let i=0;i<this.selectedQuestions.length;i++) {
              if(this.selectedQuestions[i].questionId === id) {
                btnDiv.children[0].classList.remove('_add')
                btnDiv.children[0].classList.remove('_reduce')
                btnDiv.children[0].children[0].src = '../../../../static/teacher/images/homework/m_reduce.png'
              }
            }
          }
        }
      },
      leave(e) {
        let li = e.target.children[0]
        let btnDiv = li.children[0]
        btnDiv.classList.add('dino')
      },
      addAndRemove(e,obj) {
        let classList
        if(e.target.localName === 'img') {
          classList = e.target.parentNode.classList
        }else {
          classList = e.target.classList
        }
        if(contains(classList,'_add')) {
          this.selectedQuestions.push(obj)
          classList.remove('_add')
          classList.add('_reduce')
          if(e.target.localName === 'img') {
            e.target.src = '../../../../static/teacher/images/homework/m_reduce.png'
          }else {
            e.target.children[0].src = '../../../../static/teacher/images/homework/m_reduce.png'
          }
        } else if(contains(classList,'_reduce')) {
          classList.remove('_reduce')
          classList.add('_add')
          for(let i=0;i<this.selectedQuestions.length;i++) {
            if(this.selectedQuestions[i].questionId === obj.questionId) {
              this.selectedQuestions.splice(i,1)
              if(e.target.localName === 'img') {
                e.target.src = '../../../../static/teacher/images/homework/m_add.png'
              }else {
                e.target.children[0].src = '../../../../static/teacher/images/homework/m_add.png'
              }
            }
          }
        }
      },
      getSimilar(e,questionId,index) {
        let tar
        if(contains(e.target.classList,'reflesh')) {
          tar = e.target.nextElementSibling.nextElementSibling
        }else {
          tar = e.target.parentNode.nextElementSibling.nextElementSibling
          tar.children[1].classList.remove('dino')
        }
        tar.classList.remove('dino')
        let para = {}
        para.questionId = questionId
        this.$http.post('/web/teacher/center/wrongbook/similar', para, {'emulateJSON': true}).then(function(response) {
          let retCode = response.body.retCode
          if(retCode === '0000') {
            let question = {}
            let retData = response.body.retData
            if(retData.groupCode) {
//
            }else {
              question.groupCode = null
              question.isSplite = null
              question.questionTypeId = retData.questionTypeId
              question.questionId = retData.questionId
              question.content = retData.questionContext.replace("题干", '').replace("【", "").replace("】", "")
              if(question.questionTypeId === '01') {
                question.content += retData.optionA + retData.optionB + retData.optionC + retData.optionD
              }
              question.labels = retData.labels
            }
            this.questions[index].similar = question
          }
        })
      },
      selectCell(obj,e) {
        let id = obj.knowledgeId
        this.chapter = this.chapters[id]
        let active = document.getElementsByClassName('n_active')[0]
        active.classList.remove('n_active')
        e.target.classList.add('n_active')
        if(this.chapter.length>0) {
          id = this.chapter[0].knowledgeId
        }
        this.getWrongBook(id,1)
      },
      selectChapter(obj,e) {
        let active = document.getElementsByClassName('n_active')[1]
        active.classList.remove('n_active')
        e.target.classList.add('n_active')
        this.getWrongBook(obj.knowledgeId,1)
      },
      saveQuestion() {
        window.localStorage.setItem('selectedQuestions', JSON.stringify(this.selectedQuestions))
      }
    },
    components:{
      'v-pages':pages
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
  .reflesh:hover{cursor: pointer;}
  .reflesh {color: #58c1e4;margin-top: 10px;}
  .source_txt_btn > a{margin-left: 10px; border: 1px solid #ccc; border-radius: 5px; width: 76px; height: 31px; display: block; float: left; text-align: center; line-height: 31px; color: #333; font-size: 15px;}
  .source_txt_btn > a:hover{background: #65b113 !important;color:#fff !important;border: 1px solid #65b113;}
  .addAndRemove{position: relative;float: right;border-bottom: none; top: 6px;right: -36px;}
  .addAndRemove a{padding:5px 10px;border-radius: 5px;}
  .addAndRemove a.on{color: #333;}
  .nopo {position: static}
  .m_con4:hover{cursor:pointer;}
  .m_select li{cursor:pointer;}
  .e_active{background:#f9a24a;color:#fff!important;border:1px solid #f9a24a;}
  .slot-list:hover{border-radius: 8px;border: 1px solid #ccc; width: 98%; margin: 0 auto;}
  .slot-list {border-radius: 8px;border: 1px solid #fff; width: 98%; margin: 0 auto;}
  .note_question{position: relative; padding-bottom: 10px;}
  .n_active{color:#65b113;}
  .every_level:hover{cursor:pointer;}
  .m_paperBoxPreview:hover{cursor:pointer;}
  .m_paperBoxSec:hover{cursor:pointer;}
  .m_paperBox1:hover{cursor:pointer;}
  .note_level{padding: 20px 30px 0 30px;position: relative;font-family: "微软雅黑", Arial, sans-serif;}
  .note_level span:first-child{position: absolute;top: 20px;left: 30px;line-height: 31px;}
  .every_level{display: inline-block;vertical-align:sub;width: 90px;height: 31px;overflow: hidden;padding: 0 10px;line-height: 31px;white-space: nowrap;text-overflow: ellipsis;}
  @media screen and (min-width:1600px){
    .noImg {
      width: 23%;
      margin: 100px 38%;
      margin-bottom: 190px;
      margin-top: 148px;
    }
    .note_level{padding-left: 90px;}
    /* .c_Main {
         position: relative;

     }*/
    .note_container{
      width:1180px;
      height:auto;
      margin:0 auto;
      margin-top:30px;
      font-size:18px;
      background: #fff;
      border-radius: 10px;
      min-height: 500px;
      position: relative;
    }
    .slot-item{
      margin: 20px 20px;
      padding-left:20px;
      padding-right:35px;
    }
    .note_container .source_txt  .knowledgeName{
      border-bottom: 1px solid #ccc;
      padding:10px;
    }
    .note_container .source_txt .questionContext{
      padding:10px 0px;
      padding-bottom:0px;
      position: relative;
    }
    .m_paperBox{
      border:1px solid #ccc;
      width:120px;
      height:160px;
      position: absolute;
      top:60px;
      left:1180px;
    }
    .m_paperBox p{
      text-align: center;
    }
    .m_paperBox .m_paperBox1{
      height:44px;
      line-height: 44px;
      background: #59c1e4;
      color:#fff;
      position: relative;
      font-size: 18px;
      font-family: "微软雅黑";
    }
    .m_paperBox .m_paperBox1 .p_editico0{
      position: absolute;
      left:6px;top:10px;
      font-size: 18px;
      color: #fff;
      font-family: "微软雅黑";
    }
    .m_paperBox .m_paperBoxSec{
      height:60px;
      line-height: 60px;
      background: #fff;
      color:#b6b6b6;
      font-size: 18px;
      font-family: "微软雅黑";
    }
    .m_paperBox .m_paperBoxSec .m_seclectNum{
      color:orange;
    }
    .m_paperBox .m_paperBoxPreview{
      height:28px;
      line-height: 28px;
      background: #fcbf7c;
      color:#fff;
      font-size: 18px;
      font-family: "微软雅黑";
    }
    .m_paperBox .m_paperBoxCancel{
      height:28px;
      line-height: 28px;
      background: #65b113;
      color:#fff;
      font-size: 18px;
      font-family: "微软雅黑";
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
      z-index: 1112;
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
      width:auto;
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
      opacity: 0.1;
      filter: alpha(opacity=10);
      -moz-opacity: 0.1;
      z-index: 1111;
    }

    /*设置错误率为多少时  收录*/
    .errorPer {
      display: none;
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
      font-size: 18px;
      float: left;
      box-sizing: border-box;
      border: 1px solid #ccc;
      margin: 8px 2px 0;
      position: relative;
    }
    .errorPer .errorPerCon ul {
      display: none;
      margin: 0;
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
  }
  @media screen and (min-width:1366px) and (max-width:1599px){
    .noImg {
      width: 23%;
      margin: 100px 38%;
      margin-bottom: 190px;
      margin-top: 148px;
    }
    .note_level {
      padding-left: 85px;
    }/*
       .c_Main {
           position: relative;

       }*/
    .note_container{
      width:980px;
      height:auto;
      margin:0 auto;
      margin-top:30px;

      font-size:16px;
      background: #fff;
      border-radius: 10px;
      min-height: 500px;
      position: relative;
    }
    .slot-item{
      margin:20px 20px;
      padding-left:20px;
      padding-right:35px;
    }
    .note_container .source_txt  .knowledgeName{
      border-bottom: 1px solid #ccc;
      padding:10px;
    }
    .note_container .source_txt .questionContext{
      padding:10px 0px;
      padding-bottom:0px;
      position: relative;
    }
    .m_paperBox{
      border:1px solid #ccc;
      width:120px;
      height:160px;
      position: absolute;
      top:70px;
      left:980px;
    }
    .m_paperBox p{
      text-align: center;
    }
    .m_paperBox .m_paperBox1{
      height:44px;
      line-height: 44px;
      background: #59c1e4;
      color:#fff;
      position: relative;
      font-size: 16px;
      font-family: "微软雅黑";
    }
    .m_paperBox .m_paperBox1 .p_editico0{
      position: absolute;
      left:6px;top:10px;
      font-size: 16px;
      color: #fff;
      font-family: "微软雅黑";
    }
    .m_paperBox .m_paperBoxSec{
      height:60px;
      line-height: 60px;
      background: #fff;
      color:#b6b6b6;
      font-size: 16px;
      font-family: "微软雅黑";
    }
    .m_paperBox .m_paperBoxSec .m_seclectNum{
      color:orange;
    }
    .m_paperBox .m_paperBoxPreview{
      height:28px;
      line-height: 28px;
      background: #fcbf7c;
      color:#fff;
      font-size: 16px;
      font-family: "微软雅黑";
    }
    .m_paperBox .m_paperBoxCancel{
      height:28px;
      line-height: 28px;
      background: #65b113;
      color:#fff;
      font-size: 16px;
      font-family: "微软雅黑";
    }

    /*导出错题章节    遮罩层*/
    .exportError {
      display: none;
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
      width:auto;
      height: 30px;
      float: left;
      padding: 10px 5px;
      font-size: 16px;
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
      opacity: 0.1;
      filter: alpha(opacity=10);
      -moz-opacity: 0.1;
      z-index: 1111;
    }

    /*设置错误率为多少时  收录*/
    .errorPer {
      display: none;
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
      margin: 8px 2px 0;
      position: relative;
    }
    .errorPer .errorPerCon ul {
      display: none;
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
    .errorPer .errorPerCon  li {
      height: 30px;
      box-sizing: border-box;
    }
    .errorPer .errorPerCon  li:hover {
      background: #f9dfbb;
    }
    .errorPer .m_btnPer {
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
  }
  @media screen and (max-width:1365px) {
    .noImg {
      width: 23%;
      margin: 100px 38%;
      margin-bottom: 190px;
      margin-top: 148px;
    }
    .note_level{padding-left: 80px;}
    .note_container{
      width:800px;
      height:auto;
      min-height: 500px;
      margin:0 auto;
      margin-top:30px;
      background: #fff;
      border-radius: 10px;

      padding:10px;
      font-size:14px;
      position: relative;
    }
    .slot-item {
      margin:20px 20px;
      padding-left:20px;
      padding-right:35px;
    }
    .note_container .source_txt .questionContext{
      padding:10px 0px;
      padding-bottom:0px;
      position: relative;
    }
    .m_paperBox{
      border:1px solid #ccc;
      width:120px;
      height:160px;
      position: absolute;
      top:60px;
      left:820px;
    }
    .m_paperBox p{
      text-align: center;
    }
    .m_paperBox .m_paperBox1{
      height:44px;
      line-height: 44px;
      background: #59c1e4;
      color:#fff;
      position: relative;
      font-size: 14px;
      font-family: "微软雅黑";
    }
    .m_paperBox .m_paperBox1 .p_editico0{
      position: absolute;
      left:6px;top:10px;
      font-size: 14px;
      color: #fff;
      font-family: "微软雅黑";
    }
    .m_paperBox .m_paperBoxSec{
      height:60px;
      line-height: 60px;
      background: #fff;
      color:#b6b6b6;
      font-size: 14px;
      font-family: "微软雅黑";
    }
    .m_paperBox .m_paperBoxSec .m_seclectNum{
      color:orange;
    }
    .m_paperBox .m_paperBoxPreview{
      height:28px;
      line-height: 28px;
      background: #fcbf7c;
      color:#fff;
      font-size: 14px;
      font-family: "微软雅黑";
    }
    .m_paperBox .m_paperBoxCancel{
      height:28px;
      line-height: 28px;
      background: #65b113;
      color:#fff;
      font-size: 14px;
      font-family: "微软雅黑";
    }
    /*导出错题章节    遮罩层*/
    .exportError {
      display: none;
      width: 580px;
      height: 320px;
      border: 1px solid #ccc;
      border-radius: 10px;
      position: absolute;
      top: 30%;
      left: 25%;
      z-index: 1112;
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
      width:auto;
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
      margin-left: 200px;
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
      opacity: 0.1;
      filter: alpha(opacity=10);
      -moz-opacity: 0.1;
      z-index: 1111;
    }
    /*设置错误率为多少时  收录*/
    .errorPer {
      display: none;
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
      display: none;
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
  }

  .question_result {
    float: right;
  }
  .analysisBox p span,.analysisBox div,.analysisBox div p {
    font-family: "Times new roman","楷体" !important;
    font-size: 17px !important;
    color: #666 !important;
  }
  .questionContext,.questionContextChanged {
    color: #333;
    position: relative;
  }
  .option {
    color: #666 !important;
    margin-top: 7px;
    font-size: 17px;
    font-family: "宋体";
    margin-left: 9px;
  }
  .option *{
    color: #666 !important;
    font-family: "宋体";
    font-size: 17px;
  }
</style>

