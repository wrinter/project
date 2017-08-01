/**
 * Created by lichao on 2017/2/9.
 */
$(document).ready(function(){
    var letters = {
        init : function(){
            var parmas = {};
            parmas.id = Request.id;
            if(window.location.hash!=''){
                $(".Com_Header,.Com_Crumbs,.letter_teacherword,.letter_funtion,.letterclick ").hide();
                this.Common();
            }else{
                this.getLetters(parmas);
            }
            this.browserRedirect();
        },
        browserRedirect : function(){
            var _this = this;
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var bIsAndroid = sUserAgent.match(/android/i) == "android";
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                $(".Com_Header,.Com_Crumbs,.letter_teacherword,.letter_funtion,.letterclick ").hide();
                _this.Common();
            } else {
                CheckBrower();
            }
        },
        getLetters : function(parmas){
            var _this = this;
            $.ajax({
                type : "post",
                url : "/web/student/homework/report/getUserPaperReport",
                data : parmas,
                dataType : "json",
                success : function(data){
                    console.log(data)
                    var letter_paper = $(".letter_paper");
                    var letter_titlename = $(".letter_titlename");
                    var letter_word = $(".letter_word");
                    var dohomeworkname = $(".dohomeworkname");
                    var Title = $("#Title");
                    if(data.retCode == "0000"){
                        var loginId = data.retData.loginId;
                        var clickka = {};
                        clickka.startTime = data.retData.startTime;
                        clickka.loginId = loginId;
                        clickka.id = Request.id;
                        var clickka = sessionStorage.setItem("clickka",JSON.stringify(clickka));
                        var content = data.retData.article.content;
                        var title = data.retData.article.title;
                        var id = data.retData.article.id;
                        letter_titlename.text(title);
                        dohomeworkname.text(title);
                        Title.text("《"+title+"》");//分享名称
                        var useTime = data.retData.resPaperUser.useTime;
                        letter_word.text(ToComTime(useTime));
                        if(typeof(data.retData.article.content)!='undefined'){
                            var str=''
                            str=data.retData.article.content;
                            str=str.replace(/\&lt;/g,'<')
                            str=str.replace(/\&gt;/g,'>')
                            str=str.replace(/\&quot;/g,'"')
                            str=str.replace(/\&amp;quot;/g,'"')
                            str=str.replace(/\&amp;nbsp;/g, "");
                            str=str.replace(/\&amp;#39;/g,"'");
                            letter_paper.html(str);
                        }
                        else {
                            letter_paper.html('暂无数据');
                        }

                    }else{
                        $(".letter,.letter_funtion").hide();
                        $(".Com_Main").css({"min-heihgt":"550px"});
                        $(".nothing").show();
                    }
                    _this.teacherRedmine(data);
                    _this.share();//分享
                    _this.getCss();
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        Common : function(){
            var _this = this;
            var params = {};
            params.id=Request.paperId;
            $.ajax({
                type: "post",
                url: "/web/shareresource/toartical ",
                dataType: "json",
                data:params,
                success :function(data){
                    console.log(data)
                    var letter_paper = $(".letter_paper");
                    var letter_titlename = $(".letter_titlename");
                    var letter_word = $(".letter_word");
                    var dohomeworkname = $(".dohomeworkname,title");
                    if(data.retCode == "0000"){
                        var loginId = data.retData.loginId;
                        var clickka = {}
                        clickka.startTime = data.retData.startTime;
                        clickka.loginId = loginId;
                        clickka.id = Request.id;
                        var clickka = sessionStorage.setItem("clickka",JSON.stringify(clickka));
                        var content = data.retData.content;
                        var title = data.retData.title;
                        letter_titlename.text(title);
                        dohomeworkname.text(title);
                        if(typeof(data.retData.content)!='undefined'){
                            var str=''
                            str=data.retData.content;
                            str=str.replace(/\&lt;/g,'<')
                            str=str.replace(/\&gt;/g,'>')
                            str=str.replace(/\&quot;/g,'"')
                            str=str.replace(/\&amp;quot;/g,'"')
                            str=str.replace(/\&amp;nbsp;/g, "");
                            str=str.replace(/\&amp;#39;/g,"'");
                            letter_paper.html(str);
                        }
                        else {
                            letter_paper.html('暂无数据');
                        }
                    }else{
                        $(".letter,.letter_funtion").hide();
                        $(".Com_Main").css({"min-heihgt":"550px"});
                        $(".nothing").show();
                    }
                    _this.getCss();
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
        },
        teacherRedmine : function(data){//老师的要求
            if(data.retData.assign == null || data.retData.assign.requirement == ""){
                var requirement = "暂无要求";
                $(".letter_teacherword").hide();
            }else{
                var requirement = data.retData.assign.requirement;
            }
            $(".letter_teacherword").on("click",function(){
                $(".shark").fadeIn();
                $(".teacher_redmineword").text(requirement);
            })
            $(".teacher_redmineClose").on("click",function(){
                $(".shark").fadeOut();
            })
        },
        share : function(){
            /*分享*/
            $('.letter_nosh').hover(function(){
                $(this).attr("src","../../static/image/test/test_sh.png");
            },function(){
                $(this).attr("src","../../static/image/test/test_nosh.png");
            })
            $('.letter_nosh').on('click',function(){
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
                var ArticleData={};
                ArticleData.resId=Request.id;
                $.ajax({
                    "type": "post",
                    "url": "/web/common/res/share",
                    "dataType":'json',
                    "data": ArticleData,
                    success: function (data) {
                        //GoldAnimate(data.retGold);
                    }
                });

            };
        }
    }
    letters.init();
})





