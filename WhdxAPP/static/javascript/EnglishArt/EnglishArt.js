/****************************************Created by 徐扬 on 2016/12/7.*****************************************/
/********************************************获取导航***********************************************/
var ArticleUuid =Request.uuid;
var ArticleId =Request.id;
var s =Request.s;
var m =Request.m;
//分享判断显示
if( s == "1" ||s == 1){
    $(".e_Recommendbtn,.Goback").show();
}else{
    $(".e_Recommendbtn,.Goback").hide();
    $(".c_Article").css({"padding-top":"0"});
}
//分享判断显示
if( m == "0"|| m == 0){
    $("#Music").hide();
}else{
    $("#Music").show();
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
            console.log(data)
            var AllData=data.retData;
            CreatArtBox(AllData);
            GetVoice(AllData.objectKey,AllData.bucketName);
        }
    });
};
GetArticle(ArticleId,ArticleUuid);
/*创建文章盒子，将文章插到页面中*/
function CreatArtBox(data){
    if(data==null){return false;}
    if(data.subtitle == null || data.subtitle == ""){
    }else{
        $(".auother").text("—— "+data.subtitle);
    }
    var $ArtHtml='';
    $ArtHtml+='<span class="artid dino" id="artid">'+data.id+'</span>';
    $('#Title').html(data.title);
    $('.titlename').html(data.title);
    $('#a_ArtTitle').html($ArtHtml);
    var content=data.content;
    content=content.replace(/\&lt;/g,'<');
    content=content.replace(/\&amp;#39;/g,'´');
    content=content.replace(/\&gt;/g,'>');
    content=content.replace(/\&quot;/g,'"');
    content=content.replace(/\&amp;quot;/g,'"');
    content=content.replace(/\&amp;nbsp;/g, "");
    $('#e_IsEnglishContent').html(content);
    var contentTrans=data.contentTrans;
    contentTrans=contentTrans.replace(/\&lt;/g,'<');
    contentTrans=contentTrans.replace(/\&gt;/g,'>');
    contentTrans=contentTrans.replace(/\&amp;#39;/g,'´');
    contentTrans=contentTrans.replace(/\&quot;/g,'"');
    contentTrans=contentTrans.replace(/\&amp;quot;/g,'"');
    contentTrans=contentTrans.replace(/\&amp;nbsp;/g, "");
    $('#e_IsTransEnglish').html(contentTrans);
};
/*实例化*/
var Music=new IsCanPaly();
/*翻译收起展开*/
$('#e_IsTrans').on('click',function(){
    if($(this).hasClass('trans-add')){
        $('#e_IsTransImg').attr('src',"../../static/image/EnglishArt/e_IsEngico0.png");
        $('#e_IsTransT').html('翻译');
        $(this).removeClass('trans-add');
        $('#e_IsTransEnglish').slideUp(200);
    }
    else {
        $('#e_IsTransImg').attr('src',"../../static/image/EnglishArt/e_IsEngico1.png");
        $('#e_IsTransT').html('收起');
        $(this).addClass('trans-add');
        $('#e_IsTransEnglish').slideDown(200);
    }
});
/*获取音频*/
function GetVoice(a,b){
    var $ImgSrc='';
    var ImgData={};
    ImgData.objectKey=a;
    ImgData.bucketName=b;
    ImgData.expirationInSeconds=1140;
    $.ajax({
        "type": "post",
        "url": "/api/common/baidudownloadWeb",
        "data": ImgData,
        success: function (data) {
            $ImgSrc= data.retData;
            $('audio').attr('src',$ImgSrc);
        }
    });
};
$(function($) {
    $( 'audio' ).audioPlayer();
    $(".playlist ").on("click",function(){
        $(".audioplayer").removeClass().addClass("audioplayer audioplayer-stopped");
        $(".audioplayer-bar-played").css("width","0");
        $(".audioplayer-time").html("00:00");
    });
});
/*分享*/
$('.c_share').on('click',function(){
    javascript:bc.share();
})
/*推荐*/
$('#c_Recommon').on('click',function(){
    javascript:bc.recommend2cls();
})
$('.c_back').click(function(){
    javascript:bc.back();
})
//window.onload=function(){
//    Music.EngPlay();
//}
////播放
//Music.EngStop();//暂停










