/**
 * Created by wcd on 2016/11/28.
 */
    CheckBrower();
SystemRedMsg();
/********************************************url***********************************************/
    function getUrl(){
        var url =window.location.href;
        var u = url.split("?");
        if(typeof(u[1]) == "string"){
            u= u[1].replace(/id=/,"");
            return u ;
        }
    }
//   var category_id=getUrl().split("&")[0];
 var category_id=getUrl();

/********************************************预习测试***********************************************/
    var prepareTest=function(){};
    prepareTest.prototype={
        constructor:prepareTest,//确定原型链
        //初始化
        init:function(){
           this.test();
           this.css();
        },
        //试题 展示
        test:function(){
            var param={};
            var that=this;
            param.resId=category_id;
            $.ajax({
                type: "post",
                url: "/web/teacher/prepare/video/test",
                data:param,
                dataType: "json",
                success:function(data){
                    var t_list=data.retData.questionList;
                    var t_length=data.retData.questionList.length;
                    var li="";
                    $(".paperTitle").html(data.retData.testTitle);
                    //$(".testTitle").html("预习测试");
                    for(var k in t_list){
                        li+="<li class='paperTestLi' data-answer='"+t_list[k].answer+"' id='"+t_list[k].id+"' >";
                        li+="<ul class='paperTestLiUl'>";
                        for(var k1 in t_list[k].list){
                            li+="<li style='display: inline;' id='"+t_list[k].list[k1].id+"'>";
                            li+="<div class='paperTestLiUlContent p1'"
                            if(t_list[k].list[k1].questionType!="01"){
                                li+="data-hidden='testHidden'";
                            }else{
                                li+="data-tit='tit'";
                            }
                            li+=">";
                            li+="<span class='p_order'>"+(Number(k)+1)+"、</span>";
                            if(t_list[k].list[k1].questionType !="07"){
                                li+=t_list[k].list[k1].content.replace("【题干】","<span class='wr'></span>");
                            }
                            li+="</div>";
                            if(t_list[k].list[k1].questionType=="01"){
                                li+="<ul class='t_option'>";
                                li+="<li class='t_optionLi t_hli optionA p1 ml25'>"+t_list[k].optionA+"</li>";
                                li+="<li class='t_optionLi t_hli optionB p1 ml25'>"+t_list[k].optionB+"</li>";
                                li+="<li class='t_optionLi t_hli optionC p1 ml25'>"+t_list[k].optionC+"</li>";
                                li+="<li class='t_optionLi t_hli optionD p1 ml25'>"+t_list[k].optionD+"</li>";
                                li+="</ul>";
                            }
                            li+="</li>";
                        }
                        li+="</ul>";
                        li+="</li>";
                    }
                    li+=" <input type='button' class='btnSubmit' value='提&nbsp;交'>";
                    $(".paperTest").html(li.replace(/null/g,""));
                    intMathJax();//公式
                    //自定义属性为hidden的隐藏
                    $("div[data-hidden='testHidden']").hide();
                    /******************************此处为选择答案***************************/
                    //点击  选择答案
                    var t_flag=[];
                    that.choiceAnswer(t_flag);
                    //点击提交
                    that.clickSub(t_length,t_flag);
                }
            });
        },
        choiceAnswer:function(t_flag){
            var index;
            var answer;//提交时，与answer对比，用于判断正误的;
            $(".paperTest").on("click",".t_optionLi",function(){
                //获取 点击后的选项
                if($(this).hasClass("optionA")){
                    answer="A";
                    $(this).addClass("on").siblings().removeClass("on");
                }else if($(this).hasClass("optionB")){
                    answer="B";
                    $(this).addClass("on").siblings().removeClass("on");
                }else if($(this).hasClass("optionC")){
                    answer="C";
                    $(this).addClass("on").siblings().removeClass("on");
                }else if($(this).hasClass("optionD")){
                    answer="D";
                    $(this).addClass("on").siblings().removeClass("on");
                }
                console.log(answer);
                ////首次点击选项时，选择的答案
                //var exp=/[\(\（\(\（]\s*[\)\）\)\）]/g;
                //if(exp.test($(this).parent().siblings("div").html())){
                //    $(this).parent().siblings("div").html($(this).parent().siblings("div").html().replace(exp,"（"+answer+"）"));
                //}
                ////修改答案时（多次点击）修改答案
                //var exp1=/[\(\（][a-zA-Z]*[\)\）]/g;
                //$(this).parent().siblings("div").html($(this).parent().siblings("div").html().replace(exp1,"（"+answer+"）"));
                index=$(this).parent().parent().parent().parent().index();
                if(answer==$(this).parent().parent().parent().parent().attr("data-answer")){
                    t_flag[index]=true;
                }else{
                    t_flag[index]=false;
                }
            });
        },
        clickSub:function(t_length,t_flag){
            $(".btnSubmit").on("click",function(){
                for(var j=0;j<t_length;j++){//判断正误
                    if(t_flag[j]){
                        $(".paperTestLi:eq("+j+")").find("div[data-tit='tit']").find(".wr").html("<img src='../../../static/image/prepare/right.png'>");
                    }else{
                        $(".paperTestLi:eq("+j+")").find("div[data-tit='tit']").find(".wr").html("<img src='../../../static/image/prepare/wrong.png'>");
                    }
                }
                $("div[data-hidden='testHidden']").show();
                $(".btnSubmit").hide();
                $(".paperTest").unbind('click');
                $(".t_optionLi").removeClass('t_hli');
            });
        },
        css:function(){
            $.ajax({
                type:"post",
                url:"/web/common/commonStyle",
                dataType:"json",
                success:function(data){
                    if(data.retCode == "0000"){
                        var retData = data.retData;
                        $("head").append(retData);
                    }
                },
                error:function(e){
                    console.log(e)
                }
            })
        }
    }
    /*var prepareBase = {

        //预习导学案
        base:function(){
            var param={};
            var that=this;
            param.resId=category_id;
            $.ajax({
                type: "post",
                url: "/web/teacher/prepare/video/base",
                data:param,
                dataType: "json",
                success:function(data){
                    console.log(data)
                    var t_list=data.retData.questionList;
                    var t_length=data.retData.questionList.length;
                    var li="";
                    $(".paperTitle").html(data.retData.testTitle);
                    $(".baseTitle").html("导学案");
                    for(var k in t_list){
                        li+="<li class='paperBaseLi' data-answer='"+t_list[k].answer+"' id='"+t_list[k].id+"' >";
                        li+="<ul class='paperBaseLiUl'>";
                        for(var k1 in t_list[k].list){
                            li+="<li style='display: inline;' id='"+t_list[k].list[k1].id+"'>";
                            li+="<div class='paperBaseLiUlContent p1'"
                            if(t_list[k].list[k1].questionType!="01"){
                                li+="data-hidden='baseHidden'";
                            }else{
                                li+="data-tit='tit'";
                            }
                            li+=">";
                            if(t_list[k].list[k1].questionType=="01" || t_list[k].list[k1].questionType=="03"){
                                li+=t_list[k].list[k1].content.replace("【题干】","<span class='_order'>"+(Number(k)+1+"、")+"</span><span class='wr'></span>").replace("<img","<img style='max-width:100%;margin-left:-10px;' ");
                            }
                            li+="</div>";
                            if(t_list[k].list[k1].questionType=="01"){
                                li+="<ul class='t_option'>";
                                li+="<li class='t_optionLi optionA p1 ml25'>"+t_list[k].optionA+"</li>";
                                li+="<li class='t_optionLi optionB p1 ml25'>"+t_list[k].optionB+"</li>";
                                li+="<li class='t_optionLi optionC p1 ml25'>"+t_list[k].optionC+"</li>";
                                li+="<li class='t_optionLi optionD p1 ml25'>"+t_list[k].optionD+"</li>";
                                li+="</ul>";
                            }
                            li+="</li>";
                        }
                        li+="</ul>";
                        li+="</li>";
                    }
                    li+=" <input type='button' class='baseBtnSubmit fn_submit' value='提&nbsp;交'>";
                    $(".paperBase").html(li.replace(/null/g,""));
                    //自定义属性为hidden的隐藏
                    $("div[data-hidden='baseHidden']").hide();
                    /!******************************此处为选择答案***************************!/
                    //点击  选择答案
                    var t_flag=[];
                    prepareBase.choiceAnswer(t_flag);
                    //点击提交
                    prepareBase.clickSub(t_length,t_flag);
                }
            });
        },

        //选择答案
        choiceAnswer:function(t_flag){
            var index;
            var answer;//提交时，与answer对比，用于判断正误的;
            $(".paperBase").on("click",".t_optionLi",function(){
                //获取 点击后的选项
                if($(this).hasClass("optionA")){
                    answer="A";
                    $(this).addClass("on").siblings().removeClass("on");
                }else if($(this).hasClass("optionB")){
                    answer="B";
                    $(this).addClass("on").siblings().removeClass("on");
                }else if($(this).hasClass("optionC")){
                    answer="C";
                    $(this).addClass("on").siblings().removeClass("on");
                }else if($(this).hasClass("optionD")){
                    answer="D";
                    $(this).addClass("on").siblings().removeClass("on");
                }
                console.log(answer);
                //首次点击选项时，选择的答案
                var exp=/[\(\（\(\（]\s*[\)\）\)\）]/g;
                if(exp.test($(this).parent().siblings("div").html())){
                    $(this).parent().siblings("div").html($(this).parent().siblings("div").html().replace(exp,"（"+answer+"）"));
                }
                console.log($(this).parent().siblings("div").html($(this).parent().siblings("div").html()));
                //修改答案时（多次点击）修改答案
                var exp1=/[\(\（][a-zA-Z]*[\)\）]/g;
                $(this).parent().siblings("div").html($(this).parent().siblings("div").html().replace(exp1,"（"+answer+"）"));
                index=$(this).parent().parent().parent().parent().index();
                if(answer==$(this).parent().parent().parent().parent().attr("data-answer")){
                    t_flag[index]=true;
                }else{
                    t_flag[index]=false;
                }
            });
        },

        //提交试卷
        clickSub:function(t_length,t_flag){
            $(".fn_submit").on("click",function(){
                for(var j=0;j<t_length;j++){//判断正误
                    if(t_flag[j]){
                        $(".paperBaseLi:eq("+j+")").find("div[data-tit='tit']").find(".wr").html("<img src='../../../static/image/prepare/right.png'>");
                    }else{
                        $(".paperBaseLi:eq("+j+")").find("div[data-tit='tit']").find(".wr").html("<img src='../../../static/image/prepare/wrong.png'>");
                    }
                }
                $("div[data-hidden='baseHidden']").show();
            });
        }
    }*/
    $(function() {
        new prepareTest().init();
    });