/****************************************Created by 徐扬 on 2016/12/7.*****************************************/
/********************************************获取导航***********************************************/
CheckBrower();
if(window.location.hash!=''){
    $('#Header').html('').css('display','none')
    $('#a_EngArtMenu').css('display','none')
    $('#c_Crumbs').css('display','none')
}
$(".playlist ").on("click",function(){
    $(".audioplayer").removeClass().addClass("audioplayer audioplayer-stopped");
    $(".audioplayer-bar-played").css("width","0");
    $(".audioplayer-time").html("00:00");
});
$('#ShareClose').on('click',function(){
    $('#Share').fadeOut(150)
})
browserRedirect();
CheckShare()
function CheckShare(){
    if(window.location.hash!=''){
        $('#c_Recommend').css('display','none');
        $('.c_Select').css('display','none');
        $('#a_IsTransEngLish').css('display','block');
        $('.c_Main').css('background','white');

    }else {
        $('.c_Main').css('background','');
        $('.c_ArLogo').css('display','none');
        GetHtml("../../model/common/common.txt","#Header");
        GetRefClass();
    }
}
$('#WordMode').css({display:"none"});//关闭连续播放模式
/*获取音频*/
function GetVoice(a,b){
    var $ImgSrc='';
    var ImgData={};
    ImgData.objectKey=a;
    ImgData.bucketName=b;
    ImgData.expirationInSeconds=-1;
    $.ajax({
        "type": "post",
        "url": "/web/common/baidudownload",
        "data": ImgData,
        success: function (data) {
            $ImgSrc= data;
            $('#audio').attr('src',$ImgSrc);
            $('#audio0').attr('src',$ImgSrc);
        }
    });
};
var ArticleId =Request.id;
/*获取推荐的班级*/
function GetRefClass(){
    var SubData={};
    SubData.resId=Request.id;
    $.ajax({
        "type": "post",
        "url": "/web/common/res/recommend/class",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                CreatRefClass(data.retData);
            }
        }
    });
};

/*获取英文*/
function GetArticle(id){
    var ArticleData={};
    ArticleData.id=id;
    $.ajax({
        "type": "post",
        "url": "/web/shareresource/toartical ",
        "dataType":'json',
        "data": ArticleData,
        success: function (data) {
            var AllData=data.retData;
            CreatArtBox(AllData);
            GetVoice(AllData.objectKey,AllData.bucketName);
        }
    });
};
GetArticle(ArticleId);
/*创建文章盒子，将文章插到页面中*/
function CreatArtBox(data){
    if(data.subtitle == "" || data.subtitle == null){

    }else{
        $(".auther").text("——"+data.subtitle);
    }
     var $ArtHtml='';
    $ArtHtml+='<span class="artid dino" id="artid">'+data.id+'</span>';
    $('#Title').html('《'+data.title+'》');
    $('#a_ArtTitle').html($ArtHtml);
    if(typeof(data.content)!='undefined'){
        var Title=data.title;
        $('#a_IsEngTitlt0').html(Title)
        $('#a_IsEngTitlt1').html(Title)
        var content=data.content;
        content=content.replace(/\&lt;/g,'<');
        content=content.replace(/\&amp;#39;/g,'´');
        content=content.replace(/\&gt;/g,'>');
        content=content.replace(/\&quot;/g,'"');
        content=content.replace(/\&amp;quot;/g,'"');
        content=content.replace(/\&rsquo;/g,"'");
        content=content.replace(/\&amp;nbsp;/g," ");
        content=content.replace(/\&rsquo;/g,"'");
        content=content.replace(/\&lsquo;/g,"'");
        $('#a_IsEngLish').html(content);
        $('#a_IsEngLish0').html(content);
    }
    else {
        $('#a_IsEngLish').html("暂无数据");
        $('#a_IsEngLish0').html("暂无数据");
    }
    if(typeof(data.content)!='undefined'){
        var contentTrans=data.contentTrans;
        contentTrans=contentTrans.replace(/\&lt;/g,'<');
        contentTrans=contentTrans.replace(/\&gt;/g,'>');
        contentTrans=contentTrans.replace(/\&amp;#39;/g,'´');
        contentTrans=contentTrans.replace(/\&quot;/g,'"');
        contentTrans=contentTrans.replace(/\&amp;quot;/g,'"');
        contentTrans=contentTrans.replace(/\&amp;nbsp;/g," ");
        contentTrans=contentTrans.replace(/\&rsquo;/g,"'");
        contentTrans=contentTrans.replace(/\&lsquo;/g,"'");
        $('#a_IsTransEngLish').html(contentTrans);
        $('#a_IsTransEngLish0').html(contentTrans);

    }
    else {
        $('#a_IsTransEngLish').html('暂无数据');
        $('#a_IsTransEngLish0').html('暂无数据');
    }
    IsPostsArt();
};
/*上一篇下一篇封装*/
function IsPostsArt() {
    var Obj = store.get('ArtTitle');
    if(!Obj){return false;}
    var Num=0;
    var $IsNextHtml='';
    var $IsPreHtml='';
    if(Obj.ArtId.length>1){
        for(Num;Num<Obj.ArtId.length;Num++){
            if($('#artid').html()==Obj.ArtId[Num]){
                break;
            }
        }
        if(Num==0){
            $('#isup').css('display','none');
            $('#m030').css('display','none');
            $('#isdown').css('display','block');
            $IsNextHtml+='<span class="isTitle">'+Obj.ArtName[Num+1]+'</span>';
            $IsNextHtml+='<span class="isArtId dino">'+Obj.ArtId[Num+1]+'</span>';
            $('#c_NextArt').html($IsNextHtml)
        }
        if(Num==Obj.ArtId.length-1){
            $('#isup').css('display','block');
            $('#isdown').css('display','none');
            $('#m030').css('display','none');
            $IsPreHtml+='<span class="isTitle">'+Obj.ArtName[Num-1]+'</span>';
            $IsPreHtml+='<span class="isArtId dino">'+Obj.ArtId[Num-1]+'</span>';
            $('#c_PreArt').html($IsPreHtml)
        }
        if(Num>0&&Num<Obj.ArtId.length-1){
            $('#isup').css('display','block');
            $('#m030').css('display','block');
            $('#isdown').css('display','block');
            $IsNextHtml+='<span class="isTitle">'+Obj.ArtName[Num+1]+'</span>';
            $IsNextHtml+='<span class="isArtId dino">'+Obj.ArtId[Num+1]+'</span>';
            $('#c_NextArt').html($IsNextHtml)
            $IsPreHtml+='<span class="isTitle">'+Obj.ArtName[Num-1]+'</span>';
            $IsPreHtml+='<span class="isArtId dino">'+Obj.ArtId[Num-1]+'</span>';
            $('#c_PreArt').html($IsPreHtml)
        }
    }
    else{
        $('#isup').css('display','none');
        $('#m030').css('display','none');
        $('#isdown').css('display','none');
    }
};
/*上一篇下一篇切换*/
$('.CanClick').on('click',function(){
    window.location.href='acrossenglish_voice.html?id='+$(this).find('.isArtId').html()+'';
    IsPostsArt();
    GetArticle(ArticleId);
});
/*创建推荐的班级*/
var list=[];
function CreatRefClass(data){
    var $RefClass='';
    for(var i=0;i<data.length;i++){
        if(data[i].flag!='no'){
            $RefClass+='<li class="c_RefNoCheckClass"><span class="classFullName">'+data[i].classFullName+'</span><span class="classId dino">'+data[i].classId+'</span><span class="flag dino">'+data[i].flag+'</span><span class="grade dino">'+data[i].grade+'</span><span class="className dino">'+data[i].className+'</span></li>';
        }
        else {
            if(data[i].stuNum>0){
                $RefClass+='<li class="c_RefCanCheckClass"><span class="classFullName">'+data[i].classFullName+'</span><span class="classId dino">'+data[i].classId+'</span><span class="flag dino">'+data[i].flag+'</span><span class="grade dino">'+data[i].grade+'</span><span class="className dino">'+data[i].className+'</span></li>';
            }
            else {
                $RefClass+='<li class="c_RefNoStudent"><span class="classFullName">'+data[i].classFullName+'</span><span class="classId dino">'+data[i].classId+'</span><span class="flag dino">'+data[i].flag+'</span><span class="grade dino">'+data[i].grade+'</span><span class="className dino">'+data[i].className+'</span></li>';
            }
        }
    }
    $('#c_ReferrerClass').html($RefClass);
    $('.c_RefNoCheckClass').on('click',function(){
        $('#c_ErrorMsg').html('该班级已推荐').fadeIn(200);  Disappear("#c_ErrorMsg");
    });
    $('.c_RefNoStudent').on('click',function(){
        $('#c_ErrorMsg').html('该班级无学生').fadeIn(200);  Disappear("#c_ErrorMsg");
    });
    $('.c_RefCanCheckClass').on('click',function(){
        if($(this).hasClass('c_RefCheckClass')){
            $(this).removeClass('c_RefCheckClass')
            for(var i=0;i<list.length;i++){
                if(list[i]==$(this).find('.classId').html()){
                    list.splice(i,1);
                }
            }
            var checked = $(this).siblings('.c_RefCheckClass');
            if(checked.length==0){
                $("#c_RefBtn0").css({'background':'#dfdfdf','color':'#333333'});
            }
        }
        else {
            $(this).addClass('c_RefCheckClass');
            list.push($(this).find('.classId').html());
            $("#c_RefBtn0").css({'background':'#65b113','color':'white'});
        }
    });
    if (data.length>0){
        $('#c_Recommend').on('click',function(){
            $('#Masking').fadeIn(150);
            $('body').css('overflow','hidden');
            $("#c_RefBtn0").css({'background':'#dfdfdf','color':'#333333'});
        });
    }
    else {
        $('#c_Recommend').on('click',function(){
            GoNoClass();
            $('body').css('overflow','hidden');
        });
    }
    $('#c_RefBtn1').on('click',function(){refresetdata();});
    $('#refclose').on('click',function(){refresetdata();});

};
function GoNoClass(){
    $('.AllNoHasClas').fadeIn(200)
    $('.GoClassClose').on('click',function(){$('.AllNoHasClas').fadeOut(200);$('body').css('overflow','auto');});
};
/*推荐班级数据重置*/
function refresetdata(){
    list.length=0;
    $('body').css('overflow','auto');
    $('#Masking').fadeOut(150);
    $('#c_Remark').val('');
    $('.c_RefCanCheckClass').removeClass('c_RefCheckClass');
};
$('#c_RefBtn0').on('click',function(){
    if(list.length>0){
        RefClass(list,$('#c_Remark').val());
    }else{
        $('#c_ErrorMsg').html("您还没有选中班级").fadeIn(200);  Disappear("#c_ErrorMsg");
    }
});
/*推荐班级提交*/
function RefClass(listarr,requireMent){
    var SubData={};
    SubData.classIdList=listarr;
    SubData.resId=ArticleId;
    SubData.requireMent=requireMent;
    SubData.resType='403';
    $.ajax({
        "type": "post",
        "url": "/web/common/res/recommend",
        'data': JSON.stringify(SubData),
        'contentType':"application/json;charset=utf-8",
        "dataType": "json",
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                $('#c_ErrorMsg').html('推荐成功').fadeIn(200);  Disappear("#c_ErrorMsg");
                GetRefClass();
                refresetdata();
            }
            else {
                $('#c_ErrorMsg').html('推荐失败，请重试').fadeIn(200);  Disappear("#c_ErrorMsg")
            }
        }
    });
};
/*分享*/
$('#c_Share').hover(function(){
    $(this).find('.p_shareico ').removeClass('p_shareico ').addClass('p_yetshareico');
},function(){
    $(this).find('.p_yetshareico').removeClass('p_yetshareico ').addClass('p_shareico');
})
$('#c_Share').on('click',function(){
    $('#Share').fadeIn(150);
    //AddShare();
});
function AddShare(){
    var ArticleData={};
    ArticleData.resId=Request.id;
    $.ajax({
        "type": "post",
        "url": "/web/common/res/share",
        "dataType":'json',
        "data": ArticleData,
        success: function (data) {
            console.log(data)
        }
    });

};
/*关闭翻译*/
$('#a_Tab0').on('click',function(){
    $('#TabBtn').animate({left:0},200);
    $('#a_TabCon').animate({left:'-84px'},200);
    $('#a_IsTransEngLish').css('display','none');
});
/*显示翻译*/
$('#a_Tab1').on('click',function(){
    $('#TabBtn').animate({left:'112px'},200);
    $('#a_TabCon').animate({left:0},200);
    $('#a_IsTransEngLish').css('display','block');
});
$('#audio').ComPlayer();
$('#audio0').PhoneaudioPlayer();





