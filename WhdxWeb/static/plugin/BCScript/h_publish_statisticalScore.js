//Created by Administrator on 2017/3/30.
//总分
function totalScore() {
    var scores = 0;
    $.each($(".question_score"),function (i, obj) {
        scores += Math.abs(parseInt($(obj).attr("data-score")));
    });
    $(".test_score span,.timeing_score").text(scores);
}
//试题行分数统计
function lineScore() {
    //共 + nums + 小题，每小题 + average + 分，共 + total + 分；
    var LinesA = $(".work_txtes ul li[questiontype]");
    var LinesB = $(".work_box ul li[questiontype]");
    if(LinesA.length > 0){
        $.each(LinesA,function (i, obj) {
            var _type = $(obj).attr("questiontype");
            var nums = $(obj).find(".line").children().length + ($($(obj).find(".splite").children()[0]).attr("issplite") == "1" ? $(obj).find(".splite").children().length - 1 : 0);
            var average = isNaN(parseInt($(obj).attr("defaultscore"))) ? isNaN(parseInt($(obj).find(".question_score:first").attr("data-score"))) ? "0" : parseInt($(obj).find(".question_score:first").attr("data-score")) : parseInt($(obj).attr("defaultscore"));
            var total = 0;
            $.each($(obj).find(".question_score"),function (i,obj) {
                total += Math.abs(parseInt($(obj).attr("data-score")));
            });
            // if(_type == "12"){
            //     nums = $(obj).find(".line .splite").children().length;
            // }
            var _html = "（<span class='line_score_nums'>共" + nums + "小题，</span><span class='line_score_average'>每小题<input class='average' type='text' value='" + average +"'>分，</span>" + "<span class='line_score_total'>共" + total + "分</span>）";
            $(obj).find(".line_score").html(_html);
            if(!$(obj).attr("defaultscore")){
                $(obj).attr("defaultscore",average);
            }
            //average
            $(".average").on("keyup",function(){
                var _average = isNaN(parseInt($(this).val())) ? 0 : parseInt($(this).val());
                nums = $(this).parent().parent().parent().parent().find(".line").children().length;
                // if($(this).parent().parent().parent().parent().attr("questiontype") == "12"){
                //     nums = $(this).parent().parent().parent().parent().find(".line .splite").children().length;
                // }
                total = nums * _average;
                $(this).parent().parent().find(".line_score_total").html("共" + total + "分");
                $(this).parent().parent().parent().parent().find(".score_val").val(_average + "分");
                $(this).parent().parent().parent().parent().find(".question_score").attr("data-score",_average);
                $(this).parent().parent().parent().parent().attr("defaultscore",_average + "分");
                $(this).parent().parent().parent().find(".line_score_new").val("（共" + nums + "小题，每小题" + _average + "分，共" + total + "分）");
                totalScore();
                if(_average > 0){
                    $(this).css("color","#666");
                }
            });
            //部分类型不支持average
            if(_type == "01" || _type == "02" || _type == "05" || _type == "09" || _type == "10" || _type == "13" || _type == "14" || _type == "16" || _type == "17"){
                $(obj).find(".score").css("display","none");
                //用户自定义统计
                var _text = "（共" + nums + "小题，每小题" + average + "分，共" + total + "分）";
                $(obj).find(".line_score_new").val(_text);
            }else{
                $(obj).find(".line_score_average").remove();
                //用户自定义统计
                var _text = "（共" + nums + "小题，共" + total + "分）";
                $(obj).find(".line_score_new").val(_text);
            }
        });
    }else if(LinesB.length > 0){
        $.each(LinesB,function (i, obj) {
            var _type = $(obj).attr("questiontype");
            var nums = $(obj).find(".line").children().length + ($($(obj).find(".splite").children()[0]).attr("issplite") == "1" ? $(obj).find(".splite").children().length - 1 : 0);
            var average = isNaN(parseInt($(obj).attr("defaultscore"))) ? isNaN(parseInt($(obj).find(".question_score:first").attr("data-score"))) ? "0" : parseInt($(obj).find(".question_score:first").attr("data-score")) : parseInt($(obj).attr("defaultscore"));
            var total = 0;
            $.each($(obj).find(".question_score"),function (i,obj) {
                total += Math.abs(parseInt($(obj).attr("data-score")));
            });
            // if(_type == "12"){
            //     nums = $(obj).find(".line .splite").children().length;
            // }
            var _html = "（<span class='line_score_nums'>共" + nums + "小题，</span><span class='line_score_total'>共" + total + "分</span>）";//<span class='line_score_average'>每小题" + average +"分，</span>" + "
            if(_type != "999"){
                $(obj).find(".line_score").html(_html);
            }
            //部分类型不支持average
            if(_type == "01" || _type == "02" || _type == "05" || _type == "09" || _type == "10" || _type == "13" || _type == "14" || _type == "16" || _type == "17"){
                $(obj).find(".score").css("display","none");
            }else{
                $(obj).find(".line_score_average").remove();
            }
        });
    }

}
