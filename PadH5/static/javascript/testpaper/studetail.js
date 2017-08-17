/**
 * Created by Echonessy on 2017/8/11.
 */
// 获取数据
GetAjax()
function GetAjax() {
    var SubData = {};
    SubData.paperAssignId = Request.paperAssignId;
    $.ajax({
        type : "post",
        url : "/pad/teacher/paper/report/getCompleteUserList",
        dataType : "json",
        data:SubData,
        success : function(data){
            var Code = data.retCode;
            if (Code == '0000') {
                CreatStudentList(data.retData)
            }
        }
    })
}
// 创建学生列表
function CreatStudentList(data) {
    var Html = '';
    var Size = 0;
    for(var i=0;i<data.length;i++){
        if(Request.userId == data[i].userId){
            Html += '<li class="FC30" data-userId="'+data[i].userId+'">'+data[i].userName+'</li>';
        } else {
            Html += '<li data-userId="'+data[i].userId+'">'+data[i].userName+'</li>';
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
    ChangeUser()
}
GetPaper(Request.userId)
// 获取用户试卷
function GetPaper(userId) {
    var SubData = {};
    SubData.paperAssignId = Request.paperAssignId;
    SubData.uuid = Request.uuid;
    SubData.type = Request.type;
    SubData.userId = userId;
    $.ajax({
        type : "post",
        url : "/pad/teacher/paper/report/getUserPaper",
        dataType : "json",
        data:SubData,
        success : function(data){
            var Code = data.retCode;
            if (Code == '0000') {
                console.log(data.retData)
                GetPaperData(data.retData)
            }
        }
    })
}
// 用户列表切换
function ChangeUser() {
    $('#UserList li').on('click',function () {
        $(this).removeClass().addClass('FC30').siblings().removeClass();
        GetPaper($(this).attr('data-userId'))
    })
}
// 获取数据
function GetPaperData(data) {
    var ThisAnswer = data.answer;
    var ThisAnswersFileIds = data.answersFileIds;
    var ThisUserMarks = data.paperUserMarks;
    var ThisPaper = data.paer;
    var ThisQue = data.paer.questionLines;
    $('#Title').html(ThisPaper.paperName)
    RefactorData(data)
    intMathJax();//公式
}
//重构数据层
function RefactorData(data){
    var QuestionData=data.paer.questionLines;
    var Answer=data.answer;
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
    CreatPaperHtml(QuestionDataArr,Answer,data);
}
//创建HTML
function CreatPaperHtml(data,Answer,AllData){
    var $Html='';
    for(var i=0;i<data.length;i++){
        if(data[i].groupCode==null){
            $Html+= CreatNomal(data[i],i,Answer);
        }
        else {
            //不可拆分
            if(data[i].isSplite==0||data[i].isSplite=='0'){
                $Html+= GroupNoSplite(data[i],i,Answer);
            }else {
                for(var n=0;n<data[i].questions.length;n++){
                    var ThisQ = data[i].questions[n]
                    $Html+= CreatGroupSplite(ThisQ,i+n,Answer);
                }
            }
        }
    }
    CreateUserPaper(AllData)
    CreatMarks(AllData.totalRemarks)
    $('#Paper').html($Html);
    GetComCss()
}
/**************************************************正常题型***********************************************/
function CreatNomal(data,i,Answer){
    var $PaperHtml='';
    var IsType=data.selectable;
    var IsSelect=(IsType==1||IsType=='1');
    if(IsSelect){
        $PaperHtml+='<li>';
        $PaperHtml+=Content(data,i,Answer);//客观题题干
        $PaperHtml+=SelectOption(data,i,Answer);
        $PaperHtml+=SelectAnlysis(data);
        $PaperHtml+='</li>';
    }else {
        $PaperHtml+='<li>';
        $PaperHtml+=Content(data,i,Answer);//客观题题干
        $PaperHtml+=SubAnlysis(data,Answer);
        $PaperHtml+='</li>';
    }
    return $PaperHtml;
}
//正常题干
function Content(data,i,Answer){
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
function SelectOption(data,i,Answer) {
    var Html=''
    Html+='<div class="NsCon">';
    Html+= OptionDetail(data,i,Answer);
    Html+= SelectResult(data,i,Answer);
    Html+='</div>';
    return Html
}
// 选项部分
function OptionDetail(data,i,Answer) {
    var $PaperHtml='';
    var Statis=Answer[data.questionId];
    if(data.optionA!=null){var $A=data.optionA;}else {var $A='';}
    if(data.optionB!=null){var $B=data.optionB;}else {var $B='';}
    if(data.optionC!=null){var $C=data.optionC;}else {var $C='';}
    if(data.optionD!=null){var $D=data.optionD;}else {var $D='';}
    //学生答案是否对错
    var UserAnswerSub='';
    if(typeof(Statis)!='undefined'){
        if(Statis.userAnswer!=null){
            var UserAnswer=Statis.userAnswer.toString().toLowerCase();
            var ThisResult = parseInt(Statis.result) //0：正确 1：错误
            for(var t=0;t<UserAnswer.length;t++){
                UserAnswerSub=UserAnswer.substr(t,1).toLowerCase();
                if(UserAnswerSub=="a"){
                    if(ThisResult == 0) {
                        $A='<div class="FC30 ComLine">'+$A+'</div>';
                    } else {
                        $A='<div class="FCFC ComLine">'+$A+'</div>';
                    }
                }
                if(UserAnswerSub=="b"){
                    if(ThisResult == 0) {
                        $B='<div class="FC30 ComLine">'+$B+'</div>';
                    } else {
                        $B='<div class="FCFC ComLine">'+$B+'</div>';
                    }
                }
                if(UserAnswerSub=="c"){
                    if(ThisResult == 0) {
                        $C='<div class="FC30 ComLine">'+$C+'</div>';
                    } else {
                        $C='<div class="FCFC ComLine">'+$C+'</div>';
                    }
                }
                if(UserAnswerSub=="d"){
                    if(ThisResult == 0) {
                        $D='<div class="FC30 ComLine">'+$D+'</div>';
                    } else {
                        $D='<div class="FCFC ComLine">'+$D+'</div>';
                    }
                }
            }
        }
    }
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
// 选择题争取与否
function SelectResult(data,i,Answer) {
    var Html = '';
    Html+='<div class="NsRes">'
    var Statis=Answer[data.questionId];
    if(typeof(Statis)!='undefined'){
        if(Statis.userAnswer!=null){
            var ThisResult = parseInt(Statis.result) //0：正确 1：错误
            if(ThisResult==0){
                Html+='<img src="/static/images/common/a.png" alt="">'
            } else {
                Html+='<img src="/static/images/common/b.png" alt="">'
            }
        }
    }
    Html+='</div>'
    return Html
}
// 客观题分析
function SelectAnlysis(data) {
    var Html='';
    Html+='<div class="Analysis">'
    for(var k=0;k<data.labels.length;k++){
        //答案
        var ThisAnswer = data.labels[k].content
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
    Html+='</div>'
    Html+='</div>'
    return Html
}
// 主观题分析
function SubAnlysis(data,Answer) {
    var Statis=Answer[data.questionId];
    var Html='';
    Html+='<div class="Analysis">'
    if(typeof(Statis)!='undefined'){
        Html+='<p class="AnComTxt">【学生答案】</p>'
        Html+='<div class="AnResult">'
        var ThisResult = parseInt(Statis.result) //0：正确 1：错误
        if(ThisResult==0){
            Html+='<img src="/static/images/common/a.png" alt="">'
        } else if(ThisResult==2){
            Html+='<img src="/static/images/common/c.png" alt="">'
        } else {
            Html+='<img src="/static/images/common/b.png" alt="">'
        }
        Html+='</div>'
    }
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
    Html+='</div>'
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
    console.log(Que)
    $PaperHtml += '<ul class="GroupList">';
    for(var j=0;j<Que.length;j++) {
        var questions=data.questions[j];//提取单个小题
        var IsType=questions.selectable;
        var IsSelect=(IsType==1||IsType=='1');
        if(IsSelect){
            $PaperHtml+='<li>';
            $PaperHtml+=GroupSmallContent(questions,Answer);//客观题题干
            $PaperHtml+=SelectOption(questions,j,Answer);
            $PaperHtml+='</li>';
        }else {
            $PaperHtml+='<li>';
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
        $PaperHtml+='<li>';
        $PaperHtml+=Content(data,i,Answer);//客观题题干
        $PaperHtml+=SelectOption(data,i,Answer);
        $PaperHtml+=SelectAnlysis(data);
        $PaperHtml+='</li>';
    }else {
        $PaperHtml+='<li>';
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
/**************************************************答案批注***********************************************/
// 创建用户上传答案数据
function CreateUserPaper(data) {
    var UAnswer = data.answersFileIds;
    var Marks = data.paperUserMarks;
    var UserPic=[]
    if(UAnswer!=null){
        for(var i=0;i<UAnswer.length;i++) {
            for(var j=0;j<Marks.length;j++) {
                var Obj = {};
                if(UAnswer[i].fileId===Marks[j].fileId) {
                    Obj.Id = UAnswer[i].fileId
                    Obj.UserPic = UAnswer[i].url
                    Obj.TeaMarks = Marks[j].image
                    UserPic.push(Obj)
                }
            }
        }
    }
    UserPaper(UserPic)
}
// 创建用户上传答案图片
function UserPaper(data) {
    var $PaperHtml='';
    if(data.length==0) {
        $PaperHtml+='<li>暂无上传答案</li>';
    }
    else {
        for(var i=0;i<data.length;i++) {
            $PaperHtml+='<li>';
            if(data[i].UserPic!=null&&data[i].UserPic!=''){
                $PaperHtml+='<img src="'+data[i].UserPic+'" alt="">';
            } else {
                $PaperHtml+='暂无上传答案';
            }
            if(data[i].TeaMarks!=null&&data[i].TeaMarks!=''){
                $PaperHtml+='<img src="'+data[i].TeaMarks+'" alt="">';
            }
            $PaperHtml+='</li>';
        }
    }
    $('#PicBox').html($PaperHtml)
}
// 创建老师批注
function CreatMarks(data) {
    if(data==''||data==null) {
        $('#TeacherMark').html('暂无批注')
    } else {
        $('#TeacherMark').html(data)
    }
}
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