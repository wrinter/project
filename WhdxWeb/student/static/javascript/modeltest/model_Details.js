/**
 * Created by lgr on 2017/2/6.
 */
/**
 * Created by lgr on 2016/12/24.
 */
$(document).ready(function(){
    function details(){};
    details.prototype = {
        init : function(){
            this.getPaper();
        },
        getPaper : function(){
            var _this = this;
            var paperRecordid = JSON.parse(sessionStorage.getItem("paperRecordid"));
            //var paperRecordid= Request.paperRecordid;
            var paperRecordid= paperRecordid;
            var questionnum = 0;
            var Num = 0;
            $.ajax({
                type : "post",
                url : "/web/student/modeltest/lookRecord",
                data :{id:paperRecordid},
                dataType : "json",
                success : function(data){
                    if(data.retCode == "0000"){
                        //判空白页
                        if(data.retData.resRandomPaperQuestion.length == "0" || data.retData.resRandomPaperQuestion.length == 0){
                            $(".model_papercon,.model_paperleave").hide();
                            $(".nothing").show();
                        }
                            var model_paper_titlecl = $(".model_paper_titlecl");
                            var model_testtime = $(".model_testtime");
                            var model_testscore = $(".model_testscore");
                            var $model_paper_test_con = $(".model_paper_test_con");
                            //for(var k in data.retData){
                            //    if(data.retData[k] == null || data.retData[k] == ""){
                            //        data.retData[k]= "--";
                            //    }
                            //}
                            var score = data.retData.score;
                            var testTime = data.retData.testTime;
                            var title = data.retData.title;
                            var userScore = data.retData.userScore;
                            var userTime = data.retData.userTime;
                            model_paper_titlecl.text(title);
                            //时间
                            if(userTime == "--"){
                                $(".model_paper_usedtime").hide();
                            }else {
                                _this.time(userTime)
                            }
                            model_testtime.text("时间："+testTime+"分钟");
                            //得分
                            if(typeof(userScore) == "undefined"){
                                $(".model_socre").hide();
                            }else{
                                var sumone = String(userScore);
                                var sumlength = String(userScore).length;
                                _this.score(sumlength,sumone);
                            }
                            model_testscore.text("总分："+score+"分");
                            for(var q = 0 ; q < data.retData.resRandomPaperQuestion.length; q++) {
                            var resDtrue = data.retData.resRandomPaperQuestion[q];
                            var questionGroup = resDtrue.questionGroup;
                            var $ground = $("<div class='ground'></div>");
                            var $tipic = $("<div class='tipic'>" + questionGroup + "</div>").appendTo($ground);
                            $model_paper_test_con.append($ground);
                            for (var i = 0; i<resDtrue.resRandomPaperConfLn.length;i++) {
                                var Dtrue = resDtrue.resRandomPaperConfLn[i];
                                var randomName = Dtrue.randomName;
                                var score = Dtrue.score;
                                var questionTypeId = Dtrue.questionTypeId;
                                var id = Dtrue.id;
                                var selectAble = Dtrue.selectAble;
                                //var re = _this.lowCase(Num+1);
                                var $block = $("<div class='s_xptopic' id='"+id+"'questionTypeId='"+questionTypeId+"' score='"+score+"' selectAble='"+selectAble+"' ></div>").appendTo($ground);
                                var $tilte = $("<div class='s_xprandomName'></div>");
                                //$block.append($tilte);
                                //$model_paper_test_con.append($block);
                                if(Dtrue.questions == null){
                                }else{
                                    for(var j = 0;j<Dtrue.questions.length;j++){
                                        var tDrue = Dtrue.questions[j];
                                        //判断是否为空
                                        for(var k in tDrue){
                                            if(!tDrue[k]){
                                                tDrue[k] = "";
                                            }
                                        }
                                        var optionA = tDrue.optionA;
                                        var optionB = tDrue.optionB;
                                        var optionC = tDrue.optionC;
                                        var optionD = tDrue.optionD;
                                        var userAnswer = tDrue.userAnswer;
                                        var id = tDrue.id;
                                        var groupCode = tDrue.groupCode;
                                        var questionData = tDrue.questionData;
                                        var answer = tDrue.answer;
                                        var myuserScore = tDrue.userScore;
                                        //选择题
                                        var $option = $("<div class='s_xpoption' id='"+id+"' userAnswer='"+userAnswer+"'  data_answer='"+answer+"' myuserScore='"+myuserScore+"' style='position: relative'></div>");
                                        var $optionslove = $("<div class='s_xpslove' style='display: block'></div>");
                                        var $optionchooseA = $("<div class='optionchoose' option='A'>"+optionA+"</div>").appendTo($option);
                                        var $optionchooseB = $("<div class='optionchoose' option='B'>"+optionB+"</div>").appendTo($option);
                                        var $optionchooseC = $("<div class='optionchoose' option='C'>"+optionC+"</div>").appendTo($option);
                                        var $optionchooseD = $("<div class='optionchoose' option='D'>"+optionD+"</div>").appendTo($option);
                                        var $combination = $("<div class='s_xpcombination'></div>");
                                        //组合题
                                        if(!groupCode){
                                        }else{
                                            $questionData = $("<div class='s_xpquestionData'>"+questionData+"</div>").appendTo($combination);
                                        }
                                        $block.append($option);
                                        $block.append($combination);
                                        $block.append($optionslove);
                                        //    题干之类的
                                        for(var k = 0;k<tDrue.list.length ; k++){
                                            var xDture = tDrue.list[k];
                                            var questionType = xDture.questionType;
                                            var selectAble = Dtrue.selectAble;
                                            var content = xDture.content.replace("</p>","<span class='answer thisanswer' style='margin-left: -23px'></span><span class='wr'></span></p>").replace("【题干】","");
                                            var contents = xDture.content.replace("</p>","<span class='answer thisanswer' style='margin-left: -23px'>"+userAnswer+"</span><span class='wr'></span></p>").replace("【题干】","");//(questionnum+1)+"、"
                                            if(questionType == "01"){
                                                questionnum++
                                                if(selectAble == "0"){
                                                    var $input = $("<textarea class='thisanswer s_input fs18' readonly='readonly' style='resize: none;'placeholder='亲，这道题你没做哦....' value="+userAnswer+" >"+userAnswer+"</textarea>");
                                                    $input.insertAfter($optionchooseD);
                                                }
                                                var $questionType = $("<div class='s_xpquestionType' questionType='01'><label class='label'>"+(questionnum)+"、</label>"+contents+"</div>").insertBefore($optionchooseA);
                                                if($questionType.find("p").length == "0"){
                                                    $questionType.append("<span class='answer thisanswer' style='margin-left: -23px'></span><span class='wr'></span>");
                                                }
                                            }else{
                                                var $content = $("<div class='s_xpcontent'>"+content+"</div>").appendTo($optionslove);
                                            }
                                            //$(".s_xpquestionType").find("span:last-child").addClass("answer");
                                        }
                                        //判断是否组合体
                                        if(!groupCode){

                                        }else{
                                            for(var m=0;m<tDrue.prepares.length;m++){
                                                var pDtrue = tDrue.prepares[m];
                                                var optionA = pDtrue.optionA;
                                                var optionB = pDtrue.optionB;
                                                var optionC = pDtrue.optionC;
                                                var optionD = pDtrue.optionD;
                                                var userAnswer = pDtrue.userAnswer;
                                                var answer = pDtrue.answer;
                                                var id = pDtrue.id;
                                                var myuserScore = pDtrue.userScore;
                                                //question里面的
                                                var $optionul = $("<div class='s_xpoption' userAnswer='"+userAnswer+"' id='"+id+"' data_answer='"+answer+"'myuserScore='"+myuserScore+"' ></div>");
                                                var $optionAa = $("<div class='optionchoose optionA"+m+"' option='A' >"+optionA+"</div>");
                                                var $optionBb = $("<div class='optionchoose optionB' option='B' >"+optionB+"</div>");
                                                var $optionCc = $("<div class='optionchoose optionC' option='C' >"+optionC+"</div>");
                                                var $optionDd = $("<div class='optionchoose optionD"+m+"' option='D' >"+optionD+"</div>");
                                                var $solvecont = $("<div class='s_xpslove' style='display: block;color:#ca0d0d'></div>");
                                                $optionul.append($optionAa);
                                                $optionul.append($optionBb);
                                                $optionul.append($optionCc);
                                                $optionul.append($optionDd);
                                                $combination.append($optionul);
                                                $combination.append($solvecont);
                                                //list 2
                                                for(var n=0;n<pDtrue.list.length;n++){
                                                    var content = pDtrue.list[n].content.replace("</p>","<span class='answer thisanswer' style='margin-left: -23px'></span><span class='wr'></span></p>").replace("【题干】","");
                                                    var contents = pDtrue.list[n].content.replace("</p>","<span class='answer thisanswer' style='margin-left: -23px'>"+userAnswer+"</span><span class='wr'></span></p>").replace("【题干】","");
                                                    var questionType = pDtrue.list[n].questionType;
                                                    if( questionType == "01"){
                                                        if(selectAble == "0"){
                                                            var $input = $("<textarea class='thisanswer s_input fs18' readonly='readonly' style='resize: none;'placeholder='亲，这道题你没做哦....'>"+userAnswer+"</textarea>");
                                                            $input.insertAfter($(".optionD"+m+""));
                                                        }
                                                        var $cont = $("<div class='s_xpquestionType'questionType='01' n='"+n+"'>"+contents+"</div>").insertBefore($(".optionA"+m+""));
                                                        if($cont.find("p").length == "0"){
                                                            $cont.append("<span class='answer thisanswer' style='margin-left: -23px'></span><span class='wr'></span>");
                                                        }
                                                    }else{
                                                        var $conts = $("<div class='s_xpquestionType' n = '"+n+"'>"+content+"</div>");
                                                        $solvecont.append($conts);
                                                    }
                                                }

                                            }
                                        }
                                    }
                                }
                                Num++;
                            }
                        }
                            //选择哪个变色
                            var  optionchoose = $(".optionchoose");//单选
                            var isinput = $(".s_input");
                            optionchoose.each(function(){
                                var userAnswer = $(this).closest(".s_xpoption").attr("userAnswer");
                                var userAnswerlength = userAnswer.length;
                                if(userAnswerlength > 1){
                                    for(var i = 0 ; i < userAnswerlength ; i++){
                                        var userAnswerknwon = userAnswer[i]
                                        if($(this).attr("option") === userAnswerknwon){
                                            $(this).css({color:"#49b9df"})
                                        }
                                    }
                                    if($(this).closest(".s_xpoption").attr("userAnswer") === $(this).closest(".s_xpoption").attr("data_answer")){
                                        $(this).siblings(".s_xpquestionType").find(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/right.png'>");
                                    }else{
                                        $(this).siblings(".s_xpquestionType").find(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/wrong.png'>");
                                    }
                                }else{
                                    if($(this).closest(".s_xpoption").attr("userAnswer") === $(this).attr("option")){
                                        $(this).css({color:"#49b9df"})
                                    }
                                    if($(this).closest(".s_xpoption").attr("userAnswer") === $(this).closest(".s_xpoption").attr("data_answer")){
                                        $(this).siblings(".s_xpquestionType").find(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/right.png'>");
                                    }else{
                                        $(this).siblings(".s_xpquestionType").find(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/wrong.png'>");
                                    }
                                }

                            });
                            isinput.each(function(){
                                $(this).siblings(".s_xpquestionType").find(".answer").html("");
                                var myuserscore = $(this).parent(".s_xpoption").attr("myuserscore");
                                var score = $(this).closest(".s_xptopic").attr("score")
                                if( myuserscore=== score ){
                                    $(this).siblings(".s_xpquestionType").find(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/right.png'>");
                                }else if(1 <= myuserscore <= score){
                                    $(this).siblings(".s_xpquestionType").find(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/s_wrong_right.png'>");
                                    $("<div class='myscore'>"+myuserscore+"分</div>").appendTo($(this).siblings(".s_xpquestionType").find(".wr"));
                                }
                                if( myuserscore == "0" ){
                                    $(this).siblings(".s_xpquestionType").find(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/wrong.png'>");
                                }
                                if( myuserscore == "-0" || myuserscore == ""){
                                    $(this).siblings(".s_xpquestionType").find(".wr").html("");
                                }
                            });
                            //    划过字体变大
                            //_this.cssBig();
                            //_this.Completion(data);//
                            //_this.sendPaper(data);   //提交试卷
                            //_this.correctbtn(data);
                            ////点击  选择答案
                            //var t_flag=[];
                            //_this.choiceAnswer(data);
                            //_this.shark(data);
                            _this.getCss()
                            _this.backtop()
                    }else{
                        $(".model_papercon,.model_paperleave").hide();
                        $(".nothing").show();
                    }
                },
                error : function (e){
                    console.log(e)
                }
            })
        },
        lowCase : function(num){
            //中文数字转换
            if(isNaN(num)) return num;
            var AA = new Array("0", "一", "二", "三", "四", "五", "六", "七", "八", "九");
            var BB = new Array("", "十", "百", "千", "万", "亿", "点", "");
            var a = ("" + num).replace(/(^0*)/g, "").split("."), k = 0, re = "";
            for (var i = a[0].length - 1; i >= 0; i--) {
                switch (k) {
                    case 0: re = BB[7] + re; break;
                    case 4: if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
                        re = BB[4] + re; break;
                    case 8: re = BB[5] + re; BB[7] = BB[5]; k = 0; break;
                }
                if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
                if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re; k++;
            }
            if (a.length > 1) //加上小数部分(如果有小数部分)
            {
                re += BB[6];
                for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
            }
            return re;
        },
        backtop : function(){
            $(".back_top").on("click",function(){
                $(".model_paper").stop(true,true).animate({
                    scrollTop: 0
                },200);
            });
        },
        getCss : function(){
            $.ajax({
                type:"post",
                url:"/web/common/commonStyle",
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
        },
        score : function(sumlength,sumone){
            if(sumlength == 3){
                var Hundreds=sumone.substr(0,1);
                var tens=sumone.substr(1,1);
                var digit=sumone.substr(2,1);
                var $h = $("<img class='model_hunhrud' src='../../static/image/Number/g"+Hundreds+".png' />");
                var $t = $("<img class='model_tens' src='../../static/image/Number/g"+tens+".png' />");
                var $d = $("<img class='model_tens' src='../../static/image/Number/g"+digit+".png' />");
                $(".model_socre").append($h);
                $(".model_socre").append($t);
                $(".model_socre").append($d);
            }
            if(sumlength == 2){
                var tens=sumone.substr(0,1);
                var digit=sumone.substr(1,1);
                var $t = $("<img class='model_tens' src='../../static/image/Number/g"+tens+".png' />");
                var $d = $("<img class='model_tens' src='../../static/image/Number/g"+digit+".png' />");
                $(".model_socre").append($t);
                $(".model_socre").append($d);
            }
            if(sumlength == 1){
                var digit=sumone.substr(0,1);
                var $d = $("<img class='model_tens' src='../../static/image/Number/g"+digit+".png' />");
                $(".model_socre").append($d);
            }
        },
        time : function(time){
            if(time >= 60){
                var hour = parseInt(time/60);
                var min = parseInt(time%60);
                if(hour >= 10){
                    $(".model_paper_usedtime .model_hour").text(hour);
                }else{
                    $(".model_paper_usedtime .model_hour").text("0"+hour);
                }
                if(min >= 10){
                    $(".model_paper_usedtime .model_min").text(min);
                }else{
                    $(".model_paper_usedtime .model_min").text("0"+min);
                }
            }else{
                if(time >= 10){
                    $(".model_paper_usedtime .model_min").text(time);
                }else{
                    $(".model_paper_usedtime .model_min").text("0"+time);
                }
            }
        }
    }
    var $details = new details();
    $(document).ready(function(){
        $details.init();
    })
})
