/********************************************必刷题首页By徐扬**********************************************/
//获取题目
GetAllQuestion();
function GetAllQuestion(){
    var SubData={};
    SubData.id=Request.id;
    SubData.uuid=Request.uuid;
    $.ajax({
        "type": "post",
        "url": "/api/student/homework/report/getUserPaperReport",
        "dataType":"json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatInOrder(AllData.previewInfo.questionList);
                CreatQuestion(AllData.previewInfo.questionList);
            }
        }
    });
};
//创建题号
function CreatInOrder(data){
    var $Com_NavList='';
    for(var i=0;i<data.length;i++){
        var result=data[i].paperUserAnswer.result;
        if(result==1){
            $Com_NavList+='<li class="Com_Nav r_OptionWrong"  id="'+i+'" data-index="'+i+'">'+(i+1)+'</li>';
        }else if(result==0){
            $Com_NavList+='<li class="Com_Nav r_OptionRight" id="'+i+'" data-index="'+i+'">'+(i+1)+'</li>';
        }else {
            $Com_NavList+='<li class="Com_Nav r_OptionNo" id="'+i+'" data-index="'+i+'">'+(i+1)+'</li>';
        }
    }
    $Com_NavList+='<li class="Com_NavLine"><img src="../../static/image/report/d.png" alt=""></li>';
    $('#Com_NavList').html($Com_NavList);
    IsLookWrong();
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
//题目操作
function Opration(){
    var LookWrong=Request.LookWrong;
    if(LookWrong=='true'){
        $('#Com_NavMain').css('width',(($('#Com_NavList .r_OptionWrong').size()+$('#Com_NavList .r_OptionHalf').size()))*2+'rem');
    }else {
        $('#Com_NavMain').css('width',($('#Com_NavList li').size()-1)*2+'rem');
    }
    var IsDefultIndex=parseInt($('#'+Request.index).index());
    var mySwiper = new Swiper('.swiper-container',{
        initialSlide:IsDefultIndex,
        preloadImages:false,
        onSlideChangeStart: function(swiper){
            var IsHasRight=$('.Com_Nav').eq(swiper.activeIndex).hasClass('r_OptionRight')
            var IsHasWrong=$('.Com_Nav').eq(swiper.activeIndex).hasClass('r_OptionWrong')
            var IsChange=$('.Com_Nav').eq(swiper.activeIndex);
            $('.Com_Nav').css('border','1px solid #ccc');
            if(IsHasRight){
                IsChange.css('border','1px solid #65B113');
            }else if(IsHasWrong){
                IsChange.css('border','1px solid #CA0D0D');
            }else {

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
        $('.Com_Nav').css('border','1px solid #ccc');
        var IsHasRight=$(this).hasClass('r_OptionRight')
        var IsHasWrong=$(this).hasClass('r_OptionWrong')
        var IsChange=$(this);
        $('.Com_Nav').css('border','1px solid #ccc')
        if(IsHasRight){
            IsChange.css('border','1px solid #65B113')
        }else if(IsHasWrong){
            IsChange.css('border','1px solid #CA0D0D')
        }else {

        }
        var DownLeft=$(this).position().left;
        $('.Com_NavLine').animate({"left":DownLeft},300);
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
        $('#Com_Box').animate({'scrollLeft':ScroolLeft+"px"},300);
        var Index=$(this).index();
        mySwiper.slideTo(Index, 200, false)
    });
};
//创建题目
function CreatQuestion(data){
    var $AllHtml='';
    for(var i=0;i<data.length;i++){
        $AllHtml+='<div class="swiper-slide" data-result="'+data[i].paperUserAnswer.result+'">'
        $AllHtml+='<div class="swiper-Box">'
        if(data[i].groupCode==null){
            $AllHtml+= NomalQuestion(data[i],i);
        }
        $AllHtml+='</div>'
        $AllHtml+='</div>'
    }
    $('#r_Main').html($AllHtml);
    IsLookWrong();
    Opration();
    NeedOpration();
};
//正常题型
function NomalQuestion(data,i){
    var $Question='';
    var $Answer='';
    $Question+= '<div class="r_Question">';//题干
    $Question+= Content(data,i);//题干
    if(data.selectableType==1||data.selectableType=='1'){
        $Question+=IsOptionShow(data);//选项
    }
    $Question+='</div>';
    $Question+='<div class="r_Question r_Answer">'+Answer(data)+'</div>';
    return $Question;
};
//题干
function Content(data,order){
    for(var i=0;i<data.list.length;i++){
        var questionType=data.list[i].questionType;
        if(questionType==01||questionType=='01'){
            if (data.list[i].content==null||data.list[i].content==''){return "暂无题干"}
            else {
                var content=data.list[i].content.replace(/\】/g,"");
                content=content.replace(/题干/g,(order+1)+"、");
                content=content.replace(/题<\/span><span>干/g,(order+1)+"、");
                content=content.replace("【","");
                content='<div class="r_OpNomalColor">'+content+'</div>'
                return content;
            }

        }
    }
};
//创建答案解析
function Answer(data){
    var $AnalysisQue='';
    for(var k=0;k<data.list.length;k++){
        //答案
        if(data.list[k].questionType=='03'||data.list[k].questionType==03){
            var answer=data.list[k].content.replace(/\】/g,'<div class="IsNewName">【答案】</div>');
            var answer=data.list[k].content.replace(/答案/g,'<div class="IsNewName">【答案】</div>');
            var answer=data.list[k].content.replace(/\【/g,'<div class="IsNewName">【答案】</div> ');
            var answer=data.list[k].content.replace(/\【答案】/g,'<div class="IsNewName">【答案】</div>');
            $AnalysisQue+='<div class="fc33 Is100">'+answer+'</div>';
        }
        //解析
        if(data.list[k].questionType=='05'||data.list[k].questionType==05){
            var Analysis=data.list[k].content.replace(/\】/g,'<p class="IsNewName">【解析】</p>');
            var Analysis=data.list[k].content.replace(/解析/g,'<p class="IsNewName2">【解析】</p>');
            var Analysis=data.list[k].content.replace(/\【/g,'<p class="IsNewName">【解析】</p> ');
            var Analysis=data.list[k].content.replace(/\【解析】/g,'<p class="IsNewName">【解析】</p>');
            $AnalysisQue+='<div class="fc33 Is100">'+Analysis+'</div>';

        }
    };
    if(data.groupCode==null){
        if(data.paperUserAnswer.needExplain){
            $AnalysisQue+='<div class="r_Need"><div class="r_HasNeedBtn"  data-questionId="'+data.paperUserAnswer.questionId+'"><i class="Echo i_needIco">&#xe648;&nbsp;</i>已提问</div></div>';
        }else {
            $AnalysisQue+='<div class="r_Need"><div class="r_NeedBtn"  data-questionId="'+data.paperUserAnswer.questionId+'"><i class="Echo i_needIco">&#xe648;&nbsp;</i>需要讲</div></div>';
        }
    }
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
                $A='<span class="r_OpRightColor">'+data.optionA+'</span>' ;
            }else {
                $A='<span class="r_OpWrongColor">'+data.optionA+'</span>' ;
            }
        }
    }else {var $A='';}
    if(data.optionB!=null){
        var $B=data.optionB;
        if(paperUserAnswer=='B'||paperUserAnswer=='b'){
            if(answer==paperUserAnswer){
                $B='<span class="r_OpRightColor">'+data.optionB+'</span>' ;
            }else {
                $B='<span class="r_OpWrongColor">'+data.optionB+'</span>' ;
            }
        }
    }else {var $B='';}
    if(data.optionC!=null){
        var $C=data.optionC;
        if(paperUserAnswer=='C'||paperUserAnswer=='c'){
            if(answer==paperUserAnswer){
                $C='<span class="r_OpRightColor">'+data.optionC+'</span>' ;
            }else {
                $C='<span class="r_OpWrongColor">'+data.optionC+'</span>' ;
            }
        }
    }else {var $C='';}
    if(data.optionD!=null){
        var $D=data.optionD;
        if(paperUserAnswer=='D'||paperUserAnswer=='d'){
            if(answer==paperUserAnswer){
                $D='<span class="r_OpRightColor">'+data.optionD+'</span>' ;
            }else {
                $D='<span class="r_OpWrongColor">'+data.optionD+'</span>' ;
            }
        }
    }else {var $D='';}
    var Option='';
    if($A.indexOf('oneline')!=-1){
        Option=$A+$B+$C+$D;
    }else if($A.indexOf('twoline')!=-1){
        $B=$B+'</br>';
        Option=$A+$B+$C+$D;
    }else {
        $A='<div>'+$A+'</div>';
        $B='<div>'+$B+'</div>';
        $C='<div>'+$C+'</div>';
        $D='<div>'+$D+'</div>';
        Option=$A+$B+$C+$D;
    }
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


