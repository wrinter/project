/****************************************Created by 徐扬 on 2016/12/6.*****************************************/
/****************************************名师指点视频*****************************************/
GetHtml("../../model/common/common.txt","#Header");
var VideoId=Request.id;
SystemRedMsg();
/*获取视频资源*/
var praiseCount;
function GetVideo(){
    var SubData={};
    SubData.resId=VideoId;
    $.ajax({
        "type": "post",
        "url": "/web/teacher/prepare/video/play",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            praiseCount=data.retData.likeNum;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0) {
                CreatVideoInfo(data.retData);
                CheckIsLIke(data.retData.islike);
            }
            else {
                $('#VideoBox').html('<img src="../../../static/image/chinese/load.gif" alt="">');
            }
        }
    });
};
GetVideo();
/*视频信息html*/
function CreatVideoInfo(Data){
    var PlayCode=Data.playCode;
    var FileName=Data.fileName;
    var QueryNum=Data.queryNum ;
    var LikeNum =Data.likeNum;
    PlayCode=PlayCode.replace(/600/g,'100%');
    PlayCode=PlayCode.replace(/490/g,'660');
    $('#VideoBox').html(PlayCode)
    $('.c_VideoName').html(FileName)
    $('#c_ViewsNum').html(QueryNum)
    $('#c_likeNum').html(LikeNum)
};
//点赞
function Like(currentId) {
    $.ajax({
        type: "post",
        url: "/web/teacher/prepare/like",
        data: {resId:currentId},
        dataType: "json",
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0) {
                praiseCount+=1;
                $("#c_likeNum").html(praiseCount);
                $(".c_LikeImg").removeClass("p_Praiseico").addClass("p_yetPraiseico");
                $(".c_likeit").css("color","#F4840A");
            }
        }
    });
}
//取消点赞
function NoLike(currentId) {
    $.ajax({
        type: "post",
        url: "/web/teacher/prepare/nolike",
        data: {resId:currentId},
        dataType: "json",
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0) {
                praiseCount-=1;
                $("#c_likeNum").html(praiseCount);
                $(".c_LikeImg").removeClass("p_yetPraiseico").addClass("p_Praiseico");
                $(".c_likeit").css("color","#7B7B7B");
            }
        }
    });
}
//点赞事件
function CheckIsLIke(islike){
    $("#c_likeNum").html(praiseCount);
    if(islike==true){
        $(".c_LikeImg").removeClass("p_Praiseico").addClass("p_yetPraiseico");
        $(".c_likeit").css("color","#F4840A");
    }
    //点赞功能
    $(".c_LikeImg").on("click",function(){
        if(islike==false){
            Like(VideoId);//课件点赞
            islike=true;
        }else {
            $('#c_ErrorMsg').html('您已经点过赞啦').fadeIn(200);  Disappear("#c_ErrorMsg");
            islike=false;
        }
    });
};
/**********************开始播放的时候，浏览量加1************************/
function start(){
    var param={};
    param.resId=VideoId;
    $.ajax({
        type: "post",
        url: "/web/common/res/query",
        data:param,
        dataType: "json",
        success:function(data){
            console.log(data)
        }
    })
}
/**************************视频开始播放时，触发*************************/
function on_spark_player_start() {
    start();
}
/*分享*/
$('#c_Share').hover(function(){
    $(this).find('.p_shareico ').removeClass('p_shareico ').addClass('p_yetshareico');
},function(){
    $(this).find('.p_yetshareico').removeClass('p_yetshareico ').addClass('p_shareico');
});
$('#c_Share').on('click',function(){
    $('#Share').fadeIn(150);
    Share();
    AddShare();
});
function AddShare(){
    var ArticleData={};
    ArticleData.resId=Request.id;
    $.ajax({
        "type": "post",
        "url": "/web/common/res/share",
        "dataType":'json',
        "data": ArticleData,
        success: function (data) {
            GoldAnimate(data.retGold);
        }
    });

};