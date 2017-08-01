/**
 * Created by lichao on 2017/2/10.
 */
$(document).ready(function(){
    var Preview = {
        init : function(){
            var _this = this;
            var parmas = {};
            parmas.id = Request.id;
            $.ajax({
                type: "post",
                url: "/web/student/homework/write/queryPaperById",
                data: parmas,
                dataType: "json",
                success: function (data) {
                    if(data.retCode == "0000"){
                        _this.Data(data);
                    }
                }
            })
        },
        Data :function(data){
            var _this = this;
            var loginId = data.retData.loginId;
            _this.getPreviewPaper(data);
            _this.getTime(loginId);
        },
        getTime : function(loginId){
            var sub = JSON.parse(sessionStorage.getItem("sub"));
            var parmas = {};
            parmas.recordId = sub.id;
            parmas.loginId = loginId;
            $.ajax({
                type : "post",
                url : "/web/student/homework/write/StartPreviewInfo",
                data : parmas,
                dataType : "json",
                success : function(data){
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        getPreviewPaper : function(data){
            //判空
            if(data.retData.previewInfo == null || data.retData.previewInfo.questionList == 0){
                $(".DH_paper").hide();
                $(".nothing").show();
                return false;
            }
            var _this = this;
            var questionNum = 0;
            var DH_strongeoption = $(".DH_strongeoption");
            var test_knownsend = $(".DH_send");
            var DH_title = $(".DH_title");
            var dohomeworkname = $(".dohomeworkname");
            var previewSubmitFlag = data.retData.resPaperUser.previewSubmitFlag;
            var basicSubmitFlag = data.retData.resPaperUser.basicSubmitFlag;

            for(var i = 0 ; i < data.retData.previewInfo.questionList.length ; i++){
                var loginId = data.retData.loginId;
                var Dtrue = data.retData.previewInfo.questionList[i];
                for(var M in Dtrue){
                    if(!Dtrue[M]){
                        Dtrue[M] = "";
                    }
                }
                var optionA = Dtrue.optionA;
                var optionB = Dtrue.optionB;
                var optionC = Dtrue.optionC;
                var optionD = Dtrue.optionD;
                var questionType = Dtrue.questionType;
                var testTitle = data.retData.previewInfo.testTitle;
                var answer = Dtrue.answer;
                var userAnswer = Dtrue.paperUserAnswer.userAnswer;
                var id = Dtrue.id;
                DH_title.attr("loginId",loginId).text(testTitle);
                dohomeworkname.text(testTitle);
                test_knownsend.attr("loginId",loginId);
                var $quention = $("<div class='questionTitle' myanswer='"+userAnswer+"' Nu_m='"+(i+1)+"'  data_answer='"+answer+"' questionType='"+questionType+"' questionId='"+id+"' loginId='"+loginId+"'></div>");
                var $choose = $("<div class='video_choose'></div>").appendTo($quention);
                var $optionA = $("<div class='optionchoose video_optionA' data-option='A'>"+optionA+"</div>").appendTo($choose);
                var $optionB = $("<div class='optionchoose video_optionB' data-option='B'>"+optionB+"</div>").appendTo($choose);
                var $optionC = $("<div class='optionchoose video_optionC' data-option='C'>"+optionC+"</div>").appendTo($choose);
                var $optionD = $("<div class='optionchoose video_optionD' data-option='D'>"+optionD+"</div>").appendTo($choose);
                DH_strongeoption.append($quention);
                questionNum++;
                for(var j = 0 ; j < Dtrue.list.length; j++){
                    var lDtrue = Dtrue.list[j];
                    var questionType = lDtrue.questionType;
                    var content = lDtrue.content.replace("【题干】",(questionNum)+"、");
                    if(questionType == "01"){
                        $content = $("<div class='video_content'>"+content+"<span class='questionanswer'></span><span class='quetion_imge'></span></div>").insertBefore($optionA)
                    }
                }
            }
            DH_strongeoption.append($('<div class="DH_send">提交</div>'));
            //題目
            var DH_ti = $(".DH_ti");
            for(var i = 0 ; i < data.retData.previewInfo.questionList.length ; i++){
                var $DH_num = $("<span class='DH_num' Nu_m = '"+(i+1)+"'>"+(i+1)+"</span>").appendTo(DH_ti);
            }
            //变色
            var eachChoose = $(".optionchoose");
            eachChoose.each(function(){
                var myanswer = $(this).closest(".questionTitle").attr("myanswer");
                var Nu_m = $(this).closest(".questionTitle").attr("Nu_m");
                var userAnswerlength = myanswer.length;
                if(userAnswerlength > 1){
                    for(var i = 0 ; i < userAnswerlength ; i++){
                        var userAnswerknwon = myanswer[i]
                        if($(this).attr("data-option") === userAnswerknwon){
                            $(this).addClass("addcolor").css({color:"#49b9df"})
                        }
                    }
                }else{
                    if(myanswer === $(this).attr("data-option")){
                        $(this).css({color:"#49b9df"});
                        $(".DH_num[Nu_m='"+Nu_m+"']").css({"border":"1px solid #49b9df","color":"#49b9df"});//题目变色
                    }
                }
            })
            //if($(".DH_strongeoption").height() >= $(".DH_titleoption").height()){
            //    $(".DH_titleoption").height($(".DH_strongeoption").height());
            //}
            _this.getCss();//获取样式
            _this.clickSeend()//提交
            _this.Aboutshark()//遮罩层
            if(previewSubmitFlag == "1"){
                $(".DH_send").hide()
                $(".optionchoose").unbind("click");
            }else{
                _this.choiceAnswer()//单选
                _this.lostchoiceAnswer()//多选
            }
	        intMathJax();
        },
        choiceAnswer:function(data){//单选题
            var id = JSON.parse(sessionStorage.getItem("sub"));
            var _this = this;
            $(".questionTitle[questionType='05'],.questionTitle[questionType='01'],.questionTitle[questionType='10'],.questionTitle[questionType='34']").find(".optionchoose").on("click",function(){
                var answer = $(this).attr("data-option");
                var questionid = $(this).closest(".questionTitle").attr("questionid");
                var loginId = $(this).closest(".questionTitle").attr("loginId");
                var recordId = id.id;
                var parmas = {};
                //var userAnswers = {};
                //userAnswers.userAnswer = answer;
                //userAnswers.questionid = questionid;
                parmas.userAnswer = answer;
                parmas.questionId = questionid;
                parmas.type = 0;
                parmas.loginId = loginId;
                parmas.recordId = recordId;
                _this.Ajax(parmas);
                var data_answer = $(this).closest(".questionTitle").attr("data_answer");
                $(this).closest(".questionTitle").attr("myanswer",answer);
                $(this).closest(".questionTitle").find(".questionanswer").text(answer);
                $(this).css({"color":"#49b9df"}).siblings(".optionchoose").css({"color":"#333"});
                //题号变化
                var Nu_m = $(this).closest(".questionTitle").attr("Nu_m");
                $(".DH_num[Nu_m='"+Nu_m+"']").css({"border":"1px solid #49b9df","color":"#49b9df"})
                //    判断是否正确
                if(data_answer == answer){
                    $(this).closest(".questionTitle").find(".quetion_imge").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/right.png'>")
                }else{
                    $(this).closest(".questionTitle").find(".quetion_imge").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/wrong.png'>")
                }
            });
        },
        lostchoiceAnswer : function(data){//多选题
            var id = JSON.parse(sessionStorage.getItem("sub"));
            var _this = this;
            $(".questionTitle[questiontypeid='09']").find(".choose").on("click",function(){
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
                var questionid = $(this).closest(".questionTitle").attr("questionid");
                var loginId = $(this).closest(".questionTitle").attr("loginId");
                var recordId = id.id;
                var parmas = {};
                //var userAnswer = {};
                //userAnswer.userAnswer = answer;
                //userAnswer.questionId = questionid;
                parmas.userAnswer = answer;
                parmas.questionId = questionid;
                parmas.type = 0;
                parmas.loginId = loginId;
                parmas.recordId = recordId;
                _this.Ajax(parmas)
                var data_answer = $(this).closest(".questionTitle").attr("data_answer");
                $(this).closest(".questionTitle").attr("myanswer",answer);
                $(this).closest(".questionTitle").find(".questionanswer").text(answer);
                $(this).css({"color":"#49b9df"});
                //题号变化
                var Nu_m = $(this).closest(".questionTitle").attr("Nu_m");
                $(".DH_num[Nu_m='"+Nu_m+"']").css({"border":"1px solid #49b9df","color":"#49b9df"});
                //$(this).css({"color":"#49b9df"}).siblings(".optionchoose").css({"color":"#333"});
                //    判断是否正确
                if(data_answer == answer){
                    $(this).closest(".questionTitle").find(".quetion_imge").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/right.png'>")
                }else{
                    $(this).closest(".questionTitle").find(".quetion_imge").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/wrong.png'>")
                }
            });
        },
        Aboutshark : function(){
            var _this = this;
            $(".model_paper_delete_correr,.model_paper_false_correr").on("click",function(){
                $(".shark").hide();
            });
            $(".model_paper_success_correr").on("click",function(){
                _this.Upajax();
            })
        },
        clickSeend : function(){//判断是否提交
            var _this = this;
            var id = JSON.parse(sessionStorage.getItem("sub"));
            $(".DH_send").on("click",function(){
                var loginId = $(".DH_title").attr("loginId");
                var parmas = {};
                parmas.id = id.id;
                parmas.type = 2;
                parmas.loginId = loginId;
                $.ajax({
                    type : "post",
                    url : "/web/student/homework/write/getSubmitFlag",
                    data : parmas,
                    dataType : "json",
                    success : function(data){
                        if(data.retData == false){
                            $(".shark").show();
                        }else{
                            _this.Upajax();
                        }
                    },
                    error : function(e){
                        console.log(e)
                    }
                })
            })
        },
        Upajax : function(){//提交
            var id = JSON.parse(sessionStorage.getItem("sub"));
            var type = JSON.parse(sessionStorage.getItem("type"));
            var loginId = $(".DH_title").attr("loginid");
            var testType = "2";
            //var useTime = Hms;
            var type = type;
            var parmas = {};
            parmas.id = id.id;
            parmas.type = id.type;
            parmas.useTime = "0";
            parmas.testType = testType;
            parmas.loginId = loginId;
            $.ajax({
                type : "post",
                url : "/web/student/homework/write/updateHomeWorkState",
                data : parmas,
                dataType : "json",
                success : function(data){
                    if(data.retCode == "0000"){
                        $('#c_ErrorMsg').html('提交成功!').fadeIn(200);  Disappear("#c_ErrorMsg");
                        $(".shark").hide();
                        $(".optionchoose").unbind("click");
                        window.location.href = "DH_Preview.html";
                    }else{
                        $(".shark").hide();
                        $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        Ajax : function(parmas){//选择提交答案
            $.ajax({
                type : "post",
                url : "/web/student/homework/write/updateUserAnswer",
                data : parmas,
                dataType : "json",
                success : function(data){
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        testTime : function(){
            var start = new Date();//开始时间
            var testTime = JSON.parse(sessionStorage.getItem("testTime"));
            if(testTime){
                var start = parseInt(new Date().getTime()-(testTime*1000));
            }else{
                var start = start.getTime();
            }
            function timer(){
                var now = new Date();
                ts = now.getTime() - start;
                var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
                var mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
                var ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数
                hh = checkTime(hh);
                mm = checkTime(mm);
                ss = checkTime(ss);
                document.getElementById("s_paper_hour").innerHTML = hh;
                document.getElementById("s_paper_min").innerHTML = mm;
                document.getElementById("s_paper_second").innerHTML = ss;
            }
            function checkTime(i){
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }
            t = setInterval(timer,1000);
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
        }
    }
    Preview.init();
});
