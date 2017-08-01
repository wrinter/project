/*** Created by 徐扬 on 2017/4/27.*/
/*************************图片轮播动画*******************************/
//图片轮播swiper
var InSwiper=new Swiper('#InMain',{
    height : window.innerHeight,
    pagination : '#LitterPage',
    paginationClickable :true,
    autoplay:3000,
    speed:1500,
    loop : true,
});
GoDownload();
//跳转下载
function GoDownload() {
    $('#First_Dowload').on('click',function () {
        var PageTop=$('.Pag').eq(3).position().top;
        $('body,html').animate({ scrollTop: PageTop }, 500);
        $('#Pagination li').eq(3).addClass('ThisPage').siblings().removeClass();
    })
}
//创建进度条
CreatPage(0);
function CreatPage(Index) {
    var PageNum=$('.Pag').size();
    var AutoHeight=PageNum*42;
    var $Page='';
    for(var i=0;i<PageNum;i++){
        $Page+='<li></li>';
    }
    $('#Pagination').html($Page).css('height',AutoHeight+"px");
    $('#Pagination li').eq(Index).addClass('ThisPage').siblings().removeClass();
    PageClick();
    setInterval(function () {
        var ScroolTop=$(window).scrollTop();
        var NowIndex=0;
        if(ScroolTop<690){  NowIndex=0;}
        else if(ScroolTop<1585){  NowIndex=1;}
        else if(ScroolTop<2480){  NowIndex=2;}
        else {  NowIndex=3;}
        $('#Pagination li').eq(NowIndex).addClass('ThisPage').siblings().removeClass();
    },1)
};
function PageClick() {
    $('#Pagination li').off('click');
    $('#Pagination li').on('click',function () {
        var Index=$(this).index();
        var PageTop=$('.Pag').eq(Index).position().top;
        $('body,html').animate({ scrollTop: PageTop }, 500);
        $('#Pagination li').eq(Index).addClass('ThisPage').siblings().removeClass();
    })
}
AppDownLoad();//App下载
function AppDownLoad() {
    var App=Request.AppDoload;
    if(App){
        var Index=3;
        var PageTop=$('.Pag').eq(Index).position().top;
        $('body,html').animate({ scrollTop: PageTop }, 1);
        $('#Pagination li').eq(Index).addClass('ThisPage').siblings().removeClass();
    }
}
/*************************二楼封装*******************************/
SecondFloor();
function SecondFloor() {
    var SecTime=null;
    if(SecTime){clearInterval(SecTime)}
    SecTime=setInterval(function () {
        if($(window).scrollTop()>200){
            WinResize(); //屏幕变化重新设置偏移
            EnterAnimate();//进入开始动画
            clearInterval(SecTime)
        }
    },1);
}
//计算位移
function CountDistance() {
    var WinW=$(window).width();
    if(WinW<1024){WinW=1000;}
    var Distance=(WinW-900-100)/2+'px';
    return Distance;
}
//屏幕变化重新设置偏移
function WinResize(){
    $(window).resize(function () {
        var Distanc=CountDistance();
        $('#Echo_FLeft2').css('left',Distanc);
        $('#Echo_FRight2').css('right',Distanc)
    });
}
//进入开始动画
function EnterAnimate(){
    var Distanc=CountDistance();
    $('#Echo_FLeft2').animate({'left':Distanc,'opacity':'1'},700,function () {
        $('#Echo_FLeft2').css('left',Distanc);
    });
    $('#Echo_FRight2').animate({'right':Distanc,'opacity':'1'},700,function () {
        $('#Echo_FRight2').css('right',Distanc);
    });
}
/*************************三楼动画封装*******************************/
//三楼封装
var Gradually=0,Gradually1=0;
var Timer0,Timer1,Timer2,Timer3=null;
SteTab()
function SteTab() {
    $('.ThreeTab p').on('click',function () {
        $(this).addClass('ThisTab').parents('li').siblings('li').find('p').removeClass();
        var ThisNum=parseInt($(this).attr('data-Num'));
        if(ThisNum==1){
            $('#TeacherTab').css('display','none');
            $('#StuTab').fadeIn(200);
            //学生背景
            $('#OutSlide3').css({'background':'url("../../../static/image/login1.3/bg31.jpg")center center no-repeat'});
        }else {
            $('#StuTab').css('display','none');
            $('#TeacherTab').fadeIn(200);
            //教师背景
            $('#OutSlide3').css({'background':'url("../../../static/image/login1.3/bg3.jpg")center center no-repeat'});
        }

    })
}
TeaRunning();//老师旋转动画
function TeaRunning(){
    if(Gradually==360){Gradually=0;}
    if(Timer0){clearTimeout(Timer0)}
    if(Timer1){clearTimeout(Timer1)}
    $('#Round').css({'animation':'','transform':'rotate('+Gradually+'deg)'});
    $('.Circle').css({'animation':'','transform':'rotate('+(-Gradually)+'deg)'});
    $('.TeacherCicle').css({'animation':'','transform':'rotate('+(-Gradually)+'deg)'});
    $('#ThreeInTro').fadeOut(0)
    Gradually+=72;
    var StartRun = "@keyframes GoRun {to{transform:rotate("+Gradually+'deg'+");}}"
    var DefultRun = "@keyframes DefultRun {to{transform:rotate("+(-Gradually)+'deg'+");}}";
    var $Style= StartRun+DefultRun;
    $('#NewStyle').html($Style);
    Timer0=setTimeout(function () {
        $('#ThreeInTro').fadeIn(2000);
        $('#Round').css({'animation':'GoRun 1s linear 1 forwards'}).attr('data-rotate',Gradually);
        $('.Circle').css({'animation':'DefultRun 1s linear 1 forwards'});
        $('.TeacherCicle').css({'animation':'DefultRun 1s linear 1 forwards'});
    },100);
    Timer1=setTimeout(function (){
        var value=$('#Round').attr('data-rotate')
        CreatTeaIntro(value)
        TeaRunning();
    },6000);
}
//创建三楼文案
function CreatTeaIntro(value) {
    //前沿素材
    if(value%72==0){
        $('#IntroNum').html(2);
        $('#ThreeInTitle').html("前沿素材");
        $('#ThreeSubhead').html("前沿素材、拓展知识、方法技巧随时调用");
    }
    if(value%144==0){
        $('#IntroNum').html(3);
        $('#ThreeInTitle').html("智能批改");
        $('#ThreeSubhead').html("系统智能批改作业，数据即时反馈，批改作业不再是您的最大负担");
    }
    if(value%216==0){
        $('#IntroNum').html(4);
        $('#ThreeInTitle').html("一键布置");
        $('#ThreeSubhead').html("教辅作业、分层作业，可一键布置，也可编辑加工，适合自己的才是最好的");
    }
    if(value%288==0){
        $('#IntroNum').html(5)
        $('#ThreeInTitle').html("个性讲学");
        $('#ThreeSubhead').html("课前汇总个性数据，课堂实现个性讲学");
    }
    if(value%360==0){
        $('#IntroNum').html(1);
        $('#ThreeInTitle').html("高效备课");
        $('#ThreeSubhead').html("为您推荐优质课件、微课、教案、典例、试题等，一键下载，备课不愁找资源");
    }
};
StuRunning();//学生旋转动画
function StuRunning(){
    if(Gradually1==(-360)){Gradually1=0;}
    if(Timer2){clearTimeout(Timer2)}
    if(Timer3){clearTimeout(Timer3)}
    $('#Round1').css({'animation':'','transform':'rotate('+Gradually1+'deg)'});
    $('.Circle1').css({'animation':'','transform':'rotate('+(-Gradually1)+'deg)'});
    $('.StuCicle').css({'animation':'','transform':'rotate('+(-Gradually1)+'deg)'});
    $('#ThreeInTro1').fadeOut(0)
    Gradually1-=72;
    var StartRun = "@keyframes StuGoRun {to{transform:rotate("+Gradually1+'deg'+");}}"
    var DefultRun = "@keyframes StuDefultRun {to{transform:rotate("+(-Gradually1)+'deg'+");}}";
    var $Style= StartRun+DefultRun;
    $('#NewStyle1').html($Style);
    Timer2=setTimeout(function () {
        $('#ThreeInTro1').fadeIn(2000);
        $('#Round1').css({'animation':'StuGoRun 1s linear 1 forwards'}).attr('data-rotate',Gradually1);
        $('.Circle1').css({'animation':'StuDefultRun 1s linear 1 forwards'});
        $('.StuCicle').css({'animation':'StuDefultRun 1s linear 1 forwards'});
    },100);
    Timer3=setTimeout(function (){
        var value=$('#Round1').attr('data-rotate')
        CreatStuIntro(value)
        StuRunning();
    },6000);
}
//创建三楼文案
function CreatStuIntro(value) {
    //前沿素材
    if(value%72==0){
        $('#StuIntroNum').html(2);
        $('#StuInTitle').html("翻转学习");
        $('#StuSubhead').html("国家级视频配套导学案，名师带你高效预习");
    }
    if(value%144==0){
        $('#StuIntroNum').html(3);
        $('#StuInTitle').html("构建图谱");
        $('#StuSubhead').html("准确定位学情，构建专属知识图谱，让你哪里不会点哪里");
    }
    if(value%216==0){
        $('#StuIntroNum').html(4);
        $('#StuInTitle').html("名师助考");
        $('#StuSubhead').html("名师整合备考资源，有针对性指导备考");
    }
    if(value%288==0){
        $('#StuIntroNum').html(5)
        $('#StuInTitle').html("补偿训练");
        $('#StuSubhead').html("依据智能诊断数据，个性推送补偿训练");
    }
    if(value%360==0){
        $('#StuIntroNum').html(1);
        $('#StuInTitle').html("即时反馈");
        $('#StuSubhead').html("我的训练智能批改，提交即时有反馈");
    }
};
/*************************四楼动画封装*******************************/
//四楼动画
Hander();
var PicSwiper=new Swiper('#PhoneBox',{
    height : window.innerHeight,
    speed:300,
    loop : true,
});
function Hander() {
    setInterval(function () {
        $('#Hander').animate({'left':'-30px'},500,function () {
            PicSwiper.slideNext();
            $('#Hander').css('left','30px');
        })
    },3500);
}
ShowWeixinCode();
