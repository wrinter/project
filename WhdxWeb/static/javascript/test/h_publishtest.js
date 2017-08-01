//reEdit by subo on 2017-2-10
//获取导航--------------------------------------------------------------------------------------------------------------
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
SystemRedMsg();
//设置页面最小高度------------------------------------------------------------------------------------------------------
$(".c_Main ").css("min-height",$(window).height() - 100);
//传入筛选信息，如果有的话----------------------------------------------------------------------------------------------
var isAc = null;//Request.ac;
//获取用户栏目→布置作业→menuId----------------------------------------------------------------------------------------
var this_menuData = store.get('data').retData.roleMenuRes,
    this_menuId = "";
$.each(this_menuData,function (i,obj) {
    if(obj.sort === 29){
        this_menuId = obj.menuId;
    }
});
//定义选中按钮----------------------------------------------------------------------------------------------------------
var thisActive = null;//初始化选中id
var thisKt = null;//布置测试查询题库知识点knowledgeType键,要传到编辑和组卷页面
//历史菜单记录----------------------------------------------------------------------------------------------------------
var lastCode = null;
menuHistory();
function menuHistory() {
    $.ajax({
        type: "post",
        url: "/web/common/teacherandstudent/lastcode",
        data:{menuId:this_menuId},
        dataType:"json",
        success:function(data) {
            var Data = data.retData,
                retCode = data.retCode;
            if(retCode === "0000"){
                if(Data){
                    lastCode = Data;
                }
            }
            //启动
            chapterData(chapter);
        },
        error:function(){
            //获取失败不影响启动主函数
            chapterData(chapter);
        }
    });
}
//英语听力--------------------------------------------------------------------------------------------------------------
var listenId;
//章节------------------------------------------------------------------------------------------------------------------
function chapterData(callBack) {
    $.ajax({
        type: "post",
        url: "/web/common/teacher/knowledgetree",
        data:{menuId:this_menuId,ceShiCode:"05"},
        dataType:"json",
        success:function(data) {
            var Data = data.retData,
                retCode = data.retCode;
            if(retCode === "0000"){
                callBack(Data);
                workTypeData(workType);
            }
        }
    });
}
//作业类型--------------------------------------------------------------------------------------------------------------
function workTypeData(callBack) {
    $.ajax({
        type: "post",
        url: "/web/teacher/paper/assign/types",
        data:{menuId:this_menuId},
        dataType:"json",
        success:function(data) {
            var Data = data.retData[0].childsList,
                retCode = data.retCode;
            if(retCode === "0000"){
                callBack(Data);
            }
        }
    });
}
//我的作业--------------------------------------------------------------------------------------------------------------
function myWorkData(callBack) {
    $.ajax({
        type: "post",
        url: "/web/teacher/paper/assign/paperslist",
        data:{knowledgeId:thisActive},
        dataType:"json",
        success:function(data) {
            var Data = data.retData,
                retCode = data.retCode;
            if(retCode === "0000"){
                callBack(Data);
            }
        }
    });
}
//回调:章节-------------------------------------------------------------------------------------------------------------
function chapter(data) {
    if(data.length == 0 || !data){
        $(".homework_Box").html("<div class='t_nodata'><img class='nodata' src='../../static/image/nodata.png' /></div>");
        return;
    }
    var Data = data;
    //初始化html
    $(".homework_Chapter").html("");//清空
    //初始化默认显示菜单
    var li = "",
        dl = "";
    $.each(Data,function (i,obj) {
        var _alias = "";
        obj.alias ? _alias = " " + obj.alias : _alias = "";
        li += "<li id='" + obj.knowledgeId + "' data-kt='" + obj.knowledgeType + "' title='" + obj.name + _alias + "'>" + obj.name + "</li>";
        dl = "<dl class='level_" + obj.level + "'>" + "<dt>" + obj.levelName + "：</dt>" + "<dd>" + "<ul>" + li + "</ul>" + "</dd>" + "</dl>";
    });
    //添加栏目
    $(".homework_Chapter").append(dl);
    //选中状态
    isAc ? $("#" + isAc).addClass("on") : lastCode ? $("#" + lastCode).addClass("on") : $(".homework_Chapter ul li:first-child").addClass("on");
    //初始化选中id
    isAc ? thisActive = isAc : lastCode ? thisActive = lastCode : thisActive = $(".homework_Chapter ul:last li:first").attr("id");
    if(lastCode){
        var codeId = "#" + lastCode;
        thisKt = $(codeId).attr("data-kt");
    }else{
        thisKt = $(".homework_Chapter ul:last li:first").attr("data-kt");
    }
    //单击事件
    $(".homework_Chapter dl dd ul li").on("click",theClick);
    function theClick() {
        $(this).parent().find("li.on").removeClass("on");
        $(this).addClass("on");
        //返回选中id
        thisActive = $(this).attr("id");
        thisKt = $(this).attr("data-kt");
        //向后台存入点击记录
        $.ajax({
            type: "post",
            url: "/web/common/teacherandstudent/savelastcode",
            data:{menuId:this_menuId,lastCode:thisActive},
            dataType:"json",
            success:function(data) {
                var retCode = data.retCode;
                if(retCode === "0000"){
                    //不提示
                }
            }
        });
        //重新启动作业类型,刷新作业类型
        workTypeData(workType);
    }
}
//回调:作业类型---------------------------------------------------------------------------------------------------------
function workType(data) {
    var Data = data;
    // 拼接html
    var div1 = "",div2 = "",div3 = "",div4 = "",div5 = "",
        divs = "";
    $.each(Data,function (i,obj) {
        if(obj.title === "课时练"){
            div1+= "<div class='h_Type'>";
            div1+="<a  href='h_publishTest_exercise.html?id=" + obj.id + "&pt=201"+ "&ac=" + thisActive + "&kt=" + thisKt + "'>";
            div1+= "<img src='../../static/image/test/h_Type_01.jpg' alt='" + obj.title + "'>";
            div1+="</a>";
            div1+="</div>";
        }else if(obj.title === "自主组卷"){
            div2+= "<div class='h_Type'>";
            div2+="<a  href='h_publishTest_onself.html?id=" + obj.id + "&pt=216"+ "&ac=" + thisActive + "&kt=" + thisKt + "'>";
            div2+= "<img src='../../static/image/test/h_Type_05.jpg' alt='" + obj.title + "'>";
            div2+="</a>";
            div2+="</div>";
        }else if(obj.title === "模拟套卷"){
            div4+= "<div class='h_Type'>";
            div4+="<a  href='h_publishTest_moList.html?id=" + obj.id + "&pt=202"+ "&ac=" + thisActive + "&kt=" + thisKt + "'>";
            div4+= "<img src='../../static/image/test/h_Type_07.jpg' alt='" + obj.title + "'>";
            div4+="</a>";
            div4+="</div>";
        }else if(obj.title=="听力测试"){
            listenId = obj.id;
            div5+= "<div class='h_Type'>";
            div5+="<a  href='h_publishTest_listen.html?id=" + obj.id + "&pt=203" + "&ac=" + thisActive + "&kt=" + thisKt + "'>";
            div5+= "<img src='../../static/image/test/h_Type_08.jpg' alt='" + obj.title + "'>";
            div5+="</a>";
            div5+="</div>";
        }
    });
    divs = "<div>" + div1 + div3 + div4 + div2 + div5 + "</div>";//组合html
    $(".h_Type_ul").html(divs);//添加
    //布局样式
    if($(".h_Type").length > 5){
        $(".h_Type").css("width",(100 / $(".h_Type").length) + "%");
    }
    //嵌套
    myWorkData(myWork);
}
//回调:我的作业---------------------------------------------------------------------------------------------------------
function myWork(data) {
    var Data = data;
    // 拼接html
    var tr = "",
        trs = "";
    $.each(Data,function (i,obj) {
        //判断布置状态
        var status = "",//状态 0:未布置；1：已布置
            del = "",//删除
            _paperType = obj.paperType;//其它
        if(obj.status === "2"){
            status = "<span class='gray''>未布置</span>";
            del = "<input id='" + obj.paperId + "' asid='" + obj.id + "' class='myWork_del' type='button' value='删除'>";
        }else{
            status = "<span class='green'>已布置</span>";
        }
        //拼接
        if(obj.paperType == "203"){
            tr += "<tr><td><a href='h_publishTest_listen.html?ac=" + thisActive + "&kt=" + thisKt + "&pt=" + _paperType + "&pi=" + obj.paperId + "&ai=" + obj.id + "&st=" + obj.status + "'>" + obj.aliasName + "</a></td><td>" + status + "</td><td>" + obj.objname + "</td><td>" + obj.assignTime + "</td><td>" + del + "</td></tr>";
        }else{
            tr += "<tr><td><a href='h_publishTest_exercise.html?ac=" + thisActive + "&kt=" + thisKt + "&pt=" + _paperType + "&pi=" + obj.paperId + "&ai=" + obj.id + "&st=" + obj.status + "'>" + obj.aliasName + "</a></td><td>" + status + "</td><td>" + obj.objname + "</td><td>" + obj.assignTime + "</td><td>" + del + "</td></tr>";
        }
    });
    if(!tr){
        tr = "<tr><td colspan='5' style='font-size: 18px;padding-top: 30px; background-color: #fff;'><img class='nodata' src='../../static/image/nodata.png' /></td></tr>";
        $(".h_Minework_table").html(tr.replace(/null/g,""));//去null并添加
    }else{
        trs = "<tr><th>名称</th><th>状态</th><th>布置对象</th><th>时间</th><th>　</th></tr>" + tr;
        $(".h_Minework_table").html(trs.replace(/null/g,""));//去null并添加
    }
    //删除
    deleteMyList();
}
