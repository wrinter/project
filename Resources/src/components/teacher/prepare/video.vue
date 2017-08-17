<template>
  <div class="Com_Main">
    <div class="video_main">
      <div class="video_knowledge">
        <v-section @ListenChild="RecieveChild"></v-section>
      </div>
      <div class="video_box">
        <div class="video_part" v-for="temp in videoList">
          <div class="video_title">
            <img src="../../../../static/teacher/images/prepare/vico.png" alt="" class="video_src">
            <p class="video_tName fl" :id="temp.id">{{temp.title}}</p>
          </div>
          <i class="p_spriteImg p_leftico p_left fl mt80 mb80" style="display: none"></i>
          <i class="p_spriteImg p_rightico  p_right fr mt80 mb80" style="display: none"></i>
          <div class="v_listBox">
            <ul class="v_list" v-if="temp.list.length>0">
            <li v-for="item in temp.list" @mouseenter="enter" @mouseleave="leave">
              <router-link v-bind:to="'/content/teacher/prepare/videoplay?id='+item.resId+'&categoryId='+temp.id">
               <div class="video_imgBox">
                 <img :src="item.thumbnail">
                 <p class="video_playico dino"><img class="" src="/static/teacher/images/prepare/video_pre.png" alt=""></p>
                 <p class="videoName ">{{item.resName}}</p>
                </div>
              </router-link>
            </li>
          </ul>
            <div class="p_nodata" v-else>
              <img class="noData" src="../../../../static/common/images/no.png">
            </div>
          </div>
          <div class="prepareVideoLi prepareAddTeacher"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import section from '../../common/section'
  import {getCategory} from '../../../service/teacher/prepare.js'
  export default {
    data () {
      return {
        videoList:[],
        categoryList:[],
        ThisSectionId:'',
        menuId:''
      };
    },
    mounted () {
      this.getCategory()
    },
    methods: {
      RecieveChild (Id) {
        this.ThisSectionId = Id
        this.getVideoList()
      },
      getCategory () {
        this.menuId = window.localStorage.getItem('menuid')
        let para = {}
        para.menuId = this.menuId
//        para.menuId = '5d25e728a59e11e680f576304dec7eb7'
         this.$http.post('/web/teacher/prepare/category', para, {'emulateJSON': true}).then(function (response) {
          if (response.body.retCode === '0000') {
            this.categoryList = response.body.retData
            for (let i=0; i < this.categoryList.length; i++) {
              let video = {}
              video.id = this.categoryList[i].id
              video.title = this.categoryList[i].title
              video.list = {}
              this.videoList.push(video)
            }
          }
        })
      },
      getVideoList () {
        for (let i=0; i < this.videoList.length; i++) {
          let para = {}
          para.categoryId = this.videoList[i].id
          para.knowledgeList = this.ThisSectionId
          this.$http.post('/web/teacher/prepare/video/list', para, {'emulateJSON': true}).then(function (response) {
            if (response.body.retCode === '0000') {
              this.videoList[i].list = response.body.retData
            }
          })
        }
      },
      enter (e) {
        console.log(e.target)
        let classList = e.target.children[0].children[0].children[1].classList
        classList.remove('dino')
      },
      leave (e) {
        let classList = e.target.children[0].children[0].children[1].classList
        classList.add('dino')
      }
    },
    components: {
      'v-section': section
    }
  };
</script>
<style>
  .video_main{
    width:100%;
    float: left;
    background: #ecedf0;
    box-sizing: border-box;
    min-height: 780px;
    padding-bottom: 40px;
  }
  .video_knowledge{
    padding: 30px;
    border-radius: 10px 10px 0 0;
    min-height: 100px;
    margin: 40px auto 0 auto;
    overflow: hidden;
    text-align: center;
    box-sizing: border-box;
    background: white;
  }
  .video_box {
    height: auto;
    min-height: 608px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 10px;
    border-radius: 0 0 10px 10px;
    background: white;
  }
  .prepareVideo li {
    float: left;
    padding: 14px;
  }
  .prepareVideo .prepareVideoLi {
    height: 226px;
    width: 370px;
    position: relative;
  }
  .prepareVideo .prepareVideoLi img {
    width: 100%;
    height: 100%;
  }
  .prepareVideo .prepareVideoLi .videoName {
    background: #000;
    color: #fff;
    height: 30px;
    width: 370px;
    background: rgba(0,0,0,0.7);
    line-height: 30px;
    position: absolute;
    left: 0;
    bottom: 15px;
    text-align: center;

  }
  p {
    margin: 0;
    padding: 0;
  }
  .video_part {
    width: 100%;
    height: auto;
    overflow: hidden;
    position: relative;
  }
  .video_part li {
    height: 100%;
    float: left;
    position: relative;
    margin: 15px 20px 0 0;
  }
  .video_part .videoName {
    background: #000;
    background: rgba(0,0,0,0.7);
    color: #fff;
    height: 30px;
    width: 100%;
    line-height: 30px;
    position: absolute;
    z-index: 1111;
    left: 0;
    bottom: 0;
    text-align: center;
    box-sizing: border-box;
  }
  .video_part .video_imgBox {
    height: 100%;
    /*margin: 10px 0;*/
    width: 100%;
    box-sizing: border-box;
    position: relative;
    float: left;;
    overflow: hidden;
  }
  .video_imgBox img {
    width: 100%;
    height: 100%;
  }
  .video_src {
    width: 22px !important;
    height: 21px !important;
    float: left;
    margin-top: 3px;
    margin-right: 6px;
  }
  .video_title {
    width: 100%;
    height: 30px;
    float: left;;
    line-height: 30px;
    border-bottom: 1px solid #ccc;
    overflow: hidden;
  }
  .video_tName {
    width: 85%;
    height: 30px;
    float: left;;
    line-height: 30px;
    margin-left: 5px;
    font-size: 18px;
    color: #333;
  }
  .v_listBox {
    position: relative;
    overflow: hidden;
    height: 230px;
    width: 100%;
    margin:auto;
  }
  .v_list {
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  .mb80 {
    margin-bottom: 80px !important;
  }
  .mt80 {
    margin-top: 80px !important;
  }
  /*     老师定位    */
  .prepareAddTeacher {
    position: absolute;
    left: 418px;
    top: 40px;
  }
  .prepareAddTeacher .t_photoAndName #t_photo {
    width: 200px;
  }
  .prepareAddTeacher .t_photoAndName {
    width: 200px;
    height: 200px;
    border-radius: 100%;
    overflow: hidden;
    position: relative;
    z-index: 1111;
  }
  .prepareAddTeacher .t_photoAndName .teacherName {
    background: #000;
    background: rgba(0,0,0,0.7);
    color: #fff;
    height: 30px;
    width: 100%;
    line-height: 30px;
    position: absolute;
    z-index: 1111;
    left: 0;
    bottom: 0px;
    text-align: center;
  }
  .prepareAddTeacher .teacherSynopsis {
    width: 550px;
    height: 150px;
    position: absolute;
    left: 150px;
    top: 30px;
    border-radius: 10px;

    background-color: #fff;
    color: #333;
    text-indent: 2em;
    line-height: 30px;
    padding-left: 50px;
    padding-right: 20px;
  }

  .teacherSynopsis div {
    margin-top: 6%;
  }
  .v_list{width: 100%;text-align: center;margin-left: 15px;}
  @media screen and (max-width: 1366px) {
    .video_knowledge,.video_box{width:900px;}
    .video_part li {
      height: 210px;
      width:250px;
    }
    .prepareAddTeacher .teacherSynopsis{width: 346px;}
    .prepareAddTeacher {
      left: 315px;
    }
    .p_loadtexttitle li div {
      width: 86%;
    }

  }

  @media screen and (min-width: 1366px) {
    .video_knowledge,.video_box{width:1000px;}
    .video_part li {
      height: 210px;
      width:290px;
    }
    .prepareAddTeacher .teacherSynopsis{width: 412px;}
    .prepareAddTeacher {
      left: 348px;
    }
    .p_loadtexttitle li div {
      width: 86%;
    }
  }

  @media screen and (min-width: 1600px) {
    .video_knowledge,.video_box{width:1200px;}
    .video_part li {
      height: 210px;
      width:330px;
    }
    .prepareAddTeacher .teacherSynopsis{width: 543px;}
    .prepareAddTeacher {
      left: 418px;
    }
    .p_loadtexttitle li div {
      width: 89%;
    }
  }
  .noImg {
    height: 250px;
    margin: 0 auto;
  }
  .v_listBox{min-height: 240px;}
  /*科目，章，节*/
  .p_loadtexttitle {
    width: 100%;
    font-size: 18px!important;
    float: left;
    background-color: #fff;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    color: #666;
  }
  .p_loadtexttitle label {
    float: left;
    text-align: left;
    width: 70px;
  }
  .p_loadtexttitle li {
    line-height: 31px;
    float: left;
    width: 100%;
    padding-bottom: 7px;
  }
  .p_loadtexttitle li:last-child{padding-bottom: 0;}
  .p_loadtexttitle li div {
    height: auto;
    float: left;
  }
  .change {
    color: #58c1e4;
  }
  .p_loadtexttitle li div span:hover{color: #58c1e4;}
  .p_left {
    position: absolute;
    z-index: 10;
    width: 30px;
    height:30px;
    cursor: pointer;
    left: 0px;
  }
  .p_right {
    position: absolute;
    z-index: 10;
    width: 30px;
    height:30px;
    cursor: pointer;
    right: 0px;
  }
  .fs18 {
    font-size: 18px;
    padding-left: 1px;
  }
  .video_playico{width: 100%;height: 100%;background: black;background: rgba(0,0,0,0.2); position: absolute;bottom: 0;top: 0;right: 0;left: 0;margin: auto;}
  .video_playico>img{width: 60px;height: 60px; position: absolute;bottom: 0;top: 0;right: 0;left: 0;margin: auto;}
  .c_Kownledge{width: 1200px;padding:30px;border-radius: 10px;min-height: 100px; margin: 20px auto;overflow: hidden;text-align: center;box-sizing: border-box;background: white;  }
  .Kolaimg{width: 200px;}
  .c_Directory{float: left;width: 100%;text-align: left;font-size: 16px;}
  .FirstName,.c_DirectoryList li{float: left;line-height: 35px;height: 35px;color: #333; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .c_DirectoryList li{cursor: pointer;padding:0 30px;}
  .FirstName{width: 70px;}
  .c_DirectoryList{float: left;}
  @media screen and (max-width:1366px){
    .c_Kownledge{width: 900px;}
    .c_DirectoryList{width: 770px;}
  }
  @media screen and (min-width:1366px){
    .c_Kownledge{width: 1000px;}
    .c_DirectoryList{width: 865px;}
  }
  @media screen and (min-width:1600px){
    .c_Kownledge{width: 1200px;}
    .c_DirectoryList{width: 1060px;}
  }
  .p_loadtexttitle li div span,.p_loadtexttitle label  {
    float: left;
    cursor: pointer;
    text-align: left;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .p_loadtexttitle{width: 100%; padding:30px;min-height: 100px;float: left;box-sizing: border-box; overflow: hidden;text-align: center;background: white; ; }
  .Video_Main{margin:  40px auto 0 auto;border-radius:10px ;overflow: hidden;background: white;}
  .Com_Main{padding: 0;}
  @media screen and (max-width:1366px){
    .FirstName,.p_loadtexttitle li div span,.p_loadtexttitle label {font-size: 14px;}
    .p_loadtexttitle li div span{width: 100px;}
    .Video_Main{width: 900px;}
  }
  @media screen and (min-width:1366px){
    .FirstName, .p_loadtexttitle li div span,.p_loadtexttitle label {font-size: 16px;}
    .p_loadtexttitle li div span {width: 110px;}
    .Video_Main{width: 1000px;}
  }
  @media screen and (min-width:1600px){
    .FirstName,.p_loadtexttitle li div span,.p_loadtexttitle label {font-size: 18px;}
    .p_loadtexttitle li div span{width: 120px;}
    .Video_Main{width: 1200px;}
  }
  .noData{
    height: 250px;
    max-width: 100%;
  }
  .p_nodata{
    width:100%;
    text-align: center;
  }
</style>
