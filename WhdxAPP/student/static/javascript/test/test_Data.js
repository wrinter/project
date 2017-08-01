/**
 * Created by lgr on 2017/5/4.
 */
function Analysis() {
    $(".r_Delete").click(function(){
        $(this).closest(".r_rendmine").hide();
    })
    var parmas = {};
    parmas.uuid = Request.uuid;
    parmas.id = Request.id;
    $.ajax({
        type : "post",
        url : "/api/student/homework/view_report/data_analysis",
        data : parmas,
        dataType : "json",
        success : function(data){
            if(data.retCode == "0000"){
                Data(data);
            }
        },
        errror : function(e){
            console.log(e)
        }
    })
}
//数据分析数据层
function Data(data){
    var r_subject = $(".r_subject");//客观
    var r_subData = $(".r_subData");//客观次要
    var r_object = $(".r_object");//主观
    var r_objData = $(".r_objData");//主观次要
    var r_Rnumber = $(".r_Rnumber");//数据
    var r_fullscore = $(".r_fullscore");//客观题正确率
    var r_score = $(".r_score");//百分比
    var r_timeData = $(".r_timeData");//时间
    var r_Analysis = $(".r_Analysis");//知識點
    var r_rendmine = $(".r_rendmine");//提醒
    var Dtrue = data.retData;
    var obRightNum = Dtrue.obRightNum;//客观题正确数量
    var objectiveNum = Dtrue.objectiveNum;//客观题数量
    var score = Dtrue.score;//总分
    var status = Dtrue.status;//0:未批；1：已批；
    var subRightNum = Dtrue.subRightNum;//主观题正确数量
    var subjectiveNum = Dtrue.subjectiveNum;//主观题数量
    var useTime = Dtrue.useTime;//用时秒
    var userScore = Dtrue.userScore;//得分
    var type = r_Rnumber.attr("type");
    var type = type.substring(0,1);
    //作业测试
    if(type == "1" || type == 1){
        //未批
        if(status == 0 || status == "0"){
            r_rendmine.show();
            if(subjectiveNum != 0 && objectiveNum != 0){
                //客观题正确率
                var right = parseInt(obRightNum);
                var sum = parseInt(objectiveNum);
                var parent = parseInt(right*100/sum);
                showCircle(parent)
                r_score.text(parent+"%");
                r_fullscore.text("客观题正确率");
                r_subData.text(obRightNum+"/"+objectiveNum);
                r_objData.text("等待批改").css({"color":"#ca0d0d"})
            }else{
                r_score.text("等待批改");
                r_fullscore.text("作业正确率");
                r_subData.text(obRightNum+"/"+objectiveNum);
                r_objData.text("等待批改").css({"color":"#ca0d0d"});
            }
        }else{//已批
            var right = parseInt(obRightNum+subRightNum);
            var sum = parseInt(objectiveNum+subjectiveNum);
            var parent = parseInt(right*100/sum);
            showCircle(parent)
            r_score.text(parent+"%");
            r_fullscore.text("作业正确率");
            r_subData.text(obRightNum+"/"+objectiveNum);
            r_objData.text(subRightNum+"/"+subjectiveNum);
        }
    }
    if(type == "2" || type == 2){
        //未批
        if(status == 0 || status == "0"){
            r_rendmine.show();
            r_Analysis.hide();
            if(subjectiveNum != 0 && objectiveNum != 0){
                //客观题正确率
                showCircle(userScore)
                r_score.text(userScore+"分");
                r_fullscore.text("客观题得分");
                r_subData.text(obRightNum+"/"+objectiveNum);
                r_objData.text("等待批改").css({"color":"#ca0d0d"})
            }else{
                r_score.text("未评分");
                r_fullscore.text("满分"+score+"分");
                r_subData.text(obRightNum+"/"+objectiveNum);
                r_objData.text("等待批改").css({"color":"#ca0d0d"});
            }
        }else{//已批
            showCircle(userScore)
            r_score.text(userScore+"分");
            r_fullscore.text("满分"+score+"分");
            r_subData.text(obRightNum+"/"+objectiveNum);
            r_objData.text(subRightNum+"/"+subjectiveNum);
        }
    }
    //次要
    r_timeData.text(ToComTime(useTime));
    //没有主观题
    if(subjectiveNum == 0){
        r_object.hide();
    }
    //没有客观题
    if(objectiveNum == 0){
        r_subject.hide();
    }
}
//圆环百分比
function showCircle(percent){
    var num = percent * 3.6;
    if(num>180){
        $(".r_pcircle").find('.right').css('transform', "rotate(180deg)");
        $(".r_pcircle").find('.left').css('transform', "rotate(" + (num - 180) + "deg)");
    }else{
        $(".r_pcircle").find('.left').css('transform', "rotate(" + num + "deg)");
    }

}

