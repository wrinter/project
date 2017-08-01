/**
 * Created by zxl on 2017/5/4.
 */
$(function() {
    GetHtml("../../model/common/Head.txt", "#Com_Head");//引入导航
    CheckBrower();
    function Report(id,paperId){
        this.id=id;
        this.paperId=paperId;
    }
    Report.prototype= {
        init: function () {
            if (window.location.hash != '') {
                $(".Com_Header,.Com_Crumbs,.r_teacherword,.r_funtion").hide();
                browserRedirect();
                $( 'audio' ).PhoneaudioPlayer();
                $('.r_chinese').show();
                this.afterShare();
            } else {
                $( 'audio' ).audioPlayer();
                this.getArticle();
            }
        },
        getArticle: function () {
            $.ajax({
                type: "post",
                url: "/web/student/homework/report/getUserPaperReport",
                data: {id: this.id},
                dataType: "json",
                success: function (data) {
                    showArticle(data);
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
            });
        },
        afterShare: function() {
            $.ajax({
                type: "post",
                url: "/web/shareresource/toartical ",
                dataType: "json",
                data: {'id':this.paperId},
                success: function (data) {
                    showShareArticle(data);
                }
            });
        },
        getUrl : function(resFileId){
            var parmas = {};
            parmas.fileId = resFileId;
            $.ajax({
                type : "post",
                url :"/web/common/baidu/view",
                data :parmas,
                dataType : "json",
                success : function(data){
                    $("#audio").attr("src",data.retData);
                    if(window.location.hash!=''){
                        $("#timeCurrent,#timeDuration,.audioplayer-time").css({"font-size":"18px"});
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        CommongetUrl : function(a,b){
            var parmas = {};
            parmas.objectKey = a;
            parmas.bucketName = b;
            parmas.expirationInSeconds = -1;
            $.ajax({
                type : "post",
                url :"/web/common/baidudownload",
                data :parmas,
                success : function(data){
                    var $VioceSrc= data;
                    $("#audio").attr("src",$VioceSrc);
                    if(window.location.hash!=''){
                        $("#timeCurrent,#timeDuration,.audioplayer-time").css({"font-size":"18px"});
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        }
    }
    function showArticle(data){
        if(data.retCode=="0000"){
            var loginId = data.retData.loginId;
            var clickka = {}
            clickka.startTime = data.retData.startTime;
            clickka.loginId = loginId;
            clickka.id = Request.id;
            var clickka = sessionStorage.setItem("clickka",JSON.stringify(clickka));
            var r_detail= $(".r_detail");
            var r_name= $(".letter_titlename");
            var r_chinese =$('.r_chinese');
            var article = data.retData.article;
            var resPaperUser = data.retData.resPaperUser;
            var content = article.content;
            var contenTrans = article.contentTrans;
            var resFileId = data.retData.article.resFileId;
            readReport.getUrl(resFileId);
            $('title').html('《'+article.title+'》');
            r_name.html(article.title);
            if(data.retData.article.subtitle == "" || data.retData.article.subtitle == null){

            }else{
                $(".auther").text("作者："+data.retData.article.subtitle);
            }
            $('.Com_Crumbs_in span').html(article.title);
            //文章
            if(typeof(content)!='undefined'){
                var str=content;
                str=str.replace(/\&lt;/g,'<')
                str=str.replace(/\&gt;/g,'>')
                str=str.replace(/\&quot;/g,'"')
                str=str.replace(/\&amp;quot;/g,'"')
                str=str.replace(/\&amp;nbsp;/g, "");
                str=str.replace(/\&amp;#39;/g,"'");
                r_detail.html(str);
                var r_word=$('.r_word');
                var time = "用时:"+ToTime(resPaperUser.useTime);
                r_word.html(time);
                contenTrans=contenTrans.replace(/\&lt;/g,'<')
                contenTrans=contenTrans.replace(/\&gt;/g,'>')
                contenTrans=contenTrans.replace(/\&quot;/g,'"')
                contenTrans=contenTrans.replace(/\&amp;quot;/g,'"')
                contenTrans=contenTrans.replace(/\&amp;nbsp;/g, "");
                contenTrans=contenTrans.replace(/\&amp;#39;/g,"'");
                r_chinese.html(contenTrans);
            }else {
                r_detail.html('暂无数据');
                r_chinese.html('暂无数据');
            }
        }

    }
    function showShareArticle(data){
        if(data.retCode=="0000"){
            var r_detail= $(".r_detail");
            var r_name= $(".r_titlename");
            var content = data.retData.content;
            var contenTrans = data.retData.contentTrans;
            var r_chinese =$('.r_chinese');
            var a = data.retData.objectKey;
            var b = data.retData.bucketName;
            readReport.CommongetUrl(a,b);//获取url;
            $('title').html('《'+data.retData.title+'》');
            r_name.html(data.retData.title);
            //文章
            if(typeof(content)!='undefined'){
                var str=content;
                str=str.replace(/\&lt;/g,'<')
                str=str.replace(/\&gt;/g,'>')
                str=str.replace(/\&quot;/g,'"')
                str=str.replace(/\&amp;quot;/g,'"')
                str=str.replace(/\&amp;nbsp;/g, "");
                str=str.replace(/\&amp;#39;/g,"'");
                r_detail.html(str);
                contenTrans=contenTrans.replace(/\&lt;/g,'<')
                contenTrans=contenTrans.replace(/\&gt;/g,'>')
                contenTrans=contenTrans.replace(/\&quot;/g,'"')
                contenTrans=contenTrans.replace(/\&amp;quot;/g,'"')
                contenTrans=contenTrans.replace(/\&amp;nbsp;/g, "");
                contenTrans=contenTrans.replace(/\&amp;#39;/g,"'");
                r_chinese.html(contenTrans);
            }else {
                r_detail.html('暂无数据');
            }
        }
    }
    function browserRedirect(){
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
            $(".Com_Header,.Com_Crumbs,.r_teacherword,.r_funtion").hide();
            readReport.afterShare();
        } else {
            CheckBrower();
        }
    }
    $('.r_nosh').hover(function(){
        $(this).attr("src","../../static/image/test/test_sh.png");
    },function(){
        $(this).attr("src","../../static/image/test/test_nosh.png");
    })
    $('.r_nosh').on('click',function(){
        $('#Share').fadeIn(150);
    });
    $("#ShareClose").on("click",function(){
        $('#Share').fadeOut(150);
    });
    $(".r_transform").on("click",function(){
        if($(this).hasClass("click")){
            $(this).addClass("letter_close").removeClass("click");
            $(".r_chinese").show();
            $(this).find(".r_totrans").html("收起翻译");
            $(this).find('.ArrowsFont').css({'animation':'change 0.3s linear 1 forwards'});
        }else{
            $(this).addClass("click").removeClass("letter_close");
            $(".r_chinese").hide();
            $(this).find(".r_totrans").html("查看翻译");
            $(this).find('.ArrowsFont').css({'animation':''});
        }
    })
    var readReport=new Report(Request.id,Request.paperId);
    readReport.init();
});