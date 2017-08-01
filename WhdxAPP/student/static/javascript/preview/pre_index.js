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
                console.log(AllData)
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
                SelectOption(AllData.previewInfo.questionList);//选择题
                JustWrong();
            }
        }
    });
};
//创建题号
function SelectOption(data){
    var $Select='';
    var $Other='';
    for(var i=0;i<data.length;i++){
        if(data[i].groupCode==null){
            var result=data[i].paperUserAnswer.result;
            var lnOrder=data[i].lnOrder;
            var selectable=data[i].selectable;
            if(selectable==1){
                if(result==1){
                    $Select+='<li class="Com_Nav r_OptionWrong">'+(i+1)+'</li>';
                }else if(result==0){
                    $Select+='<li class="Com_Nav r_OptionRight">'+(i+1)+'</li>';
                }else {
                    $Select+='<li class="Com_Nav r_OptionNo">'+(i+1)+'</li>';
                }
            }else {
                if(result==1){
                    $Other+='<li class="Com_Nav r_OptionWrong">'+(i+1)+'</li>';
                }else if(result==0){
                    $Other+='<li class="Com_Nav r_OptionRight">'+(i+1)+'</li>';
                }else {
                    $Other+='<li class="Com_Nav r_OptionNo">'+(i+1)+'</li>';
                }
            }
        }
    }
    $('#r_OptionList0').html($Select)
    $('#r_OptionList1').html($Select)
};
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
            window.location.href='preview.html?LookWrong='+true+'&id='+Request.id+'&index='+index;
        }else {
            window.location.href='preview.html?LookWrong='+false+'&id='+Request.id+'&index='+index;
        }
    })
};
