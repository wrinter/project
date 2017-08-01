/**
 * Created by lgr on 2016/12/24.
 */
SystemRedMsg();
$(document).ready(function(){
    function details(){};
    details.prototype = {
        init : function(){
            CheckBrower();
            GetHtml("../../model/common/common.txt","#Header");
            this.getPaper();
        },
        getPaper : function(){
            var _this = this;
            var paperRecordid= JSON.parse(sessionStorage.getItem("paperRecordid"));
            var questionnum = 0;
            var Num = 0;
            $.ajax({
                type : "post",
                url : "/web/teacher/modeltest/queryPaper",
                data :{id:paperRecordid},
                dataType : "json",
                success : function(data){
                    if(data.retCode == "0000"){
                        //判空白页
                        if(data.retData.resRandomPaperQuestion.length == "0" || data.retData.resRandomPaperQuestion.length == 0){
                            $(".s_paper").hide();
                            $(".nothing").show();
                        }
                            var $s_paper_test_con = $(".s_paper_test_con");
                            var s_paper_oderw = $(".s_paper_oderw");
                            var s_paper_oder_score = $(".s_paper_oder_score");
                            var s_paper_titlecl = $(".s_paper_titlecl,.tudies_papername"); //标题
                            var s_paper_btton = $(".s_paper_btton"); //提交
                            var s_paper_oderuse = $(".s_paper_oderuse");
                            var s_paper_oder_getscore = $(".s_paper_oder_getscore");
                            for(var k in data.retData){
                                if(data.retData[k] == null || data.retData[k] == ""){
                                    data.retData[k]= "--";
                                }
                            }
                            var score = data.retData.score;
                            var testTime = data.retData.testTime;
                            var title = data.retData.title;
                            var userScore = data.retData.userScore;
                            var userTime = data.retData.userTime;
                            //时间分数
                            s_paper_titlecl.text(title);
                            s_paper_oderw.text("时间："+testTime+"分钟");
                            s_paper_oder_score.text("分数："+score+"分");
                            s_paper_oderuse.text("用时："+userTime+"分钟");
                            if(typeof(userScore) == "undefined"){
                                s_paper_oder_getscore.text("得分：--分");
                            }else{
                                s_paper_oder_getscore.text("得分："+userScore+"分");
                            }
                        for(var q = 0 ; q < data.retData.resRandomPaperQuestion.length; q++) {
                            var resDtrue = data.retData.resRandomPaperQuestion[q];
                            var questionGroup = resDtrue.questionGroup;
                            var $ground = $("<div class='ground'></div>");
                            var $tipic = $("<div class='tipic'>" + questionGroup + "</div>").appendTo($ground);
                            $s_paper_test_con.append($ground);
                            for (var i = 0; i<resDtrue.resRandomPaperConfLn.length;i++) {
                                var Dtrue = resDtrue.resRandomPaperConfLn[i];
                                var randomName = Dtrue.randomName;
                                var score = Dtrue.score;
                                var questionTypeId = Dtrue.questionTypeId;
                                var id = Dtrue.id;
                                var selectAble = Dtrue.selectAble;
                                var re = _this.lowCase(Num+1);
                                var $block = $("<div class='s_xptopic' id='"+id+"'questionTypeId='"+questionTypeId+"' score='"+score+"' selectAble='"+selectAble+"' ></div>").appendTo($ground);
                                var $tilte = $("<div class='s_xprandomName'></div>");
                                //$block.append($tilte);
                                //$s_paper_test_con.append($block);
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
                                        if(s_paper_btton.hasClass("add")){
                                            var $optionslove = $("<div class='s_xpslove' style='display: block'></div>");
                                        }else{
                                            var $optionslove = $("<div class='s_xpslove' style='display: block'></div>");
                                        }
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
                                            var contents = xDture.content.replace("</p>","<span class='answer thisanswer' style='margin-left: -23px'>"+userAnswer+"</span><span class='wr'></span></p>").replace("【题干】","");
                                            if(questionType == "01"){
                                                questionnum++
                                                if(selectAble == "0"){
                                                    var $input = $("<textarea class='thisanswer s_input fs18' readonly='readonly' style='resize: none;'placeholder='亲，这道题你没做哦....' value="+userAnswer+" >"+userAnswer+"</textarea>");
                                                    $input.insertAfter($optionchooseD);
                                                }
                                                var $questionType = $("<div class='s_xpquestionType' questionType='01'><label>"+(questionnum)+"、</label></div>").insertBefore($optionchooseA);
                                                var $contentlabel = $("<div class='contentlabel'>"+contents+"</div>").appendTo($questionType);
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
                                                var $solvecont = $("<div class='s_xpslove' style='display: block'></div>");
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
                                                        $(this).css({color:"#65b113"})
                                                    }
                                                }
                                                if($(this).closest(".s_xpoption").attr("userAnswer") === $(this).closest(".s_xpoption").attr("data_answer")){
                                                    $(this).siblings(".s_xpquestionType").find(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/right.png'>");
                                                }else{
                                                    $(this).siblings(".s_xpquestionType").find(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/wrong.png'>");
                                                }
                                            }else{
                                                if($(this).closest(".s_xpoption").attr("userAnswer") === $(this).attr("option")){
                                                    $(this).css({color:"#65b113"})
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
                                                $(this).siblings(".s_xpquestionType").find(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/studies/right.png'>")
                                            }else if(1 <= myuserscore <= score){
                                                $(this).siblings(".s_xpquestionType").find(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/studies/s_wrong_right.png'>")
                                                $("<div class='myscore'>"+myuserscore+"分</div>").appendTo($(this).siblings(".s_xpquestionType").find(".wr"));
                                            }
                                            if( myuserscore == "0" ){
                                                $(this).siblings(".s_xpquestionType").find(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/studies/wrong.png'>")
                                            }
                                            if( myuserscore == "-0" || myuserscore == "" ){
                                                $(this).siblings(".s_xpquestionType").find(".wr").html("")
                                            }
                                        });
                                    }
                                }
                                Num++;
                            }
                        }

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
                        $(".s_paper").hide();
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
                $(".studies_details").stop(true,true).animate({
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
        }
    }
    var $details = new details();
    $(document).ready(function(){
        $details.init();
    })
})