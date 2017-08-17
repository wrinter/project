<template>
  <div class="w_LogInMain">
    <ul class="LogBox">
      <li class="LogTitle">
        <p class="Tixt">登录</p>
        <p><router-link v-bind:to="'/register?share=true'" class="RegTxt">注册</router-link></p>
      </li>
      <li class="DefultBox">
        <p class="ModelTxt">手机号</p>
        <input type="text" class="ModelInput" @mousedown="PhoneReset" @blur="PhoneOnblur" maxlength="11" v-model="Phone">
        <transition name="el-fade-in">
          <i class="el-icon-circle-check" v-if="PhoneCheck"></i>
          <i class="el-icon-circle-close" v-if="PhoneClose"></i>
        </transition>
        <p class="ModelError">{{PhoneError}}</p>
      </li>
      <li class="OtherBox">
        <div class="ModelTxt">密码
          <router-link v-bind:to="'/forgetPass?share=true'" class="forgetPass">忘记密码？</router-link>
        </div>
        <input type="password" class="ModelInput" v-model="Pass" maxlength="16" @keyup.enter="BeforeLogIn">
        <transition name="el-fade-in">
          <i class="el-icon-circle-check" v-if="PassCheck"></i>
          <i class="el-icon-circle-close" v-if="PassClose"></i>
        </transition>
        <p class="ModelError" >{{PassError}}</p>
      </li>
      <li class="OtherBox" v-if="LogFail">
        <p class="ModelTxt">验证码</p>
        <input type="text" class="ModelCode" @mousedown="CodeError=''"  maxlength="4" v-model="Code">
        <p class="CodeBox"><img :src="CodeSrc" alt=""></p>
        <p class="ChangeCode" @click="getImgCode">看不清?换一张</p>
        <p class="ModelError"> {{CodeError}}</p>
      </li>
      <li class="LogBtn"  @click="BeforeLogIn" >登录 <i class="el-icon-loading" v-if="loading"></i> </li>
      <li class="RemBox">
        <img src="../../../static/teacher/images/logbox/c0.png" v-if="NotRem" @click="NotRem=!NotRem" alt="">
        <img src="../../../static/teacher/images/logbox/c1.png" v-if="!NotRem" @click="NotRem=!NotRem" alt="">
        <span>记住密码</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import md5 from 'js-md5'
  let Base64 = require('js-base64').Base64
  export default{
    data () {
      return {
        Phone: '',
        PhoneError: '',
        PhoneCheck: false,
        PhoneClose: false,
        Pass: '',
        PassCheck: false,
        PassClose: false,
        PassError: '',
        Code: '',
        CodeError: '',
        CodeSrc: '',
        NotRem: true,
        loading: false,
        LogFail: false
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.getImgCode()
      },
      getImgCode () {
        this.$http.post('/web/common/captcha').then((response) => {
          let ReceiveData = response.body.retData
          let CodeMsg = response.body.retCode
          if (CodeMsg === '0000') {
            this.CodeSrc = ReceiveData
          }
        })
      },
      isEmptyObject (obj) {
        if (obj[0]) {
          return true
        } else if (obj === '') {
          return false
        } else {
          return false
        }
      },
      PhoneReset () {
        this.PhoneError = ''
        this.PhoneCheck = false
        this.PhoneClose = false
      },
      PassReset () {
        this.PhoneError = ''
        this.PhoneCheck = false
        this.PhoneClose = false
      },
      PhoneOnblur () {
        let pat = /^(13|14|19|15|18|17)[0-9]{9}$/ // 验证手机格式正则
        if (this.isEmptyObject(this.Phone)) {
          if (!pat.test(this.Phone)) {
            this.PhoneReset()
            this.PhoneError = '手机号格式错误'
            this.PhoneClose = true
          } else {
            this.PhoneReset()
            this.JudgPhone()
          }
        }
      },
      JudgPhone () {
        var SubData = {}
        SubData.mobile = this.Phone
        this.$http.post('/web/user/check/mobile/exist', SubData, {'emulateJSON': true}).then((response) => {
          let CodeMsg = response.body.retCode
          if (CodeMsg === '0000') {
          this.PhoneCheck = true
          this.fillPass()
        } else {
          this.PhoneError = '用户不存在'
          this.PhoneClose = true
        }
      })
      },
      fillPass () {
        let PhoneKey = localStorage.getItem('PhoneKey')
        if (this.Phone === PhoneKey) {
          this.Pass = Base64.decode(localStorage.getItem('userPass'))
        }
      },
      BeforeLogIn () {
        console.log(this.isEmptyObject(this.Pass))
        if (!this.isEmptyObject(this.Phone) && !this.isEmptyObject(this.Pass)) {
          this.PhoneReset()
          this.PhoneError = '请输入手机号'
          this.PhoneClose = true
        } else if (this.isEmptyObject(this.PhoneError) && !this.isEmptyObject(this.Pass)) {
          this.PassReset()
          this.PassError = '请输入密码'
          this.PassClose = false
        } else if (this.isEmptyObject(this.PhoneError)) {  // 手机格式错误
        } else {
          this.LogIn()
        }
      },
      LogIn () {
        var SubData = {}
        SubData.mobile = this.Phone
        SubData.password = md5(this.Pass)
        SubData.imageCaptcha = this.Code
        this.$http.post('/web/user/login', SubData, {'emulateJSON': true}).then((response) => {
          let CodeMsg = response.body.retCode
          if (CodeMsg === '0000') {
            this.loading = true
            this.PassReset()
            this.PhoneReset()
            this.SaveUserPass()
            this.$router.push('/content/teacher/index/index')
          } else {
            this.LogFail = true
            this.getImgCode()
            if (CodeMsg === '2101') {
              this.CodeError = '请输入验证码'
            } else if (CodeMsg === '2203') {
              this.CodeError = '验证码错误'
            } else if (CodeMsg === '3001') {
              this.PassError = '用户密码不正确'
            }
          }
        })
      },
      SaveUserPass () {
        if (!this.NotRem) {
          let SavePass = Base64.encode(this.Pass)
          localStorage.setItem('userPass', SavePass)
          localStorage.setItem('PhoneKey', this.Phone)
        } else {
          localStorage.setItem('userPass', '')
          localStorage.setItem('PhoneKey', '')
        }
      }
    }
  }
</script>

<style>
  body{background: #dcdcdc;}
  .w_LogInMain{margin: auto;height: 100px;position: absolute;z-index: 9;right: 0;left: 0;top: 92px;}
  .LogBox{margin: 40px auto;}
  .LogBox{width: 340px;overflow: hidden;background: white;border-radius: 10px;padding: 30px 0 15px 40px;box-sizing: border-box;float: right;  margin-top: 106px; }
  .LogTitle{float: left;width: 100%;height: 30px;line-height: 30px;}
  .Tixt{float: left;font-size: 24px;color: #323232;}
  /*.RegTxt>a {color: #323232;}*/
  .RegTxt>a:hover{color: #65b113;}
  .RegTxt{float: right;color: #02b1cb;font-size: 20px;margin-right: 40px;}
  .DefultBox{float: left;overflow: hidden;margin-top: 30px;}
  .OtherBox{float: left;overflow: hidden;margin-top: 10px;width: 100%;}
  .ModelTxt{color: #636363;font-size: 16px;line-height: 25px;width: 100%;float: left;text-align: left;}
  .ModelInput{float: left;width: 260px;color: #323232; height: 40px;box-sizing: border-box;border: 1px solid #ccc;outline: none;padding-left: 10px;}
  .ModelCode{float: left;width: 137px;color: #323232; height: 40px;box-sizing: border-box;border: 1px solid #ccc;outline: none;padding-left: 10px;}
  .ModelError{float: left;width: 100%;text-align: left;color: #f6111a;font-size: 12px;height: 15px;line-height: 15px;}
  .CodeBox{float: left;margin-left: 7px;width: 85px;height: 40px;box-sizing: border-box;border: 1px solid #04030f;}
  .CodeBox img{float: left;width: 100%;margin-top: 4px;}
  .ChangeCode{float: left;text-align: left;margin-left: 7px;color: #959595; width: 45px;height: 40px;line-height: 16px; font-size: 12px;text-decoration: underline;cursor: pointer;box-sizing: border-box;padding-top: 3px;}
  .LogBtn{float: left;width: 260px; margin-top: 15px; height: 40px;border-radius: 10px;text-align: center;line-height: 40px;background: #08e8ae;font-size: 18px;color: white;cursor: pointer;}
  .RemBox{float: left;width: 100%;line-height: 50px;}
  .RemBox>img{margin-right: 5px;cursor: pointer;}
  .RemBox>span{font-size: 14px;color: #959595;}
  .el-icon-circle-check,.el-icon-circle-close{line-height: 40px;font-size: 15px;margin-left: 3px;}
  .el-icon-circle-check{color: #65b113;}
  .el-icon-circle-close{color: #f6111a;}
  .forgetPass{float: right;font-size: 14px;color: #02b1cb;margin-right: 40px;}
  @media screen and (max-width:1366px){
    .w_LogInMain{width: 900px;}
  }
  @media screen and (min-width:1366px){
    .w_LogInMain{width: 1000px;}
  }
  @media screen and (min-width:1600px){
    .w_LogInMain{width: 1200px;}
  }
</style>
