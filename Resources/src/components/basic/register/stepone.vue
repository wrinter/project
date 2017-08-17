<template>
  <div class="register_tStep1" :id="info.id">
    <h1 class="register_title">{{info.title}}</h1>
    <!--手机号-->
    <div class="register_container">
      <input type="text" placeholder="手机号" class="register_itext " :id="'Phone'+info.str" maxlength="11" v-model="phoneNum" @blur="CheckPhoneFormat">
    </div>
    <!--图形验证码-->
    <div class="register_Captcha" :id="'CaptchaMain'+info.str">
      <input type="text" class="register_captchaIn" :id="'Captcha'+info.str" maxlength="4" v-model="capcha">
      <img :src="info.capchaSrc" alt="加载中" class="register_capImg" @click="changeCapcha">
      <p class="fs14 fl"><span class="fl unline">看不清?</span></p>
      <p class="fs14 fl"><span class="fl fs14 fc58 cup unline" @click="changeCapcha">换一个</span></p>
    </div>
    <!--短信验证码-->
    <div>
      <input type="text" class="register_msgCapin" v-model="message" maxlength="6" :id="'MsgIn'+info.str">
      <input type="button" :class="{'register_msgInBtn':true,'dino':isDisplay}" value="免费获取验证码" @click="checkBefore">
      <div :class="{'register_msgInBtn':true,'dino':isShow}"><span>{{msgSecond}}</span>s之后重新发送</div>
    </div>
    <!--新密码-->
    <div class="register_container">
      <input type="password" placeholder="密码" class="register_itext" maxlength="16" v-model="fpass" @blur="checkPassFormat" :id="'Pass'+info.str">
    </div>
    <!--确认密码-->
    <div class="register_container">
      <input type="password" placeholder="确认密码" class="register_itext" v-model="spass" maxlength="16" @blur="checkEnsurePass" :id="'Pass'+info.str2">
    </div>
    <p class="register_error" :id="info.fstr+'Error0'">{{errorInfo}}</p>
    <input type="button" class="NextBtn" value="下一步" @click="goNext">
  </div>
</template>
<script type="text/ecmascript-6">
  import {checkMobile,getCaptcha,postMessage,checkMessage} from '../../../service/register/register.js';
  import $ from 'jquery';
  import {Disappear} from '../../../common/js/common.js';
  /*手机号正则*/
  let pat = /^(13|14|19|15|18|17)[0-9]{9}$/;
  export default {
    props: ['info'],
    data() {
      return {
        phoneNum:'',
        capcha:'',
        message:'',
        errorInfo:'',
        phoneRight:true,
        capchaRight:true,
        msgSecond:60,
        isDisplay:false,
        isShow:true,
        fpass:'',
        spass:''
      };
    },
    mounted() {
    },
    methods:{
      CheckPhoneFormat() {
        if(this.phoneNum=='') {
          this.errorInfo='请填写手机号';
        }else if (pat.test(this.phoneNum) == false) {
          this.errorInfo='手机号格式错误';
          this.phoneRight = false;
        } else {
          this.errorInfo='';
          this.CheckTelNot();
        }
      },
      CheckTelNot() {
        let that = this;
        let subData = {};
        subData.mobile = this.phoneNum;
        checkMobile(this, subData).then((response) => {
          let rdata = response.body;
          var codenum = parseInt(rdata.retCode.substr(0, 1));
          if (codenum != 0) {
            this.errorInfo='用户已存在';
            that.phoneRight = false;
          }else{
            that.phoneRight = true;
          }
        });
      },
      changeCapcha() {
        let that = this;
        getCaptcha(this).then((response) => {
          let rdata = response.body;
          var codenum = parseInt(rdata.retCode.substr(0, 1));
          if (codenum == 0) {
            that.info.capchaSrc = rdata.retData;
          }
          else {
            $('#c_ErrorMsg').html('验证码获取失败，请重试').fadeIn(200);
            Disappear("#c_ErrorMsg");
          }
        });
      },
      checkBefore() {
        if (this.phoneNum == '') {
          this.errorInfo='请填写手机号';
        } else {
          if (this.phoneRight) {
            if (this.capcha == '') {
              this.errorInfo='请输入图形验证码';
            }
            else {
              /*只有当验证码有值，手机号正确才发送验证码*/
              let subData = {};
              subData.imageCaptcha = this.capcha;
              subData.mobile = this.phoneNum;
              let that = this;
              /*验证手机号和图形验证码*/
              postMessage(this, subData).then((response) => {
                let rdata = response.body;
                var codenum = parseInt(rdata.retCode.substr(0, 1));
                if (rdata.retCode == 2001) {
                  that.errorInfo='图形验证码错误';
                  that.GetCapcha();
                } else if (rdata.retCode == 2203) {
                  that.errorInfo='图形验证码错误';
                  that.changeCapcha();
                } else if (rdata.retCode == 2301) {
                  $('#c_ErrorMsg').html('60秒内只能发送一次').fadeIn(200);
                  Disappear("#c_ErrorMsg");
                } else if (rdata.retCode == 2202) {
                  that.errorInfo=rdata.retMsg;
                } else if (codenum == 0) {
                  that.errorInfo='';
                  that.WaitTime();
                }
              });
            }
          }
        }
      },
      WaitTime() {
        this.isDisplay = true;
        this.isShow = false;
        var f_Sendtimer0 = null;
        this.msgSecond = 60;
        var f_SendSecNum = 60;
        if (f_Sendtimer0) {
          clearInterval(f_Sendtimer0);
        }
        let that =this;
        f_Sendtimer0 = setInterval(function () {
          f_SendSecNum--;
          that.msgSecond = f_SendSecNum;
          if (f_SendSecNum == 0) {
            clearInterval(f_Sendtimer0);
            that.isDisplay = false;
            that.isShow = true;
          }
        }, 1000);
      },
      checkPassFormat() {
        if (this.phoneRight && this.capchaRight) {
          if (this.fpass.length < 6 && this.fpass != '') {
            this.errorInfo='请填写6~16个字符';
          } else {
            this.errorInfo='';
          }
        }
      },
      checkEnsurePass() {
        if (this.phoneRight && this.capchaRight) {
          if (this.spass == '') {
            this.errorInfo='请输入确认密码';
          } else {
            if (this.fpass != this.spass) {
              this.errorInfo='请输入相同密码';
            }
            else {
              this.errorInfo='';
            }
          }
        }
      },
      goNext() {
        console.log('goNext');
        if (this.phoneNum.length == 0) {
          this.errorInfo='请填写手机号';
          return;
        } else {
          this.CheckPhoneFormat();
          if (!this.phoneRight) {
            return;
          }
        }
        if (this.capcha.length == 0) {
          this.errorInfo='请输入图形验证码';
          return;
        }
        if (this.message.length == 0) {
          this.errorInfo='请输入短信验证码';
          return;
        }
        this.CheckSMS();
      },
      CheckSMS() {
        let that = this;
        var subData = {};
        subData.smsCaptcha = this.message;
        subData.mobile = this.phoneNum;
        checkMessage(this, subData).then((response) => {
          var codenum = parseInt(response.body.retCode.substr(0, 1));
          if (codenum == 0) {
            if (this.fpass.length == 0) {
              this.errorInfo='请输入密码';
              return;
            }
            if (this.fpass.length < 6) {
              this.errorInfo='请填写6~16个字符';
              return;
            }
            if (this.spass.length == 0) {
              this.errorInfo='请输入确认密码';
              return;
            }
            if (this.fpass != this.spass) {
              this.errorInfo='请输入相同密码';
              return;
            }
            if (this.info.fstr == 't') {
              $('#TeacherStep1').css({"display": 'none'});
              $("#TeacherStep2").css({"display": 'block'});
              this.$emit('updatetStep',{'key':'tstep','value':'2'});
            }
            if (this.info.fstr == 's') {
              $('#StudentStep1').css({"display": 'none'});
              $("#StudentStep2").css({"display": 'block'});
              this.$emit('updatesStep',{'key':'sstep','value':'2'});
            }
          } else {
            this.errorInfo='短信验证码不正确';
          }
        });
      }
    }
  };
</script>
<style>
  @import '/static/common/css/common.css';
  .register_tStep1{ float:left; height: 410px;position: relative;cursor: pointer;  text-align: center;background: white; box-sizing: border-box;  padding: 0 55px 40px 55px; z-index:3;}
  .register_title{width: 100%;float: left;text-align: center;color: #333333;}
  .register_container{width: 100%;float: left;box-sizing: border-box;border: 1px solid #ccc;}
  .register_itext{outline: none;height: 100%; float: left;width: 93%;border: 0;  text-align: left;box-sizing: border-box;line-height: 24px;font-size: 14px;color: #333;}
  .register_Captcha{float: left;width: 100%;position: relative;}
  .register_Captcha p{line-height:16px;font-size:12px;}
  .register_Captcha>p:first-child{color:#666;}
  .register_captchaIn{ width: 160px;float: left;box-sizing: border-box;border: 1px solid #ccc;outline: none;color: #333;height: 40px;}
  .register_capImg{float: left;margin: 10px 5px 0 5px;}
  .NextBtn{width: 100%;box-sizing: border-box; float: left;text-align: center;color: white; background: -webkit-linear-gradient(#03d89b,#00b961); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#03d89b,#00b961); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#03d89b,#00b961); /* Firefox 3.6 - 15 */
    background: linear-gradient(#03d89b,#00b961); /* 标准的语法 */
    border-radius: 10px;outline: none;cursor: pointer;border: 0;margin-top: 20px;}
  .register_msgInBtn{width: 126px; text-align: center;cursor: pointer; border: 0;outline: none;float: right;color: #636363;font-size: 12px;background: #dedede;height: 40px;}
  .register_msgCapin{ width: 160px;box-sizing: border-box; text-align: left;border: 1px solid #ccc;outline: none;float: left;color: #333;}
  .register_tStep1>div{  height:40px;  line-height:40px;  position:relative;  float:left;  margin-top:10px;}
  .register_error{box-sizing: border-box; line-height: 12px;height: 12px;text-align: left; width: 100%;float: left;color:  #f6111a;font-size: 12px;}
  @media screen and (max-width:1366px){
    .register_tStep1{width: 390px;left: -16%;}
    .register_title{line-height:40px;font-size: 20px; }
    .register_capImg{margin-top: 5px;margin-left: 0;margin-right: 0;}
    .register_msgCapin,.register_msgInBtn{height: 40px;font-size: 12px;}
    .register_msgCapin{  padding: 2px 0 2px 10px; margin-right: 5px;}
    .register_captchaIn,.register_container{line-height: 35px;padding: 2px 0 2px 10px;height: 35px;}
    .NextBtn {height: 35px;line-height: 35px;text-align: center;font-size: 14px;}
    .register_captchaIn { width: 145px;margin-right: 5px;}
    .register_msgCapin {width: 145px;}
  }
  @media screen and (min-width:1366px) and (max-width:1599px){
    .register_tStep1{width: 410px;left: -13%;}
    .register_title{line-height:50px;font-size: 22px;}
    .register_msgCapin{  padding: 4px 0 4px 10px;margin-right: 5px;}
    .register_captchaIn,.i_InfoIn{line-height: 40px;padding: 4px 0 4px 10px;height:40px;}
    .NextBtn {height: 40px;line-height: 40px;text-align: center;font-size: 16px;}
    .register_msgCapin,.register_msgInBtn{height: 40px;font-size: 12px;}
    .register_captchaIn { width: 155px;}
    .register_msgCapin {width: 155px;}
  }
  @media screen and (min-width:1600px){
    .register_tStep1{width: 404px;left: -16%;height:411px;}
    .register_title{line-height:65px;font-size: 24px;}
    .register_msgCapin{  padding: 6px 0 6px 5px;margin-right: 5px;}
    .register_msgCapin,.register_container{line-height: 40px;padding: 6px 0 6px 10px;height: 40px;}
    .NextBtn {height: 38px;line-height: 38px;text-align: center;font-size: 16px;}
    .register_msgCapin{height: 40px;font-size: 14px;}
  }
</style>
