
/**
 * Created by lgr on 2016/11/28.
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
        });
    }
    function sellist(list,level,flag){
        if(level=="0"){
            var li = "<li><label>章：</label><div>";
        }else if(level=="1"){
            var li = "<li><label>节：</label><div>";
        }else if(level=="2"){
            var li = "<li><label>课时：</label><div>";
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
        $(".fn_par").click(function(){
            if(!$(this).hasClass("change")){
                $(".p_loadcon").html("");
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
                li = "<li><label>章：</label><div>";
            }else if(level=="1"){
                li = "<li><label>节：</label><div>";
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
        $.ajax({
            type:"post",
            url:"/web/student/brush/studentBrushList",
            data:parmars,
            dataType: "json",
            success:function(data){
                if(data.retCode == "0000"){
                    var questionList = data.retData.questionList;
                    var p_loadtexttitle = $(".p_loadtexttitle");
                    for(var i=0;i<questionList.length;i++){
                        //判断是否组合体
                        if(!questionList[i].groupCode){
                            var newclone = p_mei.clone(true);
                            var p_cons = newclone.find(".p_cons");
                            var p_con = newclone.find(".p_con");
                            var Dtrue = data.retData.questionList[i];
                            var id= Dtrue.id;
                            var testId = data.retData.testId;
                            var testTitle = data.retData.testTitle;
                            var videoId = data.retData.questionList[i].videoId;
                            var groupCode = data.retData.questionList[i].groupCode;
                            var questionData = data.retData.questionList[i].questionData;
                            newclone.find(".p_moneycl").hide();
                            //标题
                            newclone.attr({"id":id,"testId":testId});
                            //question里面的
                            p_cons.each(function(){

                                var htype = $(this).attr("htype");
                                var name = Dtrue[$(this).attr("name")] ;

                                if(htype == "text"){
                                    $(this).html(name)
                                }else if(htype == "value"){
                                    $(this).attr("videoId",name)
                                }else if(htype == "imge"){
                                    if(!videoId){
                                        $(this).closest(".p_analysisvodeo").hide()
                                    }
                                    if(name==null){
                                        $(this).css('display','none')
                                        $(this).siblings('.p_exampleradio').css('display','none')
                                        $(this).siblings('.p_analysisvodeoword').html('解析视频暂无')
                                    }else {
                                        $(this).attr("src",name);
                                    }
                                }
                            });
                            //list里面的东西
                            for(var j=0;j<questionList[i].list.length;j++){
                                p_con.each(function(){
                                    var tDtrue = questionList[i].list[j];
                                    if(tDtrue.questionType ==="07"){
                                        return;
                                    }
                                    var showOrder = tDtrue.showOrder;
                                    var  content = tDtrue.content.replace("【题干】",(questionnum+1)+"、").replace("【<span><span>题干</span></span>】",(questionnum+1)+"、");
                                    var questionType = tDtrue.questionType;
                                    var isinput = $(this).attr("isinput");
                                    if(isinput == questionType){
                                        if(questionType == "01"){
                                            questionnum++;
                                            $(this).html(content);
                                        }else{
                                            $(this).html(content);
                                        }
                                    }
                                })
                            }
                        }else{
                            var newclone = group_mei.clone(true);
                            var p_cons = newclone.find(".p_cons");
                            var p_con = newclone.find(".p_con");
                            var Dtrue = data.retData.questionList[i];
                            var id= Dtrue.id;
                            var testId = data.retData.testId;
                            var testTitle = data.retData.testTitle;
                            var videoId = data.retData.questionList[i].videoId;
                            var groupCode = data.retData.questionList[i].groupCode;
                            var questionData = data.retData.questionList[i].questionData;
                            newclone.find(".p_moneycl").hide();
                            //标题
                            newclone.attr({"id":id,"testId":testId});
                            //question里面的
                            p_cons.each(function(){
                                var htype = $(this).attr("htype");
                                var name = Dtrue[$(this).attr("name")] ;
                                if(htype == "text"){
                                    $(this).html(name)
                                }else if(htype == "value"){
                                    $(this).attr("videoId",name)
                                }else if(htype == "imge"){
                                    if(!videoId){
                                        $(this).closest(".p_analysisvodeo").hide()
                                    }
                                    $(this).attr("src",name);
                                }
                            });
                            //list里面的东西
                            for(var j=0;j<questionList[i].list.length;j++){
                                p_con.each(function(){
                                    var tDtrue = questionList[i].list[j];
                                    var showOrder = tDtrue.showOrder;
                                    var  content = tDtrue.content.replace("【题干】",(questionnum+1)+"、").replace("【<span><span>题干</span></span>】",(questionnum+1)+"、");
                                    var questionType = tDtrue.questionType;
                                    var isinput = $(this).attr("isinput");
                                    if(isinput == questionType){
                                        if(questionType == "01"){
                                            questionnum++;
                                            $(this).html(content);
                                        }else{
                                            $(this).html(content);
                                        }
                                    }
                                })
                            }
                            for(var k=0;k<questionList[i].prepares.length;k++){
                                var pDtrue = questionList[i].prepares[k];
                                var optionA = pDtrue.optionA;
                                var optionB = pDtrue.optionB;
                                var optionC = pDtrue.optionC;
                                var optionD = pDtrue.optionD;
                                //question里面的
                                var $optionul = $("<p class='p1 optionul"+k+"'></p>");
                                var $optionA = $("<p class='p1 optionA"+k+"'>"+optionA+"</p>");
                                var $optionB = $("<p class='p1 optionB'>"+optionB+"</p>");
                                var $optionC = $("<p class='p1 optionC'>"+optionC+"</p>");
                                var $optionD = $("<p class='p1 optionD"+k+"'>"+optionD+"</p>");
                                var $option = $("<button class='analysis_button fn_analysis_button'>解析</button><div class='analysis_div fn_analysis_div'><p class='p1 optionulanwser"+k+"'></p></div>");
                                $optionul.append($optionA);
                                $optionul.append($optionB);
                                $optionul.append($optionC);
                                $optionul.append($optionD);
                                newclone.find(".groupcode").append($optionul);
                                newclone.find(".groupcode").append($option);
                                //list 2
                                for(var m=0;m<pDtrue.list.length;m++){
                                    if(pDtrue.list[m].questionType ==="07"){
                                        continue;
                                    }
                                    var content = pDtrue.list[m].content.replace("【题干】",(questionnum+1)+"、").replace("【<span><span>题干</span></span>】","");
                                    var questionType = pDtrue.list[m].questionType;
                                    if( questionType == "01"){
                                        var $cont = $("<p class='content p1' m='"+m+"'>"+content+"</p>").insertBefore(newclone.find(".optionA"+k+""));
                                    }else{
                                        var $conts = $("<p class='conts p1' m = '"+m+"'>"+content+"</p>");
                                        newclone.find(".optionulanwser"+k+"").append($conts);
                                    }
                                }
                                questionnum++;
                            }
                        }

                        //看视频
                        newclone.find(".p_analysisvo").on("click",function(){
                            var videoId = $(this).siblings(".videoId").attr("videoId");
                            var p_exampleradio = $(this).siblings(".p_exampleradio");
                            $(this).css({"display":"none"});
                            p_exampleradio.html('Loading...');
                            $.ajax({
                                type:"post",
                                url:"/web/teacher/prepare/file/play",
                                data:{fileId:videoId},
                                dataType:"json",
                                success:function(data){
                                    var retcode = data.retCode;
                                    if(retcode == "0000"){
                                        var playCode = data.retData.playCode;

                                        p_exampleradio.html(playCode);
                                    }
                                }
                            })
                        });
                        newclone.appendTo(".p_loadcon");
                    }
                    clickAnalysis();
                    intMathJax();//公式
                }
                if(data.retCode == "2001"){
                    var htm = '';
                    htm+='<img class="noImg" src="../../../static/image/kola/no.png"/>';
                    $(".p_loadcon").html(htm);
                }
            }
        })
    }
    //展示试题
    function  getTextNew(parmars){
        $(".p_loadcon").html("");
        var questionnum = 0;
        $.ajax({
            type:"post",
            url:"/web/student/brush/studentBrushList",
            data:parmars,
            dataType: "json",
            success:function(data){
                if(data.retCode == "0000"){
                    var questionList = data.retData.questionList;
                    var newclone = "";
                    for(var i=0;i<questionList.length;i++){
                        newclone += "<li>";
                        var options = "";
                        options += questionList[i].optionA;
                        options += questionList[i].optionB;
                        options += questionList[i].optionC;
                        options += questionList[i].optionD;
                        for(var j=0;j<questionList[i].list.length;j++){
                            newclone += questionList[i].list[j].content;
                            if(questionList[i].list[j].questionType == '01'){
                                newclone += options;
                            }
                        }
                        newclone += "</li>";
                    }
                    $(".p_loadcon").append(newclone);
                }
                if(data.retCode == "2001"){
                    $('#c_ErrorMsg').html('没有试题资源').fadeIn(200);  Disappear("#c_ErrorMsg");
                }
            }
        })
    }
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
