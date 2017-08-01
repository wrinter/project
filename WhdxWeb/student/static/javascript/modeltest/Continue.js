/**
 * Created by lichao on 2017/2/6.
 */
$(document).ready(function(){
    function studentPaper(){}
    studentPaper.prototype = {
        init : function(){//初始化
            var parmas = JSON.parse(sessionStorage.getItem("paper"));
            this.getPaper(parmas);//获取试卷
        },
        getPaper : function(parmas){//获取试卷
            var _this = this;
            var continueid = JSON.parse(sessionStorage.getItem("continueid"));
            var questionnum = 0;
            var Num = 0;
            $.ajax({
                type : "post",
                url : "/web/student/modeltest/lookRecord",
                data :{id:continueid},
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
                        var score = data.retData.score;
                        var id = data.retData.id;
                        var testTime = data.retData.testTime;
                        var title = data.retData.title;
                        var userScore = data.retData.userScore;
                        var userTime = data.retData.userTime;
                        model_paper_titlecl.attr("id",id).text(title);
                        model_testtime.text("时间："+testTime+"分钟");
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
                                        var selectableType = tDrue.selectableType;
                                        //选择题
                                        var $option = $("<div class='s_xpoption' selectableType='"+selectableType+"' id='"+id+"' userAnswer='"+userAnswer+"'  data_answer='"+answer+"' myscore='-0' style='position: relative'></div>");
                                        var $optionslove = $("<div class='s_xpslove' style='display: none'></div>");
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
                                            var content = xDture.content.replace("</p>","<span class='answer thisanswer' style='margin-left: -23px'>"+userAnswer+"</span><span class='wr'></span></p>").replace("【题干】","");
                                            if(questionType == "01"){
                                                questionnum++
                                                if(selectAble == "0"){
                                                    var $input = $("<textarea class='thisanswer s_input fs18' contenteditable='true' style='resize: none;'placeholder='请作答...' value="+userAnswer+">"+userAnswer+"</textarea>");
                                                    $input.insertAfter($optionchooseD);
                                                }
                                                var $questionType = $("<div class='s_xpquestionType' questionType='01'><label>"+(questionnum)+"、</label></div>").insertBefore($optionchooseA);
                                                var $contentlabel = $("<div class='contentlabel'>"+content+"</div>").appendTo($questionType);
                                                if($questionType.find("p").length == "0"){
                                                    $questionType.append("<span class='answer thisanswer' style='margin-left: -23px'>"+userAnswer+"</span><span class='wr'></span>");
                                                }
                                            }else{
                                                var $content = $("<div class='s_xpcontent'>"+content+"</div>").appendTo($optionslove);
                                            }
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
                                                var answer = pDtrue.answer;
                                                var userAnswer = pDtrue.userAnswer;
                                                var answer = pDtrue.answer;
                                                var myuserScore = pDtrue.userScore;
                                                var id = pDtrue.id;
                                                //question里面的
                                                var $optionul = $("<div class='s_xpoption' id='"+id+"' userAnswer='"+userAnswer+"' data_answer='"+answer+"'myscore='0' myuserScore='"+myuserScore+"'></div>");
                                                var $optionAa = $("<div class='optionchoose optionA"+m+"' option='A'>"+optionA+"</div>");
                                                var $optionBb = $("<div class='optionchoose optionB' option='B'>"+optionB+"</div>");
                                                var $optionCc = $("<div class='optionchoose optionC' option='C'>"+optionC+"</div>");
                                                var $optionDd = $("<div class='optionchoose optionD"+m+"' option='D'>"+optionD+"</div>");
                                                var $solvecont = $("<div class='s_xpslove' style='display: none'></div>");
                                                $optionul.append($optionAa);
                                                $optionul.append($optionBb);
                                                $optionul.append($optionCc);
                                                $optionul.append($optionDd);
                                                $combination.append($optionul);
                                                $combination.append($solvecont);
                                                //list 2
                                                for(var n=0;n<pDtrue.list.length;n++){
                                                    var content = pDtrue.list[n].content.replace("</p>","<span class='answer thisanswer' style='margin-left: -23px'>"+userAnswer+"</span><span class='wr'></span></p>").replace("【题干】","");
                                                    var questionType = pDtrue.list[n].questionType;
                                                    if( questionType == "01"){
                                                        if(selectAble == "0"){
                                                            var $input = $("<textarea class='thisanswer s_input fs18' contenteditable='true' style='resize: none;'placeholder='请作答...' value="+userAnswer+">"+userAnswer+"</textarea>");
                                                            $input.insertAfter($(".optionD"+m+""));
                                                        }
                                                        var $cont = $("<div class='s_xpquestionType'questionType='01' n='"+n+"'>"+content+"</div>").insertBefore($(".optionA"+m+""));
                                                        if($cont.find("p").length == "0"){
                                                            $cont.append("<span class='answer thisanswer' style='margin-left: -23px'>"+userAnswer+"</span><span class='wr'></span>");
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
                                    if($(this).attr("option") == userAnswerknwon){
                                        $(this).addClass("addcolor addtwo").css({color:"#49b9df"});
                                    }
                                }
                            }else{
                                if($(this).closest(".s_xpoption").attr("userAnswer") == $(this).attr("option")){
                                    $(this).addClass("addcolor addtwo").css({color:"#49b9df"})
                                }
                            }
                        });
                        isinput.each(function(){
                            $(this).siblings(".s_xpquestionType").find(".answer").html("");
                        });
                        //    划过字体变大
                        _this.cssBig();//字体变化
                        _this.Completion(data);//填空
                        _this.sendPaper(data);   //提交试卷
                        _this.correctbtn(data);
                        ////点击  选择答案
                        ////var t_flag=[];
                        _this.choiceAnswer(data);
                        _this.lostchoiceAnswer(data);
                        _this.shark(data);
                        _this.backtop();
                        _this.getCss();//样式
                    }else{
                        $(".model_papercon,.model_paperleave").hide();
                        $(".nothing").show();
                        //$('#c_ErrorMsg').html('当前地区没有试题!').fadeIn(200);  Disappear("#c_ErrorMsg");
                    }
                },
                error : function(e){
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
        getCss : function(){//获取样式
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
        cssBig : function (s_paper_btton){//划过字体变化
            //    划过字体变大
            $(".s_xpoption").on("mouseover",function(){
                $(this).css({"box-shadow": "0 1px 7px #999","border-radius":"10px"});
            });
            $(".s_xpoption").on("mouseout",function(){
                $(this).css({"box-shadow":""});
            });
        },
        paperTest : function(){//判断试题是否做完
            var answer = $(".s_xptopic[selectable='1']").find(".s_xpoption").find(".s_xpquestionType").find(".answer");
            var s_input  =  $(".s_xptopic[selectable='0']").find(".s_xpoption").find(".s_input ");
            var s_paper_btton = $(".model_send");
            if(answer.length == "0"){
                if(!s_paper_btton.hasClass("show")){
                    s_paper_btton.addClass("show");
                }
            }else{
                answer.each(function(){//客观题
                    var htype = $(this).text();
                    if(!htype){
                        if(s_paper_btton.hasClass("show")){
                            s_paper_btton.removeClass("show")
                        }
                        return false;
                    }
                    if(!s_paper_btton.hasClass("show")){
                        s_paper_btton.addClass("show")
                    }
                });
            }
            if(s_input.length == "0"){
                if(!s_paper_btton.hasClass("display")){
                    s_paper_btton.addClass("display")
                }
            }else{
                s_input.each(function(){
                    var htypetext = $(this).val();
                    if(!htypetext){
                        if(s_paper_btton.hasClass("display")){
                            s_paper_btton.removeClass("display")
                        }
                        //alert("主观题");
                        return false;
                    }
                    if(!s_paper_btton.hasClass("display")){
                        s_paper_btton.addClass("display")
                    }
                })
            }
        },
        shark : function(data){//遮罩层
            var _this = this;
            $(".model_paper_delete_correr,.model_paper_success_correr").on("click",function(){//取消
                $(this).closest(".shark").hide();
            });
            $(".model_paper_false_correr").on("click",function(){//确定
                var time = null;
                _this.sendAjax();
            })
            $(".model_correct_delete,.model_correct_success").on("click",function(){//批改消失
                $(this).closest(".correct_shark").hide();
            })
        },
        sendPaper : function(data){//提交试卷
            var _this = this;
            var s_paper_btton = $(".model_send"); //提交
            s_paper_btton.on("click",function(){
                var $answer = $(".s_xptopic[selectAble='1']").find(".s_xpquestionType[questiontype='01']").find(".answer");
                var  $s_paper_cont = $(".model_paper_cont");//计时
                $answer.each(function(){
                    if(!$(this).html()){
                        $(this).siblings(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/wrong.png'>");
                        $(this).closest(".s_xpoption").attr("myscore","0")
                    }
                    if($(this).closest(".s_xpoption").attr("useranswer") == $(this).closest(".s_xpoption").attr("data_answer")){
                        var score = $(this).closest(".s_xptopic").attr("score")
                        $(this).siblings(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/right.png'>");
                        $(this).closest(".s_xpoption").attr("myscore",score);
                    }else{
                        $(this).siblings(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/wrong.png'>");
                        $(this).closest(".s_xpoption").attr("myscore","0");
                    }
                });
                _this.paperTest();
                if(s_paper_btton.hasClass("show") && s_paper_btton.hasClass("display")){
                    _this.sendAjax();
                }else{
                    $(".shark").show();
                }
            })
        },
        enter : function(){//提交之后的动作
            $(".model_send").fadeOut();  //提交
            $(".model_send").siblings(".model_correct").fadeIn();  //批改
            $(".s_xpslove").show();   //答案
            $(".optionulanwser").show();//答案
            $(".model_paper_cont").hide();//计时器
            $(".model_paper_usedtime").show();//用时
        },
        sendAjax : function(time){//提交试卷
            var _this = this;
            var parmas = {};
            parmas.paperId = $(".model_paper_titlecl").attr("id");
            parmas.status = "1";
            parmas.testTime = -1;
            $.ajax({
                type : "post",
                url : "/web/student/modeltest/correctSubmit",
                data:parmas,
                async:"false",
                dataType : "json",
                beforeSend : function(){
                    $("#c_ErrorMsg").html("正在提交...").fadeIn(200);
                },
                success : function(data){
                    if(data.retCode == "0000"){
                        Disappear("#c_ErrorMsg");
                        $('#c_ErrorMsg').html('提交成功').fadeIn(200);  Disappear("#c_ErrorMsg");
                        $(".s_input,.optionchoose").unbind("click");
                        $(".s_input,.optionchoose").css("cursor","auto");
                        //不能更改内容
                        $(".s_input").attr("readonly","true");
                        $(".s_input").unbind("blur");
                        $(".shark,.s_paper_shark").fadeOut();
                        $(".s_xpoption").css({"border":""});
                        $(".model_paper_change,.correct_shark").hide();
                        $(".wr").show();//显示对错
                        _this.enter();
                        _this.corRectmouseover();   //批改加分
                        var wealth = data.retData;
                        if(wealth){
                            GoldAnimate(wealth);
                        }
                    }else{
                        Disappear("#c_ErrorMsg");
                        $('#c_ErrorMsg').html('提交失败').fadeIn(200);  Disappear("#c_ErrorMsg");
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        corrtAjax : function(score){//批改提交试卷
            var _this = this;
            var parmas = {};
            parmas.paperId = $(".model_paper_titlecl").attr("id");
            parmas.status = "2";
            if(typeof (score) == "undefined" || typeof (score) == undefined ){
            }else{
                parmas.userScore = Number(score);
            }
            $.ajax({
                type : "post",
                url : "/web/student/modeltest/correctSubmit",
                data:parmas,
                async:"false",
                dataType : "json",
                beforeSend : function(){
                    $("#c_ErrorMsg").html("正在提交...").fadeIn(200);
                },
                success : function(data){
                    var model_correct = $(".model_correct");
                    if(data.retCode == "0000"){
                        Disappear("#c_ErrorMsg");
                        $('#c_ErrorMsg').html('提交成功').fadeIn(200);  Disappear("#c_ErrorMsg");
                        $(".s_input,.optionchoose").unbind("click");
                        //不能更改内容
                        $(".s_input").attr("readonly","true");
                        $(".s_input").unbind("blur");
                        $(".shark").fadeOut();
                        $(".s_xpoption").css({"border":""});
                        if(typeof (score) == "undefined"){
                        }else{
                            _this.scoreShow(score)
                        }
                        $(".model_paper_change,.correct_shark").hide();
                        $(".model_correct,.correct").fadeOut();
                        $(".wr").show();//显示对错
                    }else{
                        Disappear("#c_ErrorMsg");
                        $('#c_ErrorMsg').html('提交失败').fadeIn(200);  Disappear("#c_ErrorMsg");
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        scoreShow : function(sum){//显示分数
            var sumone = String(sum);
            var sumlength = String(sum).length;
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
        choiceAnswer:function(data){//单选
            var index = 0;
            var _this = this;
            $(".s_xpoption[selectableType='1'],.questionTitle[selectableType='3']").find(".optionchoose").on("click",function(){
                var answer = $(this).attr("option");
                var questionId = $(this).closest(".s_xpoption").attr("id");
                $(this).closest(".s_xpoption").attr("useranswer",answer);
                //获取 点击后的选项
                $(this).addClass("oneadd");
                var answer = $(this).attr("option");
                var parmas = {};
                parmas.questionId = questionId;
                parmas.userAnswer = answer;
                _this.postAnswer(parmas,$(this),answer);
                //判断是否做题
                _this.isDo();
                index++;
            });
        },
        lostchoiceAnswer:function(data){//多选题
            var index = 0;
            var _this = this;
            var an;
            $(".s_xpoption[selectableType='2']").find(".optionchoose").on("click",function(){
                var questionId = $(this).closest(".s_xpoption").attr("id");
                var answer = [];
                //获取 点击后的选项
                if($(this).hasClass("addtwo")){
                    $(this).removeClass("addtwo");
                }else{
                    $(this).addClass("addtwo");
                }
                $(this).parent(".s_xpoption").children(".addtwo").each(function(){
                    var singleanwer = $(this).attr("option");
                    answer.push(singleanwer)
                });
                answer = answer.join("");
                var parmas = {};
                parmas.questionId = questionId;
                parmas.userAnswer = answer;
                $(this).closest(".s_xpoption").attr("useranswer",answer);
                _this.lostPostAnswer(parmas,$(this),answer);
                index++;
            });
        },
        postAnswer : function(parmas,that,answer){//单选随时保存
            var _this = this;
            $.ajax({
                type : "post",
                url : "/web/student/modeltest/answer",
                data : parmas,
                dataType : "json",
                success : function(data){
                    if(data.retCode = "0000"){
                        if(that.hasClass("oneadd")){
                            that.removeClass("oneadd").css({"color":"#49b9df"}).siblings(".optionchoose").css({"color":"#333"});
                            var score = that.closest(".s_xptopic").attr("score");
                            var answercn = that.closest(".s_xpoption").find(".answer");
                            answercn.html(answer);
                            that.parent(".s_xpoption").addClass("Phtype");
                            if(answer==that.closest(".s_xpoption").attr("data_answer")){
                                that.closest(".s_xpoption").attr("myscore",score).find(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/right.png'>");
                            }else{
                                that.closest(".s_xpoption").attr("myscore","0").find(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/wrong.png'>");
                            }
                            //判断是否做题
                            //_this.isDo();
                        }
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        lostPostAnswer : function(parmas,that,answer){//多选随时保存
            var _this = this;
            $.ajax({
                type : "post",
                url : "/web/student/modeltest/answer",
                data : parmas,
                dataType : "json",
                success : function(data){
                    if(data.retCode == "0000"){
                        if(that.hasClass("addcolor")){
                            that.removeClass("addcolor").css({"color":"#333"});
                        }else{
                            that.addClass("addcolor").css({"color":"#49b9df"});
                        }
                        var score = that.closest(".s_xptopic").attr("score");
                        var answercn = that.closest(".s_xpoption").find(".answer");
                        answercn.html(answer);
                        that.parent(".s_xpoption").addClass("Phtype");
                        if(answer==that.closest(".s_xpoption").attr("data_answer")){
                            that.closest(".s_xpoption").attr("myscore",score).find(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/right.png'>");
                        }else{
                            that.closest(".s_xpoption").attr("myscore","0").find(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/wrong.png'>");
                        }
                        //判断是否做题
                        //_this.isDo();
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        postCorrt : function(questionId,score){//批改上传得分
            var parmas = {};
            parmas.paperId = $(".model_paper_titlecl").attr("id");
            parmas.questionId = questionId;
            parmas.userScore = score;
            $.ajax({
                type : "post",
                url : "/web/student/modeltest/anwerCorrect",
                data : parmas,
                dataType : "json",
                success : function(data){
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        isDo : function(){//判断是否做题
            //判断是否做题
            var $answer = $(".s_xptopic[selectAble='1']").find(".s_xpquestionType[questiontype='01']").find(".answer");
            var $s_input  =  $(".s_xptopic[selectable='0']").find(".s_xpoption").find(".s_input");
            $answer.each(function(){
                if($(this).text()){
                    $(".model_paper_change").css({"background":"#ccc","color":"#fff"});
                    $(".model_paper_change").addClass("add");
                }
            })
            $s_input.each(function(){
                if($(this).val()){
                    $(".model_paper_change").css({"background":"#ccc","color":"#fff"});
                    $(".model_paper_change").addClass("add");
                }
            })
        },
        Completion : function(data){   //填空
            var _this = this;
            $(".s_input").on("blur",function(){
                var questionId = $(this).closest(".s_xpoption").attr("id");
                var value = $(this).val();
                //判断是否做题
                var parmas = {};
                parmas.questionId = questionId;
                parmas.userAnswer = value;
                _this.postAnswer(parmas,$(this),null);
                _this.isDo();//判断是否做题
            })
        },
        corRect :function(){ //判断对错
            var _this = this;
            $correct = $("<div class='correct'></div>");
            $radio = $("<img class='s_corimg selectimg' src='../../../static/image/studies/s_no.png'/>").on("click",function(){
                var scrore = $(this).closest(".s_xptopic").attr("score");
                if($(this).hasClass("addimg")){
                    $(this).closest(".s_xpquestionType").siblings(".s_input").removeClass("imginput");
                    $(this).removeClass("addimg").attr("src","../../../static/image/studies/s_no.png");  //没有选中
                }else{
                    $(this).closest(".s_xpoption").find(".s_input").addClass("imginput");
                    $(this).addClass("addimg").attr("src","../../../static/image/studies/s_right.png");  //已经选中
                    $(this).siblings(".selectimg").removeClass("addimg").attr("src","../../../static/image/studies/s_no.png");   //主观题 出对错
                    $(this).closest(".s_xpquestionType").find(".wr_img").remove();
                    $(this).closest(".s_xpquestionType").append("<img class='wr_img wr_imge' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/right.png'>");
                    $(this).closest(".correct").siblings(".s_score").find(".s_clickstorgenum").html(scrore);
                    $(this).closest(".s_xpoption").attr("myscore",scrore)
                    $(this).closest(".correct").siblings(".s_score").css({"visibility":"hidden"});
                    var questionId = $(this).closest(".s_xpoption").attr("id");
                    _this.postCorrt(questionId,scrore);//批改得分上传
                }
            }).appendTo($correct);
            $right = $("<img class='s_corimg' src='../../../static/image/studies/right.png'/>").appendTo($correct);;
            $radio = $("<img class='s_corimg selectimg' src='../../../static/image/studies/s_no.png'/>").on("click",function(){
                if($(this).hasClass("addimg")){
                    $(this).closest(".s_xpquestionType").siblings(".s_input").removeClass("imginput");
                    $(this).removeClass("addimg").attr("src","../../../static/image/studies/s_no.png");
                }else{
                    $(this).closest(".s_xpoption").find(".s_input").addClass("imginput");
                    $(this).addClass("addimg").attr("src","../../../static/image/studies/s_right.png");
                    $(this).siblings(".selectimg").removeClass("addimg").attr("src","../../../static/image/studies/s_no.png");
                    $(this).closest(".s_xpquestionType").find(".wr_img").remove();
                    var bannum = $(this).closest(".s_xptopic").attr("score")
                    $(this).closest(".correct").siblings(".s_score").find(".s_clickstorgenum").text(parseInt(bannum/2));
                    $(this).closest(".s_xpquestionType").append("<img class='wr_img wr_imge' style='margin-top: 20px;position: absolute;' src='../../../static/image/studies/s_wrong_right.png'>");
                    $(this).closest(".correct").siblings(".s_score").css({"visibility":"visible","display":"block"});
                }
            }).appendTo($correct);
            $wright = $("<img class='s_corimg' src='../../../static/image/studies/s_wrong_right.png'/>").appendTo($correct);;
            $radio = $("<img class='s_corimg selectimg' src='../../../static/image/studies/s_no.png'/>").on("click",function(){
                if($(this).hasClass("addimg")){
                    $(this).removeClass("addimg").attr("src","../../../static/image/studies/s_no.png");
                    $(this).closest(".s_xpquestionType").siblings(".s_input").removeClass("imginput");
                }else{
                    $(this).closest(".s_xpoption").find(".s_input").addClass("imginput");
                    $(this).addClass("addimg").attr("src","../../../static/image/studies/s_right.png");
                    $(this).siblings(".selectimg").removeClass("addimg").attr("src","../../../static/image/studies/s_no.png");
                    $(this).closest(".s_xpquestionType").find(".wr_img").remove();
                    $(this).closest(".s_xpquestionType").append("<img class='wr_img wr_imge' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/wrong.png'>");
                    $(this).closest(".correct").siblings(".s_score").find(".s_clickstorgenum").html("0");
                    $(this).closest(".s_xpoption").attr("myscore","0")
                    $(this).closest(".correct").siblings(".s_score").css({"visibility":"hidden"});
                    var questionId = $(this).closest(".s_xpoption").attr("id");
                    _this.postCorrt(questionId,"0");//批改得分上传
                }
            }).appendTo($correct);
            $wrong = $("<img class='s_corimg' src='../../../static/image/studies/wrong.png'/>").appendTo($correct);
            //$("body").append($correct);
            return $correct
        },
        corRectmouseover : function(){              //滑入出现
            var _this = this;
            var $correct =  _this.corRect();
            var $s_score = _this.getScore();
            $(".s_xptopic[selectable='0']").find(".s_xpquestionType").on("mouseover",function(){
                var correct = $(this).children(".correct");
                var s_score = $(this).children(".s_score");
                if(correct.length<=0){
                    if($correct.find(".selectimg").hasClass("addimg")){
                        $correct.find(".selectimg").removeClass("addimg").attr("src","../../../static/image/studies/s_no.png");
                    }
                    $(this).append($correct);
                    $(this).append($s_score);
                    $s_score.hide();
                }
            });
        },
        getScore : function(){   //计算分数
            var _this = this;
            $s_score = $("<div class='s_score'></div>");
            $s_clickscorereduce = $("<span class='s_clickscorereduce'>-</span>").on("click",function(){
                var num = $(this).next(".s_clickstorgenum").html();
                num--;
                if(num<0){               //最低得分不能低于零分
                    num = 0;
                }
                $(this).next(".s_clickstorgenum").html(num);
            }).appendTo($s_score);
            $s_clickstorgenum = $("<span class='s_clickstorgenum'>0</span>").appendTo($s_score);
            $s_clickscoreplus = $("<span class='s_clickscoreplus'>+</span>").on("click",function(){
                var num = $(this).prev(".s_clickstorgenum").html();
                var sumscore = $(this).closest(".s_xptopic").attr("score");
                num++;
                if(num>sumscore){      //最大得分不能超过本道题的分数
                    num = sumscore;
                }
                $(this).prev(".s_clickstorgenum").html(num);
            }).appendTo($s_score);
            $s_clickmust = $("<span class='s_clickmust'>确定</span>").on("click",function(){
                var myscore = $(this).parent(".s_score").siblings(".wr_img");
                var score = $(this).siblings(".s_clickstorgenum").text();
                $(this).parent(".s_score").siblings(".s_myscore").remove();
                $(this).closest(".s_xpoption").attr("myscore",score);
                //$("<div class='s_myscore'>"+score+"</div>").insertAfter(myscore);
                $(this).closest(".s_score").css({"visibility":"hidden"});
                var questionId = $(this).closest(".s_xpoption").attr("id");
                _this.postCorrt(questionId,score);//批改得分上传
            }).appendTo($s_score);
            return $s_score;
        },
        correctEnter : function(data){//批改遮罩层
            var _this = this;
            var s_paper_correct_btn = $(".s_paper_correct_btn");
            $(".model_correct_false").on("click",function(){
                if($(this).hasClass("addcorrer")){
                    _this.nogetscore(data);//总分   和  状态
                    $(".model_correct").addClass("add")
                }
            })
            $(".model_correct_delete,.model_correct_success").on("click",function(){//批改消失
                $(this).closest(".correct_shark").hide();
            })
        },
        nogetscore : function(data){//最后没有得分
            var _this = this;
            var s_xpoption  = $(".s_xptopic").find(".s_xpoption");
            var score =[];
            var sum = 0;
            s_xpoption.each(function(){
                var myscore = parseInt($(this).attr("myscore"));
                score.push(myscore);
            })
            _this.corrtAjax();
            return sum;
        },
        correctbtn : function(data){//批改按钮
            var _this = this;
            $(".model_correct").on("click",function(){
                _this.iscorrect(data);
                if($(this).hasClass("addshow")){
                    _this.sumscore(data);//总分   和  状态
                    $(this).addClass("add")
                }
            })
        },
        sumscore : function(data){//最后得分
            var _this = this;
            var s_xpoption  = $(".s_xptopic").find(".s_xpoption");
            var score =[];
            var sum = 0;
            s_xpoption.each(function(){
                var myscore = parseInt($(this).attr("myscore"));
                score.push(myscore);
            })
            for(var i =0;i<score.length;i++){
                sum+=score[i];
            }
            _this.corrtAjax(sum);
        },
        iscorrect : function(data){//判断是否批改完
            var _this = this;
            var s_xpoption = $(".s_xptopic[selectable='0']").find(".s_xpoption");
            //var imge =  $(".s_xptopic[selectable='0']").find(".s_xpquestionType").find(".wr_imge");
            if(s_xpoption.length == "0"){
                if(!$(".model_correct").hasClass("addshow")){//给按钮加CLass名；
                    $(".model_correct").addClass("addshow");
                }
            }else{
                s_xpoption.find(".s_xpquestionType").each(function(){
                    if($(this).find(".wr_img").length == "0"){
                        $(".correct_shark").fadeIn();
                        _this.correctEnter(data);//批改确定按钮
                        $(".model_correct_false").addClass("addcorrer");//给确定加class名；
                        $(".model_correct").removeClass("addshow");
                        return false;
                    }
                    if(!$(".model_correct").hasClass("addshow")){//给按钮加CLass名；
                        $(".model_correct").addClass("addshow");
                    }
                })
            }
        }
    }
    var StudentPaper = new studentPaper()
    StudentPaper.init();
})

