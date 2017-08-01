/****************************************Created by 徐扬 on 2016/12/7.*****************************************/
/********************************************获取导航***********************************************/
/*获取英文*/
GetArticle()
function GetArticle(id){
    var ArticleData={};
    ArticleData.id=Request.id;
    $.ajax({
        "type": "post",
        "url": "/api/student/homework/report/getUserPaperReport",
        "dataType":'json',
        "data": ArticleData,
        success: function (data) {
            var AllData=data.retData;
            CreatArtBox(AllData.article)
            CreatCar(AllData.resPaperUser)
            CreatRequireTxt(AllData.resPaperUser)
        }
    });
};
/*创建文章盒子，将文章插到页面中*/
function CreatArtBox(data){
    if(data==null){return false;}
    if(data.subtitle == null || data.subtitle == ""){
    }else{
        $(".auother").text("—— "+data.subtitle);
    }
    var $ArtHtml='';
    $('#a_ArtTitle').html(data.title);
    var content=data.content;
    content=content.replace(/\&lt;/g,'<');
    content=content.replace(/\&amp;#39;/g,'´');
    content=content.replace(/\&gt;/g,'>');
    content=content.replace(/\&quot;/g,'"');
    content=content.replace(/\&amp;quot;/g,'"');
    content=content.replace(/\&amp;nbsp;/g, "");
    $('#e_IsEnglishContent').html(content);
    var contentTrans=data.contentTrans;
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
        $('.r_Car').html('未读');
    }else {
        $('.r_Car').text('已读 (用时：'+ToComTime(useTime)+')');
    }
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
    console.log(requireMent)
    if(requireMent==null||requireMent==''){
        requireMent='暂无';
        $('#r_Require').css('display','none')
    }
    else {
        $('#r_Require').css('display','')
        $('#r_RequireTxt').html(requireMent);
        RequireOp()
    }
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











