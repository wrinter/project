/********************************************必刷题首页By徐扬**********************************************/
//获取题目
GetAllQuestion();
function GetAllQuestion(){
    var SubData={};
    SubData.id=Request.id;
    $.ajax({
        "type": "post",
        "url": "/api/student/homework/report/getUserPaperReport",
        "dataType":"json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                var answersFileIds=AllData.resPaperUser.answersFileIds
                var paperUserMarks=AllData.resPaperUser.paperUserMarks
                var totalRemarks=AllData.resPaperUser.totalRemarks
                CreatUserMarks(answersFileIds,paperUserMarks);
                CreatMarks(totalRemarks);
            }
        }
    });
};
//合并数据
function CreatUserMarks(answersFileIds,paperUserMarks){
    var UserMarks=[];
    if(answersFileIds!=null){
        for(var i=0;i<answersFileIds.length;i++){
            if(paperUserMarks!=null){
                for(var j=0;j<paperUserMarks.length;j++){
                    if(answersFileIds[i].fileId==paperUserMarks[j].imgPosition){
                        var Obj={};
                        Obj.fileId=answersFileIds[i].fileId;
                        Obj.order=answersFileIds[i].order;
                        Obj.UserAnswer=answersFileIds[i].url;
                        Obj.imgPosition=paperUserMarks[j].imgPosition;
                        Obj.TeacherMarks=paperUserMarks[j].id;
                        Obj.type=paperUserMarks[j].type;
                        UserMarks.push(Obj)
                    }
                }
            }else {
                var Obj={};
                Obj.fileId=answersFileIds[i].fileId;
                Obj.order=answersFileIds[i].order;
                Obj.UserAnswer=answersFileIds[i].url;
                UserMarks.push(Obj)
            }
        }
    }
    CreatAnswerImg(UserMarks,paperUserMarks)
}
//创建用户答案
function CreatAnswerImg(data,paperUserMarks){
    var $AnswerImg='';
    if(paperUserMarks!=null){
        for(var i=0;i<data.length;i++){
            $AnswerImg+='<li><img src="'+data[i].UserAnswer+'" alt=""><img src="'+data[i].TeacherMarks+'" alt="" class="r_TeacherMarks"></li>';
        }
    }else {
        for(var i=0;i<data.length;i++){
            $AnswerImg+='<li><img src="'+data[i].UserAnswer+'" alt=""></li>';
        }
    }

    $('#r_MyAnswer').html($AnswerImg);
};
//创建批注
function CreatMarks(data){
    if(data!=null&&data!=''){
        $('#r_TeaMark').html(data)
    }else {
        $('#r_TeaMark').html('暂无批注')
    }
}
