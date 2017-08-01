/**
 * Created by zxl on 2017/4/18.
 */
$(function() {
    GetHtml("../../model/common/Head.txt", "#Com_Head");//引入导航
    CheckBrower();
    function Report(reportId) {
        //this.classTargetId = classTargetId;
        this.reportId = reportId;
    }

    Report.prototype = {
        init:function(){
            $( 'audio' ).audioPlayer();
            this.getAnalyse();
            this.getPaper();
            classTarget(this.reportId);
        },
        getAnalyse:function(){
            $.ajax({
                type : "post",
                url : "/web/student/homework/view_report/data_analysis",
                data : {"id":this.reportId},
                dataType : "json",
                success : function(data){
                    showAnalyse(data);
                },
                error : function(e){
                    console.log(e);
                }
            });
        },
        getPaper : function(){
            $.ajax({
                type : "post",
                url : "/web/student/homework/report/getUserPaperReport",
                data : {"id":this.reportId},
                dataType : "json",
                success : function(data){
                    showReport(data);
                },
                error : function(e){
                    console.log(e);
                }
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
        }
    };
    function showAnalyse(data){
        if(data.retCode=="0000"){
            var temp=data.retData;
            var objectiveNum =temp.obRightNum + "/" + temp.objectiveNum;
            $('#r_obNum').html(objectiveNum);
            var subNum = $('#r_subNum');
            var time = ToTime(temp.useTime);
            $('#r_hour').html(time);
            showCircle('.r_pcircle',temp.userScore/temp.score);
            //未批：0 已批：1
            if(temp.status=="0"){
                subNum.html('等待批改');
                subNum.css('color','#d90011');
                if (temp.objectiveNum == 0) {
                    $('.r_ob').hide();
                    $('.r_subjectInfo').css('padding-right', '150px');
                    $('.r_fen').html('未批改');
                    $('.r_fullscore').html('满分' + temp.score + '分');
                } else {
                    $('.r_ob').show();
                    $('.r_sub').show();
                    $('.r_score').html(temp.userScore);
                    $('.r_fen').html('分');
                    $('.r_fullscore').html('客观题得分');
                    showCircle('.r_pcircle', temp.userScore / temp.score);
                }
                $('.r_cue').show();
                $('.r_score').html(temp.userScore);
            }else{
                var subjectiveNum =temp.subRightNum + "/" + temp.subjectiveNum;
                subNum.html(subjectiveNum);
                subNum.removeClass('r_fc');
                $('.r_cue').hide();
                $('.r_score').html(temp.userScore);
                $('.r_fullscore').html('满分'+temp.score+'分');
                if(temp.objectiveNum==0) {
                    $('.r_ob').hide();
                    $('.r_subjectInfo').css('padding-right','150px');
                }else if(temp.subjectiveNum==0) {
                    $('.r_sub').hide();
                    $('.r_subjectInfo').css('padding-right','150px');
                }else{
                    $('.r_ob').show();
                    $('.r_sub').show();
                }
                showCircle('.r_pcircle',temp.userScore/temp.score);
            }
        }
    }
    function showReport(data){
        var Num = 0;
        var task_tiltename = $(".r_tName");
        var task_usedtime = $(".r_tTime");
        var task_fen = $(".r_tScore");
        var task_strogepaper = $(".r_detail");
        var task_time = $(".task_time");
        var s_paper_hour = $(".s_paper_hour");
        var s_paper_min = $(".s_paper_min");
        var s_paper_second = $(".s_paper_second");
        var task_details = $(".r_danalyze ");
        if(data.retCode == "0000") {
            var type = data.retData.type;
            var id = data.retData.resPaperUser.id;
            $(".task_tiltename").attr("id", id);
            var paperName = data.retData.paper.paperName;
            var testTime = data.retData.resPaperUser.testTime;
            var score = data.retData.paper.score;
            var loginId = data.retData.loginId;
            task_tiltename.text(paperName);
            $('.Com_Crumbs_in span').text(paperName);
            task_usedtime.text("建议用时：" + testTime + "分钟");
            task_fen.text("总分：" + score + "分");
            task_details.html('测试详情');
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
                    var lnOrder = Dtrue.questionGroup[j].lnOrder;
                    var labels = Dtrue.questionGroup[j].labels;
                    var isSplite = Dtrue.questionGroup[j].isSplite;
                    var $questiongrounp = $("<div class='questiongrounp ' isSplite = '"+isSplite+"' ></div>").appendTo($question);
                    //question一个级别的东西
                    if(groupCode && isSplite == "0"){
                        Num++;
                        var $content = $("<div class='content'>"+Num+"、"+groupCodecontent+"</div>").appendTo($questiongrounp);
                        var num1 = 0;
                        for(var k = 0 ; k < Dtrue.questionGroup[j].questions.length ; k++){
                            var qDtrue = Dtrue.questionGroup[j].questions[k];
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
                            var url = qDtrue.url;
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
                            if(url == null || url == ""){

                            }else{
                                var $clickplay = $("<div class='clickplay' url='"+url+"'></div>").insertBefore($answer);
                            }
                            //答案解析难度之类的
                            if(qDtrue.labels.length == 0){
                                var $analysisanswer = $("<div class='analysis speek'>&nbsp;&nbsp;</div>").appendTo($answer);
                                //var $analysis = $("<div class='analysis'>"+content+"</div>").appendTo($answer);
                            }else{
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
                    }else if(groupCode && isSplite == "1"){
                        var $content = $("<div class='content'>"+groupCodecontent+"</div>").appendTo($questiongrounp);
                        for(var k = 0 ; k < Dtrue.questionGroup[j].questions.length ; k++){
                            Num++;
                            var qDtrue = Dtrue.questionGroup[j].questions[k];
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
                            var url = qDtrue.url;
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
                            if(url == null || url == ""){

                            }else{
                                var $clickplay = $("<div class='clickplay' url='"+url+"'></div>").insertBefore($answer);
                            }
                            //答案解析难度之类的
                            if(qDtrue.labels.length == 0){
                                var $analysisanswer = $("<div class='analysis speek'>&nbsp;&nbsp;</div>").appendTo($answer);
                                //var $analysis = $("<div class='analysis'>"+content+"</div>").appendTo($answer);
                            }else{
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
                            //需要讲
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
                        for(var k = 0 ; k < Dtrue.questionGroup[j].questions.length ; k++){
                            var qDtrue = Dtrue.questionGroup[j].questions[k];
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
                            var url = qDtrue.url;
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
                            if(url == null || url == ""){

                            }else{
                                var $clickplay = $("<div class='clickplay' url='"+url+"'></div>").insertBefore($answer);
                            }
                            //答案解析难度之类的
                            if(qDtrue.labels.length == 0){
                                var $analysisanswer = $("<div class='analysis speek'>&nbsp;&nbsp;</div>").appendTo($answer);
                                //var $analysis = $("<div class='analysis'>"+content+"</div>").appendTo($answer);
                            }else{
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
                            //需要讲
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

                    //    组合题
                    var $lestion = $("<div class='lestion'></div>").appendTo($question);
                    if(labels != null){
                        for(var m = 0 ; m < Dtrue.questionGroup[j].labels.length ; m++){
                            var lqDtrue = Dtrue.questionGroup[j].labels[m];
                            var content = lqDtrue.content;
                            var questionType = lqDtrue.questionType;
                            if(questionType == "03" ){
                                var $analysisanswer = $("<div class='analysis speek'>"+content+"</div>").appendTo($lestion);
                            }
                            if(questionType == "05"){
                                var $analysis = $("<div class='analysis'>"+content+"</div>").appendTo($lestion);
                            }
                        }
                    }
                }
                task_strogepaper.append($groung);
            }
            //聽力
            $(".clickplay").on("click",function(){
                //$("#" ).audioPlayer();
                $("#audio").attr("src",$(this).attr("url"));
                $("#audioplayer").show();
            });
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
            var hh = parseInt(useTime / 60 / 60 % 24, 10);//计算剩余的小时数
            var mm = parseInt(useTime / 60 % 60, 10);//计算剩余的分钟数
            var ss = parseInt(useTime % 60, 10);//计算剩余的秒数
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
            //变色
            var eachChoose = $(".optionchoose");
            eachChoose.each(function(){
                var myanswer = $(this).closest(".questionTitle").attr("myanswer");
                var data_answer = $(this).closest(".questionTitle").attr("data_answer");
                var userAnswerlength = myanswer.length;
                if(userAnswerlength > 1){
                    for(var i = 0 ; i < userAnswerlength ; i++){
                        var userAnswerknwon = myanswer[i]
                        if($(this).attr("option") === userAnswerknwon){
                            $(this).addClass("addcolor").css({color:"#49b9df"});
                        }
                    }
                }else{
                    if(myanswer === $(this).attr("option")){
                        $(this).css({color:"#49b9df"});
                    }
                }
            });
            //调用函数
            //保持高度一样
            var Jheight = $(".task_strogepaper").height();
            var Zheight = $(".task_bc").height();
            var Theight = $(".task_strogetitle").height();
            if(Jheight>=Zheight && Jheight>=Theight){
                $(".task_bc").height(Jheight)
            }
            //_this.Class();//班級目標
            toneedExplain();//需要講
            areaImge(data);//图片区域
            //播放器
            if(data.retData.paper.url == null || data.retData.paper.url == ""){
                $("#audioplayer").hide();
            }else{
                $("#audio").attr("src",data.retData.paper.url);
                $("#audioplayer").show();
            }
        }else{
            $(".task_paper").hide();
            $(".nothing").show();
        }
    }
    function areaImge(data){
        var $areaImge = $("<div class='areaImge'></div>").appendTo(".r_detail");
        var $teacher = $("<div class='teacherTalk'></div>").appendTo(".r_detail");
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
                if(mDtrue != null && mDtrue.length != 0){
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
    }
    function toneedExplain(){
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
        });
    }
    var  report = new Report(Request.id);
    report.init();
});