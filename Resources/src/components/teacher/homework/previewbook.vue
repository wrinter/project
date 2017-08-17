<template>
  <div class="pre_container">
    <div class="pre_button">
      <span class="pre_btn fr pre_btnBack" @click="goBack">返回</span>
      <span class="pre_btn fr pre_btnExit" @click="makePaper">生成试卷</span>
    </div>
    <div class="pre_paperTitle">
      <div class="pre_paperName">{{paperName}}</div>
      <div class="pre_paperTime">
        <span>时间：</span><input  v-model="time"/><span>分</span>
      </div>
    </div>
    <div class="pre_source">
      <draggable v-model="questionList" :move="getdata" @update="datadragEnd">
        <transition-group tag="ul" class="pre_list">
          <li class="everyQuestion saveLine" v-for="temp in questionList" :key="temp.questionId">
            <div class="saveLine questionContext savePaper" v-html="temp.content"></div>
            <div class="pre_btns">
              <span>
                <a class="look" href="javascript:;" @click="lookAnalyse($event)">解析</a>
                <a class="delete" href="javascript:;" @click="deleteQuestion($event,temp.questionId)">删除</a>
              </span>
            </div>
            <div class="pre_analysisBox dino">
              <div v-for="label in temp.labels" :id="label.questionId" v-html="label.content"></div>
            </div>
          </li>
        </transition-group>
      </draggable>
    </div>
    <v-mark :MarkCon="markInfo"></v-mark>
  </div>
</template>
<script type="text/ecmascript-6">
  import mark from '../../common/Mark.vue'
  import draggable from 'vuedraggable'
    export default {
      data() {
        return {
          time:'30',
          questionList:[],
          markInfo:{'Con':'','Random':''},
          paperName:'错题训练(第1章)'
        }
      },
      mounted() {
       this.initPreview()
      },
      methods:{
        initPreview() {
          this.questionList = JSON.parse(window.localStorage.getItem('selectedQuestions'))
          this.orderNum()
        },
        goBack() {
          this.$router.push('/content/teacher/homework/publishbook')
        },
        orderNum() {
          let nums = document.getElementsByClassName('m_order')
          for(let i=0;i<nums.length;i++) {
            nums[i].innerText = i+1+'.'
          }
        },
        lookAnalyse(e) {
          let text = e.target.innerText
          if(text === '解析') {
            e.target.innerText = '收起'
            e.target.parentNode.parentNode.nextElementSibling.classList.remove('dino')
          }else {
            e.target.innerText = '解析'
            e.target.parentNode.parentNode.nextElementSibling.classList.add('dino')
          }
        },
        deleteQuestion(e,id) {
          e.target.parentNode.parentNode.parentNode.remove()
        },
        getdata(e) {
//          console.log('move')
        },
        datadragEnd(e) {
          this.orderNum()
        },
        makePaper() {
          let new_obj = {};
          new_obj.paperName = this.paperName
          new_obj.type = '119'
          new_obj.editorType = '2'
          new_obj.paperId = ''
          new_obj.testTime = this.time
          new_obj.knowledgeId = ''
          new_obj.status = '1'
          var line_array = []// 试题行 数组
          var line_obj = {} // 试题行 对象
          line_obj.showOrder = 1
          line_obj.isShow = '0'
          line_obj.remarks = ''
          let linArr = []
          for(let i=0;i<this.questionList.length;i++) {
            let line_inner_obj = {}; // 试题行内小题 对象
            line_inner_obj.questionId = this.questionList[i].questionId
            line_inner_obj.lnOrder = i + 1
            line_inner_obj.groupOrder = this.questionList[i].groupOrder
            line_inner_obj.isSplite = this.questionList[i].isSplite
            line_inner_obj.groupCode = this.questionList[i].groupCode
            linArr.push(line_inner_obj);
          }
          line_obj.customLineTj = linArr;
          line_array.push(line_obj);
          new_obj.questionLines = line_array;
          if(new_obj.questionLines[0].customLineTj.length<=0) {
            this.markInfo.Con = '没有选择错题'
            return;
          }
          let param = JSON.stringify(new_obj);
          this.$http.post('/web/teacher/paper/assign/savecustompaper', param).then(function(response) {
            let retCode = response.body.retCode
            if(retCode === '0000') {
              let retData = response.body.retData
              this.markInfo.Con = '保存成功'
              this.$router.push('/content/teacher/homework/printbook?paperId='+retData.paperId+'&assignId='+retData.assignId+'&paperType='+retData.paperType)
            } else {
              this.markInfo.Con = '保存失败'
            }
          })
        }
      },
      components:{
        'v-mark':mark,
        draggable
      }
    };
</script>
<style>
  @import '../../../../static/common/css/common.css';
  .pre_btns{border-bottom:none!important;overflow: hidden;}
  .pre_btns span{float:right;}
  .pre_btns span a{ border: 1px solid #ccc; margin: 10px; border-radius: 5px; width: 76px; height: 31px; display: block; float: left; line-height: 31px; color: #333; text-align: center; font-size: 15px; }
  .pre_source{padding:20px;}
  .pre_btn:hover{cursor: pointer;}
  .pre_source .exp:hover{border-radius: 8px;border: 1px solid #ccc;}
  .noAnalyze:hover{cursor: pointer;}
  .hasAnalyze:hover{cursor: pointer;}
  .pre_list>li:hover{border-radius: 8px;border: 1px solid #ccc;}
  .pre_list>li {border-radius: 8px;border: 1px solid #ffffff;}
  .pre_list>li{padding:10px;}
  .pre_paperName,.pre_paperTime{margin: 0 auto;text-align: center}
  .pre_paperTime input{width:36px;border: none;text-align:right;}
  @media screen and (min-width: 1600px){
    .pre_container{
      width:1200px;
      height:auto;
      min-height:768px;
      margin:0 auto;
      margin-top:30px;
      background: #fff;
      border-radius: 10px;

      padding:10px;
      font-size:18px;
    }
  }
  @media screen and (max-width: 1599px) and (min-width: 1366px){
    .pre_container{
      width:1000px;
      height:auto;
      min-height:768px;
      margin:0 auto;
      margin-top:30px;
      background: #fff;
      border-radius: 10px;

      padding:10px;
      font-size:16px;
    }
  }
  @media screen and (max-width: 1365px){
    .pre_container{
      width:900px;
      height:auto;
      min-height:600px;
      margin:0 auto;
      margin-top:30px;
      background: #fff;
      border-radius: 10px;

      padding:10px;
      font-size:14px;
    }
  }
  body{
    background: #eee;
  }
  .m_btnBox{
    position: fixed;
    bottom:30px;
    right:400px;
  }
  .pre_btn{
    background: #999;
    color: #fff;
    border-radius: 10px;
    font-size: 20px;
    display: block;
    width: 190px;
    height: 45px;
    text-align: center;
    line-height: 45px;
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
  /*保存*/
  .m_saveToList{
    position: absolute;
    top:30%;
    left:30%;
    z-index: 1112;
    background: #fff;
    display: none;
    width:600px;
    height:300px;
    /*保存 成功时*/
    background: url("../../../../static/teacher/images/homework/m_saveSuccess.png") no-repeat center;
    /*保存 失败时*/
    /* background: url("../../image/me/m_saveLose.png") no-repeat center;*/
  }
  #c_closeG{
    margin-right:20px;
  }
  .pre_btnExit{background:#f9a24a;color:#fff;}
  .pre_btnExit:hover {cursor:pointer;background:#f9a24a;color:#fff;}
  .pre_btnBack{margin-left: 10px}
  .pre_analysisBox p span {
    font-family: "Times New Roman","楷体" !important;
    font-size: 17px !important;
    color: #666;
  }
  .option {
    font-size: 17px;
    font-family: "Times New Roman","宋体";
    color: #666;
    margin-top: 7px;
    margin-left: 7px;
  }
  .option *{
    color: #666 !important;
    font-family: "Times New Roman","宋体";
    font-size: 17px;
  }
  .questionContextChanged span,.questionContext span{
    color: #333;
  }
  .pre_button {
    overflow: hidden;
    right: 0;
    width: 100%;
    padding: 0 19%;
    position: fixed;
  }
  .pre_paperTitle {
    margin-top: 50px;
  }
</style>
