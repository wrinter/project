/**
 * Created by lgr on 2017/1/3.
 */
$(document).ready(function(){
    function Deitails(){};
    Deitails.prototype = {
        init : function(){
            var questionId = Request.questionId;//获取栏目id
            var uuid = Request.uuid;//获取课时id
            var assignId = Request.assignId;//获取课时id
            this.getTest(questionId,uuid,assignId);
            this.getCss();
        },
        getTest : function(questionId,uuid,assignId){
            var $n_testpaper = $(".P_testpaper");
            var $P_paper_answer = $(".P_paper_answer");
            $n_testpaper.html("");
            $P_paper_answer.html("");
            var parmas = {}
            if(uuid){
                parmas.questionId = questionId;
                parmas.uuid = uuid;
                parmas.assignId = assignId;
            }else{
                parmas.questionId = "9466cc9e7830467b930f6020ecc33d88";
                parmas.uuid = "6739cff77a0bad5f2b76d81ef0232391";
            }
            //parmas.uuid = uuid;
            $.ajax({
                type : "post",
                url : "/api/teacher/correct/selectQueLabelByMongo",
                data :parmas,
                dataType :"json",
                success : function(data){
                    console.log(data)
                    if(data.retCode == "0000"){
                        var P_paper_answer = $(".P_paper_answer");
                        var $P_testpaper = $("<div class='P_testpaper'>");
                        var $P_answer = $("<div class='P_answer'></div>");
                        P_paper_answer.append($P_testpaper);
                        P_paper_answer.append($P_answer);
                        for(var i = 0 ; i < data.retData.list.length ; i++){
                            var Dtrue = data.retData.list[i];
                            for(var M in Dtrue){
                                if(!Dtrue[M]){
                                    Dtrue[M] == "";
                                }
                            }
                            var content=Dtrue.content.replace(/题干/g,' ').replace(/答案/g,' ').replace(/解析/g,' ');
                                content=content.replace("【","");
                                content=content.replace("】","");
                                content=content.replace(/题<\/span><span>干/g,' ');
                            var questionId = Dtrue.questionId;
                            var optionA = Dtrue.optionA;
                            var optionB = Dtrue.optionB;
                            var optionC = Dtrue.optionC;
                            var optionD = Dtrue.optionD;
                            var questionType = Dtrue.questionType;
                            var showOrder = Dtrue.showOrder;
                            if(questionType == "01"){
                                var $questionType = $("<div class='s_xpquestionType p1' questionType='01'>"+content+"</div>").appendTo($P_testpaper);
                                if(optionA){
                                    var optionul = $("<div class='optionchoose'></div>").appendTo($P_testpaper);
                                    var optionchooseA = $("<div class='optionchoose'>"+optionA+"</div>").appendTo(optionul);
                                    var optionchooseB = $("<div class='optionchoose'>"+optionB+"</div>").appendTo(optionul);
                                    var optionchooseC = $("<div class='optionchoose'>"+optionC+"</div>").appendTo(optionul);
                                    var optionchooseD = $("<div class='optionchoose'>"+optionD+"</div>").appendTo(optionul);
                                }
                            }
                            if(questionType == "03"){
                                var $P_answerslove = $("<div class='P_answerslove'><span class='P_answername'>答案:</span><span class='P_rigthanswer'>"+content+"</span></div>");

                            }
                            //if(questionType == "05"){
                            //    var $P_analysis_errorp = $("<div class='P_analysis_errorp'>[解析]</div><div class='P_analysis_errorname'><span class='P_analysis_errname'>"+content+"</span></div>")
                            //}
                            $P_answer.append($P_answerslove);
                            //$P_answer.append($P_analysis_errorp);
                        }
                    }
                    intMathJax();//公式
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        getCss : function(){//公共样式
            $.ajax({
                type:"post",
                url:"/api/common/commonStyle",
                dataType:"json",
                success:function(data){
                    if(data.retCode == "0000"){
                        var retData = data.retData;
                        $("head").append(retData);
                    }
                },
                error:function(e){
                    console.log(e)
                }
            })
        }
    }
    var $Deitails = new Deitails();
        $Deitails.init();
});
