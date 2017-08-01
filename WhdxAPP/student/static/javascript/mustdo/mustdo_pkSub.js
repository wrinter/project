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
    $('#BackUp0').on('click',function(){
        window.location.href='mustdo_Pkinfo.html?questionListId='+Request.questionListId+'&uuid='+Request.uuid+'&brushLevel='+Request.brushLevel+'&knowledgeId='+Request.knowledgeId+'&isMultiple='+Request.isMultiple+'&subjectId='+Request.subjectId+'&VismaterialId='+Request.VismaterialId;
    });
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
                CreateAnswer(AllData);
            }
        }
    });
};
//创建试题解析
function CreateAnswer(data){
    var questionList=data.questionList;//题目集合
    var EndQuestion=questionList.length;
    CreateFrageNum(data);
    var $AllHtml='';
    for(var i=0;i<questionList.length;i++){
        $AllHtml+='<div class="swiper-slide">'
        $AllHtml+='<div class="swiper-Box">'
        $AllHtml+=NomalQuestion(questionList[i],i);
        $AllHtml+='</div>'
        $AllHtml+='</div>'
    }
    $('#QueMain').html($AllHtml);
    SwiperOption()
}
function SwiperOption(){
    var mySwiper = new Swiper('.swiper-container', {
        initialSlide:0,
        preloadImages:false,
        onSlideChangeStart: function(swiper){
            var Index=swiper.activeIndex;
            $('#mu_FrageNum li').eq(Index).find('img').css('display','block');
            $('#mu_FrageNum li').eq(Index).siblings().find('img').css('display','none');
        }
    });
    $('#mu_FrageNum li').off('click');
    $('#mu_FrageNum li').on('click',function(){
        var Index=$(this).find('span').html()-1;
        $(this).find('img').css('display','block');
        $(this).siblings().find('img').css('display','none');
        mySwiper.slideTo(Index, 200, false)
    });
}


//正常题型
function NomalQuestion(data,i){
    var $Question='';
    var $Answer='';
    $Question+= '<div class="m_TestBox0">';//题干
    $Question+= '<div class="m_QuestionBox">';//题干
    $Question+= Content(data,i);//题干
    $Question+=IsOptionShow(data);//选项
    $Question+='</div>';
    $Question+='</div>';
    $Question+='<div class="m_TestBox1">';
    $Question+='<div class="m_QuestionBox" id="Answer">';
    $Question+=Answer(data);
    $Question+='</div>';
    $Question+='</div>';
    return $Question;
};
//题干
function Content(data,i){
    if (data.questionTitle==null||data.questionTitle==''){return "暂无题干"}
    else {
        var content=data.questionTitle.replace(/\】/g,"");
        content=content.replace(/题干/g,(i+1)+"、");
        content=content.replace(/题<\/span><span>干/g,(i+1)+"、");
        content=content.replace("【","");
        content='<div class="r_OpNomalColor">'+content+'</div>'
        return content;
    }
};
//创建答案解析
function Answer(data){
    var $AnalysisQue='';
    for(var k=0;k<data.labels.length;k++){
        //答案
        if(data.labels[k].questionType=='03'||data.labels[k].questionType==03){
            var answer=data.labels[k].content.replace(/\】/g,'<div class="IsNewBrush">【答案】</div></br>');
            var answer=data.labels[k].content.replace(/答案/g,'<div class="IsNewBrush">【答案】</div></br>');
            var answer=data.labels[k].content.replace(/\【/g,'<div class="IsNewBrush">【答案】</div></br>');
            var answer=data.labels[k].content.replace(/\【答案】/g,'<div class="IsNewBrush">【答案】</div></br>');
            $AnalysisQue+='<div class="fc33 Is100">'+answer+'</div>';
        }
        //解析
        if(data.labels[k].questionType=='05'||data.labels[k].questionType==05){
            var Analysis=data.labels[k].content.replace(/\】/g,'<p class="IsNewBrush">【解析】</p></br>');
            var Analysis=data.labels[k].content.replace(/解析/g,'<p class="IsNewBrush">【解析】</p></br>');
            var Analysis=data.labels[k].content.replace(/\【/g,'<p class="IsNewBrush">【解析】</p></br> ');
            var Analysis=data.labels[k].content.replace(/\【解析】/g,'<p class="IsNewBrush">【解析】</p></br>');
            $AnalysisQue+='<div class="fc33 Is100">'+Analysis+'</div>';


        }
    };
    return  $AnalysisQue;
};
//选项正确与否排列方式
function IsOptionShow(data){
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
    $A='<div class="w100">'+$A+'</div>';
    $B='<div class="w100">'+$B+'</div>';
    $C='<div class="w100">'+$C+'</div>';
    $D='<div class="w100">'+$D+'</div>';
    Option=$A+$B+$C+$D;
    return Option;
};



////创建题目
//function CreatAnswerHtml(i,data){
//    var questionList=data.questionList;//题目集合
//    var EndQuestion=questionList.length;
//    $('#m_ReQuestion').html('');
//    var Question=questionList[i];
//    var $A=Question.optionA;
//    var $B=Question.optionB;
//    var $C=Question.optionC;
//    var $D=Question.optionD;
//    var questionId=Question.questionId;
//    if(Question.questionTitle!=null){
//        var  content=Question.questionTitle.replace(/\】/g,'');
//        content=content.replace(/题干/g,'');
//        content=content.replace(/\【/g,'');
//        content=content.replace(/\【题干】/g,'');
//        content=content.replace(/【题/g,'');
//        content=content.replace(/干】/g,'');
//    }else {
//        var  content=Question.questionTitle;
//    }
//    var $QuestionHtml='';
//    $QuestionHtml+='<span class="mu_QuNum">'+(i+1)+'.</span>'+content;//题干
//    $QuestionHtml+='<div data-questionId="'+questionId+'" data-Answer="A" class="QueAnswer">'+$A+'</div>';
//    $QuestionHtml+='<div data-questionId="'+questionId+'" data-Answer="B" class="QueAnswer">'+$B+'</div>';
//    $QuestionHtml+='<div data-questionId="'+questionId+'" data-Answer="C" class="QueAnswer">'+$C+'</div>';
//    $QuestionHtml+='<div data-questionId="'+questionId+'" data-Answer="D" class="QueAnswer">'+$D+'</div>';
//    var $Resolver='';
//    for(var i=0;i<Question.labels.length;i++){
//        //答案
//        if(Question.labels[i].questionType=='03'||Question.labels[i].questionType==03){
//            var answer=Question.labels[i].content.replace(/\】/g,'');
//            answer=answer.replace(/答案/g,'');
//            answer=answer.replace(/\【/g,'');
//            answer=answer.replace(/\【答案】/g,'');
//            $Resolver+='<div class="mu_AnswerLine">';
//            $Resolver+='<span class="mu_AnswerTitle">【答案】</span>';
//            $Resolver+=answer;
//            $Resolver+='</div>';
//        }
//        //解析
//        if(Question.labels[i].questionType=='05'||Question.labels[i].questionType==05){
//            var Analysis=Question.labels[i].content.replace(/\】/g,'');
//            Analysis=Analysis.replace(/解析/g,'');
//            Analysis=Analysis.replace(/\【/g,'');
//            Analysis=Analysis.replace(/\【解析】/g,'');
//            $Resolver+='<div class="mu_AnswerLine">';
//            $Resolver+='<span class="mu_AnswerTitle">【解析】</span>';
//            $Resolver+=Analysis;
//            $Resolver+='</div>';
//        }
//    }
//    $('#Question').html($QuestionHtml).attr('data-questionListId',data.questionListId);
//    $('#Answer').html($Resolver).attr('data-questionListId',data.questionListId);
//    GetComCss();
//};





//创建题目序列
function CreateFrageNum(data){
    var $FrageNum='';
    var questionList=data.questionList;//题目集合
    var EndQuestion=questionList.length;
    for(var i=0;i<questionList.length;i++){
        if(questionList[i].paperUserAnswer.result==0||questionList[i].paperUserAnswer.result=='0'){
            $FrageNum+='<li class="m_RightNum"><img src="../../static/image/mustdo/downico.png" alt=""><span>'+(i+1)+'</span></li>';
        }else {
            $FrageNum+='<li class="m_WrongNum"><img src="../../static/image/mustdo/downico.png" alt=""><span>'+(i+1)+'</span></li>';
        }
    }
    $('#mu_FrageNum').html($FrageNum);
    $('#mu_FrageNum li').eq(0).find('img').css('display','block');
    AnswerTab(data);
};
//错题操作
function AnswerTab(data){

    $('#mu_FrageNum li').on('click',function(){
        var Index=$(this).find('span').html()-1;
        $(this).find('img').css('display','block');
        $(this).siblings().find('img').css('display','none');
        //CreatAnswerHtml(Index,data);
    });
};






