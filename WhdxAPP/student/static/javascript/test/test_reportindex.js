/**
 * Created by lichao on 2017/4/28.
 */
//获取题目
GetQuestion();
function GetQuestion(){
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
                var paperName = AllData.paper.paperName;
                var subjectId = AllData.resPaperUser.subjectId;
                $("title").text(paperName);
                var r_Rnumber = $(".r_Rnumber");
                var type = AllData.type;
                r_Rnumber.attr({"type":type,"subjectId":subjectId});
                SelectOption(AllData.paper.questionLines);//选择题
                JustWrong()
                //数据分析
                Analysis();
            }
        }
    });
};
//创建题号
function SelectOption(AllData){
    var $Select='';
    var Index=0;
    for(var j=0;j<AllData.length;j++){
        var scoreDef = AllData[j].scoreDef;
	    var lineName = AllData[j].lineName.replace("默认题行","");
        if(scoreDef!=null&&scoreDef!=""){
            $Select+='<p class="r_OptionTitle">'+lineName+scoreDef+'</p>';
        }else{
            $Select+='<p class="r_OptionTitle">'+lineName+'</p>';
        }
        $Select+='<ul class="r_OptionList">';
        for(var i=0;i<AllData[j].questionGroup.length;i++){
            var data=AllData[j].questionGroup[i];
            var groupCode = data.groupCode;
            var result = data.result;
            var isSplite = data.isSplite;
            if(groupCode && isSplite == "0"){//题号不可拆分
                Index++;
                var num1 = 0;
                //for(var k = 0 ; k < data.questions.length ; k++){
                var qDtrue = data.questions[k];
                $Select+=OptionClolor(result,Index);
                num1++;
                //}
            }else if(groupCode && isSplite == "1"){//组合题可拆分
                for(var k = 0 ; k < data.questions.length ; k++){
                    var qDtrue = data.questions[k];
                    var result=qDtrue.paperUserAnswer.result;
                    Index++;
                    $Select+=OptionClolor(result,Index);
                }
            }else{
                Index++;
                for(var k = 0 ; k < data.questions.length ; k++){//普通题
                    var qDtrue = data.questions[k];
                    var result=qDtrue.paperUserAnswer.result;
                    var selectable=qDtrue.selectable;
                    if(selectable==1){
                        $Select+=OptionClolor(result,Index);
                    }
                    else {
                        $Select+=OptionClolor(result,Index);
                    }
                }
            }
        }
        $Select+='</ul>';
    }
    $('#Main').html($Select);
};
//选项颜色
function OptionClolor(Result,Index){
    var $Select='';
    if(Result==1){
        $Select+='<li class="Com_Nav r_OptionWrong">'+Index+'</li>';
    }else if(Result==0){
        $Select+='<li class="Com_Nav r_OptionRight">'+Index+'</li>';
    }else if(Result==2){
        $Select+='<li class="Com_Nav r_OptionHalf">'+Index+'</li>';
    }else {
        $Select+='<li class="Com_Nav r_OptionNo">'+Index+'</li>';
    }
    return $Select;
}
function JustWrong(){
    $('.Com_Nav').on('click',function(){
        var index=$(this).html()-1;
        if($('#r_LookWrong0').hasClass('just')){
            window.location.href='test_sub.html?LookWrong='+true+'&id='+Request.id+'&index='+index;
        }else {
            window.location.href='test_sub.html?LookWrong='+false+'&id='+Request.id+'&index='+index;
        }
    });
}
//知识点分析
GetKnown()
function GetKnown(){
    var parmas = {};
    parmas.id = Request.id;
    $.ajax({
        type : "post",
        url : "/api/student/homework/report/studentAnalysis",
        data : parmas,
        dataType : "json",
        success : function(data){
	        console.log(data)
            if(data.retCode == "0000"){
                var r_AnalyList = $(".r_AnalyList");
                var r_ShowList = $(".r_ShowList");
                var r_ClickRain = $('.r_ClickRain');
                var r_Buy = $('.r_Buy');
                //补偿训练
                var status = data.retData.analysisRes.status;
                r_ClickRain.attr("stuats",data.retData.analysisRes.status);
                if(status == "-1"){
                    r_ClickRain.hide();
                }else if(status == "0"){
                    GoCover();//点击进入补偿训练
                }else{
                    r_Buy.show();
                    GoCover();//点击进入补偿训练
                }
                //知识点
                var length = data.retData.analysisRes.list.length;
                if(length<=3){
                    r_ShowList.hide();
                }else{
                    r_ShowList.text("显示剩余"+(length-3)+"个知识点")
                    clickKnown();
                }
                for(var i = 0 ; i<data.retData.analysisRes.list.length;i++){
                    var Dtrue = data.retData.analysisRes.list[i];
                    var knowledgeName = Dtrue.resTag.tagName;
                    var correctRate = parseInt(100-Dtrue.correctRate);
                    var r_ListName = $("<li class='r_ListName' correctRate='"+correctRate+"'><span class='r_KnownName'>"+knowledgeName+"</span><span class='r_KnownNumber'>"+correctRate+"%</span></li>").appendTo(r_AnalyList);
                }
            }
        },
        error : function(e){
            console.log(e)
        }
    })
}
//查看剩余知识点
function clickKnown(){
    var r_ShowList = $(".r_ShowList");
    var r_AnalyList = $(".r_AnalyList");
    r_ShowList.click(function(){
        r_AnalyList.css({"min-height":"3.63rem","max-height":"100rem"});
        $(this).hide();
    })
}
//点击补偿训练
function GoCover(){
    $('.r_ClickRain').on('click',function(){
        var status=$(this).attr('stuats');
        var subjectId = $(".r_Rnumber").attr("subjectId");
        var id = Request.id;
        var type = "0";
        var parmas = {};
        parmas.id = Request.id;
        parmas.status = status;
        parmas.subjectId = subjectId;
        parmas.type = type;
        javascript:bc.CreatCover(status,id,subjectId,type);
    });
}


