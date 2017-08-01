/********************************************个人中心班级目标By徐扬**********************************************/
//获取头部导航
GetHtml("../../model/common/Head.txt","#Com_Head");
store.set('targetclassid',Request.classId)
CheckBrower();
//用户常用操作
UserOpration();
function UserOpration(){
    //更换对手按钮显示
    $('#m_PkUserBox').hover(function(){
        $('#m_ChangePkBtn').fadeIn(150);
    },function(){
        $('#m_ChangePkBtn').fadeOut(150);
    });
    $('#m_ChangePkBtn').on('click',function(){
        $('#m_ChoiceTarget').fadeIn(150);
        ChangePkUserOpTion();//更换PK对手
    });
    $('#m_ClickHere').on('click',function(){
        var ClassFlag=CheckClassStatus();
        if(ClassFlag==1||ClassFlag=='1'){
            $('#m_ChoiceTarget').fadeIn(150);
            AddPkUserOpTion();
        }else if(ClassFlag==2||ClassFlag=='2'){
            $('#c_ErrorMsg').css('width','400px').html('等待班级申请通过后添加班级目标').fadeIn(200);
            Disappear("#c_ErrorMsg");
        }
        else {
            $('#c_ErrorMsg').html('请先加入班级').fadeIn(200);
            Disappear("#c_ErrorMsg");
        }
    })
    /*查询学生个人信息*/
    GetStudentInfo();
    //查询用户是否含有班级目标
    pkUserStatus();
    //查询PK胜利场次
    PkWinInfo();
    /*查询学生班级状态*/
    CheckClassStatus();
    //PK对手信息
    GetPkUserInfo();
    //PK记录信息
    GetPkLogInfo();
    //查询PK对手列表
    PkUserList();
};
/*查询学生个人信息*/
function GetStudentInfo(){
    $.ajax({
        "type": "post",
        "url": "/web/student/center/info",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatUserInfo(AllData)
            }
        }
    });
};
//创建个人信息
function CreatUserInfo(data){
    if(data.headImg!=null&&data.headImg!=''){
        $('#UserImg').attr('src',data.headImg);
    }else {
        $('#UserImg').attr('src','../../static/image/common/user.png');
    }
}
//查询用户是否含有班级目标
function pkUserStatus(){
    $.ajax({
        "type": "post",
        "url": "/web/student/center/pkUserStatus",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                IsHasPK(AllData);
            }
        }
    });
};
//判断是否含有班级目标
function IsHasPK(Bool){
    if(Bool){
        $('#m_Notarget').css('display','none');
        $('#m_HasTarget').css('display','block');
    }
    else {
        $('#m_HasTarget').css('display','none');
        $('#m_Notarget').css('display','block');
    }
};
//查询PK胜利场次
function PkWinInfo(){
    $.ajax({
        "type": "post",
        "url": "/web/student/center/pkWinInfo",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatPkWin(AllData);
            }
        }
    });
};
//PK输赢及进度条
function CreatPkWin(data){
    var winNum= 0,failNum=0;
    if(data.winNum==null||data.winNum==''){
        winNum= 0;
    }else {
        winNum=data.winNum;
    }
    if(data.failNum==null||data.failNum==''){
        failNum=0;
    }else {
        failNum=data.failNum;
    }
    $('#UserWinNum').html(winNum);
    $('#UserFailNum').html(failNum);
    $('.m_WinTotal').html(data.totalNum);
    var UserPro=(data.winNum/data.totalNum)*100+'%';
    $('#UserPro').css('width',UserPro);
    var m_PkPro=(data.failNum/data.totalNum)*100+'%';
    $('#m_PkPro').css('width',m_PkPro);
};
/*查询学生班级状态*/
function CheckClassStatus(){
    var ClassStatus='';
    $.ajax({
        "type": "post",
        "url": "/web/student/center/classStatus",
        "dataType": "json",
        "async":false,
        success: function (data) {
            var AllData=data.retData.joinStatus;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                ClassStatus=AllData;
            }
        }
    });
    return ClassStatus;
};
//PK对手信息
function GetPkUserInfo(){
    $.ajax({
        "type": "post",
        "url": "/web/student/center/pkUserInfo",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatPkUserInfo(AllData);
            }
        }
    });
};
//创建PK对手信息
function CreatPkUserInfo(data){
    if(data.userName==null||data.userName==''){

    }else {
        $('#PkUserName').html(data.userName);
    }
    if(data.headImg==null||data.headImg==''){
        $('#PKImg').attr('src','../../static/image/common/user.png');
    }else {
        $('#PKImg').attr('src',data.headImg);
    }
}
//PK记录信息
function GetPkLogInfo(){
    $.ajax({
        "type": "post",
        "url": "/web/student/center/pkLogInfo",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatePkLog(AllData);
            }
        }
    });
};
//创建PK记录
function CreatePkLog(data){
    var $PkLog='';
    $('#m_PkLogList').html('');
    if(data.length>0){
        $('#m_NoPkLog').css('display','none');
        for(var i=0;i<data.length;i++){
            $PkLog+='<li>';
            $PkLog+='<span>'+data[i].finishTime+'</span>';
            $PkLog+='<span>'+ToRata(data[i].score,data[i].totalScore)+'</span>';
            $PkLog+='<span>'+data[i].paperName+'</span>';
            $PkLog+='<span>'+ToRata(data[i].pkScore,data[i].totalScore)+'</span>';
            $PkLog+='</li>';
        }
        $('#m_PkLogList').html($PkLog);
    }else {
        $('#m_NoPkLog').css('display','block');
    }
};
function ToRata(score,totalScore){
    var result='';
    if(score==null||score==''){score=0}
    if(totalScore==null||totalScore==''){totalScore=0}
    result=score+'/'+totalScore;
    return result;
}
//查询PK对手列表
function PkUserList(){
    var SubData={};
    SubData.classId=Request.classId;
    $.ajax({
        "type": "post",
        "url": "/web/student/center/choosePkUser",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatPkUserList(AllData)
            }
        }
    });
};
//创建PK对手列表
function CreatPkUserList(data){
    var $PkUser='';
    if(data.length>0){
        $PkUser+='<li data-sutdentId="null">';
        $PkUser+='<span>暂不设置</span>';
        $PkUser+='</li>';
        for(var i=0;i<data.length;i++){
            $PkUser+='<li data-sutdentId="'+data[i].sutdentId+'">';
            $PkUser+='<span>'+data[i].sutdentName+'</span>';
            $PkUser+='</li>';
        }
        $('#m_TargetList').html($PkUser);
    }
    IsCanChangePk();
};
//查询更换对手次数
function GetChangePkUserNum(){
    var Number='';
    $.ajax({
        "type": "post",
        "url": "/web/student/center/changePkUserNum",
        "dataType": "json",
        "async":false,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                Number=AllData;
            }
        }
    });
    return Number;
};
//判断是否还有机会更换对手
function IsCanChangePk(){
    var Num=GetChangePkUserNum();
    var IsNumHtml='';
    if(Num==0||Num=='0'){
        IsNumHtml='<span class="fcCA">本月不可再次更换班级目标</span>';
        $('#m_ChoiceBtn').css('display','none')
        $('#m_TargetList li').removeClass();
    }else {
        $('#m_TargetList li').addClass('CanChangePK');
        IsNumHtml='本月还剩<span class="m_SurplusNum">'+Num+'次</span>更换班级目标的机会';
    }
    $('#m_Surplus').html(IsNumHtml);
};
//更换PK对手
function ChangePkUser(pkUserId){
    var SubData={};
    SubData.pkUserId=pkUserId;
    $.ajax({
        "type": "post",
        "url": "/web/student/center/changePkUser",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                $('#c_ErrorMsg').html('更换对手成功').fadeIn(200);
                Disappear("#c_ErrorMsg");
                $('#m_ChoiceTarget').fadeOut(150);
                $('#m_Notarget').css('display','none');
                $('#m_HasTarget').css('display','block');
                UpDataPkUser();
            }
            else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);
                Disappear("#c_ErrorMsg");
            }
        }
    });
};
//更换PK对手操作
function ChangePkUserOpTion(){
    $('#m_SeacherClose').on('click',function(){
        $('#m_ChoiceTarget').fadeOut(150);
        $('.CanChangePK').css('color','').removeClass('SubId').find('i').remove();
    });
    var Ico='<i class="meimg m_cico0"></i>';
    $('.CanChangePK').on('click',function(){
        $(this).append(Ico).css('color','#90d29b').addClass('SubId');
        $(this).siblings('li').css('color','').removeClass('SubId').find('i').remove();
        $('#m_ChoiceBtn').off('click');
        $('#m_ChoiceBtn').on('click',function(){
            if($('#m_TargetList li').hasClass('SubId')){
                ChangePkUser($('.SubId').attr('data-sutdentid'));
            }else {
                $('#c_ErrorMsg').html('请先选择对手').fadeIn(200);
                Disappear("#c_ErrorMsg");
            }
        });
    });
};
//添加PK对手
function AddPkUser(pkUserId){
    var SubData={};
    SubData.pkUserId=pkUserId;
    $.ajax({
        "type": "post",
        "url": "/web/student/center/addPkUser",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                $('#c_ErrorMsg').html('操作成功').fadeIn(200);
                $('#m_Notarget').css('display','none');
                $('#m_HasTarget').css('display','block');
                Disappear("#c_ErrorMsg");
                GoldAnimate(data.retGold);
                $('#m_ChoiceTarget').fadeOut(150);
                UpDataPkUser();
            }
            else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);
                Disappear("#c_ErrorMsg");
            }
        }
    });
};
//添加PK对手操作
function AddPkUserOpTion(){
    $('#m_SeacherClose').on('click',function(){
        $('#m_ChoiceTarget').fadeOut(150);
        $('.CanChangePK').css('color','').removeClass('SubId').find('i').remove();
    });
    var Ico='<i class="meimg m_cico0"></i>';
    $('.CanChangePK').on('click',function(){
        $(this).append(Ico).css('color','#90d29b').addClass('SubId');
        $(this).siblings('li').css('color','').removeClass('SubId').find('i').remove();
        $('#m_ChoiceBtn').off('click');
        $('#m_ChoiceBtn').on('click',function(){
            if($('#m_TargetList li').hasClass('SubId')){
                AddPkUser($('.SubId').attr('data-sutdentid'));
            }else {
                $('#c_ErrorMsg').html('请先选择对手').fadeIn(200);
                Disappear("#c_ErrorMsg");
            }
        });
    });

};
//更新PK对手
function UpDataPkUser(){
    //查询PK胜利场次
    PkWinInfo();
    //PK对手信息
    GetPkUserInfo();
    //PK记录信息
    GetPkLogInfo();
    //查询PK对手列表
    PkUserList();
    //查询用户是否含有班级目标
    pkUserStatus();
};



