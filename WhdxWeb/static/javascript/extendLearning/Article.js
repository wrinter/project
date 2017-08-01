/****************************************Created by 徐扬 on 2016/12/6.*****************************************/
/***********************************************文章详情*********************************************************/
if(Request.backPreviewToken=='baichuantushu'){
    var JsonStr={
        "name": "whdxAdmin",
        "userType": "1",
        "user": {
            "subjectId": Request.subjectId,
            "materialId": Request.materialId
        }
    };
    var IsCookieStr = JSON.stringify(JsonStr);
    SetCookie('backPreviewToken',IsCookieStr,1);
}
var ArticleId =Request.id;
document.body.onselectstart=document.body.oncontextmenu=function(){ return false;}//禁止复制
if(window.location.hash!=''){
    $('#c_ArticleMenu').css('display','none')
    $('#c_Recommend').css('display','none');
    $('#e_DownBox').css('display','none');
    $('.c_Select').css('display','none');

}else {
    $('#c_ArticleMenu').css('display','block');

}
$('#ShareClose').on('click',function(){
    $('#Share').fadeOut(150)
});

//公共样式
getCss();
function getCss(){
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
    })
}
/*上一篇下一篇封装*/
function IsPostsArt() {
    var Obj = store.get('ArtTitle');
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
            $('#c_NextArt').html($IsNextHtml);
            $('#c_NextArt').html($IsNextHtml).siblings('.GoCanClick').attr('data-artId',Obj.ArtId[Num+1]);

        }
        if(Num==Obj.ArtId.length-1){
            $('#isup').css('display','block');
            $('#isdown').css('display','none');
            $('#m030').css('display','none');
            $IsPreHtml+='<span class="isTitle">'+Obj.ArtName[Num-1]+'</span>';
            $IsPreHtml+='<span class="isArtId dino">'+Obj.ArtId[Num-1]+'</span>';
            $('#c_PreArt').html($IsPreHtml);
            $('#c_PreArt').html($IsPreHtml).siblings('.GoCanClick').attr('data-artId',Obj.ArtId[Num-1])
        }
        if(Num>0&&Num<Obj.ArtId.length-1){
            $('#isup').css('display','block');
            $('#m030').css('display','block');
            $('#isdown').css('display','block');
            $IsNextHtml+='<span class="isTitle">'+Obj.ArtName[Num+1]+'</span>';
            $IsNextHtml+='<span class="isArtId dino">'+Obj.ArtId[Num+1]+'</span>';
            $('#c_NextArt').html($IsNextHtml).siblings('.GoCanClick').attr('data-artId',Obj.ArtId[Num+1]);
            $IsPreHtml+='<span class="isTitle">'+Obj.ArtName[Num-1]+'</span>';
            $IsPreHtml+='<span class="isArtId dino">'+Obj.ArtId[Num-1]+'</span>';
            $('#c_PreArt').html($IsPreHtml).siblings('.GoCanClick').attr('data-artId',Obj.ArtId[Num-1])
        }
        $('#Title').html('《'+Obj.ArtName[Num]+'》');
    }
    else{
        $('#Title').html('《'+Obj.ArtName[0]+'》');
        $('#isup').css('display','none');
        $('#m030').css('display','none');
        $('#isdown').css('display','none');
    }
};
$('.CanClick').on('click',function(){
    window.location.href='extend_article.html?id='+$(this).find('.isArtId').html()+'';
    IsPostsArt();
    GetArticle(ArticleId);
});
$('.GoCanClick').on('click',function(){
    window.location.href='extend_article.html?id='+$(this).attr('data-artId')+'';
    IsPostsArt();
    GetArticle(ArticleId);
});
/*获取文章*/
function GetArticle(id){
    var ArticleData={};
    ArticleData.id=id;
    $.ajax({
        "type": "post",
        "url": "/web/shareresource/toartical ",
        "dataType":'json',
        "data": ArticleData,
        success: function (data) {
            CreatArtBox(data);
        }
    });
};
/*创建文章盒子，将文章插到页面中*/
function CreatArtBox(data){
    var author=data.retData.subtitle;
    if(data.retData.subtitle == "" || data.retData.subtitle == null){

    }else{
        author.replace(/\&middot;/g,"·");
        $(".auther").text("作者："+author);
    }
    var $ArtHtml='';
    $ArtHtml+=data.retData.title+'<span class="artid dino" id="artid">'+data.retData.id+'</span>'
    $('#Title').html(data.retData.title)
    $('#c_ArtTitle').html($ArtHtml)
    $('#c_ArtTitle1').html($ArtHtml);
    if(typeof(data.retData.content)!='undefined'){
        var str=''
        str=data.retData.content;
        str=str.replace(/\&lt;/g,'<')
        str=str.replace(/\&gt;/g,'>')
        str=str.replace(/\&quot;/g,'"')
        str=str.replace(/\&amp;quot;/g,'"')
        str=str.replace(/\&amp;nbsp;/g, "");
        str=str.replace(/\&amp;#39;/g,"'");
        str=str.replace(/\&rdquo;/g,"”");
        str=str.replace(/\&ldquo;/g,"“");
        $('#c_ArticleBox').html(str);
        $('#c_ArticleBox1').html(str);
    }
    else {
        $('#c_ArticleBox').html('暂无数据');
        $('#c_ArticleBox1').html('暂无数据');
    }
    IsPostsArt();

};
GetArticle(ArticleId);
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
            GoldAnimate(data.retGold);
        }
    });
};


//操作
Opration()
function Opration(){
    $('#GoIdentifyClose').on('click',function(){
        $('#NoIdentify').fadeOut(150);
    });
    $('#GoPayClose').on('click',function(){
        $('#p_LessMoney').fadeOut(150);
    });
    $('#e_DownBox').on('click',function(){
        NewDownload()
    });
}
//新下载
function NewDownload() {
    var SubData={};
    SubData.resourceId=Request.id;
    SubData.type='ArticleDownload';
    SubData.resType='4';
    $.ajax({
        "type": "post",
        "url": "/web/teacher/download/obtain",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var Codenum = parseInt(AllData);
            if(Codenum==1){
                CreatDownLoad()
            }
            else if(Codenum==2){
                $('#p_LessMoney').fadeIn(200);
            }else {
                $('#NoIdentify').fadeIn(200);
            }
        }
    });
}
//创建下载
function CreatDownLoad(){
    var Url="/web/common/downLoadArtacle?id="+Request.id;
    var $DownLoadEle='<form action="'+Url+'"  class="dino" method="post" id="Post"></form>';
    $('#Dowmload').html($DownLoadEle);
    $('#Post').submit();
}