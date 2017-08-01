/**
 * Created by lgr on 2016/11/30.
 */
SystemRedMsg();
CheckBrower();
$(document).ready(function(){
    function  testDo (){};
    testDo.prototype = {
        init : function(){
            CheckBrower();
            GetHtml("../../model/common/common.txt","#Header");
            this.getTest();
            this.getCss();
            this.changeTest();
            this.backtop();
        },
        clickTime : function(testTime){
            var _this = this;
            var future = new Date().setMinutes(new Date().getMinutes()+Number(testTime));
            function timer(){
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
                if( hh == 0 && mm == 0 && ss == 0) {
                    clearInterval(timer);
                    //$(".s_sharks").show();
                    $('#c_ErrorMsg').html('测试时间已到!').fadeIn(300);  Disappear("#c_ErrorMsg");
                    var three = function three(){
                        var Total = JSON.parse(sessionStorage.getItem("Total"));
                        _this.sendAjax(Total);
                    }
                    setTimeout(three,3000)
                }
            }
            function checkTime(i){
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }
            var timer = setInterval(timer,1000);
        },
    getTest : function(){
            var _this = this;
            var parmas = {};
            var paperid = JSON.parse(sessionStorage.getItem("studies"));
            parmas.areaId = paperid.areaId;
            parmas.completed = paperid.menuId;
            var questionnum = 0;
            var Num = 0;
            $.ajax({
                type : "post",
                url : "/web/teacher/modeltest/bulidPaper",
                data :parmas, //直接放parmas
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
                        var s_paper_titlecl = $(".s_paper_titlecl"); //标题
                        var tudies_papername = $(".tudies_papername");
                        var s_paper_btton = $(".s_paper_btton"); //提交
                        var score = data.retData.score;
                        var testTime = data.retData.testTime;
                        var title = data.retData.title;
                        var userScore = data.retData.userScore;
                        var userTime = data.retData.userTime;
                        var paperId = data.retData.paperId;
                        var id = data.retData.id;
                        //时间分数
                        s_paper_titlecl.attr("id",id).text(title);
                        tudies_papername.text(title);
                        s_paper_oderw.text("时间："+testTime+"分钟");
                        s_paper_oder_score.text("分数："+score+"分");
                        for(var q = 0 ; q < data.retData.resRandomPaperQuestion.length; q++){
                            var resDtrue = data.retData.resRandomPaperQuestion[q];
                            var questionGroup = resDtrue.questionGroup;
                            var $ground = $("<div class='ground'></div>");
                            var $tipic = $("<div class='tipic'>"+questionGroup+"</div>").appendTo($ground);
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
                                $block.append($tilte);
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
                                        var $option = $("<div class='s_xpoption' id='"+id+"' selectableType='"+selectableType+"'  data_answer='"+answer+"' myscore='-0' style='position: relative'></div>");
                                        if(s_paper_btton.hasClass("add")){
                                            var $optionslove = $("<div class='s_xpslove' style='display: block'></div>");
                                        }else{
                                            var $optionslove = $("<div class='s_xpslove' style='display: none'></div>");
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
                                            if(questionType == "01"){
                                                questionnum++
                                                if(selectAble == "0"){
                                                    var $input = $("<textarea class='thisanswer s_input fs18' contenteditable='true' style='resize: none;'placeholder='请作答...'></textarea>");
                                                    $input.insertAfter($optionchooseD);
                                                }
                                                var $questionType = $("<div class='s_xpquestionType' questionType='01'><label>"+(questionnum)+"、</label></div>").insertBefore($optionchooseA);
                                                var $contentlabel = $("<div class='contentlabel'>"+content+"</div>").appendTo($questionType);
                                                if($questionType.find("p").length == "0"){
                                                    $questionType.append("<span class='answer thisanswer' style='margin-left: -23px'></span><span class='wr'></span>");
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
                                                var id = pDtrue.id;
                                                //question里面的
                                                var $optionul = $("<div class='s_xpoption' id='"+id+"' data_answer='"+answer+"'myscore='0' ></div>");
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
                                                    var content = pDtrue.list[n].content.replace("</p>","<span class='answer thisanswer' style='margin-left: -23px'></span><span class='wr'></span></p>").replace("【题干】","");
                                                    var questionType = pDtrue.list[n].questionType;
                                                    if( questionType == "01"){
                                                        if(selectAble == "0"){
                                                            var $input = $("<textarea class='thisanswer s_input fs18' contenteditable='true' style='resize: none;'placeholder='请作答...'></textarea>");
                                                            $input.insertAfter($(".optionD"+m+""));
                                                        }
                                                        var $cont = $("<div class='s_xpquestionType'questionType='01' n='"+n+"'>"+content+"</div>").insertBefore($(".optionA"+m+""));
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
                        //    划过字体变大
                        _this.cssBig();
                        _this.Completion(data);//
                        _this.sendPaper(data);   //提交试卷
                        _this.correctbtn(data);
                        //点击  选择答案
                        //var t_flag=[];
                        _this.choiceAnswer(data);
                        _this.lostchoiceAnswer(data)
                        _this.shark(data);
                        _this.clickTime(testTime);
                        _this.backtop();
                    }else{
                        $(".s_paper").hide();
                        $(".nothing").show();
                        //$('#c_ErrorMsg').html('当前地区没有试题!').fadeIn(200);  Disappear("#c_ErrorMsg");
                    }
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
                $(".s_studies_paper").stop(true,true).animate({
                    scrollTop: 0
                },200);
            });
        },//返回顶部
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
        },//获取公共样式
        sendPaper : function(data){//提交试卷
            var _this = this;
            var s_paper_btton = $(".s_paper_btton"); //提交
            var Total = sessionStorage.setItem("Total",JSON.stringify(data.retData.testTime));
            s_paper_btton.on("click",function(){
                _this.paperTest();//判断试卷是否做完
                if(s_paper_btton.hasClass("show") && s_paper_btton.hasClass("display")){
                    if($(".s_paper_hour").text() != 0){
                        var hourmin = parseInt($(".s_paper_hour").text()*60);
                    }
                    var minmin = parseInt($(".s_paper_min").text());
                    if(hourmin){
                        var time = parseInt(hourmin+minmin);
                    }else{
                        var time = parseInt(minmin);
                    }
                    time = Number(data.retData.testTime) - Number(time);
                    _this.sendAjax(time);
                }else{
                    $(".s_paper_shark").show();
                }
            })
        },
        cssBig : function (s_paper_btton){
            //    划过字体变大
            $(".s_xpoption").on("mouseover",function(){
                $(this).css({"box-shadow": "0 1px 7px #999","border-radius":"10px"});
            });
            $(".s_xpoption").on("mouseout",function(){
                $(this).css({"box-shadow":""});
            });
        },
        choiceAnswer:function(data){//单选
            var index = 0;
            var _this = this;
            $(".s_xpoption[selectableType='1'],.questionTitle[selectableType='3']").find(".optionchoose").on("click",function(){
                var answer = $(this).attr("option");
                var questionId = $(this).closest(".s_xpoption").attr("id");
                //获取 点击后的选项
                $(this).addClass("oneadd");
                var answer = $(this).attr("option");
                var parmas = {};
                parmas.questionId = questionId;
                parmas.userAnswer = answer;
                _this.postAnswer(parmas,$(this),answer);
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
                $(this).addClass("addtwo");
                $(this).parent(".s_xpoption").children(".addtwo").each(function(){
                    var singleanwer = $(this).attr("option");
                    answer.push(singleanwer)
                });
                answer = answer.join("");
                var parmas = {};
                parmas.questionId = questionId;
                parmas.userAnswer = answer;
                _this.loatpostAnswer(parmas,$(this),answer);
                index++;
            });
        },
        postAnswer : function(parmas,that,answer){//單選随时保存
            var _this = this;
            $.ajax({
                type : "post",
                url : "/web//teacher/modeltest/anwerQuestion",
                data : parmas,
                dataType : "json",
                success : function(data){
                    if(data.retCode == "0000"){
                        if(that.hasClass("oneadd")){
                            that.css({"color":"#65b113"}).siblings(".optionchoose").css({"color":"#333"});
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
                            _this.isDo();
                        }
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        loatpostAnswer : function(parmas,that,answer){//都選随时保存
            var _this = this;
            $.ajax({
                type : "post",
                url : "/web//teacher/modeltest/anwerQuestion",
                data : parmas,
                dataType : "json",
                success : function(data){
                    if(data.retCode == "0000"){
                        if(that.hasClass("addcolor")){
                            that.removeClass("addcolor").css({"color":"#333"});
                        }else{
                            that.addClass("addcolor").css({"color":"#65b113"});
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
                        _this.isDo();
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        changeTest : function(){
            $(".s_paper_change").on("click",function(){   //换一套题
                if($(".s_paper_change").hasClass("add")){

                }else{
                    location.reload();
                }
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
        postCorrt : function(questionId,score){
            var parmas = {};
            parmas.paperId = $(".s_paper_titlecl").attr("id");
            parmas.questionId = questionId;
            parmas.userScore = score;
            $.ajax({
                type : "post",
                url : "/web//teacher/modeltest/anwerCorrect",
                data : parmas,
                dataType : "json",
                success : function(data){
                },
                error : function(e){
                    console.log(e)
                }
            })
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
                                    var questionId = $(this).closest(".s_xpoption").attr("id");
                                    _this.postCorrt(questionId,score);//批改得分上传
                                    //$("<div class='s_myscore'>"+score+"</div>").insertAfter(myscore);
                                    $(this).closest(".s_score").css({"visibility":"hidden"});
                                }).appendTo($s_score);
            return $s_score;
        },
        paperTest : function(){//判断试题是否做完
            var answer = $(".s_xptopic[selectable='1']").find(".s_xpoption").find(".s_xpquestionType").find(".answer");
            var s_input  =  $(".s_xptopic[selectable='0']").find(".s_xpoption").find(".s_input ");
            var s_paper_btton = $(".s_paper_btton");
            if(answer.length == "0"){
                if(!s_paper_btton.hasClass("show")){
                    s_paper_btton.addClass("show")
                }
            }else{
                answer.each(function(){//客观题
                    var htype = $(this).text();
                    if(!htype){
                        //alert("客观题还没有做完");
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
            $(".s_paper_delete,.s_paper_false,.time_paper_delete_correr,.time_paper_false_correr").on("click",function(){//提交试卷取消\\测试时间已到提示取消
                $(this).closest(".s_paper_shark,.s_sharks").hide();
            });
            $(".s_paper_success,.time_paper_success_correr").on("click",function(){//确定
                $(this).closest(".s_paper_shark,.s_sharks").hide();
                //计时器
                if($(".s_paper_hour").text() != 0){
                    var hourmin = parseInt($(".s_paper_hour").text()*60);
                }
                var minmin = parseInt($(".s_paper_min").text());
                if(hourmin){
                    var time = parseInt(hourmin+minmin);
                }else{
                    var time = parseInt(minmin);
                }
                time = Number(data.retData.testTime) - Number(time);
                _this.sendAjax(time);
            })
            $(".s_paper_delete_correr,.s_paper_false_correr").on("click",function(){//批改消失
                $(this).closest(".s_shark_paper").hide();
            })
        },
        enter : function(){//提交之后的动作
            $(".s_paper_btton").fadeOut();  //提交
            $(".s_paper_btton").siblings(".s_paper_correct_btn").fadeIn();  //批改
            $(".s_xpslove").show();   //答案
            $(".optionulanwser").show();//答案
            $(".wr").show();// 显示对错
            $(".s_paper_cont").hide();//计时器
            $(".s_paper_use").show();
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
        isDo : function(){//判断是否做题
            var $answer = $(".s_xptopic[selectAble='1']").find(".s_xpquestionType[questiontype='01']").find(".answer");
            var $s_input  =  $(".s_xptopic[selectable='0']").find(".s_xpoption").find(".s_input");
            $answer.each(function(){
                if($(this).text()){
                    $(".s_paper_change").css({"background":"#ccc","color":"#fff"});
                    $(".s_paper_change").addClass("add");
                }
            })
            $s_input.each(function(){
                if($(this).val()){
                    $(".s_paper_change").css({"background":"#ccc","color":"#fff"});
                    $(".s_paper_change").addClass("add");
                }
            })
        },
        sendAjax : function(time){//提交试卷
            var _this = this;
            //客观题判断
            var $answer = $(".s_xptopic[selectAble='1']").find(".s_xpquestionType[questiontype='01']").find(".answer");
            var  $s_paper_cont = $(".s_paper_cont");//计时
            $answer.each(function(){
                if(!$(this).html()){
                    $(this).siblings(".wr").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/wrong.png'>");
                    $(this).closest(".s_xpoption").attr("myscore","0")
                }
            });
            //客观题判断结束
            var parmas = {};
            parmas.paperId = $(".s_paper_titlecl").attr("id");
            parmas.status = "1";
            parmas.testTime = time;
            $.ajax({
                type : "post",
                url : "/web/teacher/modeltest/paperSubmit",
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
                            $(".s_shark_paper,.s_paper_shark").fadeOut();
                            $(".s_xpoption").css({"border":""});
                            $(".s_paper_change").hide();
                            $(".s_paper_oderuse").text("用时："+time+"分钟");
                            $(".s_paper_oder_getscore").text("得分：--分");
                            _this.enter();
                            _this.corRectmouseover();   //批改加分
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
        corrtAjax : function(score){//批改提交
            var _this = this;
            var parmas = {};
            parmas.paperId = $(".s_paper_titlecl").attr("id");
            parmas.status = "2";
            if(typeof (score) == "undefined" || typeof (score) == undefined ){
            }else{
                parmas.userScore = Number(score);
            }
            $.ajax({
                type : "post",
                url : "/web/teacher/modeltest/paperSubmit",
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
                        //不能更改内容
                        $(".s_input").attr("readonly","true");
                        $(".s_shark_paper,.s_paper_shark").fadeOut();
                        $(".s_xpoption").css({"border":""});
                        $(".s_paper_change").hide();
                        if(!score){//是否显示分数
                            $(".s_paper_oder_getscore").text("得分：--分");
                        }else{
                            $(".s_paper_oder_getscore").text("得分："+score+"分");
                        }
                        $(".s_paper_correct_btn,.correct,.s_score").fadeOut();
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
        correctEnter : function(data){//批改确定按钮
            var _this = this;
            var s_paper_correct_btn = $(".s_paper_correct_btn");
            $(".s_paper_success_correr").on("click",function(){
                if($(this).hasClass("addcorrer")){
                    _this.nogetscore();//总分   和  状态
                    $(".s_paper_correct_btn").fadeOut();
                    $(".s_paper_correct_btn").addClass("add")
                }
            })
        },
        nogetscore : function(data){//最后得分
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
            var time = JSON.parse(sessionStorage.getItem("time"));
            _this.corrtAjax();
            sessionStorage.removeItem("time");
            return sum;
        },
        correctbtn : function(data){//批改按钮
            var _this = this;
            $(".s_paper_correct_btn").on("click",function(){
                _this.iscorrect(data);
                if($(this).hasClass("addshow")){
                    _this.sumscore(data);//总分   和  状态
                    $(this).addClass("add")
                }
            })
        },
        iscorrect : function(data){//判断是否批改完
            var _this = this;
            var s_xpoption = $(".s_xptopic[selectable='0']").find(".s_xpoption");
            //var imge =  $(".s_xptopic[selectable='0']").find(".s_xpquestionType").find(".wr_imge");
            if(s_xpoption.length == "0"){
                if(!$(".s_paper_correct_btn").hasClass("addshow")){//给按钮加CLass名；
                    $(".s_paper_correct_btn").addClass("addshow");
                }
            }else{
                s_xpoption.find(".s_xpquestionType").each(function(){
                    if($(this).find(".wr_img").length == "0"){
                        $(".s_shark_paper").fadeIn();
                        _this.correctEnter(data);
                        $(".s_paper_success_correr").addClass("addcorrer");//给确定加class名；
                        $(".s_paper_correct_btn").removeClass("addshow");
                        return false;
                    }
                    if(!$(".s_paper_correct_btn").hasClass("addshow")){//给按钮加CLass名；
                        $(".s_paper_correct_btn").addClass("addshow");
                    }

                })
            }
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
            //$(".s_paper_oder_getscore").text("得分："+sum+"分");
            var time = JSON.parse(sessionStorage.getItem("time"));
            _this.corrtAjax(sum);
            sessionStorage.removeItem("time");
            return sum;
        },
        load : function(){
            //window.onload
        }
    }
    var $testDo = new testDo();
    $(document).ready(function(){
        $testDo.init();
    });
})