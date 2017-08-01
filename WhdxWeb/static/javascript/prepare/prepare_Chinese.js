/********************************************备课中心******************************************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
// PlayerFixed();
SystemRedMsg();
function PlayerFixed(){
    setInterval(function(){
        var Istop=$(document).scrollTop()+$(window).height()-85;
        $('#audioplayer').css('top',Istop);
    },1)
}
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
//判断对象是否为空
function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}
/*播放器*/
$( '#ComPlayerAudio' ).ComPlayer();
/********************************************备课中心******************************************************/
/*获取文章详情*/
function GetChineseArt(lastid){
    ComPlayerReset()
    $('#barLoaded').css("width",0);
    $('#timeCurrent').html('00:00');
    var SubData={};
    SubData.menuId=store.get('menuId');
    SubData.knowledgeId=lastid;
    $.ajax({
        "type": "post",
        "url": "/web/teacher/prepare/voice/ch/article",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                if(AllData!=null){
                    ResetHtml();
                    $('#ComPlayer').css('display','block');
                    $('#p_ChineseAudio').fadeIn(100);
                    $('#NoData').css('display','none');
                    CreatChinesArtHtml(AllData);
                }
                else {
                    $('#NoData').fadeIn(100);
                    $('#audioplayer').css('display','none');
                    $('#ComPlayer').css('display','none');
                }
            }
            else {
                $('#NoData').fadeIn(100);
                $('#p_ChineseAudio').css('display','none');
                $('#ComPlayer').css('display','none');
            }
        }
    });
}
/*创建文章html*/
function CreatChinesArtHtml(data){
    var $Chinese='';
    $Chinese+='<div class="p_ArtTitle">';
    $Chinese+='<p class="fs24" style="color:#333;font-size: 24px!important">'+data.title+'</p>';
    if(data.subheading==''||data.subheading==null){
        $Chinese+='<p class="fs18"></p>';
    }else {
        $Chinese+='<p class="fs18" style="color:#666;font-size: 14px!important">作者：'+data.subheading+'</p>';
    }
    $Chinese+='</div>';
    if(data.content==''||data.content==null){
        $('#NoData').fadeIn(100);
        $('#p_ChineseAudio').css('display','none');
    }else {
        $('#NoData').css('display','none');
        $Chinese+='<div class="p_ChineseArt fs18">'+data.content+'</div>';
        $Chinese=$Chinese.replace(/\&lt;/g,'<')
        $Chinese=$Chinese.replace(/\&gt;/g,'>')
        $Chinese=$Chinese.replace(/\&quot;/g,'"')
        $Chinese=$Chinese.replace(/\&amp;#39;/g,'´');
        $Chinese=$Chinese.replace(/\&amp;nbsp;/g, "");
        $Chinese=$Chinese.replace(/\&ldquo;/g,'"');
        $Chinese=$Chinese.replace(/\&rdquo;/g,'"');
        $('#ChinesArtBox').html($Chinese);
    }
    var Src=data.voicePath;
    var DefultSrc='../../static/plugin/song/slice.mp3';//默认音频文件
    NoAudioSrc(Src);
    ComPlayerReset();
    if(!isEmptyObject(Src)){
        $("#ComPlayerAudio").attr('src',Src);
    }else {
        $("#ComPlayerAudio").attr('src',DefultSrc);
    }

};
//没有音频文件
function NoAudioSrc(src) {
    $('#c_ErrorMsg').html(' ').css('display','none')
    var DefultSrc='../../static/plugin/song/slice.mp3';//默认音频文件
    if(src==DefultSrc){
        $('#c_ErrorMsg').html('暂无音频').stop(true).fadeIn(200);  Disappear("#c_ErrorMsg");
    }
};
//重置标签
function ResetHtml(){
    ComPlayerReset();
    var $Chinese='';
    $Chinese+='<div class="p_ArtTitle">';
    $Chinese+='<p class="fs24 lh65">Loading...</p>';
    $Chinese+='<p class="fs18">Loading...</p>';
    $Chinese+='</div>';
    $Chinese+='<div class="p_ChineseArt fs18">Loading...</div>';
    $('#ChinesArtBox').html($Chinese);
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
    GetChineseArt(DefultId);
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
    if(FirstData==null||FirstData.length==0){
        $('#c_Kownledge').html('<div class="NoData p_nodata" id="NoData"><img src="../../static/image/kola/no.png" class="NoDataImg" alt=""></div>');
        $('.videoBox').hide();
        return false;
    }
    $('.videoBox').show();
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
            GetChineseArt(ThisId);//默认获取最后一级的第一个文章
        }else {
            for(var i=0;i<$Dom.nextAll().length;i++){
                $Dom.nextAll().eq(i).find('li').eq(0).css('color','#65b113');//默认选中每一级的第一样式
                $Dom.nextAll().eq(i).find('li').eq(0).siblings('.GetData').css('color','#333')//默认选中每一级的第一样式
            }
            var LastId=$Dom.nextAll().eq($Dom.nextAll().length-1).find('li').eq(0).attr('id');
            SaveLastId(LastId);//默认记录最后一级的第一个
            GetChineseArt(LastId);//默认获取最后一级的第一个文章
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


























































