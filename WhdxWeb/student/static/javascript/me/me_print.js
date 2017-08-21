/********************************************个人中心打印By徐扬**********************************************/
CheckBrower();
//用户操作
UserOpration();
function UserOpration(){
    $('#m_PrintName').html('错题本-'+decodeURI(decodeURI(encodeURI(Request.Material))));
}
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
//获取题目
GetAnalysisQue();
function GetAnalysisQue(){
    var SubData={};
    var arr=store.get('PrintList');
    var SubStr='';
    for(var i=0;i<arr.length;i++){
        SubStr+=arr[i]+',';
    }
    SubData.unitIds=SubStr.substr(0, SubStr.length-1);
    SubData.subjectId=Request.subjectId;
    SubData.materialId=Request.materialId;
    $.ajax({
        "type": "post",
        "url": "/web/student/center/getAllWrongQuestionList",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreateWrongQue(AllData);
                intMathJax();
            }
        }
    });
};
//创建试题
function CreateWrongQue(data){
    var $QuestionHtml='';
    for(var i=0;i<data.length;i++){
        $QuestionHtml+='<li>';
        $QuestionHtml+='<p class="m_UnitName">'+data[i].unitName+'</p>';
        $QuestionHtml+='<ul class="m_PrintQue" id="m_PrintQue">';
        if(data[i].questionGroupList.length>0){
            for (var j=0;j<data[i].questionGroupList.length;j++){
                var QuestionCon=data[i].questionGroupList[j];
                //组合题
                if(QuestionCon.groupCode!=null){

                    $QuestionHtml+= GroupQue(QuestionCon,j);
                }
                else {

                    $QuestionHtml+=NormalQue(QuestionCon,j);
                }
            }
        }
        else {
            $QuestionHtml+='<li>';
            $QuestionHtml+='暂无试题';
            $QuestionHtml+='</li>';
        }
        $QuestionHtml+='</ul>';
        $QuestionHtml+='</li>';
    }
    $('#m_PrintCon').html($QuestionHtml)
    GetComCss();//获取公共样式
};
//正常题型
var $AnalysisQue='';
//创建试题
function NormalQue(data,Order){
    data=data.questions[0]
    $AnalysisQue='';
    var IsType=data.questionTypeId;
    var $A,$B,$C,$D='';
    if(data.optionA!=null){ $A=data.optionA; }else { $A='';}
    if(data.optionB!=null){ $B=data.optionB;}else { $B='';}
    if(data.optionC!=null){ $C=data.optionC;}else { $C='';}
    if(data.optionD!=null){ $D=data.optionD;}else { $D='';}
    $AnalysisQue+='<li>';
    //客观题
    var IsSelect=(IsType==01||IsType==05||IsType==09||IsType==10||IsType==12||IsType==13||IsType==26||IsType==30);
    var content=data.questionTitle.replace(/\】/g,"");
    content=content.replace(/题干/g,(Order+1)+"、");
    content=content.replace(/题<\/span><span>干/g,(Order+1)+"、");
    content=content.replace("【","");
    $AnalysisQue+=content;//题干
    if(IsSelect){
        $AnalysisQue+=IsOptionShow($A,$B,$C,$D);
    }
    for(var i=0;i<data.labels.length;i++){
        //答案
        if(data.labels[i].questionType=='03'||data.labels[i].questionType==03){
            var answer=data.labels[i].content.replace(/\】/g,'');
            answer=answer.replace(/答案/g,'');
            answer=answer.replace(/\【/g,'');
            answer=answer.replace(/\【答案】/g,'');
            $AnalysisQue+='<div class="m_Answer heightnum">';
            $AnalysisQue+='<span class="m_Color">【答案】</span>';
            $AnalysisQue+=answer;
            $AnalysisQue+='</div>';
        }
        //解析
        if(data.labels[i].questionType=='05'||data.labels[i].questionType==05){
            var Analysis=data.labels[i].content.replace(/\】/g,'');
            Analysis=Analysis.replace(/解析/g,'');
            Analysis=Analysis.replace(/\【/g,'');
            Analysis=Analysis.replace(/\【解析】/g,'');
            $AnalysisQue+='<div class="m_Analysis heightnum">';
            $AnalysisQue+='<span class="m_Color">【解析】</span>';
            $AnalysisQue+=Analysis;
            $AnalysisQue+='</div>';
        }
    }
    $AnalysisQue+='</li>';
    return $AnalysisQue;
};
//组合题
function GroupQue(obj,Order){
    $AnalysisQue='';
    var  Que=obj.questions;
    var Content=obj.content;//材料题目
    if(Que==null){return false;}
    $AnalysisQue+='<li>';
    $AnalysisQue+='<ul>';
    $AnalysisQue+='<li>'+Content+'</li>';
    for(var j=0;j<Que.length;j++){
        $AnalysisQue+='<li>';
        var  data=Que[j];
        var IsType=data.questionTypeId;
        var $A,$B,$C,$D='';
        if(data.optionA!=null){ $A=data.optionA; }else { $A='';}
        if(data.optionB!=null){ $B=data.optionB;}else { $B='';}
        if(data.optionC!=null){ $C=data.optionC;}else { $C='';}
        if(data.optionD!=null){ $D=data.optionD;}else { $D='';}
        //客观题
        var IsSelect=(IsType==01||IsType==05||IsType==09||IsType==10||IsType==12||IsType==13||IsType==26||IsType==30||IsType==34);
        var content=data.questionTitle.replace(/\】/g,'');
        content=content.replace(/题干/g,(Order+1)+"、");
        content=content.replace(/题<\/span><span>干/g,(Order+1)+"、");
        content=content.replace("【","");
        $AnalysisQue+=content;//题干
        if(IsSelect){
            $AnalysisQue+=IsOptionShow($A,$B,$C,$D);;
        }
        $AnalysisQue+='</li>';
    }
    $AnalysisQue+='<li>';
    for(var i=0;i<obj.labels.length;i++){
        //答案
        if(obj.labels[i].questionType=='03'||obj.labels[i].questionType==03){
            var answer=obj.labels[i].content.replace(/\】/g,'');
            answer=answer.replace(/答案/g,'');
            answer=answer.replace(/\【/g,'');
            answer=answer.replace(/\【答案】/g,'');
            $AnalysisQue+='<div class="m_Answer heightnum">';
            $AnalysisQue+='<span class="m_Color">【答案】</span>';
            $AnalysisQue+=answer;
            $AnalysisQue+='</div>';
        }
        //解析
        if(obj.labels[i].questionType=='05'||obj.labels[i].questionType==05){
            var Analysis=obj.labels[i].content.replace(/\】/g,'');
            Analysis=Analysis.replace(/解析/g,'');
            Analysis=Analysis.replace(/\【/g,'');
            Analysis=Analysis.replace(/\【解析】/g,'');
            $AnalysisQue+='<div class="m_Analysis heightnum">';
            $AnalysisQue+='<span class="m_Color">【解析】</span>';
            $AnalysisQue+=Analysis;
            $AnalysisQue+='</div>';
        }
    }
    $AnalysisQue+='</li>';
    $AnalysisQue+='</ul>';
    $AnalysisQue+='</li>';
    return $AnalysisQue;
};
//选项分布
function IsOptionShow(A,B,C,D){
    var Option='';
    if(A.indexOf('oneline')!=-1){
        Option=A+B+C+D;
    }else if(A.indexOf('twoline')!=-1){
        B=B+'</br>';
        Option=A+B+C+D;
    }else {
        Option=A+B+C+D;
    }
    return Option;
};
//打印
$(document).ready(function(){
    $("#m_PrintBtn").on('click',function(){
        $('#m_printDiv').append('<div style="text-align:center;">'+$('#m_PrintName').html()+'</div>');
        $('#m_printDiv').append($('#m_PrintCon').html());
        $("#m_printDiv").jqprint({
            debug: false,
            importCSS: true,
            printContainer: true,
            operaSupport: false
        });
    });
});



