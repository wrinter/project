/**
 * Created by wcd on 2016/12/28.
 */
/**
 * Created by wcd on 2016/12/19.
 */
var getPaperDetail=function(){};
getPaperDetail.prototype={
    constructor:getPaperDetail,//确定原型链
    init:function(){
        this.assign_paper();
        this.getCss();
    },
    getUrl:function () {
        var url =window.location.href;
        var u = url.split("?");
        if(typeof(u[1]) == "string"){
            u= u[1].replace(/id=/,"");
            return u ;
        }
    },
    getCss : function(){
        $.ajax({
            type:"post",
            url:"/api/common/commonStyle",
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
    },
    assign_paper: function(){
        var param={};
        var questionId=this.getUrl().split("&")[0];
        param.uuid=this.getUrl().split("&")[1].split("=")[1];
        param.paperType=this.getUrl().split("&")[2].split("=")[1];
        param.paperId=this.getUrl().split("&")[3].split("=")[1];
        $.ajax({
            "type": "post",
            "url": "/api/teacher/paper/assign/paperinfowithidtype",
            "dataType":'json',
            "data": param,
            success:function(data){
                var li="";
                var subject="",answer="";
                var questionLines=data.retData.questionLines;
                for(var k in questionLines){
                    for(var _k in questionLines[k].questionGroup){
                        for(var key in questionLines[k].questionGroup[_k].questions){
                            if(questionLines[k].questionGroup[_k].questions[key].questionId==questionId){
                                if(questionLines[k].questionGroup[_k].isSplite=="0"){
                                    var alllabel = questionLines[k].questionGroup[_k].labels;
                                    for(var _key in alllabel){
                                        var content = alllabel[_key].content;
                                        var questionType = alllabel[_key].questionType;
                                        if(content.indexOf('【难度】')==-1) {
                                            content = (content.replace(/\【/g, "")).replace(/】/g, ": ");
                                            answer += "<div class='labelsContent'>" + content + "</div>";
                                        }
                                    }
                                }
                                var questionTitle = questionLines[k].questionGroup[_k].questions[key].questionTitle;
                                if(questionTitle.indexOf("<p>"==-1)){
                                    questionTitle = "<p style='margin-left:20px;'><span>"+questionTitle+"</span></p>";
                                }
                                subject+="<div class='paperDetailTitle'>"+"<label>"+questionLines[k].questionGroup[_k].lnOrder+"、</label>"+questionTitle.replace("【题干】","").replace("<img","<img style='max-width:100%;' ")+"</div>";

                              //  if(questionLines[k].questionGroup[_k].questions[key].questionTypeId=="01"){
                                subject+="<div class='choose'>"+questionLines[k].questionGroup[_k].questions[key].optionA+"</div>";
                                subject+="<div class='choose'>"+questionLines[k].questionGroup[_k].questions[key].optionB+"</div>";
                                subject+="<div class='choose'>"+questionLines[k].questionGroup[_k].questions[key].optionC+"</div>";
                                subject+="<div class='choose'>"+questionLines[k].questionGroup[_k].questions[key].optionD+"</div>";
                           //     }
                                var labels = questionLines[k].questionGroup[_k].questions[key].labels;
                                for(var _key in labels){
                                    var content = labels[_key].content;
                                    var questionType = labels[_key].questionType;
                                    if(content.indexOf('【难度】')==-1) {
                                        content = (content.replace(/\【/g, "<span style='color:#63C5E6'>")).replace(/】/g, "</span>:");
                                        answer += "<div class='labelsContent'>" + content + "</div>";
                                    }
                                }
                            }
                        }

                    }
                }
                $(".a_subject").html(subject.replace(/null/g,""));
                $(".a_answer").html(answer.replace(/null/g,""));
                intMathJax();//公式
            }
        });
    }
}
$(function() {
    new getPaperDetail().init();//实例化
})
