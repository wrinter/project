/**
 * Created by wcd on 2016/12/1.
 */
/******************************获取导航*******************************/
CheckBrower();
var getExtending=function () {};
getExtending.prototype={
    constructor:getExtending,//确定原型链
    init:function(){
       this.learn();//拓展学习 知识点目录
    },
    learn:function(){
        var param={};
        var that=this;
        param.menuid=store.get("menuId");
        param.subjectId = "02";
        $.ajax({
            type: "post",
            url: "/web/student/extended/index",
            dataType: "json",
            data:param,
            success:function(data){
                var codenum = parseInt(data.retCode.substr(0, 1));
                //判断你是否成功
                if (codenum == 0) {
                    var li="";
                    var l_list=data.retData[0].childrens;
                    for(var k in l_list){
                      var bucketName=l_list[k].bucketName;
                      var objectKey=l_list[k].objectKey;
                        li+="<div class='learn_titleBox'>";
                        li+="<div class='learn_title'>"+l_list[k].title+"</div>";
                        li+="<div class='learn_image'>";
                        li+="<img src='../../../static/image/prepare/img_courseware.jpg' id='img"+k+"'>"; //调百度图片
                        that.ajaxImg(bucketName,objectKey,k);
                        li+="</div>";
                        li+="<ul class='learn_content'>";
                        for(var key in l_list[k].resList){
                            li+="<li class='learn_contentLi' id='"+l_list[k].resList[key].id+"'>";
                            li+="<a target='_blank' href='../../../student/model/expandandpromote/chinese_article.html?id="+l_list[k].resList[key].id+"'>";
                            li+="<p>"+l_list[k].resList[key].title+"</p>";
                            li+="</a>";
                            /*li+="<div class='loadGold'>";
                            li+="<span class='loading cup'>下载</span>";
                            li+="<span class='needGold'>需要"+"3"+"金币</span>";
                            li+="</div>";*/
                            li+="</li>";
                        }
                        li+="</div>";
                        li+="</div>";
                    }
                    $(".learn_contentBox").html(li);
                    $('.loading').on('click',function(){
                        var id=$(this).parents('.learn_contentLi').attr('id');
                        that.CheckIsAuto(id);
                    })
                    $(".learn_contentLi").hover(function(){
                        $(this).css("color","#333").siblings().css("color","#666");
                        $(this).find(".loadGold").css({"display":"block"}).siblings().find(".loadGold").css({"display":"none"});
                    },function(){
                        $(this).css("color","#666");
                        $(this).find(".loadGold").css({"display":"none"});
                    })
                    $(".learn_contentLi").click(function(){
                        var liArray = $(this).parent().find(".learn_contentLi"),ArtId = [],ArtName = [], param = {};
                        for(var i=0; i<liArray.length;i++){
                            ArtId.push(liArray[i].id)
                            ArtName.push(liArray[i].firstChild.firstChild.innerText);
                        }
                        param.ArtId = ArtId;
                        param.ArtName = ArtName;
                        store.set('ArtTitle',param);
                    });
                }
            }
        })
    },
    ajaxImg:function(bucketName,objectKey,k){//调百度图片
        var par={};
        par.bucketName=bucketName;
        par.objectKey=objectKey;
        par.expirationInSeconds=-1;
        $.ajax({
            type: "post",
            data:par,
            url:"/web/common/baidudownload",
            success:function (data) {
                var $imgSrc=data;
             $('#img'+k).attr('src',$imgSrc);
            }
        })
    },
    UserFinance:function(id){
        var That=this;
        $.ajax({
            "type": "post",
            "url": "/web/user/finance",
            "dataType": "json",
            success: function (data) {
                var AllData=data.retData;//总数据
                var codenum = parseInt(data.retCode.substr(0, 1));
                if (codenum == 0){
                    if(AllData.allWealth>3){
                        That.CreatDownLoad(id);
                    }
                    else {
                        $('#p_LessMoney').fadeIn(200);
                        That.LessMoney();
                    }
                }
            }
        });
    },//判断用户是否金币足够
    LessMoney:function(){
        $('#GoIdentifyClose').on('click',function(){
            $('#NoIdentify').fadeOut(200);
        })
    },//用户金币不够弹窗操作
    CreatDownLoad:function(_id){
        var Url="/web/common/downLoadArtacle?id="+_id;
        var $DownLoadEle='<form action="'+Url+'"  class="dino" method="post" id="Post"></form>';
        $('#GoDownLoad').html($DownLoadEle);
        $('#Post').submit();
    },//创建下载
    CheckIsAuto:function(id){
        var that=this;
        $.ajax({
            "type": "post",
            "url": "/web/user/check/user/auth/status",
            "dataType": "json",
            success: function (data) {
                var AllData=data.retData;//总数据
                var codenum = parseInt(data.retCode.substr(0,1));
                if (codenum == 0){
                    if(AllData==0){
                        $('#NoIdentify').fadeIn(200);
                        that.NoIdentify();
                    }
                    else {
                        that.UserFinance(id);
                    }
                }
            }
        });
    },//检验用户是否认证
    NoIdentify:function(){
        $('#GoIdentifyClose').on('click',function(){
            $('#NoIdentify').fadeOut(200);
        })
    }//用户认证弹窗操作
}
$(function() {
    new getExtending().init();//实例化
});