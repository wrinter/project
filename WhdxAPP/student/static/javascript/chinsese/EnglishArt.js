/****************************************Created by 徐扬 on 2016/12/7.*****************************************/
/********************************************获取导航***********************************************/
/*获取英文*/
GetArticle()
var s =Request.s;
//var s =1;
//分享判断显示
if( s == "1" ){
    //if(!$(".c_Main").find(".c_BotBox")){
    $(".c_back").show();
    $(".c_share").show();
    $("#a_ArtTitle").show();//题目
    //}else{
    $(".c_BotBox,.Goback").show();
    //}
}else{
    //if(!$(".c_Main").find(".c_BotBox")){
    $(".c_back").hide();
    $(".c_share").hide();
    $("#a_ArtTitle").hide();//题目
    //}else{
    $(".c_BotBox,.Goback").hide();
    $(".c_Article").css({"padding-top":"0"});
    //}
}
function GetArticle(id){
    var ArticleData={};
    ArticleData.id=Request.id;
    $.ajax({
        "type": "post",
        "url": "/api/student/extended/appArticleDetails",
        "dataType":'json',
        "data": ArticleData,
        success: function (data) {
            console.log(data)
            var AllData=data.retData;
            CreatArtBox(data);
            //CreatCar(AllData.resPaperUser)
            //CreatRequireTxt(AllData.resPaperUser)
        }
    });
};
/*创建文章盒子，将文章插到页面中*/
function CreatArtBox(data){
    if(data==null){return false;}
    if(data.retData.subtitle == null || data.retData.subtitle == ""){
    }else{
        $(".auother").text("—— "+data.retData.subtitle);
    }
    var $ArtHtml='';
    $('#a_ArtTitle,title').html(data.retData.title);
    var content=data.retData.content;
    content=content.replace(/\&lt;/g,'<');
    content=content.replace(/\&amp;#39;/g,'´');
    content=content.replace(/\&gt;/g,'>');
    content=content.replace(/\&quot;/g,'"');
    content=content.replace(/\&amp;quot;/g,'"');
    content=content.replace(/\&amp;nbsp;/g, "");
    $('#e_IsEnglishContent').html(content);
    var contentTrans=data.retData.contentTrans;
    if(contentTrans==null){
        contentTrans='暂无翻译'
    }else {
        contentTrans=contentTrans.replace(/\&lt;/g,'<');
        contentTrans=contentTrans.replace(/\&gt;/g,'>');
        contentTrans=contentTrans.replace(/\&amp;#39;/g,'´');
        contentTrans=contentTrans.replace(/\&quot;/g,'"');
        contentTrans=contentTrans.replace(/\&amp;quot;/g,'"');
        contentTrans=contentTrans.replace(/\&amp;nbsp;/g, "");
    }
    $('#e_IsTransEnglish').html(contentTrans);
};
//创建打卡
function CreatCar(data){
    var status=data.status;
    var useTime=data.useTime;
    if(status==3){
        $('#r_CarStatus').html('未读');
    }else {
        $('#r_CarStatus').html('已读');
    }
    $('#r_CarTime').html('用时：'+ToComTime(useTime));
};
//转换时间
function ToTime(value) {
    var Second = parseInt(value);// 秒
    var Minute = 0;// 分
    var result;
    if(Second<60){
        result =Second+'秒';//秒
    }else {
        result=Math.round(Second/60)+'分钟'
    }
    return result;
};
/*翻译收起展开*/
$('#e_IsTrans').on('click',function(){
    if($(this).hasClass('trans-add')){
        $('#e_IsTransImg').attr('src',"../../static/image/read/e_IsEngico0.png");
        $('#e_IsTransT').html('翻译');
        $(this).removeClass('trans-add');
        $('#e_IsTransEnglish').slideUp(200);
    }
    else {
        $('#e_IsTransImg').attr('src',"../../static/image/read/e_IsEngico1.png");
        $('#e_IsTransT').html('收起');
        $(this).addClass('trans-add');
        $('#e_IsTransEnglish').slideDown(200);
        javascript:bc.openTrans();
    }
});
/*分享*/
$('.c_share').on('click',function(){
    javascript:bc.share();
})
$('.c_back').click(function(){
    javascript:bc.back();
})
//创建教师要求
function CreatRequireTxt(data){
    var requireMent=data.requireMent;
    if(requireMent==null){
        requireMent='暂无'
    }
    $('#r_RequireTxt').html(requireMent);
    RequireOp()
}
function RequireOp(){
    $('#r_Require').on('click',function(){
        if($(this).hasClass('Has')){
            $('#r_RequireBox').animate({right:'-10rem'},300)
            $(this).attr('src','../../static/image/common/require.png').removeClass('Has');
        }else {
            $('#r_RequireBox').animate({right:'1rem'},500)
            $(this).attr('src','../../static/image/common/kolaico.png').addClass('Has');
        }

    })

}











