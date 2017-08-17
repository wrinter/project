/**
 * Created by Echonessy on 2017/8/11.
 */
/**************************************************题号***********************************************/
GetAjax()
function GetAjax() {
    var SubData = {};
    SubData.paperAssignId = Request.paperAssignId;
    SubData.uuid = Request.uuid;
    SubData.type = Request.type;
    $.ajax({
        type : "post",
        url : "/pad/teacher/paper/report/getQuestionsError",
        dataType : "json",
        data:SubData,
        success : function(data){
            var Code = data.retCode;
            if (Code == '0000') {
                RefactorNumData(data.retData)
            }
        }
    })
}
function RefactorNumData(data) {
    $("#Title").html(data.paperName)
    var QuestionData=data.questionLines;
    var QuestionDataArr=[];//保存全部题目数据的集合
    for(var j=0;j<QuestionData.length;j++){
        var GroupData=QuestionData[j].questionGroup;//小题目集合
        var Obj = {}
        Obj.LineName = QuestionData[j].lineName
        Obj.paperAssignId = Request.paperAssignId;
        Obj.uuid = Request.uuid;
        Obj.type = Request.type;
        for(var i=0;i<GroupData.length;i++){
            var GroupObj = {}
            //正常题型
            if(GroupData[i].groupCode==null){
                var ThisQue = GroupData[i].questions[0]
                GroupObj.correctNum = ThisQue.correctNum
                GroupObj.questionId = ThisQue.questionId
                GroupObj.percent = Number(ThisQue.errorRate.split('%')[0])
                QuestionDataArr.push(GroupObj);
            }
            //组合题
            else {
                for(var n=0;n<GroupData[i].questions.length;n++){
                    var InObj = {}
                    var ThisQue = GroupData[i].questions[n]
                    InObj.correctNum = ThisQue.correctNum
                    InObj.questionId = ThisQue.questionId
                    InObj.percent = Number(ThisQue.errorRate.split('%')[0])
                    QuestionDataArr.push(InObj);
                }
            }
        }
    }
    CreatNumberList(QuestionDataArr)
}
// 创建学生列表
function CreatNumberList(data) {
    var Html = '';
    var Size = 0;
    for(var i=0;i<data.length;i++){
        if(Request.questionId == data[i].questionId){
            Html += '<li class="FC30" data-questionId="'+data[i].questionId+'">第'+data[i].correctNum+'题</li>';
        } else {
            Html += '<li data-questionId="'+data[i].questionId+'">第'+data[i].correctNum+'题</li>';
        }
    }
    $('#UserList').html(Html);
    var ThisEle = $('#UserList li')
    var HtSize = Number($('html').css('font-size').split('px')[0])
    for(var i=0;i<ThisEle.length;i++) {
        // 注 这里0.127指代li的margin
        Size += (ThisEle.eq(i).width()+0.127*HtSize*2)
    }
    $('#UserList').css({'width':Size/HtSize+'rem'});
    ChangeNum()
}
// 题目切换
function ChangeNum() {
    $('#UserList li').on('click',function () {
        $(this).removeClass().addClass('FC30').siblings().removeClass();
        var ThisId = $(this).attr('data-questionId');
        var ToTop = $('#'+ThisId).offset().top-$('#Paper').offset().top
        $('body,html').animate({ scrollTop: ToTop }, 500)
    })
}
// 默认展示
function DefultNum() {
    var ThisId = $('#UserList li').eq(parseInt(Request.index-1)).attr('data-questionId');
    var ToTop = $('#'+ThisId).offset().top-$('#Paper').offset().top
    $('body,html').scrollTop(ToTop)
}
/**************************************************题目***********************************************/
GetPaper()
// 获取用户试卷
function GetPaper() {
    var SubData = {};
    SubData.paperAssignId = Request.paperAssignId;
    SubData.type = Request.type;
    $.ajax({
        type : "post",
        url : "/pad/teacher/paper/report/titleDetails",
        dataType : "json",
        data:SubData,
        success : function(data){
            var Code = data.retCode;
            if (Code == '0000') {
                GetPaperData(data.retData)
            }
        }
    })
}
// 获取数据
function GetPaperData(data) {
    var ThisAnswer = data.answer;
    var ThisAnswersFileIds = data.answersFileIds;
    var ThisUserMarks = data.paperUserMarks;
    var ThisPaper = data.paper;
    var ThisQue = data.paper.questionLines;
    $('#Title').html(ThisPaper.paperName)
    RefactorData(data)
    intMathJax();//公式
}
//重构数据层
function RefactorData(data){
    var QuestionData=data.paper.questionLines;
    var Static=data.answerStatistics;
    var QuestionDataArr=[];//保存全部题目数据的集合
    var $Html='';
    for(var j=0;j<QuestionData.length;j++){
        var GroupData=QuestionData[j].questionGroup;//小题目集合
        for(var i=0;i<GroupData.length;i++){
            //正常题型
            if(GroupData[i].groupCode==null){
                QuestionDataArr.push(GroupData[i].questions[0]);
            }
            //组合题
            else {
                QuestionDataArr.push(GroupData[i]);
            }
        }
    }
    CreatPaperHtml(QuestionDataArr,Static,data);
}
//创建HTML
function CreatPaperHtml(data,Static,AllData){
    var $Html='';
    for(var i=0;i<data.length;i++){
        if(data[i].groupCode==null){
            $Html+= CreatNomal(data[i],i,AllData);
        }
        else {
            //不可拆分
            if(data[i].isSplite==0||data[i].isSplite=='0'){
                $Html+= GroupNoSplite(data[i],i,AllData);
            }else {
                for(var n=0;n<data[i].questions.length;n++){
                    var ThisQ = data[i].questions[n]
                    $Html+= CreatGroupSplite(ThisQ,i+n,AllData);
                }
            }
        }
    }
    $('#Paper').html($Html);
    GetComCss()
    DefultNum()
}
/**************************************************正常题型***********************************************/
function CreatNomal(data,i,AllData){
    var $PaperHtml='';
    var IsType=data.selectable;
    var IsSelect=(IsType==1||IsType=='1');
    if(IsSelect){
        $PaperHtml+='<li id="'+data.questionId+'">';
        $PaperHtml+=Content(data,i,AllData);//客观题题干
        $PaperHtml+=SelectOption(data,i,AllData);
        $PaperHtml+=SelectAnlysis(data,AllData);
        $PaperHtml+='</li>';
    }else {
        $PaperHtml+='<li id="'+data.questionId+'">';
        $PaperHtml+=Content(data,i,AllData);//客观题题干
        $PaperHtml+=SubAnlysis(data,AllData);
        $PaperHtml+='</li>';
    }
    return $PaperHtml;
}
//正常题干
function Content(data,i){
    var $PaperHtml='';
    $PaperHtml+='<div class="NsLine">';
    var content=data.questionTitle.replace(/题干/g,' ');
    content=content.replace(/\】/g,(i+1)+"、");
    content=content.replace(/\【/g," ");
    $PaperHtml +=content
    $PaperHtml+='</div>';
    return $PaperHtml;
};
// 选择题
function SelectOption(data,i,AllData) {
    var Html=''
    Html+='<div class="NsCon">';
    Html+= OptionDetail(data,i,AllData);
    Html+='</div>';
    return Html
}
// 选项部分
function OptionDetail(data) {
    var $PaperHtml='';
    if(data.optionA!=null){var $A=data.optionA;}else {var $A='';}
    if(data.optionB!=null){var $B=data.optionB;}else {var $B='';}
    if(data.optionC!=null){var $C=data.optionC;}else {var $C='';}
    if(data.optionD!=null){var $D=data.optionD;}else {var $D='';}
    var Option=''
    if($A.indexOf('oneline')!=-1){
        $A='<div class="Option W25">'+$A+'</div>'
        $B='<div class="Option W25">'+$B+'</div>'
        $C='<div class="Option W25">'+$C+'</div>'
        $D='<div class="Option W25">'+$D+'</div>'
        Option=$A+$B+$C+$D;
    }else if($A.indexOf('twoline')!=-1){
        $A='<div class="Option W50">'+$A+'</div>'
        $B='<div class="Option W50">'+$B+'</div>'
        $C='<div class="Option W50">'+$C+'</div>'
        $D='<div class="Option W50">'+$D+'</div>'
        Option=$A+$B+$C+$D;
    }else {
        $A='<div class="Option W100">'+$A+'</div>'
        $B='<div class="Option W100">'+$B+'</div>'
        $C='<div class="Option W100">'+$C+'</div>'
        $D='<div class="Option W100">'+$D+'</div>'
        Option=$A+$B+$C+$D;
    }
    $PaperHtml+='<div class="OptionBox">'+Option+'</div>';
    return  $PaperHtml
}
// 客观题分析
function SelectAnlysis(data,AllData) {
    var Html='';
    var ThisAnswer = ''
    Html+='<div class="Analysis">'
    for(var k=0;k<data.labels.length;k++){
        //答案
        ThisAnswer = data.labels[k].content
        ThisAnswer=ThisAnswer.replace(/答案/g,"");
        ThisAnswer=ThisAnswer.replace(/解析/g,"");
        ThisAnswer=ThisAnswer.replace("【","");
        ThisAnswer=ThisAnswer.replace("】","");
        ThisAnswer=ThisAnswer.replace(/答<\/span><span>答/g,"");
        ThisAnswer=ThisAnswer.replace(/解<\/span><span>析/g,"");
        if(data.labels[k].questionType=='03'){
            Html+='<p class="AnComTxt">【正确答案】</p>'
            Html+='<div class="NsAnswer">'+ThisAnswer+'</div>'
        }
        if(data.labels[k].questionType=='05'){
            Html+='<p class="AnComTxt">【文字解析】</p>'
            Html+='<div class="AnalysisTxt">'+ThisAnswer+'</div>'
        }
    }
    Html+=SelectStatic(data,data.questionId,AllData)
    Html+=SelectNeed(data,data.questionId,AllData)
    Html+=SelectWrong(data,data.questionId,AllData)
    Html+='</div>'
    return Html
}
// 主观题分析
function SubAnlysis(data,AllData) {
    var Html='';
    Html+='<div class="Analysis">'
    for(var k=0;k<data.labels.length;k++){
        //答案
        var ThisAnswer = data.labels[k].content
        ThisAnswer=ThisAnswer.replace(/答案/g,"");
        ThisAnswer=ThisAnswer.replace(/写作指导/g,"");
        ThisAnswer=ThisAnswer.replace(/参考范文/g,"");
        ThisAnswer=ThisAnswer.replace(/解析/g,"");
        ThisAnswer=ThisAnswer.replace("【","");
        ThisAnswer=ThisAnswer.replace("】","");
        ThisAnswer=ThisAnswer.replace(/答<\/span><span>答/g,"");
        ThisAnswer=ThisAnswer.replace(/解<\/span><span>析/g,"");
        // 答案
        if(data.labels[k].questionType=='03'){
            Html+='<p class="AnComTxt">【正确答案】</p>'
            Html+='<div class="NsAnswer">'+ThisAnswer+'</div>'
        }
        // 解析
        if(data.labels[k].questionType=='05'){
            Html+='<p class="AnComTxt">【文字解析】</p>'
            Html+='<div class="NsAnswer">'+ThisAnswer+'</div>'
        }
        // 写作指导
        if(data.labels[k].questionType=='17'){
            Html+='<p class="AnComTxt">【写作指导】</p>'
            Html+='<div class="NsAnswer">'+ThisAnswer+'</div>'
        }
        // 参考范文
        if(data.labels[k].questionType=='18'){
            Html+='<p class="AnComTxt">【参考范文】</p>'
            Html+='<div class="NsAnswer">'+ThisAnswer+'</div>'
        }
    }
    Html+=SubStatic(data,data.questionId,AllData)
    Html+=SelectNeed(data,data.questionId,AllData)
    Html+=SelectWrong(data,data.questionId,AllData)
    Html+='</div>'
    // Html+=SelectStatic(data,data.questionId,AllData)
    Html+='</div>'
    return Html
}
// 客观题答题统计
function SelectStatic(data,id,AllData) {
    var Static = AllData.answerStatistics
    var ThisAnswer = data.answer.toUpperCase()
    var Html = ''
    Html+='<p class="AnComTxt">【答题统计】</p>';
    Html+='<div class="NsAnswer">';
    if(Static[id]!=null && Static[id] !='') {
        $.each(Static[id],function (i,obj){
            var StaticAnswer = i.toUpperCase()
            for(var j=0;j<ThisAnswer.length;j++) {
                var UserAnswerSub=ThisAnswer.substr(j,1).toUpperCase();
                if (UserAnswerSub == StaticAnswer) {
                    Html+='<span class="FC30">'+StaticAnswer+'.'+obj+'</span>';
                } else {
                    Html+='<span>'+StaticAnswer+'.'+obj+'</span>';
                }
            }
        });
    } else {
        Html+='<span>暂无</span>';
    }
    Html+='</div>'
    return Html
}
// 主观题答题统计
function SubStatic(data,id,AllData) {
    var Static = AllData.answerStatistics
    var Html = ''
    Html+='<p class="AnComTxt">【答题统计】</p>';
    Html+='<div class="NsAnswer">';
    if(Static[id]!=null && Static[id] !='') {
        for( var obj in Static[id] ) {
            if(Number(obj)==0) {Html+='<span class="FC30">正确'+Static[id][obj]+'</span>';}
        }
        for( var obj in Static[id] ) {
            if(Number(obj)==2) {Html+='<span class="FC39">半对'+Static[id][obj]+'</span>';}
        }
        for( var obj in Static[id] ) {
            if(Number(obj)==1) {Html+='<span class="FCFC">错误'+Static[id][obj]+'</span>';}
        }
    } else {
        Html+='<span>暂无</span>';
    }
    Html+='</div>'
    return Html
}
// 客观题需讲人数
function SelectNeed(data,id,AllData) {
    var Need = AllData.need
    var Html = ''
    Html+='<p class="AnComTxt">【需讲人数】</p>'
    Html+='<div class="NsAnswer">'
    if(Need[id]==''||Need[id]==null) {
        Html+='<span>暂无</span>';
    } else {
        $.each(Need[id],function (i,obj){
            Html+='<span>'+obj+'人</span>';
        });
    }

    Html+='</div>'
    return Html
}
// 客观题做错的人
function SelectWrong(data,id,AllData) {
    var Wrong = AllData.doError;
    var Html = ''
    Html+='<p class="AnComTxt">【做错的人】</p>'
    Html+='<div class="NsAnswer">'
    if(Wrong[id]==''||Wrong[id]==null) {
        Html+='<span>暂无</span>';
    } else {
        $.each(Wrong[id],function (i,obj){
            Html+='<span>'+obj+'</span>';
        });
    }
    Html+='</div>'
    return Html
}
/**************************************************组合体不可拆题型***********************************************/
function GroupNoSplite(data,i,Answer) {
    var $PaperHtml = '';
    $PaperHtml+='<li>';
    $PaperHtml+=GroupContent(data,i);
    $PaperHtml+=GroupNoSingle(data,i,Answer);
    $PaperHtml+=SubAnlysis(data,Answer);
    $PaperHtml+='</li>';
    return $PaperHtml
}
//组合题大题干
function GroupContent(data,i){
    var $PaperHtml='';
    $PaperHtml+='<div class="NsLine">';
    var content=data.content.replace(/材料/g,(i+1)+"、"+'材料');
    content=content.replace("【","");
    content=content.replace("】","");
    content=content.replace(/材<\/span><span>料/g,(i+1)+"、"+'材</span><span>料');
    $PaperHtml+=content;//题干
    $PaperHtml+='</div>';
    return $PaperHtml;
};
//组合题小题干
function GroupSmallContent(data,i){
    var $PaperHtml='';
    $PaperHtml+='<div class="NsLine">';
    var content=data.questionTitle.replace(/题干/g,'');
    content=content.replace("【","");
    content=content.replace("】","");
    content=content.replace(/题<\/span><span>干/g,'');
    $PaperHtml+=content;//题干
    $PaperHtml+='</div>';
    return $PaperHtml;
};
// 组合体不可拆小题列表
function GroupNoSingle(data,i,Answer) {
    var $PaperHtml = '';
    var Que = data.questions;
    $PaperHtml += '<ul class="GroupList">';
    for(var j=0;j<Que.length;j++) {
        var questions=data.questions[j];//提取单个小题
        var IsType=questions.selectable;
        var IsSelect=(IsType==1||IsType=='1');
        if(IsSelect){
            $PaperHtml+='<li id="'+questions.questionId+'">';
            $PaperHtml+=GroupSmallContent(questions,Answer);//客观题题干
            $PaperHtml+=SelectOption(questions,j,Answer);
            $PaperHtml+='</li>';
        }else {
            $PaperHtml+='<li id="'+questions.questionId+'">';
            $PaperHtml+=GroupSmallContent(questions,Answer);//主观题题干
            $PaperHtml+='</li>';
        }
    }
    $PaperHtml += '</ul>';
    return $PaperHtml
};
/**************************************************组合体可拆题型***********************************************/
function CreatGroupSplite(data,i,Answer) {
    var $PaperHtml = '';
    if(data.groupOrder==1||data.groupOrder=='1'){
        $PaperHtml+='<li>'+GroupSpContent(data)+'</li>'
    }
    $PaperHtml+=GroupSingle(data,i,Answer);
    return $PaperHtml;
}
//组合题不可拆单个小题
function GroupSingle(data,i,Answer) {
    var $PaperHtml='';
    var IsType=data.selectable;
    var IsSelect=(IsType==1||IsType=='1');
    if(IsSelect){
        $PaperHtml+='<li id="'+data.questionId+'">';
        $PaperHtml+=Content(data,i,Answer);//客观题题干
        $PaperHtml+=SelectOption(data,i,Answer);
        $PaperHtml+=SelectAnlysis(data,Answer);
        $PaperHtml+='</li>';
    }else {
        $PaperHtml+='<li id="'+data.questionId+'">';
        $PaperHtml+=Content(data,i,Answer);//主观题题干
        $PaperHtml+=SubAnlysis(data);
        $PaperHtml+='</li>';
    }
    return $PaperHtml
}
//组合题可拆大题干
function GroupSpContent(data){
    var $PaperHtml='';
    $PaperHtml+='<div class="NsLine">';
    var content=data.content.replace(/材料/g,""+'材料');
    content=content.replace("【","");
    content=content.replace("】","");
    content=content.replace(/材<\/span><span>料/g,""+'材</span><span>料');
    $PaperHtml +=content
    $PaperHtml+='</div>';
    return $PaperHtml;
};
/**************************************************公共***********************************************/
//获取公共样式
function GetComCss(){
    $.ajax({
        "type": "post",
        "url": "/pad/common/commonStyle",
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