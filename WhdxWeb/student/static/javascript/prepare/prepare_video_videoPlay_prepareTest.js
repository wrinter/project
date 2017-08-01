/**
 * Created by wcd on 2016/11/28.
 */
    CheckBrower();

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
 var category_id=getUrl(),t;

/********************************************预习测试***********************************************/
var prepareTest=function(){};
prepareTest.prototype={
    constructor:prepareTest,//确定原型链
    //初始化
    init:function(){
        this.test();
        this.css();
        //this.testTime();
    },
    //试题 展示
    test:function(){
        var param={};
        var that=this;
        param.resId=category_id;
        $.ajax({
            type: "post",
            url: "/web/student/prepare/video/test",
            data:param,
            dataType: "json",
            success:function(data){
                var t_list=data.retData.questionList;
                var t_length=data.retData.questionList.length;
                var li="",liRight="";
                $(".paperTitle").html(data.retData.testTitle);
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
                        if(t_list[k].list[k1].questionType !="07") {
                            li += t_list[k].list[k1].content.replace("【题干】", "<span class='wr'></span>");
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
                    liRight+='<a class="ainmate_a" href="#'+t_list[k].id+'"><li id="'+t_list[k].id+'_num" class="num_li">'+(Number(k)+1)+'</li></a>';
                }
                li+="<input type='button' class='btnSubmit' value='提&nbsp;交'>";
                $(".paperTest").html(li.replace(/null/g,""));
                $(".paperAnswer").html(liRight);
                intMathJax();//公式
                //自定义属性为hidden的隐藏
                $("div[data-hidden='testHidden']").hide();
                /******************************此处为选择答案***************************/
                //点击  选择答案
                var t_flag=[];
                that.choiceAnswer(t_flag);
                //点击提交
                that.clickSub(t_length,t_flag);
                that.ainmateClick();
            }
        });
    },
    ainmateClick:function(){
        $('.ainmate_a').click(function () {
            $('html, body').animate({
                scrollTop: $($.attr(this, 'href')).offset().top
            }, 500);
            return false;
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
            //首次点击选项时，选择的答案
            //var exp=/[\(\（\(\（]\s*[\)\）\)\）]/g;
            //if(exp.test($(this).parent().siblings("div").html())){
            //    $(this).parent().siblings("div").html($(this).parent().siblings("div").html().replace(exp,"（"+answer+"）"));
            //}
            //修改答案时（多次点击）修改答案
            var exp1=/[\(\（][a-zA-Z]*[\)\）]/g;
            $(this).parent().siblings("div").html($(this).parent().siblings("div").html().replace(exp1,"（"+answer+"）"));
            index=$(this).parent().parent().parent().parent().index();
            if(answer==$(this).parent().parent().parent().parent().attr("data-answer")){
                t_flag[index]=true;
            }else{
                t_flag[index]=false;
            }
            //将相应的题号变色
            var numid = $(this).parent().parent().parent().parent().attr("id")+"_num";
            $("#"+numid).addClass("hasFinished");
        });
    },
    /*clickSub:function(t_length,t_flag){
        $(".btnSubmit").on("click",function(){
            for(var j=0;j<t_length;j++){//判断正误
                if(t_flag[j]){
                    $(".paperTestLi:eq("+j+")").find("div[data-tit='tit']").find(".wr").html("<img src='../../../static/image/prepare/right.png'>");
                }else{
                    $(".paperTestLi:eq("+j+")").find("div[data-tit='tit']").find(".wr").html("<img src='../../../static/image/prepare/wrong.png'>");
                }
            }
            $("div[data-hidden='testHidden']").show();
            clearTimeout(t);
        });
    },*/
    //提交试卷
    clickSub:function(t_length,t_flag){
        var self = this;
        $(".btnSubmit").on("click",function(){
            var that = $(this);
            if(t_flag.length != t_length){
                $(".shark").show();
                $(".model_paper_delete_correr,.model_paper_success_correr").on("click",function(){//取消
                    $(this).closest(".shark").hide();
                    //点击  选择答案
                    var t_flag=[];
                    self.choiceAnswer(t_flag);
                });
                $(".model_paper_false_correr").on("click",function() {//确定
                    for(var j=0;j<t_length;j++){//判断正误
                        if(t_flag[j]){
                            $(".paperTestLi:eq("+j+")").find("div[data-tit='tit']").find(".wr").html("<img src='../../../static/image/prepare/right.png'>");
                            /*if($(".num_li:eq("+j+")").hasClass("hasFinished")){*/
                                $(".num_li:eq("+j+")").addClass("right");
                            /*}*/
                        }else{
                            $(".paperTestLi:eq("+j+")").find("div[data-tit='tit']").find(".wr").html("<img src='../../../static/image/prepare/wrong.png'>");
                            /*if($(".num_li:eq("+j+")").hasClass("hasFinished")){*/
                                $(".num_li:eq("+j+")").addClass("wrong");
                            /*}*/
                        }
                    }
                    $("div[data-hidden='testHidden']").show();
                    clearTimeout(t);
                    $(this).closest(".shark").hide();
                    that.hide();
                });
            }else{
                for(var j=0;j<t_length;j++){//判断正误
                    if(t_flag[j]){
                        $(".paperTestLi:eq("+j+")").find("div[data-tit='tit']").find(".wr").html("<img src='../../../static/image/prepare/right.png'>");
                        $(".num_li:eq("+j+")").addClass("right");
                    }else{
                        $(".paperTestLi:eq("+j+")").find("div[data-tit='tit']").find(".wr").html("<img src='../../../static/image/prepare/wrong.png'>");
                        $(".num_li:eq("+j+")").addClass("wrong");
                    }
                }
                $("div[data-hidden='testHidden']").show();
                clearTimeout(t);
                that.hide();
            }
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
    },
    testTime : function(){
        var start = new Date();//开始时间
        function timer(){
            var now = new Date();
            ts = now.getTime() - start.getTime();
            var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
            var mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
            var ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数
            hh = checkTime(hh);
            mm = checkTime(mm);
            ss = checkTime(ss);
            document.getElementById("s_paper_hour").innerHTML = hh;
            document.getElementById("s_paper_min").innerHTML = mm;
            document.getElementById("s_paper_second").innerHTML = ss;
        }
        function checkTime(i){
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
        t = setInterval(timer,1000);
    }
}
$(function() {
    new prepareTest().init();
});
window.onscroll=function(){
    var top = $(window).scrollTop();
    if(top>135){
        top = top - 135;
        $(".paper_right_div").css({ top: top + "px" });
    }else{
        $(".paper_right_div").css({ top: "0px"});
    }
}