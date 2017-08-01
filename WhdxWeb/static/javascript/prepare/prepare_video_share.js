/**
 * Created by wcd on 2016/11/29.
 */
/******************************获取导航*******************************/
CheckBrower();
SystemRedMsg();
function CheckTimeOut(){}
getVideoPlay();
//通过视频的ID获取视频播放的相关信息
function getVideoPlay(){
    var param={};
    param.resId=Request.id;
    $.ajax({
        type: "post",
        url: "/web/student/prepare/video/play",
        data:param,
        dataType: "json",
        success:function(data){
            var codenum = parseInt(data.retCode.substr(0, 1));
            //判断你是否成功
            if (codenum == 0) {
                var list=data.retData;
                var fileName = list.fileName;
                v_flag=list.islike;
                praiseCount=list.likeNum;
                //知识点名称
                if(list.knowledgeName){
                    $(".prepareVideoName").html(list.knowledgeName);
                }else{
                    $(".prepareVideoName").html(fileName);
                }
                //获取视频
                var PlayCode = list.playCode;
                $(".prepareVideo").html(PlayCode);
            }
        }
    });
}
/**********************开始播放的时候，浏览量加1************************/
function start(){
    var param={};
    param.resId=Request.id;
    $.ajax({
        type: "post",
        url: "/web/common/res/query",
        data:param,
        dataType: "json",
        success:function(data){

        }
    })
}
   /**************************视频开始播放时，触发*************************/
function on_spark_player_start() {
    start();
}
