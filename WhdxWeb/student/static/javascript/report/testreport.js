/**
 * Created by Administrator on 2017/4/18.
 */
$(function() {
    GetHtml("../../model/common/Head.txt","#Com_Head");//引入导航
    CheckBrower();
    function testReport(reportId){
        //this.classTargetId = classTargetId;
        this.reportId = reportId;
        this.subjectId="";
        this.subjectFlag = true;//存在客观题
        this.getCss();
        this.compensatePrice = 0;
    }
    testReport.prototype = {
        init:function(){
            classTarget(this.reportId);
            this.getPaper();
            this.getAnalyse();
            this.getKownledge();
            this.getCompensatePrice();
        },
        getCompensatePrice:function(){
            var that = this;
            $.ajax({
                type : "post",
                url : "/student/compensation/compensation/getPrice",
                dataType : "json",
                success : function(data) {
                    if(data.retCode=='0000'){
                        that.compensatePrice = data.retData;
                    }
                }
            });
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
        getKownledge:function(){
            var sub = JSON.parse(sessionStorage.getItem("sub"));
            var parmas = {};
            parmas.id = sub.id;
            $.ajax({
                type: "post",
                url: "/web/student/homework/report/studentAnalysis",
                data: parmas,
                dataType: "json",
                success: function (data) {
                    showKownledge(data);
                }
            });

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
            });
        }
    };
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
                if( null!= mDtrue && mDtrue.length != 0){
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
    function showAnalyse(data){
        var type = Request.type.substr(0,1);
        if(data.retCode=="0000"){
            var temp=data.retData;
            var objectiveNum =temp.obRightNum + "/" + temp.objectiveNum;
            $('#r_obNum').html(objectiveNum);
            var subNum = $('#r_subNum');
            var time = ToTime(temp.useTime);
            $('#r_hour').html(time);
            var w=0;
            if(temp.objectiveNum==0||temp.subjectiveNum==0){
                 w = ($('.r_main').width()-80)/2;
            }else{
                w = parseInt(($('.r_main').width()-80)/3);
            }
            $('.r_subjectInfo').css('width',w);
            //未批：0 已批：1
            if(temp.status=="0"){
                subNum.html('等待批改');
                subNum.css('color','#d90011');
                $('.r_cue').show();
                $('.r_kanalyze').hide();
                $('.r_hkownledge').hide();
                $('.r_kownledge').hide();
                if(type=="1"){//作业
                    if(temp.objectiveNum==0){
                        $('.r_ob').hide();
                        $('.r_fen').html('等待批改');
                        showCircle('.r_pcircle',0);
                        $('.r_fullscore').html('作业正确率');
                    }else{
                        $('.r_ob').show();
                        $('.r_sub').show();
                        var rate = temp.obRightNum/temp.objectiveNum;
                        $('.r_score').html(parseInt(rate*100));
                        $('.r_fen').html('%');
                        showCircle('.r_pcircle',rate);
                        $('.r_fullscore').html('客观题正确率');
                    }
                }else if(type=="2") {//测试
                    if (temp.objectiveNum == 0) {
                        $('.r_ob').hide();
                        $('.r_fen').html('未评分');
                        $('.r_fullscore').html('满分' + temp.score + '分');
                    } else {
                        $('.r_ob').show();
                        $('.r_sub').show();
                        $('.r_score').html(temp.userScore);
                        $('.r_fen').html('分');
                        $('.r_fullscore').html('客观题得分');
                    }
                    showCircle('.r_pcircle', temp.userScore / temp.score);
                }
            }else{
                var subjectiveNum =temp.subRightNum + "/" + temp.subjectiveNum;
                subNum.html(subjectiveNum);
                subNum.removeClass('r_fc');
                $('.r_cue').hide();
                if(type=="1"){//作业
                    var correctRate = 0;
                    if(temp.objectiveNum==0){
                        $('.r_ob').hide();
                        correctRate = temp.subRightNum/temp.subjectiveNum;
                    }else if(temp.subjectiveNum==0) {
                        $('.r_sub').hide();
                        correctRate = temp.obRightNum / temp.objectiveNum;
                        test.subjectFlag=false;
                    }else{
                        $('.r_ob').show();
                        $('.r_sub').show();
                        correctRate = (temp.obRightNum+temp.subRightNum)/(temp.objectiveNum+temp.subjectiveNum);
                    }
                    showCircle('.r_pcircle',correctRate);
                    $('.r_score').html(parseInt(correctRate*100));
                    $('.r_fen').html('%');
                    $('.r_fullscore').html('作业正确率');
                    $('.r_table').show();
                    $('.r_train').hide();
                }else if(type=="2"){//测试
                    $('.r_score').html(temp.userScore);
                    $('.r_fen').html('分');
                    $('.r_fullscore').html('满分'+temp.score+'分');
                    if(temp.objectiveNum==0) {
                        $('.r_ob').hide();
                        //$('.r_subjectInfo').css('padding-right','150px');
                    }else if(temp.subjectiveNum==0) {
                        $('.r_sub').hide();
                        //$('.r_subjectInfo').css('padding-right','150px');
                        test.subjectFlag=false;
                    }else{
                        $('.r_ob').show();
                        $('.r_sub').show();
                    }
                    $('.r_table').show();
                    $('.r_train').show();
                    showCircle('.r_pcircle',temp.userScore/temp.score);
                }
            }
        }
    }
    function showReport(data){
        var Num=0;
        var task_tiltename = $(".r_tName");
        var task_usedtime = $(".r_tTime");
        var task_fen = $(".r_tScore");
        var task_strogepaper = $(".r_detail");
        var task_time = $(".task_time");
        var s_paper_hour = $(".s_paper_hour");
        var s_paper_min = $(".s_paper_min");
        var s_paper_second = $(".s_paper_second");
        var task_details = $(".r_danalyze ");
        if(data.retCode == "0000"){
            var type = data.retData.type;
            var substrtype = type.substr(0,1);
            var id = data.retData.resPaperUser.id;
            var paperName = data.retData.paper.paperName;
            var testTime = data.retData.resPaperUser.testTime;
            var score = data.retData.paper.score;
            var loginId = data.retData.loginId;
            task_tiltename.text(paperName);
            $('.Com_Crumbs_in span').html(paperName);
            task_usedtime.text("建议用时："+testTime+"分钟");
            if(substrtype == 1){
                task_fen.hide();
                task_details.html('作业详情');
            }else if(substrtype == 2){
                task_fen.text("总分："+score+"分");
                task_details.html('测试详情');
            }
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
                                if(questionType == "18"){
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
                            if(questionType == "18"){
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
                            var questionTitle = "<label>"+Num+"、"+"</label>"+qDtrue.questionTitle.replace("【题干】","");
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
                                if(questionType == "18"){
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
                            var questionTitle = "<label>"+Num+"、"+"</label>"+qDtrue.questionTitle.replace("【题干】","");
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
                                if(questionType == "18"){
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
            var Jheight = $(".r_detail").height();
            var Zheight = $(".task_bc").height();
            var Theight = $(".r_detail").height();
            if(Jheight>=Zheight && Jheight>=Theight){
                $(".task_bc").height(Jheight)
                $(".task_bc").height(Jheight)
            }
            Need();//需要講
            if(test.subjectFlag){
                areaImge(data);//主观题答案
            }
        }else{
            $(".task_paper").hide();
            $(".nothing").show();
            //$('#c_ErrorMsg').html('亲，暂时没有数据哦!').fadeIn(200);  Disappear("#c_ErrorMsg");
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
        }
    function showKownledge(data){
        if(data.retCode=="0000"){
            var list = data.retData.analysisRes.list;
            var status = data.retData.analysisRes.status;
            var train = $('.r_train');
            if(status=="-1"){
                train.hide();
            }else{
                $('.r_compensate').attr('status',status);
                if(status=="0"){
                    $('.r_need').html('需要花费');
                    var money = test.compensatePrice + '金币';
                    $('.r_money').html(money);
                }else{
                    $('.r_need').html('已购买');
                    $('.r_money').hide();
                }
            }
            if(list!=null&&list.length>0){
                test.subjectId=list[0].subjectId;
                var $html="<ul class='r_khead clearfix'><li>知识点名称</li><li>错误率</li><li>对应题目</li></ul>";
                for(var i=0;i<list.length;i++){
                    $html += "<ul class='r_kbody clearfix'><li>"
                        + list[i].resTag.tagName + "</li><li>"
                        + (100-list[i].correctRate)+'%' + "</li><li class='r_knum'>";
                    var numSet = list[i].numCorrectSet;
                    for(var key in numSet) {
                        var result = numSet[key].result;
                        if (result == "0") {
                            $html += '<span class="r_right">' + numSet[key].number + '、</span>';
                        } else if (result == "1") {
                            $html += '<span class="r_wrong">' + numSet[key].number + '、</span>';
                        } else {
                            $html += '<span class="r_wright">' + numSet[key].number + '、</span>';
                        }
                    }
                    $html += '</li></ul>';
                }
                $('#r_table').html($html);
                var lastSpan = $('.r_knum span:last-child');
                for(var i=0;i<lastSpan.length;i++){
                    lastSpan[i].innerText = lastSpan[i].innerText.replace('、','');
                }
            }
        }
    }
    function Need(){
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
            });
        });
    }
    var test = new testReport(Request.id);
    test.init();
    $(".r_compensate").on("click",function(){
        var parmasC = {};
        parmasC.id = Request.id;
        parmasC.subjectId = test.subjectId;
        parmasC.type = "0";
        sessionStorage.setItem("parmasC",JSON.stringify(parmasC));
        var status = $(this).attr("status");
        if(status == "3" || status == "2"){
            //var tempwindow=window.open('_blank');
            //tempwindow.location='trainingDetails.html';
            window.open("trainingDetails.html");
            //var a = $("<a href='trainingDetails.html' target='_blank' ></a>").get(0);
            //var e = document.createEvent('MouseEvents');
            //e.initEvent('click', true, true);
            //a.dispatchEvent(e);
            return false;
        }
        if(status == "1"){
            //var tempwindow=window.open('_blank');
            //tempwindow.location='training.html';
            window.open("training.html");
            return false;
        }
        if(status == "0"){
            $.ajax({
                type : "post",
                url : "/web/user/finance",
                dataType : "json",
                success : function(data){
                    if(data.retCode == "0000"){
                        var usable = data.retData.usable;
                        if(!usable){
                            $('#c_ErrorMsg').html('少年，金币不足!').fadeIn(200);  Disappear("#c_ErrorMsg");
                            return false;
                        }
                        if(usable >= 5){
                            window.open("training.html");
                            //var a = $("<a href='training.html' target='_blank' ></a>").get(0);
                            //var e = document.createEvent('MouseEvents');
                            //e.initEvent('click', true, true);
                            //a.dispatchEvent(e);
                            //a.click();
                        }else{
                            $('#c_ErrorMsg').html('少年，金币不足!').fadeIn(200);  Disappear("#c_ErrorMsg");
                        }
                    }
                },
                error : function(e){
                    console.log(e)
                }
            });
        }
    });
});