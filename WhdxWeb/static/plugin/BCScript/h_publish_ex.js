//Created by subo on 2017/3/16.
//布置作业、测试相关的试卷逻辑公共类
//依赖h_publish_dataSet.js
//数据解析类
function SetHtml(data){
    var thisHtml,publishType = arguments[1],subject = arguments[2];
    if(data.length > 0){
        thisHtml = "<ul>";
        for(var i=0;i<data.length;i++){
            var obj = data[i];
            if("line" in obj){//行
                if(publishType == "noScore"){
                    if(obj.line == "start"){
                        thisHtml += SetHtmlLineStart(obj) ? SetHtmlLineStart(obj) : "";
                        thisHtml += "</li>";
                    }
                }else{
                    if(obj.line == "start"){
                        thisHtml += SetHtmlLineStart(obj,true) ? SetHtmlLineStart(obj,true) : "";
                        thisHtml += "<ul class='line'>";
                    }else if(obj.line == "end"){
                        thisHtml += "</ul>";
                        thisHtml += SetHtmlLineEnd(obj) ? SetHtmlLineEnd(obj) : "";
                    }
                }
            }else if("group" in obj){//组
                if(obj.group == "start"){
                    thisHtml += SetHtmlGroupStart(obj) ? SetHtmlGroupStart(obj) : "";
                    thisHtml += "<ul class='splite'>";
                }else if(obj.group == "end"){
                    thisHtml += "</ul>";
                    if(obj.isSplite == "0"){
                        thisHtml += SetHtmlButton(obj,subject) ? SetHtmlButton(obj,subject) : "";//按钮
                        thisHtml += SetHtmlAnswer(obj) ? SetHtmlAnswer(obj) : "";//答案
                        thisHtml += SetHtmlAnalysis(obj) ? SetHtmlAnalysis(obj) : "";//解析
                    }
                    thisHtml += SetHtmlGroupEnd(obj) ? SetHtmlGroupEnd(obj) : "";
                }
            }else{//题
                thisHtml += SetHtmlTitle(obj) ? SetHtmlTitle(obj) : "";//题干
                thisHtml += SetHtmlOption(obj) ? SetHtmlOption(obj) : "";//选项
                if(!(obj.groupCode && obj.isSplite == "0")){//非 不可拆分的组合题
                    thisHtml += SetHtmlButton(obj,subject) ? SetHtmlButton(obj,subject) : "";//按钮
                    thisHtml += SetHtmlAnswer(obj) ? SetHtmlAnswer(obj) : "";//答案
                    thisHtml += SetHtmlAnalysis(obj) ? SetHtmlAnalysis(obj) : "";//解析
                }
            }
        }
        thisHtml += "</ul>";
    }
    return thisHtml;
}
function SetHtmlLineStart(obj){
    var lineStart,line_score_new_bol = arguments[1];
    if(obj.line == "start"){
        var display;
        display = obj.isShow == "0" ? " style='display:none'" : "";
        lineStart =
            "<li" +
            " id='" + obj.lineId + "'" +
            " isshow='" + obj.isShow + "'" +
            " questiontype='" + obj.questionType + "'" + display +
            ">" +
            "<h2>" +
            "<span class='line_number'></span>" +
            "<span class='line_name'>" + obj.lineName +
            "</span>" +
            (line_score_new_bol ? "<span class='line_score'>" + (obj.scoreDef ? obj.scoreDef : "") + "</span>" : "<span class='line_score'></span>") +
            "</h2>";
    }
    return lineStart;
}
function SetHtmlLineEnd(obj){
    var lineEnd;
    if(obj.line == "end"){
        lineEnd = "</li>";
    }
    return lineEnd;
}
function SetHtmlGroupStart(obj){
    var groupStart,title,content;
    content = obj.content ? "<div>" + obj.content + "</div>" : "";//.replace(/材料/g,' ').replace("【","").replace("】","").replace(/材<\/span><span>料/g,' ')
    if(obj.isSplite == "0"){
        title = "<h3><span class='question_number'></span>" + content + "</h3>";
    }else if(obj.isSplite == "1"){
        title = "<strong>" + obj.questionTypeName + content + "</strong>";
    }
    if(obj.group == "start"){
        groupStart =
            "<li" +
            " data-wrapid='" + obj.questionId + "'" +
            " issplite='" + obj.isSplite +"'" +
            " splite-id='splite" + obj.gpOrder + "'" +
            " data-knowledgeId='" + obj.knowledgeId + "'" +
            " data-knowledgeName='" + obj.knowledgeName + "'" +
            " data-difficultName='" + obj.difficultName + "'" +
            " data-groupCode='" + obj.groupCode + "'" +
            " data-selectable='" + obj.selectable +"'" +
            ">" +
            title;
    }
    return groupStart;
}
function SetHtmlGroupEnd(obj){
    var groupEnd;
    if(obj.group == "end"){
        groupEnd = "</li>";
    }
    return groupEnd;
}
function SetHtmlTitle(obj){
    var title;
    if(obj.questionId){
        title =
            obj.isSplite == "0" && !!obj.groupCode
                ?
            "<li" +
            " data-wrapid='" + obj.questionId + "'" +
            " issplite='" + obj.isSplite +"'" +
            " splite-id='splite" + obj.gpOrder + "'" +
            " data-knowledgeId='" + obj.knowledgeId + "'" +
            " data-knowledgeName='" + obj.knowledgeName + "'" +
            " data-difficultName='" + obj.difficultName + "'" +
            " data-groupCode='" + obj.groupCode + "'" +
            " data-selectable='" + obj.selectable +"'>" +
            "<h4>" +
            "<span class='question_number_liIn question_score' data-score='" + obj.score + "'></span>" + obj.questionTitle.replace(/题干/g,' ').replace("【","").replace("】","").replace(/题<\/span><span>干/g,' ') +
            "</h4>"
                :
            obj.isSplite == "1"
                ?
            "<li" +
            " data-wrapid='" + obj.questionId + "'" +
            " issplite='" + obj.isSplite +"'" +
            " splite-id='splite" + obj.gpOrder + "'" +
            " data-knowledgeId='" + obj.knowledgeId + "'" +
            " data-knowledgeName='" + obj.knowledgeName + "'" +
            " data-difficultName='" + obj.difficultName + "'" +
            " data-groupCode='" + obj.groupCode + "'" +
            " data-selectable='" + obj.selectable +"'>" +
            "<h3>" +
            "<span class='question_number question_score' data-score='" + obj.score + "'></span>" + obj.questionTitle.replace(/题干/g,' ').replace("【","").replace("】","").replace(/题<\/span><span>干/g,' ') +
            "</h3>"
                :
            "<li" +
            " data-wrapid='" + obj.questionId + "'" +
            " data-knowledgeId='" + obj.knowledgeId + "'" +
            " data-knowledgeName='" + obj.knowledgeName + "'" +
            " data-difficultName='" + obj.difficultName + "'" +
            " data-selectable='" + obj.selectable +"'>" +
            "<h3>" +
            "<span class='question_number question_score' data-score='" + obj.score + "'></span>" + obj.questionTitle.replace(/题干/g,' ').replace("【","").replace("】","").replace(/题<\/span><span>干/g,' ') +
            "</h3>";
    }
    return title;
}
function SetHtmlOption(obj){
    var option;
    if(obj.optionA){
        if(obj.optionA.indexOf("oneline") != -1){
            option = "<div class='options one'>";
        }else if(obj.optionA.indexOf("twoline") != -1){
            option = "<div class='options two'>";
        }else{
            option = "<div class='options auto'>";
        }
        option += "<div class='flex'>" + obj.optionA + "</div>";
        if(obj.optionB){
            option += "<div class='flex'>" + obj.optionB + "</div>";
        }
        if(obj.optionC){
            option += "<div class='flex'>" + obj.optionC + "</div>";
        }
        if(obj.optionD){
            option += "<div class='flex'>" + obj.optionD + "</div>";
        }
        option += "</div>";
    }
    return option;
}
function SetHtmlButton(obj){
    var button,type = obj.type,subject = arguments[1];
    if(obj.questionId){
        if(subject == "03"){
            var audio;
            if(obj.url){
                audio = "<i class='audioEN'><a href='javascript:;' data-url='" + obj.url + "' title='播放音频'>点击试听音频</a></i>";
            }else{
                audio = "<i class='audioEN'><a href='javascript:;' data-url='' title='无音频'>暂无音频</a></i>";
            }
            button =
                "<div class='buttons'>" + audio +
                "<div>" +
                "<span class='options_analysis'" +
                " data-id='" + obj.questionId + "'" +
                " data-type='work'>" +
                "查看解析" +
                "</span>" +
                "</div>" +
                "</div>";
        }else{
            button =
                "<div class='buttons'>" +
                "<div>" +
                "<span class='options_analysis'" +
                " data-id='" + obj.questionId + "'" +
                " data-type='work'>" +
                "查看解析" +
                "</span>" +
                "</div>" +
                "</div>";
        }
    }
    return button;
}
function SetHtmlAnswer(obj){
    var answer;
    if(obj.labels && obj.labels.length != 0){
        var Labels = obj.labels;
        for(var i=0;i<Labels.length;i++){
            if(Labels[i].questionType == "03" && Labels[i].content){
                answer = "<div class='answer'>" + Labels[i].content + "</div>";
                break;
            }
        }
    }
    return answer;
}
function SetHtmlAnalysis(obj){
    var analysis = "";
    if(obj.labels && obj.labels.length != 0){
        var Labels = obj.labels;
        for(var i=0;i<Labels.length;i++){
            if(Labels[i].questionType != "03" && Labels[i].questionType != "07" && Labels[i].content){
                analysis += "<div class='analysis'>" + Labels[i].content + "</div>";
            }
        }
    }
    return analysis;
}
