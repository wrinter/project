<template>
  <div>
    <div class="c_haveClass" v-if="classlist.length">
      <div class="c_btns">
        <p class="c_classMsg" v-if="applyNum!=0">
          <span>{{applyNum}}</span>
          <span>人申请加入你的班级</span>
        </p>
        <input class="c_btn c_join" value="加入班级" type="button" @click="joinClick()">
        <input class="c_btn c_create" value="创建班级" type="button" @click="createClick()">
      </div>
      <div class="c-content">
        <ul class="c_createdList">
          <li class="c_created" v-for="temp in classlist">
            <p class="c_userPhoto" v-if="temp.headTeacherImage">
              <img :src="temp.headTeacherImage" alt="" class="w100 fl">
            </p>
            <p class="c_userPhoto" v-else>
              <img src="/static/common/images/header/user.png" alt="" class="w100 fl">
            </p>
            <p class="c_userName">{{temp.headTeacherName}}</p>
            <p class="headTeacherId dino">{{temp.headTeacherName}}</p>
            <p class="c_grade">{{temp.gradeName+temp.className}}</p>
            <p class="c_student"> 学生：{{temp.studentNum}}</p>
            <p class="c_teacher">老师：{{temp.teacherNum}}</p>
            <p class="dino classId">{{temp.classId}}</p>
            <input v-if="temp.joinStatus=='1'" class="c_inBtn  cup mt55" value="进入班级" type="button"
                   @click="enterClass(temp)">
            <input v-else class="c_waitBtn borcCC cup mt55 fcCA" value="等待ing" type="button">
          </li>
        </ul>
      </div>
    </div>
    <div class="c_noClass" v-else>
      <div class="c_btns">
        <p class="c_classMsg" v-if="applyNum!=0">
          <span>{{applyNum}}</span>
          <span>人申请加入你的班级</span>
        </p>
        <input class="c_btn c_join" value="加入班级" type="button" @click="joinClick()">
        <input class="c_btn c_create" value="创建班级" type="button" @click="createClick()">
      </div>
      <img class="c_img" src="/static/teacher/images/classmanage/c_NoClassImg.png" alt="">
    </div>
    <div class="c_joinArea" v-show="showjoin">
      <!--<i class="spriteImg c_ClassUico c_arrow"></i>-->
      <div class="arrow-up">
        <!--向上的三角-->
      </div>
      <i class="spriteImg c_closeico fr c_closeImg" @click="closeJoin"></i>
      <div class="c_search">
        <input class="c_sBox" placeholder="请输入6位班级码" maxlength="6" :style="searchedClass.inputState" type="text" v-model="searchedClass.classCode" @keyup="checkCode">
        <p class="c_sbtn" @click="searchClass">
          <i class="spriteImg fl searchico c_searchImg"></i>
        </p>
      </div>
      <!--查无班级-->
      <p class="c_searchNo" :class="{'dino':searchedClass.isnshow}">{{searchedClass.noClassInfo}}</p>
      <!--查到班级-->
      <div class="c_searchYes" :class="{'dino':searchedClass.isyshow}">
        <img class="c_userPhoto f1" alt="" :src="searchedClass.userPhoto">
        <p class="c_grade">{{searchedClass.grade}}</p>
        <p class="c_snum">{{searchedClass.snum}}</p>
        <p class="c_tnum">{{searchedClass.tnum}}</p>
        <input class="orc65 cup c_joinBtn" value="加入班级" type="button" :id="searchedClass.classId" @click="joinIn">
      </div>
    </div>
    <div class="c_createArea" v-show="showcreate">
      <!--选择学校-->
      <div v-if="!isSet" class="c_selectSchool">
        <i class="spriteImg c_closeico fr c_closeImg" @click="closeCreate"></i>
        <span class="fs18 fl fc66">地区：</span>
        <div class="c_province" @click="getProvince">
          <span class="fl fs17 lh40" :id="pId">{{pspan}}</span>
          <i class="spriteImg i_downico fr c_areaImg"></i>
          <el-collapse-transition>
            <ul class="c_pList c_list" v-show="pflag">
              <li v-for="temp in pList" :id="temp.id" :parentId="temp.parentId" @click="selectProvince(temp,$event)">
                {{temp.name}}
              </li>
            </ul>
          </el-collapse-transition>
        </div>
        <div class="c_city" @click="getCity">
          <span class="fl fs17 lh40" :id="cId">{{cspan}}</span>
          <i class="spriteImg i_downico fr c_areaImg"></i>
          <el-collapse-transition>
            <ul class="c_cList c_list" v-show="cflag">
              <li v-for="temp in cityList" :id="temp.id" :parentId="temp.parentId" @click="selectCity(temp,$event)">
                {{temp.name}}
              </li>
            </ul>
          </el-collapse-transition>
        </div>
        <div class="c_county" @click="getCounty()">
          <span class="fl fs17 lh40" :id="coId">{{cospan}}</span>
          <i class="spriteImg i_downico fr c_areaImg"></i>
          <el-collapse-transition>
            <ul class="c_coList c_list" v-show="coflag">
              <li v-for="temp in coList" :id="temp.id" :parentId="temp.parentId" @click="selectCounty(temp,$event)">
                {{temp.name}}
              </li>
            </ul>
          </el-collapse-transition>
        </div>
        <span class="fs18 fc66 c_sP mt30">学校：</span>
        <div class="c_school mt30" @click="showSchool()">
          <span class="fl fs17 lh40" :id="sId">{{sspan}}</span>
          <i class="spriteImg i_downico fr c_areaImg"></i>
          <el-collapse-transition>
            <ul class="c_sList c_list" v-show="sflag">
              <li v-for="temp in sList" :id="temp.id" @click="selectSchool(temp,$event)">{{temp.schoolName}}</li>
            </ul>
          </el-collapse-transition>
        </div>
        <input value="确 定" class="c_schoolEnsure" type="button" @click="schoolEnsure">
      </div>
      <!--选择班级-->
      <div v-else class="c_selectClass">
        <i class="spriteImg c_closeico fr c_closeImg" @click="closeCreate"></i>
        <ul class="c_tab">
          <li class="c_cli c_firstLi" gradeid="9" @click="selectGrade($event)">9年级<i class="c_space0"></i></li>
          <li class="c_cli c_secondLi" gradeid="8" @click="selectGrade($event)">8年级<i class="c_space1"></i></li>
          <li class="c_cli c_thirdLi c_selectedLi" gradeid="7" @click="selectGrade($event)">7年级<i class="c_space2"></i></li>
        </ul>
        <div class="c_tabCon" id="c_tabCon">
          <li v-for="temp in classNumList"><i class="spriteImg i_slcico0 fl c_sImg" @click="selectClass($event)"></i><span class="c_ClassNum">{{temp}}</span></li>
          <p class="c_more" @click="getMore" v-show="classShow"><span class="c_ctext">展开</span><i class="spriteImg c_spread fr"></i></p>
          <p class="c_less" @click="getLess" v-show="!classShow"><span class="c_ctext">收起</span><i class="spriteImg c_stop fr"></i></p>
        </div>
        <div class="c_seClass">
          <p class="fl fs18">已选班级</p>
          <ul class="c_seCon">
            <li :classname="temp.classname" v-for="temp in selectedClass">{{temp.gcname}} <i class="spriteImg c_delClass c_delImg" @click="removeClass($event)"></i></li>
          </ul>
        </div>
        <input value="确 定" class="c_createEnsure" type="button" @click="classCreate">
        <input value="取 消" class="c_createCancel" type="button" @click="closeCreate">
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {stopBubble} from '../../../common/js/common.js';
  import {classSearch, getMessageSize, getClassList, classJoin, checkSchool, getArea, getSchool, setSchool, createEnsure, getClassCreated, getCurrentGrade} from '../../../service/classmanage/classmanage.js';
  import $ from 'jquery';
  const RET_OK = '0000';
  export default {
    data() {
      return {
        applyNum:0,
        classlist: {},
        isSet: true,
        // 是否显示加入或创建班级
        showjoin:false,
        showcreate:false,
        // 加入班级
        searchedClass: {
          userPhoto: '/static/images/me/user.png',
          grade: '',
          snum: '',
          tnum: '',
          classId: '',
          classCode:'',
          inputState:'',
          isyshow:true,
          isnshow:true,
          noClassInfo:'查无此班，请重新输入'
        },
        // 创建班级
        pList: '',
        cityList: '',
        coList: '',
        sList: '',
        pspan:'选择省',
        pId:'',
        cspan:'选择市',
        cId:'',
        cospan:'选择区/县',
        coId:'',
        sspan:'选择学校',
        sId:'',
        pflag:false,
        cflag:false,
        coflag:false,
        sflag:false,
        classShow:true,
        classNumList:[],
        selectedClass:[],
        exitClass:[],
        gradeId:'7',
        createdList:[]
      };
    },
    created() {
      this.isSetSchoool()
      this.getExitClass()
      this.getClass()
    },
    methods: {
    contains(arr, obj) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === obj) {
          return true;
        }
      }
      return false;
    },
    enterClass(obj) {
      let c_grade = obj.gradeName+obj.className
      window.localStorage.setItem('nowClassId',obj.classId)
      window.localStorage.setItem('c_grade',c_grade)
      window.localStorage.setItem('headTeacherId',obj.headTeacherId)
      this.$router.push('/content/teacher/classmanage/classinfo');
    },
    joinClick() {
      this.searchedClass.classCode=''
      this.showjoin = true;
    },
    getClass() {
      getClassList(this).then((response) => {
        response = response.body;
        if (response.retCode === RET_OK) {
          this.classlist = response.retData;
        }
      });
      getMessageSize(this).then((response) => {
        response = response.body;
        if (response.retCode === RET_OK) {
          this.applyNum = response.retData;
        }
      })
    },
    checkCode() {
      this.searchedClass.classCode = this.searchedClass.classCode.replace(/\D/g, '');
      this.searchedClass.inputState = {"ime-mode": "disabled"}
    },
    searchClass() {
      let that = this;
      if (this.searchedClass.classCode.length != 6) {
        return;
      }
      let para = {};
      para.classCode = this.searchedClass.classCode;
      classSearch(this, para).then(function (response) {
        let resp = response.body;
        let retData = resp.retData;
        if (resp.retCode == "0000") {
          if (retData.length == 0) {
            that.searchedClass.isnshow = false
            that.searchedClass.isyshow = true
          } else {
            that.searchedClass.isnshow = true
            that.searchedClass.isyshow = false
            if (retData.headTeacherImage != "" && retData.headTeacherImage != null) {
              that.searchedClass.userPhoto = retData.headTeacherImage;
            }
            that.searchedClass.grade = retData.gradeName + retData.className;
            that.searchedClass.snum = "学生：" + retData.studentNum;
            that.searchedClass.tnum = "老师：" + retData.teacherNum;
            that.searchedClass.classId = retData.classId;
          }
        } else {
          that.searchedClass.noClassInfo = '查无此班，请重新输入'
          that.searchedClass.isnshow = false
          that.searchedClass.isyshow = true
        }
      });
    },
    joinIn() {
      let para = {
        'classId': this.searchedClass.classId
      };
      let that = this;
      classJoin(this, para).then(function (response) {
        let resp = response.body;
        var codenum = parseInt(resp.retCode.substr(0, 1));
        if (codenum == 0) {
          that.getClass();
          this.showjoin = false;
        }
        if (codenum == 2) {
//            $('.c_ErrorMsg').html("您已经申请过加入该班或已经进入该班").fadeIn(200).css('width', '460px');
//            Disappear(".c_ErrorMsg");
          this.showjoin = false;
        }
        if (codenum == 3) {
//            $('.c_ErrorMsg').html("每位老师最多加入20个班级").fadeIn(200).css('width', '460px');
//            Disappear(".c_ErrorMsg");
          this.showjoin = false;
        }
      });
    },
    isSetSchoool() {
      let that = this;
      checkSchool(this).then(function (response) {
        let res = response.body;
        let codenum = parseInt(res.retCode.substr(0, 1));
        if (codenum == 3) {
          that.isSet = false;
        }
      });
    },
    createClick() {
      this.showcreate = true
      if(this.isSet) {
        this.showDefaultGrade()
        this.showClasses(20)
      }
    },
    closeJoin() {
      this.showjoin = false;
    },
    getProvince () {
      let that = this;
      getArea(this, {parentId: '100000'}).then(function (response) {
        let res = response.body;
        if (res.retCode == '0000') {
          that.pList = res.retData;
          this.cspan='选择市'
          this.cospan='选择区/县'
          this.sspan = '选择学校'
          this.cId = ''
          this.coId = ''
          this.sId = ''
          this.pflag = true
        }
      });
    },
    getCity() {
      let that = this;
      let para = {};
      para.parentId = $('.c_province span').attr("id");
      getArea(this, para).then(function (response) {
        let res = response.body;
        if (res.retCode == '0000') {
          that.cityList = res.retData;
          this.cospan='选择区/县';
          this.sspan = '选择学校';
          this.coId = '';
          this.sId = '';
          this.cflag = true
        }
      });
    },
    getCounty() {
      let that = this;
      let para = {};
      para.parentId = this.cId;
      getArea(this, para).then(function (response) {
        let res = response.body;
        if (res.retCode == '0000') {
          that.coList = res.retData;
          this.sspan = '选择学校';
          this.sId = '';
          this.coflag = true
        }
      });
    },
    showSchool() {
      let that = this;
      var param = {};
      param.provinceId = this.pId;
      param.cityId = this.cId;
      param.countyId = this.coId;
      getSchool(this, param).then(function (response) {
        let res = response.body;
        if (res.retCode == '0000') {
          that.sList = res.retData;
          this.sflag = true
        }
      });
    },
    selectProvince(tdata, event) {
      let cpara = {};
      this.pId = tdata.id
      this.pspan = tdata.name
      cpara.parentId = tdata.id
      this.getFirstCity(cpara)
      this.pflag = false
      stopBubble(event)
    },
    selectCounty(tdata, event) {
      this.coId = tdata.id;
      this.cospan = tdata.name;
      var param = {};
      param.provinceId = this.pId;
      param.cityId = this.cId;
      param.countyId = tdata.id;
      this.getFirstSchool(param);
      this.coflag = false;
      stopBubble(event)
    },
    selectCity (tdata, event) {
      let cpara = {};
      this.cId = tdata.id;
      this.cspan = tdata.name;
      cpara.parentId = tdata.id;
      this.getFirstCounty(cpara);
      this.cflag = false;
      stopBubble(event)
    },
    selectSchool (tdata, event) {
      this.sId = tdata.id
      this.sspan = tdata.schoolName
      this.sflag = false
      stopBubble(event)
    },
    getFirstCity (cpara) {
      let that = this;
      getArea(this, cpara).then(function (response) {
        let res = response.body;
        if (res.retCode == '0000') {
          if (res.retData.length > 0) {
            let id = res.retData[0].id;
            let name = res.retData[0].name;
            this.cId = id;
            this.cspan = name;
            that.getFirstCounty({'parentId': id});
          }
        }
      });
    },
    getFirstCounty (cpara) {
      let that = this;
      getArea(this, cpara).then(function (response) {
        let res = response.body;
        if (res.retCode == '0000') {
          if (res.retData.length > 0) {
            this.coId = res.retData[0].id;
            this.cospan = res.retData[0].name;
            var param = {};
            param.provinceId = this.pId;
            param.cityId = cpara.parentId;
            param.countyId = res.retData[0].id;
            that.getFirstSchool(param);
          }
        }
      });
    },
    getFirstSchool (param) {
      getSchool(this, param).then(function (response) {
        let res = response.body;
        if (res.retCode == '0000') {
          if (res.retData.length > 0) {
            this.sspan = res.retData[0].schoolName;
            this.sId = res.retData[0].id;
            $('.c_schoolEnsure').css('background', '#58C1E4');
          } else {
            $('c_sList').html("不存在学校");
          }
        }
      });
    },
    closeCreate() {
      this.showcreate = false
    },
    schoolEnsure() {
      var para = {};
      para.schoolId = this.sId;
      if(para.schoolId=="") {
        return;
      }
      let that = this
      setSchool(this,para).then(function (response) {
        let res = response.body
        if (res.retCode == '0000') {
          that.isSet = true
          that.showDefaultGrade()
        }
      })
    },
    showDefaultGrade() {
      let that = this
      getCurrentGrade(this).then(function(response) {
        let res = response.body
        if (res.retCode == '0000') {
          let index = parseInt(res.retData)
          that.gradeId = res.retData
          let k=9-index;
          let grades = document.getElementsByClassName('c_cli');
          for(var i=0;i<3;i++) {
            if(k==i) {
              grades[i].classList.add("c_selectedLi");
              grades[i].classList.remove("c_cli");
            } else {
              grades[i].classList.add("c_cli");
              grades[i].classList.remove("c_selectedLi");
            }
          }
        }
      })
    },
    showClasses(num) {
      this.classNumList = []
      for(var i=1;i<=num;i++) {
        this.classNumList.push(i+'班')
      }
      let gradeId = document.getElementsByClassName('c_selectedLi')[0].getAttribute('gradeId')
      let allC = document.getElementsByClassName('c_sImg')
      for(let j=0;j<this.createdList.length;j++) {
        if (this.createdList[j].gradeId === gradeId) {
          console.log(gradeId)
          for (let i = 0; i < allC.length; i++) {
            let ctext = allC[i].nextSibling.innerText
            let cname = this.createdList[j].classNickname
            if (ctext == cname) {
              allC[i].classList.remove('i_slcico0')
              allC[i].classList.add('i_slcico2')
            }
          }
        }
      }
    },
    getExitClass() {
      let that = this
      getClassCreated(this).then(function(response) {
        let res = response.body
        if (res.retCode == '0000') {
          that.createdList = res.retData
          that.exitClass = res.retData.length
        }
      })
    },
    selectGrade(event) {
      let grades = document.getElementsByClassName('c_tab')[0].children;
      let tar = event.target
      let gradeId = tar.getAttribute('gradeId')
      let classList = tar.classList;
//        $(".c_seCon").html("");
      for(var i=0;i<grades.length;i++) {
        if(grades[i]==tar) {
          grades[i].classList.add('c_selectedLi');
          grades[i].classList.remove('c_cli');
          this.classNumList = []
          this.showClasses(20)
        }else{
          grades[i].classList.add('c_cli')
          grades[i].classList.remove('c_selectedLi')
        }
      }
    },
    getMore() {
      this.showClasses(50);
      this.classShow = false
    },
    getLess() {
      this.showClasses(20);
      this.classShow = true
    },
    selectClass(event) {
      let len = this.selectedClass.length + this.exitClass
      if(this.exitClass>=4||len>=4) {
        return
      }else {
        var tar = event.target
        let grades = document.getElementsByClassName('c_tab')[0].children;
        var sgrade = ''
        var scname = tar.nextSibling.innerText
        for(var i=0;i<grades.length;i++) {
          let gclassList = grades[i].classList;
          if(this.contains(gclassList,'c_selectedLi')) {
            sgrade = grades[i].innerText
          }
        }
        var classList = tar.classList
        if(this.contains(classList,'i_slcico2')) {
          return
        } else if (this.contains(classList,'i_slcico0')) {
          classList.add('i_slcico1')
          classList.remove('i_slcico0')
          let sclass = {}
          sclass.classname = scname
          sclass.gcname = sgrade + scname
          this.selectedClass.push(sclass)
        } else {
          classList.add('i_slcico0')
          classList.remove('i_slcico1')
          for(let j=0;j<this.selectedClass.length;j++) {
            if(this.selectedClass[j].classname === scname) {
              this.selectedClass.splice(j,1)
            }
          }
        }
      }
    },
    removeClass(event) {
      let tar = event.target
      let gcname = tar.parentNode.innerText
      for(let j=0;j<this.selectedClass.length;j++) {
        if(this.selectedClass[j].gcname === gcname) {
          this.selectedClass.splice(j,1)
        }
      }
      let selected = document.getElementsByClassName('i_slcico1')
      for(let k=0;k<selected.length; k++) {
        let cname = selected[k].nextSibling.innerText
        if(gcname.indexOf(cname)!==-1) {
          selected[k].classList.add('i_slcico0')
          selected[k].classList.remove('i_slcico1')
        }
      }
    },
    classCreate() {
      var c_para={}
      c_para.className = []
      c_para.gradeId = document.getElementsByClassName('c_selectedLi')[0].getAttribute('gradeId')
      for(let j=0;j<this.selectedClass.length;j++) {
        c_para.className.push(this.selectedClass[j].classname)
      }
      let that = this
      createEnsure(this,c_para).then(function (response) {
        let res = response.body
        if (res.retCode == '0000') {
          that.getClass();
//            GoldAnimate(data.retGold);
          // 如果只选择一个班级，进入班级详情页面
          if(that.selectedClass.length==1) {
            var nowClassId = res.retData.indexClassId
            var headTeacherId = res.retData.headerTeacherId
            var c_grade = res.retData.className;
            window.localStorage.setItem('nowClassId', nowClassId)
            window.localStorage.setItem('headTeacherId',headTeacherId)
            window.localStorage.setItem('c_grade', c_grade)
            setTimeout(function() {
              that.$router.push('/content/teacher/classmanage/classinfo')
            },100);
          }
          that.showcreate = false
        }
      })
    }
  }
};
</script>
<style>
  @import '/static/common/css/common.css';
  .c_haveClass{width: 100%;  float: left;  background: #ecedf0;  box-sizing: border-box;  min-height: 780px;  padding-bottom: 40px;}
  .c_noClass{background: url("/static/teacher/images/classmanage/c_BgImg0.png") 0 0 repeat;}
  .c_btn{border-radius:10px;width: 190px;cursor: pointer;height: 45px;border: 0;outline: none;text-align: center;line-height: 45px;color: white;font-size:18px;}
  .c_btns{margin-right:15%;margin-bottom: 40px;float: right;margin-top:30px;}
  /*****************************班级列表**********************************/
  .c_createdList{width: 1200px; margin: 0 auto;clear: both;text-align: center;position: relative;}
  .c_createdList li{float: left;list-style-type: none;display: inline-block;width: 505px;height: 300px;margin:25px 50px;position: relative; border-radius: 10px;background: white; ;}
  .c_createdList li:nth-child(2n+1){margin-left: 20px;}
  .c_userPhoto{width: 115px;height: 115px;box-sizing: border-box;border: 1px solid #CCCCCC;overflow: hidden;border-radius: 100%;position: absolute;top: -30px;left: 25px;}
  .c_userName{width: 115px;position: absolute;top: 100px;left: 25px;text-align: center;font-size: 24px;}
  .c_grade{line-height: 110px;width: 100%;text-align: center;font-size: 24px;}
  .c_student,.c_teacher{font-size: 18px;width: 100%;text-align: center;line-height: 30px;}
  .c_inBtn{width: 150px;height: 45px;background: #65B113;border: 2px solid #65b113;line-height: 45px;text-align: center;font-size: 18px;box-sizing: border-box;border-radius: 10px;outline: none;color:white;}
  .c_inBtn:hover{background: #5da313;}
  .c_waitBtn{width: 150px;height: 45px;background: white;border: 1px solid #65B113; line-height: 45px;text-align: center;font-size: 18px;box-sizing: border-box;border-radius: 10px;outline: none;}
  .borc65{border-color: #65B113;}
  .borcCC{border-color: #CCC;}
  .mt55{margin-top:55px;}
  .c_classMsg{ padding-top: 30px; margin-left: 40px; text-align: left; height: 32px; color:#ca0d0d; line-height: 32px; background:url("/static/teacher/images/classmanage/s_msgico.png") no-repeat 0 32px; padding-left: 50px; clear: both; display: none;position: absolute;left: 310px;font-size: 20px;}
  /*****************************加入班级**********************************/
  .arrow-up{width:0;height:0;border-left:26px solid transparent;border-right:26px solid transparent;border-bottom:26px solid #fff;position:relative;top:-21px;left:770px;}
  .c_img{margin-left:330px;}
  .c_join{background: #58C1E4;}
  .c_join:hover{background:#0fa7bd;}
  .c_joinArea{width: 960px;min-height: 260px;background: #fff;box-sizing: border-box;border-radius: 10px;border: 1px solid #dfdfdf;position: absolute;right:26%;top: 230px;text-align: center;z-index: 99;  opacity:1;}
  .c_arrow{position: absolute;top: -27px;right: 135px;}
  .c_search{width: 530px;height: 60px;clear: both;margin: 0 auto; box-sizing: border-box;background: white;margin-top: 56px;border-radius: 10px;border: 1px solid #dfdfdf;}
  .c_sbtn{width: 120px;height: 60px;background: #65b113;cursor: pointer;float:right;border-radius: 0 10px 10px 0;}
  .c_sbtn:hover{background: #5da313;}
  .c_searchImg{margin: 9px 0 0 37px;}
  .c_sBox{width: 350px;height: 58px;outline: none;border: 0;font-size: 18px;padding-left: 20px;box-sizing: border-box;line-height: 60px;}
  .c_searchYes{width: 505px;height: 300px;margin: 60px auto 95px auto;clear: both;position: relative;border-radius: 10px;background: white;color: #333;border: 1px solid #dfdfdf;}
  .c_searchNo{width: 530px; height: 60px; clear: both;margin: 0 auto;line-height: 60px;color: #e60012;box-sizing: border-box;margin-left: 27px;margin-top:5px;}
  .c_userPhoto{width: 115px;height: 115px;box-sizing: border-box;border: 1px solid #CCCCCC;overflow: hidden;border-radius: 100%;position: absolute;top: -30px;left: 25px;background: #fff;}
  .c_grade{line-height: 110px;width: 100%;text-align: center;font-size: 24px;}
  .c_snum,.c_tnum{font-size: 18px;width: 100%;text-align: center;line-height: 30px;}
  .c_joinBtn{width: 150px;height: 45px;background: #65b113;color: white; border: 1px solid #65b113;display: block;margin: 50px auto 0 auto; line-height: 45px;text-align: center;font-size: 18px;box-sizing: border-box;border-radius: 10px;outline: none;position:relative;top:10px;}
  .c_joinBtn:hover{background:#5da313;}
  /*****************************创建班级**********************************/
  .c_create{background: #F9A24A;}
  .c_create:hover{background: #Fb9732;}
  .c_createArea{width: 103%; overflow: scroll;top: 0; height: 100%; position: fixed;z-index: 9999; background: black;background: rgba(0,0,0,0.5);}
  .c_delClass{height:24px;width:38px;background-position:-356px -375px;}
  .c_spread{height: 8px;width: 14px;background-position: -698px -65px;margin-top: 11px;}
  .c_stop{height:10px;width:17px;background-position:-696px -82px;;margin-top: 11px;}
  /*******选择学校**********/
  .c_selectSchool{width: 930px;min-height: 395px;box-sizing: border-box;padding: 50px 115px 0px 115px; background: white;position: relative;top:220px;left: 0;right: 0;margin: 0 auto;overflow: hidden;text-align:center;}
  .c_selectClass{min-height: 395px;box-sizing: border-box; background: white;position: relative;top:160px;left: 0;right: 0;margin: 0 auto;overflow: hidden;text-align:center;}
  .c_province,.c_city,.c_county{width: 155px;float: left;cursor: pointer;color: #333; border-radius: 5px; margin-left: 15px;height: 40px;box-sizing: border-box;padding-left: 12px; border: 1px solid #D2D2D2;position: relative;}
  .c_school{float: left;width: 325px;cursor: pointer;color: #333; border-radius: 5px; margin-left: 15px;height: 40px;box-sizing: border-box;padding-left: 12px; border: 1px solid #D2D2D2;position: relative;margin-bottom: 90px;}
  .c_sP{display:block;clear: both;width: 55px;float:left;}
  .c_schoolEnsure{background: #999999;margin:0 auto!important; clear: both;display: block;margin-top: 50px;}
  .c_areaImg{margin: 17px 5px;}
  .c_list{z-index: 999999;background:white;padding-left: 15px; box-sizing: border-box; border: 1px solid #D2D2D2;position: fixed;top:312px;border-radius: 5px;}
  .c_list li{min-width: 130px; text-align: left; box-sizing: border-box; line-height: 40px;font-size: 14px;}
  .c_list li:hover{color:#65B113}
  .c_pList li,.c_cList li,.c_coList li{float: left;}
  .c_pList{margin-left: -13px;width: 545px;}
  .c_cList{margin-left: -13px;width: 420px;}
  .c_coList{margin-left: -13px;width: 323px;}
  .c_sList{margin-left: -13px;top:382px;width: 326px;overflow: auto;height: 200px;}
  .c_ctext{font-size:14px;color:#58c1e4;padding: 2px;}
  /*******选择班级*********/
  .c_tab {float: left;width: 920px;position: relative;}
  /*.c_thirdLi{float:right;}*/
  /*.c_secondLi,.c_firstLi{float:left;}*/
  .c_cli {
    width: 178px;
    font-size: 20px;
    line-height: 50px;
    -moz-border-top-colors: none;
    -moz-border-right-colors: none;
    -moz-border-bottom-colors: none;
    -moz-border-left-colors: none;
    border-image: none;
    z-index: 4;
    top: 20px;
    border-radius: 10px 10px 0 0;
    display: inline-block;
    overflow: hidden;
    position: relative;
    top: 7px;
    float: left;
    color: #333;
  }
  .c_selectedLi{
    width:178px;font-size: 20px;
    color: #fff;
    line-height: 50px;
    -moz-border-top-colors: none;
    -moz-border-right-colors: none;
    -moz-border-bottom-colors: none;
    -moz-border-left-colors: none;
    border-image: none;
    z-index: 6;
    display: inline-block;
    border-radius: 10px 10px 0 0;
    position: relative;
    top: 1px;
    background: #65b113;
    float: left;
    font-weight: bold;
  }
  .c_tab li:last-child {margin-right: 0;}
  .c_space0{width: 174px;height: 9px;position: absolute;bottom: -9px;left: 0;border-left: 1px solid #65b113;background: #fff;}
  .c_space1{width: 176px;height: 9px;position: absolute;bottom: 0;left: -1px; }
  .c_space2{width: 176px;height: 9px;position: absolute;bottom: 0;left: -1px; }
  .c_tabCon{width: 935px;min-height: 200px;position: relative;z-index: 5;box-sizing: border-box;border: 1px solid #65b113;float: left;border-radius: 10px;margin-bottom: 40px;padding: 0 56px 0 46px;}
  .c_tabCon li{width: 60px;float: left;margin: 40px 0 0 23px;height: 30px;line-height: 30px;font-size: 16px;color: #333;position: relative;}
  .c_closeImg{position: absolute;top: 20px;right: 20px;cursor: pointer;z-index: 10;}
  .c_sImg{margin: 3px 0 0 0;cursor: pointer;}
  .c_more{height: 30px;cursor:pointer;line-height:30px;float: right;margin:15px 0 20px 0;position: relative;bottom: -15px;}
  .c_less{height: 30px;cursor:pointer;line-height:30px;float: right;margin:15px 0 20px 0;position: relative;bottom: -8px;}
  .c_m8005{margin: 8px 0 0 5px;}
  .c_up{animation: 0.3s linear 0s normal forwards 1 running change;}
  .c_seClass{width: 980px;overflow: hidden;margin: 0 auto 50px auto;}
  .c_seClass li{position: relative; width: 150px;height: 45px;margin: 45px 80px 0 -70px;font-size: 18px;border: 1px solid #CCC;box-sizing: border-box;border-radius: 10px; color: #666;line-height: 45px;text-align: center; float: left;}
  .c_delImg{float: left;position: absolute;top: -1px;right: -1px;cursor: pointer;}
  .c_createEnsure{background: #65b113;float: left; margin-right: 60px;margin-left: 280px;}
  .c_createCancel{background: #ccc;float: left;}
  .c_selectSchool input,.c_selectClass input{width: 190px;height: 45px;cursor: pointer; outline: none;border: 0;margin-bottom: 80px;line-height: 45px;text-align: center;font-size: 18px;color: #FFF;border-radius: 10px;}
  /*****************************  适应  **********************************/
  /*屏幕小于1366*/
  @media screen and (max-width:1365px){
    .c_img{margin-left:25px;width:900px;}
    .c_btn{width: 160px;font-size: 14px;}
    .c_createdList{width:900px;}
    .c_createdList li{width:355px;margin: 25px 45px;}
    .c_userPhoto{width: 85px;height: 85px;}
    .c_userName{width: 85px;font-size: 20px;}
    .c_grade{font-size: 20px;}
    .c_student,.c_teacher{font-size: 16px;}
    .c_inBtn{width: 105px;font-size: 16px;}
    .c_waitBtn{width: 105px;font-size: 16px;}
    .c_btns{margin-right: 12%;}
    /*****************************加入班级**********************************/
    .arrow-up{left:490px;top:-26px;}
    .c_joinArea{width: 680px;position: absolute;right:20%;}
    .c_search{width: 400px;}
    .c_sbtn{width: 90px;}
    .c_sBox{width: 270px;}
    .c_searchYes{width: 355px;height: 300px;}
    .c_searchNo{width: 355px; height: 60px;margin-left: 60px;}
    .c_snum,.c_tnum{font-size: 16px;}
    .c_joinBtn{width: 105px;height: 45px;}
    .c_searchImg {margin: 9px 0 0 25px;}
    /*****************************创建班级**********************************/
    .c_less i {
      margin-right: 20px;
      margin-top: 10px;
    }
    .c_more i {
      margin-right: 20px;
    }
    .c_tabCon li{margin: 40px 0 0 0;}
    /*******选择学校**********/
    .c_selectSchool{width: 680px;}
    .c_selectClass{
      width: 900px;
      padding: 80px 50px 0px 50px;
    }
    .c_province,.c_city,.c_county{width: 120px; font-size:14px;}
    .c_school{width: 275px;font-size:14px;}
    .c_sP{width: 42px;}
    .c_areaImg{margin: 17px 5px;}
    .c_list li{min-width: 80px;font-size: 12px;}
    .c_pList{width: 440px;}
    .c_cList{width: 320px;}
    .c_coList{width: 216px;}
    .c_sList{width: 275px;}
    /*******选择班级*********/
    .c_tab {width: 690px;}
    .c_cli{width:175px;font-size: 16px;}
    .c_selectedLi{width:170px;font-size: 20px;}
    .c_space0{width: 174px;}
    .c_space1{width: 176px;}
    .c_space2{width: 175px;}
    .c_tabCon{width: 768px;padding: 0 16px 0 16px;}
    .c_tabCon li{width: 73px;font-size:14px;}
    .c_closeImg{position: absolute;top: 20px;right: 20px;}
    .c_seClass{width: 800px;}
    .c_seClass li{ width: 125px;height: 40px;font-size: 16px;margin: 38px 1px 0 11px;left:-66px;}
    .c_delImg{float: left;position: absolute;top: 0;right: 0;cursor: pointer;}
    .c_createEnsure{margin-left: 170px;}
    .c_selectSchool input{width: 135px;height: 50px;font-size: 18px;}
    .c_classMsg{left: 66px;font-size: 16px;}
    .c_ClassNum{margin-left:-20px;}
  }
  /*屏幕大于1366小于1599*/
  @media screen and (min-width:1366px) and (max-width:1599px){
    .c_img{margin-left:188px;width:1000px;}
    .c_btn{width: 180px;font-size: 16px;}
    .c_createdList{width:1000px;}
    .c_createdList li{width:405px;margin: 25px 40px;}
    .c_userPhoto{width: 100px;height: 100px;}
    .c_userName{width: 100px;font-size: 22px;}
    .c_grade{font-size: 22px;}
    .c_student,.c_teacher{font-size: 18px;}
    .c_inBtn{width: 125px;font-size: 18px;}
    .c_waitBtn{width: 125px;font-size: 18px;}
    .c_btns{margin-right: 14%;}
    /*****************************加入班级**********************************/
    .arrow-up{left:565px;top:-21px;}
    .c_joinArea{width: 800px;position: absolute;right:24%;}
    .c_search{width: 500px;}
    .c_sbtn{width: 100px;}
    .c_sBox{width: 300px;}
    .c_searchYes{width: 405px;height: 300px;}
    .c_searchNo{width: 405px; height: 60px;}
    .c_snum,.c_tnum{font-size: 18px;}
    .c_joinBtn{width: 125px;height: 45px;}
    .c_searchImg {margin: 9px 0 0 30px;}
    /*****************************创建班级**********************************/
    .c_createArea{width: 93%;}
    /*******选择学校**********/
    .c_selectSchool{width: 780px;}
    .c_selectClass{
      width: 900px;
      padding: 80px 50px 0px 50px;
    }
    .c_province,.c_city,.c_county{width: 145px;font-size: 16px;}
    .c_school{width: 300px;}
    .c_sP{width: 55px;}
    .c_areaImg{margin: 17px 5px;}
    .c_list li{min-width: 100px;font-size: 14px;}
    .c_pList{width: 520px;}
    .c_cList{width: 380px;}
    .c_coList{width: 250px;}
    .c_sList{width: 300px;}
    .c_less i {
      margin-right: 20px;
      margin-top: 10px;
    }
    .c_more i {
      margin-right: 20px;
    }
    /*******选择班级*********/
    .c_tab {width: 780px;}
    .c_cli{width:175px;font-size: 18px;}
    .c_selectedLi{width:175px;font-size: 20px;margin-right: 18px;}
    .c_space0{width: 174px;}
    .c_space1{width: 176px;}
    .c_space2{width: 175px;}
    .c_tabCon{width: 780px;padding: 0 16px 0 16px;}
    .c_tabCon li{width: 73px;font-size:16px;margin: 40px 0 0 0;}
    .c_closeImg{position: absolute;top: 20px;right: 20px;}
    .c_seClass{width: 800px;}
    .c_seClass li{ width: 145px;height: 40px;font-size: 18px;margin: 38px 80px 0 -63px;}
    .c_createEnsure{margin-left: 170px;}
    .c_selectSchool input{width: 155px;height: 50px;font-size: 20px;}
    .c_classMsg{left: 190px;font-size: 18px;}
  }
  @media screen and (min-width:1600px){
    .c_less i {
      margin-top: 10px;
    }
    .c_more i{
      margin-right: 0;
    }
    .c_selectClass{
      width: 1080px;
      padding: 80px 72px 0px 72px;
    }
  }
</style>
