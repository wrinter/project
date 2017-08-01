/**
 * Created by wcd on 2017/2/13.
 */
SystemRedMsg();
var thisId = Request.id,//获取栏目id
    thisActive = Request.ac,//获取课时id
    thisPt = Request.pt,//获取试卷type
    thisTi,
    thisPi = Request.pi,//获取试卷paperId
    thisAi = Request.ai,//获取试卷保存地址id
    thisSt = Request.st;//获取试卷布置状态status
//获取试卷内容
function getSavePaper(){
    var param={};
    param.paperType=Request.paperType;
    param.paperId=Request.paperId;
    $.ajax({
        type: "post",
        url: "/web/teacher/paper/assign/paperinfowithidtype",
        data: param,
        dataType: "json",
        success:function (data) {
            var list=data.retData;
            console.log(list);
            var li="";
            li+="<div class='paperName'>"+list.paperName+"</div>";
            /*li+="<div class='testTime'>建议用时："+list.testTime+"分</div>";*/
            thisTi = list.testTime;
            $.each(list.questionLines,function(i,obj){
               li+="<ul class='slot-list'>";
                $.each(obj.questionGroup,function(i,obj){
                    if(obj.groupCode){ //组合题
                        if(obj.isSplite==1){ //可拆分组合题
                            li+="<li style='overflow: hidden;' class='slot-item'>";
                            li+="<ul>";
                            li+="<li class='_line saveLine' data-groupCode='"+obj.groupCode+"' data-split='"+obj.isSplite+"' data-questionId='"+obj.questionId+"' data-typeid='"+obj.questionTypeId+"' data-groupOrder='"+obj.groupOrder+"'>"+obj.content.replace("【材料】","")+"</li>";
                            // li+="<div class='lineBoxes'>";
                            $.each(obj.questions,function(i,obj){
                                li+="<li class='lineBox saveLine' data-split='"+obj.isSplite+"' data-groupcode='"+obj.groupCode+"' data-typeid='"+obj.questionTypeId+"' data-questionId='"+obj.questionId+"' data-groupOrder='"+obj.groupOrder+"'>";
                                li+="<div id='"+obj.questionId+"' class='questionContext' >"+obj.questionTitle.replace("【题干】","<span class='m_order'></span>")+"</div>";
                                li+="<div class='option optionA'>"+obj.optionA+"</div>";
                                li+="<div class='option optionB'>"+obj.optionB+"</div>";
                                li+="<div class='option optionC'>"+obj.optionC+"</div>";
                                li+="<div class='option optionD'>"+obj.optionD+"</div>";
                                li+="<div class='source_txt_btn'><span><a class='lookExplore fr' href='javascript:;'>查看解析</a></span></div>";
                                li+="<div class='analysisBox'>";
                                $.each(obj.labels,function(i,obj){//解析
                                    if(obj.questionType=="03"||obj.questionType=="05"||obj.questionType=="07"){
                                        li+="<div id='"+obj.questionId+"'>"+obj.content+"</div>";
                                    }
                                });
                                li+="</div>";
                                li+="</li>";
                            });
                            li+="</ul>";
                            li+="</li>";
                        }else{ //不可拆分组合题
                          console.log(obj);
                            li+="<li class='slot-item lineBox' data-unitStart='"+obj.code+"' data-unitEnd='"+obj.code+"'>"+obj.content.replace("【材料】","");
                            $.each(obj.questions,function(i,obj){
                                console.log(i);
                                li+="<div  data-split='"+obj.isSplite+"' data-groupcode='"+obj.groupCode+"' data-typeid='"+obj.questionTypeId+"'>";
                                li+="<div id='"+obj.questionId+"' class='questionContext saveLine' data-split='"+obj.isSplite+"' data-groupcode='"+obj.groupCode+"' data-typeid='"+obj.questionTypeId+"'>"+obj.questionTitle.replace("【题干】","<span class='m_order'></span>")+"</div>";
                                li+="<div class='option optionA'>"+obj.optionA+"</div>";
                                li+="<div class='option optionB'>"+obj.optionB+"</div>";
                                li+="<div class='option optionC'>"+obj.optionC+"</div>";
                                li+="<div class='option optionD'>"+obj.optionD+"</div>";
                                li+="</div>";
                            });
                            li+="<div class='source_txt_btn'><span><a class='lookExplore fr' href='javascript:;'>查看解析</a></span></div>";
                            li+="<div class='analysisBox'>";
                            $.each(obj.labels,function(i,obj){//解析
                                if(obj.questionType=="03"||obj.questionType=="05"||obj.questionType=="07"){
                                    li+="<div id='"+obj.questionId+"'>"+obj.content+"</div>";
                                }
                            });
                            li+="</div>";
                            li+="</li>";
                        }
                    }else { //单题
                        li+="<li class='lineBox slot-item'>";
                        $.each(obj.questions,function(i,obj){
                            li+="<div class='saveLine questionContext' data-questionid='"+obj.questionId+"' data-typeid='"+obj.questionTypeId+"' data-split='"+obj.isSplite+"' data-groupcode='"+obj.groupCode+"' data-groupcode='"+obj.groupCode+"'>"+obj.questionTitle.replace("【题干】","<span class='m_order'></span>")+"</div>";
                            li+="<div class='option optionA'>"+obj.optionA+"</div>";
                            li+="<div class='option optionB'>"+obj.optionB+"</div>";
                            li+="<div class='option optionC'>"+obj.optionC+"</div>";
                            li+="<div class='option optionD'>"+obj.optionD+"</div>";
                            li+="<div class='source_txt_btn'><span><a class='lookExplore fr' href='javascript:;'>查看解析</a></span></div>";
                            li+="<div class='analysisBox'>";
                            $.each(obj.labels,function(i,obj){//解析
                                if(obj.questionType=="03"||obj.questionType=="05"||obj.questionType=="07"){
                                    li+="<div id='"+obj.questionId+"'>"+obj.content+"</div>";
                                }
                            });
                            li+="</div>";
                        });
                        li+="</li>";
                    }
                });
                li+="</ul>";
            });
            $(".m_paper").html(li.replace(/null/g,""));
            //查看解析
            $(".source_txt_btn").on("click",".lookExplore",function(e){
                stopBubble(e);
                $(this).parent().parent().siblings(".analysisBox").toggle();
                if($(this).text()=="查看解析"){
                    $(this).text("收起解析");
                }else if($(this).text()=="收起解析"){
                    $(this).text("查看解析");
                }
            });
            jobNumbers();//页面初始化
           /* //删除
           $(".del").on("click", function () {
                if ($(this).parent().parent().parent().attr("data-split") == 1) {
                    if ($(this).parent().parent().parent().siblings(".lineBox").length == 0) {
                        $(this).parent().parent().parent().siblings("._line").remove();
                        $(this).parent().parent().parent().remove();
                    } else {
                        $(this).parent().parent().parent().remove();
                    }
                } else {
                    $(this).parent().parent().parent().remove();
                }
                jobNumbers();
            });*/
        }
    })
}
//jobNumbers();
getSavePaper();
$(".slot-item").on("click",".del", function () {
    if ($(this).parent().parent().parent().attr("data-split") == 1) {
        if ($(this).parent().parent().parent().siblings(".lineBox").length == 0) {
            $(this).parent().parent().parent().siblings("._line").remove();
            $(this).parent().parent().parent().remove();
        } else {
            $(this).parent().parent().parent().remove();
        }
    } else {
        $(this).parent().parent().parent().remove();
    }
    jobNumbers();
});
//布置
$(".m_btnPublish").click(function(){
    toSavePaper({
        paperId : Request.paperId,
        paperName : $(".paperName").html(),
        testTime : thisTi,
        paperType : "119",
        assignId : Request.assignId,
    });
});
//打印
$(".m_btnLayout").click(function(){
    showMask(".mask",".m_publish");
});
//弹出层 关闭
$("#c_closeG1").click(function(){
    hideMask(".mask",".m_publish");
});
//无解析打印
$(".noAnalyze").on("click",function(){
    $("#w_Print_Main").html("");//清空
    $(".source_txt_btn").css({"display":"none"});
    $("#w_Print_Main").append($(".slot-list").html());
    $("#w_Print").jqprint();
    $(".source_txt_btn").css({"display":"block"});
});
//有解析打印
$(".hasAnalyze").on("click",function(){
    $("#w_Print_Main").html("");//清空
    $(".source_txt_btn").css({"display":"none"});
   $(".analysisBox").css("display","block");
    $("#w_Print_Main").append($(".m_paper").html());
    $("#w_Print").jqprint();
    $(".source_txt_btn").css({"display":"block"});
    $(".analysisBox").css("display","none");
});
css();
function css(){
    $.ajax({
        type:"post",
        url:"/web/common/commonStyle",
        dataType:"json",
        success:function(data){
            console.log(data);
            if(data.retCode == "0000"){
                var retData = data.retData;
                //console.log(retData);
                //retData.appendTo("head");
                $("head").append(retData);
            }
        },
        error:function(e){
            console.log(e)
        }
    })
}
//排序
function jobNumbers() {
    //规则：
    var jobList = $(".slot-list").find(".m_order");//获取题号列表
    $.each(jobList, function (i,obj) {
        $(obj).html((i + 1)+"、");
    });
}