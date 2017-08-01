/**
 * Created by subo on 2017/5/2 0002.
 */
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
$H.event.scrollPage();
$H.class("exercise_box")[0].style.cssText = "min-height:" + ($(window).height() - 224) + "px;";
window.onresize = function (){
    $H.class("exercise_box")[0].style.cssText = "min-height:" + ($(window).height() - 224) + "px;";
}
var thisType = "work",
    thisSubject = $H.storage.getLocal(thisType,"subject"),
    thisActive = $H.storage.getLocal(thisType,"active"),
    thisTarget = $H.storage.getLocal(thisType,"target"),
    thisId = $H.storage.getLocal(thisType,"id"),
    thisPt = $H.storage.getLocal(thisType,"pt"),
    thisPi = $H.storage.getLocal(thisType,"pi"),
    thisAi = $H.storage.getLocal(thisType,"ai"),
    thisSt = $H.storage.getLocal(thisType,"st"),
    thisKt = $H.storage.getLocal(thisType,"kt"),
    thisPaperInfo = $H.storage.getLocal(thisType,"paperinfo"),
    thisPaperData = $H.storage.getLocal(thisType,"paperdata");
document.getElementsByTagName("title")[0].innerHTML = $H.Html.setTitle(thisPt);//设置title
if(thisPt == "202" || thisPt == "212"){//设置模拟套卷面包屑
    var crumThis = document.getElementById("paperTitle").parentNode,
        crumLi = document.createElement("li");
    crumLi.innerHTML = "<a href='../../model/test/hj_paperlist.html' class='fl'>模拟套卷</a><i class='spriteImg c_Crumgoico c_Crumgo'></i>";
    crumThis.parentNode.insertBefore(crumLi,crumThis);
}
$H.storage.setLocal(thisType,"islinenumber","");//清空行号规则
$H.storage.setLocal(thisType,"questiontype","");//清空题型缓存
$H.Data.knowledge(thisType,thisActive,thisKt);//缓存知识点
$H.Data.questionType(thisType,thisActive,thisKt);//缓存题型
isPaperInit();
function isPaperInit() {
    var isQuestionTypeInPage = $H.storage.getLocal(thisType,"questiontype");//判断题型缓存是否就绪
    isQuestionTypeInPage = isQuestionTypeInPage ? true : false;
    if(isQuestionTypeInPage){
        paperInit();
    }else{
        setTimeout(isPaperInit,20)//每20毫秒轮询
    }
}
function paperInit() {
    $H.Data.questionTypeMapped(thisType,thisActive,thisSubject);//缓存题型映射
    $H.Data.questionTypeMappedToPaperData(thisType,thisSubject);//映射到试卷缓存
    thisPaperData = $H.storage.getLocal(thisType,"paperdata");//赋值映射后的试卷
    if(thisPaperData){
        toPaperinfo();//编辑
    }else{
        newPaperinfo();//自主组卷
    }
}
function toPaperinfo(){
    var paperInfo = JSON.parse(thisPaperInfo),
        paperTitle = "<h1>" + paperInfo.paperName + "</h1>",
        paperTime = "<div class='timeing timeing_edit'></div>",
        questionLines = "<div class='work_box work_box_edit' data-wrapid='start'>" + (JSON.parse(thisPaperData).length > 0 ? $H.Html.hjQuestionLines({type:thisType,subject:thisSubject,data:JSON.parse(thisPaperData),btnobj:{analysis:true,delet:true}}) : "") + "</div>";
    document.getElementById("paperTitle").innerHTML = paperInfo.paperName;
    $H.class("exercise_box")[0].innerHTML = paperTitle + paperTime + questionLines;
    $H.class("exercise_btn_in")[0].innerHTML = JSON.parse(thisPaperData).length > 0 ? thisType == "work" ? "<input class='exercise_btn_done' type='button' value='完成'><input class='exercise_btn_setline' type='button' value='调整题型'>" : "<input class='exercise_btn_done' type='button' value='完成'><input class='exercise_btn_score' type='button' value='设置分数'><input class='exercise_btn_setline' type='button' value='调整题型'>" : "<input class='exercise_btn_add' type='button' value='加题'>";
    $H.components.timeing("timeing",paperInfo.testTime);//时间选择
    if(JSON.parse(thisPaperData).length > 0){
        $H.event.setLineType(thisType);//作业首次解析：缓存是否默认题行(默认题行不显示，只显示小题，故加题逻辑类似自主组卷初次加题模式)
        $H.event.setIsLineNumber({orderLineNumber:true,type:thisType,subject:thisSubject});//首次解析:缓存行号规则
        $H.event.setOrderNumber({orderLineNumber:true,type:thisType,subject:thisSubject});//排列题号、行号
        $H.event.sortable({orderLineNumber:true,type:thisType,subject:thisSubject});//排序     嵌套：数据(题目删除、题行删除、排列、增加)，html(sortable插件、题号处理)
    }
    if(thisType == "work"){
        var lineType = $H.storage.getLocal(thisType,"linetype"),
            defaultLineTypeObj = $H.storage.getLocal(thisType,"defaultlinetypeobj");
        defaultLineTypeObj = defaultLineTypeObj ? JSON.parse(defaultLineTypeObj) : null;
        if(lineType == "false"){
            $H.class("exercise_btn_in")[0].innerHTML = "<input class='exercise_btn_done' type='button' value='完成'><input class='exercise_btn_add_lineTypeFalse' type='button' value='加题' data-questiontype='" + defaultLineTypeObj.questionType + "' data-lineid='" + defaultLineTypeObj.lineId + "'>";
        }
    }
    editEvent();//编辑事件,已代理:html更新后无须重载
}
function newPaperinfo() {
    $H.storage.setLocal(thisType,"islinenumber","");//清空是否行号缓存
    $H.ajax.hjCustompapername(true,{knowledgeId:thisActive},sCustompapername,eCustompapername);
    function sCustompapername(data) {
        document.getElementById("paperTitle").innerHTML = data.retData;
        $H.class("exercise_box")[0].innerHTML = "<h1 class='paper_name'>" + data.retData + "</h1><div class='timeing timeing_edit'></div><div class='work_box work_box_edit' data-wrapid='start'></div>";
        $H.class("exercise_btn_in")[0].innerHTML = "<input class='exercise_btn_add' type='button' value='加题'>";
        $H.components.timeing("timeing",60);//时间选择
        $H.event.setIsLineNumber({orderLineNumber:true,type:thisType,subject:thisSubject});//首次解析:缓存行号规则
        var selfPaperInfo = {paperName:data.retData,testTime:60,score:0};
        $H.storage.setLocal(thisType,"paperinfo",JSON.stringify(selfPaperInfo));//首次解析：缓存试卷基本信息
        editEvent();//编辑事件,已代理:html更新后无须重载
    }
    function eCustompapername() {
        document.getElementById("paperTitle").innerHTML = "自主组卷";
        $H.class("exercise_box")[0].innerHTML = "<img class='nodata' src='../../static/image/nodata.png' />";
    }
}
function editEvent() {
    $H.event.clickSeeanalysis(".work_box");//查看解析
    $H.event.clickDeleteQuestion({orderLineNumber:true,type:thisType,subject:thisSubject});//删除题目     嵌套：排列题号、行号 / 赋分
    //$H.event.clickDeleteLine({orderLineNumber:true,type:thisType,subject:thisSubject});//删除题行,已废除的功能，留作备用
    $H.components.clickAddLineAndQuestionForPaper({orderLineNumber:true,type:thisType,subject:thisSubject,active:thisActive,kt:thisKt});//试卷添加题目
    $H.components.clickSetLine({orderLineNumber:true,type:thisType,subject:thisSubject});//编辑题行(调整题型)
    $H.components.clickSavePaper(thisType,thisSubject,thisActive,thisTarget,thisAi,thisPi,thisPt,thisSt);//完成按钮
    $H.ajax.hjCommonStyle(true,{},sCommonStyle,eCommonStyle);//请求试题样式
    function sCommonStyle(data) {
        $("head").append(data.retData);
    }
    function eCommonStyle() {
        $H.warn("题目样式获取失败，可能影响您的试卷样式");
    }
}
