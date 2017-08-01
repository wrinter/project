/****************************************Created by 徐扬 on 2016/12/6.*****************************************/
CheckBrower();
function CheckTimeOut(){}
/******************************注册公共部分********************************/
    /*手机号正则*/
var pat=/^(13|14|19|15|18|17)[0-9]{9}$/;
/*绝对居中*/
function Center(){
    setInterval(function(){
        var TH=$('#TeacherStep1').outerHeight();
        var SH=$('#StudentStep1').outerHeight();
        var LCH=$('#LoginCenter').outerHeight();
        var TCH=$('#TeacherReg').outerHeight();
        var Tt=(LCH-TCH)/2;
        var Mt=(LCH-TH)/2;
        var St=(LCH-SH)/2;
        $('#TeacherStep1').css({"margin-top":Mt-Tt});
        $('#StudentStep1').css({"margin-top":St-Tt});
        var Cw=$('#IsCode').outerWidth();
        var Sw=$('#StudentStep2').outerWidth();
        var CodeW=(Sw-Cw)/2;
        $('#IsCode').css({"margin-left":CodeW});
    },1)
};
Center();
/*验证手机号是否存在*/
function CheckTelNot(a){
    var subData = {};
    subData.mobile = $('#Phone'+a).val();
    $.ajax({
        "type":"post",
        "url":"/web/user/check/mobile/not",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum!=0){
                $('#PhoneError'+a).html('用户已存在');
            }
        }
    })
};
/*检测手机格式是否正确*/
function CheckPhoneFormat(a){
    $('#Phone'+a).on('click',function(){$('#PhoneError'+a).html('');});
    $('#Phone'+a).on('blur',function(){
        if($('#Phone'+a).val()!=''){
            if(pat.test($('#Phone'+a).val())==false){
                $('#PhoneError'+a).html('手机号格式错误');
            }
            else {
                $('#PhoneError'+a).html('');
                CheckTelNot(a);
            }
        }
    });
};
/*获取验证码*/
GetCaptcha(0);
GetCaptcha(1);
function GetCaptcha(a){
    $.ajax({
        "type":"post",
        "url":"/web/common/captcha",
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                $("#CapImg"+a).attr("src",data.retData);
            }
            else{
                $('#c_ErrorMsg').html('验证码获取失败，请重试').fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
};
/*展示事件*/
IsShowEvent();
function IsShowEvent(){
    /*显示注册框*/
    $('.ShowEvt').hover(function(){
        $(this).find('.ShowMain').stop(true).fadeIn(150);
    },function(){
        $(this).find('.ShowMain').stop(true).fadeOut(150);
    });
    $('.UserSelect').on('click',function(e){
        stopBubble(e);
        $(this).find('.UserOption').slideToggle(150);
    });
    document.addEventListener('click',function(e){
        if(e.target.className.indexOf("UserSelect")==-1){
            $(".UserOption").slideUp(150);
        }
    });
};
/*等待时间*/
function WaitTime(a,b,c){
    $(a).css("display",'none');
    $(b).css("display","block");
    var f_Sendtimer0=null;
    $(c).html(60);
    var f_SendSecNum=60;
    if(f_Sendtimer0){clearInterval(f_Sendtimer0)}
    f_Sendtimer0=setInterval(function(){
        f_SendSecNum--;
        $(c).html(f_SendSecNum);
        if(f_SendSecNum==0){
            clearInterval(f_Sendtimer0);
            $(b).css("display","none");
            $(a).css("display","block");
        }
    },1000);
};
/*更换验证码*/
function ClickEvt(a){
    $('#ChangeCap'+a).on('click',function(){GetCaptcha(a)});
    $('#Captcha'+a).on('click',function(){$('#CapError'+a).html('');});
    $('#Captcha'+a).change('click',function(){$('#CapError'+a).html('');});
    $('#MsgIn'+a).on('click',function(){$('#MsgError'+a).html('');});
    $('#MsgIn'+a).change('click',function(){$('#MsgError'+a).html('');});
    $('#TeacherName').on('click',function(){$('#TeacherNameError0').html('');});
    $('#TeacherName').change('click',function(){$('#TeacherNameError0').html('');});
    $('#SubjectSelect').on('click',function(){$('#MaterialOption').slideUp(150)});
    $('#MaterialSelect').on('click',function(){$('#SubjectOption').slideUp(150)});
    $('#StudentCode').on('click',function(){$('#StudentCodeError0').html('');});
    $('#StudentCode').change('click',function(){$('#StudentCodeError0').html('');});
    $('#StudentName0').on('click',function(){$('#StudentNameError0').html('');});
    $('#StudentName0').change('click',function(){$('#StudentNameError0').html('');});
    $('#StudentName1').on('click',function(){$('#StudentNameError1').html('');});
    $('#StudentName1').change('click',function(){$('#StudentNameError1').html('');});
};
/*检查密码格式*/
function CheckPassFormat(a){
    $('#Pass'+a).on('click',function(){$('#PassError'+a).html('');});
    /*第一次输入密码判断*/
    $('#Pass'+a).blur(function(){
        if($('#Pass'+a).val().length<6&&$('#Pass'+a).val()!=''){
            $('#PassError'+a).html('请填写6~16个字符');
        }
        else {
            $('#PassError'+a).html('');
        }
    });
    $('#Pass'+(a+2)).on('click',function(){$('#PassError'+(a+2)).html('');});
    /*验证两次密码是否一致*/
    $('#Pass'+(a+2)).blur(function(){
        if($('#Pass'+a).val()!=$('#Pass'+(a+2)).val()){
            $('#PassError'+(a+2)).html('请输入相同密码');
        }
        else {
            $('#PassError'+(a+2)).html('');
        }
    });
};
/*是否能够获取短信验证码*/
function BeforeGetSMS(a){
    $('#GetMsg'+a).on('click',function(){
        if($('#Phone'+a).val()==''){$('#PhoneError'+a).html('请填写手机号');}
        else {
            if($('#Captcha'+a).val()==''){$('#CapError'+a).html('请输入图形验证码');}
            else {
                /*只有当验证码有值，手机号正确才发送验证码*/
                if($('#PhoneError'+a).html()==''){
                    GetSMS(a);
                }
            }
        }
    })
}
/*获取短信验证码*/
function GetSMS(a){
    $('#CapError'+a).html('');
    var subData = {};
    subData.imageCaptcha = $('#Captcha'+a).val();
    subData.mobile = $('#Phone'+a).val();
    /*验证手机号和图形验证码*/
    $.ajax({
        "type": "post",
        "url": " /web/common/sms",
        "dataType": "json",
        "data": subData,
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (data.retCode == 2001) {
                $('#CapError'+a).html('验证码错误');
                GetCaptcha(a);
            }
            else if (data.retCode == 2203){
                $('#CapError'+a).html('验证码错误');
                GetCaptcha(a);
            }
            else if (data.retCode == 2301){
                $('#c_ErrorMsg').html('60秒内只能发送一次').fadeIn(200);Disappear("#c_ErrorMsg");
            }
            else if (codenum == 0) {
                $('#CapError'+a).html('');
                WaitTime('#GetMsg'+a,'#DisGetMsg'+a,'#GetMsgSec'+a);
            }
            else {}
        }
    });
};
/*点击进入下一步*/
function GoToNext(a){
    $('#NextBtn'+a).on('click',function(){
        if($('#Pass'+a).val().length==0){$('#PassError'+a).html('请输入密码');}
        if($('#Pass'+(a+2)).val().length==0){$('#PassError'+(a+2)).html('请输入确认密码');}
        if($('#Phone'+a).val().length==0){$('#PhoneError'+a).html('请填写手机号');}
        if($('#MsgIn'+a).val().length==0){$('#MsgError'+a).html('请输入短信验证码');}
        var IsCanCheckSms=($('#PassError'+a).html()==''&&$('#PassError'+(a+2)).html()==''&&$('#MsgError'+a).html()=='');
        if(IsCanCheckSms){
            CheckSMS(a);
        }
    })
};
/*检测验证码是否正确*/
function CheckSMS(a){
    var subData = {};
    subData.smsCaptcha = $('#MsgIn'+a).val();
    subData.mobile = $('#Phone'+a).val();
    $.ajax({
        "type":"post",
        "url":"/web/common/sms/check",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                if(a==0){
                    $('#TeacherStep1').css({"display":'none'});
                    $("#TeacherStep2").fadeIn(150);
                }
                if(a==1){
                    $('#StudentStep1').css({"display":'none'});
                    $("#StudentStep2").fadeIn(150);
                }
            }
            else {
                $('#MsgError'+a).html('短信验证码错误');
            }
        }
    });
};
/*选择变色事件*/
function HoverEvt(){
    $('.UserOption li').hover(function(){
        $(this).css('color','#65b113')
    },function(){
        $(this).css('color','')
    })
};
function Quit0(){
    $.ajax({
        "type":"get",
        "url":"/web/user/logout?"+Math.random(),
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;

        }
    })
};
/*注册成功自动登录*/
function AutoLogIn(Mobile,Pass,Img){
    Quit0();
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
/*获取cookie*/
function SetCookie(key,value,day){
    var dat=new Date();
    dat.setDate(dat.getDate()+day);
    document.cookie=key+"="+escape(value)+";expires="+dat;
}
/*获取cookie里面的用户名和密码*/
function GetCookie(key)  {
    var arr=document.cookie.split("; ");
    for(var i=0;i<arr.length;i++)
    {
        var arr2=arr[i].split("=");
        if(arr2[0]==key)
        {
            return arr2[1];
        }
    }
};
/*删除cookie*/
function DeleCookie(key){
    SetCookie(key,"0",-1);
};
/******************************老师注册第一步********************************/
/*检测手机格式*/
CheckPhoneFormat(0);
/*更换验证码*/
ClickEvt(0);
/*检验密码*/
CheckPassFormat(0);
/*发送手机验证码*/
BeforeGetSMS(0);
/*点击进入下一步*/
GoToNext(0);
/******************************老师注册第二步********************************/
/*获取学科*/
GetSubject();
function GetSubject(){
    $.ajax({
        "type":"post",
        "url":" /web/common/subject",
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData=data.retData;
            if(codenum==0){
                CreatSubject(AllData);
                GetMaterial();
            }
        }
    });
};
/*创建学科列表*/
function CreatSubject(data){
    var $SubjectHtml='';
    $('#Subject0').html(data[0].label).attr({'data-Id':data[0].value,'title':data[0].label});
    for(var i=0;i<data.length;i++){
        $SubjectHtml+='<li data-Id="'+data[i].value+'">'+data[i].label+'</li>';
    }
    $('#SubjectOption').html($SubjectHtml);
    HoverEvt();
    $('#SubjectOption li').on('click',function(){
        $('#Subject0').html($(this).html()).attr({'data-Id':$(this).attr('data-Id'),'title':$(this).html()});
        GetMaterial()
    });
};
/*获取教材*/
function GetMaterial(){
    var SubData={}
    SubData.subjectId=$('#Subject0').attr('data-Id')
    $.ajax({
        "type":"post",
        "url":" /web/common/material",
        "dataType":"json",
        'data':SubData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData=data.retData;
            if(codenum==0){
                CreatMaterial(AllData)
            }
        }
    });
};
/*创建教材列表*/
function CreatMaterial(data){
    var $MaterialtHtml='';
    $('#Material0').html(data[0].name).attr({'data-Id':data[0].id,'data-grade':data[0].grade,'title':data[0].name});
    store.set('UserGradeId',data[0].grade)
    for(var i=0;i<data.length;i++){
        $MaterialtHtml+='<li data-Id="'+data[i].id+'" data-grade="'+data[i].grade+'">'+data[i].name+'</li>';
    }
    $('#MaterialOption').html($MaterialtHtml);
    HoverEvt();
    $('#MaterialOption li').on('click',function(){

        store.set('UserGradeId',$(this).attr('data-grade'))
        $('#Material0').html($(this).html()).attr({'data-Id':$(this).attr('data-Id'),'title':$(this).html()});
    });
};
/*获取版本*/
function GetPress(){
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
};
GetPress();
function CreatPress(data){
    for(var i=0;i<data.length;i++){
        if(data[i].name=='人教版'){
            $('#Press0').html(data[i].name).attr('data-Id',data[i].id);
        }
    }
};
/*教师完成注册*/
TeacherRegDone();
function TeacherRegDone(){
    $('#DoneRegBtn0').on('click',function(){
        if($('#TeacherName').val()==''){
            $('#TeacherNameError0').html('请输入姓名');
        }
        else {
            SaveTeacherInfo()
        }
    })
}
/*保存老师注册信息*/
function SaveTeacherInfo(){
    var subData = {};
    /*教材*/
    subData.materialId=$('#Material0').attr('data-Id');
    /*手机号*/
    subData.mobile=$('#Phone0').val();
    /*姓名*/
    subData.name=$('#TeacherName').val();
    /*密码*/
    subData.password=$.md5($('#Pass2').val());
    /*短信验证码*/
    subData.smsCaptcha=$('#MsgIn0').val();
    /*学科*/
    subData.subjectId=$('#Subject0').attr('data-Id');
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
                    AutoLogIn('#Phone0','#Pass2','#Captcha0');
                },1000)
            }
            else {
                $('#c_ErrorMsg').html('注册失败,请重试').fadeIn(200);Disappear("#c_ErrorMsg");
                $('#TeacherStep2').fadeOut(150);
            }
        }
    });
}
/******************************学生注册第一步********************************/
/*检测手机格式*/
CheckPhoneFormat(1);
/*更换验证码*/
ClickEvt(1);
/*检验密码*/
CheckPassFormat(1);
/*发送手机验证码*/
BeforeGetSMS(1);
/*点击进入下一步*/
GoToNext(1);
/******************************学生注册第二步********************************/
/*是否含有班级码*/
var isClassCode=true;
ChangeCodeCon();
function ChangeCodeCon(){
    $('#HasCode').on('click',function(){
        isClassCode=true;
        $('#HasCodeMain').fadeIn(150);
        $('#NoCodeMain').css('display','none');
        $(this).removeClass('i_cheico0').addClass('i_cheico1');
        $('#NoCode').removeClass('i_cheico1').addClass('i_cheico0');
        $('#StudentNameError1').html('');
    });
    $('#NoCode').on('click',function(){
        isClassCode=false;
        $('#NoCodeMain').fadeIn(150);
        $('#HasCodeMain').css('display','none');
        $(this).removeClass('i_cheico0').addClass('i_cheico1');
        $('#HasCode').removeClass('i_cheico1').addClass('i_cheico0');
        $('#StudentNameError0').html('');
        $('#StudentCodeError0').html('');
    });
};
/*获取年级*/
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
/*创建年级*/
function CreatGrade(data){
    var $GradeHtml='';
    $('#Grade0').html(data[0].label).attr('data-Id',data[0].value);
    for(var i=0;i<data.length;i++){
        $GradeHtml+='<li data-Id="'+data[i].value+'">'+data[i].label+'</li>';
    }
    $('#GradeOption').html($GradeHtml);
    HoverEvt();
    $('#GradeOption li').on('click',function(){
        $('#Grade0').html($(this).html()).attr('data-Id',$(this).attr('data-Id'));
    });
};
/*学生注册完成*/
StudentRegDone();
function StudentRegDone(){
    $('#DoneRegBtn1').on('click',function(){
        if(isClassCode){
            if($('#StudentCode').val()==''){$('#StudentCodeError0').html('请输入班级码')}
            if($('#StudentName0').val()==''){$('#StudentNameError0').html('请输入姓名')}
            if($('#StudentName0').val()!=''&&$('#StudentCode').val()!=''){
                SaveNoCodeInfo('StudentName0');
            }
        }
        else {
            if($('#StudentName1').val()==''){$('#StudentNameError1').html('请输入姓名')}
            else {
                SaveNoCodeInfo('StudentName1');
            }
        }
    });
};
/*保存学生信息*/
function SaveNoCodeInfo(StudentName){
    var SubData={};
    /*姓名*/
    SubData.name =$('#'+StudentName).val();
    /*班级代码*/
    SubData.classCode =$('#StudentCode').val();
    /*年级ID*/
    SubData.gradeId=$('#Grade0').attr('data-Id');
    /*是否存在班级代码*/
    SubData.isClassCode=isClassCode;
    /*手机号*/
    SubData.mobile=$('#Phone1').val();
    /*密码*/
    SubData.password=$.md5($('#Pass3').val());
    /*出版社*/
    SubData.pressId=$('#Press0').attr('data-Id');
    /*短信验证码*/
    SubData.smsCaptcha=$('#MsgIn1').val();
    $.ajax({
            "type":"post",
            "url":" /web/user/register/student",
            "dataType":"json",
            "data":SubData,
            success:function(data){
                console.log(data);
                var codenum =parseInt(data.retCode.substr(0, 1));
                if(codenum==0){
                    $('#StudentCodeError0').html('')
                    $('#c_ErrorMsg').html('恭喜您注册成功，即将跳转首页').fadeIn(200);
                    GoldAnimate(data.retGold);
                    setTimeout(function(){
                        $('#c_ErrorMsg').fadeOut(200);
                        AutoLogIn('#Phone1','#Pass3','#Captcha1');
                    },1000);
                }
                else if(codenum==2){
                    $('#StudentCodeError0').html('班级码不存在')
                }
                else {
                    $('#c_ErrorMsg').html('注册失败,请重试').fadeIn(200);Disappear("#c_ErrorMsg");
                    $('#StudentStep2').fadeOut(150);
                }
            }
        });
};