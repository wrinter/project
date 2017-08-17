<template>
  <div>
    <div class="First_Nav">
      <div class="First_NavBox">
        <img src="/static/images/login/logo.png" alt="" class="First_Logo">
        <router-link v-bind:to="{path:'/login', query:{AppDoload:true}}" class="First_Dowload">APP下载</router-link>
      </div>
    </div>
    <div class="r_MainBox">
      <div class="r_FoundMain " id="Find">
        <div class="r_Title">
          <p class="r_Tixt">找回密码</p>
        </div>
        <div class="r_LoadMain">
          <p class="r_LoadTxtNow" id="r_LoadTxt1">1</p>
          <div class="r_LoadBar">
            <div class="r_Bar" id="r_Bar0"></div>
          </div>
          <p class="r_LoadTxt" id="r_LoadTxt2">2</p>
          <div class="r_LoadBar">
            <div class="r_Bar" id="r_Bar1"></div>
          </div>
          <p class="r_LoadTxt" id="r_LoadTxt3">3</p>
        </div>
        <div class="r_LoadTxtBox">
          <p id="r_StepTxt1" class="LoadNow">账户信息</p>
          <p id="r_StepTxt2">安全验证</p>
          <p id="r_StepTxt3">重新设置密码</p>
        </div>
        <div class="r_StepBox " id="Find1">
          <div class="r_OneBox">
            <p class="r_ModelTxt">账号<span class="r_ModelTxt0">请输入手机号</span></p>
            <input class="r_ModelInput" maxlength="11" id="Phone" type="text" v-model="mobile" @blur="PhoneOnblur()">
          </div>
          <!--图形验证码-->
          <div class="r_OtherBox1 mt5">
            <div class="r_ModelTxt">验证码</div>
            <input class="r_CodeInput" maxlength="4" id="Code" type="text">
            <div class="r_CodeBox"><img :src="capcha" alt="" id="CodeImg"></div>
            <p class="fs14 fl r_OtherCode">
              <span class="fl unline">看不清?</span>
              <span class="fl fs14 fc58 cup unline" id="ChangeCode" @click="GetCaptcha()">换一个</span>
            </p>
            <p class="r_ModelError" id="CodeError">{{error1}}</p>
          </div>
          <p class="r_NextBtn" id="Step1" @click="goStepTwo()">下一步</p>
        </div>
        <div class="r_StepBox dino" id="Find2">
          <div class="r_OneBox">
            <p class="r_UserPhoneTxt">手机</p>
            <div class="r_UserPhoneBox"><span id="Phone0">133</span>****<span id="Phone1">6212</span></div>
          </div>
          <!--短信验证码-->
          <div class="r_OtherBox">
            <div class="r_ModelTxt">短信验证码</div>
            <input class="r_MsgInput" maxlength="6" id="MsgCode" type="text">
            <div class="r_GetMsg">
              <span class="MsgBtnTxt" id="GetMsgBtn" @click="GetMessage()">获取短信验证码</span>
              <div id="DisGetMsg" class="dino"><span id="GetMsgSec">60</span>s之后重新发送</div>
            </div>
            <p class="r_ModelError" id="MsgError">{{error2}}</p>
          </div>
          <p class="r_NextBtn" id="Step2" @click="goStepThree()">下一步</p>
        </div>
        <div class="r_StepBox dino" id="Find3">
          <!--新密码-->
          <div class="r_OneBox">
            <p class="r_ModelTxt">输入新密码</p>
            <input class="r_ModelInput" maxlength="16" id="Pass0" type="password" @blur="checkPass()">
            <p class="r_ModelHint">请输入6-16位密码,由数字和字母、特殊字符组成。</p>
            <div class="RankBox">
              <span class="RankTxt">安全程度：</span>
              <p id="Rank0">弱</p>
              <p id="Rank1">中</p>
              <p id="Rank2">强</p>
            </div>
          </div>
          <!--确认密码-->
          <div class="r_OtherBox mt0">
            <p class="r_ModelTxt">确认密码</p>
            <input class="r_ModelInput" maxlength="16" id="Pass1" type="password" @blur="CheckPassSame()">
            <p class="r_ModelError" id="PassError1">{{error3}}</p>
          </div>
          <p class="r_NextBtn0" id="Step3" @click="goStepFour()">下一步</p>
        </div>
      </div>
      <div class="r_FoundMain r_FoundMain0 dino " id="Find4">
        <div class="r_Title pl95">
          <p class="r_Tixt">找回密码</p>
        </div>
        <p class="r_ImgBox"><img src="/static/images/login/fd.png" alt=""></p>
        <p class="r_DoneTxt0">密码修改成功！</p>
        <p class="r_DoneTxt1">请使用新密码登录</p>
        <!--<a href="../../index.html"></a>-->
        <p class="r_NextBtn r_LoginBtn" id="GoToIndex">立即登录</p>
      </div>
    </div>
    <div class="c_Dissolve dino" id="c_ErrorMsg"></div>
    <div class="FourFooter">Copyright ©2017 山东百川图书有限公司 All Rights Reserved. 鲁ICP备16038439号-2</div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {getCaptcha,isExist,forgetPwd,getMesg,checkMesg,updatePass} from '../../../service/login/login.js';
  import {Disappear} from '../../../common/js/common.js';
  import $ from 'jquery';
  import md5 from 'js-md5';
  export default {
    data() {
      return {
        capcha: '',
        mobile: '',
        phone: true,
        error1:'',
        error2:'',
        error3:''
      };
    },
    mounted() {
      this.GetCaptcha();
      this.PassRank();
    },
    methods: {
      goDownload() {
        this.$router.replace({path: '/login', params: {AppDoload: true}});
      },
      GetCaptcha() {
        let that = this;
        getCaptcha(this).then(function (response) {
          let res = response.body;
          that.capcha = res.retData;
        });
      },
      ErrorReset() {
        $('#Phone').bind('click mousedown', function () {
          $('#PhoneError').html('');
        });
        $('#Code').bind('click mousedown', function () {
          $('#CodeError').html('');
        });
        $('#MsgCode').bind('click mousedown', function () {
          $('#MsgError').html('');
        });
        $('#Pass0').bind('click mousedown', function () {
          $('#PassError0').html('');
        });
        $('#Pass1').bind('click mousedown', function () {
          $('#PassError1').html('');
        });
      },
      PhoneOnblur() {
        let that = this;
        var pat = /^(13|14|19|15|18|17)[0-9]{9}$/;//手机号格式正则表达式
        if ($('#Phone').val() != '') {
          if (pat.test($('#Phone').val()) == false) {
            $('#CodeError').html('手机号格式错误');
            this.phone = false;
          }
          else {
            $('#CodeError').html('');
            let subData = {};
            subData.mobile = $('#Phone').val();
            isExist(that, subData).then(function (response) {
              let res = response.body;
              if (res.retCode !== '0000') {
                $('#CodeError').html('用户不存在');
                this.phone = false;
              } else {
                this.phone = true;
              }
            });
          }
        }
      },
      goStepTwo() {
        if ($('#Phone').val() == '') {
          $('#CodeError').html('请输入手机号');
          return;
        } else {
          if (!this.phone) {
            this.PhoneOnblur();
            if (!this.phone) {
              return;
            }
          }
        }
        if ($('#Code').val() == '') {
          $('#CodeError').html('请输入验证码');
        } else {
          this.CheckPhoneCode();
        }
      },
      CheckPhoneCode() {
        let that = this;
        let subData = {};
        subData.imageCaptcha = $('#Code').val();
        subData.mobile = $('#Phone').val();
        forgetPwd(this, subData).then(function (response) {
          let res = response.body;
          var codenum = parseInt(res.retCode.substr(0, 1));
          var Code = res.retCode;
          if (codenum == 0) {
            that.SucessStep2();
          } else if (Code == '2203' || Code == 2203) {
            that.GetCaptcha();
            $('#CodeError').html('验证码错误');
          } else if (Code == '2202' || Code == 2202) {
            $('#CodeError').html('手机号格式错误');
            that.GetCaptcha();
          } else {
            that.GetCaptcha();
          }
        });
      },
      SucessStep2() {
        $('#r_Bar0').animate({'left': '0px'}, 250);
        $('#r_LoadTxt2').removeClass().addClass('r_LoadTxtNow');
        $('#r_StepTxt2').removeClass().addClass('LoadNow');
        $('#Find1').css('display', 'none');
        $('#Find2').fadeIn(150);
        var mobile = $('#Phone').val();//手机号
        $('#Phone0').html(parseInt(mobile.substr(0, 3)));//手机号前三位
        $('#Phone1').html(mobile.substr(7, 4).toString());//手机号后四位
      },
      BtnWaitTime(Btn, TimeMsg, SecBox) {
        $(TimeMsg).css("display", "block");
        $(Btn).css("display", "none").html('获取短信验证码');
        var Timer = null;
        if (Timer) {
          clearInterval(Timer);
        }
        var Sec = 60;
        $(SecBox).html(60);
        Timer = setInterval(function () {
          Sec--;
          $(SecBox).html(Sec);
          if (Sec == 0) {
            clearInterval(Timer);
            $(TimeMsg).css("display", "none");
            $(Btn).css("display", "block").html('重新获取验证码');
          }
        }, 1000);
      },
      GetMessage() {
        this.BtnWaitTime('#GetMsgBtn', '#DisGetMsg', '#GetMsgSec');//首先执行时间
        var SubData = {};
        SubData.mobile = $('#Phone').val();
        getMesg(this, SubData).then(function (response) {
        });
      },
      goStepThree() {
        let that = this;
        if ($('#MsgCode').val() == '') {
          $('#MsgError').html('请输入验证码');
        } else {
          var subData = {};
          subData.captcha = $('#MsgCode').val();
          checkMesg(this, subData).then(function (response) {
            let res = response.body;
            if (res.retCode == '0000') {
              that.SucessStep3();
            } else {
              $('#MsgError').html(res.retMsg);
            }
          });
        }
      },
      SucessStep3() {
        $('#r_Bar1').animate({'left': '0px'}, 250);
        $('#r_LoadTxt3').removeClass().addClass('r_LoadTxtNow');
        $('#r_StepTxt3').removeClass().addClass('LoadNow');
        $('#Find2').css('display', 'none');
        $('#Find3').fadeIn(150);
      },
      PassRank() {
        $('#Pass0').keyup(function () {
          var strongRegex = new RegExp("^(?=.{8,})((?=.*[a-z])(?=.*[0-9])(?=.*\\W)|(?=.*[A-Z])(?=.*[0-9])(?=.*\\W)).*$", "g");
          var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
          var enoughRegex = new RegExp("(?=.{6,}).*", "g");
          if (!enoughRegex.test($(this).val())) {
            $('#Rank0').removeClass();
            $('#Rank1').removeClass();
            $('#Rank2').removeClass();
            //密码小于六位的时候，密码强度图片都为灰色 ThisRank
          }
          else if (strongRegex.test($(this).val())) {
            $('#Rank0').removeClass().addClass('ThisRank');
            $('#Rank1').removeClass().addClass('ThisRank');
            $('#Rank2').removeClass().addClass('ThisRank');
            //密码为八位及以上并且字母数字特殊字符三项都包括,强度最强
          }
          else if (mediumRegex.test($(this).val())) {
            $('#Rank0').removeClass().addClass('ThisRank');
            $('#Rank1').removeClass().addClass('ThisRank');
            $('#Rank2').removeClass();
            //密码为七位及以上并且字母、数字、特殊字符三项中有两项，强度是中等
          }
          else {
            $('#Rank0').removeClass().addClass('ThisRank');
            $('#Rank1').removeClass();
            $('#Rank2').removeClass();
            //如果密码为6为及以下，就算字母、数字、特殊字符三项都包括，强度也是弱的
          }
          return true;
        });
      },
      checkPass() {
        if ($('#Pass0').val().length < 6) {
          $('#PassError1').html('请填写6~16个字符');
        } else {
          $('#PassError1').html('');
        }
      },
      CheckPassSame() {
        var IsPassHas = ($('#Pass0').val().length >= 6) && ($('#Pass1').val().length > 0);//如果第一次输入完毕并且确认密码不为空
        if (IsPassHas) {
          if ($('#Pass1').val() != $('#Pass0').val()) {
            $('#PassError1').html('请输入相同密码');
          } else {
            $('#PassError1').html('');
          }
        }
      },
      goStepFour() {
        let that = this;
        let SubData = {};
        SubData.captcha = $('#MsgCode').val();
        SubData.mobile = $('#Phone').val();
        SubData.password = md5($('#Pass1').val());
        var IsCanGoStep = ($('#Pass0').val() == $('#Pass1').val()) && ($('#Pass0').val().length >= 6);//如果第一次输入完毕并且两个密码相同
        if (IsCanGoStep) {
          updatePass(this, SubData).then(function (response) {
            let res = response.body;
            var codenum = parseInt(res.retCode.substr(0, 1));
            /*请求成功进入下一步*/
            if (codenum == 0) {
              that.SavePassSuccess();
            } else {
              $('#c_ErrorMsg').html('操作失败，请重试').fadeIn(200);
              Disappear("#c_ErrorMsg");
              that.DataReset();
            }
          });
        }
        if ($('#Pass0').val().length < 6) {
          $('#PassError0').html('请填写6~16个字符');
        }
      },
      SavePassSuccess() {
        $('#Find3').css('display', 'none');
        $('#Find1').css('display', 'block');
        $('#Find').css('display', 'none');
        $('#Find4').fadeIn(150);
        $('#GoToIndex').on('click', function () {
          window.location.href = "../../index.html";
        });
      },
      DataReset() {
        //LoadBar重置
        $('#r_Bar0').css('left', '-120px');
        $('#r_Bar1').css('left', '-120px');
        $('#r_LoadTxt2').removeClass().addClass('r_LoadTxt');
        $('#r_LoadTxt3').removeClass().addClass('r_LoadTxt');
        $('#r_StepTxt1').removeClass().addClass('LoadNow');
        $('#r_StepTxt2').removeClass();
        $('#r_StepTxt3').removeClass();
        //等级重置
        $('#Rank0').removeClass();
        $('#Rank1').removeClass();
        $('#Rank2').removeClass();
        //步骤恢复
        $('#Find').css('display', 'block');
        $('#Find1').css('display', 'block');
        $('#Find2').css('display', 'none');
        $('#Find3').css('display', 'none');
        $('#Find4').css('display', 'none');
        //手机重置
        $('#Phone').val('');
        //图形验证码重置
        $('#Code').val('');
        this.GetCaptcha();
        $('#CodeError').html('');
        //短信验证码重置
        $('#MsgCode').val('');
        $('#MsgError').html('');
        //密码重置
        $('#Pass0').val('');
        $('#Pass1').val('');
        $('#PassError1').html('');
      }
    }
  };
</script>
<style>
  /*头部和底部*/
  body{background: #f5f5f5;}
  .First_Nav{width: 100%;overflow: hidden;float: left; min-width: 1000px;background: white; box-sizing:border-box;height:92px;border-bottom: 2px solid #00ce9f;}
  .First_NavBox{margin: 0 auto;height: 100%;overflow: hidden;background: white;}
  .First_Logo{float: left;}
  .First_Dowload{float: right; color: #00ce9f;cursor: pointer;width: 102px;height: 31px;border-radius: 16px; box-sizing: border-box;margin:30px auto;border: 1px solid #00ce9f;line-height: 30px;text-align: center;font-size: 16px;margin-right: 12px; }
  @media screen and (max-width:1366px){
    .First_NavBox{width: 900px;}
  }
  @media screen and (min-width:1366px){
    .First_NavBox{width: 1000px;}
  }
  @media screen and (min-width:1600px){
    .First_NavBox{width: 1200px;}
  }
  .FourFooter{height: 100px;float: left; background: #00ce9f;width: 100%; box-sizing: border-box;text-align: center;line-height: 100px;color: white;font-size: 14px; }
  /*内容区*/
  .r_MainBox{float: left;width: 100%;}
  .r_FoundMain{width: 490px;height: 570px;box-shadow: 0 0 10px #ededed;  box-sizing: border-box;  padding: 25px 0 0 95px;  border-radius: 10px;  background: white;  margin: 120px auto;  box-sizing: border-box;}
  .r_Title{float: left;width: 100%;height: 30px;line-height: 30px;box-sizing: border-box;}
  .r_Tixt{float: left;font-size: 24px;color: #323232;}
  .r_LoadMain{float: left;width: 100%;height: 30px;margin-top: 40px;}
  .r_LoadTxt{float: left;width: 30px;text-align: center; height: 30px;line-height: 30px;background: #f5f5f5;color: #959595;border-radius: 100%;border: 1px solid white; font-size: 14px;font-weight: bold;}
  .r_LoadTxtNow{float: left;width: 30px;text-align: center; height: 30px;line-height: 30px;background: #555558;color: white;border-radius: 100%;border: 1px solid white; font-size: 14px;font-weight: bold;}
  .r_LoadBar{float: left; height: 3px;width: 105px;overflow: hidden; position: relative;background: #f5f5f5;margin-top: 13.5px;}
  .r_Bar{position: absolute;left: -120px;top: 0; height: 3px;width: 105px;background: #555558;}

  .r_LoadTxtBox {float: left;width: 100%;line-height: 25px;margin-top: 10px;box-sizing: border-box;padding-right: 90px;}
  .r_LoadTxtBox p{float: left;line-height: 25px;font-size: 12px;color: #959595;width: 33.3333333%}
  .r_LoadTxtBox p:nth-child(1){text-align: left;}
  .r_LoadTxtBox p:nth-child(2){text-align: center;}
  .r_LoadTxtBox p:nth-child(3){text-align: right;}
  .r_LoadTxtBox .LoadNow{color: #323232;font-weight: bold;}
  .r_StepBox{float: left;width: 100%;}
  .r_OneBox{float: left;overflow: hidden;margin-top: 30px;}
  .r_OtherBox{float: left;overflow: hidden;margin-top: 10px;width: 100%;}
  .r_OtherBox1{float: left;overflow: hidden;margin-top: 20px;width: 100%;}
  .r_ModelTxt{color: #636363;font-size: 16px;height: 25px; line-height: 25px;width: 100%;float: left;text-align: left;}
  .r_ModelInput{float: left;font-size: 16px; width: 300px;color: #323232; height: 40px;box-sizing: border-box;border: 1px solid #ccc;outline: none;padding-left: 10px;}
  .r_ModelError{float: left;width: 100%;text-align: left;color: #f6111a;font-size: 12px;height: 15px;line-height: 15px;}
  .r_ModelHint{float: left;width: 100%;text-align: left;color: #959595;font-size: 12px;height: 15px;line-height: 15px;}
  .r_ModelTxt0{float: right;margin-right: 95px;line-height: 30px; text-align: right;font-size: 12px;color: #959595;}
  .r_CodeInput{float: left;width: 160px;color: #323232;font-size: 16px; height: 40px;box-sizing: border-box;border: 1px solid #ccc;outline: none;padding-left: 10px;}
  .r_CodeBox{float: left;margin-left: 15px;width: 85px;height: 40px;box-sizing: border-box;border: 1px solid #04030f;}
  .r_CodeBox img{float: left;width: 100%;margin-top: 4px;}
  .r_OtherCode{float: left;text-align: left;margin-left: 7px;color: #959595; width: 45px;height: 40px;font-size: 12px;text-decoration: underline;cursor: pointer;box-sizing: border-box;padding-top: 3px;}
  .r_NextBtn{float: left;width: 300px;height: 38px;text-align: center;font-size: 16px;color: white;line-height: 38px;background:#08E8AE;border-radius: 10px;cursor: pointer;margin-top: 30px; }
  .r_UserPhoneTxt{font-size: 16px;color: #323232;text-align: left;line-height: 30px;font-weight: bold;}
  .r_UserPhoneBox{font-size: 16px;color: #323232;text-align: left;line-height: 30px;font-weight: bold;}
  .r_GetMsg,.MsgBtnTxt{float: left;margin-left: 5px; width: 105px;height: 40px;text-align: center;line-height: 40px;text-align: center;font-size: 12px;color: #636363;background: #dedede;cursor: pointer;}
  .MsgBtnTxt{margin-left: 0;}
  .r_MsgInput{float: left;width: 190px;color: #323232;font-size: 16px; height: 40px;box-sizing: border-box;border: 1px solid #ccc;outline: none;padding-left: 10px;}
  .RankBox{float: left;width: 100%;height: 15px;line-height: 15px;margin-top: 5px;}
  .RankBox p{  float: left;width: 22px;height: 15px;line-height: 15px;font-size: 12px;color: white;background: #d7d3d4;text-align: center;margin-right: 1px;}
  .RankBox .ThisRank{float: left;width: 22px;height: 15px;line-height: 15px;font-size: 12px;color: white;background: #00ce9f;text-align: center;margin-right: 1px;}
  .RankTxt{float: left;color: #959595;font-size: 12px;margin-right: 15px;}
  .r_NextBtn0{float: left;width: 300px;height: 40px;text-align: center;font-size: 18px;color: white;line-height: 40px;background:#08E8AE;border-radius: 10px;cursor: pointer;margin-top: 5px; }
  .r_ModelError0{float: left;width: 100%;text-align: left;color: #f6111a;font-size: 12px;height: 10px;line-height: 10px;}
  .mt0{margin-top: 0;}
  .r_ImgBox{float: left;text-align:center;height: 40px;width: 100%;margin-top: 75px;}
  .r_FoundMain0{padding-left: 0;height: 460px;}
  .pl95{padding-left: 95px;}
  .r_DoneTxt0{float: left;width: 100%;height: 30px;line-height: 30px;font-size: 28px;color: #323232;text-align: center;margin-top: 20px;}
  .r_DoneTxt1{float: left;width: 100%;height: 30px;line-height: 30px;font-size: 14px;color: #959595;text-align: center;margin-top: 10px;}
  .r_LoginBtn{margin: 45px 0 0 95px;}
  .mt5{margin-top: 5px;}

</style>
