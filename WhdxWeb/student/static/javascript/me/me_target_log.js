/********************************************个人中心班级目标记录By徐扬**********************************************/
//获取头部导航
GetHtml("../../model/common/Head.txt","#Com_Head");
CheckBrower();
//用户常用操作
UserOpration();
function UserOpration(){
    $('#GoTarget').on('click',function(){
        window.location.href='me_target.html?classId='+store.get('targetclassid');
    });
};
//获取PK对手信息列表
PkUserInfoList();
function PkUserInfoList(){
    $.ajax({
        "type": "post",
        "url": "/web/student/center/pkUserInfoList",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatePkUser(AllData);
                NoData();
            }
        }
    });
};
//创建用户信息
function CreatePkUser(data){
    var $UserLog='';
    //赢标志
    var IsWin0='<i class="meimg m_pkico1 m_pkresult0"></i><i class="meimg m_winico1"></i>';//用户
    var IsWin1='<i class="meimg m_pkico1 m_pkresult1"></i><i class="meimg m_winico1"></i>';//Pk 对手
    //平标志
    var IsSam0='<i class="meimg m_pkico0 m_pkresult0"></i><i class="meimg m_winico1"></i>';//用户
    var IsSam1='<i class="meimg m_pkico0 m_pkresult1"></i><i class="meimg m_winico1"></i>';//Pk 对手
    if(data.length>0){
        for(var i=0;i<data.length;i++){
            $UserLog+='<div class="m_LogBox" id="m_LogBox" data-result="1">';
            <!--用户头像顶部-->
            $UserLog+='<div class="m_LogUser">';
            <!--用户头像盒子-->
            $UserLog+='<div class="m_UserCon">';
            //用户
            $UserLog+='<div class="m_PkPhotoBox">';
            <!--胜负记录-->
            //用户赢
            if(data[i].pkResult==0||data[i].pkResult=='0'){
                $UserLog+=IsWin0;
            }
            //平
            else if(data[i].pkResult==2||data[i].pkResult=='2'){
                $UserLog+=IsSam0;
            }
            //用户头像
            if(data[i].studentInfoRes.headImg==null||data[i].studentInfoRes.headImg==''){
                $UserLog+='<p class="m_PkPhoto"><img src="../../static/image/common/user.png" alt=""></p>';
            }else {
                $UserLog+='<p class="m_PkPhoto"><img src="'+data[i].studentInfoRes.headImg+'" alt=""></p>';
            }
            $UserLog+='</div>';
            //VS标识
            $UserLog+='<div class="m_VsImgBox">';
            $UserLog+='<img src="../../static/image/me/m_vsico.png" alt="" class="m_VsIco">';
            $UserLog+='<p>'+data[i].pkScore+'</p>';
            $UserLog+='</div>';
            //PK对手
            $UserLog+='<div class="m_PkPhotoBox">';
            <!--胜负记录-->
            //PK对手赢
            if(data[i].pkResult==1||data[i].pkResult=='1'){
                $UserLog+=IsWin1;
            }
            //平
            else if(data[i].pkResult==2||data[i].pkResult=='2'){
                $UserLog+=IsSam1;
            }
            //PK对手头像
            if(data[i].pkUserInfoRes.headImg==null||data[i].pkUserInfoRes.headImg==''){
                $UserLog+='<p class="m_PkPhoto"><img src="../../static/image/common/user.png" alt=""></p>';
            }else {
                $UserLog+='<p class="m_PkPhoto"><img src="'+data[i].pkUserInfoRes.headImg+'" alt=""></p>';
            }
            $UserLog+='</div>';
            $UserLog+='<div style="clear:both;"></div>';
            $UserLog+='</div>';
            $UserLog+='<i class="meimg m_pkdico0 m_LogDownBtn" data-UserName="'+data[i].studentInfoRes.userName+'" data-id="'+data[i].pkUserInfoRes.id+'" data-PkUserName="'+data[i].pkUserInfoRes.userName+'"></i>';
            $UserLog+='</div>';
            $UserLog+='</div>';
        }
    }
    else {
        $UserLog='<div class="m_LogBox" id="m_LogBox" data-result="0"><p class="m_NoLog">暂无对手~</p></div>';
    }
    $('#m_LogMain').html($UserLog);
    GetPrePkLogInfo();
    PreLogDefult();//默认显示
};
//下拉显示记录
function GetPrePkLogInfo(){
    $('.m_LogDownBtn').on('click',function(){
        var id=$(this).attr('data-id');
        var PkUserName=$(this).attr('data-PkUserName');
        if($(this).hasClass('m_pkdico0')){
            var $m_SlideLog=PrePkLogInfo(id,PkUserName);
            $(this).removeClass('m_pkdico0').addClass('m_pkdico1');
            $(this).parents('.m_LogBox').find('.m_SlideLog').remove();
            $(this).parents('.m_LogBox').siblings('.m_LogBox').find('.m_SlideLog').remove();
            $(this).parents('.m_LogBox').siblings('.m_LogBox').find('.m_LogDownBtn').removeClass('m_pkdico1').addClass('m_pkdico0');
            $(this).parents('.m_LogBox').append($m_SlideLog);
            $('.m_SlideLog').slideDown(150);
        }else {
            $(this).removeClass('m_pkdico1').addClass('m_pkdico0');
            $('.m_SlideLog').slideUp(150,function(){
                $(this).parents('.m_LogBox').find('.m_SlideLog').remove();
            });
            $(this).parents('.m_LogBox').siblings('.m_LogBox').find('.m_SlideLog').remove();

        }
    })
};
//默认显示第一个
function PreLogDefult(){
    $('.m_LogBox').eq(0).find('.m_LogDownBtn').removeClass('m_pkdico0').addClass('m_pkdico1');
    var id=$('.m_LogBox').eq(0).find('.m_LogDownBtn').attr('data-id');
    var PkUserName=$('.m_LogBox').eq(0).find('.m_LogDownBtn').attr('data-PkUserName');
    var $m_SlideLog=PrePkLogInfo(id,PkUserName);
    $('.m_LogBox').eq(0).append($m_SlideLog);
    $('.m_SlideLog').css('display','block');
}
//获取PK历史记录
function PrePkLogInfo(id,PkUserName){
    var SubData={};
    SubData.id=id;
    var str='';
    $.ajax({
        "type": "post",
        "url": "/web/student/center/prePkLogInfo",
        "dataType": "json",
        "data": SubData,
        "async":false,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                str= CreatePrePkLogInfo(AllData,PkUserName);
            }
        }
    });
    return str;
};
//创建历史记录
function CreatePrePkLogInfo(data,PkUserName){
    var $PreLogInfo='';
    $PreLogInfo+='<div class="m_SlideLog">';
    $PreLogInfo+='<ul class="m_PkLogHead">';
    $PreLogInfo+='<li>时间</li>';
    $PreLogInfo+='<li>我</li>';
    $PreLogInfo+='<li>挑战内容</li>';
    if(PkUserName!=undefined&&PkUserName!=null&&PkUserName!=''){
        $PreLogInfo+='<li>'+PkUserName+'</li>';
    }else {
        $PreLogInfo+='<li>暂无对手</li>';
    }
    $PreLogInfo+='</ul>';
    if(data.length>0){
        $PreLogInfo+='<ul class="m_PkLogList" id="m_PkLogList" data-result="1">';
        for(var i=0;i<data.length;i++){
            //PK记录
            $PreLogInfo+='<li>';
            $PreLogInfo+='<p>'+data[i].finishTime+'</p>';
            //用户赢
            if(data[i].isWin=='0'||data[i].isWin==0){
                $PreLogInfo+='<p><span>'+data[i].score+'/'+data[i].totalScore+'</span><i class="meimg m_winico0"></i></p>';
            }
            //PK对手平
            else if(data[i].isWin=='2'||data[i].isWin==2){
                $PreLogInfo+='<p><span>'+data[i].score+'/'+data[i].totalScore+'</span><i class="meimg m_winico0"></i></p>';
            }
            else {
                $PreLogInfo+='<p>'+data[i].score+'/'+data[i].totalScore+'</p>';
            }
            $PreLogInfo+='<p>'+data[i].paperName+'</p>';
            //PK对手赢
            if(data[i].isWin=='1'||data[i].isWin==1){
                $PreLogInfo+='<p><span>'+data[i].pkScore+'/'+data[i].totalScore+'</span><i class="meimg m_winico0"></i></p>';
            }
            //平
            else if(data[i].isWin=='2'||data[i].isWin==2){
                $PreLogInfo+='<p><span>'+data[i].pkScore+'/'+data[i].totalScore+'</span><i class="meimg m_winico0"></i></p>';
            }else {
                $PreLogInfo+='<p>'+data[i].pkScore+'/'+data[i].totalScore+'</p>';
            }
            $PreLogInfo+='</li>';
        }
        $PreLogInfo+='</ul>';
    }else {
        $PreLogInfo+='<ul class="m_PkLogList" id="m_PkLogList" data-result="0"></ul>';
        $PreLogInfo+='<p class="m_NoPreLog">暂无记录~</p>';
    }
    $PreLogInfo+='</div>';
    return $PreLogInfo;
};
//暂无记录
function NoData(){
    var m_PkLogList=$('#m_PkLogList').attr('data-result');
    var m_LogBox=$('#m_LogBox').attr('data-result');
    if(m_PkLogList=='0'&&m_LogBox=='0'){
        $('#m_LogMain').html('<p class="m_NoPreLogMain">暂无记录~</p>');
    }
}




