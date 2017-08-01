/**
 * Created by lichao on 2017/2/10.
 */
/**
 * Created by lichao on 2017/2/10.
 */
$(document).ready(function(){
    var Preview = {
        init : function(){
            this.Browser();
        },
        Browser : function(){//判断浏览器
            var _this = this;
            function getExplorerInfo() {
                var explorer = window.navigator.userAgent.toLowerCase();
                //ie 
                if (explorer.indexOf("msie") >= 0) {
                    var ver = explorer.match(/msie ([\d.]+)/)[1];
                    return { type: "IE", version: ver };
                }
                //firefox 
                else if (explorer.indexOf("firefox") >= 0) {
                    var ver = explorer.match(/firefox\/([\d.]+)/)[1];
                    return { type: "Firefox", version: ver };
                }
                //Chrome
                else if (explorer.indexOf("chrome") >= 0) {
                    var ver = explorer.match(/chrome\/([\d.]+)/)[1];
                    return { type: "Chrome", version: ver };
                }
                //Opera
                else if (explorer.indexOf("opera") >= 0) {
                    var ver = explorer.match(/opera.([\d.]+)/)[1];
                    return { type: "Opera", version: ver };
                }
                //Safari
                else if (explorer.indexOf("Safari") >= 0) {
                    var ver = explorer.match(/version\/([\d.]+)/)[1];
                    return { type: "Safari", version: ver };
                }
            }
            if(getExplorerInfo().type == "undefined" || getExplorerInfo().type == undefined || getExplorerInfo().type == null){
                Browserword = "Chrome";
            }else{
                var Browserword = getExplorerInfo().type;
                var Browser = getExplorerInfo().version;
                Browserword = Browserword;
            }
            var sub = JSON.parse(sessionStorage.getItem("sub"));
            var parmas = {};
            parmas.id = sub.id;
            if(Browserword){
                parmas.loginInfo = Browserword;
            }else{
                parmas.loginInfo = "IE";
            }
            _this.data(parmas);
            //_this.getTopic(parmas);
        },
        data : function(parmas){
            var _this = this;
            $.ajax({
                type : "post",
                url : "/web/student/homework/write/queryPaperById",
                data : parmas,
                dataType : "json",
                success : function(data){
                    if(data.retCode == "0000"){
                        _this.getPreviewPaper(data)
                        if(data.retData.resPaperUser){
                            var financeTips = data.retData.resPaperUser.financeTips;
                            if(financeTips){
                                GoldAnimate(financeTips);
                            }
                        }
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        getPreviewPaper : function(data){
            //判空
            if(data.retData.previewInfo == null || data.retData.previewInfo.questionList == 0){
                $(".test_Previewpaper").hide();
                $(".nothing").show();
                return false;
            }
            var _this = this;
            var questionNum = 0;
            var test_Previewpositionpaper = $(".test_Previewpositionpaper");
            var test_knownsend = $(".DH_send");
            var DH_title = $(".test_Previewname");
            var dohomeworkname = $(".dohomeworkname");
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
                DH_title.text(testTitle);
                dohomeworkname.text(testTitle);
                test_knownsend.attr("loginId",loginId);
                var $quention = $("<div class='questionTitle' myanswer='"+userAnswer+"' Nu_m='"+(i+1)+"'  data_answer='"+answer+"' questionType='"+questionType+"' questionId='"+id+"' loginId='"+loginId+"'></div>");
                var $choose = $("<div class='video_choose'></div>").appendTo($quention);
                var $optionA = $("<div class='optionchoose video_optionA' data-option='A'>"+optionA+"</div>").appendTo($choose);
                var $optionB = $("<div class='optionchoose video_optionB' data-option='B'>"+optionB+"</div>").appendTo($choose);
                var $optionC = $("<div class='optionchoose video_optionC' data-option='C'>"+optionC+"</div>").appendTo($choose);
                var $optionD = $("<div class='optionchoose video_optionD' data-option='D'>"+optionD+"</div>").appendTo($choose);
                var $slove = $("<div class='video_solve'></div>").appendTo($choose);
                test_Previewpositionpaper.append($quention);
                questionNum++;
                for(var j = 0 ; j < Dtrue.list.length; j++){
                    var lDtrue = Dtrue.list[j];
                    var questionType = lDtrue.questionType;
                    var content = lDtrue.content.replace("【题干】",(questionNum)+"、");
                    if(questionType == "01"){
                        var $content = $("<div class='video_content'>"+content+"<span class='questionanswer'></span></div>").insertBefore($optionA)
                        var $img = $("<span class='quetion_imge'></span>").appendTo($content);
                    }
                    if(questionType == "03"||questionType == "05"){
                        var $content = $("<div class='video_content'>"+content+"<span class='questionanswer'></span></div>").appendTo($slove);
                    }
                }
                var result = Dtrue.paperUserAnswer.result;
                if(result=="0"){
                    var $rightwrong = $("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/right.png'>").appendTo($img);
                }else if(result == null){
                    var $rightwrong = $("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/wrong.png'>").appendTo($img);
                }else{
                    var $rightwrong = $("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/wrong.png'>").appendTo($img);
                }
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
                        if($(this).attr("data-option") === userAnswerknwon){
                            $(this).addClass("addcolor").css({color:"#49b9df"});
                        }
                    }
                }else{
                    if(myanswer === $(this).attr("data-option")){
                        $(this).css({color:"#49b9df"});
                    }
                }
            })
            intMathJax();
            _this.getCss();//获取样式
            _this.Class();//班级目标
            _this.back();//返回键
        },
        Class : function(){//班级目标
            var _this = this;
            var sub = JSON.parse(sessionStorage.getItem("sub"));
            var parmas = {};
            parmas.id = sub.id;
            $(".test_Previewpositionclass").on("click",function(){
                $.ajax({
                    type : "post",
                    url : "/web/student/homework/report/getUserPaperPKInfo",
                    data : parmas,
                    dataType : "json",
                    success : function(data){
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
                            }else if(isComplete== "1"){
                                $(".task_meimg").find(".task_wait_correct").show();
                                $(".task_merate").text("--");//未批的时候显示"--"
                                _this.hh(hh,mm,ss);
                            }else if(isComplete == ""){
                                $(".task_merate,.task_metime").text("--");//未做的时候显示"--"
                            }else{
                                if(type == "3"){
                                    $(".task_merate").text(score+"/"+totalScore);
                                }else{
                                    $(".task_merate").text(score);
                                }
                                _this.hh(hh,mm,ss);
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
                                $(".task_urate").text("--");//未做的时候显示"--"
                                _this.h(h,m,s);
                            }else if(isPkComplete == ""){
                                $(".task_urate,.task_utime").text("--");//未做的时候显示"--"
                            }else{
                                if(type == "3"){
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
        back : function(){
            $(".DH_back").on("click",function(){
                window.location.href = "DH_video.html";
            })
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
