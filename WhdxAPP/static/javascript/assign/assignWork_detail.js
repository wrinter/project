/**
 * Created by wcd on 2016/12/19.
 */
function getUrl(){
    var url =window.location.href;
    var u = url.split("?");
    if(typeof(u[1]) == "string"){
        u= u[1].replace(/id=/,"");
        return u ;
    }
}
var questionId=getUrl().split("&")[0];
var uuid=getUrl().split("&")[1].split("=")[1];
var knowledgeId=getUrl().split("&")[2].split("=")[1];
var categoryId=getUrl().split("&")[3].split("=")[1];
var getPaperDetail=function(){};
getPaperDetail.prototype={
    constructor:getPaperDetail,//确定原型链
    init:function(){
        this.assign_paper();
    },
    assign_paper:
    function(){
        var param={};
        param.uuid=uuid;
        param.knowledgeId=knowledgeId;
        param.categoryId=categoryId;
        $.ajax({
            "type": "post",
            "url": "/api/teacher/paper/assign/papers",
            "dataType":'json',
            "data": param,
            success:function(data){
                var li="";
                var questionTypes=data.retData.questionTypes;
                for(var k in questionTypes){
                    for(var _k in questionTypes[k].questions){
                       if(questionTypes[k].questions[_k].questionId==questionId){
                          li+="<div class='paperDetailTitle'>" +questionTypes[k].questions[_k].questionTitle.replace("【题干】","")+"</div>";
                          li+="<div class='answer'>";
                           for(var key in questionTypes[k].questions[_k].labels){
                               li+="<div class='labelsContent'>"+questionTypes[k].questions[_k].labels[key].content+"</div>";
                           }
                           li+="</div>";
                       }
                    }
                }
                $(".paper_detail").html(li);
            }
        });
    }
}
$(function() {
   new getPaperDetail().init();//实例化
})