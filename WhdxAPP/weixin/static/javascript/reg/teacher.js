/*******************************学生注册 by EchoVue  2017.05.17**************************************/
//输入操作重置
TeaErrorReset();
function TeaErrorReset() {
    $('#TeaName').bind('click mousedown',function(){$('#TeaNameError').html('');$("#TeaAllError").html('');})
    $('#SubjectSlelect').on('click',function(){$('#SubError').html('');$("#TeaAllError").html('');})
    $('#MaterialSelect').on('click',function(){$('#MaterialError').html('');$("#TeaAllError").html('');})
    $('#SchoolSelect').on('click',function(){$('#SchoolError').html('');$("#TeaAllError").html('');})
};
//获取学科
GetSubject();
function GetSubject() {
    $.ajax({
        "type":"post",
        "url":"  /api/common/subject",
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData=data.retData;
            if(codenum==0){
                CreatSubject(AllData)
            }
        }
    });
};
//创建学科
function CreatSubject(data) {
    var $Html='';
    if(data==null||data==''){
        $Html='<li>暂无年级</li>';
    }else {
        for(var i=0;i<data.length;i++){
            $Html+='<li data-Id="'+data[i].value+'">'+data[i].label+'</li>'
        }
    }
    $("#SubMain").html($Html);
    SubjectEvent()
}
//学科选择事件
function SubjectEvent() {
    $("#SubMain li").off('click');
    $("#SubMain li").on('click',function () {
        var Id=$(this).attr('data-Id');
        var Data=$(this).html();
        $('#SubError').html('');$("#TeaAllError").html('');
        $("#Subject").attr('data-Id',Id).html(Data);
        $("#SubMain").css('display','none');
        $("#Teacher").fadeIn(150);
        GetMaterial(Id)
    });
    $("#SubMain li").eq(0).click();
    $("#Teacher").css('display','none');
}
//用户点击学科事件
UserSubject();
function UserSubject() {
    $("#SubjectSlelect").off('click');
    $("#SubjectSlelect").on('click',function () {
        $("#Teacher").css('display','none');
        $("#SubMain").fadeIn(150);
    })
};
//老师错误数据重置
function TeaErrorTxtReset() {
    $("#TeaNameError").html('');
    $("#SubError").html('');
    $("#MaterialError").html('');
    $("#SchoolError").html('');
    $("#TeaAllError").html('');
};
//获取教材
function GetMaterial(subjectId) {
    var Subdata={};
    Subdata.subjectId=subjectId;
    Subdata.grade='';
    Subdata.pressId='';
    $.ajax({
        "type":"post",
        "url":"  /api/common/material",
        "dataType":"json",
        "data":Subdata,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData=data.retData;
            if(codenum==0){
                CreatMaterial(AllData)
            }
        }
    });
}
//创建教材
function CreatMaterial(data) {
    var $Html='';
    if(data==null||data==''){
        $Html='<li>暂无年级</li>';
    }else {
        var Id=data[0].id;
        var Data=data[0].name;
        var Grade=data[0].grade;
        $("#Material").attr({'data-Id':Id,'data-grade':Grade}).html(Data);
        for(var i=0;i<data.length;i++){
            $Html+='<li data-Id="'+data[i].id+'" data-grade="'+data[i].grade+'">'+data[i].name+'</li>'
        }
    }
    $("#MaterialMain").html($Html);
    MaterialEvent()
}
//教材选择事件
function MaterialEvent() {
    $("#MaterialMain li").off('click');
    $("#MaterialMain li").on('click',function () {
        var Id=$(this).attr('data-Id');
        var Data=$(this).html();
        var Grade=$(this).attr('data-grade');
        $('#MaterialError').html('');$("#TeaAllError").html('');//错误问题
        $("#Material").attr({'data-Id':Id,'data-grade':Grade}).html(Data);
        $("#MaterialMain").css('display','none');
        $("#Teacher").fadeIn(150);
    });

}
//用户点击教材事件
UserMaterial();
function UserMaterial() {
    $("#MaterialSelect").off('click');
    $("#MaterialSelect").on('click',function () {
        $("#Teacher").css('display','none');
        $("#MaterialMain").fadeIn(150);
    })
};
//教师保存之前
UserBeforSave();
function UserBeforSave() {
    $("#TeaSave").on('click',function () {
        var SchoolId=$("#School").attr('data-Id');
        var Name=$("#TeaName").val();
        if(Name==''){
            TeaErrorTxtReset();
            $("#TeaNameError").html('请输入姓名');
        }else if(SchoolId==undefined||SchoolId=='undefinded'){
            TeaErrorTxtReset();
            $("#SchoolError").html('请选择学校');
        }else {
            $("#TeaSave").html('注册中...')
            SaveTeaInfo()
        }

    })
}
//保存教师信息
function SaveTeaInfo() {
    var SubData={};
    // 姓名
    SubData.name =$('#TeaName').val();
    // 手机号
    SubData.mobile=$('#Phone').val();
    // 密码
    SubData.password=$.md5($('#Pass').val());
    // 学科
    SubData.subjectId=$("#Subject").attr('data-Id');
    //教材
    SubData.materialId=$("#Material").attr('data-Id');
    // 短信验证码
    SubData.smsCaptcha=$('#Msg').val();
    // 学校
    SubData.schoolId=$('#School').attr('data-Id');
    //用户OpenId
    SubData.wxOpenId= $("#UserType").attr('data-OpenId');;
    $.ajax({
        "type":"post",
        "url":" /api/wx/basic/teacherRegiste",
        "dataType":"json",
        'data': SubData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1));
            if(codenum==0){

                alert('恭喜您，注册成功 ');
                wx.closeWindow();
            }else {
                TeaErrorTxtReset();
                $("#TeaSave").html('注册中')
                $("#TeaAllError").html(data.retMsg);
            }
        }
    });
}
//赠送用户机会
function GiveTeaChance() {
    var SubData={};
    //用户OpenId
    SubData.openId= $("#UserType").attr('data-OpenId');;
    SubData.type= '1';
    $.ajax({
        "type":"post",
        "url":" /api/wx/basic/addPriceNum",
        "dataType":"json",
        'data': SubData,
        success:function(data){

        }
    });
}


