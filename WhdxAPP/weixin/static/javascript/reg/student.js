/*******************************学生注册 by EchoVue  2017.05.17**************************************/
//输入操作重置
StuErrorReset();
function StuErrorReset() {
    $('#StuName').bind('click mousedown',function(){$('#StuNameError').html('');$("#AllError").html('');})
    $('#StuGradeSlelect').on('click',function(){$('#StuGradeError').html('');$("#AllError").html('');})
};
//获取学生年级
GetGrade()
function GetGrade() {
    $.ajax({
        "type":"post",
        "url":"  /api/common/grade",
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData=data.retData;
            if(codenum==0){
                CreatStudentGrade(AllData)
            }
        }
    });
}
//创建班级
function CreatStudentGrade(data) {
    var $Html='';
    if(data==null||data==''){
        $Html='<li>暂无年级</li>';
    }else {
        $("#StuGrade").attr('data-Id',data[0].value).html(data[0].label)
        for(var i=0;i<data.length;i++){
            $Html+='<li data-Id="'+data[i].value+'">'+data[i].label+'</li>'
        }
    }
    $("#StuGradeMain").html($Html);
    GradeEvent()
}
//班级选择事件
function GradeEvent() {
    $("#StuGradeMain li").off('click');
    $("#StuGradeMain li").on('click',function () {
        var Id=$(this).attr('data-Id');
        var Data=$(this).html();
        $('#StuGradeError').html('');$("#AllError").html('');
        $("#StuGrade").attr('data-Id',Id).html(Data);
        $("#StuGradeMain").css('display','none');
        $("#Student").fadeIn(150);
    });
}
//用户点击班级事件
UserGrade();
function UserGrade() {
    $("#StuGradeSlelect").off('click');
    $("#StuGradeSlelect").on('click',function () {
        $("#Student").css('display','none');
        $("#StuGradeMain").fadeIn(150);
    })
};
//学生数据重置
function StuErrorTxtReset() {
    $("#StuNameError").html('');
    $("#StuGradeError").html('');
    $("#StuAllError").html('');
}
//保存之前
BeforSave();
function BeforSave() {
    $("#StuSave").on('click',function () {
        var GradeId=$("#StuGrade").attr('data-Id');
        var Name=$("#StuName").val();
        if(Name==''){
            StuErrorTxtReset();
            $("#StuNameError").html('请输入姓名');
        }else if(GradeId==undefined||GradeId=='undefinded'){
            StuErrorTxtReset();
            $("#StuGradeError").html('请选择年级');
        }else {
            $(this).html('注册中...')
            SaveStuInfo()
        }

    })
};
//保存学生信息
function SaveStuInfo() {
    var SubData={};
    /*姓名*/
    SubData.name =$('#StuName').val();
    /*手机号*/
    SubData.mobile=$('#Phone').val();
    /*密码*/
    SubData.password=$.md5($('#Pass').val());
    /*出版社*/
    SubData.pressId='null';
    /*短信验证码*/
    SubData.smsCaptcha=$('#Msg').val();
    /*是否存在班级代码*/
    SubData.isClassCode=false;
    /*班级代码*/
    SubData.classCode ='';
    /*年级ID*/
    SubData.gradeId=$('#StuGrade').attr('data-Id');
    //用户OpenId
    SubData.wxOpenId= $("#UserType").attr('data-OpenId');;
    $.ajax({
        "type":"post",
        "url":" /api/wx/basic/studentRegister",
        "dataType":"json",
        'data': SubData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1));
            if(codenum==0){

                alert('恭喜您，注册成功 ');
                wx.closeWindow();
            }else {
                $("#StuSave").html('注册');
                StuErrorTxtReset();
                $("#StuAllError").html(data.retMsg);
            }
        }
    });
}
//赠送用户机会
function GiveChance() {
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



