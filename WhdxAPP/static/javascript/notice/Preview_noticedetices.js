/**
 * Created by lgr on 2017/1/3.
 */
$(document).ready(function(){
    function Deitails(){};
    Deitails.prototype = {
        init : function(){
            var paperAssignId = Request.id;//获取栏目id
            var type = Request.type;//获取课时id
            var dtrueidlength = JSON.parse(sessionStorage.getItem("dtrueidlength"));//当前试题的长度
            var uuid = JSON.parse(sessionStorage.getItem("uuid"));//uuid
            var errorRate = JSON.parse(sessionStorage.getItem("errorRate"));//题目
            var ids = JSON.parse(sessionStorage.getItem("ids"));//所有id
            var k = JSON.parse(sessionStorage.getItem("k"));//获取当前题号；
            var tilei = parseInt(k);
            var dtrueid = Request.dtrueid;//获取当前题的dtrueid
            this.getTest(paperAssignId,type,uuid,dtrueid);
            this.clickTest(dtrueidlength,dtrueid,tilei,ids,errorRate,type,uuid,paperAssignId);
            this.getCss();
        },
        getCss : function(){
            $.ajax({
                type:"post",
                url:"/api/common/commonStyle",
                dataType:"json",
                success:function(data){
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
        },
        clickTest : function(idslength,dtrueid,tilei,ids,errorRate,type,uuid,paperAssignId){
            var _this = this;
            var P_rutopscroll = $(".P_rutopscroll");
            for(var i = 0 ; i < idslength ; i++){
                var Dtrue = ids[i];
                var prent = errorRate[Dtrue];
                //console.log(prent)
                $clicktest = $("<li class='idslength_li' prent='"+prent+"' Dtrueid ='"+Dtrue+"'>"+(i+1)+"</li>").appendTo(P_rutopscroll);
            }
            $(".idslength_li").eq(tilei).css({"background":"#65b113","color":"#fff"});
            $(".idslength_li").click(function(){
                var dtrueid = $(this).attr("dtrueid");
                $(this).css({"background":"#65b113","color":"#fff"});
                $(this).siblings(".idslength_li").css({"background":"#fff","color":"#666"});
                //$(this).closest(".n_rutopscroll").animate("left","-10rem");
                _this.getTest(paperAssignId,type,uuid,dtrueid);
            });
            var widthscroll = parseInt($(".idslength_li").width()*idslength+$(".idslength_li").width()/2*idslength);
            P_rutopscroll.width(widthscroll);
        },
        getTest : function(paperAssignId,type,uuid,dtrueid){
            var $n_testpaper = $(".P_testpaper");
            var $P_paper_answer = $(".P_paper_answer");
            $n_testpaper.html("");
            $P_paper_answer.html("");
            var parmas = {}
            parmas.paperAssignId = paperAssignId;
            //parmas.type = type;
            //parmas.uuid = uuid;
            $.ajax({
                type : "post",
                url : "/api//teacher/paper/report/videoTitleDetails",
                data :parmas,
                dataType :"json",
                success : function(data){
                    if(data.retCode == "0000"){
                        var P_paper_answer = $(".P_paper_answer");
                        for(var i = 0 ;i < data.retData.questionList.length ; i++){
                            var Dtrue = data.retData.questionList[i];
                            for(var k in Dtrue){
                                if(!Dtrue[k]){
                                    Dtrue[k] = ""
                                }
                            }
                            var answer = Dtrue.answer;
                            var groupCode = Dtrue.groupCode;
                            var userAnswer = Dtrue.userAnswer;
                            var questionData = Dtrue.questionData;
                            var id = Dtrue.id;
                            var optionA = Dtrue.optionA;
                            var optionB = Dtrue.optionB;
                            var optionC = Dtrue.optionC;
                            var optionD = Dtrue.optionD;
                            if( id == dtrueid){
                                var $P_testpaper = $("<div class='P_testpaper'>");
                                var $P_answer = $("<div class='P_answer'></div>");
                                var $option = $("<div class='s_xpoption p1'userAnswer='"+userAnswer+"'  style='position: relative'></div>");
                                var $optionchooseA = $("<div class='optionchoose p1' option='A'>"+optionA+"</div>").appendTo($option);
                                var $optionchooseB = $("<div class='optionchoose p1' option='B'>"+optionB+"</div>").appendTo($option);
                                var $optionchooseC = $("<div class='optionchoose p1' option='C'>"+optionC+"</div>").appendTo($option);
                                var $optionchooseD = $("<div class='optionchoose p1' option='D'>"+optionD+"</div>").appendTo($option);
                                var $combination = $("<div class='s_xpcombination'></div>");
                                $P_testpaper.append($option);
                                $P_testpaper.append($combination);
                                $option.find(".optionchoose").each(function(){
                                    var num = $(this).attr("option")
                                    if(answer == num){
                                        $(this).css({"color":"#65b113"})
                                    }
                                })
                                if(!groupCode){//普通题
                                    P_paper_answer.append($P_testpaper);
                                    P_paper_answer.append($P_answer);
                                    for(var j = 0;j<Dtrue.list.length;j++){
                                        var lDture = Dtrue.list[j];
                                        var questionId = lDture.questionId;
                                        var questionType = lDture.questionType;
                                        var content = lDture.content.replace("【题干】","").replace("【答案】","").replace("【解析】","");
                                        if(questionType == "01"){
                                            var $questionType = $("<div class='s_xpquestionType p1' questionType='01'>"+content+"</div>").insertBefore($optionchooseA);
                                            //$questionType.append("<span class='answer thisanswer' style='margin-left: 0.465rem'>"+answer+"</span>");
                                        }
                                        if(questionType == "03"){
                                            var $P_answerslove = $("<div class='P_answerslove'><span class='P_answername'>答案</span><span class='P_rigthanswer'>"+content+"</span></div>");

                                        }
                                        if(questionType == "05"){
                                            var $P_analysis_errorp = $("<div class='P_analysis_errorp'>[解析]</div><div class='P_analysis_errorname'><span class='P_analysis_errname'>"+content+"</span></div>")
                                        }
                                        $P_answer.append($P_answerslove);
                                        $P_answer.append($P_analysis_errorp);
                                    }
                                }else{
                                    for(var m=0;m<Dtrue.prepares.length;m++){
                                        var pDtrue = Dtrue.prepares[m];
                                        var optionA = pDtrue.optionA;
                                        var optionB = pDtrue.optionB;
                                        var optionC = pDtrue.optionC;
                                        var optionD = pDtrue.optionD;
                                        var answer = pDtrue.answer;
                                        var id = pDtrue.id;
                                        //question里面的
                                        var $optionul = $("<div class='p1 s_xpoption' id='"+id+"' data_answer='"+answer+"'myscore='0' ></div>");
                                        var $optionAa = $("<div class='p1 optionchoose optionA"+m+"' option='A'>"+optionA+"</div>");
                                        var $optionBb = $("<div class='p1 optionchoose optionB' option='B'>"+optionB+"</div>");
                                        var $optionCc = $("<div class='p1 optionchoose optionC' option='C'>"+optionC+"</div>");
                                        var $optionDd = $("<div class='p1 optionchoose optionD"+m+"' option='D'>"+optionD+"</div>");
                                        $optionul.append($optionAa);
                                        $optionul.append($optionBb);
                                        $optionul.append($optionCc);
                                        $optionul.append($optionDd);
                                        $P_testpaper.append($optionul);
                                        $optionul.find(".optionchoose").each(function(){
                                            var num = $(this).attr("option")
                                            if(answer == num){
                                                $(this).css({"color":"#65b113"})
                                            }
                                        })

                                        //list 2
                                        for(var n=0;n<pDtrue.list.length;n++){
                                            var questionId = pDtrue.list[n].questionId;
                                            var questionType = pDtrue.list[n].questionType;
                                            var content = pDtrue.list[n].content.replace("【题干】","").replace("【答案】","").replace("【解析】","");
                                            var $questionData = $("<div class='s_xpquestionData p1'>"+questionData+"</div>").insertBefore($(".optionA"+m+""));
                                            if(questionType == "01"){
                                                var $questionData = $("<div class='s_xpquestionData p1'>"+questionData+"</div>").insertBefore($(".optionA"+m+""));
                                                var $questionType = $("<div class='s_xpquestionType p1' questionType='01'>"+content+"</div>").insertBefore($(".optionA"+m+""));
                                                //$questionType.append("<span class='answer thisanswer' style='margin-left: -72px'>"+answer+"</span>");
                                            }
                                            if(questionType == "03"){
                                                var $P_answerslove = $("<div class='P_answerslove'><span class='P_answername'>答案</span><span class='P_rigthanswer'>"+content+"</span></div>");
                                            }
                                            if(questionType == "05"){
                                                var $P_analysis_errorp = $("<div class='P_analysis_errorp'>[解析]</div><div class='P_analysis_errorname'><span class='P_analysis_errname'>"+content+"</span></div>")
                                            }
                                            $P_answer.append($P_answerslove);
                                            $P_answer.append($P_analysis_errorp);
                                            P_paper_answer.append($P_testpaper);
                                            $P_answer.insertAfter($P_testpaper);
                                        }
                                    }
                                }
                            }//拿题
                        }
                    }else{
                        //判斷是否有數據
                        javascript:bc.emptyPage();//空白页
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        }

    }
    var $Deitails = new Deitails();
        $Deitails.init();
});
