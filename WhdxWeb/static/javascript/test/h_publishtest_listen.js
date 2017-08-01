//reEdit by subo on 2017-2-14
//获取导航--------------------------------------------------------------------------------------------------------------
$(function(){$(window).scrollTop(100);});
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
pageScroll();
SystemRedMsg();
//获取url参数-----------------------------------------------------------------------------------------------------------
var thisId = Request.id,//获取栏目id
    thisActive = Request.ac,//获取课时id
    thisPt = Request.pt,//获取试卷type
    thisPi = Request.pi,//获取试卷paperId
    thisAi = Request.ai,//获取试卷保存地址id
    thisSt = Request.st;//获取试卷布置状态status
//拼接post发送数据------------------------------------------------------------------------------------------------------
var postKnowledge = {};//知识点
postKnowledge.knowledgeId = thisActive;
var postDataK = {},//当前测试 - 课时练
    postDataW = {},//当前测试 - 我的测试
    urlK = "/web/teacher/paper/assign/listeningtest",//请求地址 - 听力训练
    urlW = "/web/teacher/paper/assign/listeningtestwithidtype",//请求地址 - 我的测试
    postData = {},
    postUrl = "";
postDataK.categoryId = thisId;//栏目id
postDataK.knowledgeId = thisActive;//课时id
postDataW.paperType = thisPt;//作业类型
postDataW.paperId = thisPi;//作业paperId
thisPi ? postData = postDataW : postData = postDataK;//判断课时练默认或者是我的作业传入的参数
thisPi ? postUrl = urlW : postUrl = urlK;//判断课时练默认或者是我的作业传入的参数
//设置当前title---------------------------------------------------------------------------------------------------------
$("title").html("布置测试-英语听力训练");
//获取当前作业----------------------------------------------------------------------------------------------------------
function publishWorkData(callBack) {
    $.ajax({
        type: "post",
        url: postUrl,
        async: false,
        data: postData,
        dataType: "json",
        success: function (data) {
            var Data = data.retData,
                retCode = data.retCode,
                retMsg = data.retMsg;
            if(retCode === "0000"){
                new callBack(Data);
            }else{//如果返回异常状态码
                $("#audio").css("display","none");
                //确认？
                var errorUrl = "<div class='data_Popup data_Error'><div class='in'><img src='../../static/image/test/data_ErrorUrl_bg.jpg' /><div class='btn'><a style='float: none;margin: 0 auto;' href='javascript:;'>返回</a></div></div></div>";
                if(!$("div").hasClass("data_Error")){
                    $("body").prepend(errorUrl);
                }
                $(".data_Error").fadeIn(200);
                $(".data_Error .btn").on("click",function(){
                    window.location.href = "h_publishTest.html?ac=" + thisActive;
                });
            }
        }
    });
}
//回调事件：当前作业----------------------------------------------------------------------------------------------------
function publishWork(data) {
    this.Data = data;
    this.init();
}
publishWork.prototype = {
    init: function () {
        this.setPublishWork();//设置作业
        this.setUrlEdit();//设置“编辑”url参数
    },
    setPublishWork: function () {
        var Data = this.Data;
        //title
        $("#paperTitle").html(Data.paperName);
        //标题 / 时间
        var h1 = "<h1>" + Data.paperName + "</h1>";
        var  time = "<div class='timeing'>时间：" + Data.testTime +"<span>分钟</span>　分数：<span class='timeing_score'>" + Data.score + "</span><span>分</span></div>";
        //添加标题
        $(".exercise_box").prepend(h1 + time );
        //题目
        var ul = SetHtml(Pretreatment(Data));
        var workBox = "<div class='work_box'>" + ul + "</div>";
        //添加
        $(".exercise_box").append(workBox);
        //报错
        $(".options_analysis").each(function(i,obj){
            var dataId = $(obj).attr("data-id");
            $(obj).after("<span class='options_error' data-id='" + dataId + "' data-type='work'>报错</span>");
        });
        optionsError();
        //添加题目序号
        var jobList = $(".work_box > ul > li h3");//获取题号列表
        $.each(jobList,function (i, obj) {
            $(obj).find(".question_number").html((i+1) + "、");
        });
        // //不可拆分的组合题小题号排序
        // var litleList = $(".work_box > ul > li[issplite = '0']");//获取题目组
        // $.each(litleList,function (i, obj) {
        //     $.each($(obj).find("li"),function (i, obj) {
        //         $(obj).find(".question_number_liIn").html("");
        //     })
        // });
        totalScore();//总分
        lineScore();//试题行总分
        //查看解析
        $(".options_analysis").on("click",function () {
            var _id = ".work_box li[data-wrapid=" + $(this).attr("data-id") + "]",
                _this = this;
            $(this).hasClass("on") ? off() : on();
            function off(){
                $(_this).removeClass("on").html("查看解析");
                $(_id).find(".answer").fadeOut();
                $(_id).find(".analysis").fadeOut();
                $(_id).removeClass("on");
            }
            function on(){
                $(_this).addClass("on").html("收回解析");
                $(_id).find(".answer").fadeIn();
                $(_id).find(".analysis").fadeIn();
                $(_id).addClass("on");
            }
        });
        // //命题报告
        // $(".exercise_btn_statistics").on("click",function () {
        //     BC_statistics({
        //         data : Data,
        //         wrapId : "statistics_one",
        //         top: 80,
        //         right: 10,
        //         drag: true
        //     });
        // });
        //布置
        $(".exercise_btn_publish").on("click",function () {
            toSavePaper({
                paperId : Data.paperId,
                paperName : Data.paperName,
                testTime : Data.testTime,
                paperType : thisPt,
                assignId : thisAi
            });
        });
        //普通打印
        $(".normal").on("click",function () {
            $("#w_Print_Main").html("");//清空
            $("#w_Print_Main").append($(".exercise_box > h1").clone());
            $("#w_Print_Main").append($(".exercise_box .timing").clone());
            $("#w_Print_Main").append("<div class='work_box print'>" + $(".work_box").html() + "</div>");
            $("#w_Print_Main .answer").hide();
            $("#w_Print_Main .analysis").hide();
            $("#w_Print_Main .buttons").hide();
            $("#w_Print_Main math").remove();
            $("#w_Print_Main li.on").css("border","none");
            $("#w_Print").jqprint({
                importCSS: true
            });
        });
        //带解析打印
        $(".withAnalyze").on("click",function () {
            $("#w_Print_Main").html("");//清空
            $("#w_Print_Main").append($(".exercise_box > h1").clone());
            $("#w_Print_Main").append($(".exercise_box .timing").clone());
            $("#w_Print_Main").append("<div class='work_box print'>" + $(".work_box").html() + "</div>");
            $("#w_Print_Main .answer").show();
            $("#w_Print_Main .analysis").show();
            $("#w_Print_Main .buttons").hide();
            $("#w_Print_Main math").remove();
            $("#w_Print_Main li.on").css("border","none");
            $("#w_Print").jqprint({
                importCSS: true
            });
        });
        //显示打印方式
        $("#w_PrintBtn").click(function(){
            $('#NoIdentify').fadeIn(200);
        });
        //隐藏打印方式
        $(".GoPayClose").click(function(){
            $('#NoIdentify').fadeOut(200);
        });
        //播放器
        $( 'audio' ).audioPlayer();
        $("#audio").attr("src",Data.url);
    },
    setUrlEdit: function () {
        var Data = this.Data;
        var _href = "";
        thisPi ? _href = "h_publishTest_edit.html?ac=" + thisActive + "&pt=" + thisPt + "&pi=" + thisPi+"&ai="+thisAi+"&st="+thisSt : _href = "h_publishTest_edit.html?id=" + thisId + "&ac=" + thisActive + "&pt=" + thisPt;
        if(Data){
            $(".exercise_btn_edit").attr("href",_href);
        }
    }
};
//公共方法--------------------------------------------------------------------------------------------------------------
//去重
Array.prototype.unique = function () {
    this.sort();
    var newArray=[this[0]];
    for(var i = 1; i < this.length; i++) {
        if( this[i] !== newArray[newArray.length-1]) {
            newArray.push(this[i]);
        }
    }
    return newArray;
};
//启动------------------------------------------------------------------------------------------------------------------
publishWorkData(publishWork);
css();
function css(){
    $.ajax({
        type:"post",
        url:"/web/common/commonStyle",
        dataType:"json",
        success:function(data){
            if(data.retCode == "0000"){
                var retData = data.retData;
                if(retData){
                    $("head").append(retData);
                    $("#w_Print").append(retData);
                }
            }
        }
    })
}
/*播放or暂停*/
var IsCanPaly = function() {
    this.audio = document.getElementById('audio');
    this.playPause = document.getElementById('playPause');
    this.audioplayer = document.getElementById('audioplayer');
    this.Isplay = document.getElementById('Isplay');
    this.timeCurrent = document.getElementById('timeCurrent');
    this.barLoaded = document.getElementById('barLoaded');
};
IsCanPaly.prototype = {
    constructor: IsCanPaly, //确定原型链
    //播放
    EngPlay: function () {
        this.audio.play();
        this.audioplayer.className='audioplayer audioplayer-playing';
        this.Isplay.innerHTML = 'Pause';
        this.playPause.title = 'Pause';
    },
    //暂停播放
    EngStop: function () {
        this.audio.pause();
        this.audioplayer.className='audioplayer audioplayer-stopped';
        this.Isplay.innerHTML = 'Play';
        this.playPause.title = 'Play';
    },
    //重新暂停播放
    EngReset: function () {
        this.audio.pause();
        this.audioplayer.className='audioplayer audioplayer-stopped';
        this.Isplay.innerHTML = 'Play';
        this.playPause.title = 'Play';
        this.barLoaded.style.width='0%';
        this.timeCurrent.innerHTML='00:00';
    }
};
/*实例化*/
var Music=new IsCanPaly();
