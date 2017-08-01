/**
 * Created by lichao on 2017/2/10.
 */
$(document).ready(function(){
    var English = {
        init : function(){
            var str=window.navigator.userAgent.toLowerCase();
            console.log(str)
            this.Browser();
            this.getCss();
            this.Change();
            this.Students();
        },
        Browser : function(){
            var _this = this;
            var sub = JSON.parse(sessionStorage.getItem("sub"));
            var parmas = {};
            parmas.id = Request.id;
            //parmas.loginInfo = Browserword;
            _this.getPaper(parmas);
        },
        getPaper : function(parmas){
            var _this = this;
            var Num=0;
            $.ajax({
                type : "post",
                url : "/web/student/homework/report/getUserPaperReport",
                data : parmas,
                dataType : "json",
                success : function(data){
                    console.log(data)
                    var task_tiltename = $(".task_tiltename");
                    var task_usedtime = $(".task_usedtime");
                    var task_fen = $(".task_fen");
                    var task_strogepaper = $(".task_strogepaper");
                    var task_time = $(".task_time");
                    var s_paper_hour = $(".s_paper_hour");
                    var s_paper_min = $(".s_paper_min");
                    var s_paper_second = $(".s_paper_second");
                    var task_details = $(".task_details ");
                    var dohomeworkname = $(".dohomeworkname ");
                    if(data.retCode == "0000"){
                        _this.getTopic(data);
                        var type = data.retData.type;
                        var substrtype = type.substr(0,1);
                        if(substrtype == 1){
                            task_fen.hide();
                        }else if(substrtype == 2){
                            task_details.text("测试详情");
                        }
                        var id = data.retData.resPaperUser.id;
                        $(".task_tiltename").attr("id",id);
                        var paperName = data.retData.paper.paperName;
                        var testTime = data.retData.resPaperUser.testTime;
                        var score = data.retData.paper.score;
                        var loginId = data.retData.loginId;
                        task_tiltename.text(paperName);
                        dohomeworkname.text(paperName);
                        task_usedtime.text("建议用时："+testTime+"分钟");
                        task_fen.text("总分："+score+"分");
                        //试卷获取
                        for(var i = 0; i < data.retData.paper.questionLines.length; i++){
                            var Dtrue = data.retData.paper.questionLines[i];
                            var lineName = Dtrue.lineName;
                            var scoreDef = Dtrue.scoreDef;
                            if(scoreDef == null){
                                scoreDef = "";
                            }
                            var questionType = Dtrue.questionType;
                            var $groung = $("<div class='groung' questionType='"+questionType+"'></div>");
                            var $grounglines = $("<div class='lineName'>"+lineName+""+scoreDef+"</div>").appendTo($groung);
                            var $question = $("<div class='question'></div>").appendTo($groung);
                            for(var j = 0; j < Dtrue.questionGroup.length;j++){
                                var groupCodecontent = Dtrue.questionGroup[j].content;
                                var groupCode = Dtrue.questionGroup[j].groupCode;
                                var isSplite = Dtrue.questionGroup[j].isSplite;
                                var ClnOrder = Dtrue.questionGroup[j].lnOrder;
                                var questionTypeId = Dtrue.questionGroup[j].questionTypeId;
                                var $questiongrounp = $("<div class='questiongrounp ' isSplite = '"+isSplite+"' questionTypeId='"+questionTypeId+"'></div>").appendTo($question);
                                if(groupCode && isSplite == "0"){//题号不可拆分
                                    Num++;
                                    var $content = $("<div class='content'>"+Num+"、"+groupCodecontent+"</div>").appendTo($questiongrounp);
                                    var num1 = 0;
                                    for(var k = 0; k < Dtrue.questionGroup[j].questions.length;k++){
                                        var qDtrue = Dtrue.questionGroup[j].questions[k];
                                        for(var M in qDtrue){
                                            if(!qDtrue[M]){
                                                qDtrue[M] = ""
                                            }
                                        }
                                        var lnOrder = qDtrue.lnOrder;
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
                                        var $questionTitle = $("<div class='questionTitle' Num='"+Num+"' myanswer='"+userAnswer+"'  data_answer='"+answer+"' selectable='"+selectable+"' loginId='"+loginId+"' questionId='"+questionId+"' questionTypeId='"+questionTypeId+"'></div>").appendTo($questiongrounp);
                                        var $conts = $("<div class='contTitle'>"+questionTitle+"<span class='questionanswer'></span></div>").appendTo($questionTitle);
                                        var $img = $("<span class='quetion_imge'></span>").appendTo($conts);
                                        if(optionA){
                                            var $choose = $("<div class='choose'></div>").appendTo($questionTitle);
                                            if(optionA.indexOf('oneline') != -1){
                                                var $optionchooseA = $("<span class='optionchoose p1' option='A'>"+optionA+"</span>").appendTo($choose);
                                                var $optionchooseB = $("<span class='optionchoose p1' option='B'>"+optionB+"</span>").appendTo($choose);
                                                var $optionchooseC = $("<span class='optionchoose p1' option='C'>"+optionC+"</span>").appendTo($choose);
                                                var $optionchooseD = $("<span class='optionchoose p1' option='D'>"+optionD+"</span>").appendTo($choose);
                                            }else if(optionA.indexOf('twoline') != -1){
                                                var $optionchooseA = $("<span class='optionchoose p1' option='A'>"+optionA+"</span>").appendTo($choose);
                                                var $optionchooseB = $("<span class='optionchoose p1' option='B'>"+optionB+"</span>").appendTo($choose);
                                                var $optionchooseC = $("<span class='optionchoose p1' option='C'>"+optionC+"</span>").appendTo($choose);
                                                var $optionchooseD = $("<span class='optionchoose p1' option='D'>"+optionD+"</span>").appendTo($choose);
                                            }else{
                                                var $optionchooseA = $("<div class='optionchoose p1' option='A'>"+optionA+"</div>").appendTo($choose);
                                                var $optionchooseB = $("<div class='optionchoose p1' option='B'>"+optionB+"</div>").appendTo($choose);
                                                var $optionchooseC = $("<div class='optionchoose p1' option='C'>"+optionC+"</div>").appendTo($choose);
                                                var $optionchooseD = $("<div class='optionchoose p1' option='D'>"+optionD+"</div>").appendTo($choose);
                                            }
                                        }
                                        var $answer = $("<div class='answer'></div>").appendTo($questionTitle);
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
                                        //    答案区域
                                        var needExplain = qDtrue.paperUserAnswer.needExplain;
                                        var result = qDtrue.paperUserAnswer.result;
                                        var userAnswer = qDtrue.paperUserAnswer.userAnswer;
                                        if(result=="0"){
                                            var $rightwrong = $("<img class='wr_img' style='position: absolute;top: 0px;right: 20px' src='../../../static/image/prepare/right.png'>").appendTo($img);
                                        }else if(result=="2"){
                                            var $rightwrong = $("<img class='wr_img' style='position: absolute;top: 0px;right: 20px' src='../../../static/image/prepare/s_wrong_right.png'>").appendTo($img);
                                        }else if(result == null){
                                            var $noNeedspeak = $("<div class='noSpeek'></div>").appendTo($img);
                                        }else{
                                            var $rightwrong = $("<img class='wr_img' style='position: absolute;top: 0px;right: 20px' src='../../../static/image/prepare/wrong.png'>").appendTo($img);
                                        }
                                        num1++;
                                    }
                                    //組合體
                                    for(var  m= 0; m < Dtrue.questionGroup[j].labels.length;m++){
                                        var lDtrue = Dtrue.questionGroup[j].labels[m];
                                        var content = lDtrue.content;
                                        var questionType = lDtrue.questionType;
                                        if(questionType == "03" ){
                                            var $analysisanswer = $("<div class='analysis speek'>"+content+"</div>").appendTo($answer);
                                        }
                                        if(questionType == "05"){
                                            var $analysis = $("<div class='analysis'>"+content+"</div>").appendTo($answer);
                                        }
                                        //    答案区域
                                        var needExplain = qDtrue.paperUserAnswer.needExplain;
                                        var result = qDtrue.paperUserAnswer.result;
                                        var userAnswer = qDtrue.paperUserAnswer.userAnswer;
                                        if(result=="0"){
                                            var $rightwrong = $("<img class='wr_img' style='position: absolute;top: 0px;right: 20px' src='../../../static/image/prepare/right.png'>").appendTo($img);
                                        }else if(result=="2"){
                                            var $rightwrong = $("<img class='wr_img' style='position: absolute;top: 0px;right: 20px' src='../../../static/image/prepare/s_wrong_right.png'>").appendTo($img);
                                        }else if(result == null){
                                            var $noNeedspeak = $("<div class='noSpeek'></div>").appendTo($img);
                                        }else{
                                            var $rightwrong = $("<img class='wr_img' style='position: absolute;top: 0px;right: 20px' src='../../../static/image/prepare/wrong.png'>").appendTo($img);
                                        }
                                        if(needExplain==false){
                                            //需要讲
                                            if($analysisanswer.find(".Needspeak").length == 0 && $analysisanswer.find(".hasNeedspeak").length == 0){
                                                var $Needspeak = $("<div class='Needspeak'>需要讲</div>").appendTo($analysisanswer);
                                            }
                                        }else{
                                            if($analysisanswer.find(".Needspeak").length == 0 && $analysisanswer.find(".hasNeedspeak").length == 0){
                                                var $hasNeedspeak = $("<div class='hasNeedspeak'>已提问</div>").appendTo($analysisanswer);
                                            }
                                        }
                                    }

                                }else if(groupCode && isSplite == "1"){//组合题可拆分
                                    var $content = $("<div class='content'>"+groupCodecontent+"</div>").appendTo($questiongrounp);
                                    for(var k = 0; k < Dtrue.questionGroup[j].questions.length;k++){
                                        Num++;
                                        var qDtrue = Dtrue.questionGroup[j].questions[k];
                                        for(var M in qDtrue){
                                            if(!qDtrue[M]){
                                                qDtrue[M] = ""
                                            }
                                        }
                                        var lnOrder = qDtrue.lnOrder;
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
                                        var $questionTitle = $("<div class='questionTitle' Num='"+Num+"' myanswer='"+userAnswer+"'  data_answer='"+answer+"' selectable='"+selectable+"' loginId='"+loginId+"' questionId='"+questionId+"' questionTypeId='"+questionTypeId+"'></div>").appendTo($questiongrounp);
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
                                        //    答案区域
                                        var needExplain = qDtrue.paperUserAnswer.needExplain;
                                        var result = qDtrue.paperUserAnswer.result;
                                        var userAnswer = qDtrue.paperUserAnswer.userAnswer;
                                        if(result=="0"){
                                            var $rightwrong = $("<img class='wr_img' style='position: absolute;top: 0px;right: 20px' src='../../../static/image/prepare/right.png'>").appendTo($img);
                                        }else if(result == null){
                                            var $noNeedspeak = $("<div class='noSpeek'></div>").appendTo($img);
                                        }else if(result=="2"){
                                            var $rightwrong = $("<img class='wr_img' style='position: absolute;top: 0px;right: 20px' src='../../../static/image/prepare/s_wrong_right.png'>").appendTo($img);
                                        }else{
                                            var $rightwrong = $("<img class='wr_img' style='position: absolute;top: 0px;right: 20px' src='../../../static/image/prepare/wrong.png'>").appendTo($img);
                                        }
                                        if(needExplain==false){
                                            //需要讲
                                            if($analysisanswer.find(".Needspeak").length == 0 && $analysisanswer.find(".hasNeedspeak").length == 0){
                                                var $Needspeak = $("<div class='Needspeak'>需要讲</div>").appendTo($analysisanswer);
                                            }
                                        }else{
                                            if($analysisanswer.find(".Needspeak").length == 0 && $analysisanswer.find(".hasNeedspeak").length == 0){
                                                var $hasNeedspeak = $("<div class='hasNeedspeak'>已提问</div>").appendTo($analysisanswer);
                                            }
                                        }
                                    }
                                }else{
                                    Num++;
                                    for(var k = 0; k < Dtrue.questionGroup[j].questions.length;k++){//普通题
                                        var qDtrue = Dtrue.questionGroup[j].questions[k];
                                        for(var M in qDtrue){
                                            if(!qDtrue[M]){
                                                qDtrue[M] = ""
                                            }
                                        }
                                        var lnOrder = qDtrue.lnOrder;
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
                                        var $questionTitle = $("<div class='questionTitle' Num='"+Num+"' myanswer='"+userAnswer+"'  data_answer='"+answer+"' selectable='"+selectable+"' loginId='"+loginId+"' questionId='"+questionId+"' questionTypeId='"+questionTypeId+"'></div>").appendTo($questiongrounp);
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
                                        //    答案区域
                                        var needExplain = qDtrue.paperUserAnswer.needExplain;
                                        var result = qDtrue.paperUserAnswer.result;
                                        var userAnswer = qDtrue.paperUserAnswer.userAnswer;
                                        if(result=="0"){
                                            var $rightwrong = $("<img class='wr_img' style='position: absolute;top: 0px;right: 20px' src='../../../static/image/prepare/right.png'>").appendTo($img);
                                        }else if(result=="2"){
                                            var $rightwrong = $("<img class='wr_img' style='position: absolute;top: 0px;right: 20px' src='../../../static/image/prepare/s_wrong_right.png'>").appendTo($img);
                                        }else if(result == null){
                                            var $noNeedspeak = $("<div class='noSpeek'></div>").appendTo($img);
                                        }else{
                                            var $rightwrong = $("<img class='wr_img' style='position: absolute;top: 0px;right: 20px' src='../../../static/image/prepare/wrong.png'>").appendTo($img);
                                        }
                                        if(needExplain==false){
                                            //需要讲
                                            if($analysisanswer.find(".Needspeak").length == 0 && $analysisanswer.find(".hasNeedspeak").length == 0){
                                                var $Needspeak = $("<div class='Needspeak'>需要讲</div>").appendTo($analysisanswer);
                                            }
                                        }else{
                                            if($analysisanswer.find(".Needspeak").length == 0 && $analysisanswer.find(".hasNeedspeak").length == 0){
                                                var $hasNeedspeak = $("<div class='hasNeedspeak'>已提问</div>").appendTo($analysisanswer);
                                            }
                                        }
                                    }
                                }
                            }
                            task_strogepaper.append($groung);
                        }
                        //補償訓練
                        if(substrtype == 1){
                            $(".wtraining").hide();
                        }
                        $(".groung[questiontype = '12']").find(".optionchoose").css({"width":"23%","height":"32px","display":"inline-block"});
                        $(".questiongrounp[questionTypeId = '12']").find(".optionchoose").css({"width":"23%","height":"32px","display":"inline-block"});
                        var status = data.retData.resPaperUser.status;
                        //没有批和已批改的报告区别  对错号区别
                        if(status == 4){
                            $(".task_click").hide();
                            $(".questionTitle[selectable='0']").find(".wr_img").hide();
                            if(!$(".questionTitle[selectable='0']").find(".quetion_imge").text()){
                                var $Needspeak = $("<div class='noSpeek'></div>").appendTo($(".questionTitle[selectable='0']").find(".quetion_imge"));
                            }
                            //$(".questionTitle[selectable='0']").find(".answer").find(".Needspeak").hide();
                        }else{
                        }
                        var useTime = data.retData.resPaperUser.useTime;

                        //变色
                        var eachChoose = $(".optionchoose");
                        eachChoose.each(function(){
                            var myanswer = $(this).closest(".questionTitle").attr("myanswer");
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
                        //调用函数
                        //保持高度一样
                        var Jheight = $(".task_strogepaper").height();
                        var Zheight = $(".task_bc").height();
                        var Theight = $(".task_strogetitle").height();
                        if(Jheight>=Zheight && Jheight>=Theight){
                            $(".task_bc").height(Jheight)
                            $(".task_bc").height(Jheight)
                        }
                        _this.Class();//班級目標
                        _this.Need();//需要講
                        _this.areaImge(data);//图片区域
                        _this.time(useTime);//时间
                        _this.Attention();//时间
                        _this.scroll();//滑动
                    }else{
                        $(".task_paper").hide();
                        $(".nothing").show();
                        //$('#c_ErrorMsg').html('亲，暂时没有数据哦!').fadeIn(200);  Disappear("#c_ErrorMsg");
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        getTopic : function(data){//获取题号
            if(data.retCode == "0000"){
                //试卷获取题目
                var task_seetitle = $(".task_seetitle");
                var Num = 0 ;
                for(var i = 0; i < data.retData.paper.questionLines.length; i++){
                    var Dtrue = data.retData.paper.questionLines[i];
                    var lineName = Dtrue.lineName;
                    var $topic = $("<div class='topic'></div>");
                    var $p = $("<p class='task_tiname'>"+lineName+"</p>").appendTo($topic);
                    var $pN = $("<div class='pN'></div>").appendTo($topic);
                    for(var j = 0 ; j < Dtrue.questionGroup.length ; j++){
                        var qDtrue = Dtrue.questionGroup[j];
                        var groupCode = qDtrue.groupCode;
                        var isSplite = qDtrue.isSplite;
                        var content = qDtrue.content;
                        if(groupCode && isSplite == "0"){//题号不可拆分
                            Num++;
                            var num1 = 0;
                            for(var k = 0 ; k < qDtrue.questions.length ; k++){
                                var $pNnum = $("<span class='task_ti' Num='"+Num+"' >"+Num+"("+(num1+1)+")</span>").appendTo($pN);
                                var result = qDtrue.questions[k].paperUserAnswer.result;
                                if(result=="0"){
                                    var $result = $("<span class='result' result='"+result+"'></span>").appendTo($pNnum);
                                }else if(result == "2"){
                                    var $result = $("<span class='result' result='"+result+"'></span>").appendTo($pNnum);
                                }else if(result == null){
                                    var $result = $("<span class='result' result='"+result+"'></span>").appendTo($pNnum);
                                }else{
                                    var $result = $("<span class='result' result='"+result+"'></span>").appendTo($pNnum);
                                }
                                num1++;
                            }
                        }else if(groupCode && isSplite == "1"){//组合题可拆分
                            for(var k = 0 ; k < qDtrue.questions.length ; k++){
                                Num++;
                                var $pNnum = $("<span class='task_ti' Num='"+Num+"' >"+Num+"</span>").appendTo($pN);
                                var result = qDtrue.questions[k].paperUserAnswer.result;
                                if(result=="0"){
                                    var $result = $("<span class='result' result='"+result+"'></span>").appendTo($pNnum);
                                }else if(result == "2"){
                                    var $result = $("<span class='result' result='"+result+"'></span>").appendTo($pNnum);
                                }else if(result == null){
                                    var $result = $("<span class='result' result='"+result+"'></span>").appendTo($pNnum);
                                }else{
                                    var $result = $("<span class='result' result='"+result+"'></span>").appendTo($pNnum);
                                }
                            }
                        }else{
                            Num++;
                            for(var k = 0 ; k < qDtrue.questions.length ; k++){//普通题
                                var $pNnum = $("<span class='task_ti' Num='"+Num+"' >"+Num+"</span>").appendTo($pN);
                                var result = qDtrue.questions[k].paperUserAnswer.result;
                                if(result=="0"){
                                    var $result = $("<span class='result' result='"+result+"'></span>").appendTo($pNnum);
                                }else if(result == "2"){
                                    var $result = $("<span class='result' result='"+result+"'></span>").appendTo($pNnum);
                                }else if(result == null){
                                    var $result = $("<span class='result' result='"+result+"'></span>").appendTo($pNnum);
                                }else{
                                    var $result = $("<span class='result' result='"+result+"'></span>").appendTo($pNnum);
                                }
                            }
                        }
                    }
                    task_seetitle.append($topic);
                }

                //题目判断对错
                var task_ti = $(".task_ti")
                task_ti.each(function(){
                    var result = $(this).find(".result").attr("result");
                    if(result=="0"){
                        $(this).css({"border":"1px solid #91d29c","color":"#91d29c"})
                    }else if(result == "2"){
                        $(this).css({"border":"1px solid #faa249","color":"#fde5cd"});
                    }else if(result == "null"){
                        $(this).css({"border":"1px solid #ccc","color":"#ccc"});
                    }else{
                        $(this).css({"border":"1px solid #d12929","background":"f6d2d2","color":"#d12929"});
                    }
                });
                //对应效果
                $(".task_ti").on("click",function(){
                    var Num = $(this).attr("Num");
                    var questionTitleTop = $(".questionTitle[Num='"+Num+"']").offset().top;
                    $("body").animate({"scrollTop":questionTitleTop},1000);
                    document.documentElement.scrollTop = questionTitleTop;
                });
            }
        },
        Students : function(){//学情分析
            var _this = this;
            var wsubbg = $(".wsubbg");
            var wprogess = $(".wprogess").clone(true);
            var sub = JSON.parse(sessionStorage.getItem("sub"));
            wsubbg.html("");
            var parmas = {};
            parmas.id = sub.id;
            $.ajax({
                type : "post",
                url : "/web/student/homework/report/studentAnalysis",
                data : parmas,
                dataType : "json",
                success : function(data){
                    console.log(data)
                    if(data.retCode == "0000"){
                        var wtrainingword = $(".wtrainingword");
                        var wsubstraningclickmoney = $(".wsubstraningclickmoney");
                        var wsubstraningclick = $(".wsubstraningclick");
                        var knowledgeDesc = data.retData.knowledgeDesc;
                        var status = data.retData.status;
                        if(status == "0"){
                            wsubstraningclickmoney.attr("status",status).text("5金币");
                        }else if( status == "1" || status == "2" ||status == "3"){
                            wsubstraningclickmoney.attr("status",status).text("已购买");
                        }else if( status == "-1"){
                            wsubstraningclick.hide();
                        }
                        if(knowledgeDesc){
                            wtrainingword.text(knowledgeDesc);//补偿训练
                        }else{
                            wtrainingword.text("暂无知识点");//补偿训练
                        }
                        for(var i = 0 ; i < data.retData.list.length ; i++){
                            var newclone = wprogess.clone(true);
                            var Dtrue = data.retData.list[i];
                            var correctRate = Dtrue.correctRate;
                            var knowledgeName = Dtrue.knowledgeName;
                            var promptText = Dtrue.promptText;
                            var subjectId = Dtrue.subjectId;
                            newclone.find(".wtipic").text(promptText);
                            newclone.find(".wprogerssname").attr("title",correctRate+"%").css({"width":correctRate+"%"});
                            newclone.find(".wKnowledge").attr("title",knowledgeName).text(knowledgeName);
                            for(var j = 0 ; j < Dtrue.numCorrectSet.length; j++){
                                var nDtrue = Dtrue.numCorrectSet[j];
                                var number = nDtrue.number;
                                var result = nDtrue.result;
                                if(result == "1"){
                                    $("<span class=wknowglename style = 'color:#ca0d0d'>"+number+"题、</span>").appendTo(newclone.find(".wknowngle"));
                                }else if(result == "2"){
                                    $("<span class=wknowglename style = 'color:#faa249'>"+number+"题、</span>").appendTo(newclone.find(".wknowngle"));
                                }else{
                                    $("<span class=wknowglename >"+number+"题、</span>").appendTo(newclone.find(".wknowngle"));
                                }
                            }
                            wsubbg.append(newclone);
                        }
                        $(".wknowngle").css({"position": "absolute","top":"-20px","left":"0","font-size":"12px"});
                        $(".task_tiltename").attr("subjectId",subjectId);
                        _this.Compensation();//补偿训练
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        Compensation : function (){//补偿训练
            $(".wsubstraningclickword").on("click",function(){
                var status = $(this).siblings(".wsubstraningclickmoney").attr("status");
                var parmasC = {};
                parmasC.id = $(".task_tiltename").attr("id");
                parmasC.subjectId = $(".task_tiltename").attr("subjectId");
                parmasC.type = "0";
                sessionStorage.setItem("parmasC",JSON.stringify(parmasC));
                if(status == "3" || status == "2"){
                    window.open("trainingDetails.html");
                    return false;
                }
                if(status == "1"){
                    window.open("training.html");
                    return false;
                }
                if(status == "0"){
                    $.ajax({
                        type : "post",
                        url : "/web/user/finance",
                        dataType : "json",
                        success : function(data){
                            console.log(data);
                            if(data.retCode == "0000"){
                                var usable = data.retData.usable;
                                if(!usable){
                                    $('#c_ErrorMsg').html('少年，金币不足!').fadeIn(200);  Disappear("#c_ErrorMsg");
                                    return false;
                                }
                                if(usable >= 5){
                                    var parmasC = {};
                                    parmasC.id = $(".task_tiltename").attr("id");
                                    parmasC.subjectId = $(".task_tiltename").attr("subjectId");
                                    parmasC.type = "0";
                                    sessionStorage.setItem("parmasC",JSON.stringify(parmasC));
                                    //$('#c_ErrorMsg').html('-5金币!').fadeIn(200);  Disappear("#c_ErrorMsg");//拿到补偿训练页面
                                    window.open("training.html");
                                }else{
                                    $('#c_ErrorMsg').html('少年，金币不足!').fadeIn(200);  Disappear("#c_ErrorMsg");
                                }
                            }
                        },
                        error : function(e){
                            console.log(e)
                        }
                    })
                }
            })
        },
        areaImge : function(data){
            var $areaImge = $("<div class='areaImge'></div>").appendTo(".task_strogepaper");
            var $teacher = $("<div class='teacherTalk'></div>").appendTo(".task_strogepaper");
            var $areaT = $("<div class='areaT'>主观题部分答案 ：</div>").appendTo($areaImge);
            var answersFileIds = data.retData.resPaperUser.answersFileIds;
            var totalRemarks = data.retData.resPaperUser.totalRemarks;
            if(totalRemarks){
                var $talk = $("<div class='talk'><span class='talkword'>教师批注 :</span> "+totalRemarks+"</div>").appendTo($teacher);
            }else{
                var $talk = $("<div class='talk'><span class='talkword'>教师批注 :</span> 暂无批注</div>").appendTo($teacher);
            }
            if(answersFileIds == null){

            }else{
                for(var i = 0 ; i < data.retData.resPaperUser.answersFileIds.length ; i++){
                    var Dtrue = data.retData.resPaperUser.answersFileIds[i];
                    var fileId = Dtrue.fileId;
                    var mDtrue = data.retData.resPaperUser.paperUserMarks;
                    var order = Dtrue.order;
                    var url = Dtrue.url;
                    var $area = $("<div class='areatipic'></div>").appendTo($areaImge);
                    var $tipic = $("<div class='tipic'></div>").appendTo($area);
                    var $img = $("<img class='areaimg' order='"+order+"' fileId='"+fileId+"' src='"+url+"' />").appendTo($tipic);
                    if(mDtrue != null || mDtrue.length != 0){
                        for(var j = 0 ; j < mDtrue.length ;j++){
                            var id = mDtrue[j].id;
                            var mark_time = mDtrue[j].mark_time;
                            var imgPosition = mDtrue[j].imgPosition;
                            if(fileId == imgPosition){
                                var $imgMarks = $("<img class='areatipc' mark_time='"+mark_time+"' imgPosition='"+imgPosition+"' src='"+id+"' />").appendTo($tipic);
                            }
                        }
                    }
                }
            }
        },
        Attention : function(){
            $.ajax({
                type : "post",
                url : "/web/common/pcSysAlert",
                data : {code:"stu_web_dohomework"},
                success : function(data){
                    console.log(data)
                    str=data.retData;
                    str=str.replace(/\&lt;/g,'<')
                    str=str.replace(/\&gt;/g,'>')
                    str=str.replace(/\&quot;/g,'"')
                    str=str.replace(/\&amp;quot;/g,'"')
                    str=str.replace(/\&amp;nbsp;/g, "");
                    str=str.replace(/\&amp;#39;/g,"'");
                    var $p = $("<p>"+str+"</p>").appendTo(".task_attention");
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        time : function(time){
            var hh = parseInt(time / 60 / 60 % 24, 10);//计算剩余的小时数
            var mm = parseInt(time / 60 % 60, 10);//计算剩余的分钟数
            var ss = parseInt(time % 60, 10);//计算剩余的秒数
            $("#s_paper_hour,#s_paper_min,#s_paper_second")
            if(hh >= 10){
                $("#s_paper_hour").text(hh);
            }else{
                $("#s_paper_hour").text("0"+hh);
            }
            if(mm >= 10){
                $("#s_paper_min").text(mm);
            }else{
                $("#s_paper_min").text("0"+mm);
            }
            if(ss >= 10){
                $("#s_paper_second").text(ss);
            }else{
                $("#s_paper_second").text("0"+ss);
            }
        },
        Need : function(){
            $(".Needspeak").on("click",function(){
                var _this = $(this);
                var sub = JSON.parse(sessionStorage.getItem("sub"));
                var parmas = {};
                parmas.id = sub.id;
                parmas.questionId = $(this).closest(".questionTitle").attr("questionid");
                $.ajax({
                    type : "post",
                    url : "/web/student/homework/report/changeNeedExplain",
                    data :　parmas,
                    dataType : "json",
                    success : function(data){
                        console.log(data)
                        if(data.retCode == "0000"){//
                            var needExplain = data.retData.needExplain;
                            if(needExplain == true ){
                                _this.addClass("hasNeedspeak").text("已提问").removeClass("Needspeak").unbind("click");
                            }
                        }
                    },
                    error : function(e){
                        console.log(e)
                    }
                })
            })
        },
        Change : function(){
            var task_details = $(".task_details");
            var task_strogepaper = $(".task_strogepaper");
            var task_studiesdetails = $(".task_studiesdetails");
            var task_studiesclassfiy = $(".task_studiesclassfiy");
            task_details.on("click",function(){
                if(!$(this).hasClass("addcoloor")){
                    $(this).addClass("addcoloor");
                    task_strogepaper.show();
                    task_studiesclassfiy.hide();
                    task_studiesdetails.removeClass("addcoloor");
                    task_studiesdetails.addClass("addnocoloor")
                }else{

                }
            })
            task_studiesdetails.on("click",function(){
                if(!$(this).hasClass("addcoloor")){
                    $(this).addClass("addcoloor");
                    task_studiesclassfiy.show();
                    task_strogepaper.hide();
                    task_details.removeClass("addcoloor");
                    task_details.addClass("addnocoloor")
                }else{

                }
            })

        },
        Class : function(){//班级目标
            var _this = this;
            var sub = JSON.parse(sessionStorage.getItem("sub"));
            var parmas = {};
            parmas.id = sub.id;
            var task_merateword = $(".task_merateword");
            $(".task_classtarget").on("click",function(){
                $.ajax({
                    type : "post",
                    url : "/web/student/homework/report/getUserPaperPKInfo",
                    data : parmas,
                    dataType : "json",
                    success : function(data){
                        console.log(data)
                        if(data.retCode == "0000"){
                            for(var M in data.retData){
                                if(data.retData[M] == null){
                                    data.retData[M] = "";
                                }
                            }
                            var type = data.retData.type;
                            var type = type.substr(0,1);
                            var headImg = data.retData.headImg;
                            var pkHeadImg = data.retData.pkHeadImg;
                            var isPkComplete = data.retData.isPkComplete;
                            var isComplete = data.retData.isComplete;
                            var result = data.retData.result;
                            var score = data.retData.score;
                            var totalScore = data.retData.totalScore;
                            var totalTime = data.retData.totalTime;
                            var userName = data.retData.userName;
                            var pkUserName = data.retData.pkUserName;
                            var pkScore = data.retData.pkScore;
                            var pkTotalScore = data.retData.pkTotalScore;
                            var pkTotalTime = data.retData.pkTotalTime;
                            if(type == "2"){
                                task_merateword.text("得分");
                            }
                            //班级目标显示
                            $(".task_shark").show();
                            //我的
                            var hh = parseInt(totalTime / 60 / 60 % 24, 10);//计算剩余的小时数
                            var mm = parseInt(totalTime / 60 % 60, 10);//计算剩余的分钟数
                            var ss = parseInt(totalTime % 60, 10);//计算剩余的秒数
                            if(headImg==""){
                            }else{
                                $(".task_me").css({"background":"url("+headImg+")","background-size":"cover"});
                            }
                            $(".task_mename").text(userName);
                            if(isComplete == "0" ){
                                $(".task_meimg").find(".task_nodo").show();
                                $(".task_merate,.task_metime").text("--");//未做的时候显示"--"
                            }else if(isComplete== "1"){//等待批改
                                $(".task_meimg").find(".task_wait_correct").show();
                                $(".task_merate").text("--");//未批的时候显示"--"
                                _this.hh(hh,mm,ss);//班级目标时间
                            }else if(isComplete == ""){
                                $(".task_merate,.task_metime").text("--");//未做的时候显示"--"
                            }else{
                                if(type == "1"){
                                    $(".task_merate").text(score+"/"+totalScore);
                                }else{
                                    $(".task_merate").text(score);
                                }
                                _this.hh(hh,mm,ss);//班级目标时间
                            }
                            //对手
                            var h = parseInt(pkTotalTime / 60 / 60 % 24, 10);//计算剩余的小时数
                            var m = parseInt(pkTotalTime / 60 % 60, 10);//计算剩余的分钟数
                            var s = parseInt(pkTotalTime % 60, 10);//计算剩余的秒数
                            if(pkHeadImg==""){//PK对手头像
                            }else{
                                $(".task_u").css({"background":"url("+pkHeadImg+")","background-size":"cover"});
                            }
                            if(pkUserName){
                                $(".task_uname").text(pkUserName);//PK对手名字
                            }else{
                                $(".task_uname").text("暂无目标");//PK对手名字
                            }
                            if(isPkComplete == "0"){
                                $(".task_uimg").find(".task_nodo").show();
                                $(".task_urate,.task_utime").text("--");//未做的时候显示"--"
                            }else if(isPkComplete == "1"){
                                $(".task_uimg").find(".task_wait_correct").show();
                                $(".task_urate").text("--");//未批的时候显示"--"
                                _this.h(h,m,s);
                            }else if(isPkComplete == ""){
                                $(".task_urate,.task_utime").text("--");//未做的时候显示"--"
                            }else{
                                if(type == "1"){
                                    $(".task_urate").text(pkScore+"/"+pkTotalScore);//PK对手正确率
                                }else{
                                    $(".task_urate").text(pkScore);//PK对手正确率
                                }
                                _this.h(h,m,s);
                            }
                            //    PK
                            if(isPkComplete=="2" && isComplete=="2"){
                                if(result == null || result == ""){
                                }else{
                                    var result = Number(result);
                                }
                                switch(result){
                                    case 0 : $(".task_meimg").find(".task_pk,.peom").show();break;
                                    case 1 : $(".task_uimg").find(".task_pk,.peom").show();break;
                                    case 2 : $(".task_uimg,.task_meimg").find(".task_blance").show();break;
                                }
                            }
                        }
                    },
                    error : function(e){
                        console.log(e)
                    }
                })
            })
            $(".task_delete").on("click",function(){
                $(".task_shark").fadeOut();
            })
        },
        hh : function(hh,mm,ss){//班级目标时间
            if(hh == null || hh == undefined){
                hh = 0;
            }
            if(mm == null || mm == undefined){
                mm = 0;
            }
            if(ss == null || ss == undefined){
                ss = 0;
            }
            //我
            if(hh >= 10){
                $("#task_metimehh").text(hh);
            }else{
                $("#task_metimehh").text("0"+hh);
            }
            if(mm >= 10){
                $("#task_metimemm").text(mm);
            }else{
                $("#task_metimemm").text("0"+mm);
            }
            if(ss >= 10){
                $("#task_metimess").text(ss);
            }else{
                $("#task_metimess").text("0"+ss);
            }
        },
        h : function(h,m,s){//pk对手
            if(h == null || h == undefined){
                h = 0;
            }
            if(m == null || m == undefined){
                m = 0;
            }
            if(s == null || s == undefined){
                s = 0;
            }
            //PK对手
            if(h >= 10){
                $("#task_utimehh").text(h);
            }else{
                $("#task_utimehh").text("0"+h);
            }
            if(m >= 10){
                $("#task_utimemm").text(m);
            }else{
                $("#task_utimemm").text("0"+m);
            }
            if(s >= 10){
                $("#task_utimess").text(s);
            }else{
                $("#task_utimess").text("0"+s);
            }
        },
        scroll : function(){
            $(window).scroll(function(){
                var scroolltop = $(window).scrollTop();
                var headertop = $(".task_title").height();
                var task_titletop = $(".task_title").height();
                if(scroolltop > (headertop+260)){
                    $(".task_strogetitleDeposit").css({"top":(scroolltop-task_titletop-260)+"px"});
                }else{
                    $(".task_strogetitleDeposit").css({"top":0+"px"});
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
    English.init();
});
