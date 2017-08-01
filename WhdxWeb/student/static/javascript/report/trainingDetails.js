/**
 * Created by lichao on 2017/2/8.
 */
$(document).ready(function(){
    var Traning = {
        init : function (){
            this.getPaper();//获取试卷
        },
        getPaper : function(){
            var _this = this;
            var sub = JSON.parse(sessionStorage.getItem("sub"));
            var subjectId = JSON.parse(localStorage.getItem("subjectId"));
            var parmasC = JSON.parse(sessionStorage.getItem("parmasC"));
            var parmas = {};
            if(parmasC){
                parmas = parmasC;
            }else{
                parmas.type = "1";
                parmas.subjectId = "01";
                parmas.id = "58b8c1f19c850a1a05520ec0";
            }
            $.ajax({
                type : "post",
                url : "/web/student/compensation/createCompensation",
                data : parmas,
                dataType : "json",
                success : function(data){
                    console.log(data);
                    var traningname = $(".traningname");
                    var dohomeworkname = $(".dohomeworkname");
                    if(data.retCode == "0000"){
                        var paperName = data.retData.paperName;
                        traningname.text(paperName);
                        dohomeworkname.text(paperName);
                        _this.Data(data);
                    }else{
                        $(".traning").hide();
                        $(".nothing").show();
                        //$('#c_ErrorMsg').html('亲，暂时没有数据哦!').fadeIn(200);  Disappear("#c_ErrorMsg");
                    }
                    self.opener.location.reload();
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        Data : function(data){
            var _this = this;
            var traningpaper = $(".traningpaper");
            var Num = 0;
            var id = data.retData.id;
            $(".traningname").attr("id",id);
            for(var i = 0 ; i < data.retData.groupList.length ; i++){
                var Dtrue = data.retData.groupList[i];
                var content = Dtrue.content;
                var groupCode = Dtrue.groupCode;
                var isSplite = Dtrue.isSplite;
                var $groung = $("<div class='groung' isSplite='"+isSplite+"'></div>");
                if(groupCode && isSplite == "0"){//题号不可拆分
                    Num++;
                    var $content = $("<div class='content'>"+Num+"、"+content+"</div>").appendTo($groung);
                    var num1 = 0;
                    for(var j = 0 ; j < Dtrue.questions.length; j++){
                        var qDtrue = Dtrue.questions[j];
                        //var lnOrder = qDtrue.lnOrder;
                        for(var M in qDtrue){
                            if(!qDtrue[M]){
                                qDtrue[M] = ""
                            }
                        }
                        var questionTitle = qDtrue.questionTitle.replace("【题干】","");
                        var questionId = qDtrue.questionId;
                        var optionA = qDtrue.optionA;
                        var optionB = qDtrue.optionB;
                        var optionC = qDtrue.optionC;
                        var optionD = qDtrue.optionD;
                        var questionTypeId = qDtrue.questionTypeId;
                        var selectable = qDtrue.selectable;
                        var answer = qDtrue.answer;
                        var userAnswer = qDtrue.paperUserAnswer.userAnswer;
                        if(!userAnswer){
                            userAnswer = ""
                        }
                        var selectableType = qDtrue.selectableType;
                        var $questionTitle = $("<div class='questionTitle' userAnswer='"+userAnswer+"' questionId='"+questionId+"' selectable='"+selectable+"' selectableType='"+selectableType+"'data_answer='"+answer+"' questionType='"+questionType+"'></div>").appendTo($groung);
                        var $conts = $("<div class='contTitle'>"+questionTitle+"<span class='questionanswer'></span></div>").appendTo($questionTitle);
                        var $img = $("<span class='quetion_imge'></span>").appendTo($conts);
                        if(optionA){
                            var $choose = $("<div class='choose'></div>").appendTo($questionTitle);
                            var $optionchooseA = $("<div class='optionchoose p1' option='A'>"+optionA+"</div>").appendTo($choose);
                            var $optionchooseB = $("<div class='optionchoose p1' option='B'>"+optionB+"</div>").appendTo($choose);
                            var $optionchooseC = $("<div class='optionchoose p1' option='C'>"+optionC+"</div>").appendTo($choose);
                            var $optionchooseD = $("<div class='optionchoose p1' option='D'>"+optionD+"</div>").appendTo($choose);
                        }else{

                        }
                        var $answer = $("<div class='answer'></div>").appendTo($questionTitle);
                        var $groundanswer = $("<div class='groundanswer'></div>").appendTo($questionTitle);
                        if(selectable =="0"){
                            var $input = $("<textarea class='s_input' contenteditable='true' style='resize: none;'placeholder='"+userAnswer+"' readonly = 'readonly'></textarea>");
                            $input.insertBefore($answer);
                        }
                        //答案解析难度之类的
                        for(var n = 0 ; n < qDtrue.labels.length; n++){
                            var lDtrue = qDtrue.labels[n];
                            var content = lDtrue.content;
                            var questionType = lDtrue.questionType;
                            if(questionType == "03" ){
                                var $analysisanswer = $("<div class='analysis speek'>"+content+"</div>").appendTo($answer);
                            }
                            if(questionType == "05"){
                                var $analysis = $("<div class='analysis'>"+content+"</div>").appendTo($answer);
                            }
                        }
                        //判断对错
                        var result = qDtrue.paperUserAnswer.result;
                        var userAnswer = qDtrue.paperUserAnswer.userAnswer;
                        if(result=="0"){
                            var $rightwrong = $("<img class='wr_img' style='position: absolute;top: 20px;right: 20px' src='../../../static/image/prepare/right.png'>").appendTo($img);
                        }else if(result == null){
                            var $noNeedspeak = $("<div class='noSpeek'>未批</div>").appendTo($img);
                        }else{
                            var $rightwrong = $("<img class='wr_img' style='position: absolute;top: 20px;right: 20px' src='../../../static/image/prepare/wrong.png'>").appendTo($img);
                        }
                        num1++;
                    }
                }else if(groupCode && isSplite == "1"){//组合题可拆分
                    var $content = $("<div class='content'>"+content+"</div>").appendTo($groung);
                    for(var j = 0 ; j < Dtrue.questions.length; j++){
                        Num++;
                        var qDtrue = Dtrue.questions[j];
                        //var lnOrder = qDtrue.lnOrder;
                        for(var M in qDtrue){
                            if(!qDtrue[M]){
                                qDtrue[M] = ""
                            }
                        }
                        var questionTitle = qDtrue.questionTitle.replace("【题干】",Num+"、");
                        var questionId = qDtrue.questionId;
                        var optionA = qDtrue.optionA;
                        var optionB = qDtrue.optionB;
                        var optionC = qDtrue.optionC;
                        var optionD = qDtrue.optionD;
                        var questionTypeId = qDtrue.questionTypeId;
                        var selectable = qDtrue.selectable;
                        var answer = qDtrue.answer;
                        var userAnswer = qDtrue.paperUserAnswer.userAnswer;
                        if(!userAnswer){
                            userAnswer = ""
                        }
                        var selectableType = qDtrue.selectableType;
                        var $questionTitle = $("<div class='questionTitle' userAnswer='"+userAnswer+"' questionId='"+questionId+"' selectable='"+selectable+"' selectableType='"+selectableType+"'data_answer='"+answer+"' questionType='"+questionType+"'></div>").appendTo($groung);
                        var $conts = $("<div class='contTitle'>"+questionTitle+"<span class='questionanswer'></span></div>").appendTo($questionTitle);
                        var $img = $("<span class='quetion_imge'></span>").appendTo($conts);
                        if(optionA){
                            var $choose = $("<div class='choose'></div>").appendTo($questionTitle);
                            var $optionchooseA = $("<div class='optionchoose p1' option='A'>"+optionA+"</div>").appendTo($choose);
                            var $optionchooseB = $("<div class='optionchoose p1' option='B'>"+optionB+"</div>").appendTo($choose);
                            var $optionchooseC = $("<div class='optionchoose p1' option='C'>"+optionC+"</div>").appendTo($choose);
                            var $optionchooseD = $("<div class='optionchoose p1' option='D'>"+optionD+"</div>").appendTo($choose);
                        }else{

                        }
                        var $answer = $("<div class='answer'></div>").appendTo($questionTitle);
                        var $groundanswer = $("<div class='groundanswer'></div>").appendTo($questionTitle);
                        if(selectable =="0"){
                            var $input = $("<textarea class='s_input' readonly='readonly' contenteditable='true' style='resize: none;'placeholder='"+userAnswer+"'></textarea>");
                            $input.insertBefore($answer);
                        }
                        //答案解析难度之类的
                        for(var n = 0 ; n < qDtrue.labels.length; n++){
                            var lDtrue = qDtrue.labels[n];
                            var content = lDtrue.content;
                            var questionType = lDtrue.questionType;
                            if(questionType == "03" ){
                                var $analysisanswer = $("<div class='analysis speek'>"+content+"</div>").appendTo($answer);
                            }
                            if(questionType == "05"){
                                var $analysis = $("<div class='analysis'>"+content+"</div>").appendTo($answer);
                            }
                        }
                        //判断对错
                        var result = qDtrue.paperUserAnswer.result;
                        var userAnswer = qDtrue.paperUserAnswer.userAnswer;
                        if(result=="0"){
                            var $rightwrong = $("<img class='wr_img' style='position: absolute;top: 20px;right: 20px' src='../../../static/image/prepare/right.png'>").appendTo($img);
                        }else if(result == null){
                            var $noNeedspeak = $("<div class='noSpeek'>未批</div>").appendTo($img);
                        }else{
                            var $rightwrong = $("<img class='wr_img' style='position: absolute;top: 20px;right: 20px' src='../../../static/image/prepare/wrong.png'>").appendTo($img);
                        }
                    }
                }else{
                    Num++;
                    for(var j = 0 ; j < Dtrue.questions.length; j++){//普通题
                        var qDtrue = Dtrue.questions[j];
                        //var lnOrder = qDtrue.lnOrder;
                        for(var M in qDtrue){
                            if(!qDtrue[M]){
                                qDtrue[M] = ""
                            }
                        }
                        var questionTitle = qDtrue.questionTitle.replace("【题干】",Num+"、");
                        var questionId = qDtrue.questionId;
                        var optionA = qDtrue.optionA;
                        var optionB = qDtrue.optionB;
                        var optionC = qDtrue.optionC;
                        var optionD = qDtrue.optionD;
                        var questionTypeId = qDtrue.questionTypeId;
                        var selectable = qDtrue.selectable;
                        var answer = qDtrue.answer;
                        var userAnswer = qDtrue.paperUserAnswer.userAnswer;
                        if(!userAnswer){
                            userAnswer = ""
                        }
                        var selectableType = qDtrue.selectableType;
                        var $questionTitle = $("<div class='questionTitle' userAnswer='"+userAnswer+"' questionId='"+questionId+"' selectable='"+selectable+"' selectableType='"+selectableType+"'data_answer='"+answer+"' questionType='"+questionType+"'></div>").appendTo($groung);
                        var $conts = $("<div class='contTitle'>"+questionTitle+"<span class='questionanswer'></span></div>").appendTo($questionTitle);
                        var $img = $("<span class='quetion_imge'></span>").appendTo($conts);
                        if(optionA){
                            var $choose = $("<div class='choose'></div>").appendTo($questionTitle);
                            var $optionchooseA = $("<div class='optionchoose p1' option='A'>"+optionA+"</div>").appendTo($choose);
                            var $optionchooseB = $("<div class='optionchoose p1' option='B'>"+optionB+"</div>").appendTo($choose);
                            var $optionchooseC = $("<div class='optionchoose p1' option='C'>"+optionC+"</div>").appendTo($choose);
                            var $optionchooseD = $("<div class='optionchoose p1' option='D'>"+optionD+"</div>").appendTo($choose);
                        }else{

                        }
                        var $answer = $("<div class='answer'></div>").appendTo($questionTitle);
                        var $groundanswer = $("<div class='groundanswer'></div>").appendTo($questionTitle);
                        if(selectable =="0"){
                            var $input = $("<textarea class='s_input' readonly='readonly' contenteditable='true' style='resize: none;'placeholder='"+userAnswer+"'></textarea>");
                            $input.insertBefore($answer);
                        }
                        //答案解析难度之类的
                        for(var n = 0 ; n < qDtrue.labels.length; n++){
                            var lDtrue = qDtrue.labels[n];
                            var content = lDtrue.content;
                            var questionType = lDtrue.questionType;
                            if(questionType == "03" ){
                                var $analysisanswer = $("<div class='analysis speek'>"+content+"</div>").appendTo($answer);
                            }
                            if(questionType == "05"){
                                var $analysis = $("<div class='analysis'>"+content+"</div>").appendTo($answer);
                            }
                        }
                        //判断对错
                        var result = qDtrue.paperUserAnswer.result;
                        var userAnswer = qDtrue.paperUserAnswer.userAnswer;
                        if(result=="0"){
                            var $rightwrong = $("<img class='wr_img' style='position: absolute;top: 20px;right: 20px' src='../../../static/image/prepare/right.png'>").appendTo($img);
                        }else if(result == null){
                            var $noNeedspeak = $("<div class='noSpeek'>未批</div>").appendTo($img);
                        }else{
                            var $rightwrong = $("<img class='wr_img' style='position: absolute;top: 20px;right: 20px' src='../../../static/image/prepare/wrong.png'>").appendTo($img);
                        }
                    }
                }
                //组合题答案区域
                for(var k = 0 ; k < Dtrue.labels.length; k++){
                    var lDtrue = Dtrue.labels[k];
                    var content = lDtrue.content;
                    var questionType = lDtrue.questionType;
                    if(questionType == "03" ){
                        var $analysisanswer = $("<div class='analysis speek'>"+content+"</div>").appendTo($groundanswer);
                    }
                    if(questionType == "05"){
                        var $analysis = $("<div class='analysis'>"+content+"</div>").appendTo($groundanswer);
                    }
                }
                traningpaper.append($groung);
            }
            //变色
            var eachChoose = $(".optionchoose");
            eachChoose.each(function(){
                var myanswer = $(this).closest(".questionTitle").attr("userAnswer");
                var data_answer = $(this).closest(".questionTitle").attr("data_answer");
                var userAnswerlength = myanswer.length;
                //console.log(userAnswer);
                if(userAnswerlength > 1){
                    for(var i = 0 ; i < userAnswerlength ; i++){
                        var userAnswerknwon = myanswer[i]
                        //console.log(userAnswerknwon)
                        if($(this).attr("option") === userAnswerknwon){
                            $(this).addClass("addcolor").css({color:"#49b9df"});
                        }
                    }
                }else{
                    if(myanswer === $(this).attr("option")){
                        $(this).css({color:"#49b9df"});
                    }
                }
            })
            _this.getCss();//样式
            _this.clickCP();//單選
            _this.corRectmouseover();//批改
            _this.Shark();//批改
            _this.stuatus(data);//详情
        },
        stuatus : function(data){
            //只看详情的时候
            var status = data.retData.status;
            var userId = data.retData.userId;
            var buyUserId = data.retData.buyUserId;
            if( status== "3" || userId != buyUserId){
                $(".trianingCorrect").hide();
                $(".questionTitle[selectable='0']").unbind("mouseover");
            }
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
                    $(this).closest(".questionTitle").find(".quetion_imge").html("");
                    $(this).closest(".questionTitle").find(".quetion_imge").append("<img class='wr_img wr_imge' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/right.png'>");
                    var parmas = {};
                    parmas.compId = $(".traningname").attr("id");
                    parmas.questionId = $(this).closest(".questionTitle").attr("questionId");
                    parmas.result = "0";
                    _this.Cajax(parmas);

                }
                console.log("aa");
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
                    $(this).closest(".questionTitle").find(".quetion_imge").html("");
                    $(this).closest(".questionTitle").find(".quetion_imge").append("<img class='wr_img wr_imge' style='margin-top: 20px;position: absolute;' src='../../../static/image/studies/s_wrong_right.png'>");
                    var parmas = {};
                    parmas.compId = $(".traningname").attr("id");
                    parmas.questionId = $(this).closest(".questionTitle").attr("questionId");
                    parmas.result = "2";
                    _this.Cajax(parmas);
                }
                console.log("aa");
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
                    $(this).closest(".questionTitle").find(".quetion_imge").html("");
                    $(this).closest(".questionTitle").find(".quetion_imge").append("<img class='wr_img wr_imge' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/wrong.png'>");
                    var parmas = {};
                    parmas.compId = $(".traningname").attr("id");
                    parmas.questionId = $(this).closest(".questionTitle").attr("questionId");
                    parmas.result = "1";
                    _this.Cajax(parmas);
                }
                console.log("aa");
            }).appendTo($correct);
            $wrong = $("<img class='s_corimg' src='../../../static/image/studies/wrong.png'/>").appendTo($correct);
            //$("body").append($correct);
            return $correct
        },
        corRectmouseover : function(){              //滑入出现
            var _this = this;
            var $correct =  _this.corRect();
            $(".questionTitle[selectable='0']").on("mouseover",function(){
                var correct = $(this).children(".correct");
                if(correct.length<=0){
                    if($correct.find(".selectimg").hasClass("addimg")){
                        $correct.find(".selectimg").removeClass("addimg").attr("src","../../../static/image/studies/s_no.png");
                    }
                    $(this).append($correct);
                }
            });
        },
        Shark : function(){
            var _this = this;
            $(".model_correct_delete,.model_correct_false").on("click",function(){
                $(".correct_shark").fadeOut();
            })
            $(".model_correct_success").on("click",function(){
                _this.Upajax();
            })
        },
        clickCP : function(){
            var _this = this;
            $(".trianingCorrect").on("click",function(){
                _this.clickUP();//批改
            });
        },
        clickUP : function(){//判断批改了
            var _this = this;
            var parmas = {};
            parmas.id = $(".traningname").attr("id");
            $.ajax({
                type : "post",
                url : "/web/student/compensation/checkCompensationCorrect",
                data : parmas,
                dataType : "json",
                success : function(data){
                    console.log(data)
                    if(data.retCode == "0000"){
                        var correct = data.retData.correct;
                        if(correct == "false"){
                            $(".correct_shark").show();
                        }else{
                            _this.Upajax();
                        }
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        Upajax : function(){//提交批改
            var parmas = {};
            parmas.id = $(".traningname").attr("id");
            $.ajax({
                type : "post",
                url : "/web/student/compensation/correctCompensation",
                data : parmas,
                dataType : "json",
                success : function(data){
                    console.log(data)
                    if(data.retCode == "0000"){
                        $('#c_ErrorMsg').html('提交成功').fadeIn(200);  Disappear("#c_ErrorMsg");
                        $(".correct_shark,.trianingCorrect,.correct").fadeOut();
                        $(".questionTitle[selectable='0']").unbind("mouseover");
                        self.opener.location.reload();
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        Cajax : function(parmas){//修改批改
            $.ajax({
                type : "post",
                url : "/web/student/compensation/updateCompensationcorrect",
                data : parmas,
                dataType : "json",
                success : function(data){
                    console.log(data)
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        getCss : function(){//获取样式
            $.ajax({
                type:"post",
                url:"/web/common/commonStyle",
                dataType:"json",
                success:function(data){
                    console.log(data);
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
    Traning.init();
})
