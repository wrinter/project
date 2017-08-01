/****************************************Created by 徐扬 on 2016/12/7.*****************************************/
/********************************************获取导航***********************************************/
var ArticleUuid =Request.uuid;
var ArticleId =Request.id;
var s =Request.s;
//var s =1;
//分享判断显示
if( s == "1" ){
    //if(!$(".c_Main").find(".c_BotBox")){
        $(".c_back").show();
        $(".c_share").show();
        $("#a_ArtTitle,.titlename").show();//题目
    //}else{
        $(".c_BotBox,.Goback").show();
    //}
}else{
    //if(!$(".c_Main").find(".c_BotBox")){
        $(".c_back").hide();
        $(".c_share").hide();
        $("#a_ArtTitle,.titlename").hide();//题目
    //}else{
        $(".c_BotBox,.Goback").hide();
        $(".c_Article").css({"padding-top":"0"});
    //}
}
Css();
function Css(){//公共样式
    $.ajax({
        type:"post",
        url:"/api/common/commonStyle",
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
/*测试id*/
/*获取英文*/
function GetArticle(id,uuid){
    var ArticleData={};
    ArticleData.uuid=uuid;
    ArticleData.id=id;
    $.ajax({
        "type": "post",
        "url": "/api/teacher/catlogarticle/article",
        "dataType":'json',
        "data": ArticleData,
        success: function (data) {
            var AllData=data.retData;
            CreatArtBox(AllData);
        }
    });
};
GetArticle(ArticleId,ArticleUuid);
/*创建文章盒子，将文章插到页面中*/
$('.c_back').click(function(){
    javascript:bc.back();
})
function CreatArtBox(data){
    if(data.subtitle == null || data.subtitle == ""){
    }else{
        $(".auother").text("作者: "+data.subtitle);
    }
    $("#a_ArtTitle").text(data.title);
    var $ArtHtml='';
    $ArtHtml+='<span class="artid dino" id="artid">'+data.id+'</span>';
    $('#Title').html(data.title)
    $('#a_ArtTitle').html(data.title);
    var content=data.content;
    content=content.replace(/\&lt;/g,'<');
    content=content.replace(/\&amp;#39;/g,'´');
    content=content.replace(/\&gt;/g,'>');
    content=content.replace(/\&quot;/g,'"');
    content=content.replace(/\&amp;quot;/g,'"');
    content=content.replace(/\&amp;nbsp;/g, "");
    $('#c_ArticleContent').html(content);
};
/*分享*/
$('.c_share').on('click',function(){
    javascript:bc.share();
})
/*推荐*/
$('#c_Recommon').on('click',function(){
    javascript:bc.recommend2cls();
})







