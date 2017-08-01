/**
 * Created by lgr on 2016/12/5.
 */
$(document).ready(function(){
    //Anmite("#indicatorContainer1",100);//例子环形百分比
    function Anmite(id,val){
        var radialObj = $(id).radialIndicator({
            barColor: {
                0: '#72c7e6',
                10: '#72c7e6',
                30: '#f3d95f',
                40: '#f57c47',
                100:'#ef6767'
            },
            radius:100,
            barWidth:20,
            percentage: true
        }).data('radialIndicator');
        //Using Instance
        radialObj.animate(val);
    }
//    公共
    //学生详情
    $(".n_students").click(function(){
        $(this).css({"color":"#7EBC3B"});
        $(this).siblings(".n_titledetailes,.n_sum").css({"color":"#7F7F7F"});
        $(".n_stdentsdetails").show();
        $(".n_stitle,.n_noticeanalysis").hide();
    })
//    学生详情
    var n_students_list = $(".n_students_list").clone(true);
    var paperAssignId = JSON.parse(sessionStorage.getItem("paperAssignId"));
    var type = JSON.parse(sessionStorage.getItem("type"));
    var uuid = JSON.parse(sessionStorage.getItem("uuid"));
    var parmas = {};
    parmas.paperAssignId = paperAssignId;
    parmas.type = type;
    parmas.uuid = uuid;
    Students ()
    function Students (){
        $(".n_stdentsdetails").html("");
        $.ajax({
            type : "post",
            url : "/api/teacher/paper/report/studentDetails",
            data :parmas,
            dataType : "json",
            success : function(data){
                //判斷數據
                //if(data.retData.length <= 0){
                //    javascript:bc.emptyPage();//空白页
                //    return false;
                //}
                var n_stdentsdetails = $(".n_stdentsdetails");
                if(data.retCode == "0000"){
                    for(var i = 0 ;i<data.retData.length;i++){
                        var newclone = n_students_list.clone(true);
                        var Dtrue = data.retData[i];
                        var studentName = Dtrue.studentName;
                        var proportion = Dtrue.proportion;
                        var used = Dtrue.used;
                        var proportioncolor = proportion.substring(0,2);
                        var proportionnocolor = proportion.substring(2,6);
                        var paperAssignId = Dtrue.paperAssignId;
                        var studentId = Dtrue.studentId;
                        function csubstr(str,len){
                            if(str.length>4){
                                return str.substring(0,len)+"...";
                            }else{
                                return str;
                            }
                        }
                        //if(name.length>10){
                        //    name = name.substring(0,10)+"...";
                        //}
                        var time = ToComTime(used);
                        newclone.find(".n_details_name").text(csubstr(studentName,4));//限制题目字数
                        //newclone.find(".n_details_name").text(studentName);
                        if(used == "-1"){
                            newclone.find(".n_details_time").css({"color":"#ca0d0d"}).text("未提交");
                        }else{
                            newclone.find(".n_details_time").text("用时："+time);
                        }
                        if(proportioncolor == "--"){
                            newclone.find(".proporticolor").css({"color":"#666"}).text(proportioncolor);
                        }else{
                            newclone.find(".proporticolor").text(proportioncolor);
                        }
                        newclone.find(".proportionnocolor").text(proportionnocolor);
                        newclone.appendTo(n_stdentsdetails);
                    }
                }else{
                    //javascript:bc.emptyPage();//空白页
                }
            },
            error : function(e){
                console.log(e)
            }
        })
    }
//    题目详情
    $(".n_titledetailes").click(function(){
        $(this).css({"color":"#7EBC3B"});
        $(this).siblings(".n_students,.n_sum").css({"color":"#7F7F7F"});
        $(".n_stitle").show();
        $(".n_stdentsdetails,.n_noticeanalysis").hide();
    });
    Title ()
    function Title (){
        var Num=0;
        $.ajax({
            type : "post",
            url : "/api/teacher/paper/report/titleDetails",
            data : {paperAssignId:paperAssignId,type:type,uuid:uuid},
            dataType : "json",
            success : function(data){
                if(data.retCode == "0000"){
                    var errorRate = data.retData.errorRate;
                    var ids = data.retData.ids;
                    var n_numbersort = $(".n_numbersort");
                    var Did = [];
                    for(var i = 0 ; i < data.retData.paper.questionLines.length ; i++){
                        var Dtrue = data.retData.paper.questionLines[i];
                        for(var j = 0 ; j < Dtrue.questionGroup.length ; j++){
                            var qDtrue = Dtrue.questionGroup[j];
                            var groupCode = qDtrue.groupCode;
                            var isSplite = qDtrue.isSplite;
                            if(groupCode && isSplite == "0"){//不可拆分
                                Num++;
                                var questionId = qDtrue.questionId;
                                var lastnum = data.retData.errorRate[questionId];
                                var lastnum = parseInt(lastnum);
                                var $sideContent = $("<div class='sideContent' Dtrueid='"+questionId+"' lastnum = '"+lastnum+"' Num='"+Num+"'>");
                                var $span = $("<div class='prg-cont rad-prg' id='indicatorContainer"+Num+"' ></div><span class='prg_titlenum'>"+Num+"</span>").appendTo($sideContent);
                                n_numbersort.append($sideContent);
                                Anmite('#indicatorContainer'+Num,lastnum);
                            }else if(groupCode && isSplite == "1"){//可拆分
                                for(var k = 0 ; k < qDtrue.questions.length;k++){
                                    Num++;
                                    var uDtrue = qDtrue.questions[k];
                                    var questionId = uDtrue.questionId;
                                    var lastnum = data.retData.errorRate[questionId];
                                    var lastnum = parseInt(lastnum);
                                    var $sideContent = $("<div class='sideContent' Dtrueid='"+questionId+"' lastnum = '"+lastnum+"' Num='"+Num+"'>");
                                    var $span = $("<div class='prg-cont rad-prg' id='indicatorContainer"+Num+"' ></div><span class='prg_titlenum'>"+Num+"</span>").appendTo($sideContent);
                                    n_numbersort.append($sideContent);
                                    Anmite('#indicatorContainer'+Num,lastnum);
                                }
                            }else{//普通题
                                for(var k = 0 ; k < qDtrue.questions.length;k++){
                                    Num++;
                                    var uDtrue = qDtrue.questions[k];
                                    var questionId = uDtrue.questionId;
                                    var lastnum = data.retData.errorRate[questionId];
                                    var lastnum = parseInt(lastnum);
                                    var $sideContent = $("<div class='sideContent' Dtrueid='"+questionId+"' lastnum = '"+lastnum+"' Num='"+Num+"'>");
                                    var $span = $("<div class='prg-cont rad-prg' id='indicatorContainer"+Num+"' ></div><span class='prg_titlenum'>"+Num+"</span>").appendTo($sideContent);
                                    n_numbersort.append($sideContent);
                                    Anmite('#indicatorContainer'+Num,lastnum);
                                }
                            }
                        }
                    }
                    sessionStorage.setItem("ids",JSON.stringify(ids));
                    sessionStorage.setItem("errorRate",JSON.stringify(errorRate));
                    //题目详情统计
                    $(".sideContent").click(function(){
                        var dtrueid = $(this).attr("dtrueid");
                        var Num = $(this).attr("Num");
                        sessionStorage.setItem("Num",JSON.stringify(Num));
                        window.location.href = "notice_details_rubric.html?id="+paperAssignId+"&type="+type+"&dtrueid="+dtrueid+"&uuid="+uuid+"&Num="+Num;
                    });
                }else{
                    //判斷數據
                    javascript:bc.emptyPage();//空白页
                }
            },
            error : function(e){
                console.log(e)
            }
        })
    }

    //这里是排序
    sort();
    function sort(){
        $(".n_prentsent").click(function(){
            if(!$(this).hasClass("addclass")){
                $(this).find(".n_falsepresentimg").addClass("n_titlepresent");
                $(this).find(".n_sortword").text("按题号排序")
                $(this).addClass("addclass");
                var sideContent = $(".sideContent");//按错题率排序
                var n_numbersort = $(".n_numbersort");
                var sideContents = sideContent.toArray().sort(function(a,b){
                    return   $(a).attr("lastnum")-$(b).attr("lastnum");
                });
                //$(".n_numbersort").html("");
                n_numbersort.append(sideContents)
                //sideContents.appendTo(".n_numbersort")
            }else{
                $(this).find(".n_falsepresentimg").removeClass("n_titlepresent");
                $(this).find(".n_sortword").text("按错误率排序");
                $(this).removeClass("addclass");
                var sideContent = $(".sideContent");//按题目排序
                var n_numbersort = $(".n_numbersort");
                var sideContents = sideContent.toArray().sort(function(a,b){
                    return   $(a).attr("Num")-$(b).attr("Num");
                });
                //$(".n_numbersort").html("");
                n_numbersort.append(sideContents)
            }

        })
    }

//    综合分析
    $(".n_sum").click(function(){
        $(this).css({"color":"#7EBC3B"});
        $(this).siblings(".n_students,.n_titledetailes").css({"color":"#7F7F7F"});
        $(".n_noticeanalysis").show();
        $(".n_stdentsdetails,.n_stitle").hide();
    })
    var n_noticealysis_accuracy = $(".n_noticealysis_accuracy").clone(true);
    anAlysis();

    function anAlysis(){
        var n_noticeanalysis = $(".n_noticeanalysis");
        n_noticeanalysis.html("");
        $.ajax({
            type : "post",
            url : "/api/teacher/paper/report/comprehensiveAnalysis",
            data : {paperAssignId:paperAssignId},
            dataType : "json",
            success : function(data){
                if(data.retCode == "0000"){
                    //判斷數據
                    if(data.retData.length <= 0){
                        window.location.href = "nothing.html";
                        return false;
                    }
                    var n_noticeanalysis = $(".n_noticeanalysis");
                    for(var i = 0; i<data.retData.length;i++){
                        var Dtrue = data.retData[i];
                        var newclone = n_noticealysis_accuracy.clone(true);
                        var correctRate = Dtrue.correctRate;
                        var correctRates = parseInt(correctRate);
                        var knowledgeName = Dtrue.resTag.tagName;
                        newclone.find(".n_noticealysis_title").text(knowledgeName);
                        newclone.find(".n_noticealysis_progress").attr("value",correctRates);
                        newclone.find(".n_noticealysis_progressprent").text(correctRate);
                        var arry = [];
                        for(var j = 0;j< Dtrue.itemNumberSet.length;j++){
                            var iDtrue = Dtrue.itemNumberSet[j];
                            arry.push(iDtrue);//排序
                            var arrys = arry.sort(function(a,b){
                                return a -b
                            });
                        }
                        for (var k = 0 ; k< arrys.length;k++){
                            var iDtrue = arrys[k];
                            if(k == (arrys.length-1)){
                                var  $n_noticealysis_tnum = $("<span class='n_noticealysis_tnum' num='"+iDtrue+"'>"+iDtrue+"</span>")
                            }else{
                                var  $n_noticealysis_tnum = $("<span class='n_noticealysis_tnum' num='"+iDtrue+"'>"+iDtrue+"、</span>")
                            }
                            newclone.find(".n_noticealysis_tl").append($n_noticealysis_tnum);
                        }
                        n_noticeanalysis.append(newclone)
                    }
                }
            },
            error : function(e){
                console.log(e)
            }
        })
    }
});
