/********************************************必刷题首页By徐扬**********************************************/
//题目操作
GetWeekData()
function GetWeekData(){
    var SubData={};
    SubData.id=Request.id;
    $.ajax({
        "type": "post",
        "url": "/api/student/homework/report/getUserWeekData",
        "dataType":"json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
               console.log(AllData.subjectWeekDatas)
                CreatSub(AllData.subjectWeekDatas)
                CreatWeekData(AllData.subjectWeekDatas)
            }
        }
    });
}
//创建学科
function CreatSub(data){
    var $Subject='';
    for(var i=0;i<data.length;i++){
        $Subject+='<li class="Com_Nav" data-subjectId="'+data[i].subjectId+'">'+data[i].subjectName+'</li>';
    }
    $Subject+='<li class="Com_NavLine"><img src="../../static/image/report/suico.png" alt=""></li>';
    $('#Com_NavList').html($Subject);
    Opration();
}
//学科操作
function Opration(){
    $('#Com_NavMain').css('width',($('#Com_NavList li').size()-1)*3+'rem');
    $('.Com_Nav').on('click',function(){
        var DownLeft=$(this).position().left;
        $('.Com_NavLine').animate({"left":DownLeft},300);
        var WinHalf=$(window).width()/2;
        var WinW=$(window).width()/2;
        var NavPosition= parseInt($(this).position().left);
        var ScroolLeft;
        if (NavPosition <=WinHalf ) {
            ScroolLeft = 0;
        }
        else {
            ScroolLeft = NavPosition-WinW;
        }
        $('#Com_Box').animate({'scrollLeft':ScroolLeft+"px"},300);
        var Index=$(this).index();
        $(this).css('color','#30A6E5');
        $(this).siblings('li').css('color','');
        $('#r_DataMain>li').eq(Index).css('display','block').siblings().css('display','none');
    });
};
//创建周报
function CreatWeekData(data){
    var $WeekDat='';
    for(var i=0;i<data.length;i++){
        $WeekDat+='<li>';
        $WeekDat+='<ul class="r_AnalyList" id="r_AnalyList">';
        var knowledgeWeekDatas=data[i].knowledgeWeekDatas;
        for(var j=0;j<knowledgeWeekDatas.length;j++){
            $WeekDat+='<li>';
            $WeekDat+='<p class="r_knowledgeName">'+knowledgeWeekDatas[j].knowledgeName+'</p>';
            $WeekDat+='<p class="r_AnalyRight"><span class="fc66">正确率：</span><span class="fc59">'+knowledgeWeekDatas[j].accuracy+'%</span></p>';
            $WeekDat+='<img src="'+Flag(knowledgeWeekDatas[j].accuracy)+'" alt="" class="r_Flag3">';
            $WeekDat+='</li>';
        }
        $WeekDat+='</ul>';
        $WeekDat+='<div class="r_Bottom">';
        $WeekDat+='<p class="r_AnalysisTitlt">本次测试共考察了'+knowledgeWeekDatas.length+'个知识点，其中：</p>';
        $WeekDat+='<div class="r_DataResult">';
        $WeekDat+=Desc(data[i].accuracy,data[i].knowledgeDesc);
        $WeekDat+=CoverStatus();
        $WeekDat+='</div>';
        $WeekDat+='</li>';
    }
    $('#r_DataMain').html($WeekDat);
    GoCover()
}
//随机标语
function Flag(correctRate){
    var result='';
    if(correctRate>=0&&correctRate<40){
        result='../../static/image/report/s'+Math.floor(Math.random()*3+400)+'.png';
    }else if(correctRate>=40&&correctRate<60){
        result='../../static/image/report/s'+Math.floor(Math.random()*2+600)+'.png';
    }else if(correctRate>=60&&correctRate<80){
        result='../../static/image/report/s'+Math.floor(Math.random()*6+800)+'.png';
    }else if(correctRate>=80&&correctRate<90){
        result='../../static/image/report/s'+Math.floor(Math.random()*4+900)+'.png';
    }else if(correctRate>=90&&correctRate<=100){
        result='../../static/image/report/s'+Math.floor(Math.random()*5+1000)+'.png';
    }
    return result;
};
//总结
function Desc(accuracy,knowledgeDesc){
    var result='';
    if(accuracy<90){
        result+='<div class="r_Desc">';
        result+='<img src="../../static/image/report/r_dic1.png" alt="">';
        result+='<p class="fcff">'+knowledgeDesc+'</p>';
        result+='<img src="../../static/image/report/r_dic0.png" alt="">';
        result+='</div>';
    }else {
        result+='<div class="r_Desc">';
        result+='<p>'+knowledgeDesc+'</p>';
        result+='</div>';
    }
    return result;
};
//补偿训练按钮
function CoverBtn(data){
    var Result='';
    if(data.status==-1){
        Result='';
    }else if(data.status==0){
        Result='<p data-status="'+data.status+'" class="r_CoverBtn CreatCover">补偿训练</p>';
    }
    else if(data.status==1){
        Result='<p data-status="'+data.status+'" class="r_CoverBtn GoCover">补偿训练</p><p class="LineT">已购买</p>';
    }
    else if(data.status==2){
        Result='<p data-status="'+data.status+'" class="r_CoverBtn">补偿训练</p><p class="LineT">提交</p>';
    }
    else {
        Result='<p data-status="'+data.status+'" class="r_CoverBtn">补偿训练</p><p class="LineT">批改</p>';
    }
    return Result;
}
$('.r_CoverBtn').on('click',function(){
    javascript:bc.CreatCover($(this).attr('data-status'));
})
//补偿按钮状态
function CoverStatus(){
    var SubData={};
    SubData.uuid=Request.uuid;
    SubData.id=Request.id;
    var Result='';
    $.ajax({
        "type": "post",
        "url": "/api/student/compensation/checkTestCompensation",
        "dataType":"json",
        "data": SubData,
        "async": false,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                console.log(AllData)
                Result=CoverBtn(AllData);
            }
        }
    });
    return Result;
};
//已经购买
function GoCover(){
   $('.GoCover').on('click',function(){
       javascript:bc.GoCover();
   }) ;
   $('.CreatCover').on('click',function(){
        javascript:bc.CreatCover();
   });
}

