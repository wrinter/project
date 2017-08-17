<template>
  <div>
    <!--自定义分页器-->
    <ul class="Pagination" id="Pagination">
    </ul>
    <!--一楼内容-->
    <div class=" login_Pag login_first">
      <div class="login_Nav">
        <div class="login_NavBox">
          <img src="/static/common/images/login/logo.png" alt="" class="login_Logo">
          <p class="login_Dowload"  @click="goDownload()">APP下载</p>
        </div>
      </div>
      <!--轮播图-->
      <v-banner :listData="bannerData"></v-banner>
      <v-logbox></v-logbox>
    </div>
    <!--二楼内容-->
    <div class="login_floor login_Pag login_second">
      <img src="/static/common/images/login/fltxt2.png" alt="" class="login_mode">
      <div class="login_SecLeft login_SecMain" id="Echo_FLeft2">
        <div class="login_SecImgBox">
          <img src='/static/common/images/login/floorimg0.png' alt="">
          <p class="login_SecMask">辅助教学</p>
        </div>
        <ul class="login_SecIntro">
          <li>
            <p class="login_SecLine">一键下载</p>
            <p class="login_SecCon">精品的<span class="fc00c">视频</span>、<span class="fc00c">课件</span>、<span
              class="fc00c">典例</span>、<span class="fc00c">教案</span>等备课资源一键下载，让教学更高效</p>
          </li>
          <li>
            <p class="login_SecLine">一键布置</p>
            <p class="login_SecCon">分层作业<span class="fc00c">一键布置</span>、<span class="fc00c">智能批改</span>，让教学更简单</p>
          </li>
        </ul>
      </div>
      <div class="login_SecRight login_SecMain" id="Echo_FRight2">
        <div class="login_SecImgBox">
          <img src='/static/common/images/login/floorimg1.jpg' alt="">
          <p class="login_SecMask">翻转学习</p>
        </div>
        <ul class="login_SecIntro">
          <li>
            <p class="login_SecLine">先学后教</p>
            <p class="login_SecCon"><span class="fc00c">国家级视频课</span>配套导学案，在这里实现先学后教，让教学更丰富</p>
          </li>
          <li>
            <p class="login_SecLine">问题先行</p>
            <p class="login_SecCon">即时交互，问题先行，教师走下讲台变为教练,轻松实现<span class="fc00c">个性化教学</span></p>
          </li>
        </ul>
      </div>
    </div>
    <!--三楼内容-->
    <div class="login_floor login_Pag login_third" id="OutSlide3">
      <img src="/static/common/images/login/fltxt3.png" alt="" class="login_mode">
      <div class="login_ThreeMain">
        <ul class="login_ThreeTab">
          <li><p class="login_ThisTab" data-Num="0">老师</p></li>
          <li><p data-Num="1">学生</p></li>
        </ul>
        <div id="TeacherTab">
          <ul class="login_tRound" id="Round">
            <li class="login_tCircle" v-for="temp in teacherTab"><img :src="temp.src" alt="" class="login_tPic">
              <p class="login_tText">{{temp.text}}</p></li>
            <li class="login_teacherCicle"></li>
            <li></li>
          </ul>
          <div class="login_tInTro" id="ThreeInTro">
            <img src="/static/common/images/login/toline.png" alt="" class="login_tLine">
            <div class="login_tInTroBox">
              <p class="login_tInTroNum">
                <span>{{teacherTxt.num}}</span>
                <img src="/static/common/images/login/xline.png" alt="" class="login_Xline">
              </p>
              <div class="login_InTxt">
                <p class="login_tTitle">{{teacherTxt.subHead}}</p>
                <p class="login_tSubhead">{{teacherTxt.subTitle}}</p>
              </div>
            </div>
          </div>
        </div>
        <div id="StuTab" class="dino">
          <ul class="login_sRound" id="Round1">
            <li class="login_sCircle" v-for="temp in studentTab"><img :src="temp.src" alt="" class="login_sPic">
              <p class="login_sText">{{temp.text}}</p></li>
            <li class="login_stuCicle"></li>
            <li></li>
          </ul>
          <div class="login_sInTro" id="ThreeInTro1">
            <div class="login_sInTroBox">
              <p class="login_sInTroNum">
                <span>{{studentTxt.num}}</span>
                <img src="/static/common/images/login/xline.png" alt="" class="login_Xline">
              </p>
              <div class="login_InTxt">
                <p class="login_sTitle">{{studentTxt.subHead}}</p>
                <p class="login_sSubhead">{{studentTxt.subTitle}}</p>
              </div>
            </div>
            <img src="/static/common/images/login/line0.png" alt="" class="login_sLine">
          </div>
        </div>
      </div>
    </div>
    <!--四楼内容-->
    <div class="login_floor login_Pag login_fourth">
      <img src="/static/common/images/login/fltxt4.png" alt="" class="login_mode">
      <div class="login_FourMain">
        <div class="login_Phone">
          <div class="login_PhoneBox">
            <v-banner :listData="phoneSwiper"></v-banner>
          </div>
        </div>
        <img src="/static/common/images/login/down.png" class="login_DownBox" alt="">
        <img src="/static/common/images/login/hand.png" alt="" class="login_Hander" id="Hander">
      </div>
      <v-footer></v-footer>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Banner from './basic/FloorAnim.vue';
  import logbox from './common/logbox.vue';
  import footer from './common/footer.vue';
  import Swiper from 'swiper';
  import $ from 'jquery';
  import banner from '../../static/common/images/login/banner0.jpg';
  import phonecon from '../../static/common/images/login/phonecon.jpg';
  var Gradually = 0;
  var Gradually1 = 0;
  var Timer0 = null;
  var Timer1 = null;
  var Timer2 = null;
  var Timer3 = null;
  export default {
    name: 'Login',
    data () {
      return {
        bannerData: {
          id: 'banner0',
          listImg: [
            {url: banner},
            {url: banner}
          ]
        },
        phoneSwiper: {
          listImg: [
            {url: phonecon},
            {url: phonecon}
          ]
        },
        teacherTab: [
          {
            src: '/static/common/images/login/round1.png',
            text: '高效备课'
          },
          {
            src: '/static/common/images/login/round2.png',
            text: '个性讲学'
          },
          {
            src: '/static/common/images/login/round3.png',
            text: '一键布置'
          },
          {
            src: '/static/common/images/login/round4.png',
            text: '智能批改'
          },
          {
            src: '/static/common/images/login/round5.png',
            text: '前沿素材'
          }
        ],
        teacherTxt:{
          num: 1,
          subHead: '高效备课',
          subTitle: '为您推荐优质课件、微课、教案、典例、试题等，一键下载，备课不愁找资源'
        },
        studentTab: [
          {
            src: '/static/common/images/login/stu1.png',
            text: '即时反馈'
          },
          {
            src: '/static/common/images/login/stu2.png',
            text: '翻转学习'
          },
          {
            src: '/static/common/images/login/stu3.png',
            text: '构建图谱'
          },
          {
            src: '/static/common/images/login/stu4.png',
            text: '名师助考'
          },
          {
            src: '/static/common/images/login/stu5.png',
            text: '补偿训练'
          }
        ],
        studentTxt:{
          num: 1,
          subHead: '即时反馈',
          subTitle: '我的训练智能批改，提交即时有反馈'
        }
      };
    },
    created () {
    },
    mounted () {
      this.AppDownLoad();
      this.CreatPage(0);
      this.SecondFloor();
      this.SteTab();
      this.TeaRunning();
      this.StuRunning();
      this.Hander();
      this.ShowWeixinCode();
    },
    methods: {
      goDownload () {
        let PageTop = $('.login_Pag').eq(3).position().top;
        $('body,html').animate({scrollTop: PageTop}, 500);
        $('#Pagination li').eq(3).addClass('login_ThisPage').siblings().removeClass()
      },
      AppDownLoad () {
        var App = this.$route.query.AppDoload
        if (App) {
          var Index = 3;
          var PageTop = $('.login_Pag').eq(Index).position().top;
          $('body,html').animate({scrollTop: PageTop}, 1);
          $('#Pagination li').eq(Index).addClass('login_ThisPage').siblings().removeClass()
        }
      },
      CreatPage (Index) {
        var PageNum = $('.login_Pag').length;
        var AutoHeight = PageNum * 42;
        var $Page = '';
        for (var i = 0; i < PageNum; i++) {
          $Page += '<li></li>'
        }
        $('#Pagination').html($Page).css('height', AutoHeight + 'px')
        $('#Pagination li').eq(Index).addClass('login_ThisPage').siblings().removeClass()
        this.PageClick()
        setInterval(function () {
          var ScroolTop = $(window).scrollTop();
          var NowIndex = 0
          if (ScroolTop < 690) {
            NowIndex = 0
          } else if (ScroolTop < 1585) {
            NowIndex = 1
          } else if (ScroolTop < 2480) {
            NowIndex = 2
          } else {
            NowIndex = 3
          }
          $('#Pagination li').eq(NowIndex).addClass('login_ThisPage').siblings().removeClass()
        }, 1);
      },
      PageClick () {
        $('#Pagination li').off('click');
        $('#Pagination li').on('click', function () {
          var Index = $(this).index();
          var PageTop = $('.login_Pag').eq(Index).position().top;
          $('body,html').animate({scrollTop: PageTop}, 500);
          $('#Pagination li').eq(Index).addClass('login_ThisPage').siblings().removeClass();
        });
      },
      SecondFloor () {
        var SecTime = null;
        if (SecTime) {
          clearInterval(SecTime);
        }
        SecTime = setInterval(function () {
          if ($(window).scrollTop() > 200) {
            // 屏幕变化重新设置偏移
            $(window).resize(function () {
              var Distanc = CountDistance()
              $('#Echo_FLeft2').css('left', Distanc)
              $('#Echo_FRight2').css('right', Distanc)
            });
            // 进入开始动画
            var Distanc = CountDistance();
            $('#Echo_FLeft2').animate({'left': Distanc, 'opacity': '1'}, 700, function () {
              $('#Echo_FLeft2').css('left', Distanc)
            });
            $('#Echo_FRight2').animate({'right': Distanc, 'opacity': '1'}, 700, function () {
              $('#Echo_FRight2').css('right', Distanc);
            });
            clearInterval(SecTime);
          }
        }, 1);
        function CountDistance () {
          var WinW = $(window).width();
          if (WinW < 1024) {
            WinW = 1000;
          }
          var Distance = (WinW - 900 - 100) / 2 + 'px';
          return Distance;
        }
      },
      SteTab () {
        $('.login_ThreeTab p').on('click', function () {
          $(this).addClass('login_ThisTab').parents('li').siblings('li').find('p').removeClass();
          var ThisNum = parseInt($(this).attr('data-Num'));
          if (ThisNum === 1) {
            $('#TeacherTab').css('display', 'none')
            $('#StuTab').fadeIn(200)
            // 学生背景
            $('#OutSlide3').css({'background': 'url("../../static/common/images/login/bg31.jpg")center center no-repeat'})
          } else {
            $('#StuTab').css('display', 'none');
            $('#TeacherTab').fadeIn(200);
            // 教师背景
            $('#OutSlide3').css({'background': 'url("../../static/common/images/login/bg3.jpg")center center no-repeat'})
          }
        });
      },
      TeaRunning () {
        if (Gradually === 360) {
          Gradually = 0
        }
        if (Timer0) {
          clearTimeout(Timer0)
        }
        if (Timer1) {
          clearTimeout(Timer1)
        }
        $('#Round').css({'animation': '', 'transform': 'rotate(' + Gradually + 'deg)'})
        $('.login_tCircle').css({'animation': '', 'transform': 'rotate(' + (-Gradually) + 'deg)'})
        $('.login_teacherCicle').css({'animation': '', 'transform': 'rotate(' + (-Gradually) + 'deg)'})
        $('#ThreeInTro').fadeOut(0)
        Gradually += 72;
        var StartRun = '@keyframes GoRun {to{transform:rotate(' + Gradually + 'deg' + ');}}'
        var DefultRun = '@keyframes DefultRun {to{transform:rotate(' + (-Gradually) + 'deg' + ');}}'
        var $Style = StartRun + DefultRun;
        $('#NewStyle').html($Style);
        Timer0 = setTimeout(function () {
          $('#ThreeInTro').fadeIn(2000)
          $('#Round').css({'animation': 'GoRun 1s linear 1 forwards'}).attr('data-rotate', Gradually)
          $('.login_tCircle').css({'animation': 'DefultRun 1s linear 1 forwards'})
          $('.login_teacherCicle').css({'animation': 'DefultRun 1s linear 1 forwards'})
        }, 100);
        let self = this;
        Timer1 = setTimeout(function () {
          var value = $('#Round').attr('data-rotate');
          if (value % 72 === 0) {
            self.teacherTxt.num = 2;
            self.teacherTxt.subHead = '前沿素材'
            self.teacherTxt.subTitle = '前沿素材、拓展知识、方法技巧随时调用'
          }
          if (value % 144 === 0) {
            self.teacherTxt.num = 3;
            self.teacherTxt.subHead = '智能批改'
            self.teacherTxt.subTitle = '系统智能批改作业，数据即时反馈，批改作业不再是您的最大负担'
          }
          if (value % 216 === 0) {
            self.teacherTxt.num = 4;
            self.teacherTxt.subHead = '一键布置'
            self.teacherTxt.subTitle = '教辅作业、分层作业，可一键布置，也可编辑加工，适合自己的才是最好的'
          }
          if (value % 288 === 0) {
            self.teacherTxt.num = 5;
            self.teacherTxt.subHead = '个性讲学'
            self.teacherTxt.subTitle = '课前汇总个性数据，课堂实现个性讲学'
          }
          if (value % 360 === 0) {
            self.teacherTxt.num = 1;
            self.teacherTxt.subHead = '高效备课'
            self.teacherTxt.subTitle = '为您推荐优质课件、微课、教案、典例、试题等，一键下载，备课不愁找资源'
          }
          self.TeaRunning()
        }, 6000);
      },
      StuRunning () {
        if (Gradually1 === (-360)) {
          Gradually1 = 0
        }
        if (Timer2) {
          clearTimeout(Timer2)
        }
        if (Timer3) {
          clearTimeout(Timer3)
        }
        $('#Round1').css({'animation': '', 'transform': 'rotate(' + Gradually1 + 'deg)'});
        $('.login_sCircle').css({'animation': '', 'transform': 'rotate(' + (-Gradually1) + 'deg)'});
        $('.login_stuCicle').css({'animation': '', 'transform': 'rotate(' + (-Gradually1) + 'deg)'});
        $('#ThreeInTro1').fadeOut(0);
        Gradually1 -= 72;
        var StartRun = '@keyframes StuGoRun {to{transform:rotate(' + Gradually1 + 'deg' + ');}}'
        var DefultRun = '@keyframes StuDefultRun {to{transform:rotate(' + (-Gradually1) + 'deg' + ');}}'
        var $Style = StartRun + DefultRun;
        $('#NewStyle1').html($Style);
        Timer2 = setTimeout(function () {
          $('#ThreeInTro1').fadeIn(2000);
          $('#Round1').css({'animation': 'StuGoRun 1s linear 1 forwards'}).attr('data-rotate', Gradually1);
          $('.login_sCircle').css({'animation': 'StuDefultRun 1s linear 1 forwards'});
          $('.login_stuCicle').css({'animation': 'StuDefultRun 1s linear 1 forwards'});
        }, 100);
        let self = this;
        Timer3 = setTimeout(function () {
          var value = $('#Round1').attr('data-rotate');
          if (value % 72 === 0) {
            self.studentTxt.num = 2;
            self.studentTxt.subHead = '翻转学习'
            self.studentTxt.subTitle = '国家级视频配套导学案，名师带你高效预习'
          }
          if (value % 144 === 0) {
            self.studentTxt.num = 3;
            self.studentTxt.subHead = '构建图谱'
            self.studentTxt.subTitle = '准确定位学情，构建专属知识图谱，让你哪里不会点哪里'
          }
          if (value % 216 === 0) {
            self.studentTxt.num = 4;
            self.studentTxt.subHead = '名师助考'
            self.studentTxt.subTitle = '名师整合备考资源，有针对性指导备考'
          }
          if (value % 288 === 0) {
            self.studentTxt.num = 5;
            self.studentTxt.subHead = '补偿训练'
            self.studentTxt.subTitle = '依据智能诊断数据，个性推送补偿训练'
          }
          if (value % 360 === 0) {
            self.studentTxt.num = 1;
            self.studentTxt.subHead = '即时反馈'
            self.studentTxt.subTitle = '我的训练智能批改，提交即时有反馈'
          }
          self.StuRunning();
        }, 6000);
      },
      Hander () {
//        var PicSwiper = new Swiper('#PhoneBox', {
//          height: window.innerHeight,
//          speed: 300,
//          loop: true
//        });
        setInterval(function () {
          $('#Hander').animate({'left': '-30px'}, 500, function () {
//            PicSwiper.slideNext();
            $('#Hander').css('left', '30px')
          })
        }, 3500);
      },
      ShowWeixinCode () {
        $('.Footer_Weixin').hover(function () {
          $('.Footer_Weicode').stop(true).fadeIn(150)
        }, function () {
          $('.Footer_Weicode').stop(true).fadeOut(150)
        });
      }
    },
    components: {
      'v-banner': Banner,
      'v-logbox': logbox,
      'v-footer': footer
    }
  };
</script>
<style>
  .login_Nav{width: 100%;overflow: hidden;min-width: 1000px;background: white; box-sizing:border-box;height:92px;border-bottom: 2px solid #00ce9f;}
  .login_NavBox{margin: 0 auto;height: 100%;overflow: hidden;background: white;}
  .login_Logo{float: left;}
  .login_Dowload{float: right; color: #00ce9f;cursor: pointer;width: 102px;height: 31px;border-radius: 16px; box-sizing: border-box;margin:30px auto;border: 1px solid #00ce9f;line-height: 30px;text-align: center;font-size: 16px;margin-right: 12px; }
  .login_floor{float: left;width: 100%;height: 895px;position: relative;}
  .login_first{float: left;width: 100%;}
  .login_second{background: url("/static/common/images/login/bg2.jpg")center center no-repeat;background-size:  cover;overflow: hidden;}
  .login_third{background: url("/static/common/images/login/bg3.jpg")center center no-repeat;background-size:  cover;}
  .login_fourth{background: url("/static/common/images/login/bg4.jpg")center center no-repeat;background-size:  cover;height: 1073px;}
  .login_mode{position: absolute;top: 100px;left: 0;right: 0;margin: auto;}
  .fc00c{color: #00ce9f!important;}
  .Pagination{position: fixed;right: 15px;top: 0;bottom: 0;margin: auto;width: 22px;z-index: 15;}
  .Pagination li{width: 12px;height: 12px;cursor: pointer;margin: 15px 5px; border-radius: 100%;float: left;box-sizing: border-box;background: #959595; filter: alpha(opacity=0.6); opacity: .6; }
  .login_ThisPage{background: #00ce9f!important;}
  .LunPic{float: left;width: 100%;height: 600px;}
  /*一楼*/
  /*二楼*/
  .login_SecMain{width: 450px;height: 540px; overflow: hidden;float: left; border-radius: 10px;border: 1px solid #f1f1f1; box-sizing: border-box;background: white;position: absolute;bottom: 120px;}
  .login_SecLeft{left: -500px;opacity: 0;}
  .login_SecRight{right: -500px;opacity: 0;transform: rotate(0deg);}
  .login_SecImgBox{width: 450px;height: 300px;position: relative;perspective: 800px;transform: rotate(0deg);overflow: hidden;}
  .login_SecImgBox>img{height: 100%;width: auto;transition: all 0.6s;}
  .login_SecImgBox:hover img{transform: scale(1.2);}
  .login_SecMask{position: absolute;background: black; background: rgba(0,0,0,0.4);color: white;font-size: 28px; text-align: center; width: 450px;height:300px;line-height: 300px;position: absolute;left: 0;top: 0;}
  .login_SecIntro{width: 100%;float: left;box-sizing: border-box;padding:0 25px;}
  .login_SecIntro li{width: 100%;float: left;box-sizing: border-box;margin-top: 15px;}
  .login_SecLine{width: 100%;line-height: 30px;font-size: 16px;text-align: left;font-weight: bold;color: #333;}
  .login_SecCon{width: 100%;line-height: 30px;font-size: 16px;text-align: left;color: #636363;}
  /*三楼*/
  .login_ThreeMain{width: 1000px;position: absolute;left: 0;right: 0;top: 235px;min-height: 750px; margin: auto; }
  .login_ThreeTab{float: left;width: 100%;height: 40px;box-sizing: border-box;margin-bottom: 70px;}
  .login_ThreeTab li{float: left;width: 50%;height: 40px;box-sizing: border-box;overflow: hidden;}
  .login_ThreeTab li p{overflow: hidden;margin: auto; width: 40%;height: 40px;cursor: pointer; text-align: center;line-height: 30px; border-bottom: 3px solid #007a69;font-size: 28px;color: #007b6a;  box-sizing: border-box;}
  .login_ThreeTab .login_ThisTab{border-bottom: 3px solid white;color: white;}
  /***************************************老师**********************************/
  .login_tRound{width: 500px;position: absolute;top: 100px; left: 0; transform-origin:50% 50%; height: 500px; float: left;perspective: 800px;background-size: cover;}
  .login_tRound li{width: 100px;margin: 50px; height: 100px;position: absolute;transform-origin:center center;  z-index: 2;background-size: cover;background-position: center center;background-repeat: no-repeat; }
  .login_tRound li:nth-child(1){top: 0;left: -20px;right: 0;margin: auto;}
  .login_tRound li:nth-child(2){top: 79px;right: -35px;}
  .login_tRound li:nth-child(3){bottom: -17px;right: 23px;}
  .login_tRound li:nth-child(4){bottom: -17px;left: 40px;}
  .login_tRound li:nth-child(5){top: 95px;left: -44px;}
  .login_tCircle>img{cursor: pointer;}
  /*老师头像*/
  .login_tRound li:nth-child(6){width: 200px;height: 200px;z-index: 3;transform-origin:center center;  position: absolute;top: 0;right: 0;left: 0;bottom: 0;margin: auto;background: url("/static/common/images/login/teacher.png");}
  /*大圆盘背景*/
  .login_tRound li:nth-child(7){z-index: 1; width: 500px;height: 500px;transform-origin:center center; animation: BigRun 10s linear infinite;  position: absolute;top: 0;right: 0;left: 0;bottom: 0;margin: auto; background: url("/static/common/images/login/round.png");}
  .login_tPic{position: absolute;top: 0;left: 0;}
  .login_tInTro{ height: 105px;display: none; position: absolute;float: left; z-index: 1; width: 700px;left: 450px; top: 160px;}
  .login_tLine{margin-right: 20px;margin-top: 45px;float: left;}
  .login_tInTroBox{  min-width:200px;float: left; height: 105px;overflow: hidden;padding-right: 35px; box-sizing: border-box;border: 1px solid #dfdfdf;border-radius: 15px;background: white; }
  .login_tInTroNum{width: 100px;height:103px;text-align: center; font-size: 90px;font-family: 'Arial';font-weight: bold;color: #00ce9f; float: left;position: relative;background: white; }
  .login_Xline{position: absolute;bottom: 5px;right: 15px;z-index: 5;}
  .login_InTxt{ width: 295px;float: left;height: 100%;padding: 10px 0;box-sizing: border-box;}
  .login_tTitle{width: 100%;float: left;font-size: 28px;color: #333;line-height: 40px;}
  .login_tSubhead{width: 100%;float: left;font-size: 16px;color: #636363;line-height: 20px;}
  .login_tText{width: 100px;  text-align: center;  line-height: 30px;  color: #333;  position: absolute; bottom: -30px;left: 0; }
  /***************************************学生**********************************/
  .login_sRound{width: 500px;position: absolute;top: 100px; right:0;: 0; transform-origin:50% 50%; height: 500px; float: left;perspective: 800px;background-size: cover;}
  .login_sRound li{width: 100px;margin: 50px; height: 100px;position: absolute;transform-origin:center center;  z-index: 2;background-size: cover;background-position: center center;background-repeat: no-repeat; }
  .login_sRound li:nth-child(1){top: 0;left: -20px;right: 0;margin: auto;}
  .login_sRound li:nth-child(2){top: 79px;right: -35px;}
  .login_sRound li:nth-child(3){bottom: -17px;right: 23px;}
  .login_sRound li:nth-child(4){bottom: -17px;left: 40px;}
  .login_sRound li:nth-child(5){top: 95px;left: -44px;}
  .login_sCircle>img{cursor: pointer;}
  /*老师头像*/
  .login_sRound li:nth-child(6){width: 200px;height: 200px;z-index: 3;transform-origin:center center;  position: absolute;top: 0;right: 0;left: 0;bottom: 0;margin: auto;background: url("/static/common/images/login/Stu.png");}
  /*大圆盘背景*/
  .login_sRound li:nth-child(7){z-index: 1; width: 500px;height: 500px;transform-origin:center center; animation: BigRun 10s linear infinite;  position: absolute;top: 0;right: 0;left: 0;bottom: 0;margin: auto; background: url("/static/common/images/login/round.png");}
  .login_sPic{position: absolute;top: 0;left: 0;}
  .login_sInTro{ height: 105px; position: absolute;float: left; z-index: 1; width: 700px;left: -50px; top: 172px;}
  .login_sLine{margin-left: 20px;margin-top: 45px;float: left;}
  .login_sInTroBox{  min-width:200px;float: left; height: 105px;overflow: hidden;padding-right: 35px; box-sizing: border-box;border: 1px solid #dfdfdf;border-radius: 15px;background: white; }
  .login_sInTroNum{width: 100px;height:103px;text-align: center; font-size: 90px;font-family: 'Arial';font-weight: bold;color: #00ce9f; float: left;position: relative;background: white; }
  .login_sTitle{width: 100%;float: left;font-size: 28px;color: #333;line-height: 40px;}
  .login_sSubhead{width: 100%;float: left;font-size: 16px;color: #636363;line-height: 20px;}
  .login_sText{width: 100px;  text-align: center;  line-height: 30px;  color: #333;  position: absolute; bottom: -30px;left: 0; }
  /**************************************四楼*********************************/
  .login_FourMain{margin: 0 auto;width: 1100px;height: 100%;position: relative;}
  .login_Phone{height: 525px;position: absolute; left: 225px; top:0;bottom: 0;margin: auto; width: 253px;background: url("/static/common/images/login/phone.png") center center no-repeat;background-size: cover;}
  .login_PhoneBox{float: left;width: 220px;height: 393px;overflow: hidden;position: absolute;top: 56px;left:0;right: 0;margin: auto;}
  .login_Hander{position: absolute;bottom: 0;z-index: 5;left: 50px;}
  .login_DownBox{position: absolute;top: 0;bottom: 0;right: 50px;margin: auto;}
  @media screen and (max-width:1366px){
    .login_NavBox{width: 900px;}
  }
  @media screen and (min-width:1366px){
    .login_NavBox{width: 1000px;}
  }
  @media screen and (min-width:1600px){
    .login_NavBox{width: 1200px;}
  }
</style>
<style id="NewStyle"></style>
<style id="NewStyle1"></style>
