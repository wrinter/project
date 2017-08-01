/**
 * Created by lichao on 2017/2/8.
 */
$(document).ready(function(){
    var Traning = {
        init : function (){
            var _this = this;
            //获取补偿训练价格
            $.ajax({
                type : "post",
                url : "/web/student/compensation/compensation/getPrice",
                dataType : "json",
                async : true,
                success : function(data){
                    console.log(data)
                    var wealth = data.retData.wealth;
                    _this.getPaper(wealth);//获取试卷
                    sessionStorage.setItem("getExp",JSON.stringify(getExp));
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        getPaper : function(wealth){
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
                        var isNew = data.retData.isNew;
                        var status = data.retData.status;
                        if(isNew == "1"){
                        $('#c_ErrorMsg').html(wealth+'金币!').fadeIn(200);  Disappear("#c_ErrorMsg");//拿到补偿训练页面
                        }
                        self.opener.location.reload();
                        if(status != "1"){
                            //$(".trianingUp").hide();
                            $(".traningname").attr("status",status);
                        }else{

                        }
                        traningname.text(paperName);
                        dohomeworkname.text(paperName);
                        _this.Data(data);
                    }else{
                        $(".traning").hide();
                        $(".nothing").show();
                        //$('#c_ErrorMsg').html('亲，暂时没有数据哦!').fadeIn(200);  Disappear("#c_ErrorMsg");
                    }
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
                        var selectableType = qDtrue.selectableType;
                        var $questionTitle = $("<div class='questionTitle' userAnswer='"+userAnswer+"'='"+questionId+"' questionId='"+questionId+"' selectable='"+selectable+"' selectableType='"+selectableType+"'data_answer='"+answer+"' questionType='"+questionType+"'></div>").appendTo($groung);
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
                            if(userAnswer){
                                var $input = $("<textarea class='s_input' contenteditable='true' style='resize: none;'placeholder='"+userAnswer+"'>"+userAnswer+"</textarea>");
                            }else{
                                var $input = $("<textarea class='s_input' contenteditable='true' style='resize: none;'placeholder='请作答...'></textarea>");
                            }
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
                            if(userAnswer){
                                var $input = $("<textarea class='s_input' contenteditable='true' style='resize: none;'value='"+userAnswer+"'>"+userAnswer+"</textarea>");
                            }else{
                                var $input = $("<textarea class='s_input' contenteditable='true' style='resize: none;'placeholder='请作答...'></textarea>");
                            }
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
                            if(userAnswer){
                                var $input = $("<textarea class='s_input' contenteditable='true' style='resize: none;'value='"+userAnswer+"' >"+userAnswer+"</textarea>");
                            }else{
                                var $input = $("<textarea class='s_input' contenteditable='true' style='resize: none;'placeholder='请作答...'></textarea>");
                            }
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
            _this.Completion();//填空
            _this.choiceAnswer();//單選
            _this.lostchoiceAnswer();//多選
            _this.clickCP();//單選
            _this.Shark();//遮罩层

        },
        choiceAnswer:function(data){//单选题
            var id = JSON.parse(sessionStorage.getItem("sub"));
            var _this = this;
            $(".questionTitle[selectableType='1'],.questionTitle[selectableType='3']").find(".optionchoose").on("click",function(){
                var answer = $(this).attr("option");
                var questionId = $(this).closest(".questionTitle").attr("questionId");
                var parmas = {};
                //var userAnswers = {};
                //userAnswers.userAnswer = answer;
                //userAnswers.questionid = questionid;
                parmas.answer = answer;
                parmas.questionId = questionId;
                parmas.compId = $(".traningname").attr("id");
                _this.Ajax(parmas);//修改答案
                $(this).closest(".questionTitle").find(".questionanswer").text(answer);
                $(this).css({"color":"#49b9df"}).siblings(".optionchoose").css({"color":"#333"});
            });
        },
        lostchoiceAnswer : function(data){//多选题
            var id = JSON.parse(sessionStorage.getItem("sub"));
            var _this = this;
            $(".questionTitle[selectableType='2']").find(".optionchoose").on("click",function(){
                var answer = [];
                //获取 点击后的选项
                if($(this).hasClass("addcolor")){
                    $(this).removeClass("addcolor").css({"color":"#333"});
                }else{
                    $(this).addClass("addcolor").css({"color":"#49b9df"});
                }
                $(this).parent(".choose").children(".addcolor").each(function(){
                    var singleanwer = $(this).attr("option");
                    answer.push(singleanwer)
                });
                answer = answer.join("");
                var parmas = {};
                var questionId = $(this).closest(".questionTitle").attr("questionId");
                var parmas = {};
                //var userAnswers = {};
                //userAnswers.userAnswer = answer;
                //userAnswers.questionid = questionid;
                parmas.answer = answer;
                parmas.questionId = questionId;
                parmas.compId = $(".traningname").attr("id");
                _this.Ajax(parmas)
                $(this).closest(".questionTitle").find(".questionanswer").text(answer);
            });
        },
        Completion : function(){//填空修改答案
            var _this = this;
            $(".s_input").on("blur",function(){
                var answer = $(this).val();
                var questionId = $(this).closest(".questionTitle").attr("questionId");
                var parmas = {};
                parmas.compId = $(".traningname").attr("id");
                parmas.questionId = questionId;
                parmas.answer = answer;
                _this.Ajax(parmas);//修改答案
            })
        },
        Shark : function(){
            var _this = this;
            $(".model_paper_delete_correr,.model_paper_false_correr").on("click",function(){
                $(".shark").fadeOut();
            })
            $(".model_paper_success_correr").on("click",function(){
                _this.Upajax();
            })
        },
        clickCP : function(){
            var _this = this;
            $(".trianingUp").on("click",function(){
                _this.clickUP();//点击提交
            });
        },
        clickUP : function(){//提交
            var _this = this;
            var parmas = {};
            parmas.id = $(".traningname").attr("id");
            $.ajax({
                type : "post",
                url : "/web/student/compensation/checkCompensationAnswer",
                data : parmas,
                dataType : "json",
                success : function(data){
                    if(data.retCode == "0000"){
                        var answer = data.retData.answer;
                        if(answer == "false"){
                            $(".shark").show();
                        }else{
                            _this.Upajax();
                        }
                        self.opener.location.reload();
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
                url : "/web/student/compensation/submitCompensation",
                data : parmas,
                dataType : "json",
                success : function(data){
                    console.log(data)
                    if(data.retCode == "0000"){
                        $('#c_ErrorMsg').html('提交成功').fadeIn(200);  Disappear("#c_ErrorMsg");
                        window.location.href = "trainingDetails.html";
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        Ajax : function(parmas){//修改答案ajax
            $.ajax({
                type : "post",
                url : "/web/student/compensation/updateCompensationAnswer",
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
