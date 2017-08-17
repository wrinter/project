<template>
  <div class="c_Main ">
    <div class="c_content">
      <div class="c_HomeWork">
        <div class="c_Title">
          <h1 class="fl fs24 fc33">作业提交情况</h1>
        </div>
        <div class="c_HomeMain">
          <div class="c_HomePie" id="c_HomePie">
            <div class="c_noSubmitNames">
              <span style="font-size:14px;">未交</span>
              <span style="color:#ca0e0d;font-size:14px;">{{unSubList.length}}人：</span>
              <span class="c_noNames" v-for="temp in unSubList">{{temp.userName}}</span>
            </div>
            <div class="c_allSubmit">

            </div>
            <div class="c_obj">
              <span>布置对象：</span>
              <span class="teacherName">{{c_grade}}</span>
              <div class="c_Section" id="c_HomeText" @click="selectWork">
                <span class="fs18 fc33 fl" id="c_HomeName">{{work}}</span>
                <i class="fr spriteImg s_selico mt15"></i>
                <!--章节-->
                <el-collapse-transition>
                  <ul class="c_SecShow" id="c_Homeshow" v-show="workFlag">
                    <li class="fs18 HomeShowLi" :id="temp.id" v-for="temp in workList" @click="clickwork(temp)">{{temp.aliasName}}</li>
                  </ul>
                </el-collapse-transition>
              </div>
            </div>
            <div class="c_echart" id="c_echart"></div>
          </div>
          <div class="c_NoHomeName">
            <p>累计未交名单</p>
            <ul id="c_NoHomeName">
              <li v-for="temp in unSubmitList"><span>{{temp.userName}}</span><span>（{{temp.unSubmitNum}}）</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="c_HomeReport">
        <div class="c_Title">
          <h1 class="fl fs24 fc33">测试报告</h1>
        </div>
        <div class="c_Section" id="c_HomeSelect" @click="selectTest">
          <span class="fs18 fc33 fl" id="c_HomeSelectName">{{test}}</span>
          <i class="fr spriteImg s_selico mt15"></i>
          <!--章节-->
          <el-collapse-transition>
            <ul class="c_SecShow" id="c_HomeSelectshow" v-show="testFlag">
              <li class="fs18 HomeSelectShowLi" v-for="temp in testList" :id="temp.id" @click="clickTest(temp)">{{temp.aliasName}}</li>
            </ul>
          </el-collapse-transition>
        </div>
        <div class="c_testCon">
          <table class="t_table fl ">
            <tr v-if="tableList.length>0"><th>序号</th><th>姓名</th><th>成绩</th><th>用时</th></tr>
            <tr v-for="(temp,index) in tableList">
              <td>{{index+1}}</td>
              <td>{{temp.name}}</td>
              <td>{{temp.score}}</td>
              <td v-if="temp.totalTime>temp.shouldTime" class="changeColor">{{temp.cTime}}</td>
              <td v-else>{{temp.cTime}}</td>
            </tr>
          </table>
          <div class="aveScore fl">
            <p>平均分</p>
            <span class="score">
              <i v-for="temp in avgScores" class='fl' :class='"num _"+temp'></i>
            </span>
          </div>
        </div>
        <div class="c_noData"></div>

      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {getReport, getUnsubmit, getWorkDetail, getTest, getTestDetails} from '../../../service/classmanage/classmanage.js';
  import echarts from 'echarts'
  export default {
      data() {
        return{
          c_grade:'',
          classId:'',
          teacherId:'',
          work:'',
          workFlag:false,
          workList:[],
          unSubmitList:[],
          unSubList:[],
          test:'',
          testFlag:false,
          testList:[],
          tableList:[],
          avgScores:[]
        };
      },
      mounted() {
        this.init()
        this.showReport()
        this.showWorkDeatals()
        this.showUnsubmit()
        this.showTest()
      },
      methods: {
        init() {
          let c_grade = window.localStorage.getItem('c_grade')
          let teacherName = window.localStorage.getItem('teacherName')
          let crumbs = this.$route.meta.crumbs
          crumbs[2].name = c_grade
          crumbs[3].name = teacherName
          this.teacherName = c_grade
          this.classId = window.localStorage.getItem('nowClassId')
          this.teacherId = window.localStorage.getItem('teacherId')
          this.c_grade = c_grade
        },
        showReport() {
          let para = {'classId': this.classId, 'teacherId': this.teacherId}
          let that = this
          getReport(this, para).then(function (response) {
            let res = response.body
            if (res.retCode == '0000') {
              that.workList = res.retData
              that.work = res.retData[0].aliasName
              that.showWorkDeatals(res.retData[0].id)
            }
          })
        },
        selectWork() {
          if (this.workFlag) {
            this.workFlag = false
          } else {
            this.workFlag = true
          }
        },
        selectTest() {
          if (this.testFlag) {
            this.testFlag = false
          } else {
            this.testFlag = true
          }
        },
        showUnsubmit() {
          let para = {'classId': this.classId, 'teacherId': this.teacherId}
          let that = this
          getUnsubmit(this, para).then(function (response) {
            let res = response.body
            if (res.retCode == '0000') {
              that.unSubmitList = res.retData
            }
          })
        },
        showWorkDeatals(id) {
          let para = {'paperAssignId': id}
          let that = this
          getWorkDetail(this, para).then(function (response) {
            let res = response.body
            if (res.retCode == '0000') {
              let retData = res.retData
              that.unSubList = retData.unSubmitList
              let pieData = [];
              pieData.push({value: retData.unSubmitList.length, name: "未交"}, {
                value: retData.submittedSize,
                name: '已交'
              });
              that.showPie(pieData);
            }
          })
        },
        showPie(pieData) {
          let myChart = echarts.init(document.getElementById('c_echart'));
          let option = {
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              x: 'right',
              y: 'bottom',
              data: ['已交', '未交']
            },
            color: [
              '#FC5555', '#5FCFF9'
            ],
            series: [
              {
                name: '作业提交情况',
                type: 'pie',
                radius: ['50%', '80%'],
                center: ['35%', '50%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '24',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: pieData
              }
            ]
          };
          myChart.setOption(option);
        },
        showTest() {
          let para = {'classId': this.classId, 'teacherId': this.teacherId}
          let that = this
          getTest(this, para).then(function (response) {
            let res = response.body
            if (res.retCode == '0000') {
              that.testList = res.retData
              that.test = res.retData[0].aliasName
              that.showTestDetails(res.retData[0].id)
            }
          })
        },
        showTestDetails(id) {
          let para = {'paperAssignId': id}
          let that = this
          this.tableList = []
          this.avgScores = []
          getTestDetails(this, para).then(function (response) {
            let res = response.body
            if (res.retCode == '0000') {
              if (res.retData.length > 0) {
                let sumScore = 0
                let retData = res.retData
                for (let j = 0; j < retData.length; j++) {
                  let record = {}
                  record.name = retData[j].name
                  record.score = retData[j].score
                  record.totalTime = retData[j].totalTime
                  record.cTime = that.ToTime(retData[j].totalTime)
                  record.shouldTime = retData[j].shouldTime
                  that.tableList.push(record)
                  sumScore += record.score
                }
                let avgScore = Math.round(sumScore / retData.length);
                if(avgScore<100 && avgScore>=0) {
                  that.avgScores.push(Math.floor(avgScore/10))
                  that.avgScores.push(avgScore%10)
                }
                if(avgScore>=100) {
                  that.avgScores.push(Math.floor(avgScore/100))
                  that.avgScores.push(Math.floor(avgScore/10))
                  that.avgScores.push(avgScore%10)
                }
              }
            }
          })
        },
        ToTime(value) {
          var theTime = parseInt(value)// 秒
          var hour = 0//时
          var minute = 0// 分
          var second = 0//秒
          var result;
          if (value == null || value == '') {
            result = '- -'
            return result
          } else {
            if (parseInt(theTime) > 60) {
              minute = parseInt(theTime / 60)
              second = parseInt(theTime % 60)
            } else {
              hour = 0
              minute = 0
              second = theTime
            }
            if (parseInt(minute) > 60) {
              hour = parseInt(minute / 60)
              minute = parseInt(minute % 60)
            } else {
              hour = 0
            }
            hour = this.showTime(hour)
            minute = this.showTime(minute)
            second = this.showTime(second)
            result = hour + ':' + minute + ':' + second
            return result
          }
        },
        showTime(value) {
          var showStr = ""
          if(parseInt(value)<10) {
            showStr = "0" + value
          }else {
            showStr = value
          }
          return showStr
        },
        clickTest(obj) {
          this.test = obj.aliasName
          this.showTestDetails(obj.id)
          this.testFlag = false
        },
        clickwork(obj) {
          this.work = obj.aliasName
          this.showWorkDeatals(obj.id)
          this.workFlag = false
        }
      }
    };
</script>
<style>
  @import '/static/common/css/common.css';
  @media screen and (min-width: 1600px){
    .c_HomeWork{width: 100%;margin-top: 40px;overflow: hidden; height: 420px;background: white; border-radius: 10px;}
    .c_content{width: 1200px; margin: 0 auto;clear: both;text-align: center;position: relative;}
    .c_Title{width: 100%;height: 60px;line-height:60px;box-sizing: border-box;padding: 0 40px 0 30px;border-bottom: 1px solid #CCC;}
    .c_Section{width: 240px;height: 40px;position:relative;line-height: 40px;cursor: pointer; float: right;margin-top:-10px; box-sizing: border-box;padding: 0 15px 0 20px;border: 1px solid #CCC;z-index: 20;border-radius: 10px;}
    .c_Section span{display: inline-block;width: 200px;height: 40px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;.-o-text-overflow: ellipsis;}
    .s_selico{position: absolute;right:0;top:0px;}
    .c_SecShow{width: 240px;max-height:270px;overflow-y: auto;overflow-x: hidden; background: white; position: absolute;top: 40px;left: -1px;border-radius: 2px;border: 1px solid #CCC;  box-sizing: border-box;padding: 0 15px 0 20px;}
    .c_SecShow li{width: 100%;line-height: 30px;text-align: left;height:30px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;.-o-text-overflow: ellipsis;}
    .c_SecShow li:hover{color: #65B113;}
    .c_HomeMain,.c_HomePie{width: 100%;height: 360px;padding:20px;box-sizing: border-box;float: left;}
    .c_HomePie,.c_NoHomeName{width: 50%;height: 100%;float: left; border-right: 1px solid #CCC;}
    .c_echart{
      width:100%;
      height:80%;
    }
    #c_HomePie{
      position: relative;
    }
    .c_noSubmitNames{
      position:absolute;
      right:20px;
      top:80px;
      z-index:10;
      background: white;
      width:250px;
      padding-left:10px;
      padding-right:20px;
      height: 30px;
      line-height:30px;
      overflow: hidden;
      border:1px solid #ccc;
      text-align: left;
    }
    .c_allSubmit{
      position:absolute;
      right:20px;
      top:60px;
      z-index:10;
      background: white;
      width:150px;
      padding-left:10px;
      padding-right:20px;
      height: 30px;
      line-height:30px;
      overflow: hidden;
      border:1px solid #ccc;
      text-align: left;
    }
    .c_noNames{
      margin-right:10px;
      color:#ca0e0d;
      font-size: 18px;
    }
    .downShow{
      position: absolute;
      right:5px;
      top:10px;
    }
    .c_obj{
      width:100%;
      height:20%;
      line-height:20%;
      text-align: left!important;
    }
    .c_NoHomeName{border-right: 0;
    }
    #c_NoHomeName{
      overflow-y: auto;
      width:580px;
      max-height:300px;
    }

    #c_NoHomeName li{
      width:280px;
      height:50px;
      line-height: 50px;
      float:left;
      text-align: center;
    }

    .c_HomeReport{
      width:100%;
      min-height:600px;
      height:auto;

      border-radius: 10px;
      background: white;
      margin-top:40px;
    }
    #c_HomeSelect{
      margin-top:-50px;
      margin-right:20px;
      border-radius: 0;
    }
    .NoImg{
      height: 60px;
      margin-top: 120px;
    }
    .t_table{
      width:75%;
      height:auto;
      min-height:120px;
      border: 1px solid #ccc;
      margin-top:30px;
      margin-left:30px;
      margin-right: 30px;
      color:#333;
      font-size:18px;
      text-align: center;
    }
    .aveScore{
      width:20%;
      margin-top:50px;
    }
    .aveScore p{
      font-size:24px;
    }
    th{
      text-align: center;
    }
    tr{
      height:40px;
      line-height: 40px;
    }
    tr:nth-child(2n+1){
      background: #f2fcfe;
    }
    .changeColor{
      color:#ca0e0f;
    }
    .score{
      display: block;
      text-align: center;
      height:100px;
      margin-left:65px;
      margin-top:20px;
    }
    .score i{
      display: block;
      margin-right:2px;
    }

  }

  @media screen and (min-width:1366px) and (max-width:1599px){
    .c_content{
      width:1000px;
      height:auto;
      margin:0 auto;
    }
    .c_HomeWork{width: 100%;margin-top: 40px;overflow: hidden; height: 420px;background: white;border-radius: 10px;}
    .c_content{width: 1200px; margin: 0 auto;clear: both;text-align: center;position: relative;}
    .c_Title{width: 100%;height: 60px;line-height:60px;box-sizing: border-box;padding: 0 40px 0 30px;border-bottom: 1px solid #CCC;}
    .c_Section{width: 240px;height: 40px;position:relative;line-height: 40px;cursor: pointer; float: right;margin-top:-10px; box-sizing: border-box;padding: 0 15px 0 20px;border: 1px solid #CCC;z-index: 20;border-radius: 10px;}
    .c_Section span{display: inline-block;width: 200px;height: 40px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;.-o-text-overflow: ellipsis;}
    .s_selico{position: absolute;right:0;top:0px;}
    .c_SecShow{width: 240px;max-height:270px;overflow-y: auto;overflow-x: hidden; background: white; position: absolute;top: 40px;left: -1px;border-radius: 2px;border: 1px solid #CCC;  box-sizing: border-box;padding: 0 15px 0 20px;}
    .c_SecShow li{width:200px;line-height: 30px;height:30px;text-align: left;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;.-o-text-overflow: ellipsis;}
    .c_SecShow li:hover{color: #65B113;}
    .c_HomeMain,.c_HomePie{width: 100%;height: 360px;padding:20px;box-sizing: border-box;float: left;}
    .c_HomePie,.c_NoHomeName{width: 50%;height: 100%;float: left; border-right: 1px solid #CCC;}
    .c_echart{
      width:100%;
      height:80%;
    }
    #c_HomePie{
      position: relative;
    }
    .c_noSubmitNames{
      position:absolute;
      right:20px;
      top:60px;
      z-index:10;
      background: white;
      width:230px;
      padding-left:10px;
      padding-right:20px;
      height: 30px;
      line-height:30px;
      overflow: hidden;
      border:1px solid #ccc;
      text-align: left;
    }
    .c_allSubmit{
      position:absolute;
      right:20px;
      top:60px;
      z-index:10;
      background: white;
      width:130px;
      padding-left:10px;
      padding-right:20px;
      height: 30px;
      line-height:30px;
      overflow: hidden;
      border:1px solid #ccc;
      text-align: left;
    }
    .c_noNames{
      margin-right:10px;
      color:#ca0e0d;
      font-size: 16px;
    }
    .downShow{
      position: absolute;
      right:5px;
      top:10px;
    }
    .c_obj{
      width:100%;
      height:20%;
      line-height:20%;
      text-align: left!important;
    }
    .c_NoHomeName{border-right: 0;
    }
    #c_NoHomeName{
      overflow-y: auto;
      width:500px;
      max-height:300px;
    }

    #c_NoHomeName li{
      width:240px;
      height:50px;
      line-height: 50px;
      float:left;
      text-align: center;
      font-size: 16px;
    }
    .NoImg{
      height: 60px;
      margin-top: 120px;
    }
    #noData{
      padding: 40px 0;
    }
    .c_HomeReport{
      width:100%;
      min-height:600px;
      height:auto;
      border-radius: 10px;
      background: white;
      margin-top:40px;
    }
    #c_HomeSelect{
      margin-top:-50px;
      margin-right:20px;
      border-radius: 0;
    }
    .t_table{
      width:70%;
      height:auto;
      min-height:120px;
      border: 1px solid #ccc;
      margin-top:30px;
      margin-left:30px;
      margin-right: 30px;
      color:#333;
      font-size:16px;
      text-align: center;
    }
    .aveScore{
      width:20%;
      margin-top:50px;
    }
    .aveScore p{
      font-size:22px;
    }
    th{
      text-align: center;
    }
    tr{
      height:40px;
      line-height: 40px;
    }
    tr:nth-child(2n+1){
      background: #f2fcfe;
    }
    .changeColor{
      color:#ca0e0f;
    }
    .score{
      display: block;
      text-align: center;
      height:100px;
      margin-left:45px;
      margin-top:20px;
    }
    .score i{
      display: block;
      margin-right:2px;
    }

  }

  @media screen and (max-width:1365px){
    .c_content{
      width:900px;
      height:auto;
      margin:0 auto;
    }
    .c_HomeWork{width: 100%;margin-top: 40px;overflow: hidden; height: 420px;background: white;border-radius: 10px;}
    .c_Title{width: 100%;height: 60px;line-height:60px;box-sizing: border-box;padding: 0 40px 0 30px;border-bottom: 1px solid #CCC;}
    .c_Section{width: 240px;height: 40px;position:relative;line-height: 40px;cursor: pointer; float: right;margin-top:-16px; box-sizing: border-box;padding: 0 15px 0 20px;border: 1px solid #CCC;z-index: 20;border-radius: 10px;}
    .c_Section span{display: inline-block;width: 200px;height: 40px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;.-o-text-overflow: ellipsis;}
    .s_selico{position: absolute;right:0;top:0px;}
    .c_SecShow{width: 240px;max-height:270px;overflow-y: auto;overflow-x: hidden; background: white;position: absolute;top: 40px;left: -1px;border-radius: 2px;border: 1px solid #CCC;  box-sizing: border-box;padding: 0 15px 0 20px;}
    .c_SecShow li{width: 100%;line-height: 30px;text-align: left;height:30px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;.-o-text-overflow: ellipsis;}
    .c_SecShow li:hover{color: #65B113;}
    .c_HomeMain,.c_HomePie{width: 100%;height: 360px;padding:15px;box-sizing: border-box;float: left;}
    .c_HomePie,.c_NoHomeName{width: 50%;height: 100%;float: left; border-right: 1px solid #CCC;}
    .c_echart{
      width:100%;
      height:80%;
    }
    #c_HomePie{
      position: relative;
    }
    .c_noSubmitNames{
      position:absolute;
      right:20px;
      top:60px;
      z-index:10;
      background: white;
      width:230px;
      padding-left:10px;
      padding-right:20px;
      height: 30px;
      line-height:30px;
      overflow: hidden;
      border:1px solid #ccc;
      text-align: left;
    }
    .c_allSubmit{
      position:absolute;
      right:20px;
      top:60px;
      z-index:10;
      background: white;
      width:130px;
      padding-left:10px;
      padding-right:20px;
      height: 30px;
      line-height:30px;
      overflow: hidden;
      border:1px solid #ccc;
      text-align: left;
    }
    .c_noNames{
      margin-right:10px;
      color:#ca0e0d;
      font-size: 14px;
    }
    .downShow{
      position: absolute;
      right:5px;
      top:10px;
    }
    .c_obj{
      width:100%;
      height:20%;
      line-height:20%;
      text-align: left!important;
    }
    .c_NoHomeName{border-right: 0;
    }
    #c_NoHomeName{
      overflow-y: auto;
      width:450px;
      max-height:300px;
    }

    #c_NoHomeName li{
      width:210px;
      height:50px;
      line-height: 50px;
      float:left;
      text-align: center;
      font-size: 14px;
    }
    .NoImg{
      height: 60px;
      margin-top: 120px;
    }
    .c_HomeReport{
      width:100%;
      min-height:600px;
      height:auto;

      border-radius: 10px;
      background: white;
      margin-top:40px;
    }
    #c_HomeSelect{
      margin-top:-50px;
      margin-right:20px;
      border-radius: 0;
    }
    .t_table{
      width:70%;
      height:auto;
      min-height:120px;
      border: 1px solid #ccc;
      margin-top:30px;
      margin-left:30px;
      margin-right: 30px;
      color:#333;
      font-size:14px;
      text-align: center;
    }
    .aveScore{
      width:20%;
      margin-top:50px;
    }
    .aveScore p{
      font-size:20px;
    }
    th{
      text-align: center;
    }
    tr{
      height:40px;
      line-height: 40px;
    }
    tr:nth-child(2n+1){
      background: #f2fcfe;
    }
    .changeColor{
      color:#ca0e0f;
    }
    .score{
      display: block;
      text-align: center;
      height:100px;
      margin-left:45px;
      margin-top:20px;
    }
    .score i{
      display: block;
      margin-right:2px;
    }

  }
</style>
