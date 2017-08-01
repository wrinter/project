/********************************************意见反馈**Created by Echonessy on 2017/6/1.****************************************************/
ShowWeixinCode();
$('.NavLogo').click(function(){
    window.location.href='/index.html';
})
//获取知识点
Menu();
function Menu(){
    var ProblemsList = $(".ProblemsList");
    ProblemsList.html("");
    $.ajax({
        type : "post",
        url : "/web/common/help/menu",
        dataType : "json",
        success : function(data){
            console.log(data)
            if(data.retCode == "0000"){
                for(var i = 0 ; i <data.retData.length; i++){
                    var Dtrue = data.retData[i];
                    var categoryName = Dtrue.categoryName;
                    var categoryId = Dtrue.categoryId;
                    var list = Dtrue.list;
                    var H_objlist = $("<div class='H_objlist'></div>").appendTo(ProblemsList);
                    var H_showname = $("<div class='H_showname' categoryId='"+categoryId+"'><span class='H_listname' >"+categoryName+"</span></div>").appendTo(H_objlist);
                    var bc = $("<span class='bc_g'></span>").appendTo(H_showname);
                    if(list.length == 0 || list == null){
                        return false;
                    }else{
                        var H_ul = $("<ul class='H_ul'>").appendTo(H_objlist);
                        for(var j = 0 ; j< Dtrue.list.length;j++){
                            var lDtrue = Dtrue.list[j];
                            var categoryName = lDtrue.categoryName;
                            var categoryId = lDtrue.categoryId;
                            var articleId = lDtrue.articleId;
                            var H_li = $("<li class='H_li' categoryId='"+categoryId+"' articleId='"+articleId+"' categoryName='"+categoryName+"'>"+categoryName+"</li>").appendTo(H_ul);
                            H_li.on("click",function(){
                                $(this).addClass("addcolor");//.css({"color":"#00ce9f"});
                                $(this).siblings(".H_li").removeClass("addcolor");//.css({"color":"#333"});
                                $(this).closest(".H_objlist").siblings(".H_objlist").find(".H_li").removeClass("addcolor");//.css({"color":"#333"});//其他变色
                                var articleId = $(this).attr("articleId");
                                var categoryId = $(this).attr("categoryId");
                                var categoryName = $(this).attr("categoryName");
                                if(articleId == null || articleId == "null" ){
                                    var parmas = {};
                                    parmas.categoryId = categoryId;
                                    Three(parmas);//三级菜单
                                    $(".H_show").text(categoryName);
                                }else{
                                    var parmas = {};
                                    parmas.articleId = articleId;
                                    Article(parmas);//文章
                                    $(".H_show").text(categoryName);
                                }
                            });//问题点击
                        }
                    }
                }
                //默认第一个变化
                $(".H_objlist").eq(0).find(".H_ul").show();//默认第一个展开
                $(".H_objlist").eq(0).find(".H_li").eq(0).addClass("addcolor");//默认第一个颜色
                $(".H_objlist").eq(0).find(".H_showname").addClass("add").css({"color":"#fff"});//默认第一个颜色
                $(".H_objlist").eq(0).find(".bc_g").addClass("bc");//上三角图片
                $(".H_objlist").eq(0).find(".bc").removeClass("bc_g");//上三角图片
                var articleId = $(".H_objlist").eq(0).find(".H_li").eq(0).attr("articleId");
                var categoryName = $(".H_objlist").eq(0).find(".H_li").eq(0).attr("categoryName");
                if(articleId == "null" || articleId == null){
                    var parmas = {};
                    parmas.categoryId = categoryId;
                    $(".H_show").text(categoryName);
                    Three(parmas);//获取三级菜单
                }else{
                    var parmas = {};
                    parmas.articleId = articleId;
                    $(".H_show").text(categoryName);
                    Article(parmas);//获取第一个文章
                }
                $(".H_showname").on("click",function(){
                    $(this).addClass("add").css({"color":"#fff"});//变色
                    $(this).parent(".H_objlist").siblings(".H_objlist").find(".H_showname").removeClass("add").css({"color":"#333"});//其他变色
                    $(this).find(".bc_g").addClass("bc");//上三角图片
                    $(this).find(".bc").removeClass("bc_g");//上三角图片
                    $(this).parent(".H_objlist").siblings(".H_objlist").find(".bc").addClass("bc_g");//其他变色
                    $(this).parent(".H_objlist").siblings(".H_objlist").find(".bc_g").removeClass("bc");//其他变色
                    $(this).parent(".H_objlist").siblings(".H_objlist").find(".H_ul").hide();//其他收起
                    $(this).parent().find(".H_ul").show();
                })//分类点击
            }
        },
        error : function(e){
            console.log(e)
        }
    })
}
//三级菜单
function Three(parmas){
    var H_conT = $(".H_conT");
    H_conT.html("");
    var H_con = $(".H_con");
    $.ajax({
        type : "post",
        url :  "/web/common/help/getHelpArticle",
        data : parmas,
        dataType : "json",
        success : function(data){
            console.log(data)
            if(data.retCode == "0000"){
                H_con.hide();
                H_conT.show();
                for(var i = 0;i<data.retData.length;i++){
                    var Dtrue =data.retData[i];
                    var articleId = Dtrue.articleId;
                    var title = Dtrue.title;
                    var H_litree = $("<li class='H_litree' articleId='"+articleId+"' title='"+title+"'><span class='radios'></span>"+title+"</li>").appendTo(H_conT);
                    H_litree.on("click",function(){
                        var articleId = $(this).attr("articleId");
                        var title = $(this).attr("title");
                        $(".H_show").text(title);
                        var parmas = {};
                        parmas.articleId = articleId;
                        Article(parmas);//三级文章
                    })
                }
            }
        },
        error : function(e){
            console.log(e)
        }
    })
}
//获取文章
function Article(parmas){
    var H_con = $(".H_con");
    var H_conT = $(".H_conT");
    $.ajax({
        type : "post",
        url :  "/web/common/help/content",
        data : parmas,
        dataType : "json",
        success : function(data){
            console.log(data)
            H_con.show();
            H_conT.hide();
            if(data.retCode == "0000"){
                H_con.html(data.retData)
            }
        },
        error : function(e){
            console.log(e)
        }
    })
}
