/****************************************Created by 徐扬 on 2016/12/6.*****************************************/
/******************************获取导航*******************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
SystemRedMsg();
/******************************错题本模块*******************************/
$(".m_List li:first-child").on("click",function () {
    window.location.href="../../../model/me/me_myNotebook.html";
});
//验证码已发送
function HasSend(a){
    $(a).attr('disabled',true).val('验证码已发送').css('background','#999');
}
function SendDone(a){
    $(a).attr('disabled',false).val('获取验证码').css('background','');
}
/*控制编辑基本资料账号安全不可编辑*/
function IsCanEdit(a,b,c){
    $(a).on('click',function(){
        $(b).css('display','block');
        $(c).css('display','none');
    })
};
/*控制可编辑*/
function CanEdit(){
    $('#Base').css('display','none');
    $('#Security').css('display','none');
}
/*验证手机格式正则*/
var pat=/^(13|14|19|15|18|17)[0-9]{9}$/;
var patEmail= /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
//输入框输入，错误重置
ErrorReset();
function ErrorReset(){
    //绑定邮箱
    $('#m_NewEmail0').on('click',function(){$('#m_NewEmailError0').html('');});
    $('#m_CapInputE').on('click',function(){$('#m_CapErrorE0').html('');});
    $('#r_MsgEIn').on('click',function(){$('#m_SmsErrorE0').html('');});
    //修改邮箱
    $('#m_UserPass1').on('click',function(){$('#m_EmailError0').html('');});
    $('#m_NewEmail1').on('click',function(){$('#m_NewEmailError1').html('');});
    $('#m_EmailCapInput').on('click',function(){$('#m_EmailCapError0').html('');});
    $('#r_EmailIn').on('click',function(){$('#m_EmailError1').html('');});
    //修改密码
    $('#m_OldPass0').on('click',function(){$('#m_PassError1').html('');});
    $('#m_NewPass0').on('click',function(){$('#m_PassError2').html('');});
    $('#m_NewPass1').on('click',function(){$('#m_PassError3').html('');});
    //修改手机号
    $('#m_UserPass0').on('click',function(){$('#m_PassError0').html('');});
    $('#m_PhoneIn0').on('click',function(){$('#m_PhoneError0').html('');});
    $('#m_CapInput').on('click',function(){$('#m_CapError0').html('');});
    $('#r_MsgIn').on('click',function(){$('#m_SmsError0').html('');});
}
/********************************绑定邮箱**************************************************/
/*绑定邮箱*/
function BoundEmailMain(){
    IsCanEdit('#bound','#Base','#Security');
    /*进入绑定邮箱*/
    $('#bound').on('click',function(){
        EmailDataReset();
        $('#SaveNoEmail').fadeIn(150)
        $('#Account').css('display','none');
    });
    /*发送验证码*/
    $('#r_MsgInBtnE0').on('click',function(){
        HasSend('#r_MsgInBtnE0');
        BoundEmail();
        CheckEmailIs();
    });
    /*绑定邮箱确定*/
    $('#m_EmailEnsureBtn0').on('click',function(){CanEdit();SaveEmail();});
    /*取消绑定邮箱*/
    $('#m_EmailCancelBtn0').on('click',function(){
        EmailDataReset();
        CanEdit();
        $('#Account').fadeIn(150)
        $('#SaveNoEmail').css('display','none');
    });
    /*更换验证码*/
    $('#m_CapChangeE0').on('click',function(){
        GetCaptcha();
    });
}
/*校验邮箱格式*/
function CheckEmailIs(){
    if($('#m_NewEmail0').val()!=''){
        if(patEmail.test($('#m_NewEmail0').val())==false){
            $('#m_NewEmailError0').html('邮箱格式错误')
        }
        else {
            $('#m_NewEmailError0').html('');
        }
    }
    else {
        $('#m_NewEmailError0').html('请填写邮箱地址');
    }
};
/*获取邮箱验证码*/
function BoundEmail(){
    var subData = {};
    subData.email = $('#m_NewEmail0').val();//邮箱地址
    subData.captcha = $('#m_CapInputE').val();//图形验证码
    $.ajax({
        "type":"post",
        "url":"/web/user/safe/emailcaptcha",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =data.retCode;
            SendDone('#r_MsgInBtnE0');
            if(codenum=='0000'||codenum==0000){
                $('#m_CapErrorE0').html('');
                WaitTime('#r_MsgInBtnE0','#r_SendTelDisE1','#f_SendSecE1');
            }
            else if(codenum=='2201'||codenum==2201){
                $('#m_CapErrorE0').html('图形验证码错误');
                GetCaptcha();
            }
            else if(codenum==3002||codenum=='3002'){
                $('#m_NewEmailError0').html('邮箱已存在')
            }
            else if(codenum=="2301"||codenum==2301){
                $('#m_CapErrorE0').html('');
                $('#c_ErrorMsg').html('抱歉，60s内只能发送一次').fadeIn(200);  Disappear("#c_ErrorMsg");
            }
            else {
            }
        }
    })
};
/*保存邮箱*/
function SaveEmail(){
    if($('#r_MsgEIn').val()==''){
        $('#m_SmsErrorE0').html('请输入验证码');
    }
    else {
        $('#m_SmsErrorE0').html('');
        var subData = {};
        subData.email = $('#m_NewEmail0').val();//邮箱地址
        subData.captcha = $('#r_MsgEIn').val();//邮箱验证码
        subData.userType ='1';//类型
        $.ajax({
            "type":"post",
            "url":"/web/user/safe/updateemail",
            "dataType":"json",
            "data":subData,
            success:function(data){
                var codenum =parseInt(data.retCode.substr(0, 1)) ;
                if(codenum==0){
                    $('#c_ErrorMsg').html('绑定成功').fadeIn(200);
                    GoldAnimate(data.retGold);
                    Disappear("#c_ErrorMsg");
                    GetAbout();
                    $('#Account').fadeIn(150)
                    $('#SaveNoEmail').css('display','none');
                }
                if(codenum==2){
                    $('#c_ErrorMsg').html('绑定失败，请重试').fadeIn(200);
                    Disappear("#c_ErrorMsg");
                }
            }
        })
    };
};
/*绑定邮箱数据重置*/
function EmailDataReset(){
    $('#m_SmsErrorE0').html('');
    $('#m_NewEmailError0').html('');
    $('#m_CapErrorE0').html('');
    $('#m_EmailError0').html('');
    $('#m_NewEmailError1').html('');
    $('#m_EmailCapError0').html('');
    $('#m_EmailError1').html('');
    $('#r_MsgEIn').val('');
    $('#m_NewEmail0').val('');
    $('#m_CapInputE').val('');
    $('#r_MsgEIn').val('');
    $('#m_UserPass1').val('');
    $('#m_NewEmail1').val('');
    $('#m_EmailCapInput').val('');
    $('#r_EmailIn').val('');
};
$('#m_NewEmail0').on('blur',function(){
    CheckEmailIs();
});
/********************************修改邮箱**************************************************/
/*修改邮箱操作*/
function ChangeEmailMain(){
    IsCanEdit('#ChangeEmail','#Base','#Security');
    /*进入修改邮箱*/
    $('#ChangeEmail').on('click',function(){
        EmailDataReset();
        $('#SaveOldEmail').fadeIn(150);
        $('#Account').css('display','none');
    });
    /*更换验证码*/
    $('#m_EmailCapChange0').on('click',function(){
        GetCaptcha();
    });
    /*发送邮箱验证码*/
    $('#r_EmailInBtn0').on('click',function(){
        if($('#m_UserPass1').val()==''){
            $('#m_EmailError0').html('请输入密码');
        }
        else {
            $('#m_EmailError0').html('');
            CheckEmailPass();
        }
    });
    /*修改邮箱*/
    $('#m_EmailEnsureBtn1').on('click',function(){CanEdit();SaveNewEmail();});
    /*取消绑定邮箱*/
    $('#m_EmailCancelBtn1').on('click',function(){
        CanEdit();
        EmailDataReset();
        $('#Account').fadeIn(150)
        $('#SaveOldEmail').css('display','none');
    });
}
/*修改邮箱发送验证码*/
function ChangeEmail(){
    $('#m_EmailCapError0').html('');
    var subData = {};
    subData.captcha = $('#m_EmailCapInput').val();//图形验证码
    subData.password = $.md5($('#m_UserPass1').val());//用户密码
    subData.email = $('#m_NewEmail1').val();//新邮箱
    $.ajax({
        "type":"post",
        "url":"/web/user/safe/modifyemailcaptcha",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =data.retCode;
            SendDone('#r_EmailInBtn0');
            if(codenum=='0000'||codenum==0000){
                $('#m_EmailCapError0').html('');
                WaitTime('#r_EmailInBtn0','#r_SendEmailDis1','#f_EmailSendSec1');
            }
            else if(codenum=='2201'||codenum==2201){
                $('#m_EmailCapError0').html('图形验证码错误');
                GetCaptcha();
            }
            else if(codenum==3002||codenum=='3002'){
                $('#m_NewEmailError1').html('邮箱已存在')
            }
            else if(codenum=="2301"||codenum==2301){
                $('#m_CapErrorE0').html('');
                $('#c_ErrorMsg').html('抱歉，60s内只能发送一次').fadeIn(200);  Disappear("#c_ErrorMsg");
            }
            else {

            }

        }
    })
};
/*修改邮箱校验密码*/
function CheckEmailPass(){
    var SubDate={};
    SubDate.password= $.md5($('#m_UserPass1').val())
    $.ajax({
        "type":"post",
        "url":" /web/user/safe/checkpwd",
        "dataType":"json",
        "data":SubDate,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum!=0){
                $('#m_EmailError0').html('密码错误')
            }
            else {
                $('#m_EmailError0').html('');
                CheckNewEmailIs();
            }
        }
    });
};
/*校验邮箱格式*/
function CheckNewEmailIs(){
    if($('#m_NewEmail1').val()!=''){
        if(patEmail.test($('#m_NewEmail1').val())==false){
            $('#m_NewEmailError1').html('邮箱格式错误')
        }
        else {
            $('#m_NewEmailError1').html('');
            HasSend('#r_EmailInBtn0')
            ChangeEmail();
        }
    }
    else {
        $('#m_NewEmailError1').html('请填写邮箱地址');
    }
};
/*保存邮箱*/
function SaveNewEmail(){
    if($('#r_EmailIn').val()==''){
        $('#m_EmailError1').html('请输入验证码');
    }
    else {
        $('#m_EmailError1').html('');
        var subData = {};
        subData.email = $('#m_NewEmail1').val();//邮箱地址
        subData.captcha = $('#r_EmailIn').val();//邮箱验证码
        subData.userType ='1';//类型
        $.ajax({
            "type":"post",
            "url":"/web/user/safe/updateemail",
            "dataType":"json",
            "data":subData,
            success:function(data){
                var codenum =parseInt(data.retCode.substr(0, 1)) ;
                if(codenum==0){
                    $('#c_ErrorMsg').html('修改成功').fadeIn(200);
                    Disappear("#c_ErrorMsg");
                    GetAbout();
                    $('#Account').fadeIn(150)
                    $('#SaveOldEmail').css('display','none');
                }
                if(codenum==2){
                    $('#c_ErrorMsg').html('修改失败，请重试').fadeIn(200);
                    Disappear("#c_ErrorMsg");
                }
            }
        })
    };
};
$('#m_NewEmail1').on('blur',function(){
    CheckEmailIs();
});
/********************************修改密码**************************************************/
IsCanEdit('#ChangePass','#Base','#Security');
/*修改密码*/
$('#ChangePass').on('click',function(){
    PassDataReset();
    $('#SavePass').fadeIn(150)
    $('#Account').css('display','none');
});
function PassCss(){
    $('#m_OldPass0').on('click',function(){$('#m_PassError1').html('')})
    $('#m_NewPass0').on('click',function(){$('#m_PassError2').html('')})
    $('#m_NewPass1').on('click',function(){$('#m_PassError3').html('')})
}
PassCss();
/*确定修改密码*/
$('#m_PassEnsureBtn').on('click',function(){
    CanEdit();
    IsPassRight();
    if($(this).hasClass('CanSave')){
        SaveChangePass();
    }
});
/*取消修改密码*/
$('#m_PassCancelBtn').on('click',function(){
    CanEdit('#Security','#Base');
    PassDataReset();
    $('#Account').fadeIn(150)
    $('#SavePass').css('display','none');
});
/*密码重置*/
function PassDataReset(){
    $('#m_OldPass0').val('');
    $('#m_NewPass0').val('');
    $('#m_NewPass1').val('');
    $('.m_Error').html('');
}
/*修改密码校验密码*/
$('#m_OldPass0').blur(function(){
    UpCheckPass();
})
function UpCheckPass(){
    if($('#m_OldPass0').val()=='')
    {
        $('#m_PassError1').html('请输入旧密码');
    }
    else {
        $('#m_PassError1').html('');
        var SubDate={};
        SubDate.password= $.md5($('#m_OldPass0').val())
        $.ajax({
            "type":"post",
            "url":" /web/user/safe/checkpwd",
            "dataType":"json",
            "data":SubDate,
            success:function(data){
                var codenum =parseInt(data.retCode.substr(0, 1)) ;
                if(codenum!=0){
                    $('#m_PassError1').html('密码错误')
                }
                else {
                    $('#m_PassError1').html('');
                }
            }
        });
    }

};
/*判断两次密码是否一致*/
function IsPassRight(){
    if($('#m_NewPass0').val().length<6){
        $('#m_PassError2').html('请填写6~16位字符');
        $('#m_PassEnsureBtn').removeClass('CanSave');
    }
    else {
        $('#m_PassError2').html('');
        $('#m_NewPass1').on('blur',function(){
            if($('#m_NewPass0').val()!=$('#m_NewPass1').val()){
                $('#m_PassError3').html('请输入相同密码');
                $('#m_PassEnsureBtn').removeClass('CanSave');
            }
            else {
                if($('#m_OldPass0').val()==$('#m_NewPass1').val()){
                    $('#m_PassError3').html('新密码与旧密码不能相同');
                }
                else {
                    $('#m_PassError3').html('');
                    $('#m_PassEnsureBtn').addClass('CanSave');
                }

            }
        })
    }
}
//重新登录
function ResetLogIn(){
    $('#c_ErrorMsg').html('修改成功,请重新登录').fadeIn(200);
    Disappear("#c_ErrorMsg");
    var Time=null;
    if(Time){clearTimeout(Time)}
    Time=setTimeout(function(){
        $.ajax({
            "type": "get",
            "url": "/web/user/logout?" + Math.random(),
            "dataType": "json",
            success: function (data) {
                var codenum = parseInt(data.retCode.substr(0, 1));
                if (codenum == 0) {
                    window.location.href = '../../index.html';
                }
                else {
                    $('#c_ErrorMsg').html('退出失败请重试').fadeIn(200);
                    Disappear("#c_ErrorMsg")
                }
            }
        })
    },2000)
}

/*保存密码*/
function SaveChangePass(){
    var SubDate={};
    SubDate.oldpwd= $.md5($('#m_OldPass0').val())
    SubDate.password= $.md5($('#m_NewPass1').val())
    $.ajax({
        "type":"post",
        "url":" /web/user/safe/resetpwd",
        "dataType":"json",
        "data":SubDate,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                ResetLogIn();
                GetAbout();
                $('#Account').fadeIn(150)
                $('#SavePass').css('display','none');
            }
            else {
                $('#c_ErrorMsg').html('修改失败，请重试').fadeIn(200);
                Disappear("#c_ErrorMsg");
            }
        }
    });
};
/*获取验证码*/
GetCaptcha();
function GetCaptcha(){
    $.ajax({
        "type":"post",
        "url":"/web/common/captcha",
        "dataType":"json",
        success:function(date){
            $("#m_CapImg0").attr("src",date.retData);
            $("#m_CapImgE0").attr("src",date.retData);
            $("#m_EmailCapImg0").attr("src",date.retData);
        }
    });
};
$('#m_NewPass0').on('blur',function(){
    IsPassRight();
});
/********************************编辑个人资料**************************************************/
/*更换头像*/
$("#m_ChangeImg").click(function(){
    window.location.href="me_changePhoto.html";
});
$('#m_Photo').hover(function(){
    $("#m_ChangeImg").fadeIn(150);
},function(){
    $("#m_ChangeImg").fadeOut(150);
})
/*编辑个人资料按钮*/
function StartEdit(){
    IsCanEdit('#m_Editit','#Security','#Base');
    $('#m_Editit').on('click',function(){
        if($(this).find('i').hasClass('p_editico1')){
            $(this).css('color',"#CCC").find('i').removeClass('p_editico1').addClass('p_editico0');
            $('#InfoShow').css('display','none');
            $('#InfoEdit').css('display','block');
        }
    })
}
StartEdit();
/*下拉*/
$('.m_AreaSelect').on('click',function(e){
    stopBubble(e);
    $(this).find('.arealist').slideToggle(150);
    $(this).siblings().find('.arealist').slideUp(150);
});
/*获取个人基本信息*/
function GetAbout(){
    $.ajax({
        "type":"post",
        "url":" /web/teacher/center/baseinfo",
        "dataType":"json",
        success:function(data){
            var AllData=data.retData;
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                console.log(AllData);
                CreatUserBaseInfo(AllData);//用户个人资料默认
                UserSchoolInfo(AllData)//用户学校信息
                DefultSchoolInfo(AllData)//用户修改资料默认学校信息
                CreatDefultPhone(AllData);//默认账号信息
                GetMaterial();
                // GetProvince(IsHasPro);
            }
        }
    });
};
GetAbout();
function CreatUserBaseInfo(data) {
    var userName=data.userName;
    $('#m_userName0').html(userName);//姓名
    $('#m_UserName').attr('data-defult',userName).val(userName);//姓名
    var subjectName=data.subjectName;
    var subjectId=data.subjectId;
    var materialName=data.materialName;
    var materialId=data.materialId;
    $('#m_material0').html(materialName);//教材
    $('#m_subject0').html(subjectName);//学科
    $('#m_Sub').html(subjectName).attr({'data-defult':subjectId,'data-Id':subjectId});//修改资料的学科
    $('#m_Material').attr({'data-defult':materialId,'data-Id':materialId}).html(materialName);//修改资料的教材
    store.set('subjectId',subjectId);//保存学科id
}
//用户默认学校信息
function UserSchoolInfo(data) {
    var provinceName=data.provinceName;
    var cityName=data.cityName;
    var countyName=data.countyName;
    var schoolId=data.schoolId;
    var schoolName=data.schoolName;
    var IsSchool=(schoolId==null||schoolId=='');
    //如果有学校
    if(!IsSchool){
        $('#m_provice0').html(provinceName+" | ");//省份
        $('#m_city0').html(cityName+" | ");//城市
        if(countyName==null||countyName==''){}
        else {
            $('#m_aera0').html(countyName+" | ");//地区
        }
        $('#m_school0').html(schoolName);//学校
    }else {
        $('#m_provice0').html("暂未找到学校信息");//省份
    }
}
//用户修改资料默认学校信息
function DefultSchoolInfo(data) {
    var provinceId=data.provinceId;
    var provinceName=data.provinceName;
    var cityId=data.cityId;
    var cityName=data.cityName;
    var countyId=data.countyId;
    var countyName=data.countyName;
    var schoolId=data.schoolId;
    var schoolName=data.schoolName;
    var IsSchool=(schoolId==null||schoolId=='');
    //如果有学校
    if(!IsSchool){
        $('#c_ProvinceCon').attr({'data-defult':provinceId,'data-Id':provinceId}).html(provinceName);//省份
        $('#c_CityCon').attr({'data-defult':cityId,'data-Id':cityId}).html(cityName);//城市
        $('#c_CountyCon').attr({'data-defult':countyId,'data-Id':countyId}).html(countyName);//地区
        $('#c_SchoolCon').attr({'data-defult':schoolId,'data-Id':schoolId}).html(schoolName);//学校
        GetProvince(true);//是否是默认的
    } else {
        $('#c_ProvinceCon').attr({'data-defult':provinceId,'data-Id':provinceId}).html(provinceName);//省份
        $('#c_CityCon').attr({'data-defult':cityId,'data-Id':cityId}).html(cityName);//城市
        $('#c_CountyCon').attr({'data-defult':countyId,'data-Id':countyId}).html(countyName);//地区
        $('#c_SchoolCon').attr({'data-defult':schoolId,'data-Id':schoolId}).html(schoolName);//学校
        GetProvince(false);//是否是默认的
    }

}
//获取省份
function GetProvince(IsHasPro){
    $.ajax({
        "type":"post",
        "url":"/web/common/area?parentId=100000",
        "dataType":"json",
        success:function(data){
            var AllData=data.retData;
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                CreatProvince(AllData,IsHasPro);
            }
        }
    });
};
//创建省
function CreatProvince(data,IsHasPro) {
    var $areahtml='';
    for(var i=0;i<data.length;i++){
        $areahtml+='<li data-Id="'+data[i].id+'">'+data[i].name+'</li>'
    }
    $('#c_ProvinceList').html($areahtml);//省份列表

    ProvinceOpration();
};
//省份操作
function ProvinceOpration() {
    GetCity(true);
    $('#c_ProvinceList li').off('click');
    $('#c_ProvinceList li').on('click',function(){
        var Id=$(this).attr('data-Id');
        $('#c_ProvinceCon').html($(this).html()).attr('data-Id',Id);
        GetCity(false);
    });
};
// 获取城市
function GetCity(IsDefult){
    var subData = {};
    /*根据省份匹配城市*/
    subData.parentId=$('#c_ProvinceCon').attr('data-Id');
    /*获取城市*/
    $.ajax({
        "type":"post",
        "url":"/web/common/area",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var AllData=data.retData;
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                CreatCity(AllData,IsDefult);
            }
        }
    });
};
//创建城市
function CreatCity(data,IsDefult) {
    var $cityhtml='';
    for(var i=0;i<data.length;i++){
        $cityhtml+='<li data-Id="'+data[i].id+'">'+data[i].name+'</li>';
    }
    $('#c_CityList').html($cityhtml);
    //如果不是最初的默认状态
    CityOpration();
    if(!IsDefult){
        $('#c_CityCon').html(data[0].name).attr('data-Id',data[0].id);
        GetCounty(false);
    }else {
        GetCounty(true);
    }
}
//城市操作
function CityOpration() {
    $('#c_CityList li').off('click');
    $('#c_CityList li').on('click',function(){
        var Id=$(this).attr('data-Id');
        $('#c_CityCon').html($(this).html()).attr('data-Id',Id);
        GetCounty(false);
    });
}
//获取县区
function GetCounty(IsDefult){
    var subData = {};
    /*根据城市匹配县区*/
    subData.parentId=$('#c_CityCon').attr('data-Id');
    $.ajax({
        "type":"post",
        "url":"/web/common/area",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var AllData=data.retData;
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                CreatContry(AllData,IsDefult);
            }
        }
    });
};
//创建县区
function CreatContry(data,IsDefult) {
    var $countyhtml='';
    if(data.length>0){
        $('#CountyCon').css('display','block');
        for(var i=0;i<data.length;i++){
            $countyhtml+='<li data-Id="'+data[i].id+'">'+data[i].name+'</li>';
        }
        $('#c_CountyList').html($countyhtml);
        if(!IsDefult){
            $('#c_CountyCon').html(data[0].name).attr('data-Id',data[0].id);
            GetSchool(false,true);
        }
        else {
            GetSchool(true,true);
        }
        ContryOpration();
    }else {
        $('#CountyCon').css('display','none');
        if(!IsDefult){
            GetSchool(false,false);
        }else {
            GetSchool(true,false);
        }
    }
}
//正常的县区操作
function ContryOpration() {
   //第一个参数判断是否是默认状态，第二个参数判断是否需要地区
    $('#c_CountyList li').off('click')
    $('#c_CountyList li').on('click',function(){
        var Id=$(this).attr('data-Id');
        $('#c_CountyCon').html($(this).html()).attr('data-Id',Id);
        GetSchool(false,true);
    });
}
// 获取学校
function GetSchool(IsDefult,IsHasContry){
    $('#c_SchoolList').html('<li>暂无学校</li>');
    /*学校选择*/
    var subData = {};
    /*省份ID*/
    subData.provinceId=$('#c_ProvinceCon').attr('data-Id');
    /*城市ID*/
    subData.cityId=$('#c_CityCon ').attr('data-Id');
    /*区县ID*/
    if(IsHasContry){
        subData.countyId=$('#c_CountyCon').attr('data-Id');
    }else {

    }
    $.ajax({
        "type":"post",
        "url":"/web/common/school",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var AllData=data.retData;
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                if(data.retData.length>0){
                    CreatSchool(AllData,IsDefult);
                }
                else {
                    $('#c_SchoolCon').html('暂无学校')
                }
            }
        }
    });
};
//创建学校
function CreatSchool(data,IsDefult) {
    var $schoolhtml='';
    for(var i=0;i<data.length;i++){
        $schoolhtml+='<li data-Id="'+data[i].id+'">'+data[i].schoolName+'</li>'
    }
    $('#c_SchoolList').html($schoolhtml);
    if(!IsDefult){
        $('#c_SchoolCon').html(data[0].schoolName).attr('data-Id',data[0].id)
    }
    SchoolOp();
}
//学校操作
function SchoolOp() {
    $('#c_SchoolList li').off('click')
    $('#c_SchoolList li').on('click',function(){
        var Id=$(this).attr('data-Id');
        $('#c_SchoolCon').html($(this).html()).attr('data-Id',Id);
        if($('#c_SchoolCon').html()!='选择学校'){
            $('#c_SchoolEnsure').css('background','#58C1E4');
        }
    });
}
// 获取教材
function GetMaterial(){
    var SubData={}
    SubData.subjectId=$('#m_Sub').attr('data-Id');
    $.ajax({
        "type":"post",
        "url":" /web/common/material",
        "dataType":"json",
        "data":SubData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData=data.retData;
            if(codenum==0){
                CreatMaterial(AllData);
            }
        }
    });
};
//创建教材
function CreatMaterial(data) {
    if(data.length>0){
        var $html='';
        for(var i=0;i<data.length;i++){
            $html+='<li class="fs14" data-Id="'+data[i].id+'">'+data[i].name+'</li>';
        }
        $('#m_MaterialList').html($html);
    }
    MaterialOpration();
}
//教材操作
function MaterialOpration() {
    $('#m_MaterialList li').off('click');
    $('#m_MaterialList li').on('click',function(){
        var Id=$(this).attr('data-Id');
        $('#m_Material').html($(this).html()).attr({'data-Id':Id});
    });
}

/*保存个人信息*/
function SaveInfo(){
    if($('#c_SchoolCon').html()=='暂无学校'){
        $('#SchoolError').css('display','block');
    }
    if($('#m_UserName').val()==''){
        $('#NameError').css('display','block');
    }
    if($('#c_SchoolCon').html()!='暂无学校'&&$('#m_UserName').val()!='') {
        $('#SchoolError').css('display','none');$('#NameError').css('display','none');
        var subData = {};
        /*根据省份匹配城市*/
        subData.name=$('.m_UserName').val();
        subData.schoolId=$('#c_SchoolCon').attr('data-Id');
        subData.subjectId=$('#m_Sub').attr('data-Id');
        subData.materialId=$('#m_Material').attr('data-Id');
        $.ajax({
            "type":"post",
            "url":" /web/teacher/center/baseinfo/save",
            "dataType":"json",
            "data":subData,
            success:function(data){
                var codenum =parseInt(data.retCode.substr(0, 1)) ;
                if(codenum==0){
                    DataReset();
                    ResetLogIn();
                }
            }
        });
    }
};
//判断个人资料是否修改
function IsInfoChange(){
    var Reasult;
    var NameDefult=($('#m_UserName').attr('data-defult'));
    var NameNow=($('#m_UserName').val());
    var ProvinceDefult=($('#c_ProvinceCon').attr('data-defult'));
    var ProvinceNow=($('#c_ProvinceCon').attr('data-Id'));
    var CityDefult=($('#c_CityCon').attr('data-defult'));
    var CityNow=($('#c_CityCon').attr('data-Id'))
    var CountyDefult=($('#c_CountyCon').attr('data-defult'));
    var CountyNow=($('#c_CountyCon').attr('data-Id'));
    var SchoolDefult=($('#c_SchoolCon').attr('data-defult'));
    var SchoolNow=($('#c_SchoolCon').attr('data-Id'));
    var MaterialDefult=($('#m_Material').attr('data-defult'));
    var MaterialNow=($('#m_Material').attr('data-Id'));
    var IsNameChange=(NameDefult!=NameNow);
    var IsProvinceChange=(ProvinceDefult!=ProvinceNow);
    var IsCityChange=(CityDefult!=CityNow);
    var IsCountyChange=(CountyDefult!=CountyNow);
    var IsSchoolChange=(SchoolDefult!=SchoolNow);
    var IsMaterialChange=(MaterialDefult!=MaterialNow);
    return (IsNameChange||IsProvinceChange||IsCityChange||IsCountyChange||IsSchoolChange||IsMaterialChange)
}
$('#EditEnsure').on('click',function(){
    CanEdit();
    var Result=IsInfoChange();
    if(Result){
        SaveInfo();
    }else {
        DataReset();
    }
}
);
$('#CanCelBtn').on('click',function(){ CanEdit();DataReset()});
/*取消保存用户信息数据重置*/
function DataReset(){
    $('#m_provice0').html('');//地区
    $('#m_city0').html('');//地区
    $('#m_aera0').html('');//地区
    $('#m_school0').html('');//地区
    GetAbout();
    $('#m_Editit').css('color',"#65B113").find('i').removeClass('p_editico0').addClass('p_editico1');
    $('#InfoShow').css('display','block');
    $('#InfoEdit').css('display','none');
    $('.arealist').css('display','none');
    $('#m_Sub').html($('#m_subject0').html());
    $('#m_Material').html($('#m_material0').html());
};



/********************************修改手机号**************************************************/
//默认账号安全信息
function CreatDefultPhone(data) {
    var mobile=data.mobile;//手机号
    $('.m_Telnum0').html(parseInt(mobile.substr(0, 3)));//手机号前三位
    $('.m_Telnum1').html(mobile.substr(7, 4).toString());//手机号后四位
    var m_Email=data.email;;
    //判断是否绑定邮箱
    if(data.email==''||data.email==null){
        $('.m_EmailDoneico').css('display','none');
        $('.IsHasEmail').html('<p class=" fs18 fc66 tal mt10 IsHasEmail">未绑定 <span class="fc58 cup" id="bound">立即绑定</span></p>');
        BoundEmailMain();
    }
    else {
        $('.m_EmailDoneico').css('display','block');
        $('.IsHasEmail').html('<span class="f_emailnum0">xx</span>****@<span class="f_emailnum1">xxx</span>.com <span class="fc58 cup" id="ChangeEmail">修改</span>');
        $('.f_emailnum0').html(m_Email.substr(0, 4));
        $('.f_emailnum1').html(m_Email.split('@')[1].split('.')[0]);
        ChangeEmailMain();
    };
}
/*修改手机校验密码*/
function CheckPass(){
    var SubDate={};
    SubDate.password= $.md5($('#m_UserPass0').val())
    $.ajax({
        "type":"post",
        "url":" /web/user/safe/checkpwd",
        "dataType":"json",
        "data":SubDate,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum!=0){
                $('#m_PassError0').html('密码错误')
            }
            else {
                /*密码正确，检验手机号*/
                CheckPhoneIs0();
                $('#m_PassError0').html('')
            }
        }
    });
};
/*校验手机号是否存在*/
function CheckPhone(){
    var subData = {};
    subData.mobile = $('#m_PhoneIn0').val();
    $.ajax({
        "type":"post",
        "url":"/web/user/check/mobile/exist",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                $('#m_PhoneError0').html('该手机号已注册');
            }else {
                $('#m_PhoneError0').html('');
                HasSend('#r_MsgInBtn0');
                GetSms();
            }
        }
    })
};
/*获取短信验证码*/
function GetSms(){
    var subData = {};
    subData.mobile = $('#m_PhoneIn0').val();
    subData.imageCaptcha = $('#m_CapInput').val();
    $.ajax({
        "type":"post",
        "url":"/web/common/sms",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            SendDone('#r_MsgInBtn0');
            if(codenum==0){
                $('#m_CapError0').html('');
                WaitTime('#r_MsgInBtn0','#r_SendTelDis1','#f_SendSec1');
            }
            if(codenum==2){
                $('#m_CapError0').html('图形验证码错误');
                GetCaptcha();
            }
            if(data.retCode=="2301"){
                $('#m_CapErrorE0').html('');
                $('#c_ErrorMsg').html('抱歉，60s内只能发送一次').fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    })
};
/*验证短信验证码*/
function CheckSms(){
    if($('#r_MsgIn').val()==''){
        $('#m_SmsError0').html('请输入验证码');
    }
    else {
        $('#m_SmsError0').html('');
        var subData = {};
        subData.mobile = $('#m_PhoneIn0').val();
        subData.smsCaptcha = $('#r_MsgIn').val();
        $.ajax({
            "type":"post",
            "url":"/web/common/sms/check",
            "dataType":"json",
            "data":subData,
            success:function(data){
                var codenum =parseInt(data.retCode.substr(0, 1)) ;
                if(codenum==0){
                    $('#m_SmsError0').html('');
                    SaveMobile();
                }
                else {
                    $('#m_SmsError0').html('短信验证码错误');
                }
            }
        });
    }
};
/*保存手机号*/
function SaveMobile(){
    var subData = {};
    subData.mobile = $('#m_PhoneIn0').val();
    subData.smscode	 = $('#r_MsgIn').val();
    $.ajax({
        "type":"post",
        "url":"/web/user/safe/updatemobile",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                $('#m_SmsError0').html('');
                GetAbout();
                $('#Account').fadeIn(150)
                $('#SaveMobile').css('display','none');
                ResetLogIn();
            }
            else {
                $('#c_ErrorMsg').html('修改失败，请重试').fadeIn(200);
                Disappear("#c_ErrorMsg");
            }
        }
    })
};
$('#m_CapChange0').on('click',function(){
    GetCaptcha();
});
/*发送手机验证码*/
$('#r_MsgInBtn0').on('click',function(){
    if($('#m_UserPass0').val()==''){
        $('#m_PassError0').html('请输入密码');
    }
    else {
        $('#m_PassError0').html('');
        if($('#m_CapInput').val()==''){
            $('#m_CapError0').html('请输入验证码');
        }
        else {
            $('#m_CapError0').html('');
        }
        CheckPass();
    }
});
/*确定保存手机号*/
$('#m_EnsureBtn').on('click',function(){
    CanEdit();
    CheckSms();
});
/*校验手机号码格式*/
function CheckPhoneIs0(){
    if($('#m_PhoneIn0').val()!=''){
        if(pat.test($('#m_PhoneIn0').val())==false){
            $('#m_PhoneError0').html('手机号格式错误')
        }
        else {
            $('#m_PhoneError0').html('')
            CheckPhone();
        }
    }
    else {
        $('#m_PhoneError0').html('请填写手机号')
    }
};
IsCanEdit('#ChangeMobile','#Base','#Security');
$('#ChangeMobile').on('click',function(){
    PhoneDataReset();
    $('#SaveMobile').fadeIn();
    $('#Account').css('display','none');
});
/*修改手机号数据重置*/
function PhoneDataReset(){
    $('.m_Error').html('');
    $('#m_PhoneIn0').val('');
    $('#m_UserPass0').val('');
    $('#m_CapInput').val('');
    $('#r_MsgIn').val('');
};
/*取消手机号修改*/
$('#m_CancelBtn').on('click',function(){
    CanEdit();
    PhoneDataReset();
    $('#Account').fadeIn(150)
    $('#SaveMobile').css('display','none');
});
/************************************************个人中心首页*******************************************************/
Centerinfo();
function Centerinfo(){
    $.ajax({
        "type":"post",
        "url":"/web/teacher/center/info",
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                var authStatus=data.retData.authStatus;//认证状态 0未认证，1已认证 ,
                var experience=data.retData.experience;//经验
                var headImg=data.retData.headImg;//头像文件名
                var rank=data.retData.rank;//等级
                var userName=data.retData.userName;//姓名
                var wealth=data.retData.wealth;//财富金币数量
                //var rebateNum=data.retData.rebateNum;//财富金币数量
                //if(rebateNum==null||rebateNum==''){
                //    $('#rebateNum').html('0');
                //}else {
                //    $('#rebateNum').html(rebateNum)
                //}
                /*认证状态*/
                if(authStatus=='0'||authStatus==null||authStatus==''){
                    $('#i_m_Probtn').val('去认证').on('click',function(){
                        window.location.href='../../../model/me/me_certification.html'
                    });
                    $('#IsYz').css('display','none');
                }
                else {
                    $('#i_m_Probtn').val('已认证');
                    $('#IsYz').css('display','block');
                }
                /*经验*/
                if(experience=='0'||experience==null||experience==''){
                   $('#m_EmpNum').html(0);
                }
                else{
                    $('#m_EmpNum').html(experience);
                }
                /*头像*/
                if(headImg==null||headImg==''){
                    $('#me_UserPhoto').attr('src','../../static/image/me/user.png');
                }
                else {
                    $('#me_UserPhoto').attr('src',headImg);
                }
                /*等级 待设计！！！！！！！！！！！！！！！*/
                $('#m_Rank').html(rank);
                /*姓名*/
                $('#i_UserName').html(userName);
                /*财富金币数量*/
                if(wealth=='0'||wealth==null||wealth==''){
                    $('#goldnum').html(0);
                    $('#m_MyGoldNum1').html(0);
                }
                else{
                    $('#goldnum').html(wealth);
                    $('#m_MyGoldNum1').html(wealth);
                }

            }
        }
    });
};
/************************************************教师认证*******************************************************/
/*判断教师认证条件*/
function IsIdentify(){
    $.ajax({
        "type":"post",
        "url":"/web/teacher/center/auth",
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                var classNum=data.retData.classNum;//加入班级数量>0完成
                var studentNum=data.retData.studentNum;//学生数量>0完成
                var workNum=data.retData.workNum;//完成批改作业>2完成
                if(classNum>0){
                    YesAutoIco0('#IsDoneAdd')
                }
                else {
                    NoAutoIco0('#IsDoneAdd');
                }
                if(studentNum>0){
                    YesAutoIco0('#IsDoneClass');
                }
                else {
                    NoAutoIco0('#IsDoneClass');
                }
                if(workNum>2){
                    YesAutoIco0('#IsDoneWork');
                }
                else {
                    NoAutoIco0('#IsDoneWork');
                }
                if(workNum>2&&studentNum>0&&classNum>0){
                    $('#m_ApplyBtn').removeClass().addClass('m_Canbtn').removeAttr('disabled').on('click',function(){
                        GetIdentify();
                    });
                }else {
                    $('#m_ApplyBtn').removeClass().addClass('m_Nobtn').attr('disabled');
                }
            }
        }
    });
}
IsIdentify();
/*样式变化*/
function NoAutoIco0(a){
    $(a).find('.i_IsDown').removeClass('m_fico0').addClass('m_fico1');
    $(a).find('.i_IsDone').removeClass('m_yesico0').addClass('m_yesico1');
};
function YesAutoIco0(a){
    $(a).find('.i_IsDown').removeClass('m_fico1').addClass('m_fico0');
    $(a).find('.i_IsDone').removeClass('m_yesico1').addClass('m_yesico0');
};
/*申请教师认证*/
function GetIdentify(){
    $.ajax({
        "type":"post",
        "url":"/web/teacher/center/updateauth",
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                $('#c_ErrorMsg').html('认证成功').fadeIn(200);  Disappear("#c_ErrorMsg");
                GoldAnimate(data.retGold);
                Centerinfo();
                $('#m_ApplyBtn').css('display','none');
            }
            else {
                $('#m_ApplyBtn').css('display','block');
                $('#c_ErrorMsg').html('认证失败，请重试').fadeIn(200);  Disappear("#c_ErrorMsg")
            }
        }
    })
};
/************************************************私人订制*******************************************************/
function Radio(a,b){
    $(a).on('click',function(){
        $(this).removeClass('p_useico0').addClass('p_useico1');
        $(b).removeClass('p_useico1').addClass('p_useico0');
    })
};
/*私人订制支付方式单选*/
Radio('#m_UsePpt0','#m_UsePpt1');
Radio('#m_UsePpt1','#m_UsePpt0');
/*遮罩层淡入淡出*/
FadeIn('#p_QuickUse',"#m_PptPay");
FadeIn('#m_OrderBtn',"#m_PptPay");
FadeOut('#m_PptPayClose',"#m_PptPay");
FadeOut('#m_ChoCancel',"#m_PptPay");
FadeOut('#m_ClosPay',"#m_PayMsg");
/*大图轮播*/
var num=0;
var PptTime=null;
PptTime=setInterval(function(){
    $('#m_Advert').find('img').eq(num).fadeIn(1000).siblings().fadeOut(1);
    num++;if(num>4){num=0;}
},3000)
$('#m_AdverList li').hover(function(){num=$(this).index();}, function(){});
document.addEventListener('click',function(e){
    if(e.target.tagByName.indexOf("m_AreaSelect")==-1){
        $(".arealist").slideUp();
    }
});
/*校验手机号码格式*/
function CheckPhoneIs(){
    if(pat.test($('#m_PhoneTel').val())==false){
        $('#m_PhoneTelError').html('手机号格式错误')
    }
    else {
        $('#m_PhoneTelError').html('')
    }
};
$('#m_GO').on('click',function(){
    $('#m_PptPay').css('display','none');
    $('#m_UpBox').fadeIn(200);

})
$('#c_rClose').on('click',function(){
    $('#m_UpBox').fadeOut(200);
});
$('#m_GoOn').on('click',function(){

});
$('#me_mygold').on('click',function(){
    window.location.href='me_mygold.html?Gold='+$('#goldnum').html();
})
init()
function init(){
    $.ajax({
        url:"/web/teacher/trade/init",
        type:"post",
        dataType:"json",
        success:function(data){
            if(data.retData.rebateCount == '0'){
                $(".fn_rebate_count").html("0");
            }else{
                $(".fn_rebate_count").html(data.retData.rebateCount);
            }
        }
    })
}
$('#me_mygold').hover(function(){
    $('#GoldImg').attr('src','../../static/image/me/goldimg1.png');
},function(){
    $('#GoldImg').attr('src','../../static/image/me/goldimg0.png');
})
$('#me_coup').hover(function(){
    $('#ScoupIco').attr('src','../../static/image/me/scoupico1.png');
},function(){
    $('#ScoupIco').attr('src','../../static/image/me/scoupico0.png');
})
//签到
function IsSign() {
    
}
isSign();
function isSign(){
    $.ajax({
        type : "post",
        url : "/web/user/singinCount",
        dataType : "json",
        success : function(data){
            if(data.retCode == "0000"){
                var singinedDays = data.retData.singinedDays;
                if(data.retData.singined == "no"){
                    $("#ThisSign").val('签到');
                }else{
                    $("#ThisSign").removeClass().addClass('m_SignDone').val("已签到"+singinedDays+"天");
                }
            }
        },
        error : function(e){
            console.log(e)
        }
    })
}
$("#ThisSign").on("click",function(){
    if($(this).hasClass("m_SignDone")){
        return false;
    }else{
        $.ajax({
            type : "post",
            url : "/web/user/singin",
            dataType : "json",
            success : function(data){
                var comlu = data.retCode.substr(0,1);
                if(comlu == "0"){
                    $('#c_ErrorMsg').html('签到成功！').fadeIn(200);  Disappear("#c_ErrorMsg");
                    GoldAnimate(data.retGold);
                    Centerinfo();
                    isSign();
                }else{
                    $('#c_ErrorMsg').html('签到失败！').fadeIn(200);  Disappear("#c_ErrorMsg");
                }
            },
            error : function(e){
                console.log(e)
            }

        })
    }
})