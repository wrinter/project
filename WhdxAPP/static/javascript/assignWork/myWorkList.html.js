/**
 * Created by wcd on 2016/12/28.
 */
window.onload=function(){
    var getWorkList=function(){};
    getWorkList.prototype={
        constructor:getWorkList,//确定原型链
        init:function(){
            this.assign_paper();
        },
        getUrl:function(){
            var url =window.location.href;
            var u = url.split("?");
            if(typeof(u[1]) == "string"){
                u= u[1].replace(/uuid=/,"");
                return u ;
            }
        },
        assign_paper:function(){
            var param={};
            var that=this;

            var uuid=that.getUrl().split("&")[0];
            param.uuid=uuid;
            param.paperType=that.getUrl().split("&")[1].split("=")[1];
            param.paperId=that.getUrl().split("&")[2].split("=")[1];
            $.ajax({
                "type": "post",
                "url": "/api/teacher/paper/assign/paperinfowithidtype",
                "dataType":'json',
                "data": param,
                success:function(data){
                    console.log(data);
                    var li="";
                    var questionLines=data.retData.questionLines;
                    //将题型写入html中
               /*     for(var k in questionLines){
                        li+="<p class='typeName'>"+questionLines[k].lineName+"</p>";
                        for(var _k in questionLines[k].questionGroup){
                            li+="<div class='content'>";
                            li+="<a href='myWork_detail.html?id="+questionLines[k].questionGroup[_k].questionId+"&uuid="+uuid+"&knowledgeId="+that.getUrl().split("&")[1].split("=")[1]+"&categoryId="+that.getUrl().split("&")[2].split("=")[1]+"'>";
                            li+=questionLines[k].questionGroup[_k].questionTitle.replace("【题干】","").replace("<img","<img style='max-width:100%;' ");

                            li+="</a>";
                            li+="</div>";
                        }
                    }*/
                    for(var k in questionLines){
                        li+="<p class='typeName'>"+questionLines[k].lineName+"</p>";
                        for(var _k in questionLines[k].questionGroup){
                            for(var key in questionLines[k].questionGroup[_k].questions){
                                li+="<div class='content'>";
                                li+="<a href='myWork_detail.html?id="+questionLines[k].questionGroup[_k].questions[key].questionId+"&uuid="+uuid+"&knowledgeId="+that.getUrl().split("&")[1].split("=")[1]+"&categoryId="+that.getUrl().split("&")[2].split("=")[1]+"'>";
                                li+=questionLines[k].questionGroup[_k].questions[key].questionTitle.replace("【题干】","").replace("<img","<img style='max-width:100%;' ");

                                li+="</a>";
                                li+="</div>";
                            }

                        }
                    }
                    $(".m_paper").html(li);
                }
            });
        }
    }
    $(function() {
        new getWorkList().init();//实例化
    })
}