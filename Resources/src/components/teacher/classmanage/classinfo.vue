<template>
  <div class="c_Main">
      <!--教师区域-->
      <article class="c_TeacherAreaWrap">
        <!--班级下拉框-->
        <div class="c_ClassDropList">
          <div class="c_MainX fl fs18" @click="showJoinedClass">
            <span class="c_minxS">{{tempClass}}</span>
            <div class="c_dropList">
              <i class="spriteImg i_downico"></i>
              <el-collapse-transition>
                <ul v-show="joinedShow">
                  <li v-for="temp in joinedList" :classid="temp.classId" :headteacherid="temp.headTeacherId" @click="selectClass(temp)">{{temp.c_grade}}</li>
                </ul>
              </el-collapse-transition>
            </div>
          </div>
          <!--班级码-->
          <p class="fl fs18 fc33 c_ClassNum">
            <span>班级码：</span>
            <span class="c_ClassCode">{{classCode}}</span>
          </p>
        </div>
        <div class="c_TeacherArea">
          <div class="c_TeacherAreaTop">
            <!--退出班级-->
            <button class="fr c_BtnExit bd1 fs18 cup" v-if="tempTeacher.teacherHeader!='1'" @click="showexitClass">退出班级</button>
            <div class="fr c_more bd1 fs18 cup" v-if="tempTeacher.teacherHeader=='1'" @click="showBtn">
              更多
              <el-collapse-transition>
                <ul class="c_Synsize" v-show="btnFlag">
                  <li class="c_firstSy" @click="headerExit">退出班级</li>
                  <li @click="openDis">一键解散</li>
                </ul>
              </el-collapse-transition>
            </div>
            <button class="fr c_intnav bd1 fs18 cup" v-if="tempTeacher.teacherHeader=='1'" @click="invite">邀请</button>
          </div>
          <!--教师列表区-->
          <div class="c_TeacherAreaList">
            <!--当前教师-->
            <div class="c_TeacherAreaCurrent fl">
              <li>
                <p class="c_TeacherPhoto bd1">
                  <img v-if="tempTeacher.teacherImage" :src="tempTeacher.teacherImage" alt="" class="w100 fl">
                  <img v-else src="/static/teacher/images/classmanage/user.png" alt="" class="w100 fl">
                </p>
                <i class="c_TeacherTag spriteImg s_teacherico" v-if="tempTeacher.teacherHeader=='1'"></i>
                <p class="fs18 fc66 c_Subject" :title="tempTeacher.subjectName+tempTeacher.teacherName">
                  <span>{{tempTeacher.subjectName}}</span>
                  <span>{{tempTeacher.teacherName}}</span>
                </p>
                <span class="teacherFirst dino">{{tempTeacher.teacherFirst}}</span>
                <span class="teacherHeader dino">{{tempTeacher.teacherHeader}}</span>
                <span class="teacherId dino">{{tempTeacher.teacherId}}</span>
                <span class="c_setTeacher dino">设为班主任</span>
                <span class="c_deleteClass dino">删除</span>
              </li>
            </div>
            <!--其他教师-->
            <div class="c_OtherTeacher fl" v-if="otherTeacher.length>0">
              <ul class="c_OtherTeacherWrap" :style="{left:leftRange+'px'}">
                  <li v-for="temp in otherTeacher" :class="{'c_pointer':pFlag}" @click="showInfo(temp)" @mouseenter="enter($event)" @mouseleave="leave($event)">
                    <p class="c_TeacherPhoto bd1">
                      <img v-if="temp.teacherImage" :src="temp.teacherImage" alt="" class="w100 fl">
                      <img v-else src="/static/teacher/images/classmanage/user.png" alt="" class="w100 fl">
                    </p>
                    <i class="c_TeacherTag spriteImg s_teacherico" v-if="temp.teacherHeader=='1'"></i>
                    <p class="fs18 fc66 c_Subject" :title="temp.subjectName+temp.teacherName">
                      <span>{{temp.subjectName}}</span>
                      <span>{{temp.teacherName}}</span>
                    </p>
                    <span class="teacherFirst dino">{{temp.teacherFirst}}</span>
                    <span class="teacherHeader dino">{{temp.teacherHeader}}</span>
                    <span class="teacherId dino">temp.teacherId</span>
                    <span class="c_setTeacher dino" @click.stop="setTeacherHead(temp)">设为班主任</span>
                    <span class="c_deleteClass dino"  @click.stop="deleteTeacher(temp)">删除</span>
                  </li>
              </ul>
              <i class="c_TeacherLeft spriteImg s_leftico" v-if="otherTeacher.length>4" @click="goLeft"></i>
              <i class="c_TeacherRight spriteImg s_rightico" v-if="otherTeacher.length>4" @click="goRight"></i>
            </div>
          </div>
        </div>
      </article>
      <!--学生区域-->
      <article class="c_StudentArea">
        <div class="c_StudentAreaTab">
          <button class="c_StudentAreaBtn c_StudentManageBtn fs18 bd1 c_StudentAreaBtnCur" @click="stuManage($event)">学生管理</button>
          <button class="c_StudentAreaBtn c_GroupManageBtn fs18 bd1" @click="groupManage($event)">小组管理</button>
        </div>
        <div class="c_StudentSection">
          <ul>
            <!--学生管理-->
            <li class="c_StudentManageWrap" v-if="mFlag">
              <ul class="c_StudentList" v-if="studentList.length>0">
                <li v-for="(temp,index) in studentList">
                  <span class="fs18 fc33 c_StudentNum">{{index+1}}.</span>
                  <span class="c_StudentName0 fs18 fc33 fl">{{temp.sutdentName}}</span>
                  <span class="c_StudentTelNum fs18 fc33 fl">手机:{{temp.studentMobile}}</span>
                  <i class="spriteImg fr c_StudentDel s_Delico0" v-if="tempTeacher.teacherHeader=='1'" :studentid="temp.studentId" @mouseenter="denter($event)" @mouseleave="dleave($event)" @click="deleteStudent(temp)"></i>
                </li>
              </ul>
              <ul v-else class="c_StudentList"><li class="c_NoStudent">快去邀请学生加入班级</li></ul>
            </li>
            <!--小组管理-->
            <li class="c_GrouptManageWrap" v-if="!mFlag">
              <!--没有分组的初始状态-->
              <div class="c_NoGroup" v-if="noGroup&&studentList.length>0">
                <p class="c_GroupTxt fs18 fc66">
                  <span>创建小组以便更好的布置分层作业哦！</span>
                  <input type="button" class="c_QuotHeatherGroupBtn" value="引用班主任小组" v-if="quote">
                </p>
                <p class="c_CreatGroupBtn" @click="createNewGroup">
                  <img class="c_classImg" src="/static/teacher/images/classmanage/c_add_big.png" alt="">
                  <span>创建小组</span>
                </p>
              </div>
              <!--编辑小组的状态-->
              <div class="c_EditGroupWrap" v-if="!noGroup&&studentList.length>0">
                <div class="c_Mainbot1 fl newGroup" v-for="group in groupData">
                <i class="spriteImg s_delico a_MainCha" @click="deleteGroup(group)"></i>
                <h3 class="fs24 c_MainZ" :groupId="group.groupId">
                  {{group.groupName}}
                </h3>
                <ul :id='"g_ul_"+group.groupId' class="c_MainList">
                  <li :studentId="stu.sutdentId" v-for="stu in group.classStudentList" @mouseenter="deenter($event)" @mouseleave="deleave($event)">
                    {{stu.sutdentName}}
                    <i class="spriteImg s_delico a_MainDelCha dino" @click="dstuFromGroup(group.groupId,stu.sutdentId)"></i>
                  </li>
                </ul>
                <div class="c_MainB" @click="addStudent($event,group.groupId)">
                  <i class="spriteImg s_addico0 fl c_MainI"></i>
                  <span>添加学生</span>
                </div>
                <p class="c_GroupSaveBtn dino">
                  <button class="c_SaveGroup" @click="saveStu($event,group)">保 存</button>
                  <button class="c_CancelGroup" @click="cancelStu($event)">取消</button>
                </p>
              </div>
                <div class="c_Mainbot1 fl newGroup" v-if="createNew">
                  <i class="spriteImg s_delico a_MainCha"></i>
                  <h3 class="fs24 c_MainZ" groupid="">
                    <input class="c_GroupName" id="gourpName_ipt" placeholder="设置小组名称" autofocus="" type="text" v-model="newName">
                    <span class="c_GroupIdTag">newGroup</span>
                  </h3>
                  <ul id="g_ul_newGroup" class="c_MainList">
                    <li class="c_GroupNoStu"><span class="c_fontShock">请添加学生</span></li>
                    <li v-for="news in ensureStuList" :studentId="news.sutdentId">
                      {{news.sutdentName}}
                    </li>
                  </ul>
                  <div class="c_MainB" @click="addStudent($event,'new')">
                    <i class="spriteImg s_addico0 fl c_MainI"></i>
                    <span>添加学生</span>
                  </div>
                  <p class="c_GroupSaveBtn dino">
                    <button class="c_SaveGroup" @click="saveStu($event,'new')">保 存</button>
                    <button class="c_CancelGroup" @click="cancelStu($event)">取消</button>
                  </p>
                </div>
                <div id="createGroupDiv" class="c_Mainbot1 fl">
                  <div class="c_MainAdd" @click="createNewGroup">
                    <i class="spriteImg s_addico1 c_MainIZove"></i>
                    <p>创建小组</p>
                  </div>
                </div>
                <p class="c_GroupMsg fs18" v-if="noGroupData.length>0">还有同学没加入小组呢，快把ta加进来吧！</p>
              </div>
              <div  class="c_classMsg" v-if="studentList.length==0">暂无学生信息</div>
              <!--创建小组的名单-->
              <div class="c_NoGroupWrap fl" v-if="noGflag">
                <div class="c_nameList">
                  <p class="fs24 fc33 bd1">学生名单</p>
                  <ul class="c_ul">
                    <li v-for="stu in noGroupData" :studentid="stu.sutdentId" @click="selectStu(stu,$event)">{{stu.sutdentName}}</li>
                  </ul>
                  <p class="Ok"><button class="c_OkBtn" @click="addEnsure">确定</button></p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </article>
    <!--返回顶部-->
    <i class="spriteImg backtopico backtop"></i>
    <!--普通老师退出班级弹窗-->
    <div class="m_classMark" v-if="exitFlag">
      <div class="m_ExitClass">
        <span class="m_Close"></span>
        <p class="m_BtnWrap">
          <input type="button" class="m_ExitBtn" value="是的" @click="exitClass"/>
          <input type="button" class="m_NoExitBtn"  value="舍不得" @click="noexitClass"/>
        </p>
      </div>
    </div>
    <!--删除学生的弹窗-->
    <div class="m_DelStudent" v-if="sFlag">
      <div class="m_DelStudentWrap">
        <span class="m_DelClose" @click="closeStu"></span>
        <p class="m_DelBtnWrap">
          <input type="button" class="m_DelBtn" value="是的" @click="todeleteStu"/>
          <input type="button" class="m_NoDelBtn"  value="舍不得" @click="closeStu"/>
        </p>
      </div>
    </div>
    <!--删除分组的弹窗-->
    <div class="m_DelGroup dino">
      <div class="m_DelGroupWrap">
        <span class="m_DelGroupClose"></span>
        <p class="m_DelGroupBtnWrap">
          <input type="button" class="m_DelGroupBtn" value="是的"/>
          <input type="button" class="m_NoDelGroupBtn"  value="保留" />
        </p>
      </div>
    </div>
    <!--引用班主任分组弹窗-->
    <div class="m_classTchMask">
      <div class="m_classTch">
        <h3>此小组为班主任创建的小组，是否应用</h3>
        <div class="m_classTchList">
        </div>
        <div class="m_classTchbtn">
          <input type="button" class="m_classTchbtnOne" value="不用了，谢谢" />
          <input type="button" class="m_classTchbtnTwo" value="好的，应用" />
        </div>
      </div>
    </div>
    <!--解散班级弹出框-->
    <div class="m_classDis" v-if="disFlag">
      <div class="m_classDisSon">
        <i class="spriteImg s_delico" @click="closedis"></i>
        <h2 id="dish">
          {{disCue}}
          <p class='c_code'>{{errorCue}}</p>
        </h2>
        <div class="m_classPass">
          <input id="classPass" type="password" maxlength="16"  style="box-sizing: border-box;padding-left: 20px;" v-model="password">
        </div>
        <div class="m_classAff">
          <input type="button"  value="确认" @click="disClass"/>
          <input type="button"  value="取消" @click="closedis"/>
        </div>
      </div>
    </div>
    <!-- 快去任命下一任班主任弹出框-->
    <div class="m_classFastApp" v-if="cueFlag">
      <div class="m_classFastAppSon">
        <div class="m_classFastAppTop">
          <p>{{ecue}}</p>
				<span class="m_classAppointIcoX" @click="closeCue">
                    <img src="/static/teacher/images/classmanage/c_delimg.png" class="c_delimg"  alt="">
          <!--<i class="spriteImg s_delico"></i>-->
				</span>
        </div>
      </div>
    </div>
    <!--你要任命他老师为班主任吗-->
    <div class="m_classAppoint" v-if="setFlag">
      <div class="m_classAppointSon">
        <div class="m_classAppointTop">
          <p>你要任命他为班主任么</p>
			<span class="m_classAppointIcoX" @click="closeSet">
				<img src="/static/teacher/images/classmanage/c_delimg.png" class="c_delimg"  alt="">
			</span>
        </div>
        <div class="m_classAppointBot">
          <input type="button" class="m_classAppointBtnYes"  value="确定" @click="setTeacher"/>
          <input type="button" class="m_classAppointBtnNo"  value="取消" @click="closeSet"/>
        </div>
      </div>
    </div>
    <div class="m_classLeave" v-if="deleteFlag">
      <div class="m_classLeaveson">
        <div class="m_classLeaveTop">
          <p>真的让这位老师离开吗</p>
            <span class="m_classLeaveIcoX" @click="closeDelete">
                <img src="/static/teacher/images/classmanage/c_delimg.png" class="c_delimg"  alt="">
            </span>
        </div>
        <div class="m_classLeaveBot">
          <input type="button" class="m_classLeaveBtnYes" value="再见，挥手" @click="toDelete"/>
          <input type="button" class="m_classLeaveBtnNo"  value="考虑一下" @click="closeDelete"/>
        </div>
      </div>
    </div>
    <!--邀请函-->
    <div class="c_SearchC" id="c_Invitedmain" v-if="inviteFlag">
      <div class="c_Invited creatReset" id="c_Invited">
        <div class="c_InvitedMsg" id="Copy_text">
          <p>我是 <span id="c_TeacherName"></span>，在 <i class="fc65">五好导学网</i>创建了班级 【<span id="GradeName"></span>】，欢迎加入。</p>
          <p>第一步，点击 <a href="" class="fc58 c_adress"></a> 进入网站并注册。</p>
          <p>第二步，在加入班级中输入班级码 <span id="GradeCode"></span>，搜索出班级。</p>
          <p>第三步，点击加入。</p>
        </div>
        <input type="button" value="复制" class="c_CopyBtn" id="c_CopyBtn" data-clipboard-target="Copy_text">
        <!--邀请函关闭按钮-->
        <i class="spriteImg c_closeico fr c_closeimg0" id="c_closeI" @click="closeInvite"></i>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {getClassCode, getJionedClass, getTeachers, teacherSet, teacherDelete, getStudents, removeStudent, getGroup, checkHeader, getNogroup, groupDelete, groupCreate, groupUpdate, teacherExit, teacherDissolve} from '../../../service/classmanage/classmanage.js';
  import {quit} from '../../../service/register/register.js';
  import md5 from 'js-md5';
  export default {
    data() {
      return {
        classCode:'',
        classId:'',
        tempClass:'',
        joinedList:[],
        joinedShow:false,
        tempTeacher:{
          teacherId:'',
          teacherName:'',
          teacherImage:'',
          subjectName:'',
          teacherHeader:'',
          teacherFirst:''
        },
        ecue:'快去任命下一任班主任吧！',
        cueFlag:false,
        otherTeacher:[],
        currentPage:1,
        pFlag:false,
        setFlag:false,
        deleteFlag:false,
        btnFlag:false,
        studentList:[],
        sFlag:false,
        inviteFlag:false,
        mFlag:true,
        noGroup:true,
        noGflag:false,
        groupData:[],
        noGroupData:[],
        quote:false,
        createNew:false,
        newStuList:[],
        ensureStuList:[],
        newName:'',
        exitFlag:false,
        disFlag:false,
        password: '',
        disCue:'请输入登录密码',
        errorCue:'',
        leftRange:''
      }
    },
    mounted() {
      this.init()
      this.getJoined()
      this.showTeachers()
      this.showStudents()
    },
    methods: {
      init() {
        let gradeName = window.localStorage.getItem('c_grade')
        let crumb = this.$route.meta.crumbs[2]
        crumb.name = gradeName
        let classId = window.localStorage.getItem('nowClassId')
        this.classId = classId
        let that = this
        getClassCode(this, {'classId': classId}).then(function (response) {
          let res = response.body
          if (res.retCode == '0000') {
            that.classCode = res.retData.classCode
          }
        })
      },
      contains(arr, obj) {
        var i = arr.length;
        while (i--) {
          if (arr[i] === obj) {
            return true;
          }
        }
        return false;
      },
      getJoined() {
        let classId = window.localStorage.getItem('nowClassId')
        let that = this
        getJionedClass(this).then(function (response) {
          let res = response.body
          if (res.retCode == '0000') {
            let retData = res.retData
            /*获取当前班级*/
            for (var i = 0; i < retData.length; i++) {
              if (retData[i].joinStatus == "1") {
                if (retData[i].classId == classId) {
                  that.tempClass = retData[i].gradeName + retData[i].className;
                }
                let dclass = {}
                dclass.classId = retData[i].classId
                dclass.headTeacherId = retData[i].headTeacherId
                dclass.c_grade = retData[i].gradeName + retData[i].className
                that.joinedList.push(dclass)
              }
            }
          }
        })
      },
      showJoinedClass() {
        this.joinedShow = true
      },
      selectClass(obj) {
        this.joinedShow = false
        this.tempClass = obj.c_grade
        this.classId = obj.classId
        window.localStorage.setItem('nowClassId',obj.classId)
        this.init()
        this.showTeachers()
        this.showStudents()
      },
      showTeachers() {
        let classId = window.localStorage.getItem('nowClassId')
        let para = {'classId': classId}
        let that = this
        getTeachers(this, para).then(function (response) {
          let res = response.body
          let retData = res.retData
          if (res.retCode == '0000') {
            that.tempTeacher.teacherId = retData[0].teacherId
            that.tempTeacher.teacherName = retData[0].teacherName
            that.tempTeacher.teacherImage = retData[0].teacherImage
            that.tempTeacher.subjectName = retData[0].subjectName
            that.tempTeacher.teacherHeader = retData[0].teacherHeader
            that.tempTeacher.teacherFirst = retData[0].teacherFirst
            for (var i = 1; i < retData.length; i++) {
              let teacher = {}
              teacher.teacherId = retData[i].teacherId
              teacher.teacherName = retData[i].teacherName
              teacher.teacherImage = retData[i].teacherImage
              teacher.subjectName = retData[i].subjectName
              teacher.teacherHeader = retData[i].teacherHeader
              that.otherTeacher.push(teacher)
            }
            if (that.tempTeacher.teacherHeader === '1') {
              that.pFlag = true
            }
          }
        })
      },
      goRight() {
        var totalSize = this.otherTeacher.length;//获取总数据
        var pageSize = 4;//每页显示4条数据
        var totalPage = Math.ceil(totalSize / pageSize);//计算总页数
        var scrollWidth;//通过判断浏览器的宽度决定课件容器的宽度
        if (document.body.offsetWidth < 1366) {
          scrollWidth = 680;
        } else if (document.body.offsetWidth >= 1366 && document.body.offsetWidth <= 1599) {
          scrollWidth = 740;
        } else {
          scrollWidth = 840;
        }
        if (this.currentPage == totalPage) {
          return false;
        } else {
          this.leftRange = this.currentPage * -scrollWidth
          this.currentPage++;
        }
      },
      goLeft() {
        var scrollWidth;//通过判断浏览器的宽度决定课件容器的宽度
        if (document.body.offsetWidth < 1366) {
          scrollWidth = 680;
        } else if (document.body.offsetWidth >= 1366 && document.body.offsetWidth <= 1599) {
          scrollWidth = 740;
        } else {
          scrollWidth = 840;
        }
        if (this.currentPage == 1) {
          return false
        } else {
          this.currentPage--
          this.leftRange = (this.currentPage - 1) * -scrollWidth
        }
      },
      showInfo(obj) {
        if (this.tempTeacher.teacherHeader === '1') {
          window.localStorage.setItem('teacherName', obj.teacherName);
          window.localStorage.setItem('teacherId', obj.teacherId);
          this.$router.push('/content/teacher/classmanage/teachermanage')
        }
      },
      enter(event) {
        let tar = event.target.children
        if (this.tempTeacher.teacherHeader === '1') {
          tar[5].classList.remove('dino')
          tar[6].classList.remove('dino')
        }
      },
      leave(event) {
        let tar = event.target.children
        tar[5].classList.add('dino')
        tar[6].classList.add('dino')
      },
      setTeacherHead(obj) {
        this.setFlag = true
        window.localStorage.setItem('teacherSet', obj.teacherId);
      },
      setTeacher() {
        let teacherId = window.localStorage.getItem('teacherSet')
        let para = {}
        para.classId = this.classId
        para.teacherId = teacherId
        teacherSet(this, para).then(function (response) {
          let res = response.body
          if (res.retCode == '0000') {
            this.setFlag = false
          }
        })
      },
      closeSet() {
        this.setFlag = false
      },
      deleteTeacher(obj) {
        window.localStorage.setItem('teacherSet', obj.teacherId);
        this.deleteFlag = true
      },
      toDelete() {
        let teacherId = window.localStorage.getItem('teacherSet')
        let para = {}
        para.classId = this.classId
        para.teacherId = teacherId
        teacherDelete(this, para).then(function (response) {
          let res = response.body
          if (res.retCode == '0000') {
            this.deleteFlag = false
          }
        })
      },
      closeDelete() {
        this.deleteFlag = false
      },
      showBtn() {
        if (this.btnFlag) {
          this.btnFlag = false
        } else {
          this.btnFlag = true
        }
      },
      showexitClass() {
        this.exitFlag = true
      },
      noexitClass() {
        this.exitFlag = false
      },
      exitClass() {
        let para = {'classId':this.classId}
        let that = this
        teacherExit(this, para).then(function (response) {
          let res = response.body
          if (res.retCode == '0000') {
            //退出班级成功返回班级管理页面
            that.$router.push('/content/teacher/classmanage/classmain')
          }
        })
      },
      headerExit() {
        this.cueFlag = true
        if(this.otherTeacher.length>0) {
          this.ecue = '快去任命下一任班主任吧！'
        }else {
          this.ecue = '班里没有更多老师，请解散班级'
        }
      },
      closeCue() {
        this.cueFlag = false
      },
      openDis() {
        this.disFlag = true
      },
      closedis() {
        this.disFlag = false
      },
      disClass() {
        if (this.password == "") {
          this.disCue = '密码错误'
          let style = document.getElementById('dish').style
          style.height = '70px'
          style.paddingTop = '75px'
          this.errorCue = '密码为空'
          let codeStyle = document.getElementsByClassName('c_code')[0].style
          codeStyle.marginTop = '20px'
          document.getElementById('classPass').style.marginTop = '10px'
        } else {
          //密码不为空，但是输入密码错误，并向后台发送数据
          let password = md5(this.password);
          let para = {'classId': this.classId, 'password': password}
          let that = this
          teacherDissolve(this, para).then(function (response) {
            let res = response.body
            let cnum = res.retCode.substr(0,1)
            if (cnum == '0') {
              that.$router.push('/content/teacher/classmanage/classmain')
            }else if(cnum == '3') {
              var clickNum = res.retData;
              this.disCue = '密码错误'
              let style = document.getElementById('dish').style
              style.height = '70px'
              style.paddingTop = '75px'
              let codeStyle = document.getElementsByClassName('c_code')[0].style
              codeStyle.marginTop = '20px'
              document.getElementById('classPass').style.marginTop = '10px'
              if (clickNum == 2) {
                this.errorCue = '您还有两次机会'
              } else if (clickNum == 1) {
                this.errorCue = '您还有一次机会'
                this.password = ''
              }
              this.password = ''
            }else if(cnum == '9') {
              //当输入密码三次错误时，自动跳转到修改密码的页面
              this.password = ''
              this.disCue = '请输入登录密码'
              document.getElementById('classPass').style.marginTop = '0'
              that.logout();
            }
          })
        }
      },
      invite() {
        this.inviteFlag = true
      },
      closeInvite() {
        this.inviteFlag = false
      },
      showStudents() {
        let para = {'classId': this.classId}
        let that = this
        getStudents(this, para).then(function (response) {
          let res = response.body
          if (res.retCode == '0000') {
            that.studentList = res.retData
          }
        })
      },
      denter(event) {
        let tar = event.target
        tar.classList.remove('s_Delico0')
        tar.classList.add('s_Delico1')
      },
      dleave(event) {
        let tar = event.target
        tar.classList.remove('s_Delico1')
        tar.classList.add('s_Delico0')
      },
      deleteStudent(obj) {
        this.sFlag = true
        window.localStorage.setItem('studentId', obj.studentId);
      },
      todeleteStu() {
        let studentId = window.localStorage.getItem('studentId')
        let para = {'classId': this.classId, 'studentId': studentId}
        let that = this
        removeStudent(this, para).then(function (response) {
          let res = response.body
          if (res.retCode === '0000') {
            that.sFlag = false
          }
        })
      },
      closeStu() {
        this.sFlag = false
      },
      stuManage(event) {
        let tar = event.target
        let classList = tar.classList
        if (!this.contains(classList, 'c_StudentAreaBtnCur')) {
          classList.add('c_StudentAreaBtnCur')
          tar.nextElementSibling.classList.remove('c_StudentAreaBtnCur')
          this.showStudents()
          this.mFlag = true
        }
      },
      groupManage(event) {
        let tar = event.target
        let classList = tar.classList
        if (!this.contains(classList, 'c_StudentAreaBtnCur')) {
          classList.add('c_StudentAreaBtnCur')
          tar.previousElementSibling.classList.remove('c_StudentAreaBtnCur')
          this.mFlag = false
          this.showGroup()
        }
      },
      showGroup() {
        let para = {'classId': this.classId}
        let that = this
        getGroup(this, para).then(function (response) {
          let res = response.body
          if (res.retCode === '0000') {
            if (res.retData.length > 0) {
              that.groupData = res.retData
              that.noGroup = false
            } else {
              that.noGroup = true
            }
          }
        })
        checkHeader(this, para).then(function (response) {
          let res = response.body
          if (res.retCode === '0000') {
            that.quote = true
          }
        })
      },
      addStudent(event,groupId) {
        this.newStuList = []
        if(groupId!='new') {
          localStorage.setItem('editGroup',groupId)
        }else {
          localStorage.setItem('editGroup','new')
        }
        let tar = event.target
        if(!this.contains(tar.classList,'c_MainB')) {
          tar = tar.parentElement
        }
        let btns = document.getElementsByClassName('c_GroupSaveBtn')
        for(let i=0;i<btns.length;i++) {
          let clist = btns[i].classList
          if(!this.contains(clist,'dino')&&tar.nextElementSibling!=btns[i]) {
            return
          }
        }
        let classList = tar.nextElementSibling.classList
        classList.remove('dino')
        let para = {'classId': this.classId}
        let that = this
        getNogroup(this, para).then(function (response) {
          let res = response.body
          if (res.retCode === '0000') {
            if (res.retData.length > 0) {
              that.noGroupData = res.retData
              that.noGflag = true
            } else {
            }
          }
        })
      },
      addEnsure() {
        let editGroup = localStorage.getItem('editGroup')
        if(editGroup === 'new') {
          this.ensureStuList = this.newStuList
        }else {
          for(let i=0;i<this.groupData.length;i++) {
            if(editGroup === this.groupData[i].groupId) {
              this.groupData[i].classStudentList = this.groupData[i].classStudentList.concat(this.newStuList)
              break
            }
          }
        }
        this.noGflag = false
      },
      saveStu(event,group) {
        let tar = event.target
        let that = this
        let sibs= tar.parentNode.previousElementSibling.previousElementSibling
        let para = {};
        para.classId = this.classId;
        para.studentIdList = [];
        var lis = sibs.children;
        for (var i = 0; i < lis.length; i++) {
          if(lis[i].attributes['studentId']!=undefined) {
            para.studentIdList.push(lis[i].attributes['studentId'].value);
          }
        }
        if(lis.length==0||para.studentIdList.length==0) {
         //请添加学生
        }else {
          if (group === 'new') {
            if (this.newName != "") {
              para.groupName = this.newName
              groupCreate(this, para).then(function (response) {
                let res = response.body
                if (res.retCode === '0000') {
                  that.createNew = false
                  that.showGroup()
                }
              })
            }
          }else {
              para.groupName = group.groupName
              para.groupId = group.groupId
              groupUpdate(this, para).then(function (response) {
                let res = response.body
                if (res.retCode === '0000') {
                  tar.classList.add('dino')
                }
              })
            }
          }
      },
      cancelStu(event) {
        let tar = event.target.parentElement
        tar.classList.add('dino')
      },
      createNewGroup() {
        this.createNew = true
        this.noGroup = false
      },
      selectStu(stu,event) {
        let tar = event.target
        tar.remove()
        this.newStuList.push({'sutdentId':stu.sutdentId,'sutdentName':stu.sutdentName})
        let GroupNoStu = document.getElementsByClassName('c_GroupNoStu')
        if(GroupNoStu.length>0) {
          GroupNoStu[0].classList.add('dino')
        }
      },
      deleteGroup(obj) {
        let para = {'groupId': obj.groupId}
        let that = this
        groupDelete(this, para).then(function (response) {
          let res = response.body
          if (res.retCode === '0000') {
            that.showGroup()
          }
        })
      },
      dstuFromGroup(groupId,studentId) {
        for(let i=0;i<this.groupData.length;i++) {
          if(groupId === this.groupData[i].groupId) {
            let studentList = this.groupData[i].classStudentList
            for(let j=0;j<studentList.length;j++) {
              if(studentId===studentList[j].studentId) {
                studentList.splice(j,1)
              }
            }
            break
          }
        }
      },
      deenter(event) {
        let tar = event.target
        tar.children[0].classList.remove('dino')
        console.log(tar.children[0].classList)
      },
      deleave(event) {
        let tar = event.target
        tar.children[0].classList.add('dino')
      },
      logout() {
        let that = this
        quit(this).then(function (response) {
          let res = response.body
          if (res.retCode === '0000') {
            that.$router.push('/forgetPass')
          }
      })
      }
    }
  };
</script>
<style>
  @import '/static/common/css/common.css';
  /*****************************教师区域**********************************/
  .c_pointer{cursor:pointer;}
  .c_delimg{float: left;margin: 11px 0 0 10px;}
  .c_Main{width: 100%;float: left;background: #ecedf0;box-sizing: border-box;margin: 0 auto;min-height: 780px;;padding-bottom: 40px;}
  .c_TeacherAreaWrap{width:1200px; height: 220px;  margin-top: 40px; position: relative;margin: 0 auto}
  .c_TeacherArea{width:1200px; height: 220px; border-radius: 10px;  overflow: hidden; background: #fff; position: relative; margin-top: 40px;}
  /*选择班级下拉框*/
  .c_ClassDropList{ height: auto; position: absolute; left: 0; top: 0; z-index: 10;}
  .c_MainX{width:170px;height:40px; border:1px solid #ccc;box-sizing: border-box;margin: 10px 0 0 18px;position: relative;padding: 8px 0 0 20px;cursor:pointer;border-radius: 5px;}
  .c_MainX span{ margin-top:-2px; display: inline-block;}
  .c_MainX i{ display: inline-block; position: absolute; right: 15px; top: 16px;}
  .c_MainX ul{width:170px;height: auto;position: absolute;top:39px;left:-1px;z-index: 10;background: #fff;border-right:1px solid #ccc ;border-bottom: 1px solid #ccc;border-left: 1px solid #ccc;box-sizing:border-box;border-radius: 0 0 5px 5px;}
  .c_MainX ul li{width:170px;height:40px;line-height:40px;padding: 0 0 0 20px;cursor: pointer;cursor:pointer;}
  .c_MainX ul li:hover{color: #65b113;}
  /*班级码*/
  .c_ClassNum{ height: 60px; with:20px; line-height: 60px; margin-left: 20px;}
  /*退出班级按钮和解散班级按钮*/
  .c_TeacherAreaTop{ width:1200px; height:60px; border-bottom: 1px solid #ccc; box-sizing: border-box;}
  .c_BtnExit,.c_intnav,.c_more{ width:150px; height: 45px; box-sizing: border-box; margin-top: 7px; margin-right: 20px; outline: none; background: url("/static/teacher/images/classmanage/c_BgBtn.png") repeat-x;border-radius: 10px;}
  .c_more{text-align: center;line-height:45px;position:relative;cursor:pointer;}
  .c_Synsize{width:150px;height:90px;border:1px solid #ddd;border-top:none;box-sizing:border-box;position: absolute;top:45px;left: -1px;z-index: 2;background: #fff;border-radius: 0 0 10px 10px;}
  .c_Synsize li{width:150px;height: 45px;text-align:center;line-height:45px;z-index:1;}
  .c_Synsize li:hover{color: #65b113;}
  .c_intnav:hover{color:#fff;background: url('/static/teacher/images/classmanage/c_btn1ico.jpg');}
  .c_more:hover{color:#fff;background: url('/static/teacher/images/classmanage/c_btn1ico.jpg');}
  /*********教师区域-教师列表***********/
  .c_TeacherAreaList{height: 160px;}
  .c_TeacherAreaCurrent{ width:320px; height: 160px;overflow:hidden;}
  .c_TeacherAreaCurrent li{position: relative}
  .c_TeacherAreaCurrent i{position: absolute;top:86px;left:135px;}
  .c_TeacherPhoto{ width: 100px; height: 100px; overflow: hidden; border-radius: 100%; box-sizing: border-box; margin-left: 123px; margin-top: 20px; }
  .c_Subject{ text-align: center;width: 100%;overflow: hidden;white-space:nowrap;text-overflow:ellipsis; margin-top: 5px; padding-left: 14px;}
  .c_Subject span{margin-left:5px;}
  .c_setTeacher{position:absolute;top:25px;left:-16px;color:#58c1e4;cursor:pointer}
  .c_deleteClass{position:absolute;top:25px;left:145px;color:#58c1e4;cursor: pointer}
  .c_OtherTeacher{width:860px; height: 160px; overflow: hidden;position: relative; }
  .c_OtherTeacherWrap{ width:9999px; height: 160px; position: absolute; left: 0; top: 0;z-index:0;}
  .c_OtherTeacherWrap li{float:left; width:185px; margin-left:25px;position:relative;}
  .c_OtherTeacherWrap li .c_TeacherPhoto{margin-left: 52px;}
  .c_TeacherTag{ position: absolute; left: 65px; bottom: 21px; z-index: 1; width: 76px; height: 20px;}
  .c_TeacherRight{position: absolute; right:5px; top:70px; width:14px; height: 30px; display: inline-block;cursor: pointer}
  .c_TeacherLeft{position: absolute; right: 10px; top:70px;position: absolute; left: 10px; top:70px; display: inline-block;cursor: pointer;}
  /*****************************学生区域**********************************/
  .c_StudentArea{width:1200px; height: auto; margin:0 auto; margin-top: 40px; border-radius: 10px; background: #fff; margin-bottom: 100px;}
  .c_StudentAreaTab{ height:60px; border-bottom: 1px solid #ccc;}
  .c_StudentAreaBtn{ width: 150px; height: 45px; color: #666; box-sizing: border-box; outline: none; margin-left:20px; margin-top: 8px; background: url("/static/teacher/images/classmanage/c_BgBtn.png") repeat-x;cursor: pointer;border-radius: 10px;}
  .c_StudentAreaBtnCur{background: url("/static/teacher/images/classmanage/c_BgBtnGreen.png") repeat-x; color: #fff;}
  /*****************学生管理********************/
  .c_StudentManageWrap{ min-height: 470px; display: block;}
  .c_StudentList{padding:0 15px; width:1170px;}
  .c_StudentList li{ height: 60px; border-bottom: 1px solid #ccc; overflow: hidden; box-sizing: border-box; line-height: 60px;}
  .c_StudentList li.c_NoStudent{ height: 300px; line-height: 300px; text-align: center; border: none; font-size: 30px; color: #666;}
  .c_StudentList:nth-last-child(1){ margin-bottom: 30px;}
  .c_StudentNum{ padding-left: 35px; display: inline-block; float: left; margin-top: 6px;}
  .c_StudentPhoto{ width:75px; height: 75px; border-radius: 100%; overflow: hidden; margin-left: 45px; margin-top: 12px;}
  .c_StudentName0{ height: 30px; width:274px; display: inline-block; line-height: 30px; text-align: center; margin-top: 20px; border-right: 1px solid #ccc;}
  .c_StudentTelNum{ height: 30px; display: inline-block; line-height: 30px; margin-top: 20px;padding-left: 55px;}
  .c_StudentDel{ margin-right: 65px; margin-top: 18px; cursor: pointer;}
  /********************小组管理******************/
  .c_GrouptManageWrap{ height:auto;min-height:450px; padding-bottom: 20px; position: relative;}
  .clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
  .clearfloat{zoom:1}
  /*********创建小组列表***********/
  /*没有学生信息*/
  .c_classMsg{width:100%;height:300px;text-align:center;line-height:300px;font-size:30px;color:#666666;}
  /*没有小组的盒子*/
  .c_GroupTxt{ height: 150px; line-height: 150px; text-align: center;}
  .c_QuotHeatherGroupBtn{ border: 0; outline: none; width:125px; height: 35px; margin-left: 35px; background: #F9A24A; border-radius: 10px; font-size: 14px; color: #fff;cursor:pointer;}
  .c_CreatGroupBtn{ text-align: center;}
  .c_CreatGroupBtn .c_classImg{cursor:pointer;}
  .c_CreatGroupBtn span{display:block; font-size: 30px; color: #0C96E6; margin-top: 25px;}
  /*编辑小组的盒子*/
  .c_EditGroupWrap{overflow: hidden; position: relative;}
  .c_Mainbot1{width:245px;max-height:456px;border:1px solid #ddd;box-sizing:border-box;margin: 35px 0 0 44px;position: relative;}
  .a_MainCha{display: inline-block;position: absolute;right:5px;top:5px;z-index:10;cursor:pointer;}
  .c_MainZ{width:100%;height:75px;line-height: 75px;text-align: center;color: #0c96e6;position:relative;}
  .c_GroupName{ width: 160px; height: 45px; text-align: center; outline: none; border: 1px solid #ccc;color: #0c96e6; font-size: 16px;position:absolute;top:20px;left:40px;}
  .c_GroupIdTag{ display: none;}
  .c_MainList{width:220px; height:231px; overflow: auto;margin: 0 auto;}
  .c_MainList li{width:100%;height:45px;text-align: center;line-height:45px;border-bottom:1px dotted #ccc; float: left; position: relative;cursor: pointer}
  .c_MainList li .a_MainDelCha{ position: absolute; top: 15px; right: 5px;}
  .c_MainList li .c_GroupStudentId{ display: none;}

  .c_MainList li.c_GroupNoStu{ height:278px; line-height: 278px; text-align: center; border: 0; position:relative;}
  .c_GroupNoStu span{position: absolute;top:0;left:72px;}
  .c_MainB{width: 100%;height: 55px;line-height:55px; cursor: pointer;}
  .c_MainI{float: left;margin:16px 5px 0 70px;}
  .c_GroupSaveBtn{height: 45px; *line-height: 45px; text-align: center; border-top: 1px solid #ccc;}
  .c_GroupSaveBtn .c_SaveGroup{ width:70px; height: 30px; border: 0; outline: none; color: #Fff; border-radius: 5px; background: #FAA249; margin-right: 15px;margin-top: 7px;cursor:pointer;}
  .c_GroupSaveBtn .c_CancelGroup{ width:70px; height: 30px; border: 0; outline: none; color: #Fff; border-radius: 5px; background: #999;cursor:pointer;}
  .c_MainB span{color: #0c96e6;}
  .c_MainAdd{width:75px;height: 110px;text-align: center;margin: 126px auto;}
  .c_MainAdd p{ font-size: 18px; color: #0195D1; margin-top: 20px;}
  .c_MainIZove{display: block;cursor:pointer;}
  /*文字左右晃动*/
  .c_GroupMsg{ padding-top: 30px; margin-left: 40px; text-align: left; height: 32px; color:#ca0d0d; line-height: 32px; background:url("/static/teacher/images/classmanage/s_msgico.png") no-repeat 0 32px; padding-left: 50px; clear: both; display: none;}
  /*未加入小组的学生名单*/
  .c_NoGroupWrap{width:100%; height:100%; background:rgba(0,0,0,0.5); position:fixed; left:0; top:0;z-index: 100;}
  .c_nameList{ width: 787px; height: 616px;background: #fff; position: absolute; left: 50%; top:50%; margin-left: -394px; margin-top:-278px;}
  .c_nameList p{ height: 56px;color:#0c96e6;text-align: center;line-height: 56px; box-sizing: border-box;}
  .c_nameList ul{ width:787px; height: 500px; overflow-y: auto;}
  .c_noClass{width:787px;height:500px;text-align:center;line-height:500px;font-size:30px;color:#C8C8C8;}
  .c_nameList ul li{ width:130px; height: 45px; border: 1px solid #ccc; float: left; font-size: 14px; color: #666; line-height: 45px; text-align: center; border-top: 0; border-right: 0;cursor:pointer;}
  .c_NoGroupOfStudentId{display: none;}
  .c_nameList ul li:nth-of-type(6n+0){ border-right: 1px solid #ccc;}
  .c_nameList ul li:nth-last-of-type(1){ border-right: 1px solid #ccc; width:130px;}
  .Ok{ height: 50px; text-align: center; margin-bottom: 20px;}
  .Ok .c_OkBtn{ width:150px; height: 50px; border: 0; outline: none; color: #fff; font-size: 18px; background:#FAA249; border-radius: 10px;cursor:pointer;}
  /*引用班主任分组弹窗*/
  .m_classTchMask{width:100%;height:100%;background: rgba(0,0,0,0.5);z-index: 100;position: fixed; left:0; top:0; display: none;}
  .m_classTch{width: 1160px;height: 720px;background: #fff;position: fixed;top:50%;left:50%; margin-top:-350px; margin-left:-580px; border-radius: 10px;}
  .m_classTch h3{width:1070px;height:55px;font-size: 22px;color:#333333;padding: 65px 0 0 90px;}
  .m_classTchList{width: 100%;height: 500px; overflow-y: auto;}
  .m_classTchList .m_groupWrap{width: 290px;height: auto;border:1px solid #ddd;margin-left: 70px; margin-bottom:20px;float: left;}
  .m_classTchList ul li{width:100%;height: 40px;border-bottom: 1px solid #ddd;text-align: center;line-height: 40px;font-size: 16px;color:#666666}
  .m_classTchList ul li.m_groupName{width: 100%;height: 55px;line-height: 55px;background: #f6f6f6;font-size: 24px;color: #333333;}
  ul.m_groupMember{ margin: 0; border: 0; height:328px; overflow-y: auto; }
  .m_classTchbtn{width:700px;height: 90px;padding: 0 210px;margin:0 auto;}
  .m_classTchbtn input{width:329px;height: 55px;color: #fff;font-size: 22px;outline: none;border:none;border-radius: 10px;cursor:pointer;}
  .m_classTchbtnOne{background: #58c1e4;float:left;}
  .m_classTchbtnTwo{background: #f9a24a;float:right;}
  /*********退出班级弹窗***********/
  .m_classMark{width:100%; height:100%; background:rgba(0,0,0,0.5); position:fixed; left:0; top:0;z-index: 9999999999999; display: none;}
  .m_ExitClass{ width:689px; height: 353px; overflow: hidden; background: url("/static/teacher/images/classmanage/c_ExitClassImg.png"); position: fixed;left: 50%; top:50%;z-index:101; margin-top:-176px; margin-left:-345px;}
  .m_BtnWrap{ position: absolute; left: 0; bottom: 0; height: 78px; line-height: 78px;}
  .m_ExitBtn,.m_NoExitBtn{width:190px;height: 45px;color:#fff;border: none;outline: none;border-radius: 10px;margin-top: 20px;}
  .m_ExitBtn{background: #8ed6ee;margin-left: 140px;cursor:pointer}
  .m_NoExitBtn{background: #ccc;margin-left: 25px;cursor: pointer;}
  .m_Close{ width: 35px; height: 40px; display: block; position: absolute; top:0; right:41px;cursor:pointer;}
  /*********删除学生的弹窗***********/
  .m_DelStudent{width:100%; height:100%; background:rgba(0,0,0,0.5); position:fixed; left:0; top:0;z-index: 100;}
  .m_DelStudentWrap{ width:689px; height: 353px; overflow: hidden; background: url("/static/teacher/images/classmanage/img_DelStudent.png"); position: fixed;left: 50%; top:50%;z-index:101; margin-top:-176px; margin-left:-345px;}
  .m_DelBtnWrap{ position: absolute; left: 0; bottom: 0; height: 78px; line-height: 78px;}
  .m_DelBtn,.m_NoDelBtn{width:190px;height: 45px;color:#fff;border: none;outline: none;border-radius: 10px;margin-top: 20px;}
  .m_DelBtn{background: #8ed6ee;margin-left: 140px;cursor:pointer;}
  .m_NoDelBtn{background: #ccc;margin-left: 25px;cursor:pointer;}
  .m_DelClose{ width: 35px; height: 40px; display: block; position: absolute; top:0; right:41px;cursor: pointer;}
  /*********删除分组的弹窗***********/
  .m_DelGroup{width:100%; height:100%; background:rgba(0,0,0,0.5); position:fixed; left:0; top:0;z-index: 100;}
  .m_DelGroupWrap{ width:689px; height: 353px; overflow: hidden; background: url("/static/teacher/images/classmanage/img_DelGroup.png"); position: fixed;left: 50%; top:50%;z-index:101; margin-top:-176px; margin-left:-345px;}
  .m_DelGroupBtnWrap{ position: absolute; left: 0; bottom: 0; height: 78px; line-height: 78px;}
  .m_DelGroupBtn,.m_NoDelGroupBtn{width:190px;height: 45px;color:#fff;border: none;outline: none;border-radius: 10px;margin-top: 20px;}
  .m_DelGroupBtn{background: #8ed6ee;margin-left: 140px;cursor:pointer;}
  .m_NoDelGroupBtn{background: #ccc;margin-left: 25px;cursor:pointer}
  .m_DelGroupClose{ width: 35px; height: 40px; display: block; position: absolute; top:0; right:41px;cursor:pointer}
  /*解散班级弹窗*/
  .m_classDis{width: 100%;height:100%;background: rgba(0,0,0,0.5);position:fixed;z-index: 999999999;top:0;}
  .m_classDisSon{width:640px;height: 345px;position: absolute;top:0;left: 0;right:0;bottom: 0;margin: auto;background: #fff;border-radius: 10px;}
  .m_classDisSon h2{width: 100%;height: 35px;font-size: 24px;color:#333333;text-align: center;padding-top:110px;}
  .m_classDisSon h2 p{font-size: 16px;color: #dd1021;}
  .m_classPass{width: 100%;height: 120px;}
  .m_classPass input{width:270px;height: 45px;border:none;outline: none;border-radius: 10px;margin-left: 180px;border:2px solid #cfcfcf;}
  .m_classAff input{width: 190px;height: 45px;border:none;outline: none;border-radius: 10px;color: #fff;cursor: pointer;}
  .m_classAff input:first-child{background: #65b113;margin-left: 115px;}
  .m_classAff input:last-child{background: #999;margin-left: 25px;}
  .m_classDisSon i{display: block;position: absolute;top:10px;right: 10px;cursor: pointer;}
  /*快去任命下一任班主任吧!*/
  .m_classFastApp{width: 100%;height:100%;background: rgba(0,0,0,0.5);position: fixed;z-index: 100;top:0;}
  .m_classFastAppSon{width: 689px;height: 354px;background:url('/static/teacher/images/classmanage/img_ico1.png');position: absolute;margin: auto;top:0;left: 0;right: 0;bottom: 0;z-index: 10;}
  .m_classFastAppTop{width:100%;height: 275px;line-height: 275px;position: relative;display: block}
  .m_classFastAppTop p{font-size: 24px;margin-left: 320px;}
  .m_classAppointIcoX{width:35px;height:40px;background:#f96672;position: absolute;top:2px;right: 40px;border-radius: 0 0 10px 10px;display: block}
  .m_classFastAppTop i{display: block;position: absolute;top:0;left: 0;right:0;bottom: 0;margin: auto;cursor: pointer;}
  /*你要任命老师为班主任么*/
  .m_classAppoint{width: 100%;height: 100%;background: rgba(0,0,0,0.5);position: fixed;z-index: 100;top:0;}
  .m_classAppointSon{width: 689px;height: 354px;background:url('/static/teacher/images/classmanage/img_xo.png');position: absolute;margin: auto;top:0;left: 0;right: 0;bottom: 0;z-index: 10;}
  .m_classAppointTop{width:100%;height: 275px;line-height: 275px;position: relative;}
  .m_classAppointTop p{font-size: 24px;margin-left: 350px;}
  .m_classAppointIcoX{width:35px;height:40px;background:#f96672;display: block;position: absolute;top:2px;right: 40px;border-radius: 0 0 10px 10px;cursor:pointer;}
  .m_classAppointTop i{display: block;position: absolute;top:0;left: 0;right:0;bottom: 0;margin: auto;}
  .m_classAppointBot{width:690px;height: 80px;}
  .m_classAppointBtnYes,.m_classAppointBtnNo{width:190px;height: 45px;color:#fff;border: none;outline: none;border-radius: 10px;margin-top:20px;background: #ccc;cursor:pointer;}
  .m_classAppointBtnYes{margin-left: 140px;background: #8ed6ee;}
  .m_classAppointBtnNo{margin-left: 25px;}
  /* 删除老师弹出框*/
  .m_classLeave,.m_tDelete{width: 100%;height: 100%;background: rgba(0,0,0,0.5);position: fixed;z-index: 9999;top:0;}
  .m_classLeaveson,.m_tDeleteson{width:689px;height:354px;background:url('/static/teacher/images/classmanage/img_xo.png');position: absolute;margin: auto;top:0;left: 0;right: 0;bottom: 0;z-index: 10;}
  .m_classLeaveTop{width:100%;height: 275px;line-height: 275px;position: relative;}
  .m_classLeaveTop p{font-size: 24px;margin-left: 350px;}
  .m_classLeaveIcoX{width:35px;height:40px;background:#f96672;display: block;position: absolute;top:2px;right: 40px;border-radius: 0 0 10px 10px;cursor: pointer;}
  .m_classLeaveTop i{display: block;position: absolute;top:0;left: 0;right:0;bottom: 0;margin: auto;}
  .m_classLeaveBot {width:690px;height: 80px;}
  .m_classLeaveBtnYes,.m_classLeaveBtnNo,.m_classDelNo,.m_classDelYes{width:190px;height: 45px;color:#fff;border: none;outline: none;border-radius: 10px;margin-top: 20px;cursor: pointer;background: #ccc;}
  .m_classLeaveBtnYes,.m_classDelYes{margin-left: 140px;background: #8ed6ee;}
  .m_classLeaveBtnNo,.m_classDelNo{margin-left: 25px;}
  /*未加入小组的学生名单*/
  .c_NoGroupWrap{width:100%; height:100%; background:rgba(0,0,0,0.5); position:fixed; left:0; top:0;z-index: 100;}
  .c_NoGroupWrap .c_NoGroup_win{ width: 787px; height: 616px;background: #fff; position: absolute; left: 50%; top:50%; margin-left: -394px; margin-top:-278px;}
  .c_NoGroupWrap .c_NoGroup_win p{ height: 56px;color:#0c96e6;text-align: center;line-height: 56px; box-sizing: border-box;}
  .c_NoGroupWrap .c_NoGroup_win ul{ width:787px; height: 500px; overflow-y: auto;}
  .c_noClass{width:787px;height:500px;text-align:center;line-height:500px;font-size:30px;color:#C8C8C8;}
  .c_NoGroupWrap .c_NoGroup_win ul li{ width:130px; height: 45px; border: 1px solid #ccc; float: left; font-size: 14px; color: #666; line-height: 45px; text-align: center; border-top: 0; border-right: 0;cursor:pointer;}
  .c_NoGroupOfStudentId{display: none;}
  .c_NoGroupWrap .c_NoGroup_win ul li:nth-of-type(6n+0){ border-right: 1px solid #ccc;}
  .c_NoGroupWrap .c_NoGroup_win ul li:nth-last-of-type(1){ border-right: 1px solid #ccc; width:130px;}
  .Ok{ height: 50px; text-align: center; margin-bottom: 20px;}
  .Ok .c_OkBtn{ width:150px; height: 50px; border: 0; outline: none; color: #fff; font-size: 18px; background:#FAA249; border-radius: 10px;cursor:pointer;}


  @media screen and  (min-width:1366px) and (max-width:1599px){
    .c_TeacherAreaWrap{width:1000px; height: 220px;  margin-top: 40px; position: relative;margin: 0 auto}
    .c_TeacherArea{width:1000px; height: 220px; border-radius: 10px; overflow: hidden; background: #fff; position: relative;}
    /*选择班级下拉框*/
    .c_ClassDropList{ height: auto; position: absolute; left: 0; top: 0; z-index: 10;}
    .c_MainX{width:170px;height:40px; border:1px solid #ccc;box-sizing: border-box;margin: 10px 0 0 18px;position: relative;padding: 8px 0 0 20px;cursor:pointer;}
    .c_MainX ul{width:170px;height: auto;position: absolute;top:39px;left:-1px;z-index: 10;background: #fff;border-right:1px solid #ccc ;border-bottom: 1px solid #ccc;border-left: 1px solid #ccc;box-sizing:border-box;}
    .c_MainX ul li{width:170px;height:40px;line-height:40px;padding: 0 0 0 20px;cursor: pointer;cursor:pointer;}
    /*班级码*/
    .c_ClassNum{ height: 60px; with:20px; line-height: 60px; margin-left: 20px;}
    /*退出班级按钮和解散班级按钮*/
    .c_TeacherAreaTop{ width:1000px; height:60px; border-bottom: 1px solid #ccc; box-sizing: border-box;}
    .c_BtnExit,.c_intnav,.c_more{ width:150px; height: 45px; box-sizing: border-box; margin-top: 7px; margin-right: 20px; outline: none; background: url("/static/teacher/images/classmanage/c_BgBtn.png") repeat-x;}
    .c_more{text-align: center;line-height:45px;position:relative;cursor:pointer;}
    .c_Synsize{width:150px;height:90px;border:1px solid #ddd;border-top:none;box-sizing:border-box;position: absolute;top:45px;left: -1px;z-index: 2;background: #fff;}
    .c_Synsize li{width:150px;height: 45px;text-align:center;line-height:45px;z-index:1;}
    /*********教师区域-教师列表***********/
    .c_Subject{ text-align: center;width: 100%;overflow: hidden;white-space:nowrap;text-overflow:ellipsis; margin-top: 5px; padding-left: 5px;}
    .c_TeacherAreaList{height: 160px;}
    .c_TeacherAreaCurrent{ width:230px; height: 160px;overflow:hidden;}
    .c_TeacherAreaCurrent i{position: absolute;top:75px;left:80px;}
    .c_TeacherPhoto{ width: 90px; height: 90px; overflow: hidden; border-radius: 100%; box-sizing: border-box; margin-left: 75px; margin-top: 20px; }
    .c_setTeacher{position:absolute;top:25px;left:-25px;color:#58c1e4;cursor:pointer}
    .c_deleteClass{position:absolute;top:25px;left:128px;color:#58c1e4;cursor: pointer}
    .c_OtherTeacher{width:760px; height: 160px; overflow: hidden;position: relative; }
    .c_OtherTeacherWrap{ width:9999px; height: 160px; position: absolute; left: 0; top: 0; z-index:0;}
    .c_OtherTeacherWrap li{float:left; width:160px; margin-left:25px;position:relative;height: 100%;}
    .c_OtherTeacherWrap li .c_TeacherPhoto{margin-left: 40px;}
    .c_TeacherTag{ position: absolute; left: 52px; bottom: 41px; z-index: 1; width: 76px; height: 20px;}
    .c_TeacherRight{position: absolute; right:5px; top:70px; width:14px; height: 30px; display: inline-block;cursor: pointer}
    .c_TeacherLeft{position: absolute; right: 10px; top:70px;position: absolute; left: 10px; top:70px; display: inline-block;cursor: pointer;}
    /*****************************学生区域**********************************/
    .c_StudentArea{width:1000px; height: auto; margin:0 auto; margin-top: 50px; border-radius: 10px; background: #fff; margin-bottom: 100px;}
    .c_StudentAreaTab{ height:60px; border-bottom: 1px solid #ccc;}
    .c_StudentAreaBtn{ width: 150px; height: 44px; color: #666; box-sizing: border-box; outline: none; margin-left:20px; margin-top: 8px; background: url("/static/teacher/images/classmanage/c_BgBtn.png") repeat-x;cursor: pointer;}
    .c_StudentAreaBtnCur{background: url("/static/teacher/images/classmanage/c_BgBtnGreen.png") repeat-x; color: #fff;}
    /*****************学生管理********************/
    .c_StudentList{padding:0 15px; width:970px;}
    .c_StudentList li{ height: 100px; border-bottom: 1px solid #ccc; overflow: hidden; box-sizing: border-box; line-height: 90px;}
    .c_StudentList li.c_NoStudent{ height: 300px; line-height: 300px; text-align: center; border: none; font-size: 26px; color: #666;width:100%;}
    .c_StudentNum{ padding-left: 35px; display: inline-block; float: left; margin-top: 6px;}
    .c_StudentPhoto{ width:75px; height: 75px; border-radius: 100%; overflow: hidden; margin-left: 45px; margin-top: 12px;}
    .c_StudentName0{ height: 30px; width:274px; display: inline-block; line-height: 30px; text-align: center; margin-top: 35px; border-right: 1px solid #ccc;}
    .c_StudentTel{ height: 30px; padding-left: 55px; display: inline-block; line-height: 30px; margin-top: 35px;}
    .c_StudentTelNum{ height: 30px; display: inline-block; line-height: 30px; margin-top: 35px;}
    .c_StudentDel{ margin-right: 65px; margin-top: 32px; cursor: pointer;}
    /********************小组管理******************/
    .clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
    /*********创建小组列表***********/
    /*没有学生信息*/
    .c_classMsg{width:100%;height:300px;text-align:center;line-height:300px;font-size:26px;color:#666666;}
    /*没有小组的盒子*/
    .c_GroupTxt{ height: 150px; line-height: 150px; text-align: center;}
    .c_QuotHeatherGroupBtn{ border: 0; outline: none; width:125px; height: 35px; margin-left: 35px; background: #F9A24A; border-radius: 10px; font-size: 14px; color: #fff;cursor:pointer;}
    .c_CreatGroupBtn span{ font-size: 26px; }
    /*编辑小组的盒子*/
    .c_Mainbot1{width:245px;max-height:456px;border:1px solid #ddd;box-sizing:border-box;margin: 35px 0 0 44px;position: relative;}
    .c_MainZ{width:100%;height:75px;line-height: 75px;text-align: center;color: #0c96e6;position:relative;}
    .c_GroupName{ width: 160px; height: 45px; text-align: center; outline: none; border: 0; border: 1px solid #ccc;color: #0c96e6; font-size: 16px;position:absolute;top:20px;left:40px;}
    .c_MainList{width:220px; height:278px; overflow: auto;margin: 0 auto;}
    .c_MainList li{width:100%;height:45px;text-align: center;line-height:45px;border-bottom:1px solid #ccc; float: left; position: relative;cursor: pointer}
    .c_MainList li.c_GroupNoStu{ height:278px; line-height: 278px; text-align: center; border: 0; position:relative;}
    .c_GroupNoStu span{position: absolute;top:0;left:72px;}
    .c_MainB{width: 100%;height: 55px;line-height:55px; cursor: pointer;}
    .c_GroupSaveBtn{ height: 45px; line-height: 45px; text-align: center; border-top: 1px solid #ccc;}
    .c_GroupSaveBtn .c_SaveGroup{ width:70px; height: 30px; border: 0; outline: none; color: #Fff; border-radius: 5px; background: #FAA249; margin-right: 15px;cursor:pointer;}
    .c_GroupSaveBtn .c_CancelGroup{ width:70px; height: 30px; border: 0; outline: none; color: #Fff; border-radius: 5px; background: #999;cursor:pointer;}
    .c_MainAdd{width:75px;height: 110px;text-align: center;margin: 149px auto;}
    .c_MainAdd p{ font-size: 16px; color: #0195D1; margin-top: 20px;}
    /*引用班主任分组弹窗*/
    .m_classTchMask{width:100%;height:100%;background: rgba(0,0,0,0.5);z-index: 100;position: fixed; left:0; top:0; display: none;}
    .m_classTch{width: 960px;height: 720px;background: #fff;position: fixed;top:50%;left:50%; margin-top:-350px; margin-left:-480px; border-radius: 10px;}
    .m_classTch h3{width:870px;height:55px;font-size: 22px;color:#333333;padding: 65px 0 0 90px;}
    .m_classTchList{width: 100%;height: 500px; overflow-y: auto;}
    .m_classTchList .m_groupWrap{width: 290px;height: auto;border:1px solid #ddd;margin-left: 20px; margin-bottom:20px;float: left;}
    .m_classTchList ul li{width:100%;height: 40px;border-bottom: 1px solid #ddd;text-align: center;line-height: 40px;font-size: 16px;color:#666666}
    .m_classTchList ul li.m_groupName{width: 100%;height: 55px;line-height: 55px;background: #f6f6f6;font-size: 24px;color: #333333;}
    .m_classTchbtn{width:580px;height: 90px;padding: 0 170px;margin: 0 auto;}
    .m_classTchbtn input{width:270px;height: 55px;color: #fff;font-size: 22px;outline: none;border:none;border-radius: 10px;cursor:pointer;}
  }
  @media screen and (max-width:1366px){
    .c_TeacherTag{ position: absolute; left: 33px; bottom: 37px;}
    .c_TeacherAreaWrap{width:900px; height: 220px;  margin-top: 40px; position: relative;margin: 0 auto}
    .c_TeacherArea{width:900px; height: 220px; border-radius: 10px;  overflow: hidden; background: #fff; position: relative;}
    /*退出班级按钮和解散班级按钮*/
    .c_TeacherAreaTop{ width:900px; height:60px; border-bottom: 1px solid #ccc; box-sizing: border-box;}
    /*********教师区域-教师列表***********/
    .c_Subject{ padding-left: 0px;}
    .c_TeacherPhoto{ width: 80px; height: 80px; overflow: hidden; border-radius: 100%; box-sizing: border-box; margin-left: 40px; margin-top: 36px; }
    .c_TeacherAreaCurrent{ width:180px; height: 160px;overflow:hidden;}
    .c_TeacherAreaCurrent i{top:63px;left:41px;}
    .c_setTeacher{position:absolute;top:25px;left:-25px;color:#58c1e4;cursor:pointer}
    .c_deleteClass{position:absolute;top:25px;left:105px;color:#58c1e4;cursor: pointer}
    .c_OtherTeacher{width:700px; height: 160px; overflow: hidden;position: relative; }
    .c_OtherTeacherWrap li{float:left; width:145px; margin-left:25px;position:relative;height: 100%;}
    .c_OtherTeacherWrap li .c_TeacherPhoto{margin-left: 30px;}
    /*****************************学生区域**********************************/
    .c_StudentArea{width:900px; height: auto; margin:0 auto; margin-top: 50px; border-radius: 10px;background: #fff; margin-bottom: 100px;}
    .c_StudentAreaTab{ height:60px; border-bottom: 1px solid #ccc;}
    .c_StudentList{width:870px;}
    .c_StudentList li.c_NoStudent{ height: 300px; line-height: 300px; text-align: center; border: none; font-size: 22px; color: #666;width:100%;}
    /*********创建小组列表***********/
    /*没有学生信息*/
    .c_classMsg{width:100%;height:300px;text-align:center;line-height:300px;font-size:22px;color:#666666;}
    .m_classTch{width: 860px;height: 720px;background: #fff;position: fixed;top:50%;left:50%; margin-top:-350px; margin-left:-480px; border-radius: 10px;}
    .m_classTch h3{width:770px;height:55px;font-size: 22px;color:#333333;padding: 65px 0 0 90px;}
    .c_CreatGroupBtn span{ font-size: 22px;}
    .c_MainAdd p{ font-size: 14px;}
    /*引用班主任分组弹窗*/
    .m_classTchbtn{width:460px;padding:0 200px}
    .m_classTchbtn input{width:210px;}
  }
  .c_MainList li:nth-child(1){border-top:1px dotted #ccc;}

  .c_MainList{width:220px; height:231px; overflow: auto;margin: 0 auto;}
  .c_MainList li{width:100%;height:45px;text-align: center;line-height:45px;border-bottom:1px dotted #ccc; float: left; position: relative;cursor: pointer}
</style>
