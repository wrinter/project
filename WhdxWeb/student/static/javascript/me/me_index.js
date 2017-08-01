/********************************************个人中心首页By徐扬**********************************************/
//获取头部导航
GetHtml("../../model/common/Head.txt","#Com_Head");
CheckBrower();
//用户常用操作
UserOpration();
function UserOpration(){
    $('.m_SeacherClose').on('click',function(){
        $(this).parents('.m_Mask').fadeOut(150);
    });
    /*检测班级输入个数，是否可以点击*/
    setInterval(function(){
        if($("#m_SeacherInput").val().length==6){
            $("#m_SeacherBtn").css("background",'');
        }
        else {
            $("#m_SeacherBtn").css("background",'#CCC');
        }
    },1);
    //取消头像操作
    $('#m_CloseChangePhoto').on('click',function(){
        $('#m_ChangeUserPhoto').fadeOut(150);
        UserPhotoUpReset()
    });
    $('#GoWealth').hover(function(){
        $('#m_GoldIco').attr('src','../../static/image/me/goldico1.png')
    },function(){
        $('#m_GoldIco').attr('src','../../static/image/me/goldico0.png')
    })
    //搜索班级
    $(document).ready(function(e) {
        $(this).keydown(function (e){
            if(e.which == "13"){
                //搜索班级
                if($("#m_SeacherInput").val().length==6){
                    AgainClassReset();
                    StudentSeacherClass();
                }
            }
        })
    });
    $('#m_SeacherBtn').on('click',function(){
        if($("#m_SeacherInput").val().length==6){
            AgainClassReset();
            StudentSeacherClass();
        }
    });
    $('#m_SeacherInput').on('click',function(){
        $('#m_SeacherError').html('')
    })




};
/*查询学生个人中心信息*/
GetStudentInfo();
function GetStudentInfo(){
    $.ajax({
        "type": "post",
        "url": "/web/student/center/info",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatStudentInfo(AllData)
            }
        }
    });
};
/*创建学生个人中心信息*/
function CreatStudentInfo(data){
    $('#m_wealth').html(data.wealth);
    $('#m_Rank').html(data.rank);
    $('#UserName').html(data.userName);
    GetUserPhoto(data.headImg);
    //进入金币记录
    $('#GoWealth').on('click',function(){
        window.location.href='me_wealthlist.html?wealth='+data.wealth;
    });

};
//用户头像
UserOpreat();
function UserOpreat(){
    $("#m_ChangePhoto").click(function(){
        $('#m_ChangeUserPhoto').fadeIn(150);
        var $inputImage = $('#inputImage'),
            URL = window.URL || window.webkitURL,
            blobURL;
        if(!URL){
            $('#c_ErrorMsg').html('浏览器暂不支持图像编辑,请升级浏览器').css('width','500px').fadeIn(200);Disappear("#c_ErrorMsg");
        }
    });
    $('#m_Photo').hover(function(){
        $("#m_ChangePhoto").fadeIn(150);
    },function(){
        $("#m_ChangePhoto").fadeOut(150);
    })
    $('#m_WrongText').hover(function(){
        $("#m_UserWrong").fadeIn(150);
    },function(){
        $("#m_UserWrong").fadeOut(150);
    });

};
//获取用户现有头像
function GetUserPhoto(UserHeadImgSrc){
    if(UserHeadImgSrc!=null&&UserHeadImgSrc!=''){
        $('#m_UserPhoto').attr('src',UserHeadImgSrc);
        $('#UserHeadImg').attr('src',UserHeadImgSrc);
        store.set('UserHeadImgSrc',UserHeadImgSrc);
    }else {
        $('#m_UserPhoto').attr('src','../../static/image/common/user.png');
        $('#UserHeadImg').attr('src','../../static/image/common/user.png');
        store.set('UserHeadImgSrc','../../static/image/common/user.png');
    }
};
//用户头像重置
function UserPhotoUpReset(){
    $('.cropper-canvas img').attr('src','');
    $('.cropper-view-box img').attr('src','');
    $('.img-preview').html('');
    $('#CanvasBox').html('');
    $('.cropper-container').remove();
}
//更换头像
ChangeUserPhoto();
function ChangeUserPhoto(){
    $(function () {
        'use strict';
        (function () {
            var $image = $('#Main_img');
            var Option={
                aspectRatio: 1 / 1,
                preview: '.img-preview',
                crop: function (data) {}
            };
            $('#Main_img').cropper(Option);
            $(document.body).on('click', '[data-method]', function () {
                var data = $(this).data(),
                    $target,
                    result;
                if (data.method) {
                    data = $.extend({}, data);
                    if (typeof data.target !== 'undefined') {
                        $target = $(data.target);
                        //异常捕获
                        if (typeof data.option === 'undefined') {
                            try {
                                data.option = JSON.parse($target.val());
                            } catch (e) {
                                console.log(e.message);
                            }
                        }
                    }
                    result = $('#Main_img').cropper(data.method, data.option);
                    if (data.method === 'getCroppedCanvas') {
                        $('#CanvasBox').html(result);
                        SubUserPhoto(result.toDataURL('image/jpeg',0.6));
                    }
                    //异常捕获
                    if ($.isPlainObject(result) && $target) {
                        try {
                            $target.val(JSON.stringify(result));
                        } catch (e) {
                            console.log(e.message);
                        }
                    }
                }
            })
            var $inputImage = $('#inputImage'),
                URL = window.URL || window.webkitURL,
                blobURL;
            if (URL) {
                $('#inputImage').change(function () {
                    var files = this.files,
                        file;
                    if (files && files.length) {
                        file = files[0];
                        var IsSize=1024*1024*5;//5M
                        if (/^image\/\w+$/.test(file.type)) {
                            if(file.size<IsSize){
                                blobURL = URL.createObjectURL(file);
                                $('#Main_img').one('built.cropper', function () {
                                    URL.revokeObjectURL(blobURL);
                                }).cropper('reset', true).cropper('replace', blobURL);
                                $('#inputImage').val('');
                            }else {
                                $('#inputImage').val('');
                                $('#c_ErrorMsg').html('请选择小于5M的图片').fadeIn(200); Disappear("#c_ErrorMsg");
                            }
                        } else {
                            $('#inputImage').val('');
                            $('#c_ErrorMsg').html('图片格式不正确请重新选择').fadeIn(200); Disappear("#c_ErrorMsg");
                        }
                    }
                });
            } else {
                $('#inputImage').parent().remove();
            }
        }());
    });
};
//提交头像
function SubUserPhoto(Url){
    $('#c_ErrorMsg').html('保存中....').fadeIn(200);
    var formData = {};
    formData.file = Url;
    formData.userType = '2';
    $.ajax({
        type:"post",
        url:"/web/user/update/headimgbase64",
        data:formData,
        dataType:'json',    //返回类型，有json，text，HTML。
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1));
            if(codenum==0){
                store.set('UserHeadImgSrc',data.retData);
                $('#c_ErrorMsg').html('保存成功').fadeIn(200); Disappear("#c_ErrorMsg");
                GoldAnimate(data.retGold);
                GetStudentInfo();//更新头像数据
                $('#m_ChangeUserPhoto').fadeOut(150);
                UserPhotoUpReset();
            }
            else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200); Disappear("#c_ErrorMsg");
                $('#m_ChangeUserPhoto').fadeOut(150);
            }

        },
    });
}
//搜索班级重置
function SeacherClassReset(){
    $('#m_SeacherError').html('');
    $('#m_SeacherResult').html('');
    $("#m_SeacherInput").val('');
    $('#m_Seacher').css('height','190px');
};
//多次搜索班级重置
function AgainClassReset(){
    $('#m_SeacherError').html('');
    $('#m_SeacherResult').html('');
    $('#m_Seacher').css('height','190px');
};
//班级管理
function StudentSeacherClass(){
    $('#m_SeacherError').html('');
    var SubData={};
    SubData.classCode=$('#m_SeacherInput').val();
    $.ajax({
        "type": "post",
        "url": "/web/student/center/search",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatSeachClass(AllData);
            }else {
                $('#m_SeacherError').html(data.retMsg);
            }
        }
    });
};
//创建搜索的班级
function CreatSeachClass(data){
    $('#m_Seacher').css('height','590px');//改变搜索框大小
    var $ClassHtml='';
    $ClassHtml+='<div class="m_SeacherResult" data-gradeName="'+data.gradeName+'" >';
    //班主任头像
    if(data.headTeacherImage==''||data.headTeacherImage==null){
        $ClassHtml+='<p class="m_SeacherPhoto"><img src="../../static/image/common/user.png" alt=""></p>';
    }else {
        $ClassHtml+='<p class="m_SeacherPhoto"><img src="'+data.headTeacherImage+'" alt=""></p>';
    }
    $ClassHtml+='<p class="m_TeacherName" data-headTeacherId="'+data.headTeacherId+'">'+data.headTeacherName+'</p>';//班主任名称
    $ClassHtml+='<div class="m_ClassMsg">';
    $ClassHtml+='<p class="m_ClassName">'+data.className+'</p>';//班级名
    $ClassHtml+='<p class="m_ClassNum">学生：'+data.studentNum+'人</p>';//学生人数
    $ClassHtml+='<p class="m_ClassNum">老师：'+data.teacherNum+'人</p>';//老师人数
    $ClassHtml+='<p class="m_JoinClassBtn0" id="m_JoinClassBtn0" data-classId="'+data.classId+'">加入班级</p>';//班级ID
    $ClassHtml+='</div>';
    $ClassHtml+='</div>';
    $('#m_SeacherResult').html($ClassHtml);
    //学生加入班级
    $('#m_JoinClassBtn0').on('click',function(){
        var classId=$(this).attr('data-classId');
        StudentJoinClass(classId);
    })
};
//学生加入班级
function StudentJoinClass(classId){
    var SubData={};
    SubData.classId=classId;
    $.ajax({
        "type": "post",
        "url": "/web/student/center/joinClass",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                $('#c_ErrorMsg').html('申请已提交 &nbsp;等待班主任同意！').fadeIn(200);  Disappear("#c_ErrorMsg");
                $('#m_SeacherClass').fadeOut(150);
                GoldAnimate(data.retGold);
                SeacherClassReset();
                CheckClassStatus();
            }
            else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
};
//检查学生班级状态
CheckClassStatus();
function CheckClassStatus(){
    $.ajax({
        "type": "post",
        "url": "/web/student/center/classStatus",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatJoinBtn(AllData);
            }
        }
    });
};
//创建是否加入班级按钮
function CreatJoinBtn(data){
    console.log(data)
    var $IsJoin='';
    //没有加入班级或者加入班级审核失败
    if(data.joinStatus==0||data.joinStatus=='0'||data.joinStatus==3||data.joinStatus=='3'||data.joinStatus==''||data.joinStatus==null){
        $IsJoin='加入班级';
        $('#m_JoinClass').removeClass().addClass('m_UserBtn IsJoinClick');
    }
    //审核通过
    else if(data.joinStatus==1||data.joinStatus=='1'){
        $IsJoin=data.gradeName+data.className;
        $('#m_JoinClass').removeClass().addClass('m_UserBtn IsGoClass');
    }
    //等待通过
    else{
        $IsJoin=data.gradeName+data.className+'<span class="m_Wait">(等待通过)</span>';
        $('#m_JoinClass').removeClass().addClass('m_UserBtn');
    }
    $('#m_JoinClass').html($IsJoin);
    //加入班级
    $('#m_JoinClass').on('click',function(){
        if($(this).hasClass('IsJoinClick')){
            $('#m_SeacherClass').fadeIn(150);
            SeacherClassReset();
        }else if($(this).hasClass('IsGoClass')){
            window.location.href='me_class.html?classId='+data.classId+'&ClassName='+data.gradeName+data.className+'&classCode='+data.classCode;
        }else {

        }
    });
    //进入班级目标
    $('#GoTarget').on('click',function(){
        window.location.href='me_target.html?classId='+data.classId+'&ClassName='+data.gradeName+data.className+'&classCode='+data.classCode;
    })
};
//错题本学科
GetWrongSub()
function GetWrongSub(){
    $.ajax({
        "type": "post",
        "url": "/web/student/center/getSubjectList",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatWrongSub(AllData)
            }
        }
    });
};
//创建错题本学科
function CreatWrongSub(data){
    var $WrongSub='';
    for(var i=0;i<data.length;i++){
        $WrongSub+='<li title="'+data[i].label+'" data-subjectId="'+data[i].value+'">'+data[i].label+'</li>';
    }
    $('#m_UserWrong').html($WrongSub);
    $('#m_UserWrong li').on('click',function(){
        window.location.href='me_wrong.html?subjectId='+$(this).attr('data-subjectId');
    });
}






