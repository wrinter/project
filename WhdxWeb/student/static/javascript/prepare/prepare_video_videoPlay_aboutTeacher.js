/**
 * Created by wcd on 2016/11/28.
 */
/******************************获取导航*******************************/
CheckBrower();
//面包屑导航
$("#c_Crum li a").removeClass("fc65");
$("#c_Crum").append("<li><i class='spriteImg c_Crumgoico c_Crumgo'></i><a href='prepare_video_videoPlay_aboutTeacher.html' class='fc65'>名师简介</a></li>");

/*******************************************url**************************************/
function getUrl(){
    var url =window.location.href;
    var u = url.split("?");
    if(typeof(u[1]) == "string"){
        u= u[1].replace(/id=/,"");
        return u ;
    }
}
var teacher_id=getUrl().split("&")[0];
//判断地址栏是否传category_id
if(getUrl().indexOf("&")>0){
    var category_id=getUrl().split("&")[1].split("=")[1];
}
/***************************名师 相关视频*******************************/
var getRelativeVideo=function(){};
getRelativeVideo.prototype={
    constructor:getRelativeVideo,//确定原型链
    init:function(){
        this.relativeVideo();
        this.aboutTeacher();
    },
    relativeVideo:function(){
        var param={};
        param.teacherId=teacher_id;
        $.ajax({
            type: "post",
            url: "/web/student/prepare/video/teacher/video",
            data:param,
            dataType: "json",
            success:function(data){
                //var v_list=data.retData;
                var html = template('test', data);
                $("#prepareRelativeVideo").html(html);
              /*  var li="";
                for(var k in v_list){
                    li+="<li class='prepareRelativeVideoLi'>";
                    li+="<a href='prepare_video_prepareVideoPlay.html?id="+v_list[k].resId+"'>";//还不确定跳转的对不对-----需要非预习视频的对比
                    li+="<div class='videoImgBox'><img src='"+v_list[k].thumbnail+"'></div>";
                    li+="<p class='videoName'>"+v_list[k].resName+"</p>";
                    li+="</a></li>";
                }
                $(".prepareRelativeVideo").html(li);*/
                $('.videoImgBox').hover(function(){
                    $(this).find('.playico').stop(true).fadeIn(100);
                },function(){
                    $(this).find('.playico').stop(true).fadeOut(100);

                })
            }
        });
    },
    aboutTeacher:function(){
        var para={};
        para.categoryId=category_id;
        para.knowledgeList=store.get("lastPrepareId");
        var that=this;
        $.ajax({
            type: "post",
            url: "/web/student/prepare/video/teacher",
            data:para,
            dataType: "json",
            success:function(data){
                var t_list=data.retData;
                var Li="";
                Li+="<div class='t_photoAndName'>";
                Li+="<img id='t_photo' class='t_photo' src=''>";
                that.loadImg(t_list.resFileId);
                Li+= "<p class='teacherName'>"+t_list.name+"</p>";
                Li+="</div>";
                Li+= "<div class='teacherSynopsis'><div>"+t_list.synopsis+"</div></div>";
                $(".prepareAboutTeacherBox").html(Li);

            }
        });
    },
    loadImg:function(fileId){//从百度上获取头像
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
    },
}
$(function() {
   new getRelativeVideo().init();
})