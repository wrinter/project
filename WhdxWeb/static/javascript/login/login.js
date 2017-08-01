/****************************************Created by 徐扬 on 2016/12/6.*****************************************/
CheckBrower();
function CheckTimeOut(){}
IsTimeOut()
function IsTimeOut(){
    var Time=null;
    var Time1=null;
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
                Time=setTimeout(function(){
                    if(UserType==1||UserType=='1'){
                        window.location.href="../../../model/index/indexX.html";
                    }
                    else {
                        window.location.href="../../../student/model/index/index.html";
                    }

                },2000);
            }
        }
    });
};
/*验证手机格式正则*/
var pat=/^(13|14|19|15|18|17)[0-9]{9}$/;
var remnum=0;
/*绝对居中*/
function Center(){
    setInterval(function(){
        var LH=$('#Login').outerHeight();
        var LCH=$('#LoginCenter').outerHeight();
        var Mt=(LCH-LH)/2;
        $('#Login').css({"margin-top":Mt});
    },1)
};
Center();
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
/*更换验证码*/
function GetCaptcha(){
    $.ajax({
        "type":"post",
        "url":"/web/common/captcha",
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                $("#CapImg").attr("src",data.retData);
            }
            else{
                $('#c_ErrorMsg').html('验证码获取失败，请重试').fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
};
/*验证手机号是否存在*/
function CheckPhone(){
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
            }
            if(codenum==0){
                $('#PhoneError').html('');
            }
        }
    });
};
/*手机号失去焦点判断*/
PhoneOnblur();
function PhoneOnblur(){
    $('#Phone').on('blur',function(){
        if($('#Phone').val()!=''){
            $('#PhoneError').html('');
            //检验手机号格式
            if(pat.test($('#Phone').val())==false){
                $('#PhoneError').html('手机号格式错误');
            }
            else {
                $('#PhoneError').html('');
                CheckPhone();
            }
            //判断用户是否记住密码
            if($('#Phone').val()==store.get("key")){
                if(store.get("userPass")){
                    var Pass=$.base64.decode(store.get("userPass"))
                    $('#Pass').val(Pass);
                }
            }
        }
    })
};
/*记住密码*/
RememberPass();
function RememberPass(){
    if(store.get("remnum")==1){$('#Remember').removeClass('i_slcico0').addClass('i_slcico1');}
    else {$('#Remember').removeClass('i_slcico1').addClass('i_slcico0');}
    $('#Remember').on('click',function(){
        /*取消记住密码*/
        if($(this).hasClass('i_slcico0')){
            $('#Remember').removeClass('i_slcico0').addClass('i_slcico1');
            remnum=1;
            store.set("remnum", remnum);
        }
        /*记住密码*/
        else {
            $('#Remember').removeClass('i_slcico1').addClass('i_slcico0');
            remnum=0;
            store.set("remnum", remnum, 365);
        }
    })
};

/*检验用户是否记住密码*/
function CheckUserRemember(){
    if(store.get("remnum")==1){
        var BaseStr=$.base64.encode($('#Pass').val())
        store.set("userPass", BaseStr);
        $('#Remember').removeClass('i_slcico0').addClass('i_slcico1');
    }
    if(store.get("remnum")==0) {
        $('#Remember').removeClass('i_slcico1').addClass('i_slcico0');
        store.set("userPass",'');
    }
}
/*更换验证码*/
ChangeCaptcha()
function ChangeCaptcha(){
    $('#ChangeCap').on('click',function(){GetCaptcha()})
};
//用户输入密码动画
UserCapIn();
function UserCapIn(){
    $('#Pass').on('click',function(){
        $('#Katon').attr('src','static/image/login/i_ko0.png')
    })
    $('#Pass').on('blur',function(){
        $('#Katon').attr('src','static/image/login/i_ko1.png')
    })
}
/*检验用户登录信息*/
function CheckUserLogIn(){
    var subData = {};
    subData.mobile = $("#Phone").val();
    subData.password = $.md5($('#Pass').val());
    subData.imageCaptcha = $('#Captcha').val();
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
                store.set('key',$("#Phone").val(),365)
                $('#c_ErrorMsg').html('登录中').fadeIn(200); Disappear("#c_ErrorMsg");
            }
            else if(Code=='2203'||Code==2203){
                GetCaptcha();//更换验证码
                $('#PassError').html('');//密码错误提示清空；
                if($('#Captcha').val()==''){
                    $('#CapError').html("请输入验证码");
                    GetCaptcha();
                }
                else {
                    $('#CapError').html("验证码错误");
                    GetCaptcha();
                }
            }
            else if(Code=='3001'||Code==3001){
                $('#CapError').html("");
                $('#PassError').html(data.retMsg);
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
                $('#c_ErrorMsg').html('请输入图形验证码').fadeIn(200); Disappear("#c_ErrorMsg");
            }
            if(codenum!=0&&codenum!=9){
                $('#CaptchaMain').css('display','block');
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
                //var vedioUrl = store.get("vedioUrl");
                //console.log(vedioUrl)
                //if(vedioUrl!=undefined){
                //    store.remove("vedioUrl");
                //    window.location.href=vedioUrl;
                //    return;
                //}
                if(type==1||type=="1"){window.location.href="../../../model/index/indexX.html";}
                else {window.location.href="../../../student/model/index/index.html";}
            }else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200); Disappear("#c_ErrorMsg");
            }
        }
    });
};
/*用户登录*/
LogIn();
function LogIn(){
    $('#LoginBtn').on('click',function(){
        var IsPhoneAndPass=($('#Phone').val().length==0&&$('#Pass').val().length==0);//手机号和密码都没写
        var IsPassNull=($('#PhoneError').html()==''&&$('#Pass').val().length==0);//用户手机号正确，密码为空
        var IsPhoneWrong=($('#PhoneError').html()!='');//用户手机号正确，密码为空
        //手机号和密码都没写，提示输入手机号
        if(IsPhoneAndPass){$('#PhoneError').html('请输入手机号');}
        //用户手机号正确，密码为空
        else if(IsPassNull){$('#PassError').html('请输入密码');}
        else if(IsPhoneWrong){}
        //用户手机号正确和密码不为空
        else {CheckUserLogIn();}
    });
    $(document).ready(function(e) {
        $(this).keydown(function (e){
            if(e.which == "13"){
                $('#LoginBtn').click();
            }
        })
    });
};
//二维码
QrCode();
function QrCode(){
    $('#QrCode').hover(function(){
        $('#Qrbox').stop(true).fadeIn(200)
    },function(){
        $('#Qrbox').stop(true).fadeOut(200)
    });
};
//文本输入框错误重置
WrongReset()
function WrongReset(){
    $('#Phone').on('click',function(){$('#PhoneError').html('');})
    $('#Pass').on('click',function(){$('#PassError').html('');})
    $('#Captcha').on('click',function(){$('#CapError').html('');})
}





