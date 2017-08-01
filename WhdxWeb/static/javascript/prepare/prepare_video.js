/**
 * Created by wcd on 2016/11/28.
 */
/******************************获取导航*******************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
SystemRedMsg();
/***********************获取内容****************************/
function getViedoCategory(knowledgeId){//栏目ID+知识点ID --->获取相应的视频
    var param={};
    param.menuId=store.get("menuId");
    //param.knowledgeList=knowledgeId;
    $.ajax({
        type: "post",
        url: "/web/teacher/prepare/category",
        data:param,
        dataType: "json",
        success:function(data){
            var category=data.retData;
            console.log(category)
            var li="";
            var subType;
            for(var k in category){
                subType=category[k].subType;
                store.set("category"+k,category[k].id);
                if(subType==09||subType=='09'||subType==10||subType=='10'||subType==11||subType=='11'||subType==12||subType=='12'){
                    li+="<div class='video video"+k+"'>";
                    getVideoList(store.get("category"+k),knowledgeId,subType,category[k].title,"video"+k);
                    li+="</div>";
                }
            }
            $(".videoBox").html(li);
        }
    });
}
function getVideoList(categoryId,knowledgeId,subType,categoryTitle,videoK){
    var param={};
    param.categoryId=categoryId;
    param.knowledgeList=knowledgeId;
    var that=this;
    $.ajax({
        type: "post",
        url: "/web/teacher/prepare/video/list",
        data:param,
        dataType:"json",
        success:function(data){
            var _list=data.retData;
            var _li="";
            //  if((_list.length!=0)){
            _li+="<div class='iconAndCategoryTitle'>";
            _li+='<img src="../../static/image/prepare/vico.png" alt="" class="p_Vico">';
            _li+="<p class='categoryTitle fl' id='"+categoryId+"'>"+categoryTitle+"</p>";
            _li+="</div>";
            var ListLength=0
            if(data.retData==null){
                ListLength=0;
            }else {
                ListLength=_list.length;
            }
            var totalSize =ListLength ;//获取总数据
            var pageSize = 3;//每页显示4条数据
            var currentPage = 1;//当前为第一页
            var totalPage = Math.ceil(totalSize / pageSize);//计算总页数
            var scrollWidth;//通过判断浏览器的宽度决定课件容器的宽度
            if(document.body.offsetWidth<1366){
                scrollWidth=810;
            }else if(document.body.offsetWidth>=1366&&document.body.offsetWidth<=1599){
                scrollWidth=900;
            }else{
                scrollWidth=1110;
            }
            if(totalSize>3){
                _li+="<i class='p_spriteImg p_leftico p_left fl mt80 mb80'></i>";
                _li+="<i class='p_spriteImg p_right p_hoverRightico fr mt80 mb80'></i>";
            }else {
                _li += "<i class='p_spriteImg p_leftico p_left fl mt80 mb80' style='display: none'></i>";
                _li += "<i class='p_spriteImg p_rightico  p_right fr mt80 mb80' style='display: none'></i>";
            }
            // }

            if((ListLength!=0)){
                _li += "<div class='v_listBox'>";
                _li += "<ul class='v_list'>";
                for (var _k in _list) {
                    _li += "<li>";
                    _li += "<a href='prepare_video_prepareVideoPlay.html?id=" + _list[_k].resId + "&categoryId=" + categoryId + "'>";
                    _li += "<div class='videoImgBox'><img src='" + _list[_k].thumbnail + "'><p class='playico'><img class='' src='../../../static/image/prepare/video_pre.png' alt=''></p><p class='videoName '>" + _list[_k].resName + "</p></div>";
                    _li += "</a></li>";
                }
                _li += "</ul>";
                _li += "</div>";
            }else{
                _li += "<div class='v_listBox'>";
                _li += "<ul class='v_list'><img class='noData' src='../../../static/image/kola/no.png'>";
                _li += "</ul>";
                _li += "</div>";
            }

            //-------------------------li 长度>3,轮播----------------------------------
            if(totalSize>3){
                /*单击向右的箭头*/
                $(".videoBox").on("click",".p_right",function(){
                    if(currentPage==totalPage){
                        return false;
                    }else if(currentPage==totalPage-1){
                        $(this).removeClass("p_hoverRightico").addClass("p_rightico");
                        $(this).siblings(".p_left").removeClass("p_lefttico").addClass("p_hoverLeftico");
                        $(this).siblings(".v_listBox").find(".v_list").animate({left:(currentPage)*(-scrollWidth)},200);
                        currentPage++;
                    } else {
                        $(this).removeClass("p_rightico").addClass("p_hoverRightico");
                        $(this).siblings(".p_left").removeClass("p_lefttico").addClass("p_hoverLeftico");
                        $(this).siblings(".v_listBox").find(".v_list").animate({left:(currentPage)*(-scrollWidth)},200);
                        currentPage++;
                    }
                });
                $(".videoBox").on("click",".p_left",function(){
                    if(currentPage==1){
                        $(this).siblings(".p_right").removeClass("p_rightico").addClass("p_hoverRightico");
                        $(this).siblings(".p_left").removeClass("p_hoverLeftico");
                        return false;
                    }else if(currentPage==2){
                        $(this).removeClass("p_hoverLeftico");
                        $(this).siblings(".p_right").removeClass("p_rightico").addClass("p_hoverRightico");
                        currentPage--;
                        $(this).siblings(".v_listBox").find(".v_list").animate({left:((currentPage-1)*(-scrollWidth))},200)
                    }
                    else {
                        $(this).siblings(".p_right").removeClass("p_rightico").addClass("p_hoverRightico");
                        currentPage--;
                        $(this).siblings(".v_listBox").find(".v_list").animate({left:((currentPage-1)*(-scrollWidth))},200)
                    }
                });
            }
            //添加 老师
            if(subType=="09"||subType=="10"){
                _li+="<div class='prepareVideoLi prepareAddTeacher'>";
                var param={};
                param.categoryId=categoryId;
                param.knowledgeList=knowledgeId;
                $.ajax({
                    type: "post",
                    url: "/web/teacher/prepare/video/teacher",
                    data:param,
                    dataType: "json",
                    success:function(data){
                        var t_list=data.retData;
                        var Li="";
                        if(t_list){
                            Li+="<a href='prepare_video_videoPlay_aboutTeacher.html?id="+t_list.id+"&categoryId="+categoryId+"'>";
                            Li+="<div class='t_photoAndName'>";
                            Li+="<img id='t_photo' class='t_photo' src=''>";
                            loadImg(t_list.resFileId);
                            Li+= "<p class='teacherName'>"+t_list.name+"</p>";
                            Li+="</div>";
                            Li+= "<div class='teacherSynopsis'>"+t_list.synopsis+"</div>";
                            Li+="</a>";
                        }
                        $(".prepareVideoLi").html(Li);
                    }
                });
                _li+="</div>";
            }
            $("."+videoK).html(_li);
            $('.videoImgBox').hover(function(){
                $(this).find('.playico').stop(true).fadeIn(100);
            },function(){
                $(this).find('.playico').stop(true).fadeOut(100);
            })
        }
    });
}
function loadImg(fileId){//从百度上获取头像
    var param={};
    param.fileId=fileId;
    $.ajax({
        type: "post",
        url: "/web/common/baidu/view",
        data: param,
        success:function (data) {
            var t_photoSrc= data.retData;
            $(".t_photo").attr("src",t_photoSrc);
        }
    });
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
    console.log(LeafMain)
    getViedoCategory(DefultId);
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
            getViedoCategory(ThisId);//默认获取最后一级的第一个文章
        }else {
            for(var i=0;i<$Dom.nextAll().length;i++){
                $Dom.nextAll().eq(i).find('li').eq(0).css('color','#65b113');//默认选中每一级的第一样式
                $Dom.nextAll().eq(i).find('li').eq(0).siblings('.GetData').css('color','#333')//默认选中每一级的第一样式
            }
            var LastId=$Dom.nextAll().eq($Dom.nextAll().length-1).find('li').eq(0).attr('id');
            SaveLastId(LastId);//默认记录最后一级的第一个
            getViedoCategory(LastId);//默认获取最后一级的第一个文章
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
    console.log(newArrays)
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
};