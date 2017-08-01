/********************************************备课中心******************************************************/
CheckBrower();
/*播放器*/
$( 'audio' ).audioPlayer();
//备课中心目录索引 显示隐藏
$(".p_Directory_ico").on("click",function () {
    $(".p_DirectoryWrap").fadeIn(300);
});
$(".m_del").on("click",function () {
    $(".p_DirectoryWrap").fadeOut(300);
});
$('#WordMode').css({display:"none"});//关闭连续播放模式
/********************************************备课中心******************************************************/
document.addEventListener('click',function(e){
    if(e.target.className.indexOf("p_Directory_ico")==-1){
        $(".p_DirectoryWrap").fadeOut(300);
    }
});

/*获取文章详情*/
function GetChineseArt(){
    Music.EngReset();
    $('#barLoaded').css("width",0);
    $('#timeCurrent').html('00:00');
    var SubData={};
    SubData.menuId=store.get('menuId');
    SubData.knowledgeIdList=store.get('audioKnowledgeId');
    SubData.subjectId = store.get('audioSubjectId');
    $.ajax({
        "type": "post",
        "url": "/web/student/prepare/voice/ch/article",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData[0];
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                if(AllData!=null){
                    ResetHtml();
                    CreatChinesArtHtml(AllData);
                    GetChineseMusic(AllData.voiceId);
                }
                else {
                    var img = '<div class="noData"><img class="noImg" src="../../../static/image/kola/no.png"/></div>';
                    $(".p_ChineseAudio").html(img);
                }
            }
        }
    });
}
/*创建文章html*/
function CreatChinesArtHtml(data){
    var $Chinese='',contentTrans = '';
    $Chinese+='<div class="p_ChineseArt fs18"><div class="p_loadtexttitle top_margin">'+data.title+'</div><div class="autor">'+data.subheading+'</div>'+data.content+'</div><div class="contentImg"></div>';
    $Chinese=$Chinese.replace(/\&lt;/g,'<')
    $Chinese=$Chinese.replace(/\&gt;/g,'>')
    $Chinese=$Chinese.replace(/\&quot;/g,'"')
    $Chinese=$Chinese.replace(/\&amp;#39;/g,'´');
    $Chinese=$Chinese.replace(/\&amp;nbsp;/g, "");
    $Chinese=$Chinese.replace(/\&middot;/g,"·");
    $('#ChinesArtBox').html($Chinese);
    if(data.contentTrans==null){
        $("#content_trans").html('<div class="trans wid_class">暂无指导</div>')
    }else{
        contentTrans+='<div class="trans wid_class">'+data.contentTrans+'</div>';
        contentTrans=contentTrans.replace(/\&lt;/g,'<')
        contentTrans=contentTrans.replace(/\&gt;/g,'>')
        contentTrans=contentTrans.replace(/\&quot;/g,'"')
        contentTrans=contentTrans.replace(/\&amp;#39;/g,'´');
        contentTrans=contentTrans.replace(/\&amp;nbsp;/g, "");
        contentTrans=contentTrans.replace(/\&middot;/g,"·");
        $("#content_trans").html(contentTrans)
    }


};
function ResetHtml(){
    Music.EngReset();
    var $Chinese='';
    $Chinese+='<div class="p_ArtTitle">';
    $Chinese+='<p class="fs24 lh65">Loading...</p>';
    $Chinese+='<p class="fs18">Loading...</p>';
    $Chinese+='</div>';
    $Chinese+='<div class="p_ChineseArt fs18">Loading...</div>';
    $('#ChinesArtBox').html($Chinese);
}
/*获取文章音频*/
function GetChineseMusic(fileId){
    var SubData={};
    SubData.fileId=fileId;
    $.ajax({
        "type": "post",
        "url": "/web/common/baidu/view",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                $("#audio").attr('src',AllData)
            }
        }
    });
}
/*播放or暂停*/
var IsCanPaly = function() {
    this.audio = document.getElementById('audio');
    this.playPause = document.getElementById('playPause');
    this.audioplayer = document.getElementById('audioplayer');
    this.Isplay = document.getElementById('Isplay');
    this.timeCurrent = document.getElementById('timeCurrent');
    this.barLoaded = document.getElementById('barLoaded');
};
IsCanPaly.prototype = {
    constructor: IsCanPaly, //确定原型链
    //播放
    EngPlay: function () {
        this.audio.play();
        this.audioplayer.className='audioplayer audioplayer-playing'
        this.Isplay.innerHTML = 'Pause';
        this.playPause.title = 'Pause';
    },
    //暂停播放
    EngStop: function () {
        this.audio.pause();
        this.audioplayer.className='audioplayer audioplayer-stopped';
        this.Isplay.innerHTML = 'Play';
        this.playPause.title = 'Play';
    },
    //重新暂停播放
    EngReset: function () {
        this.audio.pause();
        this.audioplayer.className='audioplayer audioplayer-stopped';
        this.Isplay.innerHTML = 'Play';
        this.playPause.title = 'Play';
        this.barLoaded.style.width=0;
        this.timeCurrent.innerHTML='00:00';
    },
};
/*实例化*/
var Music=new IsCanPaly();
GetChineseArt();
// $("#audioplayer").css({ top: $(window).height()*0.748 + "px" });
// window.onscroll=function(){
//     var top = $(window).scrollTop()+$(window).height()*0.748;
//     $("#audioplayer").css({ top: top + "px" });
// }