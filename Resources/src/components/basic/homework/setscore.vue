<template>
  <div class="data_Popup" id="h_score">
    <div class="setLine_in h_setScore">
      <div class="h_scorehead">
        <h3 class="h_text">分数设置</h3>
        <span class="h_allscore">总分数{{allScores}}分</span>
        <i class="spriteImg c_closeico fr h_closeImg" @click="closePop"></i>
      </div>
      <div class="h_scorecontent">
        <div v-for="(temp,index) in lineList">
          <div class="h_line">
            <p>
              <span>{{temp.lineNumber+temp.lineName}}</span>
              <span class="h_qnum">{{temp.allnum}}</span>
              <span class="h_qsc">{{temp.allScore}}</span>
            </p>
            <input class="h_custombtn h_setbtn" v-model="temp.btn" type="button" v-if="temp.isBatch">
          </div>
          <ul class="h_questions h_all" v-if="!temp.text">
            <li v-for="question in temp.questions">
              {{question.text}}<input class="h_escore" v-model="question.score" style="ime-mode: disabled;" @blur="computeScore(question,index)" @keyup="checkScore($event)">分
            </li>
          </ul>
          <ul class="h_questions h_one" v-else>
            <li>
              {{temp.text}}<input class="h_escore" v-model="temp.score" style="ime-mode: disabled;" @blur="computeScore(temp,index)" @keyup="checkScore($event)">分
            </li>
          </ul>
        </div>
      </div>
      <div class="h_btns">
        <input class="h_finish" value="完成" type="button" @click="finishSet">
        <input class="h_cancel" value="取消" type="button" @click="closePop">
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
    export default {
      props:['lines'],
      data () {
       return {
         lineList:[],
         subjectId:'',
         allScores:''
       }
      },
      mounted () {
        this.init()
      },
      methods: {
        init () {
          this.subjectId = window.localStorage.getItem('subjectId')
          let order = 0 // 题序
          let allScores = 0
          for (let i=0; i < this.lines.length; i++) {
            let num = 0 // 行下题目个数
            let allScore = 0 // 行下总分
            let line = this.lines[i]
            let item = {}
            if (line.lineId.indexOf("new") !== -1) {
              item.isBatch = this.standard() //  标准题行
            } else {
              item.isBatch = this.practice()  // 课时练题行
            }
            item.btn = ''
            item.lineId = line.lineId
            item.lineNumber = line.lineNumber
            item.lineName = line.lineName
            item.questions = []
            item.text = ''
            let questions = line.questions
            for (let j=0; j < questions.length; j++) {
              let que = {}
              que.questionId = questions[j].questionId
              que.groupCode = questions[j].groupCode
              que.isSplite = questions[j].isSplite
              if (questions[j].groupCode) {
                if (questions[j].isSplite === '0') {
                  order++
                  num++
                  allScore += questions[j].subs[0].score * questions[j].subs.length
                  que.text = '第' + order + '题'
                  que.score = questions[j].subs[0].score
                  que.number = questions[j].subs.length
                  item.questions.push(que)
                } else {
                  for (let k=0; k < questions[j].subs.length; k++) {
                    let ques = {}
                    ques.questionId = questions[j].questionId
                    ques.groupCode = questions[j].groupCode
                    ques.isSplite = questions[j].isSplite
                    ques.id = questions[j].subs[k].questionId
                    order++
                    num++
                    ques.text = '第' + order + '题'
                    ques.score = questions[j].subs[k].score
                    allScore += parseInt(questions[j].subs[k].score)
                    item.questions.push(ques)
                  }
                }
              } else {
                order++
                num++
                que.text = '第' + order + '题'
                que.score = questions[j].score
                allScore += parseInt(questions[j].score)
                item.questions.push(que)
              }
            }
            item.allnum = '(共' + num + '小题,'
            item.allScore = '共' + allScore + '分)'
            item.qnum = num
            item.qscore = allScore
            allScores += parseInt(allScore)
            this.lineList.push(item)
          }
          this.allScores = allScores
          this.initBtn()
        },
        standard (questionType) {
          let isSB = false
          switch (this.subjectId) {
            case '01':
              questionType === '01' || questionType === '34' ? isSB = true : isSB = false
              break
            case '02':
              questionType === '01' ? isSB = true : isSB = false
              break
            case '03':
              questionType === '05' || questionType === '35' ? isSB = true : isSB = false
              break
            case '04':
              questionType === '05' || questionType === '09' || questionType === '10' || questionType === '34' ? isSB = true : isSB = false
              break
            case '05':
              questionType === '01' || questionType === '10' ? isSB = true : isSB = false
              break
            case '06':
              questionType === '05' || questionType === '09' ? isSB = true : isSB = false
              break
            case '07':
              questionType === '05' || questionType === '09' || questionType === '10' ? isSB = true : isSB = false
              break
            case '08':
              questionType === '05' || questionType === '09' ? isSB = true : isSB = false
              break
            case '09':
              questionType === '05' || questionType === '09' || questionType === '10' || questionType === '34' || questionType === '38' ? isSB = true : isSB = false
              break
            default:
              isSB = false
          }
          return isSB
        },
        practice (questionType) {
          let isSB
          switch (this.subjectId) {
            case '01':
              questionType === '01' || questionType === '34' ? isSB = true : isSB = false
              break
            case '02':
              questionType === '01' ? isSB = true : isSB = false
              break
            case '03':
              questionType === '05' || questionType === '35' ? isSB = true : isSB = false;
              break;
            case '04':
              questionType === '05' || questionType === '09' || questionType === '10' || questionType === '34' ? isSB = true : isSB = false;
              break;
            case '05':
              questionType === '01' || questionType === '10' ? isSB = true : isSB = false;
              break;
            case '06':
              questionType === '05' || questionType === '09' ? isSB = true : isSB = false;
              break;
            case '07':
              questionType === '05' || questionType === '09' || questionType === '10' ? isSB = true : isSB = false;
              break;
            case '08':
              questionType === '05' || questionType === '09' ? isSB = true : isSB = false;
              break;
            case '09':
              questionType ==='05' || questionType === '09' || questionType === '10' || questionType === '34' || questionType === '38' ? isSB = true : isSB = false;
              break;
            default:
              isSB = false
          }
          return isSB
        },
        initBtn () {
          for (let i=0; i < this.lineList.length; i++) {
            let flag = true
            let score = 0
            if (this.lineList[i].isBatch) {
              for (let j=0; j < this.lineList.questions.length; j++) {
                let ques = this.lineList.questions[j]
                if (ques.groupCode && ques.isSplite === '0') {
                  if (j === 0) {
                    score = ques.score
                  } else {
                    if (score !== ques.score) {
                      this.lineList[i].btn = '批量赋分'
                      flag = false
                      continue
                    }
                  }
                } else {
                  if (j === 0) {
                    score = ques.score
                  } else {
                    if (score !== ques.score) {
                      this.lineList[i].btn = '批量赋分'
                      flag = false
                      continue
                    }
                  }
                }
              }
              if (flag) {
                this.lineList[i].btn = '自定义赋分'
                this.lineList[i].text = '每小题'
                this.lineList[i].score = score
              }
            }
          }
        },
        closePop () {
          this.$parent.scoreShow = false
        },
        finishSet () {
          for (let i=0; i < this.lineList.length; i++) {
            this.lines[i].scoreDef = '(共' + this.lineList[i].qnum + '小题' + '，共' + this.lineList[i].qscore + '分)'
            let questions = this.lineList[i].questions
            for (let j=0; j < questions.length; j++) {
              for (let k=0; k < this.lines[i].questions.length; k++) {
                if (questions[j].questionId === this.lines[i].questions[k].questionId) {
                  if (questions[j].groupCode && questions[j].isSplite === '1') {
                    for (let m=0; m < questions[j].subs.length; m++) {
                      if (questions[j].subs[m].questionId === questions[j].id) {
                        questions[j].subs[m].score = questions[j].score
                      }
                    }
                  } else {
                  this.lines[i].questions[k].score = questions[j].score
                  }
                }
              }
            }
          }
          window.localStorage.setItem('allScores', this.allScores)
          this.$parent.scoreShow = false
        },
        checkScore (e) {
          e.currentTarget.value = e.currentTarget.value.replace(/\D/g,'')
        },
        computeScore (obj, index) {
          let score = 0
          if (obj.questionId) {
            for (let i=0; i < this.lineList[index].questions.length; i++) {
              let questions = this.lineList[index].questions
              if (obj.questionId === questions[i].questionId) {
                questions[i].score = obj.score
              }
              score += parseInt(questions[i].score)
            }
            this.lineList[index].allScore = '共' + score + '分)'
            this.lineList[index].qscore = score
          } else {
            this.lineList[index].score = obj.score
            this.lineList[index].allScore = '共' + parseInt(obj.score) * this.lineList[index].qnum + '分)'
          }
          let scores = 0
          for (let j=0; j < this.lineList.length; j++) {
            scores += parseInt(this.lineList[j].qscore)
          }
          this.allScores = scores
        }
  }
};
</script>
<style>
</style>
