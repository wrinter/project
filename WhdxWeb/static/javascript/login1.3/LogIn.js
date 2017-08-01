/****************************************Created by 徐扬 on 2017/5/4.*****************************************/
//检测浏览器版本
CheckBrower();
//检测用户是否登录
window.onload=function () {
    Detection();
    store.set('weixin',1);
}
$('.First_Logo').click(function(){
    window.location.href='/index.html';
})
function Detection(){
    $.ajax({
        "type": "post",
        "url": "/web/user/check/timeout",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (data.retCode == '9301'||data.retCode == 9301){
                $('#c_ErrorMsg').html('已登录，即将跳转首页').fadeIn(200); Disappear("#c_ErrorMsg");
                var UserType=store.get('UserType')
                if(UserType==1||UserType=='1'){
                    window.location.href="../../../model/index/indexX.html";
                }
                else {
                    window.location.href="../../../student/model/index/index.html";
                }
            }
        }
    });
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
                $('#PhoneError').html('手机号格式错误');
                $('#PhoneImg').fadeIn(100).removeClass('riico').addClass('wroico');
            }
            else {
                $('#PhoneError').html('');
                $('#PhoneImg').fadeIn(100).removeClass('wroico').addClass('riico');
                CheckPhoneExist();
            }
            //判断用户是否记住密码
            if($('#Phone').val()==store.get("key")){
                if(store.get("userPass")){
                    var Pass=$.base64.decode(store.get("userPass"))
                    $('#Pass').val(Pass);
                }
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
        "url":"  /web/user/check/mobile/exist",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum!=0){
                $('#PhoneError').html('用户不存在');
                $('#PhoneImg').fadeIn(100).removeClass('riico').addClass('wroico');
            }
            if(codenum==0){
                $('#PhoneError').html('');
                $('#PhoneImg').fadeIn(100).removeClass('wroico').addClass('riico');
            }
        }
    });
};
//用户登录
LogIn();
function LogIn(){
    $('#LoginBtn').off('click')
    $('#LoginBtn').on('click',function(){
        var IsPhoneAndPass=($('#Phone').val().length==0&&$('#Pass').val().length==0);//手机号和密码都没写
        var IsPassNull=($('#PhoneError').html()==''&&$('#Pass').val().length==0);//用户手机号正确，密码为空
        var IsPhoneWrong=($('#PhoneError').html()!='');//用户手机号错误
        //手机号和密码都没写，提示输入手机号
        if(IsPhoneAndPass){
            $('#PhoneError').html('请输入手机号');
            $('#PhoneImg').fadeIn(100).removeClass('riico').addClass('wroico');
        }
        //用户手机号正确，密码为空
        else if(IsPassNull){
            $('#PassError').html('请输入密码');
            $('#PassImg').fadeIn(100).removeClass('riico').addClass('wroico');
        }
        else if(IsPhoneWrong){

        }
        //用户手机号正确和密码不为空
        else {
            CheckUserLogIn();
        }
    });
    $(document).ready(function(e) {
        $(this).keydown(function (e){
            if(e.which == "13"){
                $('#LoginBtn').click();
            }
        })
    });
};
//检验用户登录信息
function CheckUserLogIn(){
    var subData = {};
    subData.mobile = $("#Phone").val();
    subData.password = $.md5($('#Pass').val());
    subData.imageCaptcha = $('#Code').val();
    $.ajax({
        "type":"post",
        "url":"/web/user/login",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1));
            var Code=data.retCode;
            //登录成功
            if(Code=='0000'||Code==0000||Code==0){
                GetHeadImg(data.retData.userType);//获取用户头像
                CheckUserRemember()//检验用户是否记住密码
                store.set('data', data);//将目录存储到本地
                store.set('key',$("#Phone").val())
                $('#c_ErrorMsg').html('登录中').fadeIn(200); Disappear("#c_ErrorMsg");
            }
            else if(Code=='2203'||Code==2203){
                GetCaptcha();//更换验证码
                $('#PassError').html('');//密码错误提示清空；
                $('#PassImg').css('display','none');
                if($('#Code').val()==''){
                    $('#CodeError').html("请输入验证码");
                    GetCaptcha();
                }
                else {
                    $('#CodeError').html("验证码错误");
                    GetCaptcha();
                }
            }
            else if(Code=='2101'||Code==2101){
                $('#CodeError').html("请输入验证码");
                GetCaptcha();
            }
            else if(Code=='3001'||Code==3001){
                $('#CodeError').html("");
                $('#PassError').html(data.retMsg);
                $('#PassImg').fadeIn(100).removeClass('riico').addClass('wroico');
            }
            else if(Code=='9301'||Code==9301){
                $('#c_ErrorMsg').html('您已登录，即将为您跳转首页').fadeIn(200); Disappear("#c_ErrorMsg");
                var UserType=store.get('UserType');
                if(UserType==1||UserType=='1'){
                    window.location.href="../../../model/index/indexX.html";
                }
                else {
                    window.location.href="../../../student/model/index/index.html";
                }
            }
            else {
                // $('#c_ErrorMsg').html('请输入图形验证码').fadeIn(200); Disappear("#c_ErrorMsg");
            }
            if(codenum!=0&&codenum!=9){
                $('#CodeMain').css('display','block');
                GetCaptcha();
            }
        }
    })
};
//获取用户头像
function GetHeadImg(type){
    $.ajax({
        "type": "post",
        "url": "/web/user/getheadimg",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum==0){
                store.set('UserType',type)
                if(AllData==''){
                    if(type==1||type=="1"){
                        store.set('UserHeadImgSrc','../../static/image/me/user.png');
                    }
                    else {
                        store.set('UserHeadImgSrc','../../static/image/common/user.png');
                    }
                }
                else {
                    store.set('UserHeadImgSrc',AllData);
                }
                if(type==1||type=="1"){

                    window.location.href="../../../model/index/indexX.html";}
                else {
                    window.location.href="../../../student/model/index/index.html";
                }
            }else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200); Disappear("#c_ErrorMsg");
            }
        }
    });
};
//检验用户是否记住密码
function CheckUserRemember(){
    //IsSavePass==1;表示用户选择了记住密码
    //IsSavePass==0;表示用户取消了记住密码
    if(store.get("IsSavePass")==1){
        var BaseStr=$.base64.encode($('#Pass').val())
        store.set("userPass", BaseStr);
        $('#Remember').removeClass('reico0').addClass('reico1');//选择框变成有绿点
    }
    else {
        store.set("userPass",'');
        $('#Remember').removeClass('reico1').addClass('reico0');//选择框变成无绿点
    }
}
//更换验证码
function GetCaptcha(){
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
                $('#c_ErrorMsg').html('验证码获取失败，请重试').fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
};
//记住密码
RememberPass();
function RememberPass(){
    //IsSavePass==1;表示用户选择了记住密码
    //IsSavePass==0;表示用户取消了记住密码
    if(store.get("IsSavePass")==1){
        $('#Remember').removeClass('reico0').addClass('reico1');//选择框变成有绿点
    }
    else {
        $('#Remember').removeClass('reico1').addClass('reico0');//选择框变成无绿点
    }
    $('#Remember').on('click',function(){
        //取消记住密码
        if($(this).hasClass('reico0')){
            $('#Remember').removeClass('reico0').addClass('reico1');
            store.set("IsSavePass", 1);
        }
        //记住密码
        else {
            $('#Remember').removeClass('reico1').addClass('reico0');
            store.set("IsSavePass", 0);
        }
    })
};
//文本输入框错误重置
WrongReset();
function WrongReset(){
    $('#Phone').bind('click mousedown',function(){
        $('#PhoneError').html('');
        $('#PhoneImg').css('display','none');
    })
    $('#Pass').bind('click mousedown',function(){
        $('#PassError').html('');
        $('#PassImg').css('display','none');
    })
    $('#Code').bind('click mousedown',function(){
        $('#CodeError').html('');
    })
    $('#ChangeCode').on('click ',function(){
        GetCaptcha();
    })
}