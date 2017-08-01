/********************************************必刷题首页By徐扬**********************************************/
//获取题目
GetAllQuestion();

function GetAllQuestion(){
    var SubData={};
    SubData.id=Request.id;
    $.ajax({
        "type": "post",
        "url": "/api/student/homework/report/getUserPaperReport",
        "dataType":"json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatSelect(AllData.paper.questionLines);
            }
        }
    });
};
//获取公共样式
GetComCss();
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
//创建题目数组
function CreatSelect(data){
    var SelectArr=[];
    var GroupArr=[];
    for(var i=0;i<data.length;i++){
        var questionGroup=data[i].questionGroup;
        for(var j=0;j<questionGroup.length;j++){
            if(questionGroup[j].isSplite=='1'||questionGroup[j].isSplite=='1'){
                for(var n=0;n<questionGroup[j].questions.length;n++){
                    SelectArr.push(questionGroup[j].questions[n])
                }
            }else {
                SelectArr.push(questionGroup[j])
            }
        }
    }
    CreatInOrder(SelectArr);
    CreatQuestion(SelectArr);
};
//创建题号
function CreatInOrder(data){
    var $Com_NavList='';
    for(var i=0;i<data.length;i++){
        if(data[i].groupCode==null){
            var result=data[i].questions[0].paperUserAnswer.result;
            var lnOrder=data[i].questions[0].lnOrder;
            if(result==1){
                $Com_NavList+='<li class="Com_Nav r_OptionWrong" id="'+i+'"  data-index="'+i+'">'+(i+1)+'</li>';
            }else if(result==0){
                $Com_NavList+='<li class="Com_Nav r_OptionRight" id="'+i+'"  data-index="'+i+'">'+(i+1)+'</li>';
            }else if(result==2){
                $Com_NavList+='<li class="Com_Nav r_OptionHalf" id="'+i+'"  data-index="'+i+'">'+(i+1)+'</li>';
            }else {
                $Com_NavList+='<li class="Com_Nav r_OptionNo" id="'+i+'"  data-index="'+i+'">'+(i+1)+'</li>';
            }
        }
        else {
            //不可拆分
            if(data[i].isSplite==0||data[i].isSplite=='0'){
                var lnOrder= data[i].lnOrder;
                var result=data[i].result;
                if(result==1){
                    $Com_NavList+='<li class="Com_Nav r_OptionWrong" id="'+i+'"  data-index="'+i+'">'+(i+1)+'</li>';
                }else if(result==0){
                    $Com_NavList+='<li class="Com_Nav r_OptionRight" id="'+i+'"  data-index="'+i+'">'+(i+1)+'</li>';
                }else if(result==2){
                    $Com_NavList+='<li class="Com_Nav r_OptionHalf" id="'+i+'"  data-index="'+i+'">'+(i+1)+'</li>';
                }
                else {
                    $Com_NavList+='<li class="Com_Nav r_OptionNo" id="'+i+'"  data-index="'+i+'">'+(i+1)+'</li>';
                }
            }
            else {
                var result=data[i].paperUserAnswer.result;
                var groupOrder=data[i].groupOrder;
                if(result==1){
                    $Com_NavList+='<li class="Com_Nav r_OptionWrong" id="'+i+'"  data-index="'+i+'">'+(i+1)+'</li>';
                }else if(result==0){
                    $Com_NavList+='<li class="Com_Nav r_OptionRight" id="'+i+'"  data-index="'+i+'">'+(i+1)+'</li>';
                }else if(result==2){
                    $Com_NavList+='<li class="Com_Nav r_OptionHalf" id="'+i+'"  data-index="'+i+'">'+(i+1)+'</li>';
                }
                else {
                    $Com_NavList+='<li class="Com_Nav r_OptionNo" id="'+i+'"  data-index="'+i+'">'+(i+1)+'</li>';
                }
            }
        }
    }
    $Com_NavList+='<li class="Com_NavLine"><img src="../../static/image/report/d.png" alt=""></li>';
    $('#Com_NavList').html($Com_NavList);
};
//题目操作
function Opration(){
    var LookWrong=Request.LookWrong;
    if(LookWrong=='true'){
        $('#Com_NavMain').css('width',(($('#Com_NavList .r_OptionWrong').size()+$('#Com_NavList .r_OptionHalf').size()))*2+'rem');
    }else {
        $('#Com_NavMain').css('width',($('#Com_NavList li').size()-1)*2+'rem');
    }
    $('#r_MyAnswerUrl').on('click',function(){
        window.location.href="report_myanswer.html?id="+Request.id;
    });
    var IsDefultIndex=parseInt($('#'+Request.index).index());
    var IsAnswer=$('.swiper-slide').eq(IsDefultIndex).find('.Flag').length
    if(IsAnswer>0){
        $('#Flag').css('display','block')
    }else {
        $('#Flag').css('display','none')
    }
    var mySwiper = new Swiper('.swiper-container',{
        initialSlide:IsDefultIndex,
        preloadImages:false,
        onSlideChangeStart: function(swiper){
            var IsAnswer=$('.swiper-slide').eq(swiper.activeIndex).find('.Flag').length;
            var IsHasRight=$('.Com_Nav').eq(swiper.activeIndex).hasClass('r_OptionRight')
            var IsHasWrong=$('.Com_Nav').eq(swiper.activeIndex).hasClass('r_OptionWrong')
            var r_OptionHalf=$('.Com_Nav').eq(swiper.activeIndex).hasClass('r_OptionHalf')
            var IsChange=$('.Com_Nav').eq(swiper.activeIndex);
            $('.Com_Nav').css('border','1px solid #ccc')
            if(IsHasRight){
                IsChange.css('border','1px solid #65B113')
            }else if(IsHasWrong){
                IsChange.css('border','1px solid #CA0D0D')
            }else if(r_OptionHalf){
                IsChange.css('border','1px solid #F9A24A')
            }else {

            }
            if(IsAnswer>0){
                $('#Flag').css('display','block')
            }else {
                $('#Flag').css('display','none')
            }
            var DownLeft=$('.Com_Nav').eq(swiper.activeIndex).position().left;
            $('.Com_NavLine').animate({"left":DownLeft},300);
            var WinHalf=$(window).width()/2;
            var WinW=$(window).width()/2;
            var NavPosition= parseInt($('.Com_Nav').eq(swiper.activeIndex).position().left);
            var ScroolLeft;
            if (NavPosition <=WinHalf ) {
                ScroolLeft = 0;
            }else {
                ScroolLeft = NavPosition-WinW;
            }
            $('#Com_Box').animate({'scrollLeft':ScroolLeft+"px"},300);
        }
    });
    $('.Com_Nav').off('click');
    $('.Com_Nav').on('click',function(){
        var DownLeft=$(this).position().left;
        $('.Com_NavLine').animate({"left":DownLeft},300);
        $('.Com_Nav').css('border','1px solid #ccc');
        var IsHasRight=$(this).hasClass('r_OptionRight')
        var IsHasWrong=$(this).hasClass('r_OptionWrong')
        var r_OptionHalf=$(this).hasClass('r_OptionHalf')
        var IsChange=$(this);
        $('.Com_Nav').css('border','1px solid #ccc')
        if(IsHasRight){
            IsChange.css('border','1px solid #65B113')
        }else if(IsHasWrong){
            IsChange.css('border','1px solid #CA0D0D')
        }else if(r_OptionHalf){
            IsChange.css('border','1px solid #F9A24A')
        }else {

        }
        var WinHalf=$(window).width()/2;
        var WinW=$(window).width()/2;
        var NavPosition= parseInt($(this).position().left);
        var ScroolLeft;
        if (NavPosition <=WinHalf ) {
            ScroolLeft = 0;
        }
        else {
            ScroolLeft = NavPosition-WinW;
        }
        var Index=$(this).index();
        var IsAnswer=$('.swiper-slide').eq(Index).find('.Flag').length;
        if(IsAnswer>0){
            $('#Flag').css('display','block')
        }else {
            $('#Flag').css('display','none')
        }
        $('#Com_Box').animate({'scrollLeft':ScroolLeft+"px"},300);
        mySwiper.slideTo(Index, 200, false)
    });
};
//创建题目
function CreatQuestion(data){
    var $AllHtml='';
    for(var i=0;i<data.length;i++){
        $AllHtml+='<div class="swiper-slide" data-result="'+data[i].result+'">'
        $AllHtml+='<div class="swiper-Box">'
        if(data[i].groupCode==null){
            $AllHtml+= NomalQuestion(data[i].questions[0],i);
        }
        else {
            //不可拆分
            if(data[i].isSplite==0||data[i].isSplite=='0'){
                $AllHtml+=OtherQuestion(data[i],i);
            }else {
                $AllHtml+=NomalQuestion(data[i],i);
            }
        }
        $AllHtml+='</div>'
        $AllHtml+='</div>'
    }
    $('#r_Main').html($AllHtml);
    Right();
    IsLookWrong();
    Opration();
    NeedOpration();
};
//变色
function Right(){
    //变色
    var r_OpColor = $(".r_OpColor");
    r_OpColor.each(function(){
        var myanswer = $(this).parent(".question").attr("useranswer");
        var data_answer = $(this).parent(".question").attr("answer");
        var userAnswerlength = myanswer.length;
        if(userAnswerlength > 1){
            for(var i = 0 ; i < userAnswerlength ; i++){
                var userAnswerknwon = myanswer[i]
                if($(this).attr("option") === userAnswerknwon){
                    $(this).addClass("addcolor").css({color:"#49b9df"});
                }
            }
        }else{
            if(myanswer === $(this).attr("option")){
                $(this).css({color:"#49b9df"});
            }
        }
    })
}
//正常题型
function NomalQuestion(data,i){
    var userAnswer = data.paperUserAnswer.userAnswer;
    var answer = data.answer;
    var $Question='';
    var $Answer='';
    $Question+= '<div class="r_Question">';//题干
    $Question+= Content(data,i);//题干
    var IsType=data.selectable;
    var IsSelect=(IsType==1||IsType=='1');
    if(IsSelect){
        $Question+='<div class="question"  answer="'+answer+'" userAnswer="'+userAnswer+'" >'+IsOptionShow(data)+'</div>';//选项
    }else {
        $Question+='<div class="Flag"></div>';
    }
    $Question+='</div>';
    $Question+='<div class="r_Question r_Answer">'+Answer(data)+'</div>';
    return $Question;
};
//题干
function Content(data,i){
    if (data.questionTitle==null||data.questionTitle==''){return "暂无题干"}
    else {
        if(data.content == null || data.content == ""){
            questionTitle = ""
        }else{
            var questionTitle = data.content;
        }
        var content=data.questionTitle.replace(/\】/g,"");
        content=content.replace(/题干/g,(i+1)+"、");
        content=content.replace(/题<\/span><span>干/g,(i+1)+"、");
        content=content.replace("【","");
        content='<div class="r_OpNomalColor" >'+content+'</div>';
        return questionTitle+content;
    }
};
//创建答案解析
function Answer(data){
    var $AnalysisQue='';
    for(var k=0;k<data.labels.length;k++){
        //答案
        if(data.labels[k].questionType=='03'||data.labels[k].questionType==03){
            var answer=data.labels[k].content.replace(/\】/g,'<div class="IsNewName">【答案】</div>');
            var answer=data.labels[k].content.replace(/答案/g,'<div class="IsNewName">【答案】</div>');
            var answer=data.labels[k].content.replace(/\【/g,'<div class="IsNewName">【答案】</div> ');
            var answer=data.labels[k].content.replace(/\【答案】/g,'<div class="IsNewName">【答案】</div>');
            $AnalysisQue+='<div class="fc33 Is100">'+answer+'</div>';
        }
        //解析
        if(data.labels[k].questionType=='05'||data.labels[k].questionType==05){
            var Analysis=data.labels[k].content.replace(/\】/g,'<p class="IsNewName">【解析】</p>');
            var Analysis=data.labels[k].content.replace(/解析/g,'<p class="IsNewName">【解析】</p>');
            var Analysis=data.labels[k].content.replace(/\【/g,'<p class="IsNewName">【解析】</p> ');
            var Analysis=data.labels[k].content.replace(/\【解析】/g,'<p class="IsNewName">【解析】</p>');
            $AnalysisQue+='<div class="fc33 Is100">'+Analysis+'</div>';

        }
    };
    if(data.groupCode==null){
        if(data.paperUserAnswer.needExplain){
            $AnalysisQue+='<div class="r_Need"><div class="r_HasNeedBtn"  data-questionId="'+data.questionId+'"><i class="Echo i_needIco">&#xe648;&nbsp;</i>已提问</div></div>';
        }else {
            $AnalysisQue+='<div class="r_Need"><div class="r_NeedBtn"  data-questionId="'+data.questionId+'"><i class="Echo i_needIco">&#xe648;&nbsp;</i>需要讲</div></div>';
        }
    }
    else {
        if(data.needExplain){
            $AnalysisQue+='<div class="r_Need"><div class="r_HasNeedBtn"  data-questionId="'+data.questionId+'"><i class="Echo i_needIco">&#xe648;&nbsp;</i>已提问</div></div>';
        }else {
            $AnalysisQue+='<div class="r_Need"><div class="r_NeedBtn" data-questionId="'+data.questionId+'"><i class="Echo i_needIco">&#xe648;&nbsp;</i>需要讲</div></div>';
        }
    }
    return  $AnalysisQue;
};
//组合题不可拆分
function OtherQuestion(data){
    var $Question='';
    var $Answer='';
    $Question+= '<div class="r_Question">';//题干
    $Question+= OtherContent(data.content);//题干
    var  data0=data.questions;
    for(var i=0;i<data0.length;i++){
        var Dtrue = data0[i];
        var userAnswer = Dtrue.paperUserAnswer.userAnswer;
        var answer = Dtrue.answer;
        var IsType=data0[i].selectable;
        var IsSelect=(IsType==1||IsType=='1');
        if(IsSelect){
            $Question+= GroupContent(data0[i]);//题干
            $Question+='<div class="question"  answer="'+answer+'" userAnswer="'+userAnswer+'" >'+IsOptionShow(data0[i])+'</div>';//选项
        }else {
            $Question+='<div class="Flag"></div>';
        }
    }
    $Question+='</div>';
    $Question+='<div class="r_Question r_Answer">'+Answer(data)+'</div>';
    return $Question;
};
//组合题题干
function OtherContent(data,i){
    if (data==null||data==''){return "暂无题干"}
    else {
        var content=data.replace(/\】/g,"");
        content=content.replace(/题干/g,(i+1)+"、");
        content=content.replace(/题<\/span><span>干/g,(i+1)+"、");
        content=content.replace("【","");
        content='<div class="r_OpNomalColor">'+content+'</div>'
        return content;
    }

};
//材料单个小题题干
function GroupContent(data,i){
    if (data.questionTitle==null||data.questionTitle==''){return "暂无题干"}
    else {
        var content=data.questionTitle.replace(/\】/g,"");
        content=content.replace(/题干/g,"");
        content=content.replace("【","");
        content='<div class="r_OpNomalColor">'+content+'</div>'
        return content;
    }

};
//选项正确与否排列方式
function IsOptionShow(data){
    var paperUserAnswer=data.paperUserAnswer.userAnswer;//用户答案
    var answer=data.answer;//答案
    //if(data.optionA!=null){
    //    var $A=data.optionA;
    //    if(paperUserAnswer=='A'||paperUserAnswer=='a'){
    //        if(answer==paperUserAnswer){
    //            $A='<div class="r_OpRightColor">'+data.optionA+'</div>' ;
    //        }else {
    //            $A='<div class="r_OpWrongColor">'+data.optionA+'</div>' ;
    //        }
    //    }
    //}else {var $A='';}
    //if(data.optionB!=null){
    //    var $B=data.optionB;
    //    if(paperUserAnswer=='B'||paperUserAnswer=='b'){
    //        if(answer==paperUserAnswer){
    //            $B='<div class="r_OpRightColor">'+data.optionB+'</div>' ;
    //        }else {
    //            $B='<div class="r_OpWrongColor">'+data.optionB+'</div>' ;
    //        }
    //    }
    //}else {var $B='';}
    //if(data.optionC!=null){
    //    var $C=data.optionC;
    //    if(paperUserAnswer=='C'||paperUserAnswer=='c'){
    //        if(answer==paperUserAnswer){
    //            $C='<div class="r_OpRightColor">'+data.optionC+'</div>' ;
    //        }else {
    //            $C='<div class="r_OpWrongColor">'+data.optionC+'</div>' ;
    //        }
    //    }
    //}else {var $C='';}
    //if(data.optionD!=null){
    //    var $D=data.optionD;
    //    if(paperUserAnswer=='D'||paperUserAnswer=='d'){
    //        if(answer==paperUserAnswer){
    //            $D='<div class="r_OpRightColor">'+data.optionD+'</div>' ;
    //        }else {
    //            $D='<div class="r_OpWrongColor">'+data.optionD+'</div>' ;
    //        }
    //    }
    //}else {var $D='';}
    for(var M in data){
        if(!data[M]){
            data[M] = "";
        }
    }
    $A='<div class="r_OpColor" option="A">'+data.optionA+'</div>' ;
    $B='<div class="r_OpColor" option="B">'+data.optionB+'</div>' ;
    $C='<div class="r_OpColor" option="C">'+data.optionC+'</div>' ;
    $D='<div class="r_OpColor" option="D">'+data.optionD+'</div>' ;
    var Option='';
    //$A='<div class="w100">'+$A+'</div>';
    //$B='<div class="w100">'+$B+'</div>';
    //$C='<div class="w100">'+$C+'</div>';
    //$D='<div class="w100">'+$D+'</div>';
    Option=$A+$B+$C+$D;
    return Option;
};
//查看错题
function IsLookWrong(){
    var LookWrong=Request.LookWrong;
    if(LookWrong=='true'){
        for(var i=0;i<$('#r_Main .swiper-slide').length;i++){
            var result=$('#r_Main .swiper-slide').eq(i).attr('data-result');
            //去除正确的题目
            if(result==0||result=='0'||result==null||result=='null'){
                $('#r_Main .swiper-slide').eq(i).addClass('IsWrong');
                $('#Com_NavList li').eq(i).addClass('IsWrong');
            }
        }
        $('#r_Main .IsWrong').remove();
        $('#Com_NavList .IsWrong').remove();
        $('#Com_NavList .Com_Nav').css('display','none');
        $('#Com_NavList .r_OptionWrong').css('display','block');
        $('#Com_NavList .r_OptionHalf').css('display','block');
    }else {
        $('#Com_NavList li').css('display','block');
    }
};
//需要讲操作
function NeedOpration(){
    $('.r_NeedBtn').on('click',function(){
        if(!$(this).hasClass('r_HasNeedBtn')){
            var questionId=$(this).attr('data-questionId');
            NeedAjax(questionId);
            $(this).removeClass().addClass('r_HasNeedBtn').html('<i class="Echo i_needIco">&#xe648;&nbsp;</i>已提问');
        }

    });
};
//需要讲
function NeedAjax(questionId){
    var IsSuccess=false;
    var SubData={};
    SubData.id=Request.id;
    SubData.questionId=questionId;
    $.ajax({
        "type": "post",
        "url": "/api/student/homework/report/changeNeedExplain",
        "dataType":"json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){

            }
        }
    });
};
