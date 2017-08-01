/**
 * Created by lichao on 2017/2/9.
 */
$(document).ready(function(){
    var letters = {
        init : function(){
            this.share();//分享
            var s = Request.IsShare;
            if(window.location.hash!=''){
                $(".Com_Header,.Com_Crumbs,.letter_teacherword,.letter_funtion").hide();
            }
            var parmas = {};
            parmas.id = Request.id;
            //parmas.loginInfo = Request.navigator;
            this.getLetters(parmas);
        },
        getLetters : function(parmas){
            var _this = this;
            $.ajax({
                type : "post",
                url : "/web/student/homework/write/queryPaperById",
                data : parmas,
                dataType : "json",
                success : function(data){
                    var letter_paper = $(".letter_paper");
                    var letter_titlename = $(".letter_titlename");
                    var dohomeworkname = $(".dohomeworkname,title");
                    var letter_ka = $(".letter_ka");
                    var letter_word = $(".letter_word");
                    var letter_ka = $(".letter_ka");
                    if(data.retCode == "0000"){
                        var status = data.retData.resPaperUser.status;
                        var useTime = data.retData.resPaperUser.useTime;
                        var loginId = data.retData.loginId;
                        var clickka = {}
                        //clickka.startTime = data.retData.startTime;
                        clickka.loginId = loginId;
                        clickka.id = Request.id;
                        var clickka = sessionStorage.setItem("clickka",JSON.stringify(clickka));
                        var content = data.retData.article.content;
                        var title = data.retData.article.title;
                        letter_titlename.text(title);
                        dohomeworkname.text(title);
                        if(data.retData.article.subtitle == "" || data.retData.article.subtitle == null){

                        }else{
                            $(".auther").text("作者："+data.retData.article.subtitle);
                        }
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
                        _this.clickKa()//打卡
                        if(status == "6" || status == 6){
                            letter_ka.text("已读");
                            letter_word.css("display","inline-block");
                            letter_ka.unbind("click");
                            $(".letter_word").css("display","inline-block").text(ToComTime(useTime));
                        }
                    }else{
                        $(".letter,.letter_funtion").hide();
                        $(".Com_Main").css({"min-height":"550px"});
                        $(".nothing").show();
                    }
                    _this.teacherRedmine(data);
                    //_this.testTime();//时间计时
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        teacherRedmine : function(data){
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
        testTime : function(){//时间计时
            var start = new Date();//开始时间
            function timer(){
                var now = new Date();
                ts = now.getTime() - start.getTime();
                var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
                var mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
                var ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数
                hh = checkTime(hh);
                mm = checkTime(mm);
                ss = checkTime(ss);
                document.getElementById("s_paper_hour").value = hh;
                document.getElementById("s_paper_min").value = mm;
                document.getElementById("s_paper_second").value = ss;
            }
            function checkTime(i){
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }
            t = setInterval(timer,1000);
        },
        clickKa : function(){
            $(".letter_ka").on("click",function(){
                var clickka = JSON.parse(sessionStorage.getItem("clickka"));
                var parmas = clickka;
                $.ajax({
                    type : "post",
                    url : "/web/student/homework/write/updateReadingState",
                    data : parmas,
                    dataType : "json",
                    success : function(data){
                        if(data.retCode == "0000"){
                            var useTime = data.retData.useTime;
                            var financeTips = data.retData.financeTips;
                            if(financeTips){
                                GoldAnimate(financeTips);
                            }
                            $(".letter_word").css("display","inline-block").text(ToComTime(useTime)).show();
                            $(".letter_ka").css({"background":"#ccc"}).text("已读");
                            $(".letter_ka").unbind("click");
                        }else{
                            $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
                        }
                    },
                    error : function(e){
                        console.log(e)
                    }
                })
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
