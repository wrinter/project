/********************************************必刷题首页By徐扬**********************************************/
//获取头部导航
GetHtml("../../model/common/Head.txt","#Com_Head");
CheckBrower();
GetComCss();
//用户操作
UserOpration();
function UserOpration(){
    window.onload=function () {
        var ToIndexUrl='../../../student/model/mustdo/mustdo_index.html';
        var ToSubUrl='../../../student/model/mustdo/must_DoGraph.html?subjectId='+Request.subjectId+'&subjectname='+Request.subjectName;
        var SubjectName=decodeURI(decodeURI(encodeURI(Request.subjectName)));
        var visName=decodeURI(decodeURI(encodeURI(Request.visName)));
        var SubTit='<i class="ArrowsFont Com_NextIco">&#xe603;</i><a href="'+ToSubUrl+'">'+SubjectName+'</a>';
        var NowTit='<i class="ArrowsFont Com_NextIco">&#xe603;</i><span class="fl fc49">'+visName+'</span>';
        $('#HtmlTit').html(SubTit+NowTit);
        var MainH=$(window).height()-120;
        if(MainH<600){
            MainH=600;
        }
        $('#mu_Main').height(MainH);
        $('#mu_Lous').height($('#mu_Main').height());
        for(var i=0;i<$('#mu_SubMain>li').length;i++){
            $('#mu_SubMain>li').eq(i).height($('#mu_SubMain>li').eq(i).width());
        }
    }
    $(window).resize(function(){
        var MainH=$(window).height()-120;
        if(MainH<600){
            MainH=600;
        }
        $('#mu_Main').height(MainH);
        $('#mu_Lous').height($('#mu_Main').height());
        for(var i=0;i<$('#mu_SubMain>li').length;i++){
            $('#mu_SubMain>li').eq(i).height($('#mu_SubMain>li').eq(i).width());
        }
    });
    $('#IsClose,#NoQuit').on('click',function(){
        $('#IsQuitMain').fadeOut(150);
    });
    $('#Close').on('click',function(){
        $('#IsQuitMain').fadeIn(150);
    });
    $('#IsQuit').on('click',function(){
        window.location.href='must_DoGraph.html?subjectId='+Request.subjectId+'&subjectname='+Request.subjectName;
    });
};
//获取题目数据
GetBrushList();
function GetBrushList(){
    var SubData={};
    SubData.subjectId=Request.subjectId;
    SubData.materialId=Request.VismaterialId;
    SubData.knowledgeId=Request.knowledgeId;
    SubData.isMultiple=Request.isMultiple;
    SubData.questionNum=10;
    SubData.brushLevel=Request.brushLevel;
    $.ajax({
        "type": "post",
        "url": "/web/student/brush/studentMustBrushList",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatTest(AllData);
                CreatUserInfo(AllData);
                GoldAnimate(data.retGold);
                intMathJax();
            }
        }
    });
};
//创建题目
function CreatTest(data){
    CreatHtml(0,data);//默认展示第一题
    DoQuestion(data);
};
//用户做题
var TotalQuestion=[];
var Index= 1;//默认下一道
//用户开始做题
function DoQuestion(data){
    var questionList=data.questionList;//题目集合
    var EndQuestion=questionList.length;
    $('#Question .UserAnswer').off('click');
    $('#Question .UserAnswer').on('click',function(){
        $(this).css('color','#49b9df');
        $(this).siblings('.UserAnswer').css('color','');
        var SubData={};
        if(Index>EndQuestion-1){
            Index=EndQuestion;
            var questionListId=$('#Question').attr('data-questionListId');
            if(!$('#Question').hasClass('HasGet')){
                SubData.questionId=$(this).attr('data-questionId');
                SubData.userAnswer =$(this).attr('data-Answer');
                TotalQuestion.push(SubData);
                GetUserAnswer(questionListId,TotalQuestion);
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
    DoQuestion(data);
	intMathJax();
};
//创建用户信息
function CreatUserInfo(data){
    var UserPhoto=data.studentInfoSo.headImg;//用户头像
    if(UserPhoto!=null&&UserPhoto!=''){
        $('#UserImg0').attr('src',UserPhoto);
    }else {
        $('#UserImg0').attr('src','../../static/image/common/user.png');
    }
    var EndQuestion=data.questionList.length;//题目个数
    $('.m_WinTotal').html(EndQuestion);
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
var ComputerTimer=null;
function ComputerDo(nownum,allnum){
    if(nownum<=ComPuterNum){
        if(ComputerTimer){clearTimeout(ComputerTimer);}
        ComputerTimer=setTimeout(function(){
            $('#UserWinNum1').html(nownum);
            $('#m_PkPro1').animate({'width':(nownum/allnum)*100+'%'});
        },3000);
    }else {
        for(var i=0;i<nownum-ComPuterNum;i++){
            if(ComputerTimer){clearTimeout(ComputerTimer);}
            ComputerTimer=setTimeout(function(){
                if(ComPuterNum>allnum-1){
                    ComPuterNum=allnum;
                }
                $('#UserWinNum1').html(ComPuterNum);
                $('#m_PkPro1').animate({'width':(ComPuterNum/allnum)*100+'%'});
                ComputerDo(nownum,allnum);
                ComPuterNum++;
            },3000);
        }
    }
};
//获取公共样式
function GetComCss(){
    $.ajax({
        "type": "post",
        "url": "/web/common/commonStyle",
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
function GetUserAnswer(questionListId,answerList){
    var SubData={};
    SubData.questionListId=questionListId;
    SubData.answerList=JSON.stringify(answerList);
    $.ajax({
        "type": "post",
        "url": "/web/student/brush/studentMustBrushAnswer",
        "dataType": "json",
        'data': SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                GetPkResult(AllData);
                PkLogbuch(AllData);
                GoldAnimate(data.retGold);
                CreateAnswer(AllData);
            }
        }
    });
};
//转换秒数
function ToTime(value) {
    var theTime = parseInt(value);// 秒
    var theTime1 = 0;// 分
    var result;
    if(theTime > 60) {
        theTime1 = parseInt(theTime/60);
        theTime = parseInt(theTime%60);
    }
    if(parseInt(theTime)>9){
         result = "00:"+parseInt(theTime);//秒
    }else {
         result = "00:0"+parseInt(theTime);//秒
    }
    if(theTime1 > 0) {
        if(parseInt(theTime1)>9){
            if(parseInt(theTime)>9){
                result =parseInt(theTime1)+":"+parseInt(theTime);
            }else {
                result =parseInt(theTime1)+":0"+parseInt(theTime);
            }
        }else {
            if(parseInt(theTime)>9){
                result ="0"+parseInt(theTime1)+":"+parseInt(theTime);
            }else {
                result ="0"+parseInt(theTime1)+":0"+parseInt(theTime);
            }
        }
    }
    return result;
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
    var $mu_ReMsg0='',$mu_ReMsg1='';
    var UserInfo=data.studentInfoSo;
    $mu_ReMsg0='<li>正确率:&nbsp; '+ToRota(data.correctRate,AllQueNum)+'</li><li>用时: &nbsp;'+ToTime(data.usedTime)+'</li><li>金币:&nbsp; '+ToGold(data.gold)+'</li>';
    $('#mu_ReMsg0').html($mu_ReMsg0);
    var ComputerTime=data.usedTime+AllQueNum*3;
    $mu_ReMsg1='<li>正确率:&nbsp; '+ToRota(data.pkLevel,AllQueNum)+'</li><li>用时: &nbsp;'+ToTime(ComputerTime)+'</li><li>金币:&nbsp; '+ToGold(data.pcGold)+'</li>';
    $('#mu_ReMsg1').html($mu_ReMsg1);
}
//机器人与用户输赢战况
function PkLogbuch (data){
    var AllQueNum=data.questionList.length;
    var $mu_ReMsg0='';
    var UserInfo=data.studentInfoSo;
    if(UserInfo.headImg!=null&&UserInfo.headImg!=''){
        var UserWin='<i class="meimg m_pkico1 m_pkresult0"></i><p class="m_PkImg0"><img src="'+UserInfo.headImg+'" alt=""></p>';//用户
        var UserLose='<p class="m_PkImg0"><img src="'+UserInfo.headImg+'" alt=""></p>';//用户
        var UserFlat='<i class="meimg m_pkico0 m_pkresult0"></i><p class="m_PkImg0"><img src="'+UserInfo.headImg+'" alt=""></p>';//用户
    }else {
        var UserWin='<i class="meimg m_pkico1 m_pkresult0"></i><p class="m_PkImg0"><img src="../../static/image/common/user.png" alt=""></p>';//用户
        var UserLose='<p class="m_PkImg0"><img src="../../static/image/common/user.png" alt=""></p>';//用户
        var UserFlat='<i class="meimg m_pkico0 m_pkresult0"></i><p class="m_PkImg0"><img src="../../static/image/common/user.png" alt=""></p>';//用户
    }
    //机器人输赢情况
    var ComputerWin='<i class="meimg m_pkico1 m_pkresult1"></i><p class="m_PkImg0"><img src="../../static/image/common/computer.png" alt=""></p>'
    var ComputerFlat='<i class="meimg m_pkico0 m_pkresult1"></i><p class="m_PkImg0"><img src="../../static/image/common/computer.png" alt=""></p>'
    var ComputerLose='<p class="m_PkImg0"><img src="../../static/image/common/computer.png" alt=""></p>'
    //平局
    if(data.result==0||data.result=='0'){
        $('#m_UserImgBox0').html(UserFlat);
        $('#m_UserImgBox1').html(ComputerFlat);
    }else if(data.result==1||data.result=='1'){
        $('#m_UserImgBox0').html(UserWin);
        $('#m_UserImgBox1').html(ComputerLose);
    }else {
        $('#m_UserImgBox0').html(UserLose);
        $('#m_UserImgBox1').html(ComputerWin);
    }
};
//创建试题解析
function CreateAnswer(data){
    var questionList=data.questionList;//题目集合
    var EndQuestion=questionList.length;
    CreateFrageNum(data);
    CreatAnswerHtml(0,data);//默认展示第一题
}
//创建题目
function CreatAnswerHtml(i,data){
    var questionList=data.questionList;//题目集合
    var EndQuestion=questionList.length;
    $('#m_ReQuestion').html('');
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
    $QuestionHtml+='<span class="mu_QuNum0">'+(i+1)+'.</span>'+content;//题干
    $QuestionHtml+=IsOptionShow(Question)
    for(var i=0;i<Question.labels.length;i++){
        //答案
        if(Question.labels[i].questionType=='03'||Question.labels[i].questionType==03){
            var answer=Question.labels[i].content.replace(/\】/g,'');
            answer=answer.replace(/答案/g,'');
            answer=answer.replace(/\【/g,'');
            answer=answer.replace(/\【答案】/g,'');
            $QuestionHtml+='<div class="mu_AnswerLine">';
            $QuestionHtml+='<span class="mu_AnswerTitle">【答案】</span>';
            $QuestionHtml+=answer;
            $QuestionHtml+='</div>';
        }
        //解析
        if(Question.labels[i].questionType=='05'||Question.labels[i].questionType==05){
            var Analysis=Question.labels[i].content.replace(/\】/g,'');
            Analysis=Analysis.replace(/解析/g,'');
            Analysis=Analysis.replace(/\【/g,'');
            Analysis=Analysis.replace(/\【解析】/g,'');
            $QuestionHtml+='<div class="mu_AnswerLine">';
            $QuestionHtml+='<span class="mu_AnswerTitle">【解析】</span>';
            $QuestionHtml+=Analysis;
            $QuestionHtml+='</div>';
        }
    }
    $('#m_ReQuestion').html($QuestionHtml).attr('data-questionListId',data.questionListId);
	intMathJax();
};
//创建题目序列
function CreateFrageNum(data){
    var $FrageNum='';
    var questionList=data.questionList;//题目集合
    var EndQuestion=questionList.length;
    for(var i=0;i<questionList.length;i++){
        if(questionList[i].paperUserAnswer.result==0||questionList[i].paperUserAnswer.result=='0'){
            $FrageNum+='<li><span class="mu_RightNum">'+(i+1)+'</span></li>';
        }else {
            $FrageNum+='<li><span class="mu_WrongNum">'+(i+1)+'</span></li>';
        }
    }
    $('#mu_FrageNum').html($FrageNum);
    var $First= $('#mu_FrageNum li').eq(0).find('span');
    if($First.hasClass('mu_RightNum')){
        $First.removeClass().addClass('mu_SelectRightNum');
    }else {
        $First.removeClass().addClass('mu_SelectWrongNum');
    }
    AnswerTab(data);
};
//错题操作
function AnswerTab(data){
    $('#mu_FrageNum span').off('click');
    $('#mu_FrageNum span').on('click',function(){
        var Index=$(this).html()-1;
        if($(this).hasClass('mu_RightNum')){
            $(this).removeClass().addClass('mu_SelectRightNum');
        }else if($(this).hasClass('mu_WrongNum')){
            $(this).removeClass().addClass('mu_SelectWrongNum');
        }else {}
        $(this).parents('li').siblings().find('.mu_SelectRightNum').removeClass().addClass('mu_RightNum');
        $(this).parents('li').siblings().find('.mu_SelectWrongNum').removeClass().addClass('mu_WrongNum');
        CreatAnswerHtml(Index,data);
    });
};


//选项正确与否排列方式
function IsOptionShow(data){
	console.log(data)
    var paperUserAnswer=data.paperUserAnswer.userAnswer;//用户答案
    var answer=data.answer;//答案
    if(data.optionA!=null){
        var $A=data.optionA;
        if(paperUserAnswer=='A'||paperUserAnswer=='a'){
            if(answer==paperUserAnswer){
                $A='<div class="r_OpRightColor">'+data.optionA+'</div>' ;
            }else {
                $A='<div class="r_OpWrongColor">'+data.optionA+'</div>' ;
            }
        }
    }else {var $A='';}
    if(data.optionB!=null){
        var $B=data.optionB;
        if(paperUserAnswer=='B'||paperUserAnswer=='b'){
            if(answer==paperUserAnswer){
                $B='<div class="r_OpRightColor">'+data.optionB+'</div>' ;
            }else {
                $B='<div class="r_OpWrongColor">'+data.optionB+'</div>' ;
            }
        }
    }else {var $B='';}
    if(data.optionC!=null){
        var $C=data.optionC;
        if(paperUserAnswer=='C'||paperUserAnswer=='c'){
            if(answer==paperUserAnswer){
                $C='<div class="r_OpRightColor">'+data.optionC+'</div>' ;
            }else {
                $C='<div class="r_OpWrongColor">'+data.optionC+'</div>' ;
            }
        }
    }else {var $C='';}
    if(data.optionD!=null){
        var $D=data.optionD;
        if(paperUserAnswer=='D'||paperUserAnswer=='d'){
            if(answer==paperUserAnswer){
                $D='<div class="r_OpRightColor">'+data.optionD+'</div>' ;
            }else {
                $D='<div class="r_OpWrongColor">'+data.optionD+'</div>' ;
            }
        }
    }else {var $D='';}
    var Option='';
    //if($A.indexOf('oneline')!=-1){
    //    Option=$A+$B+$C+$D;
    //}else if($A.indexOf('twoline')!=-1){
    //    $B=$B+'</br>';
    //    Option=$A+$B+$C+$D;
    //}else {
    //    $A='<div>'+$A+'</div>';
    //    $B='<div>'+$B+'</div>';
    //    $C='<div>'+$C+'</div>';
    //    $D='<div>'+$D+'</div>';
    //    Option=$A+$B+$C+$D;
    //}
	$A='<div>'+$A+'</div>';
	$B='<div>'+$B+'</div>';
	$C='<div>'+$C+'</div>';
	$D='<div>'+$D+'</div>';
	Option=$A+$B+$C+$D;
    return Option;
};










