<template>
  <div class="data_Popup addLineQuestion">
    <div class="addLineQuestion_box">
      <i class="addLineQuestion_box_close spriteImg c_closeico fr c_closeimg0" @click="closeLib"></i>
      <div class="addLineQuestion_top" :style="{'height':theight}">
        <dl class="addLineQuestion_knowledge">
          <dt>知识点：</dt>
          <dd id="ckknowledge">
            <span :class="{'on':index==0}" v-for="(hourknowledge,index) in hourknowledges" @click="selectKnowledge($event,hourknowledge)">{{hourknowledge.label}}</span>
          </dd>
        </dl>
        <dl class="addLineQuestion_questiontype">
          <dt>题　型：</dt>
          <dd id="addtype">
            <span :class="{'on':index==0}" v-for="(type,index) in queTypes" @click="selectType($event,type)">{{type.label}}</span>
          </dd>
        </dl>
        <i class="addLineQuestion_top_switch" @click.stop="fold">
          <i class="on">收起</i>
        </i>
      </div>
      <div class="addLineQuestion_middle" :style="{'height': mheight+'px'}">
        <div class="addLineQuestion_middle_questions" v-if="questions.length>0">
          <ul>
            <li class="question" v-for="question in questions">
              <div v-if="question.flag=='0'">
                <strong><div v-html="question.material"></div></strong>
                <h3 v-for="sub in question.subs" v-html="sub.content"></h3>
                <div class="buttons">
                  <div>
                    <span class="options_analysis" @click="lookAnalyse">查看解析</span>
                    <span class="options_error" @click="showError(question.questionId)">报错</span>
                    <span class="options_choice" @click="optIn($event,question,'')">选入</span>
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
                        <span class="options_error" @click="showError(sub.questionId)">报错</span>
                        <span class="options_choice" @click="optIn($event,question,sub)">选入</span>
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
                    <span class="options_error" @click="showError(question.questionId)">报错</span>
                    <span class="options_choice" @click="optIn($event,question,'')">选入</span>
                  </div>
                </div>
                <div class="dino">
                  <div class="analysis" v-for="label in question.labels" v-html="label.content"></div>
                </div>
              </div>
            </li>
          </ul>
          <v-pages :ToPages="ThisPages" @ListenChild="RecieveChild"></v-pages>
        </div>
        <div class="addLineQuestion_middle_questions" v-else><img class="nodata" src="/static/common/images/no.png"></div>
      </div>
      <div class="addLineQuestion_bottom">
        <a class="addLineQuestion_bottom_done off" href="javascript:;" v-if="selectedQuestion.length<=0">请选择题目</a>
        <a class="addLineQuestion_bottom_done" href="javascript:;" v-if="selectedQuestion.length>0" @click="finish">完成</a>
        <span class="addLineQuestion_bottom_num" v-if="selectedQuestion.length>0">已选择<i class="addLineQuestion_bottom_total">{{selectedQuestion.length}}</i>道题</span>
      <span class="addLineQuestion_bottom_numlist">
        <ul>
          <li v-for="temp in selectedInfo" v-if="temp.num>0">{{temp.type}}(<i>{{temp.num}}</i>)</li>
        </ul>
      </span>
      </div>
    </div>
    <v-upErrors></v-upErrors>
  </div>
</template>
<script type="text/ecmascript-6">
  import pages from '../../common/pages'
  import upErrors from '../../common/upErrors'
  import {contains} from '../../../common/js/common.js'
  export default {
    props: ['queTypes'],
    data () {
      return {
        hourknowledges: [],
        knowledgeId: '',
        knowledgeIds:'',
        questions: [],
        ThisPages:{
          Total:0,
          Role:0,
          PnoPage:0,
          Local:''
        },
        selectedQuestion:[],
        tempType:'',
        selectedInfo:[],
        theight:'auto',
        mheight:'584',
        subjectId:'',
        type:''
      }
    },
    mounted () {
      this.type = window.localStorage.getItem('type')
      this.init()
      this.initTypes()
      this.getQuestions(1, this.queTypes[0].code)
      this.tempType = this.queTypes[0].label
      this.subjectId = window.localStorage.getItem('subjectId')
    },
    methods: {
      init () {
        let para = {}
        this.knowledgeId = window.localStorage.getItem('knowledgeId')
        para.knowledgeId = this.knowledgeId
        let url = ''
        if (this.type === 'test') {
          para.knowledgeType = '1'
          url = '/web/teacher/paper/assign/testknowledges'
        } else {
          url = '/web/teacher/paper/assign/hourknowledges'
        }
        this.$http.post(url, para, {'emulateJSON': true}).then(function (response) {
          let retCode = response.body.retCode
          if (retCode === '0000') {
            let retData = response.body.retData
            this.hourknowledges = retData
            let all = {'code':'', 'label':'全部'}
            this.hourknowledges.unshift(all)
          }
        })
      },
      initTypes () {
        for (let i = 0; i < this.queTypes.length; i++) {
          if (i === 0) {
            if (this.queTypes[i].label === '全部') {
              continue
            }
          }
          let tt = {}
          tt.type = this.queTypes[i].label
          tt.code = this.queTypes[i].code
          tt.num = 0
          tt.questions = []
          tt.lineId = 'new' + Math.random().toString().replace('.', '') + new Date().getTime()
          this.selectedInfo.push(tt)
        }
      },
      closeLib () {
        this.$parent.libShow = false
      },
      getTypeCode (type) {
        for (let i = 0; i < this.queTypes.length; i++) {
          if (this.queTypes[i].label === type) {
            return this.queTypes[i].code
          }
        }
      },
      lookAnalyse (e) {
        let text = e.target.innerText
        let tar = e.target.parentNode.parentNode.nextElementSibling
        if (text === '查看解析') {
          e.target.innerText = '收回解析'
          tar.classList.remove('dino')
        } else {
          e.target.innerText = '查看解析'
          tar.classList.add('dino')
        }
      },
      selectType (e, tt) {
        this.ThisPages.Total = 0
        this.ThisPages.PnoPage = 0
        let addtype = document.getElementById('addtype').children
        for (let i = 0; i < addtype.length; i++) {
          if (contains(addtype[i].classList, 'on')) {
            addtype[i].classList.remove('on')
          }
        }
        e.target.classList.add('on')
        this.tempType = tt.label
        this.questions = []
        this.getQuestions(1, tt.code)
      },
      selectKnowledge (e, hourknowledge) {
        this.ThisPages.Total = 0
        this.ThisPages.PnoPage = 0
        let ckknowledge = document.getElementById('ckknowledge').children
        for (let i = 0; i < ckknowledge.length; i++) {
          if (contains(ckknowledge[i].classList, 'on')) {
            ckknowledge[i].classList.remove('on')
          }
        }
        e.target.classList.add('on')
        this.knowledgeIds = hourknowledge.code
        let addtype = document.getElementById('addtype').children
        for (let i = 0; i < addtype.length; i++) {
          if (contains(addtype[i].classList, 'on')) {
            addtype[i].classList.remove('on')
          }
        }
        addtype[0].classList.add('on')
        this.questions = []
        this.getQuestions(1, this.queTypes[0].code)
      },
      getQuestions (pageNum, questionTypeId) {
        let para = {}
        para.pageNum = pageNum
        para.pageSize = 10
        para.categoryId = this.knowledgeId
        para.questionTypeId = questionTypeId
        para.knowledgeIds = this.knowledgeIds
        let url = ''
        if (this.type === 'test') {
          para.knowledgeType = '1'
          url = '/web/teacher/paper/assign/papertestquestions'
        } else {
          url = '/web/teacher/paper/assign/papersquestions'
        }
        this.$http.post(url, para, {'emulateJSON': true}).then(function (response) {
          let retCode = response.body.retCode
          if (retCode === '0000') {
            let retData = response.body.retData
            this.ThisPages.Total = retData.pages
            this.ThisPages.PnoPage = retData.pageNum
            if (retData) {
              let list = retData.list
              for (let i = 0; i < list.length; i++) {
                let ques = list[i].questions
                if (list[i].groupCode) {
                  if (list[i].isSplite === '0') {
                    let question = {}
                    question.flag = list[i].isSplite
                    question.questionId = list[i].questionId
                    question.groupCode = list[i].groupCode
                    question.isSplite = list[i].isSplite
                    question.questionTypeId = list[i].questionTypeId
                    question.questionTypeName = list[i].questionTypeName
                    question.material = list[i].content.replace('【材料】', '<span class="question_number question_score"></span>')
                    question.labels = ques[0].labels
                    question.score = 0
                    question.subs = []
                    for (let j = 0; j < ques.length; j++) {
                      let sub = {}
                      sub.questionId = ques[j].questionId
                      sub.content = ques[j].questionTitle.replace('【题干】', '')
                      if (ques[j].optionA) {
                        sub.content += ques[j].optionA
                      }
                      if (ques[j].optionB) {
                        sub.content += ques[j].optionB
                      }
                      if (ques[j].optionC) {
                        sub.content += ques[j].optionC
                      }
                      if (ques[j].optionD) {
                        sub.content += ques[j].optionD
                      }
                      question.subs.push(sub)
                    }
                    this.questions.push(question)
                  } else {
                    let question = {}
                    question.flag = list[i].isSplite
                    question.questionId = list[i].questionId
                    question.groupCode = list[i].groupCode
                    question.isSplite = list[i].isSplite
                    question.questionTypeId = list[i].questionTypeId
                    question.questionTypeName = list[i].questionTypeName
                    question.material = list[i].content.replace('【材料】', '')
                    question.subs = []
                    for (let j = 0; j < ques.length; j++) {
                      let sub = {}
                      sub.questionId = ques[j].questionId
                      sub.labels = ques[j].labels
                      sub.score = 0
                      sub.content = ques[j].questionTitle.replace('【题干】', '<span class="question_number question_score"></span>')
                      if (ques[j].optionA) {
                        sub.content += ques[j].optionA
                      }
                      if (ques[j].optionB) {
                        sub.content += ques[j].optionB
                      }
                      if (ques[j].optionC) {
                        sub.content += ques[j].optionC
                      }
                      if (ques[j].optionD) {
                        sub.content += ques[j].optionD
                      }
                      question.subs.push(sub)
                    }
                    this.questions.push(question)
                  }
                } else {
                  let question = {}
                  question.flag = '2' // 单题
                  question.questionId = ques[0].questionId
                  question.groupCode = ques[0].groupCode
                  question.isSplite = ques[0].isSplite
                  question.questionTypeName = ques[0].questionTypeName
                  question.score = 0
                  question.content = ques[0].questionTitle.replace('【题干】', '<span class="question_number question_score"></span>')
                  if (ques[0].optionA) {
                    question.content += ques[0].optionA
                  }
                  if (ques[0].optionB) {
                    question.content += ques[0].optionB
                  }
                  if (ques[0].optionC) {
                    question.content += ques[0].optionC
                  }
                  if (ques[0].optionD) {
                    question.content += ques[0].optionD
                  }
                  question.labels = ques[0].labels
                  this.questions.push(question)
                }
              }
            } else {
              this.ThisPages.Total = 0
              this.ThisPages.PnoPage = 0
            }
          }
        })
      },
      optIn (e, question, sub) {
        let text = e.target.innerText
        if (text === '选入') {
          e.target.innerText = '取消'
          if (sub === '') {
            this.selectedQuestion.push(question)
            for (let i = 0; i < this.selectedInfo.length; i++) {
              if (this.selectedInfo[i].type === question.questionTypeName) {
                this.selectedInfo[i].num++
                this.selectedInfo[i].questions.push(question)
              }
            }
          } else {
            let sque = {}
            sque.flag = question.isSplite
            sque.questionId = question.questionId
            sque.groupCode = question.groupCode
            sque.isSplite = question.isSplite
            sque.questionTypeId = question.questionTypeId
            sque.questionTypeName = question.questionTypeName
            sque.material = question.material
            sque.subs = []
            sque.subs.push(sub)
            this.selectedQuestion.push(sque)
            for (let i = 0; i < this.selectedInfo.length; i++) {
              if (this.selectedInfo[i].type === sque.questionTypeName) {
                let que = {}
                que.flag = question.isSplite
                que.questionId = question.questionId
                que.groupCode = question.groupCode
                que.isSplite = question.isSplite
                que.questionTypeId = question.questionTypeId
                que.questionTypeName = question.questionTypeName
                que.material = question.material
                que.subs = []
                que.subs.push(sub)
                this.selectedInfo[i].num++
                this.selectedInfo[i].questions.push(que)
                break
              }
            }
          }
        } else {
          e.target.innerText = '选入'
          if (sub === '') {
            for (let i = 0; i < this.selectedQuestion.length; i++) {
              if (this.selectedQuestion[i].groupCode && this.selectedQuestion[i].isSplite === '1') {
                if (question.questionId === this.selectedQuestion[i].subs[0].questionId) {
                  this.selectedQuestion.splice(i, 1)
                }
              } else {
                if (question.questionId === this.selectedQuestion[i].questionId) {
                  this.selectedQuestion.splice(i, 1)
                }
              }
            }
            if (this.tempType === '全部') {
              for (let i = 0; i < this.selectedInfo.length; i++) {
                let questions = this.selectedInfo[i].questions
                for (let j = 0; j < questions.length; j++) {
                  if (questions[j].groupCode && questions[j].isSplite === '1') {
                    if (question.questionId === questions[j].subs[0].questionId) {
                      this.selectedInfo[i].num--
                      questions.splice(j, 1)
                    }
                  } else {
                    if (question.questionId === questions[j].questionId) {
                      this.selectedInfo[i].num--
                      questions.splice(j, 1)
                    }
                  }
                }
              }
            } else {
              for (let i = 0; i < this.selectedInfo.length; i++) {
                if (this.selectedInfo[i].type === this.tempType) {
                  this.selectedInfo[i].num--
                  let index = this.selectedInfo[i].questions.indexOf(question)
                  this.selectedInfo[i].questions.splice(index, 1)
                }
              }
            }
          } else {
            for (let i = 0; i < this.selectedQuestion.length; i++) {
              if (this.selectedQuestion[i].questionId === question.questionId) {
                if (this.selectedQuestion[i].subs[0].content === sub.content) {
                  this.selectedQuestion.splice(i, 1)
                }
              }
            }
            for (let i = 0; i < this.selectedInfo.length; i++) {
              if (this.selectedInfo[i].type === this.tempType) {
                this.selectedInfo[i].num--
                for (let j = 0; j < this.selectedInfo[i].questions.length; j++) {
                  if (this.selectedInfo[i].questions[j].questionId === question.questionId) {
                    if (this.selectedInfo[i].questions[j].subs[0].content === sub.content) {
                      this.selectedInfo[i].questions.splice(j, 1)
                    }
                  }
                }
              }
            }
          }
        }
      },
      fold (e) {
        let middle = document.getElementsByClassName('addLineQuestion_middle')
        let tar = e.target
        if (tar.innerText === '收起') {
          tar.innerText = '展开'
          tar.classList.remove('on')
          this.theight = '42px'
          this.mheight = window.outerHeight + document.body.scrollTop - middle[0].clientTop - 60
        } else {
          tar.classList.add('on')
          tar.innerText = '收起'
          this.theight = 'auto'
          this.mheight = window.outerHeight + document.body.scrollTop - middle[0].clientTop - 60
        }
      },
      RecieveChild (page) {
        let code = this.getTypeCode(this.tempType)
        this.getQuestions(page, code)
      },
      showError (questionId) {
        sessionStorage.setItem('questionId', questionId)
        let upErrors = document.getElementsByClassName('upErrors')[0]
        upErrors.style.display = 'block'
      },
      finish () {
        let sques = []
        for (let i = 0; i < this.selectedInfo.length; i++) {
          if (this.selectedInfo[i].num !== 0) {
            if (this.selectedInfo[i].code === '34') {
              let subs = this.selectedInfo[i].questions
              for (let j = 0; j < subs.length - 1; j++) {
                for (let k = j + 1; k < subs.length; k++) {
                  if (subs[j].groupCode === subs[k].groupCode && subs[j].isSplite === subs[k].isSplite) {
                    subs[j].subs.push(subs[k].subs[0])
                    subs.splice(k, 1)
                  }
                }
              }
            }
            sques.push(this.selectedInfo[i])
          }
        }
        for (let i = 0; i < this.selectedQuestion.length - 1; i++) {
          for (let j = i + 1; j < this.selectedQuestion.length; j++) {
            if (this.selectedQuestion[i].questionTypeId === '34' && this.selectedQuestion[j].questionTypeId === '34') {
              if (this.selectedQuestion[i].groupCode === this.selectedQuestion[j].groupCode && this.selectedQuestion[i].isSplite === this.selectedQuestion[j].isSplite) {
                this.selectedQuestion[i].subs.push(this.selectedQuestion[j].subs[0])
                this.selectedQuestion.splice(j, 1)
              }
            }
          }
        }
        if (this.subjectId === '03') {
          let flag = false // 不含阅读理解题型
          let newObj = {} // 阅读理解
          newObj.code = '13,30,31,32,33'
          newObj.type = '阅读理解'
          newObj.lineId = 'new' + Math.random().toString().replace('.', '') + new Date().getTime()
          newObj.questions = []
          // 删除旧映射
          for (let i = sques.length - 1; i >= 0; i--) {
            if (sques[i].code === '13' || sques[i].code === '30' || sques[i].code === '31' || sques[i].code === '32' || sques[i].code === '33') {
              for (let k = 0; k < sques[i].questions.length; k++) {
                newObj.questions.push(sques[i].questions[k])
              }
              flag = true
              sques.splice(i, 1)
            }
          }
          if (flag) {
            sques.push(newObj) // 添加新映射
          }
        }
        this.$emit('addQues', this.selectedQuestion, sques)
      }
    },
    components: {
      'v-pages': pages,
      'v-upErrors': upErrors
    }
  };
</script>
<style>
</style>
