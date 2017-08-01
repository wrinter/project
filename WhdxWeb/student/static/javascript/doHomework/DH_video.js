/**
 * Created by lichao on 2017/2/9.
 */
$(document).ready(function(){
    var Video = {
        init : function(){//初始化
            var s = Request.IsShare;
            if(window.location.hash!=''){
                $(".Com_Header,.Com_Crumbs,.test_videoknown,.test_videoteacherword,.test_see,.test_issh,.test_isok").hide();
                $(".test_videoclickplay").css({"width":"90%","margin":"auto"});
            }
            var parmas = {};
            parmas.id = Request.id;
            parmas.loginInfo = Request.navigator;
            this.getVideo(parmas);
            this.videoShare();//分享
        },
        getBaseInfo : function(data){//基础知识
            var _this = this;
            var previewSubmitFlag = data.retData.resPaperUser.previewSubmitFlag;
            _this.clickPreview(previewSubmitFlag)//预习测试
            if(data.retData.baseInfo == null || data.retData.baseInfo.questionList.length == 0){
                $(".test_videoknown").hide();
                return false;
            }
            var questionNum = 0;
            var test_knownpaper = $(".test_knownpaper");
            var test_knownsend = $(".test_knownsend");
            var basicSubmitFlag = data.retData.resPaperUser.basicSubmitFlag;
            for(var i = 0 ; i < data.retData.baseInfo.questionList.length ; i++){
                var loginId = data.retData.loginId;
                var Dtrue = data.retData.baseInfo.questionList[i];
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
                var answer = Dtrue.answer;
                var userAnswer = Dtrue.paperUserAnswer.userAnswer;
                var id = Dtrue.id;
                test_knownsend.attr("loginId",loginId);
                var $quention = $("<div class='questionTitle' myanswer='"+userAnswer+"'   data_answer='"+answer+"' questionType='"+questionType+"' questionId='"+id+"' loginId='"+loginId+"'></div>");
                var $choose = $("<div class='video_choose'></div>").appendTo($quention);
                var $optionA = $("<div class='optionchoose video_optionA' data-option='A'>"+optionA+"</div>").appendTo($choose);
                var $optionB = $("<div class='optionchoose video_optionB' data-option='B'>"+optionB+"</div>").appendTo($choose);
                var $optionC = $("<div class='optionchoose video_optionC' data-option='C'>"+optionC+"</div>").appendTo($choose);
                var $optionD = $("<div class='optionchoose video_optionD' data-option='D'>"+optionD+"</div>").appendTo($choose);
                var $slove = $("<div class='video_solve'></div>").appendTo($choose);
                test_knownpaper.append($quention);
                questionNum++;
                for(var j = 0 ; j < Dtrue.list.length; j++){
                    var lDtrue = Dtrue.list[j];
                    var questionType = lDtrue.questionType;
                    var content = lDtrue.content.replace("【题干】",(questionNum)+"、");
                    if(questionType == "01"){
                        var $content = $("<div class='video_content'>"+content+"<span class='questionanswer'></span></div>").insertBefore($optionA)
                        var $img = $("<span class='quetion_imge'></span>").appendTo($content);
                    }
                    if(questionType == "03"||questionType == "07" ||questionType == "05" ){
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
                        $(this).css({color:"#49b9df"})
                    }
                }
            })
            _this.getCss();//获取样式
            if(basicSubmitFlag == "1" || basicSubmitFlag == 1){
                $(".test_knownsend").hide()
                $(".optionchoose").unbind("click");
                $(".quetion_imge,.video_solve").show();
            }else{
                _this.choiceAnswer()//单选
                _this.lostchoiceAnswer()//多选
            }
        },
        getVideo : function(parmas){//获取视频信息
            var _this = this;
            $.ajax({
                type : "post",
                url : "/web/student/homework/write/queryPaperById",
                data : parmas,
                dataType : "json",
                success : function(data){
                    //给预习测试准备
                    sessionStorage.setItem("data",JSON.stringify(data));
                    var test_videoname = $(".test_videoname");
                    var test_videov = $(".test_videov");
                    var test_nameS = $(".test_nameS");
                    var test_browse = $(".test_browse");
                    var test_nook = $(".test_nook");
                    var dohomeworkname = $(".dohomeworkname");
                    var test_pkname = $(".test_pkname");
                    var test_laba = $(".test_laba");
                    if(data.retCode == "0000"){
                        var type = data.retData.type;
                        var tips = data.retData.tips;
                        if(tips){
                            test_pkname.text(tips)
                        }else{
                            test_laba.hide();
                        }
                        sessionStorage.setItem("type",JSON.stringify(type));
                        //视频信息
                        var fileName = data.retData.videoInfo.fileName;
                        var playCode = data.retData.videoInfo.playCode;
                        var playCode=playCode.replace(/600/g,'100%');
                        var playCode=playCode.replace(/490/g,'570');
                        var queryNum = data.retData.videoInfo.queryNum;
                        var likeNum = data.retData.videoInfo.likeNum;
                        var islike = data.retData.videoInfo.islike;
                        var resId = data.retData.videoInfo.resId;
                        sessionStorage.setItem("resId",JSON.stringify(resId));
                        test_videoname.text(fileName);
                        dohomeworkname.text(fileName);
                        test_videov.html(playCode);
                        test_nameS.text(likeNum);
                        test_browse.text("浏览量（"+queryNum+"）")
                        if(islike == "0"){
                        }else{
                            test_nook.addClass("test_ok").removeClass("test_nook");
                        }
                        _this.clickGood();
                        _this.share();
                        _this.getBaseInfo(data)//基础知识
                        _this.clickSeend();//提交
                        _this.Aboutshark();//遮罩层
                        _this.assgin(data);//老师要求
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        clickGood : function(){//点赞
            $(".test_nook").on("click",function(){
                prise();
            })
            function prise(){
                var resId = JSON.parse(sessionStorage.getItem("resId"));
                var param={};
                param.resId = resId;
                $.ajax({
                    type: "post",
                    url: "/web/common/like",
                    data:param,
                    dataType: "json",
                    success:function(data){
                        var codenum = parseInt(data.retCode.substr(0, 1));
                        //判断你是否成功
                        if (codenum == 0) {
                            var num = parseInt($(".test_nameS").text())
                            $(".test_nameS").text(num+1);
                            $(".test_nook").addClass("test_ok").removeClass("test_nook");
                        }
                    }
                });
            }
        },
        //assgin :function(data){//老師的要求
        //    var test_teachterwords = $(".test_teachterwords");
        //    if(data.retData.assign.requirement){
        //        test_teachterwords.text(data.retData.assign.requirement);
        //    }else{
        //        test_teachterwords.text("暂无要求");
        //    }
        //},
        assgin : function(data){//老師的要求
            if(data.retData.assign == null || data.retData.assign.requirement == ""){
                var requirement = "暂无要求";
                $(".test_wordname").hide();
            }else{
                var requirement = data.retData.assign.requirement;
            }
            $(".test_wordname").on("click",function(){
                $(".sharks").fadeIn();
                $(".teacher_redmineword").text(requirement);
            })
            $(".teacher_redmineClose").on("click",function(){
                $(".sharks").fadeOut();
            })
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
                parmas.type = 1;
                parmas.loginId = loginId;
                parmas.recordId = recordId;
                _this.Ajax(parmas)
                var data_answer = $(this).closest(".questionTitle").attr("data_answer");
                $(this).closest(".questionTitle").attr("myanswer",answer);
                $(this).closest(".questionTitle").find(".questionanswer").text(answer);
                $(this).css({"color":"#49b9df"}).siblings(".optionchoose").css({"color":"#333"});
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
                parmas.type = 1;
                parmas.loginId = loginId;
                parmas.recordId = recordId;
                _this.Ajax(parmas)
                var data_answer = $(this).closest(".questionTitle").attr("data_answer");
                $(this).closest(".questionTitle").attr("myanswer",answer);
                $(this).closest(".questionTitle").find(".questionanswer").text(answer);
                $(this).css({"color":"#49b9df"}).siblings(".optionchoose").css({"color":"#333"});
                //    判断是否正确
                if(data_answer == answer){
                    $(this).closest(".questionTitle").find(".quetion_imge").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/right.png'>")
                }else{
                    $(this).closest(".questionTitle").find(".quetion_imge").html("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/wrong.png'>")
                }
            });
        },
        clickSeend : function(){//判断是否提交
            var _this = this;
            var id = JSON.parse(sessionStorage.getItem("sub"));
            $(".test_knownsend").on("click",function(){
                var loginId = $(this).attr("loginId");
                var parmas = {}
                parmas.id = id.id;
                parmas.type = 1;
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
        Aboutshark : function(){
            var _this = this;
            $(".model_paper_delete_correr,.model_paper_false_correr").on("click",function(){
                $(".shark").hide();
            });
            $(".model_paper_success_correr").on("click",function(){
               _this.Upajax();
            })
        },
        Upajax : function(){//提交
            var id = JSON.parse(sessionStorage.getItem("sub"));
            var type = JSON.parse(sessionStorage.getItem("type"));
            var loginId = $(".test_knownsend").attr("loginid");
            var testType = "1";
            var useTime = "0";
            var type = type;
            var parmas = {};
            parmas.id = id.id;
            parmas.type = id.type;
            parmas.useTime = useTime;
            parmas.testType = testType;
            parmas.loginId = loginId;
            $.ajax({
                type : "post",
                url : "/web/student/homework/write/updateHomeWorkState",
                data : parmas,
                dataType : "json",
                success : function(data){
                    console.log(data)
                    if(data.retCode == "0000"){
                        $('#c_ErrorMsg').html('提交成功!').fadeIn(200);  Disappear("#c_ErrorMsg");
                        $(".shark,.test_knownsend").hide();
                        $(".quetion_imge,.video_solve").show();
                        $(".optionchoose").unbind("click");
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
        clickPreview : function(previewSubmitFlag){
            if(previewSubmitFlag == "1" || previewSubmitFlag == 1){
                $(".test_see").on("click",function(){
                    //window.location.href = "DH_Preview.html";
                    window.open("DH_Preview.html")
                })
            }else{
                $(".test_see").on("click",function(){
                    window.location.href = "DH_Previewdo.html?id="+Request.id;
                    //window.open("DH_Previewdo.html);
                })
            }
        },
        share : function(){//分享
            /*分享*/
            $('.test_nosh').hover(function(){
                $(this).addClass("test_sh");
            },function(){
                $(this).removeClass("test_sh");
            })
            $('.test_nosh').on('click',function(){
                $('#Share').fadeIn(150);
                //Share(window.location.href);
                //AddShare();
            });
            $("#ShareClose").on("click",function(){
                $('#Share').fadeOut(150);
            });
            browserRedirect();
            function GoNoClass(){
                $('.AllNoHasClas').fadeIn(200)
                $('.GoClassClose').on('click',function(){$('.AllNoHasClas').fadeOut(200)});
            };
            function AddShare(){
                var id = JSON.parse(sessionStorage.getItem("sub"))
                var ArticleData={};
                ArticleData.resId=Request.id;
                $.ajax({
                    "type": "post",
                    "url": "/web/common/res/share",
                    "dataType":'json',
                    "data": ArticleData,
                    success: function (data) {
                    }
                });

            };
        },
        videoShare : function(){
            /**********************视频分享***************************/
            var DoneShare=Request.IsShare;
            if(DoneShare==0||DoneShare=='0'){
                $('body,html').html('')
                ShareRedirect();
            }
            function ShareRedirect() {
                var sUserAgent = navigator.userAgent.toLowerCase();
                var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
                var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
                var bIsMidp = sUserAgent.match(/midp/i) == "midp";
                var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
                var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
                var bIsAndroid = sUserAgent.match(/android/i) == "android";
                var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
                var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
                if (bIsIpad || bIsIphoneOs) {
                    $('body,html').html("暂时不支持IOS版本，更多详情<a href='http://www.bcbook.cn/'>五好导学网</a>") ;
                    window.location.href="../../../../index.html";
                }else if(bIsAndroid || bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM){
                    $('body,html').html("正在跳转到下载地址...<br/>如果是微信访问，请点击右上角选择从浏览器打开") ;
                    window.location.href="http://wuhaodaoxuewang.com:88/appweb/model/me/download.html";
                }else {
                    $('body,html').html("请使用手机访问，或者请前往官方<a href='http://www.bcbook.cn/'>五好导学网</a>") ;
                    window.location.href="../../../../index.html";
                }
            }
            $('#ShareClose').on('click',function(){
                $('#Share').fadeOut(150);
            })
            $('.enjoys').on('click',function(){
                $('#Share').fadeIn(150);
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
        }
    }
    Video.init();
})
