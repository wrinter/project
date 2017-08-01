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
        $('#Mask').fadeIn(150);
    });
    $('#Cancel').on('click',function(){
        $('#Mask').fadeOut(150);
    });
    $('#GoCerten').on('click',function(){
        window.location.href='mustdo_vis.html?subjectId='+Request.subjectId+'&uuid='+Request.uuid;
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
//获取题目数据
GetBrushList();
function GetBrushList(){
    var SubData={};
    SubData.subjectId=Request.subjectId;
    SubData.materialId=Request.VismaterialId;
    SubData.uuid=Request.uuid;
    SubData.knowledgeId=Request.knowledgeId;
    SubData.isMultiple=Request.isMultiple;
    SubData.questionNum=10;
    SubData.brushLevel=Request.brushLevel;
    $.ajax({
        "type": "post",
        "url": "/api/student/appStudent/brush/studentMustBrushList",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatTest(AllData);
                CreatUserInfo(AllData);
            }
        }
    });
};
//创建题目
function CreatTest(data){
    if(data.questionList!=null){
        CreatHtml(0,data);//默认展示第一题
        DoQuestion(data);
        UserUsed();
    }

};
//用户做题
var TotalQuestion=[];
var Index= 1;//默认下一道
//用户开始做题
function DoQuestion(data){
    var questionList=data.questionList;//题目集合
    if(questionList!=null){
        var EndQuestion=questionList.length;
    }else {
        var EndQuestion=0;
    }

    $('#Question .UserAnswer').off('click')
    $('#Question .UserAnswer').on('click',function(){
        $(this).css('color','#49b9df');
        $(this).siblings('.UserAnswer').css('color','');
        var SubData={};
        if(Index>EndQuestion-1){
            Index=EndQuestion;
            var questionListId=$('#Question').attr('data-questionListId');
            if(!$('#Question').hasClass('HasGet')){
                clearInterval(UserUsedTime)
                SubData.questionId=$(this).attr('data-questionId');
                SubData.userAnswer =$(this).attr('data-Answer');
                TotalQuestion.push(SubData);
                store.set('TotalQuestion',TotalQuestion);
                store.set('questionListId',questionListId);
                window.location.href='mustdo_Pkinfo.html?questionListId='+questionListId+'&uuid='+Request.uuid+'&brushLevel='+Request.brushLevel+'&knowledgeId='+Request.knowledgeId+'&isMultiple='+Request.isMultiple+'&subjectId='+Request.subjectId+'&VismaterialId='+Request.VismaterialId;
                $('#Question').addClass('HasGet');
                Pro(Index,EndQuestion);
                ComputerDo(Index,EndQuestion);
                $('#QuestionBox').css('display','none');
                $('#ResultBox').fadeIn(150);
            }
        }else {
            CreatHtml(Index,data);
            Pro(Index,EndQuestion);
            ComputerDo(Index,EndQuestion);
            SubData.questionId=$(this).attr('data-questionId');
            SubData.userAnswer =$(this).attr('data-Answer');
            TotalQuestion.push(SubData);
            Index++;
        }
    })
};
//用户计时
var UserUsedTime=null;
var StartTime=0;

function UserUsed(){
    if(UserUsedTime){clearInterval(UserUsedTime)}
    UserUsedTime=setInterval(function(){
        StartTime++;
        $('#m_UserTime').html(ToComTime(StartTime));
        store.set('UserUsedTime',(StartTime));
    },1000)
}
//创建题目
function CreatHtml(i,data){
    var questionList=data.questionList;//题目集合
    var EndQuestion=questionList.length;
    $('#Question').html('');
    var Question=questionList[i];
    var $A=Question.optionA;
    var $B=Question.optionB;
    var $C=Question.optionC;
    var $D=Question.optionD;
    var questionId=Question.questionId;
    if(Question.questionTitle!=null){
        var  content=Question.questionTitle.replace(/\】/g,'');
        content=content.replace(/题干/g,'');
        content=content.replace(/\【/g,'');
        content=content.replace(/\【题干】/g,'');
        content=content.replace(/【题/g,'');
        content=content.replace(/干】/g,'');
    }else {
        var  content=Question.questionTitle;
    }
    var $QuestionHtml='';
    $QuestionHtml+='<span class="mu_QuNum">'+(i+1)+'.</span>'+content;//题干
    $QuestionHtml+='<div data-questionId="'+questionId+'" data-Answer="A" class="UserAnswer">'+$A+'</div>';
    $QuestionHtml+='<div data-questionId="'+questionId+'" data-Answer="B" class="UserAnswer">'+$B+'</div>';
    $QuestionHtml+='<div data-questionId="'+questionId+'" data-Answer="C" class="UserAnswer">'+$C+'</div>';
    $QuestionHtml+='<div data-questionId="'+questionId+'" data-Answer="D" class="UserAnswer">'+$D+'</div>';
    $('#Question').html($QuestionHtml).attr('data-questionListId',data.questionListId);
    GetComCss();
    DoQuestion(data);
};
//创建用户信息
function CreatUserInfo(data){
    var UserPhoto=data.studentInfoSo.headImg;//用户头像
    console.log(UserPhoto)
    if(UserPhoto!=null&&UserPhoto!=''){
        $('#UserImg0').attr('src',UserPhoto);
    }else {
        $('#UserImg0').attr('src','../../static/image/common/user.png');
    }
    var EndQuestion=data.questionList.length;//题目个数
    $('.m_WinTotal').html(EndQuestion);
    $('#m_UserName').html(data.studentInfoSo.userName);
    var pkLevel=Request.brushLevel;//电脑等级
    if(pkLevel==50||pkLevel=='50'){
        $('#Computer').html("学弱")
    }
    else if(pkLevel==70||pkLevel=='70'){
        $('#Computer').html("学霸")
    }else {
        $('#Computer').html("学神");
    }
};
//用户进度
function Pro(i,allnum){
    $('#UserWinNum0').html(i);
    $('#UserPro0').animate({'width':(i/allnum)*100+'%'});
};
//机器人做题
var ComPuterNum=1;
var Timer=null;
function ComputerDo(nownum,allnum){
    for(var i=0;i<nownum-ComPuterNum;i++){
        if(Timer){clearTimeout(Timer);}
        Timer=setTimeout(function(){
            if(ComPuterNum>allnum-1){
                ComPuterNum=allnum;
            }
            ComputerDo(nownum,allnum);
            $('#UserWinNum1').html(ComPuterNum);
            $('#m_PkPro1').animate({'width':(ComPuterNum/allnum)*100+'%'});
            ComPuterNum++;
        },3000);
    }
};

