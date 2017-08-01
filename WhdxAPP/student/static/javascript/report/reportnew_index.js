/********************************************必刷题首页By徐扬**********************************************/
//获取题目
GetUserPkInfo();
function GetUserPkInfo(){
    var SubData={};
    SubData.id=Request.id;
    $.ajax({
        "type": "post",
        "url": "/api/student/homework/report/getUserPaperPKInfo",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatPKInfo(AllData)
            }
        }
    });
};

//转换用户正确率
function ToRota(num,total){
    if(num==null){num=0;}
    num=parseInt(num);
    var result;
    if(total==0||total==null){
        result=0+"/"+0;
    }else {
        result=num+"/"+total;
    }
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
//创建PK信息
function CreatPKInfo(data){
    if(data==null){return false;}
    var PkInfo='';
    PkInfo+='<p class="r_PkTitle"><span>总分 100分</span><span>时间 30分钟</span></p>';
    PkInfo+=UserInfo(data);
    PkInfo+='<div class="m_VsBox"><img src="../../static/image/mustdo/vs.png" alt=""></div>';
    PkInfo+=PkUserInfo(data);
    PkInfo+=PkMainInfo(data);
    $('#r_PkInfo').html(PkInfo);
};
//用户信息
function UserInfo(data){
    var isComplete=data.isComplete;//是否已做（0 未做 1 未批改 2 已批改）
    var headImg=data.headImg;//用户头像
    var result=data.result;//结果（0：用户胜利；1：PK对手胜利；2：平）
    var userName=data.userName;//用户姓名
    var $UserInfo='';
    /*用户信息*/
    $UserInfo+='<div class="m_PkUserCon">';
    if( isComplete==0||isComplete=='0'){
        $UserInfo+='<img src="../../static/image/report/nodone.png" alt="" class="r_Flag0">';
    }else  if( isComplete==1||isComplete=='1'){
        $UserInfo+='<img src="../../static/image/report/wait.png" alt="" class="r_Flag1">';
    }else {

    }
    if(result==0||result=='0'){
        $UserInfo+='<img src="../../static/image/report/winico.png" alt="" class="r_Flag2">';
    }else if(result==2||result=='2'){
        $UserInfo+='<img src="../../static/image/report/samico.png" alt="" class="r_Flag4">';
    }else {

    }
    $UserInfo+='<p class="m_PkPhoto0">';
    if(headImg!=null&&headImg!=''){
        $UserInfo+='<img src="'+headImg+'" alt="">';
    }else {
        $UserInfo+='<img src="../../static/image/common/user.png" alt="">';
    }
    $UserInfo+='</p>';
    $UserInfo+='<p class="r_Name">'+userName+'</p>';
    $UserInfo+='</div>';
    return $UserInfo;
};
//PK对手信息
function PkUserInfo(data){
    var have=data.have;//是否具有PK对手（0：没有；1：有）
    var isPkComplete=data.isPkComplete;//PK对手是否已做（0 未做 1 未批改 2 已批改）
    var pkHeadImg=data.pkHeadImg;//Pk对手头像
    var pkUserName=data.pkUserName;//PK对手姓名
    var result=data.result;//结果（0：用户胜利；1：PK对手胜利；2：平）
    var $UserInfo='';
    /*PK对手信息*/
    if(have){
        $UserInfo+='<div class="m_PkUserCon">';
        if( isPkComplete==0||isPkComplete=='0'||isPkComplete==null){
            $UserInfo+='<img src="../../static/image/report/nodone.png" alt="" class="r_Flag0">';
        }else  if( isPkComplete==1||isPkComplete=='1'){
            $UserInfo+='<img src="../../static/image/report/wait.png" alt="" class="r_Flag1">';
        }else {

        }
        if(result==1||result=='1'){
            $UserInfo+='<img src="../../static/image/report/winico.png" alt="" class="r_Flag2">';
        }else if(result==2||result=='2'){
            $UserInfo+='<img src="../../static/image/report/samico.png" alt="" class="r_Flag4">';
        }else {

        }
        $UserInfo+='<p class="m_PkPhoto0">';
        if(pkHeadImg!=null&&pkHeadImg!=''){
            $UserInfo+='<img src="'+pkHeadImg+'" alt="">';
        }else {
            $UserInfo+='<img src="../../static/image/common/user.png" alt="">';
        }
        $UserInfo+='</p>';
        $UserInfo+='<p class="r_Name">'+pkUserName+'</p>';
        $UserInfo+='</div>';
    }
    else {
        $UserInfo+='<div class="m_PkUserCon">';
        $UserInfo+='<p class="m_PkPhoto0">';
        $UserInfo+='<img src="../../static/image/common/defult.png" alt="">';
        $UserInfo+='</p>';
        $UserInfo+='<p class="r_Name">暂无对手</p>';
        $UserInfo+='</div>';
    }
    return $UserInfo;
};
//创建PK用时
function PkMainInfo(data){
    var have=data.have;//是否具有PK对手（0：没有；1：有）
    var isComplete=data.isComplete;//对手是否已做（0 未做 1 未批改 2 已批改）
    var isPkComplete=data.isPkComplete;//PK对手是否已做（0 未做 1 未批改 2 已批改）
    var pkScore=data.pkScore;//PK对手得分
    var pkTotalScore=data.pkTotalScore;//PK对手总分
    var pkTotalTime=data.pkTotalTime;//PK对手总时间
    var score=data.score;//用户得分
    var totalScore=data.totalScore;//用户总分
    var totalTime=data.totalTime;//用户总用时
    var PkInfo='';
    PkInfo+='<ul class="m_PkList">';
    PkInfo+='<li>';
    //有对手
    if(have){
        //已批改
        if(isComplete==2||isComplete=='2'){
            PkInfo+='<span class="m_PkNum0">'+ToRota(score,totalScore)+'</span>';
        }
        //未做
        else if(isComplete==0||isComplete=='0'){
            PkInfo+='<span class="m_PkNum0">- -</span>';
        }
        //未批改
        else {
            PkInfo+='<span class="m_PkNum0">?</span>';
        }
        PkInfo+='<span class="m_PkTxt">正确率</span>';
        //已批改
        if(isPkComplete==2||isPkComplete=='2'){
            PkInfo+='<span class="m_PkNum1">'+ToRota(pkScore,pkTotalScore)+'</span>';
        }
        //未做
        else if(isPkComplete==0||isPkComplete=='0'){
            PkInfo+='<span class="m_PkNum1">- -</span>';
        }
        //未批改
        else {
            PkInfo+='<span class="m_PkNum1">?</span>';
        }
    }else {
        if(isComplete==2||isComplete=='2'){
            PkInfo+='<span class="m_PkNum0">'+ToRota(score,totalScore)+'</span>';
        }else {
            PkInfo+='<span class="m_PkNum0">?</span>';
        }
        PkInfo+='<span class="m_PkTxt">正确率</span>';
        PkInfo+='<span class="m_PkNum1">- -</span>';
    }
    PkInfo+='</li>';
    PkInfo+='<li>';
    //已批改
    if(isComplete==2||isComplete=='2'){
        PkInfo+='<span class="m_PkNum0">'+ToComTime(totalTime)+'</span>';
    }
    //未做
    else if(isComplete==0||isComplete=='0'){
        PkInfo+='<span class="m_PkNum0">- -</span>';
    }
    //未批改
    else {
        PkInfo+='<span class="m_PkNum0">'+ToComTime(totalTime)+'</span>';
    }
    PkInfo+='<span class="m_PkTxt">用时</span>';
    //如果有目标
    if(have){
        //已批改
        if(isPkComplete==2||isPkComplete=='2'){
            PkInfo+='<span class="m_PkNum1">'+ToComTime(pkTotalTime)+'</span>';
        }
        //未做
        else if(isPkComplete==0||isPkComplete=='0'){
            PkInfo+='<span class="m_PkNum1">- -</span>';
        }
        //未批改
        else {
            PkInfo+='<span class="m_PkNum1">'+ToComTime(pkTotalTime)+'</span>';
        }
    }
    else {
        PkInfo+='<span class="m_PkNum1">- -</span>';
    }
    PkInfo+='</li>';
    PkInfo+='</ul>';
    return PkInfo;
};
//获取题目
GetQuestion();
function GetQuestion(){
    var SubData={};
    SubData.id=Request.id;
    $.ajax({
        "type": "post",
        "url": "/api/student/homework/report/getUserPaperReport",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                SelectOption(AllData.paper.questionLines);//题号
                JustWrong();
                IsAnShow(AllData.resPaperUser.status)
            }
        }
    });
};
//创建题号
function SelectOption(AllData){
    var $Select='';
    var Index=0;
    for(var j=0;j<AllData.length;j++){
        $Select+='<p class="r_OptionTitle">'+AllData[j].lineName+'</p>';
        $Select+='<ul class="r_OptionList">';
        for(var i=0;i<AllData[j].questionGroup.length;i++){
            var data=AllData[j].questionGroup;
            Index++;//题号
            //正常题型
            if(data[i].groupCode==null){
                var result=data[i].questions[0].paperUserAnswer.result;
                var selectableType=data[i].questions[0].selectableType;
                if(selectableType==1){
                    $Select+=OptionClolor(result,Index);
                }
                else {
                    $Select+=OptionClolor(result,Index);
                }
            }
            //组合题
            else {
                //不可拆分
                if(data[i].isSplite==0||data[i].isSplite=='0'){
                    var result=data[i].result;
                    $Select+=OptionClolor(result,Index);
                }
                //可拆分
                else {
                    var result=data[i].result;
                    if(data[i].selectableType==1){
                        $Select+=OptionClolor(result,Index);
                    }else {
                        $Select+=OptionClolor(result,Index);
                    }
                }
            }
        }
        $Select+='</ul>';
    }
    $('#Main').html($Select);
};
//选项颜色
function OptionClolor(Result,Index){
    var $Select='';
    if(Result==1){
        $Select+='<li class="Com_Nav r_OptionWrong">'+Index+'</li>';
    }else if(Result==0){
        $Select+='<li class="Com_Nav r_OptionRight">'+Index+'</li>';
    }else if(Result==2){
        $Select+='<li class="Com_Nav r_OptionHalf">'+Index+'</li>';
    }else {
        $Select+='<li class="Com_Nav r_OptionNo">'+Index+'</li>';
    }
    return $Select;
}
//只看错题
function JustWrong(){
    $('#r_LookWrong0').on('click',function(){
        if($(this).hasClass('just')){
            $('.r_SelectBox li').css('display','block');
            $(this).removeClass('just').attr('src','../../static/image/report/wrongico.png');
        }else {
            $('.r_SelectBox li').css('display','none');
            $('.r_SelectBox .r_OptionWrong').css('display','block');
            $('.r_SelectBox .r_OptionHalf').css('display','block');
            $('.r_InTro li').css('display','block');
            $(this).removeClass('just').addClass('just').attr('src','../../static/image/report/kolaico.png');
        }
    });
    $('.Com_Nav').on('click',function(){
        var index=$(this).html()-1;
        if($('#r_LookWrong0').hasClass('just')){
            window.location.href='report_sub.html?LookWrong='+true+'&id='+Request.id+'&index='+index;
        }else {
            window.location.href='report_sub.html?LookWrong='+false+'&id='+Request.id+'&index='+index;
        }
    })
};
//获取分析
GetAnalaysis();
function GetAnalaysis(){
    var SubData={};
    SubData.id=Request.id;
    $.ajax({
        "type": "post",
        "url": "/api/student/homework/report/studentAnalysis",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatAnalaysis(AllData.list);
                //CreatDesc(AllData)
            }
        }
    });
};
//Tab切换
Tab();
function Tab(){
    $('#Tab1').on('click',function(){
        $('#Tab1Box').css('display','none')
        $('#Tab2Box').css('display','block')
        $(this).addClass('r_Tab');
        $('#Tab2').removeClass();
    })
    $('#Tab2').on('click',function(){
        $('#Tab2Box').css('display','none')
        $('#Tab1Box').css('display','block')
        $(this).addClass('r_Tab');
        $('#Tab1').removeClass();
    })
};
//是否显示学情分析
function IsAnShow(status){
    if(status=='5'||status=='6'){
        $('#r_TestInfoTitle').css('display','none')
        $('#r_TabBox').css('display','block')
    }else {
        $('#r_TestInfoTitle').css('display','block')
        $('#r_TabBox').css('display','none')
    }
}
//创建知识点详情
function CreatAnalaysis(data){
    var $Analaysis='';
    for(var i=0;i<data.length;i++){
        $Analaysis+='<li data-knowledgeId="'+data[i].knowledgeId+'" data-subjectId="'+data[i].subjectId+'"  >';
        $Analaysis+='<p class="r_knowledgeName">'+data[i].knowledgeName+'</p>';
        $Analaysis+='<div class="r_AnalyRight">';
        $Analaysis+='<p class="r_ItemNumberSet">';
        if(data[i].numCorrectSet!=null){
            for(var j=0;j<data[i].numCorrectSet.length;j++){
                var CorrectSet=data[i].numCorrectSet[j].number;
                var Correct=data[i].numCorrectSet[j].result;
                if(Correct=='0'||Correct==0){
                    $Analaysis+='<span class="r_OpNomalColor">'+CorrectSet+'题、</span>';
                }
                else if(Correct=='2'||Correct==2){
                    $Analaysis+='<span class="r_OptionHalf">'+CorrectSet+'题、</span>';
                }
                else {
                    $Analaysis+='<span class="r_OptionWrong">'+CorrectSet+'题、</span>';
                }
            }
        }
        $Analaysis+='</p>';
        $Analaysis+='<p class="r_ItemNumberSet"><span class="fc66">正确率：</span><span class="fc59">'+data[i].correctRate+'%</span> </p>';
        $Analaysis+='<img src="'+Flag(data[i].correctRate)+'" alt="" class="r_Flag3">';
        $Analaysis+='</div>';
        $Analaysis+='</li>';
    }
    $('#r_AnalyList').html($Analaysis);
};
//创建考察
function CreatDesc(data){
    var $Desc='';
    $Desc+='<p class="r_AnalysisTitlt">本次测试共考察了'+data.list.length+'个知识点，其中：</p>';
    $Desc+='<div class="r_DataResult">';
    $Desc+=Desc(data.accuracy,data.knowledgeDesc);
    //$Desc+=CoverBtn(data);
    $Desc+='</div>';
    $('#r_Bottom').html($Desc);
    GoCover();

}
//随机标语
function Flag(correctRate){
    var result='';
    if(correctRate>=0&&correctRate<40){
        result='../../static/image/report/s'+Math.floor(Math.random()*3+400)+'.png';
    }else if(correctRate>=40&&correctRate<60){
        result='../../static/image/report/s'+Math.floor(Math.random()*2+600)+'.png';
    }else if(correctRate>=60&&correctRate<80){
        result='../../static/image/report/s'+Math.floor(Math.random()*6+800)+'.png';
    }else if(correctRate>=80&&correctRate<90){
        result='../../static/image/report/s'+Math.floor(Math.random()*4+900)+'.png';
    }else if(correctRate>=90&&correctRate<=100){
        result='../../static/image/report/s'+Math.floor(Math.random()*5+1000)+'.png';
    }
    return result;
};
//总结
function Desc(accuracy,knowledgeDesc){
    var result='';
    if(accuracy<90){
        result+='<div class="r_Desc">';
        result+='<img src="../../static/image/report/r_dic1.png" alt="">';
        if(knowledgeDesc==null){
            result+='<p class="fcff">'+暂无总结+'</p>';
        }else{
            result+='<p class="fcff">'+knowledgeDesc+'</p>';
        }
        result+='<img src="../../static/image/report/r_dic0.png" alt="">';
        result+='</div>';
    }else {
        result+='<div class="r_Desc">';
        if(knowledgeDesc==null){
            result+='<p>'+暂无总结+'</p>';
        }else {
            result+='<p>'+knowledgeDesc+'</p>';
        }

        result+='</div>';
    }
    return result;
};
//补偿训练按钮
function CoverBtn(data){
    var Result='';
    if(data.status==-1){
        Result='';
    }else if(data.status==0){
        Result='<p class="r_CoverBtn CreatCover" data-status="'+data.status+'">补偿训练</p>';
    }
    else if(data.status==1){
        Result='<p class="r_CoverBtn GoCover"  data-status="'+data.status+'">补偿训练</p><p class="LineT">已购买</p>';
    }
    else if(data.status==2){
        Result='<p class="r_CoverBtn"  data-status="'+data.status+'">补偿训练</p><p class="LineT">已购买</p>';
    }
    else {
        Result='<p class="r_CoverBtn"  data-status="'+data.status+'">补偿训练</p><p class="LineT">已购买</p>';
    }
    return Result;
};
//已经购买
function GoCover(){
    $('.r_CoverBtn').on('click',function(){
        var status=$(this).attr('data-status');
        javascript:bc.CreatCover(status);
    });
};





