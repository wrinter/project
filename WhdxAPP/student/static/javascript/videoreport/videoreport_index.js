/********************************************By徐扬**********************************************/
GetUserPkInfo();
function GetUserPkInfo(){
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
                CreatQuestion(AllData.baseInfo.questionList)
                CreatRequireTxt(AllData.resPaperUser)
            }
        }
    });
};
function CreatQuestion(data){
    var $Html='';
    for(var i=0;i<data.length;i++){
        $Html+='<li>';
        $Html+='<div class="v_Question">';
        var list=data[i].list;
        var paperUserAnswer=data[i].paperUserAnswer;
        //题干
        for(var j=0;j<list.length;j++){
            if(list[j].questionType=='01'||list[j].questionType==01){
                $Html+=Content(list[j].content,i);
            }
        };
        //选项
        var IsType=data[i].questionType;
        var IsSelect=(IsType==01||IsType==05||IsType==09||IsType==10||IsType==12||IsType==13||IsType==26||IsType==30||IsType==34);
        if(IsSelect){
            $Html+=IsOptionShow(data[i]);
        }
        $Html+='</div>';
        $Html+='<div class="v_QuestionAnlysis">';
        $Html+=Answer(list);
        $Html+='</div>';
        $Html+='</li>';
    }
    $('#v_BaseMain').html($Html);
    GetComCss()
};
//题干
function Content(data,i){
    var content=data.replace(/\】/g,"");
    content=content.replace(/题干/g,(i+1)+"、");
    content=content.replace("【","");
    var pat=/(<span>[0-9]{2}\.<\/span>)|(<span>[0-9]{1}\.<\/span>)/g;
    content=content.replace(pat,"");
    return content;
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
    $A='<div class="w100">'+$A+'</div>';
    $B='<div class="w100">'+$B+'</div>';
    $C='<div class="w100">'+$C+'</div>';
    $D='<div class="w100">'+$D+'</div>';
    Option=$A+$B+$C+$D;
    return Option;
};
//创建答案解析
function Answer(data){
    var $AnalysisQue='';
    for(var k=0;k<data.length;k++){
        //答案
        if(data[k].questionType=='03'||data[k].questionType==03){
            var answer=data[k].content.replace(/\】/g,'<span class="IsNewName">【答案】</span>');
            var answer=data[k].content.replace(/答案/g,'<span class="IsNewName">【答案】</span>');
            var answer=data[k].content.replace(/\【/g,'<span class="IsNewName">【答案】</span> ');
            var answer=data[k].content.replace(/\【答案】/g,'<span class="IsNewName">【答案】</span>');
            $AnalysisQue+='<div class="fc33 Is100">'+answer+'</div>';
        }
        //解析
        if(data[k].questionType=='05'||data[k].questionType==05){
            var Analysis=data[k].content.replace(/\】/g,'<span class="IsNewName">【解析】</span>');
            var Analysis=data[k].content.replace(/解析/g,'<span class="IsNewName">【解析】</span>');
            var Analysis=data[k].content.replace(/\【/g,'<span class="IsNewName">【解析】</span> ');
            var Analysis=data[k].content.replace(/\【解析】/g,'<span class="IsNewName">【解析】</span>');
            $AnalysisQue+='<div class="fc33 Is100">'+Analysis+'</div>';
        }
    };
    return  $AnalysisQue;
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
//创建教师要求
function CreatRequireTxt(data){
    var requireMent=data.requireMent;
    if(requireMent==null||requireMent==''){
        requireMent='暂无';
        $('#r_Require').css('display','none')
    }
    else {
        $('#r_Require').css('display','')
        $('#r_RequireTxt').html(requireMent);
        RequireOp()
    }
}
function RequireOp(){
    $('#r_Require').on('click',function(){
        if($(this).hasClass('Has')){
            $('#r_RequireBox').animate({right:'-10rem'},300)
            $(this).attr('src','../../static/image/common/require.png').removeClass('Has');
        }else {
            $('#r_RequireBox').animate({right:'1rem'},500)
            $(this).attr('src','../../static/image/common/kolaico.png').addClass('Has');
        }
    })
};
$('#v_PreBtn').on('click',function(){
    window.location.href='../../model/preview/pre_index.html?id='+Request.id;
});



