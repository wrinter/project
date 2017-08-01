/**
 * Created by wcd on 2016/12/15.
 */
window.onload=function(){

    var uuid="0cc175b9c0f1b6a831c399e269772661";
    var getPaper=function(){};
    getPaper.prototype={
        constructor:getPaper,//确定原型链
        init:function(){
            this.assign_paper();
        },
        assign_paper:function(){
            var param={};
            // param.uuid="0cc175b9c0f1b6a831c399e269772661";
            param.uuid="e155ca618446405429f22ecc2670d659";
            param.knowledgeId="dc892b17dd8a4f44905fbe2cec327838";
            param.categoryId="95bb3984827241e3b6d9efcb76b8d966";
            $.ajax({
                "type": "post",
                "url": "/api/teacher/paper/assign/papers",
                "dataType":'json',
                "data": param,
                success:function(data){
                    var li="";
                    var questionTypes=data.retData.questionTypes;
                    var q_length=data.retData.questionTypes.length;
                    //将题型写入html中
                    for(var k in questionTypes){
                        li+="<p class='typeName'>"+questionTypes[k].typeName+"</p>";
                        for(var _k in questionTypes[k].questions){
                            li+="<div class='content'>";
                            li+="<a href='assignWork_detail.html?id="+questionTypes[k].questions[_k].questionId+"&uuid="+"e155ca618446405429f22ecc2670d659"+"&knowledgeId="+"dc892b17dd8a4f44905fbe2cec327838"+"&categoryId="+"95bb3984827241e3b6d9efcb76b8d966"+"'>";



                            li+=questionTypes[k].questions[_k].questionTitle.replace("【题干】","").replace("<img","<img style='max-width:100%;' ");





                            li+="</a>";
                            li+="</div>";
                        }
                    }

                    $(".a_paper").html(li);
                }
            });
        }
    }
    $(function() {
        new getPaper().init();//实例化
    })
}