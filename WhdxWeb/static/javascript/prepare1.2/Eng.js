/********************************************备课中心**Created by Echonessy on 2017/6/1.****************************************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
SystemRedMsg();
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
                GetChapter(AllData)
            }
        }
    });
};
//获取章节知识点树
function GetChapter(data){
    var Data=data;
    var newArray = [];//单节点递归解析
    function RecursiveData(data,level) {
        var newObj ={};
        newObj.id = data.knowledgeId;
        newObj.alias = data.alias;
        newObj.name = data.name;
        newObj.parentId = data.parentId;
        newObj.levelName = data.levelName;
        newObj.level = level;
        newArray.push(newObj);
        if(data.childrens){
            //递归
            level++;
            $.each(data.childrens,function (i,obj) {
                RecursiveData(obj,level);
            });
        }
        return newArray;
    }
    var newArrays = [];//拼接单节点数据
    $.each(Data,function (i,obj) {
        var Level=1;
        newArrays = RecursiveData(obj,Level);
    });
    //初始化html
    $('#c_Kownledge').html("");//清空
    var $html='';
    $html+= FirstKownledge(Data);//一级
    if(Data.length>0){
        var  thisId=Data[0].knowledgeId;//一级DOM节点ID
        $('#c_Kownledge').append($html);
        Recursive(thisId,newArrays);//递归插入html
        GetLeafData(newArrays);//切换操作
        GetLastid(newArrays);//获取默认
    }
}
//有上次记录的情况
function IsLastRecord(DefultId,newArrays){
    var LeafArr=[];
    //递归默认层级
    function LastKownledge(DefultId,data){
        for(var i=0;i<data.length;i++){
            var NewIdArr=[];
            var ComPactId=data[i].id
            if(ComPactId.indexOf('-')){
                NewIdArr=ComPactId.split('-');
            }else {
                NewIdArr[0]=ComPactId
            }
            for(var j=0;j<NewIdArr.length;j++){
                if(NewIdArr[j]==DefultId){
                    LeafArr.push(data[i])
                    LastKownledge(data[i].parentId,data)
                }
            }
        }
        return LeafArr;
    };
    var LeafMain=LastKownledge(DefultId,newArrays);
    GetVoiceData(DefultId);
    var FirstThisId=LeafMain[LeafMain.length-1].id;//一级DOM节点ID
    var FirstThisDom='#'+LeafMain[LeafMain.length-1].id;//一级DOM节点
    var $FirstDom=$(FirstThisDom).parents('.c_Directory');//一级DOM节点
    //$FirstDom.nextAll().remove();//首先清除一级之后的内容，子类菜单初始化
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
    if(isEmptyObject(FirstData)){
        $('#c_Kownledge').html('<div class="NoData p_nodata" id="NoData"><img src="../../static/image/kola/no.png" class="NoDataImg" alt=""></div>');
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
            $Html+='<li id="'+knowledgeId+'" class="GetData" title="'+Name+'  '+alias+'" data-parentId="'+parentId+'">'+Name+'</li>';
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
            SaveLastId(ThisId);
            GetVoiceData(ThisId);//默认获取最后一级的第一个文章
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
    var NewIdArr=[];
    if(thisId.indexOf('-')){
        NewIdArr=thisId.split('-');
    }else {
        NewIdArr[0]=thisId
    }
    $.each(newArrays,function (i,obj) {
        for(var i=0;i<NewIdArr.length;i++){
            if(obj.parentId==NewIdArr[i]){
                Bool=true;
                oArr.push(obj.id);
                if(obj.alias==null){
                    $HtmlNew+='<li id="' + obj.id + '" class="GetData" title="'+obj.name+'" data-parentId="'+obj.parentId+'">'+obj.name+'</li>';
                }else {
                    $HtmlNew+='<li id="' + obj.id + '" class="GetData" title="'+obj.name+'  '+obj.alias+'" data-parentId="'+obj.parentId+'">'+obj.name+'</li>';
                }
                levelName=obj.levelName;
            }
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
};
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
};
/******************************************************获取栏目列表********************************************************/
//判断对象是否为空
function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}
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
}
//栏目重置
function CateReset() {
    $("#c_Category").html('');
    $('#WordBox').html('');//初始化数据
    $("#NoData").css('display','none');
    $("#Content").css('display','block');
}
//没有栏目
function NoCata() {
    $("#c_Category").html('');
    $('#WordBox').html('');//初始化数据
    $("#NoData").css('display','block');
    $('#c_ErrorMsg').html(' ').css('display','none')
    // $('#c_ErrorMsg').html('该章节暂无数据').stop(true).fadeIn(200);  Disappear("#c_ErrorMsg");
    $("#Content").css('display','none');
    $("#Content").css('display','none');
}
//创建栏目
function CreatCategory(data) {
    var $Html='';
    $Html+='<div class="c_Directory">';
    $Html+='<p class="FirstName">栏目：</p>';
    $Html+='<ul class="c_DirectoryList" id="c_CategoryList" >';
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
    var Category=$('#c_CategoryList li');
    Category.off('click');
    Category.on('click',function () {
        var id=$(this).attr('data-id');
        var type=parseInt($(this).attr('data-type'));
        $(this).css('color','#65b113');
        $(this).siblings('li').css('color','#333');
        if(type==6){
            GetWordData(id);
            ComPlayerReset();
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
        "url": "/web/teacher/prepare/voice/word/detail",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                if(isEmptyObject(AllData)){

                }else {
                    CreatWordHtml(AllData)
                }
            }
        }
    });
}
//创建单词
function CreatWordHtml(data){
    $('#WordBox').html('');//初始化数据
    var $html='';
    var DefultSrc='../../static/plugin/song/slice.mp3';//默认音频文件
    $html+='<div class="swiper-container WordContent">';
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
        $html+='<p class="Sentences"><img src="'+ImgUrl+'seico.png" alt=""><span>sentences</span></p>';
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
    var mySwiper = new Swiper('.swiper-container', {
        onSlideChangeEnd: function(swiper){
            WordModel(mySwiper);
        }
    });
    ModelChoice();//模式选择
    PlayerEvent(mySwiper);
    WordPlayBtn(mySwiper)
}
//播放事件
function PlayerEvent(mySwiper) {
    var ImgUrl='../../static/image/prepare1.2/';
    $('#MediaPlayBtn').off('click');
    $('#MediaPlayBtn').on('click',function (){
        var MediaAudio=document.getElementById('MediaAudio');//播放器
        var SwiperIndex=mySwiper.activeIndex;
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
    var AllLength=$('.Singleword').size();
    var ThisAudio=$('.Singleword').eq(SwiperIndex).attr('data-audio');//音频文件
    $("#MediaAudio").attr('src',ThisAudio);//音频传值
    $('#MediaPlayBtn').attr('src',ImgUrl+'new_play1.png').addClass('playing');//修改播放器样式问题
    var ModelSingleClick=($("#MediaBtn1").hasClass('ModelSingleClick')||$("#MediaBtn0").hasClass('ModelSingleClick'));//判断上下键在单读模式是否点击
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
/******************************************************听力********************************************************/
$("#ComPlayerAudio").ComPlayer();
//读取听力内容
function GetListenData(categoryId){
    var SubData={};
    SubData.resId=categoryId;
    $.ajax({
        "type": "post",
        "url": "/web/teacher/prepare/voice/en/article",
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
    ComPlayerReset();
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
}
//播放器重置
function ComPlayerReset() {
    var ComPlayer=document.getElementById('ComPlayerAudio');
    ComPlayer.pause();
    $("#ComPlayer").removeClass().addClass('ComPlayer ComPlayer-stopped');
    $("#Isplay").attr('title','Play');
    $("#playPause").attr('title','Play');
    $("#barLoaded").css('width','0%');
    $("#timeCurrent").html('00:00');
}
/******************************************************课文********************************************************/
//读取课文
function GetBookData(id) {
    var SubData={};
    SubData.resId=id;
    $.ajax({
        "type": "post",
        "url": "/web/teacher/prepare/voice/en/article",
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
    ComPlayerReset();
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
        ComPlayerReset();
        $("#timeCurrent").html('00:00');
    });
};

