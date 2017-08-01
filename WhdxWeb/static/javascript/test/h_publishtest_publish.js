SystemRedMsg();
function toSavePaper() {
    var idata = arguments[0];
    //检查是否存在班级
    new post_ajaxAndData("/web/teacher/paper/assign/assignclass",{},hasClasses);//获取班级数据
    function hasClasses(data) {
        if (data.retData[0]) {//如果班级列表有项
            savePaper(idata,data);//弹出正确窗口
        }else{//否则
            erroPrompt();//弹出无班级提示，并指引添加班级
        }
    }
}
function erroPrompt() {
    var errorUrl = "<div class='data_Popup exercise_ErrorUrl'><div class='in'><span class='close'>关闭</span><img src='../../static/image/homework/exercise_ErrorUrl_bg.jpg' /><div class='btn'><a href='/model/classmanagement/classmanagenew.html'>创建班级</a><a href='/model/classmanagement/classmanagenew.html'>加入班级</a></div></div></div>";
    //添加并弹出
    if(!$("div").hasClass("exercise_ErrorUrl")){
        $("body").prepend(errorUrl);
    }
    $(".exercise_ErrorUrl").fadeIn(200);
    //关闭事件
    $(".exercise_ErrorUrl .close").on("click",function () {//关闭按钮
        $(".exercise_ErrorUrl").fadeOut(200);
    });
}
function savePaper() {
    var _paperId = arguments[0].paperId,//试卷id
        _paperName = arguments[0].paperName,//试卷时间
        _paperTime = arguments[0].testTime,//试卷名称
        _paperType = arguments[0].paperType,//试卷类型
        _assignId = arguments[0].assignId;//布置记录id
    var bData = arguments[1];//班级数据
    //发送url参数
    var doparam = {},
        assignObj = [],
        paperResId = _paperId,
        paperName = _paperName,
        testTime = _paperTime,
        score = parseInt($(".timeing_score").eq(0).text().replace(/[^0-9]/g,"")),
        paperType = _paperType,
        deadline = null,
        assignId = _assignId;
    //初始化布置对象tab选项卡
    var thistab = "";//班级 / 小组 / 个人
    //获取班级
    var thisClasses = "";//班级组
    setClasses(bData);
    function setClasses(data){
        if (data.retData[0]) {//如果班级列表有项
            thistab += "<a class='on' href='javascript:;'>班级</a>";//添加选项卡
            //拼接html，添加选项卡项
            var li = "";//班级列表
            Data = data.retData;
            $.each(Data,function (i,obj) {
                li += "<li data-num='" + obj.studNum + "' data-id='" + obj.classId + "'>" + obj.className + "</li>";
            });
            thisClasses = "<ul class='obj_type_con set_classes'>" + li + "</ul>";
            setHtml();
        }
    }
    //获取明天的日期
    function GetDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear(),
            m = dd.getMonth()+1,
            d = dd.getDate();
        if(String(m).length == 1){
            m = "0" + m;
        }
        if(String(d).length == 1){
            d = "0" + d;
        }
        var thisVal = y + "-" + m + "-" + d + " 22:00";
        return thisVal;
    }
    //拼接html
    function setHtml() {
        var workName = "<dl><dt>测试名称：</dt><dd>" + _paperName + "</dd></dl><div class='clear'></div>",
            workTime = "<dl><dt>建议用时：</dt><dd><input class='act_time' type='text' value='" + _paperTime + "'>　分钟</dd></dl><div class='clear'></div>",
            workStart = "",//"<dl><dt>布置时间：</dt><dd><input class='act_start_time' type='text' value=''/></dd></dl><div class='clear'></div>",//后台无接口，删除
            workStop = "<dl><dt>截止时间：</dt><dd><input class='act_stop_time' type='text' value='"+GetDateStr(1)+"'/></dd></dl><div class='clear'></div>",//<input class='act_stop_time_h' type='text' value='0'/><input class='act_stop_time_m' type='text' value='00'/>
            worFor = "<div class='dl tab'><dl><dt>布置对象：</dt><dd>" + thistab + "</dd></dl><div class='clear'></div>" + thisClasses + "</div><div class='clear'></div>",
            done = "<div class='dl done'><a class='work_done' href='javascript:;'>确定</a></div>";
        var publishBox = "<div class='publish_box'><i class='publish_box_close spriteImg c_closeico fr c_closeimg0'></i>" + workName + workTime + workStart + workStop + worFor + done + "</div>";
        if($("div").hasClass("publish_box_Main")){
            $(".publish_box_Main").html(publishBox);//刷新
            $(".publish_box_Main").fadeIn(200);
        }else{
            $("body").append("<div class='publish_box_Main'>" + publishBox + "</div>");//添加
            $(".publish_box_Main").fadeIn(200);
        }
        //设置列表区域高度
        var _maxHeight = $(window).height() - 374;
        var _marginTop = ($(window).height() - $(".publish_box").height() -80)/2;
        $(".publish_box").css("margin-top",_marginTop + "px");
        $(".obj_type_con").css({"max-height":_maxHeight + "px","overflow-y":"auto"});
        //如果是模拟套卷或听力测试，禁用建议用时
        if(paperType == "202" || paperType == "203"){
            $(".act_time").attr("disabled","disabled").css("color","#999");
        }
        //关闭
        $(".publish_box_close").on("click",function () {
            $(".publish_box_Main").fadeOut(200);
        })
        //时间插件设置
        $("input.act_start_time,input.act_stop_time").datetimepicker();//datetimepicker :日期+时间；datepicker:日期；timepicker:时间
        //可选时间范围
        $("input.act_start_time,input.act_stop_time").datetimepicker("option","minDate",0);
        $("input.act_start_time,input.act_stop_time").datetimepicker("option","maxDate",null);
        //setTime("input.act_stop_time_h",["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]);
        //setTime("input.act_stop_time_m",["00","05","10","15","20","25","30","35","40","45","50","55"]);
        function setTime(node,array) {
            var li = "";
            $.each(array,function (i, obj) {
                li += "<li>" + obj + "</li>";
            });
            var ul = "<ul class='set_time' style='display: none;'>" + li + "</ul>";
            $(node).on("click",function () {
                $(this).css("background-position","35px -40px");
                //添加或更新
                if(!$("ul").hasClass("set_time")){
                    $("body").append(ul);
                    $("ul.set_time").fadeIn(200);
                }else{
                    $("ul.set_time").remove();
                    $("body").append(ul);
                    $("ul.set_time").fadeIn(200);
                }
                //定位
                var _top = $(this).offset().top + $(this).height(),
                    _left = $(this).offset().left;
                $("ul.set_time").css({"top":_top,"left":_left});
                //事件
                var _this = this;
                $("ul.set_time li").on("click",function () {
                    $(_this).val($(this).text());
                });
                $(this).on("blur",function () {
                    $(_this).css("background-position","35px 10px");
                    $("ul.set_time").fadeOut(200);
                })
            })
        }
        //点击传送班级
        $(".set_classes li").on("click",function () {
            var valNum = null;//推入的下标
            var _this = $(this),
                thisId = $(this).attr("data-id"),
                thisNum = $(this).attr("data-num"),
                thisName = $(this).text(),
                thisParam = {};
            thisParam.classId = thisId;
            thisParam.className = thisName;
            thisParam.studNum = thisNum;
            thisNum === "0" ? noStudent() : $(this).hasClass("on") ? off() : on();
            function on() {
                $(_this).addClass("on");
                assignObj.push(thisParam);
                valNum = assignObj.indexOf(thisParam);
            }
            function off() {
                $(_this).removeClass("on");
                assignObj.splice(valNum,1);
            }
            function noStudent() {
                if(!$("div").hasClass("c_Dissolve")){
                    $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                };
                $('#c_ErrorMsg').html('此班级中无学生，不能布置作业').fadeIn(200);  Disappear("#c_ErrorMsg");
                $(_this).css("color","#ccc");
            }

        });
        //提交前检查格式
        //建议用时
        $(".act_time").on("keyup",function () {
            var $testTime = $(this).val();
            if(checkNum($testTime)){
                $(this).css("border-color","#ccc");
                if($(this).parent().find("span").hasClass("orange")){
                    $(this).parent().find(".orange").remove();
                }
            }else{
                $(this).css("border-color","orange");
                if(!$(this).parent().find("span").hasClass("orange")){
                    $(this).parent().append("<span class='orange' style='padding-left: 20px;color: orange;'>请您输入1-999的整数时间</span>");
                }

            }
        });
        Done();
    }
    //提交
    function Done() {
        $(".work_done").on("click",function () {
            deadline = $( "input.act_stop_time" ).val().replace(/-/g,"/");// + " " + $( "input.act_stop_time_h" ).val().replace(/-/g,"/") + ":" + $( "input.act_stop_time_m" ).val().replace(/-/g,"/");
            testTime = $( "input.act_time" ).val();
            doparam.assignObj = assignObj;
            doparam.paperResId = paperResId;
            doparam.assignId = assignId;
            doparam.paperName = paperName;
            doparam.testTime = testTime;
            doparam.score = score;
            doparam.paperType = paperType;
            doparam.deadline = new Date(deadline);
            //请求前检查
            if(!checkNum(testTime)){
                if(!$("div").hasClass("c_Dissolve")){
                    $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                };
                $('#c_ErrorMsg').html('请输入正确的建议用时').fadeIn(200);  Disappear("#c_ErrorMsg");
            }else if(deadline === ""){
                if(!$("div").hasClass("c_Dissolve")){
                    $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                };
                $('#c_ErrorMsg').html('请您选择日期').fadeIn(200);  Disappear("#c_ErrorMsg");
            }else if(new Date(deadline)< new Date()){
                if(!$("div").hasClass("c_Dissolve")){
                    $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                };
                $('#c_ErrorMsg').html('请您选择正确的日期').fadeIn(200);  Disappear("#c_ErrorMsg");
            }else if(!doparam.assignObj[0]){
                if(!$("div").hasClass("c_Dissolve")){
                    $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                };
                $('#c_ErrorMsg').html('请您选择班级').fadeIn(200);  Disappear("#c_ErrorMsg");
            }else{
                //请求
                $.ajax({
                    "type": "post",
                    "url": "/web/teacher/paper/assign/assignpaperstoclass",
                    'data': JSON.stringify(doparam),
                    'contentType':"application/json;charset=utf-8",
                    "dataType": "json",
                    success: function (data) {
                        if (data.retCode == "0000"){
                            //成功后解除事件并置灰
                            $(".work_done").off("click").css("background-color","#aaa").val("提交成功");
                            //金币
                            GoldAnimate(data.retGold);
                            if(!$("div").hasClass("c_Dissolve")){
                                $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                            };
                            $(".publish_box_Main").fadeOut(200);
                            $('#c_ErrorMsg').html('布置成功,即将跳转').fadeIn(200);  Disappear("#c_ErrorMsg");
                            setTimeout(resetUrl,1000);
                            var thisActive = Request.ac;//获取课时id
                            function resetUrl() {
                                window.location.href = "h_publishTest.html?ac=" + thisActive;
                            }
                        }
                        else {
                            if(!$("div").hasClass("c_Dissolve")){
                                $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                            };
                            $('#c_ErrorMsg').html('布置失败,请联系管理员').fadeIn(200);  Disappear("#c_ErrorMsg");
                        }
                    }
                });
            }
        });
    }
}
//公共方法--------------------------------------------------------------------------------------------------------------
//数字检查
function checkNum(value){
    var reg = /^\d+$/;
    if(value.constructor === String && value != 0 && value < 1000 && String(value)[0] != 0){
        var re = value.match(reg);
        if(re){
            return true;
        }
    }
    return false;
}
