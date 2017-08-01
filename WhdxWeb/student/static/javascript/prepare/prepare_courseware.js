/* Created by yanenming on 2016/11/28.*/
CheckBrower();//检查浏览器版本；
GetHtml("../../model/common/common.txt","#Header");//引入导航
//备课中心目录索引 显示隐藏
$(".p_Directory_ico").on("click",function () {
    $(".p_DirectoryWrap").fadeIn(300);
});
$(".m_del").on("click",function () {
    $(".p_DirectoryWrap").fadeOut(300);
});
//递归遍历目录
var lastPrepareId;//最后一次访问备课中心的章节id;
var firstID=null;//记录第一章第一节第一课时的id;
function recursion(list){
    var li = "<ul class='_sectionUl' style='display: none;'>";
    for (var i in list) {
        li += "<li class='_section' id='" + list[i].id + "' myidlist='"+list[i].idList+"'>" + list[i].fullName;
        if (list[i].children && list[i].children.length > 0) {
            li+=recursion(list[i].children);
        }else{
            if(firstID==null){
                firstID=list[i].id;
            }
        }
        li += "</li>";
    }
    li += "</ul>";
    return li;
}
//加载备课中心目录索引
function getIndexes() {
    var li="";
    $.ajax({
        type: "post",
        url: "/web/teacher/prepare/indexes",
        dataType: "json",
        success:function(data) {
            firstID=null;
            var codenum = parseInt(data.retCode.substr(0, 1));
            //判断你是否成功
            if (codenum == 0) {
                //获取返回的数据集合
                var list = data.retData.list;
                //便利结果集
                for (var i in list) {
                    li += "<li class='_unit' id='" + list[i].id + "' myidlist='"+list[i].idList+"'>"+list[i].fullName;
                    if (list[i].children.length > 0) {
                        li+=recursion(list[i].children);
                    } else{
                        if(firstID==null){
                            firstID=list[i].id;
                        }
                    }
                    li += "</li>";
                }
                $(".p_Directory").html(li);
                //选择章节，判断是否有子节点,如果有子节点，则是展开收起，如果没有，则取出id;
                $(".p_Directory li").on("click", function (e) {
                    stopBubble(e);
                    var IsHasUl = $(this).find('ul').length;
                    if (IsHasUl > 0) {
                        if($(this).find("ul").css("display")=="none"){
                            $(this).find("ul").css("display","block");
                        }else{
                            $(this).find("ul").css("display","none");
                        }
                        $(this).siblings().children().hide();
                    } else {
                        $(".p_DirectoryWrap li").css("color","#5a5a5a");
                        var xid = $(this).attr("id");
                        var idlist=$(this).attr("myidlist");
                        if(idlist==null||idlist==""){
                            idlist=xid;
                        }
                        lastPrepareId = idlist;
                        $(this).css("color", "#F4840A");
                        $(".p_DirectoryName").html($(this).html());
                        RecordLastKnowledgeId(lastPrepareId);
                        GetCourseWare(lastPrepareId);
                    }
                });
                //取出最后一次访问备课中心的章节id,如果为空，则取第一章第一节第一课时的id;
                if(!data.retData.userWorkLog == null){
                    lastPrepareId = data.retData.userWorkLog.lastPrepare;
                    $(".p_DirectoryName").html($("#"+lastPrepareId).html());
                    $("#"+lastPrepareId).css("color","#F4840A");
                }else {
                    lastPrepareId = firstID;
                    $(".p_DirectoryName").html($("#" + firstID).html());
                    $("#" + firstID).css("color", "#F4840A");
                }
            }
            GetCourseWare(lastPrepareId);
        }
    });
}
getIndexes();
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
                        $CourseWare+="<a href='prepare_courseware_play.html?id="+data.retData[i].id+"'>";
                        $CourseWare+='<img src="'+data.retData[i].vedioPicture+'" class="w100" alt="课件缩略图">';
                        $CourseWare+='<p class="p_CWName">'+data.retData[i].title+'</p>';
                        $CourseWare+='</li>';
                    }
                    $CourseWare+='</ul>';
                    $('#p_CourseWareWrap').html($CourseWare);
                }
                else {
                    NoDataImg();
                }

            }
        }
    });
}
//记录lastKnowledgeId
function RecordLastKnowledgeId(last){
    $.ajax({
        type: "post",
        url: "/web/teacher/prepare/lastKnowledge",
        data: {
            'knowledgeId':last
        },
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















