/**
 * Created by lgr on 2017/1/12.
 */
/**
 * Created by lichao on 2017/1/9.
 */
/**
 * Created by lichao on 2017/1/4.
 */
//全局变量
var results = null,imgArray = [];
$(document).ready(function(){
    //初始化
    getStudents();
    function getStudents(){
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
                    var uuid = Request.uuid;//获取栏目id
                    var assignId = Request.assignId;//获取栏目assignId
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
                    $(".correct_operation").html("");//画笔清空
                    $(".tipic_areaul").html("");//题号清空
                    var text = $(this).text();
                    $(".students_names").text(text);
                    var userId = $(this).attr("userId");
                    $(".students_nameshow").attr("userid",userId);
                    var parmas = {};
                    var uuid = Request.uuid;//获取栏目id
                    var assignId = Request.assignId;//获取栏目assignId
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
                        var $span = $("<span class='spanid' data='"+data+"' lnid='"+id+"' style='margin-left: 0.13rem;display: inline-block;'>"+title+"</span>");
                        correct_titleword.append($span);
                        for(var j = 0 ; j < data.retData[i].list.length ; j++){
                            var Dtrue = data.retData[i].list[j];
                            var questionId = Dtrue.questionId;
                            var result = Dtrue.result;
                            var score = Dtrue.score;
                            var questionScore = Dtrue.questionScore;
                            if(result == 0){
                                var $li = $("<li class='correct_titlenum' questionScore='"+questionScore+"' questionId='"+questionId+"' result='"+result+"' score='"+score+"'>"+(j+1)+"<img class='correct_show' src='../../static/image/notice/color_right.png' /></li>");
                                correct_titleword.append($li);
                            }else if(result == 1){
                                var $li = $("<li class='correct_titlenum' questionScore='"+questionScore+"' questionId='"+questionId+"' result='"+result+"' score='"+score+"'>"+(j+1)+"<img class='correct_show' src='../../static/image/notice/color_wrong.png' /></li>");
                                correct_titleword.append($li);
                            }else if(result == 2){
                                var $li = $("<li class='correct_titlenum' questionScore='"+questionScore+"' questionId='"+questionId+"' result='"+result+"' score='"+score+"'>"+(j+1)+"<img class='correct_show' src='../../static/image/notice/color_right_wrong.png' /></li>");
                                correct_titleword.append($li);
                            }else{
                                var $li = $("<li class='correct_titlenum' questionScore='"+questionScore+"' questionId='"+questionId+"' result='"+result+"' score='"+score+"'>"+(j+1)+"<img class='correct_show' src='' /></li>");
                                correct_titleword.append($li);
                            }
                        }
                    }
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
        //公用部分
        var userid = $(".students_nameshow").attr("userid");
        var username = $(".students_namelist").find("."+userid+"id").next(".students_name").text();
        //发送报告后不能点击
        $(".students_namelist").find("."+userid+"id").addClass("addreport");//对点击换学生加class名
        $(".students_nameshow").removeClass("addreport");
        if(!username){
            $(".students_nameshow").addClass("addreport");//不能点击
            $(".background").css("z-index","1")//画笔不能点击
            $(".sharks_word").text("休息一下吧!").fadeIn(200);
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
        //console.log(imgArray)
    })
})