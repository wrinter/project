/**
 * Created by subo on 2017/4/21 0017.
 */
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
$H.event.scrollPage();
$H.class("exercise_box")[0].style.cssText = "min-height:" + ($(window).height() - 224) + "px;";
window.onresize = function (){
    $H.class("exercise_box")[0].style.cssText = "min-height:" + ($(window).height() - 224) + "px;";
}
var isSaved = Request.isSaved;
var thisType = "work",
    thisSubject = $H.storage.getLocal(thisType,"subject"),
    thisActive = $H.storage.getLocal(thisType,"active"),
    thisTarget = $H.storage.getLocal(thisType,"target"),
    thisId = $H.storage.getLocal(thisType,"id"),
    thisPt = $H.storage.getLocal(thisType,"pt"),
    thisPi = $H.storage.getLocal(thisType,"pi"),
    thisAi = $H.storage.getLocal(thisType,"ai"),
    thisSt = $H.storage.getLocal(thisType,"st");
if(isSaved=='no') {
    thisAi = ''
}
document.getElementsByTagName("title")[0].innerHTML = $H.Html.setTitle(thisPt);//设置title
if(thisPt == "202" || thisPt == "212"){//设置模拟套卷面包屑
    var crumThis = document.getElementById("paperTitle").parentNode,
        crumLi = document.createElement("li");
    crumLi.innerHTML = "<a href='../../model/test/hj_paperlist.html' class='fl'>模拟套卷</a><i class='spriteImg c_Crumgoico c_Crumgo'></i>";
    crumThis.parentNode.insertBefore(crumLi,crumThis);
}
thisSubject ? sSubject() : eSubject();
function sSubject(){
    if(thisSt!='2'&&thisTarget == "mylist"){
        $H.ajax.hjPaperinfoWithAssign(true,{'assignId':thisAi},sPaperinfo,ePaperinfo);
    }else{
        if(thisSubject == "03" && (thisPt == "102" || thisPt == "103" || thisPt == "104" || thisPt == "112" || thisPt == "113" || thisPt == "114")){//03:英语 && 分层作业
            thisTarget == "mylist" ? $H.ajax.hjEnglishpaperinfowithidtype(true,{paperType:thisPt,paperId:thisPi},sPaperinfo,ePaperinfo) : $H.ajax.hjEnglishpaperinfo(true,{categoryId:thisId,knowledgeId:thisActive},sPaperinfo,ePaperinfo);//获取当前作业
        }else if(thisSubject == "03" && (thisPt == "203" || thisPt == "213")){//03:英语 && 听力训练
            thisTarget == "mylist" ? $H.ajax.hjListeningtestwithidtype(true,{paperType:thisPt,paperId:thisPi},sPaperinfo,ePaperinfo) : $H.ajax.hjListeningtest(true,{categoryId:thisId,knowledgeId:thisActive},sPaperinfo,ePaperinfo);//获取当前作业
        }else{
            thisTarget == "mylist" ? $H.ajax.hjPaperinfowithidtype(true,{paperType:thisPt,paperId:thisPi},sPaperinfo,ePaperinfo) : $H.ajax.hjPaperinfo(true,{categoryId:thisId,knowledgeId:thisActive},sPaperinfo,ePaperinfo);//获取当前作业
        }
    }
}
function eSubject(){
    document.getElementById("paperTitle").innerHTML = $H.Html.setDefaultPaperName(thisPt);
    $H.class("exercise_box")[0].innerHTML = "<img class='nodata' src='../../static/image/nodata.png' />";
}
function sPaperinfo(data){
    var retData = data.retData;
    var paperTitle = "<h1>" + retData.paperName + "</h1>",
        paperTime = "<div class='timeing'>时间：" + retData.testTime +"<span>分钟</span>" + ( thisType == "work" ? "" : "　分数：<span class='timeing_score'>" + retData.score + "</span><span>分</span>") + "</div>",
        questionLinesData = $H.Data.hjQuestionLines(retData,thisType,thisSubject,thisPt),
        questionLines = "<div class='work_box'>" + (thisSubject == "03" && (thisPt == "203" || thisPt == "213") ? $H.Html.hjQuestionLines({type:thisType,subject:thisSubject,data:questionLinesData,btnobj:{analysis:true,error:true}}) : $H.Html.hjQuestionLines({type:thisType,subject:thisSubject,data:questionLinesData,btnobj:{analysis:true}})) + "</div>",
        paperInfo = {isMarked: retData.isMarked,paperId: retData.paperId,paperName: retData.paperName,score: retData.score,testTime: retData.testTime,url: retData.url};
    document.getElementById("paperTitle").innerHTML = retData.paperName;
    $H.class("exercise_box")[0].innerHTML = paperTitle + paperTime + questionLines;
    if(thisSt!='2'&&thisTarget == "mylist"){
        $H.class("exercise_btn_in")[0].innerHTML = thisPt == "105" || thisPt == "115" || thisPt == "202" || thisPt == "212" || thisPt == "203" || thisPt == "213" ? "<input id='w_PrintBtn' class='exercise_btn_print' type='button' value='打印'><a class='exercise_btn_publish' href='javascript:;' title='布置'>布置</a>" : "<input id='w_PrintBtn' class='exercise_btn_print' type='button' value='打印'><a class='exercise_btn_publish' href='javascript:;' title='布置'>布置</a>";
    }else{
        $H.class("exercise_btn_in")[0].innerHTML = thisPt == "105" || thisPt == "115" || thisPt == "202" || thisPt == "212" || thisPt == "203" || thisPt == "213" ? "<input id='w_PrintBtn' class='exercise_btn_print' type='button' value='打印'><a class='exercise_btn_publish' href='javascript:;' title='布置'>布置</a>" : "<input id='w_PrintBtn' class='exercise_btn_print' type='button' value='打印'><a class='exercise_btn_edit' href='../../model/homework/hj_edit.html' title='编辑'>编辑</a><a class='exercise_btn_publish' href='javascript:;' title='布置'>布置</a>";
    }
    $H.storage.setLocal(thisType,"paperinfo",JSON.stringify(paperInfo));//缓存信息
    $H.storage.setLocal(thisType,"paperdata",JSON.stringify(questionLinesData));//缓存题目 / 题目的解析、添加、移动、编号、删除、赋分操作会对此缓存进行修改
    if(thisPt != "203"){//除英语听力外，需排列行和题号
        $H.event.setOrderNumber({showLine:false,type:thisType,subject:thisSubject});//排列题号、行号
    }
    $H.event.clickSeeanalysis(".work_box");//查看解析
    $H.components.clickPrint();//打印
    $H.components.clickPublish({paperId:retData.paperId,paperName:retData.paperName,testTime:retData.testTime,paperType:thisPt,assignId:thisAi,thisAc:thisActive});//布置
    //播放器，依赖JQ
    if(thisSubject == "03" && (thisPt == "102" || thisPt == "103" || thisPt == "104" || thisPt == "112" || thisPt == "113" || thisPt == "114" || thisPt == "203" || thisPt == "213")){//03:英语 && 分层作业/听力训练
        if(thisPt == "203" || thisPt == "213"){
            var exerciseBtnIn = $H.class("exercise_btn_in")[0],
                audio = document.createElement("audio");
            audio.setAttribute("preload","auto");
            audio.setAttribute("id","audio");
            audio.setAttribute("src","../../static/plugin/song/bed.mp3");
            exerciseBtnIn.appendChild(audio);
            $("audio").audioPlayer();
            document.getElementById("audio").setAttribute("src",retData.url);
        }else{
            var exerciseBtnIn = document.getElementsByTagName("body")[0],
                audio = document.createElement("audio");
            audio.setAttribute("id","audio");
            audio.setAttribute("autoplay","autoplay");
            exerciseBtnIn.appendChild(audio);
            $(".audioEN + p").css("display","inline");//防止音频后的题干换行
            //点击更换播放地址
            $(".audioEN a").on("click",function () {
                $(".audioEN a").css("background-position","0 1px;");//清除其它在播放的状态
                var _this = this,
                    audioUrl = this.getAttribute("data-url"),
                    thisAu = document.getElementById("audio");
                if(audioUrl){
                    thisAu.setAttribute("src",audioUrl);
                    this.style.backgroundPosition = "0 -99px";//添加loading状态
                    isReadyState();//播放就绪
                    isEnded();//播放完毕
                    function isReadyState() {
                        if(thisAu.readyState == 4){
                            _this.style.backgroundPosition = "0 -49px";//开始播放动画
                        }else{
                            setTimeout(isReadyState,200);//每200毫秒检查一次播放是否就绪
                        }
                    }
                    function isEnded() {
                        if(thisAu.ended){//播放完毕
                            _this.style.backgroundPosition = "0 1px";//结束播放动画
                        }else{
                            setTimeout(isEnded,200);//每200毫秒检查一次播放是否完成
                        }
                    }
                }else{
                    thisAu.removeAttribute("src");
                }
            })
        }
    }
    $H.ajax.hjCommonStyle(true,{},sCommonStyle,eCommonStyle);//请求试题样式
    function sCommonStyle(data) {
        $("head").append(data.retData);
        $("#w_Print").append(data.retData);
    }
    function eCommonStyle() {
        $H.warn("题目样式获取失败，可能影响您的试卷样式");
    }
}
function ePaperinfo(){
    document.getElementById("paperTitle").innerHTML = $H.Html.setDefaultPaperName(thisPt);
    $H.class("exercise_box")[0].innerHTML = "<img class='nodata' src='../../static/image/nodata.png' />";
}
