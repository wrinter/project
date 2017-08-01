/**
 * Created by lichao on 2017/2/9.
 */
$(document).ready(function(){
    var Video = {
        init : function(){//初始化
            var parmas = {};
            parmas.id = Request.id;
            this.getVideo(parmas);
            var s = Request.IsShare;
            if(window.location.hash!=''){
                $(".Com_Header,.Com_Crumbs,.test_videoknown,.test_videoteacherword,.test_see,.test_isok,.test_issh").hide();
                $(".test_videoclickplay").css({"width":"90%","margin":"auto"});
            }
            this.videoShare();
        },
        getBaseInfo : function(data){//基础知识
            //判空
            if(data.retData.baseInfo == null || data.retData.baseInfo.questionList.length == 0){
                $(".test_videoknown").hide();
                return false;
            }
            var _this = this;
            var questionNum = 0;
            var test_knownpaper = $(".test_knownpaper");
            var test_knownsend = $(".test_knownsend");
            var previewSubmitFlag = data.retData.resPaperUser.previewSubmitFlag;
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
                    if(questionType == "03"||questionType == "07" ||questionType == "05"){
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
                //console.log(userAnswer);
                if(userAnswerlength > 1){
                    for(var i = 0 ; i < userAnswerlength ; i++){
                        var userAnswerknwon = myanswer[i]
                        //console.log(userAnswerknwon)
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
            _this.clickPreview()//预习测试
            $(".test_knownsend").hide()
            $(".quetion_imge").show();
        },
        getVideo : function(parmas){//获取视频信息
            var _this = this;
            $.ajax({
                type : "post",
                url : "/web/student/homework/report/getUserPaperReport",
                data : parmas,
                dataType : "json",
                success : function(data){
                    //给预习测试准备
                    console.log(data);
                    sessionStorage.setItem("data",JSON.stringify(data));
                    var test_videoname = $(".test_videoname");
                    var test_videov = $(".test_videov");
                    var test_name = $(".test_name");
                    var test_browse = $(".test_browse");
                    var test_nook = $(".test_nook");
                    var dohomeworkname = $(".dohomeworkname");
                    var Title = $("#Title");
                    if(data.retCode == "0000"){
                        var type = data.retData.type;
                        sessionStorage.setItem("type",JSON.stringify(type));
                        //视频信息
                        var tips
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
                        Title.text("《"+fileName+"》");//分享名称
                        test_videov.html(playCode);
                        test_name.text("（"+likeNum+"）");
                        test_browse.text("浏览量（"+queryNum+"）")
                        if(islike == "0"){
                        }else{
                            test_nook.addClass("test_ok").removeClass("test_nook");
                        }
                        _this.clickGood();
                        _this.share();
                        _this.getBaseInfo(data)//基础知识
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
                        console.log(data);
                        var codenum = parseInt(data.retCode.substr(0, 1));
                        //判断你是否成功
                        if (codenum == 0) {
                            var num = parseInt($(".test_nameS").text())
                            $(".test_nameS").text(num+1);
                            $(".test_nook").addClass("test_ok").removeClass("test_nook");
                            //window.location.reload(true);
                        }
                    }
                });
            }
        },
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
        clickPreview : function(){
            $(".test_see").on("click",function(){
                window.open("test_Preview.html");
            })
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
            if(window.location.hash!=''){
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
    Video.init();
})
