/**
 * Created by zxl on 2017/4/18.
 */
$(function() {
    GetHtml("../../model/common/Head.txt","#Com_Head");//引入导航
    CheckBrower();
    function VideoReport(id){
        this.id = id;
    }
    VideoReport.prototype = {
        getGuidingCase:function() {
            $.ajax({
                type: "post",
                url: "/web/student/homework/report/getUserPaperReport",
                data: {'id': this.id},
                dataType: "json",
                success: function (data) {
                    showReport(data);
                }
            });
        },
        getCss : function(){//获取样式
            $.ajax({
                type:"post",
                url:"/web/common/commonStyle",
                dataType:"json",
                success:function(data){
                    console.log(data);
                    if(data.retCode == "0000"){
                        var retData = data.retData;
                        $("head").append(retData);
                    }
                },
                error:function(e){
                    console.log(e)
                }
            })
        }
    };
    function showReport(data){
        if(data.retCode=="0000"){
            var baseInfo = data.retData.baseInfo;
            var previewInfo = data.retData.previewInfo;
            //var resPaperUser = data.retData.resPaperUser;
            $('.Com_Crumbs_in span').html(previewInfo.testTitle);
            $('.r_title').html(previewInfo.testTitle);
            //showQuestions(baseInfo,".r_guiding");
            showQuestions(previewInfo,".r_preview");
            videoReport.getCss();//获取样式
            intMathJax();
        }
    }
    function showQuestions(baseInfo,selector) {
        if(baseInfo == null ||baseInfo.questionList.length == 0){

        }else{
            var questionNum = 0;
            var guideCase = $(selector);
            for(var i = 0 ; i < baseInfo.questionList.length ; i++){
                //var loginId = data.retData.loginId;
                var Dtrue = baseInfo.questionList[i];
                for(var M in Dtrue){
                    if(!Dtrue[M]){
                        Dtrue[M] = "";
                    }
                }
                var optionA = Dtrue.optionA;
                var optionB = Dtrue.optionB;
                var optionC = Dtrue.optionC;
                var optionD = Dtrue.optionD;
                var questionType = Dtrue.questionType;
                var answer = Dtrue.answer;
                var userAnswer = Dtrue.paperUserAnswer.userAnswer;
                var id = Dtrue.id;
                //test_knownsend.attr("loginId",loginId);
                var $quention = $("<div class='questionTitle' myanswer='"+userAnswer+"'   data_answer='"+answer+"' questionType='"+questionType+"' questionId='"+id+"'></div>");
                var $choose = $("<div class='video_choose'></div>").appendTo($quention);
                var $optionA = $("<div class='optionchoose video_optionA' data-option='A'>"+optionA+"</div>").appendTo($choose);
                var $optionB = $("<div class='optionchoose video_optionB' data-option='B'>"+optionB+"</div>").appendTo($choose);
                var $optionC = $("<div class='optionchoose video_optionC' data-option='C'>"+optionC+"</div>").appendTo($choose);
                var $optionD = $("<div class='optionchoose video_optionD' data-option='D'>"+optionD+"</div>").appendTo($choose);
                var $slove = $("<div class='video_solve'></div>").appendTo($choose);
                guideCase.append($quention);
                questionNum++;
                for(var j = 0 ; j < Dtrue.list.length; j++){
                    var lDtrue = Dtrue.list[j];
                    var questionType = lDtrue.questionType;
                    var content = lDtrue.content.replace("【题干】",(questionNum)+"、");
                    if(questionType == "01"){
                        var $content = $("<div class='video_content'>"+content+"<span class='questionanswer'></span></div>").insertBefore($optionA)
                        var $img = $("<span class='quetion_imge'></span>").appendTo($content);
                    }
                    if(questionType == "03"||questionType == "05"){
                        var $content = $("<div class='video_content'>"+content+"<span class='questionanswer'></span></div>").appendTo($slove);
                    }
                }
                var result = Dtrue.paperUserAnswer.result;
                if(result=="0"){
                    var $rightwrong = $("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/right.png'>").appendTo($img);
                }else if(result == null){
                    var $rightwrong = $("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/wrong.png'>").appendTo($img);
                }else{
                    var $rightwrong = $("<img class='wr_img' style='margin-top: 20px;position: absolute;' src='../../../static/image/prepare/wrong.png'>").appendTo($img);
                }
            }
            //变色
            var eachChoose = $(".optionchoose");
            eachChoose.each(function(){
                var myanswer = $(this).closest(".questionTitle").attr("myanswer");
                var userAnswerlength = myanswer.length;
                if(userAnswerlength > 1){
                    for(var i = 0 ; i < userAnswerlength ; i++){
                        var userAnswerknwon = myanswer[i];
                        //console.log(userAnswerknwon)
                        if($(this).attr("data-option") === userAnswerknwon){
                            $(this).addClass("addcolor").css({color:"#49b9df"})
                        }
                    }
                }else{
                    if(myanswer === $(this).attr("data-option")){
                        $(this).css({color:"#49b9df"})
                    }
                }
            });
    }
}
    var videoReport = new VideoReport(Request.id)
    videoReport.getGuidingCase();
});