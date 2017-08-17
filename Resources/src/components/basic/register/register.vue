<template>
    <div class="register_main">
      <div class="register_top">
        <div class="register_head">
          <img src="/static/common/images/login/logo.png" alt="" class="register_Logo">
          <router-link v-bind:to="'/'" class="register_login">登录</router-link>
        </div>
      </div>
      <div class="register_center" id="LoginCenter">
        <div class="register_cmain">
          <!--老师注册-->
          <div class="register_teacherReg" @mouseenter="enter($event)" @mouseleave="leave($event)" id="TeacherReg">
            <v-stepone :info="teachData.fstep" @updatetStep="getFlag" ref="stData" :class="{'dino':teachData.fstep.fShow}" :style="teachData.tStyle"></v-stepone>
            <div class="register_tStep2" :class="{'dino':teachData.sstep.sShow}" :style="teachData.tStyle">
              <h1 class="register_title">教师注册</h1>
              <!--教师姓名-->
              <div class="register_Box">
                <input type="text" class="register_userName" maxlength="10" placeholder="姓名" v-model="teachData.sstep.teacherName">
              </div>
              <!--学科-->
              <div class="register_Box">
                <div class="register_userSelect" @click="showSubject">
                  <span class="register_selectOut" :data-id="teachData.sstep.defaultId">{{teachData.sstep.defaultSub}}</span>
                  <div class="r_DownBox"><i class="loimg dico0"></i></div>
                  <!--学科-->
                  <el-collapse-transition>
                    <ul class="register_userOption" v-show="subshow">
                      <li v-for="temp in teachData.sstep.subjectList" :data-id="temp.value" @click="selectSubject(temp)" @mouseenter="liEnter($event)" @mouseleave="liLeave($event)">{{temp.label}}</li>
                    </ul>
                  </el-collapse-transition>
                </div>
              </div>
              <!--教材-->
              <div class="register_Box">
                <div class="register_userSelect" @click="showMaterial">
                <span class="register_selectOut" :data-id="teachData.sstep.defaultMid"
                      :data-grade="teachData.sstep.defaultGrade">{{teachData.sstep.defaultMat}}</span>
                  <div class="r_DownBox"><i class="loimg dico0"></i></div>
                  <!--教材-->
                  <el-collapse-transition>
                    <ul class="register_userOption" v-show="matshow">
                      <li v-for="temp in teachData.sstep.materialList" :data-id="temp.id" :data-grade="temp.grade" @click="selectMaterial(temp)" @mouseenter="liEnter($event)" @mouseleave="liLeave($event)">{{temp.name}}</li>
                    </ul>
                  </el-collapse-transition>
                </div>
              </div>
              <!--版本-->
              <div class="register_Box">
                <div class="register_userSelect">
                  <span class="register_selectOut" :data-id="teachData.sstep.pressId">{{teachData.sstep.pressName}}</span>
                </div>
              </div>
              <div style="clear: both"></div>
              <p class="register_error">{{teachData.sstep.error}}</p>
              <input type="button" class="register_btn0" value="同意协议并注册" @click="teacherDone()">
              <p class="r_Agreement"><a target="_blank" href="../compact/compact.html">《用户协议》</a></p>
            </div>
          </div>
          <!--学生注册-->
          <div class="register_stuReg" @mouseenter="enter($event)" @mouseleave="leave($event)">
            <v-stepone :info="stuData.fstep" @updatesStep="getFlag" :style="stuData.tStyle" ref="stData" :class="{'dino':stuData.fstep.fShow}"></v-stepone>
            <div class="register_sTtep2" id="StudentStep2" :class="{'dino':stuData.sstep.sShow}" :style="stuData.tStyle">
              <h1 class="register_title">学生注册</h1>
              <div class="register_isCode" id="IsCode">
                <span class="register_codeSelect">是否有班级码：</span>
                <p class="fl">
                  <i class="loimg" :class="{'reico1':stuData.sstep.isClassCode,'reico0':stuData.sstep.noClassCode}" @click="selectHasCode"></i>
                  <span class="ml7">是</span>
                </p>
                <p class="fr">
                  <i class="loimg" :class="{'reico1':stuData.sstep.noClassCode,'reico0':stuData.sstep.isClassCode}" @click="selectNoCode"></i>
                  <span class="ml7">否</span>
                </p>
              </div>
              <div class="register_sBox" :class="{'dino':stuData.sstep.noClassCode}">
                <!--填写姓名-->
                <div class="register_Box">
                  <input type="text" class="register_userName" maxlength="10" v-model="stuData.sstep.studentName" placeholder="姓名">
                </div>
                <!--填写班级码-->
                <div class="register_Box">
                  <input type="text" class="register_userName" maxlength="10" v-model="stuData.sstep.classCode" placeholder="班级码">
                </div>
              </div>
              <div class="register_sBox" :class="{'dino':stuData.sstep.isClassCode}">
                <!--学生姓名-->
                <div class="register_Box">
                  <input type="text" class="register_userName" maxlength="10" v-model="stuData.sstep.studentName" placeholder="姓名">
                </div>
                <!--年级-->
                <div class="register_Box">
                  <div class="register_userSelect" @click="showGrade">
                    <span class="register_selectOut" id="Grade0" data-id="stuData.sstep.defaultId">{{stuData.sstep.defaultGrade}}</span>
                    <div class="r_DownBox"><i class="loimg dico0 NeedChange"></i></div>
                    <!--年级-->
                    <el-collapse-transition>
                      <ul class="register_userOption" v-show="gradeshow">
                        <li v-for="temp in stuData.sstep.gradeList" :data-id="temp.value" @click="selectGrade(temp)" @mouseenter="liEnter($event)" @mouseleave="liLeave($event)">{{temp.label}}</li>
                      </ul>
                    </el-collapse-transition>
                  </div>
                </div>
              </div>
              <p class="register_error padeL1">{{stuData.sstep.error}}</p>
              <div class="register_doneBox">
                <input type="button" class="register_btn1" value="同意协议并注册" @click="studentDone">
                <p class="r_Agreement"><a target="_blank" href="../compact/compact.html">《用户协议》</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="register_footer">
        <p class="register_goTo fs24">
          <a href="../AboutUs/about.html" target="_blank">关于我们</a>
          <span>|</span>
          <a href="../AboutUs/Call.html" target="_blank">联系我们</a>
          <span>|</span>
          <a href="../AboutUs/Use.html" target="_blank">新手指南</a>
          <span>|</span>
          <a href="../AboutUs/join.html" target="_blank">招贤纳士</a>
        </p>
        <p class="register_company fs18">Copyright ©2017 山东百川图书有限公司 All Rights Reserved. 鲁ICP备16038439号-2</p>
      </div>
    </div>
</template>
<script type="text/ecmascript-6">
  import md5 from 'js-md5';
  import {login} from '../../../service/login/login.js';
  import stepone from './stepone.vue';
  import {getCaptcha, getSubject, getMaterial, getPress, saveTeacher, quit, getGrade, saveStudent} from '../../../service/register/register.js';
  /*手机号正则*/
  let pat = /^(13|14|19|15|18|17)[0-9]{9}$/;
  export default {
    data() {
      return {
        intervalid:'',
        tstep: '1',
        sstep: '1',
        teachData: {
          tStyle:{'margin-top': '-80px'},
          fstep: {
            id: 'TeacherStep1',
            title: '教师注册',
            fShow:true,
            fstr:'t',
            capchaSrc:''
          },
          sstep: {
            teacherName:'',
            defaultSub:'',
            defaultId:'',
            defaultGrade:'',
            defaultMid:'',
            defaultMat:'',
            subjectList: [{value: '', label: '暂无学科'}],
            materialList: [{id: '', grade: '', name: '暂无教材'}],
            pressName:'',
            pressId:'',
            error:'',
            sShow:true,
            classB:''
          }
        },
        stuData: {
          tStyle:{'margin-top': '-80px'},
          fstep: {
            id: 'StudentStep1',
            title: '学生注册',
            str: '1',
            str2: '3',
            fstr: 's',
            fShow:true,
            classA:'',
            capchaSrc:''
          },
          sstep: {
            studentName:'',
            classCode:'',
            isClassCode: true,
            noClassCode:false,
            defaultId:'',
            defaultGrade:'请选择',
            gradeList: [{value: '', label: '暂无年级'}],
            error:'',
            sShow:true,
            classB:''
          }
        },
        subshow:false,
        matshow:false,
        gradeshow:false,
        liColor:false
      };
    },
    created() {
      this.showCapcha();
      this.Center();
      this.GetSubject();
      this.GetPress();
      this.GetGrade();
    },
    mounted() {
    },
    beforeDestroy() {
      clearInterval(this.intervalid);
    },
    methods: {
      showCapcha() {
        let that = this;
        getCaptcha(this).then((response) => {
          let rdata = response.body;
          var codenum = parseInt(rdata.retCode.substr(0, 1));
          if (codenum == 0) {
            that.teachData.fstep.capchaSrc = rdata.retData;
            that.stuData.fstep.capchaSrc = rdata.retData;
          }
        });
      },
      showSubject() {
        if(this.subshow) {
          this.subshow=false;
        }else{
          this.subshow=true;
        }
      },
      showMaterial() {
        if(this.subMat) {
          this.matshow=false;
        }else{
          this.matshow=true;
        }
      },
      enter(event) {
        let index = event.target.className.indexOf('teacherReg');
        if(index!=-1) {
          if (this.tstep == '2') {
            this.teachData.fstep.fShow = true
            this.teachData.sstep.sShow = false
          }else{
            this.teachData.fstep.fShow = false
            this.teachData.sstep.sShow = true
          }
        }else{
          if (this.sstep == '2') {
            this.stuData.fstep.fShow = true
            this.stuData.sstep.sShow = false
          }else{
            this.stuData.fstep.fShow = false
            this.stuData.sstep.sShow = true
          }
        }
      },
      leave(event) {
        let index = event.target.className.indexOf('teacherReg');
        if(index!=-1) {
          this.teachData.fstep.fShow = true
          this.teachData.sstep.sShow = true
        }else{
          this.stuData.fstep.fShow = true
          this.stuData.sstep.sShow = true
        }
      },
      Center() {
        let that = this;
        this.intervalid = setInterval(function () {
          let ts1 = document.getElementById('TeacherStep1');
          let ss1 = document.getElementById('StudentStep1');
          let lc = document.getElementById('LoginCenter');
          let tr = document.getElementById('TeacherReg');
          var TH = ts1.clientHeight;
          var SH = ss1.clientHeight;
          var LCH = lc.clientHeight;
          var TCH = tr.clientHeight;
          var Tt = (LCH - TCH) / 2;
          var Mt = (LCH - TH) / 2;
          var St = (LCH - SH) / 2;
          that.teachData.tStyle = {"margin-top": Mt - Tt};
          that.stuData.tStyle = {"margin-top": St - Tt};
        }, 1);
      },
      getFlag(info) {
        if(info.key=='tstep') {
          this.tstep = info.value;
        }else{
          this.sstep = info.value;
        }
      },
      GetSubject() {
        let that = this;
        getSubject(this).then((response) => {
          let rData = response.body;
          if (rData.retCode === '0000') {
            if (rData.retData.length > 0) {
              that.teachData.sstep.subjectList = rData.retData;
              that.GetMaterial(rData.retData[0].value, '1');
              that.teachData.sstep.defaultSub = rData.retData[0].label;
              that.teachData.sstep.defaultId = rData.retData[0].value;
            }
          }
        });
      },
      selectSubject(obj) {
        this.teachData.sstep.defaultSub = obj.label;
        this.teachData.sstep.defaultId = obj.value;
        this.GetMaterial(obj.value);
      },
      GetMaterial(subjectid) {
        let that = this;
        let SubData = {};
        SubData.subjectId = subjectid;
        getMaterial(this, SubData).then((response) => {
          let rData = response.body;
          if (rData.retCode === '0000') {
            if (rData.retData.length > 0) {
              that.teachData.sstep.materialList = rData.retData;
              that.teachData.sstep.defaultMat = rData.retData[0].name;
              that.teachData.sstep.defaultMid = rData.retData[0].id;
              that.teachData.sstep.defaultGrade = rData.retData[0].grade;
            }
          }
        });
      },
      selectMaterial(obj) {
        this.teachData.sstep.defaultMat = obj.name;
        this.teachData.sstep.defaultMid = obj.id;
        this.teachData.sstep.defaultGrade = obj.grade;
      },
      liEnter(event) {
        event.target.className = 'r_liColor';
      },
      liLeave(event) {
        event.target.className = '';
      },
      GetPress() {
        let that = this;
        getPress(this).then((response) => {
          let rData = response.body;
          if (rData.retCode === '0000') {
            for (var i = 0; i < rData.retData.length; i++) {
              if (rData.retData[i].name == '人教版') {
                that.teachData.sstep.pressName = rData.retData[i].name;
                that.teachData.sstep.pressId = rData.retData[i].id;
              }
            }
          }
        });
      },
      teacherDone() {
        if (this.teachData.sstep.teacherName === '') {
          this.teachData.sstep.error='请输入姓名';
        } else {
          var subData = {};
          /*教材*/
          subData.materialId = this.teachData.sstep.defaultMid;
          /*手机号*/
          subData.mobile = this.$refs.stData.phoneNum;
          /*姓名*/
          subData.name = this.teachData.sstep.teacherName;
          /*密码*/
          subData.password = md5(this.$refs.stData.fpass);
          /*短信验证码*/
          subData.smsCaptcha = this.$refs.stData.message;
          /*学科*/
          subData.subjectId = this.teachData.sstep.defaultId;
          let that=this;
          saveTeacher(this, subData).then((response) => {
            let rData = response.body;
            var codenum = parseInt(rData.retCode.substr(0, 1));
            if (codenum == 0) {
//              $('#c_ErrorMsg').html('恭喜您注册成功，即将跳转首页').fadeIn(200);
//              GoldAnimate(rData.retGold);
              setTimeout(function () {
                that.AutoLogIn();
              }, 1000);
            } else {
//              $('#c_ErrorMsg').html('注册失败,请重试').fadeIn(200);
//              Disappear("#c_ErrorMsg");
//              $('#TeacherStep2').fadeOut(150);
            }
          });
        }
      },
      AutoLogIn() {
        let that = this;
        quit(this);
        var subData = {};
        subData.mobile = this.$refs.stData.phoneNum;
        subData.password = md5(this.$refs.stData.fpass);
        subData.imageCaptcha = this.$refs.stData.capcha;
        login(this, subData).then((response) => {
          let res = response.body;
          var code = res.retCode;
          var codenum = parseInt(code.substr(0, 1));
          if (codenum == 0) {
            if (res.retData.userType == '1' || res.retData.userType == 1) {
//                store.set('UserHeadImgSrc','/static/images/me/user.png');
              setTimeout(function () {
                that.$router.push('/content/teacher/index/index');
              }, 1000);
            }
            if (res.retData.userType == '2' || res.retData.userType == 2) {
//              store.set('UserHeadImgSrc','../../static/image/common/user.png');
              setTimeout(function () {
                that.$router.push('/content/teacher/index/index');
              }, 1000);
            }
          } else {
//            $('#c_ErrorMsg').html('登陆失败,请重试').fadeIn(200);
//            Disappear("#c_ErrorMsg");
            that.$router.push('/');
          }
        });
      },
      selectHasCode() {
        this.stuData.sstep.isClassCode = true;
        this.stuData.sstep.noClassCode = false;
        this.stuData.sstep.error = '';
      },
      selectNoCode() {
        this.stuData.sstep.isClassCode = false;
        this.stuData.sstep.noClassCode = true;
        this.stuData.sstep.error = '';
      },
      GetGrade() {
        let that = this;
        getGrade(this).then((response) => {
          let res = response.body;
          if (res.retCode === '0000') {
            if (res.retData.length > 0) {
              that.stuData.sstep.gradeList = res.retData;
            }
          }
        });
      },
      selectGrade(obj) {
        this.stuData.sstep.defaultId = obj.value;
        this.stuData.sstep.defaultGrade = obj.label;
      },
      showGrade() {
        if(this.gradeshow) {
          this.gradeshow=false;
        }else{
          this.gradeshow=true;
        }
      },
      studentDone() {
        if (this.stuData.sstep.isClassCode) {
          if (this.stuData.sstep.studentName == '') {
            this.stuData.sstep.error='请输入姓名';
            return;
          }
          if (this.stuData.sstep.classCode == '') {
            this.stuData.sstep.error='请输入班级码';
            return;
          }
          if (this.stuData.sstep.studentName!= '' && this.stuData.sstep.classCode != '') {
            this.SaveNoCodeInfo();
          }
        } else {
          if (this.stuData.sstep.studentName == '') {
            this.stuData.sstep.error='请输入姓名';
          } else if (this.stuData.sstep.defaultId == '') {
            this.stuData.sstep.error='请选择年级';
          } else {
            this.SaveNoCodeInfo();
          }
        }
      },
      SaveNoCodeInfo() {
        let that = this;
        var SubData = {};
        /*姓名*/
        SubData.name = this.stuData.sstep.studentName;
        /*班级代码*/
        SubData.classCode = this.stuData.sstep.classCode;
        /*年级ID*/
        SubData.gradeId = this.stuData.sstep.defaultId;
        /*是否存在班级代码*/
        SubData.isClassCode = this.stuData.sstep.isClassCode;
        /*手机号*/
        SubData.mobile = this.$refs.stData.phoneNum;;
        /*密码*/
        SubData.password = md5(this.$refs.stData.fpass);
        /*出版社*/
        SubData.pressId = this.teachData.sstep.pressId;
        /*短信验证码*/
        SubData.smsCaptcha = this.$refs.stData.message;
        saveStudent(this, SubData).then((response) => {
          let rData = response.body;
          var codenum = parseInt(rData.retCode.substr(0, 1));
          if (codenum == 0) {
//            $('#sError1').html('');
//            $('#c_ErrorMsg').html('恭喜您注册成功，即将跳转首页').fadeIn(200);
//            GoldAnimate(rData.retGold);
            setTimeout(function () {
              that.AutoLogIn();
            }, 1000);
          }
          else if (codenum == 2) {
            this.stuData.sstep.error=rData.retMsg;
          }
          else {
//            $('#c_ErrorMsg').html('注册失败,请重试').fadeIn(200);
//            Disappear("#c_ErrorMsg");
//            $('#StudentStep2').fadeOut(150);
          }
        });
      }
    },
    components: {
      'v-stepone': stepone
    }
  };
</script>
<style>
  @import '/static/common/css/common.css';
  html, body{background:#fff;}
  .register_main{position: relative;box-sizing: border-box;width: 100%;min-width: 900px;}
  .register_top{width: 100%;overflow: hidden;float: left;min-width: 1000px;background: white;box-sizing: border-box;height: 92px;  border-bottom: 2px solid #00ce9f;}
  .register_head{margin: 0 auto;height: 100%;overflow: hidden;background: white;}
  .register_login{float: right;color: #00ce9f;cursor: pointer;width: 102px;height: 31px;border-radius: 16px;box-sizing: border-box;  margin: 30px 12px 30px  auto;  border: 1px solid #00ce9f;  line-height: 30px;  text-align: center;  font-size: 16px;}
  .register_center{float: left;width: 100%;height: 710px;background:#f5f5f5;position: relative;}
  .register_footer{float: left;width: 100%;height: 24%;text-align: center;}
  .register_cmain{float: left;height: 100%;position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: auto;z-index: 1;}
  .register_teacherReg{float: left;position: absolute;cursor: pointer; top: 0;left: 215px; bottom: 0;margin: auto;z-index: 2;background: url("/static/common/images/register/teacher.png")0 0; background-size: 100%;}
  .register_stuReg{float: left;position: absolute;cursor: pointer; top: 0;right: 215px; bottom: 0;margin: auto;z-index: 2;background: url("/static/common/images/register/student.png")0 0; background-size: 100%;}
  .rgister_goTo a{color: #333;font-size: 16px;margin: 0 5px;}
  .rgister_goTo a:hover{color:#F9A24A }
  .register_company{float: left;width: 100%;text-align: center;color: #999;font-size:12px;}
  .loimg {background: url('/static/common/images/register/loimg.png')0 0 no-repeat;  }
  .register_tStep2,.register_sTtep2{ float:left; height: 410px;position: relative;cursor: pointer;  text-align: center;background: white; box-sizing: border-box;  padding: 0 55px 40px 55px; z-index:3;}
  .register_title{width: 100%;float: left;text-align: center;color: #333333;}
  .register_userName{width: 100%;height:40px;font-size:12px; border: 1px solid #ccc;float: left;outline: none;text-align: left;box-sizing: border-box;padding-left: 10px;color: #333;}
  .register_userSelect{width: 100%;height:40px;font-size:12px;cursor: pointer; padding-right: 10px;position: relative; border: 1px solid #ccc;float: left;outline: none;text-align: left;box-sizing: border-box;padding-left: 15px;color: #333;}
  .register_Box{float: left;width: 290px;box-sizing: border-box;margin-top:10px;}
  .register_selectOut{float: left;width: 90%;overflow: hidden;white-space:nowrap;text-overflow:ellipsis;height:38px;font-size: 14px;line-height: 38px; }
  .register_btn0{width: 100%; box-sizing: border-box;display: block;margin: 0 auto; text-align: center;color: white;background: -webkit-linear-gradient(#03d89b,#00b961); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#03d89b,#00b961); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#03d89b,#00b961); /* Firefox 3.6 - 15 */
    background: linear-gradient(#03d89b,#00b961); /* 标准的语法 */
    border-radius: 10px;border-radius: 10px;outline: none;cursor: pointer;border: 0;margin-top:30px}
  .r_Agreement{float: left;  margin-top: 10px;}
  .r_DownBox {float: right;  width: 38px;  height: 38px;  background: #dedede;  text-align: center;  position:relative;  top: -38px;  left: 10px;  }
  .dico0 {height: 6px;  width: 11px;  background-position: -105px 0;  float: left;  margin: 17px 0 0 14px;  }
  .r_liColor{color:#65b113 !important;}
  .register_userOption{z-index: 2;  position: absolute;  top: 39px;  left: -1px;  width: 290px;  min-height: 40px;  box-sizing: border-box;  border-left: 1px solid #ccc;  border-right: 1px solid #ccc;  background: #f5f5f5;  }
  .register_userOption li{  float: left;  padding-left: 10px;  width: 100%;  height: 40px;  line-height: 40px;  text-align: left;  color: #323232;  font-size: 14px;  box-sizing: border-box;  border-bottom: 1px solid #ccc;  background: #f5f5f5;  }
  .r_Agreement a{  font-size:14px;  color:#959595;  }
  .register_btn0,.register_SelectOut{height:38px;font-size: 14px;line-height: 38px;}
  .register_isCode{float: left;margin-top: 8%}
  .register_isCode>p{font-size: 16px;}
  .register_codeSelect{  font-size: 18px;  color: #323232;  float: left;  width: 100%;  line-height: 20px;  text-align: left;  margin-bottom:10px;  }
  .reico0 {height: 14px;  width: 14px;  background-position: -18px 0;  float: left;  margin: 5px 8px 0 0;  cursor: pointer;  }
  .reico1 {height: 14px;  width: 14px;  background-position: 0 0;  float: left;  margin: 5px 8px 0 0;  cursor: pointer;  }
  .register_sBox{float: left;width: 100%;box-sizing: border-box;margin: 10px 0 10px 0;}
  .register_Box{float: left;width: 290px;box-sizing: border-box;margin-top:10px;}
  .register_doneBox{float: left;padding: 0 55px;position: absolute;left: 0;bottom: 10%;float: left;  width: 100%;  box-sizing: border-box;}
  .register_btn1{width: 100%; box-sizing: border-box;display: block;margin: 0 auto; text-align: center;color: white;background: -webkit-linear-gradient(#03d89b,#00b961); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#03d89b,#00b961); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#03d89b,#00b961); /* Firefox 3.6 - 15 */
    background: linear-gradient(#03d89b,#00b961); /* 标准的语法 */
    border-radius: 10px;border-radius: 10px;outline: none;cursor: pointer;border: 0;height:38px;font-size: 14px;line-height: 38px;}
  .register_error{box-sizing: border-box;line-height: 12px;height: 12px;  text-align: left;  width: 100%;  float: left;  color: #f6111a;  font-size: 12px;}
  @media screen and (max-width:1366px){
    .register_head{width: 900px;}
    .register_Main{height: 740px;}
    .register_cmain{width: 900px;}
    .register_stuReg,.register_teacherReg{width: 250px;height: 250px; }
    .register_teacherReg {left: 125px;}
    .register_stuReg {right: 125px;}
    .register_tStep2{width: 390px;left: -16%;}
    .register_title{line-height:40px;font-size: 20px; }
    .register_UserSelect,.register_UserName{height: 40px;font-size: 12px;}
    .register_sTtep2{width: 390px;left: -16%;}
  }
  @media screen and (min-width:1366px) and (max-width:1599px){
    .register_head{width: 1000px;}
    .register_Main{height: 740px;}
    .register_cmain{width: 1000px;}
    .register_stuReg,.register_teacherReg{width: 280px;height: 280px; }
    .register_teacherReg {left: 145px;}
    .register_stuReg {right: 145px;}
    .register_tStep2{width: 410px;left: -13%;}
    .register_UserSelect,.register_UserName{height: 40px;font-size: 12px;}
    .register_title{height:40px;font-size: 18px;line-height: 40px;}
    .register_sTtep2{width: 410px;left: -13%;}
  }
  @media screen and (min-width:1600px){
    .register_head{width: 1200px;}
    .register_Main{height: 920px;}
    .register_cmain{width: 1200px;}
    .register_stuReg,.register_teacherReg{width: 310px;height: 310px; }
    .register_teacherReg {left: 215px;}
    .register_stuReg {right: 215px;}
    .register_tStep2{width: 404px;left: -16%;height:411px;}
    .register_UserSelect,.register_UserName{height: 40px;font-size: 14px;}
  }
</style>

