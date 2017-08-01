

/**
 * Created by 王长栋 on 2016/11/22.
 */
SystemRedMsg();
/******************************获取导航*******************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
var kownledgerTree = {
    'cell':[],
    'chapter':{},
    'subjectId':''
};
//面包屑导航
var unitArr=[];//用来存放章节
//获取一级目录
function getFirst() {
    var param={};
    $.ajax({
        type: "get",
        url: "/web/teacher/center/wrongbook/knowledge",
        data: param,
        dataType: "json",
        success:function(data){
            constructData(data);
            createKownledge();
        }
    });
}
getFirst();
//通过选择章节，查询错题记录
//testPaper("",1,3);
$(".error_level").on("click",".every_level",function(){
    $(this).addClass("l_active").siblings().removeClass("l_active");
    var pid = $(this).parent().attr('id');
    var cid = this.id;
    if(pid=="m_cell"){
        var cList = kownledgerTree.chapter[cid];
        if(cList!=undefined) {
            var htm = '';
            htm += "<span>" + cList[0].levelName + ":</span>";
            for (var i = 0; i < cList.length; i++) {
                htm += "<span class='every_level' id='" + cList[i].id + "'>" + cList[i].name + "</span>";
            }
            $("#m_chapter").html(htm);
            $("#m_chapter").find(".every_level:first").addClass("l_active");
            testPaper(cList[0].id, 1, 3);
            store.set('Unitid', cList[0].id);
        }else{
            testPaper(cid,1,3);
            store.set('Unitid',cid);
        }
    }else{
        testPaper(cid,1,3);
        store.set('Unitid',cid);
    }
});
var idStr=store.get("errorPaper");//用来保存选中的题目
function constructData(data){
    if(data.retCode=='0000'){
        var list = data.retData;
        if(list.length>0){
            kownledgerTree.subjectId = list[0].subjectId;
            for(var i=0;i<list.length;i++){
                var cell = {},chapters=[];
                cell.id = list[i].knowledgeId;
                cell.name = list[i].name;
                cell.levelName = list[i].levelName;
                kownledgerTree.cell.push(cell);
                var cList = list[i].childrens;
                if(cList.length>0){
                    for(var j=0;j<cList.length;j++){
                        var chapter={};
                        chapter.id = cList[j].knowledgeId;
                        chapter.name = cList[j].name;
                        chapter.levelName = cList[j].levelName;
                        chapters.push(chapter);
                    }
                    kownledgerTree.chapter[list[i].knowledgeId] = chapters;
                }
            }
        }
    }
}
function createKownledge(){
    var arrId = "";
    //生成单元
    var list = kownledgerTree.cell;
    var li = "";
    li += "<span>" + list[0].levelName + ":</span>";
    if(kownledgerTree.subjectId!='07'){
        li += "<span class='every_level all' id=''>" + '全部' + "</span>";
    }
    for (var k = 0; k < list.length; k++) {
        li += "<span class='every_level' id='" + list[k].id + "'>" + list[k].name + "</span>";
        if (k < list.length - 1) {
            arrId += list[k].id + ",";
        } else {
            arrId += list[k].id;
        }
    }
    store.set("arrId", arrId);
    $("#m_cell").html(li);
    $("#m_cell").find(".every_level:first").addClass("l_active");
    //生成章节
    var htm = '';
    var cList = kownledgerTree.chapter[list[0].id];
    if(cList!=undefined&&cList.length>0){
        htm += "<span>" + cList[0].levelName + ":</span>";
        for(var i=0;i<cList.length;i++){
            htm += "<span class='every_level' id='" + cList[i].id + "'>" + cList[i].name + "</span>";
        }
        $("#m_chapter").html(htm);
        $("#m_chapter").find(".every_level:first").addClass("l_active");
        testPaper(cList[0].id,1,3);
        store.set('Unitid',cList[0].id);
    }else{
        var cellId = $('.every_level:first').attr('id');
        testPaper(cellId,1,3);
        store.set('Unitid',cellId);
    }
}
//展示错题 接口
function testPaper(id,pageNum,pageSize) {
    var param={};
    param.knowLedgeList = id;
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    $.ajax({
        type:"get",
        url:"/web/teacher/center/wrongbook",
        data:param,
        dataType:"json",
        success:function(data){
            if(data.retCode=="0000"){
                var list=data.retData.list;
                var li="";
                if(list.length == 0){
                    li += "<img class='noImg' src='../../../static/image/kola/no.png'>";
                    $(".Paging").hide();
                }else{
                    $(".Paging").show();
                    for(var i in list){
                        /*判断是组题还是单题---单题：groupCode==null组题：groupCode！=null*/
                        if(list[i].groupCode==null){
                            $.each(list[i].questions,function(i,obj){
                                li += "<ul class='source_txt slot-list'>";
                                li+="<li class='lineBox slot-item' data-questionid='"+obj.questionId+"' data-typeid='"+obj.questionTypeId+"' data-split='"+obj.isSplite+"' data-groupcode='"+obj.groupCode+"' data-groupcode='"+obj.groupCode+"' data-groupOrder='"+obj.groupOrder+"'>";
                                li+="<div class='saveLine questionContext savePaper'>"+obj.questionTitle.replace("题干","<span class='m_order'></span>").replace("【","").replace("】","")+"<span class='addAndRemove'><a class='_add' style='display: block' href='javascript:;'><img src='../../../static/image/me/m_add.png'></a><a class='_reduce' href='javascript:;'><img src='../../../static/image/me/m_reduce.png'></a></span></div>";
                                li+="<div class='option optionA'>"+obj.optionA+"</div>";
                                li+="<div class='option optionB'>"+obj.optionB+"</div>";
                                li+="<div class='option optionC'>"+obj.optionC+"</div>";
                                li+="<div class='option optionD'>"+obj.optionD+"</div>";
                                li+="<div class='source_txt_btn'><a class='lookExplore' href='javascript:;'>查看解析</a><a class='paperChanged' href='javascript:;'>变式题</a></div>";
                                li+="<div class='analysisBox'>";
                                $.each(obj.labels,function(i,obj){//解析
                                    if(obj.questionType=="03"||obj.questionType=="05"||obj.questionType=="07"){
                                        li+="<div id='"+obj.questionId+"'>"+obj.content+"</div>";
                                    }
                                });
                                li+="</div>";
                                li+="<div class='analysisChanged'></div>";
                                li+="</li>";
                                li+="</ul>"
                            });
                        }else{
                            /*判断是可拆还是不可拆---可拆：isSplite==1 不可拆：isSplite==0*/
                            if(list[i].isSplite == 1){
                                li+="<ul class='source_txt slot-list'>";
                                li+="<ul style='overflow: hidden;' class='slot-item' data-groupCode='"+list[i].groupCode+"' data-split='"+list[i].isSplite+"' data-questionId='"+list[i].questionId+"' data-typeid='"+list[i].questionTypeId+"' data-groupOrder='"+list[i].groupOrder+"'>";
                                li+="<li class='_line saveLine'>"+list[i].content.replace("材料","<span class='m_order'></span>").replace("【","").replace("】","")+"</li>";
                                $.each(list[i].questions,function(i,obj){
                                    li+="<li class='lineBox saveLine savePaper' data-split='"+obj.isSplite+"' data-groupcode='"+obj.groupCode+"' data-typeid='"+obj.questionTypeId+"' data-questionId='"+obj.questionId+"' data-groupOrder='"+obj.groupOrder+"'>";
                                    li+="<div id='"+obj.questionId+"' class='questionContext' data-questionid='"+obj.questionId+"'>"+obj.questionTitle.replace("题干","").replace("【","").replace("】","")+"</div>";
                                    li+="<div class='option optionA'>"+obj.optionA+"</div>";
                                    li+="<div class='option optionB'>"+obj.optionB+"</div>";
                                    li+="<div class='option optionC'>"+obj.optionC+"</div>";
                                    li+="<div class='option optionD'>"+obj.optionD+"</div>";
                                    li+="<div class='source_txt_btn'><a class='lookExplore' href='javascript:;'>查看解析</a><a class='paperChanged' href='javascript:;'>变式题</a></div>";
                                    li+="<div class='analysisBox'>";
                                    $.each(obj.labels,function(i,obj){//解析
                                        if(obj.questionType=="03"||obj.questionType=="05"||obj.questionType=="07"){
                                            li+="<div id='"+obj.questionId+"'>"+obj.content+"</div>";
                                        }
                                    });
                                    li+="</div>";
                                    li+="<div class='analysisChanged'></div>";
                                    li+="</li>";
                                });
                                li+="<div class='source_txt_btn'><span style='float:right;margin-right:20px;'><a class='_add' href='javascript:;'><img src='../../../static/image/me/m_add.png'></a><a class='_reduce' href='javascript:;'><img src='../../../static/image/me/m_reduce.png'></a></span></div>";
                                li+="</ul>";
                                li+="</ul>";
                            }else if(list[i].isSplite == 0){
                                li += "<ul class='source_txt slot-list'>";
                                li+="<li class='slot-item lineBox saveLine' id='"+list[i].questionId+"' class='questionContext' data-questionid='"+list[i].questionId+"' data-split='"+list[i].isSplite+"' data-groupcode='"+list[i].groupCode+"' data-typeid='"+list[i].questionTypeId+"' data-groupOrder='"+list[i].groupOrder+"'>"+list[i].content.replace("材料","<span class='m_order'></span>").replace("【","").replace("】","");
                                $.each(list[i].questions,function(i,obj){
                                    li+="<div  data-split='"+obj.isSplite+"' data-groupcode='"+obj.groupCode+"' data-typeid='"+obj.questionTypeId+"' data-groupOrder='"+obj.groupOrder+"'>";
                                    li+="<div id='"+obj.questionId+"' class='questionContext saveLine' data-questionid='"+obj.questionId+"' data-split='"+obj.isSplite+"' data-groupcode='"+obj.groupCode+"' data-typeid='"+obj.questionTypeId+"' data-groupOrder='"+obj.groupOrder+"'>"+obj.questionTitle.replace("【题干】","")+"</div>";
                                    li+="<div class='option optionA'>"+obj.optionA+"</div>";
                                    li+="<div class='option optionB'>"+obj.optionB+"</div>";
                                    li+="<div class='option optionC'>"+obj.optionC+"</div>";
                                    li+="<div class='option optionD'>"+obj.optionD+"</div>";
                                    li+="</div>";
                                });
                                li+="<div class='source_txt_btn'><a class='lookExplore' href='javascript:;'>查看解析</a><a class='paperChanged' href='javascript:;'>变式题</a><span class='addAndRemove nopo'><a class='_add' style='display: block' href='javascript:;'><img src='../../../static/image/me/m_add.png'></a><a class='_reduce' href='javascript:;'><img src='../../../static/image/me/m_reduce.png'></a></span></div>";
                                li+="<div class='analysisBox'>";
                                $.each(list[i].labels,function(i,obj){//解析
                                    if(obj.questionType=="03"||obj.questionType=="05"||obj.questionType=="07"){
                                        li+="<div id='"+obj.questionId+"'>"+obj.content+"</div>";
                                    }
                                });
                                li+="</div>";
                                li+="<div class='analysisChanged'></div>";
                                li+="</li>";
                                li += "</ul>";
                            }
                        }
                    }
                }
                $(".error_source_txt").html(li.replace(/null/g,""));
                //变式题
                var i=0;//初始化点击次数
                $(".source_txt_btn").on("click",".paperChanged",function(e){
                    if(!$(this).hasClass("hasChange")){
                        $(this).addClass("hasChange");
                        $(this).parent().siblings(".analysisChanged").css({"display":"block"});
                        var param={};
                        var questionId=$(this).parent().parent().attr("data-questionid");
                        var that=this;
                        param.questionId=questionId;
                        $.ajax({
                            type:"post",
                            url:"/web/teacher/center/wrongbook/similar",
                            data:param,
                            dataType:"json",
                            success:function(data){
                                if(data.retCode=="2001"){
                                    $('#c_ErrorMsg').html(data.retMsg).fadeIn(200); Disappear("#c_ErrorMsg");
                                    return;
                                }
                                if(data.retCode=="0000"){
                                    var _li="";
                                    var list=data.retData;
                                    _li+="<div class='reflesh'>【变式】"+"<img src='../../../static/image/me/m_reflesh.png' alt='刷新'>"+"换一个</div>";
                                    _li+="<div class='changedTitle' id='"+list.questionId+"' data-questionid='"+list.questionId+"' data-typeid='"+list.questionTypeId+"' data-split='"+list.isSplite+"' data-groupOrder='"+list.groupOrder+"'data-groupcode='"+list.groupCode+"'>";
                                    _li+="<div class='questionContextChanged' id='"+list.questionId+"' data-questionid='"+list.questionId+"' data-typeid='"+list.questionTypeId+"' data-split='"+list.isSplite+"' data-groupOrder='"+list.groupOrder+"' data-groupcode='"+list.groupCode+"'>"+list.questionContext.replace("【题干】","<span class='m_order'></span>")+"<span class='addAndRemove' style='display: block'><a class='_add' style='display: block' href='javascript:;'><img src='../../../static/image/me/m_add.png'></a><a class='_reduce' style='display: none' href='javascript:;'><img src='../../../static/image/me/m_reduce.png'></a></span></div>";
                                    _li+="<div class='option optionAChanged'>"+list.optionA+"</div>";
                                    _li+="<div class='option optionBChanged'>"+list.optionB+"</div>";
                                    _li+="<div class='option optionCChanged'>"+list.optionC+"</div>";
                                    _li+="<div class='option optionDChanged'>"+list.optionD+"</div>";
                                    _li+="<div class='source_txt_btn'><a class='change_lookExplore' href='javascript:;'>查看解析</a></div>";
                                    _li+="<div class='analysisBox'>";
                                    $.each(list.labels,function(i,obj){//解析
                                        if(obj.questionType=="03"||obj.questionType=="05"||obj.questionType=="07"){
                                            _li+="<div id='"+obj.questionId+"'>"+obj.content+"</div>";
                                        }
                                    });
                                    _li+="</div>";
                                    _li+="</div>";
                                    $(that).parent(".source_txt_btn").siblings(".analysisChanged").html(_li.replace(/null/g,""));
                                    /*$("._reduce").css({"display":"none"});*/
                                }
                            }
                        });
                    }else{
                        $(this).removeClass("hasChange");
                        $(this).parent().siblings(".analysisChanged").css({"display":"none"});
                    }
                });
                //刷新错题
                $(".analysisChanged").on("click",".reflesh",function(){
                    var param={};
                    var questionId=$(this).parent().parent().attr("data-questionid");
                    var that=this;
                    param.questionId=questionId;
                    $.ajax({
                        type:"post",
                        url:"/web/teacher/center/wrongbook/similar",
                        data:param,
                        dataType:"json",
                        success:function(data){
                            if(data.retCode=="2001"){
                                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200); Disappear("#c_ErrorMsg");
                                return;
                            }
                            if(data.retCode=="0000"){
                                var _li="";
                                var list=data.retData;
                                _li+="<div class='reflesh'>【变式】"+"<img src='../../../static/image/me/m_reflesh.png' alt='刷新'>"+"换一个</div>";
                                _li+="<div class='changedTitle' id='"+list.questionId+"' data-questionid='"+list.questionId+"' data-typeid='"+list.questionTypeId+"' data-split='"+list.isSplite+"' data-groupOrder='"+list.groupOrder+"'data-groupcode='"+list.groupCode+"'>";
                                _li+="<div class='questionContextChanged saveLine' id='"+list.questionId+"' data-questionid='"+list.questionId+"' data-typeid='"+list.questionTypeId+"' data-split='"+list.isSplite+"'  data-groupOrder='"+list.groupOrder+"' data-groupcode='"+list.groupCode+"'>"+list.questionContext.replace("【题干】","<span class='m_order'></span>")+"<span class='addAndRemove' style='display: block'><a style='display: block' class='_add' href='javascript:;'><img src='../../../static/image/me/m_add.png'></a><a class='_reduce' style='display: none' href='javascript:;'><img src='../../../static/image/me/m_reduce.png'></a></span></div>";
                                _li+="<div class='option optionAChanged'>"+list.optionA+"</div>";
                                _li+="<div class='option optionBChanged'>"+list.optionB+"</div>";
                                _li+="<div class='option optionCChanged'>"+list.optionC+"</div>";
                                _li+="<div class='option optionDChanged'>"+list.optionD+"</div>";
                                _li+="<div class='source_txt_btn'><a class='change_lookExplore' href='javascript:;'>查看解析</a></div>";
                                _li+="<div class='analysisBox'>";
                                $.each(list.labels,function(i,obj){//解析
                                    if(obj.questionType=="03"||obj.questionType=="05"||obj.questionType=="07"){
                                        _li+="<div id='"+obj.questionId+"'>"+obj.content+"</div>";
                                    }
                                });
                                _li+="</div>";
                                _li+="</div>";
                                $(that).parent(".analysisChanged").html(_li.replace(/null/g,""));
                            }
                        }
                    });
                });
                //查看 变式题的解析
                $(".analysisChanged").on("click",".change_lookExplore",function(e){
                    stopBubble(e);
                    $(this).parent().siblings(".analysisBox").toggle();
                    if($(this).text()=="查看解析"){
                        $(this).text("收起解析");
                        $(this).css("background","#65b113");
                        $(this).css("color","#fff");
                        $(this).css("border","1px solid #65b113");
                    }else if($(this).text()=="收起解析"){
                        $(this).text("查看解析");
                        $(this).css("background","#fff");
                        $(this).css("color","#000");
                        $(this).css("border","1px solid #ccc");
                    }
                });
                //取消键
                $("._reduce").css({"display":"none"});
                //添加键
                $(".slot-item").off();
                $(".slot-item").on("click","._add",function(e){
                    stopBubble(e);
                    unitArr.push($(this).parents(".slot-item").attr("data-unitstart"));
                    unitArr.sort(function(a,b){
                        return a-b;
                    });
                    $(this).css({"display":"none"});
                    $(this).siblings("._reduce").css({"display":"block"});
                    if($(this).parent().parent().parent().find(".lineBox").attr("data-split")==1){
                        var thisItem=$(this).parent().parent().parent().clone();
                        $(thisItem).find(".source_txt_btn").remove();
                        $(thisItem).find(".analysisChanged").remove();
                        $(thisItem).find(".addAndRemove").remove();
                        $(thisItem).find(".m_order").html("");
                        //$(thisItem).find(".analysisChanged").css({"display":"none"});
                        $(thisItem).find(".analysisBox").css({"display":"none"});
                        var questionid = '';
                        if($(thisItem).hasClass('changedTitle')){
                            questionid = $(this).parent().parent().attr("data-questionid");
                        }else{
                            questionid = $(thisItem).attr("data-questionid");
                        }
                        if(store.get("errorPaper").indexOf(questionid)<0){
                            idStr+="<li class='everyQuestion saveLine' data-questionid='"+$(thisItem).attr("data-questionid")+"' data-split='"+$(thisItem).attr("data-split")+"' data-groupcode='"+$(thisItem).attr("data-groupcode")+"' data-grouporder='"+$(thisItem).attr("data-grouporder")+"'>"+thisItem.html()+"</li>";
                            store.set("errorPaper",idStr);
                            store.set("errorQuestionNum",1+Number(store.get("errorQuestionNum")));
                            $(".m_seclectNum").html(Number($(".m_seclectNum").html())+$(this).parent().parent().parent().find(".lineBox").length);
                        }
                    }else if($(this).parent().parent().parent().find(".lineBox").attr("data-split")==0){
                        //克隆试题
                        var thisItem=$(this).parent().parent().parent().clone();
                        $(thisItem).find(".source_txt_btn").remove();
                        $(thisItem).find(".analysisChanged").remove();
                        $(thisItem).find(".addAndRemove").remove();
                        $(thisItem).find(".m_order").html("");
                        var questionid = '';
                        if($(thisItem).hasClass('changedTitle')){
                            questionid = $(this).parent().parent().attr("data-questionid");
                        }else{
                            questionid = $(thisItem).attr("data-questionid");
                        }
                        // $(thisItem).find(".analysisChanged").css({"display":"none"});
                        $(thisItem).find(".analysisBox").css({"display":"none"});
                        if(store.get("errorPaper").indexOf(questionid)<0){
                            idStr+="<li class='everyQuestion saveLine' data-questionid='"+$(thisItem).attr("data-questionid")+"' data-split='"+$(thisItem).attr("data-split")+"' data-groupcode='"+$(thisItem).attr("data-groupcode")+"' data-grouporder='"+$(thisItem).attr("data-grouporder")+"'>"+thisItem.html()+"</li>";
                            store.set("errorPaper",idStr);
                            store.set("errorQuestionNum",1+Number(store.get("errorQuestionNum")));
                            $(".m_seclectNum").html(Number($(".m_seclectNum").html())+1);
                        }
                    }else{
                        //克隆试题
                        var thisItem=$(this).parent().parent().parent().clone();
                        $(thisItem).find(".source_txt_btn").remove();
                        $(thisItem).find(".analysisChanged").remove();
                        $(thisItem).find(".addAndRemove").remove();
                        $(thisItem).find(".m_order").html("");
                        var questionid = '';
                        if($(thisItem).hasClass('changedTitle')){
                            questionid = $(this).parent().parent().attr("data-questionid");
                        }else{
                            questionid = $(thisItem).attr("data-questionid");
                        }
                        // $(thisItem).find(".analysisChanged").css({"display":"none"});
                        $(thisItem).find(".analysisBox").css({"display":"none"});
                        if(store.get("errorPaper").indexOf(questionid)<0){
                            idStr+="<li class='everyQuestion saveLine' data-questionid='"+$(thisItem).attr("data-questionid")+"' data-split='"+$(thisItem).attr("data-split")+"' data-groupcode='"+$(thisItem).attr("data-groupcode")+"' data-grouporder='"+$(thisItem).attr("data-grouporder")+"'>"+thisItem.html()+"</li>";
                            store.set("errorPaper",idStr);
                            store.set("errorQuestionNum",1+Number(store.get("errorQuestionNum")));
                            $(".m_seclectNum").html(Number($(".m_seclectNum").html())+1);
                        }
                    }
                });
                //取消键
                $(".slot-item").on("click","._reduce",function(){
                    $(this).css({"display":"none"});
                    $(this).siblings("._add").css({"display":"block"});
                    console.log($(this).parent().parent().parent().attr("data-split"));
                    if($(this).parent().parent().find(".lineBox").attr("data-split")==1){
                        $(".m_seclectNum").html(Number($(".m_seclectNum").html())-$(this).parent().parent().parent().find(".lineBox").length);
                        var thisItem=$(this).parent().parent().parent().clone();
                        $(thisItem).find(".source_txt_btn").remove();
                        $(thisItem).find(".analysisChanged").remove();
                        $(thisItem).find(".addAndRemove").remove();
                        $(thisItem).find(".m_order").html("");
                        $(thisItem).find(".analysisBox").css({"display":"none"});
                        idStr=idStr.replace("<li class='everyQuestion saveLine' data-questionid='"+$(thisItem).attr("data-questionid")+"' data-split='"+$(thisItem).attr("data-split")+"' data-groupcode='"+$(thisItem).attr("data-groupcode")+"' data-grouporder='"+$(thisItem).attr("data-grouporder")+"'>"+thisItem.html()+"</li>","");

                    }else if($(this).parent().parent().parent().attr("data-split")==0){
                        $(".m_seclectNum").html(Number($(".m_seclectNum").html())-1);
                        //克隆试题
                        var thisItem=$(this).parent().parent().parent().clone();
                        $(thisItem).find(".source_txt_btn").remove();
                        $(thisItem).find(".analysisChanged").remove();
                        $(thisItem).find(".addAndRemove").remove();
                        $(thisItem).find(".m_order").html("");
                        // $(thisItem).find(".analysisChanged").css({"display":"none"});
                        $(thisItem).find(".analysisBox").css({"display":"none"});
                        idStr=idStr.replace("<li class='everyQuestion saveLine' data-questionid='"+$(thisItem).attr("data-questionid")+"' data-split='"+$(thisItem).attr("data-split")+"' data-groupcode='"+$(thisItem).attr("data-groupcode")+"' data-grouporder='"+$(thisItem).attr("data-grouporder")+"'>"+thisItem.html()+"</li>","");
                    }else{
                        $(".m_seclectNum").html(Number($(".m_seclectNum").html())-1);
                        //克隆试题
                        var thisItem=$(this).parent().parent().parent().clone();
                        $(thisItem).find(".source_txt_btn").remove();
                        $(thisItem).find(".analysisChanged").remove();
                        $(thisItem).find(".addAndRemove").remove();
                        $(thisItem).find(".m_order").html("");
                        $(thisItem).find(".analysisBox").css({"display":"none"});
                        idStr=idStr.replace("<li class='everyQuestion saveLine' data-questionid='"+$(thisItem).attr("data-questionid")+"' data-split='"+$(thisItem).attr("data-split")+"' data-groupcode='"+$(thisItem).attr("data-groupcode")+"' data-grouporder='"+$(thisItem).attr("data-grouporder")+"'>"+thisItem.html()+"</li>","");
                    }
                    store.set("errorPaper",idStr);
                    store.set("errorQuestionNum",Number(store.get("errorQuestionNum"))-1);
                });
                $(".slot-item").hover(function () {
                    $(this).find(".addAndRemove").fadeIn();
                },function () {
                    $(this).find(".addAndRemove").fadeOut();
                });
                //查看解析
                $(".source_txt_btn").on("click",".lookExplore",function(e){
                    stopBubble(e);
                    $(this).parent().siblings(".analysisBox").toggle();
                    if($(this).text()=="查看解析"){
                        $(this).text("收起解析");
                        $(this).css("background","#65b113");
                        $(this).css("color","#fff");
                        $(this).css("border","1px solid #65b113");
                    }else if($(this).text()=="收起解析"){
                        $(this).text("查看解析");
                        $(this).css("background","#fff");
                        $(this).css("color","#000");
                        $(this).css("border","1px solid #ccc");
                    }
                });
                jobNumbers();
                Paging(data.retData.pages,data.retData.pageNum);
            }
        }
    });
}
/*
 //弹出层    设置   加事件绑定
 $(".error_source_txt").on("click",".m_set",function () {
 showMask(".mask",".errorPer");
 });
 $("#c_closeG1").click(function(){
 hideMask(".mask",".errorPer");});
 // 弹出层 报错
 $("#c_closeG2").click(function(){
 hideMask(".mask",".m_submitErrors");
 });
 //弹出层 错误率
 $(".m_select").click(function(){
 $(".errorPerCon ul").slideToggle();
 });
 $(".m_select ul li").click(function(){
 $(".m_selectSpan").html($(this).html());
 });
 //错题率接口
 getNowError();//一进入页面，获取当前错题率
 $(".m_btnPer").click(function(){
 getError();//更新错题率
 });

 //一进入页面，获取当前错题率
 function getNowError(){
 $.ajax({
 type: "post",
 url: "/web/teacher/center/wrongbook/wrongrate",
 async: false,
 dataType:"json",
 success:function(data1){
 if(data1.retCode=="0000"){
 var nowRate= data1.retData;
 nowRate=  nowRate*100+"%";
 $(".m_selectSpan").html(nowRate);
 }
 }
 });
 }
 //更新错题率
 function getError(){
 var param={};
 var perVal= $(".m_selectSpan").html();
 var arr=perVal.split("%");
 var errorPercent=arr[0]/100;
 param.wrongRate=errorPercent;
 $.ajax({
 type: "post",
 url: "/web/teacher/center/wrongrate",
 data:param,
 dataType:"json",
 success:function(data){
 hideMask(".mask",".errorPer");
 if(!$("div").hasClass("c_Dissolve")){
 $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
 }
 $('#c_ErrorMsg').html('错题率更新成功').fadeIn(200);  Disappear("#c_ErrorMsg");
 }
 });
 }*/
//报错 取消按钮
$(".m_submitErrorsCancel").click(function(){
    window.location.reload();
});
//跳转到预览界面
$(".m_paperBoxPreview").on("click",function(){
    var unitStart=unitArr[0];
    var unitEnd=unitArr[unitArr.length-1];
    unitStart==undefined? window.location.href="../../../model/me/me_preview.html?start=1"+"&end=1":   window.location.href="../../../model/me/me_preview.html?start="+unitStart+"&end="+unitEnd;

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
//题号排序
function jobNumbers() {
    //规则：
    var jobList = $(".slot-list").find(".m_order");//获取题号列表
    $.each(jobList, function (i,obj) {
        $(obj).html((i + 1)+"、");
    });
}

queryWrongPage();
//错题数量
function queryWrongPage(){
    /*store.set("errorPaper","")*/
    $(".m_seclectNum").html(store.get("errorQuestionNum"));
}
//分页
function Paging(PageSize,PageNum){
    var totalPage=PageSize;
    var totalRecords = totalPage*3;
    kkpager.total=PageSize;
    kkpager.totalRecords= totalRecords;
    var pageNo = PageNum;
    if(!pageNo){pageNo = 1;}
    store.set("PageNum",pageNo);
    kkpager.generPageHtml({
        pno : pageNo, //总页码
        total : totalPage, //总数据条数
        totalRecords : totalRecords, //链接前部
        hrefFormer : 'me_wrong', //链接尾部
        hrefLatter : '.html',
        mode : 'click',//默认值是link，可选link或者click
        click : function(n){
            this.selectPage(n);
            store.set("PageNum",n);
            testPaper(store.get('Unitid'),n);
            return false;
        }
    },true);
};