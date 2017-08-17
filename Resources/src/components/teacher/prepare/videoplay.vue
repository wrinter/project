<template>
  <div class="p_videoBox">
    <p class="p_videoName">{{videoName}}</p>
    <div class="p_video" v-html="playCode">
    </div>
    <div class="p_functions">
      <span class="p_pageViews">浏览量</span><span class="pageViewsNum">{{queryNum}}</span>
      <span class="ClickUp agree p_spriteImg p_Praiseico" @click="prise" id="p_prise"></span><span class="agreeNum">{{likeNum}}</span>
      <span class="enjoys p_spriteImg p_shareico" @click="StartShareEve(0)"></span><span class="nbsp">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <span id="recommend" class="p_recommend fn_recommend" @click="toRecommend">推荐</span>
      <span class="p_test">
        <router-link v-bind:to="'/content/teacher/prepare/preparetest?id='+resId" style="color:#fff;">
          预习测试
        </router-link>
      </span>
    </div>
    <div class="functions_share">
      <span class="p_pageViews">浏览量</span><span class="pageViewsNum">{{queryNum}}</span>
    </div>
    <transition name="el-fade-in" >
      <div v-if="StartClass" class="C_Shade">
        <div class="C_ComaBox">
          <i class="el-icon-close ShareClose" @click="CancelClass"></i>
          <p class="C_ComaTit">推荐班级</p>
          <ul class="C_ComaClass">
            <li
              v-for="(data, index) in ClassData"
              @click="ChoiceClass(index)"
              :class="{'C_ChoiceNot':data.flag=='yes'||data.stuNum==0,'C_Choice':data.isSelected==true}"
              :title="TitleMsg(data)">
              {{data.classFullName}}
            </li>
          </ul>
          <textarea class="C_ComSub" v-model="requireMent" placeholder="备注消息：( 100个字符以内 )" maxlength="100"></textarea>
          <!--<p class="C_ComaRemark">注：请去作业报告中查看推荐报告！</p>-->
          <p class="C_ComaBtnFb" @click="CommandAjax" :class="{'C_ComaBtnRe':Command>0}">确 定</p>
          <p class="C_ComaBtnCe" @click="CancelClass">取 消</p>
        </div>
      </div>
    </transition>
    <transition name="el-fade-in">
      <div v-show="StartShare" class="Share">
        <i class="el-icon-close ShareClose"  @click="StartShareEve(1)" ></i>
        <h1 class="ShareTitle">分享给好友</h1>
        <div class="bdsharebuttonbox" data-tag="share_1">
          <a class="bds_sqq" data-cmd="sqq"></a>
          <a class="bds_qzone" data-cmd="qzone" ></a>
          <a class="bds_tsina" data-cmd="tsina"></a>
          <a class="bds_weixin" data-cmd="weixin"></a>
        </div>
      </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
  import {UrlSearch} from '../../../common/js/request.js';
    export default {
      data() {
        return {
          videoName:'',
          queryNum:'',
          likeNum:'',
          resId:UrlSearch('id'),
          StartClass:false,
          requireMent:'',
          Command:0,
          CommandData:[],
          ClassData:'',
          IsHasClass:false,
          StartShare:false,
          prised:false,
          playCode:''
        };
      },
      mounted() {
        this.getVideo()
        this.GetClass()
        this.BaiDuConfig()
        this.AppendShare()
      },
      methods: {
        getVideo() {
          let para = {}
          para.resId = UrlSearch('id')
          this.$http.post('/web/teacher/prepare/video/play', para, {'emulateJSON': true}).then(function(response) {
            let retCode = response.body.retCode
            let retData = response.body.retData
            if(retCode === '0000') {
              this.videoName = retData.fileName
              this.queryNum = '(' + retData.queryNum + ')'
              this.likeNum = '(' + retData.likeNum + ')'
              if(retData.playCode) {
                this.playCode = retData.playCode.replace(/600/g,'100%').replace(/490/g,'580')
              }
              if(retData.islike === '1') {
                this.prised = true
                let classList = document.getElementById('p_prise').classList
                classList.add('p_yetPraiseico')
                classList.remove('p_Praiseico')
              }
            }
          })
        },
        BaiDuConfig () {
          window._bd_share_config = {
            common: {
              bdDesc: '欢迎使用五好导学'
            },
            share: [{
              'bdSize': 80
            }],
            image: [{
              viewSize: '16',
              viewList: ['sqq', 'qzone', 'tsina', 'tqq', 'weixin']
            }]
          }
        },
        AppendShare () {
          this.BaiduPath = '../../static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5)
          let BaiDuScr = document.createElement('script')
          BaiDuScr.src = this.BaiduPath
          let head = document.getElementsByTagName('head')[0]
          head.appendChild(BaiDuScr)
        },
        toRecommend() {
          if (this.IsHasClass) {
            this.StartClass = true
          } else {
            this.CommandMsg('失败', '您还没有班级', 'error')
          }
        },
        StartShareEve (rule) {
          if (rule === 0) {
            this.StartShare = true
          } else {
            this.StartShare = false
          }
        },
        GetClass () {
          let Subdata = {}
          Subdata.resId = this.resId
          this.$http.post('/web/common/res/recommend/class', Subdata, {'emulateJSON': true}).then((response) => {
            let ReceiveData = response.body.retData
            if (ReceiveData.length === 0) {
              this.IsHasClass = false
            } else {
              this.IsHasClass = true
              for (let i = 0; i < ReceiveData.length; i++) {
                ReceiveData[i].isSelected = false
              }
              this.ClassData = ReceiveData
            }
          })
        },
        ChoiceClass (index) {
          if (this.ClassData[index].flag === 'no' && this.ClassData[index].stuNum > 0) {
            this.ClassData[index].isSelected = !this.ClassData[index].isSelected
            this.ResetCommandData(this.ClassData)
          }
        },
        ResetCommandData (data) {
          this.CommandData = []
          for (let i = 0; i < data.length; i++) {
            let obj = {}
            obj = data[i].classId
            if (data[i].isSelected) {
              this.CommandData.push(obj)
            }
          }
          this.Command = this.CommandData.length
        },
        TitleMsg (data) {
          if (data.stuNum === 0) {
            return '该班级暂无学生'
          } else if (data.flag === 'yes') {
            return '该班级已推荐'
          }
        },
        prise(e) {
          if(this.prised) {
            return
          } else {
            let para = {}
            para.resId = this.resId
            this.$http.post('/web/teacher/prepare/like', para, {'emulateJSON': true}).then(function(response) {
              let retCode = response.body.retCode
              if(retCode === '0000') {
                this.likeNum++
                this.prised = true
                e.target.classList.add('p_yetPraiseico')
                e.target.classList.remove('p_Praiseico')
              }
            })
          }
        },
        CancelClass () {
          this.StartClass = false
          this.Command = 0
          this.CommandData = []
          this.DefultSlecet(this.ClassData)
        },
        CommandAjax () {
          if (this.Command > 0) {
            let SubData = {}
            SubData.classIdList = this.CommandData
            SubData.resId = UrlSearch('id')
            SubData.requireMent = this.requireMent
            SubData.resType = '300'
            this.$http.post('/web/common/res/recommend', SubData).then((response) => {
              let Code = response.body.retCode
              if (Code === '0000') {
                this.CommandMsg('成功', '推荐成功', 'success')
                this.GetClass(UrlSearch('id'))
                this.Command = 0
              } else {
                this.CommandMsg('失败', response.body.retMsg, 'error')
              }
            })
          }
        },
        CommandMsg (tit, msg, type) {
          this.$notify({
            title: tit,
            message: msg,
            type: type
          })
        }
      }
    };
</script>
<style>
  @import '../../../../static/common/css/common.css';
  .videoIntroduce{  margin-top:20px;  height:auto;width:100%;  color:#333;;border-radius: 10px;background: #fff;  }
  .videoIntroduce p{padding:0 2em;}
  .p_videoBox {width: 100%;;margin: 0 auto;  margin-top: 10px;  margin-bottom: 40px;  }
  .p_videoName { height: 60px;  line-height: 60px;  color: #333;  font-size: 18px;  }
  .p_video { width: 100%; height: 580px;  background: #000;  }
  .p_video img {  width: 100%;  height: 100%;  }
  .p_functions,.functions_share {background: white; width: 100%; height: 66px;  line-height: 66px;  color: #666;  position: relative;   ;  border-radius:0px 0px 10px 10px;  }
  .functions_share {display: none;}
  .p_functions .p_pageViews,.functions_share .p_pageViews {  padding: 3px 0 3px 20px;  }
  .p_functions .pageViewsNum {  padding: 3px 20px 3px 0;  border-right: 1px solid #ccc;  }
  .p_functions .ClickUp {  padding: 3px 16px 3px 10px;  margin-left: 10px;  }
  .p_functions .agreeNum {  padding: 3px 20px 3px 0;  border-right: 1px solid #ccc;  }
  .p_functions .enjoys {  padding: 4px 8px 4px 16px;  margin-left: 16px;  cursor: pointer}
  .p_functions .nbsp {  padding: 3px 8px 3px 0;  border-right: 1px solid #ccc;  }
  .p_functions .p_recommend {cursor: pointer; border-radius: 10px;  padding: 10px 57px;  background: #f9a24a;  margin-left: 30px;  color: #fff;  font-size: 18px; }
  .p_functions .p_recommend:hover{background: #fb9732;}
  .p_functions .p_test {  position: absolute;  right: 10px;  top: 10px;  background: #58c1e4;  border: 1px solid #58c1e4;  color: #fff;  border-radius: 10px;  font-size: 18px;  line-height: 24px; padding: 10px 0; }
  .p_test a{padding: 10px 38px;}
  .p_functions .p_test:hover{background: #0fa7db;}
  .videoIntroduce{margin-top:20px;  height:auto;  width:100%;  color:#333;  ;  border-radius: 10px;  background: #fff;}
  .clearfix:after{visibility:hidden;display:block;font-size:0;content: " ";clear:both;height:0;}
  .clearfix{*zoom:1;}
  .C_ComaBtnRe{float:left;width: 220px;height: 45px;margin: 0 26px;cursor: pointer; text-align: center;line-height: 45px;font-size: 18px;border-radius: 10px; color: white;background: #65b113;}
  @media screen and (max-width: 1366px) {
    .p_videoBox {  width: 900px;  }
    .exercise_ErrorUrl .in{width: 420px;height: 260px;margin-top: -130px;margin-left: -210px;}
    .exercise_ErrorUrl .in .btn a{font-size: 14px; line-height: 32px;}
  }
  @media screen and (min-width: 1366px) {
    .p_videoBox {  width: 1000px;  }
    .exercise_ErrorUrl .in{width: 560px;height: 310px;margin-top: -155px;margin-left: -280px;}
    .exercise_ErrorUrl .in .btn a{font-size: 16px; line-height: 40px;}
  }
  @media screen and (min-width: 1600px) {
    .p_videoBox {  width: 1200px; }
    .exercise_ErrorUrl .in{width: 560px;height: 310px;margin-top: -155px;margin-left: -280px;}
    .exercise_ErrorUrl .in .btn a{font-size: 16px; line-height: 40px;}
  }
  .exercise_ErrorUrl{position: absolute;top: 0;left: 0;bottom: 0;z-index:1000;display: none;width: 100%;background: rgba(0,0,0,0.3);height: 1076px;}
  .exercise_ErrorUrl .in{position: absolute;top: 50%;left: 50%;z-index: 1010;overflow: hidden;border-radius: 8px;background: #fff;}
  .exercise_ErrorUrl .in > img{width: 100%;}
  .exercise_ErrorUrl .in .close{position: absolute;top: 0;right: 30px;display: block;width: 34px;height: 38px;overflow: hidden;text-indent: -10em;border-radius: 0 0 17px 17px;background: #f96672 url("/static/teacher/images/homework/exercise_ErrorUrl_btn.png") no-repeat 0 0;cursor: pointer;}
  .exercise_ErrorUrl .in .close:hover{background-color: #f05865;}
  .exercise_ErrorUrl .in .close:active{background-color: #e44855;}
  .exercise_ErrorUrl .in .btn{width: 100%;padding: 18px 0;}
  .exercise_ErrorUrl .in .btn a{float: left;display: block;width: 27%;font-size: 18px;line-height: 46px;text-align: center;border-radius: 8px;background: #8ed6ee;color: #fff;}
  .exercise_ErrorUrl .in .btn a{margin-left: 5%;}
  .exercise_ErrorUrl .in .btn a:first-child{margin-left: 20%;}
  .exercise_ErrorUrl .in .btn a:hover{background: #80cbe4;}
  .exercise_ErrorUrl .in .btn a:hover{background: #6abad4;}
  /*lichao修改*/
  .c_RefBtn{
    background: #ccc;
  }
  .c_RefBtn:hover{
    background: #65B113;
  }
  /*subo修改*/
  #c_RefBtn0{background: #ccc;}
  .p_functions .enjoys:hover{
    background-position:-32px 0;
  }
  .on{
    color:#65b113;
  }
  .paperBase .p1,.paperTest .p1{
    font-family: Microsoft YaHei,sans-serif,Arial;
  }
  /*百度分享*/
  .Share{border: 1px solid #ccc; position: fixed; z-index: 10; top: 0;left: 0;right: 0;bottom: 0;margin:  auto;width: 600px;height: 220px;padding: 20px;background: white;;border-radius: 10px;}
  .ShareTitle{width: 300px;font-size: 24px; height: 80px;line-height: 35px;text-align: left;float: left;}
  .ShareClose{position: absolute;right: 25px;top: 25px;cursor: pointer;color: #333;font-size: 20px;}
  .C_Command{float: left;margin-top: 10px;border-radius: 10px; margin-left: 20px;width: 150px;height: 40px;background: #f9a24a;font-size: 18px;color: white;text-align: center;line-height: 40px;cursor: pointer;}
  .C_CommandNo{float: left;margin-top: 10px;border-radius: 10px; margin-left: 20px;width: 150px;height: 40px;;font-size: 18px; color: white;background: #ccc;text-align: center;line-height: 40px;cursor: not-allowed;}
  .C_Shade{width: 100%;background: rgba(0,0,0,0.5);position: fixed;top: 0;left: 0; height: 100%;z-index: 10;}
  .C_ComaBox{width: 615px;background: white;box-sizing: border-box;padding: 0 35px; height: 465px;z-index: 10;border-radius: 10px;position: absolute; top: 0;left: 0;right: 0;bottom: 0;margin:  auto;}
  .C_ComaTit{float: left;width: 100%;line-height: 60px;font-size: 24px;color:#65b113;text-align: center;height: 75px;}
  .C_ComaClass{float: left;width: 100%;height: 100px;overflow-y:auto;overflow-x: hidden;margin-bottom: 30px;}
  .C_ComaClass>li{float: left;width: 150px;height: 40px;cursor: pointer; line-height: 40px;text-align: center ;color: #666;box-sizing:border-box;font-size: 16px;border: 1px solid #ccc;border-radius: 10px;margin-top: 20px;margin-right: 30px;}
  .C_ComaClass>li:nth-child(-n+3){margin-top: 0;}
  .C_ComaClass>li:hover{background:#f9a24a;color: white;border: 0; }
  .C_ComaClass>.C_Choice{background:#f9a24a;color: white;border: 0; }
  .C_ComaClass>.C_ChoiceNot{background:#ccc!important;color: white;cursor: not-allowed;border: 0;  }
  .C_ComSub{float: left;font-size: 16px;color: #666;font-family: "Microsoft YaHei"; width: 100%;resize: none;box-sizing: border-box;border: 1px solid #ccc;height: 135px;padding: 15px;outline: none;border-radius: 10px;margin-bottom: 15px;}
  .C_ComaRemark{float: left;width: 100%;height: 45px;line-height: 45px;text-align: left;font-size: 16px;color: #ca0d0d;}
  .C_ComaBtnFb{float:left;width: 220px;height: 45px;margin: 0 26px;cursor: not-allowed; text-align: center;line-height: 45px;font-size: 18px;border-radius: 10px; color: white;background: #ccc;}
  .C_ComaBtnRe{float:left;width: 220px;height: 45px;margin: 0 26px;cursor: pointer; text-align: center;line-height: 45px;font-size: 18px;border-radius: 10px; color: white;background: #65b113;}
  .C_ComaBtnCe{float:left;width: 220px;height: 45px;margin: 0 26px;cursor: pointer; text-align: center;line-height: 45px;font-size: 18px;border-radius: 10px; color: white;background: #ccc;}

</style>
