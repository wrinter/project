/********************************************徐扬******************************************************/
/********************************************作业报告******************************************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
SystemRedMsg();
$('#w_StudentPro').hover(function(){
    $('#w_UnDoneMain').stop(true).fadeIn(100);
},function(){

})
$('#w_UnDoneMain').hover(function(){

},function(){
    $('#w_UnDoneMain').stop(true).fadeOut(100);
})
//阅读详情
function GetReadReport(){
    var SubData={};
    SubData.paperAssignId=Request.paperAssignId;
    $.ajax({
        "type": "post",
        "url": "/web/teacher/paper/report/articleReport",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                GetUnDone(AllData);
                CreatHomeWorkListHtml(AllData);
            }
        }
    });
};
GetReadReport();
function GetUnDone(data){
    $('#w_ArtName').html(data.name);
    var IsUnDoneNUm='';
     IsUnDoneNUm+='<span class="fcCA" id="">'+data.teliver+'</span>';
     IsUnDoneNUm+='<span>/</span>';
     IsUnDoneNUm+='<span id="">'+data.total+'</span>';
    $('#w_ReportNum').html(IsUnDoneNUm);
    var $UnDoneHTml='';
    if(data.unpaidNameList==null){

    }
    else {
        var Pro=parseInt(data.teliver)/parseInt(data.total)*100+'%';
        $('#w_SProgress').css('width',Pro);
        if(parseInt(data.teliver)==parseInt(data.total)){
            $('#w_UnDoneTitle').html('全部提交')
        }else {
            $('#w_UnDoneTitle').html('未完成')
        }
        for(var i=0;i<data.unpaidNameList.length;i++){
            $UnDoneHTml+='<li>'+data.unpaidNameList[i]+'</li>';
        }
        $('#w_UnDoneList').html($UnDoneHTml);
    }
};
function CreatHomeWorkListHtml(data){
    var userReportList=data.userReportList;
    var StudentReport='';
    if(data.userReportList==null){
        var $Undeon='';
        $Undeon+='<div class="NoData">';
        $Undeon+='<img src="../../static/image/kola/no.png" alt="" class="NoDataImg">';
        $Undeon+='</div>';
        $('.w_ReadMain').html($Undeon);
    }
    else {
        for(var i=0;i<userReportList.length;i++){
            StudentReport+='<li>';
            if(userReportList[i].date!=null){
                StudentReport+='<p>'+userReportList[i].date+'</p>';
            }
            else {
                StudentReport+='<p>— —</p>';
            }
            StudentReport+='<p>'+userReportList[i].userName+'</p>';
            StudentReport+='<p>'+ToComTime(userReportList[i].useTime)+'</p>';
            StudentReport+='</li>';
        }
        $('#w_StudentReport').html(StudentReport);
    }

}
