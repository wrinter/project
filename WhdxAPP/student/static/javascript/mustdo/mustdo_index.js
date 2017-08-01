/********************************************必刷题首页By徐扬**********************************************/
//用户操作
UserOpration();
function UserOpration(){
    setInterval(function(){
        var MainH=$(window).height()-160;
        if(MainH<600){
            MainH=600;
        }
        $('#mu_Main').height(MainH);
        $('#mu_Lous').height($('#mu_Main').height());
        for(var i=0;i<$('#mu_SubMain>li').length;i++){
            $('#mu_SubMain>li').eq(i).height($('#mu_SubMain>li').eq(i).width());
        }
    },1);
    $('#BackUp').on('click',function(){
        javascript:bc.back();
    })
}
//获取用户学科
GetUserSub();
function GetUserSub(){
    var SubData={};
    SubData.uuid=Request.uuid;
    $.ajax({
        "type": "post",
        "url": "/api/student/center/getSubjectList",
        "dataType": "json",
        "data": SubData,
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
        $Subject+='<li class="mu_Sub'+data[i].subjectId+'" data-subjectId="'+data[i].subjectId+'"></li>';
    }
    $('#mu_SubMain').html($Subject);
    $('#mu_SubMain li').on('click',function(){
        window.location.href='mustdo_vis.html?subjectId='+$(this).attr('data-subjectId')+'&uuid='+Request.uuid;
    });
};








