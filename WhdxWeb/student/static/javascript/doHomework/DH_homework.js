/**
 * Created by lichao on 2017/2/10.
 */
PlayerFixed()
function PlayerFixed(){
    setInterval(function(){
        var Istop=$(document).scrollTop()+$(window).height()-60;
        $('#lession').css('top',Istop);
    },1)
}
$(document).ready(function(){
    var English = {
        init : function(){
            var str=window.navigator.userAgent.toLowerCase();
            this.getCss();
            this.clickUp();//提交
            $( 'audio' ).audioPlayer();
            $( '#audioplayer' ).hide();
            var parmas = {};
            parmas.id = Request.id;
            parmas.loginInfo = Request.navigator;
            this.getPaper(parmas);
        },
        getPaper : function(parmas){
            var _this = this;
            var Num = 0;
            $.ajax({
                type : "post",
                url : "/web/student/homework/write/queryPaperById",
                data : parmas,
                dataType : "json",
                success : function(data){
                    var task_tiltename = $(".task_tiltename");
                    var task_usedtime = $(".task_usedtime");
                    var task_fen = $(".task_fen");
                    var task_strogepaper = $(".task_strogepaper");
                    var task_upsend = $(".task_upsend");
                    var dohomeworkname = $(".dohomeworkname");
                    if(data.retCode == "0000"){
                        _this.getTopic(data);//题号
                        var type = data.retData.type;
                        var substrtype = type.substr(0,1);
                        sessionStorage.setItem("substrtype",JSON.stringify(type));
                        if(substrtype == 1){
                            task_fen.hide();
                        }
                        //类型
                        var subtype = data.retData.resPaperUser.type;
                        var startTime = data.retData.resPaperUser.startTime;
                        sessionStorage.setItem("subtype",JSON.stringify(subtype));
                        var paperName = data.retData.paper.paperName;
                        var testTime = data.retData.resPaperUser.testTime;
                        var remainTime = data.retData.remainTime;
                        var score = data.retData.paper.score;
                        var loginId = data.retData.loginId;
                        task_tiltename.attr("loginId",loginId).text(paperName);
                        dohomeworkname.text(paperName);
                        task_usedtime.text("建议用时："+testTime+"分钟");
                        task_fen.text("总分："+score+"分");
                        task_upsend.attr("loginId",loginId);
                        sessionStorage.setItem("testTime",JSON.stringify(testTime));
                        //试卷获取
                        for(var i = 0; i < data.retData.paper.questionLines.length; i++){
                            var Dtrue = data.retData.paper.questionLines[i];
                            var lineName = Dtrue.lineName.replace("默认题行","");
                            var scoreDef = Dtrue.scoreDef;
                            if(scoreDef == null){
                                scoreDef = "";
                            }
                            var questionType = Dtrue.questionType;
                            var $groung = $("<div class='groung' questionType='"+questionType+"' ></div>");
                            var $grounglines = $("<div class='lineName'>"+lineName+""+scoreDef+"</div>").appendTo($groung);
                            var $question = $("<div class='question'></div>").appendTo($groung);
                            for(var j = 0; j < Dtrue.questionGroup.length;j++){
                                var groupCodecontent = Dtrue.questionGroup[j].content;
                                var groupCode = Dtrue.questionGroup[j].groupCode;
                                var ClnOrder = Dtrue.questionGroup[j].lnOrder;
                                var isSplite = Dtrue.questionGroup[j].isSplite;
                                var questionTypeId = Dtrue.questionGroup[j].questionTypeId;
                                var $questiongrounp = $("<div class='questiongrounp ' isSplite='"+isSplite+"' questionTypeId='"+questionTypeId+"'></div>").appendTo($question);
                                if(groupCode && isSplite == "0"){//题号不可拆分
                                    Num++;
                                    var num1 = 0;
                                    if(groupCodecontent == null || groupCodecontent == ""){
                                        var $content = $("<div class='content'>"+Num+"</div>").appendTo($questiongrounp);
                                    }else{
                                        var $content = $("<div class='content'>"+Num+"、"+groupCodecontent+"</div>").appendTo($questiongrounp);
                                    }
                                    for(var k = 0; k < Dtrue.questionGroup[j].questions.length;k++){
                                        var qDtrue = Dtrue.questionGroup[j].questions[k];
                                        for(var M in qDtrue){
                                            if(!qDtrue[M]){
                                                qDtrue[M] = ""
                                            }
                                        }
                                        var groupOrder = qDtrue.groupOrder;
                                        var lnOrder = qDtrue.lnOrder;
                                        var questionTitle = qDtrue.questionTitle.replace("【题干】","");
                                        var questionId = qDtrue.questionId;
                                        var optionA = qDtrue.optionA;
                                        var optionB = qDtrue.optionB;
                                        var optionC = qDtrue.optionC;
                                        var optionD = qDtrue.optionD;
                                        var questionTypeId = qDtrue.questionTypeId;
                                        var selectable = qDtrue.selectable;
                                        var selectableType = qDtrue.selectableType;
                                        var answer = qDtrue.answer;
                                        var url = qDtrue.url;
                                        var userAnswer = qDtrue.paperUserAnswer.userAnswer;
                                        var $questionT = $("<div class='questionT'></div>").appendTo($questiongrounp);
                                        var $questionTitle = $("<div class='questionTitle' selectableType='"+selectableType+"' Num='"+Num+"("+(num1+1)+")' myanswer='"+userAnswer+"'  data_answer='"+answer+"' selectable='"+selectable+"' loginId='"+loginId+"' questionId='"+questionId+"' questionTypeId='"+questionTypeId+"'></div>").appendTo($questionT);
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
                                        }else{

                                        }
                                        var $answer = $("<div class='answer'></div>").appendTo($questionTitle);
                                        if(url == null || url == ""){

                                        }else{
                                            var $clickplay = $("<div class='clickplay' url='"+url+"'></div>").insertBefore($answer);
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
                                        //    答案区域
                                        var needExplain = qDtrue.paperUserAnswer.needExplain;
                                        var result = qDtrue.paperUserAnswer.result;
                                        var userAnswer = qDtrue.paperUserAnswer.userAnswer;
                                        if(needExplain==false){
                                            //需要讲
                                            var $Needspeak = $("<div class='Needspeak'>需要讲</div>").appendTo($analysisanswer);
                                        }else{
                                            var $hasNeedspeak = $("<div class='hasNeedspeak'>已提问</div>").appendTo($analysisanswer);
                                        }
                                        num1++;
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
                                        var groupOrder = qDtrue.groupOrder;
                                        var lnOrder = qDtrue.lnOrder;
                                        var questionTitle = "<label>"+Num+"、"+"</label>"+qDtrue.questionTitle.replace("【题干】","");
                                        var questionId = qDtrue.questionId;
                                        var optionA = qDtrue.optionA;
                                        var optionB = qDtrue.optionB;
                                        var optionC = qDtrue.optionC;
                                        var optionD = qDtrue.optionD;
                                        var questionTypeId = qDtrue.questionTypeId;
                                        var selectable = qDtrue.selectable;
                                        var selectableType = qDtrue.selectableType;
                                        var answer = qDtrue.answer;
                                        var url = qDtrue.url;
                                        var userAnswer = qDtrue.paperUserAnswer.userAnswer;
                                        var $questionT = $("<div class='questionT'></div>").appendTo($questiongrounp);
                                        var $questionTitle = $("<div class='questionTitle' selectableType='"+selectableType+"' Num='"+Num+"' myanswer='"+userAnswer+"'  data_answer='"+answer+"' selectable='"+selectable+"' loginId='"+loginId+"' questionId='"+questionId+"' questionTypeId='"+questionTypeId+"'></div>").appendTo($questionT);
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
                                        if(needExplain==false){
                                            //需要讲
                                            var $Needspeak = $("<div class='Needspeak'>需要讲</div>").appendTo($analysisanswer);
                                        }else{
                                            var $hasNeedspeak = $("<div class='hasNeedspeak'>已提问</div>").appendTo($analysisanswer);
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
                                        var groupOrder = qDtrue.groupOrder;
                                        var lnOrder = qDtrue.lnOrder;
                                        var questionTitle = "<label>"+Num+"、"+"</label>"+qDtrue.questionTitle.replace("【题干】","");
                                        var questionId = qDtrue.questionId;
                                        var optionA = qDtrue.optionA;
                                        var optionB = qDtrue.optionB;
                                        var optionC = qDtrue.optionC;
                                        var optionD = qDtrue.optionD;
                                        var questionTypeId = qDtrue.questionTypeId;
                                        var selectable = qDtrue.selectable;
                                        var selectableType = qDtrue.selectableType;
                                        var answer = qDtrue.answer;
                                        var url = qDtrue.url;
                                        var userAnswer = qDtrue.paperUserAnswer.userAnswer;
                                        var $questionT = $("<div class='questionT'></div>").appendTo($questiongrounp);
                                        var $questionTitle = $("<div class='questionTitle' selectableType='"+selectableType+"' Num='"+Num+"' myanswer='"+userAnswer+"'  data_answer='"+answer+"' selectable='"+selectable+"' loginId='"+loginId+"' questionId='"+questionId+"' questionTypeId='"+questionTypeId+"'></div>").appendTo($questionT);
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
                                        if(needExplain==false){
                                            //需要讲
                                            var $Needspeak = $("<div class='Needspeak'>需要讲</div>").appendTo($analysisanswer);
                                        }else{
                                            var $hasNeedspeak = $("<div class='hasNeedspeak'>已提问</div>").appendTo($analysisanswer);
                                        }
                                    }
                                }
                            }
                            task_strogepaper.append($groung);
                        }
                        //完形填空
                        $(".groung[questiontype = '12']").find(".optionchoose").css({"width":"23%","height":"32px","display":"inline-block"});
                        $(".questiongrounp[questionTypeId = '12']").find(".optionchoose").css({"width":"23%","height":"32px","display":"inline-block"});
                        //倒计时
                        sessionStorage.removeItem("addclickTime");
                        if(remainTime <= 0){
                            var testTime = Math.abs(remainTime/60);
                            sessionStorage.setItem("addclickTime",JSON.stringify(testTime));
                            _this.clickTime();
                        }else{
                            var testTime = Math.abs(remainTime/60);
                            sessionStorage.setItem("clickTime",JSON.stringify(testTime));
                            _this.testTime();
                        }
                        //_this.testTime();
                        //聽力
                        $(".clickplay").on("click",function(){
                            //$("#" ).audioPlayer();
                            $("#audio").attr("src",$(this).attr("url"));
                            $("#audioplayer").show();
                        })
                        //主观题
                        //试卷状态
                        var status = data.retData.resPaperUser.status;
                        sessionStorage.setItem("status",JSON.stringify(status));
                        //变色
                        var eachChoose = $(".optionchoose");
                        eachChoose.each(function(){
                            var myanswer = $(this).closest(".questionTitle").attr("myanswer");
                            var data_answer = $(this).closest(".questionTitle").attr("data_answer");
                            var lnorder = $(this).closest(".questionTitle").attr("lnorder");
                            var userAnswerlength = myanswer.length;
                            if(userAnswerlength > 1){
                                for(var i = 0 ; i < userAnswerlength ; i++){
                                    var userAnswerknwon = myanswer[i]
                                    if($(this).attr("option") === userAnswerknwon){
                                        $(this).addClass("addcolor").css({color:"#49b9df"});
                                        var Num = $(this).closest(".questionTitle").attr("Num");
                                        $(".task_ti[Num='"+Num+"']").css({"border":"1px solid #49b9df","color":"#49b9df"})
                                    }
                                }
                            }else{
                                if(myanswer === $(this).attr("option")){
                                    $(this).css({color:"#49b9df"});
                                    //题号变化
                                    var Num = $(this).closest(".questionTitle").attr("Num");
                                    $(".task_ti[Num='"+Num+"']").css({"border":"1px solid #49b9df","color":"#49b9df"})
                                }
                            }
                        })
                        //调用函数
                        //调用函数
                        _this.Need();//需要講
                        _this.areaImge(data);//图片区域
                        _this.choiceAnswer(data);//单选
                        _this.lostchoiceAnswer(data);//多选
                        _this.clickPrint();//打印
                        _this.Aboutshark();//遮罩层
                        _this.Picture();//照片处理
                        _this.getPicture();//照片处理
                        _this.scroll();//滑动
                        _this.Attention();//题号
                        _this.height();//高度
                        _this.ti();//题号
                        //播放器
                        if(data.retData.paper.url == null || data.retData.paper.url == ""){
                            $("#audioplayer").hide();
                        }else{
                            $( '#audioplayer' ).show();
                            $("#audio").attr("src",data.retData.paper.url);
                        }
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
        ti : function(){//显示主观题
            var questionTitle = $(".questionTitle");
            var Num = [];
            questionTitle.each(function(){
                var num = $(this).attr("num");
                var selectable = $(this).attr("selectable");
                if(selectable == "0"){
                    Num.push(num);
                }
            })
            if(Num.length == 0){
                $(".areaImge,.task_up").hide();
                return false;
            }
            for(var i = 0 ; i<Num.length;i++){
                var fisrt = Num[0];
                var last = Num[Num.length-1];
            }
            $(".tisubjective").text("请上传"+fisrt+"~"+last+"题的照片");
        },
        height : function(){
            //保持高度一样
            var Jheight = $(".task_strogepaper").height();
            var Zheight = $(".task_bc").height();
            var Theight = $(".task_strogetitle").height();
            if(Jheight>=Zheight || Jheight>=Theight){
                $(".task_bc").height(Jheight)
            }
        },
        getTopic : function(data){//获取题号
            var _this = this;
            if(data.retCode == "0000"){
                //试卷获取题目
                //题号添加
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
                                var $pNnum = $("<span class='task_ti' Num='"+Num+"("+(num1+1)+")' >"+Num+"."+(num1+1)+"</span>").appendTo($pN);
                                num1++;
                            }
                        }else if(groupCode && isSplite == "1"){//组合题可拆分
                            for(var k = 0 ; k < qDtrue.questions.length ; k++){
                                Num++;
                                var $pNnum = $("<span class='task_ti' Num='"+Num+"' >"+Num+"</span>").appendTo($pN);
                            }
                        }else{
                            Num++;
                            for(var k = 0 ; k < qDtrue.questions.length ; k++){//普通题
                                var $pNnum = $("<span class='task_ti' Num='"+Num+"' >"+Num+"</span>").appendTo($pN);
                            }
                        }
                        for(var k = 0 ; k < qDtrue.questions.length ; k++){
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
                    task_seetitle.append($topic);
                }
                //对应效果
                $(".task_ti").on("click",function(){
                    var Num = $(this).attr("Num");
                    var questionTitleTop = $(".questionTitle[Num='"+Num+"']").offset().top;
                    $("body").animate({"scrollTop":questionTitleTop},1000);
                    document.documentElement.scrollTop = questionTitleTop;
                    //$("body").scrollTop(questionTitleTop);
                });
            }
        },
        choiceAnswer:function(data){//单选题
            var id = JSON.parse(sessionStorage.getItem("sub"));
            var _this = this;
            $(".questionTitle[selectableType='1'],.questionTitle[selectableType='3']").find(".optionchoose").on("click",function(){
                var answer = $(this).attr("option");
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
                _this.Ajax(parmas)
                $(this).closest(".questionTitle").find(".questionanswer").text(answer);
                $(this).css({"color":"#49b9df"}).siblings(".optionchoose").css({"color":"#333"});
                //题号变化
                var Num = $(this).closest(".questionTitle").attr("Num");
                $(".task_ti[Num='"+Num+"']").css({"border":"1px solid #49b9df","color":"#49b9df"});
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
                _this.Ajax(parmas);
                $(this).closest(".questionTitle").find(".questionanswer").text(answer);
                var optionchoose = $(this).closest(".choose").find(".optionchoose");
                var a= 0;
                optionchoose.each(function(){
                    if(!$(this).hasClass("addcolor")){
                        a++;
                    }
                });
                if(a == 4 || a == "4"){//多选题取消
                    var Num = $(this).closest(".questionTitle").attr("Num");
                    $(".task_ti[Num='"+Num+"']").css({"border":"1px solid #ccc","color":"#333"});
                    return false;
                }
                //题号变化
                var Num = $(this).closest(".questionTitle").attr("Num");
                $(".task_ti[Num='"+Num+"']").css({"border":"1px solid #49b9df","color":"#49b9df"})
            });
        },
        Attention : function(){
            $.ajax({
                type : "post",
                url : "/web/common/pcSysAlert",
                data : {code:"stu_web_dohomework"},
                success : function(data){
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
        areaImge : function(data){//照片区域
            var _this = this;
            var $areaImge = $("<div class='areaImge'></div>").appendTo(".task_strogepaper");
            var $areaT = $("<div class='areaT'>主观题部分答案 ：</div>").appendTo($areaImge);
            var answersFileIds = data.retData.resPaperUser.answersFileIds
            if(answersFileIds == null){

            }else{
                for(var i = 0 ; i < data.retData.resPaperUser.answersFileIds.length ; i++){
                    var Dtrue = data.retData.resPaperUser.answersFileIds[i];
                    var fileId = Dtrue.fileId;
                    var order = Dtrue.order;
                    var url = Dtrue.url;
                    var $Picture = $("<div class='Pictrue'></div>").appendTo($areaImge);
                    var $Premoe = $("<i class='iconfont Premove'>&#xe645;</i>").appendTo($Picture);
                    var $img = $("<img class='areaimg' order='"+order+"' fileId='"+fileId+"' src='"+url+"' />").appendTo($Picture);
                }
            }
            var add = JSON.stringify(sessionStorage.getItem("add"));
            if(add == "null"){
            }
            if(add && add != "null"){
                var areaImgeTop = $(".areaimg").last().offset().top;
                $("body").animate({"scrollTop":areaImgeTop},1000);
                document.documentElement.scrollTop = areaImgeTop;
                sessionStorage.removeItem("add");
            }
            _this.removePicture();
        },
        removePicture : function(){//删除图片
            $(".Premove").on("click",function(){
                var that = $(this);
                var fileId = $(this).siblings(".areaimg").attr("fileid")
                var parmas = {};
                parmas.id = Request.id;
                parmas.fileId = fileId;
                parmas.loginId = $(".task_tiltename").attr("loginId");
                $.ajax({
                    type : "post",
                    url : "/web/student/homework/write/deleteSubPic",
                    data : parmas,
                    dataType : "json",
                    success : function(data){
                        if(data.retCode == "0000"){
                            that.closest(".Pictrue").remove();
                            that.siblings(".areaimg").remove();
                        }
                    },
                    error : function(e){
                        console.log(e)
                    }
                })
            })
        },
        Ajax : function(parmas){
            console.log(parmas)
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
        },//随时保存
        Need : function(){//需要讲
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
            })
        },
        clickUp : function(){//提交判断
            var _this = this;
            var id = JSON.parse(sessionStorage.getItem("sub"));
            $(".task_upsend").on("click",function(){
                var h = $("#s_paper_hour").text();
                var m = $("#s_paper_min").text();
                var s = $("#s_paper_second").text();
                if( h > 0){
                    var hour = parseInt(parseInt(h)*60);
                    var clickTime =parseInt(hour+m);
                }else{
                    var clickTime =parseInt(m);
                }
                //    提交参数
                var parmas = {};
                parmas.id = id.id;
                parmas.type = "0";
                parmas.loginId = $(this).attr("loginId");
                $.ajax({
                    type : "post",
                    url : "/web/student/homework/write/getSubmitFlag",
                    data : parmas,
                    dataType : "json",
                    success : function(data){
                        if(data.retCode == "0000"){
                            if(data.retData == false){
                                $(".shark").show();
                            }else{
                                _this.Upajax();
                            }
                        }
                    },
                    error : function(e){
                        console.log(e)
                    }
                })
            })
        },
        Upajax : function(){
            var status = JSON.parse(sessionStorage.getItem("status"));
            var testTime = JSON.parse(sessionStorage.getItem("testTime"));
            if(status=="4"){
                $('#c_ErrorMsg').html('亲，已经提过了!').fadeIn(200);  Disappear("#c_ErrorMsg");
            }else{
                var id = JSON.parse(sessionStorage.getItem("sub"));
                var loginId = $(".task_upsend").attr("loginId");
                var subtype = JSON.parse(sessionStorage.getItem("subtype"));
                if($('.task_upsend').hasClass("addMiuns")){
                    var h = $("#s_paper_hour").text();
                    var m = $("#s_paper_min").text();
                    var s = $("#s_paper_second").text();
                    if( h > 0){
                        var hour = parseInt(parseInt(h)*60*60);
                        var min = parseInt(m*60);
                        var clickTime = parseInt(parseInt(hour)+parseInt(min));
                        var Hms = parseInt(parseInt(clickTime)+parseInt(s));
                    }else{
                        var min = parseInt(m*60);
                        var Hms =parseInt(parseInt(min)+parseInt(s));
                    }
                    var time = Hms+parseInt(testTime*60);
                }else{
                    if(parseInt($("#s_paper_hour").html()) != 0){
                        var hourmin = parseInt($("#s_paper_hour").html()*60);
                    }
                    var minmin = parseInt($("#s_paper_min").html());
                    var hms = parseInt($("#s_paper_second").html());
                    if(hourmin){
                        var time = parseInt(parseInt(hourmin*60)+parseInt(minmin*60)+parseInt(hms));
                    }else{
                        var time = parseInt(minmin*60)+parseInt(hms);
                    }
                    var time = Number(testTime*60) - Number(time);//用时
                    //var time = parseInt(timemin*60);
                }
                sessionStorage.setItem("time",JSON.stringify(time));
                var parmas = {};
                parmas.id = id.id;
                parmas.type = subtype;
                parmas.useTime = time;
                parmas.testType = 1;
                parmas.loginId = loginId;
                $.ajax({
                    type : "post",
                    url : "/web/student/homework/write/updateHomeWorkState",
                    data : parmas,
                    dataType : "json",
                    success : function(data){
                        if(data.retCode == "0000"){
                            $(".shark").hide();
                            var id = Request.id;
                            var navigator = Request.navigator;
                            var type = data.retData.type;
                            var substrtype = JSON.parse(sessionStorage.getItem("substrtype"));
                            if(type == "203"){
                                window.location.href = "../report/auditionreport.html?id="+id;
                            }else{
                                window.location.href = "../report/testreport.html?id="+id+"&type="+type;
                            }
                        }else{
                            $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
                        }
                    },
                    error : function(e){
                        console.log(e)
                    }
                })
            }
        },
        scroll : function(){
            $(window).scroll(function(){
                var scroolltop = $(window).scrollTop();
                var headertop = $(".task_title").height();
                if(scroolltop > 260){
                    $(".task_strogetitleDeposit").css({"top":(scroolltop-290)+"px"});
                }else{
                    $(".task_strogetitleDeposit").css({"top":0+"px"});
                }
            })
        },
        Aboutshark : function(){
            var _this = this;
            $(".model_paper_delete_correr,.model_paper_false_correr,.model_paper_delete,.model_paper_false").on("click",function(){
                $(".shark,.sharks").hide();
            });
            $(".model_paper_success_correr,.model_paper_success").on("click",function(){
                _this.Upajax();
            })
        },
        Picture : function(){//点击上传按钮
            $(".task_up").on("click",function(){
                $(".content_sharks").fadeIn();
                var $inputImage = $('#inputImage'),
                    URL = window.URL || window.webkitURL,
                    blobURL;
                if(!URL){
                    $('#c_ErrorMsg').html('浏览器暂不支持图像编辑,请升级浏览器').css('width','500px').fadeIn(200);Disappear("#c_ErrorMsg");
                }
            })
            $("#ShareClose").on("click",function(){
                $(this).closest(".content_sharks").hide();
            })
        },
        getPicture : function(){//上传图片
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
        clickPrint : function(){//打印
            $(document).ready(function(){
                $(".task_print").on('click',function(){
                    $(".task_bc,.task_strogetitle,.task_print").hide();
                    $(".task_strogepaper").css({"width":"96%","margin":"0 auto"});
                    $(".task_paper").jqprint({
                        debug: false,
                        importCSS: true,
                        printContainer: true,
                        operaSupport: false
                    });
                    $(".task_bc,.task_strogetitle,.task_print").show();
                    $(".task_strogepaper").css({"width":"69%","margin":"0 auto"});
                });
            });
        },
        clickTime : function(){
            var starts = new Date();//开始时间
            var testTime = JSON.parse(sessionStorage.getItem("addclickTime"));
            if(testTime){
                var $Minus = $("<span class='Minus sign' style='color: #ff0000'>-</span>").appendTo($(".Minus_usetime"));
                $(".task_upsend").addClass("addMiuns");
                var start = parseInt(new Date().getTime()-(testTime*60*1000));
            }else{
                var $Minus = $("<span class='Minus sign' style='color: #ff0000'>-</span>").appendTo($(".Minus_usetime"));
                var start = starts.getTime();
            }
            $("#s_paper_hour,#s_paper_min,#s_paper_second").css({"color":"#ff0000"});
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
        testTime : function(){//倒计时
            var _this = this;
            var testTime = JSON.parse(sessionStorage.getItem("clickTime"));
            var future = new Date().setTime(new Date().getTime()+parseInt(testTime*60*1000));
            function time(){
                var ts = future - (new Date());//计算剩余的毫秒数
                var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
                var mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
                var ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数
                hh = checkTime(hh);
                mm = checkTime(mm);
                ss = checkTime(ss);
                document.getElementById("s_paper_hour").innerHTML = hh;
                document.getElementById("s_paper_min").innerHTML = mm;
                document.getElementById("s_paper_second").innerHTML = ss;
                if( hh == 0 && mm == 0 && ss == 0){
                    clearInterval(timer);
                    $(".sharks").show();
                    $(".task_upsend").addClass("addMiuns");
                    _this.clickTime();
                }
            }
            function checkTime(i){
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }
            var timer = setInterval(time,1000);
        }
    }
    English.init();
});
