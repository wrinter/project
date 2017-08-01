/**
 * Created by lichao on 2017/3/13.
 */
PlayerFixed()
function PlayerFixed(){
    setInterval(function(){
        var Istop=$(document).scrollTop()+$(window).height()-60;
        $('#lession').css('top',Istop);
    },1)
}


$(document).ready(function(){
    var letters = {
        init : function(){
            this.share();//分享
            var s = Request.IsShare;
            var parmas = {};
            parmas.id = Request.id;
            //parmas.loginInfo = Request.navigator;
            this.getLetters(parmas);
            if(window.location.hash!=''){
                $(".letter_name,.letter_funtion,.Com_Header,.Com_Crumbs").hide();
                $(".letter_chinese").show();
                $( 'audio' ).PhoneaudioPlayer();
            }else{
                $( 'audio' ).audioPlayer();
            }
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
                    var Phone_acticle = $(".Phone_acticle");
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
                        var resFileId = data.retData.article.resFileId;
                        var contentTrans = data.retData.article.contentTrans;
                        _this.getUrl(resFileId);//获取url;
                        if(contentTrans == null){
                            $(".letter_chinese").text("暂无翻译");
                        }else{
                            _this.contentTrans(data);//翻译;
                        }
                        if(data.retData.article.subtitle == "" || data.retData.article.subtitle == null){

                        }else{
                            $(".auther").text("作者："+data.retData.article.subtitle);
                        }
                        letter_titlename.text(title);
                        dohomeworkname.text(title);
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
                            Phone_acticle.html(str);
                        }else {
                            letter_paper.html('暂无数据');
                            Phone_acticle.html('暂无数据');
                        }
                        _this.clickKa()//打卡
                        if(status == "6" || status == 6){
                            letter_ka.css({"background":"#ccc"}).text("已读");
                            letter_word.css("display","inline-block");
                            letter_ka.unbind("click");
                            $(".letter_word").css("display","inline-block").text(ToComTime(useTime));
                        }
                    }else{
                        $(".letter,.letter_funtion,.audioplayer").hide();
                        $(".Com_Main").css({"min-height":"550px"});
                        $(".nothing").show();
                    }
                    _this.teacherRedmine(data);
                    _this.clickTrans();
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        contentTrans : function(data){//翻译
            var letter_chinese = $(".letter_chinese");
            var tans_actilce = $(".tans_actilce");
            if(typeof(data.retData.article.contentTrans)!='undefined'){
                var str=''
                str=data.retData.article.contentTrans;
                str=str.replace(/\&lt;/g,'<')
                str=str.replace(/\&gt;/g,'>')
                str=str.replace(/\&quot;/g,'"')
                str=str.replace(/\&amp;quot;/g,'"')
                str=str.replace(/\&amp;nbsp;/g, "");
                str=str.replace(/\&amp;#39;/g,"'");
                letter_chinese.html(str);
                tans_actilce.html(str);
            }else{
                letter_chinese.html("暂无数据");
                tans_actilce.html("暂无数据");
            }
        },
        clickTrans: function(data){
            $(".click_look").on("click",function(){
                if($(this).hasClass("click")){
                    $(this).addClass("letter_close").removeClass("click");
                    $(".letter_chinese").show();
                    $(this).find(".text_li").html("收起翻译");
                    $(this).find('.ArrowsFont').css({'animation':'change 0.3s linear 1 forwards'});
                }else{
                    $(this).addClass("click").removeClass("letter_close");
                    $(".letter_chinese").hide();
                    $(this).find(".text_li").html("查看翻译");
                    $(this).find('.ArrowsFont').css({'animation':''});
                }
            })
        },
        getUrl : function(resFileId){
            var s = Request.IsShare;
            var parmas = {};
            parmas.fileId = resFileId;
            $.ajax({
                type : "post",
                url :"/web/common/baidu/view",
                data :parmas,
                dataType : "json",
                success : function(data){
                    if(data.retCode == "0000"){
                        $("#audio").attr("src",data.retData);
                    }
                    if(window.location.hash!=''){
                        $("#timeCurrent,#timeDuration,.audioplayer-time").css({"font-size":"18px"});
                    }
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
            })
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
                    }
                });

            };
        }
    }
    letters.init();
})

