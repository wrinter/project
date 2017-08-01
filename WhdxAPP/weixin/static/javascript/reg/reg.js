/*******************************注册 by EchoVue  2017.05.17**************************************/
//获取微信配置
GetJsConfig()
function GetJsConfig() {
    var subData = {};
    subData.url =encodeURIComponent(window.location.href.split('#')[0]);
    $.ajax({
        "type":"post",
        "url":"/api/wx/getJsConfig",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var Code=data.retCode;
            var AllData=data.retData;
            //登录成功
            if(Code=='0000'||Code==0000||Code==0){
                WxConfig(AllData)
            }
        }
    })
};
//微信响应配置
function WxConfig(data) {
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp:data.timestamp , // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature,// 必填，签名，见附录1
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onVoiceRecordEnd',
            'playVoice',
            'onVoicePlayEnd',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard'
        ]
    });
    wx.ready(function(){
        wx.hideOptionMenu();
        //获取公共OpenID
        GetComOpenId();
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    });

};

function GetComOpenId() {
    var UrlOpenId=Request.openId;
    var LocalOpenId=store.get('openId');//查看缓存是否存有Openid
    if(!UrlOpenId){
        if(!LocalOpenId){
            GetOpenId();
        }else {
            CheckUesrBound(LocalOpenId)
        }
    }else {
        CheckUesrBound(UrlOpenId)
    }
}
function GetOpenId() {
    var subData = {};
    subData.state = '1';
    $.ajax({
        "type":"post",
        "url":"/api/wx/getUserOpenId",
        "dataType":"json",
        "data":subData,
        success:function (data) {
            var Code=data.retCode;
            var ThisUrl=data.retData;
            //登录成功
            if(Code=='0000'||Code==0000||Code==0){
                window.location.href=ThisUrl;
            }
        }
    })
};
//检测用户是否绑定
function CheckUesrBound(OpenId) {
    var SubData={};
    SubData.openId=OpenId;
    $.ajax({
        "type":"post",
        "url":"/api/wx/basic/getBindFlag",
        "dataType":"json",
        "data":SubData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData =data.retData;
            if(codenum==0){
                if(AllData==0||AllData=='0'){
                    store.set('openId',OpenId);//存缓存
                    $("#UserType").attr('data-OpenId',OpenId);
                }else{
                    alert('您已经注册账号，无需重复注册')
                    wx.closeWindow();
                }
            }
        }
    });
}

//用户输入css的相关变化
CssChange()
function CssChange() {
    $("#Phone").on('click',function () {
        StyleReset();
        $(this).parents(".InputBox").css('border-bottom','1px solid #56DB94');
        $('#Phoneico').attr('src','../../static/images/common/phone1.png');
    });
    $("#Pass").on('click',function () {
        StyleReset();
        $(this).parents(".InputBox").css('border-bottom','1px solid #56DB94');
        $('#Passico').attr('src','../../static/images/common/pass1.png');
    });
    $("#Msg").on('click',function () {
        StyleReset();
        $(this).parents(".InputBox").css('border-bottom','1px solid #56DB94');
        $('#Msgico').attr('src','../../static/images/common/ms1.png');
    });
    $(".UserType p").on('click',function () {
        var Type=$(this).attr('data-status');
        $(this).removeClass().addClass('TypeBoxSelect');
        $(this).siblings().removeClass().addClass('TypeBox');
    })
}
//样式重置
function StyleReset() {
    $(".InputBox").css('border-bottom','1px solid #ccc');
    $('#Phoneico').attr('src','../../static/images/common/phone0.png')
    $('#Passico').attr('src','../../static/images/common/pass0.png')
    $('#Msgico').attr('src','../../static/images/common/ms0.png')
};
//错误重置
ErrorReset();
function ErrorReset() {
    $('#Phone').bind('click mousedown',function(){$('#PhoneError').html('');$("#AllError").html('');})
    $('#Pass').bind('click mousedown',function(){$('#PassError').html('');$("#AllError").html('');})
    $('#Msg').bind('click mousedown',function(){$('#MsgError').html('');$("#AllError").html('');})
};
//错误文本重置
function ErrorTxtReset() {
    $('#PhoneError').html('');
    $('#PassError').html('');
    $('#MsgError').html('');
    $('#AllError').html('');
};
//短信验证码时间转换
function BtnWaitTime(Btn,TimeMsg,SecBox) {
    $(TimeMsg).css("display","block");
    $(Btn).css("display","none").html('获取验证码');
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
            $(Btn).css("display","block").html('重新获取');
        }
    },1000)
}
//手机号失去焦点
PhoneOnblur();
function PhoneOnblur(){
    var pat=/^(13|14|19|15|18|17)[0-9]{9}$/;//验证手机格式正则
    //手机失去焦点判断格式（前提是用户输入了）
    $('#Phone').on('blur',function(){
        if($('#Phone').val()!=''){
            $('#PhoneError').html('');
            //检验手机号格式
            if(pat.test($('#Phone').val())==false){
                $('#PhoneError').html('手机号格式错误');
            }
            else {
                $('#PhoneError').html('');
                CheckPhoneExist();
            }
        }
    });
};
//验证手机号是否存在
function CheckPhoneExist(){
    var subData = {};
    subData.mobile = $("#Phone").val();
    $.ajax({
        "type":"post",
        "url":"  /api/user/check/mobile/not",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum!=0){
                $('#PhoneError').html('用户已存在');
            }
            if(codenum==0){
                $('#PhoneError').html('');
            }
        }
    });
};
//是否能够获取短信验证码
BeforeGetSMS()
function BeforeGetSMS(){
    var pat=/^(13|14|19|15|18|17)[0-9]{9}$/;//验证手机格式正则
    $('#GetMsgBtn').on('click',function(){
        if($('#Phone').val()==''){$('#PhoneError').html('请填写手机号');}
        else {
            if(pat.test($('#Phone').val())==false){
                $('#PhoneError').html('手机号格式错误');
            }
            else {
                $('#PhoneError').html('');
                ReadGetMsg();
            }
        }
    })
};
//获取验证码时检测是否用户存在
function ReadGetMsg() {
    var subData = {};
    subData.mobile = $("#Phone").val();
    $.ajax({
        "type":"post",
        "url":"  /api/user/check/mobile/not",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum!=0){
                ErrorTxtReset();
                $('#PhoneError').html('用户已存在');
            }
            if(codenum==0){
                $('#PhoneError').html('');
                BtnWaitTime('#GetMsgBtn','#DisGetMsg','#GetMsgSec');
                GetSmsMsg();
            }
        }
    });
}
//获取短信验证码
function GetSmsMsg() {
    var subData = {};
    subData.mobile = $('#Phone').val();
    /*验证手机号和图形验证码*/
    $.ajax({
        "type": "post",
        "url": " /api/user/register/send/sms",
        "dataType": "json",
        "data": subData,
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if(codenum == 0){
                ErrorTxtReset();
            }else {
                ErrorTxtReset();
                $("#AllError").html(data.retMsg)
            }
        }
    });
};
//下一步
NextEvent();
function NextEvent() {
    $('#NextBtn').off('click');
    $('#NextBtn').on('click',function () {
        if($("#Pass").val()==''){ErrorTxtReset();$("#PassError").html('请输入密码');}
        else if($("#Phone").val()==''){ErrorTxtReset(); $('#PassError').html('请输入手机号');}
        else if($("#Msg").val()==''){ErrorTxtReset(); $('#MsgError').html('请输入验证码');}
        else if($("#Pass").val().length<6){ErrorTxtReset(); $('#PassError').html('请填写6~16个字符');}
        else {
            CheckMsg();
        }

    })
}
//检查验证码是否正确
function CheckMsg() {
    var subData = {};
    subData.smsCaptcha = $('#Msg').val();
    subData.mobile = $('#Phone').val();
    $.ajax({
        "type":"post",
        "url":"/api/user/register/check/sms",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var Type=$(".TypeBoxSelect").attr('data-status');;//判断进入老师下一步还是学生下一步  0：老师 1：学生
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                if(Type==0){
                    $('#Step1').css('display','none');
                    $('#Teacher').fadeIn(150);
                }
                if(Type==1){
                    $('#Step1').css('display','none');
                    $('#Student').fadeIn(150);
                }
            }
            else {
                ErrorTxtReset();
                $('#AllError').html(data.retMsg);
            }
        }
    });
}





