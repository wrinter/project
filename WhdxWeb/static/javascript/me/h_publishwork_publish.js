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
SystemRedMsg();
function erroPrompt() {
    var errorUrl = "<div class='data_Popup exercise_ErrorUrl'><div class='in'><span class='close'>关闭</span><img src='../../static/image/homework/exercise_ErrorUrl_bg.jpg' /><div class='btn'><a href='/model/classmanage/classmanage.html'>创建班级</a><a href='/model/classmanage/classmanage.html'>加入班级</a></div></div></div>";
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
    //初始布置对象
    var thisObjType = "0";//string   0：班级   1：小组    2：个人
    //获取参数
    var _paperId = arguments[0].paperId,//试卷id
        _paperName = arguments[0].paperName,//试卷名称
        _paperTime = arguments[0].testTime,//试卷时间
        _paperType = arguments[0].paperType,//试卷类型
        _assignId = arguments[0].assignId;//布置记录id
    var bData = arguments[1];//班级数据
    //发送url参数
    var doparam = {},
        assignObj = [],//布置给班级
        classId = "",//布置给小组、个人
        userIds = [],//布置给小组、个人
        paperResId = _paperId,
        paperName = _paperName,
        testTime = _paperTime,
        score = "0",
        paperType = _paperType,
        deadline = null,
        assignId = _assignId;
    //初始化布置对象tab选项卡
    var thistab = "";//班级 / 小组 / 个人
    //获取班级 /嵌套：获取个人
    var thisClasses = "";//班级组
    setClasses(bData);
    function setClasses(data){
        if (data.retData[0]) {//如果班级列表有项
            thistab = "<a class='obj_type on' href='javascript:;' data-objtype='0'>班级</a>";//添加选项卡
            //拼接html，添加选项卡项
            var li = "";//班级列表
            $.each(data.retData,function (i,obj) {
                li += "<li data-num='" + obj.studNum + "' data-id='" + obj.classId + "'>" + obj.className + "</li>";
            });
            thisClasses = "<ul class='obj_type_con set_classes'>" + li + "</ul>";
            //获取个人  /嵌套：获取小组
            if(thisPt == "102" || thisPt == "112" || thisPt == "103" || thisPt == "113" || thisPt == "104" || thisPt == "114"){
                $.ajax({
                    type:"post",
                    url: "/web/teacher/paper/assign/assignindividual",
                    data:{},
                    dataType:"json",
                    success:function (data) {
                        if(data.retCode == "0000"){
                            thistab += "<a class='obj_type' href='javascript:;' data-objtype='1'>个人</a>";//添加选项卡
                            //拼接html，添加选项卡项
                            var user = "",//个人列表
                                userClass = "";//班级列表
                            if(data.retData){
                                if(data.retData.length != 0){
                                    user += "<div>";
                                    userClass += "<ul>";
                                    $.each(data.retData,function (i,obj) {
                                        userClass += "<li data-id='" + obj.calssId + "'>" + obj.calssName + "</li>";
                                        if(i == 0){
                                            user += "<ol class='user'>";
                                        }else{
                                            user += "<ol class='user' style='display: none'>";
                                        }
                                        var iLength = obj.studentInfos.length;
                                        if(iLength == 0){
                                            user += "<li style='text-align: center;color: #999;'>暂无人员，请到班级管理页面进行设置</li>"
                                        }else{
                                            $.each(obj.studentInfos,function (i, obj) {
                                                if(i == 0){
                                                    user += "<li>";
                                                }
                                                user += "<span data-id='" + obj.userId + "'>" + obj.userName + "</span>";
                                                if(i != 0 && (i + 1)%4 == 0 && i < (iLength - 1)){
                                                    user += "</li><li>";
                                                }
                                                if(i == (iLength - 1)){
                                                    user += "</li>";
                                                }
                                            });
                                        }
                                        user += "</ol>";
                                    });
                                    user += "</div>";
                                    userClass += "</ul>";
                                }else{
                                    user = "<p style='width: 100%;text-align: center;color: #999;'>请到班级管理页面进行设置</p>";
                                }
                            }
                            thisClasses += "<div class='obj_type_con set_user' style='display: none'>" + userClass + user + "</div>";
                            //获取小组
                            $.ajax({
                                type:"post",
                                url: "/web/teacher/paper/assign/assigngroup",
                                data:{},
                                dataType:"json",
                                success:function (data) {
                                    if(data.retCode == "0000"){
                                        thistab += "<a class='obj_type' href='javascript:;' data-objtype='2'>小组</a>";//添加选项卡
                                        //拼接html，添加选项卡项
                                        var user = "",//个人列表
                                            userClass = "";//班级列表
                                        if(data.retData){
                                            if(data.retData.length != 0){
                                                user += "<div>";
                                                userClass += "<ul>";
                                                $.each(data.retData,function (i,obj) {
                                                    userClass += "<li data-id='" + obj.calssId + "'>" + obj.calssName + "</li>";
                                                    if(i == 0){
                                                        user += "<ol class='user'>";
                                                    }else{
                                                        user += "<ol class='user' style='display: none'>";
                                                    }
                                                    var iLength = obj.studentInfos.length;
                                                    if(iLength == 0){
                                                        user += "<li style='text-align: center;color: #999;'>请到班级管理创建小组</li>"
                                                    }else{
                                                        $.each(obj.studentInfos,function (i, obj) {
                                                            if(i == 0){
                                                                user += "<li>";
                                                            }
                                                            user += "<span data-id='" + obj.userId + "'>" + obj.userName + "</span>";
                                                            if(i != 0 && (i + 1)%4 == 0 && i < (iLength - 1)){
                                                                user += "</li><li>";
                                                            }
                                                            if(i == (iLength - 1)){
                                                                user += "</li>";
                                                            }
                                                        });
                                                    }
                                                    user += "</ol>";
                                                });
                                                user += "</div>";
                                                userClass += "</ul>";
                                            }else{
                                                user = "<p style='width: 100%;text-align: center;color: #999;'>请到班级管理进行设置</p>";
                                            }
                                        }
                                        thisClasses += "<div class='obj_type_con set_group' style='display: none'>" + userClass + user + "</div>";
                                        setHtml();
                                    }else{
                                        setHtml();
                                    }
                                },
                                error:function () {
                                    setHtml();
                                }
                            });
                        }else{
                            setHtml();
                        }
                    },
                    error:function () {
                        setHtml();
                    }
                });
            }else{
                setHtml();
            }
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
        var workName = "<dl><dt>作业名称：</dt><dd>" + _paperName + "</dd></dl><div class='clear'></div>",
            workTime = "<dl><dt>建议用时：</dt><dd><input class='act_time' type='text' value='" + _paperTime + "'> 分钟</dd></dl><div class='clear'></div>",
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
        });
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
        //点击切换布置类型
        $(".obj_type").on("click",function () {
            if(!($(this).hasClass("on"))){
                thisObjType = $(this).attr("data-objtype");
                if("assignObj" in doparam){
                    assignObj = [];//清空
                    delete doparam.assignObj;//删除数据
                    $(".set_classes .on").removeClass("on");//清除样式
                }else if("classId" in doparam){
                    classId = "";
                    userIds = [];
                    delete doparam.classId;
                    delete doparam.userIds;
                    delete doparam.objNames;
                    $(".set_user .on").removeClass("on");
                    $(".set_user .user").css("display","none");
                    $(".set_group .on").removeClass("on");
                    $(".set_group .user").css("display","none");
                }
                $(".obj_type.on").removeClass("on");
                $(this).addClass("on");
                $(".obj_type_con").css("display","none");
                $(".obj_type_con").eq($(this).index()).fadeIn();
                //初始首选项
                if($(this).index() == 1){
                    $(".set_user ul li").eq(0).addClass("on");
                    $(".set_user .user").eq(0).fadeIn();
                    classId = $(".set_user ul li").eq(0).attr("data-id");
                    doparam.classId = classId;
                    //小组和个人样式协助
                    $(".set_user .user").eq(0).each(function(i,obj){
                        $(obj).css("height",obj.offsetHeight);
                    });
                }
                if($(this).index() == 2){
                    $(".set_group ul li").eq(0).addClass("on");
                    $(".set_group .user").eq(0).fadeIn();
                    classId = $(".set_group ul li").eq(0).attr("data-id");
                    doparam.classId = classId;
                    //小组和个人样式协助
                    $(".set_group .user").eq(0).each(function(i,obj){
                        $(obj).css("height",obj.offsetHeight);
                    });
                }
            }
        });
        //点击传送班级
        $(".set_classes li").on("click",function () {
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
            }
            function off() {
                $(_this).removeClass("on");
                var valNum = myIndexOf(thisParam,assignObj);
                assignObj.splice(valNum,1);
            }
            function noStudent() {
                if(!$("div").hasClass("c_Dissolve")){
                    $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                };
                $('#c_ErrorMsg').html('此班级中无学生，不能布置作业').fadeIn(200);  Disappear("#c_ErrorMsg");
                $(_this).css("color","#ccc");
            }
            doparam.assignObj = assignObj;//传送
        });
        //点击传送个人
        $(".set_user ul li").on("click",function () {//班级
            if(!$(this).hasClass("on")){
                //重载班级id
                classId = $(this).attr("data-id");
                doparam.classId = classId;
                //切换个人  未选个人可切换
                if(userIds.length == 0){
                    $(".set_user ul li.on").removeClass("on");
                    $(this).addClass("on");
                    $(".set_user .user").css("display","none");
                    $(".set_user .user").eq($(this).index()).fadeIn();
                    //小组和个人样式协助
                    $($(".set_user .user").eq($(this).index())).find("li").each(function(i,obj){
                        $(obj).css("height",obj.offsetHeight);
                    });
                }else{
                    console.log(123);
                    if(!$("div").hasClass("c_Dissolve")){
                        $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                    }
                    $('#c_ErrorMsg').html('不能跨班布置哦！').fadeIn(200);  Disappear("#c_ErrorMsg");
                }
            }
        });
        $(".set_user ol li span").on("click",function () {//个人
             var _this = this,
                _thisId = $(this).attr("data-id");
            $(this).hasClass("on") ? off() : on();
            function on() {
                $(_this).addClass("on");
                userIds.push(_thisId);
            }
            function off() {
                $(_this).removeClass("on");
                var valNum = myIndexOf(_thisId,userIds);
                userIds.splice(valNum,1);
            }
            doparam.userIds = userIds;
            //列表展示短标题
            var classTitle = ".set_user ul li[data-id = " + classId + "]";
            var sortTitle = $(classTitle).text() + " ";
            if(userIds.length == 1){
                sortTitle += $(".set_user ol li span[data-id = " + userIds[0] + "]").text();
            }else{
                if(userIds.length != 0){
                    sortTitle += $(".set_user ol li span[data-id = " + userIds[0] + "]").text() + "、";
                    sortTitle += $(".set_user ol li span[data-id = " + userIds[1] + "]").text();
                    sortTitle += "等"
                }
            }
            if(sortTitle.length > 32){
                sortTitle = sortTitle.substring(0,32);
            }
            doparam.objNames = sortTitle;
        });
        //点击传送小组
        $(".set_group ul li").on("click",function () {//班级
            if(!$(this).hasClass("on")){
                //重载班级id
                classId = $(this).attr("data-id");
                doparam.classId = classId;
                //切换个人  未选个人可切换
                if(userIds.length == 0){
                    $(".set_group ul li.on").removeClass("on");
                    $(this).addClass("on");
                    $(".set_group .user").css("display","none");
                    $(".set_group .user").eq($(this).index()).fadeIn();
                    //小组和个人样式协助
                    $($(".set_group .user").eq($(this).index())).find("li").each(function(i,obj){
                        $(obj).css("height",obj.offsetHeight);
                    });
                }else{
                    if(!$("div").hasClass("c_Dissolve")){
                        $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                    };
                    $('#c_ErrorMsg').html('不能跨班布置哦！').fadeIn(200);  Disappear("#c_ErrorMsg");
                }
            }
        });
        $(".set_group ol li span").on("click",function () {//小组
            var _this = this,
                _thisId = $(this).attr("data-id");
            $(this).hasClass("on") ? off() : on();
            function on() {
                $(_this).addClass("on");
                userIds.push(_thisId);
            }
            function off() {
                $(_this).removeClass("on");
                var valNum = myIndexOf(_thisId,userIds);
                userIds.splice(valNum,1);
            }
            doparam.userIds = userIds;
            //列表展示短标题
            var classTitle = ".set_group ul li[data-id = " + classId + "]";
            var sortTitle = $(classTitle).text() + " ";
            if(userIds.length == 1){
                sortTitle += $(".set_group ol li span[data-id = " + userIds[0] + "]").text();
            }else{
                if(userIds.length != 0){
                    sortTitle += $(".set_group ol li span[data-id = " + userIds[0] + "]").text() + "、";
                    sortTitle += $(".set_group ol li span[data-id = " + userIds[1] + "]").text();
                    sortTitle += "等"
                }
            }
            if(sortTitle.length > 32){
                sortTitle = sortTitle.substring(0,32);
            }
            doparam.objNames = sortTitle;
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
            doparam.paperResId = paperResId;
            doparam.assignId = assignId;
            doparam.paperName = paperName;
            doparam.testTime = testTime;
            doparam.score = score;
            doparam.paperType = paperType;
            doparam.deadline = new Date(deadline);
            //如布置给小组或个人,添加布置类型
            if(thisObjType == "1"){
                doparam.objType = "user";
            }else if(thisObjType == "2"){
                doparam.objType = "group";
            }
            //班级和其它布置类型请求地址不同
            var postUrl = "";
            if(doparam.objType){
                postUrl = "/web/teacher/paper/assign/assignpaperstogroup";
            }else{
                postUrl = "/web/teacher/paper/assign/assignpaperstoclass";
            }
            //请求前检查
            if(!checkNum(testTime)){
                if(!$("div").hasClass("c_Dissolve")){
                    $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                };
                $('#c_ErrorMsg').html('请输入正确的建议用时').fadeIn(200);  Disappear("#c_ErrorMsg");
            }else if(deadline == ""){
                if(!$("div").hasClass("c_Dissolve")){
                    $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                };
                $('#c_ErrorMsg').html('请您选择日期').fadeIn(200);  Disappear("#c_ErrorMsg");
            }else if(new Date(deadline)< new Date()){
                if(!$("div").hasClass("c_Dissolve")){
                    $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                };
                $('#c_ErrorMsg').html('请您选择正确的日期').fadeIn(200);  Disappear("#c_ErrorMsg");
            }else if(thisObjType == "0"){
                if(!("assignObj" in doparam)){
                    if(!$("div").hasClass("c_Dissolve")){
                        $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                    };
                    $('#c_ErrorMsg').html('请您选择班级').fadeIn(200);  Disappear("#c_ErrorMsg");
                }else if(!doparam.assignObj[0]){
                    if(!$("div").hasClass("c_Dissolve")){
                        $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                    };
                    $('#c_ErrorMsg').html('请您选择班级').fadeIn(200);  Disappear("#c_ErrorMsg");
                }else{
                    postIt();
                }
            }else if(thisObjType == "1"){
                if(!("userIds" in doparam)){
                    if(!$("div").hasClass("c_Dissolve")){
                        $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                    };
                    $('#c_ErrorMsg').html('请您选择个人').fadeIn(200);  Disappear("#c_ErrorMsg");
                }else if(!doparam.userIds[0]){
                    if(!$("div").hasClass("c_Dissolve")){
                        $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                    };
                    $('#c_ErrorMsg').html('请您选择个人').fadeIn(200);  Disappear("#c_ErrorMsg");
                }else{
                    postIt();
                }
            }else if(thisObjType == "2"){
                if(!("userIds" in doparam)){
                    if(!$("div").hasClass("c_Dissolve")){
                        $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                    };
                    $('#c_ErrorMsg').html('请您选择小组').fadeIn(200);  Disappear("#c_ErrorMsg");
                }else if(!doparam.userIds[0]){
                    if(!$("div").hasClass("c_Dissolve")){
                        $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                    };
                    $('#c_ErrorMsg').html('请您选择小组').fadeIn(200);  Disappear("#c_ErrorMsg");
                }else{
                    postIt();
                }
            }
            //请求
            function postIt() {
                $.ajax({
                    "type": "post",
                    "url": postUrl,
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
                            setTimeout(resetUrl,1500);
                            var thisActive = Request.ac;//获取课时id
                            function resetUrl() {
                                window.location.href = "me_publishRecords.html";
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
//检查对象数组的下标
function myIndexOf(self,obj){
    for(var i=0;i < obj.length;i++){
        if(JSON.stringify(obj[i]) === JSON.stringify(self)){
            return i;
        }
    }
}
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
