/********************************************徐扬******************************************************/
/********************************************作业报告******************************************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
SystemRedMsg();
$('body').css('overflow-y',"scroll");
$('#w_StudentPro').hover(function(){
    $('#w_UnDoneMain').stop(true).fadeIn(100);
},function(){
    $('#w_UnDoneMain').stop(true).fadeOut(100);
});
$('#w_OtherTitle').html(decodeURI(decodeURI(encodeURI(Request.name))));
$('#w_OtherDataTitle').html(decodeURI(decodeURI(encodeURI(Request.assignTime))));

function IsTab(){
    $('.w_OtherTab li').on('click',function(){
        var Index=$(this).index();
        if(Index==0){
            $('#w_PrintBtn0').css('display','none');
            $('#DownloadBtn').css('display','block');
        }else if(Index==1){
            $('#w_PrintBtn0').css('display','block');
            $('#DownloadBtn').css('display','none');
        }else {
            $('#w_PrintBtn0').css('display','none');
            $('#DownloadBtn').css('display','none');
        }
        $(this).removeClass().addClass('w_Tabbg0').siblings().removeClass().addClass('w_Tabbg1');
        $('.w_TabMain').eq(Index).css('display','block').siblings('.w_TabMain').css('display','none');
    })
};
IsTab();
//下载
function Download(){
    var Url="/web/teacher/paper/report/studentDetailsDownload?paperAssignId="+Request.paperAssignId;
    var $DownLoadEle='<form action="'+Url+'"  class="dino" method="post" id="Post"></form>';
    $('#PostBox').html($DownLoadEle);
    $('#Post').submit();
}
$('#DownloadBtn').on('click',function(){
    Download();
})
$('#w_PrintBtn0').attr('href','WorkPrint.html?paperAssignId='+Request.paperAssignId+'&name='+$('#w_OtherTitle').html()+'&type='+Request.type);
//学生详情
function GetStudentDetails(){
    var SubData={};
    SubData.paperAssignId=Request.paperAssignId;
    SubData.type=Request.type;
    $.ajax({
        "type": "post",
        "url": "/web/teacher/paper/report/studentDetails",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                CreatStudentDetailsHtml(AllData)
            }
        }
    });
};
GetStudentDetails();

//创建学生详情
function CreatStudentDetailsHtml(data){
    var $StudentDetailsHtml='';
    for(var i=0;i<data.length;i++){
        $StudentDetailsHtml+='<li>';
        $StudentDetailsHtml+='<p>'+data[i].studentName+'</p>';
        $StudentDetailsHtml+='<p>'+data[i].proportion+'</p>';
        if(data[i].used=='-1'||data[i].used==-1){
            $StudentDetailsHtml+='<p class="fcCA">未提交</p>';
        }
        else if(ToSecTime(data[i].used)>data[i].proposalUsed){
            $StudentDetailsHtml+='<p class="fcCA">'+ToComTime(data[i].used)+'</p>';
        }
        else {
            $StudentDetailsHtml+='<p>'+ToComTime(data[i].used)+'</p>';
        }
        $StudentDetailsHtml+='<p>';
        if(data[i].used=='-1'||data[i].used==-1){
            $StudentDetailsHtml+='<span class="w_Looka0 " target="_blank">查看</span>';
            $StudentDetailsHtml+='<span class="w_Looka1 bac99" target="_blank">查看</span>';
        }
        else {
            $StudentDetailsHtml+='<a href="work_Subject.html?paperAssignId='+data[i].paperAssignId+'&name='+$('#w_OtherTitle').html()+'&type='+Request.type+'&time='+data[i].used+'&userid='+data[i].studentId+'&score='+data[i].score+'" class="w_Looka0" target="_blank">查看</a>';
            $StudentDetailsHtml+='<a href="work_Subject.html?paperAssignId='+data[i].paperAssignId+'&name='+$('#w_OtherTitle').html()+'&type='+Request.type+'&time='+data[i].used+'&userid='+data[i].studentId+'&score='+data[i].score+'" class="w_Looka1" target="_blank">查看</a>';
        }
        $StudentDetailsHtml+='</p>';
        $StudentDetailsHtml+='</li>';
    }
    $('#w_OtherStudent').html($StudentDetailsHtml);
    HomeWorkListHtmlCss('#w_OtherStudent li');
};
//题目详情
function titleDetails(){
    var SubData={};
    SubData.paperAssignId=Request.paperAssignId;
    SubData.type=Request.type;
    $.ajax({
        "type": "post",
        "url": "/web/teacher/paper/report/titleDetails",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0,1));
            if (codenum == 0){

                CreatPaperData(AllData);
                intMathJax();
            }
        }
    });
};
titleDetails();
//创建题目数据层
function CreatPaperData(data){
    var PaperData=data.paper;
    var QuestionData=PaperData.questionLines;//题目大类
    var answerStatistics=data.answerStatistics;//答题统计
    var errorRate=data.errorRate;//答题统计
    console.log(answerStatistics)
    var DoError=data.doError;//答错统计
    var NeedData=data.need;//答错统计
    var $PaperHtml='';
    var QuestionObj={};//保存题目对象
    var QuestionArr=[];//保存题目的id 题号 错误率
    var AllDataObj=[];//创建总数据层数组；
    //创建试题总数据
    for(var i=0;i<QuestionData.length;i++){
        var GroupData=QuestionData[i].questionGroup;//小题目集合
        for(var n=0;n< GroupData.length;n++){
            if(GroupData[n].groupCode==null){
                AllDataObj.push(GroupData[n].questions[0]);
                var QuestionObj={};//保存题目对象
                QuestionObj.lnOrder=(n+1);
                QuestionObj.questionId=GroupData[n].questions[0].questionId;
                var IsError=errorRate[GroupData[n].questions[0].questionId];
                if(typeof(IsError)!='undefined'){
                    QuestionObj.errorRate=IsError;
                }
                else {
                    QuestionObj.errorRate="未完成";
                }
                QuestionArr.push(QuestionObj);
            }else {
                //组合题不可拆分
                if(GroupData[n].isSplite==0||GroupData[n].isSplite=='0'){
                    AllDataObj.push(GroupData[n]);
                    var QuestionObj={};//保存题目对象
                    QuestionObj.lnOrder=(n+1);
                    QuestionObj.questionId=GroupData[n].questionId;
                    var IsError=errorRate[GroupData[n].questionId];
                    if(typeof(IsError)!='undefined'){
                        QuestionObj.errorRate=IsError;
                    }
                    else {
                        QuestionObj.errorRate="未完成";
                    }
                    QuestionArr.push(QuestionObj);
                }
                //组合题可拆分
                else {
                    for(var k=0;k<GroupData[n].questions.length;k++){
                        AllDataObj.push(GroupData[n].questions[k]);
                        var QuestionObj={};//保存题目对象
                        QuestionObj.lnOrder=(n+1);
                        QuestionObj.questionId=GroupData[n].questions[k].questionId;
                        var IsError=errorRate[GroupData[n].questions[k].questionId];
                        if(typeof(IsError)!='undefined'){
                            QuestionObj.errorRate=IsError;
                        }
                        else {
                            QuestionObj.errorRate="未完成";
                        }
                        QuestionArr.push(QuestionObj);
                    }
                }
            }
        }
        $PaperHtml+='<li>'+QuestionData[i].lineName+'</li>';
    };
    CreatHtml(AllDataObj,errorRate,answerStatistics,NeedData,DoError)
    $('#Subject').attr({
        'data-paperId':data.paper.paperId,
        'data-paperName':data.paper.paperName,
        'data-score':data.paper.score,
        'data-testTime':data.paper.testTime
    });
    CreatErrorRate(QuestionArr);//错误率
    HomeWorkCss();//解析展开收放
    HomeWorkListHtmlCss('#w_HomeWorkRate li');
    CheckTestAnimate();//查看题目操作
    NumSort();//题号排序
    ErrorRateSort();//错误率排序
    GetComCss();//获取公共样式
    intMathJax();//公式
}
//创建错误率
function CreatErrorRate(data){
    var $ErrorRateHtml='';
    //创建错误率列表
    for(var i=0;i<data.length;i++){
        $ErrorRateHtml+='<li title="'+data[i].errorRate+'" data-errorRate="'+data[i].errorRate+'" id="'+(i+1)+'">';
        $ErrorRateHtml+='<p class="lnOrder">'+(i+1)+'</p>';
        $ErrorRateHtml+='<p class="errorRate">'+data[i].errorRate+'</p>';
        $ErrorRateHtml+='<p>';
        $ErrorRateHtml+='<span class="w_Looka0">查看</span>';
        $ErrorRateHtml+='<span class="w_Looka1 IsSearchTest" data-questionId="'+data[i].questionId+'">查看</span>';
        $ErrorRateHtml+='</p>';
        $ErrorRateHtml+='</li>';
    }
    $('#w_HomeWorkRate').html($ErrorRateHtml);
};
//创建试题
function CreatHtml(data,errorRate,answerStatistics,NeedData,DoError){
    var $Html='';
    console.log(data)
    for(var i=0;i<data.length;i++){
        if(data[i].groupCode==null){
            $Html+= CreatNomal(data[i],i,errorRate,answerStatistics,NeedData,DoError);
        }
        else {
            //不可拆分
            if(data[i].isSplite==0||data[i].isSplite=='0'){
                $Html+= CreatGroupNoSplite(data[i],i,errorRate,answerStatistics,NeedData,DoError);
            }else {
                $Html+= CreatGroupSplite(data[i],i,errorRate,answerStatistics,NeedData,DoError);
            }
        }

    }
    $('#Subject').html($Html);
}
//组合题不可拆分
function CreatGroupNoSplite(data,i,errorRate,answerStatistics,NeedData,DoError){
    var $PaperHtml='';
    $PaperHtml+='<li id="'+data.questionId+'" data-lnOrder="'+(i+1)+'" data-questionId="'+data.questionId+'">';
    $PaperHtml+='<div class="stem">';
    $PaperHtml+=GroupContent(data,i);
    $PaperHtml+='</div>';
    $PaperHtml+='<ul class="SmallSub">';
    for(var j=0;j<data.questions.length;j++){
        $PaperHtml+=CreatGroupSmall(data.questions[j],j,errorRate,answerStatistics,NeedData,DoError);//组合题小题
    }
    $PaperHtml+='</ul>';
    $PaperHtml+=GroupAnlysis(data);//创建解析
    $PaperHtml+='</li>';
    return $PaperHtml;
}
//组合题小题
function CreatGroupSmall(data,i,errorRate,answerStatistics,NeedData,DoError){
    var IsType=data.selectable;
    var IsSelect=(IsType==1||IsType=='1');
    var $PaperHtml='';
    $PaperHtml+='<li>';
    $PaperHtml+='<div class="stem">';
    $PaperHtml+=SmallContent(data,i);//题干
    if(IsSelect){
        $PaperHtml+=IsOptionShow(data);//选项
    }
    if(IsSelect){
        if(data.selectableType==3||data.selectableType=='3'){
            $PaperHtml+=IsPanDuanStat(data,answerStatistics);//客观答题统计
        }else {
            $PaperHtml+=GroupStat(data,answerStatistics);//客观答题统计
        }

    }else {
        $PaperHtml+=IsSelectStat(data,answerStatistics);//主观答题统计
    }
    $PaperHtml+=NeedMan(data,NeedData);//需讲人数
    $PaperHtml+=DoErrorMan(data,DoError);//做错的人
    $PaperHtml+='</div>';
    $PaperHtml+='</li>';
    return $PaperHtml;
};
//创建正常题型
function CreatNomal(data,i,errorRate,answerStatistics,NeedData,DoError){
    var $PaperHtml='';
    var IsType=data.selectable;
    var IsSelect=(IsType==1||IsType=='1');
    $PaperHtml+='<li id="'+data.questionId+'" data-lnOrder="'+(i+1)+'" data-questionId="'+data.questionId+'">';
    $PaperHtml+='<div class="stem">';
    $PaperHtml+=Content(data,i);
    $PaperHtml+='</div>';
    if(IsSelect){
        $PaperHtml+=IsOptionShow(data);//选项
    }
    $PaperHtml+=GroupAnlysis(data);//创建解析
    if(IsSelect){
        if(data.selectableType==3||data.selectableType=='3'){
            $PaperHtml+=IsPanDuanStat(data,answerStatistics);//客观答题统计
        }else {
            $PaperHtml+=GroupStat(data,answerStatistics);//客观答题统计
        }

    }else {
        $PaperHtml+=IsSelectStat(data,answerStatistics);//主观答题统计
    }
    $PaperHtml+=NeedMan(data,NeedData);//需讲人数
    $PaperHtml+=DoErrorMan(data,DoError);//做错的人
    $PaperHtml+='</li>';
    return $PaperHtml;
}
//创建组合可拆题型
function CreatGroupSplite(data,i,errorRate,answerStatistics,NeedData,DoError){
    var $PaperHtml='';
    var IsType=data.selectable;
    var IsSelect=(IsType==1||IsType=='1');
    if(data.groupOrder==1||data.groupOrder=='1'){
        $PaperHtml+='<li>'+GroupSpContent(data)+'</li>'
    }
    $PaperHtml+='<li id="'+data.questionId+'" data-lnOrder="'+(i+1)+'" data-questionId="'+data.questionId+'">';
    $PaperHtml+='<div class="stem">';
    $PaperHtml+=Content(data,i);
    $PaperHtml+='</div>';
    if(IsSelect){
        $PaperHtml+=IsOptionShow(data);//选项
    }
    $PaperHtml+=GroupAnlysis(data);//创建解析
    if(IsSelect){

        if(data.selectableType==3||data.selectableType=='3'){
            $PaperHtml+=IsPanDuanStat(data,answerStatistics);//客观答题统计
        }else {
            $PaperHtml+=GroupStat(data,answerStatistics);//客观答题统计
        }
    }else {
        $PaperHtml+=IsSelectStat(data,answerStatistics);//主观答题统计
    }
    $PaperHtml+=NeedMan(data,NeedData);//需讲人数
    $PaperHtml+=DoErrorMan(data,DoError);//做错的人
    $PaperHtml+='</li>';
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
//组合题大题干
function GroupContent(data,i){
    var content=data.content.replace(/材料/g,(i+1)+"、"+'材料');
    content=content.replace("【","");
    content=content.replace("】","");
    content=content.replace(/材<\/span><span>料/g,(i+1)+"、"+'材</span><span>料');
    return content;
};
//组合题小题干
function SmallContent(data,i){
    var content=data.questionTitle.replace(/题干/g,' ');
    content=content.replace("【","");
    content=content.replace("】","");
    content=content.replace(/题<\/span><span>干/g,' ');
    return content;
};
//普通题干
function Content(data,i){
    var content=data.questionTitle.replace(/\】/g,"");
    content=content.replace(/题干/g,(i+1)+"、");
    content=content.replace(/题<\/span><span>干/g,(i+1)+"、");
    content=content.replace("【","");
    content='<div class="r_OpNomalColor">'+content+'</div>'
    return content;
};
//选项正确与否排列方式
function IsOptionShow(data){
    var $PaperHtml='';
    if(data.optionA!=null){var $A=data.optionA;}else {var $A='';}
    if(data.optionB!=null){var $B=data.optionB;}else {var $B='';}
    if(data.optionC!=null){var $C=data.optionC;}else {var $C='';}
    if(data.optionD!=null){var $D=data.optionD;}else {var $D='';}
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
        //写作指导
        if(data.labels[k].questionType=='18'||data.labels[k].questionType==18){
            var anlysis= data.labels[k].content.replace(/\<p>/g,'<p style="text-indent: 10px">')
            $PaperHtml+='<div class="select">'+anlysis+'</div>';;
        }
    }
     if(data.labels.length==0){
         $PaperHtml+='<div class="select">暂无解析</div>';;
     }

    $PaperHtml+='</div>';
    $PaperHtml+='</div>';
    return $PaperHtml;
};
//创建组合题客观题答题统计
function GroupStat(data,answerStatistics){
    var $PaperHtml='';
    <!--答题统计-->
    $PaperHtml+='<div class="stat">';
    $PaperHtml+='<span class="fl">【答题统计】</span>';
    var Statis=answerStatistics[data.questionId];
    console.log(Statis)
    console.log(data)
    //答题统计
    if(typeof(Statis)!='undefined'){
        if(data.answer=='A'||data.answer=='a'){
            $PaperHtml+='<p class="statp"><i class="w_sprite w_Yesico w_statYes"></i><span class="sataOption">A</span>'+ Statis["A"]+'</p>';
        }
        else {
            $PaperHtml+='<p class="statp"><span class="sataOption">A</span>'+ Statis["A"]+'</p>';
        }
        if(data.answer=='B'||data.answer=='b'){
            $PaperHtml+='<p class="statp"><i class="w_sprite w_Yesico w_statYes"></i><span class="sataOption">B</span>'+ Statis["B"]+'</p>';
        }
        else {
            $PaperHtml+='<p class="statp"><span class="sataOption">B</span>'+ Statis["B"]+'</p>';
        }
        if(data.optionC==null||data.optionC==''){

        }else {
            if(data.answer=='C'||data.answer=='c'){
                $PaperHtml+='<p class="statp"><i class="w_sprite w_Yesico w_statYes"></i><span class="sataOption">C</span>'+ Statis["C"]+'</p>';
            }
            else {
                $PaperHtml+='<p class="statp"><span class="sataOption">C</span>'+ Statis["C"]+'</p>';
            }
        }
        if(data.optionD==null||data.optionD==''){

        }else {
            if(data.answer=='D'||data.answer=='d'){
                $PaperHtml+='<p class="statp"><i class="w_sprite w_Yesico w_statYes"></i><span class="sataOption">D</span>'+ Statis["D"]+'</p>';
            }
            else {
                $PaperHtml+='<p class="statp"><span class="sataOption">D</span>'+ Statis["D"]+'</p>';
            }
        }

    }
    else {
        $PaperHtml+='暂无统计信息';
    };
    $PaperHtml+='</div>';
    return $PaperHtml;
}
//主观答题统计
function IsSelectStat(data,answerStatistics){
    var $PaperHtml='';
    <!--答题统计-->
    var Statis=answerStatistics[data.questionId];
    $PaperHtml+='<div class="stat">';
    $PaperHtml+='<span class="fl">【答题统计】</span>';
    //答题统计
    if(typeof(Statis)!='undefined'){
        $PaperHtml+='<p class="gap bac65">正确'+Statis[0]+'</p>';
        $PaperHtml+='<p class="gap bac58">半对'+Statis[2]+'</p>';
        $PaperHtml+='<p class="gap bacF9">错误'+Statis[1]+'</p>';

    }
    else {
        $PaperHtml+='暂无统计信息';
    };
    $PaperHtml+='</div>';
    return $PaperHtml;
}
//客观判断题答题统计
function IsPanDuanStat(data,answerStatistics){
    var $PaperHtml='';
    <!--答题统计-->
    $PaperHtml+='<div class="stat">';
    $PaperHtml+='<span class="fl">【答题统计】</span>';
    var Statis=answerStatistics[data.questionId];
    //答题统计
    if(typeof(Statis)!='undefined'){
        if(data.answer=='A'||data.answer=='a'){
            $PaperHtml+='<p class="statp"><i class="w_sprite w_Yesico w_statYes"></i><span class="sataOption">√</span>'+ Statis["A"]+'</p>';
        }
        else {
            $PaperHtml+='<p class="statp"><span class="sataOption">√</span>'+ Statis["A"]+'</p>';
        }
        if(data.answer=='B'||data.answer=='b'){
            $PaperHtml+='<p class="statp"><i class="w_sprite w_Yesico w_statYes"></i><span class="sataOption">×</span>'+ Statis["B"]+'</p>';
        }
        else {
            $PaperHtml+='<p class="statp"><span class="sataOption">×</span>'+ Statis["B"]+'</p>';
        }
    }
    else {
        $PaperHtml+='暂无统计信息';
    };
    $PaperHtml+='</div>';
    return $PaperHtml;
}
//需讲人数
function NeedMan(data,NeedData){
    var $PaperHtml='';
    var Need=NeedData[data.questionId];
    if(typeof(Need)!='undefined'){
        $PaperHtml+='<p>【需讲人数】'+Need+'人</p>';
    }
    else {
        $PaperHtml+='<p>【需讲人数】 暂无</p>';
    }
    return $PaperHtml;
}
//做错的人
function DoErrorMan(data,DoError){
    var $PaperHtml='';
    var ErrorName=DoError[data.questionId];
    if(typeof(ErrorName)!='undefined'){
        $PaperHtml+='<div class="w_WrongMan">';
        $PaperHtml+='<span class="fl">【做错的人】</span>';
        $PaperHtml+='<p class="w_WrongName">';
        for(var g=0;g<ErrorName.length;g++){
            $PaperHtml+='<span>'+ErrorName[g]+'</span>';
        }
        $PaperHtml+='</p>';
        $PaperHtml+='</div>';
    }else {
        $PaperHtml+='<div class="w_WrongMan">';
        $PaperHtml+='<span class="fl">【做错的人】</span>';
        $PaperHtml+='<p class="w_WrongName">';
        $PaperHtml+='<span>暂无</span>';
        $PaperHtml+='</p>';
        $PaperHtml+='</div>';
    }
    return $PaperHtml;
}
//查看
function CheckTestAnimate(){
    $('.IsSearchTest').on('click',function(){
        var ThisId=$(this).attr('data-questionId');
        $('#Subject').animate({scrollTop:$('#'+ThisId).position().top+$('#Subject').scrollTop()});
    });
}
//题号排序
function NumSort(){
    //升序
    var asc = function(a, b) {
        return parseInt($(a).attr('id'))>parseInt($(b).attr('id')) ? 1 : -1;
    }
    //降序
    var desc = function(a, b) {
        return parseInt($(a).attr('id'))>parseInt($(b).attr('id'))  ? -1 : 1;
    }
    var sortByli = function(sortBy) {
        var sortEle = $('#w_HomeWorkRate>li').sort(sortBy);
        $('#w_HomeWorkRate').empty().append(sortEle);
    }
    //题号排序
    $('#Num_Sort').off('click')
    $('#Num_Sort').on('click',function(){
        //降序
        if($('#w_HomeWorkRate li').hasClass('sort')){
            for(var i=0;i<$('#w_HomeWorkRate li').length;i++){
                $('#w_HomeWorkRate li').eq(i).removeClass('sort');
            }
            sortByli(asc);
        }
        //升序
        else {
            for(var i=0;i<$('#w_HomeWorkRate li').length;i++){
                $('#w_HomeWorkRate li').eq(i).addClass('sort');
            }
            sortByli(desc);

        }
        HomeWorkListHtmlCss('#w_HomeWorkRate li');
        CheckTestAnimate();
    })
};
//错误率排序
function ErrorRateSort(){
    //升序
    var asc = function(a, b) {
        return parseInt($(a).attr('title'))>parseInt($(b).attr('title'))? 1 : -1;
    }
    //降序
    var desc = function(a, b) {
        return parseInt($(a).attr('title'))>parseInt($(b).attr('title')) ? -1 : 1;
    }
    var sortByli = function(sortBy) {
        var sortEle = $('#w_HomeWorkRate>li').sort(sortBy);
        $('#w_HomeWorkRate').empty().append(sortEle);
    }
    //错误率排序
    $('#Error_Rate').on('click',function(){
        //降序
        if($('#w_HomeWorkRate li').hasClass('errorsort')){
            for(var i=0;i<$('#w_HomeWorkRate li').length;i++){
                $('#w_HomeWorkRate li').eq(i).removeClass('errorsort');
            }
            sortByli(asc);
        }
        //升序
        else {
            for(var i=0;i<$('#w_HomeWorkRate li').length;i++){
                $('#w_HomeWorkRate li').eq(i).addClass('errorsort');
            }
            sortByli(desc);
        }
        HomeWorkListHtmlCss('#w_HomeWorkRate li');
        CheckTestAnimate();
    })
};
//作业报告样式
function HomeWorkListHtmlCss(Element){
    $(Element).hover(function(){
        var i=$(this).index();
        $(this).css('border',"1px solid #65B113").find('.w_Looka1').css({display:"block"});
        if(i>0){$(Element).eq(i-1).css('border-bottom',"1px solid white")}
    },function(){
        var i=$(this).index();
        $(this).css('border',"").find('.w_Looka1').css({display:"none"});
        if(i>0){$(Element).eq(i-1).css('border-bottom',"")}
    })
};
//解析展开收放
function HomeWorkCss(){
    $('.w_AnalysisBtn').on('click',function(){
        if($(this).hasClass('w_Analysis1')){
            $(this).removeClass().addClass('w_Analysis0').val('解析');
            $(this).siblings('.w_AnalysisMain').css('display','none')
        }
        else {
            $(this).removeClass().addClass('w_Analysis1').val('收起');
            $(this).siblings('.w_AnalysisMain').slideDown(400);
        }
    });

};
//综合分析
function GetStudentAnalysis(){
    var SubData={};
    SubData.paperAssignId=Request.paperAssignId;
    $.ajax({
        "type": "post",
        "url": "/web/teacher/paper/report/comprehensiveAnalysis",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                CreatAnalysisHtml(AllData)
            }
        }
    });
};
GetStudentAnalysis();
//创建综合分析列表
function CreatAnalysisHtml(data){
    var $AnalysisHtml='';
    for(var i=0;i<data.length;i++){
        var arr=data[i].itemNumberSet.sort(function(a,b){return a-b});
        $AnalysisHtml+='<li>';
        $AnalysisHtml+='<p class="w_MetaPro" title="'+data[i].correctRate+'" style="width:'+data[i].correctRate+'" ></p>';
        $AnalysisHtml+='<p class="w_MetaY" title="'+data[i].resTag.tagName+'">'+data[i].resTag.tagName+'</p>';
        $AnalysisHtml+='<p class="w_MetaYRight"  id=w_MetaYRight'+i+'>第&nbsp;';
        for(var j=0;j<arr.length;j++){
            if(arr.length==1){
                $AnalysisHtml+=arr[j];
            }else {
                if(j==arr.length-1){
                    $AnalysisHtml+=arr[j];
                }else {
                    $AnalysisHtml+=arr[j]+',';
                }

            }
        }
        $AnalysisHtml+='&nbsp;题</p>';
        $AnalysisHtml+='</li>';

    }
    $('#w_Meta').html($AnalysisHtml);
    for(var i=0;i<data.length;i++){
        $('#w_MetaYRight'+i).attr('title',$('#w_MetaYRight'+i).text())
    }

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