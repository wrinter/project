/****************************************Created by 徐扬 on 2016/12/6.*****************************************/

IsGetClass()
function IsGetClass() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    console.log(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {

    } else {

    }
};
/***********************************************文章详情*********************************************************/
var ArticleId =Request.id;
/*获取推荐的班级*/
if(Request.IsRecommend=='false'){
    $('#c_Recommend').css('display','none')
}
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
console.log(window.location.hash!='')
if(window.location.hash!=''){
    $('#c_ArticleMenu').css('display','none')
    $('#c_Recommend').css('display','none');
    $('.c_Select').css('display','none');
}else {
    GetRefClass();
    $('#c_ArticleMenu').css('display','block');
}
$('#ShareClose').on('click',function(){
    $('#Share').fadeOut(150)
})
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
    if(data.length>0){
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
/*推荐班级数据重置*/
function refresetdata(){
    list.length=0;
    $('#Masking').fadeOut(150);
    $('body').css('overflow','auto');
    $('#c_Remark').val('');
    $('.c_RefCanCheckClass').removeClass('c_RefCheckClass');
};
$('#c_RefBtn0').on('click',function(){
    if(list.length>0){
        RefClass(list,$('#c_Remark').val())
    }else{
        $('#c_ErrorMsg').html('您还没有选中班级').fadeIn(200);  Disappear("#c_ErrorMsg");
    }
});
/*推荐班级提交*/
function RefClass(listarr,requireMent){
    var SubData={};
    SubData.classIdList=listarr;
    SubData.resId=ArticleId;
    SubData.requireMent=requireMent;
    SubData.resType='401';
    if(store.get("menuId")=="5d260be0a59e11e680f576304dec7eb7"){
        SubData.resType='402';
    }
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
                GoldAnimate(data.retGold);
            }
            else {
                $('#c_ErrorMsg').html('推荐失败，请重试').fadeIn(200);  Disappear("#c_ErrorMsg")
            }
        }
    });
};

/*上一篇下一篇封装*/
function IsPostsArt() {
    var Obj = store.get('ArtTitle');
    console.log(Obj)
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
            $IsNextHtml+='<span class="isTitle" title="'+Obj.ArtName[Num+1]+'">'+Obj.ArtName[Num+1]+'</span>';
            $IsNextHtml+='<span class="isArtId dino">'+Obj.ArtId[Num+1]+'</span>';
            $('#c_NextArt').html($IsNextHtml);
            $('#c_NextArt').html($IsNextHtml).siblings('.GoCanClick').attr('data-artId',Obj.ArtId[Num+1]);

        }
        if(Num==Obj.ArtId.length-1){
            $('#isup').css('display','block');
            $('#isdown').css('display','none');
            $('#m030').css('display','none');
            $IsPreHtml+='<span class="isTitle" title="'+Obj.ArtName[Num-1]+'">'+Obj.ArtName[Num-1]+'</span>';
            $IsPreHtml+='<span class="isArtId dino">'+Obj.ArtId[Num-1]+'</span>';
            $('#c_PreArt').html($IsPreHtml);
            $('#c_PreArt').html($IsPreHtml).siblings('.GoCanClick').attr('data-artId',Obj.ArtId[Num-1])
        }
        if(Num>0&&Num<Obj.ArtId.length-1){
            $('#isup').css('display','block');
            $('#m030').css('display','block');
            $('#isdown').css('display','block');
            $IsNextHtml+='<span class="isTitle" title="'+Obj.ArtName[Num+1]+'">'+Obj.ArtName[Num+1]+'</span>';
            $IsNextHtml+='<span class="isArtId dino">'+Obj.ArtId[Num+1]+'</span>';
            $('#c_NextArt').html($IsNextHtml).siblings('.GoCanClick').attr('data-artId',Obj.ArtId[Num+1]);
            $IsPreHtml+='<span class="isTitle" title="'+Obj.ArtName[Num-1]+'">'+Obj.ArtName[Num-1]+'</span>';
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
    window.location.href='chinese_article.html?id='+$(this).find('.isArtId').html()+'';
    IsPostsArt();
    GetArticle(ArticleId);
});
$('.GoCanClick').on('click',function(){
    window.location.href='chinese_article.html?id='+$(this).attr('data-artId')+'';
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
        author=author.replace(/\&middot;/g,"·");
        $(".auther").text("作者："+author);
    }
    var $ArtHtml='';
    $ArtHtml+=data.retData.title+'<span class="artid dino" id="artid">'+data.retData.id+'</span>';
    $('#c_ArtTitle').html($ArtHtml);
    $('#c_ArtTitle1').html($ArtHtml);
    if(typeof(data.retData.content)!='undefined'){
        var str=''
        str=data.retData.content;
        str=str.replace(/\&lt;/g,'<')
        str=str.replace(/\&gt;/g,'>')
        str=str.replace(/\&quot;/g,'"')
        str=str.replace(/\&amp;quot;/g,'"')
        str=str.replace(/\&amp;nbsp;/g, "");
        str=str.replace(/\&amp;nbsp;/g, "");
        str=str.replace(/\&middot;/g,"·");
        str=str.replace(/\&rdquo;/g,"”");
        str=str.replace(/\&ldquo;/g,"“");
        $('#c_ArticleBox').html(str);
        $('#c_ArticleBox1').html(str);
        console.log(str)
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
        $('.GoClassClose').on('click',function(){$('.AllNoHasClas').fadeOut(200);$('body').css('overflow','auto');});
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