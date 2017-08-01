/********************************************徐扬******************************************************/
/********************************************作业报告******************************************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
SystemRedMsg();
$('#w_StudentPro').hover(function(){
    $('#w_UnDoneMain').stop(true).fadeIn(100);
},function(){

})
$('#w_UnDoneMain').hover(function(){

},function(){
    $('#w_UnDoneMain').stop(true).fadeOut(100);
})
//视频预习详情
function GetVideoReport(){
    var SubData={};
    SubData.paperAssignId=Request.paperAssignId;
    $.ajax({
        "type": "post",
        "url": "/web/teacher/paper/report/videoReport",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                GetUnDoneStudent(AllData);
                RefactorData(AllData);
                intMathJax();
            }
        }
    });
};
GetVideoReport();
//未完成人数名单
function GetUnDoneStudent(data){
    $('#w_VideoName').html(data.title);
    var IsUnDoneNUm='';
    IsUnDoneNUm+='<span class="fcCA" id="">'+data.deliverTotal+'</span>';
    IsUnDoneNUm+='<span>/</span>';
    IsUnDoneNUm+='<span id="">'+data.arrangementTotal+'</span>';
    $('#w_ReportNum').html(IsUnDoneNUm);
    var $UnDoneHTml='';
    if(data.notDoneNameList==null){

    }
    else {
        var Pro=parseInt(data.deliverTotal)/parseInt(data.arrangementTotal)*100+'%';
        $('#w_SProgress').css('width',Pro)
        if(parseInt(data.deliverTotal)==parseInt(data.arrangementTotal)){
            $('#w_UnDoneTitle').html('全部提交')
        }else {
            $('#w_UnDoneTitle').html('未完成')
        }
        for(var i=0;i<data.notDoneNameList.length;i++){
            $UnDoneHTml+='<li>'+data.notDoneNameList[i]+'</li>';
        }
        $('#w_UnDoneList').html($UnDoneHTml);
    }

};
//重构基础导学数据层
function RefactorData(data){
    var $BasicKnowledge='';
    var BasicData=data.basicKnowledge.questionList;//基础导学数据层
    var Correct=data.correctProportion;//正确率
    $BasicKnowledge=CreatBasic(BasicData,Correct);
    $('#w_VideoBasic').html($BasicKnowledge,Correct);//创建基础知识
    var PreviewData=data.previewTest.questionList;//题目详情
    var $PreviewHtml=CreatPreview(PreviewData,Correct);
    $('#w_PreviewTest').html($PreviewHtml);
    GetComCss()
}
//创建基础导学
function CreatBasic(data,Correct){
    var $BasicKnowledge='';
    if(data==null){return false;}
    else {
        for(var i=0;i<data.length;i++){
            $BasicKnowledge+='<li data-id="'+data[i].id+'">';
            $BasicKnowledge+=Content(data[i].list,i);
            var IsType=data[i].selectable;
            var IsSelect=(IsType==1||IsType=='1');
            if(IsSelect){
                $BasicKnowledge+= Option(data[i],i);
            }
            $BasicKnowledge+=ErroRata(Correct,data[i])
            $BasicKnowledge+='</li>';
        }
    }
    return $BasicKnowledge;
}
//普通题干
function Content(data,i){
    for(var j=0;j<data.length;j++){
        if(data[j].questionType=='01'||data[j].questionType==01){
            var content=data[j].content.replace(/\】/g,"");
            content=content.replace(/题干/g,"");
            content=content.replace(/题<\/span><span>干/g,"");
            content=content.replace("【","");
            content='<div class="r_OpNomalColor">'+content+'</div>'
        }
    }
    return content;
};
//选项正确与否排列方式
function Option(data,i){
    var $PaperHtml='';
    <!--选项-->
    if(data.optionA!=null){var $A=data.optionA;}else {var $A='';}
    if(data.optionB!=null){var $B=data.optionB;}else {var $B='';}
    if(data.optionC!=null){var $C=data.optionC;}else {var $C='';}
    if(data.optionD!=null){var $D=data.optionD;}else {var $D='';}
    $PaperHtml+='<div class="w_Option">' ;
    if(data.answer=='A'||data.answer=='a'){
        $A='<div class="w_OptionbBox"><i class="w_sprite w_Yesico w_BasicYes"></i>'+$A+'</div>';
    }else {
        $A='<div class="w_OptionbBox">'+$A+'</div>';
    }
    if(data.answer=='B'||data.answer=='b'){
        $B='<div class="w_OptionbBox"><i class="w_sprite w_Yesico w_BasicYes"></i>'+$B+'</div>';
    }else {
        $B='<div class="w_OptionbBox">'+$B+'</div>';
    }
    if(data.answer=='C'||data.answer=='c'){
        $C='<div class="w_OptionbBox"><i class="w_sprite w_Yesico w_BasicYes"></i>'+$C+'</div>';
    }else {
        $C='<div class="w_OptionbBox">'+$C+'</div>';
    }
    if(data.answer=='D'||data.answer=='d'){
        $D='<div class="w_OptionbBox"><i class="w_sprite w_Yesico w_BasicYes"></i>'+$D+'</div>';
    }else {
        $D='<div class="w_OptionbBox">'+$D+'</div>';
    }
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
    $PaperHtml+='<div class="option">';
    $PaperHtml+=Option;
    $PaperHtml+='</div>';
    return $PaperHtml;
};
//解析
function CreatAnlysis(data,errorRate){
    var $PreviewTest='';
    if(errorRate.length!=undefined){
        $PreviewTest+='<div title="错误率" class="ErrorRate">【错误率】 '+errorRate[data.id]+'</div>';
    }
    else {
        $PreviewTest+='<div title="错误率" class="ErrorRate">【错误率】暂无</div>';
    }
    for(var j=0;j<data.list.length;j++){
        if(data.list[j].questionType=='05'||data.list[j].questionType==05){
            $PreviewTest+='<div title="解析" class="ErrorRate">'+data.list[j].content+'</div>';
        }
    }
    return $PreviewTest;
}
//创建错误率
function ErroRata(Correct,data){
    var $BasicKnowledge='';
    if(Correct!=null){
        if(Correct.length!=undefined){
            var correctstr=Correct[data.id].split('/');
            var correct0=correctstr[0];
            var correct1=correctstr[1];
            $BasicKnowledge+='<div class="w_correctProportion"><span class="fc65">'+correct0+'</span>/<span>'+correct1+'</span></div>';
        }
    }
    return $BasicKnowledge;
};
//创建题目详情
function CreatPreview(data,Correct){
    var $BasicKnowledge='';
    if(data==null){return false;}
    else {
        for(var i=0;i<data.length;i++){
            $BasicKnowledge+='<li data-id="'+data[i].id+'">';
            $BasicKnowledge+=Content(data[i].list,i);
            var IsType=data[i].selectable;
            var IsSelect=(IsType==1||IsType=='1');
            if(IsSelect){
                $BasicKnowledge+= Option(data[i],i);
            }
            $BasicKnowledge+=CreatAnlysis(data[i],Correct);

            $BasicKnowledge+='</li>';
        }
    }
    return $BasicKnowledge;
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