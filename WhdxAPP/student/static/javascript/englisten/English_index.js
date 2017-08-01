/**
 * Created by lgr on 2017/5/4.
 */
//获取题目
GetQuestion();
function GetQuestion(){
    var SubData={};
    SubData.id=Request.id;
    $.ajax({
        "type": "post",
        "url": "/api/student/homework/report/getUserPaperReport",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                var paperName = AllData.paper.paperName;
                $("title").text(paperName);
                var r_Rnumber = $(".r_Rnumber");
                var type = AllData.type;
                r_Rnumber.attr("type",type);
                SelectOption(AllData.paper.questionLines);//选择题
                JustWrong()
                //数据分析
                Analysis();
            }
        }
    });
};
//创建题号
function SelectOption(AllData){
    var $Select='';
    var Index=0;
    for(var j=0;j<AllData.length;j++){
        var scoreDef = AllData[j].scoreDef;
	    var lineName = AllData[j].lineName.replace("默认题行","");
        if(scoreDef!=null&&scoreDef!=""){
            $Select+='<p class="r_OptionTitle">'+lineName+scoreDef+'</p>';
        }else{
            $Select+='<p class="r_OptionTitle">'+lineName+'</p>';
        }
        $Select+='<ul class="r_OptionList">';
        for(var i=0;i<AllData[j].questionGroup.length;i++){
            var data=AllData[j].questionGroup[i];
            var groupCode = data.groupCode;
            var result = data.result;
            var isSplite = data.isSplite;
            if(groupCode && isSplite == "0"){//题号不可拆分
                Index++;
                var num1 = 0;
                //for(var k = 0 ; k < data.questions.length ; k++){
                var qDtrue = data.questions[k];
                $Select+=OptionClolor(result,Index);
                num1++;
                //}
            }else if(groupCode && isSplite == "1"){//组合题可拆分
                for(var k = 0 ; k < data.questions.length ; k++){
                    var qDtrue = data.questions[k];
                    var result=qDtrue.paperUserAnswer.result;
                    Index++;
                    $Select+=OptionClolor(result,Index);
                }
            }else{
                Index++;
                for(var k = 0 ; k < data.questions.length ; k++){//普通题
                    var qDtrue = data.questions[k];
                    var result=qDtrue.paperUserAnswer.result;
                    var selectable=qDtrue.selectable;
                    if(selectable==1){
                        $Select+=OptionClolor(result,Index);
                    }
                    else {
                        $Select+=OptionClolor(result,Index);
                    }
                }
            }
        }
        $Select+='</ul>';
    }
    $('#Main').html($Select);
};
//选项颜色
function OptionClolor(Result,Index){
    var $Select='';
    if(Result==1){
        $Select+='<li class="Com_Nav r_OptionWrong">'+Index+'</li>';
    }else if(Result==0){
        $Select+='<li class="Com_Nav r_OptionRight">'+Index+'</li>';
    }else if(Result==2){
        $Select+='<li class="Com_Nav r_OptionHalf">'+Index+'</li>';
    }else {
        $Select+='<li class="Com_Nav r_OptionNo">'+Index+'</li>';
    }
    return $Select;
}
//只看错题
function JustWrong(){
    $('.Com_Nav').on('click',function(){
        var index=$(this).html()-1;
        if($('#r_LookWrong0').hasClass('just')){
            window.location.href='englisten_sub.html?LookWrong='+true+'&id='+Request.id+'&index='+index;
        }else {
            window.location.href='englisten_sub.html?LookWrong='+false+'&id='+Request.id+'&index='+index;
        }
    });
};






