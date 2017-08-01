/*******************************************音频1.2  2017.06.06 By Echonessy*****************************************************/
GetHtml("../../model/common/Head.txt","#Com_Head");
CheckBrower();
//判断对象是否为空
function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}
/******************************************************新章节知识点树********************************************************/
//新章节知识点树
function KnowledgeTree(subjectId){
    var SubData={};
    SubData.subjectId=subjectId;
    SubData.menuId=store.get('menuId');
    $.ajax({
        "type": "post",
        "url": "/web/student/common/knowledge",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                if(isEmptyObject(AllData)){
                    ResetDefault()
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
        IsDefultRecord()
    }
}
//默认选择情况
function IsDefultRecord(){
    $("#c_Kownledge").find('.ComSections').eq(0).find('.GetData').eq(0).click();
}
//生成一级菜单
function FirstKownledge(FirstData){
    var $Html='';
    if(FirstData==null||FirstData.length==0){
        $('#c_Kownledge').html('<div class="NoData p_nodata" id="NoData"><img src="../../static/image/kola/no.png" class="NoDataImg" alt=""></div>');
        return false;
    }
    $Html+='<div class="ComSections">';
    $Html+='<p class="FirstName">'+FirstData[0].levelName+'：</p>';
    $Html+='<ul class="HeadList" >';
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
        var $Dom=$(this).parents('.ComSections');
        var ThisId=$(this).attr('id');
        $Dom.nextAll().remove();
        Recursive(ThisId,newArrays);
        var IsCanGetCat=($Dom.nextAll().length==0);//判断是否最后一层
        if(IsCanGetCat){
            GetTypeData(ThisId);//默认获取最后一级的第一个文章
        }else {
            for(var i=0;i<$Dom.nextAll().length;i++){
                $Dom.nextAll().eq(i).find('li').eq(0).css('color','#49b9df');//默认选中每一级的第一样式
                $Dom.nextAll().eq(i).find('li').eq(0).siblings('.GetData').css('color','#333')//默认选中每一级的第一样式
            }
            var LastId=$Dom.nextAll().eq($Dom.nextAll().length-1).find('li').eq(0).attr('id');
            GetTypeData(LastId);//默认获取最后一级的第一个文章
        }
        $(this).css('color','#49b9df');
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
    $Html+='<div class="ComSections">';
    $Html+='<p class="FirstName">'+levelName+'：</p>';
    $Html+='<ul class="HeadList">'+$HtmlNew+'</ul>';
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
/******************************************************学科********************************************************/
//获取学科
GetSubject()
function GetSubject() {
    $.ajax({
        "type": "post",
        "url": "/web/student/center/getSubjectList",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                if(!isEmptyObject(AllData)){
                    CreatSubHtml(AllData)
                }
            }
        }
    });
};
//过滤信息
function ScreenData(data,ThisName) {
    var Result='';
    for(var i=0;i<data.length;i++){
        var Name=data[i].label;
        var id=data[i].value;
        var type=data[i].type;
        if(ThisName==Name){
            Result='<li data-id="'+id+'" title="'+Name+'">'+Name+'</li>';
        }
    }
    return Result;
};
//创建学科html
function CreatSubHtml(data) {
    var Html='';
    Html+='<div class="ComSections">';
    Html+='<p class="FirstName">学科：</p>';
    Html+='<ul class="HeadList" id="SubjectList">';
    Html+=ScreenData(data,'语文') ;
    Html+=ScreenData(data,'英语') ;
    Html+='</ul>';
    Html+='</div>';
    $("#SubSections").html(Html);
    SubOption()
};
//学科选择操作
function SubOption() {
    $("#SubjectList li").off('click');
    $("#SubjectList li").on('click',function () {
        var Id=$(this).attr('data-id');
        $(this).css('color','#49b9df').addClass('ThisSubject');
        $(this).siblings('li').css('color','#333').removeClass();
        KnowledgeTree(Id);
    });
    $("#SubjectList li").eq(0).click();
};
//通过类型获取数据
function GetTypeData(id) {
    var ThisSubject=$('.ThisSubject').html();
    var SubId=$('.ThisSubject').attr('data-id');
    console.log(ThisSubject=='语文')
    if(ThisSubject=='语文'){
        ChangReset(true)
        GetChineseData(id,SubId)
    }else {
        ChangReset(false)
        GetEngData(id,SubId)
    }
};
function ResetDefault() {
    var ThisSubject=$('.ThisSubject').html();
    var SubId=$('.ThisSubject').attr('data-id');
    if(ThisSubject=='语文'){
        ChangReset(true)
    }else {
        ChangReset(false)
    }
}
//语文英语切换
function ChangReset(China) {
    if(China){
        $("#c_Category").html('');
        ComPlayerReset()
        EngPlayerReset()
        $("#English").css('display','none');
        $("#Chinese").css('display','block');
        $("#PreMain").css('margin-bottom','0px');
    }else {
        ComPlayerReset()
        EngPlayerReset()
        $("#Chinese").css('display','none');
        $("#English").css('display','block');
        $("#PreMain").css('margin-bottom','40px');
    }

}
/******************************************************语文音频********************************************************/
//获取语文数据
function GetChineseData(id,SubId){
    var SubData={};
    SubData.menuId=store.get('menuId');
    SubData.knowledgeIdList=id;
    SubData.subjectId = SubId;
    $.ajax({
        "type": "post",
        "url": "/web/student/prepare/voice/ch/article",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData[0];
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                if(!isEmptyObject(AllData)){
                    CreatArticle(AllData)
                }
                else {
                    NoChinese()
                }
            }
        }
    });
};
//创建文章
function CreatArticle(data) {
    var $Html='';
    ComPlayerReset();//播放器重置
    $("#ArtBox").html('');//重置数据
    $Html+=CreatContent(data);//创建文章内容
    $Html+=CreatNote(data);//创建注释
    $("#ArtBox").html($Html);
    ChineseAudio(data);//创建音频
};
//创建文章内容
function CreatContent(data) {
    var Content=data.content;
    var title=data.title;
    var subheading=data.subheading;
    var Html='';
    if(!isEmptyObject(title)){
        Html+='<p class="ArtName">'+title+'</p>';
    }else {
        Html+='<p class="ArtName">'+暂无题目+'</p>';
    }
    if(!isEmptyObject(subheading)){
        Html+='<p class="ArtAutor">作者：'+subheading+'</p>';
    }else {
        Html+='<p class="ArtAutor"></p>';
    }
    if(!isEmptyObject(Content)){
        Content=Content.replace(/\&lt;/g,'<');
        Content=Content.replace(/\&gt;/g,'>');
        Content=Content.replace(/\&quot;/g,'"');
        Content=Content.replace(/\&amp;quot;/g,'"');
        Content=Content.replace(/\&amp;nbsp;/g, "");
        Content=Content.replace(/\&amp;nbsp;/g, "");
        Content=Content.replace(/\&middot;/g,"·");
        Content=Content.replace(/\&ldquo;/g,'"');
        Content=Content.replace(/\&rdquo;/g,'"');
        Html+='<div class="ReadArt">'+Content+'</div>';
    }else {
        Html+='<div class="ReadArt">暂无文章</div>';
    }
    return Html;
};
//创建音频
$("#ChineseAudio").ComPlayer();
function ChineseAudio(data){
    var Src=data.voicePath;
    var DefultSrc='../../static/plugin/song/slice.mp3';
    $("#ChineseAudio").attr('src',DefultSrc);
    $("#ComPlayer").css('display','block');
    if(!isEmptyObject(Src)){
        $("#ChineseAudio").attr('src',Src);
    }else {
        $("#ChineseAudio").attr('src',DefultSrc);
    }
};
//创建注释
function CreatNote(data) {
    var NoteArt=data.contentTrans;
    var Html='';
    Html+='<div class="ReadNote">';
    Html+='<p class="NoteHeader"><img src="../../static/image/prepare1.2/eico.png" alt="">注释</p>';
    if(isEmptyObject(NoteArt)){
        Html+='<div class="NoteArt">暂无解析</div>';
    }else {
        NoteArt=NoteArt.replace(/\&lt;/g,'<');
        NoteArt=NoteArt.replace(/\&gt;/g,'>');
        NoteArt=NoteArt.replace(/\&quot;/g,'"');
        NoteArt=NoteArt.replace(/\&amp;quot;/g,'"');
        NoteArt=NoteArt.replace(/\&amp;nbsp;/g, "");
        NoteArt=NoteArt.replace(/\&amp;nbsp;/g, "");
        NoteArt=NoteArt.replace(/\&middot;/g,"·");
        NoteArt=NoteArt.replace(/\&rsquo;/g,"'");
        NoteArt=NoteArt.replace(/\&ldquo;/g,'"');
        NoteArt=NoteArt.replace(/\&rdquo;/g,'"');
        NoteArt=NoteArt.replace(/\&lsquo;/g,"'");
        Html+='<div class="NoteArt">'+NoteArt+'</div>';
    }
    Html+='</div>';
    return Html;
};
//没有数据
function NoChinese() {
    var Html='<div class="NoChinese"><img src="../../../static/image/kola/no.png" alt=""></div>';
    $("#ArtBox").html(Html);
    $("#ComPlayer").css('display','none');
};
//播放器重置
function ComPlayerReset() {
    var ComPlayer=document.getElementById('ChineseAudio');
    ComPlayer.pause();
    $("#ComPlayer").removeClass().addClass('ComPlayer ComPlayer-stopped');
    $("#Isplay").attr('title','Play');
    $("#playPause").attr('title','Play');
    $("#barLoaded").css('width','0%');
    $("#timeCurrent").html('00:00');
};
