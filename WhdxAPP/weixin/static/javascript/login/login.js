/********************************微信登录by EchoVue 2017.05.16*****************************************/
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
                console.log(AllData)
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
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'closeWindow',
        ]
    });
    wx.ready(function(){
        wx.hideOptionMenu();
        //获取公共OpenID
        GetComOpenId();
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    });

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
                    LogIn(OpenId);
                }else{
                    alert('您已登录，无需重复登录')
                    wx.closeWindow();
                }
            }
        }
    });
}
UserOption();//用户操作
function UserOption() {
    $("#Phone").on('click',function () {
        StyleReset();
        $(this).parents(".L_InputBox").css('border-bottom','1px solid #56DB94');
        $('#Phoneico').attr('src','../../static/images/common/phone1.png');
    });
    $("#Pass").on('click',function () {
        StyleReset();
        $(this).parents(".L_InputBox").css('border-bottom','1px solid #56DB94');
        $('#Passico').attr('src','../../static/images/common/pass1.png');
    });
    $("#Code").on('click',function () {
        StyleReset();
        $(this).parents(".L_InputBox").css('border-bottom','1px solid #56DB94');
        $('#Codeico').attr('src','../../static/images/common/yzm1.png');
    });
    $("#ChangeCode").on('click',function () {
        GetCaptcha();
    })
};
//样式重置
function StyleReset() {
    $(".L_InputBox").css('border-bottom','1px solid #ccc');
    $('#Phoneico').attr('src','../../static/images/common/phone0.png')
    $('#Passico').attr('src','../../static/images/common/pass0.png')
    $('#Codeico').attr('src','../../static/images/common/yzm0.png')
};
//错误重置
ErrorReset();
function ErrorReset() {
    $('#Phone').bind('click mousedown',function(){$('#PhoneError').html('');$("#AllError").html('');})
    $('#Pass').bind('click mousedown',function(){$('#PassError').html('');$("#AllError").html('');})
    $('#Code').bind('click mousedown',function(){$('#CodeError').html('');$("#AllError").html('');})
};
//手机号失去焦点
PhoneOnblur()
function PhoneOnblur(){
    var pat=/^(13|14|19|15|18|17)[0-9]{9}$/;//验证手机格式正则
    //手机失去焦点判断格式（前提是用户输入了）
    $('#Phone').on('blur',function(){
        if($('#Phone').val()!=''){
            $('#PhoneError').html('');
            //检验手机号格式
            if(pat.test($('#Phone').val())==false){
                ErrorTxtReset();
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
        "url":"  /api/user/check/mobile/exist",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum!=0){
                ErrorTxtReset();
                $('#PhoneError').html('用户不存在');
            }
            if(codenum==0){
                $('#PhoneError').html('');
            }
        }
    });
};
//错误文本重置
function ErrorTxtReset() {
    $('#PhoneError').html('');
    $('#PassError').html('');
    $('#CodeError').html('');
};

function GetComOpenId() {
    var UrlOpenId=Request.openId;
    var LocalOpenId=store.get('openId');//查看缓存是否存有Openid
    if(!UrlOpenId){
        if(!LocalOpenId){
            GetOpenId();
        }else {
            CheckUesrBound(LocalOpenId);
        }
    }else {
        store.set('openId',UrlOpenId);//存缓存
        CheckUesrBound(UrlOpenId);
    }
};
function GetOpenId() {
    var subData = {};
    subData.state = '2';
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
    });
};
//登录
function LogIn(OpenId){
    $('#LoginBtn').off('click')
    $('#LoginBtn').on('click',function(){
        var IsPhoneAndPass=($('#Phone').val().length==0);//手机号没写
        var IsPassNull=($('#Pass').val().length==0);//密码为空
        var IsPassShort=($('#Pass').val().length<6);//密码太短
        var pat=/^(13|14|19|15|18|17)[0-9]{9}$/;//验证手机格式正则
        //手机号和密码都没写，提示输入手机号
        if(IsPhoneAndPass){
            ErrorTxtReset();
            $('#PhoneError').html('请输入手机号');
        }
        else if(pat.test($('#Phone').val())==true){
            CheckTell(OpenId);
        }
        else if(pat.test($('#Phone').val())==false){
            ErrorTxtReset();
            $('#PhoneError').html('手机号格式错误');
        }
        //用户手机号正确和密码不为空
        else {
            ErrorTxtReset();
            $(this).html('登录中...')
            CheckUserLogIn(OpenId);
        }
    });
};
function CheckTell(OpenId) {
    var subData = {};
    subData.mobile = $("#Phone").val();
    var IsPassNull=($('#Pass').val().length==0);//密码为空
    var IsPassShort=($('#Pass').val().length<6);//密码太短
    $.ajax({
        "type":"post",
        "url":"  /api/user/check/mobile/exist",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum!=0){
                ErrorTxtReset();
                $('#PhoneError').html('用户不存在');
            }
            if(codenum==0){
                if(IsPassNull){
                    ErrorTxtReset();
                    $('#PassError').html('请输入密码');
                }else if(IsPassShort){
                    ErrorTxtReset();
                    $('#PassError').html('请填写6~16个字符');
                }else {
                    ErrorTxtReset();
                    $('#LoginBtn').html('登录中...')
                    CheckUserLogIn(OpenId);
                }
            }
        }
    });
}
//检验用户登录信息
function CheckUserLogIn(OpenId){
    var subData = {};
    subData.mobile = $("#Phone").val();
    subData.password = $.md5($('#Pass').val());
    subData.openId = OpenId;
    subData.imageCaptcha = $('#Code').val();
    $.ajax({
        "type":"post",
        "url":"/api/wx/basic/login",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1));
            var Code=data.retCode;
            //登录成功
            if(Code=='0000'||Code==0000||Code==0){
                ErrorTxtReset();
                alert('您好，已登录成功');
                wx.closeWindow();
            }
            else if(Code=='2203'||Code==2203){
                $('#LoginBtn').html('重新登录');
                GetCaptcha();//更换验证码
                ErrorTxtReset();
                if($('#Code').val()==''){
                    $('#AllError').html("请输入验证码");
                }
                else {
                    $('#AllError').html("验证码错误");
                }
            }
            else if(Code=='2101'||Code==2101){
                $('#LoginBtn').html('重新登录');
                ErrorTxtReset();
                $('#CodeError').html("请输入验证码");
                GetCaptcha();
            }
            else {
                $('#LoginBtn').html('重新登录');
                ErrorTxtReset();
                $("#AllError").html(data.retMsg);
                $("#CodeBox").fadeIn(100);
                GetCaptcha();
            }
        }
    })
};
//获取验证码
GetCaptcha()
function GetCaptcha(){
    $.ajax({
        "type":"post",
        "url":"/api/wx/basic/captcha",
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                $("#Codeimg").attr("src",data.retData);
            }
            else{
                ErrorTxtReset();
                $("#AllError").html(data.retMsg);
            }
        }
    });
};
//赠送用户机会
function GiveChance(OpenId) {
    var SubData={};
    //用户OpenId
    SubData.openId= OpenId;;
    SubData.type= '2';
    $.ajax({
        "type":"post",
        "url":" /api/wx/basic/addPriceNum",
        "dataType":"json",
        'data': SubData,
        success:function(data){

        }
    });
};


