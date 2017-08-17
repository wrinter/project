<template>
  <div class="publish_box_Main">
    <div class="publish_box" v-if="classList.length>0">
      <i class="publish_box_close spriteImg c_closeico fr c_closeimg0" @click="closeBox"></i>
      <dl>
        <dt>作业名称：</dt>
        <dd>{{paperInfo.paperName}}</dd>
      </dl>
      <dl>
        <dt>建议用时：</dt>
        <dd><input class="act_time" type="text" v-model="paperInfo.testTime"> 分钟</dd>
      </dl>
      <dl>
        <dt>截止时间：</dt>
        <dd><input class="act_stop_time hasDatepicker" v-model="deadline" type="text"></dd>
      </dl>
      <div class="dl tab">
        <dl>
          <dt>布置对象：</dt>
          <dd>
            <a class="obj_type on" href="javascript:;" @click="showSelected(0,$event)">班级</a>
            <a class="obj_type" href="javascript:;" v-if="personShow" @click="showSelected(1,$event)">个人</a>
            <a class="obj_type" href="javascript:;" v-if="personShow" @click="showSelected(2,$event)">小组</a>
          </dd>
        </dl>
        <ul class="obj_type_con set_classes" style="max-height: 571px; overflow-y: auto;" v-if="classShow">
          <li data-num="0" v-for="temp in classList" @click="clickClass($event,temp)">{{temp.className}}</li>
        </ul>
        <div class="obj_type_con set_user" style="max-height: 571px; overflow-y: auto;" v-if="indvShow">
          <ul id="pclass">
            <li :class="{'on':index==0}" v-for="(temp,index) in indivList" @click="changeClass(index,$event,'pclass',temp)">{{temp.calssName}}</li>
          </ul>
          <div v-if="tempIndv.studentInfos.length>0">
            <ol class="user" style="height: 0px;">
              <li v-for="item in tempIndv.studentInfos" @click="selectPerson($event,item)"><span>{{item.userName}}</span></li>
            </ol>
          </div>
          <div v-else>暂无学生，请到班级管理页面进行设置</div>
        </div>
        <div class="obj_type_con set_group" style="max-height: 571px; overflow-y: auto;" v-if="groupShow">
          <ul id="gclass">
            <li :class="{'on':index==0}" v-for="(temp,index) in groupList" @click="changeClass(index,$event,'gclass',temp)">{{temp.calssName}}</li>
          </ul>
          <div  v-if="tempGroup.studentInfos.length>0">
            <ol class="user gr" style="height: 0px;">
              <li v-for="item in tempGroup.studentInfos" @click="selectGroup($event,item)"><span>{{item.userName}}</span></li>
            </ol>
          </div>
          <div v-else>
            <ol class="user gr" style="height: 0px;">
              <li style="width: 100%;text-align: center;color: #999;">暂无小组，请到班级管理页面进行设置</li>
            </ol>
          </div>
        </div>
      </div>
      <div class="dl done">
        <a class="work_done" href="javascript:;" @click="afterSelect">确定</a>
      </div>
    </div>
    <div class="data_Popup exercise_ErrorUrl" v-if="popFlag">
      <div class="in">
        <span class='close' @click="closePop">关闭</span>
        <img src='/static/teacher/images/homework/exercise_ErrorUrl_bg.jpg' />
        <div class='btn'>
          <router-link v-bind:to="'/content/teacher/classmanage/classmain'">创建班级</router-link>
          <router-link v-bind:to="'/content/teacher/classmanage/classmain'">加入班级</router-link>
        </div>
      </div>
    </div>
    <v-mark :MarkCon="markInfo"></v-mark>
  </div>
</template>
<script type="text/ecmascript-6">
  import {contains} from '../../../common/js/common.js'
  import mark from '../../common/Mark.vue'
    export default {
      props:['paperInfo'],
      data () {
        return {
          deadline:'',
          classList:[],
          show:false,
          selectedClass:[],
          selectedStu:[],
          selectedGroup:[],
          selectedClassId:'',
          selectedName:'',
          selectedUser:[],
          markInfo:{'Con':'', 'Random':''},
          assignObj:'0',
          popFlag:false,
          indivList:[],
          groupList:[],
          personShow:false,
          tempIndv:{},
          tempGroup:{},
          groupShow:false,
          indvShow:false,
          classShow:true
        }
      },
      mounted () {
        this.getDeadline(1)
        this.getClass()
      },
      methods: {
        getClass () {
          this.$http.post('/web/teacher/paper/assign/assignclass').then(function (response) {
            let retCode = response.body.retCode
            let retData = response.body.retData
            if (retCode === '0000') {
              if (retData.length > 0) {
                this.classList = retData
                this.paperInfo.show = true
                let thisPt = this.paperInfo.paperType
                // 获取个人  /嵌套：获取小组
                if (thisPt === '102' || thisPt === '112' || thisPt === '103' || thisPt === '113' || thisPt === '104' || thisPt === '114') { // 分层作业
                  this.personShow = true
                  this.getPerson()
                  this.getGroup()
                }
              } else {
                this.popFlag = true
              }
            }
          })
        },
        getPerson () {
          this.$http.post('/web/teacher/paper/assign/assignindividual').then(function (response) {
              let retCode = response.body.retCode
              let retData = response.body.retData
              if (retCode === '0000') {
                this.indivList = retData
                this.tempIndv = retData[0]
              }
            })
        },
        getGroup () {
          this.$http.post('/web/teacher/paper/assign/assigngroup').then(function (response) {
            let retCode = response.body.retCode
            let retData = response.body.retData
            if (retCode === '0000') {
              this.groupList = retData
              this.tempGroup = retData[0]
            }
          })
        },
        getDeadline (AddDayCount) {
          let dd = new Date();
          dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
          let y = dd.getFullYear()
          let m = dd.getMonth() + 1
          let d = dd.getDate()
          if (String(m).length === 1) {
            m = '0' + m
          }
          if (String(d).length === 1) {
            d = '0' + d
          }
          let thisVal = y + '-' + m + '-' + d + ' 22:00'
          this.deadline = thisVal
        },
        closeBox () {
          this.paperInfo.show = false
        },
        clickClass (e, obj) {
          let classList = e.target.classList
          if (obj.studNum === 0) {
            this.markInfo.Random = Math.random()
            this.markInfo.Con = '此班级中无学生，不能布置作业'
            e.target.style.color = 'rgb(204, 204, 204)'
            return
          }
          if (contains(classList, 'on')) {
            classList.remove('on')
            let index = this.selectedClass.indexOf(obj)
            this.selectedClass.splice(index, 1)
          } else {
            this.selectedClass.push(obj)
            classList.add('on')
          }
        },
        changeClass (index, e, id, obj) {
          let classList = e.target.classList
          let pclass = document.getElementById(id)
          if (contains(classList, 'on')) {
            return
          } else {
            if (this.selectedUser.length > 0) {
              this.markInfo.Random = Math.random()
              this.markInfo.Con = '不能跨班布置哦！'
              return
            }
            let children = pclass.children
            for (let i=0; i < children.length; i++) {
              children[i].classList.remove('on')
            }
            classList.add('on')
            this.selectedClassId = obj.calssId
            this.selectedName = obj.calssName
            if (id === 'pclass') {
              this.tempIndv = this.indivList[index]
            } else {
              this.tempGroup = this.groupList[index]
            }
          }
        },
        selectPerson (e, obj) {
          let tar = e.target
          if (e.target.tagName === 'SPAN') {
            if (contains(tar.classList, 'on')) {
              tar.classList.remove('on')
              let index = this.selectedStu.indexOf(obj.userId)
              this.selectedStu.splice(index, 1)
              this.selectedUser.splice(index, 1)
            } else {
              tar.classList.add('on')
              this.selectedStu.push(obj.userId)
              this.selectedUser.push(obj.userName)
            }
          }
        },
        selectGroup (e, obj) {
          let tar = e.target
          if (e.target.tagName === 'SPAN') {
            if (contains(tar.classList, 'on')) {
              tar.classList.remove('on')
              let index = this.selectedGroup.indexOf(obj.userId)
              this.selectedGroup.splice(index, 1)
              this.selectedUser.splice(index, 1)
            } else {
              tar.classList.add('on')
              this.selectedGroup.push(obj.userId)
              this.selectedUser.push(obj.userName)
            }
          }
        },
        showSelected (str, e) {
          let classList = e.target.classList
          if (contains(classList, 'on')) {
            return
          } else {
            classList.add('on')
            if (str === 0) {
              e.target.nextElementSibling.classList.remove('on')
              e.target.nextElementSibling.nextElementSibling.classList.remove('on')
              this.classShow = true
              this.indvShow = false
              this.groupShow = false
              this.assignObj = '0'
            } else if (str === 1) {
              this.selectedUser = []
              this.classShow = false
              this.indvShow = true
              this.groupShow = false
              e.target.nextElementSibling.classList.remove('on')
              e.target.previousElementSibling.classList.remove('on')
              this.assignObj = '1'
              this.selectedName = this.indivList[0].calssName
              this.selectedClassId = this.indivList[0].calssId
            } else {
              this.selectedUser = []
              this.classShow = false
              this.indvShow = false
              this.groupShow = true
              e.target.previousElementSibling.classList.remove('on')
              e.target.previousElementSibling.previousElementSibling.classList.remove('on')
              this.assignObj = '2'
              this.selectedName = this.groupList[0].calssName
              this.selectedClassId = this.groupList[0].calssId
            }
          }
        },
        afterSelect () {
          let doparam = {}
          doparam.paperResId = this.paperInfo.paperId
          doparam.assignId = this.paperInfo.assignId
          doparam.paperName = this.paperInfo.paperName
          doparam.testTime = this.paperInfo.testTime
          doparam.score = this.paperInfo.score
          doparam.paperType = this.paperInfo.paperType
          doparam.deadline = new Date(this.deadline)
          // 班级和其它布置类型请求地址不同
          let postUrl = '/web/teacher/paper/assign/assignpaperstogroup'
          // 如布置给小组或个人,添加布置类型
          if (this.assignObj === '1') {
            doparam.objType = 'user'
            doparam.classId = this.selectedClassId
            doparam.userIds = this.selectedStu
            doparam.objNames = this.selectedName + this.selectedUser.join('、')
          } else if (this.assignObj === '2') {
            doparam.objType = 'group'
            doparam.classId = this.selectedClassId
            doparam.userIds = this.selectedGroup
            doparam.objNames = this.selectedName + this.selectedUser.join('、')
          } else {
            doparam.objType = 'class'
            doparam.assignObj = this.selectedClass
            postUrl = '/web/teacher/paper/assign/assignpaperstoclass'
          }
          // 请求前检查
          if (!this.checkNum(this.paperInfo.testTime)) {
            this.markInfo.Random = Math.random()
            this.markInfo.Con = '请输入正确的建议用时'
          } else if (this.deadline === '') {
            this.markInfo.Random = Math.random()
            this.markInfo.Con = '请您选择日期'
          } else if (new Date(this.deadline) < new Date()) {
            this.markInfo.Random = Math.random()
            this.markInfo.Con = '请您选择正确的日期'
          } else if (this.assignObj === '0') {
            if (this.selectedClass.length === 0) {
              this.markInfo.Random = Math.random()
              this.markInfo.Con = '请您选择班级'
            } else {
              this.publishEnsure(doparam, postUrl)
            }
          } else if (this.assignObj === '1') {
            if (this.selectedStu.length === 0) {
              this.markInfo.Random = Math.random()
              this.markInfo.Con = '请您选择个人'
            } else {
              this.publishEnsure(doparam, postUrl)
            }
          } else if (this.assignObj === '2') {
            if (this.selectedGroup.length === 0) {
              this.markInfo.Random = Math.random()
              this.markInfo.Con = '请您选择小组'
            } else {
              this.publishEnsure(doparam, postUrl)
            }
          }
        },
        checkNum (value) {
          let reg = /^\d+$/;
          if (value !== 0 && value < 1000 && String(value)[0] !== 0) {
            if (reg.test(value)) {
              return true;
            }
          }
          return false;
        },
        publishEnsure (para, url) {
          let param = JSON.stringify(para)
          this.$http.post(url, param).then(function (response) {
            let retCode = response.body.retCode
            if (retCode === '0000') {
              this.markInfo.Random = Math.random()
              this.markInfo.Con = '布置成功,即将跳转'
              this.$router.push('/content/teacher/homework/assignwork?id=5d25f8a8a59e11e680f576304dec7eb7')
            } else {
              this.markInfo.Random = Math.random()
              this.markInfo.Con = '布置失败,请联系管理员'
            }
          })
        },
        closePop () {
          this.popFlag = false
          this.paperInfo.show = false
        }
      },
      components: {
        'v-mark': mark
      }
    };
</script>
<style>
  .dibk{display:block;}
  .publish_box_Main{position: fixed;top: 0;left: 0;width: 100%;min-height: 100%;z-index: 10000;background: rgba(0,0,0,.3);}
  .publish_box div{overflow:hidden;width: 100%;}
  .publish_box{position: relative;top: 150px;margin: 0 auto;padding: 40px 0;border-radius: 10px;box-shadow: 0 2px 7px 0 rgba(0,0,0,0.5);background: #fff;}
  .publish_box > dl,.publish_box .dl{width: 60%;margin: 0 auto;font-size: 16px;line-height: 46px;overflow:hidden;}
  .publish_box > dl dt{float: left;width: 15%;}
  .publish_box > dl dd{float: left;width: 85%;}
  .publish_box > dl dd input{height: 28px;line-height: 28px;text-indent: 0.5em;border-radius: 3px;border: 1px solid #ccc; background: #fff;}
  .publish_box > dl dd input.act_time{width: 66px;margin-right: 5px;text-align: center;text-indent: 0;}
  .publish_box > dl dd input.act_stop_time{width: 156px;text-align: center;text-indent: 0;}
  .publish_box > dl dd input.act_stop_time_h,.publish_box > dl dd input.act_stop_time_m{width: 50px;margin-left: 6px;background: url("../../../../static/teacher/images/homework/set_time.png") no-repeat 35px 10px;}
  .publish_box .tab{padding: 10px;border-radius: 8px;border: 1px solid #ccc;}
  .publish_box .tab dl{}
  .publish_box .tab dl dt{float: left;width: 15%;line-height: 28px;}
  .publish_box .tab dl dd{float: left;width: 85%;}
  .publish_box .tab dl dd a{float: left;width: 140px;margin-right: 10px;line-height: 28px;text-align: center;border-radius: 6px;}
  .publish_box .tab dl dd a.on{background: #65b113;color: #fff;}
  .publish_box .tab ul{width: 30%;margin: 0 auto;margin-top: 30px;}
  .publish_box .tab ul li{overflow: hidden;margin-top: 10px;line-height: 32px;text-align: center;border-radius: 8px;border: 1px solid #ccc;color: #666;cursor: pointer;}
  .publish_box .tab ul li.on{border: 1px solid #65b113;background: #65b113;color: #fff;}
  .publish_box .done{margin-top: 40px;}
  .work_done{display: block;width: 150px;line-height: 36px;margin: 0 auto;font-size: 18px;text-align: center;border-radius: 8px;background: #65b113;color: #fff;}
  .work_done:hover{background: #5faa0f;}
  .work_done:active{background: #529708;}
  .ui-datepicker-next.ui-corner-all,.ui-datepicker-prev.ui-corner-all{transition: all 0s ease;}
  ul.set_time{position: absolute;z-index: 10000;width: 50px;max-height: 120px;overflow-y: auto;border: 1px solid #ccc;background: #fff;}
  ul.set_time li{text-align: center;cursor: pointer;color: #666;}
  ul.set_time li:hover{background: #eee;color: #444;}
  ul.set_time li:active{background: #aaa;}
  .publish_box .tab .set_user ul,.publish_box .tab .set_group ul{float: left;width: 20%;margin-top: 5px;}
  .obj_type_con > div{float: left;width: 77%;margin-left: 1.5%;margin-top: 15px;border: 1px solid #ccc;}
  .obj_type_con > div > ol{width: 100%;}
  .obj_type_con > div > ol li{line-height: 36px;border-top: 1px solid #ccc;}
  .obj_type_con > div > ol li:first-child{border-top: none;}
  .obj_type_con > div > ol li:nth-child(2n){background: #f6f6f6;}
  .obj_type_con > div > ol li:nth-child(2n + 1) span:after{content: "";position:absolute;top: 0;right: 0;bottom: 0;width: 1px;border-right: 1px solid #ccc;}
  .obj_type_con > div > ol li:nth-child(2n + 1) span:nth-child(4):after{border-right: none;}
  @media screen and (min-width: 1600px){
    .publish_box { width: 1200px;}
  }
  @media screen and (max-width: 1599px) and (min-width: 1366px){
    .publish_box {width: 1000px;}
  }
  @media screen and (max-width: 1365px){
    .publish_box {width: 900px;}
  }
</style>
