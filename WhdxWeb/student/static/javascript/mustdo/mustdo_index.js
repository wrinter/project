/********************************************必刷题首页By徐扬**********************************************/
//获取头部导航
GetHtml("../../model/common/Head.txt","#Com_Head");
CheckBrower();
//用户操作
UserOpration();
function UserOpration(){
    setInterval(function(){
        var MainH=$(window).height()-120;
        if(MainH<600){
            MainH=600;
        }
        $('#mu_Main').height(MainH);
        $('#mu_Lous').height($('#mu_Main').height());
        for(var i=0;i<$('#mu_SubMain>li').length;i++){
            $('#mu_SubMain>li').eq(i).height($('#mu_SubMain>li').eq(i).width());
        }
    },1)
}
//获取用户学科
GetUserSub();
function GetUserSub(){
    $.ajax({
        "type": "post",
        "url": "/web/student/center/getSubjectList",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatSubject(AllData)
            }
        }
    });
};
function CreatSubject(data){
    var $Subject='';
    for(var i=0;i<data.length;i++){
        $Subject+='<li class="mu_Sub'+data[i].value+'" data-name="'+data[i].label+'" data-subjectId="'+data[i].value+'"></li>';
    }
    $('#mu_SubMain').html($Subject);
    $('#mu_SubMain li').on('click',function(){
        var subId = $(this).attr("data-subjectId");
        window.location.href='must_DoGraph.html?subjectId='+$(this).attr('data-subjectId')+'&subjectname='+$(this).attr('data-name');
    });
}








