/**
 * Created by zxl on 2016/12/28.
 */

$(function() {
    var getWorkList=function(){};
    getWorkList.prototype= {
        constructor: getWorkList,//确定原型链
        paper: {
            paperId:'',
            paperName:'',
            allQuestions:[]
        },
        init: function () {
            this.assign_paper();
            this.getCss();
        },
        getCss: function () {
            $.ajax({
                type: "post",
                url: "/api/common/commonStyle",
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.retCode == "0000") {
                        var retData = data.retData;
                        $("head").append(retData);
                    }
                },
                error: function (e) {
                    console.log(e)
                }
            })
        },
        assign_paper: function () {
            var param = {};
            var that = this;
            var uuid = Request.uuid;
            param.uuid = uuid;
            param.paperType = Request.paperType;
            param.paperId = Request.paperId;
            $.ajax({
                "type": "post",
                "url": "/api/teacher/paper/assign/paperinfowithidtype",
                "dataType": 'json',
                "data": param,
                success: function (data) {
                    processData(data);
                }
            });
        }
    };
    function showPaper(){
        var html = "";
        var all = worklist.paper.allQuestions;
        for(var i=0;i<all.length;i++){
            if(all[i].scoreDef!=null&&all[i].scoreDef!=''){
                html += "<div class='lineName'>"+all[i].lineName + all[i].scoreDef +"</div>";
            }else{
                html += "<div class='lineName'>"+all[i].lineName+"</div>";
            }
            var group = all[i].group;
            if(group.length>0){
                for(var k=0;k<group.length;k++){
                    var questions = group[k].questions;
                    if(group[k].content!=undefined){
                        html += "<div class='content'><label>" + group[k].questionNum + "、</label>"
                            + group[k].content.replace("【","").replace("材料","").replace("】","") + "</div>";
                    }
                    for(var j=0;j<questions.length;j++){
                        html += "<div class='content'>";
                        html += "<a href='myWork_detail.html?id="+ questions[j].questionId +"&uuid="+Request.uuid+"&knowledgeId="+Request.paperType+"&categoryId="+Request.paperId+"'>";
                        html += "<div class='paperTitle'><label>"+ questions[j].questionNum +"、</label>" + questions[j].questionTitle.replace("【题干】","") +"</div>";
                        if(questions[j].selectable=="1"){
                            html += "<div class='choose'>"+questions[j].optionA +"</div>";
                            html += "<div class='choose'>"+questions[j].optionB +"</div>";
                            html += "<div class='choose'>"+questions[j].optionC +"</div>";
                            html += "<div class='choose'>"+questions[j].optionD +"</div>";
                        }
                        html += "</a>";
                        html += "</div>";
                    }
                }
            }
        }
        $(".w_paper").html(html.replace(/null/g,""));
        intMathJax();//公式
    }
    function processData(data) {
        if (data.retCode == "0000") {
            var retData = data.retData;
            worklist.paper.paperId = retData.paperId;
            worklist.paper.paperName = retData.paperName;
            var questionlines = retData.questionLines;
            var num = 0;
            for (var i = 0; i < questionlines.length; i++) {
                var qLines = {};
                var questionGroup = questionlines[i].questionGroup;
                qLines.lineName = questionlines[i].lineName;
                qLines.scoreDef = questionlines[i].scoreDef;
                qLines.group = [];
                for (var j = 0; j < questionGroup.length; j++) {
                    var group = {};
                    group.questions = [];
                    var questions = questionGroup[j].questions;
                    if (questionGroup[j].groupCode != null && questionGroup[j].groupCode != '') {
                        if (questionGroup[j].isSplite == "0") {
                            group.content = questionGroup[j].content;
                            num++;
                            group.questionNum = num;
                            for (var k = 0; k < questions.length; k++) {
                                var question = {};
                                question.questionId = questions[k].questionId;
                                question.questionTitle = questions[k].questionTitle;
                                question.labels = [];
                                for (var m = 0; m < questions[k].labels; m++) {
                                    var label = {};
                                    label.content = questions[k].labels[m].content;
                                    label.id = questions[k].labels[m].id;
                                    label.questionId = questions[k].labels[m].questionId
                                    label.questionType = questions[k].labels[m].questionType;
                                    question.labels.push(label);
                                }
                                question.selectable = questions[k].selectable;
                                if (questions[k].selectable == "1") {
                                    question.optionA = questions[k].optionA;
                                    question.optionB = questions[k].optionB;
                                    question.optionC = questions[k].optionC;
                                    question.optionD = questions[k].optionD;
                                }
                                group.questions.push(question);
                            }
                        } else {
                            group.content = questionGroup[j].content;
                            for (var k = 0; k < questions.length; k++) {
                                var question = {};
                                question.questionId = questions[k].questionId;
                                question.questionTitle = questions[k].questionTitle;
                                question.labels = [];
                                num++;
                                question.questionNum = num;
                                for (var m = 0; m < questions[k].labels; m++) {
                                    var label = {};
                                    label.content = questions[k].labels[m].content;
                                    label.id = questions[k].labels[m].id;
                                    label.questionId = questions[k].labels[m].questionId
                                    label.questionType = questions[k].labels[m].questionType;
                                    question.labels.push(label);
                                }
                                question.selectable = questions[k].selectable;
                                if (questions[k].selectable == "1") {
                                    question.optionA = questions[k].optionA;
                                    question.optionB = questions[k].optionB;
                                    question.optionC = questions[k].optionC;
                                    question.optionD = questions[k].optionD;
                                }
                                group.questions.push(question);
                            }
                        }
                    } else {
                        for (var k = 0; k < questions.length; k++) {
                            var question = {};
                            question.questionId = questions[k].questionId;
                            question.questionTitle = questions[k].questionTitle;
                            num++;
                            question.questionNum = num;
                            question.labels = [];
                            for (var m = 0; m < questions[k].labels; m++) {
                                var label = {};
                                label.content = questions[k].labels[m].content;
                                label.id = questions[k].labels[m].id;
                                label.questionId = questions[k].labels[m].questionId
                                label.questionType = questions[k].labels[m].questionType;
                                question.labels.push(label);
                            }
                            question.selectable = questions[k].selectable;
                            if (questions[k].selectable == "1") {
                                question.optionA = questions[k].optionA;
                                question.optionB = questions[k].optionB;
                                question.optionC = questions[k].optionC;
                                question.optionD = questions[k].optionD;
                            }
                            group.questions.push(question);
                        }
                    }
                    qLines.group.push(group);
                }
                worklist.paper.allQuestions.push(qLines);
            }
            showPaper();
        }
    }
    var worklist = new getWorkList();//实例化
    worklist.init();
});