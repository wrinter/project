<template>
  <div class="c_Main">
    <div class="exercise_btn" v-if="lines.length>0">
      <div class="exercise_btn_in">
        <input class="exercise_btn_done" value="完成" type="button" @click="finishEdit">
        <input class="exercise_btn_setline" value="调整题型" type="button" @click="setLine">
      </div>
    </div>
    <div class="exercise_btn" v-else-if="paperType==116">
      <div class="exercise_btn_in">
        <input class="exercise_btn_add" value="加题" type="button" @click="addAllQuestion">
      </div>
    </div>
    <div class="h_p_Main">
      <div v-if="lines.length>0" class="exercise_box">
        <h1>{{paperName}}</h1>
        <div class="timeing timeing_edi   t">
          <span>时间：</span>
          <ul>
            <span class="timeing_up" @click="goUp">上翻</span>
            <span class="timeing_down" @click="goDown">下翻</span>
            <li><input class="t_time" type="text" v-model="testTime"></li>
          </ul>
          <span>分钟</span>
        </div>
        <draggable v-model="lines" :move="getdata" @update="datadragEnd" class="work_box work_box_edit">
          <transition-group tag="ul">
            <li class="line" v-for="(line,lindex) in lines" :key="line.lineId">
              <div class="line_title">
                <h2>
                  <span class="line_number">{{line.lineNumber}}</span>
                  <span class="line_name">{{line.lineName}}</span>
                  <span class="line_score"></span>
                </h2>
                <span class="line_btn" v-if="line.questions.length>0">
                  <i class="line_addQuestion" @click="addQuestion(line)">添加题目</i>
                </span>
              </div>
              <draggable v-model="line.questions" :move="getque" @update="quedragEnd">
                <transition-group tag="ul" class="line_list">
            <li class="question"  v-for="(question,qindex) in line.questions" :key="question.questionId">
            <div v-if="question.flag=='0'">
              <strong><div v-html="question.material"></div></strong>
              <h3 v-for="sub in question.subs" v-html="sub.content"></h3>
              <div class="buttons">
                <div>
                  <span class="options_analysis" @click="lookAnalyse">查看解析</span>
                  <span class="options_delete" @click="deleteQ(lindex,qindex,'')">删除</span>
                </div>
              </div>
              <div class="dino">
                <div class="analysis" v-for="label in question.labels" v-html="label.content"></div>
              </div>
            </div>
            <div class="h_material" v-else-if="question.flag=='1'">
              <strong><div v-html="question.material"></div></strong>
              <ul>
                <li v-for="(sub,sindex) in question.subs">
                  <h3 v-html="sub.content"></h3>
                  <div class="buttons">
                    <div>
                      <span class="options_analysis" @click="lookAnalyse">查看解析</span>
                      <span class="options_delete" @click="deleteQ(lindex,qindex,sindex)">删除</span>
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
                  <span class="options_delete" @click="deleteQ(lindex,qindex,'')">删除</span>
                </div>
              </div>
              <div class="dino">
                <div class="analysis" v-for="label in question.labels" v-html="label.content"></div>
              </div>
            </div>
            </li>
          </transition-group>
        </draggable>
        </li>
        </transition-group>
        </draggable>
      </div>
      <div v-else-if="paperType==116" class="exercise_box" style="min-height: 721px;">
        <h1>{{paperName}}</h1>
        <div class="timeing timeing_edit">
          <span>时间：</span>
          <ul>
            <span class="timeing_up" @click="goUp">上翻</span>
            <span class="timeing_down" @click="goDown">下翻</span>
            <li><input class="t_time" type="text" v-model="testTime"></li>
          </ul>
          <span>分钟</span>
        </div>
      </div>
      <div v-else class="exercise_box" style="min-height: 721px;">
        <img class="nodata" src="/static/common/images/no.png">
      </div>
    </div>
    <v-setline v-if="lineShow" @updateLine="updateLine"></v-setline>
    <v-questionlib v-if="libShow" :queTypes="showTypes" @addQues="addQues"></v-questionlib>
    <v-mark :MarkCon="markInfo"></v-mark>
  </div>
</template>
<script type="text/ecmascript-6">
  import draggable from 'vuedraggable'
  import setline from '../../basic/homework/setline.vue'
  import questionlib from '../../basic/homework/questionlib.vue'
  import mark from '../../common/Mark.vue'
  import {UrlSearch} from '../../../common/js/request.js';
  export default {
    data () {
      return {
        paperName:'',
        testTime:'',
        lines:[],
        lineShow:false,
        queTypes:[],
        showTypes:[],
        libShow:false,
        lineId:'',
        markInfo:{'Con':'','Random':''},
        paperType: UrlSearch('paperType'),
        knowledgeId:'',
        subjectId: window.localStorage.getItem('subjectId'),
        isMarked: '0'
      };
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.knowledgeId = window.localStorage.getItem('knowledgeId')
        if(this.paperType === '116') {
          let para = {'knowledgeId':this.knowledgeId}
          this.$http.post('/web/teacher/paper/assign/custompapername', para, {'emulateJSON': true}).then(function(response) {
            let retCode = response.body.retCode
            if (retCode === '0000') {
              this.paperName = response.body.retData
              this.testTime = '60'
              let crumb = this.$route.meta.crumbs[2]
              crumb.name = this.paperName
            }
          })
        }else {
          let lines = window.localStorage.getItem('lines')
          this.lines = JSON.parse(lines)
          let paperInfo = JSON.parse(window.localStorage.getItem('paperInfo'))
          this.paperName = paperInfo.paperName
          this.testTime = paperInfo.testTime
          let crumb = this.$route.meta.crumbs[2]
          crumb.name = this.paperName
        }
        this.$http.post('/web/teacher/paper/assign/subjectquestiontypes').then(function(response) {
          let retCode = response.body.retCode
          if (retCode === '0000') {
            this.queTypes = response.body.retData
          }
        })
      },
      addAllQuestion () {
        this.showTypes = this.queTypes
        if (this.showTypes[0].label !== '全部') {
          this.showTypes.unshift({'code':'', 'label':'全部'})
        }
        this.libShow = true
      },
      addQuestion (obj) {
        this.lineId = obj.lineId
        let types = obj.questionType.split(',')
        this.showTypes = []
        this.getTypeName(types)
        this.libShow = true
      },
      getTypeName (types) {
        let qTypes = this.queTypes
        for (let j=0; j<types.length; j++) {
          for (let i=0; i<qTypes.length; i++) {
            if (qTypes[i].code === types[j]) {
              this.showTypes.push(qTypes[i])
              break
            }
          }
        }
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
      deleteQ(lindex,qindex,sindex) {
        if (sindex === '') {
          this.lines[lindex].questions.splice(qindex,1)
        } else {
          this.lines[lindex].questions[qindex].subs.splice(sindex,1)
        }
        this.$nextTick(function () {
          this.orderNum()
        })
      },
      getdata(e) {
//          console.log('move')
      },
      datadragEnd(e) {
        let nums = document.getElementsByClassName('line_number')
        for(let i=0;i<nums.length;i++) {
          nums[i].innerText = this.toChinese(i + 1)
        }
        window.localStorage.setItem('lines', JSON.stringify(this.lines))
      },
      getque(e) {
//          console.log('move')
      },
      quedragEnd(e) {
        this.orderNum()
      },
      orderNum() {
        let nums = document.getElementsByClassName('question_number')
        for(let i=0;i<nums.length;i++) {
          nums[i].innerText = i + 1 + '.'
        }
      },
      goUp() {
        let time = parseInt(this.testTime)
        if(time < 150) {
          this.testTime = time + 5
        }
      },
      goDown() {
        let time = parseInt(this.testTime)
        if(time > 30) {
          this.testTime = time - 5
        }
      },
      setLine() {
        this.lineShow = true
      },
      updateLine (data) {
        for(let i=0;i<data.length;i++) {
          data[i].lineNumber = this.toChinese(i + 1)
        }
        this.lines = data
      },
      addQues(ques,sques) {
        if (this.lines.length > 0) {
          for(let i=0;i<this.lines.length;i++) {
            if(this.lines[i].lineId === this.lineId) {
              for(let j=0;j<ques.length;j++) {
                this.lines[i].questions.push(ques[j])
              }
            }
          }
        } else {
          let subjectId = window.localStorage.getItem('subjectId')
          for(let j=0;j<sques.length;j++) {
            let line = {}
            if(subjectId === '03') {
              line.lineNumber = this.toRoman(j+1)
              line.lineName = '.'+sques[j].type
            } else {
              line.lineNumber = this.toChinese(j+1)
              line.lineName = '、'+sques[j].type
            }
            line.lineId = sques[j].lineId
            line.questionType = sques[j].code
            line.questions = sques[j].questions
            this.lines.push(line)
          }
        }
        this.libShow = false
        this.$nextTick(function () {
          this.orderNum()
        })
      },
      toChinese (num) {
        if(isNaN(num)) {
          return num
        }
        let AA = ["0", "一", "二", "三", "四", "五", "六", "七", "八", "九"]
        let BB = ["", "十", "百", "千", "万", "亿", "点", ""]
        let a = ('' + num).replace(/(^0*)/g, '').split('.')
        let k = 0
        let chinese = ''
        for (let i = a[0].length - 1; i >= 0; i--) {
          switch (k) {
            case 0:
            {
              chinese = BB[7] + chinese
              break
            }
            case 4:
            {
              if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0])) {
                chinese = BB[4] + chinese
              }
              break
            }
            case 8:
            {
              chinese = BB[5] + chinese
              BB[7] = BB[5]
              k = 0
              break
            }
          }
          if (k % 4 === 2 && a[0].charAt(i + 2) !== 0 && a[0].charAt(i + 1) === 0) {
            chinese = AA[0] + chinese
          }
          if (a[0].charAt(i) != 0) {
            chinese = AA[a[0].charAt(i)] + BB[k % 4] + chinese
            k++
          }
        }
        if (a.length > 1) //加上小数部分(如果有小数部分)
        {
          chinese += BB[6];
          for (var i = 0; i < a[1].length; i++) {
            chinese += AA[a[1].charAt(i)]
          }
        }
        return chinese
      },
      toRoman (num) {
        if(isNaN(num)) {
          return num
        }
        let roman = '';
        let alpha = [ 'I', 'V', 'X', 'L', 'C', 'D', 'M' ];
        let bit = 0;
        while (num > 0) {
          let tempnum = num % 10;
          switch (tempnum) {
            case 3:
            {
              roman = alpha[bit] + roman
              tempnum--
              break
            }
            case 2:
            {
              roman = alpha[bit] + roman
              tempnum--
              break
            }
            case 1:
            {
              roman = alpha[bit] + roman
              break
            }
            case 4:
            {
              roman = alpha[bit + 1] + roman
              roman = alpha[bit] + roman
              break
            }
            case 8:
            {
              roman = alpha[bit] + roman
              tempnum--
              break
            }
            case 7:
            {
              roman = alpha[bit] + roman
              tempnum--
              break
            }
            case 6:
            {
              roman = alpha[bit] + roman
              tempnum--
              break
            }
            case 5:
            {
              roman = alpha[bit + 1] + roman
              break
            }
            case 9:
            {
              roman = alpha[bit + 2] + roman
              roman = alpha[bit] + roman
              break
            }
            default:
              break
          }
          bit += 2
          num = Math.floor(num / 10)
        }
        return roman
      },
      finishEdit () {
        console.log(1111)
        if(this.testTime>999) {
          this.markInfo.Con = '请设置正确的时间'
          return
        }
        let newPaper = {}//作业或试卷
        newPaper.paperName = this.paperName
        newPaper.knowledgeId = window.localStorage.getItem('knowledgeId')
        newPaper.type = this.paperType.replace("0","1")
        newPaper.editorType = "1"//后台统计布置类型接口：默认1
        newPaper.testTime = this.testTime
        newPaper.score = 0
        newPaper.questionLines = this.resetQuestion()
        newPaper.isMarked = this.isMarked
        if(this.paperType === '106' || this.paperType === '116' || this.paperType === '206' || this.paperType === '216') {
          newPaper.editorType = '2';//后台统计布置类型接口：2：自主组卷
        }
        this.$http.post('/web/teacher/paper/assign/savecustompaper', JSON.stringify(newPaper), {'emulateJSON': true}).then(function(response) {
          let retCode = response.body.retCode
          if(retCode === '0000') {
            this.markInfo.Con = '保存成功'
            let retData = response.body.retData

            let url = '/content/teacher/homework/assignpaper?htype=mylist&paperId=' + retData.paperId + '&paperType=' + this.paperType.replace("0","1") + '&status=2'
            this.$router.push(url)
          }
        })
      },
      resetQuestion() {
        let num = 0
        let questions = []
        if (this.paperType === '116' && this.subjectId !== '01' && this.subjectId !== '03' && this.subjectId !== '05' && this.subjectId !== '09') {
          let lineObj = {}
          lineObj.isShow = '0'
          lineObj.questionType = '01'
          lineObj.showOrder = 0
          lineObj.remarks = '默认题行'
          lineObj.scoreDef = null
          lineObj.customLineTj = []
          for(let i=0;i<this.lines.length;i++) {
            let qus = this.lines[i].questions
            for (let j = 0; j < qus.length; j++) {
              if (qus[j].groupCode) {
                if (qus[j].isSplite === '1') {
                  let tj = {}
                  tj.questionId = qus[j].questionId
                  tj.lnOrder = num
                  lineObj.customLineTj.push(tj)
                  for (let k = 0; k < qus[j].subs.length; k++) {
                    let tjs = {}
                    num++
                    tjs.questionId = qus[j].subs[k].questionId
                    tjs.lnOrder = num
                    lineObj.customLineTj.push(tjs)
                  }
                }
              } else {
                num++
                let obj = {}
                obj.questionId = this.lines[i].questions[j].questionId
                obj.lnOrder = num
                lineObj.customLineTj.push(obj)
              }
              if (this.lines[i].questions[j].selectable&&this.lines[i].questions[j].selectable === '0') {
                this.isMarked = '1'
              }
            }
          }
          questions.push(lineObj)
        } else {
          let num = 0
          for(let i=0;i<this.lines.length;i++) {
            let lineObj = {}
            lineObj.isShow = '1'
            lineObj.questionType = this.lines[i].questionType
            lineObj.showOrder = i
            lineObj.remarks = (this.lines[i].lineNumber ? this.lines[i].lineNumber : "") + this.lines[i].lineName
            lineObj.customLineTj = []
            let qus = this.lines[i].questions
            for (let j=0; j<qus.length; j++) {
              if (qus[j].groupCode) {
                if(qus[j].isSplite === '1') {
                  let tj = {}
                  tj.questionId = qus[j].questionId
                  tj.lnOrder = num
                  lineObj.customLineTj.push(tj)
                  for (let k = 0; k < qus[j].subs.length; k++) {
                    let tjs = {}
                    num++
                    tjs.questionId = qus[j].subs[k].questionId
                    tjs.lnOrder = num
                    lineObj.customLineTj.push(tjs)
                  }
                }
              } else {
                num++
                let obj = {}
                obj.questionId = this.lines[i].questions[j].questionId
                obj.lnOrder = num
                lineObj.customLineTj.push(obj)
              }
              if (this.lines[i].questions[j].selectable&&this.lines[i].questions[j].selectable === '0') {
                this.isMarked = '1'
              }
            }
            questions.push(lineObj)
          }
        }
        return questions
      }
    },
    components: {
      'v-setline': setline,
      'v-questionlib': questionlib,
      'v-mark': mark,
      draggable
    }
  };
</script>
<style>
  @import '/static/common/css/publish/assignCommon.css'
</style>
