// /****************************************Created by 徐扬 on 2017/05/06.*****************************************/

 /****************************************找回密码********************************************/
 AppDowload();
 function AppDowload() {
     $('#First_Dowload').on('click',function () {
         window.location.href='../../index.html?AppDoload='+true;
     })
 }
$('.First_Logo').click(function(){
    window.location.href='/index.html';
})
//检测浏览器
CheckBrower();
//获取验证码
GetCaptcha()
function GetCaptcha(){
    $.ajax({
        "type":"post",
        "url":"/web/common/captcha",
        "dataType":"json",
        success:function(date){
            $("#CodeImg").attr("src",date.retData);
        }
    });
}
//错误重置
ErrorReset();
function ErrorReset() {
    $('#Phone').bind('click mousedown',function(){$('#PhoneError').html('');});
    $('#Code').bind('click mousedown',function(){$('#CodeError').html('');});
    $('#MsgCode').bind('click mousedown',function(){$('#MsgError').html('');});
    $('#Pass0').bind('click mousedown',function(){$('#PassError0').html('');});
    $('#Pass1').bind('click mousedown',function(){$('#PassError1').html('');});
}
//检测手机号格式
CheckPhone();
function CheckPhone() {
    $('#ChangeCode').on('click',function () {
        GetCaptcha()
    })
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
        "url":"/web/user/check/mobile/exist",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum!=0){
                $('#PhoneError').html('用户不存在');
            }
        }
    })
};
//请求进入第二步
CheckGoStep2()
function CheckGoStep2() {
    $('#Step1').on('click',function () {
        if($('#Code').val()==''){
            $('#CodeError').html('请输入验证码')
        }else if($('#Phone').val()==''){}
        else {
            CheckPhoneCode()
        }
    });
}
//验证手机号和验证码
function CheckPhoneCode() {
    var subData = {};
        subData.imageCaptcha = $('#Code').val();
        subData.mobile = $('#Phone').val();
    $.ajax({
        "type":"post",
        "url":"/web/user/check/forget/pwd",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var Code =data.retCode;
            if(codenum==0){
               SucessStep2();
            }
            else if(Code=='2203'||Code==2203){
                GetCaptcha();
                $('#CodeError').html('验证码错误');
            }
            if(Code=='2202'||Code==2202){
                $('#PhoneError').html('手机号格式错误');
                $("#CodeError").html('');
                GetCaptcha();
            }
            else {
                GetCaptcha();
            }
        }
    })
};
//成功进入下一步
function SucessStep2() {
    $('#r_Bar0').animate({'left':'0px'},250);
    $('#r_LoadTxt2').removeClass().addClass('r_LoadTxtNow');
    $('#r_StepTxt2').removeClass().addClass('LoadNow');
    $('#Find1').css('display','none');
    $('#Find2').fadeIn(150);
    var mobile=$('#Phone').val()//手机号
    $('#Phone0').html(parseInt(mobile.substr(0, 3)));//手机号前三位
    $('#Phone1').html(mobile.substr(7, 4).toString());//手机号后四位
}
//获取手机验证码
GetMsgCode();
function GetMsgCode() {
    $('#GetMsgBtn').on('click',function(){
        GetMsgAjax();
    });
}
//请求验证码
function GetMsgAjax() {
    BtnWaitTime('#GetMsgBtn','#DisGetMsg','#GetMsgSec');//首先执行时间
    var SubData={};
    SubData.mobile=$('#Phone').val()
    $.ajax({
        "type":"post",
        "url":"/web/user/check/forget/pwd/mobile",
        "dataType":"json",
        "data":SubData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;

        }
    });
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
};
//请求进入第三步
CheckGoStep3();
function CheckGoStep3() {
    $('#Step2').on('click',function () {
        if($('#MsgCode').val()==''){
            $('#MsgError').html('请输入验证码')
        }else {
            CheckMsgCode()
        }
    });
}
//检测短信验证码
function CheckMsgCode(){
    var subData = {};
    subData.captcha = $('#MsgCode').val();
    $.ajax({
        "type":"post",
        "url":"/web/user/check/forget/pwd/check",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                SucessStep3();
            }
            else {
                $('#MsgError').html(data.retMsg)
            }
        }
    })
}
//成功进入第三步
function SucessStep3() {
    $('#r_Bar1').animate({'left':'0px'},250);
    $('#r_LoadTxt3').removeClass().addClass('r_LoadTxtNow');
    $('#r_StepTxt3').removeClass().addClass('LoadNow');
    $('#Find2').css('display','none');
    $('#Find3').fadeIn(150);
}
//密码强度判断
PassRank()
function PassRank() {
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
    })
}
//第一次输入密码判断
function CheckPass() {
    $('#Pass0').blur(function(){
        if($('#Pass0').val().length<6){
            $('#PassError0').html('请填写6~16个字符');
        }
        else {
            $('#PassError0').html('');
        }
    });
};
//判断密码是否正确
CheckPassSame();
function CheckPassSame() {
    $('#Pass1').blur(function(){
        var IsPassHas=($('#Pass0').val().length>=6)&&($('#Pass1').val().length>0);//如果第一次输入完毕并且确认密码不为空
        if(IsPassHas){
            if($('#Pass1').val()!=$('#Pass0').val()){
                $('#PassError1').html('请输入相同密码');
            }
            else {
                $('#PassError1').html('');
            }
        }

    });
}
//请求进入第四步
CheckGoStep4()
function CheckGoStep4() {
    $('#Step3').on('click',function () {
        var IsCanGoStep=($('#Pass0').val()==$('#Pass1').val())&&($('#Pass0').val().length>=6);//如果第一次输入完毕并且两个密码相同
        if(IsCanGoStep){
            SavePassAjax();
        }
        if($('#Pass0').val().length<6){ $('#PassError0').html('请填写6~16个字符');}
    });
}
//保存密码请求
function SavePassAjax() {
    var SubData = {};
    SubData.captcha=$('#MsgCode').val();
    SubData.mobile=$('#Phone').val();
    SubData.password=$.md5($('#Pass1').val());
    $.ajax({
        "type":"post",
        "url":" /web/user/check/forget/pwd/update",
        "dataType":"json",
        "data":SubData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            /*请求成功进入下一步*/
            if(codenum==0){
                SavePassSuccess();
            }else {
                $('#c_ErrorMsg').html('操作失败，请重试').fadeIn(200);Disappear("#c_ErrorMsg");
                DataReset();
            }
        }
    });
}
//保存密码成功
function SavePassSuccess() {
    $('#Find3').css('display','none');
    $('#Find1').css('display','block');
    $('#Find').css('display','none');
    $('#Find4').fadeIn(150);
    $('#GoToIndex').on('click',function () {
        window.location.href="../../index.html";
    });
};
//数据重置
function DataReset() {
    //LoadBar重置
    $('#r_Bar0').css('left','-120px');
    $('#r_Bar1').css('left','-120px');
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
    $('#Find').css('display','block');
    $('#Find1').css('display','block');
    $('#Find2').css('display','none');
    $('#Find3').css('display','none');
    $('#Find4').css('display','none');
    //手机重置
    $('#Phone').val('');
    $('#PhoneError').html('');
    //图形验证码重置
    $('#Code').val('');
    GetCaptcha();
    $('#CodeError').html('');
    //短信验证码重置
    $('#MsgCode').val('');
    $('#MsgError').html('');
    //密码重置
    $('#Pass0').val('');
    $('#PassError0').html('');
    $('#Pass1').val('');
    $('#PassError1').html('');
};

