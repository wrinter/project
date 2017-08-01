CheckBrower();
//保存
$(".m_btnSave").click(function () {
    showMask(".mask", ".m_saveToList");
});
SystemRedMsg();
//弹出层 关闭
$("#c_closeG").click(function () {
    hideMask(".mask", ".m_saveToList");
});
//显示错题章节
if (Request.start == Request.end) {//只选单独的一章
    $(".paperName").html("错题训练(第" + Request.start + "章)");
} else {
    $(".paperName").html("错题训练(第" + Request.start + "~" + Request.end + "章)");
}
//将选入的题渲染过来
$(".source_txt .slot-list").html(store.get("errorPaper"));
$(".source_txt").find(".analysisBox").before("<div class='source_txt_btn'><span><a class='look' href='javascript:;'>解析</a><a class='delete' href='javascript:;'>删除</a></span><div class='clear'></div></div>");
//排序
function jobNumbers() {
    //规则：
    var jobList = $(".slot-list").find(".m_order");//获取题号列表
    $.each(jobList, function (i, obj) {
        $(obj).html((i + 1)+"、");
    });
}
jobNumbers();//初始化 排序
//查看解析
$(".look").on("click", function () {
    if ($(this).html() == "解析") {
        $(this).parent().parent().siblings(".analysisBox").fadeIn();
        $(this).html("收回");
    } else if ($(this).html() == "收回") {
        $(this).parent().parent().siblings(".analysisBox").fadeOut();
        $(this).html("解析");
    }
});
//删除
$(".delete").on("click", function () {
    var idStr = store.get("errorPaper");
    if ($(this).parent().parent().parent().attr("data-split") == 1) {
        if ($(this).parent().parent().parent().siblings(".lineBox").length == 0) {
            $(this).parent().parent().parent().siblings("._line").remove();
            $(this).parent().parent().parent().remove();
            var thisItem=$(this).parent().parent().parent().clone();
            $(thisItem).find(".source_txt_btn").remove();
            $(thisItem).find(".m_order").html("");
            $(thisItem).find(".analysisBox").css({"display":"none"});
            idStr=idStr.replace("<li class='everyQuestion saveLine' data-questionid='"+$(thisItem).attr("data-questionid")+"' data-split='"+$(thisItem).attr("data-split")+"' data-groupcode='"+$(thisItem).attr("data-groupcode")+"' data-grouporder='"+$(thisItem).attr("data-grouporder")+"'>"+thisItem.html()+"</li>","");
        } else {
            $(this).parent().parent().parent().remove();
            var thisItem=$(this).parent().parent().parent().clone();
            $(thisItem).find(".source_txt_btn").remove();
            $(thisItem).find(".m_order").html("");
            $(thisItem).find(".analysisBox").css({"display":"none"});
            idStr=idStr.replace("<li class='everyQuestion saveLine' data-questionid='"+$(thisItem).attr("data-questionid")+"' data-split='"+$(thisItem).attr("data-split")+"' data-groupcode='"+$(thisItem).attr("data-groupcode")+"' data-grouporder='"+$(thisItem).attr("data-grouporder")+"'>"+thisItem.html()+"</li>","");
        }
    } else {
        $(this).parent().parent().parent().remove();
        var thisItem=$(this).parent().parent().parent().clone();
        $(thisItem).find(".source_txt_btn").remove();
        $(thisItem).find(".m_order").html("");
        $(thisItem).find(".analysisBox").css({"display":"none"});
        idStr=idStr.replace("<li class='everyQuestion saveLine' data-questionid='"+$(thisItem).attr("data-questionid")+"' data-split='"+$(thisItem).attr("data-split")+"' data-groupcode='"+$(thisItem).attr("data-groupcode")+"' data-grouporder='"+$(thisItem).attr("data-grouporder")+"'>"+thisItem.html()+"</li>","");
        console.log("<li class='everyQuestion saveLine' data-questionid='"+$(thisItem).attr("data-questionid")+"' data-split='"+$(thisItem).attr("data-split")+"' data-groupcode='"+$(thisItem).attr("data-groupcode")+"' data-grouporder='"+$(thisItem).attr("data-grouporder")+"'>"+thisItem.html()+"</li>")
        console.log(idStr);
    }
    store.set("errorPaper",idStr);
    store.set("errorQuestionNum",Number(store.get("errorQuestionNum"))-1);
    jobNumbers();
});
//拖拽效果
$(".slot-list").sortable({
    stop: function (event, ui) {
        //嵌套：排列题号
        jobNumbers();
    }
});
function getSavaData() {
    var new_obj = {};
    new_obj.paperName = $(".paperName").html();
    new_obj.type = "119";
    new_obj.editorType = "2";
    new_obj.paperId = "";
    new_obj.testTime = parseInt($(".paperTime input").val());
    new_obj.knowledgeId = "";
    new_obj.status = "1";
    var line_array = []; // 试题行 数组
    var line_obj = {}; // 试题行 对象
    line_obj.showOrder = 1;
    line_obj.isShow = "0";
    line_obj.remarks = "";
    var linArr = [];
    $.each($(".slot-list li"), function (i, obj) {
        console.log(obj);
        var line_inner_obj = {}; // 试题行内小题 对象
        line_inner_obj.questionId = $(obj).attr("data-questionid");
      //  line_inner_obj.lnOrder = $(obj).find(".m_order").html()=="undefined"?$(obj).find(".m_order").html().replace("、",""):"";
        line_inner_obj.lnOrder =i+1;
        line_inner_obj.groupOrder = parseInt($(obj).attr("data-groupOrder"));
        line_inner_obj.isSplite = $(obj).attr("data-split");
        line_inner_obj.groupCode = $(obj).attr("data-groupcode");
        linArr.push(line_inner_obj);
    });
    line_obj.customLineTj = linArr;
    line_array.push(line_obj);
    new_obj.questionLines = line_array;
    console.log(new_obj);
    return new_obj;
}
function doneSave() {
    $(".btnExit").on("click", function () {
        var newObj = getSavaData();
        if(newObj.questionLines[0].customLineTj.length<=0){
            $('#c_ErrorMsg').html('没有选择错题！').fadeIn(200);
            Disappear("#c_ErrorMsg");
            return;
        }
        var param = JSON.stringify(newObj);
        $.ajax({
            type: "post",
            url: "/web/teacher/paper/assign/savecustompaper",
            data: param,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.retCode === "0000") {
                    var newPi = data.retData.paperId,//保存成功后返回的作业新id
                        newPt = data.retData.paperType,//保存成功后返回的作业新type
                        newAssignId = data.retData.assignId;//保存成功后返回的作业新保存记录id
                    if (!$("div").hasClass("c_Dissolve")) {
                        $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                    }
                    var _i = 2;
                    $('#c_ErrorMsg').html('保存成功,将在' + _i + '秒后返回').fadeIn(200);
                    //跳转倒计时
                    set();
                    function set() {
                        _i--;
                        $('#c_ErrorMsg').html('保存成功,将在' + _i + '秒后返回');
                        if (_i > 0) {
                            setTimeout(set, 1000);//_i大于0时每秒递归
                        } else {
                            get();//跳转
                        }
                    }
                    //跳转方法
                    function get() {
                        window.location.href = "me_pubAndPrint.html?paperId=" + newPi + "&paperType=" + newPt+ "&assignId=" + newAssignId;
                    }
                } else {
                    if (!$("div").hasClass("c_Dissolve")) {
                        $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                    }
                    $('#c_ErrorMsg').html('保存失败').fadeIn(200);
                    Disappear("#c_ErrorMsg");
                }
            },
            error: function () {
                if (!$("div").hasClass("c_Dissolve")) {
                    $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                }
                $('#c_ErrorMsg').html('请求失败').fadeIn(200);
                Disappear("#c_ErrorMsg");
            }
        });
    });
    $(".btnBack").click(function(){
        window.location.href = "../me/me_publishError.html";
    })
}
doneSave();

