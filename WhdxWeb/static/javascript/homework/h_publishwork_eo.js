//reEdit by subo on 2017-2-13
//获取导航--------------------------------------------------------------------------------------------------------------
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
SystemRedMsg();
//设置页面最小高度------------------------------------------------------------------------------------------------------
$(".edit_Box").css({"height": ($(window).height() - 272) + "px"});//设定最小高度
//获取url参数-----------------------------------------------------------------------------------------------------------
var thisId = Request.id,//获取栏目id
    thisActive = Request.ac,//获取课时id
    thisPt = Request.pt,//获取试卷type
    thisPi = Request.pi,//获取试卷paperId
    thisAi = Request.ai,//获取试卷保存地址id
    thisSt = Request.st;//获取试卷布置状态status
//拼接post发送数据------------------------------------------------------------------------------------------------------
//知识点/题型
var postKnowledge = {};//知识点
postKnowledge.knowledgeId = thisActive;
//当前测试
var postDataK = {},//当前测试 - 课时练
    postDataW = {},//当前测试 - 我的测试
    urlK = "/web/teacher/paper/assign/paperinfo",//请求地址 - 课时练
    urlW = "/web/teacher/paper/assign/paperinfowithidtype",//请求地址 - 我的测试
    postData = {},
    postUrl = "";
postDataK.categoryId = thisId;//栏目id
postDataK.knowledgeId = thisActive;//课时id
postDataW.paperType = thisPt;//作业类型 10：课时练，分层作业；11：作业自主组卷；12：测试自主组卷
postDataW.paperId = thisPi;//作业id
thisPi ? postData = postDataW : postData = postDataK;//判断课时练默认或者是我的作业传入的参数
thisPi ? postUrl = urlW : postUrl = urlK;//判断课时练默认或者是我的作业传入的参数
//题库
var papersData = {},
    _knowledgeId = "",//知识点id
    _questionTypeId = "",//题型id
    _pageSize = 4;//每页条数
papersData.pageNum = 1;//当前页码
papersData.pageSize = _pageSize;//每页条数
papersData.categoryId = thisActive;//课时id
//设置当前title---------------------------------------------------------------------------------------------------------
thisPi ? $("title").html("布置作业-我的作业-编辑") : $("title").html("布置作业-课时练-编辑");
if(thisPt=="102"||thisPt=="112"){
    $("title").html("布置作业-冲A+-编辑");
}else if(thisPt=="103"||thisPt=="113"){
    $("title").html("布置作业-考A吧-编辑");
}else if(thisPt=="104"||thisPt=="114"){
    $("title").html("布置作业-及格线-编辑");
}else if(thisPt=="105"||thisPt=="115"){
    $("title").html("布置作业-随堂检测");
}else if(thisPt=="106"||thisPt=="116"){
    $("title").html("布置作业-自主组卷");
}
//检查是否编辑过题目----------------------------------------------------------------------------------------------------
var thePaperString = "",theTime = "";//尾端事件后赋值为其string
var contrastString = "",contrastTime = "";//将在点击完成按钮时赋值为string
//回调------------------------------------------------------------------------------------------------------------------
function currentJobB() {
    //标题 / 时间
    var h1 = "<h1 class='paper_name'>　</h1><div class='timeing'></div>";
    //添加
    $(".edit_btn .clear").before(h1);
    $(".work_txtes").html("<ul></ul>");
    //事件
    $(".work_txtes").css({"height":$(window).height() - $(".work_txtes").offset().top - 35});//设定滚动区域高度
    timeing("timeing",0);
    //嵌套：ajax(知识点 / 嵌套：题型)
    post_ajaxAndData("/web/teacher/paper/assign/hourknowledges",postKnowledge,workKnowledge);
}
function currentJobA() {
    var Data = arguments[0].retData;
    if(Data){//如果有数据
        //title
        $("#paperTitle").html(Data.paperName);
        //标题 / 时间
        var h1 = "<h1 class='paper_name'>" + Data.paperName+ "</h1><div class='timeing'></div>";
        //题目
        var ul = SetHtml(Pretreatment(Data),"noScore");
        //添加
        $(".edit_btn .clear").before(h1);
        $(".work_txtes").html(ul);
        //事件
        $(".work_txtes").css({"height":$(window).height() - $(".work_txtes").offset().top - 35});//设定滚动区域高度
        timeing("timeing",Data.testTime);
    }
    //嵌套：ajax(知识点 / 嵌套：题型)
    post_ajaxAndData("/web/teacher/paper/assign/hourknowledges",postKnowledge,workKnowledge);
}
function workKnowledge() {
    var Data = arguments[0].retData,
        dd = "",
        dl = "";
    if(Data){
        $.each(Data,function (i,obj) {
            if(obj.label){
                dd += "<dd id='" + obj.code + "'>" + obj.label + "</dd>";
            }
        });
        dl = "<dl class='source_title_knowledge'><dt>知识点：</dt><dd id='allK'>全部</dd>" + dd + "<div class='clear'></div></dl>";
    }else{
        dl = "<dl class='source_title_knowledge'><dt>知识点：</dt><dd id='allK'>全部</dd><div class='clear'></div></dl>";
    }
    $(".source_title_knowledge dd").remove();//清空容器
    $(".source_title").append(dl);//添加html
    //事件
    $(".source_title_knowledge dd:first").addClass("on");//添加状态
    $(".source_title_knowledge dd").on("click",function () {//点击改变知识点id
        _knowledgeId = $(this).attr("id");
        //重载题库
        papersData.pageNum = 1;//初始化页码
        $(this).parent().find(".on").removeClass("on");
        $(this).addClass("on");
        if($(this).attr("id") !== "allK"){
            papersData.knowledgeId = _knowledgeId;
            //重载：ajax(题库 /嵌套：分页)
            post_ajaxAndData("/web/teacher/paper/assign/papersquestions",papersData,papersquestions);
        }else{
            delete papersData.knowledgeId;
            //重载：ajax(题库 /嵌套：分页)
            post_ajaxAndData("/web/teacher/paper/assign/papersquestions",papersData,papersquestions);
        }
    });
    //嵌套：ajax(题型 /嵌套：题库)
    post_ajaxAndData("/web/teacher/paper/assign/subjectquestiontypes",postKnowledge,workTypes);
}
function workTypes() {
    var Data = arguments[0].retData,
        dd = "",
        dl = "";
    if(Data){//如果有数据
        $.each(Data,function (i,obj) {
            dd += "<dd id='" + obj.code + "'>" + obj.label + "</dd>";
        });
        dl = "<dl class='source_title_workTypes'><dt>题型：</dt><dd id='allW'>全部</dd>" + dd + "<div class='clear'></div></dl>";
    }else{
        dl = "<dl class='source_title_workTypes'><dt>题型：</dt><dd id='allW'>全部</dd><div class='clear'></div></dl>";
    }
    $(".source_title").append(dl);//添加html
    //事件
    $(".source_title_workTypes dd:first").addClass("on");//添加状态
    $(".source_title_workTypes dd").on("click",function () {//改变题型id
        _questionTypeId = $(this).attr("id");
        //重载题库
        papersData.pageNum = 1;//初始化页码
        $(this).parent().find(".on").removeClass("on");
        $(this).addClass("on");
        if($(this).attr("id") !== "allW"){
            papersData.questionTypeId = _questionTypeId;
            //重载：ajax(题库 /嵌套：分页)
            post_ajaxAndData("/web/teacher/paper/assign/papersquestions",papersData,papersquestions);
        }else{
            delete papersData.questionTypeId;
            //重载：ajax(题库 /嵌套：分页)
            post_ajaxAndData("/web/teacher/paper/assign/papersquestions",papersData,papersquestions);
        }
    });
    //折叠
    var source_titleHeight = $(".source_txtes:first").offset().top - $(".edit_Box").offset().top -10;
    $("body").css("overflow","hidden");
    $(".source_title_btn").on("click",function () {
        var _this = $(this);
        $(this).hasClass("on") ? this_close() : this_open();
        function this_open() {
            $(_this).addClass("on").text("折叠");
            $(".source_title").stop(true,true).animate({
                height: source_titleHeight
            },200,function () {
                $(".source_txtes").css({"height":$(window).height() - $(".source_txtes").offset().top - $(".source_list").height() -117,"padding-bottom":"10px"});//设定滚动区域高度
            });
        }
        function this_close() {
            $(_this).removeClass("on").text("展开");
            $(".source_title").stop(true,true).animate({
                height: 80
            },200,function () {
                $(".source_txtes").css({"height":$(window).height() - $(".source_txtes").offset().top - $(".source_list").height() -117,"padding-bottom":"10px"});//设定滚动区域高度
            });
        }
    });
    //嵌套：ajax(题库 /嵌套：分页)
    post_ajaxAndData("/web/teacher/paper/assign/papersquestions",papersData,papersquestions);
}
function papersquestions() {
    var Data = arguments[0].retData;
    if(Data) {//如果有数据
        $(".source_txtes").html("");//清空之前的数据
        $(".source_txtes").css({"height":$(window).height() - $(".source_txtes").offset().top - $(".source_list").height() -117,"padding-bottom":"10px"});//设定高度
        //写入html
        papersquestionsBox(Data,1);
        //获取总页
        var _pagesNum = Data.pages;//页码总数
        //分页
        var totalPage = _pagesNum,//总页数
            totalRecords = totalPage * _pageSize;//总条数:总页数 * 每页条数
        //重载插件
        delete myKkpager;//清除旧插件
        $("#kkpager").remove();//清除旧节点
        myKkpager = $.extend(true, {}, kkpager);//克隆到新插件
        $(".my_kkpager").html("<div id='kkpager'></div>");//建立新节点
        myKkpager.generPageHtml({
            pno : 1,
            //总页码
            total : totalPage,
            //总数据条数
            totalRecords : totalRecords,
            mode : 'click',//默认值是link，可选link或者click
            click : function(n){
                papersData.pageNum = n;
                $.ajax({
                    type:"POST",
                    url:"/web/teacher/paper/assign/papersquestions",
                    dataType:"json",
                    data:papersData,
                    success:function(data){
                        var codenum = parseInt(data.retCode.substr(0, 1));
                        if (codenum == 0) {
                            new papersquestionsBox(data.retData,n);
                        }
                    },
                    error:function(){
                    }
                });
                //手动选中按钮
                this.selectPage(n);
                //重写插件html
                var kkHtml = $("#kkpager").clone(true).html();
                $("#kkpager").html(kkHtml.replace(/kkpager/g,"myKkpager").replace(/id="myK/g,'id="k'));
                //重写样式
                $("#kkpager > div").css({"width":"100%"});
                $("#kkpager > div > span").css({"float":"none","display":"block","overflow":"hidden","text-align":"center","padding":"4px 0"});
                $("#kkpager > div > span > span").css({"float":"none"});
                $("#kkpager > div > span > a").css({"float":"none"});
                return false;
            }
        },true);
        //重写插件html
        var kkHtml = $("#kkpager").clone(true).html();
        $("#kkpager").html(kkHtml.replace(/kkpager/g,"myKkpager").replace(/id="myK/g,'id="k'));
        //重写样式
        $("#kkpager > div").css({"width":"100%"});
        $("#kkpager > div > span").css({"float":"none","display":"block","overflow":"hidden","text-align":"center","padding":"4px 0"});
        $("#kkpager > div > span > span").css({"float":"none"});
        $("#kkpager > div > span > a").css({"float":"none"});
        //初始化页面
        function papersquestionsBox(data,num){
            var Data = data,
                thisNum = num;
            //题目
            var ul = SetHtml(Pretreatment(Data),"noScore");
            //添加html
            $(".source_txtes").html(ul);
            //尾端事件A
            optionsAnalysis();//解析
            //jobNumbers();//排列题号
            optionsDel();//删除 /嵌套：排列题号
            jobDrags();//拖动 /嵌套：排列题号
            optionsError();//报错
            optionsJoin();//选入
            jobDone();//完成
            //jobStatistics();//命题报告
            checkes();//输入检查
            //thePaperString赋值
            thePaperString = $(".edit_Box_work").text();
            theTime = $(".t_time").val();
            intMathJax();//公式
        }
    }else{//如果无数据
        $(".source_txtes").css({"height":$(window).height() - $(".source_txtes").offset().top - $(".source_list").height() -117,"padding-bottom":"10px"});
        $(".source_txtes").html("<img class='nodata' src='../../static/image/nodata.png'>");
        $("#kkpager").remove();//清除分页
        //尾端事件B
        optionsAnalysis();//解析
        //jobNumbers();//排列题号
        optionsDel();//删除 /嵌套：排列题号
        jobDrags();//拖动 /嵌套：排列题号
        jobDone();//完成
        //jobStatistics();//命题报告
        checkes();//输入检查
        //thePaperString赋值
        thePaperString = $(".edit_Box_work").text();
        theTime = $(".t_time").val();
        intMathJax();//公式
    }
}
//尾端事件--------------------------------------------------------------------------------------------------------------
//解析
function optionsAnalysis(){
    $(".options_analysis").off("click");//解绑冗余事件
    $(".options_analysis").on("click",function () {
        var _id = "",
            _this = this;
        var _type = $(this).attr("data-type");//判断类型：题库or作业
        _type == "work" ? _id = ".work_txtes li[data-wrapid=" + $(this).attr("data-id") + "]" : _id = ".source_txtes li[data-wrapid=" + $(this).attr("data-id") + "]";
        $(this).hasClass("on") ? off() : on();
        function off(){
            $(_this).removeClass("on").html("解析");
            $(_id).find(".answer").fadeOut();
            $(_id).find(".analysis").fadeOut();
            $(_id).removeClass("on");
        }
        function on(){
            $(_this).addClass("on").html("收回");
            $(_id).find(".answer").fadeIn();
            $(_id).find(".analysis").fadeIn();
            $(_id).addClass("on");
        }
    });
}
//排列题号
function jobNumbers(){
    //规则：
    //1、试题行，行标记<h2>，不添加题号;
    //2、组合题：1）不可拆分，题号加在材料标记<h3>上,小题标记<h4>  2）可拆分，材料标记<strong>，题号加在小题标记<h3>上;
    var jobList = $(".work_txtes > ul > li h3");//获取题号列表
    $.each(jobList,function (i, obj) {
        $(obj).find(".question_number").html((i+1) + "、");
    });
    //去掉不可拆分的小题排号，备份在下边以备需求变动
    $(".question_number_liIn").remove();
    // //不可拆分的组合题小题号排序
    // var litleList = $(".work_txtes > ul > li[issplite = '0']");//获取题目组
    // $.each(litleList,function (i, obj) {
    //     $.each($(obj).find("li"),function (i, obj) {
    //         $(obj).find(".question_number_liIn").html("（" + (i+1) + "）");
    //     })
    // })
}
//删除 /嵌套：排列题号
function optionsDel(){
    $(".options_del").off("click");//解绑冗余事件
    $(".options_del").on("click",function () {
        var _id = ".work_txtes li[data-wrapid=" + $(this).attr("data-id") + "]";//获取题目id  类型：String
        //题目删除前 先处理试题行规则
        if($(_id).prev().children().eq(0).is("h2")){//上边是试题行
            if($(_id).next().children().eq(0).is("h2")){//下边是试题行
                $(_id).prev().remove();
            }else if(!$(_id).next()[0]){//下边没行了
                //上边有紧挨的多个试题行，递归删除
                var line = $(_id).prev();
                delLine(line);
                function delLine(line) {
                    if($(line).prev().children().eq(0).is("h2")){
                        delLine();
                        $(line).prev().remove();
                    }
                }
                $(_id).prev().remove();
            }
        }
        if($(_id).parent().children().length == 1){//如果删的只剩该题
            $(_id).parent().prepend("<li style='display: none;' isShow='0'><h2>默认试题行</h2></li>")
        }
        //删除题目
        //组合题
        var isSplite = $(_id).attr("issplite");
        if(isSplite){
            var spliteId = $(_id).attr("splite-id");
            var isBol = $(".work_txtes > ul li[splite-id = " + spliteId + "]").length;
            var bol = isBol || 0;
            //不可拆分
            if(isSplite == "0"){
                $(_id).remove();//移除材料
            }
            //可拆分
            else if(isSplite == "1"){
                //只有1个小题
                if(bol == 2){
                    $(".work_txtes > ul li[splite-id = " + spliteId + "]").eq(0).remove();//移除材料
                }
                //多个小题
                else if(bol > 2){
                    $(_id).remove();//移除题目
                }
            }
        }
        //单题
        else{
            $(_id).remove();//移除题目
        }
        //改变题库为待选入
        var _id2 = ".source_txtes li[data-wrapid=" + $(this).attr("data-id") + "]";
        $(_id2).find(".options_join").html("选入").removeClass("on");
        //添加提示
        if(!$("div").hasClass("prompt")){
            $(".work_txtes").before("<div class='prompt'></div>");
        }
        $(".prompt").html("-1").fadeIn(200);
        setTimeout(outer,800);
        function outer() {
            $(".prompt").fadeOut(200)
        }
        //嵌套：排列题号
        //jobNumbers();
        //重载命题统计列表
        new BC_statistics.fn.reStatistics(newStatisticsData(),"statistics_one");
    });
}
//拖动 /嵌套：排列题号
function jobDrags(){
    //试题行和题目拖拽事件
    $(".work_txtes > ul,.line").sortable({
        placeholder: "ui-state",
        stop: function(event, ui){
            //嵌套：排列题号
            //jobNumbers();
            //重载命题统计列表
            new BC_statistics.fn.reStatistics(newStatisticsData(),"statistics_one");
        }
    });
    //组合题内部拖拽事件
    $(".splite").sortable({
        items: "li:not(li[issplite='0'])",
        placeholder: "ui-state",
        stop: function(event, ui){
            //嵌套：排列题号
            jobNumbers();
            //重载命题统计列表
            new BC_statistics.fn.reStatistics(newStatisticsData(),"statistics_one");
        }
    });
}
//选入
function optionsJoin(){
    $(".options_join").off("click");//解绑冗余事件
    $(".options_join").on("click",function () {
        var _id = ".source_txtes li[data-wrapid=" + $(this).attr("data-id") + "]",
            _workId = ".work_txtes li[data-wrapid=" + $(this).attr("data-id") + "]",//work块下的selector字符串
            _this = this;
        //组合题判断变量
        var isSplite = $(_id).attr("issplite"),
            spliteId = $(_id).attr("splite-id"),
            isBol = $(".work_txtes > ul li[splite-id = " + spliteId + "]").length,
            bol = isBol || 0;
        $(this).hasClass("on") ? off() : on();
        function on() {
            //不存在
            if($(_workId).length == 0){
                //改变按钮状态
                $(_this).addClass("on").html("取消");
                if($(_this).attr("data-id") != $(_id).find(".options_analysis").eq(0).attr("data-id")){
                    $(_id).find(".options_join").addClass("on").html("取消");
                }
                //看下是不是存在试题行，没有的话添加1个默认不显的
                if($(".work_txtes ul:first-child").children().length == 0){
                    $(".work_txtes ul:first-child").prepend("<li style='display: none;' isShow='0'><h2>默认试题行</h2></li>")
                }
                //复制样本
                var thisLi = $(_id).clone(false);//克隆目标
                //组合题
                if(isSplite){
                    //不可拆分
                    if(isSplite == "0"){
                        //如果没有材料
                        if(bol == 0){
                            $(".work_txtes > ul").append(thisLi);//添加
                        }
                        //如果已有材料
                        else if(bol > 0){
                            //不再添加，给与提示
                            if(!$("div").hasClass("c_Dissolve")){
                                $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                            }
                            $('#c_ErrorMsg').html("此题已存在").fadeIn(200);  Disappear("#c_ErrorMsg");
                        }
                    }
                    //可拆分
                    else if(isSplite == "1"){
                        //如果没有材料
                        if(bol == 0){
                            //克隆组合题
                            var thisTitle = $(".source_txtes > ul li[splite-id = " + spliteId + "]").eq(0).clone(false);
                            $(thisTitle).find(".splite").html(thisLi);//添加小题
                            $(".work_txtes > ul").append(thisTitle);//添加
                        }
                        //如果已有材料
                        else if(bol > 0){
                            var thisTitle = $(".work_txtes > ul li[splite-id = " + spliteId + "]").eq(0);//找到组合题
                            $(thisTitle).find(".splite").append(thisLi);//添加小题
                        }
                    }
                }
                //单题
                else{
                    $(".work_txtes > ul").append(thisLi);//添加
                }
                //更改按钮
                $(_workId).find(".options_analysis").attr("data-type","work");
                $(_workId).find(".options_error").remove();
                $(_workId).find(".options_join").addClass("options_del").removeClass("options_join on").html("删除").attr("data-type","work");
                //添加提示
                $(".work_txtes").scrollTop($(_workId).position().top + $(".work_txtes").scrollTop() - $(_workId).height());
                $(_workId).css({'width': '100%','background-color': '#f4fbed'});
                for (var i = 1; i < 8; i++)
                {
                    $(_workId).animate({
                        'margin-left': '-=2',
                        'border': '1px solid #65b113'
                    }, 5, function() {
                        $(this).animate({
                            'margin-left': '+=4'
                        }, 5, function() {
                            $(this).animate({
                                'margin-left': '-=2'
                            }, 5, function() {
                                $(this).animate({
                                    'margin-left': '-=1'
                                }, 5, function() {
                                    $(this).animate({
                                        'margin-left': '+=2'
                                    },5,function(){
                                        $(this).animate({
                                            'margin-left': '-=1'
                                        },5,function(){
                                            //恢复
                                            $(this).removeAttr("style");
                                        });
                                    });
                                });
                            });
                        }).css('border', '1px solid #65b113');
                    });
                }
                //重载事件：解析、删除、排列题号、拖拽
                optionsAnalysis();//解析
                optionsDel();//删除 /嵌套：排列题号
                jobNumbers();//排列题号
                jobDrags();//拖拽
            }
            //已存在
            else{
                if(!$("div").hasClass("c_Dissolve")){
                    $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                }
                $('#c_ErrorMsg').html("此题已存在").fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
        function off() {
            $(_this).removeClass("on").html("选入");
            //组合题
            if(isSplite){
                //不可拆分
                if(isSplite == "0"){
                    $(_workId).remove();
                }
                //可拆分
                else if(isSplite == "1"){
                    //只有1个小题
                    if(bol == 2){
                        $(".work_txtes > ul > li[splite-id = " + spliteId + "]").eq(0).remove();//删除材料
                    }
                    //大于1个小题
                    else if(bol > 2){
                        $(_workId).remove();//删除小题
                    }
                }
            }
            //单题
            else{
                $(_workId).remove();
            }
            //添加提示
            if(!$("div").hasClass("prompt")){
                $(".work_txtes").before("<div class='prompt'></div>");
            }
            $(".prompt").html("-1").fadeIn(200);
            setTimeout(outer,800);
            function outer() {
                $(".prompt").fadeOut(200)
            }
            //重载事件
            jobNumbers();//排列题号
        }
        //重载命题统计列表
        new BC_statistics.fn.reStatistics(newStatisticsData(),"statistics_one");
    });
}
//完成 /嵌套：删除旧试卷
function jobDone(){
    $(".edit_btn_done").off("click");
    $(".edit_btn_done").on("click",function () {
        //时间不能为0
        if(parseInt($(".t_time").val()) <= 0){
            $(".t_time").parent().css({"position":"absolute","background":"#fff"});
            $(".t_time").css("color","red");
            shock($(".t_time").parent());
            return;
        }
        //contrastString赋值
        contrastString = $(".edit_Box_work").text();
        contrastTime = $(".t_time").val();
        //更改类型,关系到跳转的页面逻辑
        var newPt = thisPt;
        //如果题目和行都是空的，无法继续并提示
        if($(".work_txtes ul").children().length == 0){
            if (!$("div").hasClass("c_Dissolve")) {
                $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
            }
            $('#c_ErrorMsg').html('请您操作后再进行保存').fadeIn(200); Disappear("#c_ErrorMsg");
            return;
        }
        //如果没有编辑,立即跳转回原始id页面
        if(thePaperString == contrastString && theTime == contrastTime){
            //从作业类型进入
            if(!thisPi){
                window.location.href = "h_publishWork_exercise.html?id=" + thisId + "&pt=" + newPt + "&ac=" + thisActive;
            }
            //从我的作业列表进入
            else{
                window.location.href = "h_publishWork_exercise.html?ac=" + thisActive + "&pt=" + newPt + "&pi=" + thisPi + "&ai=" + thisAi + "&st=" + thisSt;
            }
        }
        //已经编辑了,保存，如果原始id未布置一并删除
        else{
            newPt = thisPt.replace(/0/,"1");
            var postPaperData = newWorkData(newPt);
            //有题目才允许保存
            var postPaperDataBol = false;
            $.each(postPaperData.questionLines,function(i,obj){
                if(obj.customLineTj.length > 0){
                    postPaperDataBol = true;
                    return false;
                }
            });
            if(postPaperData && postPaperDataBol){
                $.ajax({
                    type: "post",
                    url: "/web/teacher/paper/assign/savecustompaper",
                    data: JSON.stringify(postPaperData),
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success:function(data){
                        if (data.retCode === "0000") {
                            //成功后解除事件并置灰
                            $(".edit_btn_done").off("click").css("background-color","#aaa").val("提交成功");
                            //删除(如果旧保存id是未布置 ： status = "2")
                            if(thisSt == "2"){
                                var delData = {};
                                delData.paperId = thisPi;
                                delData.assignId = thisAi;
                                $.ajax({
                                    type: "post",
                                    url: "/web/teacher/paper/assign/delete",
                                    data: delData,
                                    dataType:"json",
                                    success: function (data) {
                                        //console.log(data);//后台删除动作：删除成功或失败后不做任何提示
                                    }
                                });
                            }
                            //返回
                            var newPi = data.retData.paperId,//作业新id
                                newAssignId = data.retData.assignId,//作业新保存记录id
                                newStatus = "2";//作业新布置情况id 刚刚点完成的 布置情况肯定是未布置
                            if (!$("div").hasClass("c_Dissolve")) {
                                $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                            }
                            var _i =2;
                            $('#c_ErrorMsg').html('保存成功,将在' + _i + '秒后返回').fadeIn(200);
                            //跳转倒计时
                            set();
                            function set() {
                                _i--;
                                $('#c_ErrorMsg').html('保存成功,将在' + _i + '秒后返回');
                                if (_i > 0) {
                                    setTimeout(set, 1000);//_i大于0时每秒递归
                                } else {
                                    get();//跳转
                                }
                            }
                            //跳转方法
                            function get() {
                                window.location.href = "h_publishWork_exercise.html?ac=" + thisActive + "&pt=" + newPt + "&pi=" + newPi + "&ai=" + newAssignId + "&st=" + newStatus;
                            }
                        } else {
                            if (!$("div").hasClass("c_Dissolve")) {
                                $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                            }
                            $('#c_ErrorMsg').html('保存失败').fadeIn(200); Disappear("#c_ErrorMsg");
                        }
                    },
                    error:function () {
                        if (!$("div").hasClass("c_Dissolve")) {
                            $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                        }
                        $('#c_ErrorMsg').html('请求失败').fadeIn(200); Disappear("#c_ErrorMsg");
                    }
                });
            }else{
                if (!$("div").hasClass("c_Dissolve")) {
                    $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                }
                $('#c_ErrorMsg').html('请您添加题目后再做保存！').fadeIn(200); Disappear("#c_ErrorMsg");
            }
        }
    });
}
// //命题报告
// function jobStatistics(){
//     //命题报告
//     $(".edit_btn_statistics").on("click",function () {
//         BC_statistics({
//             data : newStatisticsData(),
//             wrapId : "statistics_one",
//             top: 260,
//             right: 10,
//             drag: true
//         });
//     });
// }
//更新试卷名称
function jobName() {
    post_ajaxAndData("/web/teacher/paper/assign/custompapername",{knowledgeId:thisActive},thePaperName);
    function thePaperName() {
        var Data = arguments[0].retData;
        Data ? $(".paper_name").html(Data) : $(".paper_name").html("自主组卷");
        Data ? $("#paperTitle").html(Data) : $("#paperTitle").html("自主组卷");
    }
}
//试题默认样式引入
css();
function css(){
    $.ajax({
        type:"post",
        url:"/web/common/commonStyle",
        dataType:"json",
        success:function(data){
            if(data.retCode == "0000"){
                var retData = data.retData;
                $("head").append(retData);
            }
        }
    })
}
//公共方法--------------------------------------------------------------------------------------------------------------
//保存提交数据归纳:   type 也就是 assiginId是会根据试卷类型变化的,需要传入
function newWorkData(newThisPt) {
    var newPaper = {};//作业或试卷
    newPaper.paperName = $(".paper_name").html();
    newPaper.knowledgeId = thisActive;
    newPaper.type = newThisPt;
    newPaper.editorType = "1";//后台统计布置类型接口：默认1：修改 ； 2：自主组卷，仅从布置页面的自主组题入口进入的传2
    newPaper.testTime = $(".t_time").val();
    newPaper.questionLines = [];
    newPaper.isMarked = $(".work_txtes li[data-selectable = '0']").length > 0 ? "1" : "0";
    if(thisPt == "106" || thisPt == "116"){
        newPaper.editorType = "2";
    }
    var lnNum = 0,//试题行计数
        lnNumTrue = [];//试题行实际位置记录组
    $.each($(".work_txtes  ul  li"),function (i,obj){
        //归纳试题行:判断li第1个子节点是不是h2  是的话就归纳1个行，之后的li题目在出现h2之前都归此行所有
        if($(obj).children().eq(0).is("h2")){
            lnNum++;
            lnNumTrue.push(i);
            var newLine = {};//试题行
            newLine.isShow = $(obj).attr("isshow");
            newLine.showOrder = lnNum;
            newLine.remarks = $(obj).find("h2 .line_number").text() + $(obj).find("h2 .line_name").text();
            newLine.scoreDef = $(obj).find("h2 .line_score").text().replace("每小题","每小题" + $(obj).find("h2 input").val());
            newLine.customLineTj = [];
            newPaper.questionLines.push(newLine);
        }
        //归纳单题 || 可拆分组合 || 不可拆分组合 ：非关系型数据，面向过程,更方便
        else if($(obj).children().eq(0).is("h3") || $(obj).children().eq(0).is("strong") || $(obj).children().eq(0).is("h4")){
            var newQuestion = {};//题
            newQuestion.lnOrder = parseInt($(obj).find(".question_number").text()) || i;//i;
            newQuestion.questionId = $(obj).attr("data-wrapid");
            //每次单历过程，大于 此时“试题行实际位置记录组”的最后1个，就添加
            if(i > lnNumTrue[lnNumTrue.length -1]){
                newPaper.questionLines[lnNumTrue.length - 1].customLineTj.push(newQuestion);
            }
        }
    });
    //遍历新数据，找到题行，并赋值其第1个小题的号
    $.each(newPaper.questionLines,function (i, obj) {
        $.each(obj.customLineTj,function (j, obj) {
            if(isNaN(obj.lnOrder)){
                newPaper.questionLines[i].customLineTj[j].lnOrder = newPaper.questionLines[i].customLineTj[j+1].lnOrder;
            }
        });
    });
    return newPaper;
}
//命题报告数据归纳
function newStatisticsData() {
    var newPaper = {};//作业或试卷
    newPaper.questionLines = [];
    var lnNumTrue = [];//试题行实际位置记录组
    $.each($(".work_txtes  ul  li"),function (i,obj){
        //归纳试题行
        if($(obj).children().eq(0).is("h2")){
            lnNumTrue.push(i);
            var newLine = {};//试题行
            newLine.customLineTj = [];
            newPaper.questionLines.push(newLine);
        }
        //归纳单题 || 可拆分组合 || 不可拆分组合
        else if($(obj).children().eq(0).is("h3") || $(obj).children().eq(0).is("strong") || $(obj).children().eq(0).is("h4")){
            var newQuestion = {};//题
            //组合题
            if($(obj).attr("data-groupCode")){
                if($(obj).attr("issplite") == "0"){//不可拆分
                    newQuestion.lnOrder = $(obj).find(".question_number").eq(0).text().replace(/、/,"");
                    newQuestion.knowledgeId = $(obj).attr("data-knowledgeid");
                    newQuestion.knowledgeName = $(obj).attr("data-knowledgename");
                    newQuestion.difficultName = $(obj).attr("data-difficultname");
                    newQuestion.groupCode = $(obj).attr("data-groupCode");
                    //去除小题
                    if($(obj).parent().hasClass("splite")){
                        newQuestion = null;
                    }
                }else if($(obj).attr("issplite") == "1"){//可拆分
                    newQuestion.lnOrder = $(obj).find(".question_number").eq(0).text().replace(/、/,"");
                    newQuestion.knowledgeId = $(obj).attr("data-knowledgeid");
                    newQuestion.knowledgeName = $(obj).attr("data-knowledgename");
                    newQuestion.difficultName = $(obj).attr("data-difficultname");
                    newQuestion.groupCode = $(obj).attr("data-groupCode");
                    //去除材料
                    if($(obj).children("ul").hasClass("splite")){
                        newQuestion = null;
                    }
                }
            }
            //单题
            else{
                newQuestion.lnOrder = $(obj).find(".question_number").text().replace(/、/,"");
                newQuestion.knowledgeId = $(obj).attr("data-knowledgeid");
                newQuestion.knowledgeName = $(obj).attr("data-knowledgename");
                newQuestion.difficultName = $(obj).attr("data-difficultname");
                newQuestion.groupCode = null;
            }
            //添加
            if(i > lnNumTrue[lnNumTrue.length -1]){
                if(newQuestion != null){
                    newPaper.questionLines[lnNumTrue.length - 1].customLineTj.push(newQuestion);
                }
            }
        }
    });
    return newPaper;
}
//右侧时间选择
function timeing(node,value) {
    var thisWrap = "." + node;
    var thisUp = thisWrap + "_up",
        thisDown = thisWrap + "_down",
        thisTimes = [],
        thisHtml = "";
    //拼接html
    thisHtml = "<span>时间：</span><ul><span class='" + thisUp.replace(/./,"") + "'>上翻</span><span class='" + thisDown.replace(/./,"") + "'>下翻</span><li><input class='t_time' type='text' value=''></li><li>" + value + "</li><li>30</li><li>35</li><li>40</li><li>45</li><li>50</li><li>55</li><li>60</li><li>65</li><li>70</li><li>75</li><li>80</li><li>85</li><li>90</li><li>95</li><li>100</li><li>105</li><li>110</li><li>115</li><li>120</li><li>125</li><li>130</li><li>135</li><li>140</li><li>145</li><li>150</li></ul><span>分钟</span>";
    $(thisWrap).html(thisHtml);//添加
    //事件
    var _times = $(thisWrap).find("li");
    for(var i = 1;i < _times.length;i++){
        thisTimes.push(Number($(_times[i]).text()));
    }
    var papertime = thisTimes[0] != 0 ? thisTimes[0] : 60;
    $(thisWrap).find("input").val(papertime);//设置默认时间
    //去重
    thisTimes = thisTimes.unique();
    //排序
    thisTimes.sort(function(a,b){
        return a-b});
    //上翻
    $(thisUp).on("click",function () {
        var num = thisTimes.indexOf(Number($(thisWrap).find("input").val())) + 1;
        if(num < thisTimes.length){
            $(thisWrap).find("input").val(thisTimes[num]);
            $(thisWrap).find("input").css("color","#333");
        }
    });
    //下翻
    $(thisDown).on("click",function () {
        var num = thisTimes.indexOf(Number($(thisWrap).find("input").val())) - 1;
        if(num >= 0){
            $(thisWrap).find("input").val(thisTimes[num]);
        }
    });
    //改变
    $(thisWrap).find("input").on("change",function () {
        $(this).css("color","#333");
    })
}
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
//中文数字转换
function toChinese(num) {
    if(isNaN(num)) return num;
    var AA = ["0", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var BB = ["", "十", "百", "千", "万", "亿", "点", ""];
    var a = ("" + num).replace(/(^0*)/g, "").split("."), k = 0, re = "";
    for (var i = a[0].length - 1; i >= 0; i--) {
        switch (k) {
            case 0: re = BB[7] + re; break;
            case 4: if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
                re = BB[4] + re; break;
            case 8: re = BB[5] + re; BB[7] = BB[5]; k = 0; break;
        }
        if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
        if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re; k++;
    }
    if (a.length > 1) //加上小数部分(如果有小数部分)
    {
        re += BB[6];
        for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
    }
    return re;
}
//罗马数字转换
function toRoman(num){
    if(isNaN(num)) return num;
    var alpha=[ 'I', 'V', 'X', 'L', 'C', 'D', 'M' ];
    var roman="";
    var bit = 0;
    while (num > 0)
    {
        var tempnum = num % 10;
        switch (tempnum)
        {
            case 3:
            {
                roman=alpha[bit]+roman;
                tempnum--;
            }
            case 2:
            {
                roman=alpha[bit]+roman;
                tempnum--;
            }
            case 1:
            {
                roman=alpha[bit]+roman;
                break;
            }
            case 4:
            {
                roman=alpha[bit + 1]+roman;
                roman=alpha[bit]+roman;
                break;
            }
            case 8:
            {
                roman=alpha[bit]+roman;
                tempnum--;
            }
            case 7:
            {
                roman=alpha[bit]+roman;
                tempnum--;
            }
            case 6:
            {
                roman=alpha[bit]+roman;
                tempnum--;
            }
            case 5:
            {
                roman=alpha[bit + 1]+roman;
                break;
            }
            case 9:
            {
                roman=alpha[bit + 2]+roman;
                roman=alpha[bit]+roman;
                break;
            }
            default:
            {
                break;
            }
        }
        bit += 2;
        num = Math.floor(num / 10);
    }
    return roman;
}
