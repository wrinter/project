
/********************************************备课中心******************************************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
//播放器
$( 'audio' ).audioPlayer();
SystemRedMsg();
/******************************************************获取栏目列表********************************************************/
//获取栏目列表
function GetVoiceData(lastid){
    var SubData={};
    SubData.menuId=store.get('menuId');
    SubData.knowledgeList=lastid;
    $.ajax({
        "type": "post",
        "url": "/web/teacher/prepare/voice/category",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                if(AllData.length>0){
                    ArrReset();
                    $('#c_ErrorMsg').css('display','none');
                    $('.p_AudioListMain').css('display','block');
                    $('#audioplayer').css('display','block');
                    $('#p_AudioList').css('left','0');
                    CreatVoiceListHtml(AllData);
                    ResetListenMain();
                }
                else {
                    ResetHtml();
                    $('.p_AudioListMain').css('display','none');
                    $('#audioplayer').css('display','none');
                    $('#c_ErrorMsg').html('该章节暂无数据').stop(true).fadeIn(200);  Disappear("#c_ErrorMsg");
                    $('#timeDuration').html('00:00')
                }
            }
            else {
                ResetHtml();
                $('.p_AudioListMain').css('display','none');
                $('#audioplayer').css('display','none');
                $('#c_ErrorMsg').html('该章节暂无数据').fadeIn(200);  Disappear("#c_ErrorMsg")
            }
        }
    });
}
function ArrReset(){
    ListenDataArr=[];
    WordMain=[];//保存单词的数据；
    ListenMain=[];//保存听力的数据；
    BookMain=[];//保存文章的数据；
    WordAudioArr=[];//创建一个数组用来记录音频地址
    ListenDataArr=[];
    ListenVoice=[];//保存听力音频
    Mp3SrcArr=[];
    IsBookIdBox=[];
    Mp3Src=[];//记录课文音频地址
    LrcContent=[];//记录解析的歌词数组
    $('#p_AudioList').css('left','0');
    if(size_time){clearInterval(size_time)}
}
//创建栏目列表
var WordMain=[];//保存单词的数据；
var ListenMain=[];//保存听力的数据；
var BookMain=[];//保存文章的数据；
function CreatVoiceListHtml(data){
    WordMain=[];//保存单词的数据；
    ListenMain=[];//保存听力的数据；
    BookMain=[];//保存文章的数据；
    var $VoiceListHtml='';
    for(var i=0;i<data.length;i++){
        /*单词*/
        if(data[i].type=='6'){
            $VoiceListHtml+='<li>';
            if(data[i].idList!=null){
                $VoiceListHtml+='<p class="p_ListBox" data-subType="'+data[i].type+'" data-id="'+data[i].idList+'" title="'+data[i].categoryName+'" id="Word">';
            }
            else {
                $VoiceListHtml+='<p class="p_ListBox" data-subType="'+data[i].type+'"  data-id="'+data[i].id+'" title="'+data[i].categoryName+'" id="Word">';
            }
            WordMain.push(data[i]);
            $VoiceListHtml+='<i class="prepare_sprite p_wordico0 "></i>';
            $VoiceListHtml+='<span class="p_Word w160">单词</span>';
            $VoiceListHtml+='</p>';
            $VoiceListHtml+='</li>';
        }
    };//单词
    for(var i=0;i<data.length;i++){
        //听力
        if(data[i].type=='2'){
            $VoiceListHtml+='<li>';
            $VoiceListHtml+='<p class="p_ListBox" data-subType="'+data[i].type+'"  data-id="'+data[i].id+'" title="'+data[i].categoryName+'">';
            ListenMain.push(data[i])
            $VoiceListHtml+='<i class="prepare_sprite p_listenico0"></i>';
            $VoiceListHtml+='<span class="p_Word ">'+data[i].categoryName+'</span>';
            $VoiceListHtml+='</p>';
            $VoiceListHtml+='</li>';
        }

    };//听力
    for(var i=0;i<data.length;i++){
        //课文
        if(data[i].type=='4'){
            $VoiceListHtml+='<li>';
            $VoiceListHtml+='<p class="p_ListBox" data-subType="'+data[i].type+'"  data-id="'+data[i].id+'" title="'+data[i].categoryName+'">';
            BookMain.push(data[i])
            $VoiceListHtml+='<i class="prepare_sprite p_bookico0 "></i>';
            $VoiceListHtml+='<span class="p_Word ">'+data[i].categoryName+'</span>';
            $VoiceListHtml+='</p>';
            $VoiceListHtml+='</li>';
        }
    };//课文
    $('#p_AudioList').html($VoiceListHtml);
    AudioListTurn();
    $(window).resize(function(){
        AudioListTurn();
    })
    CheckListCss();
};
function ResetHtml(){
    $('#p_AudioList').html('');
    $('#WordMainBox').html('<div class="NoData" id="NoData"></div>')
    NoDataImg(0);
    $('#ListenMainBox').html('');
    $('#BookMainBox').html('');
}
//栏目切换
var size_time=null;

function ResetTurn() {
    $('#p_AudioList').animate({'left':'0px'});
}
function AudioListTurn(){
    ResetTurn();
    if(size_time){clearInterval(size_time)}
    var totalSize = $('#p_AudioList li').size();//获取总数据
    var scrollWidth=0;//通过判断浏览器的宽度决定课件容器的宽度
    var pageSize=0;//每页显示几条数据
    if(document.body.offsetWidth<=1366){
        pageSize = 3;//每页显示4条数据
        scrollWidth=810;
    }else if(document.body.offsetWidth>1366&&document.body.offsetWidth<1600){
        pageSize = 3;//每页显示4条数据
        scrollWidth=810;
    }
    else{
        pageSize = 4;//每页显示4条数据
        scrollWidth=1080;
    }
    var currentPage = 1;//当前为第一页
    var totalPage = Math.ceil(totalSize / pageSize);//计算总页数
    if(totalPage>1){
        /*单击向右的箭头*/
        $('#Turn_Right,#Turn_Left').show();
        $('#Turn_Right').off('click');
        $('#Turn_Right').click(function(){
            if(currentPage==totalPage){
                return false;
            }
            else if($(this).hasClass('p_rightico0')){
                return false;
            }
            else {
                $('#p_AudioList').stop(true).animate({'left':currentPage*-scrollWidth},200);
                currentPage++;
            }
        });
        /*单击向左的箭头*/
        $('#Turn_Left').off('click');
        $('#Turn_Left').click(function(){
            if(currentPage==1){
                $('#Turn_Left').removeClass('p_leftico0').addClass('p_leftico1');
                return false;
            }else {
                currentPage--;
                $('#p_AudioList').stop(true).animate({'left':((currentPage-1)*-scrollWidth)},200)
            }

        });
        /*创建轮播点*/
        var $CircleHtml='';
        for(var i=0;i<totalPage;i++){
            $CircleHtml+='<span class="Carousel "></span>';
        }
        $('#p_Origin').html($CircleHtml);
        /*检测箭头or轮播点样式*/
        size_time=setInterval(function(){
            if(currentPage>1){
                $('#Turn_Left').removeClass('p_leftico0').addClass('p_leftico1');
            }
            else {
                $('#Turn_Left').removeClass('p_leftico1').addClass('p_leftico0');
            }
            if(currentPage<=totalPage-1){
                $('#Turn_Right').removeClass('p_rightico0').addClass('p_rightico1');
            }
            else {
                $('#Turn_Right').removeClass('p_rightico1').addClass('p_rightico0');
            }
            $('.Carousel').eq(currentPage-1).addClass('p_OriginSelect').siblings().removeClass('p_OriginSelect');
        },2);
        /*轮播点跳转*/
        $('.Carousel').off('click');
        $('.Carousel').on('click',function(){
            var This_index=$(this).index();
            currentPage=This_index+1;
            console.log(currentPage)
            $('#p_AudioList').stop(true).animate({'left':(currentPage-1)*-scrollWidth},200);
        })
    }
    else {
        $('#Turn_Right,#Turn_Left').css("display",'none');
        $('#p_Origin').html('');
    }

};
//栏目列表选中样式
function CheckListCss(){
    $('#WordMainBox').html('');
    $('#ListenMainBox').html('');
    $('#BookMainBox').html('');
    /*获取音频栏目数据 默认读取单词*/
   if(WordMain.length>0){
       if(WordMain[0].idList!=null){
           var idListarr=[];
           var str='';
           for(var i=0;i<WordMain[0].idList.length;i++ ){
               str+=WordMain[0].idList[i]+',';
           }
           idListarr.push(str);
           CheckWordMain(idListarr[0]);
       }else {
           var idListarr=[];
           idListarr.push(WordMain[0].id);
           CheckWordMain(idListarr[0]);
       };
       /*默认单词显示*/
       $('.p_ListBox').eq(0).find('.prepare_sprite').removeClass('p_wordico0').addClass('p_wordico1');;
       $('#Word').off('click');
       $('#Word').addClass('isadd').click();
   };
    /*获取听力栏目*/
     if(ListenMain.length>0){
        for(var j=0;j<ListenMain.length;j++){
            CheckListenMain(ListenMain[j].id);
        };
        /*默认听力显示*/
        if(WordMain.length==0){
            $('.p_ListBox').eq(0).find('.prepare_sprite').removeClass('p_listenico0').addClass('p_listenico1');;
        }
    };
    /*获取课文栏目*/
    if(BookMain.length>0){
        for(var i=0;i<BookMain.length;i++){
            CheckBookMain(BookMain[i].id);
        };
        /*默认课文显示*/
        if(ListenMain.length==0&&WordMain.length==0){
            $('.p_ListBox').eq(0).find('.prepare_sprite').removeClass('p_bookico0').addClass('p_bookico1');;
        }
    }
    //默认样式
    $('.p_ListBox').eq(0).css({'border':'1px solid #65b113'}).find('.p_Word').css('color','#65b113');
    /*栏目选择事件*/
    $('.p_ListBox').off('click')
    $('.p_ListBox').on('click',function(){
        Music.EngReset();
        Music.EngStop();
        var ThisIndex=$(this).index();
        var ThisParentsIndex=$(this).parents('li').index();
        /*切换显示*/
        $(' .WrapperBox').eq(ThisParentsIndex).css('display','block').siblings('.WrapperBox').css("display",'none')
        $(' .WrapperBox').eq(ThisParentsIndex).css('display','block').parents('.IsMainBox').siblings().find('.WrapperBox').css("display",'none');
        /*判断栏目类型*/
        var subType=$(this).attr('data-subtype');
        $(this).css({'border':'1px solid #65b113'}).addClass('isadd').parents('li').siblings().find('.p_ListBox').removeClass('isadd');
        $(this).parents('li').siblings().find('.p_Word').css('color','#999');
        $(this).find('.p_Word').css('color','#65b113');
        $(this).parents('li').siblings().find('.p_ListBox').css({'border':''});
        var BorLength= $(this).parents('li').siblings().length;
        /*遍历兄弟节点改变兄弟节点对应的雪碧图*/
        for(var i=0;i<BorLength;i++){
            var $that=$(this).parents('li').siblings().eq(i).find('.prepare_sprite');//当前兄弟节点所表示的雪碧图
            if( $that.hasClass('p_wordico1')){$that.removeClass('p_wordico1').addClass('p_wordico0')}
            if( $that.hasClass('p_listenico1')){$that.removeClass('p_listenico1').addClass('p_listenico0')}
            if( $that.hasClass('p_bookico1')){$that.removeClass('p_bookico1').addClass('p_bookico0')}
        }
        ///*单词模式*/
        if(subType==6){
            Music.EngReset();
            $('#audio').attr('src',WordAudioArr[0]);//默认第一个单词音频
            $('#WordBox').css({'left':0});
            $(this).siblings('.IsMainBox').css('display','none');
            $(this).find('.prepare_sprite').removeClass('p_wordico0').addClass('p_wordico1');
            $("#WordMode").css('display','block');
        };
        /*听力模式切换*/
        if(subType==2){
            $('#Word').removeClass('isadd');
            Music.EngReset();
            $("#"+$(this).attr('data-id')).css('display','block');
            $("#"+$(this).attr('data-id')).siblings('.WrapperBox').css('display','none');
            $(this).siblings('.IsMainBox').css('display','none');
            var ListenSrc=ListenVoice[ThisParentsIndex-1];
            $('#audio').attr('src',$("#"+$(this).attr('data-id')).attr('data-voicepath'));
            $(this).find('.prepare_sprite').removeClass('p_listenico0').addClass('p_listenico1');
            /*关闭自动播放*/
            var audio=document.getElementById('audio');
            /*播放下一个音频的时候延时三秒再播放*/
            audio.onended = function() {
                Music.EngStop();
                Music.EngReset();
                return false;
            };
        };
        /*课文跟读切换*/
        if(subType==4){
            Music.EngReset();
            $(this).siblings('.IsMainBox').css('display','none');
            var ListenLength=ListenVoice.length;
            var BookMp3Src=Mp3Src[ThisParentsIndex-ListenLength-1];
            var ThisIsLrcIndex=ThisParentsIndex-ListenLength-1;//当前所对应的歌词坐标
            $('#lyricContainer'+ThisIsLrcIndex).css({top:0});
            $("#"+$(this).attr('data-id')).css('display','block');
            $("#"+$(this).attr('data-id')).siblings('.WrapperBox').css('display','none');
            $('#audio').attr('src',$("#"+$(this).attr('data-id')).attr('data-voicepath'))

            //遍历所有的歌词行，取消同步样式
            for (var i = 0;i <$('.IsBook').length; i++) {
                for(var j=0;j<$('#lyricContainer'+i).find('p').length;j++){
                    $('#line-'+i+j).removeClass() ;
                }
            }
            LrcTimeUpData(ThisIsLrcIndex);
            $(this).find('.prepare_sprite').removeClass('p_bookico0').addClass('p_bookico1');
            $("#WordMode").css('display','none');
            /*关闭自动播放*/
            var audio=document.getElementById('audio');
            /*播放下一个音频的时候延时三秒再播放*/
            audio.onended = function() {
                Music.EngStop();
                Music.EngReset();
                return false;
            };
        };
    });
};
/******************************************************单词********************************************************/
//读取单词
function CheckWordMain(categoryId){
    var SubData={};
    SubData.resIdList=categoryId;
    $.ajax({
        "type": "post",
        "url": "/web/teacher/prepare/voice/word/detail",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                ResetListenMain();
                CreatWordHtml(AllData);
                $('#Word').addClass('isadd');
            }
        }
    });
};
//单词切换
var WordDelTime0=null;
var WordDelTime=null;
function  WordTurning(){
    Music.EngReset();
    Music.EngStop();
    $('#Isplay').off('click');
    if($('#Word').hasClass('isadd')){
        $('#Isplay').on('click',function(){
            $('#Word').addClass('isadd');
        });
    }
    if(WordAudioArr[0]=='../../static/plugin/song/slice.mp3'){
        $('#c_ErrorMsg').html('该单词暂无音频').stop(true).fadeIn(200);  Disappear("#c_ErrorMsg");
    }
    if(WordDelTime){clearInterval(WordDelTime)}

    if(WordDelTime0){clearTimeout(WordDelTime0)}
    var CrrentPage_word=1;//记录当前的页数
    var ScrollWidth_word=0;//记录每次滚动的距离
    var TotallPage_word=$('#WordBox>li').size();/*查找总页数*/
    if(document.body.offsetWidth<=1366){
        ScrollWidth_word=900;
    }else if(document.body.offsetWidth>1366&&document.body.offsetWidth<=1600){
        ScrollWidth_word=1000;
    }
    else{
        ScrollWidth_word=1200;
    }
    //检测屏幕变化
    OnResize()
    function OnResize() {
        window.onresize = function(){
            if(document.body.offsetWidth<=1366){
                ScrollWidth_word=900;
            }else if(document.body.offsetWidth>1366&&document.body.offsetWidth<=1600){
                ScrollWidth_word=1000;
            }
            else{
                ScrollWidth_word=1200;
            }
            $('#WordBox').stop(true).animate({'left':((CrrentPage_word-1)*-ScrollWidth_word)},200);
        }
    }
    $('#WordLeft').on('click',function(){
        Music.EngReset();
        Music.EngStop();
        $('#c_ErrorMsg').stop(true).css('display','none');
        if($('#audioplayer').hasClass("audioplayer-stopped")){
            if(CrrentPage_word==1){
                $('#Turn_Left').removeClass('p_leftico0').addClass('p_leftico1');
                return false;
            }else {
                CrrentPage_word--;
                $('#WordBox').stop(true).animate({'left':((CrrentPage_word-1)*-ScrollWidth_word)},200);
            }
            if(WordAudioArr[CrrentPage_word-1]=='../../static/plugin/song/slice.mp3'){
                $('#c_ErrorMsg').html('该单词暂无音频').stop(true).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
            $('#audio').attr('src',WordAudioArr[CrrentPage_word-1]);
        }
    });
    $('#WordRight').on('click',function(){
        Music.EngReset();
        Music.EngStop();
        $('#c_ErrorMsg').stop(true).css('display','none');
        if($('#audioplayer').hasClass("audioplayer-stopped")){

            if(CrrentPage_word==TotallPage_word){
                return false;
            }else if($(this).hasClass('p_rightico0')){
                return false;
            }
            else {
                $('#WordBox').stop(true).animate({'left':CrrentPage_word*-ScrollWidth_word},100);
                CrrentPage_word++;
            }
            if(WordAudioArr[CrrentPage_word-1]=='../../static/plugin/song/slice.mp3'){
                $('#c_ErrorMsg').html('该单词暂无音频').stop(true).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
            $('#audio').attr('src',WordAudioArr[CrrentPage_word-1]);
        }
        OnResize();
    });
    /*自动播放模式*/
    $('#playPause').on('click',function(){
        if($('#Word').hasClass('isadd')){
            /*连续播放单词*/
            var audio=document.getElementById('audio');
            /*播放下一个音频的时候延时三秒再播放*/
            audio.onended = function() {
                OnResize();
                WordDelTime0=setTimeout(function(){
                    if(CrrentPage_word==TotallPage_word){
                        return false;
                    }else {
                        $('#WordBox').stop(true).animate({'left':CrrentPage_word*-ScrollWidth_word},200);
                        CrrentPage_word++;
                    }
                    if(WordAudioArr[CrrentPage_word-1]=='../../static/plugin/song/slice.mp3'){
                        $('#c_ErrorMsg').html('该单词暂无音频').stop(true).fadeIn(200);  Disappear("#c_ErrorMsg");
                    }
                    $('#audio').attr('src',WordAudioArr[CrrentPage_word-1]);
                    Music.EngPlay();
                },1500);
            };
        }
    });
    /*检测箭头样式*/
    WordDelTime=setInterval(function(){
        if(CrrentPage_word>1){
            $('#WordLeft').removeClass('p_wordleftico0').addClass('p_wordleftico1');
        }
        else {
            $('#WordLeft').removeClass('p_wordleftico1').addClass('p_wordleftico0');
        }
        if(CrrentPage_word<=TotallPage_word-1){
            $('#WordRight').removeClass('p_wordrightico0').addClass('p_wordrightico1');
        }
        else {
            $('#WordRight').removeClass('p_wordrightico1').addClass('p_wordrightico0');
        }
    },2);
};
//创建单词html
var WordAudioArr=[];//创建一个数组用来记录音频地址
function CreatWordHtml(data){
    $('#WordMainBox').html('');
    WordAudioArr=[];
    var $WordHtml='';
    $WordHtml+='<div class="WrapperBox" id="Word_Main">';
    $WordHtml+='<i class="wordsprite p_wordleftico0" id="WordLeft"></i>';
    $WordHtml+='<i class="wordsprite p_wordrightico1" id="WordRight"></i>';
    $WordHtml+='<div class="WordOutBox">';
    $WordHtml+='<ul class="WordBox" id="WordBox">';
    for(var i=0;i<data.length;i++){
        if(data[i].audio==null||data[i].audio==''){
            $WordHtml+='<li data-src="../../static/plugin/song/slice.mp3">';
        }else {
            $WordHtml+='<li data-src="'+data[i].audio+'">';
        }
        $WordHtml+='<div class="Word_MainBox">';//单词内容区
        $WordHtml+='<div class="Word_Top" id=Word_Top_'+i+'>';
        $WordHtml+='<p class="Word" id=Word_'+i+' data-WordId="'+data[i].id+'">'+data[i].word+'</p>';
        $WordHtml+='<p class="Word_Phonogram">';
        if(data[i].phonogram==null||data[i].phonogram==''){
            $WordHtml+='<span class="word_phonogram">暂无音标</span>';
        }else {
            $WordHtml+='<span class="word_phonogram">/'+data[i].phonogram+'/</span>';
        }
        if(data[i].audio==null||data[i].audio==''){
            $WordHtml+='<i class="prepare_sprite p_wordico" id=WordBtn_'+i+' data-AudioId="../../static/plugin/song/slice.mp3"></i>';
        }else {
            $WordHtml+='<i class="prepare_sprite p_wordico" id=WordBtn_'+i+' data-AudioId="'+data[i].audio+'"></i>';
        }
        if(data[i].audio==null||data[i].audio==''){
            data[i].audio="../../static/plugin/song/slice.mp3";
        }
        WordAudioArr.push(data[i].audio); //创建音频播放地址列表数组
        $('#audio').attr('src',data[0].audio);//默认第一个单词音频
        $WordHtml+='</p>';
        $WordHtml+='<ul class="Word_MeaningList">';
        if(data[i].meaningList==null||data[i].meaningList==''){

        }
        else {
            for(var j=0;j<data[i].meaningList.length;j++){
                $WordHtml+='<li>';
                $WordHtml+='<span>'+data[i].meaningList[j].part+''+data[i].meaningList[j].meaning+'</span>';
                $WordHtml+='</li>';
            }
        }
        $WordHtml+='</ul>';
        $WordHtml+='</div>';
        $WordHtml+='<div class="Word_Example">';
        $WordHtml+='<div class="Word_Attr">';
        $WordHtml+='<span class="Word_AttrName sentences">[sentences]</span>';
        $WordHtml+='<ul class="Sentences_List">';
        if(data[i].exampleList!=null||data[i].exampleList!=''){
            for(var k=0;k<data[i].exampleList.length;k++){
                $WordHtml+='<li>';
                if(data[i].exampleList[k].example==null||data[i].exampleList[k].example==''){
                    $WordHtml+='<span class="example">暂无例句</span></br>';

                }else{
                    $WordHtml+='<span class="example">'+data[i].exampleList[k].example+'</span></br>';
                }
                if(data[i].exampleList[k].example==null||data[i].exampleList[k].example==''){
                    $WordHtml+='<span class="trans">暂无翻译</span>';
                }else{
                    $WordHtml+='<span class="trans">'+data[i].exampleList[k].trans+'</span>';
                }
                $WordHtml+='</li>';
            }
        }
        $WordHtml+='</ul>';
        $WordHtml+='</div>';
        $WordHtml+='</div>';
        $WordHtml+='</div>';
        $WordHtml+='</li>';
    }
    $WordHtml+='</ul>';
    $WordHtml+='</div>';
    $WordHtml+='</div>';
    $('#WordMainBox').append($WordHtml);
    WordHeight();
    WordTurning();
    WordVoiceCheck();
}
//高度适配
function WordHeight(){
    for(var i=0;i<$('#WordBox>li').length;i++){
        $('#Word_'+i).height($('#Word_'+i).parents('#Word_Top_'+i).height());
        $('.sentences').height($('.sentences').parents('.Word_Attr').height());
    }
};
//小喇叭播放单词音频
function WordVoiceCheck(){
    $('.p_wordico').on('click',function(){
        Music.EngReset();
        if($('#audioplayer').hasClass("audioplayer-stopped")){
            var fileId=$(this).attr('data-AudioId');
            if(fileId=='../../static/plugin/song/slice.mp3'){
                $('#c_ErrorMsg').html('该单词暂无音频').stop(true).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
            $('#audio').attr('src',fileId);
            Music.EngPlay();
            /*连续播放单词*/
            var audio=document.getElementById('audio');
            /*播放下一个音频的时候延时三秒再播放*/
            audio.onended = function() {
                return false;
            };
            $("#WordMode").removeClass('double').html('手');
        }
    });
};
//播放or暂停
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
        this.Isplay.title = 'Pause';
        this.playPause.title = 'Pause';
    },
    //暂停播放
    EngStop: function () {
        this.audio.pause();
        this.audioplayer.className='audioplayer audioplayer-stopped';
        this.Isplay.title = 'Play';
        this.playPause.title = 'Play';
    },
    //重新暂停播放
    EngReset: function () {
        this.audio.pause();
        this.audioplayer.className='audioplayer audioplayer-stopped';
        this.Isplay.title = 'Play';
        this.playPause.title = 'Play';
        this.barLoaded.style.width='0%';
        this.timeCurrent.innerHTML='00:00';
    },
};
//实例化
var Music=new IsCanPaly();
//重置数据
function ResetListenMain(){
    $('#Word').removeClass('isadd');
    $('#audio')[0].pause();
    $('#audioplayer').removeClass().addClass('audioplayer audioplayer-stopped');
    $('#Isplay').attr('title','Play');
    $('#playPause').attr('title','Play');
    $('#barLoaded').css('width','0');
    $('#timeCurrent').html('00:00');
}
/******************************************************听力********************************************************/
function IsTrans(m){
    /*关闭翻译*/
    $('#a_Tab0'+m).on('click',function(){
        $('#a_Tab0'+m).css("width","20%")
        $('#a_Tab1'+m).css("width","80%")
        $('#TabBtn'+m).animate({left:0},200);
        $('#a_TabCon'+m).animate({left:'-84px'},200);
        $('#IsNoScript'+m).css('display','block');
        $('#IsHasScript'+m).css('display','none');
    });
    /*显示翻译*/
    $('#a_Tab1'+m).on('click',function(){
        $('#a_Tab0'+m).css("width","80%")
        $('#a_Tab1'+m).css("width","20%")
        $('#TabBtn'+m).animate({left:'112px'},200);
        $('#a_TabCon'+m).animate({left:0},200);
        $('#IsNoScript'+m).css('display','none');
        $('#IsHasScript'+m).css('display','block');
    });
}
//读取听力内容
function CheckListenMain(categoryId){
    var SubData={};
    SubData.resId=categoryId;
    $.ajax({
        "type": "post",
        "url": "/web/teacher/prepare/voice/en/article",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                CreatListenHtml(data);
            }
        }
    });
};
//创建听力html
var ListenDataArr=[];
function CreatListenHtml(data){
    $('#ListenMainBox').html('');
    var $ListenHtml='';
    ListenDataArr.push(data);
    if(ListenDataArr.length==ListenMain.length)
    {
        for(var i=0;i<ListenDataArr.length;i++){
            $ListenHtml+='<div class="WrapperBox dino matop30 IsListen" id="'+ListenDataArr[i].retData.resId+'" data-resId="'+ListenDataArr[i].retData.resId+'" data-voiceId="'+ListenDataArr[i].retData.voiceId+'" data-lrcId="'+ListenDataArr[i].retData.lrcId+'" data-voicePath="'+ListenDataArr[i].retData.voicePath+'">';
            $ListenHtml+='<div class="fl w100">';
            $ListenHtml+='<div class="a_TabBtn"  id=a_TabBtn'+i+'>';
            $ListenHtml+='<img src="../../static/image/sprite/a_tapbtn.png" alt="" class="a_TabBtnImg" id=TabBtn'+i+'>';
            $ListenHtml+='<span  class="a_Tab0" id=a_Tab0'+i+'></span>';
            $ListenHtml+='<span  class="a_Tab1" id=a_Tab1'+i+'></span>';
            $ListenHtml+='<p class="a_TabCon" id=a_TabCon'+i+'>';
            $ListenHtml+='<span class="TabT">OFF</span>';
            $ListenHtml+='<span class="TabT"></span>';
            $ListenHtml+='<span class="TabT">ON</span>';
            $ListenHtml+='</p>';
            $ListenHtml+='</div>';
            $ListenHtml+='<span class="p_TabWoring">tapescript</span>';
            $ListenHtml+='</div>';
            $ListenHtml+='<img src="../../static/image/prepare/p_previoceico.png" alt="" class="p_NoTapeScript" id=IsNoScript'+i+'>';
            var str=''
            str=ListenDataArr[i].retData.content;
            if(str==''||str==null){
                $ListenHtml+='<div class="p_ListenBox dino" id=IsHasScript'+i+' style="text-align: center;"><img src="../../static/image/kola/no.png" class="NoDataImg" alt=""></div>';
            }else {
                str=str.replace(/\&lt;/g,'<')
                str=str.replace(/\&gt;/g,'>')
                str=str.replace(/\&quot;/g,'"')
                str=str.replace(/\&amp;#39;/g,'´');
                str=str.replace(/\&amp;nbsp;/g, "");
                $ListenHtml+='<div class="p_ListenBox dino" id=IsHasScript'+i+'>'+str+'</div>';
            }
            $ListenHtml+='</div>';
        }
        $('#ListenMainBox').html($ListenHtml);
         ListenVoice=[];
        for(var j=0;j<$('.IsListen').length;j++){
            IsTrans(j);
            ListenVoice.push($('.IsListen').eq(j).attr('data-voicePath'));
        }

    }
};
var  ListenVoice=[];
/******************************************************课文********************************************************/
//读取课文
var Mp3SrcArr=[];
var IsBookIdBox=[];
function CheckBookMain(categoryId){
    IsBookIdBox.push(categoryId);
    if(IsBookIdBox.length==BookMain.length){
        for(var i=0;i<IsBookIdBox.length;i++){
            var SubData={};
            SubData.resId=IsBookIdBox[i];
            $.ajax({
                "type": "post",
                "url": "/web/teacher/prepare/voice/en/article",
                "dataType": "json",
                "data": SubData,
                async:false,//同步加载！！！！！很关键
                success: function (data) {
                    var codenum = parseInt(data.retCode.substr(0, 1));
                    if (codenum == 0){
                        Mp3SrcArr.push(data);
                        if(Mp3SrcArr.length==BookMain.length){
                            CreatBookHtml(Mp3SrcArr);
                            LrcPlay();
                            IsBookIdBox=[];
                        }
                    }
                }
            });
        }
    }
};
//课文html
function CreatBookHtml(data){
    $('#BookMainBox').html('');
    var $BookHtml='';
    for(var i=0;i<BookMain.length;i++){
        $BookHtml+='<div class="WrapperBox dino IsBook" id="'+data[i].retData.resId+'"  data-lrcId="'+data[i].retData.lrcId+'" data-voicePath="'+data[i].retData.voicePath+'" data-resId="'+data[i].retData.resId+'" data-voiceId="'+data[i].retData.voiceId+'">';
        $BookHtml+='<div id=lyricWrapper'+i+' class="lyricWrapper">';
        $BookHtml+='<div id=lyricContainer'+i+' class="lyricContainer"></div>';
        $BookHtml+='</div>';
        $BookHtml+='</div>';
    }
    $('#BookMainBox').html($BookHtml);
    //匹配课文数目
    Mp3Src=[];//音频重置
    LrcContent=[];
    if($('.IsBook').length==BookMain.length){
        for(var i=0;i<$('.IsBook').length;i++){
            Mp3Src.push($('.IsBook').eq(i).attr('data-voicePath'));
        }
    };

};
//获取课文音频
var Mp3Src=[];//记录课文音频地址

//歌词同步
function LrcPlay(){
    var LrcCon=[];//记录后台返回的歌词字符串
    var ThisIsLyric=[];//用来保存歌词数据；
    for(var i=0;i<Mp3SrcArr.length;i++){
        var str='';
        str=Mp3SrcArr[i].retData.content;
        str=str.replace(/\[ar:]/g,' ')
        str=str.replace(/\[al:]/g,' ')
        str=str.replace(/\[ti:]/g,' ')
        str=str.replace(/\[by:]/g,' ')
        str=str.replace(/\[offset:0]/g,' ')
        str=str.replace(/\&lt;/g,'<')
        str=str.replace(/\&gt;/g,'>')
        str=str.replace(/\&quot;/g,'"')
        str=str.replace(/\&amp;nbsp;/g, "");
        str=str.replace(/<p>/g, "");
        str=str.replace(/<\/p>/g, "");
        str=str.replace(/\&amp;#39;/g,'´');
        str=str.replace(/\[/g,'</br>[');//改变后台数据，增加字符串标识换行
        LrcCon.push(str)
    }
    console.log(LrcCon)
    for(var i=0;i<LrcCon.length;i++){
        LrcContent.push(ParseLyric(LrcCon[i]));
    }
    for(var i=0;i<LrcContent.length;i++){
        AppendLrc(LrcContent[i],i)
    }
     LrcCon=[];//记录后台返回的歌词字符串
     ThisIsLyric=[];//用来保存歌词数据
     Mp3SrcArr=[];
};
var LrcContent=[];//记录解析的歌词数组
function LrcTimeUpData(Num){
    var audio = document.getElementById('audio');
    console.log(LrcContent[Num])
    //歌词同步 当视频播放位置已经改变，显示视频当前播放位置（一秒计）
    audio.addEventListener("timeupdate", function(e){
        if (!LrcContent[Num]) return;
        for (var i = 0, l = LrcContent[Num].length; i < l; i++) {
            $('#line-'+Num+i).removeClass()
            if (audio.currentTime > LrcContent[Num][i][0] - 1.5 /*0.50s的预加载*/ ) {
                //单行显示歌词
                $('#line-'+Num + (i > 0 ? i - 1 : i)).removeClass().addClass("pre-line") ;//上一行
                //根据lyricStyle的值，匹配不同的歌词样式
                $('#line-'+Num+i).removeClass().addClass('current-line');
                //歌词上移 p.outerHeight
                var lyricWrapper=document.getElementById("lyricWrapper");
                if($('#lyricWrapper'+Num).outerHeight(true)<=$('#lyricContainer'+Num).outerHeight()){
                    if($('.pre-line').length>=6){
                        $('#lyricContainer'+Num).css({top:180 - $('#line-'+Num+i).position().top + 'px'})
                    }
                }
            }
        }
    });
    //播放完毕重置
    audio.addEventListener( 'ended', function() {
        $('#lyricContainer'+Num).css({top:0});
        if (!LrcContent[Num]) return;
        for (var i = 0, l = LrcContent[Num].length; i < l; i++) {
            $('#line-'+Num+i).removeClass() ;
        }
        Music.EngReset();
    });

};
//将歌词插入
function AppendLrc(lyric,IsDivNum){
    $('#lyricContainer'+IsDivNum).html('Loading...');
    var $LrcLine='';
    for(var j=0;j<lyric.length;j++){
        $LrcLine+='<p id=line-'+IsDivNum+''+j+'>'+lyric[j][1]+'</p>';
    }
    $('#lyricContainer'+IsDivNum).html($LrcLine);
};
//解析歌词
function ParseLyric(text){
    //将歌词分成一行一行的
    var lines = text.split('</br>'),
        pattern = /\[\d{2}:\d{2}.\d{2}\]/g,//将时间轴和歌词内容分隔开
        result = [];//保存最终结果的数组
    //去掉不含时间的行
    if (pattern.test(lines[0])) {
        lines = lines.slice(1);
    };
    //上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
    lines[lines.length - 1].length === 0 && lines.pop();
    //在页面上显示所有内容
    for(var i=0;i<lines.length;i++){
        var time = lines[i].match(pattern), value = lines[i].replace(pattern, '');
        var t = lines[i].slice(1, -1).split(':');
        result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
    }
    //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
    result.sort(function(a, b) {
        return a[0] - b[0];
    });
    console.log(result)
    return result;
};

/******************************************************新章节知识点树********************************************************/
//新章节知识点树
KnowledgeTree();
function KnowledgeTree(){
    var SubData={};
    SubData.menuId=store.get('menuId');
    $.ajax({
        "type": "post",
        "url": "/web/common/teacher/knowledgetree",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                if(AllData==null||AllData==''){
                    $('#c_Kownledge').css('display','none');
                    $('#audioplayer').css('display','none');
                    $('.p_AudioMain').css('display','none');
                    $('#NoData').css('display','block').css({"border-radius":"10px","margin":"40px auto"});;

                }else {
                    GetChapter(AllData)
                }

            }
        }
    });
};
//获取章节知识点树
function GetChapter(data){
    var Data=data;
    var newArray = [];//单节点递归解析
    function RecursiveData(data) {
        var newObj ={};
        newObj.id = data.knowledgeId;
        newObj.alias = data.alias;
        newObj.name = data.name;
        newObj.parentId = data.parentId;
        newObj.levelName = data.levelName;
        newObj.level = data.level;
        newArray.push(newObj);
        if(data.childrens){
            //递归
            $.each(data.childrens,function (i,obj) {
                RecursiveData(obj);
            });
        }
        return newArray;
    }
    var newArrays = [];//拼接单节点数据
    $.each(Data,function (i,obj) {
        newArrays = RecursiveData(obj);
    });
    //初始化html
    $('#c_Kownledge').html("");//清空
    var $html='';
    $html+= FirstKownledge(Data);//一级
    var  thisId=Data[0].knowledgeId;//一级DOM节点ID
    $('#c_Kownledge').append($html);
    Recursive(thisId,newArrays);//递归插入html
    GetLeafData(newArrays);//切换操作
    GetLastid(newArrays);//获取默认
}
//有上次记录的情况
function IsLastRecord(DefultId,newArrays){
    var LeafArr=[];
    //递归默认层级
    function LastKownledge(DefultId,data){
        for(var i=0;i<data.length;i++){
            if(data[i].id==DefultId){
                LeafArr.push(data[i])
                LastKownledge(data[i].parentId,data)
            }
        }
        return LeafArr;
    };
    var LeafMain=LastKownledge(DefultId,newArrays);
    GetVoiceData(DefultId);
    var FirstThisId=LeafMain[LeafMain.length-1].id;//一级DOM节点ID
    var FirstThisDom='#'+LeafMain[LeafMain.length-1].id;//一级DOM节点
    var $FirstDom=$(FirstThisDom).parents('.c_Directory');//一级DOM节点
    $FirstDom.nextAll().remove();//首先清除一级之后的内容，子类菜单初始化
    for(var i=LeafMain.length-1;i>-1;i--){
        var ThisId=LeafMain[i].id;
        var ThisDom='#'+LeafMain[i].id;
        $(ThisDom).css('color','#65b113');
        $(ThisDom).siblings('.GetData').css('color','#333');
        var $ThisDom=$(ThisDom).parents('.c_Directory');//当前级DOM节点
        $ThisDom.nextAll().remove();//首先清除下级之后内容，子类菜单初始化
        Recursive(ThisId,newArrays);//递归插入html
    };
}
//没有上次记录的情况
function IsDefultRecord(){
    $('.c_Directory').eq(0).find('li').eq(0).click();
}
//生成一级菜单
function FirstKownledge(FirstData){
    var $Html='';
    if(FirstData==null){
        $('#c_Kownledge').html('<img src="../../static/image/kola/no.png" alt="" class="Kolaimg">')
        return false;
    }
    $Html+='<div class="c_Directory">';
    $Html+='<p class="FirstName">'+FirstData[0].levelName+'：</p>';
    $Html+='<ul class="c_DirectoryList" >';
    for(var i=0;i<FirstData.length;i++){
        var Name=FirstData[i].name;
        var knowledgeId=FirstData[i].knowledgeId;
        var alias=FirstData[i].alias;
        var parentId=FirstData[i].parentId;
        if(alias==null){
            $Html+='<li id="'+knowledgeId+'"  class="GetData" title="'+Name+'" data-parentId="'+parentId+'">'+Name+'</li>';
        }else {
            $Html+='<li id="'+knowledgeId+'" class="GetData" title="'+Name+'  '+alias+'" data-parentId="'+parentId+'">'+Name+'&nbsp;&nbsp;'+alias+'</li>';
        }
    }
    $Html+='</ul>';
    $Html+='</div>';
    return $Html;
};
//菜单多级联动点击事件
function GetLeafData(newArrays){
    $('.GetData').off('click');
    $('.GetData').on('click',function(){

        var $Dom=$(this).parents('.c_Directory');
        var ThisId=$(this).attr('id');
        $Dom.nextAll().remove();
        Recursive(ThisId,newArrays);
        var IsCanGetCat=($Dom.nextAll().length==0);//判断是否最后一层
        if(IsCanGetCat){
            GetVoiceData(ThisId);
            SaveLastId(ThisId);
        }else {
            for(var i=0;i<$Dom.nextAll().length;i++){
                $Dom.nextAll().eq(i).find('li').eq(0).css('color','#65b113');//默认选中每一级的第一样式
                $Dom.nextAll().eq(i).find('li').eq(0).siblings('.GetData').css('color','#333')//默认选中每一级的第一样式
            }
            var LastId=$Dom.nextAll().eq($Dom.nextAll().length-1).find('li').eq(0).attr('id');
            SaveLastId(LastId);//默认记录最后一级的第一个
            GetVoiceData(LastId);//默认获取最后一级的第一个文章
        }
        $(this).css('color','#65b113');
        $(this).siblings('.GetData').css('color','#333');
    });
};
//递归循环
function Recursive(thisId,newArrays){
    var $Html = "",
        $HtmlNew = "",
        oArr = [];
    var Bool=false;
    var levelName='';
    $.each(newArrays,function (i,obj) {
        if(obj.parentId === thisId){
            Bool=true;
            oArr.push(obj.id);
            if(obj.alias==null){
                $HtmlNew+='<li id="' + obj.id + '" class="GetData" title="'+obj.name+'" data-parentId="'+obj.parentId+'">'+obj.name+'</li>';
            }else {
                $HtmlNew+='<li id="' + obj.id + '" class="GetData" title="'+obj.name+'  '+obj.alias+'" data-parentId="'+obj.parentId+'">'+obj.name+'&nbsp;&nbsp;'+obj.alias+'</li>';
            }
            levelName=obj.levelName;
        }
    });
    $Html+='<div class="c_Directory">';
    $Html+='<p class="FirstName">'+levelName+'：</p>';
    $Html+='<ul class="c_DirectoryList">'+$HtmlNew+'</ul>';
    $Html+='</div>';
    //DOM添加
    if(Bool){$('#c_Kownledge').append($Html);}
    //递归
    if(oArr.length > 0){
        var _ids = "#" + oArr[0];
        $(_ids).addClass("on");
        Recursive(oArr[0],newArrays);
    }
    GetLeafData(newArrays)
};
//获取上次记录Id
function GetLastid(newArrays){
    var SubData={};
    SubData.menuId=store.get('menuId');
    $.ajax({
        "type": "post",
        "url": "/web/common/teacherandstudent/lastcode",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                var DefultId=data.retData;
                //是否含有上次记录
                if(DefultId==''||DefultId==null){
                    IsDefultRecord();
                }else {
                    IsLastRecord(DefultId,newArrays);
                }
            }
        }
    });
}
//记录最后一次id
function SaveLastId(LastId){
    var SubData={};
    SubData.menuId=store.get('menuId');
    SubData.lastCode=LastId;
    $.ajax({
        "type": "post",
        "url": "/web/common/teacherandstudent/savelastcode",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){

            }
        }
    });
}








