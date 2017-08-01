/********************************************必刷题首页By徐扬**********************************************/
//用户操作
UserOpration();
function UserOpration(){
    setInterval(function(){
        var MainH=$(window).height()-160;
        if(MainH<600){
            MainH=600;
        }
        $('#mu_Main').height(MainH);
        $('#mu_Lous').height($('#mu_Main').height());
        for(var i=0;i<$('#mu_SubMain>li').length;i++){
            $('#mu_SubMain>li').eq(i).height($('#mu_SubMain>li').eq(i).width());
        }
    },1);
    $('#BackUp').on('click',function(){
        window.location.href='mustdo_vis.html?uuid='+Request.uuid+'&subjectId='+Request.subjectId;
    });
    $('#m_LookBtn').on('click',function(){
        window.location.href='mustdo_PkSub.html?questionListId='+Request.questionListId+'&uuid='+Request.uuid+'&brushLevel='+Request.brushLevel+'&knowledgeId='+Request.knowledgeId+'&isMultiple='+Request.isMultiple+'&subjectId='+Request.subjectId+'&VismaterialId='+Request.VismaterialId;
    })
};
//获取公共样式
function GetComCss(){
    $.ajax({
        "type": "post",
        "url": "/api/common/commonStyle",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                $('head').append(AllData);
            }
        }
    });
};
//获取题目答案
GetUserAnswer();
function GetUserAnswer(){
    var SubData={};
    SubData.questionListId=Request.questionListId;
    SubData.answerList=JSON.stringify(store.get('TotalQuestion'));
    SubData.uuid=Request.uuid;
    $.ajax({
        "type": "post",
        "url": "/api/student/appStudent/brush/studentMustBrushAnswer",
        "dataType": "json",
        'data': SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                GetPkResult(AllData);
                PkLogbuch(AllData);
            }
        }
    });
};
//转换用户正确率
function ToRota(num,total){
    num=parseInt(num);
    var result;
    result=parseInt((num/100)*total)+"/"+total;
    return result;
};
//转换金币格式
function ToGold(value){
    value=parseInt(value);
    var result;
    if(value>0){
        result='+'+value;
    }else if(value<0) {
        result='-'+value;
    }else {
        result=value;
    }
    return result;
};
//获取用户PK用时信息
function GetPkResult(data){
    var AllQueNum=data.questionList.length;
    var $mu_PkList='';
    var UserInfo=data.studentInfoSo;
    var UsedTime=store.get('UserUsedTime');
    var ComputerTime=UsedTime+AllQueNum*3;
    $mu_PkList+='<li><p class="m_PkNum0">'+ToRota(data.correctRate,AllQueNum)+'</p><p class="m_PkTxt">正确率</p><p class="m_PkNum1">'+ToRota(data.pkLevel,AllQueNum)+'</p></li>';
    $mu_PkList+='<li><p class="m_PkNum0">'+ToComTime(UsedTime)+'</p><p class="m_PkTxt">用时</p><p class="m_PkNum1">'+ToComTime(ComputerTime)+'</p></li>';
    $mu_PkList+='<li><p class="m_PkNum0">'+ToGold(data.gold)+'</p><p class="m_PkTxt">金币</p><p class="m_PkNum1">'+ToGold(data.pcGold)+'</p></li>';
    $('#m_PkList').html($mu_PkList);
};
//机器人与用户输赢战况
function PkLogbuch (data){
    var AllQueNum=data.questionList.length;
    var $mu_ReMsg0='';
    var UserInfo=data.studentInfoSo;
    var DefultUserPhoto='../../static/image/common/user.png';
    var ComputerPhoto='../../static/image/common/computer.png';
    var WinIco='../../static/image/mustdo/m_win.png';
    if(UserInfo.headImg!=null&&UserInfo.headImg!=''){
        var UserWin='<img src="'+WinIco+'" alt="" class="m_WinImg"><p class="m_PkPhoto0"><img src="'+UserInfo.headImg+'" alt="" id="UserImg0"></p> <p class="m_UserName">'+UserInfo.userName+'</p>';//用户
        var UserLose='<p class="m_PkPhoto0"><img src="'+UserInfo.headImg+'" alt="" id="UserImg0"></p><p class="m_UserName">'+UserInfo.userName+'</p>';//用户
    }else {
        var UserWin='<img src="'+WinIco+'" alt="" class="m_WinImg"><p class="m_PkPhoto0"><img src="'+DefultUserPhoto+'" alt="" id="UserImg0"></p> <p class="m_UserName">'+UserInfo.userName+'</p>';//用户
        var UserLose='<p class="m_PkPhoto0"><img src="'+DefultUserPhoto+'" alt="" id="UserImg0"></p><p class="m_UserName" >'+UserInfo.userName+'</p>';//用户
    }
    var pkLevel=Request.brushLevel;//电脑等级
    var ComputerLevel='';
    if(pkLevel==50||pkLevel=='50'){
        ComputerLevel="学弱";
    }
    else if(pkLevel==70||pkLevel=='70'){
        ComputerLevel="学霸";
    }else {
        ComputerLevel="学神";
    }
    //机器人输赢情况
    var ComputerWin='<img src="'+WinIco+'" alt="" class="m_WinImg"><p class="m_PkPhoto0"><img src="'+ComputerPhoto+'" alt=""></p><p class="m_UserName">'+ComputerLevel+'</p>'
    var ComputerLose='<p class="m_PkPhoto0"><img src="'+ComputerPhoto+'" alt=""></p><p class="m_UserName">'+ComputerLevel+'</p>'
    //平局
    if(data.result==1||data.result=='1'){
        $('#UserPkLog').html(UserWin);
        $('#ComputerPkLog').html(ComputerLose);
    }else {
        $('#UserPkLog').html(UserLose);
        $('#ComputerPkLog').html(ComputerWin);
    }
};
