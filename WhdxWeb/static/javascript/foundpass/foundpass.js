/****************************************Created by 徐扬 on 2016/12/6.*****************************************/
/****************************************找回密码********************************************/
CheckBrower();
function CheckTimeOut(){}
var pat=/^(13|14|19|15|18|17)[0-9]{9}$/;
    GetCaptcha();
    ChangeCss();
    PhoneBlur();
    Verify();
    ChangeCap();
    SendTelCap();
    SetPass();
    GetPhoneCap();
    GetTelAgain();
    IsPassLength();
    IsPassSam();
    SubPass();
/*获取验证码*/
function GetCaptcha(){
    $.ajax({
        "type":"post",
        "url":"/web/common/captcha",
        "dataType":"json",
        success:function(date){
            $("#f_CapImgBox").attr("src",date.retData);
        }
    });
}
/*控制css更改样式*/
function ChangeCss(){
    if($('.f_PhoError').css('display')=='block'){
        $('.f_InC').removeClass('mt10')
    }
    else{
        $('.f_InC').addClass('mt10')
    };
}
/*手机号失去焦点时*/
function PhoneBlur(){
    $('#f_Tel').blur(function(){
        /*找回密码手机号为空提示*/
        if($('.f_Tel').val()==''){
            $('#f_PhoError').html('请输入手机号').css({'display':"block"});

        }
        else {
            if(pat.test($('.f_Tel').val())==false){
                $('#f_PhoError').html('手机号格式错误').css({'display':"block"});

            }
            else {
                $('#f_PhoError').html('');

                IsPhone();
            }
        }
    });
}
/*验证手机号是否存在*/
function IsPhone(){
    var subData = {};
    subData.mobile = $('#f_Tel').val();
    /*验证手机号是否存在*/
    $.ajax({
        "type":"post",
        "url":"  /web/user/check/mobile/exist",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum!=0){
                $('#f_PhoError').html('用户不存在').css({'display':"block"});
                $('.f_InC').removeClass('mt10');
            }
        }
    })
};
/*校验邮箱*/
function CheckEmail(data){
    var f_Email='';
    f_Email=data.retData.email;
    $('#SendEmail').html('发送验证码至<span><span id="f_Telnum2">xx</span>****@<span id="f_Telnum3">xxx</span>.com</span> ，输入验证码找回');
    $('#f_Telnum2').html(f_Email.substr(0, 4));
    $('#f_Telnum3').html(f_Email.split('@')[1].split('.')[0]);
    /*邮件验证*/
    $('#f_SendEmail').on('click',function(){
        $('#f_Step2').css('display','none');
        $('#f_PhoneIn').css('display','none');
        $('#f_MailIn').css('display','block');
        $('#f_Step3').fadeIn();
        WaitTime('#f_SendTelBtn1','#f_SendTelDis1','#f_SendSec1');
        $.ajax({
            "type":"post",
            "url":"/web/user/check/forget/pwd/email",
            "dataType":"json",
            "data":"email="+f_Email,
            success:function(data){
            }
        });
    });
};
/*获取邮箱验证码*/
function GetEmailCap(){
    var f_Email='';
    f_Email=data.retData.email;
    $.ajax({
        "type":"post",
        "url":"/web/user/check/forget/pwd/email",
        "dataType":"json",
        "data":"email="+f_Email,
        success:function(data){
        }
    });
};
/*效验通过邮件或者短信的验证码*/
function CheckPwd(){
    $.ajax({
        "type":"post",
        "url":"/web/user/check/forget/pwd/check",
        "dataType":"json",
        "data":"captcha="+$('#f_InCapT1').val(),
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            /*请求成功进入下一步*/
            if(codenum==0){
                $('#f_Step4').fadeIn();
                $('#f_Step3').css("display",'none');
            }
            else {
                $("#f_GetError1").html('验证码错误');
            }
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
ErrorReset();
function ErrorReset(){
    $('#f_CaptchaIn').on('click',function(){$('#f_CapError').html('')})
    $('#f_Tel').on('click',function(){$('#f_PhoError').html('')})
    $('#f_InCapT').on('click',function(){$('#f_GetError0').html('')})
    $('#f_InCapT1').on('click',function(){$('#f_GetError1').html('')})
    $('#f_InPassT0').on('click',function(){$('#f_PassError0').html('')})
    $('#f_InPassT1').on('click',function(){$('#f_PassError1').html('')})
}
/*验证手机号和验证码*/
function Verify(){
    $('#f_StepBtn1').on('click',function(){
        /*检验手机号是否为空*/
        if($('.f_Tel').val()==''){
            $('#f_PhoError').html('请输入手机号').css({'display':"block"});
            $('#f_CapError').html('')
            $('.f_InC').removeClass('mt10');
        }
        /*验证是否为空*/
        if($('#f_CaptchaIn').val()==''){
            $("#f_CapError").html('请输入验证码');
        }
        else{
            var subData = {};
            subData.imageCaptcha = $('#f_CaptchaIn').val();
            subData.mobile = $('#f_Tel').val();
            $.ajax({
                "type":"post",
                "url":"/web/user/check/forget/pwd",
                "dataType":"json",
                "data":subData,
                success:function(data){
                    var codenum =parseInt(data.retCode.substr(0, 1)) ;
                    var Code=data.retCode;
                    /*请求成功进入下一步*/
                    if(codenum==0){
                        $('#f_Step2').fadeIn();
                        $('#f_Step1').css("display",'none');
                        $('#f_Telnum').html(parseInt($('#f_Tel').val().substr(0, 3)));
                        $('#f_Telnum1').html(parseInt($('#f_Tel').val().substr(7, 4)));
                        if(data.retData.email==''){
                            $('#f_SendEmail').attr("disabled",true).addClass('bacCC');
                            $('#SendEmail').html('未绑定邮箱');
                        }
                        else {
                            $('#f_SendEmail').removeAttr("disabled").removeClass('bacCC');
                            CheckEmail(data);
                            /*请求进入设置密码*/
                            $('#f_InBtn1').on('click',function(){
                                if($('#f_InCapT1').val()==''){
                                    $('#f_GetError1').html("请输入验证码");
                                }
                                else{
                                    CheckPwd();
                                }
                            });
                            /*重新获取验证码*/
                            $('#f_SendTelBtn1').on('click',function(){
                                WaitTime('#f_SendTelBtn1','#f_SendTelDis1','#f_SendSec1');
                                GetEmailCap();
                            });
                        }
                    }
                    if(Code=='2202'||Code==2202){
                        $('#f_PhoError').html('手机号格式错误');
                        $("#f_CapError").html('');
                        GetCaptcha();
                    }
                    if(Code=='2203'||Code==2203){
                        $("#f_CapError").html('验证码错误');
                        $('#f_PhoError').html('');
                        GetCaptcha();
                    }
                }
            })
        }
    });
}
/*跟换图形验证码*/
function ChangeCap(){
    $('#i_CapChange').on('click',function(){GetCaptcha();});
}
/*手机短信验证*/
function SendTelCap(){
    $('#f_SendTel').on('click',function(){
        $('#f_Step2').css('display','none');
        $('#f_Step3').fadeIn();
        $.ajax({
            "type":"post",
            "url":"/web/user/check/forget/pwd/mobile",
            "dataType":"json",
            "data":"mobile="+$('#f_Tel').val(),
            success:function(data){
                WaitTime('#f_SendTelBtn0','#f_SendTelDis','#f_SendSec');
            }
        });
    });
}
/*请求进入设置密码*/
function SetPass(){
    $('#f_InBtn0').on('click',function(){
        if($('#f_InCapT').val()==''){
            $('#f_GetError0').html("请输入验证码");
        }
        else{
            $.ajax({
                "type":"post",
                "url":"/web/user/check/forget/pwd/check",
                "dataType":"json",
                "data":"captcha="+$('#f_InCapT').val(),
                success:function(data){
                    var codenum =parseInt(data.retCode.substr(0, 1)) ;
                    /*请求成功进入下一步*/
                    if(codenum==0){
                        $('#f_Step4').fadeIn();
                        $('#f_Step3').css("display",'none');
                    }
                    else {
                        $("#f_GetError0").html('验证码错误');
                    }
                }
            });
        }
    });
};
/*获取手机验证码*/
function GetPhoneCap(){
    $.ajax({
        "type":"post",
        "url":"/web/user/check/forget/pwd/mobile",
        "dataType":"json",
        "data":"mobile="+$('#f_Tel').val(),
        success:function(data){

        }
    });
};
/*重新获取验证码*/
function GetTelAgain(){
    $('#f_SendTelBtn0').on('click',function(){
        WaitTime('#f_SendTelBtn0','#f_SendTelDis','#f_SendSec');
        GetPhoneCap()
    });
}
/*第一次输入密码判断*/
function IsPassLength(){
    $('#f_InPassT0').blur(function(){
        if($('#f_InPassT0').val().length<6){
            $('#f_PassError0').html('请填写6~16个字符');
        }
        else {
            $('#f_PassError0').html('');
        }
    });
}
/*验证两次密码是否一致*/
function IsPassSam(){
    $('#f_InPassT1').blur(function(){
        if($('#f_InPassT0').val()!=$('#f_InPassT1').val()){
            $('#f_PassError1').html('请输入相同密码');
        }
        else {
            $('#f_PassError1').html('');
        }
    });
}
/*提交修改密码*/
function SubPass(){
    $('#f_SetBtn4').on('click',function(){
        if(($('#f_InPassT0').val()==$('#f_InPassT1').val())&&($('#f_InPassT0').val().length>=6)){
            var subData = {};
            if($('#f_InCapT').val()==''){subData.captcha = $('#f_InCapT1').val();}
            else {
                subData.captcha = $('#f_InCapT').val();
            }
            subData.mobile = $('#f_Tel').val();
            subData.password= $.md5($('#f_InPassT1').val()) ;
            $.ajax({
                "type":"post",
                "url":" /web/user/check/forget/pwd/update",
                "dataType":"json",
                "data":subData,
                success:function(data){
                    console.log(data);
                    var codenum =parseInt(data.retCode.substr(0, 1)) ;
                    /*请求成功进入下一步*/
                    if(codenum==0){
                        $('#f_Step5').fadeIn();
                        $('#f_Step4').css("display",'none');
                        FoundDone();
                    }
                }
            })
        }
    });
}
/*登陆成功之后*/
function FoundDone(){
    if($("#f_Step5").css("display")=='block'){
        var f_GoSectimer=null;
        var f_GoSecNum=3;
        $('#f_GoSec').html(3);
        f_GoSectimer=setInterval(function(){
            f_GoSecNum--;
            $('#f_GoSec').html(f_GoSecNum);
            if(f_GoSecNum==0){
                clearInterval(f_GoSectimer);
                window.location.href="../../index.html";
            }
        },1000)

    }
}
