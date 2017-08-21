<template>
  <div class="c_Main">
    <div class="exercise_btn" v-if="lines.length>0">
      <div class="exercise_btn_in">
        <input id="w_PrintBtn" class="exercise_btn_print" value="打印" type="button">
        <router-link v-bind:to="'/content/teacher/homework/assignedit?paperType='+paperType+'&status='+status" class="exercise_btn_edit" v-if="status=='2'||status==undefined">编辑</router-link>
        <input class="exercise_btn_publish" value="布置" type="button" @click="getAssignClass">
      </div>
    </div>
    <div class="h_p_Main">
      <div v-if="lines.length>0" class="exercise_box">
        <h1>{{paperName}}</h1>
        <div class="timeing">{{testTime}}<span>分钟</span></div>
        <div class="work_box">
          <ul>
            <li class="line" v-for="line in lines">
              <div class="line_title">
                <h2>
                  <span class="line_number">{{line.lineNumber}}</span>
                  <span class="line_name" v-if="line.lineName!='默认题行'">{{line.lineName}}</span>
                  <span class="line_score"></span>
                </h2>
              </div>
              <ul class="line_list">
                <li class="question"  v-for="question in line.questions">
                  <div v-if="question.flag=='0'">
                    <strong><div v-html="question.material"></div></strong>
                    <h3 v-for="sub in question.subs" v-html="sub.content"></h3>
                    <div class="buttons">
                      <div>
                        <span class="options_analysis" @click="lookAnalyse">查看解析</span>
                      </div>
                    </div>
                    <div class="dino">
                      <div class="analysis" v-for="label in question.labels" v-html="label.content"></div>
                    </div>
                  </div>
                  <div class="h_material" v-else-if="question.flag=='1'">
                    <strong><div v-html="question.material"></div></strong>
                    <ul>
                      <li v-for="sub in question.subs">
                        <h3 v-html="sub.content"></h3>
                        <div class="buttons">
                          <div>
                            <span class="options_analysis" @click="lookAnalyse">查看解析</span>
                          </div>
                        </div>
                        <div class="dino">
                          <div class="analysis" v-for="label in sub.labels" v-html="label.content"></div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div v-else>
                    <h3 v-html="question.content"></h3>
                    <div class="buttons">
                      <div>
                        <span class="options_analysis" @click="lookAnalyse">查看解析</span>
                      </div>
                    </div>
                    <div class="dino">
                      <div class="analysis" v-for="label in question.labels" v-html="label.content"></div>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="exercise_box" style="min-height: 721px;">
        <img class="nodata" src="/static/common/images/no.png">
      </div>
    </div>
    <v-publishbox :paperInfo="paperInfo" v-if="paperInfo.show"></v-publishbox>
  </div>
</template>
<script type="text/ecmascript-6">
  import {UrlSearch} from '../../../common/js/request.js';
  import publishbox from '../../basic/homework/publishbox.vue'
    export default {
      data () {
        return {
          id: UrlSearch('id'),
          htype: UrlSearch('htype'),
          paperType: UrlSearch('paperType'),
          lines:[],
          paperName:'',
          testTime:'',
          status: UrlSearch('status'),
          subjectId:'',
          paperId:UrlSearch('paperId'),
          paperInfo:{show:false,paperType:''},
          assignId:''
        };
      },
      mounted () {
        this.paperInfo.paperType = this.paperType
        this.getPaper()
      },
      methods: {
        getPaper () {
          this.subjectId = window.localStorage.getItem('subjectId')
          let knowledgeId = window.localStorage.getItem('knowledgeId')
          let para = {}
          let url = ''
          if(this.status !== '2'&&this.htype === 'mylist') {
            para.assignId = this.id
            this.assignId = this.id
            url = '/web/teacher/paper/assign/paperinfoWithAssign'
          } else {
            if(this.subjectId === '03' && (this.paperType == '102' || this.paperType == '103' || this.paperType == '104' || this.paperType == '112' || this.paperType === '113' || this.paperType == '114')) {//03:英语 && 分层作业
              if(this.htype === 'myList') {
                para.paperId = this.paperId
                para.paperType = this.paperType
                url = '/web/teacher/paper/assign/englishpaperinfowithidtype'
              } else {
                para.knowledgeId = knowledgeId
                para.categoryId = this.id
                url = '/web/teacher/paper/assign/englishpaperinfo'
              }
            } else if (this.subjectId === '03' && (this.paperType == '203' || this.paperType == '213')) {//03:英语 && 分层作业
              if(this.htype === 'mylist') {
                para.paperId = this.paperId
                para.paperType = this.paperType
                url = '/web/teacher/paper/assign/listeningtestwithidtype'
              } else {
                para.knowledgeId = knowledgeId
                para.categoryId = this.id
                url = '/web/teacher/paper/assign/listeningtest'
              }
            } else {
              if(this.htype === 'mylist') {
                para.paperId = this.paperId
                para.paperType = this.paperType
                url = '/web/teacher/paper/assign/paperinfowithidtype'
              } else {
                para.knowledgeId = knowledgeId
                para.categoryId = this.id
                url = '/web/teacher/paper/assign/paperinfo'
              }
            }
          }
          this.$http.post(url, para, {'emulateJSON': true}).then(function (response) {
            let retCode = response.body.retCode
            if(retCode === '0000') {
              let retData = response.body.retData
              this.paperName = retData.paperName
              this.testTime = '时间：' + retData.testTime
              this.paperInfo.testTime = retData.testTime
              this.paperInfo.paperName = this.paperName
              this.paperInfo.paperId = retData.paperId
              this.paperInfo.assignId = this.assignId
              let crumb = this.$route.meta.crumbs[2]
              crumb.name = this.paperName
              let num = 0
              let questionLines = retData.questionLines
              for(let i=0; i<questionLines.length; i++) {
                let line = {}
                let lineTitle = this.separateNum(questionLines[i].lineName)
                line.lineNumber = lineTitle.lineNumber
                line.lineName = lineTitle.lineName
                line.lineId = questionLines[i].lineId
                line.questionType = questionLines[i].questionType
                line.questionTypeName = questionLines[i].questionTypeName
                line.questions = []
                let questionGroup = questionLines[i].questionGroup
                for(let j=0; j<questionGroup.length; j++) {
                  let questionList = questionGroup[j].questions
                  if (questionGroup[j].groupCode) {
                    if (questionGroup[j].isSplite === '1') {
                      let question = {}
                      question.flag = questionGroup[j].isSplite
                      question.questionId = questionGroup[j].questionId
                      question.groupCode = questionGroup[j].groupCode
                      question.isSplite = questionGroup[j].isSplite
                      question.questionTypeId = questionGroup[j].questionTypeId
                      question.questionTypeName = questionGroup[j].questionTypeName
                      question.material = questionGroup[j].content.replace('【材料】','')
                      question.subs = []
                      for(let k=0; k<questionList.length; k++) {
                        num++
                        let str = '<span class="question_number question_score">' + num + '、</span>'
                        let sub = {}
                        sub.questionId = questionList[k].questionId
                        sub.labels = questionList[k].labels
                        sub.content = questionList[k].questionTitle.replace('【题干】',str)
                        if(questionList[k].optionA) {
                          sub.content += questionList[k].optionA
                        }
                        if(questionList[k].optionB) {
                          sub.content += questionList[k].optionB
                        }
                        if(questionList[k].optionC) {
                          sub.content += questionList[k].optionC
                        }
                        if(questionList[k].optionD) {
                          sub.content += questionList[k].optionD
                        }
                        question.subs.push(sub)
                      }
                      line.questions.push(question)
                    } else {
                      let question = {}
                      question.flag = questionGroup[j].isSplite
                      question.questionId = questionGroup[j].questionId
                      question.groupCode = questionGroup[j].groupCode
                      question.isSplite = questionGroup[j].isSplite
                      question.questionTypeId = questionGroup[j].questionTypeId
                      question.questionTypeName = questionGroup[j].questionTypeName
                      num++
                      let str = '<span class="question_number question_score">' + num + '、</span>'
                      question.material = questionGroup[j].content.replace('【材料】', str)
                      question.labels = questionList[0].labels
                      question.subs = []
                      for(let k=0; k<questionList.length; k++) {
                        let sub = {}
                        sub.questionId = questionList[k].questionId
                        sub.labels = questionList[k].labels
                        sub.content = questionList[k].questionTitle.replace('【题干】', '')
                        if(questionList[k].optionA) {
                          sub.content += questionList[k].optionA
                        }
                        if(questionList[k].optionB) {
                          sub.content += questionList[k].optionB
                        }
                        if(questionList[k].optionC) {
                          sub.content += questionList[k].optionC
                        }
                        if(questionList[k].optionD) {
                          sub.content += questionList[k].optionD
                        }
                        question.subs.push(sub)
                      }
                      line.questions.push(question)
                    }
                  } else {
                    for(let k=0; k<questionList.length; k++) {
                      num++
                      let str = '<span class="question_number question_score">' + num + '、</span>'
                      let question = {}
                      question.flag = '2'
                      question.questionId = questionList[k].questionId
                      question.labels = questionList[k].labels
                      question.content = questionList[k].questionTitle.replace('【题干】',str)
                      if(questionList[k].optionA) {
                        question.content += questionList[k].optionA
                      }
                      if(questionList[k].optionB) {
                        question.content += questionList[k].optionB
                      }
                      if(questionList[k].optionC) {
                        question.content += questionList[k].optionC
                      }
                      if(questionList[k].optionD) {
                        question.content += questionList[k].optionD
                      }
                      line.questions.push(question)
                    }
                  }
                }
                this.lines.push(line)
              }
              window.localStorage.setItem('lines',JSON.stringify(this.lines))
              window.localStorage.setItem('paperInfo',JSON.stringify(this.paperInfo))
            }
          })
        },
        separateNum(lineName) {
          let lineTitle = {}
          if(lineName.indexOf('、') !== -1 && lineName.indexOf('、') < 4) {//标点、在前3个字符之间
            lineTitle.lineNumber = lineName.split("、")[0]
            lineTitle.lineName = lineName.replace(lineTitle.lineNumber, '')
          } else if (lineName.indexOf(".") != -1 && lineName.indexOf(".") < 5) {//标点.在前4个字符之间
            lineTitle.lineNumber = lineName.split(".")[0]
            lineTitle.lineName = lineName.replace(lineTitle.lineNumber, '')
          } else {//其它，判断为无题号
            lineTitle.lineNumber = ''
            lineTitle.lineName = lineName
          }
          return lineTitle
        },
        lookAnalyse (e) {
          let text = e.target.innerText
          let tar = e.target.parentNode.parentNode.nextElementSibling
          if(text === '查看解析') {
            e.target.innerText = '收回解析'
            tar.classList.remove('dino')
          } else {
            e.target.innerText = '查看解析'
            tar.classList.add('dino')
          }
        },
        getAssignClass () {
          this.paperInfo.show = true
        }
      },
      components: {
        'v-publishbox': publishbox
      }
    };
</script>
<style>
  @import '/static/common/css/publish/assignCommon.css'
</style>
