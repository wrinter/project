/********************************************个人中心错题分析By徐扬**********************************************/
//获取头部导航
GetHtml("../../model/common/Head.txt","#Com_Head");

CheckBrower();
//用户操作
UserOpration();
function UserOpration(){
    var GoWrongUrl='me_wrong.html?subjectId='+Request.subjectid;
    $('#GoWrong').attr('href',GoWrongUrl)



    //空白区域下拉上去
    document.addEventListener('click',function(e){
        if(e.target.className.indexOf("m_SelectBox")==-1){
            $(".m_SelectList").slideUp(150);
        }
        if(e.target.className.indexOf("m_Intro")==-1){
            $('#m_SaveBtn').fadeOut(150);
        }
    });
    //出现下拉
    $('.m_SelectBox').on('click',function(e){
        stopBubble(e);
        $(this).find('.m_SelectList').slideToggle(150);
    });
    $('#m_Intro').on('click',function(){
        $('#m_SaveBtn').fadeIn(150)
    });
    $('#m_Edit').on('click',function(){
        $('#m_Editico').css('color','#ccc')
        $('#m_Editxt').css('color','#999');
        $('#m_Intro').attr('disabled',false);
    });
    $('#m_SaveBtn').on('click',function(){
        SaveAnalysis();
    });
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
//获取题目
GetAnalysisQue();
function GetAnalysisQue(){
    var SubData={};
    SubData.questionId=Request.questionId;
    SubData.materialId=Request.materialId;
    SubData.groupCode = Request.groupCode;
    $.ajax({
        "type": "post",
        "url": "/web/student/center/getWrongQuestion",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatAnalysisQue(AllData)
            }
        }
    });
};
//创建试题
var $AnalysisQue='';
//正常题型
function NormalQue(data){
    data=data[0].questions[0]
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
    var content=data.questionTitle.replace(/\】/g,'');
    content=content.replace(/题干/g,'');
    content=content.replace(/\【/g,'');
    content=content.replace(/\【题干】/g,'');
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
};
//组合题
function GroupQue(obj){
    $AnalysisQue='';
    var  Que=obj[0].questions;
    if(Que==null){return false;}
    var Content=obj[0].content;//材料题目
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
        content=content.replace(/题干/g,'');
        content=content.replace(/\【/g,'');
        content=content.replace(/\【题干】/g,'');
        $AnalysisQue+=content;//题干
        if(IsSelect){
            $AnalysisQue+=IsOptionShow($A,$B,$C,$D);;
        }
        //if(!data.wrongQuestion){
        //    $AnalysisQue+='<img src="../../static/image/common/w_Yesico.png" alt="" class="m_Wflag">'
        //}else {
        //    $AnalysisQue+='<img src="../../static/image/common/w_noico.png" alt="" class="m_Wflag">'
        //}
        $AnalysisQue+='</li>';
    }
    $AnalysisQue+='<li>';
    for(var i=0;i<obj[0].labels.length;i++){
        //答案
        if(obj[0].labels[i].questionType=='03'||obj[0].labels[i].questionType==03){
            var answer=obj[0].labels[i].content.replace(/\】/g,'');
            answer=answer.replace(/答案/g,'');
            answer=answer.replace(/\【/g,'');
            answer=answer.replace(/\【答案】/g,'');
            $AnalysisQue+='<div class="m_Answer heightnum">';
            $AnalysisQue+='<span class="m_Color">【答案】</span>';
            $AnalysisQue+=answer;
            $AnalysisQue+='</div>';
        }
        //解析
        if(obj[0].labels[i].questionType=='05'||obj[0].labels[i].questionType==05){
            var Analysis=obj[0].labels[i].content.replace(/\】/g,'');
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
};
function CreatAnalysisQue(data){
    //组合题
    if(data[0].groupCode!=''&&data[0].groupCode!=null){
        GroupQue(data)
    }else{
        NormalQue(data)
    }
    $('#m_AnalyzeQue').html($AnalysisQue);
    GetComCss();
};
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
}
//获取编辑状态
GetAnalysisStatus()
function GetAnalysisStatus(){
    var SubData={};
    SubData.questionId=Request.questionId;
    SubData.groupCode=Request.groupCode;
    SubData.isSplite=Request.isSplite;
    $.ajax({
        "type": "post",
        "url": "/web/student/center/getAnalysisStatus",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatAnalysis(AllData)
            }
        }
    });
};
//创建分析
function CreatAnalysis(data){
    //没有编辑
    if(data.enter=='1'||data.enter==1){
        $('#m_Edit').css('display','none');
        $('#m_Intro').attr('disabled',false);
        $('#m_Intro').on('click',function(e){
            stopBubble(e);
            $('#m_SaveBtn').fadeIn(150);
        })
    }else {
        $('#m_Edit').css('display','block');
        $('#m_Intro').attr('disabled',true);
        if(data.analysis!=null||data.analysis!=''){
            $('#m_Intro').val(data.analysis);
        }
    }
};
//保存分析
function SaveAnalysis(){
    var SubData={};
    SubData.questionId=Request.questionId;
    SubData.groupCode=Request.groupCode;
    SubData.isSplite=Request.isSplite;
    SubData.analysis=$('#m_Intro').val();
    $.ajax({
        "type": "post",
        "url": "/web/student/center/saveAnalysis",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                $('#c_ErrorMsg').html('保存成功').fadeIn(200);  Disappear("#c_ErrorMsg");
                $('#m_SaveBtn').fadeOut(150);
            }else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
};













