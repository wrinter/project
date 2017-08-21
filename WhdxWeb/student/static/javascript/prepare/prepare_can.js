
/**
 * Created by lgr on 2017/5/10.
 */
/******************************获取导航*******************************/
$(document).ready(function(){
    CheckBrower();//检查浏览器版本；
    subjectSel();
    css();
    autoDo();
    //获取试题
    document.addEventListener('click',function(e){
        if(e.target.className.indexOf("p_Directory_ico")==-1){
            $(".p_DirectoryWrap").fadeOut(300);
        }
    });
    //页面进入自动执行
    function autoDo(){
        var that = this;
        var subject = {};
        subject.subjectId = $(".fn_sub.change").attr("val");
        subject.menuId = store.get('menuId');
        $.ajax({
            type:"post",
            url:"/web/student/common/knowledge",
            data:subject,
            dataType: "json",
            success:function(data){
                if(data.retCode!="0000"){
                    $('#c_ErrorMsg').html('您当前学科还没有选择教材').fadeIn(200);  Disappear("#c_ErrorMsg");
                    return;
                }
                var list = data.retData;
                var flag = true,knowledgeId = "",num=0;
                while(flag){
                    if(list[0].childrens.length>0){
                        sellist(list,num,"auto");
                        num++;
                        list = list[0].childrens;
                    }else{
                        knowledgeId = list[0].knowledgeId;
                        flag = false;
                        sellist(list,num,"auto");
                        var parmars = {};
                        parmars.knowledgeId = knowledgeId;
                        parmars.subjectId = subject.subjectId;
                        getText(parmars)
                    }
                }
            }
        })
    }
    //学科
    function subjectSel(){
        $.ajax({
            type:"post",
            url:"/web/student/center/getSubjectList",
            dataType: "json",
            "async":false,
            success:function(data){
                var htm = '';
                for(var i in data.retData){
                    if(data.retData[i].value=='02'||data.retData[i].value=='06'||data.retData[i].value=='08'){
                        htm += '<span class="fn_sub ';
                        if(data.retData[i].value=='02'){
                            htm += "change";
                        }
                        htm += '" mycla="mathematics" val="'+data.retData[i].value+'">'+data.retData[i].label+'</span>';
                    }
                }
                $("#fn_subject_div").append(htm);
                subjectAll();
            }
        });
    }
    //学科、章、节
    function subjectAll(){
        $(".p_loadtexttitle .fn_sub").click(function(){
            if($(this).hasClass("change")){
                return;
            }else{
                $(this).parent().find("span").removeClass("change");
                $(this).addClass("change");
            }
            $(this).parent().parent().nextAll().remove();
            var subject = {};
            subject.subjectId = $(this).attr("val")
            autoDo();
            sessionStorage.setItem("SubId",JSON.stringify(subject));
        });
    }
    function sellist(list,level,flag){
        if(level=="0"){
            var li = "<li><label class='unit'>章：</label><div>";
        }else if(level=="1"){
            var li = "<li><label class='timeUnit'>节：</label><div>";
        }else if(level=="2"){
            var li = "<li><label>课时：</label><div>";
        }
        for(var i=0; i<list.length; i++){
            li+="<span id='"+list[i].knowledgeId+"' class='subject fn_par ";
            if(i==0&&flag=="auto"){
                li+="change";
            }
            if(list[i].alias!=null){
                li+="' title='"+list[i].name+'  '+list[i].alias +"' level='"+list[i].level+"'  parent='"+JSON.stringify(list[i].childrens)+"'>"+list[i].name+"</span>";
            }else {
                li+="' title='"+list[i].name+"' level='"+list[i].level+"'  parent='"+JSON.stringify(list[i].childrens)+"'>"+list[i].name+"</span>";
            }
        }
        li+="</div></li>";
        $(".p_loadtexttitle").append(li);
        $(".fn_par").click(function(){
            if(!$(this).hasClass("change")){
                $(".p_loadcon").html("");
                $(".can_title").html("");
                $(this).parent().parent().nextAll().remove();
                $(this).parent().find("span").removeClass("change");
                $(this).addClass("change");
                if(JSON.parse($(this).attr("parent")).length>0){
                    clickSellist(JSON.parse($(this).attr("parent")),$(this).attr("level"),"auto");
                }else{
                    var paramrs = {};
                    paramrs.knowledgeId = $(this).attr("id");
                    paramrs.subjectId = $("span.fn_sub.change").attr("val");
                    getText(paramrs);
                }
            }
        })
    }
    function clickSellist(list,level,flag){
        var that = this;
        var list = list,level = level,flag = flag,pan = false,li = "",knowledgeId="",subjectId = "",paramrs = {};
        do{
            if(level=="0"){
                li = "<li><label class='unit'>章：</label><div>";
            }else if(level=="1"){
                li = "<li><label class='timeUnit'>节：</label><div>";
            }else if(level=="2"){
                li = "<li><label>课时：</label><div>";
            }
            for(var i=0; i<list.length; i++){
                li+="<span id='"+list[i].knowledgeId+"' class='fn_par ";
                if(i==0&&flag=="auto"){
                    li+="change";
                }
                if(list[i].alias!=null){
                    li+="' title='"+list[i].name+'  '+list[i].alias +"' level='"+list[i].level+"'  parent='"+JSON.stringify(list[i].childrens)+"'>"+list[i].name+"</span>";
                }else {
                    li+="' title='"+list[i].name+"' level='"+list[i].level+"'  parent='"+JSON.stringify(list[i].childrens)+"'>"+list[i].name+"</span>";

                }
            }
            li+="</div></li>";
            $(".p_loadtexttitle").append(li);
            if(list[0].childrens.length>0) {
                level = list[0].level;
                list = list[0].childrens;
                pan = true;
                li = "";
            }else {
                pan = false;
                paramrs.knowledgeId = list[0].knowledgeId;
                paramrs.subjectId = $("span.fn_sub.change").attr("val");
            }
        }while(pan);
        getText(paramrs);
        $(".fn_par").click(function(){
            if(!$(this).hasClass("change")){
                $(".p_loadcon").html("");
                $(this).parent().parent().nextAll().remove();
                $(this).parent().find("span").removeClass("change");
                $(this).addClass("change");
                if(JSON.parse($(this).attr("parent")).length>0){
                    clickSellist(JSON.parse($(this).attr("parent")),$(this).attr("level"),"auto");
                }else{
                    var knowledgeId = $(this).attr("id");
                    var paramrs = {};
                    paramrs.knowledgeId = knowledgeId;
                    paramrs.subjectId = $("span.fn_sub.change").attr("val");
                    getText(paramrs);
                }
            }
        })
    }

    //展示试题
    var p_mei = $(".p_mei").clone(true);
    var group_mei = $(".group_mei").clone(true);
    function  getText(parmars){
        $(".p_loadcon").html("");
        var questionnum = 0;
        var id = JSON.parse(sessionStorage.getItem("SubId"));
        var change= $("#fn_subject_div").find(".change");
        var subjectId = change.attr("val");
        if(subjectId == "08"){
            $(".unit").text("单元：");
            $(".timeUnit").text("课题：");
        }
        $.ajax({
            type:"post",
            url:"/web/student/brush/studentBrushList",
            data:parmars,
            dataType: "json",
            success:function(data){
                console.log(data)
                if(data.retCode == "0000"){
                    Data(data);
                    intMathJax();
                }else{
                    var htm = '';
                    htm+='<img class="noImg" src="../../../static/image/kola/no.png"/>';
                    $(".p_loadcon").html(htm);
                }
            },
            error:function(){
                var id = JSON.parse(sessionStorage.getItem("SubId"));

            }
        })
    }
    //    试题样式处理
    function Data(data){
        var Num = 0;
        var pNum = 0;
        //重新加载一遍下载和报错按钮
        //var $Reload = createReload();
        //var $errors = Errors();
        var questionList = data.retData.questionList;
        var p_loadtexttitle = $(".p_loadtexttitle");
        var p_loadcon = $(".p_loadcon");
        var can_title = $(".can_title");
	    var Tilte = data.retData.testTitle.replace("&mdash;","-");
        can_title.text(Tilte)
        for(var i=0;i<questionList.length;i++){
            Num++;
            var Dtrue = questionList[i];
            for(var M in Dtrue){//判空
                if(Dtrue[M] == null){
                    Dtrue[M] = "";
                }
            }//判空
            var id= Dtrue.id;
            var testId = data.retData.testId;
            var testTitle = data.retData.testTitle;
            var optionA = Dtrue.optionA;
            var optionB = Dtrue.optionB;
            var optionC = Dtrue.optionC;
            var optionD = Dtrue.optionD;
            var videoId = Dtrue.videoId;
            var videoPicture = Dtrue.videoPicture;
            var groupCode = Dtrue.groupCode;
            var questionData = Dtrue.questionData;
            //p_loadtexttitle.html(testTitle);//标题
            var $question = $("<li class='question' id='"+id+"' testId='"+testId+"'></li>").appendTo(p_loadcon);//试卷存放处
            var $optionul = $("<div class='optionul'></div>").appendTo($question);//选项
            var $answer = $("<div class='answer'></div>").appendTo($question);//答案
            if(optionA){
                var chooseA = $("<div class='chooseA'>"+optionA+"</div>").appendTo($optionul);
                var chooseB = $("<div class='chooseB'>"+optionB+"</div>").appendTo($optionul);
                var chooseC = $("<div class='chooseC'>"+optionC+"</div>").appendTo($optionul);
                var chooseD = $("<div class='chooseD'>"+optionD+"</div>").appendTo($optionul);
            }
            for(var j = 0 ; j<Dtrue.list.length;j++){
                var lDtrue = Dtrue.list[j];
                var questionType= lDtrue.questionType;
                var content = lDtrue.content.replace(/题干/i,"").replace(/答案/i,"").replace(/解析/i,"").replace(/破题入口/i,"").replace(/规律总结/i,"").replace(/答题步骤模板/i,"").replace(/解题思维模板/i,"").replace(/答题指导/i,"");
                var content = content.replace(/解题指南/i,"").replace(/特别提醒/i,"").replace(/易错警示/i,"").replace(/解题技巧/i,"");
                if(questionType != 13 || questionType != "13"){
                    content = content.replace("【","");
                    content = content.replace("】","");
                    content = content.replace(/题<\/span><span>干/g,' ');
                }//非类型
                if(questionType == "13" || questionType == 13){
                    var $classfify = $("<span class='classfify' style='display: inline-block;'>"+content+"</span>").prependTo($question);
                }else if(questionType == "01" || questionType == 01){
                    var $topic = $("<div class='topic'><label class='label'>"+Num+"、</label></div>").insertBefore($optionul);
                    var $topicp = $("<div class='topicp'>"+content+"</div>").appendTo($topic);
                }//类型
                switch (questionType){
                    case"14" :
                        var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answer);
                        var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>答题指导</span>").appendTo($answerName);
                        var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                        break;
                    case"15" :
                        var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answer);
                        var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>易错警示</span>").appendTo($answerName);
                        var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                        break;
                    case"16" :
                        var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answer);
                        var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>规律总结</span>").appendTo($answerName);
                        var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                        break;
                    case"20" :
                        var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answer);
                        var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>解题指南</span>").appendTo($answerName);
                        var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                        break;
                    case"21" :
                        var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answer);
                        var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>解题技巧</span>").appendTo($answerName);
                        var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                        break;
                    case"22" :
                        var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answer);
                        var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>特别提醒</span>").appendTo($answerName);
                        var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                        break;
                }//有样式的标签
                switch (questionType){
                    case"03" : var $answerName= $("<div class='answerName'>【正确答案】</div>").appendTo($answer);
                        var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answer);
                        break;
                    case"05" : var $answerName= $("<div class='answerName'>【答案解析】</div>").appendTo($answer);
                        var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answer);
                        break;
                    case"19" : var $answerName= $("<div class='answerName'>【破题入口】</div>").appendTo($answer);
                        var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answer);
                        break;
                    case"26" : var $answerName= $("<div class='answerName'>【解题思维模板】</div>").appendTo($answer);
                        var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answer);
                        break;
                    case"27" : var $answerName= $("<div class='answerName'>【答题步骤模板】</div>").appendTo($answer);
                        var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answer);
                        break;

                }//无样式的标签
            }//普通試題
            if(videoId){
                var $video = $("<div class='video' videoId='"+videoId+"'></div>").appendTo($question);
                var $answerName= $("<div class='answerName'>【视频解析】</div>").appendTo($video);
                var $answerData = $("<img class='videoClick' videoId='"+videoId+"' src='"+videoPicture+"' />").appendTo($video);
                var $answerPlay = $("<div class='answerPlay'></div>").appendTo($video);
            }//視頻
            //判断是否组合体
            if(groupCode){
                var $Prehps = $("<div class='Prehps'></div>").insertBefore($answer);
                var $questionData = $("<div class='questionData'>"+questionData+"</div>").appendTo($Prehps);
                for(var k=0;k<Dtrue.prepares.length;k++){

                    var pDtrue = Dtrue.prepares[k];
                    var optionA = pDtrue.optionA;
                    var optionB = pDtrue.optionB;
                    var optionC = pDtrue.optionC;
                    var optionD = pDtrue.optionD;
                    var $optionPul = $("<div class='optionul'></div>").appendTo($Prehps);//选项
                    var $answerPser = $("<div class='answerPser'></div>").appendTo($Prehps);//选项
                    if(optionA){
                        var chooseA = $("<div class='chooseA'>"+optionA+"</div>").appendTo($optionPul);
                        var chooseB = $("<div class='chooseB'>"+optionB+"</div>").appendTo($optionPul);
                        var chooseC = $("<div class='chooseC'>"+optionC+"</div>").appendTo($optionPul);
                        var chooseD = $("<div class='chooseD'>"+optionD+"</div>").appendTo($optionPul);
                    }//组合题选择
                    for(var m = 0; m < pDtrue.list.length;m++){
                        var cDtrue = pDtrue.list[m];
                        var questionType = cDtrue.questionType;
                        var content = cDtrue.content.replace(/题干/i,Num+"、").replace(/答案/i,"").replace(/解析/i,"").replace(/破题入口/i,"").replace(/规律总结/i,"").replace(/答题步骤模板/i,"").replace(/解题思维模板/i,"").replace(/答题指导/i,"");
                        var content = content.replace(/解题指南/i,"").replace(/特别提醒/i,"").replace(/易错警示/i,"").replace(/解题技巧/i,"");
                        if(questionType != 13 || questionType != "13"){
                            content = content.replace("【","");
                            content = content.replace("】","");
                            content = content.replace(/题<\/span><span>干/g,' ');
                        }//非类型
                        if(questionType == "13" || questionType == 13){
                            var $classfify = $("<span class='classfify' style='background:#fff100;display: inline-block;'>"+content+"</span>").prependTo($question);
                        }else if(questionType == "01" || questionType == 01){
                            var $topic = $("<div class='topic'>"+content+"</div>").insertBefore($optionPul);
                        }//类型
                        switch (questionType){
                            case"14" : var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answerPser);
                                var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>答题指导</span>").appendTo($answerName);
                                var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                                break;
                            case"15" : var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answerPser);
                                var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>易错警示</span>").appendTo($answerName);
                                var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                                break;
                            case"16" : var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answerPser);
                                var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>规律总结</span>").appendTo($answerName);
                                var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                                break;
                            case"20" : var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answerPser);
                                var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>解题指南</span>").appendTo($answerName);
                                var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                                break;
                            case"21" : var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answerPser);
                                var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>解题技巧</span>").appendTo($answerName);
                                var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                                break;
                        }//有样式的标签
                        switch (questionType){
                            case"03" : var $answerName= $("<div class='answerName'>【正确答案】</div>").appendTo($answerPser);
                                var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answerPser);
                                break;
                            case"05" : var $answerName= $("<div class='answerName'>【答案解析】</div>").appendTo($answerPser);
                                var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answerPser);
                                break;
                            case"19" : var $answerName= $("<div class='answerName'>【破题入口】</div>").appendTo($answerPser);
                                var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answerPser);
                                break;
                            case"22" : var $answerName= $("<div class='answerName'>【特别提醒】</div>").appendTo($answerPser);
                                var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answerPser);
                                break;
                            case"26" : var $answerName= $("<div class='answerName'>【解题思维模板】</div>").appendTo($answerPser);
                                var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answerPser);
                                break;
                            case"27" : var $answerName= $("<div class='answerName'>【答题步骤模板】</div>").appendTo($answerPser);
                                var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answerPser);
                                break;

                        }//无样式的标签
                    }
                }
            }//组合题
        }
        //看视频
        $(".videoClick").on("click",function(){
            var _this = $(this);
            var videoId = $(this).attr("videoId");
            var answerPlay = $(this).siblings(".answerPlay");
            $.ajax({
                type:"post",
                url:"/web/teacher/prepare/file/play",
                data:{fileId:videoId},
                dataType:"json",
                success:function(data){
                    var retcode = data.retCode;
                    if(retcode == "0000"){
                        var playCode = data.retData.playCode;
                        answerPlay.html(playCode);
                        _this.css({"display":"none"});
                    }
                }
            })
        });
	    intMathJax();
    }
    ////展示试题
    //function  getTextNew(parmars){
    //    $(".p_loadcon").html("");
    //    var questionnum = 0;
    //    $.ajax({
    //        type:"post",
    //        url:"/web/student/brush/studentBrushList",
    //        data:parmars,
    //        dataType: "json",
    //        success:function(data){
    //            if(data.retCode == "0000"){
    //                var questionList = data.retData.questionList;
    //                var newclone = "";
    //                for(var i=0;i<questionList.length;i++){
    //                    newclone += "<li>";
    //                    var options = "";
    //                    options += questionList[i].optionA;
    //                    options += questionList[i].optionB;
    //                    options += questionList[i].optionC;
    //                    options += questionList[i].optionD;
    //                    for(var j=0;j<questionList[i].list.length;j++){
    //                        newclone += questionList[i].list[j].content;
    //                        if(questionList[i].list[j].questionType == '01'){
    //                            newclone += options;
    //                        }
    //                    }
    //                    newclone += "</li>";
    //                }
    //                $(".p_loadcon").append(newclone);
    //            }
    //            if(data.retCode == "2001"){
    //                $('#c_ErrorMsg').html('没有试题资源').fadeIn(200);  Disappear("#c_ErrorMsg");
    //            }
    //        }
    //    })
    //}
    //引进样式
    function css(){
        $.ajax({
            type:"post",
            url:"/web/common/commonStyle",
            dataType:"json",
            success:function(data){
                if(data.retCode == "0000"){
                    var retData = data.retData;
                    //retData.appendTo("head");
                    $("head").append(retData);
                }
            },
            error:function(e){
            }
        })
    }
    $(".p_success_remove").on("click",function(){
        $(".p_sharks").hide();
    })
    $(".p_checkname").on("click",function(){
        window.location.href = "../me/me_certification.html";
    })
    $(".p_success_dele").on("click",function(){
        $(".p_shark,.p_reloadfalse").hide();
    });
    $(".p_name").on("click",function(){
        window.location.href = "../me/me_pay.html"
    });
    function clickAnalysis(){
        $(".fn_analysis_button").click(function(){
            if($(this).hasClass("fn_analysis_button")){
                $(this).addClass("fn_analysis_close_button");
                $(this).removeClass("fn_analysis_button");
                $(this).addClass("analysis_close_button");
                $(this).removeClass("analysis_button");
                $(this).html("收起");
                $(this).next().fadeToggle("200");
                $(".p_analysisvodeo").css("display","inline-block");
            }else if($(this).hasClass("fn_analysis_close_button")){
                $(this).next().fadeToggle("200");
                $(".p_analysisvodeo").css("display","none");
                $(this).addClass("fn_analysis_button");
                $(this).removeClass("fn_analysis_close_button");
                $(this).addClass("analysis_button");
                $(this).removeClass("analysis_close_button");
                $(this).html("解析");
            }
        });
    }
});
