/********************************************备课中心******************************************************/
CheckBrower();
/*播放器*/
$( 'audio' ).audioPlayer();
closeAudio();
document.addEventListener('click',function(e){
    if(e.target.className.indexOf("p_Directory_ico")==-1){
        $(".p_DirectoryWrap").fadeOut(300);
    }
});
/*获取栏目列表*/
function GetVoiceData(subjectId,knowledgeId){
    console.log(knowledgeId)
    var SubData={};
    SubData.menuId=store.get('menuId');
    SubData.knowledgeList=knowledgeId;
    SubData.subjectId = subjectId;
    var $VoiceListHtml = "";
    $.ajax({
        "type": "post",
        "url": "/web/student/prepare/voice/category",
        "dataType": "json",
        "data": SubData,
        "async":false,
        success: function (data) {
            var AllData=data.retData;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                if(AllData.length>0){
                    ArrReset();
                    $VoiceListHtml = CreatVoiceListHtml(AllData);
                }else{
                    $VoiceListHtml ="<div class='noData'><img class='noImg' src='../../static/image/kola/no.png'></div>";
                }
            }else {
                //ResetHtml();
                //$('#c_ErrorMsg').html('该章节暂无数据').fadeIn(200);  Disappear("#c_ErrorMsg")
            }
        }
    });
    return $VoiceListHtml;
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
}



/*创建栏目列表*/
var WordMain=[];//保存单词的数据；
var ListenMain=[];//保存单词的数据；
var BookMain=[];//保存单词的数据；
function CreatVoiceListHtml(data){
    var $VoiceListHtml = "<input type='hidden' class='hidData' value='"+JSON.stringify(data)+"'/>"
    for(var i=0;i<data.length;i++){
        /*单词*/
        if(data[i].type=='6'){
            $VoiceListHtml+='<li>';
            $VoiceListHtml+='<p class="p_ListBox word" id="Word">';
            $VoiceListHtml+='<i class="prepare_sprite p_wordico0 "></i>';
            $VoiceListHtml+='<span class="p_Word w160" title="'+data[i].categoryName+'">单词</span>';
            if(data[i].idList!=null){
                $VoiceListHtml+='<span class="id dino">'+data[i].idList+'</span>';
            }
            else {
                $VoiceListHtml+='<span class="id dino">'+data[i].id+'</span>';
            }
            $VoiceListHtml+='<span class="subType dino">'+data[i].type+'</span>';
            $VoiceListHtml+='</p>';
            $VoiceListHtml+='</li>';
        }
    };//单词
    for(var i=0;i<data.length;i++){
        //听力
        if(data[i].type=='2'){
            $VoiceListHtml+='<li>';
            $VoiceListHtml+='<p class="p_ListBox listen">';
            $VoiceListHtml+='<i class="prepare_sprite p_listenico0"></i>';
            $VoiceListHtml+='<span class="p_Word " title="'+data[i].categoryName+'">'+data[i].categoryName+'</span>';
            $VoiceListHtml+='<span class="id dino">'+data[i].id+'</span>';
            $VoiceListHtml+='<span class="subType dino">'+data[i].type+'</span>';
            $VoiceListHtml+='</p>';
            $VoiceListHtml+='</li>';
        }

    };//听力
    for(var i=0;i<data.length;i++){
        //课文
        if(data[i].type=='4'){
            $VoiceListHtml+='<li>';
            $VoiceListHtml+='<p class="p_ListBox atical">';
            $VoiceListHtml+='<i class="prepare_sprite p_bookico0 "></i>';
            $VoiceListHtml+='<span class="p_Word " title="'+data[i].categoryName+'">'+data[i].categoryName+'</span>';
            $VoiceListHtml+='<span class="id dino">'+data[i].id+'</span>';
            $VoiceListHtml+='<span class="subType dino">'+data[i].type+'</span>';
            $VoiceListHtml+='</p>';
            $VoiceListHtml+='</li>';
        }
    };//课文
    return $VoiceListHtml;
};

/*栏目列表选中样式*/
function CheckListCss(){
    /*栏目选择事件*/
    $('.p_ListBox').on('click',function(){
        var hidData = JSON.parse($(this).parent().parent().find(".hidData").val());
        WordMain=[],ListenMain=[],BookMain=[]
        for(var i=0;i<hidData.length;i++){
            if(hidData[i].type=='6'){
                WordMain.push(hidData[i])
            }
            if(hidData[i].type=='2'){
                ListenMain.push(hidData[i])
            }
            if(hidData[i].type=='4'){
                BookMain.push(hidData[i])
            }
        }
        Music.EngReset();
        var ThisIndex=$(this).index();
        var ThisParentsIndex=$(this).parents('li').index();
        /*切换显示*/
        $(' .WrapperBox').eq(ThisParentsIndex).css('display','block').siblings('.WrapperBox').css("display",'none')
        $(' .WrapperBox').eq(ThisParentsIndex).css('display','block').parents('.IsMainBox').siblings().find('.WrapperBox').css("display",'none');
        /*判断栏目类型*/
        var subType=$(this).find('.subType').html();
        $(".p_ListBox").removeClass("isadd");
        $(this).css('background','white').addClass('isadd');
        $(this).parents('li').siblings().find('.p_Word').css('color','#999');
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
            CheckWordMain($(this).find(".id.dino").html());
            $('#audio').attr('src',WordAudioArr[0]);//默认第一个单词音频
            $('#WordBox').css({'left':0});
            $('.IsMainBox').css('display','none');
            $(this).find('.prepare_sprite').removeClass('p_wordico0').addClass('p_wordico1');
            $("#WordMode").css('display','block');
            $("#WordMainBox").show();
        };
        /*听力模式切换*/
        if(subType==2){
            Music.EngReset();
            CheckListenMain($(this).find(".id.dino").html(),0);
            $('.IsMainBox').css('display','none');
            $(this).find('.prepare_sprite').removeClass('p_listenico0').addClass('p_listenico1');
            $("#WordMode").css('display','none');
            $("#ListenMainBox").show();
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
            CheckBookMain($(this).find(".id.dino").html());
            $('.IsMainBox').css('display','none');
            var ListenLength=ListenVoice.length;
            var ThisIsLrcIndex=ThisParentsIndex-ListenLength-1;//当前所对应的歌词坐标
            $('#lyricContainer'+ThisIsLrcIndex).css({top:0});
            //遍历所有的歌词行，取消同步样式
            for (var i = 0;i <$('.IsBook').length; i++) {
                for(var j=0;j<$('#lyricContainer'+i).find('p').length;j++){
                    $('#line-'+i+j).removeClass() ;
                }
            }
            LrcTimeUpData(0);
            $(this).find('.prepare_sprite').removeClass('p_bookico0').addClass('p_bookico1');
            $("#WordMode").css('display','none');
            $("#BookMainBox").show();
            /*关闭自动播放*/
            var audio=document.getElementById('audio');
            /*播放下一个音频的时候延时三秒再播放*/
            audio.onended = function() {
                Music.EngStop();
                Music.EngReset();
                return false;
            };
        };
        $(".audio_pdiv").css("height",$(document).height());
        $(".audio_pdiv").show();
        $(".p_AudioMain").css("margin-top",$(document).scrollTop()+100)
    });
    //栏目移上样式变化
    $('.p_ListBox').hover(function(){
        var subType=$(this).find('.subType').html();
        $(this).find('.p_Word').css('color','#1daada');
        $(this).css('background','#d5f2fc');
        if(subType==6){$(this).find('.prepare_sprite').removeClass('p_wordico0').addClass('p_wordico1');}
        if(subType==2){$(this).find('.prepare_sprite').removeClass('p_listenico0').addClass('p_listenico1');}
        if(subType==4){$(this).find('.prepare_sprite').removeClass('p_bookico0').addClass('p_bookico1');}
    },function(){
        if($(this).hasClass('isadd')==false){
            var subType=$(this).find('.subType').html();
            $(this).find('.p_Word').css('color','#999');
            $(this).css('background','');
            if(subType==6){$(this).find('.prepare_sprite').removeClass('p_wordico1').addClass('p_wordico0');}
            if(subType==2){$(this).find('.prepare_sprite').removeClass('p_listenico1').addClass('p_listenico0');}
            if(subType==4){$(this).find('.prepare_sprite').removeClass('p_bookico1').addClass('p_bookico0');}
        }
        else {
            $(this).css('background','white');
        }
    });
};
function closeAudio(){
    $(".hidabdiv,.close_audio").click(function(){
        $(".audio_pdiv").hide();
        $(".span_div").hide();
        wrongList = [];
        $(".span_div .change_span").removeClass("chan");
        $(".span_div .read_span").addClass("chan");
        $("#audioplayer").show();
        Music.EngStop();
        clearTimeout(WordDelTime0);
    });
    $(".change_span").hover(function(){
        $(this).css("color","#49B9E1");
    },function(){
        $(this).css("color","#666666");
    })
}

/******************************************************单词********************************************************/
/*读取单词*/
function CheckWordMain(categoryId){
    var SubData={};
    SubData.resIdList=categoryId;
    $.ajax({
        "type": "post",
        "url": "/web/student/prepare/voice/word/detailFilter",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                $("#WordMode").css('display','block');
                var newWordList = [];
                for(var i in AllData){
                    if(AllData[i].audio!=null&&AllData[i].audio!=""){
                        newWordList.push(AllData[i])
                    }
                }
                CreatWordHtml(newWordList);
                CreatWordDictate();
                CreatWordDictateHtml(newWordList,0);
                $(".span_div").show();
            }
        }
    });
};
/*单词切换*/
var WordDelTime=null;
var WordDelTime0=null;
function  WordTurning(){
   var  CrrentPage_word=1;//记录当前的页数
    var ScrollWidth_word=0;//记录每次滚动的距离
    if(WordDelTime){clearInterval(WordDelTime)}
    if(WordDelTime0){clearTimeout(WordDelTime0)}
    var TotallPage_word=$('#WordBox>li').size();/*查找总页数*/
    if(document.body.offsetWidth<=1366){
        ScrollWidth_word=900;
    }else{
        ScrollWidth_word=1000;
    }
    $('#WordLeft').on('click',function(){
        Music.EngReset();
        Music.EngStop();
        if($('#audioplayer').hasClass("audioplayer-stopped")){
            if(CrrentPage_word==1){
                $('#Turn_Left').removeClass('p_leftico0').addClass('p_leftico1');
                return false;
            }else {
                CrrentPage_word--;
                $('#WordBox').animate({'left':((CrrentPage_word-1)*-ScrollWidth_word)},200);
            }
            if(WordAudioArr[CrrentPage_word-1]=='../../static/plugin/song/slice.mp3'){
                $('#c_ErrorMsg').html('暂无音频').stop(true).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
            $('#audio').attr('src',WordAudioArr[CrrentPage_word-1]);
        }
    });
    $('#WordRight').on('click',function(){
        Music.EngReset();
        Music.EngStop();
        if($('#audioplayer').hasClass("audioplayer-stopped")){
            if(CrrentPage_word==TotallPage_word){
                return false;
            }else {
                $('#WordBox').animate({'left':CrrentPage_word*-ScrollWidth_word},100);
                CrrentPage_word++;
            }
            if(WordAudioArr[CrrentPage_word-1]=='../../static/plugin/song/slice.mp3'){
                $('#c_ErrorMsg').html('暂无音频').stop(true).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
            $('#audio').attr('src',WordAudioArr[CrrentPage_word-1]);
        }
    });
    /*自动播放模式*/
    $('#playPause').on('click',function(){
        if($('#Word').hasClass('isadd')){
            /*连续播放单词*/
            var audio=document.getElementById('audio');
            /*播放下一个音频的时候延时三秒再播放*/
            audio.onended = function() {
                console.log(CrrentPage_word)
                WordDelTime0=setTimeout(function(){
                    if(CrrentPage_word==TotallPage_word){
                        return false;
                    }else {
                        $('#WordBox').animate({'left':CrrentPage_word*-ScrollWidth_word},200);
                        CrrentPage_word++;
                    }
                    if(WordAudioArr[CrrentPage_word-1]=='../../static/plugin/song/slice.mp3'){
                        $('#c_ErrorMsg').html('暂无音频').stop(true).fadeIn(200);  Disappear("#c_ErrorMsg");
                    }
                    $('#audio').attr('src',WordAudioArr[CrrentPage_word-1]);
                    Music.EngPlay();
                },1500)
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

/*创建单词html*/
var WordAudioArr=[];//创建一个数组用来记录音频地址
function CreatWordHtml(data){
    $('#WordMainBox').html('');
    WordAudioArr=[];
    var $WordHtml='<div class="title_div"></div>';
    $WordHtml+='<div class="WrapperBox" id="Word_Main">';

    $WordHtml+='<i class="wordsprite p_wordleftico0" id="WordLeft"></i>';
    $WordHtml+='<i class="wordsprite p_wordrightico1" id="WordRight"></i>';
    $WordHtml+='<div class="WordOutBox">';
    $WordHtml+='<ul class="WordBox" id="WordBox">';
    for(var i=0;i<data.length;i++){
        $WordHtml+='<li>';
        $WordHtml+='<div class="Word_ImgBox">';//缩略图内容区
        $WordHtml+='<p class="Word_Img">';
        /*$WordHtml+='<img src="../../../static/image/prepare/p_wordimg.jpg" alt="" class="w100" id=WordImg_'+i+'>';//单词缩略图*/
        if(data[i].legend!=''){
            GetWordImg(data[i].legend,i);
        }
        $WordHtml+='</p>';
        $WordHtml+='</div>';
        $WordHtml+='<div class="Word_MainBox" >';//单词内容区
        $WordHtml+='<div class="Word_Top" id=Word_Top_'+i+'>';
        $WordHtml+='<p class="Word f25" id=Word_'+i+' data-WordId="'+data[i].id+'">'+data[i].word+'</p>';
        $WordHtml+='<p class="Word_Phonogram f25">';
        if(data[i].phonogram==null){
            $WordHtml+='<span class="word_phonogram">/暂无音标/</span>';
        }else {
            $WordHtml+='<span class="word_phonogram">/'+data[i].phonogram+'/</span>';
        }
        if(data[i].audio==null){
            $WordHtml+='<i class="prepare_sprite p_wordico" id=WordBtn_'+i+' data-AudioId="../../static/plugin/song/slice.mp3"></i>';
        }else {
            $WordHtml+='<i class="prepare_sprite p_wordico" id=WordBtn_'+i+' data-AudioId="'+data[i].audio+'"></i>';
        }
        if(data[i].audio==null){
            data[i].audio="../../static/plugin/song/slice.mp3";
        }
        WordAudioArr.push(data[i].audio); //创建音频播放地址列表数组
        $('#audio').attr('src',data[0].audio);//默认第一个单词音频
        $WordHtml+='</p>';
        $WordHtml+='<ul class="Word_MeaningList">';
        for(var j=0;j<data[i].meaningList.length;j++){
            $WordHtml+='<li>';
            $WordHtml+='<span>'+data[i].meaningList[j].part+''+data[i].meaningList[j].meaning+'</span>';
            $WordHtml+='</li>';
        }
        $WordHtml+='</ul>';
        $WordHtml+='</div>';
        $WordHtml+='<div class="Word_Example">';
        $WordHtml+='<div class="Word_Attr">';
        $WordHtml+='<span class="Word_AttrName sentences">[sentences]</span>';
        $WordHtml+='<ul class="Sentences_List">';
        for(var k=0;k<data[i].exampleList.length;k++){
            $WordHtml+='<li>';
            if(data[i].exampleList[k].example!=null){
                $WordHtml+='<span class="example">'+data[i].exampleList[k].example+'</span></br>';
            }else{
                $WordHtml+='<span class="example">暂无例句</span></br>';
            }
            if(data[i].exampleList[k].example!=null){
                $WordHtml+='<span class="trans">'+data[i].exampleList[k].trans+'</span>';
            }
            $WordHtml+='</li>';
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
    changeWord();
}

/*单词听力与单词默写切换*/
function changeWord(){
    $(".span_div span").click(function(){
        if($(this).hasClass("read_span")){
            $(".wordDictate").hide();
            $(".wrong_ul").hide();
            $(".WrapperBox").show();
            $("#audioplayer").show();
            $(".span_div span").removeClass("chan");
            $(this).addClass("chan");
            $('#audio').attr('src',WordAudioArr[CrrentPage_word-1]);
        }else{
            Music.EngStop();
            clearTimeout(WordDelTime0)
        }
        if($(this).hasClass("dictate_span")){
            $(".wordDictate").show();
            $(".WrapperBox").hide();
            $("#audioplayer").hide();
            $(".span_div span").removeClass("chan");
            $(this).addClass("chan");
        }else{
            Music.EngStop();
            clearTimeout(WordDelTime0)
        }
        $(".title_div").show();
    })
}

/*单词默写---html*/
function CreatWordDictate(){
    var WordDictate = "<div class='wordDictate'><div class='word_div'></div>";
    WordDictate += '<div class="meaning_div"></div>';
    WordDictate += '<div class="request_div"></div>';
    WordDictate += '<div class="keybord">';
    WordDictate += '<ul class="one"><li class="letter">q</li><li class="letter">w</li><li class="letter">e</li><li class="letter">r</li>';
    WordDictate += '<li class="letter">t</li><li class="letter">y</li><li class="letter">u</li><li class="letter">i</li><li class="letter">o</li><li class="letter">p</li></ul>';
    WordDictate += '<ul class="two"><li class="letter">a</li><li class="letter">s</li><li class="letter">d</li><li class="letter">f</li><li class="letter">g</li><li class="letter">h</li><li class="letter">j</li><li class="letter">k</li><li class="letter">l</li></ul>';
    WordDictate += '<ul class="three"><li class="key upAndLow">Caps Lock</li><li class="letter">z</li><li class="letter">x</li><li class="letter">c</li><li class="letter">v</li>';
    WordDictate += '<li class="letter">b</li><li class="letter">n</li><li class="letter">m</li><li class="key backspace">Back Space</li>';
    WordDictate += '</ul></div></div>';
    $('#WordMainBox').append(WordDictate);
    $(".title_div").html($(".isadd .p_Word").attr("title"));
}

/*单词默写---单词词义展示和填空*/
function CreatWordDictateHtml(data,i){
    console.log(data);
    var wordDictate = '<i class="prepare_sprite p_wordico" data-audioid="'+data[i].audio+'"></i>',word = data[i].word,meaning = data[i].meaningList[0].meaning;
    for(var j=0;j<data[i].word.length;j++){
        wordDictate += '<span id="word_span_'+(j+1)+'" class="word_span';
        if(j===0){
            wordDictate += ' change_word_span"';
        }
        wordDictate += '"></span>';
    }
    wordDictate += '<span class="answer_div"></span>'
    $(".word_div").html(wordDictate);
    $(".meaning_div").html(meaning);
    keyClick(data,i,data[i].word.length);
    wordClick();
    clickInput();
}

var wrongList = [];//默写错单词的单词列表

/*字母按钮*/
function keyClick(data,num,i){
    var j = 1;
    $(".keybord ul .letter").off("click");
    $(".keybord ul .letter").click(function(){
        $("#word_span_"+String(j)).html($(this).html());
        if(j==i){
            var list = $(".word_span"),word="";
            for(var k=0; k<list.length; k++){
                if(list[k].innerHTML==""){
                    word += " ";
                }else{
                    word += list[k].innerHTML;
                }
            }
            if(data[num].word === word){
                $(".answer_div").html('<img src="../../../static/image/prepare/right.png">');
                if((num+1)>=data.length){
                    setTimeout(function(){finishDictate()},1000)
                }else{
                    setTimeout(function(){CreatWordDictateHtml(data,num+1);
                        //自动播放单词
                        if($('#audioplayer').hasClass("audioplayer-stopped")){
                            var fileId=$(".word_div .prepare_sprite").attr('data-audioid');
                            $('#audio').attr('src',fileId);
                            Music.EngPlay();
                        }
                    },1000);
                }
                $(".request_div").html("");
            }else{
                $(".meaning_div").css("margin-bottom","20px");
                $(".answer_div").html('<img src="../../../static/image/prepare/wrong.png">');
                var htm = '';
                if((num+1)>=data.length){
                    htm += '<button class="answer_button_finish">正确答案</button><span class="answer_span">'+data[num].word+'</span>';
                }else{
                    htm += '<button class="answer_button">正确答案</button><span class="answer_span">'+data[num].word+'</span>';
                }
                $(".request_div").html(htm);
                wrongList.push(data[num]);
                rightAnswer(data,num);
            }
            j++;
        }else if(j<=i){
            j++;
            $(".word_span").removeClass("change_word_span");
            $("#word_span_"+String(j)).addClass("change_word_span");
        }
    });
    $(".backspace").off("click");
    $(".backspace").click(function(){
        j--;
        $("#word_span_"+String(j)).html("");
        if(j<1){
            j=1;
        }
    });

    var flag = false;
    $(".upAndLow").off("click");
    $(".upAndLow").click(function(){
        var list = $(".keybord ul .letter");
        if(flag){
            for(var i=0;i<26;i++){
                console.log(list[i]);
                list[i].innerHTML = list[i].innerHTML.toLowerCase();
            }
            flag =false;
        }else{
            for(var i=0;i<26;i++){
                console.log(list[i]);
                list[i].innerHTML = list[i].innerHTML.toUpperCase();
            }
            flag = true;
        }
    })
    $(".word_span").click(function(){
        var id = $(this).attr("id");
        j = id.substring(id.length-1,id.length);
    });
}

/*点击输入框从点击的输入框开始输入*/
function clickInput(){
    $(".word_span").click(function(){
        $(".word_span").removeClass("change_word_span");
        $(this).addClass("change_word_span");
    });
}

/*单词默写--正确答案*/
function rightAnswer(data,num){
    $(".answer_button").click(function(){
        $(".answer_span").show();
        $(".answer_div").html("<button class='next_button'>next →</button>");
        $(this).addClass("bgcolor");
        clickNext(data,num);
    })
    $(".answer_button_finish").click(function(){
        $(".answer_span").show();
        $(this).addClass("bgcolor");
        setTimeout(function(){finishDictate()},1000);
    });
}

/*单词默写--下一个*/
function clickNext(data,num){
    $(".next_button").click(function(){
        CreatWordDictateHtml(data,num+1);
        $(".meaning_div").css("margin-bottom","60px");
        $(".request_div").html("");

        //自动播放单词
        if($('#audioplayer').hasClass("audioplayer-stopped")){
            var fileId=$(".word_div .prepare_sprite").attr('data-audioid');
            $('#audio').attr('src',fileId);
            Music.EngPlay();
        }
    });
}

/*单词默写--默写完成*/
function finishDictate(){
    $(".wordDictate").hide();
    if(wrongList.length>0){
        var htm = '<ul class="wrong_ul"><li class="wrong_title"><img src="../../../static/image/prepare/dictate.png"/><div>Pay more attention to these words !</div></li>';
        for(var n=0;n<wrongList.length;n++){
            htm += '<li class="wrong_li"><span class="word">'+wrongList[n].word+'</span><span class="phonogram">/'+wrongList[n].phonogram+'/</span><span class="meaning">'+wrongList[n].meaningList[0].meaning+'</span></li>';
        }
        htm += '</ul>';
        $("#WordMainBox").append(htm);
    }else{
        var htm = '<ul class="wrong_ul"><img class="happy_img" src="../../static/image/prepare/happy.png"/></ul>';
        $("#WordMainBox").append(htm);
    }
    $(".title_div").hide();
}

/*单词默写--播放单词*/
function wordClick(){
    $('.p_wordico').on('click',function(){
        if($('#audioplayer').hasClass("audioplayer-stopped")){
            var fileId=$(this).attr('data-AudioId');
            $('#audio').attr('src',fileId);
            Music.EngPlay();
            audio.onended = function() {
                return false;
            };
            /*连续播放单词*/
            /*播放下一个音频的时候延时三秒再播放*/
        }
    });
};

/*获取word配图*/
function GetWordImg(id,imgindex){
    var SubData={};
    SubData.fileId=id;
    $.ajax({
        "type": "post",
        "url": "/web/common/baidu/view",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
               $('#WordImg_'+imgindex).attr('src',AllData);
            }
        }
    });
};
/*高度适配*/
function WordHeight(){
    for(var i=0;i<$('#WordBox>li').length;i++){
        $('#Word_'+i).height($('#Word_'+i).parents('#Word_Top_'+i).height());
        $('.sentences').height($('.sentences').parents('.Word_Attr').height());
    }
};
/*小喇叭播放单词音频*/
function WordVoiceCheck(){
    $('.p_wordico').on('click',function(){
        if($('#audioplayer').hasClass("audioplayer-stopped")){
            var fileId=$(this).attr('data-AudioId');
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
        this.barLoaded.style.width='0%';
        this.timeCurrent.innerHTML='00:00';
    },
};
/*实例化*/
var Music=new IsCanPaly();
/******************************************************听力********************************************************/
function IsTrans(m){
    /*关闭翻译*/
    $('#a_TabBtn'+m).on('click',function(){
        /*$('#a_Tab0'+m).css("width","20%")
        $('#a_Tab1'+m).css("width","80%")
        $('#TabBtn'+m).animate({left:0},200);
        $('#a_TabCon'+m).animate({left:'-84px'},200);*/
        if($(this).hasClass("add")){
            $('#IsNoScript'+m).css('display','block');
            $('#IsHasScript'+m).css('display','none');
            $(this).removeClass("add");
            $(this).find('.ArrowsFont').css({'animation':''});
            $(this).find('.Com_SecNav').stop(true).slideUp(150);
        }else{
            $('#IsNoScript'+m).css('display','none');
            $('#IsHasScript'+m).css('display','block');
            $(this).addClass("add");
            $(this).find('.ArrowsFont').css({'animation':'change 0.3s linear 1 forwards'});
            $(this).find('.Com_SecNav').stop(true).slideDown(150);
        }
    });
    /*显示翻译*/
   /* $('#a_TabBtn'+m).on('click',function(){
        /!*$('#a_Tab0'+m).css("width","80%")
        $('#a_Tab1'+m).css("width","20%")
        $('#TabBtn'+m).animate({left:'112px'},200);
        $('#a_TabCon'+m).animate({left:0},200);*!/
        $('#IsNoScript'+m).css('display','none');
        $('#IsHasScript'+m).css('display','block');
    });*/
}
/*读取听力内容*/
function CheckListenMain(categoryId,n){
    var SubData={};
    SubData.resId=categoryId;
    $.ajax({
        "type": "post",
        "url": "/web/student/prepare/voice/en/article",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                CreatListenHtml(data,n);
            }
        }
    });
};
/*创建听力html*/
function CreatListenHtml(data,a){
    var $ListenHtml='';
    for(var i=0;i<1;i++){
        $ListenHtml+='<div class="WrapperBox matop30 IsListen" id=IsListen_'+i+' data-resId="'+data.retData.resId+'" data-voiceId="'+data.retData.voiceId+'" data-lrcId="'+data.retData.lrcId+'">';
        $ListenHtml+='<div class="fl w100">';
        $ListenHtml+='<div class="a_TabBtn"  id=a_TabBtn'+i+'>查看文本&nbsp;&nbsp;<i class="ArrowsFont Com_Down">&#xe600;</i></div>';
        /*$ListenHtml+='<img src="../../../static/image/sprite/a_tapbtn.png" alt="" class="a_TabBtnImg" id=TabBtn'+i+'>';
        $ListenHtml+='<span  class="a_Tab0" id=a_Tab0'+i+'></span>';
        $ListenHtml+='<span  class="a_Tab1" id=a_Tab1'+i+'></span>';
        $ListenHtml+='<p class="a_TabCon" id=a_TabCon'+i+'>';
        $ListenHtml+='<span class="TabT">OFF</span>';
        $ListenHtml+='<span class="TabT"></span>';
        $ListenHtml+='<span class="TabT">ON</span>';
        $ListenHtml+='</p>';*/
        /*$ListenHtml+='<span class="p_TabWoring">tapescript</span>';
        $ListenHtml+='</div>';*/
        $ListenHtml+='<img src="../../../static/image/prepare/p_previoceico.png" alt="" class="p_NoTapeScript" id=IsNoScript'+i+'>';
        var str=''
        str=data.retData.content;
        str=str.replace(/\&lt;/g,'<')
        str=str.replace(/\&gt;/g,'>')
        str=str.replace(/\&quot;/g,'"')
        str=str.replace(/\&amp;#39;/g,'´');
        str=str.replace(/\&amp;nbsp;/g, "");
        if(str==null||str==''){
            $ListenHtml+='<div class="p_ListenBox dino" id=IsHasScript'+i+'><img class="noImgListen" src="../../../static/image/kola/no.png"/></div>'
        }else{
            $ListenHtml+='<div class="p_ListenBox dino" id=IsHasScript'+i+'>'+str+'</div>';
        }
        $ListenHtml+='</div>';
    }
    $('#ListenMainBox').html($ListenHtml);
    ListenVoice=[];
    GetListenMusic($('.IsListen').eq(a).attr('data-voiceId'));
    for(var j=0;j<$('.IsListen').length;j++){
        IsTrans(j);
    }
};
/*获取听力音频*/
var ListenVoice=[];//保存听力音频
function GetListenMusic(voiceId){
    var SubData={};
    SubData.fileId=voiceId;
    $.ajax({
        "type": "post",
        "url": "/web/common/baidu/view",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                if(AllData.length>0){
                    ListenVoice.push(AllData);
                    var ListenSrc=ListenVoice[0];
                    $('#audio').attr('src',ListenSrc)
                }
                else {
                    $('#c_ErrorMsg').html('暂无听力数据').fadeIn(200);  Disappear("#c_ErrorMsg")
                }

            }
        }
    });
}
/******************************************************课文********************************************************/
/*读取课文*/
var Mp3SrcArr=[];
function CheckBookMain(categoryId){
    var SubData={};
    SubData.resId=categoryId;
    $.ajax({
        "type": "post",
        "url": "/web/student/prepare/voice/en/article",
        "dataType": "json",
        "data": SubData,
        "async":false,//同步加载！！！！！很关键
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                Mp3SrcArr.push(data);
                CreatBookHtml(Mp3SrcArr);
            }
        }
    });
};
/*课文html*/
function CreatBookHtml(data){
    $('#BookMainBox').html('');
    var $BookHtml='';
    $BookHtml+='<div class="WrapperBox IsBook" id=WordLrc_Main'+0+'  data-lrcId="'+data[0].retData.lrcId+'" data-resId="'+data[0].retData.resId+'" data-voiceId="'+data[0].retData.voiceId+'">';
    $BookHtml+='<div id=lyricWrapper'+0+' class="lyricWrapper">';
    $BookHtml+='<div id=lyricContainer'+0+' class="lyricContainer"></div>';
    $BookHtml+='</div>';
    $BookHtml+='</div>';
    $('#BookMainBox').html($BookHtml);
    //匹配课文数目
    Mp3Src=[];//音频重置
    LrcContent=[];
    GetMp3File($('.IsBook').attr('data-voiceId'));

};
/*获取课文音频*/
var Mp3Src=[];//记录课文音频地址
function GetMp3File(fileId){
        var SubData={};
        SubData.fileId=fileId;
        $.ajax({
            "type": "post",
            "url": "/web/common/baidu/view",
            "dataType": "json",
            "async":false,//同步加载！！！！！很关键
            "data": SubData,
            success: function (data) {
                var AllData=data.retData;
                var codenum = parseInt(data.retCode.substr(0, 1));
                if (codenum == 0){
                    if(AllData.length>0){
                        Mp3Src.push(AllData);
                        var BookMp3Src=Mp3Src[0];
                        $('#audio').attr('src',BookMp3Src);
                        LrcPlay();
                    }
                    else {
                        $('#c_ErrorMsg').html('暂无听力数据').fadeIn(200);  Disappear("#c_ErrorMsg")
                    }
                }
            }
        });
};
/*歌词同步*/
function LrcPlay(){
    var LrcCon=[];//记录后台返回的歌词字符串
    var ThisIsLyric=[];//用来保存歌词数据；
    for(var i=0;i<1;i++){
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
    //歌词同步 当视频播放位置已经改变，显示视频当前播放位置（一秒计）
    audio.addEventListener("timeupdate", function(e){
        if (LrcContent.length<=0) return;
        for (var i = 0, l = LrcContent[0].length; i < l; i++) {
            $('#line-'+Num+i).removeClass()
            if (audio.currentTime > LrcContent[0][i][0] - 0.50 /*0.50s的预加载*/ ) {
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
/*将歌词插入*/
function AppendLrc(lyric,IsDivNum){
    $('#lyricContainer'+IsDivNum).html('Loading...');
    var $LrcLine='';
    for(var j=0;j<lyric.length;j++){
        $LrcLine+='<p id=line-'+IsDivNum+''+j+'>'+lyric[j][1]+'</p>';
    }
    $('#lyricContainer'+IsDivNum).html($LrcLine);
};
/*解析歌词*/
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
    return result;
};




























































