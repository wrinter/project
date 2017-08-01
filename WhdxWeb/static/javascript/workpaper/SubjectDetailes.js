/********************************************徐扬******************************************************/
/********************************************作业报告******************************************************/
CheckBrower();
$('#title').html(decodeURI(decodeURI(encodeURI(Request.name))));
$('#time').html(ToComTime(Request.time));
SystemRedMsg();
//获取完成学生名单
function GetCompleteUserList(){
    var SubData={};
    SubData.paperAssignId=Request.paperAssignId;
    $.ajax({
        "type": "post",
        "url": "/web/teacher/paper/report/getCompleteUserList",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                CreatUserLIstHtml(AllData)
            }
        }
    });
};
GetCompleteUserList();
var UserId=Request.userid;
var paperAssignId=Request.paperAssignId;
GetUserPaper(paperAssignId,UserId);
//创建学生名单列表
function CreatUserLIstHtml(data){
    var $SubNameList='';
    for(var i=0;i<data.length;i++){
        if(data[i].userId==Request.userid){
            $SubNameList+='<li class="User w_NowUser" data-userId="'+data[i].userId+'" data-paperAssignId="'+data[i].paperAssignId+'">'+data[i].userName+'</li>';
        }
        else {
            $SubNameList+='<li class="User " data-userId="'+data[i].userId+'" data-paperAssignId="'+data[i].paperAssignId+'">'+data[i].userName+'</li>';
        }
    }
    $('#w_SubNameList').html($SubNameList);
    UserListTurn();
    UserChange();
};
//用户切换取试题
function UserChange(){
    $('.User').on('click',function(){
        $(this).addClass('w_NowUser').siblings().removeClass('w_NowUser');
        var paperAssignId=$(this).attr('data-paperAssignId');
        var userId=$(this).attr('data-userId');
        GetUserPaper(paperAssignId,userId);

    })
};
//获取用户试题
function GetUserPaper(paperAssignId,userId){
    var SubData={};
    SubData.paperAssignId=paperAssignId;
    SubData.userId=userId;
    SubData.type=Request.type;
    $.ajax({
        "type": "post",
        "url": "/web/teacher/paper/report/getUserPaper",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                RefactorData(AllData);
                intMathJax();
            }
        }
    });
};
//重构数据层
function RefactorData(data){
    $('#time').html(ToComTime(data.useTime));
    var QuestionData=data.paer.questionLines;
    var Answer=data.answer;
    var QuestionDataArr=[];//保存全部题目数据的集合
    for(var j=0;j<QuestionData.length;j++){
        var GroupData=QuestionData[j].questionGroup;//小题目集合
        for(var i=0;i<GroupData.length;i++){
            //正常题型
            if(GroupData[i].groupCode==null){
                QuestionDataArr.push(GroupData[i].questions[0]);
            }
            //组合题
            else {
                //组合题不可拆分
                if(GroupData[i].isSplite==0||GroupData[i].isSplite=='0'){
                    QuestionDataArr.push(GroupData[i]);
                }
                //组合题可拆分
                else {
                    for(var n=0;n<GroupData[i].questions.length;n++){
                        QuestionDataArr.push(GroupData[i].questions[n]);
                    }
                }
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
                $Html+= CreatGroupSplite(data[i],i,Answer);
            }
        }
    }
    $Html+=CreatMarks(AllData);//老师批注
    $('#Subject').html($Html);
    AppendMarks(AllData);
    GetComCss()
}
//创建正常题型
function CreatNomal(data,i,Answer){
    var $PaperHtml='';
    var IsType=data.selectable;
    var IsSelect=(IsType==1||IsType=='1');
    if(IsSelect){
        $PaperHtml+='<li id="'+data.questionId+'" data-lnOrder="'+(i+1)+'" data-questionId="'+data.questionId+'">';
        $PaperHtml+=Content(data,i,Answer);//客观题题干
        $PaperHtml+=Option(data,i,Answer);
        $PaperHtml+=Anlaysis(data);
        $PaperHtml+='</li>';
    }else {
        $PaperHtml+='<li id="'+data.questionId+'" data-lnOrder="'+(i+1)+'" data-questionId="'+data.questionId+'">';
        $PaperHtml+=OtherContent(data,i,Answer);//主观题题干
        $PaperHtml+=Anlaysis(data);
        $PaperHtml+='</li>';
    }
    return $PaperHtml;
}
//创建解析
function GroupAnlysis(data){
    var $PaperHtml='';
    <!--解析-->
    $PaperHtml+='<div class="analysis">';
    $PaperHtml+='<input type="button" class="w_AnalysisBtn w_Analysis0" value="解析">';
    $PaperHtml+='<div class="w_AnalysisMain">';
    for(var k=0;k<data.labels.length;k++){
        //答案
        if(data.labels[k].questionType=='03'||data.labels[k].questionType==03){
            $PaperHtml+='<div class="selectAnswer">'+data.labels[k].content+'</div>';
        }
        //解析
        if(data.labels[k].questionType=='05'||data.labels[k].questionType==05){
            var anlysis= data.labels[k].content.replace(/\<p>/g,'<p style="text-indent: 10px">')
            $PaperHtml+='<div class="select">'+anlysis+'</div>';
        }
        //写作指导
        if(data.labels[k].questionType=='17'||data.labels[k].questionType==17){
            var anlysis= data.labels[k].content.replace(/\<p>/g,'<p style="text-indent: 10px">')
            $PaperHtml+='<div class="select">'+anlysis+'</div>';;
        }
    }
    $PaperHtml+='</div>';
    $PaperHtml+='</div>';
    return $PaperHtml;
};
//正常题干
function Content(data,i,Answer){
    var $PaperHtml='';
    $PaperHtml+='<div class="stem">';
    var content=data.questionTitle.replace(/题干/g,' ');
    var content=content.replace(/\】/g,(i+1)+"、");
    var content=content.replace(/\【/g," ");
    var Statis=Answer[data.questionId];
    //学生答案
    if(typeof(Statis)!='undefined'){
        var UserAnswer=Statis.result;
        if(UserAnswer==0||UserAnswer=='0'){
            content+="<i class='w_sprite w_Yesico w_userY'></i>";
            $PaperHtml+=content;//题干
        }
        else {
            content+="<i class='w_sprite w_noico w_userY'></i>";
            $PaperHtml+=content;//题干
        }
    }
    else {
        content+="<i class='w_sprite w_noico w_userY'></i>";
        $PaperHtml+=content;//题干
    }
    $PaperHtml+='</div>';
    return $PaperHtml;
};
//选项
function Option(data,i,Answer){
    var Statis=Answer[data.questionId];
    var $PaperHtml='';
    <!--选项-->
    if(data.optionA!=null){var $A=data.optionA;}else {var $A='';}
    if(data.optionB!=null){var $B=data.optionB;}else {var $B='';}
    if(data.optionC!=null){var $C=data.optionC;}else {var $C='';}
    if(data.optionD!=null){var $D=data.optionD;}else {var $D='';}
    //学生答案是否对错
    var UserAnswerSub='';
    if(typeof(Statis)!='undefined'){
        if(Statis.userAnswer!=null){
            var UserAnswer=Statis.userAnswer.toString();
            for(var t=0;t<UserAnswer.length;t++){
                UserAnswerSub=UserAnswer.substr(t,1);
                if(UserAnswerSub=="a"||UserAnswerSub=="A"){$A='<div class="fc58 dinline">'+$A+'</div>';}
                if(UserAnswerSub=="b"||UserAnswerSub=="B"){$B='<div class="fc58 dinline">'+$B+'</div>';}
                if(UserAnswerSub=="c"||UserAnswerSub=="C"){$C='<div class="fc58 dinline">'+$C+'</div>';}
                if(UserAnswerSub=="d"||UserAnswerSub=="D"){$D='<div class="fc58 dinline">'+$D+'</div>';}
            }
        }
        else {
        }
    }
    //学生未选择
    else {

    }
    var Option='';
    if($A.indexOf('oneline')!=-1){
        Option=$A+$B+$C+$D;
    }else if($A.indexOf('twoline')!=-1){
        $B=$B+'';
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
function Anlaysis(data){
    var $PaperHtml='';
    <!--解析-->
    for(var k=0;k<data.labels.length;k++){
        //答案
        if(data.labels[k].questionType=='03'||data.labels[k].questionType==03){
            $PaperHtml+='<div class="selectAnswer">'+data.labels[k].content+'</div>';
        }
        //解析
        if(data.labels[k].questionType=='05'||data.labels[k].questionType==05){
            var anlysis= data.labels[k].content.replace(/\<p>/g,'<p style="text-indent: 10px">')
            $PaperHtml+='<div class="select">'+anlysis+'</div>';
        }
        //写作指导
        if(data.labels[k].questionType=='17'||data.labels[k].questionType==17){
            var anlysis= data.labels[k].content.replace(/\<p>/g,'<p style="text-indent: 10px">')
            $PaperHtml+='<div class="select">'+anlysis+'</div>';;
        }
        //写作指导
        if(data.labels[k].questionType=='18'||data.labels[k].questionType==18){
            var anlysis= data.labels[k].content.replace(/\<p>/g,'<p style="text-indent: 10px">')
            $PaperHtml+='<div class="select">'+anlysis+'</div>';;
        }
    }
    return $PaperHtml;
};
//主观题题干
function OtherContent(data,i,Answer){
    var Statis=Answer[data.questionId];
    var $PaperHtml='';
    <!--题干-->
    $PaperHtml+='<div class="stem">';
    var content=data.questionTitle.replace(/题干/g,' ');
    var content=content.replace(/\】/g,(i+1)+"、");
    var content=content.replace(/\【/g," ");
    $PaperHtml+=content;//题干
    $PaperHtml+='</div>';
    //学生回答
    var Statis=Answer[data.questionId];
    //学生答案
    if(typeof(Statis)!='undefined'){
        var UserAnswer=Statis.result;
        if(UserAnswer=='0'||UserAnswer==0){
            $PaperHtml+='<div class="gapanswer">学生回答：<i class="w_sprite w_Yesico w_userY"></i></div>';
        }
        //错误
        if(UserAnswer=='1'||UserAnswer==1){
            $PaperHtml+='<div class="gapanswer">学生回答：<i class="w_sprite w_noico w_userY"></i></div>';
        }
        //半对
        if(UserAnswer=='2'||UserAnswer==2){
            $PaperHtml+='<div class="gapanswer">学生回答：<i class="w_sprite w_Noyesico w_userY"></i> </div>';
        }
    }
    else {
        $PaperHtml+='<div class="gapanswer">学生回答：<span class="gapanswerNO">未批</span> </div>';
    }
    return $PaperHtml;
};
//创建组合题
function GroupNoSplite(data,i,Answer){
    var $PaperHtml='';
    $PaperHtml+='<li id="'+data.questionId+'" data-lnOrder="'+data.lnOrder+'" data-questionId="'+data.questionId+'">';
    $PaperHtml+=GroupContent(data,i);
    $PaperHtml+='<ul class="SmallSub">';
    for(var j=0;j<data.questions.length;j++){
        var questions=data.questions[j];//提取单个小题
        var IsType=questions.selectable;
        var IsSelect=(IsType==1||IsType=='1');
        if(IsSelect){
            $PaperHtml+='<li id="'+questions.questionId+'" data-lnOrder="'+(i+1)+'" data-questionId="'+questions.questionId+'">';
            $PaperHtml+=GroupSmallContent(questions,Answer);//客观题题干
            $PaperHtml+=Option(questions,j,Answer);
            $PaperHtml+=Anlaysis(questions);
            $PaperHtml+='</li>';
        }else {
            $PaperHtml+='<li id="'+questions.questionId+'" data-lnOrder="'+(i+1)+'" data-questionId="'+questions.questionId+'">';
            $PaperHtml+=GroupOtherContent(questions,Answer);//主观题题干
            $PaperHtml+='</li>';
        }
    }
    $PaperHtml+='</ul>';
    $PaperHtml+=Anlaysis(data);
    $PaperHtml+='</li>';
    return $PaperHtml;
}
//组合题主观题题干
function GroupOtherContent(data,i,Answer){
    var Statis=Answer[data.questionId];
    var $PaperHtml='';
    <!--题干-->
    $PaperHtml+='<div class="stem">';
    var content=data.questionTitle.replace(/题干/g,' ');
    var content=content.replace(/\】/g,'');
    var content=content.replace(/\【/g," ");
    $PaperHtml+=content;//题干
    $PaperHtml+='</div>';
    //学生回答
    var Statis=Answer[data.questionId];
    //学生答案
    if(typeof(Statis)!='undefined'){
        var UserAnswer=Statis.result;
        if(UserAnswer=='0'||UserAnswer==0){
            $PaperHtml+='<div class="gapanswer">学生回答：<i class="w_sprite w_Yesico w_userY"></i></div>';
        }
        //错误
        if(UserAnswer=='1'||UserAnswer==1){
            $PaperHtml+='<div class="gapanswer">学生回答：<i class="w_sprite w_noico w_userY"></i></div>';
        }
        //半对
        if(UserAnswer=='2'||UserAnswer==2){
            $PaperHtml+='<div class="gapanswer">学生回答：<i class="w_sprite w_Noyesico w_userY"></i> </div>';
        }
    }
    else {
        $PaperHtml+='<div class="gapanswer">学生回答：<span class="gapanswerNO">未批</span> </div>';
    }
    return $PaperHtml;
};
//组合题正常题干
function GroupSmallContent(data,Answer){
    var $PaperHtml='';
    $PaperHtml+='<div class="stem">';
    var content=data.questionTitle.replace(/题干/g,' ');
    var content=content.replace(/\】/g,'');
    var content=content.replace(/\【/g," ");
    var Statis=Answer[data.questionId];
    //学生答案
    if(typeof(Statis)!='undefined'){
        var UserAnswer=Statis.userAnswer;
        if(UserAnswer==data.answer){
            content+="<i class='w_sprite w_Yesico w_userY'></i>";
            $PaperHtml+=content;//题干
        }
        else {
            content+="<i class='w_sprite w_noico w_userY'></i>";
            $PaperHtml+=content;//题干
        }
    }
    else {
        content+="<i class='w_sprite w_noico w_userY'></i>";
        $PaperHtml+=content;//题干
    }
    $PaperHtml+='</div>';
    return $PaperHtml;
};
//组合题大题干
function GroupContent(data,i){
    var $PaperHtml='';
    $PaperHtml+='<div class="stem">';
    var content=data.content.replace(/材料/g,(i+1)+"、"+'材料');
    content=content.replace("【","");
    content=content.replace("】","");
    content=content.replace(/材<\/span><span>料/g,(i+1)+"、"+'材</span><span>料');
    $PaperHtml+=content;//题干
    $PaperHtml+='</div>';
    return $PaperHtml;
};
//创建组合可拆题型
function CreatGroupSplite(data,i,Answer){
    var $PaperHtml='';
    var IsType=data.selectable;
    var IsSelect=(IsType==1||IsType=='1');
    if(data.groupOrder==1||data.groupOrder=='1'){
        $PaperHtml+='<li>'+GroupSpContent(data)+'</li>'
    }
    if(IsSelect){
        $PaperHtml+='<li id="'+data.questionId+'" data-lnOrder="'+(i+1)+'" data-questionId="'+data.questionId+'">';
        $PaperHtml+=Content(data,i,Answer);//客观题题干
        $PaperHtml+=Option(data,i,Answer);
        $PaperHtml+=Anlaysis(data);
        $PaperHtml+='</li>';
    }else {
        $PaperHtml+='<li id="'+data.questionId+'" data-lnOrder="'+(i+1)+'" data-questionId="'+data.questionId+'">';
        $PaperHtml+=OtherContent(data,i,Answer);//主观题题干
        $PaperHtml+=Anlaysis(data);
        $PaperHtml+='</li>';
    }
    return $PaperHtml;
}
//组合题可拆大题干
function GroupSpContent(data){
    var content=data.content.replace(/材料/g,""+'材料');
    content=content.replace("【","");
    content=content.replace("】","");
    content=content.replace(/材<\/span><span>料/g,""+'材</span><span>料');
    return content;
};





//老师批注
function CreatMarks(data){
    var $PaperHtml='';
    var answersFileIds=data.answersFileIds;//学生答案
    if(answersFileIds!=null){
        $PaperHtml+='<p>学生答案：</p>';
        for (var i=0;i<answersFileIds.length;i++){
            var ThisData=answersFileIds[i];
            $PaperHtml+='<div class="AnswerBox" id="'+ThisData.fileId+'"><img class="h100" src="'+ThisData.url+'"   alt=""></div>';
        }
    }
    else {
        $PaperHtml+='<p>学生答案：暂无</p>';
    }
    if(data.totalRemarks!=null&&data.totalRemarks!=''){
        $PaperHtml+="<div><span class='fc65 '>教师批注：</span>"+data.totalRemarks+"</div>";
    }
    else {
        $PaperHtml+="<div><span class='fc65 '>教师批注：</span>暂无批注</div>";
    }
    return $PaperHtml;
}
//插入老师批注
function AppendMarks(AllData){
    var paperUserMarks=AllData.paperUserMarks;//老师批注
    if(paperUserMarks!=null){
        for(var i=0;i<paperUserMarks.length;i++){
            var UserMarks='<img class="AnswerImg" src="'+paperUserMarks[i].image+'"   alt="">'
            $('#'+paperUserMarks[i].fileId).append(UserMarks);
        }
    }
}
/*学生名单切换*/
function UserListTurn(){
    var size_time=null;
    if(size_time){clearInterval(size_time)}
    var totalSize = $('#w_SubNameList li').size();//获取总数据
    var scrollWidth=600;//通过判断浏览器的宽度决定课件容器的宽度
    var pageSize=15;//每页显示几条数据
    var currentPage = 1;//当前为第一页
    var totalPage = Math.ceil(totalSize / pageSize);//计算总页数
    if(totalPage>1){
        /*单击向下的箭头*/
        $('#DownBtn').click(function(){
            if(currentPage==totalPage){
                return false;
            }else {
                $('#w_SubNameList').animate({'top':currentPage*-scrollWidth},200);
                currentPage++;
            }
        });
        /*单击向左的箭头*/
        $('#UpBtn').click(function(){
            if(currentPage==1){
                return false;
            }else {
                currentPage--;
                $('#w_SubNameList').animate({'top':((currentPage-1)*-scrollWidth)},200)
            }
        });
    };
    size_time=setInterval(function(){
        if(currentPage>1){
            $('#upico').removeClass().addClass('w_sprite w_topico1');
        }
        else {
            $('#upico').removeClass().addClass('w_sprite w_topico0');
        }
        if(currentPage<=totalPage-1){
            $('#downico').removeClass().addClass('w_sprite w_boico1');
        }
        else {
            $('#downico').removeClass().addClass('w_sprite w_boico0');
        }
    },1);
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


