//reEdit by subo on 2017-2-10
//获取导航--------------------------------------------------------------------------------------------------------------
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
//设置页面最小高度------------------------------------------------------------------------------------------------------
$(".c_Main ").css("min-height",$(window).height() - 100);
//传入筛选信息，如果有的话----------------------------------------------------------------------------------------------
var isAc = null;//Request.ac;
//获取用户栏目→布置作业→menuId----------------------------------------------------------------------------------------
var this_menuData = store.get('data').retData.roleMenuRes,
    this_menuId = "";
$.each(this_menuData,function (i,obj) {
    if(obj.sort === 21){
        this_menuId = obj.menuId;
    }
});
SystemRedMsg();
//定义选中按钮----------------------------------------------------------------------------------------------------------
var thisActive = null;//初始化选中id
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
//章节------------------------------------------------------------------------------------------------------------------
function chapterData(callBack) {
    $.ajax({
        type: "post",
        url: "/web/common/teacher/knowledgetree",
        data:{menuId:this_menuId},
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
        $(".homework_Box").html("<div class='h_nodata'><img class='nodata' src='../../static/image/nodata.png' /></div>");
        return;
    }
    var Data = data;
    //简化数据
    var newArray = [];//单节点递归解析
    function recursive(data,level,parentId) {
        var newObj ={};
        newObj.id = data.knowledgeId;
        newObj.alias = data.alias;
        newObj.name = data.name;
        newObj.parentId = parentId;
        newObj.levelName = data.levelName;
        newObj.level = level;
        newArray.push(newObj);
        if(data.childrens){
            level++;
            //递归
            $.each(data.childrens,function (i,obj) {
                recursive(obj,level,data.knowledgeId);
            });
        }
        return newArray;
    }
    var newArrays = [];//拼接单节点数据
    $.each(Data,function (i,obj) {
        var myLevel = 1,
            myParentId = "1";
        newArrays = recursive(obj,myLevel,myParentId);
    });
    //初始化html
    $(".homework_Chapter").html("");//清空
    //初始化默认显示菜单
    isAc ? acChapter() : lastCode ? acChapter() : initChapter();
    function acChapter() {
        isAc ? isAc = isAc : isAc = lastCode;
        var ids = [];//栏目层级id组
        function idsArray(data,ac) {
            $.each(data,function (i,obj) {
                if(ac == obj.id){
                    ids.push(obj.parentId);
                    var ac2 = obj.parentId;
                    //递归
                    idsArray(data,ac2);
                }
            });
        }
        idsArray(newArrays,isAc);
        ids.reverse();//倒转顺序
        $.each(ids,function (i,obj) {
            var _id = obj,
                li = "",
                dl = "";
            $.each(newArrays,function (i,obj) {
                if(obj.parentId == _id){//一级
                    var _alias = "";
                    obj.alias ? _alias = " " + obj.alias : _alias = "";
                    li += "<li id='" + obj.id + "' title='" + obj.name + _alias + "'>" + obj.name + "</li>";
                    dl = "<dl class='level_" + obj.level + "'>" + "<dt>" + obj.levelName + "：</dt>" + "<dd>" + "<ul>" + li + "</ul>" + "</dd>" + "</dl>";
                }
            });
            $(".homework_Chapter").append(dl);//添加栏目
            //添加当前状态
            $("#" + isAc).addClass("on");
            //添加父集状态
            $("#" + ids[i]).addClass("on");
        });
    }
    function initChapter() {
        var li1 = "",
            dl1 = "",
            firstId = newArrays[0].id;
        $.each(newArrays,function (i,obj) {
            if(obj.parentId == "1"){//一级
                var _alias = "";
                obj.alias ? _alias = " " + obj.alias : _alias = "";
                li1 += "<li id='" + obj.id + "' title='" + obj.name + _alias + "'>" + obj.name + "</li>";
                dl1 = "<dl class='level_" + obj.level + "'>" + "<dt>" + obj.levelName + "：</dt>" + "<dd>" + "<ul>" + li1 + "</ul>" + "</dd>" + "</dl>";
            }
        });
        $(".homework_Chapter").append(dl1);//添加一级栏目
        visit(firstId);//递归第1个章节
        //添加当前状态
        $(".homework_Chapter ul li:first-child").addClass("on");
    }
    function visit(thisId){
        var li = "",
            dl = "",
            oArr = [];
        $.each(newArrays,function (i,obj) {
            if(obj.parentId == thisId){
                oArr.push(obj.id);
                var _alias = "";
                obj.alias ? _alias = " " + obj.alias : _alias = "";
                li += "<li id='" + obj.id + "' title='" + obj.name + _alias + "'>" + obj.name + "</li>";
                dl = "<dl class='level_" + obj.level + "'>" + "<dt>" + obj.levelName + "：</dt>" + "<dd>" + "<ul>" + li + "</ul>" + "</dd>" + "</dl>";
            }
        });
        //DOM添加
        $(".homework_Chapter").append(dl);
        //递归
        if(oArr.length > 0){
            var _ids = "#" + oArr[0];
            $(_ids).addClass("on");
            visit(oArr[0]);
        }
    }
    //初始化选中id
    isAc ? thisActive = isAc : thisActive = $(".homework_Chapter ul:last li:first").attr("id");
    //初始化单击事件,弹出子菜单
    $(".homework_Chapter dl dd ul li").on("click",theClick);
    function theClick() {
        //添加状态
        $(this).parent().find("li.on").removeClass("on");//清除可能存在的其它状态
        $(this).addClass("on");
        //清除可能存在的子栏目
        var theLevel = Number($(this).parent().parent().parent().attr("class").replace(/[^0-9]+/g, ''));//获取点击栏目层级数，获得将要弹出的子栏目层级数
        if($("dl").hasClass("level_" + (theLevel+1))){//如果已存在同等级level
            $(".level_" + (theLevel+1)).remove();//移除
        }
        if($("dl").hasClass("level_" + (theLevel+2))){//如果已存在子等级level
            $(".level_" + (theLevel+2)).remove();//移除
        }
        if($("dl").hasClass("level_" + (theLevel+3))){//如果已存在孙等级level
            $(".level_" + (theLevel+3)).remove();//移除
        }
        //拼接html
        var thisId = $(this).attr("id");//单击位置的ID
        visit(thisId);//递归此章节
        //点击时递归
        $(".homework_Chapter dl dd ul li").off("click");
        $(".homework_Chapter dl dd ul li").on("click",theClick);
        //返回选中id,如果点击的是最低层正确设定，否则设定最后一级的第1个id
        if($("dl").hasClass("level_" + (theLevel + 1))){
            thisActive = $(".homework_Chapter dl:last li:first").attr("id");
        }else{
            thisActive = thisId;
        }
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
    var a4 = "",
        div1 = "",div2 = "",div3 = "",div4 = "",
        divs = "";
    $.each(Data,function (i,obj) {
        if(obj.title === "课时练"){
            div1+= "<div class='h_Type'>";
            div1+="<a  href='h_publishWork_exercise.html?id=" + obj.id + "&pt=101"+ "&ac=" + thisActive + "'>";
            div1+= "<img src='../../static/image/homework/h_Type_01.jpg' alt='" + obj.title + "'>";
            div1+="</a>";
            div1+="</div>";
        }else if(obj.title === "自主组卷"){
            div2+= "<div class='h_Type'>";
            div2+="<a  href='h_publishWork_onself.html?id=" + obj.id + "&pt=116"+ "&ac=" + thisActive + "'>";
            div2+= "<img src='../../static/image/homework/h_Type_05.jpg' alt='" + obj.title + "'>";
            div2+="</a>";
            div2+="</div>";
        }else if(obj.title === "随堂检测"){
            div3+= "<div class='h_Type'>";
            div3+="<a  href='h_publishWork_exercise.html?id=" + obj.id + "&pt=105"+ "&ac=" + thisActive + "'>";
            div3+= "<img src='../../static/image/homework/h_Type_06.jpg' alt='" + obj.title + "'>";
            div3+="</a>";
            div3+="</div>";
        }else if(obj.title === "分层作业"){
            var reverseArr = obj.childsList.reverse();//反转
            $.each(reverseArr,function (i,obj) {
                div4+= "<div class='h_Type'>";
                div4+="<a  href='h_publishWork_exercise.html?id=" + obj.id + "&pt=10"+(i+2)+"&ac=" + thisActive + "'>";
                div4+= "<img src='../../static/image/homework/h_Type_0"+(i+2)+".jpg' alt='" + obj.title + "'>";
                div4+="</a>";
                div4+="</div>";
            });
        }
    });
    divs = "<div>" + div1 + div3 + div4 + div2 + "</div>";//组合html
    $(".h_Type_ul").html(divs);//添加
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
            status = "<span class='gray'>未布置</span>";
            del = "<input id='" + obj.paperId + "' asid='" + obj.id + "' class='myWork_del' type='button' value='删除'>";
        }else{
            status = "<span class='green'>已布置</span>";
        }
        //拼接
        tr += "<tr><td><a href='h_publishWork_exercise.html?ac=" + thisActive + "&pt=" + _paperType + "&pi=" + obj.paperId + "&ai=" + obj.id + "&st=" + obj.status + "'>" + obj.aliasName + "</a></td><td>" + status + "</td><td>" + obj.objname + "</td><td>" + obj.assignTime + "</td><td>" + del + "</td></tr>";
    });
    if(!tr){
        tr = "<tr><td colspan='5' style='font-size: 18px;padding-top: 30px;background-color: #fff;'><img class='nodata' src='../../static/image/nodata.png' /></td></tr>";
        $(".h_Minework_table").html(tr.replace(/null/g,""));//去null并添加
    }else{
        trs = "<tr><th>名称</th><th>状态</th><th>布置对象</th><th>时间</th><th>　</th></tr>" + tr;
        $(".h_Minework_table").html(trs.replace(/null/g,""));//去null并添加
    }
    //删除
    deleteMyList();
}
