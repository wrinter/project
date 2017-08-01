//获取标题
$('#title').html(decodeURI(decodeURI(encodeURI(Request.name))));
//题目详情
SystemRedMsg();
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
    CreatHtml(AllDataObj,errorRate,answerStatistics,NeedData,DoError);//创建总HTML
    CreatErrorRate(QuestionArr);//错误率
    GetComCss();//获取公共样式
}
//创建错误率
function CreatErrorRate(data){
    var $ErrorRateHtml='';
    //创建错误率列表
    console.log(data)
    for(var i=0;i<data.length;i++){
        $ErrorRateHtml+='<li title="'+data[i].errorRate+'" data-errorRate="'+data[i].errorRate+'" id="'+data[i].lnOrder+'">';
        $ErrorRateHtml+='<p class="lnOrder">'+(i+1)+'</p>';
        $ErrorRateHtml+='<p class="errorRate">'+data[i].errorRate+'</p>';
        $ErrorRateHtml+='</li>';
    }
    $('#w_HomeWorkTopP').html($ErrorRateHtml);
};
//创建试题
function CreatHtml(data,errorRate,answerStatistics,NeedData,DoError){
    var $Html='';
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
};
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
//正常题型
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
    var content=data.questionTitle.replace(/题干/g,'');
    content=content.replace("【","");
    content=content.replace("】","");
    content=content.replace(/材<\/span><span>料/g,'');
    return content;
};
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
    $PaperHtml+='<img class="dinb" src="../../../static/image/common/jxbtn.png" alt="">';
    $PaperHtml+='<div class="w_AnalysisMain">';
    for(var k=0;k<data.labels.length;k++){
        //答案
        if(data.labels[k].questionType=='03'||data.labels[k].questionType==03){
            $PaperHtml+='<div class="selectAnswer">'+data.labels[k].content+'</div>';
        }
        //解析
        if(data.labels[k].questionType=='05'||data.labels[k].questionType==05){
            var anlysis= data.labels[k].content.replace(/\<p>/g,'<p >')
            $PaperHtml+='<div class="select">'+anlysis+'</div>';
        }
        //写作指导
        if(data.labels[k].questionType=='17'||data.labels[k].questionType==17){
            var anlysis= data.labels[k].content.replace(/\<p>/g,'<p >')
            $PaperHtml+='<div class="select">'+anlysis+'</div>';;
        }
        //写作指导
        if(data.labels[k].questionType=='18'||data.labels[k].questionType==18){
            var anlysis= data.labels[k].content.replace(/\<p>/g,'<p style="text-indent: 10px">')
            $PaperHtml+='<div class="select">'+anlysis+'</div>';;
        }
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

    //答题统计
    if(typeof(Statis)!='undefined'){
        if(data.answer=='A'||data.answer=='a'){
            $PaperHtml+='<p class="statp"><img src="../../../static/image/common/w_Yesico.png" class="w_statYes" alt=""> <span class="sataOption">A</span>'+ Statis["A"]+'</p>';
        }
        else {
            $PaperHtml+='<p class="statp"><span class="sataOption">A</span>'+ Statis["A"]+'</p>';
        }
        if(data.answer=='B'||data.answer=='b'){
            $PaperHtml+='<p class="statp"><img src="../../../static/image/common/w_Yesico.png" class="w_statYes" alt=""> <span class="sataOption">B</span>'+ Statis["B"]+'</p>';
        }
        else {
            $PaperHtml+='<p class="statp"><span class="sataOption">B</span>'+ Statis["B"]+'</p>';
        }
        if(data.answer=='C'||data.answer=='c'){
            $PaperHtml+='<p class="statp"><img src="../../../static/image/common/w_Yesico.png" class="w_statYes" alt=""> <span class="sataOption">C</span>'+ Statis["C"]+'</p>';
        }
        else {
            $PaperHtml+='<p class="statp"><span class="sataOption">C</span>'+ Statis["C"]+'</p>';
        }
        if(data.answer=='D'||data.answer=='d'){
            $PaperHtml+='<p class="statp"><img src="../../../static/image/common/w_Yesico.png" class="w_statYes" alt=""> <span class="sataOption">D</span>'+ Statis["D"]+'</p>';
        }
        else {
            $PaperHtml+='<p class="statp"><span class="sataOption">D</span>'+ Statis["D"]+'</p>';
        }
    }
    else {
        $PaperHtml+='暂无统计信息';
    };
    $PaperHtml+='</div>';
    return $PaperHtml;
}
//客观答题统计
function IsSelectStat(data,answerStatistics){
    var $PaperHtml='';
    <!--答题统计-->
    var Statis=answerStatistics[data.questionId];
    $PaperHtml+='<div class="stat">';
    $PaperHtml+='<span class="fl">【答题统计】</span>';
    //答题统计
    if(typeof(Statis)!='undefined'){
        // $PaperHtml+='<p class="gap bac65">正确'+Statis[0]+'</p>';
        // $PaperHtml+='<p class="gap bac58">半对'+Statis[2]+'</p>';
        // $PaperHtml+='<p class="gap bacF9">错误'+Statis[1]+'</p>';

        $PaperHtml+='<div class="gap pr"><img src="../../../static/image/common/tbg0.png" class="GapImg" alt=""><span class="GapTxt">正确'+Statis[0]+'</span> </div>';
        $PaperHtml+='<div class="gap pr"><img src="../../../static/image/common/tbg1.png" class="GapImg" alt=""><span class="GapTxt">半对'+Statis[2]+'</span> </div>';
        $PaperHtml+='<div class="gap pr"><img src="../../../static/image/common/tbg2.png" class="GapImg" alt=""><span class="GapTxt">错误'+Statis[1]+'</span> </div>';


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
};
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
//打印
$(document).ready(function(){
    $("#w_PrintBtn").on('click',function(){
        $("#w_Print").jqprint({
            debug: false,
            importCSS: true,
            printContainer: true,
            operaSupport: false
        })  ;
    });
});