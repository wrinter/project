/******************************************************英语音频********************************************************/
//获取英语数据
function GetEngData(id,SubId){
    var SubData={};
    SubData.menuId=store.get('menuId');
    SubData.knowledgeList=id;
    SubData.subjectId = SubId;
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
                if(isEmptyObject(AllData)){
                    NoCata()
                }
                else {
                    CateReset();
                    CreatCategory(AllData)
                }
            }else {
                NoCata()
            }
        }
    });
};
//栏目重置
function CateReset() {
    $("#c_Category").html('');
    $('#WordBox').html('');//初始化数据
    $("#NoData").css('display','none');
    $("#Content").css('display','block');
};
//没有栏目
function NoCata() {
    $("#c_Category").html('');
    $('#WordBox').html('');//初始化数据
    $("#NoData").css('display','block');
    $('#c_ErrorMsg').html(' ').css('display','none')
    // $('#c_ErrorMsg').html('该章节暂无数据').stop(true).fadeIn(200);  Disappear("#c_ErrorMsg");
    $("#Content").css('display','none');
};
//创建栏目
function CreatCategory(data) {
    var $Html='';
    $Html+='<div class="ComSections">';
    $Html+='<p class="FirstName">栏目：</p>';
    $Html+='<ul class="HeadList" id="CategoryList">';
    $Html+=CataDiff(6,data);//单词
    $Html+=CataDiff(2,data);//听力
    $Html+=CataDiff(4,data);//课文
    $Html+='</ul>';
    $Html+='</div>';
    $("#c_Category").html($Html);
    CategoryOption();
};
//栏目类型过滤排序
function CataDiff(ThisType,data) {
    var $Html='';
    for(var i=0;i<data.length;i++){
        if(ThisType==6){
            var Name='单词';
        }else {
            var Name=data[i].categoryName;
        }
        var id=data[i].id;
        var type=data[i].type;
        if(type==ThisType){
            $Html+='<li data-id="'+id+'" data-type="'+type+'"  class="GetData" title="'+Name+'">'+Name+'</li>';
        }
    }
    return $Html;
};
//栏目选择
function CategoryOption() {
    var Category=$('#CategoryList li');
    Category.off('click');
    Category.on('click',function () {
        var id=$(this).attr('data-id');
        var type=parseInt($(this).attr('data-type'));
        EngPlayerReset()
        $(this).css('color','#49b9df');
        $(this).siblings('li').css('color','#333');
        if(type==6){
            GetWordData(id);
            EngPlayerReset();
            $("#WordMain").css('display','block');
            $("#NotWord").css('display','none');
            $("#ComPlayerAudio").css('display','none');
        }else if(type==2){
            GetListenData(id);
            $('#WordBox').html('');//初始化数据
            $("#WordMain").css('display','none');
            $("#NotWord").css('display','block');
            $("#ListenMain").css('display','block');
            $("#ComPlayerAudio").css('display','block');
            $("#BookMain").css('display','none');
        }else if(type==4){
            GetBookData(id);
            $('#WordBox').html('');//初始化数据
            $("#WordMain").css('display','none');
            $("#NotWord").css('display','block');
            $("#ComPlayerAudio").css('display','block');
            $("#ListenMain").css('display','none');
            $("#BookMain").css('display','block');
        }else {}
    });
    Category.eq(0).click();//初始化

};
//没有音频文件
function NoAudioSrc(src) {
    $('#c_ErrorMsg').html(' ').css('display','none')
    var DefultSrc='../../static/plugin/song/slice.mp3';//默认音频文件
    if(src==DefultSrc){
        $('#c_ErrorMsg').html('暂无音频').stop(true).fadeIn(200);  Disappear("#c_ErrorMsg");
    }
};
/******************************************************单词********************************************************/
//获取单词数据
function GetWordData(id) {
    var SubData={};
    SubData.resIdList=id;
    $.ajax({
        "type": "post",
        "url": "/web/student/prepare/voice/word/detailFilter",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                if(isEmptyObject(AllData)){

                }else {
                    WordListenTab(AllData);//单词
                }
            }
        }
    });
};
//单词播放器
function WordPlayer(){
    var Html='';
    Html+='<audio src="../../static/plugin/song/slice.mp3" id="MediaAudio"></audio>';
    Html+='<div class="MediaModel" id="MediaModel">';
    Html+='<p class="MediaModelBox"><span id="MediaName" data-model="one" class="MediaName">单读模式</span><img src="../../static/image/prepare1.2/mico1.png" alt="" id="MediaMico"></p>';
    Html+='<div class="MediaOption" id="MediaOption">';
    Html+='<p class="MediaOptionBox" id="Model0"><img src="../../static/image/prepare1.2/ms1.png" alt="" id="Modelico0"><span>单读模式</span></p>';
    Html+='<p class="MediaOptionBox MediaBob0" id="Model1"><img src="../../static/image/prepare1.2/ms0.png" alt="" id="Modelico1"><span>连读模式</span></p>';
    Html+='<img src="../../static/image/prepare1.2/dico.png" alt="" class="MediaDownImg">';
    Html+='</div>';
    Html+='</div>';
    Html+='<div class="MediaPlayBox">';
    Html+='<img src="../../static/image/prepare1.2/btn0n.png" title="上一个" alt="" class="MediaBtn0" id="MediaBtn0">';
    Html+='<img src="../../static/image/prepare1.2/new_play0.png" alt="" class="MediaPlayBtn" id="MediaPlayBtn">';
    Html+='<img src="../../static/image/prepare1.2/btn1.png" title="下一个"  alt="" class="MediaBtn1" id="MediaBtn1">';
    Html+='</div>';
    $("#MediaPlayer").html(Html);
};
//单词播放器重置
function MediaAudioReset() {
    var MediaAudio=document.getElementById('MediaAudio');//播放器
    var ImgUrl='../../static/image/prepare1.2/';
    clearTimeout(SlideTime);
    $('#MediaPlayBtn').attr('src',ImgUrl+'new_play0.png').removeClass('playing');
    MediaAudio.pause();
    CheckBtn( store.get('ThisSwiperIndex'))
}
//单词听力默写切换
function WordListenTab(data) {
    WordPlayer();
    CreatWordHtml(data);//创建单词
    CreatDictateHtml(data);//创建默写
    $("#WordTab p").off('click');
    $("#WordTab p").on('click',function () {
        var Type=parseInt($(this).attr('data-type'));
        $(this).removeClass().addClass('ThisTab');
        $(this).siblings().removeClass();
        if(Type==0){
            $("#Read").css('display','block');
            $("#Dictate").css('display','none');
        }else {
            MediaAudioReset();
            CreatDictateHtml(data);//创建默写
            DefultPlayDicWord()
            $("#Read").css('display','none');
            $("#Dictate").css('display','block');
        }
    });
    $("#WordTab p").eq(0).click();
}
//创建单词
function CreatWordHtml(data){
    $('#WordBox').html('');//初始化数据
    var $html='';
    var DefultSrc='../../static/plugin/song/slice.mp3';//默认音频文件
    $html+='<div class="swiper-container WordContent" id="WordSwiper">';
    $html+='<div class="swiper-wrapper">';
    for(var i=0;i<data.length;i++){
        if(isEmptyObject(data[i].audio)){
            $html+='<div class="swiper-slide swiper-no-swiping Singleword" data-audio="'+DefultSrc+'">';
        }else {
            $html+='<div class="swiper-slide swiper-no-swiping Singleword" data-audio="'+data[i].audio+'">';
        }
        $html+='<div class="Word">';
        $html+=WordDetail(data[i]);
        $html+=WordMeaning(data[i].meaningList);
        $html+=WordExample(data[i].exampleList);
        $html+='</div>';
        $html+='</div>';
    }
    $html+='</div>';
    $html+='</div>';
    $("#WordBox").html($html);
    InitPlayer();
}
//单词读音
function WordDetail(data){
    var $html='';
    $html+='<p class="Worder">';
    $html+='<span>'+data.word+'</span>';
    if(isEmptyObject(data.phonogram)){
        $html+='<span>暂无音标</span>';
    }else {
        $html+='<span>/'+data.phonogram+'/</span>';
    }
    $html+='</p>';
    return $html;
}
//字词含义
function WordMeaning(data) {
    var $html='';
    $html+='';
    if(isEmptyObject(data)){
        $html+='';
    }else {
        $html+='<ul class="MeaningList">';
        for(var i=0;i<data.length;i++){
            $html+='<li>'+data[i].part+data[i].meaning+'</li>';
        }
        $html+='</ul>';
    }
    return $html;
}
//例句
function WordExample(data) {
    var $html='';
    var ImgUrl='../../static/image/prepare1.2/';
    $html+='';
    if(isEmptyObject(data)){
        $html+='';
    }else {
        $html+='<p class="Sentences"><img src="'+ImgUrl+'eico.png" alt=""><span>sentences</span></p>';
        $html+='<ul class="Example">';
        for(var i=0;i<data.length;i++){
            $html+='<li>';
            $html+='<span>'+(i+1)+'</span>';
            $html+='<div class="ExampleCon">';
            if(isEmptyObject(data[i].example)){
                $html+='<p>暂无例句</p>';
            }else {
                $html+='<p>'+data[i].example+'</p>';
                if(!isEmptyObject(data[i].trans)){
                    $html+='<p>'+data[i].trans+'</p>';
                }
            }
            $html+='</div>';
            $html+='</li>';
        }
        $html+='</ul>';
    }
    return $html;
}
//模式选择
function ModelChoice() {
    var ImgUrl='../../static/image/prepare1.2/';
    $("#MediaModel").hover(function () {
        $('#MediaOption').fadeIn(150);
        $('#MediaMico').attr('src',ImgUrl+'mico0.png');
    },function () {
        $('#MediaOption').fadeOut(150);
        $('#MediaMico').attr('src',ImgUrl+'mico1.png');
    });
    $("#Model0").on('click',function () {
        var ReadModel=$(this).find('span').html();
        $(this).find('img').attr('src',ImgUrl+'ms1.png');
        $(this).siblings('.MediaOptionBox').find('img').attr('src',ImgUrl+'ms0.png');
        $("#MediaName").attr('data-model','one').html(ReadModel);
    });
    $("#Model1").on('click',function () {
        var ReadModel=$(this).find('span').html();
        $(this).find('img').attr('src',ImgUrl+'ms1.png');
        $(this).siblings('.MediaOptionBox').find('img').attr('src',ImgUrl+'ms0.png');
        $("#MediaName").attr('data-model','two').html(ReadModel);
    });
}
//检测检测箭头
function CheckBtn(SwiperIndex){
    var AllLength=$('.Singleword').size();
    var ImgUrl='../../static/image/prepare1.2/';
    var BtnDefult0=ImgUrl+'btn0.png';
    var BtnNo0=ImgUrl+'btn0n.png';
    var BtnDefult1=ImgUrl+'btn1.png';
    var BtnNo1=ImgUrl+'btn1n.png';
    if(SwiperIndex==0){
        $("#MediaBtn0").attr('src',BtnNo0).attr('title','');
        $("#MediaBtn1").attr('src',BtnDefult1).attr('title','下一个');
    }else if(SwiperIndex==(AllLength-1)){
        $("#MediaBtn0").attr('src',BtnDefult0).attr('title','上一个');
        $("#MediaBtn1").attr('src',BtnNo1).attr('title','');
    }else {
        $("#MediaBtn0").attr('src',BtnDefult0).attr('title','上一个');
        $("#MediaBtn1").attr('src',BtnDefult1).attr('title','下一个');
    }
}
//初始化播放器
function InitPlayer() {
    //初始化Swiper
    var mySwiper = new Swiper('#WordSwiper', {
        observer:true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,//修改swiper的父元素时，自动初始化swiper
        onSlideChangeEnd: function(swiper){
            WordModel(mySwiper);
            store.set('ThisSwiperIndex',mySwiper.activeIndex)
        }
    });
    mySwiper.update();
    ModelChoice();//模式选择
    PlayerEvent(mySwiper);
    WordPlayBtn(mySwiper);
}
//播放事件
function PlayerEvent(mySwiper) {
    var ImgUrl='../../static/image/prepare1.2/';
    $('#MediaPlayBtn').off('click');
    $('#MediaPlayBtn').on('click',function (){
        var SwiperIndex=mySwiper.activeIndex;
        var MediaAudio=document.getElementById('MediaAudio');//播放器
        var ThisAudio=$('.Singleword').eq(SwiperIndex).attr('data-audio');
        var IsPlaying=$(this).hasClass('playing');//判断是否正读
        $("#MediaAudio").attr('src',ThisAudio);
        if(IsPlaying){
            clearTimeout(SlideTime);
            $(this).attr('src',ImgUrl+'new_play0.png').removeClass('playing');
            MediaAudio.pause();
            CheckBtn(SwiperIndex);
        }else {
            $(this).attr('src',ImgUrl+'new_play1.png').addClass('playing');
            WordModel(mySwiper);
        }
    });
}
//播放模式
function WordModel(swiper) {
    var Model=$("#MediaName").attr('data-model');//模式
    if(Model=='one'){
        SingleModel(swiper)
    }else {
        ContiModel(swiper)
    }
}
//播放键禁用
function MediaBtnDisabled() {
    var ImgUrl='../../static/image/prepare1.2/';
    var BtnNo0=ImgUrl+'btn0n.png';
    var BtnNo1=ImgUrl+'btn1n.png';
    $("#MediaBtn0").attr('src',BtnNo0).attr('title','');
    $("#MediaBtn1").attr('src',BtnNo1).attr('title','');
}
//单独模式
function SingleModel(mySwiper) {
    var ImgUrl='../../static/image/prepare1.2/';
    var MediaAudio=document.getElementById('MediaAudio');//播放器
    var SwiperIndex=mySwiper.activeIndex;//索引
    var ThisAudio=$('.Singleword').eq(SwiperIndex).attr('data-audio');//音频文件
    $("#MediaAudio").attr('src',ThisAudio);//音频传值
    var ModelSingleClick=($("#MediaBtn1").hasClass('ModelSingleClick')||$("#MediaBtn0").hasClass('ModelSingleClick'));//判断上下键在单读模式是否点击
    CheckBtn(SwiperIndex);
    if(!ModelSingleClick){
        MediaAudio.play();
        NoAudioSrc(ThisAudio)//判断是否有音频
        MediaBtnDisabled()
    }else {
        MediaAudio.pause();
        $('#MediaPlayBtn').attr('src',ImgUrl+'new_play0.png').removeClass('playing');
        $("#MediaBtn0").removeClass('ModelSingleClick');
        $("#MediaBtn1").removeClass('ModelSingleClick');
    }
    MediaAudio.onended = function() {
        $("#MediaBtn0").removeClass('ModelSingleClick');
        $("#MediaBtn1").removeClass('ModelSingleClick');
        $('#MediaPlayBtn').attr('src',ImgUrl+'new_play0.png').removeClass('playing');
        CheckBtn(mySwiper.activeIndex);
        return false;
    };
}
//连读模式
function ContiModel(swiper) {
    var ImgUrl='../../static/image/prepare1.2/';
    var BtnNo0=ImgUrl+'btn0n.png';
    var BtnNo1=ImgUrl+'btn1n.png';
    $("#MediaBtn0").attr('src',BtnNo0).attr('title','');
    $("#MediaBtn1").attr('src',BtnNo1).attr('title','');
    var MediaAudio=document.getElementById('MediaAudio');//播放器
    var SwiperIndex=swiper.activeIndex;//索引
    var ThisAudio=$('.Singleword').eq(SwiperIndex).attr('data-audio');//音频文件
    $("#MediaAudio").attr('src',ThisAudio);//音频传值
    $('#MediaPlayBtn').attr('src',ImgUrl+'new_play1.png').addClass('playing');//修改播放器样式问题
    var ModelSingleClick=($("#MediaBtn1").hasClass('ModelSingleClick')||$("#MediaBtn0").hasClass('ModelSingleClick'));//判断上下键在单读模式是否点击
    var AllLength=$('.Singleword').size();
    if(!ModelSingleClick){
        MediaAudio.play();
        NoAudioSrc(ThisAudio)//判断是否有音频
    }else {
        MediaAudio.pause();
        CheckBtn(SwiperIndex);
        $('#MediaPlayBtn').attr('src',ImgUrl+'new_play0.png').removeClass('playing');
        $("#MediaBtn0").removeClass('ModelSingleClick');
        $("#MediaBtn1").removeClass('ModelSingleClick');
    }
    if(SwiperIndex==(AllLength-1)){
        MediaAudio.onended = function() {
            clearTimeout(SlideTime);
            MediaAudio.pause();
            $('#MediaPlayBtn').attr('src',ImgUrl+'new_play0.png').removeClass('playing');
            $("#MediaBtn0").removeClass('ModelSingleClick');
            $("#MediaBtn1").removeClass('ModelSingleClick');
            CheckBtn(SwiperIndex);
        };
    }else {
        MediaAudio.onended = function() {
            $("#MediaBtn0").removeClass('ModelSingleClick');
            $("#MediaBtn1").removeClass('ModelSingleClick');
            PlayGoOn(swiper);
        };
    }




}
//延时连续播放
var SlideTime=null;
function PlayGoOn(mySwiper) {
    var SwiperIndex=mySwiper.activeIndex;
    var IsCanCheck=!($('#MediaPlayBtn').hasClass('playing'));//判断是否正在播放
    if(IsCanCheck){
        CheckBtn(SwiperIndex);
    }
    var AllLength=$('.Singleword').size();
    if(SlideTime){clearTimeout(SlideTime)}
    if(SwiperIndex<AllLength){
        SlideTime=setTimeout(function () {
            mySwiper.slideNext();
        },3000);
    }
}
//上下键选择单词
function WordPlayBtn(mySwiper) {
    var SwiperIndex=mySwiper.activeIndex;
    CheckBtn(SwiperIndex);//初始化箭头
    $("#MediaBtn0").off('click');
    $("#MediaBtn0").on('click',function () {
        var IsCanClick=!($('#MediaPlayBtn').hasClass('playing'));//判断是否正在播放
        if(IsCanClick){
            mySwiper.slidePrev();
            var SwiperIndex=mySwiper.activeIndex;
            CheckBtn(SwiperIndex);//初始化箭头
            var Model=$("#MediaName").attr('data-model');//模式
            $(this).addClass('ModelSingleClick')
        }
    });
    $("#MediaBtn1").off('click');
    $("#MediaBtn1").on('click',function (){
        var IsCanClick=!($('#MediaPlayBtn').hasClass('playing'));//判断是否正在播放
        if(IsCanClick){
            mySwiper.slideNext();
            var SwiperIndex=mySwiper.activeIndex;
            CheckBtn(SwiperIndex);//初始化箭头
            var Model=$("#MediaName").attr('data-model');//模式
            $(this).addClass('ModelSingleClick')
        }
    });
}
/******************************************************默写********************************************************/
/**********************************创建HTML*********************************/
//创建默写内容
function CreatDictateHtml(data){
    ShowReset();
    var $Html='';
    $Html+='<audio src="../../static/plugin/song/slice.mp3" class="dino" id="DicAudio"></audio>';
    $Html+='<div class="swiper-container" id="DictateSwiper">';
    $Html+='<div class="swiper-wrapper">';
    $Html+=CreatDicWordHtml(data);
    $Html+='</div>';
    $Html+='</div>';
    $("#DictateWord").html($Html);
    var DicSwiper= UseSwiper();
    DicWordPich();//单词位置操作
    var LowerData=LowerCaseData();
    CreatKeyBoard(LowerData,DicSwiper);//创建键盘
    DimgEvent();//小喇叭
};
//创建默写的单词数据
function CreatDicWordHtml(data) {
    var $Html='';
    var DefultClass=' swiper-slide DictateSlide swiper-no-swiping';
    // var DefultClass=' swiper-slide DictateSlide ';
    var DefultSrc='../../static/plugin/song/slice.mp3';//默认音频文件
    $.each(data,function (i,obj){
        var Src=obj.audio;
        var Phonogram='';
        if(!isEmptyObject(Src)){
            Phonogram='/'+obj.phonogram+'/';
        }
        if(isEmptyObject(Src)){
            Src=DefultSrc;
        }
        $Html+='<div class="'+DefultClass+'" data-word="'+obj.word+'" data-src="'+Src+'" data-phonogram="'+Phonogram+'">';
        $Html+=CreatDicInBoxHtml(obj);//输入
        $Html+=CreatDicMeanHtml(obj);//单词含义
        $Html+='<div class="AnswerBox">';
        $Html+='</div>';
        $Html+='</div>';
    });
    return $Html;
};
//创建查看答案Html
function CreatDicAnswerHtml(ThisWord) {
    var Html='';
    Html+='<p class="LookAnswer" data-Answer="'+ThisWord+'">查看正确答案 >></p>';
    Html+='<p class="Answer"></p>';
    return Html;
};
//创建默写输入
function CreatDicInBoxHtml(data) {
    var Word=data.word;
    var Html='';
    Html+='<div class="DicInBox" >';
    Html+='<img src="../../static/image/prepare1.2/muico.png" alt="" class="Dimg">';
    Html+=CreatDicCssHtml(Word);
    Html+='<div class="DicResult">'
    Html+='</div>';
    Html+='</div>';
    return Html;
};
//创建默写单词位置
function CreatDicCssHtml(data) {
    var WordLength=SpliceWord(data).length;
    var $Html='';
    $Html+='<ul class="DicInList" data-Word="'+data+'">';
    for(var i=0;i<WordLength;i++){
        if(i==0){
            //默认每一个单词从第一字母输入
            $Html+='<li class="DicIn" data-dis="false"></li>';
        }else {
            $Html+='<li data-dis="false"></li>';
        }
    }
    $Html+='</ul>';
    return $Html;
};
//创建默写单词含义
function CreatDicMeanHtml(data) {
    var $Html='';
    var Mean=data.meaningList;
    $Html+='<ul class="DicMeanList">';
    $.each(Mean,function (i,obj){
        $Html+='<li>'+obj.part+obj.meaning+'</li>';
    });
    $Html+='</ul>';
    return $Html;
};
//创建判断是否错误
function CreatResultHtml(right) {
    var Html='';
    if(right){
        Html+='<img src="../../static/image/prepare1.2/Re1.png" alt="">';
    }else {
        Html+='<img src="../../static/image/prepare1.2/Re0.png" alt=""><p class="NextBtn dino">next ></p>';
    }
    return Html;
};
//显示重置
function ShowReset() {
    $("#DictateWrong").css('display','none');
    $("#DictateRight").css('display','none');
    $("#StartDictate").css('display','block');
}
/**********************************创建键盘*********************************/
//小写键盘数据
function LowerCaseData() {
    var LowerCase=[
        {'key':'q', 'Id':'q'},
        {'key':'w', 'Id':'w'},
        {'key':'e', 'Id':'e'},
        {'key':'r', 'Id':'r'},
        {'key':'t', 'Id':'t'},
        {'key':'y', 'Id':'y'},
        {'key':'u', 'Id':'u'},
        {'key':'i', 'Id':'i'},
        {'key':'o', 'Id':'o'},
        {'key':'p', 'Id':'p'},
        {'key':'a', 'Id':'a'},
        {'key':'s', 'Id':'s'},
        {'key':'d', 'Id':'d'},
        {'key':'f', 'Id':'f'},
        {'key':'g', 'Id':'g'},
        {'key':'h', 'Id':'h'},
        {'key':'j', 'Id':'j'},
        {'key':'k', 'Id':'k'},
        {'key':'l', 'Id':'l'},
        {'key':'Caps Lock', 'Id':'CapsLock'},
        {'key':'z', 'Id':'z'},
        {'key':'x', 'Id':'x'},
        {'key':'c', 'Id':'c'},
        {'key':'v', 'Id':'v'},
        {'key':'b', 'Id':'b'},
        {'key':'n', 'Id':'n'},
        {'key':'m', 'Id':'m'},
        {'key':'Back Space', 'Id':'BackSpace'},
    ];
    return LowerCase;
};
//大写键盘数据
function UpperCaseData() {
    var LowerCase=LowerCaseData();
    var UpperCase=[];
    $.each(LowerCase,function (i,obj){
        var NewObj={};
        if(obj.key=='Caps Lock'){
            NewObj.class='Upper';
        }
        if(obj.key=='Caps Lock'||obj.key=='Back Space'){
            NewObj.key=obj.key
            NewObj.Id=obj.Id
        }else {
            NewObj.key=obj.key.toUpperCase();
            NewObj.Id=obj.Id.toUpperCase();
        }
        UpperCase.push(NewObj)
    })
    return UpperCase;
};
//创建键盘
function CreatKeyBoard(Data,swiper) {
    var Html='';
    $.each(Data,function (i,obj){
        if(obj.key=='Caps Lock'){
            if(isEmptyObject(obj.class)){
                Html+='<li class="Presskey" id="'+obj.Id+'">'+obj.key+'</li>';
            }else {
                Html+='<li class="Presskey '+obj.class+'" id="'+obj.Id+'" >'+obj.key+'</li>';
            }
        }else if(obj.key=='Back Space'){
            Html+='<li class="Presskey" id="'+obj.Id+'">'+obj.key+'</li>';
        }
        else {
            Html+='<li class="Letter" id="'+obj.Id+'">'+obj.key+'</li>';
        }
    });
    $("#KeyBoard").html(Html);
    KeyEvent(swiper)
};
/**********************************数据操作*********************************/
//用户输出的最终单词
function ResultDicWord(elesize,ele) {
    var str='';
    for(var i=0;i<elesize;i++){
        str+=ele.eq(i).html();
    }
    return str;
}
//分割字符串
function SpliceWord(str) {
    var Result=[];
    for(var i=0;i<str.length;i++){
        var obj={};
        obj=str.slice(i,i+1);
        Result.push(obj)
    }
    return Result;
};
//创建错误单词数据
function CreatWrongData() {
    var $WrongSlide=$('.WrongSlide');
    var WrongSize=$WrongSlide.size();
    var WrongData=[];
    for(var i=0;i<WrongSize;i++){
        var Obj={};
        Obj.word=$WrongSlide.eq(i).attr('data-word')
        Obj.phonogram=$WrongSlide.eq(i).attr('data-phonogram');
        var Mean=[];
        var $CurrentMean=$WrongSlide.eq(i).find('.DicMeanList');
        var $CurrentLi=$CurrentMean.find('li');
        for(var j=0;j<$CurrentLi.length;j++){
            var MeanObj={};
            MeanObj=$CurrentLi.eq(j).html()
            Mean.push(MeanObj)
        }
        Obj.MeanList=Mean;
        WrongData.push(Obj);
    }
    return WrongData;
};
/**********************************逻辑操作*********************************/
//启动Swiper
function UseSwiper() {
    var DictateSwiper = new Swiper('#DictateSwiper', {
        autoHeight: true, //高度随内容变化
        observer:true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,//修改swiper的父元素时，自动初始化swiper
        onSlideChangeEnd: function(swiper){
            AutoPlayDicWord(swiper);
        }
    });
    return DictateSwiper;
};
//默认播放第1个
function DefultPlayDicWord() {
    var ThisSrc=$('.DictateSlide').eq(0).attr('data-src');
    $("#DicAudio").attr('src',ThisSrc);
    var DicAudio=document.getElementById('DicAudio');
    DicAudio.play();
};
//小喇叭播放
function DimgEvent() {
    $(".Dimg").off('click');
    $(".Dimg").on('click',function () {
        var DicAudio=document.getElementById('DicAudio');
        DicAudio.play();
    });
}
//切换单词的时候自动播放
function AutoPlayDicWord(swiper) {
    var Index=swiper.activeIndex;
    var ThisSrc=$('.DictateSlide').eq(Index).attr('data-src');
    $("#DicAudio").attr('src',ThisSrc);
    var DicAudio=document.getElementById('DicAudio');
    DicAudio.play();
};
//单词位置样式操作
function DicWordPich() {
    $('.DicInList>li').off('click');
    $('.DicInList>li').on('click',function () {
        $(this).addClass('DicIn');
        $(this).siblings().removeClass();
    });
};
//键盘事件
function KeyEvent(swiper) {
    //字母控制
    LetterEvt(swiper);
    //按键大小写操作
    PressKeyEvent(swiper);
    //删除功能事件
    BackSpaceEvent(swiper);
};
//字母控制
function LetterEvt(swiper) {
    $(".Letter").off('click');
    $(".Letter").on('click',function () {
        var letter=$(this).html();
        WordPack(swiper,letter);
    });
};
//按键大小写操作
function PressKeyEvent(swiper) {
    $(".Presskey").off('click');
    //大小写切换
    $("#CapsLock").on('click',function (){
        if($(this).hasClass('Upper')){
            CreatKeyBoard(LowerCaseData(),swiper);
        }else {
            CreatKeyBoard(UpperCaseData(),swiper);
        }
    })
};
//删除功能事件
function BackSpaceEvent(swiper) {
    $('.Presskey').off('click');
    $('.Presskey').on('click',function () {
        DeletWord(swiper)
    });
};
//删除单词
function DeletWord(swiper) {
    var Index=swiper.activeIndex;
    //当前的单词填空
    var $ThisDicInList=$('.DictateSlide').eq(Index).find('.DicInList');
    //当前的单词填空的所有子类
    var $ThisDicLi=$ThisDicInList.find('li');
    //当前的单词字母
    var $ThisLi=$ThisDicInList.find('.DicIn');
    //判断当前输入的位置
    var $ThisLiIndex=$ThisLi.index();
    //判断是否可以进行填写操作
    var Dis=$ThisLi.attr('data-dis');
    if(Dis=='false'){
        if($ThisLiIndex!=0){
            //填写
            $ThisLi.html('');
            //填写完之后移除当前类
            $ThisLi.removeClass();
            //单词填空前移
            $ThisLi.prev().removeClass().addClass('DicIn');
        }else {
            //填写
            $ThisLi.html('');
        }
    }
};
//单词顺序填空
function WordPack(swiper,letter) {
    var Index=swiper.activeIndex;
    //当前的单词填空
    var $ThisDicInList=$('.DictateSlide').eq(Index).find('.DicInList');
    //当前的单词填空的所有子类
    var $ThisDicLi=$ThisDicInList.find('li');
    //当前单词的字母个数
    var Size=$ThisDicInList.children().size();
    //当前单词的正确答案
    var ThisWord=$ThisDicInList.attr('data-word');
    //当前的单词字母
    var $ThisLi=$ThisDicInList.find('.DicIn');
    //判断是否可以进行填写操作
    var Dis=$ThisLi.attr('data-dis');
    //当填写完毕之后不可再进行编辑
    if(Dis=='false'){
        //填写
        $ThisLi.html(letter);
        //填写完之后移除当前类
        $ThisLi.removeClass();
        //单词填空稍后
        $ThisLi.next().removeClass().addClass('DicIn');
        //输出的单词
        var EndWord= ResultDicWord(Size,$ThisDicLi);
        if(EndWord.length==Size){
            JudgeDic(swiper,EndWord);
        }
    }
};
//判断用户最终结果
function JudgeDic(swiper,EndWord) {
    var Index=swiper.activeIndex;
    //当前的单词填空
    var $ThisDicInList=$('.DictateSlide').eq(Index).find('.DicInList');
    // 当前单词
    var $ThisSlide=$('.DictateSlide').eq(Index);
    //当前的单词填空的所有子类
    var $ThisDicLi=$ThisDicInList.find('li');
    //存放正确与否
    var $ThisDicResult=$ThisDicInList.siblings('.DicResult');
    $ThisDicLi.attr('data-dis','true')
    //当前单词的正确答案
    var ThisWord=$ThisDicInList.attr('data-word');
    //统计分析
    Statistics(swiper);
    if(EndWord==ThisWord){
        $ThisDicResult.html(CreatResultHtml(true))
        GoOnDicNext(swiper);
    }else {
        $ThisSlide.addClass('WrongSlide');//记录错误的单词页
        $ThisDicResult.html(CreatResultHtml(false));
        CreatDicAnswer(swiper,ThisWord)
    }

};
/**********************默写错误相关操作*************************/
//创建查看答案
function CreatDicAnswer(swiper,ThisWord) {
    var Index=swiper.activeIndex;
    //当前的查看单词盒子
    var $ThisAnswerBox=$('.DictateSlide').eq(Index).find('.AnswerBox');
    $ThisAnswerBox.html( CreatDicAnswerHtml(ThisWord));
    GetDicAnswer(swiper)
};
//获取正确答案
function GetDicAnswer(swiper) {
    $(".LookAnswer").off('click');
    $(".LookAnswer").on('click',function () {
        var Index=swiper.activeIndex;
        var WordSize=$('.DictateSlide').size();
        var Answer=$(this).attr('data-Answer');
        //当前的单词结果按钮
        var $ThisDicResultBtn=$('.DictateSlide').eq(Index).find('.NextBtn');
        var $Answer=$(this).siblings('.Answer');
        if(Index<WordSize-1){
            $ThisDicResultBtn.fadeIn(150);
        }
        $Answer.html(Answer);
        DicNext(swiper)
    })
};
//点击next继续下一个
function DicNext(swiper) {
    $('.NextBtn').off('click');
    $('.NextBtn').on('click',function () {
        swiper.slideNext();
    });
};
/**********************默写正确相关操作*************************/
//默写正确切换下一题
function GoOnDicNext(swiper) {
    var Time=null;
    if(Time){clearTimeout(Time)}
    Time=setTimeout(function () {
        swiper.slideNext();
    },1000)
}
/**********************最终默写统计*************************/
//默写统计
function Statistics(swiper) {
    var WordSize=$('.DictateSlide').size();
    var Current=swiper.activeIndex;
    var WrongSize=$('.WrongSlide').size();
    if (Current==WordSize-1){
        if(WrongSize>0){
            DicHasWrong();
        }else {
            DicHasRight();
        }
    }
}
//默写有错误
function DicHasWrong() {
    var Time=null;
    if(Time){clearTimeout(Time)}
    Time=setTimeout(function () {
        CreateWrongHTML();
        $("#StartDictate").css('display','none');
        $("#DictateRight").css('display','none');
        $("#DictateWrong").fadeIn(150);
    },1000)
}
//创建错误单词列表
function CreateWrongHTML() {
    var Data=CreatWrongData();
    var $Html='';
    $.each(Data,function (i,obj){
        $Html+='<li>';
        $Html+='<p class="WrongWorder">';
        $Html+='<span>'+(i+1)+'</span>';
        $Html+='<span>'+obj.word+'</span>';
        $Html+='<span>'+obj.phonogram+'</span>';
        $Html+='</p>';
        $Html+='<ul class="WrongMean">';
        $.each(obj.MeanList,function (i,obj){
            $Html+='<li>'+obj+'</li>';
        })
        $Html+='</ul>';
        $Html+='</li>';
    });
    $("#WrongList").html($Html);
};
//默写全对
function DicHasRight() {
    $("#StartDictate").css('display','none');
    $("#DictateWrong").css('display','none');
    $("#DictateRight").fadeIn(150);
}
/******************************************************听力********************************************************/
//启动听力
InitWordEngPlayer()
function InitWordEngPlayer() {
    $("#ComPlayerAudio").EngPlayer();
};
//读取听力内容
function GetListenData(categoryId){
    var SubData={};
    SubData.resId=categoryId;
    $.ajax({
        "type": "post",
        "url": "/web/student/prepare/voice/en/article",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            var AllData=data.retData;
            if (codenum == 0){
                CreatListenHtml(AllData);
            }
        }
    });
};
//创建听力html
function CreatListenHtml(data){
    $('#ListenMain').html('');
    var $ListenHtml='';
    var Content=data.content;
    var Src=data.voicePath;
    var DefultSrc='../../static/plugin/song/slice.mp3';//默认音频文件
    NoAudioSrc(Src);
    EngPlayerReset();
    if(!isEmptyObject(Src)){
        $("#ComPlayerAudio").attr('src',Src);
    }else {
        $("#ComPlayerAudio").attr('src',DefultSrc);
    }
    if(!isEmptyObject(data)){
        $ListenHtml+='<div class="ListenBtnBox">';
        $ListenHtml+='<p class="ListenBtn" data-status="0"><span>查看文本</span><img src="../../static/image/prepare1.2/lico0.png" alt=""></p>';
        $ListenHtml+='</div>';
        if(isEmptyObject(Content)){
            $ListenHtml+='<div class="ListenBox dino" id="ListenBox">暂无听力原文</div>';
        }else {
            $ListenHtml+='<div class="ListenBox dino" id="ListenBox">'+CodeEncipher(Content)+'</div>';
        }
        $ListenHtml+='<div class="ListenImg" id="ListenClose"><img src="../../static/image/prepare1.2/p_previoceico.png" alt=""></div>';
        $("#ListenMain").html($ListenHtml);
    }else {
        $ListenHtml='<div class="NoListen"> <img src="../../static/image/kola/no.png" class="NoDataImg" alt=""> </div>';
        $("#ListenMain").html($ListenHtml);
    }
    ListenOpen();
};
//字符串解析
function CodeEncipher(str) {
    var Result='';
    if(!isEmptyObject(str)){
        str=str.replace(/\&lt;/g,'<');
        str=str.replace(/\&gt;/g,'>');
        str=str.replace(/\&quot;/g,'"');
        str=str.replace(/\&amp;#39;/g,'´');
        str=str.replace(/\&amp;nbsp;/g, "");
        str=str.replace(/\&rsquo;/g,"'");
        str=str.replace(/\&ldquo;/g,'"');
        str=str.replace(/\&rdquo;/g,'"');
        Result=str;
    }
    return Result;
};
//查看听力
function ListenOpen() {
    var ListenIco0='../../static/image/prepare1.2/lico0.png';
    var ListenIco1='../../static/image/prepare1.2/lico1.png';
    $('.ListenBtn').on('click',function () {
        var Status=parseInt($(this).attr('data-status'));
        if(Status==0){
            $("#ListenBox").css('display','block');
            $("#ListenClose").css('display','none');
            $(this).find('span').html('收起文本');
            $(this).find('img').attr('src',ListenIco1);
            $(this).attr('data-status',1);
        }else {
            $("#ListenBox").css('display','none');
            $("#ListenClose").css('display','block');
            $(this).find('span').html('查看文本');
            $(this).find('img').attr('src',ListenIco0);
            $(this).attr('data-status',0);
        }
    })
};
/******************************************************课文********************************************************/
//读取课文
function GetBookData(id) {
    var SubData={};
    SubData.resId=id;
    $.ajax({
        "type": "post",
        "url": "/web/student/prepare/voice/en/article",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            var AllData=data.retData;
            if (codenum == 0){
                AppendLrc(AllData);
            }
        }
    });
};
//字符串解析歌词
function LrcAnalysis(data) {
    var ThisIsLyric=[];//用来保存歌词数据；
    var str=data.content;
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
    str=str.replace(/\&rsquo;/g,"'");
    str=str.replace(/\[/g,'</br>[');//改变后台数据，增加字符串标识换行
    ThisIsLyric=ParseLyric(str);//解析歌词
    return ThisIsLyric;
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
	return result;
};
//将歌词插入
function AppendLrc(data){
	var Src=data.voicePath;
    var DefultSrc='../../static/plugin/song/slice.mp3';//默认音频文件
    EngPlayerReset();
    NoAudioSrc(Src);
    if(!isEmptyObject(Src)){
        $("#ComPlayerAudio").attr('src',Src);
    }else {
        $("#ComPlayerAudio").attr('src',DefultSrc);
    }
    $('#BookContent').html('Loading...');
    var $LrcLine='';
    var lyric=LrcAnalysis(data);
    for(var j=0;j<lyric.length;j++){
        $LrcLine+='<p id=line-'+j+'>'+lyric[j][1]+'</p>';
    }
    $('#BookContent').html($LrcLine);
    LrcTimeUpData(data);
};
//监听播放器变化
function LrcTimeUpData(data) {
    var audio = document.getElementById('ComPlayerAudio');
    //歌词同步 当视频播放位置已经改变，显示视频当前播放位置（一秒计）
    var LrcData=LrcAnalysis(data);
    audio.addEventListener("timeupdate", function(e){
        if (!LrcData) return;
        if(!isEmptyObject(LrcData)){
            for(var i=0;i<LrcData.length;i++){
                $('#line-'+i).removeClass();
                if(audio.currentTime>LrcData[i][0] - 0.5 /*0.50s的预加载*/ ){
                    //单行显示歌词
                    $('#line-' + (i > 0 ? i - 1 : i)).removeClass().addClass("pre-line") ;//上一行
                    //根据lyricStyle的值，匹配不同的歌词样式
                    $('#line-'+i).removeClass().addClass('current-line');
                    //歌词上移 p.outerHeight
                    var BookContent=$("#BookContent").height();//内容高度
                    var BookBox=$("#BookBox").height();//内容固定高度
                    var LrcPreSize=$('.pre-line').size();//同步数量
                    if(BookBox<=BookContent){
                        if(LrcPreSize>6){
                            $('#BookContent').css({top:180 - $('#line-'+i).position().top + 'px'});//超过6行之后移动同步
                        }
                    }
                }
            }
        }
    });
    //播放完毕重置
    audio.addEventListener( 'ended', function() {
        $('#BookContent').css({top:0});
        $("#BookContent p").removeClass();
        EngPlayerReset();
        $("#timeCurrent").html('00:00');
    });
};
//播放器重置
function EngPlayerReset() {
    var ComPlayer=document.getElementById('ComPlayerAudio');
    ComPlayer.pause();
    $("#EngPlayer").removeClass().addClass('EngPlayer EngPlayer-stopped');
    $("#Eng-Isplay").attr('title','Play');
    $("#Eng-playPause").attr('title','Play');
    $("#Eng-barLoaded").css('width','0%');
    $("#Eng-timeCurrent").html('00:00');
};

