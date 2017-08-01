CheckBrower();
/******************************获取导航*******************************/
GetHtml("../../model/common/common.txt","#Header");
SystemRedMsg();
//渲染
$(".paperName").html(store.get("m_paperName"));
$(".m_publishWorkTime span").html(store.get(".m_testTime"));
$("#c_closeG1").click(function(){
    hideMask(".mask",".m_workPubSuccess");
});

//显示 日期
$(function(){
    function show(){
        var mydate = new Date();
        var str = "" + mydate.getFullYear() + "-";
        str += (mydate.getMonth()+1) + "-";
        str += mydate.getDate()+1;
        return str;
    }
    $("#m_data").val(show());
    $("#m_dataEnd").val(show());
    $( "#m_data" ).datepicker();
   $( "#m_dataEnd" ).datepicker();
});
//循环添加  时
function m_getHours(){
    var li="";
    for(var i=0;i<24;i++){

        li+="<li>";
        if(i<10){
            li+="0"+i;
        }else{
            li+=i;
        }
        li+="</li>";

    }
    return li;
}
//循环添加  分
function m_getMins() {
    var _li="";
    for(var j=0;j<59;j++){
        _li+="<li>";
        if(j<10){
            _li+="0"+j;
        }else{
            _li+=j;
        }
        _li+="</li>";
    }
    return _li;
}
$(".m_hours").html(m_getHours());
$(".m_hoursEnd").html(m_getHours());

$(".m_mins").html(m_getMins());
$(".m_minsEnd").html(m_getMins());
//开始 时显示 隐藏
$(".m_selectHours").click(function(){
    $(".m_hours").slideToggle();
});
//结束 时 显示 隐藏
$(".m_selectHoursEnd").click(function(){
    $(".m_hoursEnd").slideToggle();
});
//将原来的时间重置
$(".m_selectHours .m_hours li").click(function(){
    $(".m_selectHours .m_selectSpan").html($(this).html());
});
$(".m_selectHoursEnd .m_hoursEnd li").click(function(){
    $(".m_selectHoursEnd .m_selectSpan").html($(this).html());
});
//开始 分显示 隐藏
$(".m_selectMins").click(function(){
    $(".m_selectMins .m_mins").slideToggle();
});
//结束 分 显示 隐藏
$(".m_selectMinsEnd").click(function(){
    $(".m_selectMinsEnd .m_minsEnd").slideToggle();
});
//将原来的时间重置
$(".m_selectMins .m_mins li").click(function(){
    $(".m_selectMins .m_selectSpan").html($(this).html());
});
$(".m_selectMinsEnd .m_minsEnd li").click(function(){
    $(".m_selectMins .m_selectSpan").html($(this).html());
});

//布置对象  点击变色   -----静态数据
$(".m_publishObj span").click(function () {
    $(this).css({"background":"#65b113"});
});
//获取布置对象
$.ajax({
    type:"post",
        url:"/web/teacher/paper/assign/assignclass",
        data:{},
        dataType:"json",
        success:function(data) {
            if(data.retCode === "0000"){
                forAssignclass(data.retData);
            }
        }
});

//add at 2017-2-8 by subo   --------------------------------------------------------------------------------------------
//发送url参数
var doparam = {},
    assignId=Request.newAssignId,
    assignObj = [],
    paperResId = Request.paperId,
    //  paperName = store.get("m_paperName"),
   testTime = testTime,
    paperType = "119",
    deadline = null;
function forAssignclass(data) {
    var Data = data;
    var thisClasses = "";//班级
    $.each(Data,function (i,obj) {
        thisClasses += "<span data-num='" + obj.studNum + "' data-id='" + obj.classId + "'>" + obj.className + "</span><br>";
    });
    $(".m_publishObj").append(thisClasses).on("click","span",function () {
        var valNum = null;//推入的下标
        var _this = $(this),
            thisId = $(this).attr("data-id"),
            thisNum = $(this).attr("data-num"),
            thisName = $(this).text(),
            thisParam = {};
        thisParam.classId = thisId;
        thisParam.className = thisName;
        thisParam.studNum = parseInt(thisNum);
        thisNum === "0" ? noStudent() : $(this).hasClass("on") ? off() : on();
        function on() {
            $(_this).addClass("on").css("background","#65b113");
            assignObj.push(thisParam);
            valNum = assignObj.indexOf(thisParam);
        };
        function off() {
            $(_this).removeClass("on").css("background","");
            assignObj.splice(valNum,1);
        };
        function noStudent() {
            if(!$("div").hasClass("c_Dissolve")){
                $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
            }
            $('#c_ErrorMsg').html('此班级中无学生，不能布置作业').fadeIn(200);  Disappear("#c_ErrorMsg");
            $(_this).css("color","#ccc");
        };
    });
    Done();
}
function Done() {
    $(".m_btnSure").on("click",function () {
        $(this).css({"background":"#65b113","color":"#fff"});
        deadline = $("#m_dataEnd").val() + " " + $(".m_selectHoursEnd .m_selectSpan").text() + ":" + $(".m_selectMinsEnd .m_selectSpan").text();
        testTime = parseInt($(".m_publishWorkTime input").val());
        doparam.assignObj = assignObj;
        doparam.paperResId = paperResId;
        doparam.paperName = store.get("m_paperName");
        doparam.testTime = testTime;
        doparam.assignId = Request.newAssignId;
        doparam.paperType = "119";
        doparam.deadline = new Date(deadline);
        //请求前检查
        if(testTime === ""){
            if(!$("div").hasClass("c_Dissolve")){
                $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
            }
            $('#c_ErrorMsg').html('请您填写建议用时').fadeIn(200);  Disappear("#c_ErrorMsg");
        }else if(testTime<0){
            if(!$("div").hasClass("c_Dissolve")){
                $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
            }
            $('#c_ErrorMsg').html('请您填写正确的建议用时').fadeIn(200);  Disappear("#c_ErrorMsg");
        }else if(deadline === ""){
            if(!$("div").hasClass("c_Dissolve")){
                $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
            }
            $('#c_ErrorMsg').html('请您选择日期').fadeIn(200);  Disappear("#c_ErrorMsg");
        }else if(new Date(deadline)< new Date()){
            if(!$("div").hasClass("c_Dissolve")){
                $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
            }
            $('#c_ErrorMsg').html('请您选择正确的日期').fadeIn(200);  Disappear("#c_ErrorMsg");
        }else if(!doparam.assignObj[0]){
            if(!$("div").hasClass("c_Dissolve")){
                $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
            }
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
                    var codenum = parseInt(data.retCode.substr(0, 1));
                    if (codenum == 0){

                        if(!$("div").hasClass("c_Dissolve")){
                            $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                        }
                        var _i = 2;
                        $('#c_ErrorMsg').html('布置成功,将在' + _i + '秒后返回').fadeIn(200);
                        //跳转倒计时
                        set();
                        function set() {
                            _i--;
                            $('#c_ErrorMsg').html('布置成功,将在' + _i + '秒后返回');
                            if (_i > 0) {
                                setTimeout(set, 1000);//_i大于0时每秒递归
                            } else {
                                get();//跳转
                            }
                        }
                        //跳转方法
                        function get() {
                         window.location.href = "me_myNotebook.html";
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
