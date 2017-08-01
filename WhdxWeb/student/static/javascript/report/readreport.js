/**
 * Created by Administrator on 2017/4/18.
 */
$(function() {
    GetHtml("../../model/common/Head.txt", "#Com_Head");//引入导航
    CheckBrower();
    function ReadReport(id,paperId){
        this.id=id;
        this.paperId=paperId;
    }
    ReadReport.prototype={
        init:function(){
            if(window.location.hash!=''){
                $(".Com_Header,.Com_Crumbs,.r_function").hide();
                browserRedirect();
                this.afterShare();
            }else{
                this.getArticle();
            }
        },
        getArticle:function(){
            $.ajax({
                type: "post",
                url: "/web/student/homework/report/getUserPaperReport",
                data: {id:this.id},
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
        }
    }
    function showArticle(data){
        if(data.retCode=="0000"){
            var r_detail= $(".r_detail");
            var r_name= $(".letter_titlename");
            var article = data.retData.article;
            var resPaperUser = data.retData.resPaperUser;
            var content = article.content;
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

            }else {
                r_detail.html('暂无数据');
            }
        }

    }
    function showShareArticle(data){
        if(data.retCode=="0000"){
            var r_detail= $(".r_detail");
            var r_name= $(".r_titlename");
            var content = data.retData.content;
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
                $('.share').hide();
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
    var readReport=new ReadReport(Request.id,Request.paperId);
    readReport.init();
});
