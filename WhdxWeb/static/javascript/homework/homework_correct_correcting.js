/******************************获取导航*******************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
SystemRedMsg();
//全局变量
var results = null,imgArray = [],stuIdArray = [],totalSize=7;
//获取学生
var getStuList = {
    getStu:function(){
        var param={};
        param.assignId=Request.id;
        $.ajax({
            type: "post",
            url: "/web/teacher/correct/selectDetails",
            data: param,
            dataType: "json",
            success:function(data){
                var li="",list=data.retData,flag = true,stuid = "";
                for(var i in list){
                    if(list[i].status == "4"||list[i].status == "1"){
                        flag = false;
                        stuid = list[i].userId;
                        break;
                    }
                }
                li+="<ul>";
                for(var k in list){
                    var order = Number(k)+1;
                    li+="<li class='stuSpan";
                    if(flag&&k==0)li+=" s_active";
                    if(stuid == list[k].userId)li+=" s_active";
                    if(list[k].status == "6")li+=" font_gray"
                    li+="' id='"+list[k].userId+"' stu_status='"+list[k].status+"' orderNum='"+order+"'>"+list[k].userName;
                    if(flag&&k==0)li+="<span class='triangle'></span>";
                    if(stuid == list[k].userId)li+="<span class='triangle'></span>";
                    if(list[k].status == "1"){
                        li+="<i class='late_i'>迟交</i>"
                    }else if(list[k].status == "6"){
                        li+="<i class='correct_i'>√</i>"
                    }
                    li+="</li>";
                    if(k==0&&list[k].status == "6"){
                        disableTextArea(list[k].status);
                    }
                    if(k!=0&&list[k].status!="6"&&list[k-1].status == "6"){
                        disableTextArea(list[k].status);
                    }
                }
                li+="</ul>";
                $(".stu").html(li);
                totalSize =list.length ;//获取总数据
                pageSize = 7;//每页显示4条数据
                if($(".stu").width()==900){
                    scrollWidth=882;
                    pageSize = 6;
                }else if($(".stu").width()==882){
                    scrollWidth=882;
                    pageSize = 6;
                }else if($(".stu").width()==1045){
                    scrollWidth=1029;
                }
                currentPage = 1;//当前为第一页
                var totalPage = Math.ceil(totalSize / pageSize);//计算总页数
                var scrollWidth;//通过判断浏览器的宽度决定课件容器的宽度
                if(totalSize>pageSize){
                    $("._right").on("click",function(){
                        if(currentPage==totalPage){
                            return false;
                        }else if(currentPage==totalPage-1){
                            $(this).removeClass("h_rightico_green").addClass("h_rightico_gray");
                            $(this).parent().siblings(".Left").find("._left").removeClass("h_leftico_gray").addClass("h_leftico_green");
                            $(this).parent(".Right").siblings(".stu").find("ul").animate({left:(currentPage)*(-scrollWidth)},500);
                            currentPage++;
                        } else{
                            $(this).removeClass("h_rightico_gray").addClass("h_rightico_green");
                            $(this).parent().siblings(".Left").find("._left").removeClass("h_leftico_gray").addClass("h_leftico_green");
                            $(this).parent(".Right").siblings(".stu").find("ul").animate({left:(currentPage)*(-scrollWidth)},500);
                            currentPage++;
                        }
                    });
                    $("._left").on("click",function(){
                        if(currentPage==1){
                            $(this).parent().siblings(".Right").find("._right").removeClass("h_rightico_gray").addClass("h_rightico_green");
                            $(this).removeClass("h_leftico_green").addClass("h_leftico_gray");
                            return false;
                        }else if(currentPage==2){
                            $(this).removeClass("h_leftico_green").addClass("h_leftico_gray");
                            $(this).parent().siblings(".Right").find("._right").removeClass("h_rightico_gray").addClass("h_rightico_green");
                            currentPage--;
                            $(this).parent(".Left").siblings(".stu").find("ul").animate({left:(currentPage-1)*(-scrollWidth)},500);
                        }else{
                            $(this).removeClass("h_leftico_gray").addClass("h_leftico_green");
                            $(this).parent().siblings(".Right").find("._right").removeClass("h_rightico_gray").addClass("h_rightico_green");
                            currentPage--;
                            $(this).parent(".Left").siblings(".stu").find("ul").animate({left:(currentPage-1)*(-scrollWidth)},500);
                        }
                    })
                }else{
                    $("._left").removeClass("h_leftico_green").addClass("h_leftico_gray");
                    $("._right").removeClass("h_rightico_green").addClass("h_rightico_gray");
                }

                //选学生时查询相应的作业答案
                $(".stuSpan").on("click",function(){
                    $(this).addClass("s_active").siblings().removeClass("s_active");
                    $("span").remove(".triangle");
                    $(".s_active").append("<span class='triangle'></span>");
                    $("#comment_area").val("");
                    getStuList.getPictureAnwers($(this).attr("id"),$(this).attr("stu_status"));
                    getStuList.getStuPaper($(this).attr("id"),$(this).attr("stu_status"));
                    next.nextStudentCli();
                    if($(this).attr("stu_status")!="6"){
                        document.getElementById('nextStu').style.backgroundColor = "#FAA249";
                    }else{
                        document.getElementById('nextStu').style.backgroundColor = "#cccccc";
                    }
                    $(".openPic_span").hide();
                    $(".img_ul").show();
                    getStuList.getLastStudent();
                    next.reload();
                    disableTextArea($(this).attr("stu_status"));
                })

                analytical.questionCli();
                if($(".s_active").attr("stu_status")!="6"){
                    next.nextStudentCli();
                    document.getElementById('nextStu').style.backgroundColor = "#FAA249";
                }else{
                    document.getElementById('nextStu').style.backgroundColor = "#cccccc";
                }
                getStuList.getPictureAnwers($(".s_active").attr("id"),$(".s_active").attr("stu_status"));
                getStuList.getStuPaper($(".s_active").attr("id"),$(".s_active").attr("stu_status"));
                getStuList.getLastStudent();
                fixedLocation();
            }
        })
    },

    //判断当前学生是不是最后一个学生
    getLastStudent:function(){
        var num = $(".stu li").length;
        var order = $(".s_active").attr("orderNum")
        if(num == order){
            $(".next_span").html("完成");
        }else{
            $(".next_span").html("下一人");
        }
    },

    //获取学生的作业
    getStuPaper:function(userId,status){
        results = null;
        var param={};
        param.assignId=Request.id;
        param.userId=userId;
        $.ajax({
            type: "post",
            url: "/web/teacher/correct/selectPaper",
            dataType: "json",
            data: param,
            success:function(data){
                if(data.retCode=="0000"){
                    var li="",num = 0,Snum = 0,flag = true,code=0,changliFlag = true;
                    var queLn=data.retData;
                    console.log(queLn);
                    results = data.retData;
                    for(var i in queLn){
                        li+="<ul id='"+queLn[i].id+"'>";
                        li+="<li class='questionln_li'>"+queLn[i].title+"</li>";
                        var splitNum=0;
                        for(var k in queLn[i].list){
                            num++;
                            li+="<li id='"+queLn[i].list[k].questionId+"'";
                            if(changliFlag&&queLn[i].list[k].type=='0'){
                                li+='class="change_li"';
                                changliFlag = false;
                            }
                            li+=">";
                            li+="<span class='que_num'>";
                            if(queLn[i].list[k].groupCode === null||queLn[i].list[k].groupCode != null && queLn[i].list[k].isSplite === "1"){
                                if(Snum==0){
                                    li+=num
                                }else{
                                    li+=num-Snum+code+1;
                                }
                                flag = false;
                            }else{
                                if(queLn[i].list[k-1]&&queLn[i].list[k].groupCode!=queLn[i].list[k-1].groupCode){
                                    if(num!=(num-Snum+code)){
                                        Snum--;
                                    }
                                    splitNum = 0;
                                }
                                if(k<9){
                                    li+=(num-Snum+code)+'.'+(splitNum+1);
                                }else{
                                    li+=String(num-Snum+code)+"."+String(splitNum+1);
                                }
                                Snum++;
                                splitNum++;
                                flag = true;
                            }
                            li+="</span>";
                            li+="<span class='judge right";
                            if(queLn[i].list[k].type=="1"){li+=" fn_noclick"}
                            if(queLn[i].list[k].result==0){li+=" green"}else if(queLn[i].list[k].type=="1"){li+=" nobackcolor"}
                            li+="'>√</span>";
                            li+="<span class='judge wrong";
                            if(queLn[i].list[k].type=="1"){li+=" fn_noclick"}
                            if(queLn[i].list[k].result==1){li+=" Red"}else if(queLn[i].list[k].type=="1"){li+=" nobackcolor"}
                            li+="'>×</span>";
                            li+="<span class='judge half";
                            if(queLn[i].list[k].type=="1"){li+=" fn_noclick"}
                            if(queLn[i].list[k].result==2){li+=" yellow"}else if(queLn[i].list[k].type=="1"){li+=" nobackcolor"}
                            li+="'>√╲</span>";
                            li+="</li>";
                        }
                        li+="</ul>";
                        if(flag){
                            code++;
                        }
                    }
                    $(".paperList").html(li);
                    if(status!="6"){
                        $(".judge").on("click",function(){
                            $(".que_num").parent().removeClass("change_li");
                            $(this).parent().addClass("change_li");
                            if($(this).hasClass("fn_noclick")){
                                return;
                            }
                            if($(this).hasClass("right")){
                                $(this).addClass("green").siblings().removeClass("Red green yellow");
                                getStuList.clickCorrect($(this).parent().parent().attr("id"),$(this).parent().attr("id"),"0");
                            }
                            if($(this).hasClass("wrong")){
                                $(this).addClass("Red").siblings().removeClass("Red green yellow");
                                getStuList.clickCorrect($(this).parent().parent().attr("id"),$(this).parent().attr("id"),"1");
                            }
                            if($(this).hasClass("half")){
                                $(this).addClass("yellow").siblings().removeClass("Red green yellow");
                                getStuList.clickCorrect($(this).parent().parent().attr("id"),$(this).parent().attr("id"),"2");
                            }
                        });
                    }
                    analytical.selectQueLabel($(".change_li").attr("id"),$(".change_li").find(".que_num").html());
                    $(".paperList li span").click(function(){
                        var questionId = $(this).parent().attr("id");
                        analytical.selectQueLabel(questionId,$(this).parent().find(".que_num").html());
                    });
                    getStuList.queNumClick();
                }
            }
        });
    },

    //选中某个题目时题号变绿
    queNumClick:function(){
        $(".que_num").click(function(){
            $(".que_num").parent().removeClass("change_li");
            $(this).parent().addClass("change_li");
        })
    },

    //学生图片答案
    getPictureAnwers:function(userId,status){
        imgArray = [];
        var param={};
        param.assignId=Request.id;
        param.userId=userId;
        var htm = "",canvasHtm = "",brushHtm = "",gobackHtm = "";
        $.ajax({
            type: "post",
            url: "/web/teacher/correct/selectAnswerPicture",
            dataType: "json",
            data: param,
            success:function(data){
                var piclist = data.retData.picList;
                for(var i in piclist){
                    htm += "<li><img ";if(i==0){htm+="class='change'";}htm+=" id='"+piclist[i].fileId+"' src='"+piclist[i].imgSrc+"'></li>";
                    canvasHtm += "<canvas id='"+piclist[i].fileId+"canvas' class='Canvas'></canvas>";
                    brushHtm += "<div id='"+piclist[i].fileId+"brush' class='pencil fr hid'></div>";
                    gobackHtm += "<div id='"+piclist[i].fileId+"goback' class='eraser fl hid'></div>";
                }
                htm += "<span class='closePic_span'></span>";
                var markList = data.retData.marksList;
                $(".img_ul").empty();
                $(".img_ul").append(htm);
                $(".hid").remove();
                $(".pencil_div").prepend(brushHtm);
                $(".eraser_div").append(gobackHtm);
                $(".Canvas").remove();
                $("#Canvascon").prepend(canvasHtm);
                $(".Canvas").hide();
                $(".hid").hide();
                if(piclist.length===0){
                    $(".disaeraser").show();
                    $(".disapencil").show();
                    htm = "<div class='noImg'>该生未上传图片</div>";
                    $("#Canvascon").addClass("noimgDiv");
                    $(".noImg").remove();
                    $("#Canvascon").append(htm);
                    $(".img_ul").hide();
                    return;
                }else{
                    $(".img_ul").show();
                    $(".noImg").remove();
                }
                for(var i in piclist){
                    var markPic = null;
                    var b = true;
                    for(var k in markList){
                        if(piclist[i].fileId === markList[k].imgPosition){
                            markPic = markList[k].markPic;
                            var pro = {};
                            pro.answerPicId = piclist[i].fileId;
                            pro.fileStr = markPic;
                            pro.flag = "2";
                            imgArray.push(pro);
                            new Stroke().init(piclist[i].fileId,piclist[i].fileId+"canvas",piclist[i].fileId+"brush",piclist[i].fileId+"goback",markPic);
                            document.getElementById(piclist[i].fileId+"canvas").style.backgroundImage ="url("+piclist[i].imgSrc+")";
                            b = false;
                        }
                    }
                    if(b){
                        new Stroke().init(piclist[i].fileId,piclist[i].fileId+"canvas",piclist[i].fileId+"brush",piclist[i].fileId+"goback",null);
                        document.getElementById(piclist[i].fileId+"canvas").style.backgroundImage ="url("+piclist[i].imgSrc+")";
                    }
                }
                $(".Canvas").hide();
                $(".pencil").hide();
                $(".eraser").hide();
                if(piclist.length>0){
                    $("#"+piclist[0].fileId+"canvas").show();
                }
                if(status !="6"){
                    if(piclist.length>0){
                        $("#"+piclist[0].fileId+"brush").show();
                        $("#"+piclist[0].fileId+"goback").show();
                    }else{
                        $(".disaeraser").show();
                        $(".disapencil").show();
                    }
                }else{
                    $(".disaeraser").show();
                    $(".disapencil").show();
                }
                $("#comment_area").val(data.retData.totalRemarks);
                getStuList.pictureAnwers(status);
                getStuList.showHideThePicUrl();
            }
        });
    },

    //点击图片答案
    pictureAnwers:function(status){
        $(".img_ul li img").click(function(){
            $(this).parent().parent().find("li img").removeClass("change");
            $(this).addClass("change");

            //图片
            $(".Canvas").hide();
            $(".pencil").hide();
            $(".eraser").hide();
            $("#"+$(this).attr("id")+"canvas").show();
            if(status!="6"){
                $("#"+$(this).attr("id")+"brush").show();
                $("#"+$(this).attr("id")+"goback").show();
            }else{
                $(".disaeraser").show();
                $(".disapencil").show();
            }
            $(".pencil_div").css("background-color","#ffffff");
            $(".eraser_div").css("background-color","#ffffff");
            $(".pencil").removeClass("change_pencel");
            $(".eraser").removeClass("change_eareser");
            $(".up_li hr").removeClass("addBorder");
        });
    },

    //显示隐藏图片缩略图
    showHideThePicUrl:function(){
        $(".closePic_span").click(function(){
            $(this).parent().hide();
            $(this).parent().next().show();
        });
        $(".openPic_span").click(function(){
            $(this).prev().show();
            $(this).hide();
        });
    },

    //老师批改对错时存储记录
    clickCorrect:function(questionlnId,questionId,result){
        for(var i in results){
            if(results[i].id == questionlnId){
                for(var k in results[i].list){
                    if(results[i].list[k].questionId == questionId){
                        results[i].list[k].result = result;
                    }
                }
            }
        }
        console.log(results);
    }
}

//解析
var analytical = {
    //解析方法
    selectQueLabel:function(questionId,num){
        $.ajax({
            type:"post",
            url: "/web/teacher/correct/selectQueLabelByMongo",
            dataType: "json",
            data: {
                "questionId":questionId,
                "assignId": Request.id
            },
            success:function(data){
                var list = data.retData.list;
                $('.num_span').html("第"+num+"题:");
                var htm ="<div class='h_answer'";
                for(var i=0; i<list.length; i++){
                    if(list[i].questionType === "01"||list[i].questionType === "03"){
                        htm += list[i].content;
                        if(list[i].questionType === "01"){
                            if(list[i].optionA!=undefined){
                                htm += list[i].optionA;
                            }
                            if(list[i].optionB!=undefined){
                                htm += list[i].optionB;
                            }
                            if(list[i].optionC!=undefined){
                                htm += list[i].optionC;
                            }
                            if(list[i].optionD!=undefined){
                                htm += list[i].optionD;
                            }
                        }
                    }
                }
                htm +="</div>";
                $(".analytical_div").empty();
                $(".analytical_div").append(htm)
                $(".close_span").click(function(){
                    $('.title_div').hide();
                    $(".analytical_div").hide();
                });
                css();
                intMathJax();//公式
            },
            error:function(data){
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg")
            }
        });
    },

    //解析的点击事件
    questionCli:function(){
        $(".analytical_span").click(function(){
            if($(".analytical_div").text()==""){
                $('#c_ErrorMsg').html('您还没有指定试题！').fadeIn(200);  Disappear("#c_ErrorMsg")
            }else{
                $('.title_div').show();
                $(".analytical_div").show();
            }
        });
    }
}

//下一个
var next = {

    //下一个主方法
    nextStudent:function(){
        var param = {};
        param.userId = $(".s_active").attr("id");
        param.assignId = Request.id;
        if(imgArray.length>0){
            param.filesStr = JSON.stringify(imgArray);
        }
        param.resultsStr = JSON.stringify(results);
        param.totalRemarks = $("#comment_area").val();
        $.ajax({
            type:"post",
            url:"/web/teacher/correct/nextStudent",
            dataType: "json",
            data: param,
            success:function(data) {
                sendReports.sendPush(param.userId);
                if(data.retCode === '0000'){
                    store.set("correctCorrectNum",Number(store.get("correctCorrectNum"))+1);
                    var stus = $(".stuSpan");
                    for(var i in stus){
                        if(stus[i].id === data.retData){
                            if(stus[Number(i)+1] != undefined){
                                getStuList.getStuPaper(stus[Number(i)+1].id,$("#"+stus[Number(i)+1].id).attr("stu_status"));
                                getStuList.getPictureAnwers(stus[Number(i)+1].id,$("#"+stus[Number(i)+1].id).attr("stu_status"));
                                $(".stuSpan").removeClass("s_active");
                                $("#"+stus[Number(i)+1].id).addClass("s_active");
                                $("span").remove(".triangle");
                                $(".s_active").append("<span class='triangle'></span>");
                                getStuList.getLastStudent();
                                next.reload();
                                var totalPage1 = Math.ceil((Number(i)+2) / pageSize);
                                var scrollWidth = 0;
                                if($(".stu").width()==900){
                                    scrollWidth=882;
                                    pageSize = 6;
                                }else if($(".stu").width()==882){
                                    scrollWidth=882;
                                    pageSize = 6;
                                }else if($(".stu").width()==1045){
                                    scrollWidth=1029;
                                }
                                if(totalPage1>currentPage){
                                    $(".stu").find("ul").animate({left:(totalPage1-1)*(-scrollWidth)},500);
                                }
                                return;
                            }else{
                                next.reload();
                                var allNum = store.get("correctAllNum"),submitNum = store.get("correctSubmitNum"),correctNum = store.get("correctCorrectNum");
                                if(Number(allNum)>=20&&Number(submitNum)/Number(allNum)>=0.6&&Number(correctNum) === Number(submitNum)){
                                    next.correctAndAddExperience();
                                }
                                window.location.href = "../../model/homework/homework_correct_index.html?pno=1";
                                return;
                            }
                        }
                    }
                }
            },
            error:function(data){
            }
        });
        $("#comment_area").val("");
        $(".pencil").hide();
        $(".eraser").hide();
        $("#"+param.userId).addClass("font_gray");
        $("#"+param.userId).attr("stu_status","6");
    },

    //下一个点击方法
    nextStudentCli:function(){
        $(".next_span").click(function(){
            if($(".s_active").attr("stu_status")==="6"){
                return;
            }
            for(var i in results){
                for(var k in results[i].list){
                    if(results[i].list[k].result == null){
                        $('#c_ErrorMsg').html('您还有试题没有批改！').fadeIn(200);  Disappear("#c_ErrorMsg")
                        return;
                    }
                }
            }
            next.nextStudent();
        })
    },

    //批改完成添加经验
    correctAndAddExperience:function(){
        $.ajax({
            type:"post",
            url:"/web/teacher/correct/correctAndAddExperience",
            dataType: "json",
            data: {"type":"correctHomework"},
            success:function(data) {
                console.log(data);
            }
        })
    },

    //还原画笔和橡皮工具
    reload:function(){
        $(".pencil").removeClass("change_pencel");
        $(".eraser").removeClass("change_eareser");
        $(".pencil_div").css("background-color","rgb(255, 255, 255)");
        $(".eraser_div").css("background-color","rgb(255, 255, 255)");
        $(".up_li hr").removeClass("addBorder");
    }
}

//发送报告
var sendReports = {
    sendPush:function(stuId){
        var flag = true;
        for(var i in stuIdArray){
            if(stuIdArray[i]){
                flag = false;
            }
        }
        if(flag){
            stuIdArray.push(stuId);
        }
    },
    sendReports:function(){
        var param = {};
        param.userIds = stuIdArray;
        param.assignId = Request.id;
        param.type = "10";
        $.ajax({
            type:"post",
            url:"/web/teacher/correct/sendReports",
            dataType: "json",
            data: param,
            success:function(data){
                if(data.retCode === "0000"){
                    $('#c_ErrorMsg').html('发送完成！').fadeIn(200);  Disappear("#c_ErrorMsg");
                }
            }
        })
    }
}

//实例化
$(function() {
    window.onload = function(){
        getStuList.getStu();
    }
    /*window.onbeforeunload = function() {
     return false; // 可以阻止关闭
     }*/
});
function css(){
    $.ajax({
        type:"post",
        url:"/web/common/commonStyle",
        dataType:"json",
        success:function(data){
            console.log(data);
            if(data.retCode == "0000"){
                var retData = data.retData;
                //console.log(retData);
                //retData.appendTo("head");
                $("head").append(retData);
            }
        },
        error:function(e){
            console.log(e)
        }
    })
}
changeBackgroud();
function changeBackgroud(){
    $("#Canvascon").width();
    console.log($("#Canvascon").width());
    if($("#Canvascon").width()===900){
        $("#canvaswh").attr("src","../../static/image/test/background.png");
    }else if($("#Canvascon").width()===780){
        $("#canvaswh").attr("src","../../static/image/test/background1.png");
    }else if($("#Canvascon").width()===700){
        $("#canvaswh").attr("src","../../static/image/test/background2.png");
    }
}

//已批改的学生无法对批注进行编写
function disableTextArea(flag){
    if(flag==='6'){
        $("#comment_area").attr("disabled",true);
    }else{
        $("#comment_area").attr("disabled",false);
    }
}

//判断当前学生在学生列表中的第几页
function fixedLocation(){
    var ordernum = $(".s_active").attr("ordernum");

    if($(".stu").width()==900){
        scrollWidth=882;
        pageSize = 6;
    }else if($(".stu").width()==882){
        scrollWidth=882;
        pageSize = 6;
    }else if($(".stu").width()==1045){
        scrollWidth=1029;
    }
    var totalPage1 = Math.ceil(Number(ordernum) / pageSize);//计算总页数
    var totalPage2 = Math.ceil(totalSize / pageSize);//计算总页数
    var scrollWidth;//通过判断浏览器的宽度决定课件容器的宽度
    if(totalSize>pageSize){
        if(currentPage==totalPage1){
            $("._right").removeClass("h_rightico_gray").addClass("h_rightico_green");
            $("._left").removeClass("h_leftico_green").addClass("h_leftico_gray");
            return false;
        }else if(totalPage1>currentPage){
            $("._left").removeClass("h_leftico_gray").addClass("h_leftico_green");
            if(totalPage2==totalPage1){
                $("._right").removeClass("h_rightico_green").addClass("h_rightico_gray");
            }
            currentPage = currentPage+totalPage1-1
            $(".stu").find("ul").animate({left:(totalPage1-1)*(-scrollWidth)},500);
        }
    }
}