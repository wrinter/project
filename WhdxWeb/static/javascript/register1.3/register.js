/****************************************Created by 徐扬 on 2017/05/5.*****************************************/
CheckBrower();//检测浏览器版本
/******************************注册公共部分********************************/
AppDowload();
function AppDowload() {
    $('#First_Dowload').on('click',function () {
        window.location.href='../../index.html?AppDoload='+true;
    })
}
//用户类型
UserType();
function UserType() {
    store.set('RegUserType',0);
    $('#Teacher').on('click',function () {
        store.set('RegUserType',0);
        $(this).removeClass('reico0').addClass('reico1')
        $('#Student').removeClass('reico1').addClass('reico0')
    })
    $('#Student').on('click',function () {
        store.set('RegUserType',1);
        $(this).removeClass('reico0').addClass('reico1')
        $('#Teacher').removeClass('reico1').addClass('reico0')
    })
}
//短信验证码时间转换
function BtnWaitTime(Btn,TimeMsg,SecBox) {
    $(TimeMsg).css("display","block");
    $(Btn).css("display","none").html('获取短信验证码');
    var Timer=null;
    if(Timer){clearInterval(Timer);}
    var Sec=60;
    $(SecBox).html(60)
    Timer=setInterval(function () {
        Sec--;
        $(SecBox).html(Sec);
        if(Sec==0){
            clearInterval(Timer);
            $(TimeMsg).css("display","none");
            $(Btn).css("display","block").html('重新获取验证码');
        }
    },1000)
}
//文本框输入错误重置
ErrorReset();
function ErrorReset() {
    $('#Phone').bind('click mousedown',function(){$('#PhoneError').html('');});
    $('#Code').bind('click mousedown',function(){$('#CodeError').html('');});
    $('#MsgCode').bind('click mousedown',function(){$('#MsgError').html('');});
    $('#Pass0').bind('click mousedown',function(){$('#PassError0').html('');});
    $('#Pass1').bind('click mousedown',function(){$('#PassError1').html('');});
    $('#TeaName').bind('click mousedown',function(){$('#TeaNameError').html('');});
    $('#StuName').bind('click mousedown',function(){$('#StuNameError').html('');});
    $('#StuName0').bind('click mousedown',function(){$('#StuNameError0').html('');});
    $('#ClassCode').bind('click mousedown',function(){$('#ClassCodeError').html('');});
}
//检测手机号格式
function CheckMobile() {
    var pat=/^(13|14|19|15|18|17)[0-9]{9}$/;//手机号格式正则表达式
    $('#Phone').on('blur',function(){
        if($('#Phone').val()!=''){
            if(pat.test($('#Phone').val())==false){
                $('#PhoneError').html('手机号格式错误');
            }
            else {
                $('#PhoneError').html('');
                CheckMobileNot();
            }
        }
    });
}
//检测手机号是否存在
function CheckMobileNot() {
    var subData = {};
    subData.mobile = $('#Phone').val();
    $.ajax({
        "type":"post",
        "url":"/web/user/check/mobile/not",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum!=0){
                $('#PhoneError').html('用户已存在');
            }
        }
    })
}
//获取验证码
GetCodeImg();
function GetCodeImg() {
    $.ajax({
        "type":"post",
        "url":"/web/common/captcha",
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                $("#CodeImg").attr("src",data.retData);
            }
            else{
                $('#CodeError').html('验证码获取失败，请重试');
            }
        }
    });
}
//更换验证码
ChangeCode();
function ChangeCode() {
    $('#ChangeCode').on('click',function () {
        GetCodeImg();
    })
};
//是否能够获取短信验证码
function BeforeGetSMS(){
    $('#GetMsgBtn').on('click',function(){
        if($('#Phone').val()==''){$('#PhoneError').html('请填写手机号');}
        else {
            if($('#Code').val()==''){$('#CodeError').html('请输入图形验证码');}
            else {
                /*只有当验证码有值，手机号正确才发送验证码*/
                if($('#PhoneError').html()==''){
                    GetSmsMsg();
                }
            }
        }
    })
};
//获取短信验证码
function GetSmsMsg() {
    $('#CodeError').html('');
    var subData = {};
    subData.imageCaptcha = $('#Code').val();
    subData.mobile = $('#Phone').val();
    /*验证手机号和图形验证码*/
    $.ajax({
        "type": "post",
        "url": " /web/common/sms",
        "dataType": "json",
        "data": subData,
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (data.retCode == 2001) {
                $('#CodeError').html('验证码错误');
                GetCodeImg();
            }
            else if (data.retCode == 2203){
                $('#CodeError').html('验证码错误');
                GetCodeImg();
            }
            else if (data.retCode == 2301){
                $('#MsgError').html('60秒内只能发送一次');
            }
            else if (codenum == 0) {
                $('#CodeError').html('');
                BtnWaitTime('#GetMsgBtn','#DisGetMsg','#GetMsgSec')
            }
            else {}
        }
    });
};
//检查密码格式
function CheckPassInfo(){
    /*第一次输入密码判断*/
    $('#Pass0').blur(function(){
        if($('#Pass0').val().length<6&&$('#Pass0').val()!=''){
            $('#PassError0').html('请填写6~16个字符');
        }
        else {
            $('#PassError0').html('');
        }
    });
    /*验证两次密码是否一致*/
    $('#Pass1').blur(function(){
        if($('#Pass1').val()!=$('#Pass0').val()){
            $('#PassError1').html('请输入相同密码');
        }
        else {
            $('#PassError1').html('');
        }
    });
};
//点击进入下一步
function StepToNext(){
    $('#RetStep1').on('click',function(){

        if($('#Pass0').val().length==0){$('#PassError0').html('请输入密码');}
        if($('#Pass1').val().length==0){$('#PassError1').html('请输入确认密码');}
        if($('#Phone').val().length==0){$('#PhoneError').html('请填写手机号');}
        if($('#MsgCode').val().length==0){$('#MsgError').html('请输入短信验证码');}
        var IsCanCheckSms=($('#PassError0').html()==''&&$('#PassError1').html()==''&&$('#MsgError').html()=='');
        if(IsCanCheckSms){
            CheckSmsInfo();
        }
    });
};
//检测验证码是否正确
function CheckSmsInfo(){
    var subData = {};
    subData.smsCaptcha = $('#MsgCode').val();
    subData.mobile = $('#Phone').val();
    $.ajax({
        "type":"post",
        "url":"/web/common/sms/check",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var Type=store.get('RegUserType');//判断进入老师下一步还是学生下一步  0：老师 1：学生
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                if(Type==0){
                    $('#Step1').css('display','none');
                    $('#TeacherStep2').fadeIn(150);
                }
                if(Type==1){
                    $('#Step1').css('display','none');
                    $('#StuStep2').fadeIn(150);
                }
            }
            else {
                $('#MsgError').html('短信验证码错误');
            }
        }
    });

};
//退出登录
function Quit(){
    $.ajax({
        "type":"get",
        "url":"/web/user/logout?"+Math.random(),
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;

        }
    })
};
//注册成功自动登录
function AutoLogIn(Mobile,Pass,Img){
    Quit();
    var subData = {};
    subData.mobile = $(Mobile).val();
    subData.password = $.md5($(Pass).val());
    subData.imageCaptcha = $(Img).val();
    $.ajax({
        "type":"post",
        "url":"/web/user/login",
        "dataType":"json",
        "data":subData,
        success:function(data){
            store.set('data', data);//将目录存储到本地
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if (codenum==0){
                if(data.retData.userType=='1'||data.retData.userType==1){
                    store.set('UserHeadImgSrc','../../static/image/me/user.png');
                    setTimeout(function(){
                        window.location.href="../../../model/index/indexX.html";
                    },1000)
                }
                if(data.retData.userType=='2'||data.retData.userType==2){
                    store.set('UserHeadImgSrc','../../static/image/common/user.png');
                    setTimeout(function(){
                        window.location.href="../../../student/model/index/index.html";
                    },1000)
                }
            }
            else {
                $('#c_ErrorMsg').html('登陆失败,请重试').fadeIn(200);Disappear("#c_ErrorMsg");
                window.location.href="../../../index.html";
            }
        }
    })
};
/******************************注册第一步********************************/
//检测手机号格式
CheckMobile();
//是否能够获取短信验证码
BeforeGetSMS();
//检查密码格式
CheckPassInfo();
//点击进入下一步
StepToNext();
/******************************教师第二步********************************/
SelectOption();
function SelectOption() {
    $('.r_SelectBox').on('click',function (e) {
        stopBubble(e);
        $(this).find('.r_SelectList').slideToggle(200);
        $(this).parents().siblings().find('.r_SelectList').slideUp(200);
        $(this).parents().siblings().find('.NeedChange').removeClass('dico1').addClass('dico0');
        if($(this).attr('data-status')==0||$(this).attr('data-status')=='0'){
            $(this).attr('data-status',1).find('.NeedChange').removeClass('dico0').addClass('dico1');
        }else {
            $(this).attr('data-status',0).find('.NeedChange').removeClass('dico1').addClass('dico0');
        }
    });
    document.addEventListener('click',function(e){
        if(e.target.className.indexOf("r_SelectBox")==-1){
            $(".r_SelectList").slideUp(200);
            $('.r_SelectBox').attr('data-status',0)
            $(".dico1").removeClass('dico1').addClass('dico0');
        }
    });
}
//获取学科
GetSubject()
function GetSubject() {
        $.ajax({
        "type":"post",
        "url":" /web/common/subject",
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData=data.retData;
            if(codenum==0){
                CreatSubject(AllData)
            }
        }
    });
}
//创建学科
function CreatSubject(data) {
    if(data==null||data==''){
        $('#SubjectCon').html('暂无学科')
    }else {
        var $SubjectHtml='';
        $('#SubjectCon').html(data[0].label).attr({'data-Id':data[0].value,'title':data[0].label});
        var DefultId=data[0].value;
        GetMaterial(DefultId);
        for(var i=0;i<data.length;i++){
            $SubjectHtml+='<li data-Id="'+data[i].value+'">'+data[i].label+'</li>';
        }
        $('#Subject').html($SubjectHtml);
        SubjectChoice()
    }
}
//学科选择
function SubjectChoice() {
    $('#Subject li').on('click',function (e) {
        stopBubble(e);
        var Id=$(this).attr('data-Id');
        var Con=$(this).html();
        $('#SubjectCon').html(Con).attr({'data-Id':Id,'title':Con});
        $(".r_SelectList").slideUp(200);
        $('.r_SelectBox').attr('data-status',0)
        $(".dico1").removeClass('dico1').addClass('dico0');
        GetMaterial(Id)
    });
}
//获取教材
function GetMaterial(SubjectId) {
    var SubData={}
    SubData.subjectId=SubjectId;
    $.ajax({
        "type": "post",
        "url": " /web/common/material",
        "dataType": "json",
        'data': SubData,
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            var AllData = data.retData;
            if (codenum == 0) {
                CreatMaterial(AllData)
            }
        }
    })
}
//创建教材
function CreatMaterial(data) {
    if(data==null||data==''){
        $('#MaterialCon').html('暂无教材');
    }else {
        var $Material='';
        $('#MaterialCon').html(data[0].name).attr({'data-Id':data[0].id,'data-grade':data[0].grade,'title':data[0].name});
        store.set('UserGradeId',data[0].grade)
        for(var i=0;i<data.length;i++){
            $Material+='<li data-Id="'+data[i].id+'" data-grade="'+data[i].grade+'" title="'+data[i].name+'">'+data[i].name+'</li>';
        }
        $('#Material').html($Material);
        MaterialChoice()
    }
}
//教材选择
function MaterialChoice() {
    $('#Material li').on('click',function (e) {
        stopBubble(e);
        var Id=$(this).attr('data-Id');
        var Con=$(this).html();
        var Grade=$(this).attr('data-grade');
        $('#MaterialCon').html(Con).attr({'data-Id':Id,'title':Con,'data-grade':Grade});
        store.set('UserGradeId',Grade)
        $(".r_SelectList").slideUp(200);
        $('.r_SelectBox').attr('data-status',0)
        $(".dico1").removeClass('dico1').addClass('dico0');
    });
}
//获取版本
GetPress();
function GetPress() {
        $.ajax({
        "type":"post",
        "url":" /web/common/press",
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData=data.retData;
            if(codenum==0){
                CreatPress(AllData)
            }
        }
    });
}
//创建版本
function CreatPress(data){
    var $Press='';
    for(var i=0;i<data.length;i++){
        if(data[i].isDefault=='1'||data[i].isDefault==1){
            $('#r_SelectCon').html(data[i].name).attr({'data-Id':data[i].id,'title':data[i].name});
        }
        $Press+='<li data-Id="'+data[i].id+'"  title="'+data[i].name+'">'+data[i].name+'</li>';
    }
    $('#Press').html($Press);
};
//教师完成注册
TeacherRegDone();
function TeacherRegDone(){
    $('#RetStep2').on('click',function(){
        if($('#TeaName').val()==''){
            $('#TeaNameError').html('请输入姓名');
        }
        else {
            SaveTeacherInfo();
        }
    })
}
//数据重置
function DataReset() {
    $('#Phone').val('');
    $('#Code').val('');
    $('#MsgCode').val('');
    $('#Pass0').val('');
    $('#Pass1').val('');
    $('#TeaName').val('');
    $('#PhoneError').html('');
    $('#CodeError').html('');
    $('#MsgError').html('');
    $('#PassError0').html('');
    $('#PassError1').html('');
}
//保存教师注册信息
function SaveTeacherInfo(){
    var subData = {};
    // 教材
    subData.materialId=$('#MaterialCon').attr('data-Id');
    // 手机号
    subData.mobile=$('#Phone').val();
    // 姓名
    subData.name=$('#TeaName').val();
    // 密码
    subData.password=$.md5($('#Pass1').val());
    // 短信验证码
    subData.smsCaptcha=$('#MsgCode').val();
    // 学科
    subData.subjectId=$('#SubjectCon').attr('data-Id');
    $.ajax({
        "type":"post",
        "url":" /web/user/register/teacher",
        "dataType":"json",
        'data':subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData=data.retData;
            if(codenum==0){
                $('#c_ErrorMsg').html('恭喜您注册成功，即将跳转首页').fadeIn(200);
                GoldAnimate(data.retGold);
                setTimeout(function(){
                    $('#c_ErrorMsg').fadeOut(200);
                    AutoLogIn('#Phone','#Pass1','#Code');
                },1000)
            }
            else {
                $('#c_ErrorMsg').html('注册失败,请重试').fadeIn(200);Disappear("#c_ErrorMsg");
                $('#TeacherStep2').css('display','none');
                DataReset();//数据重置
                $('#Step1').fadeIn(150);
            }
        }
    });
}
/******************************学生第二步********************************/
CodeSelect();
function CodeSelect() {
    $('#HasCode').on('click',function () {
        $('#IsHasCode').css('display','block');
        $('#IsNoCode').css('display','none');
        $(this).removeClass('reico0').addClass('reico1 IsThis');
        $('#NoCode').removeClass('reico1').addClass('reico0')
    })
    $('#NoCode').on('click',function () {
        $('#IsHasCode').css('display','none');
        $('#IsNoCode').css('display','block');
        $(this).removeClass('reico0').addClass('reico1')
        $('#HasCode').removeClass('reico1 IsThis').addClass('reico0')
    })
}
// 获取年级
GetGrade()
function GetGrade(){
    $.ajax({
        "type":"post",
        "url":" /web/common/grade",
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData=data.retData;
            if(codenum==0){
                CreatGrade(AllData)
            }
        }
    });
}
// 创建年级
function CreatGrade(data){
    var $GradeHtml='';
    $('#StuGradeCon').html(data[0].label).attr('data-Id',data[0].value);
    for(var i=0;i<data.length;i++){
        $GradeHtml+='<li data-Id="'+data[i].value+'">'+data[i].label+'</li>';
    }
    $('#StuGrade').html($GradeHtml);
    GradeChoice();

};
//年级选择
function GradeChoice() {
    $('#StuGrade li').on('click',function (e) {
        stopBubble(e);
        var Id=$(this).attr('data-Id');
        var Con=$(this).html();
        $('#StuGradeCon').html(Con).attr({'data-Id':Id});
        $(".r_SelectList").slideUp(200);
        $('.r_SelectBox').attr('data-status',0)
        $(".dico1").removeClass('dico1').addClass('dico0');
    });
};
// 学生注册完成
StudentRegDone();
function StudentRegDone(){
    $('#RetStep3').on('click',function(){
        var IsThis=$('#HasCode').hasClass('IsThis');
        if(IsThis){
            if($('#ClassCode').val()==''){$('#ClassCodeError').html('请输入班级码')}
            if($('#StuName').val()==''){$('#StuNameError').html('请输入姓名')}
            if($('#StuName').val()!=''&&$('#ClassCode').val()!=''){
                SaveStudent('StuName',true);
            }
        }
        else {
            if($('#StuName0').val()==''){$('#StuNameError0').html('请输入姓名')}
            else {
                SaveStudent('StuName0',false);
            }
        }
    });
};
// 保存学生信息
function SaveStudent(StudentName,isClassCode){
    var SubData={};
    /*姓名*/
    SubData.name =$('#'+StudentName).val();
    /*班级代码*/
    SubData.classCode =$('#ClassCode').val();
    /*年级ID*/
    SubData.gradeId=$('#StuGradeCon').attr('data-Id');
    /*是否存在班级代码*/
    SubData.isClassCode=isClassCode;
    /*手机号*/
    SubData.mobile=$('#Phone').val();
    /*密码*/
    SubData.password=$.md5($('#Pass1').val());
    /*出版社*/
    SubData.pressId=$('#r_SelectCon').attr('data-Id');
    /*短信验证码*/
    SubData.smsCaptcha=$('#MsgCode').val();
    $.ajax({
        "type":"post",
        "url":" /web/user/register/student",
        "dataType":"json",
        "data":SubData,
        success:function(data){
            console.log(data);
            var codenum =parseInt(data.retCode.substr(0, 1));
            if(codenum==0){
                $('#ClassCodeError').html('')
                $('#c_ErrorMsg').html('恭喜您注册成功，即将跳转首页').fadeIn(200);
                GoldAnimate(data.retGold);
                setTimeout(function(){
                    $('#c_ErrorMsg').fadeOut(200);
                    AutoLogIn('#Phone','#Pass1','#Code');
                },1000)
            }
            else if(codenum==2){
                $('#ClassCodeError').html('班级码不存在')
            }
            else {
                $('#c_ErrorMsg').html('注册失败,请重试').fadeIn(200);Disappear("#c_ErrorMsg");
                StuDataReset();
                $('#StuStep2').css('display','none');
                $('#Step1').fadeIn(150);

            }
        }
    });
};
function StuDataReset() {
    $('#Phone').val('');
    $('#Code').val('');
    $('#MsgCode').val('');
    $('#Pass0').val('');
    $('#Pass1').val('');
    $('#StuName').val('');
    $('#StuName0').val('');
    $('#ClassCode').val('');
    $('#ClassCodeError').html('');
    $('#StuNameError').html('');
    $('#StuNameError0').html('');
}
