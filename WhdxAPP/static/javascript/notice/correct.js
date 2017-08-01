/**
 * Created by lichao on 2017/1/9.
 */
/**
 * Created by lichao on 2017/1/4.
 */
//全局变量
var results = null,imgArray = [];
$(document).ready(function(){
//    点击每道题目出现批改
    function mouseOver(){
        var $correct_area = $("<div class='correct_area'>");
        var $correct_riwr = $("<div class='correct_riwr'>").appendTo($correct_area);
        var $correct_right = $("<img class='correct_right' src='../../static/image/notice/right.png'>").on("click",function(){//对号
            $(this).closest(".correct_area").siblings(".correct_show").show();
            $(this).closest(".correct_area").siblings(".correct_show").attr({"src":"../../static/image/notice/color_right.png"});
            $(this).parent(".correct_riwr").hide();
            $(this).closest(".correct_titlenum").attr("result","0");
            //为存贮数据做准备
            var result = $(this).closest(".correct_titlenum").attr("result");
            console.log(result)
            var lnid = $(this).closest(".correct_titlenum").siblings(".spanid").attr("lnid");
            var questionIdid = $(this).closest(".correct_titlenum").attr("questionid");
            retData(lnid,questionIdid,result);
        }).appendTo($correct_riwr);
        var  $correct_ccc = $("<span class='correct_ccc'></span>").appendTo($correct_riwr);
        var correct_right_wrong = $("<img class='correct_right_wrong' src='../../static/image/notice/right_wrong.png'>").on("click",function(){//半对
            $(this).closest(".correct_area").siblings(".correct_show").show();
            $(this).closest(".correct_area").siblings(".correct_show").attr({"src":"../../static/image/notice/color_right_wrong.png"});
            //$(this).parent(".correct_riwr").siblings(".correct_score").show();
            $(this).parent(".correct_riwr").hide();
            $(this).closest(".correct_titlenum").attr("result","2");
            //为存贮数据做准备
            var result = $(this).closest(".correct_titlenum").attr("result");
            var lnid = $(this).closest(".correct_titlenum").siblings(".spanid").attr("lnid");
            var questionIdid = $(this).closest(".correct_titlenum").attr("questionid");
            console.log(result)
            retData(lnid,questionIdid,result)
        }).appendTo($correct_riwr);
        var  $correct_ccc = $("<span class='correct_ccc'></span>").appendTo($correct_riwr);
        var correct_wrong = $("<img class='correct_wrong' src='../../static/image/notice/wrong.png'>").on("click",function(){
            $(this).closest(".correct_area").siblings(".correct_show").show();
            $(this).closest(".correct_area").siblings(".correct_show").attr({"src":"../../static/image/notice/color_wrong.png"});
            $(this).parent(".correct_riwr").hide();
            $(this).closest(".correct_titlenum").attr("result","1");
            //为存贮数据做准备
            var result = $(this).closest(".correct_titlenum").attr("result");
            var lnid = $(this).closest(".correct_titlenum").siblings(".spanid").attr("lnid");
            var questionIdid = $(this).closest(".correct_titlenum").attr("questionid");
            console.log(result)
            retData(lnid,questionIdid,result)
        }).appendTo($correct_riwr);
        var  $correct_ccc = $("<span class='correct_ccc'></span>").appendTo($correct_riwr);
        var $correct_titilenum = $("<span class='correct_titilenum'>1</span>").appendTo($correct_riwr);
        //加分
        var $correct_score = $("<div class='correct_score'>").appendTo($correct_area);
        var $correct_releasecc = $("<span class='correct_releasecc'>-</span>").on("click",function(){//减号
            var num = parseInt($(this).siblings(".correct_scoreshucc").text());
            num--;
            if(num <= 0){
                num = 0;
            }
            $(this).siblings(".correct_scoreshucc").text(num);
        }).appendTo($correct_score);
        var $correct_ccc = $("<span class='correct_ccc'></span>").appendTo($correct_score);
        var $correct_socreshu = $("<span class='correct_scoreshucc'>6</span>").appendTo($correct_score);//数组
        var $correct_ccc = $("<span class='correct_ccc'></span>").appendTo($correct_score);
        var $correct_plus = $("<span class='correct_pluscc'>+</span>").on("click",function(){//加号
            var num = parseInt($(this).siblings(".correct_scoreshucc").text());
            num++;
            $(this).siblings(".correct_scoreshucc").text(num);
        }).appendTo($correct_score);
        var $correct_ccc = $("<span class='correct_ccc'></span>").appendTo($correct_score);
        var $correct_enter = $("<span class='correct_enter'>确定</span>").on("click",function(){//确定
            $(this).parent(".correct_score").fadeOut();
            $(this).parent(".correct_score").siblings(".correct_riwr").addClass("add");
        }).appendTo($correct_score);
        return $correct_area;
    }
    //批改框移入显示
    var $correct_area = mouseOver();
    //存值
    function retData(questionlnId,questionId,result){
        for(var i in results){
            if(results[i].id == questionlnId){
                for(var k in results[i].list){
                    if(results[i].list[k].questionId == questionId){
                        results[i].list[k].result = result;
                    }
                }
            }
        }
        var paper = results;
        console.log(results);
        sessionStorage.setItem("paper",JSON.stringify(paper));
    }
    $(".correct_titlenum").click(function(){
        console.log("aaa")
    })
    //初始化
    getStudents();
    function getStudents(){
        var $correct_area = mouseOver();
        var uuid = Request.uuid;//获取栏目id
        var assignId = Request.assignId;//获取栏目assignId
        var parmas = {};
        if(uuid){
            parmas.uuid = uuid;
            parmas.assignId = assignId;
        }else{
            parmas.uuid = "f3dde4429bd51e1c04bf34bb240cbb2b";
            parmas.assignId = "11";
        }
        $.ajax({
            type : "post",
            url : "/api/teacher/correct/selectDetails",
            data : parmas,
            dataType : "json",
            success : function(data){
                console.log(data)
                var $students_namelist = $(".students_namelist");
                if(data.retCode == "0000"){
                    var status = data.retData[0].status;
                    var userIdo = data.retData[0].userId;
                    var userName = data.retData[0].userName;
                    $(".students_nameshow").attr({"status":status,"userId":userIdo}).find(".students_names").text(userName);
                    $(".students_nameshow").addClass(userIdo+"id");
                    for(var i = 0 ; i < data.retData.length ; i++){
                        var status = data.retData[i].status;
                        var userId = data.retData[i].userId;
                        var userName = data.retData[i].userName;
                        var $correct = $("<li class='students_name "+userId+"id' userId='"+userId+"' status='"+status+"'>"+userName+"</li>").appendTo($students_namelist)
                    }
                    //    第一人的资料
                    var parmas = {};
                    if(uuid){
                        parmas.uuid = uuid;
                        parmas.userId = userIdo;
                        parmas.assignId = assignId;
                    }else{
                        parmas.uuid = "f3dde4429bd51e1c04bf34bb240cbb2b";
                        parmas.userId = userIdo;
                        parmas.assignId = "11"
                    }
                    getTest(parmas)
                    getPicture(parmas)
                }
                //    选取学生
                $(".students_name").click(function(){
                    var uuid = Request.uuid;//获取栏目id
                    var assignId = Request.assignId;//获取栏目assignId
                    //发送报告
                    if($(this).hasClass("addreport")){
                        $(".students_nameshow").addClass("addreport")
                        $(".background").css("z-index","1")
                        //画笔不能点击换图片
                        $(this).closest(".correct_word").siblings(".correct_imge").find(".correct_operation").addClass("addreport");
                    }else{
                        $(".students_nameshow").removeClass("addreport")
                        $(".background").css("z-index","-1")
                    }
                    var $correct_area = mouseOver();
                    $(".correct_operation").html("");//画笔清空
                    $(".tipic_areaul").html("");//题号清空
                    var text = $(this).text();
                    $(".students_names").text(text);
                    var userId = $(this).attr("userId");
                    $(".students_nameshow").attr("userid",userId);
                    var parmas = {};
                    if(uuid){
                        parmas.uuid = uuid;
                        parmas.userId = userId;
                        parmas.assignId = assignId;
                    }else{
                        parmas.uuid = "f3dde4429bd51e1c04bf34bb240cbb2b";
                        parmas.userId = userId;
                        parmas.assignId = "11";
                    }
                    imgArray = [];
                    results = [];
                    getTest(parmas);
                    getPicture(parmas);
                })
            },
            error : function(e){
                console.log(e)
            }
        })
    }
    //   调好第一个人的试题批改或者更改学生
    function getTest(parmas){
        var $correct_area = mouseOver();
        var correct_titleword = $(".correct_titleword");
        correct_titleword.html("");
        $.ajax({
            type : "post",
            url : "/api/teacher/correct/selectPaper",
            data : parmas,
            dataType : "json",
            success : function(data){
                console.log(data)
                sessionStorage.setItem("data",JSON.stringify(data))
                results = data.retData;
                if(data.retCode == "0000"){
                    var correct_titleword = $(".correct_titleword");
                    for(var i = 0 ; i< data.retData.length ; i++){
                        var title = data.retData[i].title;
                        var id = data.retData[i].id;
                        var correct_ul = $("<ul class='correct_ul'></ul>")
                        var $span = $("<span class='spanid' data='"+data+"' lnid='"+id+"' style='margin-left: 0.13rem;display: inline-block;'>"+title+"</span>");
                        correct_ul.append($span);
                        correct_titleword.append(correct_ul)
                        for(var j = 0 ; j < data.retData[i].list.length ; j++){
                            var Dtrue = data.retData[i].list[j];
                            var questionId = Dtrue.questionId;
                            var result = Dtrue.result;
                            var score = Dtrue.score;
                            var questionScore = Dtrue.questionScore;
                            if(result == 0){
                                var $li = $("<li class='correct_titlenum' questionScore='"+questionScore+"' questionId='"+questionId+"' result='"+result+"' score='"+score+"'>"+(j+1)+"<img class='correct_show' src='../../static/image/notice/color_right.png' /></li>");
                                correct_ul.append($li);
                            }else if(result == 1){
                                var $li = $("<li class='correct_titlenum' questionScore='"+questionScore+"' questionId='"+questionId+"' result='"+result+"' score='"+score+"'>"+(j+1)+"<img class='correct_show' src='../../static/image/notice/color_wrong.png' /></li>");
                                correct_ul.append($li);
                            }else if(result == 2){
                                var $li = $("<li class='correct_titlenum' questionScore='"+questionScore+"' questionId='"+questionId+"' result='"+result+"' score='"+score+"'>"+(j+1)+"<img class='correct_show' src='../../static/image/notice/color_right_wrong.png' /></li>");
                                correct_ul.append($li);
                            }else{
                                var $li = $("<li class='correct_titlenum' questionScore='"+questionScore+"' questionId='"+questionId+"' result='"+result+"' score='"+score+"'>"+(j+1)+"<img class='correct_show' src='' /></li>");
                                correct_ul.append($li);
                            }
                        }
                    }
                    //点击每个list
                    $(".correct_titlenum").click(function(){
                        var _this = $(this).closest(".correct_titileaera").siblings(".students_nameshow")
                        if(_this.hasClass("addreport")){
                            $(this).unbind("click");
                        }else{
                            var correct_area = $(this).children(".correct_area");
                            var num = $(this).text();//获取当前题号
                            var Stringnum = $(this).attr("questionid");//试题的id；
                            var addid = $(".addid").attr("id");//图片的id；
                            console.log(addid)
                            if(correct_area.length<=0){
                                $(this).append($correct_area)
                                //if($correct_area.find(".correct_riwr").hasClass("add")){
                                $correct_area.find(".correct_riwr").show();
                                $correct_area.find(".correct_riwr").find(".correct_titilenum").text(num)
                                //}
                                javascript:bc.setQuestionId(Stringnum,addid);//看解析
                            }
                        }
                    })
                }
            },
            error : function(e){
                console.log(e)
            }
        })
    }

    //获取图片
    function getPicture(parmas){
        //var correct_imge_slove = $(".correct_imge_slove");
        //correct_imge_slove.html("");
        $(".correct_imge_slove").find("canvas").remove();
        $.ajax({
            type : "post",
            url : "/api/teacher/correct/selectAnswerPicture",
            data : parmas,
            dataType : "json",
            success : function(data){
                console.log(data)
                if(data.retCode == "0000"){
                    var correct_imge_slove = $(".correct_imge_slove");
                    var correct_operation = $(".correct_operation");
                    var tipic_areaul = $(".tipic_areaul");
                    var pDtruel = data.retData.picList;
                    //学生上传图片
                    for(var i = 0 ; i < data.retData.picList.length ; i++){
                        var pDtrue = data.retData.picList[i];
                        var imgSrc = pDtrue.imgSrc;
                        var $tipic_areali = $("<span class='tipic_areali' id='"+pDtrue.fileId+"' src='"+imgSrc+"'>"+(i+1)+"</span>").prependTo(tipic_areaul);
                        var $Canvas = $("<canvas id='"+pDtrue.fileId+"canvas' class='Canvas'></canvas>").prependTo(correct_imge_slove);
                        var $area_opertion = $("<span id='"+pDtrue.fileId+"area'  class='area_opertion'></span>").appendTo(correct_operation);
                        var $correct_remove = $("<span id='"+pDtrue.fileId+"goback' class='correct_remove correct_isremove eraser'></span>").appendTo($area_opertion);
                        var $correct_pen = $("<span id='"+pDtrue.fileId+"brush' class='correct_pen correct_ispen pencil'></span>").appendTo($area_opertion);
                        //var $correct_down = $("<span id='"+pDtrue.fileId+"translate' class='correct_down correct_downrelod'></span>").appendTo($area_opertion);
                        //document.getElementById(pDtrue.fileId+"canvas").style.backgroundImage ="url("+imgSrc+")";
                        //document.getElementById(pDtrue.fileId+"canvas").style.display = "none";
                        document.getElementById(pDtrue.fileId+"area").style.display = "none";
                    }
                    $(".tipic_areali").last().addClass("addid");
                    var markList = data.retData.marksList;
                    //    教师批改的图片
                    for(var j in pDtruel){
                        var markPic = null;
                        var b = true;
                        for(var k in markList){
                            if(pDtruel[j].fileId === markList[k].imgPosition){
                                markPic = markList[k].markPic;
                                var pro = {};
                                pro.answerPicId = pDtruel[j].fileId;
                                pro.fileStr = markPic;
                                pro.flag = "2";
                                imgArray.push(pro);
                                new Stroke().init(pDtruel[j].fileId,pDtruel[j].fileId+"canvas",pDtruel[j].fileId+"brush",pDtruel[j].fileId+"goback",markPic);
                                document.getElementById(pDtruel[j].fileId+"canvas").style.backgroundImage ="url("+pDtruel[j].imgSrc+")";
                                document.getElementById(pDtruel[j].fileId+"canvas").style.display = "none";
                                b = false;
                            }
                        }
                        if(b){
                            new Stroke().init(pDtruel[j].fileId,pDtruel[j].fileId+"canvas",pDtruel[j].fileId+"brush",pDtruel[j].fileId+"goback",null);
                            document.getElementById(pDtruel[j].fileId+"canvas").style.backgroundImage ="url("+pDtruel[j].imgSrc+")";
                            document.getElementById(pDtruel[j].fileId+"canvas").style.display = "none";
                        }
                    }
                }
                if(pDtruel.length != 0){
                    console.log(pDtruel)
                    if(pDtruel[0].fileId){
                        $("#"+pDtruel[0].fileId+"canvas").show();
                        $("#"+pDtruel[0].fileId+"area").show();
                    }
                }

                //换图片
                $(".tipic_areali").click(function(){
                    //addid
                    $(this).addClass("addid");
                    $(this).siblings(".tipic_areali").removeClass("addid");
                    var id = $(this).attr("id");
                    $("#"+id+"area").fadeIn();
                    $("#"+id+"canvas").fadeIn();
                    $("#"+id+"area").siblings(".area_opertion").hide();
                    $("#"+id+"canvas").siblings(".Canvas").hide();
                })
            },
            error : function (e){
                console.log(e)
            }
        })
    }
    function addreport(){
        if($(this).closest(".correct_word").siblings(".correct_imge").find(".correct_operation").hasClass("addreport")){
            $(this).closest(".correct_word").siblings(".correct_imge").find(".correct_operation").find(".correct_remove").addClass("correct_noremove");
        }
    }
    //    获取学生或者更改学生
    $(".students_nameshow").click(function(){
        if(!$(this).hasClass("add")){
            $(this).find(".students_namelist").show();
            $(this).addClass("add")
        }else{
            $(this).find(".students_namelist").hide();
            $(this).removeClass("add")
        }

    });
    function marklist (){

    }
//    下一个
//    点击下一个
    var userIds = [];
    $(".correct_nextpeople").click(function(){
        var uuid = Request.uuid;//获取栏目id
        var assignId = Request.assignId;//获取栏目assignId
        var paper = sessionStorage.getItem("paper");
        var userid = $(".students_nameshow").attr("userid");
        userIds.push(userid);
        sessionStorage.setItem("userIds",JSON.stringify(userIds));
        var parmas = {};
        if(uuid){
            parmas.userId = userid;
            parmas.assignId = assignId;
            parmas.resultsStr = paper;//错题集
            //console.log(parmas.resultsStr)
            if(imgArray.length>0){
                parmas.filesStr = JSON.stringify(imgArray);
            }
            parmas.uuid = uuid;
            parmas.totalRemarks = "";//教师的批语
        }else{
            parmas.userId = userid;
            parmas.assignId = "11";
            parmas.resultsStr = paper;//错题集
            //console.log(parmas.resultsStr)
            if(imgArray.length>0){
                parmas.filesStr = JSON.stringify(imgArray);
            }
            parmas.uuid = "f3dde4429bd51e1c04bf34bb240cbb2b";
            parmas.totalRemarks = "";//教师的批语
        }
        next(parmas,$(this));//保存
        //console.log(imgArray)
    })
    //保存
    function next(parmas,_this){
        //alert("2222")
        $.ajax({
            type : "post",
            url : "/api/teacher/correct/nextStudent",
            data : parmas,
            dataType : "json",
            success : function(data){
                console.log(data)
                if(data.retCode == "0000"){
                    //公用部分
                    var userid = $(".students_nameshow").attr("userid");
                    var username = $(".students_namelist").find("."+userid+"id").next(".students_name").text();
                    //发送报告后不能点击
                    $(".students_namelist").find("."+userid+"id").addClass("addreport");//对点击换学生加class名
                    $(".students_nameshow").removeClass("addreport");
                    if(!username){
                        $(".students_nameshow").addClass("addreport");//不能点击
                        $(".background").css("z-index","1")//画笔不能点击
                        $(".sharks_word").text("批改完了，休息一下吧!").fadeIn(200);
                        //最后一个学生
                        function timeout() {
                            $(".sharks_word").fadeOut();
                        };
                        setTimeout(timeout,2000);
                        return false;
                    }
                    $(".students_nameshow").find(".students_names").html("");
                    var listid = $(".students_namelist").find("."+userid+"id").next(".students_name").attr("userid");
                    $(".students_nameshow").attr("userid",listid);
                    $(".students_nameshow").find(".students_names").text(username);
                    var uuid = Request.uuid;//获取栏目id
                    var assignId = Request.assignId;//获取栏目assignId
                    var parmas = {};
                    if(uuid){
                        parmas.uuid = uuid;
                        parmas.userId = listid;
                        parmas.assignId = assignId;
                    }else{
                        parmas.uuid = "f3dde4429bd51e1c04bf34bb240cbb2b";
                        parmas.userId = listid;
                        parmas.assignId = "11";
                    }

                    $(".correct_operation").html("");
                    $(".tipic_areaul").html("");
                    getTest(parmas);//获取题号
                    getPicture(parmas);//获取图片
                    console.log(username)
                    imgArray = [];
                    results = [];
                }
            },
            error : function(e){
                console.log(e)
            }
        })
    }
})