/********************************************个人中心个人资料By徐扬**********************************************/
//获取头部导航
GetHtml("../../model/common/Head.txt","#Com_Head");
CheckBrower();
/*验证手机格式正则*/
var pat=/^(13|14|19|15|18|17)[0-9]{9}$/;
/*验证邮箱格式*/
var patEmail= /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
//用户常用操作
UserOpration();
function UserOpration(){
    //更换验证码
    $('#m_CapChange0').on('click',function(){GetCaptcha();});
    $('#m_CapChange1').on('click',function(){GetCaptcha();});
    $('#m_CapChange2').on('click',function(){GetCaptcha();});
    //修改密码输入框重置错误
    $('#m_OldPass0').on('click',function(){$('#m_PassError1').html('')});
    $('#m_NewPass0').on('click',function(){$('#m_PassError2').html('')});
    $('#m_NewPass1').on('click',function(){$('#m_PassError3').html('')});
    //修改手机号输入框重置错误
    $('#m_OldPass1').on('click',function(){$('#m_PassError4').html('')});
    $('#m_NewPhone0').on('click',function(){$('#m_PhoneError0').html('')});
    $('#m_CapInput0').on('click',function(){$('#m_CapError0').html('')});
    $('#r_MsgIn0').on('click',function(){$('#m_SmsError0').html('')});
    //绑定邮箱输入框重置错误
    $('#m_Email').on('click',function(){$('#m_EmailError0').html('')});
    $('#m_CapInput1').on('click',function(){$('#m_CapError1').html('')});
    $('#r_MsgIn1').on('click',function(){$('#m_SmsError1').html('')});
};
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
/*查询学生个人资料信息*/
GetUserInfo();
function GetUserInfo(){
    $.ajax({
        "type": "post",
        "url": "/web/student/center/baseinfo",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatUserInfo(AllData);
                CreateUserDefultMate(AllData.materialList);
            }
        }
    });
};
/*创建用户信息HTML*/
function CreatUserInfo(data){
    $('#m_UserName0').html(data.userName);//姓名
    $('#m_UserName1').val(data.userName);//姓名
    var Province='<span data-provinceId="'+data.provinceId+'">'+data.provinceName+'</span>';//省
    var City='<span data-cityId="'+data.cityId+'">'+data.cityName+'</span>';//市
    var County='<span data-countyId="'+data.countyId+'">'+data.countyName+'</span>';//区
    var School='<span data-schoolId="'+data.schoolId+'">'+data.schoolName+'</span>';//学校
    if(data.schoolName!=null){
        $('#m_UserSchool0,#m_UserSchool1').html(Province+' | '+City+' | '+County+' | '+School);//用户学校
    }else {
        $('#m_UserSchool0,#m_UserSchool1').html('暂无学校');//用户学校
    }
    $('#m_UserGrade0,#m_UserGrade1').html(data.gradeName);//年级
    var MaterialList='';
    //教材学科
    for(var i=0;i<data.materialList.length;i++){
        var Mata=data.materialList[i];
        if(Mata.materialName!=null&&Mata.materialName!=''){
            MaterialList+='<li data-subjectId="'+Mata.subjectId+'" data-subjectName="'+Mata.subjectName+'">';
            MaterialList+='<p class="m_ImgBox"><img src="'+Mata.materialCover+'" alt=""></p>';
            MaterialList+='<p class="m_Material" data-materialId="'+Mata.materialId+'">'+Mata.materialName+'</p>';
            MaterialList+='</li>';
        }
    }
    $('#m_UserSubMat0').html(MaterialList);
    var mobile=data.mobile;//手机号
    $('.m_TelNum0').html(parseInt(mobile.substr(0, 3)));//手机号前三位
    $('.m_TelNum1').html(mobile.substr(7, 4).toString());//手机号后四位
    var $IsEmali='';
    var $IsEmaliNew='';
    var m_Email=data.email;
    if(m_Email==''||m_Email==null){
        $('#EmailImg').removeClass().addClass('meimg m_email0');
        $IsEmali='<span>未绑定&nbsp;</span><span class="m_ChangeBtn" id="BoundEmail">绑定</span>';
        $IsEmaliNew='<span>未绑定</span>';

    }else {
        $('#EmailImg').removeClass().addClass('meimg m_email1');
        var FirstEmail=m_Email.split('@')[0];
        if(FirstEmail.length<=3){
              FirstEmail=FirstEmail.substr(0,2)+'*@'
        }else {
            FirstEmail=FirstEmail.substr(0,3)+'***@'
        }
        var SecEmail=m_Email.split('@')[1].split('.')[0]+'.com';
        $IsEmali='<span>'+FirstEmail+SecEmail+'</span><span class="m_ChangeBtn" id="ChangeEmail">修改</span>';
        $IsEmaliNew='<span>'+FirstEmail+SecEmail+'</span>';
    }
    $('#IsEmail').html($IsEmali);
    $('#m_EmailNew').html($IsEmaliNew);
    BoundEmailOpration();//绑定邮箱
    ChangeEmailOpration();//修改邮箱
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
            $("#m_CapImg1").attr("src",date.retData);
            $("#m_CapImg2").attr("src",date.retData);
        }
    });
};
//重新登录
function ResetLogIn(){
    $('#c_ErrorMsg').html('修改成功,请重新登录').fadeIn(200);
    Disappear("#c_ErrorMsg");
    var Time=null;
    Time=setTimeout(function(){
        Quit();
        window.location.href='../../../../index.html'
    },2000)
};
//验证码已发送
function HasSend(a){
    $(a).attr('disabled',true).val('验证码已发送').css('background','#999');
}
function SendDone(a){
    $(a).attr('disabled',false).val('获取验证码').css('background','');
}
/***************************************修改个人资料*****************************************/
//修改个人资料操作
ChangeInfoOpration();
function ChangeInfoOpration(){
    IsCanEdit('#m_Edit','#Security','#Base');//当修改个人资料时，账号安全不可编辑
    $('#m_Edit').on('click',function(){
        $('#ChangeInfo').fadeIn(150);
        $('#ShowInfo').css('display','none');
        $('#m_Editxt,#m_Editico').css('color','#ccc');
    });
    $('.m_SelectOther').on('click',function(e){
        stopBubble(e);
        $(this).find('.m_SelectList').slideToggle(150);
        $(this).parents('.m_InfoLine').siblings('.m_InfoLine').find('.m_SelectList').slideUp(50);
    })
    //空白区域下拉上去
    document.addEventListener('click',function(e){
        if(e.target.className.indexOf("m_SelectOther")==-1||e.target.className.indexOf("m_SelectBox")==-1){
            $(".m_SelectList").slideUp(150);
        }
    });
    $('#m_InfoBtn1').on('click',function(){
        GetUserInfo();
        CanEdit('#Security','#Base');
        $('#ShowInfo').fadeIn(150);
        $('#ChangeInfo').css('display','none');
        $('#m_Editxt,#m_Editico').css('color','');
        $('#m_NameWrong').css('display','none')
    });
    $('#m_UserName1').on('click',function(){$('#m_NameWrong').css('display','none')})
};
//获取年级
GetGrade();
function GetGrade(){
    $.ajax({
        "type":"post",
        "url":" /web/student/center/getGrade",
        "dataType":"json",
        success:function(data){
            var AllData=data.retData;
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                CreatGrade(AllData);
            }
        }
    });
};
//创建年级
function CreatGrade(data){
    var $Grade='';
    for(var i=0;i<data.length;i++){
        if(data[i].default){
            $('#Grade').attr('data-id',data[i].value).html(data[i].label);
        }
        $Grade+='<li data-id="'+data[i].value+'">'+data[i].label+'</li>';
    }
    $('#GradeList').html($Grade);
    $('#GradeList li').on('click',function(){
        $('#Grade').attr('data-id',$(this).attr('data-id')).html($(this).html());
        GetMaterialByGrade()
    });
};
//获取教材册次
GetUpOrDown();
function GetUpOrDown(){
    $.ajax({
        "type":"post",
        "url":" /web/student/center/getMaterialBook",
        "dataType":"json",
        success:function(data){
            var AllData=data.retData;
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                CreatUpOrDown(AllData);
            }
        }
    });
};
//创建上下册次
function CreatUpOrDown(data){
    $('#BookMata').attr('data-id',data[0].value).html(data[0].label);
    var $BookMata='';
    for(var i=0;i<data.length;i++){
        $BookMata+='<li data-id="'+data[i].value+'">'+data[i].label+'</li>';
    }
    $('#BookMataList').html($BookMata);
    $('#BookMataList li').on('click',function(){
        $('#BookMata').attr('data-id',$(this).attr('data-id')).html($(this).html());
        GetMaterialByGrade();
    });
};
//根据年级册次获取教材
function GetMaterialByGrade(){
    var SubData={};
    SubData.gradeId=$('#Grade').attr('data-id');
    SubData.bookId=$('#BookMata').attr('data-id');
    $.ajax({
        "type":"post",
        "url":" /web/student/center/getMaterialByGrade",
        "dataType":"json",
        "data":SubData,
        success:function(data){
            var AllData=data.retData;
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                CreateUserDefultMate(AllData,SubData.gradeId)
            }
        }
    });
};
//创建用户默认册次
function CreateUserDefultMate(data,gradeId){
    var DefultMate='';
    //教材学科
    for(var i=0;i<data.length;i++){
        var Mata=data[i];
        DefultMate+='<li data-subjectId="'+Mata.subjectId+'" data-subjectName="'+Mata.subjectName+'">';
        //用户已有教材
        if(Mata.materialName!=null&&Mata.materialName!=''){
            DefultMate+='<p class="m_ImgBox"><img src="'+Mata.materialCover+'" alt=""></p>';
            DefultMate+='<div class="m_SelectBox">';
            if(Mata.materialName!=null&&Mata.materialName!=''){
                DefultMate+='<p class="m_SelectShow"  title="'+Mata.materialName+'" data-materialId="'+Mata.materialId+'"  data-subjectId="'+Mata.subjectId+'" data-grade="" >'+Mata.materialName+'</p>';
            }else {
                DefultMate+='<p class="m_SelectShow"  data-subjectId="" data-grade="" data-materialId="">暂无教材</p>';
            }
            DefultMate+='<span class="ArrowsFont m_Downico">&#xe665;</span>';
            if(gradeId==undefined){
                DefultMate+=  GetInfoMata(Mata.subjectId,$('#Grade').attr('data-id'));
            }else {
                DefultMate+=  GetInfoMata(Mata.subjectId,gradeId);
            }
            DefultMate+='</div>';
        }
        //用户未学的
        else {
            DefultMate+='<p class="m_ImgBox"><span class="Nosub">'+Mata.subjectName+'</span></p>';
            DefultMate+='<div class="m_GoStudy" data-mata="'+Mata.materialName+'" data-subjectId="'+Mata.subjectId+'">暂无教材</div>';
        }
        DefultMate+='</li>';
    }
    $('#m_UserSubMat1').html(DefultMate);
    SavaInfoOption();
    $('.m_GoStudy').on('click',function(){
        $(this).css('display','none');
        var DefultMate='';
        DefultMate+='<div class="m_SelectBox">';
        DefultMate+='<p class="m_SelectShow" data-subjectId="" data-grade="" data-materialId="">请选择教材</p>';
        DefultMate+='<span class="ArrowsFont m_Downico">&#xe665;</span>';
        if(gradeId==undefined){
            DefultMate+= GetInfoMata($(this).attr('data-subjectId'),$('#Grade').attr('data-id'));
        }else {
            DefultMate+= GetInfoMata($(this).attr('data-subjectId'),gradeId);
        }
        DefultMate+='</div>';
        $(this).parents('li').append(DefultMate);
        $(this).siblings('.m_ImgBox').find('.Nosub').before('<img src="" alt="">');
        UserSelectMata();
        $(this).siblings('.m_SelectBox').find('.m_SelectMata').find('li').eq(0).click();

    });
    UserSelectMata();
};
//获取教材
function GetInfoMata(subjectId,grade){
    var str=''
    var SubData={};
    SubData.subjectId=subjectId;
    SubData.grade=grade;
    $.ajax({
        "type":"post",
        "url":" /web/common/material",
        "dataType":"json",
        "data":SubData,
        "async": false,//同步加载。解决undifind
        success:function(data){
            var AllData=data.retData;
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                str=CreatInfoMata(AllData);
            }
        }
    });
    return str;
};
//创建教材信息
function CreatInfoMata(data){
    var $InfoMata='';
    if(data.length>0){
        $InfoMata+='<ul class="m_SelectList m_SelectMata">';
        for(var i=0;i<data.length;i++){
            $InfoMata+='<li data-materialCover="'+data[i].cover+'" data-subjectId="'+data[i].subjectId+'" data-grade="'+data[i].grade+'" data-materialId="'+data[i].id+'">'+data[i].name+'</li>';
        }
        $InfoMata+='</ul>';
    }else {
        $InfoMata+='<ul class="m_SelectList m_SelectMata">';
        for(var i=0;i<data.length;i++){
            $InfoMata+='<li  data-subjectId="" data-grade="" data-materialId="">暂无教材</li>';
        }
        $InfoMata+='</ul>';
    }
    return $InfoMata;
};
//用户选择学科
function UserSelectMata(){
    $('.m_SelectBox').off('click');
    $('.m_SelectBox').on('click',function(e){
        stopBubble(e);
        $(this).find('.m_SelectList').slideToggle(150);
        $(this).parents('li').siblings('li').find('.m_SelectList').slideUp(50);
    });
    $('.m_SelectMata li').off('click');
    $('.m_SelectMata li').on('click',function(e){
        stopBubble(e);
        $(this).parents('.m_SelectList').slideUp(50)
        $(this).parents('ul').siblings('.m_SelectShow').attr({'title':$(this).html(),'data-subjectid':$(this).attr('data-subjectid'),'data-grade':$(this).attr('data-grade'),'data-materialId':$(this).attr('data-materialId')}).html($(this).html())
        $(this).parents('.m_SelectBox').siblings('.m_ImgBox').find('img').attr('src',$(this).attr('data-materialCover'))
    })
};
//保存个人资料
function SavaInfo(arr,name,gradeId){
    var SubData={};
    SubData.materialList=arr;
    SubData.name=name;
    SubData.gradeId=gradeId;
    console.log(SubData)
    $.ajax({
        "type":"post",
        "url":" /web/student/center/baseinfo/save",
        "dataType":"json",
        //"data":SubData,
        'data': JSON.stringify(SubData),
        'contentType':"application/json;charset=utf-8",
        success:function(data){
            var AllData=data.retData;
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){

                ResetLogIn();
            }
        }
    });
};
//保存个人资料操作
function SavaInfoOption(){
    $('#m_InfoBtn0').off('click');
    $('#m_InfoBtn0').on('click',function(){
       var  gradeId=$('#Grade').attr('data-id');
       var  name=$('#m_UserName1').val();
        var arr=[];
        for(var i=0;i<$('#m_UserSubMat1>li').length;i++){
            var Obj={};
            if($('#m_UserSubMat1>li').eq(i).is(':has(.m_SelectShow)')){
                var $Data=$('#m_UserSubMat1>li').eq(i).find('.m_SelectShow');
                var $DataLi=$('#m_UserSubMat1>li').eq(i);
                Obj.subjectId=$Data.attr('data-subjectid');
                Obj.subjectName=$DataLi.attr('data-subjectname');
                Obj.materialId=$Data.attr('data-materialId');
                Obj.materialName=$Data.html();
                arr.push(Obj);
            }
        }
        console.log(arr)
        if($('#m_UserName1').val().length==0){
            $('#m_NameWrong').css('display','block');
        }else {
            $('#m_NameWrong').css('display','none');
            SavaInfo(arr,name,gradeId);
        }
    });
}
/***************************************修改密码*****************************************/
//修改密码操作
ChangePassOpration();
function ChangePassOpration(){
    IsCanEdit('#ChangePass','#Base','#Security');//当修改密码时，顶部不可编辑
    //打开修改密码
    $('#ChangePass').on('click',function(){
        $('#ChangePassMain').fadeIn(150);
        $('#ChangOption').css('display','none');
        PassDataReset();
    });
    /*取消修改密码*/
    $('#m_PassCancelBtn').on('click',function(){
        CanEdit('#Security','#Base');
        PassDataReset();
        $('#ChangOption').fadeIn(150)
        $('#ChangePassMain').css('display','none');
    });
    /*确定修改密码*/
    $('#m_PassEnsureBtn').on('click',function(){
        UpCheckPass();
    });
};
/*密码重置*/
function PassDataReset(){
    $('#m_OldPass0').val('');
    $('#m_NewPass0').val('');
    $('#m_NewPass1').val('');
    $('.m_Error').html('');
};
//检测旧密码
function UpCheckPass(){
    if($('#m_OldPass0').val()=='') {
        $('#m_PassError1').html('请输入旧密码');
    }else {
        $('#m_PassError1').html('');
        CheckPwd();
    }
};
//验证用户密码
function CheckPwd(){
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
                    IsPassRight();
                }
            }
        });
};
/*判断两次密码是否一致*/
function IsPassRight(){
    if($('#m_NewPass0').val().length<6){
        $('#m_PassError2').html('请填写6~16位字符');
    }
    else {
        $('#m_PassError2').html('');
        if($('#m_NewPass0').val()!=$('#m_NewPass1').val()){
            $('#m_PassError3').html('请输入相同密码');
        }
        else {
            if($('#m_OldPass0').val()==$('#m_NewPass1').val()){
                $('#m_PassError3').html('新密码与旧密码不能相同');
            }
            else {
                $('#m_PassError3').html('');
                SaveChangePass();
            }
        }
    }
};
//保存密码
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
                CanEdit();
                $('#ChangOption').fadeIn(150)
                $('#ChangePassMain').css('display','none');
            }
            else {
                $('#c_ErrorMsg').html('修改失败，请重试').fadeIn(200);
                Disappear("#c_ErrorMsg");
            }
        }
    });
};
/***************************************修改手机*****************************************/
//修改手机号操作
ChangePhoneOpratioon();
function ChangePhoneOpratioon(){
    IsCanEdit('#ChangePhone','#Base','#Security');//当修改手机号时，顶部不可编辑
    //打开修改手机号
    $('#ChangePhone').on('click',function(){
        $('#ChangePhoneMain').fadeIn(150);
        $('#ChangOption').css('display','none');
    })
    //发送手机验证码
    $('#r_MsgInBtn0').on('click',function(){

        CheckPhoneIsPass();
    });
    //取消更改手机号
    $('#m_PhoneCancelBtn').on('click',function(){
        PhoneReset();
        CanEdit('#Security','#Base');
        $('#ChangePhoneMain').css('display','none');
        $('#ChangOption').fadeIn(150);
    });
    //确认手机号更改
    $('#m_PhoneEnsureBtn').on('click',function(){
        CheckSms();
    })
}
/*校验密码是否填写*/
function CheckPhoneIsPass(){
    if($('#m_OldPass1').val().length==0){
        $('#m_PassError4').html('请输入密码');
    }else {
        $('#m_PassError4').html('');
        CheckPhonePass();
    }
};
/*校验密码*/
function CheckPhonePass(){
    var SubDate={};
    SubDate.password= $.md5($('#m_OldPass1').val())
    $.ajax({
        "type":"post",
        "url":" /web/user/safe/checkpwd",
        "dataType":"json",
        "data":SubDate,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum!=0){
                $('#m_PassError4').html('密码错误')
            }
            else {
                /*密码正确，检验手机号格式*/
                CheckPhoneIs0();
                $('#m_PassError4').html('')
            }
        }
    });
};
/*校验手机号码格式*/
function CheckPhoneIs0(){
    if($('#m_NewPhone0').val()!=''){
        if(pat.test($('#m_NewPhone0').val())==false){
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
/*校验手机号是否存在*/
function CheckPhone(){
    var subData = {};
    subData.mobile = $('#m_NewPhone0').val();
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
                GetSms();//获取短信验证码
            }
        }
    })
};
/*获取短信验证码*/
function GetSms(){
    var subData = {};
    subData.mobile = $('#m_NewPhone0').val();
    subData.imageCaptcha = $('#m_CapInput0').val();
    $.ajax({
        "type":"post",
        "url":"/web/common/sms",
        "dataType":"json",
        "data":subData,
        success:function(data){
            SendDone('#r_MsgInBtn0');
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                $('#m_CapError0').html('');
                WaitTime('#r_MsgInBtn0','#r_SendTelDis0','#f_SendSec0');
            }
            if(codenum==2){
                $('#m_CapError0').html('图形验证码错误');
                GetCaptcha();
            }
            if(data.retCode=="2301"){
                $('#m_CapError0').html('');
                $('#c_ErrorMsg').html('抱歉，60s内只能发送一次').fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    })
};
/*数据重置*/
function PhoneReset(){
    $('#m_OldPass1').val('');
    $('#m_NewPhone0').val('');
    $('#m_CapInput0').val('');
    $('#r_MsgIn0').val('');
    $('.m_Error').html('');
};
/*验证短信验证码*/
function CheckSms(){
    if($('#r_MsgIn0').val()==''){
        $('#m_SmsError0').html('请输入验证码');
    }
    else {
        $('#m_SmsError0').html('');
        var subData = {};
        subData.mobile = $('#m_NewPhone0').val();
        subData.smsCaptcha = $('#r_MsgIn0').val();
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
    subData.mobile = $('#m_NewPhone0').val();
    subData.smscode	 = $('#r_MsgIn0').val();
    $.ajax({
        "type":"post",
        "url":"/web/user/safe/updatemobile",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                $('#m_SmsError0').html('');
                $('#ChangOption').fadeIn(150)
                $('#ChangePassMain').css('display','none');
                ResetLogIn();
                CanEdit();
            }
            else {
                $('#c_ErrorMsg').html('修改失败，请重试').fadeIn(200);
                Disappear("#c_ErrorMsg");
            }
        }
    })
};
/***************************************绑定邮箱*****************************************/
function BoundEmailOpration(){
    IsCanEdit('#BoundEmail','#Base','#Security');//当修改手机号时，顶部不可编辑
    //打开修改手机号
    $('#BoundEmail').on('click',function(){
        $('#BoundEmailMain').fadeIn(150);
        $('#ChangOption').css('display','none');
    });
    //取消绑定邮箱
    $('#m_EmailCancelBtn0').on('click',function(){
        BoundReset();
        CanEdit('#Security','#Base');
        $('#BoundEmailMain').css('display','none');
        $('#ChangOption').fadeIn(150);
    });
    //校验邮箱格式
    $('#m_Email').on('blur',function(){
        CheckEmailIs();
    });
    /*发送邮箱验证码*/
    $('#r_MsgInBtn1').on('click',function(){
        IsCanSend();
    });
    /*保存绑定邮箱*/
    $('#m_EmailEnsureBtn0').on('click',function(){
        if($('#r_MsgIn1').val().length==0){
            $('#m_SmsError1').html('请输入验证码');
        }
        else {
            $('#m_SmsError1').html('');
            SaveEmail();
        }
        if($('#m_Email').val().length==0){
            $('#m_EmailError0').html('请输入邮箱');
        }

    });
};
//数据重置
function BoundReset(){
    $('#m_Email').val('');
    $('#m_CapInput1').val('');
    $('#r_MsgIn1').val('');
    $('.m_Error').html('');
};
/*校验邮箱格式*/
function CheckEmailIs(){
    if($('#m_Email').val()!=''){
        if(patEmail.test($('#m_Email').val())==false){
            $('#m_EmailError0').html('邮箱格式错误')
        }
        else {
            $('#m_EmailError0').html('');
        }
    }
    else {
        $('#m_EmailError0').html('请填写邮箱地址');
    }
};
/*发送验证码流程*/
function IsCanSend(){
    if($('#m_Email').val()!=''){
        if(patEmail.test($('#m_Email').val())==false){
            $('#m_EmailError0').html('邮箱格式错误')
        }
        else {
            $('#m_EmailError0').html('');
            if($('#m_CapInput1').val().length>0){
                HasSend('#r_MsgInBtn1');
                SendEmailCap();
            }else {
                $('#m_CapError1').html('请输入图形验证码')
            }
        }
    }
    else {
        $('#m_EmailError0').html('请填写邮箱地址');
    }
};
/*获取邮箱验证码*/
function SendEmailCap(){
    var subData = {};
    subData.email = $('#m_Email').val();//邮箱地址
    subData.captcha = $('#m_CapInput1').val();//图形验证码
    $.ajax({
        "type":"post",
        "url":"/web/user/safe/emailcaptcha",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =data.retCode;
            SendDone('#r_MsgInBtn1');
            if(codenum=='0000'||codenum==0000){
                $('#m_CapError1').html('');
                WaitTime('#r_MsgInBtn1','#r_SendTelDis1','#f_SendSec1');
            }
            else if(codenum=='2201'||codenum==2201){
                $('#m_CapError1').html('图形验证码错误');
                GetCaptcha();
            }
            else if(codenum==3002||codenum=='3002'){
                $('#m_EmailError0').html('该邮箱已被绑定')
            }
            else if(codenum=="2001"||codenum==2001){
                $('#m_CapError1').html('');
                $('#c_ErrorMsg').html('抱歉，十分钟内只能发送一次').fadeIn(200);  Disappear("#c_ErrorMsg");
            }
            else {

            }
        }
    })
};
/*保存邮箱*/
function SaveEmail(){
    var subData = {};
    subData.email = $('#m_Email').val();//邮箱地址
    subData.captcha = $('#r_MsgIn1').val();//邮箱验证码
    subData.userType ='2';//类型
    $.ajax({
        "type":"post",
        "url":"/web/user/safe/updateemail",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =data.retCode;
            if(codenum=='0000'||codenum==0000){
                $('#c_ErrorMsg').html('绑定成功').fadeIn(200);
                GoldAnimate(data.retGold);
                Disappear("#c_ErrorMsg");
                GetUserInfo();
                CanEdit('#Security','#Base');
                $('#BoundEmailMain').css('display','none');
                $('#ChangOption').fadeIn(150);
            }
            else if(codenum=='2201'||codenum==2201){
                $('#m_SmsError1').html('邮箱验证码错误')
            }
            else {
                $('#c_ErrorMsg').html('绑定失败，请重试').fadeIn(200);
                Disappear("#c_ErrorMsg");
            }
        }
    })
};
/***************************************修改邮箱*****************************************/
function ChangeEmailOpration(){
    IsCanEdit('#ChangeEmail','#Base','#Security');//当修改手机号时，顶部不可编辑
    //打开修改邮箱
    $('#ChangeEmail').on('click',function(){
        $('#ChangeEmailMain').fadeIn(150);
        $('#ChangOption').css('display','none');
    });
    //取消修改邮箱
    $('#m_EmailCancelBtn1').on('click',function(){
        CanEdit('#Security','#Base');
        ChangeEmailReset();
        $('#ChangOption').fadeIn(150);
        $('#ChangeEmailMain').css('display','none');
    });
    //发送邮箱验证
    $('#r_MsgInBtn2').on('click',function(){
        CheckNewEmailIsPass();
    });
    //校验邮箱格式
    $('#m_NewEmail').on('blur',function(){
        CheckNewEmailIs();
    });
    //保存修改邮箱
    $('#m_EmailEnsureBtn1').on('click',function(){
        if($('#r_MsgIn2').val().length==0){
            $('#m_SmsError2').html('请输入验证码');
        }
        else {
            $('#m_SmsError2').html('');
            SaveNewEmail();
        }
    })
};
function ChangeEmailReset(){
    $('#m_OldPass2').val('');
    $('#m_NewEmail').val('');
    $('#m_CapInput2').val('');
    $('#r_MsgIn2').val('');
    $('.m_Error').html('');
};
/*校验密码是否填写*/
function CheckNewEmailIsPass(){
    if($('#m_OldPass2').val().length==0){
        $('#m_PassError5').html('请输入密码');
    }else {
        $('#m_PassError5').html('');
        CheckNewEmailPass();
    }
};
/*校验密码*/
function CheckNewEmailPass(){
    var SubDate={};
    SubDate.password= $.md5($('#m_OldPass2').val());
    $.ajax({
        "type":"post",
        "url":" /web/user/safe/checkpwd",
        "dataType":"json",
        "data":SubDate,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum!=0){
                $('#m_PassError5').html('密码错误')
            }
            else {
                /*密码正确，检验手机号格式*/
                IsCanSendNewEmailIs();
                $('#m_PassError5').html('')
            }
        }
    });
};
/*校验邮箱格式*/
function CheckNewEmailIs(){
    if($('#m_NewEmail').val()!=''){
        if(patEmail.test($('#m_NewEmail').val())==false){
            $('#m_EmailError1').html('邮箱格式错误')
        }
        else {
            $('#m_EmailError1').html('');
        }
    }
    else {
        $('#m_EmailError1').html('请填写邮箱地址');
    }
};
/*校验验证码流程*/
function IsCanSendNewEmailIs(){
    if($('#m_NewEmail').val()!=''){
        if(patEmail.test($('#m_NewEmail').val())==false){
            $('#m_EmailError1').html('邮箱格式错误')
        }
        else {
            $('#m_EmailError1').html('');
            if($('#m_CapInput2').val().length>0){
                $('#m_CapError2').html('');
                HasSend('#r_MsgInBtn2');
                SendNewEmail();
            }else {
                $('#m_CapError2').html('请填写图形验证码');
            }

        }
    }
    else {
        $('#m_EmailError1').html('请填写邮箱地址');
    }
};
/*修改邮箱发送验证码*/
function SendNewEmail(){
    $('#m_CapError2').html('');
    var subData = {};
    subData.captcha = $('#m_CapInput2').val();//图形验证码
    subData.password = $.md5($('#m_OldPass2').val());//用户密码
    subData.email = $('#m_NewEmail').val();//新邮箱
    $.ajax({
        "type":"post",
        "url":"/web/user/safe/modifyemailcaptcha",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =data.retCode;
            SendDone('#r_MsgInBtn2');
            if(codenum=='0000'||codenum==0000){
                $('#m_SmsError2').html('');
                WaitTime('#r_MsgInBtn2','#r_SendTelDis2','#f_SendSec2');
            }
            else if(codenum=='2201'||codenum==2201){
                $('#m_CapError2').html('图形验证码错误');
                GetCaptcha();
            }
            else if(codenum==3002||codenum=='3002'){
                $('#m_EmailError1').html('邮箱已存在');
            }
            else if(codenum=="2301"||codenum==2301){
                $('#m_SmsError2').html('');
                $('#c_ErrorMsg').html('抱歉，60s内只能发送一次').fadeIn(200);  Disappear("#c_ErrorMsg");
            }
            else {

            }

        }
    })
};
//保存修改的邮箱
function SaveNewEmail(){
    var subData = {};
    subData.email = $('#m_NewEmail').val();//邮箱地址
    subData.captcha = $('#r_MsgIn2').val();//邮箱验证码
    subData.userType ='2';//类型
    $.ajax({
        "type":"post",
        "url":"/web/user/safe/updateemail",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =data.retCode;
            if(codenum=='0000'||codenum==0000){
                $('#c_ErrorMsg').html('绑定成功').fadeIn(200);
                Disappear("#c_ErrorMsg");
                GetUserInfo();
                CanEdit('#Security','#Base');
                $('#ChangeEmailMain').css('display','none');
                $('#ChangOption').fadeIn(150);
            }
            else if(codenum=='2201'||codenum==2201){
                $('#m_SmsError2').html('邮箱验证码错误')
            }
            else {
                $('#c_ErrorMsg').html('绑定失败，请重试').fadeIn(200);
                Disappear("#c_ErrorMsg");
            }
        }
    })
};



