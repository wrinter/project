/* Created by yanenming on 2016/11/28.*/
CheckBrower();//检查浏览器版本；
GetHtml("../../model/common/common.txt","#Header");//引入导航
SystemRedMsg();
//备课中心课件列表
function GetCourseWare(last) {
    var $CourseWare="";
    var SubData={};
    SubData.menuId=store.get('menuId');
    SubData.konwledgeList=last;
    $.ajax({
        type: "post",
        url: "/web/teacher/courseware/selectAll",
        data:SubData,
        dataType: "json",
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0) {
                if(data.retData.length>0){
                    $CourseWare+='<ul>';
                    for(var i=0;i<data.retData.length;i++){
                        $CourseWare+='<li id='+data.retData[i].id+' class="p_CWlist fl">';
                        $CourseWare+="<a href='prepare_CoursePlay.html?id="+data.retData[i].id+"'>";
                        $CourseWare+='<img src="'+data.retData[i].vedioPicture+'" class="w100" alt="课件缩略图">';
                        $CourseWare+='<p class="p_CWName">'+data.retData[i].title+'</p>';
                        $CourseWare+='</li>';
                    }
                    $CourseWare+='</ul>';
                    $('#p_CourseWareWrap').html($CourseWare);
                }else{
                    $("#p_CourseWareWrap").html('<img src="../../static/image/kola/no.png" class="NoDataImg" alt="">');
                }
            }
        }
    });
}
//记录lastKnowledgeId
function RecordLastKnowledgeId(last){
    var SubData={};
    SubData.knowledgeId=last;
    $.ajax({
        type: "post",
        url: "/web/teacher/prepare/lastKnowledge",
        data: {knowledgeId:last},
        dataType: "json",
        success: function (data) {
        }
    });
}


document.addEventListener('click',function(e){
    if(e.target.className.indexOf("p_Directory_ico")==-1){
        $(".p_DirectoryWrap").fadeOut(300);
    }
});
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
    console.log(LeafMain)
    GetCourseWare(DefultId);
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
            GetCourseWare(ThisId);//默认获取最后一级的第一个文章
        }else {
            for(var i=0;i<$Dom.nextAll().length;i++){
                $Dom.nextAll().eq(i).find('li').eq(0).css('color','#65b113');//默认选中每一级的第一样式
                $Dom.nextAll().eq(i).find('li').eq(0).siblings('.GetData').css('color','#333')//默认选中每一级的第一样式
            }
            var LastId=$Dom.nextAll().eq($Dom.nextAll().length-1).find('li').eq(0).attr('id');
            SaveLastId(LastId);//默认记录最后一级的第一个
            GetCourseWare(LastId);//默认获取最后一级的第一个文章
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
















