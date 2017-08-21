<template>
  <div class="p_paper">
    <p class="p_paperTitle"></p>
    <ul class="p_paperTest">
      <li class="paperTestLi" v-for="(temp,index) in questionList">
        <ul class="paperTestLiUl">
          <li style="display: inline;">
            <span class="wr dino"><img src="/static/teacher/images/prepare/wrong.png"></span>
            <div class="paperTestLiUlContent p1">
              <div v-html="temp.content"></div>
              <ul>
                <li class="t_optionLi t_hli optionA p1 ml25" v-for="item in temp.options" v-html="item.content" @click="selectAnswer($event, item.flag,index)"></li>
              </ul>
            </div>
          </li>
          <li v-for="label in temp.labels" class="p_label dino">
            <div class="paperTestLiUlContent p1" v-html="label.content"></div>
          </li>
        </ul>
      </li>
      <input class="btnSubmit" value="提交" type="button" @click="submit">
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
  import {UrlSearch} from '../../../common/js/request.js';
  export default {
    data () {
      return {
        questionList:[],
        testId:'',
        testTitle:'',
        selectedAnswer:[],
        subFlag:false // 未提交
      };
    },
    mounted () {
      this.getTest()
    },
    methods: {
      getTest () {
        let param = {}
        param.resId = UrlSearch('id')
        this.$http.post('/web/teacher/prepare/video/test', param, {'emulateJSON': true}).then(function (response) {
          let retCode = response.body.retCode
          let retData = response.body.retData
          if (retCode === '0000') {
            this.testTitle = retData.testTitle
            this.testId = retData.testId
            for (let i = 0; i < retData.questionList.length; i++) {
              let question = {}
              question.id = retData.questionList[i].id
              question.groupCode = retData.questionList[i].groupCode
              question.answer = retData.questionList[i].answer
              question.num = i + 1 + '.'
              question.content = ''
              question.labels = []
              question.options = []
              let list = retData.questionList[i].list
              let str = '<span class="p_order">' + question.num + '</span>'
              for (let j = 0; j < list.length; j++) {
                if (list[j].questionType === '01') {
                  question.content += list[j].content.replace('【题干】', str)
                } else {
                  if (list[j].questionType !== '07') {
                    question.labels.push({'id':list[j].id, 'content':list[j].content})
                  }
                }
              }
              let qList = retData.questionList[i]
              if (qList.optionA) {
                let option = {}
                option.flag = 'A'
                option.content = qList.optionA
                question.options.push(option)
              }
              if (qList.optionB) {
                let option = {}
                option.flag = 'B'
                option.content = qList.optionB
                question.options.push(option)
              }
              if (qList.optionC) {
                let option = {}
                option.flag = 'C'
                option.content = qList.optionC
                question.options.push(option)
              }
              if (qList.optionD) {
                let option = {}
                option.flag = 'D'
                option.content = qList.optionD
                question.options.push(option)
              }
              this.questionList.push(question)
            }
            this.selectedAnswer.length = this.questionList.length
          }
        })
      },
      submit () {
        let wr = document.getElementsByClassName('wr')
        let labels = document.getElementsByClassName('p_label')
        let options = document.getElementsByClassName('t_optionLi')
        for (let i = 0; i < this.questionList.length; i++) {
          if (this.selectedAnswer[i] && this.questionList[i].answer === this.selectedAnswer[i].flag) {
            wr[i].src = '/static/teacher/images/prepare/right.png'
            wr[i].classList.remove('dino')
          } else {
            wr[i].src = '/static/teacher/images/prepare/wrong.png'
            wr[i].classList.remove('dino')
          }
        }
        for (let i = 0; i < labels.length; i++) {
          labels[i].classList.remove('dino')
        }
        for (let i = 0; i < options.length; i++) {
          options[i].classList.remove('t_hli')
        }
        this.subFlag = true
      },
      selectAnswer (e, flag, index) {
        if (this.subFlag) {
          return
        }
        this.selectedAnswer[index] = flag
        let tar = e.target
        let classList = tar.classList
        if (tar.nodeName === 'SPAN') {
          classList = tar.parentNode.parentNode.classList
        } else if (tar.nodeName === 'P') {
          classList = tar.parentNode.classList
        }
        classList.add('on')
      }
    }
  };
</script>
<style>
  .p_paper {
    margin: 40px auto;
    width: 1000px;
    height: auto;
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow: hidden;
    background-color: #fff;
  }
  .p_paper .p_paperTitle {
    width: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 22px;
    text-align: center;
    color: #666;
    font-family: "微软雅黑", Arial, sans-serif;
  }
  .p_paper .baseTitle {
    width: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    text-align: center;
    color: #666;
    font-family: "微软雅黑", Arial, sans-serif;
  }
  .p_paper .testTitle {
    width: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    text-align: center;
    color: #666;
    font-family: "微软雅黑", Arial, sans-serif;
  }
  .paperTestLi {
    width: 100%;
    height: auto;
    padding: 10px;
    font-size: 14px;
    line-height: 30px;
    box-sizing: border-box;;
  }
  .paperBaseLi {
    width: 100%;
    height: auto;
    margin-bottom: 20px;
    padding: 10px;
    font-size: 14px;
    line-height: 30px;
    box-sizing: border-box;;
  }
  .t_optionLi{cursor: pointer;padding-top: 10px;}
  img{max-width: 100%;}
  .p1{font-size: 14px!important;font-family:Microsoft YaHei,sans-serif,Arial,"Times New Roman" !important;margin-left:20px;}

  /*----------- 试题答案----------------*/
  .t_optionLiBackground {
    background: red;
  }
  .btnSubmit,.baseBtnSubmit {
    border: none;
    outline: none;
    background: #65b113;
    border: 1px solid #65b113;
    color: #fff;
    padding: 10px 53px;
    border-radius: 10px;
    margin: 20px auto;
    display: block;
    font-size:16px;
    cursor: pointer;
    /*  margin-left: 800px;*/
  }
  .btnSubmit:hover{
    background: #5da313;
  }
  .paperTestLi {
    position: relative;
  }
  .paperBaseLi {
    position: relative;
  }
  .wr {
    position: absolute;
    top: 20px;
    right:150px;
  }
  .p3 {
    text-align: left !important;
  }
  @media screen and (max-width: 1366px) {
    .p_paper {  width: 900px;  }
  }
  @media screen and (min-width: 1366px) {
    .p_paper {  width: 1000px;  }
  }
  @media screen and (min-width: 1600px) {
    .p_paper {  width: 1200px;  }
  }
  .on{
    color:#65b113;
  }
  .paperBase .p1,.p_paperTest .p1{
    font-family: Microsoft YaHei,sans-serif,Arial;
  }
  .t_hli:hover{
    color:#65b113;
  }
  .paperTestLiUl:hover{
    border:1px solid #ccc;
    border-radius:10px;
  }
  .paperTestLiUl{
    border:1px solid #fff;
    border-radius:10px;
  }
  .p_order{
    position: absolute;
    top: 10px;
    left: 10px;
  }
</style>
